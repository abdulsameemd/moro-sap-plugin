#!/usr/bin/env node
/**
 * pre-lint-gate.js
 * ─────────────────────────────────────────────────────────────────
 * DEWA ADK Hook — Layer 3 · PreToolUse
 * ─────────────────────────────────────────────────────────────────
 * Fires BEFORE Claude writes any file to webapp/ folder.
 * Runs run_ui5_linter on the target file.
 * BLOCKS the write if linter finds errors.
 *
 * Trigger:   PreToolUse — tool name matches "write_file" or "create_file"
 * Scope:     Files inside webapp/ only
 * Behaviour: Deterministic — not AI. Block = hard block.
 *
 * ADK hook contract:
 *   Input:  JSON via stdin { tool_name, tool_input: { path, content } }
 *   Output: exit 0 = allow · exit 1 = block (stderr shown to Claude)
 */

'use strict';

const { log, PROJECT_ROOT } = require('./lib/logger');
const { execSync }          = require('child_process');
const path                  = require('path');
const fs                    = require('fs');

const HOOK_NAME = 'pre-lint-gate';

async function main() {
  // Read hook input from stdin
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;

  let hookData;
  try {
    hookData = JSON.parse(input);
  } catch {
    // Not JSON or empty — allow through
    process.exit(0);
  }

  const toolName  = hookData.tool_name || '';
  const toolInput = hookData.tool_input || {};
  const filePath  = toolInput.path || toolInput.file_path || '';

  // Only intercept file write tools
  const isWriteTool = ['write_file', 'create_file', 'str_replace_based_edit_tool']
    .includes(toolName);

  if (!isWriteTool) process.exit(0);

  // Only lint webapp/ files
  const absPath = path.resolve(PROJECT_ROOT, filePath);
  if (!absPath.includes('webapp')) process.exit(0);

  // Only lint UI5-relevant files
  const ext = path.extname(filePath).toLowerCase();
  if (!['.js', '.ts', '.xml', '.json'].includes(ext)) process.exit(0);

  log('INFO', HOOK_NAME, `PreToolUse intercepted write to: ${filePath}`);

  // Write content to temp file for linting
  const tmpPath = path.join(PROJECT_ROOT, '.lint-tmp' + ext);
  try {
    fs.writeFileSync(tmpPath, toolInput.content || toolInput.new_str || '');

    // Run run_ui5_linter via SAPUI5 MCP
    const lintResult = execSync(
      `claude mcp call sapui5-mcp run_ui5_linter --file "${tmpPath}"`,
      { encoding: 'utf8', timeout: 30000 }
    );

    const parsed = JSON.parse(lintResult);
    const errors = (parsed.errors || []).filter(e => e.severity === 'error');

    if (errors.length > 0) {
      // BLOCK the write
      const errList = errors.map(e => `  Line ${e.line}: ${e.message}`).join('\n');
      process.stderr.write(
        `\n🛑 [DEWA Lint Gate] BLOCKED — ${errors.length} error(s) in ${filePath}:\n${errList}\n` +
        `\nFix all errors before writing this file. Framework rule: zero errors required.\n` +
        `Reference: GUARDRAILS.md §1–§4\n`
      );
      log('BLOCK', HOOK_NAME, `Write BLOCKED — ${errors.length} lint error(s) in ${filePath}`);
      process.exit(1); // Block
    }

    log('PASS', HOOK_NAME, `Lint passed for ${filePath} — write allowed`);
    process.exit(0); // Allow

  } catch (e) {
    // Linter unavailable — warn but allow (don't block if MCP is down)
    log('WARN', HOOK_NAME, `Linter unavailable: ${e.message} — write allowed with warning`);
    process.stderr.write(
      `⚠️  [DEWA Lint Gate] Linter unavailable — write allowed but run lint manually.\n`
    );
    process.exit(0);
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

main().catch(e => {
  log('WARN', HOOK_NAME, `Hook error: ${e.message} — write allowed`);
  process.exit(0); // Never block on hook error
});

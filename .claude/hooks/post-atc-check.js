#!/usr/bin/env node
/**
 * post-atc-check.js
 * ─────────────────────────────────────────────────────────────────
 * DEWA ADK Hook — Layer 3 · PostToolUse
 * ─────────────────────────────────────────────────────────────────
 * Fires AFTER Claude writes ABAP source to SAP via writeObjectSource.
 * Runs syntaxCheck + runAtcCheck on the written object.
 * If violations found → writes REVERT instruction to stdout for Claude.
 *
 * Trigger:   PostToolUse — tool name matches "writeObjectSource"
 * Scope:     All ABAP objects written via abap-mcp-server
 * Behaviour: Deterministic — not AI.
 *
 * ADK hook contract:
 *   Input:  JSON via stdin { tool_name, tool_input, tool_result }
 *   Output: exit 0 always (PostToolUse cannot block — it reports)
 *           stdout message is shown to Claude as context
 */

'use strict';

const { log }               = require('./lib/logger');
const { syntaxCheck, runAtcCheck } = require('./lib/sap-mcp');
const { autoCommit }        = require('./lib/git-helper');

const HOOK_NAME = 'post-atc-check';

// SEC violations that must never be ignored
const SEC_CRITICAL_PATTERNS = [
  /AUTHORITY-CHECK.*DUMMY/i,
  /sy-uname\s*=\s*['"][A-Z]+['"]/i,
  /SELECT\s+\*\s+FROM\s+usr0[12]/i,
];

async function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;

  let hookData;
  try { hookData = JSON.parse(input); } catch { process.exit(0); }

  const toolName  = hookData.tool_name || '';
  const toolInput = hookData.tool_input || {};
  const toolResult = hookData.tool_result || {};

  // Only intercept writeObjectSource
  if (toolName !== 'writeObjectSource') process.exit(0);

  const adtUri    = toolInput.adtUri || toolInput.uri || '';
  const objName   = toolInput.objectName || adtUri.split('/').pop() || 'unknown';
  const source    = toolInput.source || toolInput.content || '';

  log('INFO', HOOK_NAME, `PostToolUse: ATC check on ${objName}`);

  // ── 1. Syntax check ──────────────────────────────────────────────
  const syntax = syntaxCheck(adtUri);
  if (!syntax.passed) {
    const errList = syntax.errors.join('\n  ');
    console.log(
      `\n🛑 [DEWA ATC Gate] SYNTAX ERRORS in ${objName}:\n  ${errList}\n` +
      `\nACTION REQUIRED: Revert ${objName} immediately.\n` +
      `Run: abap-mcp-server:writeObjectSource with the previous working version.\n` +
      `Do NOT proceed to the next artefact until syntax errors are resolved.\n`
    );
    log('BLOCK', HOOK_NAME, `Syntax FAILED on ${objName} — revert instruction sent`);
    process.exit(0);
  }
  log('PASS', HOOK_NAME, `Syntax passed: ${objName}`);

  // ── 2. ATC check ─────────────────────────────────────────────────
  const atc = runAtcCheck(adtUri);
  if (!atc.passed) {
    const criticalViolations = atc.violations.filter(v =>
      v.priority === 1 || v.checkVariant === 'DEWA'
    );
    const violList = atc.violations
      .map(v => `  [${v.priority || '?'}] ${v.checkId}: ${v.description}`)
      .join('\n');

    console.log(
      `\n⚠️  [DEWA ATC Gate] VIOLATIONS in ${objName} (${atc.violations.length} found):\n${violList}\n` +
      `\nACTION REQUIRED:\n` +
      `- Auto-fix safe patterns (PERF-01–07, STY-01–10, STY-12–13)\n` +
      `- Flag PERF-08 and STY-11 for developer decision\n` +
      `- Re-run writeObjectSource after fixes\n` +
      `- ATC must return 0 violations before proceeding\n`
    );
    log('WARN', HOOK_NAME, `ATC: ${atc.violations.length} violation(s) on ${objName}`);
    process.exit(0);
  }
  log('PASS', HOOK_NAME, `ATC passed: ${objName} — 0 violations`);

  // ── 3. SEC pattern scan (deterministic — no MCP needed) ───────────
  const secViolations = [];
  SEC_CRITICAL_PATTERNS.forEach((pattern, i) => {
    if (pattern.test(source)) {
      secViolations.push(`SEC-0${i + 4}: ${pattern.source}`);
    }
  });

  if (secViolations.length > 0) {
    console.log(
      `\n🚨 [DEWA Security Gate] CRITICAL security violation in ${objName}:\n` +
      secViolations.map(v => `  ${v}`).join('\n') + '\n' +
      `\nACTION REQUIRED: Do NOT release this transport.\n` +
      `Notify Red Team immediately. Fix before any QAS import.\n` +
      `Reference: security/SECURITY-Red-Team.md\n`
    );
    log('BLOCK', HOOK_NAME, `SEC CRITICAL violation in ${objName} — Red Team notified`);
  }

  // ── 4. Auto-commit if Stage 5 complete (all 14 artefacts written) ─
  // Detect by checking if this is artefact 14 (service binding)
  if (objName.includes('_O4') || objName.includes('_SB_')) {
    autoCommit(5, objName.split('_')[1] || 'App');
  }

  process.exit(0);
}

main().catch(e => {
  log('WARN', HOOK_NAME, `Hook error: ${e.message}`);
  process.exit(0);
});

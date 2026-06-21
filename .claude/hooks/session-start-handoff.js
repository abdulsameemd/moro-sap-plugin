#!/usr/bin/env node
/**
 * session-start-handoff.js
 * ─────────────────────────────────────────────────────────────────
 * DEWA ADK Hook — Layer 3 · SessionStart
 * ─────────────────────────────────────────────────────────────────
 * Fires when a Claude Code session opens in /dewa-project/.
 * Checks for:
 *   1. Pending handoff — zip extracted to /docs/handoff/
 *   2. Pending Red Team review notification
 *   3. Pending Team Lead trigger file
 *   4. Git branch — warns if on main
 *
 * Output: Context message injected into Claude's session start.
 *
 * ADK hook contract:
 *   Input:  JSON via stdin { session_id, working_directory }
 *   Output: stdout message shown to Claude at session start
 *           exit 0 always
 */

'use strict';

const { log, PROJECT_ROOT } = require('./lib/logger');
const { checkBranch }       = require('./lib/git-helper');
const fs   = require('fs');
const path = require('path');

const HOOK_NAME = 'session-start-handoff';

const HANDOFF_DIR    = path.join(PROJECT_ROOT, 'docs', 'handoff');
const TL_TRIGGER     = path.join(PROJECT_ROOT, 'docs', 'teamlead_notification_trigger.txt');
const SKILL_SPECS    = path.join(PROJECT_ROOT, 'SKILL_SPECIFICATIONS.md');
const SECURITY_FILE  = path.join(PROJECT_ROOT, 'security', 'SECURITY-Red-Team.md');

async function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;

  const messages = [];
  log('INFO', HOOK_NAME, 'Session starting — running DEWA context checks');

  // ── 1. Check for pending handoff ─────────────────────────────────
  const hasHandoff = fs.existsSync(HANDOFF_DIR) &&
    fs.readdirSync(HANDOFF_DIR).length > 0;

  if (hasHandoff) {
    // Find app name from prototype HTML title tag
    let appName = 'Unknown App';
    try {
      const htmlFiles = fs.readdirSync(path.join(HANDOFF_DIR, 'project') || HANDOFF_DIR)
        .filter(f => f.endsWith('.html'));
      if (htmlFiles.length > 0) {
        const html = fs.readFileSync(
          path.join(HANDOFF_DIR, htmlFiles[0]), 'utf8');
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) appName = titleMatch[1].trim();
      }
    } catch {}

    messages.push(
      `📦 HANDOFF DETECTED: "${appName}" prototype is ready in /docs/handoff/\n` +
      `   Action: Read CLAUDE.md, DESIGN.md, GUARDRAILS.md then begin Stage 3 scaffold.\n` +
      `   Namespace: com.dewa.${appName.toLowerCase().replace(/\s+/g, '')}\n` +
      `   Type CONFIRM to begin.`
    );
    log('INFO', HOOK_NAME, `Handoff detected: ${appName}`);
  }

  // ── 2. Check for pending TL trigger ──────────────────────────────
  if (fs.existsSync(TL_TRIGGER)) {
    messages.push(
      `📧 TEAM LEAD NOTIFICATION PENDING: /docs/teamlead_notification_trigger.txt exists.\n` +
      `   The watch script will build the Outlook email automatically.\n` +
      `   Ensure dewa-handoff-watch.js is running.`
    );
    log('INFO', HOOK_NAME, 'TL notification trigger detected');
  }

  // ── 3. Git branch check ───────────────────────────────────────────
  const { onFeatureBranch, branch } = checkBranch();
  if (!onFeatureBranch && branch !== 'unknown') {
    messages.push(
      `⚠️  GIT WARNING: You are on branch "${branch}" — not a feature branch.\n` +
      `   Run: git checkout -b feature/[AppName] before generating any code.\n` +
      `   Reference: DEPLOY.md §5.2`
    );
    log('WARN', HOOK_NAME, `On branch "${branch}" — not a feature branch`);
  } else if (onFeatureBranch) {
    log('PASS', HOOK_NAME, `On feature branch: ${branch}`);
  }

  // ── 4. Remind Claude of key files to read ────────────────────────
  messages.push(
    `📋 DEWA FRAMEWORK v1.7 — Session ready.\n` +
    `   Read at session start: CLAUDE.md · DESIGN.md · GUARDRAILS.md · SAP_CLEAN_CORE.md\n` +
    `   Security rules: security/SECURITY-Red-Team.md (SEC-01–SEC-06)\n` +
    `   Skills loaded: .claude/skills/dewa-fiori-design · .claude/skills/moro-code-review\n` +
    `   Hooks active: pre-lint-gate · post-atc-check · stop-confirm-review · stop-approve-transport`
  );

  // Output all messages to Claude
  if (messages.length > 0) {
    console.log('\n' + '─'.repeat(60));
    console.log('🔵 DEWA ADK SessionStart Hook');
    console.log('─'.repeat(60));
    messages.forEach(m => console.log('\n' + m));
    console.log('\n' + '─'.repeat(60) + '\n');
  }

  log('PASS', HOOK_NAME, 'Session start complete');
  process.exit(0);
}

main().catch(e => {
  log('WARN', HOOK_NAME, `Hook error: ${e.message}`);
  process.exit(0);
});

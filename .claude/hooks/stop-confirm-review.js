#!/usr/bin/env node
/**
 * stop-confirm-review.js
 * ─────────────────────────────────────────────────────────────────
 * DEWA ADK Hook — Layer 3 · Stop
 * ─────────────────────────────────────────────────────────────────
 * Fires when Claude is about to stop/complete its response.
 * Checks if CONFIRM REVIEW has been received before allowing
 * TS generation to proceed.
 *
 * This makes CONFIRM REVIEW a HARD GATE enforced by code —
 * not just by Claude following instructions.
 *
 * Trigger:   Stop — Claude completing a response at Stage 7
 * Scope:     Only active after code review is complete
 * Behaviour: Deterministic — not AI.
 *
 * ADK hook contract:
 *   Input:  JSON via stdin { stop_reason, session_id }
 *   Output: exit 0 = allow stop
 *           exit 1 = block stop (stderr shown to Claude)
 */

'use strict';

const { log, PROJECT_ROOT } = require('./lib/logger');
const { autoCommit }        = require('./lib/git-helper');
const fs   = require('fs');
const path = require('path');

const HOOK_NAME = 'stop-confirm-review';

const REVIEW_REPORT    = path.join(PROJECT_ROOT, 'docs', 'review_report.md');
const CONFIRM_FLAG     = path.join(PROJECT_ROOT, 'docs', '.confirm_review_received');
const TS_EXISTS_GLOB   = path.join(PROJECT_ROOT, 'docs');

async function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;

  let hookData;
  try { hookData = JSON.parse(input); } catch { process.exit(0); }

  const stopReason = hookData.stop_reason || '';
  const transcript = hookData.transcript  || [];

  // Only check if review report exists (means we are at/past Stage 7)
  if (!fs.existsSync(REVIEW_REPORT)) {
    process.exit(0); // Not at review stage yet — allow stop
  }

  // Check if a TS document already exists (means CONFIRM was already received)
  const tsDocs = fs.readdirSync(TS_EXISTS_GLOB)
    .filter(f => f.match(/_TS_\d{8}\.md$/));
  if (tsDocs.length > 0) {
    process.exit(0); // TS already generated — CONFIRM was received
  }

  // Check for CONFIRM REVIEW flag file
  if (fs.existsSync(CONFIRM_FLAG)) {
    log('PASS', HOOK_NAME, 'CONFIRM REVIEW flag found — TS generation allowed');
    // Auto-commit the review report
    autoCommit(7, 'Review');
    fs.unlinkSync(CONFIRM_FLAG); // Clear flag after use
    process.exit(0);
  }

  // Check transcript for CONFIRM REVIEW phrase
  const confirmReceived = transcript.some(msg =>
    typeof msg.content === 'string' &&
    /CONFIRM\s+REVIEW/i.test(msg.content) &&
    msg.role === 'user'
  );

  if (confirmReceived) {
    log('PASS', HOOK_NAME, 'CONFIRM REVIEW found in transcript — TS generation allowed');
    autoCommit(7, 'Review');
    process.exit(0);
  }

  // BLOCK — CONFIRM REVIEW not received
  process.stderr.write(
    `\n🛑 [DEWA Review Gate] BLOCKED — CONFIRM REVIEW required.\n\n` +
    `The code review report has been saved to /docs/review_report.md.\n\n` +
    `Before TS generation can proceed:\n` +
    `  1. Review /docs/review_report.md\n` +
    `  2. Verify all CRITICAL and HIGH findings are resolved\n` +
    `  3. Type: CONFIRM REVIEW\n\n` +
    `This gate cannot be bypassed. Reference: CODEREVIEW.md §GATE\n`
  );
  log('BLOCK', HOOK_NAME, 'BLOCKED — CONFIRM REVIEW not received');
  process.exit(1);
}

main().catch(e => {
  log('WARN', HOOK_NAME, `Hook error: ${e.message} — stop allowed`);
  process.exit(0);
});

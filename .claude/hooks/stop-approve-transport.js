#!/usr/bin/env node
/**
 * stop-approve-transport.js
 * ─────────────────────────────────────────────────────────────────
 * DEWA ADK Hook — Layer 3 · Stop
 * ─────────────────────────────────────────────────────────────────
 * Fires when Claude is about to stop at Stage 9/11.
 * Enforces APPROVE TRANSPORT governance gate.
 * After approval — triggers the Team Lead notification automatically.
 *
 * Trigger:   Stop — Claude completing response at Stage 9 or 11
 * Scope:     Only active when a transport has been validated
 * Behaviour: Deterministic — not AI.
 *
 * ADK hook contract:
 *   Input:  JSON via stdin { stop_reason, session_id, transcript }
 *   Output: exit 0 = allow stop
 *           exit 1 = block stop (stderr shown to Claude)
 */

'use strict';

const { log, PROJECT_ROOT } = require('./lib/logger');
const { autoCommit }        = require('./lib/git-helper');
const fs   = require('fs');
const path = require('path');

const HOOK_NAME = 'stop-approve-transport';

const TRANSPORT_FLAG = path.join(PROJECT_ROOT, 'docs', '.transport_validated');
const TL_TRIGGER     = path.join(PROJECT_ROOT, 'docs', 'teamlead_notification_trigger.txt');
const TS_DIR         = path.join(PROJECT_ROOT, 'docs');
const SMOKE_FLAG     = path.join(PROJECT_ROOT, 'docs', '.smoke_test_passed');

async function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;

  let hookData;
  try { hookData = JSON.parse(input); } catch { process.exit(0); }

  const transcript = hookData.transcript || [];

  // ── Stage 9: Transport validation gate ───────────────────────────
  // Only activate if transport has been validated
  if (!fs.existsSync(TRANSPORT_FLAG)) {
    process.exit(0);
  }

  // Read transport number from flag file
  let transportData = {};
  try {
    transportData = JSON.parse(fs.readFileSync(TRANSPORT_FLAG, 'utf8'));
  } catch {}

  const { transportNumber, appName, developer } = transportData;

  // ── Stage 11: Check for APPROVE TRANSPORT in transcript ──────────
  const approveReceived = transcript.some(msg =>
    typeof msg.content === 'string' &&
    /APPROVE\s+TRANSPORT/i.test(msg.content) &&
    msg.role === 'user'
  );

  if (!approveReceived) {
    // Check if smoke test was done (Stage 10 complete)
    const smokeTestDone = fs.existsSync(SMOKE_FLAG);

    if (!smokeTestDone) {
      // Stage 9 complete — transport validated but NOT yet approved
      // This is correct — just remind developer of next steps
      console.log(
        `\n✅ [DEWA Transport Gate] Transport ${transportNumber || 'validated'} — Stage 9 complete.\n\n` +
        `Next steps:\n` +
        `  Stage 10: Deploy to DEV → ui5 build → ADT upload → ICF activate → FLP tile\n` +
        `  Stage 10: Run smoke test in DEV system\n` +
        `  Stage 11: After smoke test passes → type: APPROVE TRANSPORT\n\n` +
        `Transport will NOT be released until smoke test is confirmed.\n` +
        `Reference: DEPLOY.md §6\n`
      );
      log('INFO', HOOK_NAME, `Transport ${transportNumber} validated — awaiting smoke test`);
      process.exit(0);
    }

    // Smoke test done but no APPROVE TRANSPORT — block
    process.stderr.write(
      `\n🛑 [DEWA Transport Gate] BLOCKED — APPROVE TRANSPORT required.\n\n` +
      `Smoke test complete. Transport ${transportNumber || ''} is ready for QAS release.\n\n` +
      `To release transport to QAS:\n` +
      `  1. Confirm smoke test passed (app loads, OData responds, RTL, Arabic, dark theme)\n` +
      `  2. Type: APPROVE TRANSPORT\n\n` +
      `This will:\n` +
      `  → Write the TL notification trigger\n` +
      `  → Watch script builds Outlook email\n` +
      `  → Outlook opens pre-filled\n` +
      `  → You click Send — Team Lead receives notification\n` +
      `  → Team Lead imports to QAS via SAP STMS\n\n` +
      `This gate cannot be bypassed. Reference: DEPLOY.md §6\n`
    );
    log('BLOCK', HOOK_NAME, 'BLOCKED — APPROVE TRANSPORT not received');
    process.exit(1);
  }

  // ── APPROVE TRANSPORT received — fire TL notification ─────────────
  log('PASS', HOOK_NAME, 'APPROVE TRANSPORT received — writing TL notification trigger');

  // Write trigger file for watch script
  const triggerData = {
    appName:     appName || 'Unknown App',
    transport:   transportNumber || 'PENDING',
    developer:   developer || process.env.USERNAME || 'Developer',
    date:        new Date().toISOString().slice(0, 16).replace('T', ' '),
    tsDocument:  fs.readdirSync(TS_DIR).find(f => f.match(/_TS_\d{8}\.md$/)) || '',
    sessionLog:  fs.readdirSync(path.join(TS_DIR, 'session_logs') || TS_DIR)
                   .filter(f => f.endsWith('.md')).sort().pop() || '',
    reviewReport: 'review_report.md',
  };

  fs.writeFileSync(TL_TRIGGER, JSON.stringify(triggerData, null, 2));
  log('PASS', HOOK_NAME, `TL trigger written for ${triggerData.appName} · ${triggerData.transport}`);

  // Auto-commit Stage 11
  autoCommit(11, appName || 'App');

  // Clean up flags
  try { fs.unlinkSync(TRANSPORT_FLAG); } catch {}
  try { fs.unlinkSync(SMOKE_FLAG); } catch {}

  console.log(
    `\n✅ [DEWA Transport Gate] APPROVED — ${transportData.transportNumber}\n\n` +
    `Team Lead notification trigger written to /docs/\n` +
    `Watch script will build the Outlook email automatically.\n` +
    `Check that dewa-handoff-watch.js is running — Outlook will open.\n` +
    `Click Send to notify the Team Lead.\n`
  );

  process.exit(0);
}

main().catch(e => {
  log('WARN', HOOK_NAME, `Hook error: ${e.message} — stop allowed`);
  process.exit(0);
});

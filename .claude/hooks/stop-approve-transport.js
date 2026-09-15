/**
 * stop-approve-transport.js — MORO SAP Plugin · Layer 3 Hook
 * Event: Stop
 * Gate: Blocks session end without APPROVE TRANSPORT
 * Notification: Fires to configured provider (Power Automate / SMTP) after gate clears
 */

const fs   = require("fs");
const path = require("path");

// ── Read Claude's stop event input ────────────────────────────────────────
let input = "";
process.stdin.on("data", chunk => { input += chunk; });

process.stdin.on("end", async () => {
  let event = {};
  try { event = JSON.parse(input); } catch (_) {}

  const transcript = event.transcript || [];

  // ── Check if developer typed APPROVE TRANSPORT ─────────────────────────
  const approved = transcript.some(msg =>
    msg.role === "user" &&
    typeof msg.content === "string" &&
    msg.content.trim().toUpperCase().includes("APPROVE TRANSPORT")
  );

  if (!approved) {
    // Gate not cleared — block Claude from stopping
    const output = {
      decision: "block",
      reason: [
        "⛔ TRANSPORT GATE NOT CLEARED",
        "",
        "Transport validation is complete but you have not approved the release.",
        "",
        "Before approving, confirm:",
        "  1. Smoke test passed",
        "  2. Security review shows CLEARED FOR DEPLOYMENT",
        "  3. Code review shows APPROVED",
        "  4. Transport target is QAS (not PRD)",
        "",
        "Then type: APPROVE TRANSPORT",
        "",
        "A transport release to QAS is irreversible. This gate cannot be bypassed.",
      ].join("\n"),
    };
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
    return;
  }

  // ── Gate cleared — fire notification ──────────────────────────────────
  try {
    const notifierPath = path.join(__dirname, "lib", "notifier.js");
    if (fs.existsSync(notifierPath)) {
      const { notify } = require(notifierPath);
      await notify("approve_transport");
    }
  } catch (e) {
    // Notification failure must never block the pipeline
    console.error("[stop-approve-transport] Notification error (non-blocking):", e.message);
  }

  // ── Allow Claude to proceed ────────────────────────────────────────────
  const output = {
    decision: "allow",
    reason: "APPROVE TRANSPORT received — transport gate cleared. Releasing to QAS.",
  };
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});

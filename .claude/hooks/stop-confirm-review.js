/**
 * stop-confirm-review.js — MORO SAP Plugin · Layer 3 Hook
 * Event: Stop
 * Gate: Blocks session end without CONFIRM REVIEW
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

  // ── Check if developer typed CONFIRM REVIEW ────────────────────────────
  const confirmed = transcript.some(msg =>
    msg.role === "user" &&
    typeof msg.content === "string" &&
    msg.content.trim().toUpperCase().includes("CONFIRM REVIEW")
  );

  if (!confirmed) {
    // Gate not cleared — block Claude from stopping
    const output = {
      decision: "block",
      reason: [
        "⛔ REVIEW GATE NOT CLEARED",
        "",
        "Code review is complete but you have not confirmed it.",
        "",
        "1. Read /docs/review_report.md",
        "2. Address any FAILED or WARNING items",
        "3. Type: CONFIRM REVIEW",
        "",
        "Claude cannot proceed to Stage 8 until the review is confirmed.",
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
      await notify("confirm_review");
    }
  } catch (e) {
    // Notification failure must never block the pipeline
    console.error("[stop-confirm-review] Notification error (non-blocking):", e.message);
  }

  // ── Allow Claude to proceed ────────────────────────────────────────────
  const output = {
    decision: "allow",
    reason: "CONFIRM REVIEW received — review gate cleared. Proceeding to Stage 8.",
  };
  process.stdout.write(JSON.stringify(output));
  process.exit(0);
});

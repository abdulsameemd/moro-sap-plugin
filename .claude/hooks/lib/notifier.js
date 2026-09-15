/**
 * notifier.js — MORO SAP Plugin shared notification module
 * Supports: Power Automate HTTP trigger | SMTP (Exchange/Outlook/any)
 * Reads config from: config/moro.config.json
 * Used by: stop-confirm-review.js, stop-approve-transport.js
 */

const fs   = require("fs");
const path = require("path");

// ── Load config ────────────────────────────────────────────────────────────
function loadConfig() {
  const configPath = path.join(__dirname, "..", "..", "config", "moro.config.json");
  if (!fs.existsSync(configPath)) {
    console.error("[notifier] moro.config.json not found — notifications disabled");
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error("[notifier] Failed to parse moro.config.json:", e.message);
    return null;
  }
}

// ── Build email payload ────────────────────────────────────────────────────
function buildPayload(event, config) {
  const now = new Date().toISOString();
  const developer = config.team.developer_name || process.env.USERNAME || "Unknown Developer";
  const project   = config.plugin.project_name || "SAP Project";

  const templates = {
    confirm_review: {
      subject: `[MORO SDLC] Code Review Confirmed — ${project}`,
      body: [
        `Code review has been confirmed for project: ${project}`,
        ``,
        `Developer : ${developer}`,
        `Stage     : Stage 7 — Code Review`,
        `Status    : CONFIRMED`,
        `Time      : ${now}`,
        ``,
        `Review report is available at: /docs/review_report.md`,
        ``,
        `Next step: Developer will proceed to Technical Specification (Stage 8).`,
        `Please review the report and be ready to approve the transport when requested.`,
        ``,
        `— MORO SAP SDLC Agentic Toolkit v1.0.0`,
      ].join("\n"),
    },
    approve_transport: {
      subject: `[MORO SDLC] Transport Approved — ${project}`,
      body: [
        `Transport has been approved for release to QAS for project: ${project}`,
        ``,
        `Developer : ${developer}`,
        `Stage     : Stage 11 — Transport Release`,
        `Status    : APPROVED`,
        `Time      : ${now}`,
        ``,
        `Deployment log is available at: /docs/deployment_log.md`,
        ``,
        `— MORO SAP SDLC Agentic Toolkit v1.0.0`,
      ].join("\n"),
    },
  };

  return {
    event,
    developer,
    project,
    timestamp: now,
    lead_name:  config.team.lead_name  || "",
    lead_email: config.team.lead_email || "",
    subject: templates[event]?.subject || `[MORO SDLC] Notification — ${event}`,
    body:    templates[event]?.body    || `Event: ${event} at ${now}`,
  };
}

// ── Power Automate notification ────────────────────────────────────────────
async function sendViaPoweAutomate(payload, paConfig) {
  if (!paConfig.endpoint) {
    console.error("[notifier] Power Automate endpoint not configured");
    return false;
  }

  try {
    const response = await fetch(paConfig.endpoint, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[notifier] Power Automate notification sent — ${payload.event}`);
      return true;
    } else {
      console.error(`[notifier] Power Automate returned ${response.status}: ${response.statusText}`);
      return false;
    }
  } catch (e) {
    console.error("[notifier] Power Automate request failed:", e.message);
    return false;
  }
}

// ── SMTP notification ──────────────────────────────────────────────────────
async function sendViaSMTP(payload, smtpConfig) {
  if (!smtpConfig.host || !smtpConfig.from || !smtpConfig.username || !smtpConfig.password) {
    console.error("[notifier] SMTP config incomplete — host, from, username, password required");
    return false;
  }
  if (!payload.lead_email) {
    console.error("[notifier] lead_email not configured in moro.config.json");
    return false;
  }

  // Use nodemailer if available, otherwise log instructions
  let nodemailer;
  try {
    nodemailer = require("nodemailer");
  } catch (e) {
    console.error("[notifier] nodemailer not installed. Run: npm install nodemailer");
    console.error("[notifier] Email NOT sent. Install nodemailer and retry.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransporter({
      host:   smtpConfig.host,
      port:   smtpConfig.port   || 587,
      secure: smtpConfig.secure || false,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
    });

    await transporter.sendMail({
      from:    smtpConfig.from,
      to:      payload.lead_email,
      subject: payload.subject,
      text:    payload.body,
    });

    console.log(`[notifier] SMTP email sent to ${payload.lead_email} — ${payload.event}`);
    return true;
  } catch (e) {
    console.error("[notifier] SMTP send failed:", e.message);
    return false;
  }
}

// ── Main notify function ───────────────────────────────────────────────────
async function notify(event) {
  const config = loadConfig();

  if (!config) return;
  if (!config.notifications?.enabled) {
    console.log("[notifier] Notifications disabled in config");
    return;
  }
  if (!config.notifications.events?.[event]) {
    console.log(`[notifier] Notifications for '${event}' disabled in config`);
    return;
  }

  const provider = config.notifications.provider || "none";
  const payload  = buildPayload(event, config);

  if (provider === "none") {
    console.log(`[notifier] No provider configured — skipping notification for '${event}'`);
    return;
  }

  if (provider === "powerautomate") {
    await sendViaPoweAutomate(payload, config.notifications.powerautomate);
    return;
  }

  if (provider === "smtp") {
    await sendViaSMTP(payload, config.notifications.smtp);
    return;
  }

  console.error(`[notifier] Unknown provider '${provider}' — valid options: none | powerautomate | smtp`);
}

module.exports = { notify };

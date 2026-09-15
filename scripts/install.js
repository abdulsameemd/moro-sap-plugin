/**
 * install.js — MORO SAP Plugin v1.0.0
 * Copies all plugin layers into a target SAP project folder
 * Prompts for notification config during setup
 * Usage: node scripts/install.js <target-project-path>
 */

const fs      = require("fs");
const path    = require("path");
const readline = require("readline");

const SOURCE = path.join(__dirname, "..");
const TARGET = process.argv[2];

if (!TARGET) {
  console.error("Usage: node scripts/install.js <target-project-path>");
  process.exit(1);
}

if (!fs.existsSync(TARGET)) {
  console.error(`Target path not found: ${TARGET}`);
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src,  entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function ask(rl, question, defaultVal = "") {
  return new Promise(resolve => {
    const prompt = defaultVal ? `${question} [${defaultVal}]: ` : `${question}: `;
    rl.question(prompt, answer => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function askChoice(rl, question, choices, defaultVal) {
  return new Promise(resolve => {
    const options = choices.join(" | ");
    rl.question(`${question} (${options}) [${defaultVal}]: `, answer => {
      const val = answer.trim().toLowerCase() || defaultVal;
      resolve(choices.includes(val) ? val : defaultVal);
    });
  });
}

// ── Main install ───────────────────────────────────────────────────────────
async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  MORO SAP Plugin v1.0.0 — Installer");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`Target project: ${TARGET}\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // ── Step 1: Team info ────────────────────────────────────────────────────
  console.log("── Step 1 of 3: Team information ──────────────\n");
  const projectName    = await ask(rl, "Project name");
  const installedBy    = await ask(rl, "Your name (developer)");
  const developerEmail = await ask(rl, "Your email");
  const leadName       = await ask(rl, "Lead / reviewer name");
  const leadEmail      = await ask(rl, "Lead / reviewer email");

  // ── Step 2: Notification provider ───────────────────────────────────────
  console.log("\n── Step 2 of 3: Notification setup ─────────────\n");
  console.log("Notifications alert your lead when CONFIRM REVIEW or APPROVE TRANSPORT is triggered.");
  console.log("Provider options: none | powerautomate | smtp\n");

  const provider = await askChoice(rl, "Notification provider", ["none", "powerautomate", "smtp"], "none");

  let paEndpoint = "";
  let smtpHost = "", smtpPort = "587", smtpSecure = "false";
  let smtpFrom = "", smtpUser = "", smtpPass = "";

  if (provider === "powerautomate") {
    console.log("\n  Power Automate setup:");
    console.log("  Create a flow with trigger: 'When an HTTP request is received'");
    console.log("  Add action: 'Send an email (V2)' using your Outlook account");
    console.log("  Copy the HTTP POST URL from the trigger and paste it below.\n");
    paEndpoint = await ask(rl, "  Power Automate HTTP trigger URL");
  }

  if (provider === "smtp") {
    console.log("\n  SMTP setup (Exchange/Outlook: host=smtp.office365.com, port=587):\n");
    smtpHost   = await ask(rl, "  SMTP host", "smtp.office365.com");
    smtpPort   = await ask(rl, "  SMTP port", "587");
    smtpSecure = await ask(rl, "  Use SSL (true for port 465, false for port 587)", "false");
    smtpFrom   = await ask(rl, "  From email address");
    smtpUser   = await ask(rl, "  SMTP username");
    smtpPass   = await ask(rl, "  SMTP password (stored in config — do not commit to git)");
    console.log("\n  ⚠️  Password stored in config/moro.config.json");
    console.log("  ⚠️  Add config/moro.config.json to .gitignore before committing.\n");
  }

  // ── Step 3: Confirm ──────────────────────────────────────────────────────
  console.log("\n── Step 3 of 3: Review & confirm ───────────────\n");
  console.log(`  Project      : ${projectName}`);
  console.log(`  Developer    : ${installedBy} (${developerEmail})`);
  console.log(`  Lead         : ${leadName} (${leadEmail})`);
  console.log(`  Notifications: ${provider}`);
  if (provider === "powerautomate") console.log(`  PA Endpoint  : ${paEndpoint || "(not set)"}`);
  if (provider === "smtp")          console.log(`  SMTP host    : ${smtpHost}:${smtpPort}`);
  console.log();

  const confirm = await ask(rl, "Proceed with installation? (yes/no)", "yes");
  rl.close();

  if (confirm.toLowerCase() !== "yes") {
    console.log("\nInstallation cancelled.");
    process.exit(0);
  }

  // ── Copy plugin files ────────────────────────────────────────────────────
  console.log("\nCopying plugin files...");

  copyDir(path.join(SOURCE, ".claude"),  path.join(TARGET, ".claude"));
  copyDir(path.join(SOURCE, "docs"),     path.join(TARGET, "docs"));
  copyDir(path.join(SOURCE, "config"),   path.join(TARGET, "config"));

  console.log("  ✅ .claude/ (skills, hooks, agents, commands, settings)");
  console.log("  ✅ docs/ (13 configuration files)");
  console.log("  ✅ config/ (moro.config.json template)");

  // ── Write populated config ───────────────────────────────────────────────
  const configPath = path.join(TARGET, "config", "moro.config.json");
  const config = {
    _comment: "MORO SAP Plugin Configuration — do not commit credentials to git.",
    plugin: {
      name: "moro-sap-plugin",
      version: "1.0.0",
      project_name: projectName,
      installed_by: installedBy,
      installed_at: new Date().toISOString(),
    },
    team: {
      lead_name:       leadName,
      lead_email:      leadEmail,
      developer_name:  installedBy,
      developer_email: developerEmail,
    },
    notifications: {
      enabled:  provider !== "none",
      provider,
      events: {
        confirm_review:    true,
        approve_transport: true,
      },
      powerautomate: {
        enabled:  provider === "powerautomate",
        endpoint: paEndpoint,
      },
      smtp: {
        enabled:  provider === "smtp",
        host:     smtpHost,
        port:     parseInt(smtpPort) || 587,
        secure:   smtpSecure === "true",
        from:     smtpFrom,
        username: smtpUser,
        password: smtpPass,
      },
    },
  };

  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("  ✅ config/moro.config.json (populated with your settings)");

  // ── .gitignore reminder ──────────────────────────────────────────────────
  if (provider === "smtp" || provider === "powerautomate") {
    const gitignorePath = path.join(TARGET, ".gitignore");
    let gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, "utf8") : "";
    if (!gitignore.includes("moro.config.json")) {
      gitignore += "\n# MORO plugin — contains credentials\nconfig/moro.config.json\n";
      fs.writeFileSync(gitignorePath, gitignore);
      console.log("  ✅ .gitignore updated (config/moro.config.json excluded)");
    }
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Installation complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Next steps:");
  console.log("  1. Open the project in VS Code");
  console.log("  2. Claude Code loads .claude/ automatically");
  console.log("  3. Run /moro-start to begin Stage 1");
  if (provider === "smtp") {
    console.log("  4. Run: npm install nodemailer  (required for SMTP)");
  }
  console.log();
}

main().catch(e => {
  console.error("Install failed:", e.message);
  process.exit(1);
});

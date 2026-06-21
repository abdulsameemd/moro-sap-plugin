#!/usr/bin/env node
/**
 * moro-sap-plugin install script
 * Usage: node scripts/install.js <target-project-path>
 *
 * Copies all plugin layers into the target project:
 *   skills/   → target/.claude/skills/
 *   hooks/    → target/.claude/hooks/
 *   commands/ → target/.claude/commands/
 *   agents/   → target/.claude/agents/
 *   docs/     → target/docs/
 *   settings.json → target/.claude/settings.json
 */

const fs   = require('fs');
const path = require('path');

const targetPath = process.argv[2];

if (!targetPath) {
  console.error('❌  Usage: node scripts/install.js <target-project-path>');
  process.exit(1);
}

const target = path.resolve(targetPath);

if (!fs.existsSync(target)) {
  console.error(`❌  Target path does not exist: ${target}`);
  process.exit(1);
}

const plugin = path.resolve(__dirname, '..');

// ── Helper: recursive copy ─────────────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── Install each layer ─────────────────────────────────────────────────────
const layers = [
  { src: '.claude/skills',   dest: '.claude/skills',   label: 'Skills (Layer 2)'   },
  { src: '.claude/hooks',    dest: '.claude/hooks',    label: 'Hooks (Layer 3)'    },
  { src: '.claude/agents',   dest: '.claude/agents',   label: 'Agents (Layer 4)'   },
  { src: '.claude/commands', dest: '.claude/commands', label: 'Commands'           },
  { src: 'docs',             dest: 'docs',             label: 'Config files (13 .md)'},
];

console.log(`\n📦  Installing moro-sap-plugin v0.1 into:\n    ${target}\n`);

for (const layer of layers) {
  const src  = path.join(plugin, layer.src);
  const dest = path.join(target, layer.dest);
  if (fs.existsSync(src)) {
    copyDir(src, dest);
    console.log(`  ✅  ${layer.label}`);
  } else {
    console.log(`  ⚠️   ${layer.label} — source not found, skipped`);
  }
}

// ── Copy settings.json ────────────────────────────────────────────────────
const settingsSrc  = path.join(plugin, '.claude', 'settings.json');
const settingsDest = path.join(target, '.claude', 'settings.json');
if (fs.existsSync(settingsSrc)) {
  if (!fs.existsSync(path.join(target, '.claude'))) {
    fs.mkdirSync(path.join(target, '.claude'), { recursive: true });
  }
  if (fs.existsSync(settingsDest)) {
    console.log(`  ⚠️   settings.json already exists — not overwritten`);
    console.log(`       Manually merge: ${settingsSrc}`);
  } else {
    fs.copyFileSync(settingsSrc, settingsDest);
    console.log(`  ✅  settings.json (hook wiring)`);
  }
}

console.log('\n✅  moro-sap-plugin v0.1 installed.\n');
console.log('Next steps:');
console.log('  1. Open the project in VS Code — Claude Code reads .claude/ automatically');
console.log('  2. SessionStart hook fires on session open — loads handoff context if present');
console.log('  3. Type /moro-start to begin a new Fiori application');
console.log('  4. Type /moro-review to run the 38-point code review');
console.log('  5. Type /moro-deploy to manage transport and release\n');

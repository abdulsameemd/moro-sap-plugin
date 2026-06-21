#!/usr/bin/env node
/**
 * moro-sap-plugin validate script
 * Usage: node scripts/validate.js
 * Checks that all required plugin files are present and frontmatter is valid.
 */

const fs   = require('fs');
const path = require('path');

const plugin = path.resolve(__dirname, '..');
let errors = 0;

function check(relPath, label) {
  const full = path.join(plugin, relPath);
  if (fs.existsSync(full)) {
    console.log(`  ✅  ${label}`);
    return true;
  } else {
    console.log(`  ❌  MISSING: ${label} (${relPath})`);
    errors++;
    return false;
  }
}

function checkFrontmatter(relPath) {
  const full = path.join(plugin, relPath);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, 'utf8');
  const required = ['name:', 'description:', 'license:', 'allowed-tools:', 'model:', 'metadata:'];
  const missing = required.filter(f => !content.includes(f));
  if (missing.length === 0) {
    console.log(`       Frontmatter: ✅ all required fields present`);
  } else {
    console.log(`       Frontmatter: ❌ missing fields: ${missing.join(', ')}`);
    errors++;
  }
}

console.log('\n🔍  Validating moro-sap-plugin v0.1\n');

console.log('Root files:');
check('package.json', 'package.json');
check('manifest.json', 'manifest.json');
check('README.md', 'README.md');

console.log('\nSettings:');
check('.claude/settings.json', 'settings.json (hook wiring)');

console.log('\nSkills (Layer 2):');
if (check('.claude/skills/moro-design/SKILL.md', 'moro-design/SKILL.md')) {
  checkFrontmatter('.claude/skills/moro-design/SKILL.md');
}
if (check('.claude/skills/moro-code-review/SKILL.md', 'moro-code-review/SKILL.md')) {
  checkFrontmatter('.claude/skills/moro-code-review/SKILL.md');
}

console.log('\nHooks (Layer 3):');
['pre-lint-gate.js', 'post-atc-check.js', 'session-start-handoff.js',
 'stop-confirm-review.js', 'stop-approve-transport.js'].forEach(h => {
  check(`.claude/hooks/${h}`, h);
});
['lib/logger.js', 'lib/sap-mcp.js', 'lib/git-helper.js'].forEach(l => {
  check(`.claude/hooks/${l}`, l);
});

console.log('\nAgents (Layer 4 — stubs):');
['design-agent', 'backend-agent', 'review-agent',
 'ts-agent', 'security-agent', 'deploy-agent'].forEach(a => {
  check(`.claude/agents/${a}.md`, `${a}.md (stub)`);
});

console.log('\nCommands:');
['moro-start.md', 'moro-review.md', 'moro-deploy.md'].forEach(c => {
  check(`.claude/commands/${c}`, c);
});

console.log('\nConfig files (docs/):');
['CLAUDE.md', 'CLAUDE_BACKEND.md', 'GUARDRAILS.md', 'DEPLOY.md',
 'CODEREVIEW.md', 'DESIGN.md', 'SAP_CLEAN_CORE.md', 'TS_TEMPLATE.md'].forEach(f => {
  check(`docs/${f}`, f);
});

console.log(`\n${'─'.repeat(50)}`);
if (errors === 0) {
  console.log('✅  Plugin valid — all files present and frontmatter complete\n');
} else {
  console.log(`❌  ${errors} issue(s) found — fix before install\n`);
  process.exit(1);
}

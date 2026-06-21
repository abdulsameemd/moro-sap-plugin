/**
 * lib/logger.js
 * Shared logging utility for all DEWA ADK hooks.
 * Writes to console (Claude Code reads stdout) and session log.
 */

const fs   = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const LOG_DIR      = path.join(PROJECT_ROOT, 'docs', 'session_logs');

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function log(level, hook, message) {
  const prefix = {
    INFO:  '🔵',
    PASS:  '✅',
    FAIL:  '❌',
    WARN:  '⚠️ ',
    BLOCK: '🛑',
    GATE:  '👤',
  }[level] || 'ℹ️ ';

  const line = `[${timestamp()}] ${prefix} [${hook}] ${message}`;
  console.log(line);

  // Append to latest session log if it exists
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const logs = fs.readdirSync(LOG_DIR)
      .filter(f => f.endsWith('.md'))
      .sort();
    if (logs.length > 0) {
      const logPath = path.join(LOG_DIR, logs[logs.length - 1]);
      fs.appendFileSync(logPath, `\n${line}`);
    }
  } catch (e) {
    // Non-fatal — don't block hook execution on log failure
  }
}

module.exports = { log, timestamp, PROJECT_ROOT };

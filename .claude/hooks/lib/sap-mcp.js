/**
 * lib/sap-mcp.js
 * Shared utility for calling abap-mcp-server tools from hooks.
 * Hooks call this — they don't call MCP directly.
 */

const { execSync } = require('child_process');
const { log }      = require('./logger');

/**
 * Run syntaxCheck on an ABAP object via abap-mcp-server.
 * Returns { passed: bool, errors: [] }
 */
function syntaxCheck(adtUri) {
  try {
    const result = execSync(
      `claude mcp call abap-mcp-server syntaxCheck --uri "${adtUri}"`,
      { encoding: 'utf8', timeout: 30000 }
    );
    const parsed = JSON.parse(result);
    const hasErrors = parsed.errors && parsed.errors.length > 0;
    return { passed: !hasErrors, errors: parsed.errors || [] };
  } catch (e) {
    log('WARN', 'sap-mcp', `syntaxCheck failed to execute: ${e.message}`);
    return { passed: false, errors: [e.message] };
  }
}

/**
 * Run runAtcCheck on an ABAP object via abap-mcp-server.
 * Returns { passed: bool, violations: [] }
 */
function runAtcCheck(adtUri) {
  try {
    const result = execSync(
      `claude mcp call abap-mcp-server runAtcCheck --uri "${adtUri}"`,
      { encoding: 'utf8', timeout: 60000 }
    );
    const parsed = JSON.parse(result);
    const violations = parsed.findings || [];
    return { passed: violations.length === 0, violations };
  } catch (e) {
    log('WARN', 'sap-mcp', `runAtcCheck failed to execute: ${e.message}`);
    return { passed: false, violations: [e.message] };
  }
}

module.exports = { syntaxCheck, runAtcCheck };

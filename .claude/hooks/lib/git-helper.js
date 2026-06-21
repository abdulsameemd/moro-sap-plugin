/**
 * lib/git-helper.js
 * Shared git commit utility — Claude commits per stage automatically.
 * Called by PostToolUse hooks at stage completion.
 */

const { execSync } = require('child_process');
const { log, PROJECT_ROOT } = require('./logger');

const STAGE_COMMIT_MESSAGES = {
  3:  'feat: scaffold UI5 app',
  5:  'feat: RAP service generated',
  7:  'review: code review complete',
  8:  'docs: TS and session log saved',
  9:  'release: transport validated',
  11: 'release: transport released to QAS',
};

/**
 * Auto-commit generated files after a stage completes.
 * @param {number} stage - Framework stage number (3,5,7,8,9,11)
 * @param {string} appName - App name for commit message context
 */
function autoCommit(stage, appName) {
  const msg = STAGE_COMMIT_MESSAGES[stage];
  if (!msg) return;

  try {
    execSync('git add .', { cwd: PROJECT_ROOT, encoding: 'utf8' });
    execSync(`git commit -m "${msg} [${appName}]"`,
      { cwd: PROJECT_ROOT, encoding: 'utf8' });
    log('PASS', 'git-helper', `Stage ${stage} committed: ${msg} [${appName}]`);
  } catch (e) {
    // Nothing to commit — not an error
    if (e.message.includes('nothing to commit')) {
      log('INFO', 'git-helper', `Stage ${stage} — nothing new to commit`);
    } else {
      log('WARN', 'git-helper', `Git commit failed: ${e.message}`);
    }
  }
}

/**
 * Ensure we are on a feature branch, not main.
 * Returns { onFeatureBranch: bool, branch: string }
 */
function checkBranch() {
  try {
    const branch = execSync('git branch --show-current',
      { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
    const onFeature = branch.startsWith('feature/') ||
                      branch.startsWith('framework/');
    return { onFeatureBranch: onFeature, branch };
  } catch (e) {
    return { onFeatureBranch: false, branch: 'unknown' };
  }
}

module.exports = { autoCommit, checkBranch };

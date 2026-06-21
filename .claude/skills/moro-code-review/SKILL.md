---
name: moro-code-review
description: |
  Reviews DEWA SAP code against frontend (SAPUI5/Fiori) and backend
  (ABAP/RAP/CAP) standards. Fires automatically after Stage 6 metadata
  verification. Also available standalone on any repo at any time against
  DEWA Red Team security standards (SEC-01 through SEC-06). Requires
  CONFIRM REVIEW typed by the developer before advancing to TS generation.
license: Proprietary - DEWA Internal
allowed-tools: mcp__abap-mcp-server__getObjectSource mcp__abap-mcp-server__reviewAbapCode mcp__abap-mcp-server__runAtcCheck mcp__abap-mcp-server__syntaxCheck mcp__abap-mcp-server__writeObjectSource Read Glob Grep
model: claude-sonnet-4-20250514
metadata:
  owner: DEWA SAP Technical Services
  version: 1.0
  criticality: high
  security_standards: SEC-01 through SEC-06
  review_authority: DEWA Red Team
  last_updated: 2026-05
---

# moro-code-review

## Purpose
Enforce DEWA's 38-point code quality standard across all SAP development.
Covers 23 frontend checks (SAPUI5/Fiori) and 15 backend checks (ABAP/RAP/CAP).
Generates a `review_report.md` that gates TS generation.

## Activation
- **Always-on (pipeline):** fires automatically after Stage 6 in `CLAUDE.md`
- **Standalone:** "run code review", "review this ABAP", `/moro-review`
- **Security-only:** "run security review", "check SEC compliance"

## Modes

### Mode 1 — Pipeline (Stage 7, always-on)
Runs the full 38-point review. Blocks at CONFIRM REVIEW gate.
The `stop-confirm-review.js` hook enforces this — Claude cannot advance
to TS generation without the developer typing `CONFIRM REVIEW`.

### Mode 2 — Standalone
Can be run on any repo, any time, against DEWA Red Team standards.
Runs against whatever code is in scope. Does not require Stage 6 to have
completed. Generates a standalone report.

## Frontend checks (23 total)
Load from `references/FRONTEND-CHECKS.md` for full detail. Categories:

| Category | Checks | Key rules |
|---|---|---|
| Manifest | 4 | sap.fiori section, minUI5Version 1.120+, namespace com.dewa |
| Tokens | 5 | No hardcoded hex, all colours from DEWA token set |
| RTL | 4 | dir="auto" on root, no hardcoded textAlign="Left" |
| Linter | 3 | 0 errors from run_ui5_linter before each file write |
| Accessibility | 4 | ariaLabel on all interactive controls |
| Performance | 3 | No synchronous XHR, lazy loading on tables |

## Backend checks (15 total)
Load from `references/BACKEND-CHECKS.md` for full detail. Categories:

| Category | Checks | Key rules |
|---|---|---|
| AUTHORITY-CHECK | 3 | Before every RAP action, entity-level, field-level |
| Clean Core | 4 | No direct DB access, Tier 1 APIs only for Cloud |
| ATC | 3 | 0 violations after each writeObjectSource |
| Error handling | 3 | req.error() not RAISE EXCEPTION, message keys not hardcoded |
| Unit tests | 2 | ltc_ stub per handler class, valid + invalid path |

## Security checks (SEC-01 to SEC-06)
Owned by DEWA Red Team. Violations NEVER auto-fixed by Claude.

| Rule | Severity | Check |
|---|---|---|
| SEC-01 | CRITICAL | AUTHORITY-CHECK before every RAP action |
| SEC-02 | CRITICAL | No hardcoded credentials or system URLs |
| SEC-03 | HIGH | No sensitive data in URL parameters |
| SEC-04 | HIGH | Input validation on all OData payloads |
| SEC-05 | MEDIUM | Audit log on DELETE / financial / mass operations |
| SEC-06 | CRITICAL | No bypass of SAP auth framework — escalate to Red Team |

## Review report output
Saved as `/docs/review_report.md` after review completes. Contains:
- Pass/fail per check (✅ PASS / ❌ FAIL / ⚠️ FLAG)
- ATC result summary
- Security findings (Red Team section)
- CONFIRM REVIEW prompt at the end

## Human gate
After the report is written, the developer must type:
```
CONFIRM REVIEW
```
The `stop-confirm-review.js` hook blocks Claude from advancing to Stage 8
(TS generation) until this phrase is typed. This gate cannot be bypassed.

## References
- `references/FRONTEND-CHECKS.md` — full 23-check frontend checklist
- `references/BACKEND-CHECKS.md` — full 15-check backend checklist
- `/security/SECURITY-Red-Team.md` — SEC-01 to SEC-06 full runbook

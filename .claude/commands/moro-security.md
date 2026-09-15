# /moro-security

Activates the **security-agent** for Stage 9 of the MORO HUB SAP SDLC pipeline.

## What this command does
Runs the full SEC-01 to SEC-06 security review across all UI5 and ABAP artefacts:
- **SEC-01** Input validation
- **SEC-02** Authorisation checks
- **SEC-03** Data exposure
- **SEC-04** Injection risk (dynamic SQL, FM calls)
- **SEC-05** Transport security
- **SEC-06** Clean Core compliance

Produces `/docs/security_findings.md` with a per-check verdict and an overall deployment gate decision (CLEARED / BLOCKED).

## Prerequisites
All four documents must exist:
- `/docs/handoff.md`
- `/docs/backend_summary.md`
- `/docs/review_report.md`
- `/docs/technical_specification.md`

## Hooks active during this command
- `session-start-handoff.js` — loads context at session start

No write hooks — security-agent has read-only access to the SAP system.

## When to run
After `/moro-ts` completes and the Technical Specification is written.

## Next command
`/moro-deploy` — only if security_findings.md shows `CLEARED FOR DEPLOYMENT`. If `BLOCKED`, resolve all critical findings first and re-run `/moro-security`.

## Usage
```
/moro-security
```
No arguments needed.

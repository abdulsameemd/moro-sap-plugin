# /moro-ts

Activates the **ts-agent** for Stage 8 of the MORO HUB SAP SDLC pipeline.

## What this command does
Reads all artefacts from Stages 1–7 and generates the complete Technical Specification document at `/docs/technical_specification.md`. Covers solution overview, architecture, UI5 screens, ABAP objects, data model, OData service, review outcome, transport details, and open items.

## Prerequisites
All three documents must exist:
- `/docs/handoff.md` — design complete
- `/docs/backend_summary.md` — backend complete
- `/docs/review_report.md` — code review complete (must show APPROVED)

## Hooks active during this command
- `session-start-handoff.js` — loads context at session start

No write hooks — ts-agent only writes local `.md` files, not SAP system objects.

## When to run
After the developer has typed `CONFIRM REVIEW` to clear the review gate at Stage 7.

## Next command
`/moro-security` — once the Technical Specification is written.

## Usage
```
/moro-ts
```
No arguments needed. The agent reads all context from existing docs.

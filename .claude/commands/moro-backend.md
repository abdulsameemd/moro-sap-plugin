# /moro-backend

Activates the **backend-agent** for Stages 4–6 of the MORO HUB SAP SDLC pipeline.

## What this command does
Reads the design handoff from `/docs/handoff.md` and generates all ABAP/RAP backend artefacts:
- CDS interface and consumption views
- RAP behaviour definition and implementation class
- OData service definition and binding

All artefacts are written to the SAP system via `writeObjectSource` with ATC checks enforced after every write.

## Prerequisites
- `/moro-start` must have been run and `/docs/handoff.md` must exist
- The developer must have confirmed the design is complete

## Hooks active during this command
- `pre-lint-gate.js` — fires on every file write (lint must pass)
- `post-atc-check.js` — fires after every `writeObjectSource` (ATC must pass)
- `session-start-handoff.js` — loads context at session start

## When to run
After `/moro-start` completes Stage 3 and the handoff document is written.

## Next command
`/moro-review` — once backend-agent confirms all objects are generated and in transport.

## Usage
```
/moro-backend
```
No arguments needed. The agent reads all required context from `/docs/handoff.md`.

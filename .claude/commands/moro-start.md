# /moro-start

**Trigger:** `/moro-start`
**Stages:** 1 – 3
**Skill:** moro-design
**Hook:** SessionStart (session-start-handoff.js fires automatically on session open)

## What this command does

Starts a new DEWA SAP Fiori development session. Activates the `moro-design`
skill and begins the 6-screen generation pipeline.

## Required inputs

When the developer types `/moro-start`, Claude asks for:

1. **Application name** — e.g. `VendorProfile`
2. **Namespace** — e.g. `com.dewa.fi`
3. **Target system** — `Cloud` or `On-Prem`
4. **Entity name** — e.g. `VendorProfile` (the RAP root entity)
5. **Number of screens** — default 6

## Claude's behaviour after this command

1. Reads `CLAUDE.md` and all 13 configuration files
2. Activates `moro-design` skill (DEWA tokens, Dubai font, RTL rules)
3. Checks `/docs/handoff/` — if `ready_handoff.md` exists, loads it automatically
4. Confirms the app details with the developer
5. Begins Stage 1: Fiori application scaffold
6. Runs `run_ui5_linter` after every file write (PreToolUse hook enforces this)
7. Completes all 6 screens, then exports handoff to `/docs/handoff/`

## Example

```
/moro-start
> Application name: VendorProfile
> Namespace: com.dewa.fi
> Target: On-Prem
> Entity: VendorProfile
> Screens: 6
```

Claude responds with a session summary and begins Stage 1.

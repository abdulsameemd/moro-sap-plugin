# /moro-review

**Trigger:** `/moro-review`
**Stage:** 7
**Skill:** moro-code-review
**Hook:** Stop — stop-confirm-review.js blocks until CONFIRM REVIEW typed

## What this command does

Runs the full DEWA code review (23 frontend + 15 backend + SEC-01–06 checks)
against the current project. Can be used at Stage 7 in the pipeline or
standalone on any repository at any time.

## Modes

### Pipeline mode (Stage 7)
Type `/moro-review` after Stage 6 completes. Claude:
1. Activates `moro-code-review` skill
2. Reads all generated source files
3. Runs `runAtcCheck` via abap-mcp-server
4. Executes all 38 checks
5. Writes `/docs/review_report.md`
6. Prompts developer: **Type CONFIRM REVIEW to proceed**

The `stop-confirm-review.js` hook blocks Claude from generating the TS
until the developer types `CONFIRM REVIEW`.

### Standalone mode
Type `/moro-review` at any time on any project. Claude runs the same
38-point review without requiring Stage 6 to have completed. Useful for:
- Reviewing legacy ABAP before migration
- Pre-transport spot checks
- Red Team audit on any repo

## Required inputs

Claude asks:
1. **Mode** — pipeline or standalone
2. **Scope** — all artefacts, specific object, or security-only

## Example

```
/moro-review
> Mode: pipeline
> Scope: all artefacts
```

Claude runs the full review and writes `review_report.md`.

## Security checks (always included)

SEC-01 through SEC-06 run in every review. Violations are flagged in the
report and are NEVER auto-fixed. Developer must resolve each one manually
before typing CONFIRM REVIEW.

# /moro-deploy

**Trigger:** `/moro-deploy`
**Stages:** 9 – 11
**Hook:** Stop — stop-approve-transport.js blocks until APPROVE TRANSPORT typed

## What this command does

Manages the transport validation and release pipeline (Stages 9–11).
Validates the transport, runs a pre-release check, and triggers the
Team Lead notification email via the watch script.

## Prerequisite

- Stage 7 (`/moro-review`) must be complete — `review_report.md` must exist
- Stage 8 (TS generation) must be complete — TS document must be written
- Smoke test (Stage 10) must be run manually by the developer

## Claude's behaviour after this command

1. Calls `listTransports` via abap-mcp-server — shows all open transports
2. Developer selects the transport to release
3. Calls `validateTransport` — checks for missing objects, syntax errors, conflicts
4. If validation passes → shows transport summary
5. Claude prompts: **Run smoke test in DEV system before continuing**
6. After developer confirms smoke test passed → prompts: **Type APPROVE TRANSPORT**

The `stop-approve-transport.js` hook blocks Claude from releasing the transport
until the developer types `APPROVE TRANSPORT`. This gate is irreversible —
a transport released to QAS cannot be recalled.

7. After APPROVE TRANSPORT:
   - Writes `/docs/teamlead_notification_trigger.txt`
   - Watch script (`dewa-handoff-watch.js`) detects the trigger
   - Outlook opens with pre-filled Team Lead notification email
   - Developer clicks Send — one action

## Example

```
/moro-deploy
> Transport: DEVK9A00042
> Validate: yes
> Smoke test: passed
> APPROVE TRANSPORT
```

Claude confirms the transport is released to QAS and the Team Lead
notification has been queued.

## Irreversibility warning

Transport release to QAS is permanent. The stop-approve-transport.js hook
exists specifically to prevent accidental release. APPROVE TRANSPORT must be
typed explicitly — Claude cannot trigger release on its own.

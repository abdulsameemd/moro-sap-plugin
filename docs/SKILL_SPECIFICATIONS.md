# SKILL_SPECIFICATIONS.md
## DEWA SAP Agentic Development Framework
### Formal Skill Definitions — Framework governance Review

> **Document purpose:** Formal specification of all 4 agentic skills in the framework.
> Covers: best practices compliance · confidence ratings · evals · invocation types ·
> hook requirements · deployment risk · recommended LLM · iteration limits.
>
> **Maintained by:** Abdulsamee
> **Version:** 1.0 · May 2026
> **Status:** Submitted for Framework governance review

---

## Skill Design Best Practices — Compliance Checklist

All skills in this framework are evaluated against the following best practices:

| # | Best Practice | Description |
|---|---|---|
| BP-01 | Single responsibility | Each skill does one thing and does it completely |
| BP-02 | Defined trigger | Skill has an explicit, unambiguous invocation condition |
| BP-03 | Defined output contract | Skill produces a known, verifiable output |
| BP-04 | Failure handling | Skill has defined behaviour on partial or complete failure |
| BP-05 | Human escalation path | Skill knows when to stop and ask a human |
| BP-06 | Idempotency | Running skill twice produces same result, no side effects |
| BP-07 | Context isolation | Skill reads only what it needs, writes only to defined locations |
| BP-08 | Auditability | Skill output is logged and traceable |

---

## Skill 1 — DEWA_DESIGN

### 1.1 Overview

| Attribute | Value |
|---|---|
| **Skill name** | DEWA_DESIGN |
| **Stage** | 1 — Prototype Design |
| **Tool** | Claude Design + SAP Fiori MCP Server |
| **Owner** | Abdulsamee |
| **Version** | 1.0 |

### 1.2 Invocation Type

```
Type:      INVOKED
Trigger:   Developer selects "DEWA" design system in Claude Design
           and types a requirement
Condition: DEWA design system must be set up (one-time setup)
Scope:     Single prototype session
```

**Invocation types explained:**
- **Always-on** — runs on every message automatically
- **Invoked** ← this skill — triggered by explicit developer action
- **Forked** — spawns a parallel agent branch
- **Scheduled** — runs on a timer or cron
- **Event-triggered** — fires on a system event

### 1.3 Confidence Rating

```
Overall confidence:    82%

Breakdown:
  Token compliance:      95%  (DESIGN.md tokens enforced)
  Fiori guideline fit:   88%  (SAP Fiori MCP validates)
  Screen completeness:   80%  (depends on requirement clarity)
  Arabic RTL accuracy:   78%  (complex layouts may need adjustment)
  Mobile responsiveness: 72%  (requires developer review)
```

**Why not higher:** Claude Design's output quality depends heavily on requirement phrasing.
Vague requirements produce incomplete screens. Confidence rises to ~92% with structured
requirements (entity name + CRUD scope + user role explicitly stated).

### 1.4 Hook Requirements

| Hook | Required? | Description | Failure behaviour |
|---|---|---|---|
| HOOK-0: Load design system | **Mandatory** | Reads DESIGN.md tokens into Claude Design session | Block — cannot proceed without DEWA tokens |
| HOOK-1: Generate prototype | **Mandatory** | Claude Design generates all screens | Retry once — if fails, human creates manually |
| HOOK-2: Token validation | **Mandatory** | Checks all hex values against DESIGN.md §2 | Auto-fix if rogue hex detected · flag if ambiguous |
| GATE: Developer approval | **Mandatory** | Human reviews and approves prototype | Hard stop — no export without approval |

### 1.5 Evals

**Eval 1 — Token compliance**
```
Input:    Prototype generated for "Vendor Payment Status" app
Expected: All hex values match DESIGN.md §2 exactly
          Primary: #007560 · Error: #B00020 · Alert: #FFC600
Pass:     Zero rogue hex values in generated CSS
Fail:     Any hex value not in DESIGN.md §2
```

**Eval 2 — Screen completeness**
```
Input:    "Create a vendor profile management app with full CRUD"
Expected: List Report · Object Page · Create form · Edit form generated
Pass:     All 4 screens present with correct Fiori floorplan
Fail:     Any screen missing or using wrong floorplan pattern
```

**Eval 3 — Arabic RTL**
```
Input:    Any prototype generation
Expected: RTL layout with logical CSS properties
          margin-inline-start (not margin-left)
Pass:     All layout properties use logical equivalents
Fail:     Any physical CSS property (left/right) used for layout
```

### 1.6 Recommended LLM

```
Model:   Claude Sonnet 4
Reason:  Visual design generation requires strong instruction-following
         and creative layout decisions. Sonnet 4 balances quality
         with speed for iterative prototype generation.
         Opus is overkill for visual layout — cost not justified.
         Haiku lacks sufficient instruction-following for complex
         multi-screen Fiori layouts.
```

### 1.7 Iteration Limits

```
Max retries on token violation:     2  → then human review
Max retries on incomplete screens:  1  → then human completes manually
Max prototype regenerations:        3  → then escalate to framework owner
Session timeout:                    No limit (human-paced)
```

### 1.8 Deployment Risk

```
Risk level:    LOW
Impact:        Cosmetic — wrong prototype delays Stage 2 but causes
               no system changes. No write operations to SAP.
Rollback:      Regenerate prototype — no cleanup needed
Data risk:     None — read-only, no SAP connection at this stage
Failure mode:  Developer rejects prototype at human gate → restart Stage 1
```

### 1.9 Best Practices Compliance

| BP | Compliant? | Notes |
|---|---|---|
| BP-01 Single responsibility | ✅ | Prototype only — no code generation |
| BP-02 Defined trigger | ✅ | DEWA design system selection |
| BP-03 Defined output contract | ✅ | Screens + token-compliant CSS |
| BP-04 Failure handling | ✅ | Retry limits defined |
| BP-05 Human escalation | ✅ | Approval gate is mandatory |
| BP-06 Idempotency | ✅ | Same input → same screens |
| BP-07 Context isolation | ✅ | Reads DESIGN.md only |
| BP-08 Auditability | ⚠️ | No session log at this stage — Claude Design has no log output |

---

## Skill 2 — PROTOTYPE_EXPORT

### 2.1 Overview

| Attribute | Value |
|---|---|
| **Skill name** | PROTOTYPE_EXPORT |
| **Stage** | 2 — Export → Claude Code Handoff |
| **Tool** | dewa-handoff-watch.js (Node.js) |
| **Owner** | Abdulsamee |
| **Version** | 1.0 |

### 2.2 Invocation Type

```
Type:      EVENT-TRIGGERED
Trigger:   ZIP file matching handoff pattern lands in Downloads folder
Event:     File system event (chokidar watcher)
Condition: dewa-handoff-watch.js must be running in background
Scope:     Single handoff session — one zip → one prompt
```

### 2.3 Confidence Rating

```
Overall confidence:    91%

Breakdown:
  Zip detection:         99%  (chokidar is reliable)
  App name extraction:   88%  (title tag priority — falls back gracefully)
  Control mapping:       85%  (HTML → sap.m mapping covers common controls)
  Token audit:           95%  (regex match against DESIGN.md §2 hex values)
  Prompt generation:     92%  (template-based — deterministic)
  Clipboard copy:        90%  (PowerShell Set-Clipboard — Windows only)
```

**Why not higher:** Control mapping (Hook 3) covers ~85% of Claude Design output patterns.
Unusual or complex layouts may produce an incomplete control map that Claude Code
must infer from screenshots.

### 2.4 Hook Requirements

| Hook | Required? | Description | Failure behaviour |
|---|---|---|---|
| HOOK-1: Detect zip | **Mandatory** | chokidar watches Downloads folder | If missed: developer manually triggers node dewa-handoff-watch.js |
| HOOK-2: Auto-extract | **Mandatory** | Unzips to /docs/handoff/ | If fails: alert developer · manual extract |
| HOOK-3: Control map | **Optional** | Maps HTML elements to sap.m controls | If partial: include raw HTML in prompt as fallback |
| HOOK-4: Token check | **Mandatory** | Audits hex values against DESIGN.md §2 | Flag violations in prompt — Claude Code fixes in Stage 3 |
| HOOK-5: Build prompt | **Mandatory** | Generates Claude Code session prompt | If fails: developer uses Session Start tab in Developer Toolkit |

### 2.5 Evals

**Eval 1 — App name extraction**
```
Input:    ZIP with HTML containing <title>Vendor Profile Management</title>
Expected: appName = "Vendor Profile Management"
Pass:     Exact title extracted — no truncation, no kebab-case
Fail:     "vendor-profile-management" or "DEWA App" returned
```

**Eval 2 — Token audit**
```
Input:    Prototype containing #FF0000 (not in DESIGN.md §2)
Expected: Violation flagged in generated prompt
Pass:     Prompt includes "TOKEN VIOLATION: #FF0000 found — replace with #B00020"
Fail:     Violation not detected · passed to Claude Code unchecked
```

**Eval 3 — Prompt completeness**
```
Input:    Zip with 3 screens (List, Object Page, Create)
Expected: Prompt contains all 3 screen descriptions + control maps + namespace
Pass:     All 3 screens represented in generated prompt
Fail:     Any screen missing from prompt
```

### 2.6 Recommended LLM

```
Model:   N/A — this skill runs as Node.js code, not a Claude session
Reason:  PROTOTYPE_EXPORT is implemented as dewa-handoff-watch.js.
         No LLM is involved in the execution. The prompt it generates
         is consumed by Claude Code (Sonnet 4) in Stage 3.
```

### 2.7 Iteration Limits

```
Max zip processing retries:     2  → then alert developer
Max extract attempts:           2  → then manual fallback
Watch script restart on crash:  Automatic via process manager (pm2)
Session scope:                  One zip per trigger cycle
```

### 2.8 Deployment Risk

```
Risk level:    LOW
Impact:        If prompt is wrong, Stage 3 scaffold may need correction.
               No SAP system changes at this stage.
Rollback:      Re-run watch script with same zip — idempotent
Data risk:     None — file system only, no SAP connection
Failure mode:  Worst case: developer uses manual prompt from Developer Toolkit
```

### 2.9 Best Practices Compliance

| BP | Compliant? | Notes |
|---|---|---|
| BP-01 Single responsibility | ✅ | Handoff only — zip to prompt |
| BP-02 Defined trigger | ✅ | File system event — unambiguous |
| BP-03 Defined output contract | ✅ | claude_code_prompt.txt · clipboard |
| BP-04 Failure handling | ✅ | Each hook has fallback defined |
| BP-05 Human escalation | ✅ | Developer Toolkit Session Start as fallback |
| BP-06 Idempotency | ✅ | Same zip → same prompt every time |
| BP-07 Context isolation | ✅ | Reads /docs/handoff/ only · writes to /docs/ only |
| BP-08 Auditability | ✅ | claude_code_prompt.txt saved to /docs/ |

---

## Skill 3 — CODE_REVIEW

### 3.1 Overview

| Attribute | Value |
|---|---|
| **Skill name** | CODE_REVIEW |
| **Stage** | 7 — Code Review |
| **Tool** | CODEREVIEW.md · abap-mcp-server:reviewAbapCode · runAtcCheck |
| **Owner** | Abdulsamee |
| **Version** | 1.0 |

### 3.2 Invocation Type

```
Type:      ALWAYS-ON + INVOKED (dual mode)

Mode 1 — Pipeline (Always-on):
  Trigger:   Automatic after Stage 6 ($metadata verified)
  Condition: Integration.md Stage 6 complete · $metadata HTTP 200
  Scope:     Full frontend + backend + security review

Mode 2 — Standalone (Invoked):
  Trigger:   Developer types "Review this codebase against DEWA standards"
             or "Run DEWA security review on [class/folder]"
  Condition: Any SAP repository — no pipeline context needed
  Scope:     Any codebase at any time — with or without full pipeline
```

**Why dual mode:** Per CAIO guidance — the review skill must be executable
at any time on any code repository against DEWA Red Team Security standards.
Not limited to Stage 7 of the pipeline.

### 3.3 Confidence Rating

```
Overall confidence:    90% (pipeline mode) · 88% (standalone mode)

Breakdown:
  Frontend 23 checks:    93%  (deterministic rule application)
  Backend PERF-01–08:    92%  (reviewAbapCode pattern matching)
  Backend STY-01–13:     90%  (some patterns need context judgment)
  Auto-fix safety:       95%  (conservative — only safe fixes applied)
  ATC re-check:          98%  (abap-mcp-server deterministic)
  Report generation:     96%  (template-based output)
  SEC checks (6 rules):  88%  (pattern-based — CRITICAL findings always flagged)
```

**Why not higher:** STY patterns (STY-11 especially) require developer judgment
on whether a refactor is safe in context. Auto-fix confidence is deliberately
conservative — better to flag than to break.

### 3.4 Hook Requirements

| Hook | Required? | Description | Failure behaviour |
|---|---|---|---|
| HOOK-1: Frontend review | **Mandatory** | 23 checks per CODEREVIEW.md §1 | If partial: flag which checks failed · do not advance |
| HOOK-2: Backend review | **Mandatory** | reviewAbapCode per class | If MCP fails: retry once · then manual review |
| HOOK-3: Auto-fix | **Mandatory** | Apply safe PERF/STY fixes | If fix breaks syntax: revert · flag for developer |
| HOOK-4: ATC re-check | **Mandatory** | runAtcCheck post-fix · 0 violations required | Hard stop if violations remain |
| HOOK-5: Report + save | **Mandatory** | Save review_report.md to /docs/ | Block TS generation if report not saved |
| HOOK-5a: Security checks | **Mandatory** | 6 SEC rules per CODEREVIEW.md §4 · CRITICAL findings block transport | Flag with severity · never auto-fix SEC violations |
| GATE: CONFIRM REVIEW | **Mandatory** | Developer reads report + confirms | Hard stop — no bypass — no TS without this |

### 3.5 Evals

**Eval 1 — CSS scope detection**
```
Input:    View with .sapMList { margin: 0; } (unscoped)
Expected: C1 violation flagged · auto-fix applied → #app .sapMList { margin: 0; }
Pass:     Scoped selector in output · C1 marked as auto-fixed in report
Fail:     Unscoped selector passes review
```

**Eval 2 — Silent exception detection**
```
Input:    ABAP handler with CATCH cx_root. (empty handler)
Expected: STY-03 violation flagged · auto-fix adds MESSAGE e001(ZFI)
Pass:     No silent cx_root in output · STY-03 auto-fixed in report
Fail:     Silent exception passes review
```

**Eval 3 — CONFIRM REVIEW gate**
```
Input:    Review complete · report saved · developer types "generate ts"
           without typing CONFIRM REVIEW first
Expected: Claude refuses to generate TS · reminds developer of gate
Pass:     TS generation blocked
Fail:     TS generated without CONFIRM REVIEW
```

**Eval 4 — ATC re-check post-fix**
```
Input:    Backend class with 3 ATC violations
Expected: Auto-fix applied · ATC re-runs · 0 violations in final report
Pass:     review_report.md shows "ATC re-check: 0 violations"
Fail:     Violations remain · report not saved · gate not triggered
```

### 3.6 Recommended LLM

```
Model:   Claude Sonnet 4
Reason:  Code review requires strong pattern recognition and
         code transformation ability. Sonnet 4 handles ABAP
         and TypeScript review reliably at reasonable cost.
         Opus would improve STY-11 judgment calls but at 5x cost —
         not justified for batch review of standard patterns.
         Haiku insufficient for ABAP pattern complexity.
Note:    If ATC violations remain after 2 auto-fix cycles,
         consider routing STY-11 flagged items to Opus for
         deeper contextual judgment.
```

### 3.7 Iteration Limits

```
Auto-fix cycles:              2  → if violations remain after 2 cycles, flag for human
ATC re-check attempts:        3  → if still failing, block and escalate
reviewAbapCode per class:     1  → single pass (MCP handles internally)
CONFIRM REVIEW wait:          No limit (human-paced)
Report save retries:          2  → if fails, output to console for manual save
```

### 3.8 Deployment Risk

```
Risk level:    MEDIUM
Impact:        Auto-fix modifies ABAP source code in SAP via writeObjectSource.
               Incorrect auto-fix could introduce a regression.
Mitigation:    syntaxCheck runs after every auto-fix.
               ATC re-check validates post-fix state.
               Only PERF-01–07 and STY-01–10 are auto-fixed (conservative list).
               PERF-08 and STY-11 are always flagged — never auto-fixed.
Rollback:      SAP transport system — revert via SE09 if needed.
Data risk:     Code changes in DEV only — not yet in transport to QAS.
Failure mode:  Auto-fix reverts on syntax error · report flags for developer.
```

### 3.9 Best Practices Compliance

| BP | Compliant? | Notes |
|---|---|---|
| BP-01 Single responsibility | ✅ | Review + fix only — no generation |
| BP-02 Defined trigger | ✅ | Automatic after Stage 6 |
| BP-03 Defined output contract | ✅ | review_report.md · ATC zero violations |
| BP-04 Failure handling | ✅ | Revert on syntax error · escalation path |
| BP-05 Human escalation | ✅ | CONFIRM REVIEW hard gate |
| BP-06 Idempotency | ⚠️ | Second run may produce different auto-fixes if code was partially fixed |
| BP-07 Context isolation | ✅ | Reads /docs/ · writes review_report.md · ABAP via MCP only |
| BP-08 Auditability | ✅ | review_report.md · ATC results · session log |

---

## Skill 4 — TS_AUTOGEN

### 4.1 Overview

| Attribute | Value |
|---|---|
| **Skill name** | TS_AUTOGEN |
| **Stage** | 8 — Technical Specification |
| **Tool** | abap-mcp-server:generateWricefSpec · TS_TEMPLATE.md |
| **Owner** | Abdulsamee |
| **Version** | 1.0 |

### 4.2 Invocation Type

```
Type:      FORKED
Trigger:   Developer types CONFIRM REVIEW
Condition: review_report.md must exist in /docs/
Scope:     Reads from review + linter + ABAP objects → writes TS document
```

**Why forked:** TS_AUTOGEN runs as a parallel data-gathering and assembly task.
It calls generateWricefSpec (MCP), reads the review report, reads linter results —
multiple independent reads that are assembled into a single output. This matches
the forked invocation pattern where multiple data sources are gathered in parallel
before synthesis.

### 4.3 Confidence Rating

```
Overall confidence:    88%

Breakdown:
  generateWricefSpec accuracy:   92%  (MCP reads actual SAP objects)
  Template section fill rate:    85%  (§1 business req left for developer)
  Review evidence inclusion:     96%  (reads review_report.md directly)
  Linter evidence inclusion:     94%  (reads run_ui5_linter output)
  Transport number accuracy:     98%  (listTransports — deterministic)
  Sign-off table accuracy:       60%  (approver names not auto-populated)
```

**Why not higher:** §1 (business requirement) is intentionally left for the developer.
Sign-off table names cannot be auto-populated — governance requires human input.
These known gaps bring overall confidence to 88%.

### 4.4 Hook Requirements

| Hook | Required? | Description | Failure behaviour |
|---|---|---|---|
| HOOK-1: generateWricefSpec | **Mandatory** | Fetches all ABAP object metadata from SAP | Retry once · if fails, flag missing sections in TS |
| HOOK-2: Read review evidence | **Mandatory** | Reads review_report.md as test evidence | Block if report missing — CONFIRM REVIEW must precede |
| HOOK-3: Read linter results | **Recommended** | Reads run_ui5_linter output | If missing: note in TS that linter results unavailable |
| HOOK-4: Fill template | **Mandatory** | Populates TS_TEMPLATE.md §1–§9 | No placeholder left empty — use N/A if unknown |
| HOOK-5: Save TS | **Mandatory** | Saves to /docs/[App]_TS_[Date].md | Retry once · if fails, output to chat for manual save |

### 4.5 Evals

**Eval 1 — No empty placeholders**
```
Input:    generateWricefSpec output for VendorProfile app
Expected: All 9 sections filled — no [placeholder] text remaining
Pass:     Zero unfilled placeholders in saved TS document
Fail:     Any section contains [placeholder] or TBD
```

**Eval 2 — Review evidence present**
```
Input:    TS generated after CODE_REVIEW with 8 auto-fixes
Expected: §6 review evidence shows "8 auto-fixes applied" + ATC results
Pass:     §6 references review_report.md findings accurately
Fail:     §6 is empty or says "review not available"
```

**Eval 3 — Transport number in §7**
```
Input:    Transport DEVK9A00042 validated in Stage 9
Expected: §7 shows "Transport: DEVK9A00042"
Pass:     Correct transport number in TS header and §7
Fail:     Transport number missing or incorrect
```

**Eval 4 — Session log validator**
```
Input:    TS saved to /docs/
Expected: dewa-handoff-watch.js detects file · validates completeness
Pass:     Session log validator reports 4/4 checks passed
Fail:     Validator flags missing sections
```

### 4.6 Recommended LLM

```
Model:   Claude Sonnet 4
Reason:  TS generation is primarily a data assembly task —
         reading structured MCP output and filling a template.
         Sonnet 4 is accurate for structured document assembly.
         Haiku could handle simple sections but risks missing
         nuance in the review evidence narrative.
         Opus not needed — this is template-filling, not reasoning.
Note:    For §1 (business requirement narrative), if the developer
         provides a brief description, Opus produces higher quality
         prose. Optional upgrade for that section only.
```

### 4.7 Iteration Limits

```
generateWricefSpec retries:    1  → then partial TS with flagged gaps
Template fill cycles:          1  → single pass (template is deterministic)
Save retries:                  2  → then console output for manual save
Post-save validation:          1  → session log validator runs once
```

### 4.8 Deployment Risk

```
Risk level:    LOW
Impact:        TS is a documentation artefact — no SAP system changes.
               Incorrect TS could mislead Team Lead review.
Mitigation:    generateWricefSpec reads actual SAP objects (not memory).
               Review evidence comes from actual review_report.md.
               Session log validator checks completeness post-save.
Rollback:      Delete and regenerate — idempotent.
Data risk:     None — /docs/ write only.
Failure mode:  Partial TS flagged with gaps — developer completes manually.
```

### 4.9 Best Practices Compliance

| BP | Compliant? | Notes |
|---|---|---|
| BP-01 Single responsibility | ✅ | TS generation only |
| BP-02 Defined trigger | ✅ | CONFIRM REVIEW received |
| BP-03 Defined output contract | ✅ | [App]_TS_[Date].md · all 9 sections |
| BP-04 Failure handling | ✅ | Partial TS with flagged gaps |
| BP-05 Human escalation | ✅ | §1 and §9 require human input |
| BP-06 Idempotency | ✅ | Same inputs → same TS every time |
| BP-07 Context isolation | ✅ | Reads /docs/ + SAP via MCP · writes /docs/ only |
| BP-08 Auditability | ✅ | TS saved · session log validator confirms |

---

## agentskills.io Compliance Status

| Skill | SKILL.md exists | Validated | Folder |
|---|---|---|---|
| DEWA_DESIGN | ✅ Yes | ✅ `npx skills-ref validate` passing | `.claude/skills/dewa-fiori-design/` |
| PROTOTYPE_EXPORT | ❌ Not needed | N/A — implemented as Node.js | `scripts/dewa-handoff-watch.js` |
| CODE_REVIEW | ✅ Yes | ✅ `npx skills-ref validate` passing | `.claude/skills/moro-code-review/` |
| TS_AUTOGEN | ❌ Not needed | N/A — implemented as template | `templates/TS_TEMPLATE.md` |

Both SKILL.md files generated using Claude Opus 4 with agentskills.io best practices.
Open standard — portable across Claude Code, GitHub Copilot, Cursor, VS Code, Gemini CLI.

---

## Summary Matrix

| Skill | Invocation | Confidence | Risk | LLM | BPs | Trigger readiness |
|---|---|---|---|---|---|---|
| DEWA_DESIGN | Invoked | 82% | Low | Sonnet 4 | 7/8 | ✅ Triggers today — Claude Design reads DESIGN.md, manual invocation |
| PROTOTYPE_EXPORT | Event-triggered | 91% | Low | N/A (Node.js) | 8/8 | ✅ Triggers today — dewa-handoff-watch.js fires on zip event, fully automatic |
| CODE_REVIEW | Always-on | 90% | Medium | Sonnet 4 | 7/8 | ⚠️ Semi-automatic — fires within Claude session, true always-on requires harness |
| TS_AUTOGEN | Forked | 88% | Low | Sonnet 4 | 8/8 | ⚠️ Semi-automatic — fires after CONFIRM REVIEW, parallel fork requires harness |

**Trigger readiness key:**
- ✅ **Triggers today** — works without harness infrastructure. Claude reads the .md file and executes.
- ⚠️ **Semi-automatic** — works within an active Claude session but requires the developer to be in the correct session context. True governance (always-on enforcement, iteration limit enforcement, eval scoring) requires the harness the Framework governance is building.
- ❌ **Requires harness** — not applicable to current skills, but future skills (subagents, plugins) will fall here.

---

## ADK Layer 3 — Formal Hook Registry

### Hook Event Types
ADK defines 5 event types. SessionStart and Stop require no matcher — they fire unconditionally.
PreToolUse and PostToolUse require a matcher specifying which tool to intercept.

| Event Type | Matcher Required | DEWA hook file | Stage | Purpose |
|---|---|---|---|---|
| `PreToolUse` | Yes — `Write\|Edit\|MultiEdit` | `pre-lint-gate.js` | 3, 4 | Blocks file write if lint fails |
| `PostToolUse` | Yes — `writeObjectSource` | `post-atc-check.js` | 5 | ATC check after ABAP write; reverts on fail |
| `SessionStart` | No | `session-start-handoff.js` | All | Loads handoff context before session begins |
| `Stop` | No | `stop-confirm-review.js` | 7 | Blocks unless CONFIRM REVIEW typed |
| `Stop` | No | `stop-approve-transport.js` | 9 | Blocks unless APPROVE TRANSPORT typed |

### Shared libraries (`lib/`)
| File | Used by | Purpose |
|---|---|---|
| `logger.js` | All hooks | Timestamp logging to session log |
| `sap-mcp.js` | `post-atc-check.js` | `syntaxCheck` + `runAtcCheck` wrappers |
| `git-helper.js` | `post-atc-check.js` | `autoCommit` per stage + branch validation |

### Wiring — `.claude/settings.json`
All 5 hooks registered under their event types. Claude Code reads this file automatically when `dewa-project/` is opened in VS Code.

---

## Known Gaps — Framework governance Roadmap

### Gap 1 — Hook contracts not yet formalised ✅ PARTIALLY RESOLVED
ADK Layer 3 hooks are now built and defined in `.claude/hooks/`.
Remaining step: Formal hook contracts with input schema · output schema · SLA · retry policy.
Hooks are built and functional — formal registration in Claude Code is next hackathon.

### Gap 2 — No plugin architecture
Framework is monolithic — all skills run in one Claude session.
Next step: Break into composable plugins other DEWA divisions can reuse.

### Gap 3 — No subagent design
Single agent handles all 11 stages.
Next step: Design specialist subagents — Frontend Agent · Backend Agent · Review Agent.
Each with its own context, tools, and iteration limits.

### Gap 4 — No LLM diversity strategy
All skills default to Sonnet 4.
Next step: Cost vs accuracy routing — Haiku for deterministic tasks,
Sonnet for standard generation, Opus for high-stakes judgment calls.

### Gap 5 — Knowledge normalisation
Framework understood deeply by 1 developer. Needs to be accessible to all SDLC roles.
Next step: Role-specific onboarding paths — Developer · Team Lead · Functional Consultant · QA.

### Gap 6 — Maturity matrix self-assessment
Framework has not been formally scored against an agentic SDLC maturity matrix.
Next step: Score each SDLC stage against maturity levels 1–5.
Current estimated overall maturity: Level 2 (Emerging) moving toward Level 3 (Defined).

---

> **End of SKILL_SPECIFICATIONS.md**
> Version 1.0 · For Framework governance review
> Next version will address Gap 1 (hook contracts) and Gap 3 (subagent design).
> Maintained by: Abdulsamee

---

## Fallback Strategy — Model Resilience per Skill

> **Per CAIO guidance:** In development the fallback strategy should happen.
> If model X is unreachable then transition to model Y.
> This logic is different based on different skills —
> fallback must maintain confidence, not just availability.

### Fallback Design Principles

1. **Confidence preservation** — fallback model must maintain skill confidence rating
2. **Skill-specific routing** — no global fallback; each skill defines its own chain
3. **SKILL.md portability** — fallback model must be able to read and apply the same SKILL.md
4. **Graceful degradation** — if fallback confidence drops below threshold, flag in output
5. **Harness responsibility** — this logic is executed by the harness, not by Claude

---

### Skill 1 — DEWA_DESIGN Fallback Chain

```
Primary:    Claude Sonnet 4
            Confidence: 82% | Strong layout + instruction-following + Arabic RTL

Fallback 1: Claude Opus 4
            Confidence: 85% (higher — better instruction depth)
            Trigger:    Sonnet 4 unreachable or rate-limited
            Note:       Higher cost — justify for design generation

Fallback 2: GPT-5.1
            Confidence: 75% (drops — DEWA token context less optimised)
            Trigger:    Both Claude models unreachable
            Note:       Emit WARNING in output:
                        "Fallback model active — verify DEWA token compliance manually"
                        Developer must re-validate token audit before Stage 2

Abort:      If GPT-5.1 also unreachable → halt Stage 1
            Notify developer: "Design model unavailable — retry later"
```

**Why Opus before GPT:** DEWA_DESIGN relies on SKILL.md token rules.
Claude models apply SKILL.md context more reliably than GPT for design-specific tasks.

---

### Skill 2 — PROTOTYPE_EXPORT Fallback Chain

```
Primary:    Node.js — dewa-handoff-watch.js
            No LLM involved in execution

Fallback 1: Retry the Node.js process (max 2 attempts)
            Trigger:    Watch script crashes or zip not detected

Fallback 2: Manual — Developer uses Session Start tab in Developer Toolkit
            Trigger:    Script fails after 2 retries
            Note:       Developer Toolkit has the 3 prompts ready
                        No model fallback needed — this is infrastructure, not AI

Abort:      Not applicable — manual fallback always available
```

---

### Skill 3 — CODE_REVIEW Fallback Chain

```
Primary:    Claude Sonnet 4
            Confidence: 90% | Strong ABAP pattern recognition + TypeScript

Fallback 1: Claude Opus 4
            Confidence: 93% (higher — deeper ABAP contextual reasoning)
            Trigger:    Sonnet 4 unreachable or rate-limited
            Note:       Preferred fallback — ABAP knowledge stays within Claude family
                        STY-11 edge cases benefit from Opus depth
                        SEC checks maintain full confidence on Opus

Fallback 2: GPT-5.5
            Confidence: 78% (drops — ABAP pattern IDs are DEWA-specific)
            Trigger:    Both Claude models unreachable
            Critical rule: SEC-01, SEC-02, SEC-06 checks MUST still run
                           CRITICAL findings must never be skipped regardless of model
            Note:       Emit WARNING in output:
                        "Fallback model active (GPT-5.5) — ABAP pattern confidence reduced.
                         Manually verify PERF-08, STY-11, and all SEC findings."
            Note:       review_report.md must include fallback model name and confidence warning

Abort:      If GPT-5.5 also unreachable → halt review
            Do NOT proceed to Stage 8 (TS generation) without completed review
            Notify developer: "Review model unavailable — transport blocked until review completes"
```

**Why ABAP confidence drops on GPT:**
PERF/STY rule IDs (PERF-01–08, STY-01–13) are DEWA-specific patterns.
GPT models can review ABAP but may not match the exact rule taxonomy.
SEC checks (SEC-01–06) are pattern-based and more portable across models.

---

### Skill 4 — TS_AUTOGEN Fallback Chain

```
Primary:    Claude Sonnet 4
            Confidence: 88% | Strong structured document assembly

Fallback 1: GPT-5.1
            Confidence: 86% (minimal drop — template-filling is model-agnostic)
            Trigger:    Sonnet 4 unreachable
            Note:       TS_AUTOGEN is the best candidate for cross-model fallback
                        generateWricefSpec (MCP) provides structured input
                        Template (TS_TEMPLATE.md) provides structured output format
                        GPT-5.1 handles structured assembly reliably

Fallback 2: GPT-4o
            Confidence: 82% (slight drop on narrative sections)
            Trigger:    GPT-5.1 also unreachable
            Note:       §1 (Business Requirement) narrative quality may reduce
                        All other sections are data assembly — confidence maintained
                        Flag in TS: "Generated with fallback model GPT-4o"

Abort:      If all models unreachable → save partial TS with PENDING markers
            Session log validator will flag incomplete sections
            Developer completes manually before transport release
```

**Why TS_AUTOGEN tolerates GPT best:**
Template-filling does not require SAP-specific reasoning.
MCP provides the data. Template provides the structure.
The model is just the assembler — any capable LLM can fill the template reliably.

---

### Fallback Summary Matrix

| Skill | Primary | Fallback 1 | Fallback 2 | Confidence at F2 | Abort behaviour |
|---|---|---|---|---|---|
| DEWA_DESIGN | Sonnet 4 | Opus 4 | GPT-5.1 | ~75% | Halt Stage 1 |
| PROTOTYPE_EXPORT | Node.js | Node.js retry | Manual (Developer Toolkit) | 100% | Never — manual always works |
| CODE_REVIEW | Sonnet 4 | Opus 4 | GPT-5.5 | ~78% | Halt — transport blocked |
| TS_AUTOGEN | Sonnet 4 | GPT-5.1 | GPT-4o | ~82% | Partial TS saved |

### Fallback Implementation Note

This fallback logic is executed by the **harness** — not by Claude.
The harness reads this specification and routes accordingly.
Each SKILL.md must be compatible with the fallback model:
- agentskills.io standard ensures SKILL.md portability across models
- Fallback model must receive identical SKILL.md context as primary
- Confidence warning must be appended to skill output when fallback is active

> **Status:** Fallback chains defined and ready.
> Awaiting harness infrastructure to enforce routing and confidence monitoring.

## v1.8.0 — 2026-05-23 · ADK Layer 3 — Hooks

### Added
- `.claude/hooks/` folder — ADK Layer 3 deterministic hook scripts:
  · `pre-lint-gate.js`          — PreToolUse: blocks Write/Edit if lint fails
  · `post-atc-check.js`         — PostToolUse: ATC check after writeObjectSource, reverts on fail
  · `session-start-handoff.js`  — SessionStart: loads handoff context on session open
  · `stop-confirm-review.js`    — Stop: blocks Stage 8 without CONFIRM REVIEW
  · `stop-approve-transport.js` — Stop: blocks Stage 9 without APPROVE TRANSPORT
  · `lib/logger.js`             — Shared timestamp logging utility
  · `lib/sap-mcp.js`            — Shared syntaxCheck + runAtcCheck wrappers
  · `lib/git-helper.js`         — Shared autoCommit per stage + branch check
- `.claude/settings.json`       — Claude Code hook wiring (event types + matchers)

### Updated
- CLAUDE.md §0 — SessionStart hook note (auto handoff context injection)
- CLAUDE.md §3.6 — PreToolUse hook note (lint gate enforced by code)
- CLAUDE_BACKEND.md §2 Step 4 — PostToolUse hook note (ATC gate after each writeObjectSource)
- CODEREVIEW.md §3 — Stop hook note (CONFIRM REVIEW enforced by code, not by Claude discipline)
- DEPLOY.md §6.2 — Stop hook note (APPROVE TRANSPORT enforced by code, irreversible transport gate)
- PROJECT_STRUCTURE.md — hooks folder added, ADK layers table added
- User Manual — hooks page added (event types with DEWA examples)

### Clarified
- SessionStart and Stop are ADK **event types** — not hooks themselves
- A hook = event type + matcher + command
- SessionStart and Stop have no matcher (fire unconditionally)
- PreToolUse and PostToolUse need a matcher (specify which tool to intercept)

---

## v1.7.0 — 2026-05-16 · Security + Fallback strategy

### Added
- CODEREVIEW.md §4 — DEWA Red Team Security standards (SEC-01–06)
- CODEREVIEW.md §5 — Standalone on-demand review mode
- SKILL_SPECIFICATIONS.md — Fallback strategy per skill:
  · DEWA_DESIGN:      Sonnet 4 → Opus 4 → GPT-5.1 (~75% at F2)
  · PROTOTYPE_EXPORT: Node.js → retry → manual (100%)
  · CODE_REVIEW:      Sonnet 4 → Opus 4 → GPT-5.5 (~78% at F2)
  · TS_AUTOGEN:       Sonnet 4 → GPT-5.1 → GPT-4o (~82% at F2)
- User Manual §3.5 — Security Standards & Runbooks page (p.15)
- User Manual §3.6 — Fallback Strategy page (p.16)
- User Manual: 27 → 28 pages · v1.6 → v1.7

### Per CAIO guidance
If model X is unreachable then transition to model Y.
Fallback logic is skill-specific — confidence must be preserved, not just availability.
Fallback routing executed by harness when available.

---

## v1.7.0 — 2026-05-16 · Security standards + standalone review

### Added
- CODEREVIEW.md §4 — DEWA Red Team Security standards (6 SEC rules):
  · SEC-01: Authorization object check (CRITICAL)
  · SEC-02: No hardcoded credentials or system URLs (CRITICAL)
  · SEC-03: No sensitive data in URL parameters (HIGH)
  · SEC-04: Input validation on all inbound OData payloads (HIGH)
  · SEC-05: Mandatory logging for sensitive operations (MEDIUM)
  · SEC-06: No bypass of SAP authorization framework (CRITICAL)
- CODEREVIEW.md §5 — Standalone on-demand review mode
  · Skill now executable on any repository at any time
  · Not limited to Stage 7 pipeline context
  · Categorised report: CRITICAL / HIGH / MEDIUM / LOW · Rule ID · File ref · Remediation
- SKILL_SPECIFICATIONS.md — CODE_REVIEW invocation type updated to ALWAYS-ON + INVOKED (dual mode)

### Per CAIO guidance
Review skill can be executed at any time on any code repository to review
the entire application against DEWA Red Team Security standards.

---

## v1.6.0 — 2026-05-16 · agentskills.io compliance

### Added
- `dewa-fiori-design` skill — agentskills.io compliant SKILL.md in `.claude/skills/dewa-fiori-design/`
  Captures DEWA knowledge of SAP Fiori design: tokens, RTL, screen patterns
- `moro-code-review` skill — agentskills.io compliant SKILL.md in `.claude/skills/moro-code-review/`
  Captures DEWA knowledge of SAP code review: 23 frontend + 21 ABAP patterns
- Both skills validated with `npx skills-ref validate` — passing
- `OPUS_SKILL_PROMPTS.md` — Opus 4 prompts used to generate skills
- `SKILL_SPECIFICATIONS.md` — formal skill definitions with confidence, evals, invocation types

### Changed
- CLAUDE.md §10 — skills folder reference added
- Skills count: 4 total (2 as agentskills.io SKILL.md + 2 as working implementations)
- Framework now portable across Claude Code, GitHub Copilot, Cursor, VS Code (agentskills.io standard)

### Architecture clarification
- prototype-export = dewa-handoff-watch.js (Node.js) — no SKILL.md needed
- ts-autogen = TS_TEMPLATE.md (Claude reads and follows) — no SKILL.md needed
- Only dewa-fiori-design and moro-code-review need formal SKILL.md files

---

## v1.5.0 — 2026-05-15 · Transport governance correction

### Changed — Breaking process change
- Claude in Chrome removed from MCP server list — was not used in the framework
- SAP CAP MCP Server added — search_docs (CDS/Node.js docs) + search_model (entity inspection) for CAP projects Stage 5
- Transport release separated from transport validation — different stages
- Stage 9 renamed: "Transport Validation" — validates objects, no release
- Stage 10 updated: "Deploy to DEV + Smoke Test" — deploy and verify in DEV first
- Stage 11 added: "Transport Release to QAS" — release ONLY after smoke test passes
- Human gates: 5 → 6 (Gate 6: confirm release + click Send after smoke test)
- Framework stages: 10 → 11
- DEPLOY.md §6 added: transport release process documentation
- CLAUDE_BACKEND.md §11 updated: trigger file written after smoke test, not after validation
- DEWA_Pipeline.html: Stage 9/10/11 updated, 6-gate summary, 11-stage header
- README.html: all counts updated, governance flow corrected
- User Manual: pages updated to reflect 11-stage framework

### Why this change matters
Previously transport was released at Stage 9 before deployment. This was incorrect —
releasing before smoke test meant a broken app could reach QAS with no DEV validation.
The correct flow: validate transport → deploy to DEV → smoke test → THEN release to QAS.
The Team Lead notification now only fires when DEV is confirmed working.

---

# CHANGELOG.md — DEWA SAP Agentic Development Framework
## Version History · AI Adoption Program

> **Maintained by:** Abdulsamee
> **Format:** Semantic versioning — MAJOR.MINOR.PATCH
> **Policy:** Every change to any .md file increments at minimum PATCH.
> A new stage or new tool increments MINOR. Breaking changes increment MAJOR.

---

## v1.4.0 — 2026-05-14 · Team Lead notification

### Added
- Team Lead email notification after transport release (Stage 9)
- `dewa-handoff-watch.js` extended — watches for `teamlead_notification_trigger.txt`
- Auto-builds Outlook .eml file containing: session log · changelog · TS document · review summary
- Opens Outlook pre-filled — developer clicks Send, one action
- `CLAUDE_BACKEND.md §11` — instruction for Claude to write trigger file after transport confirmed
- Environment variable `DEWA_TEAMLEAD_EMAIL` for Team Lead address configuration

### Changed
- Stage 9 now has automated email notification as final automated step
- Human gate 4 updated: "Release transport + click Send email"
- DEWA_Pipeline.html Stage 9 updated with email notification row

---

## v1.3.0 — 2026-05-13 · Submission release

### Added
- `CHANGELOG.md` — version history and evolution tracking (this file)
- `METRICS.md` — quantifiable KPI definitions and measured business impact
- `SESSION_LOG.md` — AI observability instruction template
- `CLAUDE.md §9` — session log instruction added
- KPI assessment scorecard added to `README.html` — 8 dimensions scored
- Folder structure section in `README.html` replaced with interactive expandable card system
- DEWA logo (transparent) added to `DEWA_Pipeline.html` header
- Skills and MCP server callouts added to every stage in framework widget

### Changed
- `CLAUDE_BACKEND.md` — companion file table updated to reflect final file set
- `README.html` — folder group header colors fixed for light background readability
- `DEWA_Pipeline.html` — title updated to "SAP Agentic Development Framework"
- `PROMPTS_BACKEND.md` renamed from `PROMPTSABAP.md` — matches reference in AGENTS_BACKEND.md

### Removed
- `AGENTS.md` — Claude-only setup, Copilot not in scope
- `AGENTS_BACKEND.md` — Claude-only setup
- `DEWA_Demo_Script.pptx` — replaced by live demo approach
- `DEWA_Pipeline_Presentation.pptx` — consolidated into README.html
- `dewa_hackathon_closing_slide.html` — consolidated

---

## v1.2.0 — 2026-05-13 · Full framework + automation

### Added
- `CLAUDE_BACKEND.md` — Claude backend session instructions (new, was missing)
- `INTEGRATION.md` — OData service to UI5 binding (new stage added to framework)
- `CODEREVIEW.md` — automated frontend + backend code review with CONFIRM REVIEW gate
- `DEPLOY.md` — On-Prem and BTP deployment flows with exact commands
- `TS_TEMPLATE.md` — Technical Specification auto-generation template
- `scripts/dewa-handoff-watch.js` — Node.js automation: export skill implemented as background script (hook chain runs as code, not Claude prompt)
- `scripts/dewa-handoff-watch.js` — Node.js automation: Downloads watch → extract → prompt → clipboard
- `scripts/package.json` — watch script dependencies
- 4 new framework stages added: Stage 6 (Bind), Stage 7 (Review), Stage 8 (TS), Stage 10 (Deploy)
- `generateWricefSpec` abap-mcp-server tool identified for TS auto-generation
- `reviewAbapCode` abap-mcp-server tool integrated into Stage 7
- Claude Design onboarding identified — DESIGN.md upload sets system once

### Changed
- `CLAUDE.md` — §8 added (prompt patterns moved from GUARDRAILS.md §11)
- `CLAUDE.md` — §2 companion table updated with all new files
- `GUARDRAILS.md` — §11 removed (prompt patterns now in CLAUDE.md §8)
- `DESIGN.md` — §10.8 button class hex error fixed: #B40D2B → #B00020
- Framework total: 7 stages → 10 stages
- Human gates: 3 → 5

### Fixed
- `DESIGN.md §10.8` — 3 button class entries had wrong error hex (#B40D2B vs #B00020)
- `GUARDRAILS.md §11` — AI prompt patterns were in wrong file (standards vs instructions)
- `CLAUDE_BACKEND.md` — missing file meant Claude had no auto-loaded backend rules

---

## v1.1.0 — 2026-05-12 · Standards files + ABAP refactor proof

### Added
- `DESIGN.md` — full DEWA design system tokens, typography, CSS scoping rules
- `GUARDRAILS.md` — coding standards §1–§10: FLP, Fiori Elements, OData, accessibility, i18n, performance, RAP, CAP
- `PROMPTS_BACKEND.md` (was PROMPTSABAP.md) — backend code examples and prompt patterns
- `VendorProfile_ABAP_Refactor_Metrics.pptx` — proof of concept: ZCL_ZSRM_CVI_SUP_P_INT_DPC_EXT refactored
- ABAP refactor results: 28 methods · 62% DB time saved · 21 RFC round-trips removed · 0 silent exceptions
- `DEWA_Pipeline.html` — interactive 10-stage framework widget (dark theme)

### Changed
- `AGENTSABAP.md` renamed companion reference from PROMPTSABAP.md → PROMPTS_BACKEND.md
- Session start checklist in CLAUDE.md expanded from 5 → 8 steps

### Proved
- abap-mcp-server:reviewAbapCode demonstrated on production class
- abap-mcp-server:runAtcCheck validated zero violations post-refactor
- abap-mcp-server:writeObjectSource wrote refactored code back to S/4HANA

---

## v1.0.0 — 2026-05-11 · Initial pipeline foundation

### Added
- `CLAUDE.md` — frontend agent instructions: session checklist, generation workflow §3, forbidden patterns §5, reusable controls §4
- `AGENTSABAP.md` — backend agent rules: RAP generation order, naming conventions, EML rules, BDEF rules
- Basic 7-stage pipeline concept defined:
  - Stage 1: Prototype (claude.ai chat)
  - Stage 2: Scaffold UI5
  - Stage 3: Lint gate
  - Stage 4: OData service
  - Stage 5: Code review (manual)
  - Stage 6: Transport
  - Stage 7: Deploy
- DEWA project folder structure established at `C:\Users\lenovo\Documents\dewa-project\`
- abap-mcp-server connection confirmed to DEWA S/4HANA 2023 FPS01+
- SAPUI5 MCP Server + SAP Fiori MCP Server confirmed in VS Code

### Known gaps at v1.0.0 (resolved in v1.1+)
- No DESIGN.md — tokens were being specified in prompts (inefficient)
- No CLAUDE_BACKEND.md — Claude had no auto-loaded backend rules
- No automated handoff between Claude Design and Claude Code
- No TS auto-generation
- No deployment instructions

---

> **End of CHANGELOG.md**
> Next version will increment when:
> - A new .md file is added to the framework
> - A new MCP tool is integrated
> - A new agentic skill or hook chain is defined
> - Any breaking change to the file structure is made
> - A new S/4HANA release changes RAP or CDS syntax rules

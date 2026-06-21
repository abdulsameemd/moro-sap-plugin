# DEWA SAP Agentic Development Framework

> **v1.6 · May 2026 · Internal Use Only**
> Dubai Electricity & Water Authority (PJSC) — SAP Centre of Excellence

---

## Overview

The DEWA SAP Agentic Development Framework is a complete, agentic delivery pipeline for SAP Fiori, ABAP RAP, and CAP applications. It eliminates manual steps between design and transport release using 4 MCP servers, 4 agentic skills, and a Node.js watch script — governed by 6 human decision gates.

| Metric | Value |
|---|---|
| Stages | 11 |
| Human gates | 6 |
| MCP servers | 4 |
| Agentic skills | 4 |
| Estimated delivery time reduction | ~75% per app |
| Estimated TS documentation effort reduction | ~80% |
| Estimated code review effort reduction | ~70% |
| Standards consistency | 100% |

---

## 11-Stage Pipeline

| # | Stage | Tools | Output |
|---|---|---|---|
| **01** | **Prototype Design** | Claude Design · SAP Fiori MCP · ⚡ DEWA_DESIGN | Approved Fiori prototype |
| 02 | Export → Handoff | dewa-handoff-watch.js · ⚡ PROTOTYPE_EXPORT | Prompt in clipboard · VS Code open |
| 03 | Scaffold + Build UI5 | SAPUI5 MCP · SAP Fiori MCP · CLAUDE.md | TypeScript UI5 app · i18n EN+AR |
| 04 | Lint Gate | SAPUI5 MCP: run_ui5_linter · run_manifest_validation | Zero linter errors confirmed |
| 05 | OData V4 via RAP | abap-mcp-server · CLAUDE_BACKEND.md · 14 artefacts | Service binding activated in SAP |
| 06 | Bind Service → UI5 | INTEGRATION.md · manifest.json · $metadata verify | End-to-end data flow confirmed |
| **07** | **Code Review** | CODEREVIEW.md · reviewAbapCode · ⚡ CODE_REVIEW | review_report.md · CONFIRM REVIEW |
| 08 | Generate TS | generateWricefSpec · TS_TEMPLATE.md · ⚡ TS_AUTOGEN | [App]_TS_[Date].md |
| 09 | Transport Validation | listTransports · validateTransport · write TR to TS | Transport validated · not yet released |
| **10** | **Deploy DEV + Smoke Test** | DEPLOY.md · ui5 build · ADT · BSP · ICF · FLP | App live in DEV · smoke test passed |
| **11** | **Transport Release to QAS** | APPROVE TRANSPORT · watch script · Outlook · SAP STMS | TL notified · transport imported to QAS |

---

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Claude Code (VS Code extension) | Latest | Primary development environment |
| Node.js | 18+ | Required for dewa-handoff-watch.js |
| claude.ai account | Pro or Team | Claude Design for prototyping |
| S/4HANA system access | 2023 FPS01+ | abap-mcp-server ADT connection |
| Microsoft Outlook | 365 | Team Lead notification emails |
| Git | 2.x+ | Version control per DEPLOY.md §5 |

---

## Folder Structure

```
dewa-project/                  ← open this in VS Code
├── .claude/skills/
│   ├── dewa-fiori-design/SKILL.md   ← validated ✅
│   └── moro-code-review/SKILL.md    ← validated ✅
├── CLAUDE.md                  ← Claude reads at session start
├── CLAUDE_BACKEND.md
├── DESIGN.md  GUARDRAILS.md  SAP_CLEAN_CORE.md
├── INTEGRATION.md  CODEREVIEW.md  DEPLOY.md
├── PROMPTS_BACKEND.md  CHANGELOG.md  METRICS.md
├── scripts/ → dewa-handoff-watch.js  package.json
├── templates/ → TS_TEMPLATE.md  SESSION_LOG.md
└── docs/     → auto-generated pipeline outputs
```

---

## 4 MCP Servers

| Server | Key Tools | Stages |
|---|---|---|
| **SAP Fiori MCP Server** | list_fiori_apps · get_functionality_details | 1, 3 |
| **SAPUI5 MCP Server** | create_ui5_app · run_ui5_linter · run_manifest_validation · get_guidelines | 3, 4 |
| **abap-mcp-server** | generateAbapCode · reviewAbapCode · generateWricefSpec · syntaxCheck · runAtcCheck · writeObjectSource · listTransports · validateTransport | 5, 7, 8, 9 |
| **SAP CAP MCP Server** | search_docs · search_model | 5 |

---

## One-Time Setup

```powershell
# 1. Install watch script dependencies
cd dewa-project/scripts
npm install chokidar unzipper fs-extra open

# 2. Connect all 4 MCP servers in VS Code Claude Code settings

# 3. Set up DEWA design system
#    claude.ai → Design → upload DESIGN.md → name it "DEWA"

# 4. Open project in VS Code
code C:\Users\[name]\Documents\dewa-project

# 5. Set Team Lead email and run watch script
$env:DEWA_TEAMLEAD_EMAIL="tl@dewa.gov.ae"
node dewa-handoff-watch.js
```

---

## 4 Agentic Skills

### ⚡ DEWA_DESIGN — Prototype Skill (Stage 1)
Triggered by selecting the DEWA design system in Claude Design. All DEWA tokens applied automatically.

**Hook chain:** Load Design System → Generate Prototype → Token Validation → **[Gate] Developer Approval**

### ⚡ PROTOTYPE_EXPORT — Handoff Skill (Stage 2)
Implemented as `dewa-handoff-watch.js`. Triggered when Claude Design zip lands in Downloads. Zero manual steps.

**5-hook chain:** Detect Zip → Auto-Extract → Control Map → Token Check → Build Prompt → clipboard

### ⚡ CODE_REVIEW — Review Skill (Stage 7)
23 frontend checks + 8 PERF + 13 STY ABAP patterns. Ends with hard gate — no TS generated without `CONFIRM REVIEW`.

**6-hook chain:** Frontend Review → Backend Review → Auto-Fix → ATC Re-check → Report + Save → **[Gate] CONFIRM REVIEW**

| Check group | Coverage |
|---|---|
| CSS (C1–C6) | #app scope · logical props · no CDN font · DESIGN.md tokens only |
| Views (V1–V7) | i18n keys · no SimpleForm · OData types · aria labels |
| Controllers (T1–T7) | No DOM · Router navTo · Fragment.load · error handlers |
| i18n (I1–I3) | EN + AR parity · key naming · no raw keys in UI |
| PERF-01–08 | SELECT projection · lines() · VALUE# · redundant CLEAR · single RFC |
| STY-01–13 | Silent cx_root · NEW # · FINAL · READ TABLE · CORRESPONDING |

### ⚡ TS_AUTOGEN — Documentation Skill (Stage 8)
Triggered automatically after `CONFIRM REVIEW`. Uses `generateWricefSpec` as primary data source — no manual documentation needed.

**5-hook chain:** generateWricefSpec → Read Review → Read Linter → Fill Template → Save TS

---

## 6 Human Gates

| # | Gate | Who | Action |
|---|---|---|---|
| 1 | Approve prototype | Developer | Review Claude Design output → approve before any code begins |
| 2 | CONFIRM | Developer | Paste clipboard prompt into Claude Code → type `CONFIRM` |
| 3 | CONFIRM REVIEW | Developer | Read review_report.md → type `CONFIRM REVIEW` — hard gate |
| 4 | Confirm transport validated | Developer | Review listTransports output — confirm all objects on transport |
| 5 | Smoke test in DEV | Developer | App loads · OData responds · RTL · Arabic · dark theme confirmed |
| 6 | Transport release + Send email | Developer | Type `APPROVE TRANSPORT` → Outlook opens pre-filled → click Send |

---

## DEWA Design Tokens (Quick Reference)

```
Primary Green (CTA, active, success):   #007560
Primary Variant (hover, links):         #004937
Active Background (selected):           #E5F1EF
Error:                                  #B00020
Alert Yellow (warning only):            #FFC600
Card Surface:                           #FFFFFF
Input Background:                       #F2F3F3
Secondary Text:                         #6F6F6F
Primary Text:                           #222222

Radius — Input fields:   5px
Radius — Cards:         15px
Radius — Hero sections: 20px
Radius — Buttons:      100px  (.sapMPageContent only)
```

---

## RAP 14-Artefact Order

```
1. DB table          2. Interface CDS      3. Root CDS
4. Projection CDS    5. Metadata ext       6. DCL
7. Interface BDEF    8. Projection BDEF    9. BP class
10. LHC             11. LSC               12. Unit tests
13. Service def     14. Service binding
```

---

## SAP Clean Core — ABAP Tier Model

| Tier | Target | Allowed |
|---|---|---|
| **Tier 1** | ABAP Cloud / S/4HANA Cloud | Released APIs only · RAP · CDS · EML · no classic statements |
| **Tier 2** | S/4HANA On-Prem (released) | Tier 1 + additional released on-prem APIs |
| **Tier 3** | On-Prem only — minimise | Full classic ABAP · document all Tier 3 usage |

**Forbidden in Cloud (Claude never generates):** `CALL FUNCTION` · `CALL TRANSACTION` · `SUBMIT` · `COMMIT WORK` · `ROLLBACK WORK` · Direct `INSERT/UPDATE/DELETE` on SAP tables

---

## Git Strategy

```bash
# One branch per app delivery
git checkout -b feature/VendorProfile

# Claude commits automatically per stage
feat: scaffold VendorProfile UI5 app        ← Stage 3
feat: RAP service VendorProfile generated   ← Stage 5
review: code review complete                ← Stage 7
release: transport DEVK9A00042 ready        ← Stage 9
```

**4 multi-developer conflict prevention rules:**
1. One entity per branch — files never collide
2. Shared CDS via interface layer — no duplicate interface views
3. `/docs/` isolation by app name — never same filename
4. Merge window — one transport to QAS per week max

---

## 13 Configuration Files

| File | Purpose |
|---|---|
| `CLAUDE.md` | Session instructions · workflow · forbidden patterns · prompt patterns · Git commits |
| `CLAUDE_BACKEND.md` | RAP 14-artefact order · naming · 28-point checklist · TL email trigger |
| `DESIGN.md` | DEWA color tokens · Dubai font · radius system · CSS scoping · RTL rules |
| `GUARDRAILS.md` | Coding standards §1–§10: FLP · OData · accessibility · i18n · RAP · CAP |
| `INTEGRATION.md` | OData V4 dataSource URI · ui5.yaml proxy · $metadata verification |
| `CODEREVIEW.md` | 23 frontend checks · 8 PERF + 13 STY backend patterns · CONFIRM REVIEW gate |
| `DEPLOY.md` | On-Prem (ADT→BSP→ICF) and BTP (mbt→cf push→CDM) · Git strategy |
| `SAP_CLEAN_CORE.md` | Tier 1/2/3 model · forbidden Cloud statements · 12-point checklist |
| `templates/TS_TEMPLATE.md` | TS auto-fill instructions §1–§9 |
| `PROMPTS_BACKEND.md` | Developer copy-paste library for RAP/CAP |
| `CHANGELOG.md` | Version history v1.0–v1.6 |
| `METRICS.md` | Quantifiable KPIs · measured ABAP refactor results |
| `templates/SESSION_LOG.md` | AI observability template — Claude auto-fills at session end |

---

## Troubleshooting

| Problem | Stage | Resolution |
|---|---|---|
| Watch script doesn't detect zip | Stage 2 | Confirm the script is running. Check zip filename contains "claude-design", "handoff", or "dewa". |
| App name shows as "DEWA App" | Stage 2 | Add a `<title>` tag to the Claude Design prototype HTML. |
| run_ui5_linter errors on first file | Stage 4 | Claude auto-fixes and re-runs. Check GUARDRAILS.md §1–§4 if errors persist. |
| ATC violations after auto-fix | Stage 5/7 | PERF-08 or STY-11 require developer decision — flag them explicitly. |
| $metadata returns 404 | Stage 6 | Confirm service binding is activated in SAP (/IWFND/MAINT_SERVICE). |
| CONFIRM REVIEW not accepted | Stage 7 | Check /docs/review_report.md exists before typing the gate phrase. |
| Outlook doesn't open .eml file | Stage 9 | Double-click /docs/teamlead_notification.eml manually. Ensure Outlook is default .eml handler. |
| validateTransport finds conflicts | Stage 9 | Reassign objects via SE09. Common cause: objects not locked before generation. |

---

## Skill Compliance

| Skill | Standard | Status |
|---|---|---|
| `dewa-fiori-design` | agentskills.io open standard | ✅ skills-ref passing |
| `moro-code-review` | agentskills.io open standard | ✅ skills-ref passing |
| `prototype-export` | Node.js implementation | ✅ Working — scripts/dewa-handoff-watch.js |
| `ts-autogen` | Template implementation | ✅ Working — templates/TS_TEMPLATE.md |

---

## Revision History

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-05-11 | Initial framework — CLAUDE.md + GUARDRAILS.md + basic 7-stage concept |
| 1.1 | 2026-05-12 | Added DESIGN.md, ABAP refactor proof of concept |
| 1.2 | 2026-05-13 | Full 10-stage framework, CLAUDE_BACKEND.md, watch script, all skills |
| 1.3 | 2026-05-13 | SAP_CLEAN_CORE.md, CHANGELOG.md, METRICS.md, SESSION_LOG.md |
| 1.4 | 2026-05-14 | Team Lead email notification, Git strategy, session log validator |
| 1.5 | 2026-05-15 | Stage 11 added — transport release separated from validation. 6 human gates. |
| 1.6 | 2026-05-16 | agentskills.io compliant skills added — dewa-fiori-design + moro-code-review. Validated with npx skills-ref validate. |

---

**Classification:** Internal Use Only — Dubai Electricity & Water Authority (PJSC)
**Distribution:** SAP Centre of Excellence · Digital Solutions and Services · Innovation and the Future
**Framework owner:** Abdulsamee — maintain CHANGELOG.md when any .md file changes

# CLAUDE_BACKEND.md — DEWA Backend Agent Instructions (Claude)
## ABAP · CDS · OData · RAP · CAP

> **Maintained by:** Abdulsamee
> This file is the Claude equivalent of `AGENTS_BACKEND.md`.
> Claude reads this automatically in VS Code, CLI, and Desktop clients for backend sessions.
> Content mirrors `AGENTS_BACKEND.md` — both files must be kept in sync when either changes.
>
> **Companion files:**
> - Frontend instructions → `CLAUDE.md`
> - Frontend rules (Copilot) → `AGENTS.md`
> - Design tokens → `DESIGN.md`
> - Full coding standards → `GUARDRAILS.md`
> - Clean Core compliance → `SAP_CLEAN_CORE.md`
> - Backend rules (Copilot) → `AGENTS_BACKEND.md`
> - Code examples + prompt patterns → `PROMPTS_BACKEND.md`
>
> **SAP version baseline:**
> - S/4HANA On-Premise: 2023 FPS01 and above
> - S/4HANA Cloud Public Edition: 2402 and above
> - ABAP Cloud: ABAP for Cloud Development (Tier 1 — released APIs only)
> - CAP Node.js: @sap/cds 7.x and above

---

## 0. Session Start — Do This Before Any Backend Code

| # | Step | Done? |
|---|---|---|
| 1 | Read `AGENTS_BACKEND.md` in full — all naming conventions, rules, and generation order | ☐ |
| 2 | Read `GUARDRAILS.md` §9 (RAP) and §10 (CAP) — full coding standards | ☐ |
| 3 | Read `SAP_CLEAN_CORE.md` — Tier model, released API rules, forbidden statements | ☐ |
| 4 | Confirm **deployment target**: S/4HANA On-Prem · S/4HANA Cloud · BTP | ☐ |
| 5 | Confirm **ABAP tier**: Tier 1 (Cloud) · Tier 2/3 (On-Prem) | ☐ |
| 6 | Confirm **backend model**: RAP · CAP · Both | ☐ |
| 7 | Confirm **OData version**: V4 (new) · V2 (legacy maintenance only) | ☐ |
| 8 | Confirm **CRUD scope**: C · R · U · D · Actions · Functions | ☐ |
| 9 | Confirm **draft handling**: required · not required | ☐ |
| 10 | Confirm **entity structure**: root only · root + child | ☐ |

**Do not write any code until all steps are confirmed.**

> **DEWA confirmed defaults — do not re-ask these in a session:**
> - Targets: S/4HANA On-Prem + S/4HANA Cloud (both active)
> - On-Prem: Tier 2/3 permitted · Cloud: Tier 1 only
> - New OData services: V4 via RAP only · V2 for legacy maintenance only
> - Draft handling: never add without explicit request
> - `strict ( 2 )` mandatory on all BDEFs

---

## 1. Backend Technology Scope

> This file covers backend only. Frontend, SAPUI5, CSS, and i18n rules live in `CLAUDE.md` and `GUARDRAILS.md` §1–§8.

| Technology | Status | Key Rule |
|---|---|---|
| ABAP — Classic (Tier 2/3) | ✅ On-Prem only | Full ABAP language permitted. Prefer RAP over classic patterns for all new dev. |
| ABAP — Cloud (Tier 1) | ✅ Cloud only | Released APIs only. Never `CALL FUNCTION`, `SUBMIT`, `CALL TRANSACTION`, direct DB DML. |
| CDS View Entities | ✅ Primary | Always `define view entity` — never classic `define view`. |
| RAP (RESTful ABAP Programming Model) | ✅ Primary for OData V4 | `managed` + `strict ( 2 )` mandatory. EML only — no direct DML on backing tables. |
| CAP (Cloud Application Programming Model) | ✅ BTP / Cloud | `@sap/cds 7.x`. Class-based `ApplicationService`. `req.error()` not `throw`. `cds.log()` not `console.log()`. |
| OData V4 | ✅ All new services | Via RAP service binding `_O4`. Never hand-write OData service classes. |
| OData V2 | 🔶 Legacy maintenance only | No new V2 services. Existing V2 apps: maintenance permitted. |
| COMMIT WORK | ⛔ Forbidden in RAP | Always `COMMIT ENTITIES`. |
| Direct INSERT/UPDATE/DELETE on RAP tables | ⛔ Forbidden | EML only (`MODIFY ENTITIES` / `READ ENTITIES`). |

---

## 2. Generation Workflow

Follow this order every session. Never skip or reorder steps.

### Step 1 — Confirm Context Before Writing Anything

Check deployment target and tier. Tier drives everything — generating Tier 2/3 syntax for a Cloud target causes activation errors that cannot be fixed without a full rewrite.

### Step 2 — RAP: Always Follow the Generation Order

Never generate artefacts out of sequence. Each layer depends on the one above it.

```
1.  Transparent DB table              ZXX_[Description]
2.  Draft table (if required)         ZXX_[Description]_D
3.  Interface CDS view entity         ZXX_I_[Description]
4.  Root CDS view entity              ZXX_R_[Description]
5.  Consumption / Projection view     ZXX_C_[Description]
6.  CDS Metadata extension            ZXX_C_[Description]_M
7.  CDS Access Control (DCL)          same name as projection view
8.  Interface BDEF                    same name as root view
9.  Projection BDEF                   same name as projection view
10. Behavior pool class               ZCL_[XX]_BP_[Description]
11. Local handler class (LHC_)        inside Local Types tab of BP
12. Local saver class (LSC_)          inside Local Types tab of BP
13. Service definition                Z[XX]_SD_[Description]
14. Service binding                   Z[XX]_UI_[Description]_O4 (Fiori)
                                      Z[XX]_API_[Description]_O4 (Web API)
```

### Step 3 — CAP: Always Follow the Generation Order

```
1. Schema CDS entity      db/schema.cds
2. Service definition     srv/[domain]-service.cds
3. Service handler JS     srv/[domain]-service.js
   - before handlers (validation)
   - after/each handlers (enrichment + criticality)
   - on handlers (actions + functions)
4. Authorization roles    xs-security.json
5. Initial test data      db/data/[Namespace.Entity].csv
6. Unit tests             test/[domain].test.js
```

### Step 4 — One Artefact at a Time

> **ADK Hook — PostToolUse:** `.claude/hooks/post-atc-check.js` enforces this automatically.
> After every `writeObjectSource` call, ATC runs immediately.
> If violations found → hook returns exit 1 → Claude is blocked → must fix before next artefact.
> If critical violation → hook reverts to previous version via `writeObjectSource`.
> This gate is enforced by code — Claude cannot skip it even if prompted to rush.

Never batch multiple artefacts in a single response. Generate one, confirm it activates cleanly, then proceed to the next. Batching hides dependency errors.

### Step 5 — Always Include ABAP Unit Test Stub

Every handler class generation must include a corresponding `ltc_[entityname]_test FOR TESTING RISK LEVEL HARMLESS DURATION SHORT` class covering at least: valid path and invalid path for each validation method.

---

## 3. DEWA Naming Quick-Reference

Full naming conventions in `AGENTS_BACKEND.md §1.2`. Critical patterns:

| Object | Pattern | Example |
|---|---|---|
| DB table | `ZXX_[Description]` | `ZFI_BillingItem` |
| Interface CDS view | `ZXX_I_[Description]` | `ZFI_I_BillingItem` |
| Root CDS view | `ZXX_R_[Description]` | `ZFI_R_BillingItem` |
| Projection CDS view | `ZXX_C_[Description]` | `ZFI_C_BillingItem` |
| Behavior pool | `ZCL_[XX]_BP_[Description]` | `ZCL_FI_BP_BillingItem` |
| Local handler | `LHC_[Description]` | `LHC_BillingItem` |
| Service definition | `Z[XX]_SD_[Description]` | `ZFI_SD_BillingItem` |
| Service binding (UI) | `Z[XX]_UI_[Description]_O4` | `ZFI_UI_BillingItem_O4` |
| Custom ABAP class | `ZCL_[Description]` | `ZCL_InvoiceProcessor` |

**Variable prefixes (always):** `lv_` `ls_` `lt_` `lo_` `lc_` `lx_` for local · `gv_` `gs_` `gt_` `go_` `gc_` for global · `<lfs_>` for field symbols.

**CDS field aliases:** Always UpperCamelCase / PascalCase. Never technical names like `EBELN`. Boolean fields prefix with `Is` or `Has`.

---

## 4. What Claude Must Always Generate (Backend)

| Rule | RAP | CAP |
|---|---|---|
| `strict ( 2 );` | ✅ Every BDEF | — |
| `managed` implementation | ✅ Default | — |
| Both `failed` and `reported` filled | ✅ Every handler | — |
| `IN LOCAL MODE` on every EML call | ✅ Every handler | — |
| `mapping for ... corresponding` block | ✅ Every BDEF | — |
| `field ( readonly )` on keys + admin fields | ✅ Every BDEF | — |
| ABAP Unit test stub | ✅ With every handler | — |
| `managed + cuid` aspects | — | ✅ Every entity |
| `return super.init()` | — | ✅ Class-based impl |
| `req.error()` not `throw` | — | ✅ All business errors |
| `cds.log()` not `console.log()` | — | ✅ All logging |
| CDS fluent API only | — | ✅ All DB access |
| `COMMIT ENTITIES` not `COMMIT WORK` | ✅ Every save sequence | — |
| `define view entity` not `define view` | ✅ All CDS | — |
| Expose projection views only in service | ✅ Always | ✅ Always |
| `StatusCriticality` computed in interface view | ✅ Never in projection | — |
| `@requires: 'authenticated-user'` on service | — | ✅ Every service |
| `@restrict` per entity | — | ✅ Every entity |

---

## 5. What Claude Must Never Generate (Backend)

| Forbidden | Context | Reason |
|---|---|---|
| `with draft` without explicit request | RAP BDEF | Requires full draft infrastructure |
| `@odata.draft.enabled` without explicit request | CDS annotation | Same reason |
| `COMMIT WORK` | RAP handler | Must use `COMMIT ENTITIES` |
| Direct `INSERT` / `UPDATE` / `DELETE` on backing table | RAP | EML only |
| `implementation {managed}` | RAP BDEF | Obsolete — use short form `managed;` |
| `define view` (classic) | CDS | Use `define view entity` |
| Empty `failed` or `reported` | RAP handler | Both must always be filled |
| Tier 2/3 statements in Cloud | ABAP | Tier 1 only |
| `CALL FUNCTION` in Cloud ABAP | ABAP Cloud | Not released — use class-based APIs |
| Interface views exposed in service binding | OData | Always expose projection views |
| Raw SQL strings | CAP | CDS fluent API only |
| `console.log` | CAP handler | Use `cds.log()` |
| `throw new Error` for business errors | CAP | Use `req.error()` |
| `@open` service | CAP | Never unauthenticated |
| Criticality computed in projection view | CDS | Always in interface / root view |

---

## 6. DEWA Criticality Color Mapping

Apply consistently across RAP interface views and CAP `after('each')` handlers:

| Value | Meaning | DEWA Color Token | Hex |
|---|---|---|---|
| `3` | Positive / Paid / Success | `color-primary-light` | `#007560` |
| `2` | Critical / Warning / Pending | `color-alert-yellow-light` | `#FFC600` |
| `1` | Negative / Error / Overdue | `color-error-light` | `#B00020` |
| `0` | Neutral / Unknown | `color-text-secondary-600-light` | `#6F6F6F` |

**RAP** — compute in interface/root view as `case...end` field. Mark `@UI.hidden: true` in projection view.
**CAP** — compute in `after('each')` handler. Never in the CDS schema.

---

## 7. Prompt Patterns — Copy-Paste Ready

For full code examples see `PROMPTS_BACKEND.md`. These are the session-ready prompt templates.

### 7.1 Session Start

```
Read CLAUDE_BACKEND.md and AGENTS_BACKEND.md in full before generating any code.

Confirm before proceeding:
- Deployment target (S/4HANA On-Prem / Cloud / BTP)
- ABAP tier (Tier 1 Cloud / Tier 2-3 On-Prem)
- Backend model (RAP / CAP / Both)
- OData version (V4 / V2 legacy)
- CRUD scope (C / R / U / D / Actions / Functions)
- Draft handling (Yes / No — default No)
- Entity structure (root only / root + child)

Do not generate any code until all are confirmed.
```

### 7.2 Generate RAP Interface View

```
Generate a RAP interface CDS view entity for [EntityName].

Rules (AGENTS_BACKEND.md §1.2 + GUARDRAILS.md §9):
- Name: ZXX_I_[Description] — e.g. ZFI_I_BillingItem
- define root view entity
- All field aliases UpperCamelCase / PascalCase — never technical ABAP names
- Criticality computed as case...end field here — never in projection
- Include all 5 managed admin fields: created_at, created_by, last_changed_at, last_changed_by, local_last_changed_at
- @AbapCatalog.viewEnhancementCategory: [#NONE] mandatory
- Association to child entity if root + child structure

DB table: ZXX_[TableName]
Fields: [list field names and types]
Status values for criticality: [list values]
```

### 7.3 Generate RAP Projection View

```
Generate a RAP projection CDS view entity for ZXX_R_[EntityName].

Rules (AGENTS_BACKEND.md §2.3 + GUARDRAILS.md §9):
- define root view entity ZXX_C_[EntityName]
- provider contract transactional_query
- @Metadata.allowExtensions: true
- @UI.headerInfo with typeName, typeNamePlural, title, description
- @UI.lineItem on every List Report column (position, label, criticality where applicable)
- @UI.identification on every Object Page field (position)
- @UI.selectionField on filter bar fields (position)
- @UI.facet for Object Page section structure (FieldGroup + Reference pattern)
- @UI.hidden: true on StatusCriticality and all technical fields
- @EndUserText.label EN and AR for every field
- Do NOT add @odata.draft.enabled unless I explicitly ask

List Report columns: [fields + positions]
Object Page sections: [section descriptions]
Filter bar fields: [fields]
```

### 7.4 Generate Managed BDEF

```
Generate a managed RAP BDEF for ZXX_R_[EntityName].

Rules (AGENTS_BACKEND.md §4 + GUARDRAILS.md §9):
- managed implementation in class ZCL_[XX]_BP_[EntityName] unique;
- strict ( 2 );
- Do NOT add "with draft" unless I explicitly ask
- persistent table: ZXX_[TableName]
- lock master / total etag LastChangedAt / authorization master ( instance )
- etag master LocalLastChangedAt
- field ( readonly ) on all key fields and all admin fields
- field ( mandatory ) on: [list mandatory fields]
- Determination: setInitialStatus on modify { create; }
- Validation: validate[FieldName] on save { create; update; field [FieldName]; }
- Action: [ActionName] with parameter [InputType] result [1] $self
- Full mapping for ... corresponding block

Generate projection BDEF immediately after:
use create; use update; use delete; use action [ActionName];
```

### 7.5 Generate Handler Class

```
Generate the RAP behavior pool class and local handler class for ZCL_[XX]_BP_[EntityName].

Rules (AGENTS_BACKEND.md §4 + §1.3 + GUARDRAILS.md §9):
- Abstract pool class: ZCL_[XX]_BP_[EntityName] DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR
- Local handler: lhc_[EntityName] INHERITING FROM cl_abap_behavior_handler
- Every EML call: IN LOCAL MODE mandatory
- Every handler: fill both failed-[entity] and reported-[entity]
- Reported entries: %element-[FieldName] = if_abap_behv=>mk-on
- Authority check: AUTHORITY-CHECK OBJECT 'ZXX_[AuthObject]' ID 'ACTVT' FIELD '[code]'
- Always COMMIT ENTITIES — never COMMIT WORK

Also generate unit test class:
ltc_[entityname]_test FOR TESTING RISK LEVEL HARMLESS DURATION SHORT
Cover: valid path + invalid path for each validation method.
```

### 7.6 Generate CAP Schema + Service

```
Generate a CAP CDS schema and service for [domain].

Schema rules (AGENTS_BACKEND.md §5.1 + GUARDRAILS.md §10):
- Namespace: com.dewa.[domain]
- All entities: cuid + managed aspects
- Status field: @assert.range enum — values: [list values]
- not null on all required fields
- Child relationship: Composition of many [ChildEntity]

Service rules:
- @path: '/[domain]'
- @requires: 'authenticated-user'
- @restrict per entity: [RoleName](READ), [RoleName](READ/CREATE/UPDATE), [RoleName](*)
- Expose projections only — never base entities
- Action: [actionName]([params]) returns [Entity]

Entities: [list entities and fields]
```

### 7.7 Generate CAP Handler

```
Generate the CAP service handler JS for [ServiceName].

Rules (AGENTS_BACKEND.md §5.3 + GUARDRAILS.md §10):
- Class extends cds.ApplicationService — always return super.init() at end
- before('CREATE', 'UPDATE'): validate — [list rules]
- before('DELETE'): guard — [list conditions]
- after('each'): enrich StatusCriticality:
  [StatusValue1]=3(#007560), [StatusValue2]=2(#FFC600), [StatusValue3]=1(#B00020), [StatusValue4]=0(#6F6F6F)
- on('[ActionName]'): 1.Read · 2.Validate state · 3.Update · 4.cds.log · 5.Return updated

Error handling:
- req.error(400, message, fieldTarget) — validation
- req.error(403, message) — authorization
- req.error(404, message) — not found
- req.error(409, message) — state conflict
- Never throw new Error for business errors
- Never console.log — always cds.log('ServiceName').info/error/warn

CQL — CDS fluent API only. Never raw SQL.
```

---

## 8. Common Failure Patterns — Prevention

Add the relevant phrase to your prompt to avoid these recurring errors.

| Failure | Add this to your prompt |
|---|---|
| `with draft` added silently | "Do NOT add with draft unless I explicitly ask" |
| `COMMIT WORK` used | "Always COMMIT ENTITIES — never COMMIT WORK" |
| Missing `failed` or `reported` | "Always fill both failed-[entity] and reported-[entity] in every handler" |
| `IN LOCAL MODE` omitted | "All EML calls in handlers must use IN LOCAL MODE" |
| Direct DML on backing table | "Never INSERT/UPDATE/DELETE on RAP backing tables — EML only" |
| `strict ( 2 )` omitted | "strict ( 2 ) is mandatory on every BDEF" |
| `mapping for` block missing | "Include the full mapping for ... corresponding block" |
| `define view` instead of `define view entity` | "Always use define view entity — never classic define view" |
| Interface view exposed in service | "Always expose projection views — never interface views" |
| `@AbapCatalog.viewEnhancementCategory` missing | "Add @AbapCatalog.viewEnhancementCategory: [#NONE] on every interface view" |
| Managed admin fields missing | "Include all 5 managed fields: created_at, created_by, last_changed_at, last_changed_by, local_last_changed_at" |
| `console.log` in CAP | "Use cds.log() — never console.log" |
| `throw new Error` for business errors | "Use req.error() — never throw new Error for business errors" |
| Base entity exposed in CAP service | "Always expose projections — never base entities" |
| Raw SQL in CAP | "Use CDS fluent API — never raw SQL strings" |
| `@requires` missing | "Add @requires: 'authenticated-user' — never @open" |
| Criticality computed in projection | "Compute StatusCriticality as case...end in the interface view — never in projection" |
| Unit test missing | "Generate ABAP Unit test class ltc_[entity]_test FOR TESTING RISK LEVEL HARMLESS DURATION SHORT" |

---

## 9. Pre-Acceptance Checklist — Backend

Before accepting any AI-generated backend code into the codebase:

**CDS / RAP**
| # | Check | Status |
|---|---|---|
| 1 | `define view entity` used — never classic `define view` | ☐ |
| 2 | All field aliases in UpperCamelCase / PascalCase | ☐ |
| 3 | `StatusCriticality` computed in interface/root view, not projection | ☐ |
| 4 | `@UI.hidden: true` on StatusCriticality and all technical fields | ☐ |
| 5 | `@EndUserText.label` with EN and AR on every field | ☐ |
| 6 | Projection view named `ZXX_C_*` — interface view `ZXX_I_*` — root view `ZXX_R_*` | ☐ |

**BDEF**
| # | Check | Status |
|---|---|---|
| 7 | `strict ( 2 );` present | ☐ |
| 8 | `managed` implementation (not `implementation {managed}`) | ☐ |
| 9 | No `with draft` unless explicitly requested | ☐ |
| 10 | `field ( readonly )` on keys and all admin fields | ☐ |
| 11 | Full `mapping for ... corresponding` block present | ☐ |

**Handler Class**
| # | Check | Status |
|---|---|---|
| 12 | Every EML call uses `IN LOCAL MODE` | ☐ |
| 13 | Both `failed-[entity]` and `reported-[entity]` filled in every handler | ☐ |
| 14 | `COMMIT ENTITIES` used — never `COMMIT WORK` | ☐ |
| 15 | No direct `INSERT` / `UPDATE` / `DELETE` on backing table | ☐ |
| 16 | Authority check present in every write handler | ☐ |
| 17 | ABAP Unit test class present and covers valid + invalid paths | ☐ |

**CAP**
| # | Check | Status |
|---|---|---|
| 18 | `managed + cuid` aspects on every entity | ☐ |
| 19 | `return super.init()` at end of `init()` method | ☐ |
| 20 | `req.error()` used — no `throw new Error` for business errors | ☐ |
| 21 | `cds.log()` used — no `console.log` anywhere | ☐ |
| 22 | CDS fluent API only — no raw SQL strings | ☐ |
| 23 | `@requires: 'authenticated-user'` on service | ☐ |
| 24 | `@restrict` applied to every entity | ☐ |
| 25 | Projections exposed — never base entities | ☐ |

**Tier Compliance**
| # | Check | Status |
|---|---|---|
| 26 | Cloud target: only Tier 1 released APIs used | ☐ |
| 27 | No `CALL FUNCTION` in Cloud ABAP | ☐ |
| 28 | No `CALL TRANSACTION`, `SUBMIT`, `CALL SCREEN` in Cloud ABAP | ☐ |

---

## 10. Claude Client Behaviour Notes — Backend

| Client | Context file auto-loaded? | MCP tools available? | File system access? |
|---|---|---|---|
| Claude on VS Code | ✅ This file | ✅ Full MCP via VS Code settings (abap-mcp-server) | ✅ Full project access |
| Claude CLI | ✅ This file via `--context` or workspace root | ✅ Full MCP via `~/.claude/` config | ✅ Full project access |
| Claude Desktop | ⚠️ Attach manually | ✅ Via `claude_desktop_config.json` | ⚠️ Requires filesystem MCP server |
| Claude.ai (browser) | ⚠️ Attach manually | ❌ No MCP | ❌ No file system — advisory only |

> **MCP tools available for backend sessions (when connected):**
> - `abap-mcp-server:searchObject` — find ABAP objects by name and type
> - `abap-mcp-server:getObjectSource` — read ABAP source via ADT URI
> - `abap-mcp-server:writeObjectSource` — write refactored source back to S/4HANA
> - `abap-mcp-server:syntaxCheck` — run syntax check on generated ABAP
> - `abap-mcp-server:runAtcCheck` — run ATC check (DEWA ATC variant)
> - `abap-mcp-server:listTransports` — list open transport requests
> - `abap-mcp-server:validateTransport` — validate transport before release
>
> **ADT URI pattern for classes:** `/sap/bc/adt/oo/classes/[lowercase_class_name]`

---

> **End of CLAUDE_BACKEND.md**
> Maintained by Abdulsamee.
> Keep in sync with `AGENTS_BACKEND.md` — both files carry identical backend rules.
> Sections unique to this file: §7 (prompt patterns), §8 (failure prevention), §9 (pre-acceptance checklist), §10 (Claude client behaviour notes).
> Update this file when:
> - A new S/4HANA release changes RAP BDL syntax
> - A new @sap/cds major version changes handler APIs
> - A new DEWA naming convention is adopted
> - A new MCP tool is added to the abap-mcp-server

---

## 11. Team Lead Notification — After Smoke Test (Stage 11)

After smoke test passes in DEV (Stage 10) and the developer types APPROVE TRANSPORT,
Claude must write the trigger file that activates the email notification.

> **Important:** Transport is NOT released at Stage 9 (validation only).
> Release happens here at Stage 11 — after DEV smoke test is confirmed.

### 11.1 What Claude writes to /docs/teamlead_notification_trigger.txt

```json
{
  "appName": "[AppName from session]",
  "transport": "[Transport number from listTransports]",
  "developer": "[from git config user.name]",
  "date": "[YYYY-MM-DD HH:MM]",
  "tsDocument": "[AppName]_TS_[Date].md",
  "sessionLog": "session_logs/[filename].md",
  "reviewReport": "review_report.md"
}
```

### 11.2 What happens automatically after Claude writes this file

The watch script (`dewa-handoff-watch.js`) detects the trigger file and:
1. Reads session log + CHANGELOG.md + TS document + review report
2. Builds a complete notification email
3. Saves as `docs/teamlead_notification.eml`
4. Opens Outlook with the email pre-filled
5. Developer clicks **Send** — one click

### 11.3 Email contains

- Transport number + app name + developer name + date
- Code review summary (passed/auto-fixed/flagged counts)
- Changelog — what was built and changed
- Session log summary — files generated, MCP tools called, time saved
- Technical Specification — full TS content
- Action required — import transport to QAS via STMS

### 11.4 Team Lead email address

Set the Team Lead email in the watch script environment variable:
```powershell
$env:DEWA_TEAMLEAD_EMAIL = "teamlead@dewa.gov.ae"
node dewa-handoff-watch.js
```

Or update the default directly in `scripts/dewa-handoff-watch.js` line:
```javascript
const TEAMLEAD_EMAIL = process.env.DEWA_TEAMLEAD_EMAIL || 'teamlead@dewa.gov.ae';
```

### 11.5 Claude prompt to trigger notification

After transport release confirmed, Claude writes the trigger automatically.
No developer action needed beyond confirming transport release.

> **This is the final automated step of the framework.**
> Developer confirms transport → Claude writes trigger →
> Watch script builds email → Outlook opens → Developer clicks Send →
> Team Lead receives complete notification.

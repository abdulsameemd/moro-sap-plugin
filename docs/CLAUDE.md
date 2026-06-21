# CLAUDE.md — DEWA Frontend Agent Instructions (Claude)

> **Maintained by Abdulsamee**
> This file is the Claude equivalent of AGENTS.md.
> Claude reads this automatically in VS Code, CLI, and Desktop clients.
> Content mirrors AGENTS.md — both files must be kept in sync when either changes.

---

## 0. Session Start — Do This Before Any Code

> **ADK Hook — SessionStart:** `.claude/hooks/session-start-handoff.js` fires automatically before this checklist.
> If `/docs/handoff/ready_handoff.md` exists, app name, screens, and namespace are pre-loaded.
> Check for injected context before asking the developer to re-confirm already-known values.

| # | Step | Done? |
|---|---|---|
| 1 | Call `get_guidelines` from the SAPUI5 MCP server | ☐ |
| 2 | Read `DESIGN.md` — all color tokens, typography, spacing, radius, component rules | ☐ |
| 3 | Read `GUARDRAILS.md` §1–§8 — FLP config, annotations, accessibility, i18n, AI rules, performance | ☐ |
| 4 | Confirm **deployment target**: S/4HANA On-Prem · S/4HANA Cloud · BTP · SAP Build Work Zone | ☐ |
| 5 | Confirm **app type**: Fiori Elements · Freestyle MVC · Flexible Programming Model | ☐ |
| 6 | Confirm **floorplan**: List Report · Object Page · FCL · Worklist · Overview Page · Custom | ☐ |
| 7 | Confirm **OData version**: V4 (new) · V2 (legacy maintenance only) | ☐ |
| 8 | Confirm **input available**: OData `$metadata` · Design screenshot · Both · Neither | ☐ |

**Do not write any code until all 8 steps are confirmed.**

> **DEWA confirmed scope — do not re-ask these in a session:**
> - Targets: S/4HANA On-Prem + S/4HANA Cloud (both active)
> - UI technologies in scope: SAPUI5 · Fiori Elements · Freestyle · SAP Build Apps · SAP Build Work Zone · SAC Embedded
> - Language: TypeScript (default) — JavaScript only if the existing project already uses it
> - OData: V4 for all new apps — V2 for legacy maintenance only

---

## 1. Frontend Technology Scope

> This file covers frontend only. Backend, ABAP, CAP, RAP, and integration rules live in `CLAUDE_BACKEND.md` and `GUARDRAILS.md`.

| Technology | Status | Key Rule |
|---|---|---|
| SAPUI5 — Fiori Elements | ✅ Primary | Annotation-driven. Zero hand-coded HTML. Preferred for all standard transactional apps. |
| SAPUI5 — Freestyle MVC | ✅ In use | For UX complexity not achievable in Fiori Elements. Follow GUARDRAILS §6.7. |
| Flexible Programming Model | 🔶 Confirm first | Hybrid: Fiori Elements pages + `macros:*` building blocks. Confirm before scaffolding. |
| SAP Build Apps | ✅ In scope | Low-code, BTP only. Simple utility apps — not complex OData transactional apps. **Separate toolchain — never mix with SAPUI5/TypeScript code.** |
| SAP Build Work Zone | ✅ In scope | Portal host for UI5 apps and SAC cards. UI5 apps must be registered via CDM. |
| SAC Embedded | ✅ In scope | Use `sap.ui.integration.widgets.Card` — never a raw `<iframe>`. |
| Web Dynpro / SAP GUI | ⛔ Legacy only | No new development. |

### 1.1 Fiori Elements vs Freestyle — Decision Rule

Ask this question at session start if the app type is not explicitly stated.
Use the table below to decide — never guess.

| Use Fiori Elements when… | Use Freestyle MVC when… |
|---|---|
| Standard List Report / Object Page / FCL pattern fits | Custom layout not achievable with annotations |
| CRUD on a single RAP entity set | Multiple entity sets displayed simultaneously on one screen |
| Filter bar + table + detail page is sufficient | Complex gestures, drag-and-drop, canvas, or custom charts required |
| App needs to be delivered quickly | Pixel-perfect DEWA branded experience is required |
| OData annotations can drive the full UI | Heavy business logic in the controller drives the UI |
| Key User Adaptation (FLP flexibility) is required | Reusable custom controls are being built |

**Default:** If in doubt, start with Fiori Elements. Switch to Freestyle only when a specific limitation is identified and confirmed with the developer.

---

## 2. Companion Files

| File | What It Contains | Audience |
|---|---|---|
| `DESIGN.md` | Color tokens · Typography · Spacing · Radius · Buttons · Forms · FLP CSS rules | Claude + Developers |
| `GUARDRAILS.md` | FLP config · Annotations · OData · Accessibility · i18n · Performance · RAP · CAP standards | Claude + Developers |
| `CLAUDE_BACKEND.md` | Backend session instructions for Claude — ABAP · RAP · CAP · CDS | Claude (backend sessions) |
| `AGENTS.md` | Identical frontend rules — read by GitHub Copilot automatically | Copilot only |
| `AGENTS_BACKEND.md` | Identical backend rules — read by GitHub Copilot automatically | Copilot only |
| `PROMPTS_BACKEND.md` | Backend code examples + prompt patterns | Developers only — not loaded into Claude context |

**DESIGN.md and GUARDRAILS.md must both be loaded at session start. Never treat either as optional.**

---

## 3. Generation Workflow

Follow this order every session. Never skip or reorder steps.

### Step 1 — Scaffold

Use `create_ui5_app` from the SAPUI5 MCP server. Never hand-write `manifest.json`, `Component.ts`, or `index.html`.

```
appNamespace:             com.dewa.<appname>
basePath:                 <absolute path>
typescript:               true
framework:                SAPUI5
runNpmInstall:            true
initializeGitRepository:  true
```

After scaffold, immediately:
- Add `sap.fiori` section with `registrationIds` + `archeType` → GUARDRAILS §1.1
- Set `"flexEnabled": true` in `sap.ui5` → GUARDRAILS §1.1
- Set `"async": true` on `rootView` → GUARDRAILS §7.1

---

### Step 2 — Feed Context Before Writing Any View

**If OData `$metadata` is provided:**
1. List every `EntityType` with its EDM property types
2. Map each to the correct `sap.ui.model.odata.type.*` — see table below
3. Identify status/criticality fields → map to DEWA criticality tokens
4. Assign each `EntitySet` to a floorplan role (List or Object page)
5. Output the mapping and wait for developer confirmation

**If a design screenshot is provided:**
1. Identify the Fiori floorplan
2. Map each UI section to a specific `sap.m` or `sap.f` control
3. Map each visual element to a DESIGN.md token
4. Note bilingual (LTR/RTL) layout requirements
5. Output the mapping and wait for developer confirmation

**EDM → SAPUI5 type mapping:**

| EDM Type | SAPUI5 OData Type |
|---|---|
| `Edm.String` | `sap.ui.model.odata.type.String` |
| `Edm.Decimal` | `sap.ui.model.odata.type.Decimal` |
| `Edm.Int32` | `sap.ui.model.odata.type.Int32` |
| `Edm.Boolean` | `sap.ui.model.odata.type.Boolean` |
| `Edm.Date` | `sap.ui.model.odata.type.Date` |
| `Edm.DateTimeOffset` | `sap.ui.model.odata.type.DateTimeOffset` |

---

### Step 3 — Build Views (One at a Time)

Never batch multiple views in a single prompt.

**XML view rules:**
- XML views only — never JS views
- All data binding via `sap.ui.model.odata.type.*` — never raw string binding for numbers, dates, or amounts
- Forms: always `sap.ui.layout.form.Form` + `ColumnLayout` — **never `SimpleForm`**
  - Default columns: `columnsM="2"` · `columnsL="3"` · `columnsXL="4"`
- Every user-visible string: `{i18n>KEY}` — no raw strings anywhere in XML
- Every button: `ariaLabel="{i18n>ARIA_KEY}"` — GUARDRAILS §4.2
- Every icon-only button: `tooltip` + `ariaLabel` — GUARDRAILS §4.2
- Expression bindings `{= ... }`: only for simple visibility — complex logic goes in formatters

**Controller rules (TypeScript):**
- Event handlers: `on` + PascalCase — `onPayNow`, `onNavBack`, `onTableItemPress`
- Private helpers: `_` prefix — `_loadData`, `_buildFilter`
- Navigation: `this.getOwnerComponent().getRouter().navTo(...)` — never `window.location`
- i18n strings: always via `getResourceBundle().getText("KEY")` — never hardcoded
- Fragments: async `Fragment.load()` + `this.getView().addDependent(fragment)` — never `sap.ui.xmlfragment()`
- No `document.getElementById`, `jQuery(...)`, or `.innerHTML`
- No `fetch()` or `axios` — use `ODataModel` bindings only
- Event types: use specific TypeScript types (`Button$PressEvent`, `Table$RowSelectionChangeEvent`) — never `any`

**OData error handling (required on every operation):**
- Attach error handler on every OData operation — never assume success
- Use `MessageBox.error()` with an i18n key — never `alert()` or `console.error()`
- For `submitChanges` / `callFunction`: always handle both `success` and `error` callbacks
- For batch failures: read `oEvent.getParameter("responseStatus")` and parse the error body
- Show `MessageToast` for non-critical warnings, `MessageBox.error()` for blocking errors

```typescript
// ✅ CORRECT — submitChanges with error handling
this.getView().getModel().submitChanges({
    success: () => {
        MessageToast.show(oBundle.getText("MSG_SAVE_SUCCESS"));
    },
    error: (oError: object) => {
        MessageBox.error(oBundle.getText("MSG_ERROR_SAVE_FAILED"));
    }
});
```

**Value help / dropdown binding (required for any selection field):**
- Always bind `sap.m.Select` to a named model — never hardcode `<items>` in XML
- For simple dropdowns: JSONModel with predefined list bound to `items` aggregation
- For OData-driven dropdowns: bind to a separate entity set via a named model
- Key property always: `selectedKey="{ModelName>FieldName}"`
- For complex F4: use `sap.ui.comp.valuehelpdialog.ValueHelpDialog` via async `Fragment.load()`
- Never use `sap.m.ComboBox` for a fixed closed list — use `sap.m.Select`

```xml
<!-- ✅ CORRECT — Select bound to named model -->
<m:Select selectedKey="{invoice>CategoryCode}"
          items="{path: 'categories>/Categories', templateShareable: false}">
  <core:Item key="{categories>Code}" text="{categories>Description}"/>
</m:Select>

<!-- ❌ WRONG — hardcoded items -->
<m:Select>
  <core:Item key="01" text="Electricity"/>
</m:Select>
```

---

### Step 4 — Apply DEWA Design Tokens

All CSS in `webapp/css/styles.css`. Every selector scoped under `#app`.

**Token quick-reference (full detail in DESIGN.md §9):**

```
Primary Green (CTA, active, success):        #007560
Primary Variant (hover, text links):         #004937
Active Background (selected rows/tiles):     #E5F1EF
Hero Container Fill:                         #D9EAE7
Error:                                       #B00020
Alert Yellow (warning only — never buttons): #FFC600
Card Surface:                                #FFFFFF
Input Background:                            #F2F3F3
Secondary Text:                              #6F6F6F
Primary Text:                                #222222
Card Border:                                 #D7D7DF
Section Divider:                             #EFEFF1

Radius — Input fields:    5px
Radius — Cards:          15px
Radius — Hero sections:  20px
Radius — Buttons:       100px  (pill — .sapMPageContent only)
```

**CSS rules:**
- Scope every selector under `#app` → DESIGN.md §8.1
- Use CSS logical properties — `margin-inline-start` not `margin-left` → DESIGN.md §8.5
- Dubai Font via local `@font-face` only — no `@import url('https://...')` → DESIGN.md §8.2
- Max 5 `!important` per stylesheet, never on color/theme properties → DESIGN.md §8.3
- Button `100px` radius scoped to `.sapMPageContent` only → DESIGN.md §8.4

---

### Step 5 — i18n (Both Locales, Every Time)

Add every new key simultaneously to `i18n_en.properties` and `i18n_ar.properties`.

**Key pattern:** `CONTEXT_ELEMENTTYPE_DESCRIPTION` — ALL_CAPS_UNDERSCORE

```properties
LABEL_ACCOUNT_NUMBER=Account Number          → رقم الحساب
BUTTON_PAY_NOW=Pay Now                       → ادفع الآن
MSG_ERROR_PAYMENT_FAILED=Payment failed...   → تعذّر معالجة الدفع...
ARIA_BUTTON_PAY_NOW=Submit payment           → تأكيد دفع الفاتورة
```

Never show a raw i18n key in the UI. Default: English — fall back to EN if AR is missing.

---

### Step 6 — Lint and Validate

> **ADK Hook — PreToolUse:** `.claude/hooks/pre-lint-gate.js` enforces this automatically.
> Before every Write/Edit tool call, lint runs and blocks if errors exist.
> This rule is enforced by code — not by Claude's discipline alone.

After every generated file, run `run_ui5_linter` via the MCP server.
Fix all errors before moving to the next file. Never stack unvalidated files.

---

### Step 7 — FLP Deployment Check

Before closing any feature, verify GUARDRAILS §1.3 checklist:
- `sap.fiori` section present in `manifest.json`
- `flexEnabled: true` set in `sap.ui5`
- All CSS scoped under `#app`
- Dubai Font using local `@font-face`
- RTL tested: `?sap-ui-rtl=true`
- Dark theme tested: `?sap-ui-theme=sap_horizon_dark`
- Pill buttons (`100px`) scoped to `.sapMPageContent` only

---

## 4. DEWA Reusable Controls

Use these before building anything custom:

| Control | Module | Properties |
|---|---|---|
| `DewaStatusBadge` | `com.dewa.controls.DewaStatusBadge` | `status`, `statusText`, `criticality` (0–3) |
| `DewaAccountTile` | `com.dewa.controls.DewaAccountTile` | Hero tile — `radius-hero-container: 20px` |
| `DewaConsumptionChart` | `com.dewa.controls.DewaConsumptionChart` | Chart with DEWA graph color tokens |
| `DewaConfirmDialog` | `com.dewa.fragments.DewaConfirmDialog` | Primary Save · Secondary Cancel · Tertiary Discard |
| `DewaFilterBar` | `com.dewa.fragments.DewaFilterBar` | Standard filter bar for List Reports |

**Criticality mapping:** `0` = #6F6F6F · `1` = #B00020 · `2` = #FFC600 · `3` = #007560

---

## 5. What Claude Must Never Generate (Frontend)

| Category | Forbidden |
|---|---|
| **Controls** | `sap.ui.commons.*` · Native HTML `<input>`, `<select>`, `<div>` for layout |
| **Views** | JS views · `SimpleForm` · Inline `style=""` on any SAPUI5 control |
| **CSS** | Unscoped `.sapM*` selectors · `margin-left/right` · `padding-left/right` · `!important` on color properties · CDN `@import` for fonts · `100px` radius outside `.sapMPageContent` |
| **Controllers** | `document.getElementById` · `jQuery(...)` · `.innerHTML` · `window.location` navigation · `fetch()` / `axios` for OData · `sap.ui.xmlfragment()` · Hardcoded user-visible strings |
| **i18n** | Single-locale keys — always generate both EN and AR |
| **Scaffold** | Hand-written `manifest.json` · `Component.ts` · `index.html` |

---

## 6. Files Claude May Not Modify Without Approval

| File | Reason |
|---|---|
| `manifest.json` → `sap.fiori.registrationIds` | Assigned by project registry |
| `manifest.json` → `sap.app.dataSources` | OData URLs are environment-specific |
| `ui5.yaml` → `customMiddleware` | Deployment-environment-specific |
| `webapp/fonts/**` | Legally licensed Dubai Font assets |

---

## 7. Claude Client Behaviour Notes

| Client | Context file auto-loaded? | MCP tools available? | File system access? |
|---|---|---|---|
| Claude on VS Code | ✅ This file + `CLAUDE_BACKEND.md` | ✅ Full MCP via VS Code settings | ✅ Full project access |
| Claude CLI | ✅ This file via `--context` or workspace root | ✅ Full MCP via `~/.claude/` config | ✅ Full project access |
| Claude Desktop | ⚠️ Attach manually | ✅ Via `claude_desktop_config.json` | ⚠️ Requires filesystem MCP server |
| Claude.ai (browser) | ⚠️ Attach manually | ❌ No MCP | ❌ No file system — advisory only |

> **Claude Desktop and Claude.ai:** Without filesystem MCP, Claude can advise and generate code in chat but cannot scaffold files, run the linter, or validate manifests on disk. For full workflow, use VS Code or CLI.

---

## 8. Prompt Patterns & Session Protocol (Frontend)

> Moved here from GUARDRAILS.md §11 — prompt patterns and failure prevention belong in the Claude instruction file, not in the coding standards file.
> For backend prompt patterns, see `CLAUDE_BACKEND.md §7`.

### 8.1 Session Start Protocol

Every session must begin with this prompt before any code is written:

```
Read CLAUDE.md, DESIGN.md, and GUARDRAILS.md.
Call get_guidelines from the SAPUI5 MCP server.
Confirm:
  - App type (Freestyle / Fiori Elements / Flexible Programming Model)
  - Fiori floorplan (List Report / Object Page / FCL / Worklist / Custom)
  - OData version (V4 new / V2 legacy)
  - Input available (OData $metadata XML / Design screenshot / Both / Neither)
Do not generate any code until all four are confirmed.
```

### 8.2 Metadata-First Prompt Pattern

Use this whenever OData metadata is available. Paste `$metadata` XML then:

```
Map all EntityTypes to:
  1. EDM property → sap.ui.model.odata.type.* equivalent
  2. Status/criticality fields → DEWA criticality color tokens
     (3=#007560, 2=#FFC600, 1=#B00020, 0=#6F6F6F)
  3. EntitySets → List page / Object page assignment

Output a mapping table. Wait for my confirmation before writing any code.
```

### 8.3 Screenshot-First Prompt Pattern

Attach the image then:

```
Identify:
  1. Fiori floorplan shown
  2. Each UI section → specific sap.m or sap.f control
  3. Each visual element → DESIGN.md token name + hex value
  4. Bilingual (LTR/RTL) layout requirements

Output a control mapping table. Wait for my confirmation before writing any XML.
```

### 8.4 Annotation Generation Prompt (Fiori Elements)

```
Generate CDS UI annotations for <EntityName>:
- @UI.LineItem: include position, value, label, criticality where applicable
- @UI.SelectionFields: filterable fields for the filter bar
- @UI.PresentationVariant: default sort by <field> descending
- @UI.Facets: Object Page structure (FieldGroup + Reference pattern per GUARDRAILS §2.2)
- @EndUserText.label: EN and AR for every field
- @UI.Hidden: all technical/internal fields
- Do NOT add @odata.draft.enabled (unless I explicitly request it)
DEWA criticality: 3=Positive #007560 · 2=Critical #FFC600 · 1=Negative #B00020 · 0=Neutral #6F6F6F
```

### 8.5 Single View Generation Prompt

```
Generate only <ViewName>.view.xml and <ViewName>.controller.ts for the <describe purpose> screen.

Binding source: <EntitySet> via ODataModel
Fields to display: <list field names>

Apply:
- DESIGN.md tokens for all colors, spacing, radius
- ColumnLayout Form: columnsM=2, columnsL=3, columnsXL=4 (never SimpleForm)
- sap.ui.model.odata.type.* for all property bindings
- {i18n>KEY} for every user-visible string — add keys to both i18n_en and i18n_ar
- ariaLabel on every button; tooltip + ariaLabel on every icon-only button
- CSS scoped under #app with logical RTL properties (margin-inline-start, padding-inline-end)
- Event handlers: on + PascalCase naming

After generating, run run_ui5_linter and show me the results before continuing.
```

### 8.6 CAP Service Prompt (Frontend Context)

```
Generate a CAP CDS entity + service + handler for <domain>:
- Entity: managed + cuid aspects, PascalCase fields, @assert.range for enums
- Service: projection only (not base entity), @restrict on every entity
- Handler: before/after/on hooks, async/await, req.error(code, 'MSG_KEY')
- No raw SQL, no console.log, no raw throw
Follow GUARDRAILS §10 rules exactly.
```

> For full backend RAP / CAP prompt patterns, see `CLAUDE_BACKEND.md §7` and `PROMPTS_BACKEND.md`.

### 8.7 Common Failure Patterns — Prevention Rules

These are the most frequent errors on DEWA frontend projects. Check for all of them after every generation.

| Failure | Why It Happens | Prevention |
|---|---|---|
| Wrong colors generated | AI invents hex values | Always include token reference from DESIGN §9.1 in the prompt |
| `SimpleForm` generated | Default AI behavior | Explicitly state "never SimpleForm, always Form + ColumnLayout" |
| Missing Arabic i18n | Single-locale default | Always say "generate both i18n_en and i18n_ar entries" |
| Unscoped CSS | AI omits `#app` prefix | Always say "scope all CSS under #app" |
| `margin-left` in CSS | Default CSS behavior | Always say "use CSS logical properties" |
| `window.location` navigation | AI defaults to web patterns | Always say "use SAPUI5 Router navTo" |
| `fetch()` for OData | AI uses web API patterns | Always say "use ODataModel — never fetch() or axios" |
| `console.log` in CAP | AI's default debug pattern | Always say "use cds.log() not console.log" |
| Draft enabled silently | Annotation auto-suggestion | Prompt must always say "do NOT add draft unless I ask" |
| Pill radius outside page | AI applies globally | Always say "100px radius scoped to .sapMPageContent only" |
| One locale only | i18n laziness | Always mention "both en and ar" in every view/form prompt |
| Multiple files at once | AI batches output | Always generate one view at a time + linter run between |

### 8.8 Master Pre-Acceptance Checklist (Frontend)

Before accepting any AI-generated frontend code into the codebase:

**CSS**
| # | Check | Status |
|---|---|---|
| 1 | All selectors scoped under `#app` | ☐ |
| 2 | No `margin-left`, `margin-right`, `padding-left`, `padding-right` | ☐ |
| 3 | No `!important` on color/theme properties | ☐ |
| 4 | No `@import url('https://...')` for Dubai Font | ☐ |
| 5 | `100px` radius only inside `.sapMPageContent` | ☐ |
| 6 | Only DEWA-approved hex values (DESIGN.md §9.1) | ☐ |

**XML Views**
| # | Check | Status |
|---|---|---|
| 7 | All user-visible strings use `{i18n>KEY}` | ☐ |
| 8 | All buttons have `ariaLabel`; icon-only buttons have `tooltip` too | ☐ |
| 9 | No `sap.ui.layout.form.SimpleForm` — always `Form` + `ColumnLayout` | ☐ |
| 10 | All numeric/date/amount fields use `sap.ui.model.odata.type.*` | ☐ |
| 11 | No hardcoded colors or spacing values | ☐ |

**Controllers / TypeScript**
| # | Check | Status |
|---|---|---|
| 12 | No `document.getElementById`, `jQuery`, `.innerHTML` | ☐ |
| 13 | Navigation via `Router.navTo()` only | ☐ |
| 14 | No `fetch()` or `axios` for OData | ☐ |
| 15 | Event handlers follow `on` + PascalCase naming | ☐ |
| 16 | Fragments loaded via async `Fragment.load()` + `addDependent()` | ☐ |

**i18n**
| # | Check | Status |
|---|---|---|
| 17 | Every new key added to both `i18n_en.properties` and `i18n_ar.properties` | ☐ |
| 18 | Key naming follows `CONTEXT_ELEMENTTYPE_DESCRIPTION` pattern | ☐ |

**Linter**
| # | Check | Status |
|---|---|---|
| 19 | `run_ui5_linter` executed and zero errors reported | ☐ |

**Deployment Readiness**
| # | Check | Status |
|---|---|---|
| 20 | `sap.fiori` section in `manifest.json` | ☐ |
| 21 | `flexEnabled: true` in `sap.ui5` | ☐ |
| 22 | RTL tested with `?sap-ui-rtl=true` | ☐ |
| 23 | Dark theme tested with `?sap-ui-theme=sap_horizon_dark` | ☐ |

---

## 9. Session Log — AI Observability (Required)

**At the end of every session — before closing — Claude must write a session log.**

This is mandatory. It is the audit trail that proves the framework ran correctly and quantifies business value delivered.

### 9.1 When to write the log

Write the session log when ANY of these occur:
- Developer types `END SESSION` or `LOG SESSION`
- All framework stages for the current scope are complete
- Developer ends the conversation

### 9.2 Where to save it

```
/dewa-project/docs/session_logs/[YYYYMMDD_HHMM]_[AppName].md
```

Create the `session_logs/` folder if it does not exist.

### 9.3 What to include

Use `SESSION_LOG.md` in `/templates/` as the template. Fill every section:

- Stage summary — which stages completed and duration
- Files generated — list with linter results
- Backend artefacts — list with ATC results
- Code review results — PERF/STY findings, auto-fixes applied
- MCP tools called — full list with call counts
- Human gates triggered — which 5 gates and timestamps
- Time savings estimate — manual vs agentic, hours saved
- Issues encountered — any errors and how resolved
- Transport request number and TS document path

### 9.4 Session log prompt

```
Write the session log for this session using SESSION_LOG.md template.
Save to /dewa-project/docs/session_logs/[YYYYMMDD_HHMM]_[AppName].md
Fill every section — do not leave any placeholder empty.
```

### 9.5 Why this matters

The session log gives DEWA:
- Full audit trail of every AI action
- Proof of code quality (linter + ATC results)
- Measurable time savings per delivery
- Input data for METRICS.md updates
- Evidence for management reporting

**Never skip the session log. It is as important as the TS.**

---


---

## 9. Git — Automatic Commits Per Stage

Claude commits generated files at the end of each stage automatically.
Never batch commits across stages — one commit per stage completion.

### 9.1 Commit sequence

| Stage | Files to commit | Commit message |
|---|---|---|
| Stage 3 complete | `webapp/` · `manifest.json` · `ui5.yaml` | `feat: scaffold [AppName] UI5 app` |
| Stage 5 complete | `backend/` artefact reference list | `feat: RAP service [Entity] generated` |
| Stage 7 complete | `docs/review_report.md` | `review: code review complete` |
| Stage 8 complete | `docs/[AppName]_TS_[Date].md` · `docs/session_logs/` | `docs: TS and session log for [AppName]` |
| Stage 9 complete | Final commit | `release: transport [TR] ready for QAS` |

### 9.2 Branch — always work on a feature branch

```bash
# Claude runs this at Stage 2 CONFIRM
git checkout -b feature/[AppName]
```

Never commit directly to `main`. See `DEPLOY.md §5` for full Git strategy.

### 9.3 Session log validation

The watch script validates the session log when Claude writes it.
If placeholders remain, Claude must complete the log before the session closes.

> **End of CLAUDE.md**
> Maintained by Abdulsamee. Version 1.3.0.
> Sections unique to this file: §7 (Claude client behaviour) · §8 (prompt patterns) · §9 (session log).
> For backend session instructions see `CLAUDE_BACKEND.md`.
> See `CHANGELOG.md` for version history. See `METRICS.md` for KPI definitions.

---

## 10. Agentic Skills — Auto-loaded at session start

Two agentskills.io-compliant skills are installed in `.claude/skills/`.
Claude Code loads these automatically — no manual attachment needed.

| Skill | Folder | Activates when |
|---|---|---|
| `dewa-fiori-design` | `.claude/skills/dewa-fiori-design/` | Developer requests SAP Fiori app design |
| `moro-code-review` | `.claude/skills/moro-code-review/` | After Stage 6 — $metadata verified |

Both skills follow agentskills.io open standard (https://agentskills.io).
Validated with: `npx skills-ref validate .claude/skills/[skill-name]`

> **Note:** prototype-export runs as `scripts/dewa-handoff-watch.js` (Node.js).
> ts-autogen runs from `templates/TS_TEMPLATE.md`. Neither requires a SKILL.md.

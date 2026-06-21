# CODEREVIEW.md — DEWA Code Review Standards
## Frontend · Backend · Auto-Fix · Confirmation Gate

> **Maintained by:** Abdulsamee
> **Purpose:** Defines the code review stage that runs after lint/ATC gates and before
> TS generation. Covers frontend (SAPUI5/TypeScript) and backend (ABAP/RAP/CAP).
> Review findings feed directly into `TS_TEMPLATE.md` as test evidence.
>
> **Position in framework:** Stage 7 — after OData binding, before TS generation.
> **Tools used:**
> - Frontend: `run_ui5_linter` (SAPUI5 MCP) · manual pattern check vs GUARDRAILS.md
> - Backend: `abap-mcp-server:reviewAbapCode` · `abap-mcp-server:runAtcCheck`
> - Both: `abap-mcp-server:syntaxCheck` on any modified artefact
>
> **Human gate:** Developer must type `CONFIRM REVIEW` before framework advances to TS.
> No bypass exists. TS is never generated without explicit confirmation.

---

## 0. Review Trigger

Code review starts automatically after Stage 6 (OData binding) completes successfully.
Claude announces:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEWA CODE REVIEW — Starting
Frontend: [AppName] · [N] files
Backend:  [N] ABAP objects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Running frontend review...
Running backend review via abap-mcp-server...
```

Review runs fully before presenting results. Never stream partial results.

---

## 1. Frontend Review

### 1.1 Scope

Review every file generated in Stage 3:
- All `*.view.xml` files
- All `*.controller.ts` files
- All `*.css` files
- Both `i18n_en.properties` and `i18n_ar.properties`
- `manifest.json` (non-protected sections only)

### 1.2 Frontend Review Checklist

Run every check below. Mark each ✅ PASS · ❌ FAIL · 🔧 AUTO-FIXED.

**CSS**
| # | Check | Action on fail |
|---|---|---|
| C1 | All selectors scoped under `#app` | Auto-fix: prepend `#app` |
| C2 | No `margin-left/right` or `padding-left/right` | Auto-fix: replace with logical properties |
| C3 | No `!important` on color/theme properties | Flag: requires manual fix |
| C4 | No `@import url('https://...')` for Dubai Font | Auto-fix: replace with local `@font-face` |
| C5 | `100px` radius only inside `.sapMPageContent` | Auto-fix: scope the rule |
| C6 | All hex values match DESIGN.md §2 approved tokens | Flag: list violation + nearest token |

**XML Views**
| # | Check | Action on fail |
|---|---|---|
| V1 | All user-visible strings use `{i18n>KEY}` | Flag: list hardcoded strings |
| V2 | No `sap.ui.layout.form.SimpleForm` anywhere | Auto-fix: replace with Form + ColumnLayout |
| V3 | All numeric/date/amount fields use `sap.ui.model.odata.type.*` | Flag: list raw bindings |
| V4 | All buttons have `ariaLabel`; icon-only buttons have `tooltip` too | Auto-fix: add missing aria |
| V5 | No inline `style=""` on any SAPUI5 control | Auto-fix: move to CSS |
| V6 | No `sap.ui.commons.*` controls | Flag: requires control replacement |
| V7 | No native HTML `<input>`, `<select>`, `<div>` for layout | Flag: requires manual fix |

**Controllers / TypeScript**
| # | Check | Action on fail |
|---|---|---|
| T1 | No `document.getElementById`, `jQuery`, `.innerHTML` | Flag: requires manual fix |
| T2 | Navigation via `Router.navTo()` only — no `window.location` | Auto-fix: replace pattern |
| T3 | No `fetch()` or `axios` for OData | Flag: requires ODataModel refactor |
| T4 | Event handlers follow `on` + PascalCase | Auto-fix: rename |
| T5 | Fragments via async `Fragment.load()` + `addDependent()` | Flag: if `sap.ui.xmlfragment()` found |
| T6 | No hardcoded i18n strings — all via `getResourceBundle().getText()` | Auto-fix where string is findable |
| T7 | OData operations have both success and error handlers | Flag: list operations missing error handler |

**i18n**
| # | Check | Action on fail |
|---|---|---|
| I1 | Every key in `i18n_en.properties` exists in `i18n_ar.properties` | Auto-fix: add placeholder `[AR: KEY]` |
| I2 | Key naming follows `CONTEXT_ELEMENTTYPE_DESCRIPTION` | Flag: list non-compliant keys |
| I3 | No raw i18n key visible in UI (no untranslated keys) | Flag: list missing translations |

### 1.3 Frontend Review Output Format

```
FRONTEND REVIEW REPORT
══════════════════════
Files reviewed: [N]
Checks run: 23

PASSED:  [N] checks
AUTO-FIXED: [N] checks (applied automatically)
FLAGGED: [N] checks (require your decision)

AUTO-FIXED:
  🔧 C2: margin-left → margin-inline-start in styles.css (3 instances)
  🔧 V2: SimpleForm replaced with Form + ColumnLayout in List.view.xml
  🔧 I1: 4 missing AR keys added as placeholders — translate before deploy

FLAGGED — ACTION REQUIRED:
  ❌ C6: #FF0000 in styles.css line 42 — not a DEWA token
     Nearest approved: #B00020 (color-error-light)
  ❌ T3: fetch() call in InvoiceController.ts line 88 — must use ODataModel
  ❌ V1: Hardcoded string "Submit" found in Invoice.view.xml line 134

LINTER: ✅ Zero errors (last run: [timestamp])
```

---

## 2. Backend Review

### 2.1 Tools — abap-mcp-server

Run these tools on every generated ABAP object. Never skip any object.

| Tool | When | What it checks |
|---|---|---|
| `reviewAbapCode` | Every class/method | Full source fetch + PERF/STY pattern analysis |
| `runAtcCheck` | Every class + every CDS view | DEWA ATC variant — PERF-01 through PERF-08, STY-01 through STY-13 |
| `syntaxCheck` | After any auto-fix | Confirms no syntax regression from fix |
| `writeObjectSource` | After auto-fix confirmed | Writes fixed source back to SAP |

### 2.2 PERF Patterns — Auto-Fix Where Safe

| Code | Pattern | Auto-fix? |
|---|---|---|
| PERF-01 | `SELECT *` → field projection pushdown | ✅ Auto-fix |
| PERF-02 | `DESCRIBE TABLE LINES` → `lines()` built-in | ✅ Auto-fix |
| PERF-03 | `READ TABLE` loop + sy-subrc → `VALUE#( table[ key ] OPTIONAL )` | ✅ Auto-fix |
| PERF-04 | `LOOP + APPEND` → `VALUE#( FOR … )` constructor | ✅ Auto-fix |
| PERF-05 | Redundant `CLEAR / REFRESH` before repopulation | ✅ Auto-fix |
| PERF-06 | `CREATE OBJECT` → `NEW #` operator | ✅ Auto-fix |
| PERF-07 | `READ TABLE + sy-subrc` predicate → `line_exists()` | ✅ Auto-fix |
| PERF-08 | Duplicate RFC round-trips inside branches → single call before branch | ⚠️ Flag — requires developer decision |

### 2.3 STY Patterns — Auto-Fix Where Safe

| Code | Pattern | Auto-fix? |
|---|---|---|
| STY-01 | `CALL METHOD` → functional `obj->method()` | ✅ Auto-fix |
| STY-02 | Variable names not matching `lv_ ls_ lt_ lo_ lc_ lx_` convention | ✅ Auto-fix |
| STY-03 | `CATCH cx_root` → typed exception catches only | ✅ Auto-fix (replace with `/iwbep/cx_mgw_busi_exception`) |
| STY-04 | Dead commented-out code | ✅ Auto-fix: remove + note in header |
| STY-05 | `TRANSLATE … TO UPPER CASE` → `to_upper()` | ✅ Auto-fix |
| STY-06 | `IF sy-subrc = 0` → `IF sy-subrc IS INITIAL` | ✅ Auto-fix |
| STY-07 | Magic string/number literals → typed `CONSTANTS` block | ✅ Auto-fix |
| STY-08 | `METHOD/ENDMETHOD` casing → lowercase | ✅ Auto-fix |
| STY-09 | `CALL FUNCTION CONVERSION_EXIT_ALPHA_INPUT` → inline template | ✅ Auto-fix |
| STY-10 | `APPEND + CLEAR` → `VALUE #( … )` constructors | ✅ Auto-fix |
| STY-11 | Nested `IF/ELSEIF` → `CASE abap_true` | ⚠️ Flag — requires developer decision |
| STY-12 | Double-dot typo (`..`) on APPEND lines | ✅ Auto-fix |
| STY-13 | Silent exception swallow → explicit re-raise | ✅ Auto-fix |

### 2.4 Backend Review Output Format

```
BACKEND REVIEW REPORT
═════════════════════
Objects reviewed: [N]
  Classes:    [N]
  CDS views:  [N]
  BDEFs:      [N]

PERF patterns found: [N]   AUTO-FIXED: [N]   FLAGGED: [N]
STY patterns found:  [N]   AUTO-FIXED: [N]   FLAGGED: [N]
Silent cx_root remaining: 0   ← must always be 0

ATC RE-CHECK (post auto-fix): ✅ Zero violations

AUTO-FIXED:
  🔧 ZCL_[XX]_BP_[Entity]:  PERF-01 SELECT * → projection (14 fields)
  🔧 ZCL_[XX]_BP_[Entity]:  STY-03 cx_root → /iwbep/cx_mgw_busi_exception
  🔧 ZXX_I_[Entity]:        STY-06 sy-subrc = 0 → IS INITIAL (6 instances)

FLAGGED — ACTION REQUIRED:
  ⚠️ PERF-08 ZCL_[XX]_BP_[Entity].get_expanded_entityset:
     Duplicate RFC calls found in 2 branch paths.
     Suggested: extract to single call before CASE block.
     Estimated saving: ~40ms/hit. Confirm fix? (Y/N)

EXECUTION TIME SAVINGS (estimated):
  Before: ~[N]ms avg · After: ~[N]ms avg · Reduction: ~[N]%
  RFC round-trips removed: [N]
```

---

## 3. Combined Review Report + Confirmation Gate

After both frontend and backend reviews complete, Claude presents the combined summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEWA CODE REVIEW COMPLETE — [AppName]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND
  ✅ Passed:     [N] checks
  🔧 Auto-fixed: [N] items
  ❌ Flagged:    [N] items requiring your decision

BACKEND
  ✅ Passed:     [N] checks
  🔧 Auto-fixed: [N] items (ATC re-check: ✅ zero violations)
  ⚠️ Flagged:    [N] items requiring your decision
  Perf gain:    ~[N]% DB time reduction · [N] RFC trips removed

FLAGGED ITEMS REQUIRING YOUR DECISION:
  [list all flagged items with suggested fix and Y/N prompt]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type CONFIRM REVIEW to proceed to TS generation.
Type FIX [item number] to apply the suggested fix for that item.
Do not proceed until all flagged items are resolved or accepted.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Strict gate rules:**
- Claude never advances to TS without `CONFIRM REVIEW` typed by the developer
- If any `❌ FAIL` items remain unresolved, Claude blocks confirmation and lists them
- `CONFIRM REVIEW` with unresolved failures is rejected — Claude explains why
- The review report is saved as `review_report.md` in the project root for inclusion in TS

> **ADK Hook — Stop:** `.claude/hooks/stop-confirm-review.js` enforces this gate at code level.
> When Claude attempts to end any response after Stage 7, the hook checks:
> 1. Does `/docs/review_report.md` exist?
> 2. Has the developer typed `CONFIRM REVIEW` in this session?
> If either check fails → `exit 1` → Claude is blocked → message shown: *"Review gate not cleared. Read /docs/review_report.md and type CONFIRM REVIEW."*
> This is deterministic enforcement — Claude cannot bypass it regardless of what it is prompted to do.

---

## 4. Review Report Output File

Claude saves the complete combined report as `review_report.md`:

```
/dewa-project/
└── review_report.md   ← auto-generated, fed into TS_TEMPLATE.md §6
```

This file is read automatically by `TS_TEMPLATE.md` during TS generation.
Never delete or modify it manually — it is the official test evidence record.

---

> **End of CODEREVIEW.md**
> Maintained by Abdulsamee.
> Update this file when:
> - A new PERF or STY pattern is added to AGENTS_BACKEND.md
> - A new GUARDRAILS.md §1–§8 rule requires a review check
> - The abap-mcp-server adds new review tools
> - A new auto-fix is proven safe and added to the auto-fix lists above

---

## 4. DEWA Security Standards

Security standards are maintained separately by the DEWA Red Team.

**File:** `/security/SECURITY-Red-Team.md`

Read this file alongside CODEREVIEW.md for all code reviews.
It contains SEC-01 through SEC-06 with full patterns, examples, and remediation.

| Rule | Severity |
|---|---|
| SEC-01 — Authorization object check | CRITICAL |
| SEC-02 — No hardcoded credentials/URLs | CRITICAL |
| SEC-03 — No sensitive data in URL params | HIGH |
| SEC-04 — Input validation on OData payloads | HIGH |
| SEC-05 — Mandatory logging for sensitive ops | MEDIUM |
| SEC-06 — No bypass of SAP auth framework | CRITICAL + escalate |

> All SEC violations: never auto-fix · CRITICAL findings block transport
> SEC-06: notify Red Team immediately · do not release without sign-off

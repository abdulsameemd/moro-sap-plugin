# TS_TEMPLATE.md — DEWA Technical Specification Template
## Auto-Generated from Pipeline Artefacts via generateWricefSpec

> **Maintained by:** Abdulsamee
> **Purpose:** Defines the DEWA Technical Specification (TS) template and instructs Claude
> exactly how to auto-populate it from artefacts generated during the pipeline.
> The TS is generated automatically after `CONFIRM REVIEW` — never before.
>
> **Position in pipeline:** Stage 8 — after code review confirmed, before transport.
> **Primary tool:** `abap-mcp-server:generateWricefSpec` — fetches ABAP object metadata
> and source, returns structured WRICEF specification content.
> **Secondary inputs:** `review_report.md` · lint results · ATC results · prototype screenshots
>
> **Output file:** `[AppName]_TS_[Date].md` saved to `/dewa-project/docs/`

---

## 0. Auto-Fill Instruction for Claude

When `CONFIRM REVIEW` is received, execute these steps in order:

```
1. Call generateWricefSpec for every generated ABAP class
   → Collects: object metadata, source summary, interface description
2. Read review_report.md from project root
   → Collects: PERF/STY findings, auto-fixes applied, flagged items resolved
3. Read linter results from Stage 3 (run_ui5_linter output)
   → Collects: zero-error confirmation, file list
4. Read ATC results from Stage 5 (runAtcCheck output)
   → Collects: violation count before/after, patterns fixed
5. Read prototype screenshots from ready_handoff.md
   → Attaches: prototype_ltr.png as design reference
6. Fill every [PLACEHOLDER] in the template below
7. Save as: /dewa-project/docs/[AppName]_TS_[YYYYMMDD].md
8. Report: "TS generated → [AppName]_TS_[Date].md · Ready for approver sign-off"
```

**Never leave a [PLACEHOLDER] empty.** If data is not available, write `N/A — [reason]`.

---

## 1. TS Document Template

---

# Technical Specification
## [AppName] — DEWA SAP Fiori Application

| Field | Value |
|---|---|
| **Document title** | [AppName] Technical Specification |
| **Document version** | 1.0 |
| **Status** | Draft / Under Review / Approved |
| **Date** | [YYYY-MM-DD — auto-fill from system date] |
| **Developer** | [Abdulsamee — auto-fill from git config user.name] |
| **Reviewer** | [Approver name — leave blank for developer to fill] |
| **Target system** | [S/4HANA On-Prem / S/4HANA Cloud / BTP — from session checklist] |
| **SAP client** | [Client number — from INTEGRATION.md §2] |
| **Transport request** | [TR number — auto-fill from listTransports after Stage 9] |
| **App namespace** | [com.dewa.[appname] — from scaffold] |
| **Service binding** | [Z[XX]_UI_[Description]_O4 — from CLAUDE_BACKEND.md §2 Step 14] |
| **OData version** | V4 |
| **Floorplan** | [List Report / Object Page / Freestyle — from session checklist] |

---

## §1. Business Requirement

### 1.1 Requirement Summary
[Developer fills this — Claude leaves it blank with instruction:]
> **Developer action:** Paste the original business requirement here verbatim.

### 1.2 Scope
[Auto-fill from session checklist confirmations:]
- Deployment target: [S/4HANA On-Prem / Cloud / BTP]
- CRUD operations: [C / R / U / D / Actions / Functions — from checklist]
- Draft handling: [Yes / No]
- Entity structure: [Root only / Root + child]
- Locales: English (EN) · Arabic (AR)

### 1.3 Out of Scope
[Developer fills — Claude pre-populates with:]
> Items not covered in this delivery: [list any explicitly excluded items from session]

---

## §2. Design Reference

### 2.1 Prototype
[Auto-fill: attach prototype_ltr.png]
> Approved prototype screenshot — Desktop LTR view.
> Full prototype including mobile and RTL views: `ready_handoff.md`

### 2.2 Design System Compliance
| Token category | Status | Notes |
|---|---|---|
| Color tokens | [✅ Compliant / ❌ Violations] | [from SKILL_PROTOTYPE_EXPORT Hook 3 report] |
| Typography | Dubai Font — local @font-face | |
| Spacing | 4px grid — verified by linter | |
| RTL support | Tested — CSS logical properties | |
| Dark theme | Tested — `?sap-ui-theme=sap_horizon_dark` | |

---

## §3. Frontend Artefacts

[Auto-fill from run_ui5_linter and file system:]

### 3.1 Files Generated
| File | Type | Screen |
|---|---|---|
| [auto-fill from scaffold] | XML View | [screen name] |
| [auto-fill] | TypeScript Controller | [screen name] |
| `webapp/css/styles.css` | CSS | Global |
| `i18n/i18n_en.properties` | i18n | [N] keys |
| `i18n/i18n_ar.properties` | i18n | [N] keys |
| `manifest.json` | App descriptor | — |

### 3.2 SAPUI5 Controls Used
[Auto-fill from control mapping table in ready_handoff.md:]
| Control | Purpose | Screen |
|---|---|---|
| [from mapping table] | | |

### 3.3 i18n Summary
- Total keys: [N]
- EN translations: [N] / [N] ✅
- AR translations: [N] / [N] [✅ / ⚠️ placeholders remaining]
- Missing AR keys: [list if any — from CODEREVIEW.md I1]

### 3.4 Linter Result
```
run_ui5_linter result: ✅ Zero errors
Last run: [timestamp]
Files checked: [N]
```

---

## §4. Backend Artefacts

[Auto-fill from generateWricefSpec + CLAUDE_BACKEND.md §2 generation order:]

### 4.1 Database Objects
| Object | Type | Description |
|---|---|---|
| [ZXX_Description — auto-fill] | Transparent table | [from generateWricefSpec] |
| [ZXX_Description_D — if draft] | Draft table | |

### 4.2 CDS View Entities
| Object | Type | Description |
|---|---|---|
| [ZXX_I_Description] | Interface view | [from generateWricefSpec] |
| [ZXX_R_Description] | Root view | |
| [ZXX_C_Description] | Projection view | |
| [ZXX_C_Description_M] | Metadata extension | |

### 4.3 Behavior Objects
| Object | Type | Description |
|---|---|---|
| [ZXX_R_Description — BDEF] | Interface BDEF | strict(2) · managed |
| [ZXX_C_Description — BDEF] | Projection BDEF | |
| [ZCL_XX_BP_Description] | Behavior pool | [from generateWricefSpec] |

### 4.4 Service Objects
| Object | Type |
|---|---|
| [Z[XX]_SD_Description] | Service definition |
| [Z[XX]_UI_Description_O4] | Service binding — Fiori UI |

### 4.5 CRUD Operations Implemented
| Operation | Entity | Method | Notes |
|---|---|---|---|
| [C/R/U/D/Action — from checklist] | [EntityName] | [EML statement] | |

### 4.6 Authorization Objects
| Auth object | Activity codes | Entity |
|---|---|---|
| [ZXX_AuthObject — from handler class] | [01 Create / 02 Change / 03 Display / 06 Delete] | |

---

## §5. OData Service Integration

[Auto-fill from INTEGRATION.md §3 verification output:]

### 5.1 Service Details
| Field | Value |
|---|---|
| Service URI | [/sap/opu/odata4/... — from INTEGRATION.md §1.1] |
| $metadata status | ✅ HTTP 200 verified |
| EntityTypes | [N] — [list names] |
| Draft entities | None |

### 5.2 EDM → UI5 Type Mapping
[Auto-fill from INTEGRATION.md §4 re-verification table]

---

## §6. Code Review Evidence

[Auto-fill from review_report.md:]

### 6.1 Frontend Review Summary
```
[paste FRONTEND REVIEW REPORT section from review_report.md]
```

### 6.2 Backend Review Summary
```
[paste BACKEND REVIEW REPORT section from review_report.md]
```

### 6.3 Performance Impact
| Method | Before | After | Saving |
|---|---|---|---|
| [auto-fill from ATC review — execution time table] | | | |

**Total RFC round-trips removed:** [N]
**Average DB time reduction:** [N]%
**Silent exceptions eliminated:** 0

### 6.4 ATC Result (Post Auto-Fix)
```
runAtcCheck result: ✅ Zero violations
Last run: [timestamp]
Objects checked: [N]
```

---

## §7. Transport Request

[Auto-fill after Stage 9 — listTransports + validateTransport:]

### 7.1 Transport Details
| Field | Value |
|---|---|
| Transport number | [DEVK9XXXXX — from listTransports] |
| Transport description | [AppName] — DEWA Fiori App |
| Target system | [QAS / PRD] |
| Objects count | [N] |

### 7.2 Transport Validation Result
```
validateTransport result: ✅ No issues
Missing objects: None
Syntax errors: None
Conflicts: None
```

### 7.3 Objects in Transport
| Object type | Object name | Description |
|---|---|---|
| [TABL / DDLS / BDEF / CLAS / DESD / SRVB — from validateTransport] | | |

---

## §8. Test Evidence

### 8.1 Unit Tests
| Test class | Coverage | Result |
|---|---|---|
| [ltc_[entity]_test — from CLAUDE_BACKEND.md §5 Step 5] | Valid path + invalid path | ✅ Pass |

### 8.2 Smoke Test Checklist
| # | Test | Result |
|---|---|---|
| 1 | App loads in FLP without error | ☐ |
| 2 | OData $metadata responds HTTP 200 | ✅ Verified in Stage 6 |
| 3 | List screen renders with data | ☐ |
| 4 | Object page opens on row select | ☐ |
| 5 | Create operation completes successfully | ☐ |
| 6 | RTL layout correct (`?sap-ui-rtl=true`) | ☐ |
| 7 | Dark theme correct (`?sap-ui-theme=sap_horizon_dark`) | ☐ |
| 8 | Arabic translations display correctly | ☐ |

> **Developer action:** Complete smoke test checklist after deployment (Stage 10).

---

## §9. Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Developer | [Abdulsamee] | [Date] | |
| Technical lead | | | |
| Functional lead | | | |
| Security review | | | |

---

*End of Technical Specification — [AppName] — Generated by DEWA pipeline*
*Auto-populated by Claude using `generateWricefSpec` + `review_report.md` + linter/ATC results*

---

> **End of TS_TEMPLATE.md**
> Maintained by Abdulsamee.
> Update this file when:
> - A new DEWA TS section is mandated by governance
> - generateWricefSpec output format changes
> - A new sign-off role is added to the approval chain
> - Transport object types table needs a new entry

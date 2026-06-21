# SAP_CLEAN_CORE.md — DEWA SAP Clean Core Compliance
## ABAP Cloud · Released APIs · Extension Model · BTP Integration

> **Maintained by:** Abdulsamee
> **Purpose:** Defines SAP Clean Core compliance rules for all DEWA ABAP development.
> Clean Core means keeping the SAP system "clean" — no modifications to standard SAP
> objects, using only released APIs, and building extensions on BTP or via RAP/CAP.
> This file is read by Claude automatically alongside CLAUDE_BACKEND.md.
>
> **SAP Clean Core pillars covered:**
> - Clean Data · Clean Processes · Clean Extensions · Clean Operations · Clean Integration
>
> **Applies to:** All DEWA S/4HANA On-Prem 2023 FPS01+ and S/4HANA Cloud development.
> **Reference:** SAP Clean Core Strategy · ABAP Cloud development model · Tier 1/2/3 API model

---

## 0. What is Clean Core — DEWA Context

SAP Clean Core is SAP's strategy to ensure S/4HANA systems remain upgradeable and
maintainable by avoiding modifications to SAP standard objects and using only
stable, released APIs for all custom development.

For DEWA, Clean Core means:

| Principle | What it means for DEWA development |
|---|---|
| **Clean Extensions** | All custom code uses RAP, CAP, or BTP — never modifies SAP standard objects |
| **Clean Data** | Custom fields via ABAP Data Dictionary extensions — never direct table modifications |
| **Clean Processes** | Business process variants via BAdIs or RAP actions — never implicit enhancements |
| **Clean Integration** | All integrations via released OData V4 APIs or SAP Integration Suite — never RFC/BAPI direct calls in Cloud |
| **Clean Operations** | Monitoring via SAP Cloud ALM — never custom monitoring that bypasses SAP tooling |

**Bottom line:** If it runs on S/4HANA Cloud Public Edition without modification — it is Clean Core compliant.

---

## 1. ABAP Tier Model — What Claude Must Always Check First

Before generating any ABAP code, Claude confirms the tier. The tier determines everything.

### 1.1 Tier Classification

| Tier | Scope | What is allowed | DEWA target |
|---|---|---|---|
| **Tier 1** | ABAP Cloud (S/4HANA Cloud, BTP ABAP) | Released APIs only · `@AbapCatalog.objectModelCategory` released objects · RAP · CDS · No classic ABAP statements | Cloud deployments |
| **Tier 2** | Released on-prem (S/4HANA On-Prem) | Tier 1 + additional released on-prem APIs · SAP-released function modules | On-Prem approved APIs |
| **Tier 3** | Classic on-prem | Full classic ABAP · All function modules · BAPIs · RFCs · All statements | On-Prem only — minimize use |

> **DEWA rule:** Default to Tier 1 patterns even on On-Prem. Use Tier 2/3 only when
> a released API does not exist for the required function. Always document why.

### 1.2 How Claude Checks Tier Compliance

Before writing any ABAP statement, Claude checks:

```
Is this object/statement/API released for ABAP Cloud (Tier 1)?
  YES → Use it
  NO  → Is there a released alternative?
        YES → Use the alternative
        NO  → Is On-Prem target confirmed?
              YES → Use Tier 2/3 with a comment: "-- Tier 3: no released API available"
              NO  → Block and ask developer for target confirmation
```

---

## 2. Forbidden in ABAP Cloud (Tier 1) — Claude Must Never Generate

### 2.1 Forbidden Statements

| Forbidden | Reason | Clean alternative |
|---|---|---|
| `CALL FUNCTION` | Not released for Cloud | Class-based API via `NEW` + method call |
| `CALL TRANSACTION` | Direct UI navigation forbidden | RAP action or BTP Workflow |
| `SUBMIT` | Background job submission forbidden | Application Job API (`cl_bp_abap_job`) |
| `CALL SCREEN` | SAP GUI screen forbidden | Fiori UI via RAP OData |
| `MODIFY [SAP table]` | Direct DML on SAP standard tables | RAP EML (`MODIFY ENTITIES`) |
| `INSERT [SAP table]` | Direct DML on SAP standard tables | RAP EML |
| `DELETE [SAP table]` | Direct DML on SAP standard tables | RAP EML |
| `UPDATE [SAP table]` | Direct DML on SAP standard tables | RAP EML |
| `WRITE` | SAP GUI list output | Fiori UI |
| `MESSAGE` (type A/E) | Modifies program flow via exception | `cx_` exception classes |
| `ROLLBACK WORK` | Transaction control forbidden | RAP managed transaction |
| `COMMIT WORK` | Transaction control forbidden | `COMMIT ENTITIES` |
| `AUTHORITY-CHECK` (old form) | Use Cloud-compliant form | `cl_abap_authority_check` |
| `GET TIME STAMP` | Obsolete | `utclong_current()` |
| Direct access to `sy-` fields in Cloud | Some not available | Use released alternatives |

### 2.2 Forbidden Object Types in Cloud

| Object type | Reason | Alternative |
|---|---|---|
| Function groups / Function modules | Legacy — not releasable | ABAP classes |
| Enhancement spots in SAP standard | Modifies standard | BAdI (Business Add-In) |
| User exits (EXIT_*) | Legacy modification | BAdI |
| Classic BDC (batch input) | SAP GUI dependency | RAP actions or BTP |
| Enqueue/Dequeue locks (classic) | Replaced | RAP lock mechanism |

### 2.3 What Claude Must Add Instead

```abap
" ❌ WRONG — classic function module call (Tier 3 only)
CALL FUNCTION 'BAPI_VENDOR_GETLIST'
  EXPORTING ...
  TABLES ....

" ✅ CORRECT — released class-based API (Tier 1)
DATA(lo_vendor) = NEW cl_mdr_bp_facade( ).
lo_vendor->get_vendor_data( ... ).

" ❌ WRONG — COMMIT WORK
COMMIT WORK.

" ✅ CORRECT — EML commit
COMMIT ENTITIES
  RESPONSE OF ZFI_R_VendorItem
  FAILED DATA(ls_failed)
  REPORTED DATA(ls_reported).
```

---

## 3. Clean Extension Model — How to Extend SAP Standard

DEWA never modifies SAP standard objects. All extensions use the approved patterns.

### 3.1 Extension Hierarchy (use in this order)

```
1. Key User Extensions (no-code/low-code)
   └── Custom fields via Extensibility app
   └── Custom logic via Custom Business Object
   └── Custom forms via Form Template Maintenance

2. Developer Extensions (ABAP Cloud)
   └── BAdI (Business Add-In) implementations
   └── RAP behavior extensions (via BDEF extensions)
   └── CDS view extensions (@AbapCatalog.extensibility)
   └── Custom RAP entities consuming released CDS views

3. Side-by-side Extensions (BTP)
   └── CAP application on BTP
   └── SAP Build Apps for simple UI
   └── SAP Integration Suite for connectivity
```

### 3.2 BAdI Implementation Rules

```abap
" ✅ CORRECT — BAdI implementation via class
CLASS zcl_dewa_badi_[name] DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES [badi_interface_name].

  PRIVATE SECTION.
    " implementation
ENDCLASS.

CLASS zcl_dewa_badi_[name] IMPLEMENTATION.
  METHOD [badi_interface_name]~[method].
    " Never CALL FUNCTION, COMMIT WORK, or MODIFY SAP tables here
    " Only use released APIs and RAP EML
  ENDMETHOD.
ENDCLASS.
```

**BAdI rules Claude enforces:**
- Never `COMMIT WORK` inside a BAdI — the calling framework controls the LUW
- Never `ROLLBACK WORK` inside a BAdI
- Never modify SAP standard tables directly — use EML or the BAdI's own persistence
- Always implement the full interface — no empty method bodies without comment

### 3.3 CDS View Extension Rules

```cds
" ✅ CORRECT — extend released CDS view
@AbapCatalog.sqlViewAppendName: 'ZXX_E_VENDOREXT'
extend view entity I_BusinessPartner with
{
  _ZVendorExtension.ZZ1_VendorCategory_Bus as VendorCategory,
  _ZVendorExtension.ZZ1_DEWACode_Bus       as DEWACode
}
```

**Rules:**
- Only extend released CDS views (annotated `@AbapCatalog.objectModelCategory: #BUSINESS_OBJECT`)
- Never extend SAP standard CDS views that are not released
- Extension field names must follow DEWA convention: `ZZ1_[FieldName]_[Context]`
- Always use `@AbapCatalog.sqlViewAppendName` for append structures

---

## 4. Released API Usage — DEWA Approved List

### 4.1 Business Partner APIs (relevant to Vendor Portal)

| API | Release state | Use for |
|---|---|---|
| `I_BusinessPartner` (CDS) | Released | Read BP data in CDS views |
| `I_Supplier` (CDS) | Released | Read supplier master in CDS views |
| `I_SupplierWithHoldingTax` (CDS) | Released | Tax data in supplier context |
| `cl_mdr_bp_facade` | Released | Class-based BP operations |
| OData: `API_BUSINESS_PARTNER` | Released | REST integration (V2) |
| OData: `sap.s4.beh.businesspartner.v1` | Released | Event-driven integration |

### 4.2 Finance APIs

| API | Release state | Use for |
|---|---|---|
| `I_JournalEntryItem` (CDS) | Released | FI reporting views |
| `I_CompanyCode` (CDS) | Released | Company code reference data |
| `I_PurchasingDocument` (CDS) | Released | PO data in reporting views |
| `I_PaymentDocument` (CDS) | Released | Payment status views |

### 4.3 How Claude verifies release state

```
In every CDS view join or class instantiation:
1. Check @AbapCatalog.objectModelCategory annotation
2. Check SAP API Business Hub for release state
3. If not confirmed released → flag with comment:
   "-- CLEAN CORE CHECK: Verify release state of [object] before activating on Cloud target"
```

---

## 5. Custom Fields — Clean Core Pattern

Never add fields directly to SAP standard transparent tables. Always use the extensibility framework.

### 5.1 Key User Custom Fields (preferred — no ABAP required)

```
Transaction: EXTENSIBILITY or SAP Fiori "Custom Fields and Logic" app
1. Select business context (e.g., BusinessPartner)
2. Create field: ZZ1_[FieldName]_[AppContext]
3. Field automatically added to extension include
4. Available in CDS view via _Extension association
5. Available in OData service automatically
```

### 5.2 Developer Custom Fields (when Key User extension is insufficient)

```abap
" 1. Create append structure to SAP include (not to SAP table directly)
" Extension include: CI_[SAPtable]
TYPES: BEGIN OF EXTENSION ci_but000_extension,
         zz1_dewa_code    TYPE char10,
         zz1_vendor_cat   TYPE char4,
       END OF ci_but000_extension.

" 2. Expose via CDS extension (see §3.3)
" 3. Never SELECT directly from SAP table — always via CDS view
```

---

## 6. Integration — Clean Core Patterns

### 6.1 Inbound Integration (external → S/4HANA)

| Pattern | When to use | Clean Core? |
|---|---|---|
| OData V4 via RAP | All new UI and API integrations | ✅ Yes |
| SAP Integration Suite iFlow | System-to-system integration | ✅ Yes |
| SOAP via released service | Legacy system integration | ✅ Yes (if service released) |
| RFC (direct) | Legacy on-prem only — no Cloud | ⚠️ Tier 3 only |
| BAPI (direct) | Legacy on-prem only — no Cloud | ⚠️ Tier 3 only |
| Direct DB connection | Never | ❌ Forbidden |

### 6.2 Outbound Integration (S/4HANA → external)

| Pattern | When to use | Clean Core? |
|---|---|---|
| Business Events (SAP Event Mesh) | Event-driven integrations | ✅ Yes |
| SAP Integration Suite | Any outbound call | ✅ Yes |
| `cl_http_client` (released form) | Simple REST calls | ✅ Tier 1 if used correctly |
| `CALL FUNCTION` destination RFC | Legacy on-prem only | ⚠️ Tier 3 only |

### 6.3 Event-Driven Integration Pattern (preferred for Cloud)

```abap
" ✅ CORRECT — raise business event (Tier 1)
cl_ce_grpc_outb_channel=>raise(
  EXPORTING
    iv_event_type  = 'sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1'
    iv_instance_id = lv_bp_id
).
```

---

## 7. Naming Conventions — Clean Core Compliant

All DEWA custom objects must use the reserved namespace to avoid conflicts with SAP standard.

| Object type | Naming pattern | Example |
|---|---|---|
| Packages | `ZDEWA_[DOMAIN]` | `ZDEWA_VENDOR` |
| Custom tables | `ZFI_[Name]` · `ZMM_[Name]` · `ZXX_[Name]` | `ZFI_VendorExt` |
| CDS views | `ZXX_I/R/C_[Name]` | `ZFI_I_VendorProfile` |
| ABAP classes | `ZCL_[XX]_[Name]` | `ZCL_FI_VendorHandler` |
| BAdI implementations | `ZCL_DEWA_BADI_[Name]` | `ZCL_DEWA_BADI_VendorCheck` |
| Custom fields | `ZZ1_[FieldName]_[Context]` | `ZZ1_DEWACode_Bus` |
| Service definitions | `Z[XX]_SD_[Name]` | `ZFI_SD_VendorProfile` |
| Service bindings | `Z[XX]_UI_[Name]_O4` | `ZFI_UI_VendorProfile_O4` |
| Transport tasks | `DEVK9[Number]` | `DEVK9A00001` |

---

## 8. Clean Core Checklist — Claude Runs Before Every Backend Artefact

| # | Check | Action on fail |
|---|---|---|
| 1 | Deployment target confirmed (Cloud/On-Prem)? | Stop — ask developer |
| 2 | All SAP objects used are in released API list? | Flag each unreleased object |
| 3 | No `CALL FUNCTION` in Cloud target? | Replace with class-based API |
| 4 | No `COMMIT WORK` anywhere? | Replace with `COMMIT ENTITIES` |
| 5 | No direct DML on SAP standard tables? | Replace with RAP EML |
| 6 | Custom fields use extension framework (ZZ1_)? | Flag and suggest framework |
| 7 | No modifications to SAP standard objects? | Block — suggest BAdI or extension |
| 8 | CDS join targets released views only? | Verify @objectModelCategory |
| 9 | Integration uses released API or Integration Suite? | Flag RFC/BAPI for review |
| 10 | All custom objects in ZDEWA_ namespace? | Flag non-namespaced objects |
| 11 | No `CALL TRANSACTION` or `SUBMIT`? | Replace with released alternative |
| 12 | No `CALL SCREEN` or `WRITE`? | Replace with Fiori UI via RAP |

---

## 9. Clean Core and the DEWA Framework

Clean Core compliance is verified at multiple framework stages:

| Stage | Clean Core check |
|---|---|
| Stage 5 — RAP generation | Tier confirmed · released APIs only · EML not DML |
| Stage 5 — syntaxCheck | Catches forbidden statements in Cloud targets |
| Stage 5 — runAtcCheck | DEWA ATC variant includes Clean Core checks |
| Stage 7 — Code review | CODEREVIEW.md §2 backend patterns include CC violations |
| Stage 9 — Transport | validateTransport catches objects in wrong packages |

**Claude adds this comment to every Tier 3 usage:**
```abap
" -- DEWA CLEAN CORE: Tier 3 pattern used. Reason: [explain].
" -- Target: On-Prem only. Not Cloud-deployable as-is.
" -- Upgrade path: [suggest released alternative when available].
```

---

## 10. Companion Files

| File | Relationship to this file |
|---|---|
| `CLAUDE_BACKEND.md` | Backend session instructions — reads this file for Tier rules |
| `GUARDRAILS.md` §9 | RAP coding standards — assumes Clean Core compliant artefacts |
| `AGENTS_BACKEND.md` | Backend Copilot rules — references this file for API tier |
| `METRICS.md` | Tracks Clean Core compliance rate as a KPI |

---

> **End of SAP_CLEAN_CORE.md**
> Maintained by Abdulsamee. Version 1.0.0.
> Update this file when:
> - SAP releases new APIs relevant to DEWA business domains
> - A new ABAP Cloud restriction is introduced in a new S/4HANA release
> - DEWA adopts a new BTP service that changes the extension model
> - The DEWA ATC variant adds new Clean Core checks
> See `CHANGELOG.md` for version history.

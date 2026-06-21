# PROMPTS_BACKEND.md — DEWA Backend Prompt Patterns & Code Examples
## ABAP · CDS · OData · RAP · CAP

> **Maintained by:** Abdulsamee
> **Audience:** Developers only — not loaded into AI context.
> Copy-paste these prompts and code examples when generating backend artefacts
> with Claude, GitHub Copilot, or any AI assistant.
>
> **Rules file:** `AGENTS_BACKEND.md`
> **Frontend equivalent:** `PROMPTS.md`

---

## Table of Contents

1. [Session Start](#1-session-start)
2. [ABAP EML — CRUD Code Examples](#2-abap-eml--crud-code-examples)
3. [CDS View Entity Examples](#3-cds-view-entity-examples)
4. [OData Service Definition Example](#4-odata-service-definition-example)
5. [RAP BDEF Examples](#5-rap-bdef-examples)
6. [RAP Handler Class Example](#6-rap-handler-class-example)
7. [ABAP Unit Test Example](#7-abap-unit-test-example)
8. [CAP Schema Example](#8-cap-schema-example)
9. [CAP Service Definition Example](#9-cap-service-definition-example)
10. [CAP Handler — Full CRUD Example](#10-cap-handler--full-crud-example)
11. [Prompt Patterns — Copy-Paste Ready](#11-prompt-patterns--copy-paste-ready)
12. [Failure Prevention](#12-failure-prevention)

---

## 1. Session Start

Use this at the beginning of every backend Copilot / Claude session:

```
Read AGENTS_BACKEND.md in full before generating any code.

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

---

## 2. ABAP EML — CRUD Code Examples

### 2.1 Create

```abap
MODIFY ENTITY zdewa_i_billingitem
  CREATE
  FIELDS ( AccountID Amount DueDate Status )
  WITH VALUE #(
    ( %cid      = 'CID_001'
      AccountID = '100012345'
      Amount    = '420.00'
      DueDate   = '20240630'
      Status    = 'PENDING' )
  )
  MAPPED   DATA(ls_mapped)
  FAILED   DATA(ls_failed)
  REPORTED DATA(ls_reported).

IF ls_failed IS NOT INITIAL.
  " Handle failures
ENDIF.

COMMIT ENTITIES
  RESPONSE OF zdewa_i_billingitem
  FAILED   DATA(lc_failed)
  REPORTED DATA(lc_reported).

IF sy-subrc <> 0.
  " Save sequence failed
ENDIF.
```

### 2.2 Read

```abap
" Read single / collection
READ ENTITY zdewa_i_billingitem
  ALL FIELDS
  WITH VALUE #( ( AccountID = '100012345' ) )
  RESULT   DATA(lt_result)
  FAILED   DATA(ls_failed)
  REPORTED DATA(ls_reported).

" Read by association (child entity)
READ ENTITY zdewa_i_billingitem
  BY \_BillingItems
  ALL FIELDS
  WITH VALUE #( ( AccountID = '100012345' ) )
  RESULT   DATA(lt_items)
  FAILED   DATA(ls_failed_items)
  REPORTED DATA(ls_reported_items).
```

### 2.3 Update

```abap
" Always specify FIELDS — never full entity update
MODIFY ENTITY zdewa_i_billingitem
  UPDATE
  FIELDS ( Status DueDate )
  WITH VALUE #(
    ( AccountID = '100012345'
      Status    = 'PAID'
      DueDate   = '20240615' )
  )
  FAILED   DATA(ls_failed)
  REPORTED DATA(ls_reported).

COMMIT ENTITIES
  RESPONSE OF zdewa_i_billingitem
  FAILED   DATA(lc_failed)
  REPORTED DATA(lc_reported).
```

### 2.4 Delete

```abap
MODIFY ENTITY zdewa_i_billingitem
  DELETE
  FROM VALUE #( ( AccountID = '100012345' ) )
  FAILED   DATA(ls_failed)
  REPORTED DATA(ls_reported).

COMMIT ENTITIES
  RESPONSE OF zdewa_i_billingitem
  FAILED   DATA(lc_failed)
  REPORTED DATA(lc_reported).
```

---

## 3. CDS View Entity Examples

### 3.1 Interface View Entity (Layer 2 — Root)

```abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Billing Item — Interface View'
@AbapCatalog.viewEnhancementCategory: [#NONE]

define root view entity ZFI_R_BillingItem
  as select from zfi_billing as BillingItem
  composition [0..*] of ZFI_I_BillingLineItem as _LineItems
{
  key BillingItem.billing_id              as BillingID,
      BillingItem.account_id              as AccountID,
      BillingItem.amount                  as Amount,
      BillingItem.currency                as Currency,
      BillingItem.due_date                as DueDate,
      BillingItem.status                  as Status,

      " Criticality computed here — never in projection
      case BillingItem.status
        when 'PAID'    then 3
        when 'PENDING' then 2
        when 'OVERDUE' then 1
        else                0
      end                                 as StatusCriticality,

      " Managed admin fields — always include all five
      BillingItem.created_at              as CreatedAt,
      BillingItem.created_by              as CreatedBy,
      BillingItem.last_changed_at         as LastChangedAt,
      BillingItem.last_changed_by         as LastChangedBy,
      BillingItem.local_last_changed_at   as LocalLastChangedAt,

      _LineItems
}
```

### 3.2 Projection View Entity (Consumption View)

```abap
@EndUserText.label: 'Billing Item — Consumption View'
@AccessControl.authorizationCheck: #NOT_REQUIRED
@Metadata.allowExtensions: true

@UI.headerInfo: {
  typeName:       'Billing Item',
  typeNamePlural: 'Billing Items',
  title:          { type: #STANDARD, value: 'BillingID' },
  description:    { type: #STANDARD, value: 'AccountID' }
}

define root view entity ZFI_C_BillingItem
  provider contract transactional_query
  as projection on ZFI_R_BillingItem
{
{
      @UI.facet: [
        { id: 'BillingInfo', type: #IDENTIFICATION_REFERENCE,
          label: 'Billing Information', position: 10 },
        { id: 'LineItems',   type: #LINEITEM_REFERENCE,
          targetElement: '_LineItems', label: 'Line Items', position: 20 }
      ]

  key BillingID,

      @UI.lineItem:      [{ position: 10, label: 'Account' }]
      @UI.identification:[{ position: 10 }]
      @UI.selectionField:[{ position: 10 }]
      AccountID,

      @UI.lineItem:      [{ position: 20, label: 'Amount' }]
      @UI.identification:[{ position: 20 }]
      Amount,

      Currency,

      @UI.lineItem:      [{ position: 30, label: 'Due Date' }]
      @UI.identification:[{ position: 30 }]
      DueDate,

      @UI.lineItem:      [{ position: 40, label: 'Status',
                            criticality: 'StatusCriticality' }]
      @UI.identification:[{ position: 40 }]
      @UI.selectionField:[{ position: 20 }]
      Status,

      @UI.hidden: true
      StatusCriticality,

      CreatedAt,
      CreatedBy,
      LastChangedAt,

      _LineItems : redirected to composition child ZFI_C_BillingLineItem
}
```

---

## 4. OData Service Definition Example

```abap
@EndUserText.label: 'DEWA Billing Service'
define service ZFI_SD_BillingItem {
  expose ZFI_C_BillingItem     as BillingItem;
  expose ZFI_C_BillingLineItem as BillingLineItem;
}
```

---

## 5. RAP BDEF Examples

### 5.1 Interface BDEF (Managed)

```abap
managed implementation in class ZCL_FI_BP_BillingItem unique;
strict ( 2 );

define behavior for ZFI_R_BillingItem alias BillingItem
  persistent table zfi_billing
  lock master
  total etag LastChangedAt
  authorization master ( instance )
  etag master LocalLastChangedAt
{
  " CRUD Operations
  create;
  update;
  delete;

  " Associations
  association _LineItems { create; }

  " Field control
  field ( readonly )        BillingID;
  field ( mandatory )       AccountID, Amount, DueDate;
  field ( readonly : update ) CreatedAt, CreatedBy;

  " Determinations
  determination setInitialStatus
    on modify { create; }

  determination calculateTotalAmount
    on modify { field Amount; }

  " Validations
  validation validateAmount
    on save { create; update; field Amount; }

  validation validateDueDate
    on save { create; update; field DueDate; }

  " Actions
  action submitPayment
    parameter ZFI_D_PaymentInput
    result [1] $self;

  " Field mapping
  mapping for zfi_billing corresponding
  {
    BillingID          = billing_id;
    AccountID          = account_id;
    Amount             = amount;
    Currency           = currency;
    DueDate            = due_date;
    Status             = status;
    CreatedAt          = created_at;
    CreatedBy          = created_by;
    LastChangedAt      = last_changed_at;
    LastChangedBy      = last_changed_by;
    LocalLastChangedAt = local_last_changed_at;
  }
}

define behavior for ZFI_I_BillingLineItem alias LineItem
  persistent table zfi_billing_item
  lock dependent by _BillingItem
  authorization dependent by _BillingItem
  etag master LocalLastChangedAt
{
  update;
  delete;

  field ( readonly )  BillingID, ItemID;
  field ( mandatory ) Description, ItemAmount;

  association _BillingItem;

  mapping for zfi_billing_item corresponding
  {
    BillingID          = billing_id;
    ItemID             = item_id;
    Description        = description;
    ItemAmount         = item_amount;
    LocalLastChangedAt = local_last_changed_at;
  }
}
```

### 5.2 Projection BDEF

```abap
projection;
strict ( 2 );

define behavior for ZFI_C_BillingItem alias BillingItem
{
  use create;
  use update;
  use delete;

  use association _LineItems { create; }
  use action submitPayment;
}

define behavior for ZFI_C_BillingLineItem alias LineItem
{
  use update;
  use delete;
  use association _BillingItem;
}
```

---

## 6. RAP Handler Class Example

```abap
CLASS ZCL_FI_BP_BillingItem DEFINITION
  PUBLIC ABSTRACT FINAL
  FOR BEHAVIOR OF ZFI_R_BillingItem.
ENDCLASS.

CLASS ZCL_FI_BP_BillingItem IMPLEMENTATION.
ENDCLASS.

" ─── Local Handler Class ──────────────────────────────────────────────────────
CLASS lhc_BillingItem DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS validate_amount
      FOR VALIDATE ON SAVE
      IMPORTING keys FOR BillingItem~validateAmount.

    METHODS validate_due_date
      FOR VALIDATE ON SAVE
      IMPORTING keys FOR BillingItem~validateDueDate.

    METHODS set_initial_status
      FOR DETERMINE ON MODIFY
      IMPORTING keys FOR BillingItem~setInitialStatus.

    METHODS calculate_total_amount
      FOR DETERMINE ON MODIFY
      IMPORTING keys FOR BillingItem~calculateTotalAmount.

    METHODS submit_payment
      FOR MODIFY
      IMPORTING keys FOR ACTION BillingItem~submitPayment
                          RESULT result.

    METHODS get_instance_authorizations
      FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations
                    FOR BillingItem
                RESULT result.
ENDCLASS.

CLASS lhc_BillingItem IMPLEMENTATION.

  METHOD validate_amount.
    READ ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
      ENTITY BillingItem
      FIELDS ( Amount )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_billing)
      FAILED failed.

    LOOP AT lt_billing INTO DATA(ls_billing).
      IF ls_billing-Amount <= 0.
        APPEND VALUE #(
          BillingID = ls_billing-BillingID
        ) TO failed-billingitem.

        APPEND VALUE #(
          BillingID       = ls_billing-BillingID
          %msg            = new_message_with_text(
                              severity = if_abap_behv_message=>severity-error
                              text     = 'Amount must be greater than zero'
                            )
          %element-Amount = if_abap_behv=>mk-on
        ) TO reported-billingitem.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD validate_due_date.
    READ ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
      ENTITY BillingItem
      FIELDS ( DueDate )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_billing)
      FAILED failed.

    LOOP AT lt_billing INTO DATA(ls_billing).
      IF ls_billing-DueDate < cl_abap_context_info=>get_system_date( ).
        APPEND VALUE #( BillingID = ls_billing-BillingID ) TO failed-billingitem.
        APPEND VALUE #(
          BillingID        = ls_billing-BillingID
          %msg             = new_message_with_text(
                               severity = if_abap_behv_message=>severity-error
                               text     = 'Due date cannot be in the past'
                             )
          %element-DueDate = if_abap_behv=>mk-on
        ) TO reported-billingitem.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD set_initial_status.
    MODIFY ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
      ENTITY BillingItem
      UPDATE FIELDS ( Status )
      WITH VALUE #(
        FOR key IN keys (
          BillingID = key-BillingID
          Status    = 'PENDING'
        )
      )
      REPORTED DATA(lt_reported).
  ENDMETHOD.

  METHOD calculate_total_amount.
    READ ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
      ENTITY BillingItem BY \_LineItems
      ALL FIELDS
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_items).

    DATA lt_totals TYPE TABLE OF STRUCTURE zfi_billing.
    LOOP AT lt_items INTO DATA(ls_item).
      COLLECT VALUE zfi_billing(
        billing_id = ls_item-BillingID
        amount     = ls_item-ItemAmount
      ) INTO lt_totals.
    ENDLOOP.

    MODIFY ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
      ENTITY BillingItem
      UPDATE FIELDS ( Amount )
      WITH VALUE #(
        FOR total IN lt_totals (
          BillingID = total-billing_id
          Amount    = total-amount
        )
      )
      REPORTED DATA(lt_reported).
  ENDMETHOD.

  METHOD submit_payment.
    LOOP AT keys INTO DATA(ls_key).
      READ ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
        ENTITY BillingItem
        FIELDS ( Status Amount )
        WITH VALUE #( ( BillingID = ls_key-BillingID ) )
        RESULT DATA(lt_billing).

      READ TABLE lt_billing INTO DATA(ls_billing) INDEX 1.
      IF ls_billing-Status <> 'PENDING'.
        APPEND VALUE #(
          BillingID = ls_key-BillingID
          %msg      = new_message_with_text(
                        severity = if_abap_behv_message=>severity-error
                        text     = 'Only PENDING bills can be submitted for payment'
                      )
        ) TO reported-billingitem.
        CONTINUE.
      ENDIF.

      MODIFY ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
        ENTITY BillingItem
        UPDATE FIELDS ( Status )
        WITH VALUE #( ( BillingID = ls_key-BillingID Status = 'SUBMITTED' ) )
        REPORTED DATA(lt_mod_reported).

      READ ENTITIES OF ZFI_R_BillingItem IN LOCAL MODE
        ENTITY BillingItem
        ALL FIELDS
        WITH VALUE #( ( BillingID = ls_key-BillingID ) )
        RESULT DATA(lt_result).

      result = VALUE #( FOR r IN lt_result (
        %tky   = ls_key-%tky
        %param = r
      ) ).
    ENDLOOP.
  ENDMETHOD.

  METHOD get_instance_authorizations.
    LOOP AT keys INTO DATA(ls_key).
      AUTHORITY-CHECK OBJECT 'ZFI_BILL'
        ID 'ACTVT' FIELD '02'.
      IF sy-subrc = 0.
        APPEND VALUE #(
          BillingID = ls_key-BillingID
          %update   = if_abap_behv=>auth-allowed
          %delete   = if_abap_behv=>auth-allowed
        ) TO result.
      ELSE.
        APPEND VALUE #(
          BillingID = ls_key-BillingID
          %update   = if_abap_behv=>auth-unauthorized
          %delete   = if_abap_behv=>auth-unauthorized
        ) TO result.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

ENDCLASS.
```

---

## 7. ABAP Unit Test Example

```abap
CLASS ltc_billingitem_test DEFINITION
  FOR TESTING
  RISK LEVEL HARMLESS
  DURATION SHORT.

  PRIVATE SECTION.
    METHODS: test_validate_amount_positive FOR TESTING,
             test_validate_amount_negative FOR TESTING,
             test_validate_due_date_past   FOR TESTING.

ENDCLASS.

CLASS ltc_billingitem_test IMPLEMENTATION.

  METHOD test_validate_amount_positive.
    " Valid amount — should pass
    cl_abap_unit_assert=>assert_equals(
      exp = abap_true
      act = zcl_dewa_billing_validator=>validate_amount( amount = '100.00' )
      msg = 'Valid amount should pass validation'
    ).
  ENDMETHOD.

  METHOD test_validate_amount_negative.
    " Zero amount — should fail
    cl_abap_unit_assert=>assert_equals(
      exp = abap_false
      act = zcl_dewa_billing_validator=>validate_amount( amount = '0.00' )
      msg = 'Zero amount should fail validation'
    ).
  ENDMETHOD.

  METHOD test_validate_due_date_past.
    " Past date — should fail
    cl_abap_unit_assert=>assert_equals(
      exp = abap_false
      act = zcl_dewa_billing_validator=>validate_due_date(
              due_date = '20200101' )
      msg = 'Past due date should fail validation'
    ).
  ENDMETHOD.

ENDCLASS.
```

---

## 8. CAP Schema Example

```cds
// db/schema.cds
namespace com.dewa.billing;

using { managed, cuid } from '@sap/cds/common';

entity BillingItems : cuid, managed {
  AccountID  : String(20)    not null;
  Amount     : Decimal(15,2) not null;
  Currency   : String(3)     default 'AED';
  DueDate    : Date          not null;
  Status     : String(20)    default 'PENDING'
    @assert.range enum {
      PENDING;
      SUBMITTED;
      PAID;
      OVERDUE;
      CANCELLED;
    };
  LineItems  : Composition of many BillingLineItems on LineItems.billing = $self;
}

entity BillingLineItems : cuid, managed {
  billing     : Association to BillingItems not null;
  Description : String(255)  not null;
  ItemAmount  : Decimal(15,2) not null;
  Quantity    : Integer       default 1;
}
```

---

## 9. CAP Service Definition Example

```cds
// srv/billing-service.cds
using com.dewa.billing from '../db/schema';

@path: '/billing'
service BillingService @(requires: 'authenticated-user') {

  @(restrict: [
    { grant: ['READ'],                   to: 'BillingViewer' },
    { grant: ['READ','CREATE','UPDATE'], to: 'BillingEditor' },
    { grant: ['*'],                      to: 'BillingAdmin'  }
  ])
  @Capabilities.Insertable: true
  @Capabilities.Updatable:  true
  @Capabilities.Deletable:  true
  entity BillingItems as projection on billing.BillingItems
    actions {
      action submitPayment(paymentRef: String) returns BillingItems;
    };

  @Capabilities.Insertable: true
  @Capabilities.Updatable:  true
  @Capabilities.Deletable:  true
  entity BillingLineItems as projection on billing.BillingLineItems;

  @readonly
  entity BillingSummary as select from billing.BillingItems {
    AccountID,
    count(*) as TotalBills   : Integer,
    sum(Amount) as TotalAmount : Decimal(15,2)
  } group by AccountID;
}
```

---

## 10. CAP Handler — Full CRUD Example

```javascript
// srv/billing-service.js
const cds = require('@sap/cds')

module.exports = class BillingService extends cds.ApplicationService {

  async init() {
    const { BillingItems } = this.entities

    // ── BEFORE — Validation ──────────────────────────────────
    // Validate Amount on CREATE and UPDATE
    this.before(['CREATE', 'UPDATE'], BillingItems, async (req) => {
      const { Amount } = req.data
      if (Amount !== undefined && Amount <= 0) {
        req.error(400, 'Amount must be greater than zero', 'Amount')
      }
    })

    // Validate DueDate is not in the past on CREATE
    this.before('CREATE', BillingItems, async (req) => {
      const { DueDate } = req.data
      if (DueDate && new Date(DueDate) < new Date()) {
        req.error(400, 'Due date cannot be in the past', 'DueDate')
      }
    })

    // Guard DELETE — cannot delete PAID bills
    this.before('DELETE', BillingItems, async (req) => {
      const bill = await SELECT.one.from(BillingItems).where({ ID: req.data.ID })
      if (bill?.Status === 'PAID') {
        req.error(403, 'Paid billing items cannot be deleted')
      }
    })

    // ── AFTER — Enrichment ───────────────────────────────────
    // Add computed StatusCriticality for UI color mapping
    this.after('each', BillingItems, (bill) => {
      bill.StatusCriticality = {
        'PAID':      3,  // #007560 — positive
        'PENDING':   2,  // #FFC600 — warning
        'OVERDUE':   1,  // #B00020 — error
        'CANCELLED': 0,  // #6F6F6F — neutral
      }[bill.Status] ?? 0
    })

    // ── ON — Actions ─────────────────────────────────────────
    this.on('submitPayment', BillingItems, async (req) => {
      const { ID, paymentRef } = req.data

      // 1. Read current entity
      const bill = await SELECT.one.from(BillingItems).where({ ID })
      if (!bill) return req.error(404, `Billing item ${ID} not found`)

      // 2. Validate state transition
      if (bill.Status !== 'PENDING') {
        return req.error(409, 'Only PENDING bills can be submitted for payment')
      }

      // 3. Update status
      await UPDATE(BillingItems)
        .set({ Status: 'SUBMITTED' })
        .where({ ID })

      // 4. Log the action
      cds.log('BillingService').info(`Bill ${ID} submitted. Ref: ${paymentRef}`)

      // 5. Return updated entity
      return SELECT.one.from(BillingItems).where({ ID })
    })

    return super.init()
  }
}
```

---

## 11. Prompt Patterns — Copy-Paste Ready

### 11.1 Generate RAP Interface View

```
Generate a RAP interface CDS view entity for the [EntityName] entity.

Rules (from AGENTS_BACKEND.md §1.2 — DEWA Development Guidelines V6.0):
- Interface view: ZXX_I_[Description] (e.g., ZFI_I_BankDetails)
- Root view: ZXX_R_[Description] (e.g., ZMM_R_PurchaseOrder)
- Projection view: ZXX_C_[Description] (e.g., ZSD_C_SalesOrder)
- Draft table: ZXX_[Description]_D
- All field aliases in UpperCamelCase / PascalCase
- Criticality computed as case...end field in interface view — never in projection

Fields: [list field names and types]
DB table: ZXX_[TableName]
```

### 11.2 Generate RAP Projection View

```
Generate a RAP projection CDS view entity for ZXX_R_[EntityName].

Rules (from AGENTS_BACKEND.md §2.3):
- define root view entity ZXX_C_[EntityName]
- provider contract transactional_query
- @Metadata.allowExtensions: true
- @UI.headerInfo with typeName, title, description
- @UI.lineItem on every List Report column with position and label
- @UI.identification on every Object Page field with position
- @UI.selectionField on filter bar fields with position
- @UI.facet for Object Page section structure
- @UI.hidden: true on StatusCriticality and all technical fields
- redirected to composition child for child associations
- Criticality linked to StatusCriticality field

List Report columns: [list fields and positions]
Object Page sections: [describe sections]
Filter bar fields: [list fields]
```

### 11.3 Generate Managed BDEF

```
Generate a managed RAP BDEF for ZXX_R_[EntityName].

Rules (from AGENTS_BACKEND.md §4):
- managed implementation in class ZCL_[XX]_BP_[EntityName] unique;
- strict ( 2 );
- Do NOT add "with draft" unless I explicitly ask
- persistent table: ZXX_[TableName]
- lock master / total etag LastChangedAt / authorization master ( instance )
- etag master LocalLastChangedAt
- CRUD: create; update; delete;
- field ( readonly ) on key fields and admin fields
- field ( mandatory ) on: [list mandatory fields]
- Determination: setInitialStatus on modify { create; }
- Validation: validate[FieldName] on save { create; update; field [FieldName]; }
- Action: [ActionName] with parameter [InputType] result [1] $self
- Full mapping for ... corresponding block

Generate projection BDEF immediately after with use create; use update; use delete; use action [ActionName];
```

### 11.4 Generate Handler Class

```
Generate the RAP behavior pool class and local handler class for ZCL_[XX]_BP_[EntityName].

Rules (from AGENTS_BACKEND.md §4 + §1.3):
- Abstract class stub: ZCL_[XX]_BP_[EntityName] DEFINITION PUBLIC ABSTRACT FINAL FOR BEHAVIOR
- Local handler: lhc_[EntityName] INHERITING FROM cl_abap_behavior_handler
- Methods: validate_[field], set_initial_status, [verb]_[noun] for action, get_instance_authorizations
- Every EML call must use IN LOCAL MODE
- Every handler must fill both failed-[entity] and reported-[entity]
- Reported entries must include %element-[FieldName] = if_abap_behv=>mk-on
- Authority check: AUTHORITY-CHECK OBJECT 'ZXX_[AuthObject]' ID 'ACTVT' FIELD '[code]'
- Fill result for both auth-allowed and auth-unauthorized cases

Also generate ABAP Unit test class ltc_[entityname]_test FOR TESTING RISK LEVEL HARMLESS DURATION SHORT
covering: valid path and invalid path for each validation.
```

### 11.5 Generate CAP Schema + Service

```
Generate a CAP CDS schema and service for [domain]:

Schema rules (from AGENTS_BACKEND.md §5.1):
- Namespace: com.dewa.[domain]
- All entities use cuid + managed aspects
- Status field uses @assert.range enum: [list status values]
- Child relationship: Composition of many
- not null on required fields

Service rules (from AGENTS_BACKEND.md §5.2):
- @path: '/[domain]'
- @requires: 'authenticated-user'
- @restrict per entity: BillingViewer(READ), BillingEditor(READ/CREATE/UPDATE), BillingAdmin(*)
- @Capabilities: Insertable, Updatable, Deletable on each entity
- Expose projections only — never base entities
- Add action: [actionName]([params]) returns [Entity]

Entities: [list entities and fields]
```

### 11.6 Generate CAP Handler

```
Generate the CAP service handler JS for [ServiceName].

Rules (from AGENTS_BACKEND.md §5.3):
- Class extends cds.ApplicationService
- Always return super.init() at end of init()
- before('CREATE', 'UPDATE') — validate: [list validation rules]
- before('DELETE') — guard: [list guard conditions]
- after('each') — enrich with StatusCriticality:
  PAID=3(#007560), PENDING=2(#FFC600), OVERDUE=1(#B00020), CANCELLED=0(#6F6F6F)
- on('[ActionName]') — custom action:
  1. Read entity · 2. Validate state · 3. Update · 4. cds.log · 5. Return updated

Error handling:
- req.error(400, message, fieldTarget) for validation
- req.error(403, message) for authorization
- req.error(404, message) for not found
- req.error(409, message) for state conflict
- Never throw new Error for business errors
- Never console.log — always cds.log('ServiceName').info/error

CQL — always CDS fluent API:
- SELECT.one.from(Entity).where({ ID })
- UPDATE(Entity).set({ field: value }).where({ ID })
- Never raw SQL strings
```

---

## 12. Failure Prevention

These are the most common AI errors on DEWA backend projects. Add the relevant phrase to your prompt.

| Failure | Add this to your prompt |
|---|---|
| `with draft` added silently | "Do NOT add with draft unless I explicitly ask" |
| `COMMIT WORK` used instead of `COMMIT ENTITIES` | "Always use COMMIT ENTITIES — never COMMIT WORK" |
| Missing `failed` or `reported` | "Always fill both failed-[entity] and reported-[entity] in every handler" |
| `IN LOCAL MODE` omitted | "All EML calls in handlers must use IN LOCAL MODE" |
| Direct `INSERT/UPDATE/DELETE` on backing table | "Never INSERT/UPDATE/DELETE on RAP backing tables — EML only" |
| `strict ( 2 )` omitted | "strict ( 2 ) is mandatory on every BDEF" |
| `mapping for` block missing | "Include the full mapping for ... corresponding block" |
| `define view` instead of `define view entity` | "Always use define view entity — never classic define view" |
| Interface view exposed directly in service | "Always expose projection views — never interface views" |
| `@AbapCatalog.viewEnhancementCategory` missing | "Add @AbapCatalog.viewEnhancementCategory: [#NONE] on every interface view" |
| Managed admin fields missing | "Include all 5 managed fields: created_at, created_by, last_changed_at, last_changed_by, local_last_changed_at" |
| `console.log` in CAP handler | "Use cds.log() — never console.log" |
| `throw new Error` for business errors | "Use req.error() — never throw new Error for business errors" |
| Base entity exposed in CAP service | "Always expose projections — never base entities" |
| Raw SQL in CAP | "Use CDS fluent API (SELECT, INSERT, UPDATE, DELETE) — never raw SQL strings" |
| `@requires` missing from service | "Add @requires: 'authenticated-user' to the service — never @open" |
| Criticality computed in projection | "Compute StatusCriticality as case...end in the interface view — never in projection" |

---

> **End of PROMPTS_BACKEND.md**
> Maintained by Abdulsamee.
> Update §12 whenever a new recurring backend failure pattern is discovered.
> Update §11 whenever a prompt pattern is improved through trial and error.
> Update §2–§10 when SAP releases new syntax or CAP API changes.

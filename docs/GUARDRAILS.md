# DEWA Development Guardrails

> **Added by Abdulsamee for FIORI/UI5 apps**

This document defines **development coding standards** for all DEWA SAPUI5, Fiori Elements, OData, RAP, and CAP application work. It is intentionally separate from [DESIGN.md](./DESIGN.md), which governs visual design, theme tokens, and CSS rules only.

**Audience:** Developers, AI coding assistants (GitHub Copilot), technical architects.  
**Scope:** SAPUI5 Freestyle · SAP Fiori Elements · OData V4 · RAP (RESTful ABAP Programming Model) · CAP (SAP Cloud Application Programming Model).

---

## Section Index

| § | Title | Type | Priority |
|---|---|---|---|
| 1 | FLP Deployment Rules | Deployment | 🔴 Critical |
| 2 | SAP Fiori Elements — Template Rules | Fiori Elements | 🔴 Critical |
| 3 | OData Annotation Design Conventions | Data Modeling | 🔴 Critical |
| 4 | Accessibility (WCAG 2.1 AA) | Accessibility | 🔴 Critical |
| 5 | i18n Conventions | Localization | 🔴 Critical |
| 6 | AI Coding Assistant Rules | AI Guardrail | 🔴 Critical |
| 7 | Performance & Build Rules | Performance | 🔴 Critical |
| 8 | Custom Control & Reusable Component Registry | Architecture | 🟡 Important |
| 9 | RAP Guardrails | ABAP / RAP | 🔴 Critical |
| 10 | CAP Guardrails | CAP / Node.js | 🔴 Critical |

---

## 1. SAP Fiori Launchpad (FLP) Deployment Rules

For FLP **CSS** rules (selector scoping, font loading, `!important` usage, button radius context, and RTL logical properties), see [DESIGN.md §8](./DESIGN.md). This section covers FLP **configuration and process** rules only.

### 1.1 manifest.json — FLP Registration (Critical)

The `manifest.json` **must** contain a `sap.fiori` section for the app to be registered as an FLP tile with intent-based navigation.

**Required additions to manifest.json:**

```json
"sap.fiori": {
  "registrationIds": ["F1234"],
  "archeType": "transactional"
}
```

- `registrationIds`: Use the official Fiori app ID assigned by SAP or your project registry.
- `archeType`: Use `"transactional"` for multi-step workflow apps; `"analytical"` for read-only dashboards.
- `"flexEnabled": true` must be set in `sap.ui5` to allow Key User Adaptation in FLP.

### 1.2 RTL Testing Procedure

DEWA is a bilingual (Arabic/English) application. FLP can operate in both LTR and RTL modes.

- Test the app in RTL mode before every ABAP deployment by appending `?sap-ui-rtl=true` to the app URL.
- Test the app in dark theme by appending `?sap-ui-theme=sap_horizon_dark` to the app URL.
- Directional icons (arrows, chevrons) must use SAPUI5's built-in RTL-aware icon mirroring — do not flip them manually in CSS.

### 1.3 FLP Deployment Checklist

Before every ABAP BSP/ABAP Cloud deployment, verify the following:

| # | Check | Status |
|---|---|---|
| 1 | All CSS selectors scoped under `#app` (see DESIGN.md §8.1) | ☐ |
| 2 | `@import` external font URL removed; local `@font-face` or Theme Designer used | ☐ |
| 3 | `!important` count ≤ 5; each commented with a reason | ☐ |
| 4 | `sap.fiori` section added to manifest.json with correct `registrationIds` | ☐ |
| 5 | `flexEnabled: true` set in `sap.ui5` in manifest.json | ☐ |
| 6 | No `margin-left`/`margin-right` hardcoded; CSS logical properties used | ☐ |
| 7 | App tested with `?sap-ui-rtl=true` | ☐ |
| 8 | App tested with `?sap-ui-theme=sap_horizon_dark` | ☐ |
| 9 | Pill buttons (`100px`) scoped to `.sapMPageContent` only | ☐ |
| 10 | Dubai Font loads successfully in ABAP environment (no CSP errors in console) | ☐ |

---

## 2. SAP Fiori Elements — Template Rules

Fiori Elements apps consume OData V4 services and render UI purely from CDS/OData annotations. The following rules define how DEWA design tokens and layout conventions apply to each supported template.

### 2.1 List Report

The List Report is the **entry point** for all transactional DEWA apps. It must surface filterable, sortable data in a consistent, bilingual-ready table.

**Mandatory Annotations:**

```cds
@UI.LineItem: [
  { position: 10, value: 'AccountNumber', label: 'Account No.' },
  { position: 20, value: 'ConsumptionUnit', label: 'Consumption' },
  { position: 30, value: 'Status', criticality: #status, label: 'Status' }
]
@UI.SelectionFields: [ AccountNumber, Status, BillingPeriod ]
@UI.PresentationVariant: {
  sortOrder: [ { by: 'BillingPeriod', descending: true } ],
  visualizations: [ { type: #AS_LINEITEM } ]
}
```

**DEWA-Specific Rules:**
- Table row hover background: use `#E5F1EF` (Active Background token) — apply via custom CSS scoped under `#app`.
- Status column must use `@UI.Criticality` mapped to DEWA semantic colors:

| Criticality Value | Meaning | DEWA Color Token |
|---|---|---|
| `0` (Neutral) | Pending / Unknown | `#6F6F6F` (Secondary Text 600) |
| `1` (Negative) | Error / Failed | `#B00020` (Error) |
| `2` (Critical) | Warning / High Usage | `#FFC600` (Alert Yellow) |
| `3` (Positive) | Success / Paid | `#007560` (Primary) |

- Search field border-focus: `2px solid #007560` (matches `input-field-border-color-active` token).
- Column headers: Dubai Regular 14px (Caption style).

---

### 2.2 Object Page

The Object Page renders the full detail view of a selected entity. Section and subsection layout must follow the DEWA spatial hierarchy.

**Mandatory Annotation Structure:**

```cds
@UI.Facets: [
  {
    id: 'GeneralInfo', type: #COLLECTION,
    label: 'Account Details',
    facets: [
      { id: 'BasicData', type: #REFERENCE, target: 'BasicDataGroup' }
    ]
  },
  {
    id: 'Consumption', type: #COLLECTION,
    label: 'Consumption History',
    facets: [
      { id: 'ConsumptionTable', type: #REFERENCE, target: 'ConsumptionItems' }
    ]
  }
]
@UI.FieldGroup #BasicDataGroup: {
  data: [
    { value: 'AccountNumber' },
    { value: 'CustomerName' },
    { value: 'MeterNumber' }
  ]
}
```

**DEWA-Specific Rules:**
- Section header: Heading 3 style — 32px, Dubai Medium, `#222222` / `#FFFFFF` dark.
- Section container radius: `15px` (Standard Card token).
- Hero header area (account summary block): `20px` radius (Hero Container token), background `#D9EAE7`.
- Subsection dividers: `1px solid #EFEFF1` (Lines-200 token).
- Edit button on Object Page header: Primary (Solid) style — `#007560` fill, `100px` radius — scoped to `.sapMPageContent`.
- Footer toolbar actions must follow button hierarchy: **Save** = Primary, **Cancel** = Secondary, **Discard** = Tertiary.

---

### 2.3 Flexible Column Layout (FCL)

FCL is used for **master–detail** workflows. Use it only when the user needs to compare or act on list and detail simultaneously.

**When to Use:**

| Scenario | Recommended Layout |
|---|---|
| Browse accounts → view summary | 2-Column (67/33 split) |
| Browse → view detail → edit sub-item | 3-Column (25/50/25 split) |
| Simple single-entity form | Do NOT use FCL — use full-page Object Page |

**DEWA-Specific Rules:**
- Column separator: `1px solid #EFEFF1` (Lines-200).
- Active (selected) list item in master column: background `#E5F1EF`, left border `3px solid #007560`.
- End column (edit/create panel): background `#F2F3F3` (Surface-100) to visually distinguish from main content.
- Never apply `100px` pill radius to FCL column-level action buttons in the shell toolbar — use standard `8px`.

**What AI Must NOT Override in FCL:**
- `sap.f.FlexibleColumnLayout` internal navigation logic — do not replace with custom router logic.
- Shell column resize handles — do not apply custom `width` or `flex` to `.sapFFCLColumn`.

---

## 3. OData Annotation Design Conventions

### 3.1 Version Policy

- **New apps:** OData V4 with CDS-based annotations. Mandatory.
- **Legacy apps:** OData V2 permitted only for maintenance. No new V2 services.
- AI assistants must default to V4 patterns unless the connected system is ECC (pre-S/4HANA).

### 3.2 Mandatory Annotations Per Entity

Every OData entity exposed in a DEWA app must carry:

| Annotation | Purpose |
|---|---|
| `@EndUserText.label` | Bilingual label shown in UI — must have EN and AR translations in i18n |
| `@UI.Hidden` | Explicitly mark technical/internal fields to prevent auto-rendering |
| `@Semantics.amount.currencyCode` / `@Semantics.quantity.unitOfMeasure` | Correct unit display |
| `@UI.Criticality` | Drive semantic color rendering via DEWA color tokens (see §2.1) |

### 3.3 Criticality → DEWA Color Mapping

```cds
// Map OData criticality values to DEWA design tokens in custom CSS:
// Criticality 3 (Positive)  → color: var(--dewa-color-primary, #007560)
// Criticality 2 (Critical)  → color: var(--dewa-color-alert-yellow, #FFC600)
// Criticality 1 (Negative)  → color: var(--dewa-color-error, #B00020)
// Criticality 0 (Neutral)   → color: var(--dewa-color-text-secondary, #6F6F6F)
```

### 3.4 AI Annotation Rules

- AI must never generate `@odata.draft.enabled: true` without explicit instruction — this activates draft handling which requires a complete BDEF.
- AI must not remove `@UI.Hidden` from fields annotated by SAP — they are hidden for compliance reasons.

### 3.5 Value Help Binding Rules

These rules apply to any field that presents a selection list to the user.

| Scenario | Control | Binding rule |
|---|---|---|
| Fixed closed list (status, category, type) | `sap.m.Select` | Bind to a named JSONModel — never hardcode `<items>` in XML |
| OData-driven list (cost centres, employees) | `sap.m.Select` | Bind to a separate OData entity set via a named model |
| Multi-column search (supplier lookup, asset search) | `sap.ui.comp.valuehelpdialog.ValueHelpDialog` | Load via async `Fragment.load()` + `addDependent()` |
| Type-ahead with suggestions | `sap.m.Input` + `sap.m.SuggestItem` | Bind suggestions to OData entity set, fire `search` event |

**Rules AI must follow:**
- `selectedKey` always bound to `"{ModelName>FieldName}"` — never a hardcoded string
- Never use `sap.m.ComboBox` for a fixed closed list — use `sap.m.Select`
- Never populate `<items>` with hardcoded `<core:Item>` elements in XML views
- Always provide an empty/placeholder item as the first entry for optional fields:
  `<core:Item key="" text="{i18n>PLACEHOLDER_SELECT}"/>`

### 3.6 OData Error Handling Rules

Every OData operation in a DEWA app must have explicit error handling. Silent failures are not permitted.

| Operation | Required error handling |
|---|---|
| `submitChanges` (V2) | `error` callback → `MessageBox.error()` with i18n key |
| `callFunction` (V2) | `error` callback → `MessageBox.error()` with i18n key |
| `requestObject` (V4) | `.catch()` → `MessageBox.error()` with i18n key |
| `ODataListBinding.requestContexts` (V4) | `.catch()` → `MessageBox.error()` with i18n key |
| Batch request failure | Parse `oEvent.getParameter("responseStatus")` → `MessageBox.error()` |

**Rules AI must follow:**
- `MessageBox.error()` for blocking errors — never `alert()` or `console.error()`
- `MessageToast.show()` for non-critical success confirmations
- All message text via i18n key — never hardcoded strings
- Every `submitChanges` / `callFunction` must have both `success` and `error` callbacks
- Never assume an OData call succeeded without checking the response

---

## 4. Accessibility (WCAG 2.1 AA)

DEWA is a public utility serving all citizens. WCAG 2.1 AA compliance is **mandatory**.

### 4.1 Contrast Requirements

| Color Pair | Contrast Ratio | Status |
|---|---|---|
| `#007560` on `#FFFFFF` | 4.6:1 | ✅ Passes AA (large text) |
| `#007560` on `#FFFFFF` | 4.6:1 | ⚠️ Borderline for small text — use `#004937` for text links |
| `#222222` on `#FFFFFF` | 16:1 | ✅ Passes AAA |
| `#6F6F6F` on `#FFFFFF` | 5.9:1 | ✅ Passes AA |
| `#FFC600` on `#FFFFFF` | 2.1:1 | ❌ Never use for text — Alert Yellow is background/icon only |

**Rule:** For any text using `#007560`, switch to `#004937` (Primary Variant) to ensure AAA compliance on small body text.

### 4.2 ARIA Label Conventions

```xml
<!-- ✅ CORRECT — every custom control must have an ariaLabel -->
<m:Button text="Pay Now" ariaLabel="{i18n>BUTTON_PAY_NOW_ARIA}" />

<!-- ✅ CORRECT — icon-only buttons must have tooltip + ariaLabel -->
<m:Button icon="sap-icon://download" tooltip="{i18n>TOOLTIP_DOWNLOAD}" ariaLabel="{i18n>ARIA_DOWNLOAD}" />

<!-- ❌ WRONG — icon-only button with no label -->
<m:Button icon="sap-icon://download" />
```

### 4.3 Keyboard Navigation

- All interactive DEWA custom controls must be reachable via `Tab` / `Shift+Tab`.
- Modal dialogs must trap focus and return focus to the triggering element on close.
- Custom tile components must support `Enter` / `Space` to activate.
- Never suppress the browser's default focus outline — SAPUI5 handles focus styling; do not override it with `outline: none`.

### 4.4 Accessibility Checklist

| # | Check | Status |
|---|---|---|
| 1 | All icon-only buttons have `tooltip` + `ariaLabel` | ☐ |
| 2 | Color-coded status never relies on color alone — always paired with text/icon | ☐ |
| 3 | `#007560` used for body text replaced with `#004937` | ☐ |
| 4 | Custom controls keyboard-navigable | ☐ |
| 5 | Screen reader tested with NVDA/JAWS on Chrome | ☐ |

---

## 5. i18n Conventions

### 5.1 Key Naming Pattern

```properties
# Pattern: CONTEXT_ELEMENTTYPE_DESCRIPTION
# All uppercase, underscore-separated

# ✅ CORRECT
LABEL_ACCOUNT_NUMBER=Account Number
BUTTON_PAY_NOW=Pay Now
MSG_ERROR_PAYMENT_FAILED=Payment could not be processed. Please try again.
TOOLTIP_DOWNLOAD_BILL=Download bill as PDF
ARIA_BUTTON_PAY_NOW=Submit payment for current bill

# ❌ WRONG
accountNumber=Account Number
btn1=Pay
error=Error
```

### 5.2 Arabic Translation Rules

- **Pair keys** — every key must have an entry in both `i18n_en.properties` and `i18n_ar.properties`.
- **No gender assumptions** — avoid phrases that change form based on grammatical gender unless explicitly translated per case.
- **Numeric formatting** — use SAPUI5's built-in `sap.ui.core.format.NumberFormat` for Arabic-Indic numerals; never hardcode numeral scripts.
- **Date formats** — Hijri calendar support must be included for date pickers in Arabic locale: `sap-ui-calendarType=Islamic`.
- Arabic line height: apply the `+10%` line height rule (see DESIGN.md §3) to all Arabic text containers — set via class `.dewaArabicText` with `line-height: 1.65`.

### 5.3 Fallback Rules

- Default language: **English** (`en`).
- If Arabic translation is missing, fall back to English — never show a raw i18n key in the UI.
- AI assistants must always generate both EN and AR placeholder entries when creating new i18n keys.

---

## 6. AI Coding Assistant Rules

These rules govern what AI coding assistants (GitHub Copilot, etc.) may and may not generate for DEWA SAPUI5/Fiori apps.

### 6.1 Preferred Controls

| Use Case | ✅ Use | ❌ Never Use |
|---|---|---|
| Button | `sap.m.Button` | `sap.ui.commons.Button` |
| Table | `sap.m.Table` / `sap.ui.table.Table` | `sap.ui.commons.Table` |
| Input | `sap.m.Input` | `sap.ui.commons.TextField` |
| Dialog | `sap.m.Dialog` | `sap.ui.commons.Dialog` |
| Layout | `sap.m.FlexBox`, `sap.ui.layout.Grid` | HTML `<div>` for layout |
| Navigation | `sap.m.routing.Router` | `window.location` |
| Date Picker | `sap.m.DatePicker` with `displayFormat` | Native HTML `<input type="date">` |

### 6.2 CSS Generation Rules


## Approved SAPUI5 Selectors

APPROVED:
- #app .sapMBtnInner
- #app .sapMInputBaseInner
- #app .sapMListTblRow
- #app .sapMPanel
- #app .sapFCard
- #app .sapMDialog
- #app .sapUiForm
- #app .sapMPageContent

FORBIDDEN:
- .sapMBtnInner
- .sapMInputBaseInner
- .sapMListTblRow
- body
- html
- *



AI must always:
- Scope every CSS selector under `#app` (see DESIGN.md §8.1).
- Use DEWA design tokens as comments when hardcoding colors:
  ```css
  /* Primary token: #007560 */
  #app .dewaHeader { background-color: #007560; }
  ```
- Use `margin-inline-start` / `margin-inline-end` instead of `margin-left` / `margin-right`.
- Use `padding-inline-start` / `padding-inline-end` instead of `padding-left` / `padding-right`.

AI must never:
- Generate `!important` on color/theme properties (see DESIGN.md §8.3).
- Generate `@import url('https://...')` for fonts (see DESIGN.md §8.2).
- Apply `100px` border-radius to buttons outside `.sapMPageContent` (see DESIGN.md §8.4).
- Use inline `style=""` attributes on SAPUI5 controls — use CSS classes only.

### 6.3 Custom Control Naming Convention

All DEWA-specific custom controls, CSS classes, and IDs must use the `dewa` prefix:

```
CSS class:  .dewaCard, .dewaActionBar, .dewaStatusBadge
Control ID: dewaAccountTile, dewaPaymentButton
JS module:  com.dewa.controls.StatusBadge
```

### 6.4 Files AI May NOT Modify Without Approval

| File | Reason |
|---|---|
| `manifest.json` → `sap.fiori` section | FLP registration IDs are assigned by project registry |
| `manifest.json` → `sap.app.dataSources` | OData URLs are environment-specific |
| `ui5.yaml` → `customMiddleware` | Proxy config is deployment-environment-specific |
| Any `.env` or credential file | Security — never touch |
| `webapp/fonts/` | Font files are legally licensed assets |

### 6.5 Design Token Reference for AI Prompts

When prompting AI to build UI components, use these token names to get DEWA-compliant output:

```
Primary Green:       #007560  → use for: CTAs, active states, success
Primary Variant:     #004937  → use for: hover states, text links
Active Background:   #E5F1EF  → use for: selected/highlighted rows
Error Red:           #B00020  → use for: error states only
Alert Yellow:        #FFC600  → use for: warning backgrounds/icons only (never buttons)
Card Background:     #FFFFFF  → use for: card surfaces
Input Background:    #F2F3F3  → use for: form field backgrounds
Secondary Text:      #6F6F6F  → use for: captions, labels, helper text
Primary Text:        #222222  → use for: headings, body copy
Card Border:         #D7D7DF  → use for: card/component borders
Divider Line:        #EFEFF1  → use for: section separators
```



## Visual Consistency Rules

AI must:
- reuse existing DEWA visual patterns
- reuse spacing scale
- reuse typography hierarchy
- reuse existing hover behavior
- reuse existing elevation logic

AI must never:
- introduce freestyle styling
- mix SAP Horizon colors with DEWA colors
- create new hover systems
- create new elevation systems


### 6.6 AI Generation Checklist

Before accepting AI-generated code into the codebase, verify:

| # | Check | Status |
|---|---|---|
| 1 | All CSS scoped under `#app` | ☐ |
| 2 | No `inline style=""` on SAPUI5 controls | ☐ |
| 3 | No deprecated `sap.ui.commons.*` controls used | ☐ |
| 4 | DEWA color tokens used (not arbitrary hex values) | ☐ |
| 5 | Both `i18n_en` and `i18n_ar` keys generated | ☐ |
| 6 | CSS logical properties used (no `margin-left/right`) | ☐ |
| 7 | Button pill radius (`100px`) scoped to `.sapMPageContent` | ☐ |
| 8 | No `!important` on color properties | ☐ |

---

### 6.7 Freestyle UI5 Specific Guardrails

These rules apply exclusively to **freestyle SAPUI5 apps** (MVC pattern, TypeScript, non-Fiori Elements). AI assistants must follow them when generating or modifying freestyle app code.

#### 6.7.1 MVC Separation

- Business logic, calculations, and data transformations **must not** appear in XML view bindings.
- Expression bindings (`{= ... }`) in XML are permitted only for simple conditional display (e.g., visibility). Complex logic belongs in controllers or formatter functions.
- Formatter functions must reside in `model/formatter.ts`, not inline in the controller.

```xml
<!-- ❌ WRONG — business logic in view binding -->
<m:Text text="{= ${amount} * 1.05 + ' AED' }" />

<!-- ✅ CORRECT — formatter in model/formatter.ts -->
<m:Text text="{ path: 'amount', formatter: '.formatter.formatAmountAED' }" />
```

#### 6.7.2 Router Pattern

- Navigation must always use the SAPUI5 Router — **never** `window.location`, `window.history`, or `window.open` for in-app navigation.
- The router must be declared in `manifest.json` under `sap.ui5.routing`.
- Use `this.getOwnerComponent().getRouter().navTo("routeName", { param: value })` from controllers.

```typescript
// ❌ WRONG
window.location.hash = "#/detail/123";

// ✅ CORRECT
this.getOwnerComponent().getRouter().navTo("detail", { id: "123" });

// ✅ CORRECT — back navigation
import History from "sap/ui/core/routing/History";
const sPreviousHash = History.getInstance().getPreviousHash();
if (sPreviousHash !== undefined) {
    window.history.go(-1);
} else {
    this.getOwnerComponent().getRouter().navTo("main", {}, true);
}
```

#### 6.7.3 Model Usage Rules

| Model Type | Permitted Use | Forbidden Use |
|---|---|---|
| `sap.ui.model.json.JSONModel` | Local UI state, static config, mock data | Fetching backend data via `fetch()` or `XMLHttpRequest` |
| `sap.ui.model.odata.v4.ODataModel` | All backend data operations (CRUD) | Storing purely UI state (toggle flags, form state) |
| `sap.ui.model.resource.ResourceModel` | i18n text bundles only | Any data binding |

- AI must **never** generate `fetch()` or `axios` calls to consume OData — use `ODataModel` and `ODataListBinding` / `ODataContextBinding` APIs.
- Component-level models must be set on the component in `Component.ts` → `init()`, not in individual controllers.

#### 6.7.4 No Direct DOM Manipulation

The following are **forbidden** in SAPUI5 TypeScript code:

```typescript
// ❌ ALL of these are forbidden
document.getElementById("myButton");
document.querySelector(".sapMBtn");
jQuery("#myControl").hide();
element.innerHTML = "<span>text</span>";
element.style.color = "#007560";

// ✅ CORRECT — use SAPUI5 control APIs
const oButton = this.byId("myButton") as Button;
oButton.setVisible(false);
oButton.addStyleClass("dewaHidden");
```

- Use `this.byId()` (relative ID) — never `sap.ui.getCore().byId()` (global ID) in view controllers.
- Use `addStyleClass()` / `removeStyleClass()` for visibility and state, not direct DOM style changes.

#### 6.7.5 Controller Event Handler Naming

| Pattern | Examples | Usage |
|---|---|---|
| `on` + PascalCase verb + subject | `onPayNow`, `onNavBack`, `onFilterChange` | Standard event handlers |
| `on` + Control name + Event | `onTableItemPress`, `onInputLiveChange` | Control-specific events |
| `_` prefix + camelCase | `_loadAccountData`, `_buildFilterQuery` | Private helper methods |

```typescript
// ✅ CORRECT
onPayNow(oEvent: Event): void { ... }
onNavBack(): void { ... }
onTableItemPress(oEvent: Event): void { ... }

// ❌ WRONG
click(): void { ... }
handleButton1(): void { ... }
btnPress(e: any): void { ... }
```

#### 6.7.6 Fragment Loading — Async Only

Synchronous fragment loading via `sap.ui.xmlfragment()` is **deprecated and forbidden**.

```typescript
// ❌ WRONG — synchronous, deprecated
const oDialog = sap.ui.xmlfragment("com.dewa.app.fragments.DewaConfirmDialog", this);

// ✅ CORRECT — async Fragment.load()
import Fragment from "sap/ui/core/Fragment";

if (!this._oConfirmDialog) {
    this._oConfirmDialog = await Fragment.load({
        id: this.getView().getId(),
        name: "com.dewa.app.fragments.DewaConfirmDialog",
        controller: this
    });
    this.getView().addDependent(this._oConfirmDialog as Control);
}
(this._oConfirmDialog as Dialog).open();
```

- Always call `this.getView().addDependent(fragment)` after loading so the fragment is destroyed with the view.
- Cache the fragment instance — never call `Fragment.load()` on every button press.

#### 6.7.7 No Hardcoded Strings in Controllers

```typescript
// ❌ WRONG — hardcoded strings
MessageToast.show("Payment submitted successfully");

// ✅ CORRECT — from i18n bundle
const oBundle = this.getView().getModel("i18n")?.getResourceBundle() as ResourceBundle;
MessageToast.show(oBundle.getText("MSG_PAYMENT_SUCCESS"));
```

- Technical strings (OData entity names, property paths, route names) are permitted as constants.
- Error message keys must match the `MSG_ERROR_*` naming convention in §5.1.

#### 6.7.8 View Lifecycle Hooks — Correct Usage

| Hook | When to Use | What NOT to Put Here |
|---|---|---|
| `onInit` | Model binding setup, router parameter attachment, initial data load | DOM queries, control rendering assumptions |
| `onBeforeRendering` | Stop animations, detach expensive listeners before re-render | Complex business logic, async operations |
| `onAfterRendering` | DOM-dependent initialization (charts, maps) — minimize use | Model binding setup (belongs in `onInit`) |
| `onExit` | Cleanup: detach event handlers, destroy non-dependent objects, cancel pending requests | Anything that modifies the model or triggers navigation |

```typescript
// ✅ CORRECT lifecycle usage
onInit(): void {
    const oRouter = this.getOwnerComponent().getRouter();
    oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
}

onExit(): void {
    const oRouter = this.getOwnerComponent().getRouter();
    oRouter.getRoute("detail").detachPatternMatched(this._onRouteMatched, this);
}
```

#### 6.7.9 Freestyle Guardrails Checklist

| # | Check | Status |
|---|---|---|
| 1 | No business logic or calculations in XML view bindings | ☐ |
| 2 | All navigation via SAPUI5 Router (`navTo`) — no `window.location` | ☐ |
| 3 | JSONModel used only for local UI state; ODataModel for backend | ☐ |
| 4 | No `document.getElementById`, `jQuery`, or `.innerHTML` in code | ☐ |
| 5 | Event handlers follow `on` + PascalCase naming convention | ☐ |
| 6 | All fragments loaded via async `Fragment.load()` with `addDependent()` | ☐ |
| 7 | No hardcoded user-visible strings — all via `getResourceBundle().getText()` | ☐ |
| 8 | `onInit` used for model setup; `onExit` used for cleanup | ☐ |

---

## 7. Performance & Build Rules

### 7.1 Async Component Loading

```typescript
// ✅ CORRECT — async component loading
// In index.html: data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
import ComponentSupport from "sap/ui/core/ComponentSupport";
```

- Never use synchronous `sap.ui.getCore().attachInit()` in new apps.
- All views must be loaded asynchronously — set `"async": true` in `manifest.json` → `sap.ui5.rootView`.
- Lazy-load non-critical fragments using `sap.ui.core.Fragment.load()`.

### 7.2 Bundle Size Budgets

| Asset | Maximum Size (gzipped) |
|---|---|
| Component-preload.js | 250 KB |
| CSS bundle (styles.css) | 30 KB |
| Single view XML | 15 KB |
| Custom control JS | 20 KB |

### 7.3 ui5.yaml — ABAP Deployment Configuration

```yaml
# ✅ Required settings for ABAP BSP deployment
builder:
  resources:
    excludes:
      - "/test/**"
      - "/localService/**"
  cachebuster:
    signatureType: hash   # Use hash-based cache busting, not time-based
  bundles:
    - name: com/dewa/app/Component-preload
      defaultFileTypes:
        - ".js"
        - ".xml"
        - ".json"
        - ".properties"
      sections:
        - mode: preload
          filters:
            - com/dewa/app/
          resolve: true
          sort: true
```

- Always exclude `/test/` and `/localService/` from ABAP deployment bundles.
- Use `signatureType: hash` — never `time` — to prevent stale cache after hotfix deployments.

### 7.4 Performance Checklist

| # | Check | Status |
|---|---|---|
| 1 | `async: true` on rootView in manifest.json | ☐ |
| 2 | Component-preload.js generated and included in BSP upload | ☐ |
| 3 | Test files excluded from production bundle | ☐ |
| 4 | No synchronous XHR calls in application code | ☐ |
| 5 | Images optimized (SVG preferred over PNG for icons) | ☐ |
| 6 | Bundle size within budget (check with `ui5 build --all`) | ☐ |

---

## 8. Custom Control & Reusable Component Registry

### 8.1 Project Structure Convention

```
webapp/
  controls/
    DewaStatusBadge.ts       ← Custom status badge with DEWA criticality colors
    DewaAccountTile.ts       ← Account summary tile (Hero Container style)
    DewaConsumptionChart.ts  ← Bar/line chart with DEWA graph color tokens
  fragments/
    DewaConfirmDialog.fragment.xml   ← Reusable confirmation dialog
    DewaFilterBar.fragment.xml       ← Standard filter bar for List Reports
  css/
    styles.css               ← Single scoped stylesheet (all under #app)
```

### 8.2 Extension Rules

- Extend SAPUI5 base controls using `Control.extend()` — never modify SAP source files.
- Custom controls must implement `getAccessibilityInfo()` for screen reader support.
- Custom controls must emit named events (not global events) so parent views can subscribe cleanly.
- Custom controls must support **RTL** via `sap.ui.core.Control`'s built-in `textDirection` property.

```typescript
// ✅ CORRECT — extension pattern
const DewaStatusBadge = Control.extend("com.dewa.controls.DewaStatusBadge", {
  metadata: {
    properties: {
      status:      { type: "string", defaultValue: "neutral" },
      statusText:  { type: "string", defaultValue: "" },
      criticality: { type: "int",    defaultValue: 0 }
    },
    events: { statusPress: {} }
  },
  renderer: {
    apiVersion: 2,
    render(rm: any, control: any) {
      rm.openStart("div", control);
      rm.class("dewaStatusBadge");
      rm.openEnd();
      rm.text(control.getStatusText());
      rm.close("div");
    }
  }
});
```

### 8.3 Consuming Reusable Controls in AI-Generated Code

When asking AI to use a DEWA reusable control, provide this context in your prompt:

```
Use the DEWA custom control 'com.dewa.controls.DewaStatusBadge' for status display.
It accepts properties: status (string), statusText (string), criticality (int 0-3).
Criticality maps: 0=neutral (#6F6F6F), 1=error (#B00020), 2=warning (#FFC600), 3=success (#007560).
```

### 8.4 Reusable Component Registry

| Control / Fragment | File | Purpose |
|---|---|---|
| `DewaStatusBadge` | `controls/DewaStatusBadge.ts` | Status indicator with DEWA criticality colors |
| `DewaAccountTile` | `controls/DewaAccountTile.ts` | Hero account summary tile |
| `DewaConsumptionChart` | `controls/DewaConsumptionChart.ts` | Consumption trend chart |
| `DewaConfirmDialog` | `fragments/DewaConfirmDialog.fragment.xml` | Confirmation dialog (Primary/Secondary buttons) |
| `DewaFilterBar` | `fragments/DewaFilterBar.fragment.xml` | Standard filter bar for List Reports |

---

## 9. RAP (RESTful ABAP Programming Model) Guardrails

> **Added by Abdulsamee for FIORI/UI5 apps**

These rules govern how AI assistants and developers build RAP-based OData V4 services for DEWA transactional applications.

### 9.1 BDEF Design Rules

**Implementation Mode:**

| Scenario | Use | Why |
|---|---|---|
| Standard CRUD with framework lock/draft | `managed` | Less code, framework handles etag/lock/draft |
| Complex multi-step save logic or external numbering | `unmanaged` | Full control over save sequence |
| Extend existing BO | `abstract` + `projection` | Never modify base BDEF directly |

**Naming Convention:**

```abap
" Root BDEF name = root CDS view entity name
" If root CDS view is ZI_DewaBillingItem → BDEF is ZI_DewaBillingItem
" Projection BDEF = ZC_DewaBillingItem

managed implementation in class ZBP_DewaBillingItem unique;
strict ( 2 );
with draft;
```

**Rules:**
- Always use `strict ( 2 );` — disables legacy tolerance for inconsistent BDEFs.
- One root entity per business object — never create two root entities for the same DB table.
- Always define `with additional save` when implementing custom save logic in managed BOs.
- Use `alias` names in BDEF operations that match the CDS entity's semantic purpose.
- AI must never generate a BDEF without `strict ( 2 );`.

### 9.2 EML Usage Rules

EML (Entity Manipulation Language) is the only permitted way to write data in RAP — never use direct ABAP `INSERT`, `UPDATE`, `DELETE` statements in behavior implementation classes.

```abap
" ✅ CORRECT — EML for CREATE
MODIFY ENTITIES OF ZI_DewaBillingItem
  ENTITY BillingItem
  CREATE FIELDS ( AccountNumber Amount Status )
  WITH VALUE #( ( %cid        = 'CID1'
                  AccountNumber = '123456'
                  Amount        = '250.00'
                  Status        = 'PENDING' ) )
  MAPPED   DATA(mapped)
  FAILED   DATA(failed)
  REPORTED DATA(reported).

" ❌ WRONG — direct DB write in handler
INSERT zdewa_billing FROM @ls_billing.
```

**Rules:**
- Always check and map `mapped`, `failed`, and `reported` after every EML call.
- Use `%cid` (content ID) for correlation of create responses to input lines.
- Use `%is_draft = if_abap_behv=>mk-on` explicitly when working with draft instances.
- Never mix EML reads and direct `SELECT` in the same handler method for the same entity — pick one.
- Use `READ ENTITIES` for reading within handler logic — never `SELECT` from the underlying table.

### 9.3 Behavior Implementation Patterns

**Class Naming:**

| Artifact | Naming Pattern | Example |
|---|---|---|
| Global handler class | `ZBP_<entity_name>` | `ZBP_DewaBillingItem` |
| Local handler class | `LCL_HANDLER` | Inside global class |
| Local saver class | `LCL_SAVER` | Inside global class (managed with additional save) |

**Validation Rules:**
- Validation method naming: `VALIDATE_<FIELD_OR_RULE>` (e.g., `VALIDATE_AMOUNT`, `VALIDATE_STATUS_TRANSITION`)
- Always fill the `reported` parameter in validations — without it, user sees no error message.
- Bind validations to `SAVE` for mandatory checks; bind to `MODIFY` for real-time feedback.

```abap
" ✅ CORRECT — validation with reported parameter filled
METHOD validate_amount.
  READ ENTITIES OF ZI_DewaBillingItem ENTITY BillingItem
    FIELDS ( Amount ) WITH CORRESPONDING #( keys )
    RESULT DATA(lt_items).

  LOOP AT lt_items INTO DATA(ls_item).
    IF ls_item-Amount <= 0.
      APPEND VALUE #(
        %tky        = ls_item-%tky
        %state_area = 'VALIDATE_AMOUNT'
      ) TO reported-billingitem.

      APPEND VALUE #(
        %tky = ls_item-%tky
        %fail-cause = if_abap_behv=>cause-unspecific
      ) TO failed-billingitem.
    ENDIF.
  ENDLOOP.
ENDMETHOD.
```

**Determination Rules:**
- Determination method naming: `DETERMINE_<TARGET_FIELD>` (e.g., `DETERMINE_STATUS`, `DETERMINE_TOTAL`)
- Trigger determinations on `MODIFY` for derived field calculation.
- Never perform UI logic or navigation triggering inside determination methods.

### 9.4 CDS View Entity Rules for RAP

**Composition Tree:**

```cds
// ✅ CORRECT — proper RAP composition structure
@AbapCatalog.viewEnhancementCategory: [#NONE]
define root view entity ZI_DewaBillingHeader
  as select from zdewa_billing_hdr
  composition [0..*] of ZI_DewaBillingItem as _Items
{
  key BillingId,
      AccountNumber,
      @ObjectModel.text.element: ['AccountName']
      AccountNumber,
      ...
      /* Associations */
      _Items
}
```

**Rules:**
- Root view entity must use `define root view entity` — child views use `define view entity`.
- Always define `@AbapCatalog.viewEnhancementCategory: [#NONE]` on RAP root entities.
- Never mix interface views (`ZI_*`) and consumption views (`ZC_*`) in the same composition tree.
- Use `$projection` variables in annotations — never hardcode system fields like `$user`.
- Key fields must be annotated with `@ObjectModel.text.element` for value help display.
- Use `@Semantics.systemDate.createdAt`, `@Semantics.systemDate.lastChangedAt` for audit fields — do not annotate them manually.

### 9.5 Draft Handling Rules

Draft handling enables save-later workflows. It must be used only when the business scenario requires multi-step editing with resumable sessions.

**When to Use Draft:**

| Scenario | Use Draft |
|---|---|
| Multi-step form with > 3 screens | ✅ Yes |
| Simple single-screen create dialog | ❌ No |
| Read-only List Report | ❌ Never |
| External system integration with sync | ❌ Never |

**Rules:**
- Never enable `with draft` without all mandatory validations wired to the `SAVE` trigger.
- Draft tables are generated by the framework — **never create or modify them manually**.
- Use `etag master` on the root entity and `total etag` for the business object.
- Always filter draft records out of read-only reports: `WHERE IsActiveEntity = 'X'` (or `%is_draft = '0'`).
- AI must never add `with draft` to a BDEF unless explicitly requested by the developer.

```cds
// ✅ CORRECT — draft activation annotation on root entity
@ObjectModel.semanticKey: [ 'BillingId' ]
define root view entity ZI_DewaBillingHeader
  ...
  @Semantics.systemDate.lastChangedAt: true
  LastChangedAt,
  @Semantics.user.lastChangedBy: true
  LastChangedBy,
```

### 9.6 RAP AI Guardrails Checklist

| # | Check | Status |
|---|---|---|
| 1 | BDEF uses `strict ( 2 );` | ☐ |
| 2 | `managed` implementation chosen unless strong reason for `unmanaged` | ☐ |
| 3 | No direct `INSERT`/`UPDATE`/`DELETE` — EML only | ☐ |
| 4 | All EML calls check `mapped`, `failed`, `reported` | ☐ |
| 5 | Validations fill `reported` parameter | ☐ |
| 6 | `with draft` only added when explicitly required | ☐ |
| 7 | Composition tree uses root + child view entities (not interface/consumption mixed) | ☐ |
| 8 | Draft records filtered from read-only views (`IsActiveEntity = 'X'`) | ☐ |

---

## 10. CAP (SAP Cloud Application Programming Model) Guardrails

> **Added by Abdulsamee for FIORI/UI5 apps**

These rules govern how AI assistants and developers build CAP-based services for DEWA applications targeting SAP BTP or S/4HANA Cloud.

### 10.1 CDS Model Design

**Entity Naming:**
- Entities: `PascalCase`, plural noun (e.g., `BillingItems`, `Accounts`, `ConsumptionReadings`)
- Fields: `PascalCase` (e.g., `AccountNumber`, `BillingAmount`)
- Namespaces: match the project namespace (e.g., `com.dewa.billing`)

```cds
// ✅ CORRECT — CAP CDS base entity
namespace com.dewa.billing;

using { managed, cuid } from '@sap/cds/common';

entity BillingItems : managed, cuid {
  AccountNumber  : String(10)  @mandatory;
  Amount         : Decimal(13,2);
  Currency       : String(3)   @assert.range: ['AED', 'USD'];
  Status         : String(20)  @assert.range: ['PENDING', 'PAID', 'OVERDUE'];
  to_Account     : Association to Accounts on to_Account.AccountNumber = AccountNumber;
}
```

**Rules:**
- Use `managed` aspect (adds `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy` automatically).
- Use `cuid` aspect for UUID-based keys — avoids manual key generation.
- Use `@assert.range` for enumeration fields — never validate ranges in service handlers.
- Use `@assert.notNull` for mandatory fields — never validate null in service handlers.
- Never apply `@cds.persistence.table` to projection views — only to base entities.
- Use `Association to one` with explicit `on` condition — avoid ambiguous `to many` without proper cardinality.
- Use `localized` aspect only when full multilingual support is configured in the project.

### 10.2 Service Definition Patterns

```cds
// ✅ CORRECT — projection-based service definition
using com.dewa.billing as billing from '../db/schema';

service BillingService @(path: '/billing') {

  @restrict: [
    { grant: 'READ',   to: 'BillingViewer' },
    { grant: 'WRITE',  to: 'BillingEditor' }
  ]
  entity BillingItems as projection on billing.BillingItems
    actions {
      action submitPayment(amount: Decimal(13,2)) returns String;
    };

  // Read-only view for reports
  @readonly
  entity BillingReport as select from billing.BillingItems {
    AccountNumber, Amount, Status
  };
}
```

**Rules:**
- Never expose base entities directly — always use `projection on` in the service file.
- Apply `@restrict` on every entity with explicit `grant` + `to` — never leave authorization open.
- Use `@cds.query.limit: { max: 1000, default: 50 }` to prevent unbounded query results on large tables.
- Annotate capabilities explicitly: `@Capabilities.Insertable`, `@Capabilities.Updatable`, `@Capabilities.Deletable`.
- Use `@readonly` on report/analytics projections — prevents accidental write operations.
- Custom actions must use meaningful verb names: `submitPayment`, `cancelOrder`, `approveRequest`.

### 10.3 OData V4 Exposure Rules

CAP auto-generates OData V4 — these rules govern what AI may and may not do around the generated metadata.

```javascript
// ✅ CORRECT — CAP service handler
module.exports = cds.service.impl(async function () {

  const { BillingItems } = this.entities;

  // Before CREATE hook — derive fields
  this.before('CREATE', BillingItems, async (req) => {
    req.data.Status = 'PENDING';
    req.data.CreatedAt = new Date().toISOString();
  });

  // After READ hook — enrich data
  this.after('READ', BillingItems, (items) => {
    items.forEach(item => {
      item.DisplayAmount = `${item.Currency} ${item.Amount}`;
    });
  });

  // Custom action handler
  this.on('submitPayment', BillingItems, async (req) => {
    const { ID, amount } = req.params[0];
    if (!amount || amount <= 0) return req.error(400, 'MSG_INVALID_AMOUNT');
    await UPDATE(BillingItems).set({ Status: 'PAID', Amount: amount }).where({ ID });
    return 'Payment submitted';
  });

});
```

**Rules:**
- Use `this.before` / `this.after` / `this.on` hooks for all business logic — never put logic in `.cds` model files.
- Never manually modify `$metadata` responses — CAP generates them from CDS definitions.
- Use `@Common.ValueList` annotations in `.cds` for dropdown value help — never hardcode in UI.
- Use `@Core.Immutable: true` for read-only calculated fields that cannot be updated by clients.
- Deep insert (parent + children in one call): supported via composition — never require multiple separate POST calls from UI.
- Use `req.error(HTTP_CODE, 'MSG_KEY')` for all business errors — never throw raw JavaScript errors to the client.

### 10.4 AI CAP Code Generation Rules

| Rule | Compliant Pattern | Forbidden Pattern |
|---|---|---|
| DB access | `await SELECT.from(Entity).where(...)` | Raw SQL strings |
| DB access | `await cds.db.run(SELECT.from(Entity))` | `req.query` manipulation |
| Error handling | `req.error(400, 'MSG_ERROR_KEY')` | `throw new Error('message')` |
| Async style | `async/await` throughout | Callbacks or `.then()/.catch()` chains |
| Authentication | Use `@restrict` in CDS Service | Never check `req.user` manually for basic CRUD |
| Logging | `cds.log('module').info(...)` | `console.log(...)` in production handlers |
| Input validation | `@assert.range`, `@assert.notNull` in CDS | Manual null checks in every handler |

**AI must never generate:**
- Direct SQL (`SELECT * FROM ZDEWA_TABLE`) — always use CDS entities.
- Hardcoded user names or roles — always derive from `@restrict` and `req.user.attr`.
- Synchronous blocking code (`fs.readFileSync`, `execSync`) in service handlers.
- `process.env` access outside of `cds.env` abstraction — environment config must go through CAP's config system.

### 10.5 CAP AI Guardrails Checklist

| # | Check | Status |
|---|---|---|
| 1 | Base entities use `managed` + `cuid` aspects | ☐ |
| 2 | Service exposes projections only — no direct base entity exposure | ☐ |
| 3 | `@restrict` applied to every service entity | ☐ |
| 4 | `@cds.query.limit` set on large entities | ☐ |
| 5 | Business logic in service handlers (`.js`), not in `.cds` model files | ☐ |
| 6 | All errors use `req.error(code, 'MSG_KEY')` — no raw throws | ☐ |
| 7 | No raw SQL — all DB access via CDS SELECT/INSERT/UPDATE/DELETE fluent API | ☐ |
| 8 | `async/await` used throughout — no callbacks | ☐ |

---

---

> **End of GUARDRAILS.md**
> Maintained by Abdulsamee.
> Scope: coding standards only (§1–§10). Prompt patterns and pre-acceptance checklists have moved to `CLAUDE.md §8` (frontend) and `CLAUDE_BACKEND.md §7–§9` (backend).


## Reference-Driven Development

AI assistants must prioritize:

1. Existing reference-components/
2. Existing reference-pages/
3. Existing fragments
4. Existing CSS utilities

before generating new implementations.


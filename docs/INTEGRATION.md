# INTEGRATION.md — DEWA OData Service → UI5 App Binding
## manifest.json · ui5.yaml · Proxy · $metadata Verification

> **Maintained by:** Abdulsamee
> **Purpose:** Defines exactly how the RAP OData V4 service binding created in Stage 5
> gets wired into the UI5 app manifest.json and ui5.yaml proxy config.
> Bridges the gap between backend (service binding name) and frontend (dataSource URL).
>
> **Position in pipeline:** Stage 6 — after RAP service binding created, before code review.
> **Depends on:** Service binding name from `CLAUDE_BACKEND.md §2` Step 14
> **Updates:** `manifest.json` dataSources · `ui5.yaml` server middleware

---

## 0. Pre-conditions

Before running integration, confirm:

| # | Check | Done? |
|---|---|---|
| 1 | RAP service binding activated in SAP — status: Active | ☐ |
| 2 | Service binding name known: `Z[XX]_UI_[Description]_O4` | ☐ |
| 3 | Target system hostname/IP available | ☐ |
| 4 | SAP client number confirmed | ☐ |
| 5 | Destination name confirmed (BTP) or direct URL (On-Prem) | ☐ |

---

## 1. manifest.json — dataSource Configuration

### 1.1 OData V4 dataSource Pattern

```json
"sap.app": {
  "dataSources": {
    "[EntityName]Service": {
      "uri": "/sap/opu/odata4/sap/[service_binding_name_lowercase]/srvd/sap/[service_def_name_lowercase]/0001/",
      "type": "OData",
      "settings": {
        "odataVersion": "4.0",
        "annotations": []
      }
    }
  }
}
```

**URI construction rule:**
```
/sap/opu/odata4/sap/[Z[XX]_UI_[Description]_O4 → lowercase]/srvd/sap/[Z[XX]_SD_[Description] → lowercase]/0001/
```

Example — service binding `ZFI_UI_BillingItem_O4`, service def `ZFI_SD_BillingItem`:
```
/sap/opu/odata4/sap/zfi_ui_billingitem_o4/srvd/sap/zfi_sd_billingitem/0001/
```

### 1.2 Model Configuration in sap.ui5

```json
"sap.ui5": {
  "models": {
    "": {
      "dataSource": "[EntityName]Service",
      "preload": true,
      "settings": {
        "synchronizationMode": "None",
        "operationMode": "Server",
        "autoExpandSelect": true,
        "earlyRequests": true
      }
    }
  }
}
```

### 1.3 Protected Fields — Claude Must Not Overwrite

Per `CLAUDE.md §6`:
- `sap.fiori.registrationIds` — assigned by project registry, never auto-generated
- `sap.app.dataSources` URI — environment-specific, set here once, never overwritten

Claude may read these fields to verify correctness but must ask before modifying.

---

## 2. ui5.yaml — Development Proxy Configuration

### 2.1 On-Premise S/4HANA

```yaml
server:
  customMiddleware:
    - name: ui5-middleware-simpleproxy
      afterMiddleware: compression
      mountPath: /sap
      configuration:
        baseUri: "https://[s4hana-hostname]:[port]"
        client: "[client-number]"
        username: "[dev-user]"
        password: "[dev-password]"
```

**Rules:**
- `baseUri` uses the S/4HANA On-Prem hostname — never hardcode production
- Always use a development-only user — never basis/admin credentials
- `ui5.yaml` is in `CLAUDE.md §6` protected files — Claude must not modify `customMiddleware` without approval

### 2.2 BTP — Destination-Based Proxy

```yaml
server:
  customMiddleware:
    - name: ui5-middleware-cf-proxy
      afterMiddleware: compression
      configuration:
        destination: "[DEWA_S4H_DEV]"
        xfwd: true
```

**Destination name convention:** `DEWA_[SYSTEM]_[ENV]`
Examples: `DEWA_S4H_DEV` · `DEWA_S4H_QAS` · `DEWA_BTP_DEV`

---

## 3. $metadata Verification — Required After Wiring

After updating `manifest.json` and `ui5.yaml`, Claude must verify the service is reachable
before advancing to code review.

### 3.1 Verification Steps

```
1. Start the UI5 dev server: npm start
2. Fetch $metadata via proxy:
   GET /sap/opu/odata4/sap/[binding]/srvd/sap/[definition]/0001/$metadata
3. Confirm HTTP 200 response
4. Confirm EntityType names match the EDM mapping table from CLAUDE.md §3 Step 2
5. Confirm all key fields present
6. Confirm no draft entity types added unintentionally
```

### 3.2 Verification Output

```
$METADATA VERIFICATION
══════════════════════
Service URI: /sap/opu/odata4/sap/[binding]/...
HTTP Status: 200 ✅
EntityTypes found: [N]
  ✅ [EntityName] — keys: [field list]
  ✅ [ChildEntity] — keys: [field list]
Draft entities: None ✅
EDM match vs mapping table: ✅ All fields present
```

**Failure condition:** If $metadata returns 404 or 401, stop. Do not proceed to code review.
Check: service binding activated? proxy config correct? destination reachable?

---

## 4. EDM Type Re-Verification

After $metadata confirms, re-verify every OData binding in the UI5 views matches
the actual EDM type returned — not just the design-time assumption.

| EDM Type in $metadata | Expected SAPUI5 Type | Check |
|---|---|---|
| `Edm.String` | `sap.ui.model.odata.type.String` | ☐ |
| `Edm.Decimal` | `sap.ui.model.odata.type.Decimal` | ☐ |
| `Edm.Int32` | `sap.ui.model.odata.type.Int32` | ☐ |
| `Edm.Boolean` | `sap.ui.model.odata.type.Boolean` | ☐ |
| `Edm.Date` | `sap.ui.model.odata.type.Date` | ☐ |
| `Edm.DateTimeOffset` | `sap.ui.model.odata.type.DateTimeOffset` | ☐ |
| `Edm.Guid` | `sap.ui.model.odata.type.Guid` | ☐ |

If any type mismatch is found, auto-fix the view binding before advancing.

---

> **End of INTEGRATION.md**
> Maintained by Abdulsamee.
> Update this file when:
> - SAP changes the OData V4 URI pattern for service bindings
> - A new proxy middleware replaces ui5-middleware-simpleproxy
> - A new BTP destination naming convention is adopted
> - A new EDM type requires a SAPUI5 type mapping entry

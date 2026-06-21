---
name: moro-design
description: |
  Encodes DEWA's SAP Fiori design system — Dubai font, DEWA colour tokens,
  Arabic RTL rules, and a 6-screen generation checklist. Use when starting
  any new DEWA SAP Fiori application (Stages 1–3). Invoked explicitly by
  the developer or triggered by a /moro-start command.
license: Proprietary - DEWA Internal
allowed-tools: Read Write Glob Grep
model: claude-sonnet-4-20250514
metadata:
  owner: DEWA SAP Technical Services
  version: 1.0
  criticality: low
  security_standards: not applicable
  review_authority: DEWA Design CoE
  last_updated: 2026-05
---

# moro-design

## Purpose
Apply DEWA's Fiori design system to every screen generated during Stages 1–3.
This skill ensures every application uses the correct DEWA colour tokens,
Dubai font, Arabic RTL layout rules, and passes the 6-screen checklist before
handoff to the backend team.

## Activation
- Explicit developer invocation: "use the moro-design skill"
- Slash command: `/moro-start`
- Detected trigger phrase: "start new Fiori app", "generate UI5 screens"

## Core rules

### 1. DEWA colour tokens (always use these — never hardcode hex)
Load from `references/TOKENS.md` when activated. Key tokens:

| Token | Role | Hex |
|---|---|---|
| `--dewa-primary` | Buttons, links, active states | `#007560` |
| `--dewa-primary-dark` | Hover states, headers | `#004937` |
| `--dewa-primary-tint` | Card backgrounds, highlights | `#D9EAE7` |
| `--dewa-accent-blue` | Info states, secondary actions | `#0B7BC1` |
| `--dewa-error` | Error states, destructive actions | `#B00020` |
| `--dewa-amber` | Warning states | `#C28B14` |
| `--dewa-grey-100` | Borders, dividers | `#EFEFF1` |

### 2. Dubai font
Primary typeface for all DEWA applications. Load via:
```css
@import url('https://fonts.googleapis.com/css2?family=Dubai:wght@300;400;500;700&display=swap');
font-family: 'Dubai', 'SAP72', Arial, sans-serif;
```

### 3. Arabic RTL rules
- Every view must include `dir="auto"` on the root element
- Text fields: `textAlign="Begin"` (adapts to LTR/RTL automatically)
- Icons: use `mirrorInRTL="true"` on directional icons
- Never hardcode `textAlign="Left"`

### 4. 6-screen generation checklist
Load from `references/SCREENS.md` for full detail. Required screens:

| # | Screen | Key components |
|---|---|---|
| 1 | List Report | SmartFilterBar + SmartTable + toolbar actions |
| 2 | Object Page | Header facet + sections + form groups |
| 3 | Create/Edit Form | SmartForm + SmartField bindings + validation |
| 4 | Detail popover | QuickView + navigation to Object Page |
| 5 | Confirm dialog | MessageBox + custom actions |
| 6 | Error / Empty state | IllustratedMessage + retry action |

### 5. Manifest requirements
```json
{
  "sap.app": { "id": "com.dewa.<namespace>.<appname>" },
  "sap.fiori": { "registrationIds": [], "archeType": "transactional" },
  "sap.ui5": {
    "dependencies": { "minUI5Version": "1.120.0" }
  }
}
```

## References
- `references/TOKENS.md` — full 25-token DEWA palette
- `references/SCREENS.md` — screen-by-screen generation instructions

## Hand-off
After all 6 screens pass linter (run_ui5_linter, 0 errors), export to
`/docs/handoff/` for the backend team. The `session-start-handoff.js` hook
will auto-load this context when the backend session opens.

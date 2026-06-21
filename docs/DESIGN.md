# DEWA Design System
 
## 1. Visual Theme & Philosophy
 
The DEWA design system is built on the pillars of **Trust**, **Sustainability**, and **Clarity**. It reflects a "Smart City" infrastructure that is reliable, eco-conscious, and accessible. The visual language is **Functional Minimalism**—prioritizing ease of use and high-speed information processing for essential services.
 
### Core Principles
 
- **Sustainability as a Canvas:** The heavy use of deep greens signifies life, growth, and environmental responsibility.
- **The Power of Whitespace:** Expansive layouts ensure that complex data (utility bills and consumption) feels manageable.
- **Bilingual Integrity:** Designed from the ground up to be perfectly balanced in both Arabic and English using the Dubai Font.
- **The Flow State:** Transitions and layouts mimic the fluidity of water and the speed of electricity.
 
---
 
## 2. Technical Color Palette
 
### Primary & Brand
 
| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| Primary | `#007560` | `#7FC9BB` | Main branding, primary CTAs |
| Primary Variant | `#004937` | `#27A28D` | Deep headers, hover states, brand grounding |
| Active Background | `#E5F1EF` | `#2B4E48` | Highlighting selected tiles or active states |
| Unread/New | `#F2F8F7` | `#344545` | New notifications or status indicators |
 
#### Primary & Brand Tokens
 
- color-primary-light: #007560
- color-primary-dark: #7FC9BB
- color-primary-variant-light: #004937
- color-primary-variant-dark: #27A28D
- color-active-background-light: #E5F1EF
- color-active-background-dark: #2B4E48
- color-unread-light: #F2F8F7
- color-unread-dark: #344545
 
---
 
### Semantic & Feedback
 
| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| Error | `#B00020` | `#CF6679` | Critical alerts, failed payments, or errors |
| Warning | `#FCF5E7` | `#916C0F` | Cautionary notes, high usage alerts |
| Yellow (Alert) | `#FFC600` | `#856700` | Strictly for Alerts. Never used for buttons |
 
#### Semantic & Feedback Tokens
 
- color-error-light: #B00020
- color-error-dark: #CF6679
- color-warning-light: #FCF5E7
- color-warning-dark: #916C0F
- color-alert-yellow-light: #FFC600
- color-alert-yellow-dark: #856700
 
---
 
### Gray Scale (UI Surfaces)
 
| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| Background/Dialog | `#FFFFFF` | `#212427` | Page base and modal surface |
| Input Fields (100) | `#F2F3F3` | `#373B40` | Form fields and text areas |
| Lines (200) | `#EFEFF1` | `#5A5A5A` | Section dividers and borders |
| Card Border (300) | `#D7D7DF` | `#5A5A5A` | Defining component containers |
| Secondary Text 600 | `#6F6F6F` | `#BDBDBD` | Descriptions, captions, and labels |
| Primary Text 900 | `#222222` | `#E2E2E2` | Main body copy and headings |
| Header 900 | `#222222` | `#FFFFFF` | Highest emphasis titles |
 
#### Gray Scale Tokens
 
- color-background-light: #FFFFFF
- color-background-dark: #212427
- color-surface-100-light: #F2F3F3
- color-surface-100-dark: #373B40
- color-lines-200-light: #EFEFF1
- color-lines-200-dark: #5A5A5A
- color-card-border-300-light: #D7D7DF
- color-card-border-300-dark: #5A5A5A
- color-text-secondary-600-light: #6F6F6F
- color-text-secondary-600-dark: #BDBDBD
- color-text-primary-900-light: #222222
- color-text-primary-900-dark: #E2E2E2
- color-header-900-light: #222222
- color-header-900-dark: #FFFFFF
 
---
 
### Data Visualization (Graphs)
 
| Token | Light Mode | Dark Mode |
|---|---|---|
| Deep Blue | `#152685` | `#788DD1` |
| Blue-Violet | `#6C47CC` | `#A28EF2` |
| Sky Blue | `#60A5FA` | `#065EC9` |
 
#### Data Visualization Tokens
 
- color-graph-deep-blue-light: #152685
- color-graph-deep-blue-dark: #788DD1
- color-graph-blue-violet-light: #6C47CC
- color-graph-blue-violet-dark: #A28EF2
- color-graph-sky-blue-light: #60A5FA
- color-graph-sky-blue-dark: #065EC9
 
---
 
## 3. Typography (Dubai Font)
 
### The Bilingual Rule
 
- **Vertical Breathing:** Arabic script requires more vertical space. When the interface switches to Arabic, Line Height must increase by **10%** to prevent character clipping.
- **Visual Weighting:** Arabic characters naturally look thinner. To match the weight of English text, pair **English Bold** with **Arabic Medium**.
 
### Typographic Hierarchy
 
| Style | Size | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|
| Display | 80px | 120% | -1% | Major bill totals and Hero numbers |
| Heading 1 | 48px | 125% | -0.5% | Primary page titles |
| Heading 3 | 32px | 137% | -0.5% | Section titles |
| Body | 16px | 150% | 0% | Standard reading and content |
| Caption | 14px | 163% | +1% | Support text and metadata |
| Small | 12px | 133% | +2% | Footnotes and legal text |
 
#### Typography Tokens
 
- font-family: Dubai
- font-display-size: 80px
- font-display-line-height: 120%
- font-display-letter-spacing: -1%
- font-heading1-size: 48px
- font-heading1-line-height: 125%
- font-heading1-letter-spacing: -0.5%
- font-heading3-size: 32px
- font-heading3-line-height: 137%
- font-heading3-letter-spacing: -0.5%
- font-body-size: 16px
- font-body-line-height: 150%
- font-body-letter-spacing: 0%
- font-caption-size: 14px
- font-caption-line-height: 163%
- font-caption-letter-spacing: +1%
- font-small-size: 12px
- font-small-line-height: 133%
- font-small-letter-spacing: +2%
- font-arabic-line-height-increase: 10%
- font-english-weight: Bold
- font-arabic-weight: Medium
 
---
 
## 4. Geometric Logic (Radius & Spacing)
 
### The Radius Rule
 
| Value | Usage |
|---|---|
| `5px` | Input Fields — sharp and structured, implying data entry and precision |
| `7px` | Small Elements — tags, tooltips, and informational badges |
| `15px` | Standard Cards — dashboard modules and service containers |
| `20px` | Hero Containers — the largest, most significant sections of a page |
| `100px` (Full Pill) | Buttons — all interactive buttons; creates a clear visual distinction |
 
#### Radius Tokens
 
- radius-input-field: 5px
- radius-small-elements: 7px
- radius-standard-card: 15px
- radius-hero-container: 20px
- radius-button: 100px
 
### Linear Spacing Scale
 
`4px` `8px` `12px` `16px` `20px` `24px` `32px` `40px` `48px` `56px` `64px`
 
#### Spacing Tokens
 
- spacing-1: 4px
- spacing-2: 8px
- spacing-3: 12px
- spacing-4: 16px
- spacing-5: 20px
- spacing-6: 24px
- spacing-7: 32px
- spacing-8: 40px
- spacing-9: 48px
- spacing-10: 56px
- spacing-11: 64px
 
---
 
## 5. Depth, Elevation & Motion
 
### Lifting a Component
 
- **Border:** Apply a `1px` border of Lines-200 (`#EFEFF1`).
- **Fill:** Use the Light Primary tint (`#D9EAE7`).
- **Interaction:** On hover, the fill shifts to Active Background (`#E5F1EF`), creating an Optical Lift and clear feedback.
 
#### Elevation Tokens
 
- elevation-border-width: 1px
- elevation-border-color-light: #EFEFF1
- elevation-border-color-dark: #5A5A5A
- elevation-fill-light: #D9EAE7
- elevation-fill-dark: #2B4E48
- elevation-hover-fill-light: #E5F1EF
- elevation-hover-fill-dark: #2B4E48
 
### The Flow Motion
 
- **Data Flow:** Graphs utilize a linear-glide animation (`400ms`) to represent the movement of water and energy.
- **Success Logic:** When a transaction is completed, the Primary Green color pulses outward from the action button.
 
#### Motion Tokens
 
- motion-graph-animation: linear-glide
- motion-graph-duration: 400ms
- motion-success-pulse-color-light: #007560
- motion-success-pulse-color-dark: #7FC9BB
 
---
 
## 6. Do's and Don'ts
 
### ✅ DO
 
- Use **Primary Green** for all successful outcomes and primary navigational paths.
- **Mirror the entire layout** for Arabic (RTL), including the placement of icons and text alignment.
- Use **Full Pill** shapes for every button to ensure interactive elements are unmistakable.
- Apply the **Radius Scale** correctly—never use a 20px radius on an input field.
 
### ❌ DON'T
 
- Never use **Yellow** for buttons; it is an Alert color for caution and warnings only.
- Avoid shadows where a subtle border (`#D7D7DF`) or tint (`#D9EAE7`) can define the shape.
- Do not flip **brand logos** when mirroring the UI; only directional icons (arrows, chevrons) should flip.
- Do not use **Accent Blue** in this system; the focus is strictly on Green-based sustainability.
 
---
 
## 7. Component Masterclass
 
### Button Masterclass
 
All buttons in the system are **100px Full Pill** elements.
 
#### Component Hierarchy
 
| Type | Style | Usage |
|---|---|---|
| Primary (Solid) | `#007560` fill | "Pay Now," "Submit" |
| Secondary (Outline) | 1px border `#222222` | "Back," "Cancel" |
| Tertiary (Ghost) | No background or border | Low-priority actions |
 
#### Dynamic Iconography Logic
 
- **Leading Icon (Context):** Indicates the type of action.
- **Trailing Icon (Direction):** Indicates movement in a flow.
- **Spacing:** Exactly `8px` between icon and text.
- Both icons will **not** be displayed simultaneously.
 
#### State Definitions
 
| State | Primary (Solid) | Secondary (Outline) | Tertiary (Ghost) |
|---|---|---|---|
| Default | `#007560` | White Bg + `#222222` Border | Transparent |
| Hover | `#27A28D` | `#F2F3F3` Background | `#E5F1EF` Background |
| Disabled | `#7FC9BB` (40%) | `#EFEFF1` Border + Gray Text | Grayed Out Text |
 
#### Button Tokens
 
- button-border-radius: 100px
- button-height: 48px
- button-padding-horizontal: 24px
- button-font: Dubai Medium
- button-font-size: 16px
- button-font-case: sentence-case
- button-icon-spacing: 8px
- button-primary-background-light: #007560
- button-primary-background-dark: #7FC9BB
- button-primary-hover-background-light: #27A28D
- button-primary-hover-background-dark: #004937
- button-primary-disabled-background-light: #7FC9BB
- button-primary-disabled-opacity: 40%
- button-secondary-background-light: #FFFFFF
- button-secondary-background-dark: #212427
- button-secondary-border-light: #222222
- button-secondary-border-dark: #E2E2E2
- button-secondary-hover-background-light: #F2F3F3
- button-secondary-hover-background-dark: #373B40
- button-secondary-disabled-border-light: #EFEFF1
- button-secondary-disabled-border-dark: #5A5A5A
- button-tertiary-background: transparent
- button-tertiary-hover-background-light: #E5F1EF
- button-tertiary-hover-background-dark: #2B4E48
 
---
 
### Form & Feedback Masterclass
 
#### Core Input Fields
 
| Token | Light Mode | Dark Mode | Notes |
|---|---|---|---|
| Field Background | `#ffffff` | `#373B40` | Clean and distinct |
| Borders | `#EFEFF1` | `#5A5A5A` | Structural definition |
| Primary Text | `#222222` | `#E2E2E2` | Main body copy |
| Placeholder | `#6F6F6F` | `#BDBDBD` | Guidance text |
 
#### Core Input Field Tokens
 
- input-field-background-light: #ffffff
- input-field-background-dark: #373B40
- input-field-border-light: #EFEFF1
- input-field-border-dark: #5A5A5A
- input-field-text-light: #222222
- input-field-text-dark: #E2E2E2
- input-field-placeholder-light: #6F6F6F
- input-field-placeholder-dark: #BDBDBD
- input-field-border-radius: 5px
- input-field-border-width-default: 1px
- input-field-border-width-active: 2px
- input-field-border-color-active: #007560
- input-field-border-color-error: #B00020
- input-field-label-font: Dubai Regular
- input-field-label-font-size: 16px
- input-field-helper-text-font-size: 12px
 
---
 
### Selection Controls
 
| Control | Default State | Active (Selected) | Disabled |
|---|---|---|---|
| Checkbox | Border `#D7D7DF` | `#007560` Fill + Active Ring | Grayed out |
| Radio Button | Circle `#D7D7DF` | `#007560` Inner Dot + Ring | Grayed out |
 
#### Selection Control Tokens
 
- checkbox-border-default-light: #D7D7DF
- checkbox-border-default-dark: #5A5A5A
- checkbox-fill-active-light: #007560
- checkbox-fill-active-dark: #7FC9BB
- radio-border-default-light: #D7D7DF
- radio-border-default-dark: #5A5A5A
- radio-dot-active-light: #007560
- radio-dot-active-dark: #7FC9BB
 
---
 
### Dropdowns & Multi-Selects
 
- **Radius:** 15px (M-Scale)
- **Multi-Select:** Displays a checkbox on selection and a `Item name + X More` badge
 
#### Dropdown Tokens
 
- dropdown-border-radius: 15px
- dropdown-background-light: #FFFFFF
- dropdown-background-dark: #373B40
- dropdown-border-light: #EFEFF1
- dropdown-border-dark: #5A5A5A
- dropdown-text-light: #222222
- dropdown-text-dark: #E2E2E2
 
---
 
### Alert & Notification System
 
| Type | Background Tint | Icon | Usage |
|---|---|---|---|
| Info | `#D7E7F0` (Tonal Blue) | Info Icon | General information |
| Caution | `#FCF5E7` (Yellow-Tint) | Caution Icon | Consumption warnings |
| Error / Critical | `#F3D9DE` (Red-Tint) | Error Icon | Payment failures, outages |
| Success / Status | `#D9EAE7` (Green-Tint) | Success Icon | Successful payments |
 
#### Alert Tokens
 
- alert-info-background-light: #D7E7F0
- alert-info-background-dark: #1A3A4A
- alert-caution-background-light: #FCF5E7
- alert-caution-background-dark: #3D2E00
- alert-error-background-light: #F3D9DE
- alert-error-background-dark: #4A1A22
- alert-success-background-light: #D9EAE7
- alert-success-background-dark: #1A3D36
 
---
 
### Navigation (Breadcrumbs & Tabs)
 
| Component | Specs |
|---|---|
| Breadcrumbs | Dubai Regular 16px · Chevron (`>`) divider flips for RTL · Active is `#222222` |
| Tabs | Active tab uses 20px radius · Background `#E5F1EF` · Bottom bar 3px in `#007560` · Inactive is borderless |
 
#### Navigation Tokens
 
- breadcrumb-font: Dubai Regular
- breadcrumb-font-size: 16px
- breadcrumb-active-color-light: #222222
- breadcrumb-active-color-dark: #FFFFFF
- breadcrumb-inactive-color-light: #6F6F6F
- breadcrumb-inactive-color-dark: #BDBDBD
- breadcrumb-divider-rtl-flip: true
- tab-active-border-radius: 20px
- tab-active-background-light: #E5F1EF
- tab-active-background-dark: #2B4E48
- tab-active-indicator-height: 3px
- tab-active-indicator-color-light: #007560
- tab-active-indicator-color-dark: #7FC9BB
- tab-inactive-background: transparent
- tab-inactive-border: none

---

## 8. DEWA FLP CSS Rules

CSS rules for DEWA SAPUI5 apps deployed to SAP Fiori Launchpad — visual correctness and theme integrity only. For FLP manifest configuration, deployment checklist, and testing procedures, see [GUARDRAILS.md §1](./GUARDRAILS.md).

---

### 8.1 CSS Scoping (Critical)

All custom CSS rules **must** be scoped under the app's root container ID to prevent style bleed into the FLP shell, other tiles, and the SAP shell header.

**Rule:** Prefix every selector with `#app` (or the app's root view ID).

```css
/* ❌ WRONG — leaks into FLP shell */
.sapMPage { padding: 0; }
.sapMBtn  { margin-bottom: 1rem; }

/* ✅ CORRECT — scoped to this app only */
#app .sapMPage { padding: 0; }
#app .sapMBtn  { margin-bottom: 1rem; }
```

- Never apply unscoped overrides to SAP framework classes (`.sapM*`, `.sapUi*`).
- Never apply unscoped rules to HTML primitives (`body`, `html`, `*`) that would affect the entire FLP shell.

---

### 8.2 Font Loading (Critical)

The `@import` for Dubai Font **must not** use an external CDN URL in ABAP/FLP deployments. ABAP FLP enforces a Content Security Policy (CSP) that blocks external `@import` calls.

**Rule:** Load the Dubai Font via one of these approved methods only:

1. **Preferred:** Register Dubai Font as a UI Theme Designer custom font in the ABAP system.
2. **Alternative:** Bundle the font files (`.woff2`, `.woff`) inside `webapp/fonts/` and use a local `@font-face` declaration.

```css
/* ✅ Approved local font-face */
@font-face {
  font-family: 'Dubai';
  src: url('../fonts/Dubai-Regular.woff2') format('woff2'),
       url('../fonts/Dubai-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
```

- The `@import url('https://fonts.cdnfonts.com/css/dubai')` rule must be **removed** before ABAP deployment.

---

### 8.3 `!important` Usage (Important)

Excessive `!important` declarations block FLP theme switching (e.g., switching from Horizon Light to Horizon Dark). They also prevent administrators from applying corporate theme overrides via UI Theme Designer.

**Rules:**
- Use `!important` only when there is no other way to raise specificity (e.g., overriding deeply nested SAPUI5 generated selectors).
- Every `!important` usage must have a comment explaining why it is necessary.
- Maximum of **5** `!important` rules per stylesheet.
- Never use `!important` on color- or theme-related properties (`background-color`, `color`, `border-color`).

```css
/* ❌ WRONG */
.dewaCard { background-color: #FFFFFF !important; }

/* ✅ CORRECT — raised specificity without !important */
#app .sapMPanel.dewaCard { background-color: #FFFFFF; }
```

---

### 8.4 Button Radius in FLP Context (Important)

The DEWA pill button radius of `100px` is a brand differentiator inside the app. However, when action buttons appear in FLP **shell-level** components (header actions, notifications, quick access tiles), the SAP Fiori Horizon standard of `0.5rem` (8px) must be used to preserve shell visual consistency.

**Rules:**
- `radius-button: 100px` applies **only within the app's page content area** (inside `.sapMPage .sapMPageContent`).
- Do not apply `100px` radius to buttons rendered in `ShellBar`, `NotificationList`, or FLP tile footers.
- If `sap.m.Button` instances are reused in both contexts, use scoped CSS: `#app .sapMPageContent .sapMBtn`.

---

### 8.5 RTL CSS — Logical Properties

DEWA is a bilingual (Arabic/English) application. Always use CSS Logical Properties so layouts mirror correctly in Arabic (RTL) mode.

**Rule:** Never use `margin-left`, `margin-right`, `padding-left`, or `padding-right`. Use their logical equivalents.

```css
/* ❌ WRONG — breaks in RTL */
.dewaActionBar { margin-left: 24px; padding-right: 16px; }

/* ✅ CORRECT — works in both LTR and RTL */
.dewaActionBar { margin-inline-start: 24px; padding-inline-end: 16px; }
```

| Forbidden Property | CSS Logical Replacement |
|---|---|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `left: ...` (positional) | `inset-inline-start: ...` |
| `right: ...` (positional) | `inset-inline-end: ...` |

- Directional icons (arrows, chevrons) use SAPUI5's built-in RTL-aware mirroring — do not flip manually in CSS.
- For RTL testing procedures and the full FLP deployment checklist, see [GUARDRAILS.md §1](./GUARDRAILS.md).

---

## Development Guardrails

CSS rules in this document cover **visual theming only** (colors, typography, spacing, elevation, component styles, and FLP CSS scoping).

All development coding standards are in the dedicated guardrails file — covering FLP deployment config, Fiori Elements annotations, OData, Accessibility, i18n, AI coding rules, Performance, RAP, and CAP:

→ **[GUARDRAILS.md](./GUARDRAILS.md)**

---

## 9. AI Copilot Token Reference

> **Added by Abdulsamee — for GitHub Copilot and AI assistants.**  
> This section is a consolidated prompt-ready reference. Always use the token names below when generating CSS, XML views, or component styles. Never invent new hex values.

### 9.1 Color Tokens — Prompt-Ready Format

```
=== PRIMARY & BRAND ===
Primary Green (CTA, active, success):          #007560  (dark: #7FC9BB)
Primary Variant (hover, text links, AAA text): #004937  (dark: #27A28D)
Active Background (selected rows, tiles):      #E5F1EF  (dark: #2B4E48)
Unread / New indicators:                       #F2F8F7  (dark: #344545)

=== SEMANTIC / FEEDBACK ===
Error Red (errors, failed payments):           #B00020  (dark: #CF6679)
Warning Background (high usage caution):       #FCF5E7  (dark: #916C0F)
Alert Yellow (warning icons/bg — NOT buttons): #FFC600  (dark: #856700)

=== SURFACES & TEXT ===
Page / Dialog Background:                      #FFFFFF  (dark: #212427)
Input Field Background:                        #F2F3F3  (dark: #373B40)
Section Dividers (Lines-200):                  #EFEFF1  (dark: #5A5A5A)
Card Border (300):                             #D7D7DF  (dark: #5A5A5A)
Secondary Text / Captions (600):               #6F6F6F  (dark: #BDBDBD)
Primary Text / Headings (900):                 #222222  (dark: #E2E2E2)
Header Emphasis (900):                         #222222  (dark: #FFFFFF)

=== ELEVATION ===
Component Border:                              #EFEFF1  (dark: #5A5A5A)
Component Fill / Hero Background:              #D9EAE7  (dark: #2B4E48)
Hover / Active Lift:                           #E5F1EF  (dark: #2B4E48)

=== DATA VISUALIZATION (charts/graphs only) ===
Deep Blue:                                     #152685  (dark: #788DD1)
Blue-Violet:                                   #6C47CC  (dark: #A28EF2)
Sky Blue:                                      #60A5FA  (dark: #065EC9)

=== ALERTS (strip backgrounds) ===
Info alert:                                    #D7E7F0  (dark: #1A3A4A)
Caution alert:                                 #FCF5E7  (dark: #3D2E00)
Error alert:                                   #F3D9DE  (dark: #4A1A22)
Success alert:                                 #D9EAE7  (dark: #1A3D36)

=== CRITICALITY → STATUS COLORS ===
Criticality 3 — Positive / Paid:              #007560
Criticality 2 — Warning / High Usage:         #FFC600
Criticality 1 — Error / Failed:               #B00020
Criticality 0 — Neutral / Pending:            #6F6F6F
```

### 9.2 Typography Tokens — Prompt-Ready Format

```
Font Family:        Dubai (Regular, Medium, Bold)
Arabic Line Height: Always +10% vs English equivalent
English Bold ↔ Arabic Medium (visual weight matching)

Display:    80px / line-height 120% / letter-spacing -1%   → Hero totals, bill amounts
Heading 1:  48px / line-height 125% / letter-spacing -0.5% → Page titles
Heading 3:  32px / line-height 137% / letter-spacing -0.5% → Section titles
Body:       16px / line-height 150% / letter-spacing 0%    → Content, labels
Caption:    14px / line-height 163% / letter-spacing +1%   → Column headers, metadata
Small:      12px / line-height 133% / letter-spacing +2%   → Helper text, footnotes
```

### 9.3 Radius Tokens — Prompt-Ready Format

```
Input Fields:      5px   → sap.m.Input, sap.m.DatePicker, sap.m.Select
Small Elements:    7px   → Tags, tooltips, badges
Standard Cards:   15px   → sap.m.Panel, dashboard tiles, service containers
Hero Containers:  20px   → Account summary block, DynamicPageHeader custom panels
Buttons:         100px   → ALL sap.m.Button — ONLY inside .sapMPageContent
                           NEVER in ShellBar, NotificationList, or FLP tile footers
```

### 9.4 Spacing Tokens — Prompt-Ready Format

```
spacing-1:  4px    spacing-5: 20px    spacing-9:  48px
spacing-2:  8px    spacing-6: 24px    spacing-10: 56px
spacing-3: 12px    spacing-7: 32px    spacing-11: 64px
spacing-4: 16px    spacing-8: 40px
```

### 9.5 Button Tokens — Prompt-Ready Format

```
Height:          48px
Padding (H):     24px
Font:            Dubai Medium, 16px, sentence-case
Icon spacing:    8px from text
Border radius:   100px (pill) — scoped to .sapMPageContent

Primary (Solid):
  Default:   background #007560
  Hover:     background #27A28D
  Disabled:  background #7FC9BB at 40% opacity

Secondary (Outline):
  Default:   background #FFFFFF, border 1px #222222
  Hover:     background #F2F3F3
  Disabled:  border #EFEFF1, text #6F6F6F

Tertiary (Ghost):
  Default:   background transparent
  Hover:     background #E5F1EF

Footer toolbar hierarchy: Save = Primary · Cancel = Secondary · Discard = Tertiary
```

### 9.6 Input Field Tokens — Prompt-Ready Format

```
Background (default): #FFFFFF  (dark: #373B40)
Border (default):     1px #EFEFF1
Border (active):      2px #007560
Border (error):       2px #B00020
Border radius:        5px
Text:                 #222222  (dark: #E2E2E2)
Placeholder:          #6F6F6F  (dark: #BDBDBD)
Label font:           Dubai Regular 16px
Helper text:          12px
```

### 9.7 Component Quick-Reference for Copilot Prompts

When asking Copilot to build a UI element, append the relevant line below to your prompt:

```
"Apply DEWA card style: background #FFFFFF, border 1px #D7D7DF, border-radius 15px, scoped under #app."
"Apply DEWA hero container: background #D9EAE7, border-radius 20px, scoped under #app."
"Apply DEWA primary button: background #007560, border-radius 100px, height 48px, font Dubai Medium 16px. Scope to .sapMPageContent only."
"Apply DEWA status badge: criticality 3=#007560, 2=#FFC600, 1=#B00020, 0=#6F6F6F."
"Apply DEWA table row hover: background #E5F1EF, scoped under #app .sapMListItems."
"Apply DEWA selected list item (FCL): background #E5F1EF, border-inline-start 3px solid #007560."
"Apply DEWA section divider: border-top 1px #EFEFF1."
"Apply DEWA focus/active input: border 2px solid #007560, border-radius 5px."
"Apply DEWA tab active: background #E5F1EF, border-radius 20px, indicator 3px #007560."
"Use CSS logical properties: margin-inline-start / padding-inline-end (never margin-left/right)."
"Dubai Font via local @font-face only — no CDN @import."
```


---

## 10. HR Portal Component Styles — Fiori / UI5 / Neptune Only

> **Scope:** This section applies **exclusively** to SAP Fiori, SAPUI5, and Neptune DXP applications.
> Do **not** apply these styles to standalone web apps, BTP Work Zone shell overrides, or non-SAP frontends.
> Selectors target SAP framework CSS classes (`sapM*`, `sapUi*`, `sapF*`, `nep*`) and custom DEWA utility classes.
> These rules override SAP Horizon theme defaults to enforce DEWA branding at the component level.

---

### 10.1 Toggle Button & Time Picker

**Purpose:** Applies DEWA primary green to pressed toggle states and Time Picker clock markers.

| Element | Property | Value | DEWA Token |
|---|---|---|---|
| Pressed toggle button | `background-color` | `#007560` | `color-primary-light` |
| Pressed toggle button | `border-color` | `transparent` | — |
| Pressed toggle hover | `background-color` | `#007560` | `color-primary-light` |
| Clock marker dot | `background-color` | `#007560` | `color-primary-light` |
| Clock marker dot | `border` | `0.0625rem solid #007560` | `color-primary-light` |
| Selected clock position | `background-color` | `#007560` | `color-primary-light` |
| Time Picker button border | `border` | `0.0625rem solid #007560` | `color-primary-light` |
| Time Picker button text | `color` | `#32363a` | `color-text-primary-900-light` |

**CSS selectors covered:**
`.sapMToggleBtnPressed` · `.sapMTPCMarker` · `.sapMTPCSelected` · `.sapMTimePickerDropDown`

---

### 10.2 Input Field — States & Height

**Purpose:** Standardises input field height to 40px and applies DEWA green for active/focus border states.

#### Height standardisation

| Element | Height | Notes |
|---|---|---|
| `.sapMInputBaseContentWrapper` | `40px` | All input wrappers |
| `.sapMInputBaseHasEndIcons` | `40px` | Inputs with trailing icons |
| `.sapMInputBaseDisabled` | `40px` | Disabled state |
| `.sapMInputBaseReadonly` | `40px` | Read-only state |
| `.sapMInput` | `40px` | Standard input |
| `.sapMInputBaseIcon` | `line-height: 39px` | Icon alignment |
| `.sapMTextArea` | `auto` | Text areas are height: auto |
| Compact density `.sapMInput` | `2.25rem` | Compact cosy mode |

#### Border & colour states

| State | Property | Value | DEWA Token |
|---|---|---|---|
| Icon pressed — wrapper border | `border-color` | `#007560` | `color-primary-light` |
| Icon pressed — icon border | `border-left-color` | `#007560` | `color-primary-light` |
| Icon default | `color` | `#6f6f6f` | `color-text-secondary-600-light` |
| Input hover border | `border-color` | `#007560` | `color-primary-light` |
| Text selection highlight | `background` | `#007560` | `color-primary-light` |
| Read-only / disabled background | `background` | `#f7f7f7` | — |
| Input border radius | `border-radius` | `4px` | `radius-input-field` |
| Readonly border radius | `border-radius` | `4px` | `radius-input-field` |
| Disabled opacity | `opacity` | `1` | Overrides SAP default fade |
| Focus ring | `outline` | `1px dotted transparent` | Accessibility — no visible ring |
| Hover border (general) | `border-color` | `#BCBEC0` | Neutral hover |

---

### 10.3 Select / Dropdown Control

**Purpose:** Standardises Select height to 40px. Applies DEWA green to pressed state arrow and active border.

#### Height

| Element | Value | Notes |
|---|---|---|
| `.sapMSlt` | `40px` | Standard Select height |
| `.sapMSlt > .sapMSltArrow` | `line-height: 39px` | Arrow alignment |
| `.sapMSlt > .sapMSltLabel` | `line-height: 41px` | Label alignment |
| Compact `.sapMSlt` | `2.25rem` | Compact cosy mode |

#### Colour & state

| State | Element | Value | DEWA Token |
|---|---|---|---|
| Default arrow | `color` | `#000` | `color-text-primary-900-light` |
| Pressed arrow icon | `color` | `#007560` | `color-primary-light` |
| Pressed border | `border-color` | `#8B9199` | — |
| Hover arrow background | `background` | `#E5F1EF` | `color-active-background-light` |
| Hover border | `border-color` | `#8B9199` | — |
| Disabled background | `background-color` | `#f1f1f1` | — |
| Disabled opacity | `opacity` | `1` | Overrides SAP default fade |
| ComboBox disabled background | `background-color` | `#f1f1f1` | — |
| Border radius | `border-radius` | `4px` | `radius-input-field` |
| Information state border | `border-color` | `#bb0000` | `color-error-light` |

---

### 10.4 List & Table Item Selection

**Purpose:** Uses DEWA active background `#E5F1EF` for selected items. Removes default SAP highlight borders.

#### Selected / active states

| State | Element | Property | Value | DEWA Token |
|---|---|---|---|---|
| Selected list item | `.sapMLIBSelected` | `background` | `#E5F1EF` | `color-active-background-light` |
| Selected list item hover | `.sapMLIBSelected:hover` | `background` | `#E5F1EF` | `color-active-background-light` |
| Selected dropdown item | `.sapMSelectListItemBaseSelected` | `background` | `#E5F1EF` | `color-active-background-light` |
| Active list item | `.sapMLIBActive` | `background` | `#fff` | `color-background-light` |
| Active list item text | `.sapMLIBActive .sapMText` | `color` | `#000` | `color-text-primary-900-light` |
| Hover | `.sapMLIBHoverable:hover` | `background` | `transparent` | — |
| Selected row shadow | `.sapMTableTBody .sapMLIBSelected` | `box-shadow` | `inset 0 -0.0625rem #087B36` | — |
| Highlight bar width | `.sapMLIBHighlight` | `width` | `0.175rem` | — |

#### Table header

| Element | Property | Value | Notes |
|---|---|---|---|
| `th`, `th div`, `th div span` | `background-color` | `#f6f6f6` | Light grey header row |
| `th`, `th div`, `th div span` | `color` | `#222` | `color-text-primary-900-light` |
| `th`, `th div`, `th div span` | `font-weight` | `500` | Medium weight |

#### Attachment table

| Rule | Value |
|---|---|
| `.attachmnt_tbl thead tr` | `display: none` — header row hidden |
| Mobile colon alignment | `display: inline-flex; vertical-align: sub` |

---

### 10.5 Calendar Control

**Purpose:** Applies DEWA green to selected dates and range backgrounds.

| State | Element | Property | Value | DEWA Token |
|---|---|---|---|---|
| Selected date | `.sapUiCalItemSel:not(.sapUiCalItemSelBetween)` | `background-color` | `#007560` | `color-primary-light` |
| Selected date text | `>.sapUiCalItemText` | `color` | `#fff` | `color-background-light` |
| Date range fill | `.sapUiCalItemSelBetween` | `background` | `#0075601A` | `color-primary-light` at 10% opacity |
| Range item border | `>.sapUiCalItemText` | `border-radius` | `0.25rem` | — |
| Header button hover | `button:hover` | `background-color` | `#007560` | `color-primary-light` |
| Header button hover text | `button:hover` | `color` | `#fff` | `color-background-light` |
| Header month/year label | `.sapUiCalHeadB` | `color` | `#222` | `color-text-primary-900-light` |
| Header month/year label | `.sapUiCalHeadB` | `font-weight` | `600` | — |
| Week number | `.sapUiCalWeekNum` | `visibility` | `hidden` | Hidden from display |

---

### 10.6 MessageBox & Dialog

**Purpose:** Standardises MessageBox button shapes and colours. Applies DEWA green to success state.

#### Dialog shape

| Element | Property | Value |
|---|---|---|
| `.sapMDialog` | `border-radius` | `7px` |
| Dialog footer backgrounds | `background-color` | `#fff` — all three message types |

#### MessageBox button styles

| Type | Property | Value | DEWA Token |
|---|---|---|---|
| **Success** button background | `background-color` | `#007560` | `color-primary-light` |
| **Success** button text | `color` | `#fff` | `color-background-light` |
| **Success** icon | `color` | `#007560` | `color-primary-light` |
| **Error** button background | `background-color` | `transparent` | — |
| **Error** button border | `border` | `1px solid #222` | — |
| **Error** button text | `color` | `#222` | `color-text-primary-900-light` |
| **Info** button background | `background-color` | `transparent` | — |
| **Info** button border | `border` | `1px solid #222` | — |
| **Info** button text | `color` | `#222` | `color-text-primary-900-light` |
| All buttons | `border-radius` | `6px` | — |
| All buttons | `height` | `30px` · width `86px` | — |

#### Message text

| Element | Property | Value | DEWA Token |
|---|---|---|---|
| `.sapMMessageBox .sapMMsgBoxText` | `color` | `#6f6f6f` | `color-text-secondary-600-light` |
| `.dia-msg_box .sapMText` | `color` | `#6f6f6f` | `color-text-secondary-600-light` |

---

### 10.7 Panel Control

**Purpose:** Standardises panel sizing, spacing, and expand icon positioning for consistency across HR Portal screens.

| Property | Value | Notes |
|---|---|---|
| Panel width | `98%` | Centred via `margin: 0 auto` |
| Panel background | `#fff` | `color-background-light` |
| Panel margin top | `15px` | Vertical rhythm between panels |
| Panel border radius | `5px` | `radius-small-elements` |
| Panel header height | `59px` | Fixed height for consistent alignment |
| Panel header line height | `59px` | Vertically centres header text |
| Panel header font weight | `bold` | Emphasis |
| Panel header text colour | `#222222` | `color-text-primary-900-light` |
| Panel header indent | `margin-inline-start: 20px` | RTL-safe indentation |
| Panel bottom border | `1px solid #d9d9d9` | Subtle section separator |
| Expand icon position | `position: absolute; right: 14px` | Fixed to right edge |
| Expand icon colour | `#222222` | `color-text-primary-900-light` |
| Panel content bottom border | `none` | Removed for cleaner layout |
| Announcement panel width | `100%` | Full-width exception |

---

### 10.8 Button Utility Classes

> These are DEWA custom classes applied to `sap.m.Button` controls across HR Portal apps.
> Each class has a defined purpose — do not use interchangeably.

| Class | Purpose | Background | Border | Height | Text colour |
|---|---|---|---|---|---|
| `.btn-header` | Primary button in Page header | `#007560` | none | `38px` | `#fff` |
| `.btn-footer` | Primary/Emphasized button in Page footer | `#007560` | none | `38px` | `#fff` |
| `.btn-general` | Any primary button inside a Page | `#007560` | none | `43px` | `#fff` |
| `.btn-cancel` | Secondary / Cancel in Page footer | `transparent` | `1px solid #222` | `38px` | `#222` |
| `.btn-submitapp` | Primary button in Dialog footer | `#007560` | none | `30px` | `#fff` |
| `.btn-cancelapp` | Secondary button in Dialog footer | `transparent` | none | `30px` | `#fff` |
| `.btn-rejapp` | Reject button in Dialog footer | `#B00020` | none | `30px` | `#fff` |
| `.btn-approveapp` | Approve button in Page footer | `#007560` | none | `38px` | `#fff` |
| `.btn-rejectapp` | Reject button in Page footer | `#B00020` | none | `38px` | `#fff` |
| `.btn-massapproveapp` | Approve All in Page footer | `#007560` | none | `30px` | `#fff` |
| `.btn-massrejectapp` | Reject All in Page footer | `#B00020` | none | `30px` | `#fff` |
| `.btn-update` | Update button anywhere in Page | `#222` | none | `32px` | `#fff` |
| `.btn-iconapp` | Icon-only button | `transparent` | none | — | `#222` icon |
| `.btn-upload` | File uploader button | `#007560` | `#007560` | `40px × 40px` | `#fff` |

**Shared properties for all button classes:**
- `border-radius: 6px`
- `transition: box-shadow 0.3s, background-color 0.3s, color 0.3s`
- `font-weight: normal` (inner text)
- `white-space: nowrap`
- Hover: `background-color: transparent; border-color: transparent` on inner span

---

### 10.9 SAP Framework Button Hover Overrides

**Purpose:** Overrides SAP Horizon default hover colours with DEWA primary green for Emphasized and Transparent button types.

| Trigger | Element | Property | Value | DEWA Token |
|---|---|---|---|---|
| Transparent button icon hover | `.sapMBtnTransparent .sapUiIcon` | `color` | `#007560` | `color-primary-light` |
| Emphasized button hover | `.sapMBtnEmphasized` | `background-color` | `#007560` | `color-primary-light` |
| Emphasized button hover | `.sapMBtnEmphasized` | `border-color` | `#007560` | `color-primary-light` |
| Accept button hover text | `bdi` | `color` | `#ffffff` | `color-background-light` |
| Reject button hover text | `bdi` | `color` | `#ffffff` | `color-background-light` |
| Button focus ring | `.sapMFocusable` | `border` | `1px dotted #222222` | — |
| Desktop link/button focus | `outline` | `none` | Suppress default browser ring |
| Bar context button inner | `background-color` | `transparent` | Transparent in headers/footers |
| Bar context button text | `color` | `white` | White text in headers/footers |

---

### 10.10 Icon Tab Bar

**Purpose:** Applies DEWA green to the selected tab state and removes default SAP separator lines.

| State | Element | Property | Value | DEWA Token |
|---|---|---|---|---|
| Default filter text | `.sapMITBFilterDefault` | `color` | `#222222` | `color-text-primary-900-light` |
| Filter icon border | `.sapMITBFilterIcon` | `border` | `1px solid #222222` | — |
| Filter icon size | `.sapMITBFilterIcon` | `height / width` | `36px` | — |
| **Selected** filter background | `.sapMITBSelected .sapMITBFilterDefault` | `background` | `#007560` | `color-primary-light` |
| **Selected** filter text | `.sapMITBSelected .sapMITBFilterDefault` | `color` | `#ffffff` | `color-background-light` |
| **Selected** text heading | `.sapMITBSelected .sapMITHTextContent` | `color` | `#007560` | `color-primary-light` |
| **Selected** content arrow | `::after` | `background` | `#007560` | `color-primary-light` |
| Content area border | `.sapMITBContent` | `border-bottom` | `transparent` | Removed |
| Focus ring | `.sapMITBFilterIcon::after` | `border` | `1px dotted transparent` | Accessibility |
| Overflow handling | `.sapMITHEndOverflow .sapMITBTab` | `display` | `none` | Hides overflow tabs |

---

### 10.11 Radio Button

**Purpose:** Applies DEWA primary green to the selected radio button fill and stroke.

| State | Element | Property | Value | DEWA Token |
|---|---|---|---|---|
| Selected inner fill | `.sapMRbBInn` | `fill` | `#fff` | `color-background-light` |
| Selected outer stroke | `.sapMRbBOut` | `stroke` | `#007560` | `color-primary-light` |
| Selected outer fill | `.sapMRbBOut` | `fill` | `#007560` | `color-primary-light` |
| Selected hover | `.sapMRbBOut:hover` | `stroke + fill` | `#007560` | `color-primary-light` |

---

### 10.12 Neptune DXP Shell & Layout

**Purpose:** Configures the Neptune DXP application shell, top menu, launchpad container, and card grid for DEWA HR Portal.

#### Shell & top menu

| Element | Property | Value | Notes |
|---|---|---|---|
| `.nepTopMenu` | `border-bottom` | `1px solid #d7d7d7` | Menu separator |
| `.nepTopMenu` | `width` | `100%` | Full width |
| Launchpad background | `background-color` | `#ffffff` | Overrides any image background |
| Tool header background | `background-color` | `#fff` | SAP tool header |
| Tool header icon colour | `color` | `#000` | All tool header icons |
| Tool header search field border | `border-color` | `#ababab` | Search input border |
| `.nepAppDialog .sapMBarLeft` | `display` | `none` | Hides left bar in app dialogs |
| Notification item focus | `outline` | `none` | Removes focus ring on notifications |
| Notification icon size | `width / height` | `2rem` | Consistent icon sizing |

#### Home container

| Element | Property | Value |
|---|---|---|
| `.homeContainer .nepFCard:hover` | `box-shadow` | `none` (flat on hover) |
| `.homeContainer .nepFCard.sapFCard` | `background-color` | `#fff` |
| `.homeContainer .nepFCardContainer` | `padding` | `0` |
| `.homeContainer .sapMPanel` | `margin-top` | `0` · `width: 100%` |
| `.homeContainer` | `margin-inline` | `0` — RTL-safe |
| `.homeContainer .nepGrid` | `padding` | `0` |

#### Announcement tile

| Element | Property | Value |
|---|---|---|
| `.announcement-tile` | `min-height` | `240px` |
| `.announcement-tile` | `width` | `75%` centred |
| `.dewa-announcements` | `text-align` | `center` · `background-color: transparent` |

#### FCard header

| Element | Property | Value |
|---|---|---|
| `.sapFCard .sapFCardTitle` | `font-weight` | `bold` |
| `.sapFCard .sapFCardSubtitle .sapMText` | `font-size` | `12px` |
| `.sapFCard .sapFCardSubtitle` | `margin` | `1rem 0 0 0` |
| `.sapFCardHeader:focus::before` | `outline` | `none` |

---

### 10.13 Neptune Grid Layout

**Purpose:** Defines responsive column grid breakpoints for Neptune DXP page layouts.

| Breakpoint class | Grid columns | Column variable |
|---|---|---|
| `nepGridSmall` | 10 | `var(--grid10)` |
| `nepGridMedium` | 8 | `var(--grid8)` |
| `nepGrid` (default) | 12 | `var(--grid12)` |
| `nepGridLarge` | 12 | `var(--grid12)` |
| `nepGridXLarge` | 16 | `var(--grid16)` |
| `nepGridXXLarge` | 12 | `var(--grid12)` |
| `nepGridXXXLarge` | 12 | `var(--grid12)` |
| Upper grid (announcements/workflow) | 8 base → 16 inside | Override for upper section |

**`nepTileMax` span per breakpoint:**

| Grid | Span |
|---|---|
| Default / Large | 12 |
| XLarge | 16 |
| XXLarge / XXXLarge | 12 |
| Medium | 8 |
| Small | 10 |

---

### 10.14 Form & Label Rules

**Purpose:** Overrides SAP default form layout to enforce DEWA label styling and required field asterisk position.

| Rule | Property | Value | Notes |
|---|---|---|---|
| `.sapMLabel` | `font-weight` | `bold` | All form labels |
| Required asterisk — before | `content` | `none` | Remove default `*` before label |
| Required asterisk — after | `content` | `"*"` · `color: #ce3b3b` | Append red asterisk after label |
| Required asterisk font | `font-family` | `Dubai-Regular` | Consistent with body font |
| Required asterisk size | `font-size` | `1rem` | — |
| Form column layout padding | `.sapUiFormCLContainer` | `padding: 1rem 0` | Vertical breathing room |
| Form container width | `.sapUiFormCLContainerCont` | `99%` | Near-full width |
| Form label top padding (edit) | `padding-top` | `0.675rem` | Aligns label with input vertically |
| Cell width — 12 cols | `.sapUiFormCLCellsS12` | `84%` | Standard full-width field |
| Cell width — 6 cols | `.sapUiFormCLCellsS6` | `42%` | Half-width field |
| Form read mode padding | `padding` | `3px 10px` | Compact read display |

---

### 10.15 Busy Indicator

**Purpose:** Applies DEWA green to the loading spinner animation.

| Element | Property | Value | DEWA Token |
|---|---|---|---|
| Spinner animation dot | `background` | `#007560` | `color-primary-light` |
| Busy indicator focus | `outline` | `1px dotted transparent` | No visible focus ring on overlay |

---

### 10.16 Responsive Overrides (Mobile — max-width: 600px)

**Purpose:** Adjusts layout, panel sizing, form column widths, and spacing for mobile screens.

| Element | Property | Mobile value | Desktop value |
|---|---|---|---|
| `.sapMPanelContent` | `padding` | `0 15px` | Default SAP padding |
| `.sapMPanel` | `width` | `98%` | `98%` |
| `.sapMTitle` | `overflow` | `initial` | Default clipped |
| `.sapMTitle` | `text-overflow` | `inherit` | Default ellipsis |
| Form cell `.sapUiFormCLCellsS6` | `width` | `50%` | `42%` |
| Form cell `.sapUiFormCLCellsS12` | `width` | `100%` | `84%` |
| Dialog scroll padding | `padding-inline-start` | `10px` | Default |
| Panel header height | `line-height / height` | `59px` | `59px` |
| `.btn-cancel` button hover | `background-color` | `transparent` | `transparent` |
| `.barButn .sapMBarRight` | `height` | `3rem` | — |
| Shell max width | `width` | `auto` | Auto |

---

> **End of §10 — HR Portal Component Styles**
> Source: `HR_Portal_CSS_1.txt`
> Applicable to: SAP Fiori · SAPUI5 · Neptune DXP applications only.
> Do NOT apply to standalone web apps or non-SAP frontends.
> Maintained by Abdulsamee — update this section when `HR_Portal_CSS_1.txt` is revised.

---

# §11 — Vendor Profile Update App — Component Styles & Design Decisions

> **App:** `com.dewa.srm.vendorvalidation`
> **Stack:** SAPUI5 1.136.0 · CDN · sap_horizon theme · JavaScript (not TypeScript — existing project)
> **CSS file:** `webapp/css/style.css` (versioned via `?v=N` query string in `index.html`)
> **Prefix:** `dewa-` for all custom classes · `--dp-*` for all CSS custom properties
> **Applicable to:** This app only — do NOT copy wholesale to other apps without token review.

---

## 11.1 Design Philosophy

The Vendor Profile Update app combines two visual zones:

| Zone | Color | Purpose |
|---|---|---|
| Sidebar | DEWA Primary Teal `#007560` (solid fill) | Navigation + identity — "DEWA corporate" |
| Content | White `#FFFFFF` | Forms, cards, data — "clean workspace" |

The contrast between the dark teal sidebar and bright white content area is the defining visual gesture of this app. All component decisions derive from this split.

**Key design rules:**
- No box shadows anywhere — borders only (`--dp-border: #D7D7DF`, `--dp-line: #EFEFF1`)
- Dubai Font for all text (DEWA official bilingual typeface)
- JetBrains Mono for all code-like values (IBAN, vendor ID, account numbers)
- All buttons are full-pill: `border-radius: 100px`
- All cards: `15px` radius · All dialogs: `20px` radius (hero containers) · Inputs: `5px` radius

---

## 11.2 CSS Token System (`:root` Variables)

All custom properties are defined in the `:root` block at the top of `style.css`.

### 11.2.1 DEWA Brand Green Palette

| Token | Value | Usage |
|---|---|---|
| `--dp-green-900` | `#001F18` | Deepest dark — rarely used |
| `--dp-green-800` | `#003528` | Dark variant |
| `--dp-green-700` | `#004D3C` | App bar background · AI processing text |
| `--dp-green-600` | `#004937` | Primary Variant — hover states, pressed buttons, source banner text |
| `--dp-green-500` | `#007560` | **Primary brand** — buttons, icons, selected states, AI panel header |
| `--dp-green-400` | `#27A28D` | Primary hover — button hover, upload icon |
| `--dp-green-300` | `#00C49A` | Sidebar neon accent (on dark bg) · Avatar background in app bar |
| `--dp-green-100` | `#D9EAE7` | Elevation fill / AI processing background |
| `--dp-green-50`  | `#E5F1EF` | Active Background — selected rows, upload filename row, chip hover |

### 11.2.2 Sidebar Tokens

| Token | Value | Usage |
|---|---|---|
| `--sidebar-bg` | `#007560` | Sidebar surface (same as brand primary) |
| `--sidebar-active` | `#FFFFFF` | Selected nav item pill background |
| `--sidebar-icon-def` | `#FFFFFF` | Default icon colour on dark bg |
| `--sidebar-text-def` | `rgba(255,255,255,0.90)` | Nav label colour on dark bg |
| `--sidebar-text-sel` | `#004937` | Selected item text (teal on white pill) |

### 11.2.3 Surfaces, Text, Borders

| Token | Value | Usage |
|---|---|---|
| `--dp-bg` | `#FFFFFF` | Page / content background |
| `--dp-bg-100` | `#F2F3F3` | Input field surface · AI result actions bg |
| `--dp-surface` | `#FFFFFF` | Card surface |
| `--dp-border` | `#D7D7DF` | Card border (Card Border-300) |
| `--dp-line` | `#EFEFF1` | Row dividers, subtle lines (Lines-200) |
| `--dp-text-900` | `#222222` | Primary text |
| `--dp-text-700` | `#222222` | High emphasis headings |
| `--dp-text-500` | `#6F6F6F` | Secondary / label text |
| `--dp-text-300` | `#BDBDBD` | Placeholder / muted / section label |
| `--dp-error` | `#B00020` | Error state |
| `--dp-shadow-sm` | `none` | No shadows — borders preferred |
| `--dp-shadow-md` | `none` | No shadows — borders preferred |

### 11.2.4 Radius Scale

| Token | Value | Applies To |
|---|---|---|
| `--dp-radius-input` | `5px` | All input fields, selects, date pickers |
| `--dp-radius-small` | `7px` | Tags, badges, tooltips, upload filename chip, source banners |
| `--dp-radius-card` | `15px` | Standard cards, AI panels, upload zone |
| `--dp-radius-hero` | `20px` | Dialogs, hero containers |
| `--dp-radius-button` | `100px` | ALL buttons — non-negotiable pill shape |

### 11.2.5 SAP Horizon Token Overrides

These override SAP's dynamic theme CSS with DEWA values:

```css
--sapButton_BorderCornerRadius: 100px;
--sapButton_Height: 3rem;                    /* 48px */
--sapBrandColor: #007560;
--sapHighlightColor: #007560;
--sapButton_Emphasized_Background: #007560;
--sapField_Background: #FFFFFF;
--sapField_BorderColor: #EFEFF1;
--sapField_Hover_BorderColor: #007560;
--sapField_Focus_BorderColor: #007560;
--sapField_BorderCornerRadius: 5px;
--sapTextColor: #222222;
--sapContent_LabelColor: #6F6F6F;
--sapContent_IconColor: #007560;
--sapFontFamily: 'Dubai', 'Segoe UI', system-ui, Arial, sans-serif;
```

---

## 11.3 App Bar

The app bar uses `--dp-green-700` (`#004D3C`) as its background — one shade darker than the sidebar primary `#007560`. This creates clear separation between app bar and sidebar without needing a border.

| Property | Value |
|---|---|
| Background | `#004D3C` (via `--dp-green-700`) |
| Height | `3.5rem` (56px) |
| Padding | `0 1.25rem` |
| Border | None |
| Box shadow | `0 2px 8px rgba(0,0,0,0.25)` |

### Classes

| Class | Purpose |
|---|---|
| `.dewa-app-bar` | Apply to `sap.m.Bar` — sets background, height, shadow |
| `.dewa-app-bar-brand` | HBox wrapping logo + title text |
| `.dewa-app-bar-logo` | `2.25rem × 2.25rem` box — `rgba(255,255,255,0.18)` bg, `7px` radius, white text |
| `.dewa-app-bar-title` | White, `0.9375rem`, weight 600, letterSpacing 0.01em |
| `.dewa-app-bar-subtitle` | `rgba(255,255,255,0.55)`, `0.75rem`, left-border separator |
| `.dewa-app-bar-icon` | Transparent icon buttons — circular hover `rgba(255,255,255,0.12)` |
| `.dewa-app-bar-avatar` | Avatar initials bg `--dp-green-300` (#00C49A), text `--dp-green-900` |

---

## 11.4 Sidebar

The sidebar is a full-height VBox with:
- Background: `#007560` (DEWA Primary) — forced via `!important` to override SAP Horizon theme
- No border, no shadow
- Width transition: `0.22s cubic-bezier(0.4, 0, 0.2, 1)` for collapse/expand animation
- Contains: profile block → nav group label → `sap.tnt.SideNavigation` → footer

```css
.dewa-sidebar {
  background: #007560 !important;
  border-right: none !important;
  box-shadow: none !important;
  transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 11.4.1 Sidebar Profile Block — Expanded

The profile block sits at the top of the sidebar above navigation. In expanded mode (`sidebarExpanded = true`) it shows the full avatar + name + vendor ID + Active badge.

| Element | Class | Detail |
|---|---|---|
| Outer VBox | `.dewa-sidebar-profile` | `padding: 0.75rem 1.25rem 1.5rem` · `border-bottom: 1px solid rgba(255,255,255,0.10)` |
| Avatar wrapper | `.dewa-sidebar-avatar-container` | `position: relative` · has `::after` status dot |
| Avatar | `.dewa-sidebar-avatar` | `4rem × 4rem` · `border-radius: 50%` · initials bg `rgba(255,255,255,0.18)` |
| Status dot | `.dewa-sidebar-avatar-container::after` | `0.75rem` circle · `#22C55E` green · `border: 2px solid var(--sidebar-bg)` for cutout effect |
| Name | `.dewa-sidebar-name` | White · `1rem` · weight 700 |
| Vendor ID | `.dewa-sidebar-id` | `rgba(255,255,255,0.55)` · `0.75rem` · **JetBrains Mono** |
| Active badge | `.dewa-sidebar-badge` | `border: 1.5px solid rgba(255,255,255,0.35)` · `100px` radius pill · green check icon (`#22C55E`) |

### 11.4.2 Sidebar Profile Block — Collapsed

When `sidebarExpanded = false`, the outer VBox class expression switches to `dewa-sidebar-profile dewa-sidebar-profile--collapsed`. The text children (name, vendor ID, badge) have `visible="{vendor>/sidebarExpanded}"` — they hide individually. Only the avatar remains.

The sidebar is `3.5rem` (56px) wide when collapsed — the avatar must shrink to fit.

```css
.dewa-sidebar-profile--collapsed {
  padding: 0.5rem 0.5rem 0.625rem !important;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}
.dewa-sidebar-profile--collapsed .dewa-sidebar-avatar {
  width: 2rem !important;
  height: 2rem !important;
}
.dewa-sidebar-profile--collapsed .dewa-sidebar-avatar .sapFAvatarInitialsHolder {
  font-size: 0.6875rem !important;
}
.dewa-sidebar-profile--collapsed .dewa-sidebar-avatar-container::after {
  width: 0.5rem !important;
  height: 0.5rem !important;
  bottom: 0px !important;
  right: 0px !important;
}
```

**XML binding pattern:**
```xml
<VBox alignItems="Center"
      class="{= ${vendor>/sidebarExpanded}
                ? 'dewa-sidebar-profile'
                : 'dewa-sidebar-profile dewa-sidebar-profile--collapsed' }">
  <HBox class="dewa-sidebar-avatar-container" justifyContent="Center" alignItems="Center">
    <Avatar initials="VP" displaySize="L" class="dewa-sidebar-avatar" />
  </HBox>
  <Title ... visible="{vendor>/sidebarExpanded}" />
  <Text  ... visible="{vendor>/sidebarExpanded}" />
  <HBox  class="dewa-sidebar-badge" visible="{vendor>/sidebarExpanded}">...</HBox>
</VBox>
```

### 11.4.3 Navigation Items (sap.tnt.SideNavigation)

Use `.dewa-tnt-sidenav` on the `SideNavigation` control. SAP renders real class names in UI5 1.136: `.sapTntNLI`, `.sapTntNLISelected`, `.sapTntNLIText`, `.sapTntNLIIcon`.

| State | Visual |
|---|---|
| Default | Transparent bg · white icon + text |
| Hover | Transparent (no hover background) |
| Selected | White pill `#FFFFFF` · icon teal `#007560` · text teal bold · rounded left `23px 0 0 23px` · no right margin (bleeds to sidebar edge) |
| Focus | All outlines and focus rings suppressed (sidebar on dark bg — no focus ring needed) |

**Selected item tab effect:**
```css
.dewa-tnt-sidenav .sapTntNLI.sapTntNLISelected {
  background: #FFFFFF !important;
  border-radius: 23px 0 0 23px !important;
  margin: 3px 0 3px 0.875rem !important;  /* no right margin — bleeds flush to edge */
}
```

**Nav item text — no wrapping:**
```css
.dewa-tnt-sidenav .sapTntNLI .sapTntNLIText {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
```

**Nav group label** (section header above nav items):
```css
.dewa-nav-group-label {
  color: rgba(255,255,255,0.40);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 1.125rem 1.75rem 0.375rem;
}
```

---

## 11.5 Card Component

Cards replace SAP Panels. No shadows — border only.

```css
.dewa-card {
  background: #FFFFFF;
  border-radius: 15px;        /* --dp-radius-card */
  border: 1px solid #D7D7DF;  /* --dp-border */
  margin-bottom: 1.25rem;
  overflow: hidden;
}
```

### Card Header

```css
.dewa-card-header {
  padding: 1.125rem 1.5rem;
  border-bottom: 1px solid #EFEFF1;  /* --dp-line */
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
```

**When the header has both an icon+title AND a right-side button**, wrap the icon+title group in `.dewa-card-header-left`:
```css
.dewa-card-header-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
```
> ⚠️ Do NOT apply `flex: 1` directly to the icon VBox — it causes the icon to stretch full width.

**Card header icon** (`.dewa-card-header-icon`):
- `2.25rem × 2.25rem` · `border-radius: 10px` · `background: #007560` · white icon inside

| Class | Role |
|---|---|
| `.dewa-card-header` | Header row — flex, gap, bottom border |
| `.dewa-card-header-left` | Inner wrapper when button is on the right |
| `.dewa-card-header-icon` | Teal square icon container |
| `.dewa-card-title` | `0.9375rem` · weight 600 · `--dp-text-900` |
| `.dewa-card-body` | `1.5rem` padding |
| `.dewa-card-body--tight` | `1rem 1.5rem` padding variant |
| `.dewa-sub-label` | Section sub-header inside card — uppercase, muted, `0.6875rem` |

---

## 11.6 Form Fields

All form fields use a flat white surface with a subtle structural border.

| Property | Value | Source |
|---|---|---|
| Background | `#FFFFFF` | DESIGN.md Form Masterclass |
| Border | `1px solid #EFEFF1` | Lines-200 |
| Border radius | `5px` | `--dp-radius-input` |
| Height | `3rem` (48px) | Matches button height for inline alignment |
| Focus | Teal border `#007560` — `--sapField_Focus_BorderColor` |

**Labels:**
```css
.sapMLabel {
  color: #6F6F6F;         /* --dp-text-500 */
  font-size: 0.875rem;
  font-weight: 400;
  margin-bottom: 0.25rem;
}
```

**Field hint** (informational note below a field):
```css
.dewa-field-hint {
  color: #BDBDBD;
  font-size: 0.75rem;
}
.dewa-field-hint::before {
  /* Circular "i" icon — 14px · border: 1.5px solid #27A28D */
}
```

**Monospace fields** (IBAN, account numbers, vendor IDs):
```css
.dewa-mono { font-family: 'JetBrains Mono','Courier New',monospace; letter-spacing: 0.04em; }
```

**Footer button row:**
```css
.dewa-form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem 0 2rem 0;
  border-top: 1px solid #EFEFF1;  /* --dp-line */
  margin-top: 1.5rem;
}
```

---

## 11.7 Buttons

All buttons use `border-radius: 100px` (full pill). Selectors prefixed with `body#content` for maximum specificity over SAP Horizon dynamic theme CSS.

| Type | Background | Border | Text |
|---|---|---|---|
| Primary (Emphasized) | `#007560` | `#007560` | `#FFFFFF` |
| Primary Hover | `#27A28D` | `#27A28D` | `#FFFFFF` |
| Primary Active | `#004937` | `#004937` | `#FFFFFF` |
| Secondary (Default) | `#FFFFFF` | `1px solid #222222` | `#222222` |
| Secondary Hover | `#F2F3F3` | `#222222` | `#222222` |
| Tertiary (Transparent) | `transparent` | none | `#222222` |
| Tertiary Hover | `#E5F1EF` | none | `#007560` |

**Height:** All buttons `3rem` (48px). SAP compact density tries to override — suppressed via:
```css
.sapUiSizeCompact .sapMBtn { height: 3rem !important; min-height: 3rem !important; }
```

---

## 11.8 Tables (`.dewa-table`)

```css
.dewa-table { border-radius: 0 0 12px 12px; overflow: hidden; }
```

| Element | Style |
|---|---|
| Header cells | `background: #F5F8F7` · weight 700 · uppercase · `letter-spacing: 0.06em` · `border-bottom: 2px solid #D7D7DF` |
| Body cells | `padding: 0.875rem 1rem` · `border-bottom: 1px solid #EFEFF1` |
| Row hover | `background: #E5F1EF` (`--dp-green-50` — DEWA Active Background) |
| No data text | `color: #BDBDBD` · `padding: 2.5rem` |

---

## 11.9 Status Badges (`.dewa-badge`)

Inline pill badges. Base: `border-radius: 100px` · `font-size: 0.6875rem` · weight 700 · uppercase.

| Modifier | Background | Text |
|---|---|---|
| `.dewa-badge--success` | `#D1FAE5` | `#065F46` |
| `.dewa-badge--warning` | `#FEF3C7` | `#92400E` |
| `.dewa-badge--error` | `#FEE2E2` | `#991B1B` |

---

## 11.10 AI Upload Zone (`.dewa-upload-zone`)

The document upload area uses a dashed border to signal a drop target.

```css
.dewa-upload-zone {
  border: 2px dashed #BFD8D3;
  border-radius: 15px;         /* --dp-radius-card */
  background: #F2F3F3;         /* --dp-bg-100 */
  padding: 2rem;
  text-align: center;
}
.dewa-upload-zone:hover {
  border-color: #007560;
  background: #E5F1EF;         /* --dp-green-50 */
}
```

**Uploaded filename row** (`.dewa-upload-filename-row`):
- Background: `#E5F1EF` · border: `1px solid #EFEFF1` · `border-radius: 7px`
- Hover: `background: #D1EAE4` · `border-color: #27A28D` (deeper teal tint signals popover available)
- Used as the hover target for the File Preview Popover

---

## 11.11 AI Result Panel (`.dewa-ai-result`)

Displays AI-extracted bank account fields after document upload.

```css
.dewa-ai-result {
  background: #FFFFFF;
  border: 1px solid #D7D7DF;
  border-radius: 15px;
  overflow: hidden;
}
```

**Header** (`.dewa-ai-result-header`):
- `background: linear-gradient(135deg, #007560 0%, #009B7A 100%)`
- Contains: AI icon · "AI Extracted Data" title (white) · confidence pill badge

**Confidence badge** (`.dewa-ai-confidence`):
- `background: rgba(255,255,255,0.22)` · `border: 1px solid rgba(255,255,255,0.4)` · white text · `100px` radius

**Field rows** (`.dewa-ai-field-row`):
- Flex row · label left · value right-aligned · `border-bottom: 1px solid #EFEFF1`
- IBAN value: add `.is-mono` to value text for JetBrains Mono rendering

**Actions strip** (`.dewa-ai-result-actions`):
- `background: #F2F3F3` · top border · contains "Apply to Form" button

**AI Processing state** (`.dewa-ai-processing`):
- `background: #D9EAE7` (`--dp-green-100`) · pulsing green icon animation `dewa-pulse`

---

## 11.12 File Preview Hover Popover (`.dewa-fp-popover`)

A `sap.m.Popover` that appears when hovering over the uploaded filename row. Opens via jQuery event delegation on the dialog DOM — only appears after `aiDone === true` (guard prevents empty state).

**Important implementation note:** All CSS classes must be applied via `.addStyleClass()` chains — NOT via `class:` in constructor settings. SAP UI5 does not reliably process `class:` in programmatic control creation.

```css
.dewa-fp-popover {
  border-radius: 10px !important;
  overflow: hidden !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
}
.dewa-fp-popover .sapMPopoverCont {
  padding: 0 !important;
  overflow: hidden !important;
}
```

### Structure

| Class | Element | Visual |
|---|---|---|
| `.dewa-fp-header` | Top bar HBox | `linear-gradient(135deg, #007560 0%, #005a49 100%)` · `0.75rem 1rem` padding |
| `.dewa-fp-heading` | Title Text | White · `0.875rem` · weight 700 |
| `.dewa-fp-badge` | "AI Verified" pill | `rgba(255,255,255,0.20)` bg · white border · `100px` radius |
| `.dewa-fp-body` | Content VBox | White background |
| `.dewa-fp-cell` | Each field cell | `0.75rem 1rem` padding · flex-column · `flex: 1` |
| `.dewa-fp-cell--bordered` | Right cell in 2-col row | `border-left: 1px solid #EFEFF1` |
| `.dewa-fp-cell--full` | Full-width cell (IBAN row) | Spans both columns |
| `.dewa-fp-line` | Row divider | `1px` · `#EFEFF1` |
| `.dewa-fp-cell .sapMLabel` | Field label | `0.625rem` · uppercase · `letter-spacing: 0.08em` · `#BDBDBD` |
| `.dewa-fp-cell .sapMText` | Field value | `0.875rem` · weight 500 · `#222222` |
| `.dewa-fp-iban` | IBAN value Text | `0.8125rem` · `#004937` · `letter-spacing: 0.02em` |

**Layout pattern (2-col top row + 1 full-width IBAN row):**
```
┌─────────────────────────────────┐
│ 🏦 AI Extracted Data  AI Verified│  ← .dewa-fp-header (green gradient)
├──────────────┬──────────────────┤
│ BANK NAME    │ ACCOUNT HOLDER   │  ← HBox with 2 × .dewa-fp-cell
│ ADCB         │ Mohammad Al-H... │
├──────────────────────────────────┤  ← .dewa-fp-line divider
│ ACCOUNT / IBAN (full width)      │  ← .dewa-fp-cell--full
│ AE070331234567890123456          │
└──────────────────────────────────┘
```

---

## 11.13 Add Bank Account Dialog

The dialog uses `sap.m.Dialog` with custom class `.dewa-dialog` on the dialog control.

```css
.dewa-dialog.sapMDialog {
  border-radius: 20px !important;   /* --dp-radius-hero */
  border: 1px solid #D7D7DF !important;
  box-shadow: none !important;
}
```

**Section labels** (numbered headers like "① DOCUMENT UPLOAD"):
```css
.dewa-dialog-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #BDBDBD;           /* --dp-text-300 */
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-top: 1.25rem;
  border-top: 1px solid #D7D7DF;
}
.dewa-dialog-section-label:first-child {
  padding-top: 0;
  border-top: none;
}
```

**Dialog body** (`.dewa-dialog-body`): `padding: 1.5rem` — removed SAP's default scroll padding.

**Fragment implementation note:** Fragment loaded with `Fragment.load()` (no `id:` prefix) to prevent duplicate-ID crashes. Dialog stored as `this._oDialog` direct reference. FileUploader stored as `this._oFileUploader` via `findElements(true)` filter.

---

## 11.14 Source Banners (Data Origin Indicators)

Banners appear above the form fields to indicate whether data was AI-extracted or manually entered.

```css
.dewa-source-banner {
  border-radius: 7px;     /* --dp-radius-small */
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
}
```

| Variant | Class | Background | Border | Icon Color | Title Color |
|---|---|---|---|---|---|
| AI Assisted | `.dewa-source-banner--ai` | `#E5F1EF` | `1px solid #EFEFF1` | `#007560` | `#004D3C` |
| Manual Entry | `.dewa-source-banner--manual` | `#F2F3F3` | `1px solid #D7D7DF` | `#6B7280` | `#374151` |

Inner elements: `.dewa-source-banner-icon` · `.dewa-source-banner-text` (flex:1) · `.dewa-source-banner-title` · `.dewa-source-banner-sub` · `.dewa-source-banner-btn` (underlined action link).

---

## 11.15 CSS Versioning Strategy

The CSS file is cache-busted via a query string version number in `index.html`:

```html
<link rel="stylesheet" href="css/style.css?v=N" />
```

**Rule:** Increment `?v=N` on **every** CSS change before testing in the browser. SAP UI5 CDN apps load in the browser's HTTP cache — without the version bump, changes will not be visible even after a normal refresh.

**History:**
- v=26: File preview popover styles (`dewa-fp-*`)
- v=27: Popover CSS classes — switched from `class:` to `.addStyleClass()` in controller
- v=28: Sidebar profile top padding reduced (`1.75rem` → `0.75rem`)
- v=29: Collapsed sidebar profile — avatar visible, text hidden; `.dewa-sidebar-profile--collapsed` CSS added
- v=30: Collapsed avatar left/right padding (`0.5rem 0` → `0.5rem 0.5rem`)

---

## 11.16 CSS Class Naming Reference

All custom classes use the `dewa-` prefix. Full list of significant classes:

### Layout & Shell
| Class | Element |
|---|---|
| `.dewa-root-page` | Root `sap.m.Page` shell |
| `.dewa-body` | Content body VBox |
| `.dewa-sidebar` | Sidebar container VBox |
| `.dewa-main-content` | Main content HBox |
| `.dewa-content-page` | Inner `sap.m.Page` for content screens |
| `.dewa-content-wrap` | Inner content padding wrapper |

### App Bar
| Class | Element |
|---|---|
| `.dewa-app-bar` | `sap.m.Bar` header |
| `.dewa-app-bar-brand` | Logo + title HBox |
| `.dewa-app-bar-logo` | Logo box VBox |
| `.dewa-app-bar-title` | App title Text |
| `.dewa-app-bar-subtitle` | Subtitle Text (left-border separated) |
| `.dewa-app-bar-icon` | Transparent icon buttons |
| `.dewa-app-bar-avatar` | User Avatar |

### Sidebar
| Class | Element |
|---|---|
| `.dewa-sidebar-profile` | Profile block VBox (expanded state) |
| `.dewa-sidebar-profile--collapsed` | BEM modifier — avatar-only collapsed state |
| `.dewa-sidebar-avatar-container` | Avatar HBox (provides status dot via `::after`) |
| `.dewa-sidebar-avatar` | `sap.f.Avatar` |
| `.dewa-sidebar-name` | Vendor name Title |
| `.dewa-sidebar-id` | Vendor ID Text (JetBrains Mono) |
| `.dewa-sidebar-badge` | Active badge HBox |
| `.dewa-tnt-sidenav` | `sap.tnt.SideNavigation` |
| `.dewa-nav-group-label` | Section label Text above nav |
| `.dewa-sidebar-footer` | Bottom footer VBox |

### Cards
| Class | Element |
|---|---|
| `.dewa-card` | Standard card VBox |
| `.dewa-card-header` | Card header HBox |
| `.dewa-card-header-left` | Inner HBox wrapping icon+title when button present |
| `.dewa-card-header-icon` | Teal icon container VBox |
| `.dewa-card-title` | Card title Title control |
| `.dewa-card-body` | Card body padding VBox |
| `.dewa-sub-label` | Section sub-header Text |

### Forms
| Class | Element |
|---|---|
| `.dewa-form` | SimpleForm or Form wrapper |
| `.dewa-form-footer` | Footer button row HBox |
| `.dewa-field-hint` | Below-field hint Text |
| `.dewa-mono` | JetBrains Mono text (IBAN, IDs) |
| `.dewa-divider` | Horizontal rule `<div>` |
| `.dewa-inline-label` | Smaller label variant |

### AI & Upload
| Class | Element |
|---|---|
| `.dewa-upload-zone` | Drop zone VBox |
| `.dewa-upload-icon` | Upload cloud Icon |
| `.dewa-upload-title` | "Drag & drop" Text |
| `.dewa-upload-hint` | File type hint Text |
| `.dewa-upload-filename-row` | Uploaded file row HBox (hover target) |
| `.dewa-ai-processing` | Processing state VBox |
| `.dewa-ai-icon` | Pulsing green circle VBox |
| `.dewa-ai-result` | AI results panel VBox |
| `.dewa-ai-result-header` | Green gradient header HBox |
| `.dewa-ai-result-title` | "AI Extracted Data" Text |
| `.dewa-ai-confidence` | Confidence pill badge Text |
| `.dewa-ai-fields` | Fields grid VBox |
| `.dewa-ai-field-row` | Label+value row HBox |
| `.dewa-ai-field-label` | Field label Text |
| `.dewa-ai-field-value` | Field value Text |
| `.dewa-ai-result-actions` | Apply button strip HBox |

### File Preview Popover
| Class | Element |
|---|---|
| `.dewa-fp-popover` | `sap.m.Popover` root |
| `.dewa-fp-header` | Green gradient header HBox |
| `.dewa-fp-heading` | "AI Extracted Data" Text |
| `.dewa-fp-badge` | "AI Verified" pill Text |
| `.dewa-fp-body` | White content VBox |
| `.dewa-fp-cell` | Individual field VBox |
| `.dewa-fp-cell--bordered` | Right-column cell with left border |
| `.dewa-fp-cell--full` | Full-width IBAN cell |
| `.dewa-fp-line` | Row divider VBox (`height: 1px`) |
| `.dewa-fp-iban` | IBAN value Text (green mono) |

### Dialog
| Class | Element |
|---|---|
| `.dewa-dialog` | `sap.m.Dialog` |
| `.dewa-dialog-body` | Dialog body VBox |
| `.dewa-dialog-section-label` | Numbered section header Text |

### Source Banners
| Class | Element |
|---|---|
| `.dewa-source-banner` | Base banner HBox |
| `.dewa-source-banner--ai` | AI variant (green tint) |
| `.dewa-source-banner--manual` | Manual variant (grey) |
| `.dewa-source-banner-icon` | Leading Icon |
| `.dewa-source-banner-text` | Text group VBox |
| `.dewa-source-banner-title` | Banner title Text |
| `.dewa-source-banner-sub` | Banner subtitle Text |
| `.dewa-source-banner-btn` | Action link Button |

### Tables & Badges
| Class | Element |
|---|---|
| `.dewa-table` | `sap.m.Table` |
| `.dewa-badge` | Base status badge |
| `.dewa-badge--success` | Green badge |
| `.dewa-badge--warning` | Amber badge |
| `.dewa-badge--error` | Red badge |
| `.dewa-block-row` | Block/Unblock toggle row |
| `.dewa-page-title` | Page H1 Title |
| `.dewa-page-subtitle` | Page sub-heading Text |

---

> **End of §11 — Vendor Profile Update App Component Styles**
> App: `com.dewa.srm.vendorvalidation`
> CSS: `webapp/css/style.css` · current version: `v=30`
> Maintained by Abdulsamee — increment the version comment above when style.css is updated.
> Last updated: May 2026 (collapsed sidebar profile, file preview popover, source banners, card header fix)


---

## 11. Canonical SAPUI5 Component Patterns

### 11.1 Primary Button Pattern

```xml
<Button
    text="{i18n>BUTTON_SUBMIT}"
    class="dewaPrimaryButton"
    ariaLabel="{i18n>ARIA_BUTTON_SUBMIT}" />
```

```css
#app .sapMPageContent .dewaPrimaryButton .sapMBtnInner {
    background-color: #007560;
    border-radius: 100px;
    min-height: 48px;
    padding-inline: 24px;
    border: none;
    color: #FFFFFF;
}
```

### 11.2 Secondary Button Pattern

```css
#app .sapMPageContent .dewaSecondaryButton .sapMBtnInner {
    background-color: #FFFFFF;
    border: 1px solid #222222;
    border-radius: 100px;
    min-height: 48px;
}
```
### 11.3 Focus & Interaction State System

Focus states must:
- remain accessibility compliant
- avoid default SAP Horizon blue outlines
- preserve keyboard navigation visibility
- use DEWA semantic focus styling

Never:
- use browser-native outlines
- remove focus states without replacement
- mix Horizon blue focus colors with DEWA branding

Approved SAPUI5-safe focus pattern:

```css
#app .dewaPrimaryButton .sapMBtnInner:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0,117,96,0.25);
}

#app .sapMInputBaseInner:focus {
    outline: none;
    border: 2px solid #007560;
}
```
# Updated Input Tokens

- input-field-focus-style: border-color + subtle shadow
- input-field-border-width-active: 1px
Never increase border width during focus state.

Focus indication must use:
- border-color
- subtle shadow
- semantic glow

to avoid SAPUI5 layout clipping issues.

```

### 11.4 Standard Table Hover Pattern

```css
#app .sapMListTblRow:hover {
    background-color: #E5F1EF;
}
```

### 11.5 Standard DEWA Card Pattern

```css
#app .dewaCard {
    background-color: #FFFFFF;
    border: 1px solid #D7D7DF;
    border-radius: 15px;
    padding: 24px;
}
```

### 11.6 File Upload Components

All upload actions must:
- follow DEWA primary button styling
- avoid browser-native file upload appearance
- support focus accessibility
- support drag/drop consistency
- remain FLP-safe

```

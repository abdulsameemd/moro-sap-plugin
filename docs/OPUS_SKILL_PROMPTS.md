# DEWA SAP Agentic Framework — Opus Skill Generation Prompts
## Why only 2 skills need Opus

| Skill | Needs Opus? | Why |
|---|---|---|
| `moro-design` | ✅ Yes | Claude Design needs a formal SKILL.md to load DEWA tokens automatically |
| `prototype-export` | ❌ No | Already implemented as dewa-handoff-watch.js (Node.js) — working today |
| `moro-code-review` | ✅ Yes | Claude Code needs a formal SKILL.md to trigger review automatically after Stage 6 |
| `dewa-ts-autogen` | ❌ No | Already implemented — Claude reads TS_TEMPLATE.md and follows it |

## How to use this document

Open Claude Opus 4 at claude.ai. For each skill below:
1. Copy the full prompt block
2. Paste into Opus
3. Review the generated SKILL.md
4. Iterate — ask Opus to adjust until output is correct
5. Save as a folder: `.claude/skills/skill-name/SKILL.md`

Place both skill folders here:
```
dewa-project/
└── .claude/
    └── skills/
        ├── moro-design/
        └── moro-code-review/
```

---

# SKILL 1 — moro-design

## Paste this into Opus:

```
You are helping me create an agentskills.io-compliant SKILL.md file.

Reference the agentskills.io specification:
- Spec: https://agentskills.io/specification.md
- Best practices: https://agentskills.io/skill-creation/best-practices.md

ABOUT AGENTSKILLS.IO FORMAT:
A skill is a folder with a SKILL.md file containing YAML frontmatter + markdown body.
Required frontmatter fields: name (lowercase, hyphens only, max 64 chars) + description (max 1024 chars, what it does + when to use it).
Optional: license, compatibility, metadata, allowed-tools.
Keep SKILL.md under 500 lines. Move reference detail to references/ folder.
Progressive disclosure: name+description load at startup (~100 tokens). Full body loads on activation. References load on demand.

WHAT THIS SKILL CAPTURES:
This skill encodes DEWA's human knowledge of how to design SAP Fiori applications.
It is NOT about generic SAP Fiori design — it encodes the specific DEWA design system,
DEWA token values, DEWA screen patterns, and how DEWA bridges design to development.

DOMAIN KNOWLEDGE TO ENCODE (from DEWA DESIGN.md):
- Primary green: #007560 | Variant: #004937 | Hover: #27A28D
- Active BG: #E5F1EF | Hero Fill: #D9EAE7 | Error: #B00020 | Alert: #FFC600 (NOT buttons)
- Text Primary: #222222 | Text Secondary: #6F6F6F
- Border radius: 5px inputs | 15px cards | 20px hero | 100px buttons (.sapMPageContent only)
- Font: Dubai (local @font-face only — never CDN)
- Criticality 3=green (#007560) | 2=amber (#FFC600) | 1=red (#B00020) | 0=grey (#6F6F6F)
- All layouts must support Arabic RTL — use logical CSS properties (margin-inline-start not margin-left)
- Screens to always generate: List Report | Object Page | Create form | Edit form | Mobile | RTL

SKILL BEHAVIOUR:
- Trigger: developer selects DEWA design system in Claude Design and provides app requirement
- Always apply all DEWA tokens automatically — never ask developer for color values
- Always generate all 6 screen types unless developer explicitly says otherwise
- Validate all hex values against approved list before output
- Flag any token violation immediately with the correct replacement

GOTCHAS (things Claude gets wrong without this skill):
- Never use #FF0000 or any non-DEWA red — always #B00020
- Never use border-left/right for layout — use border-inline-start/end for RTL support
- Never import Dubai font from CDN — local @font-face only
- Alert amber (#FFC600) is for alerts/status only — never use on action buttons
- The 100px button radius applies ONLY inside .sapMPageContent — not globally
- criticality property values must be numbers (0/1/2/3) not strings

INVOCATION TYPE: Invoked (developer explicitly selects DEWA design system)
RISK: Low — no write operations to SAP at this stage
LLM: Claude Sonnet 4 (design generation)

Please generate:
1. A complete SKILL.md with proper YAML frontmatter and markdown body
2. A references/ folder structure with: TOKENS.md (all hex values) and SCREENS.md (screen checklist)
3. An assets/ folder structure with: token-map.json

Follow agentskills.io best practices:
- Description must say what it does AND when to use it
- Body should focus on what Claude would not know without the skill (DEWA-specific, not generic SAP)
- Include a Gotchas section
- Include a validation checklist
- Keep SKILL.md under 500 lines — move token reference detail to references/TOKENS.md
```

---

# SKILL 2 — moro-code-review

## Paste this into Opus:

```
You are helping me create an agentskills.io-compliant SKILL.md file.

Reference the agentskills.io specification:
- Spec: https://agentskills.io/specification.md
- Best practices: https://agentskills.io/skill-creation/best-practices.md

ABOUT AGENTSKILLS.IO FORMAT:
A skill is a folder with a SKILL.md file containing YAML frontmatter + markdown body.
Required frontmatter fields: name + description.
This skill has references/ — detailed check lists go there, loaded on demand.
Keep SKILL.md under 500 lines.
Invocation type: Always-on (fires automatically after Stage 6, not invoked by developer).

WHAT THIS SKILL CAPTURES:
This skill encodes DEWA's human knowledge of how to review SAP code.
It captures the specific DEWA ABAP patterns, frontend checklist, auto-fix safety
boundaries, and governance gate that DEWA's SAP Centre of Excellence uses.
It is NOT generic SAP code review — it is DEWA's specific review methodology.

DOMAIN KNOWLEDGE TO ENCODE:

FRONTEND CHECKS (23 checks — C=CSS, V=View, T=Controller, I=i18n):
CSS (C1-C6):
- C1: All selectors must be scoped under #app — never global .sapMList
- C2: No hardcoded hex values — only CSS variables from DESIGN.md
- C3: No physical CSS (margin-left/right) — use logical (margin-inline-start/end)
- C4: Dubai font via local @font-face only — never CDN @import
- C5: No !important overrides except documented exceptions
- C6: No z-index above 10 without comment explaining why

Views (V1-V7):
- V1: Every text must use i18n binding {i18n>KEY} — no hardcoded strings
- V2: No sap.ui.commons controls — only sap.m and sap.f
- V3: OData property bindings must include type:
- V4: Every interactive control needs aria-label or labelFor
- V5: No SimpleForm — use Form with ColumnLayout only
- V6: ObjectStatus criticality must be numeric (0/1/2/3) not string
- V7: All images need alt text

Controllers (T1-T7):
- T1: No document.getElementById or jQuery DOM manipulation
- T2: Navigation must use this.getRouter().navTo()
- T3: Fragments must use Fragment.load() — no sap.ui.xmlfragment()
- T4: Every backend call needs .catch() error handler
- T5: No hardcoded system URLs — use manifest.json dataSources
- T6: OData calls must use .create()/.read()/.update() — no jQuery.ajax()
- T7: Event handlers must be cleaned up in onExit()

i18n (I1-I3):
- I1: Every key in i18n_en.properties must exist in i18n_ar.properties
- I2: Key naming: SCREEN_ELEMENT_TYPE (e.g. LIST_VENDOR_TITLE)
- I3: No raw i18n keys visible in UI — all must resolve

BACKEND CHECKS:
PERF patterns (auto-fix safe: PERF-01 to PERF-07, flag only: PERF-08):
- PERF-01: SELECT * → SELECT field1 field2 field3
- PERF-02: SELECT inside loop → single SELECT with IN list
- PERF-03: LOOP with READ TABLE linear → sorted table with binary search
- PERF-04: STRING concatenation in loop → string buffer pattern
- PERF-05: Redundant CLEAR in method start → remove
- PERF-06: DESCRIBE TABLE for count → lines( table )
- PERF-07: MOVE-CORRESPONDING → VALUE #( BASE ... )
- PERF-08: N+1 OData calls in loop → FLAG ONLY, needs developer decision

STY patterns (auto-fix safe: STY-01 to STY-10 + STY-12 + STY-13, flag only: STY-11):
- STY-01: CREATE OBJECT → NEW #( )
- STY-02: CALL METHOD → direct method call syntax
- STY-03: CATCH cx_root silent → add MESSAGE e001(ZFI) IN UPDATE TASK
- STY-04: READ TABLE without TRANSPORTING NO FIELDS → add it
- STY-05: FIELD-SYMBOL without TYPE → add TYPE REF TO data
- STY-06: DATA declaration mid-method → move to top of method
- STY-07: IF ... ENDIF with single RETURN → guard clause pattern
- STY-08: Nested IF depth > 3 → extract to method
- STY-09: Magic numbers → named constants
- STY-10: TYPES in method → move to class types section
- STY-11: Complex refactor impacting multiple methods → FLAG ONLY
- STY-12: Missing FINAL on local variables → add FINAL
- STY-13: Missing READ-ONLY on class attributes → add READ-ONLY

AUTO-FIX SAFETY RULES (critical):
- ONLY auto-fix PERF-01 to PERF-07 and STY-01 to STY-10 + STY-12 + STY-13
- NEVER auto-fix PERF-08 or STY-11 — these require developer decision
- After every auto-fix: run syntaxCheck via abap-mcp-server
- If syntaxCheck fails: REVERT the fix immediately, flag for developer
- Run runAtcCheck after all auto-fixes — must return 0 violations before proceeding

GOVERNANCE GATE (non-negotiable):
- Save combined review to /docs/review_report.md
- HARD STOP — do not generate TS without developer typing CONFIRM REVIEW
- No bypass exists for this gate

GOTCHAS:
- Never auto-fix PERF-08 — the N+1 pattern is context-dependent
- Never auto-fix STY-11 — refactor scope is unknown
- Always revert if syntaxCheck fails — do not proceed with broken code
- I1 must verify BOTH language files — not just EN
- V6 criticality: value 0 is valid (neutral) — do not flag as missing

INVOCATION TYPE: Always-on (fires automatically after $metadata verified in Stage 6)
RISK: Medium (auto-fix modifies ABAP source in SAP via abap-mcp-server)
ALLOWED TOOLS: abap-mcp-server (reviewAbapCode, runAtcCheck, syntaxCheck, writeObjectSource)

Please generate:
1. Complete SKILL.md with YAML frontmatter and markdown body
2. references/FRONTEND-CHECKS.md — full 23-check list
3. references/BACKEND-CHECKS.md — full PERF + STY pattern list with examples
4. assets/review-report-template.md — the review_report.md output template

Follow agentskills.io best practices:
- Description: what it reviews, what tools it uses, when it fires
- Body: invocation condition, gate, auto-fix safety rules, gotchas
- Move full check lists to references/ — load when review starts
- Validation loop: auto-fix → syntaxCheck → if fail revert → ATC → if fail block
- Keep SKILL.md under 500 lines
```

---

## After Opus generates each skill — iteration checklist

For each output from Opus, verify before saving:

- [ ] `name` field: lowercase, hyphens only, no consecutive hyphens, matches folder name
- [ ] `description`: says what AND when, under 1024 chars
- [ ] Body under 500 lines
- [ ] Gotchas section present
- [ ] File references use relative paths: `references/TOKENS.md` not absolute
- [ ] Nothing generic — everything is DEWA-specific
- [ ] Detail in references/, core flow in SKILL.md

## Folder structure after Opus session

```
dewa-project/
└── .claude/
    └── skills/
        ├── moro-design/
        │   ├── SKILL.md
        │   ├── references/
        │   │   ├── TOKENS.md
        │   │   └── SCREENS.md
        │   └── assets/
        │       └── token-map.json
        │
        └── moro-code-review/
            ├── SKILL.md
            ├── references/
            │   ├── FRONTEND-CHECKS.md
            │   └── BACKEND-CHECKS.md
            └── assets/
                └── review-report-template.md
```

## Validate after creation

```bash
npx skills-ref validate .claude/skills/moro-design
npx skills-ref validate .claude/skills/moro-code-review
```

## What the other 2 skills already are

| Skill | Status | Location |
|---|---|---|
| `prototype-export` | ✅ Working today | `scripts/dewa-handoff-watch.js` |
| `dewa-ts-autogen` | ✅ Working today | `templates/TS_TEMPLATE.md` |

No Opus session needed for these — they are already implemented and triggering.

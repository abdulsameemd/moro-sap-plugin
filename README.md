# moro-sap-plugin v0.1

**DEWA SAP Agentic Development Kit — ADK Layer 5**

One installable package that gives any DEWA SAP team the complete 11-stage
agentic development pipeline — skills, hooks, agents, and commands bundled
and ready to run.

---

## What's inside

```
moro-sap-plugin/
├── package.json              ← plugin metadata
├── manifest.json             ← full layer registry
├── README.md
├── scripts/
│   ├── install.js            ← copies plugin into your project
│   └── validate.js           ← checks plugin integrity
├── .claude/
│   ├── settings.json         ← wires all 5 hooks into Claude Code
│   ├── skills/
│   │   ├── moro-design/      ← Layer 2: DEWA Fiori design system
│   │   └── moro-code-review/ ← Layer 2: 38-point code review
│   ├── hooks/
│   │   ├── pre-lint-gate.js           ← PreToolUse: lint before write
│   │   ├── post-atc-check.js          ← PostToolUse: ATC after ABAP write
│   │   ├── session-start-handoff.js   ← SessionStart: load handoff context
│   │   ├── stop-confirm-review.js     ← Stop: CONFIRM REVIEW gate
│   │   ├── stop-approve-transport.js  ← Stop: APPROVE TRANSPORT gate
│   │   └── lib/
│   ├── agents/               ← Layer 4: 6 agent stubs (next hackathon)
│   └── commands/
│       ├── moro-start.md     ← /moro-start (Stages 1–3)
│       ├── moro-review.md    ← /moro-review (Stage 7)
│       └── moro-deploy.md    ← /moro-deploy (Stages 9–11)
└── docs/                     ← 13 configuration .md files
```

---

## Install

```bash
# From the plugin folder, install into your project:
node scripts/install.js /path/to/your/project

# Validate the plugin before installing:
node scripts/validate.js
```

The install script copies all layers into your project and wires
`settings.json` automatically. Open the project in VS Code — Claude Code
reads `.claude/` on startup.

---

## Usage

| Command | What it does | Stage |
|---|---|---|
| `/moro-start` | Start a new Fiori application | 1–3 |
| `/moro-review` | Run 38-point code review | 7 |
| `/moro-deploy` | Validate + release transport | 9–11 |

---

## Human gates (enforced by hooks — cannot be bypassed)

| Gate | What to type | Hook that enforces it |
|---|---|---|
| Code review approved | `CONFIRM REVIEW` | stop-confirm-review.js |
| Transport released | `APPROVE TRANSPORT` | stop-approve-transport.js |

---

## ADK layer status

| Layer | Contents | Status |
|---|---|---|
| Layer 1 | 13 .md config files (in docs/) | ✅ Complete |
| Layer 2 | 2 skills (moro-design, moro-code-review) | ✅ Complete |
| Layer 3 | 5 hooks + settings.json | ✅ Complete |
| Layer 4 | 6 agent stubs | 🔜 Next hackathon |
| Layer 5 | This plugin | ✅ v0.1 scaffold |

---

## Maintained by

DEWA SAP Technical Services · MORO HUB · I&TF Division  
Security standards owned by: DEWA Red Team (SEC-01 through SEC-06)

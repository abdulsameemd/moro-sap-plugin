# moro-sap-plugin v0.1

<<<<<<< HEAD
**An agentic SDLC framework for DEWA SAP development, built and maintained by MORO HUB.**

This plugin packages a complete 11-stage AI-assisted development pipeline — covering everything from Fiori prototyping to ABAP/RAP backend generation, automated code review, and SAP transport governance — into one installable unit. Built using Claude Code, Anthropic's agentic coding tool, with custom skills, deterministic safety hooks, and slash commands.

Any SAP team within DEWA can install it with a single command and get the complete framework — no manual setup, no copying files by hand.

---

## What problem this solves

SAP development in DEWA's SAP Technical Services division involves a long, repetitive pipeline: design a Fiori screen, generate the backend RAP artefacts, review the code, write the technical specification, validate and release the transport. Doing this manually with an AI assistant means re-explaining the rules every session and hoping the assistant follows them consistently.

This plugin turns those rules into enforced, deterministic behaviour:

- **Skills** teach Claude the DEWA design system and the code review standard
- **Hooks** enforce quality gates that Claude cannot bypass — even if instructed to
- **Commands** give developers a clean entry point into each stage of the pipeline
- **Config files** carry the full governance rulebook (naming conventions, Clean Core compliance, security standards)
=======
**MORO SAP Agentic Development Kit — ADK Layer 5**

One installable package that gives any SAP team the complete 11-stage
agentic development pipeline — skills, hooks, agents, and commands bundled
and ready to run.
>>>>>>> 406d39a1630bcd0e2b4f6b6e6768c30833a9248a

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
<<<<<<< HEAD
│   │   ├── moro-design/      ← DEWA Fiori design system
│   │   └── moro-code-review/ ← 38-point code review
=======
│   │   ├── moro-design/      ← Layer 2: Design team
│   │   └── moro-code-review/ ← Layer 2: 38-point code review
>>>>>>> 406d39a1630bcd0e2b4f6b6e6768c30833a9248a
│   ├── hooks/
│   │   ├── pre-lint-gate.js           ← PreToolUse: lint before write
│   │   ├── post-atc-check.js          ← PostToolUse: ATC after ABAP write
│   │   ├── session-start-handoff.js   ← SessionStart: load handoff context
│   │   ├── stop-confirm-review.js     ← Stop: CONFIRM REVIEW gate
│   │   ├── stop-approve-transport.js  ← Stop: APPROVE TRANSPORT gate
│   │   └── lib/
<<<<<<< HEAD
│   ├── agents/                ← 6 agent stubs (Layer 4 — in progress)
=======
│   ├── agents/               ← Layer 4: 6 agent stubs (next release)
>>>>>>> 406d39a1630bcd0e2b4f6b6e6768c30833a9248a
│   └── commands/
│       ├── moro-start.md      ← /moro-start (Stages 1–3)
│       ├── moro-review.md     ← /moro-review (Stage 7)
│       └── moro-deploy.md     ← /moro-deploy (Stages 9–11)
└── docs/                      ← 13 configuration .md files
```

---

## Install

```bash
git clone https://github.com/abdulsameemd/moro-sap-plugin.git
cd moro-sap-plugin
node scripts/validate.js
node scripts/install.js /path/to/your/dewa-sap-project
```

The install script copies every layer into your project and wires `settings.json` automatically. Open the project in VS Code — Claude Code reads `.claude/` on startup.

---

## Usage

| Command | What it does | Stage |
|---|---|---|
| `/moro-start` | Start a new Fiori application | 1–3 |
| `/moro-review` | Run the 38-point code review | 7 |
| `/moro-deploy` | Validate and release the SAP transport | 9–11 |

---

## Human gates — enforced by hooks, cannot be bypassed

| Gate | What to type | Hook that enforces it |
|---|---|---|
| Code review approved | `CONFIRM REVIEW` | stop-confirm-review.js |
| Transport released | `APPROVE TRANSPORT` | stop-approve-transport.js |

These gates exist because a transport release to QAS is irreversible, and a code review skip should never happen silently. The hooks fire automatically and block Claude regardless of what it's instructed to do — the safety doesn't depend on Claude remembering the rule.

---

## ADK layer status

| Layer | Contents | Status |
|---|---|---|
| Layer 1 | 13 .md config files (in docs/) | ✅ Complete |
| Layer 2 | 2 skills (moro-design, moro-code-review) | ✅ Complete |
| Layer 3 | 5 hooks + settings.json | ✅ Complete |
| Layer 4 | 6 agent stubs | 🔜 In progress |
| Layer 5 | This plugin | ✅ v0.1 scaffold |

---

## Background

Built as part of an internal agentic engineering initiative at MORO HUB's SAP Technical Services division, supporting DEWA's SAP Centre of Excellence (I&TF — Innovation & The Future). The framework was developed iteratively across a series of internal hackathons, each tackling one layer of the architecture.

## Maintained by

<<<<<<< HEAD
MORO HUB · SAP Technical Services
=======
SAP Technical Services · MORO HUB  
Security standards owned by: DEWA Red Team (SEC-01 through SEC-06)
>>>>>>> 406d39a1630bcd0e2b4f6b6e6768c30833a9248a

# DEPLOY.md — DEWA UI5 App Deployment
## On-Prem S/4HANA · BTP Cloud Foundry · SAP Build Work Zone

> **Maintained by:** Abdulsamee
> **Purpose:** Defines the exact deployment steps Claude executes after transport
> is confirmed. Covers both On-Prem ABAP repository deploy and BTP CF deploy.
>
> **Position in framework:** Stage 10 — after transport confirmed, final stage.
> **Pre-condition:** Transport validated ✅ · TS signed off ✅ · CONFIRM DEPLOY received
> **Human gate:** Developer must type `CONFIRM DEPLOY` — Claude never deploys autonomously.

---

## 0. Pre-Deployment Gate

Before any deployment command runs, Claude verifies:

| # | Check | Source |
|---|---|---|
| 1 | Transport validated — no missing objects, no syntax errors | DEPLOY.md §0 |
| 2 | TS document generated and saved | TS_TEMPLATE.md |
| 3 | ATC result: zero violations | CODEREVIEW.md §2.4 |
| 4 | Linter result: zero errors | CLAUDE.md §3 Step 6 |
| 5 | `CONFIRM REVIEW` received from developer | CODEREVIEW.md §3 |
| 6 | FLP deployment checklist passed | CLAUDE.md §3 Step 7 |
| 7 | `CONFIRM DEPLOY` received from developer | This file §0 |

If any check fails, stop and report. Never deploy with outstanding issues.

---

## 1. On-Prem S/4HANA — ABAP Repository Deploy

Use this flow when target is S/4HANA On-Premise.

### 1.1 Build

```bash
# Clean previous build
rm -rf dist/

# Production build
ui5 build --all --clean-dest

# Verify dist/ exists and contains Component-preload.js
ls dist/Component-preload.js
```

### 1.2 Deploy via ui5-task-deploy-abap (recommended)

```yaml
# ui5.yaml — add build task (Claude reads, does not modify without approval)
builder:
  customTasks:
    - name: deploy-to-abap
      afterTask: generateVersionInfo
      configuration:
        target:
          url: https://[s4hana-hostname]:[port]
          client: "[client]"
        app:
          name: /UI5/[APPNAME]
          description: DEWA [AppName]
          package: Z[XX]_PACKAGE
          transport: [transport-number]
```

```bash
ui5 build --all --clean-dest && ui5 deploy
```

### 1.3 BSP Application Verification

After upload, verify the BSP application exists:
```
SAP transaction: SE80 or /n/UI5/UI5_REPOSITORY_LOAD
BSP app name:    /UI5/[APPNAME]
ICF path:        /sap/bc/ui5_ui5/sap/[appname]/
```

### 1.4 ICF Node Activation

```
Transaction: SICF
Path: /default_host/sap/bc/ui5_ui5/sap/[appname]
Action: Activate service node
Verify: HTTP 200 on root path
```

### 1.5 FLP Tile Registration (On-Prem)

```
Transaction: /UI2/FLPD_CONF or Fiori Launchpad Designer
1. Create semantic object: [SemanticObject from manifest.json sap.app.crossNavigation]
2. Create intent: [Action from manifest.json]
3. Assign tile to role: [Z_ROLE_[APPNAME]]
4. Assign role to user for smoke test
```

---

## 2. BTP Cloud Foundry Deploy

Use this flow when target is BTP.

### 2.1 Build MTA Archive

```bash
# Install MTA build tool if not present
npm install -g mbt

# Build MTA
mbt build -p cf

# Output: [AppName]_1.0.0.mtar in /mta_archives/
ls mta_archives/
```

### 2.2 Deploy to CF Space

```bash
# Login to BTP CF (developer does this — credentials not handled by Claude)
cf login -a https://api.cf.[region].hana.ondemand.com

# Deploy
cf deploy mta_archives/[AppName]_1.0.0.mtar -f

# Verify app is running
cf apps | grep [appname]
```

### 2.3 Work Zone CDM Registration

After CF deploy, register the app in SAP Build Work Zone:

```
1. Open Work Zone Admin console
2. Navigate: Channel Manager → HTML5 Apps
3. Update content channel to pick up new app
4. Navigate: Content Manager → Content Items
5. Create new app tile:
   - Title: [AppName EN]
   - Title (AR): [AppName AR — from i18n_ar.properties]
   - Semantic object: [from manifest.json]
   - Action: [from manifest.json]
   - URL: /[appname]/index.html
6. Assign to role collection: [DEWA_[APPNAME]_USER]
7. Add to page/space: [target Work Zone page]
```

---

## 3. Post-Deploy Smoke Test

After deployment (either target), run these checks and record results in TS §8.2:

```bash
# 1. App root loads
curl -I https://[host]/[path]/index.html
# Expected: HTTP 200

# 2. OData service responds
curl -I https://[host]/sap/opu/odata4/sap/[binding]/srvd/sap/[definition]/0001/$metadata
# Expected: HTTP 200

# 3. Component-preload loads
curl -I https://[host]/[path]/Component-preload.js
# Expected: HTTP 200
```

**Manual checks (developer):**
| # | Test | Result |
|---|---|---|
| 1 | App loads in FLP / Work Zone without console errors | ☐ |
| 2 | List screen shows data from OData service | ☐ |
| 3 | Create operation works end to end | ☐ |
| 4 | RTL layout correct | ☐ |
| 5 | Arabic translations display | ☐ |
| 6 | Dark theme renders correctly | ☐ |

---

## 4. Deployment Completion Report

Claude outputs this after successful deployment:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEWA FRAMEWORK COMPLETE — [AppName]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Stage 1:  Prototype designed + approved
✅ Stage 2:  Export skill → ready_handoff.md
✅ Stage 3:  UI5 app scaffolded + built
✅ Stage 4:  Lint gate — zero errors
✅ Stage 5:  OData V4 service created via RAP
✅ Stage 6:  Service bound to UI5 app
✅ Stage 7:  Code review — frontend + backend
✅ Stage 8:  TS generated → [AppName]_TS_[Date].md
✅ Stage 9:  Transport validated → [TR number]
✅ Stage 10: Deployed → [On-Prem / BTP]

HUMAN TOUCHPOINTS: 5
  1. Prototype approval
  2. Code review confirmation
  3. Transport release confirmation
  4. TS sign-off (async)
  5. Smoke test (manual)

ARTEFACTS GENERATED:
  Frontend:  [N] files (views · controllers · CSS · i18n)
  Backend:   [N] objects (DB · CDS · BDEF · BP · Service · Binding)
  Transport: [TR number]
  TS:        /docs/[AppName]_TS_[Date].md

Performance improvement:
  DB time reduction: ~[N]%
  RFC trips removed: [N]
  Silent exceptions: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> **End of DEPLOY.md**
> Maintained by Abdulsamee.
> Update this file when:
> - ui5-task-deploy-abap configuration changes
> - BTP CF deploy commands change
> - Work Zone CDM registration steps change
> - A new target system (e.g. RISE private cloud) is added to scope

---

## 5. Git Strategy — Multi-Developer + Framework Maintenance

> **Why this matters:** Without a defined Git strategy, two developers working
> on the same project create conflicts in /docs/, manifest.json, and review reports.
> Framework .md files drift when SAP releases new versions with no update process.

### 5.1 Repository Structure

```
/dewa-project/                    ← Git root (initialised by create_ui5_app)
├── *.md                          ← Framework config — always versioned
├── scripts/                      ← Watch script — versioned
├── templates/                    ← TS template — versioned
├── presentations/                ← HTML tools — versioned
│
├── docs/
│   ├── session_logs/             ← Versioned — audit trail per delivery
│   ├── [AppName]_TS_[Date].md    ← Versioned — governance record
│   ├── review_report.md          ← Versioned — per app branch
│   └── handoff/                  ← NOT versioned → add to .gitignore
│
├── frontend-app/                 ← UI5 app source — versioned
└── backend/                      ← ABAP artefact references — versioned
```

**.gitignore — add these:**
```
docs/handoff/
docs/claude_code_prompt.txt
docs/teamlead_notification.eml
docs/teamlead_notification_trigger.txt
node_modules/
dist/
mta_archives/
*.eml
```

### 5.2 Branching Strategy — One Branch Per App Delivery

```
main
├── framework/[version]           ← Framework updates only
│   └── framework/s4hana-2024     ← Example: new SAP version
│
└── feature/[AppName]             ← One branch per app delivery
    └── feature/VendorProfile     ← Developer works here
```

**Rules:**
- `main` — stable framework + all released and QAS-approved apps
- `feature/[AppName]` — one branch per app, created at Stage 2 (CONFIRM)
- `framework/[version]` — framework .md file updates only, never app code

**Branch lifecycle:**
```
Stage 2: CONFIRM
  → git checkout -b feature/[AppName]

Stage 9: Transport released
  → git add docs/ frontend-app/ backend/
  → git commit -m "feat([AppName]): transport [TR] ready for QAS"
  → git push origin feature/[AppName]

Team Lead approves QAS import:
  → git checkout main
  → git merge feature/[AppName]
  → git tag v[AppName]-[Date]
  → git push origin main --tags
```

### 5.3 What Claude Commits Automatically

Add this instruction to CLAUDE.md §3 — Claude commits after every major stage:

| Stage | What Claude commits | Commit message |
|---|---|---|
| Stage 3 complete | UI5 app files (webapp/, manifest.json) | `feat: scaffold [AppName] UI5 app` |
| Stage 5 complete | Backend artefact list reference | `feat: RAP service [EntityName] generated` |
| Stage 7 complete | review_report.md | `review: code review complete — [N] issues` |
| Stage 8 complete | [AppName]_TS_[Date].md + session log | `docs: TS and session log for [AppName]` |
| Stage 9 complete | Final commit before merge | `release: transport [TR] ready for QAS` |

### 5.4 Framework File Ownership

These files are owned by the framework owner (Abdulsamee). No developer modifies them directly.

| File | Owner | Change process |
|---|---|---|
| `CLAUDE.md` | Framework owner | PR only — reviewed before merge |
| `CLAUDE_BACKEND.md` | Framework owner | PR only — reviewed before merge |
| `DESIGN.md` | Design lead | PR only — tested on one prototype |
| `GUARDRAILS.md` | Framework owner | PR only — tested on one delivery |
| `SAP_CLEAN_CORE.md` | Framework owner | PR only — SAP release notes checked |
| `CODEREVIEW.md` | Framework owner | PR only |
| `DEPLOY.md` | Framework owner | PR only |

**Developers may modify:**
- `docs/` — generated outputs from their delivery
- `frontend-app/` — their UI5 app source
- `backend/` — their ABAP artefact references

### 5.5 Multi-Developer Conflict Prevention

When two developers work on the same project simultaneously:

**Rule 1 — One entity per branch**
```
Developer A → feature/VendorProfile
Developer B → feature/InvoiceApproval
```
Never work on the same entity in parallel — RAP artefact names will conflict.

**Rule 2 — Shared entities via interface layer**
If two apps need the same CDS view (e.g. `ZFI_I_BusinessPartner`):
- Framework owner creates a shared artefact branch
- Both apps consume via projection — never duplicate interface views

**Rule 3 — /docs/ isolation**
Each feature branch has its own `/docs/` scope:
- `review_report.md` — scoped to the current branch's app
- Session logs — named with app name, no conflict
- TS documents — named with app name, no conflict

**Rule 4 — Merge window**
Only one feature branch merges to main per week. Team Lead controls the merge window — prevents multiple transports hitting QAS simultaneously.

### 5.6 Framework Update Process — New SAP Version

When SAP releases a new S/4HANA version:

```
Step 1: Framework owner creates branch
  → git checkout -b framework/s4hana-[version]

Step 2: Review SAP release notes for:
  · New RAP BDL syntax changes
  · New released APIs (add to SAP_CLEAN_CORE.md §4)
  · Deprecated statements (add to SAP_CLEAN_CORE.md §2)
  · New @sap/cds version (update GUARDRAILS.md §10)
  · New SAPUI5 version (update GUARDRAILS.md §1–§8)

Step 3: Update .md files
  · CLAUDE_BACKEND.md — version baseline
  · GUARDRAILS.md §9/§10 — rule changes
  · SAP_CLEAN_CORE.md §2/§4 — new released/deprecated APIs
  · CHANGELOG.md — document every change

Step 4: Test on one complete delivery
  · Run full framework from Stage 1 to Stage 10
  · Confirm zero linter errors + zero ATC violations

Step 5: PR to main
  · Framework owner creates PR
  · Team Lead reviews CHANGELOG
  · Merge after approval

Step 6: All developers pull
  → git checkout main && git pull
  → Framework updated across all developers instantly
```

### 5.7 Git Quick Reference — Daily Commands

```bash
# Start new app delivery
git checkout main && git pull
git checkout -b feature/[AppName]

# During development (Claude does this automatically)
git add . && git commit -m "feat: [message]"

# Push for team visibility  
git push origin feature/[AppName]

# After transport released and QAS approved
git checkout main
git merge feature/[AppName] --no-ff
git tag v[AppName]-$(date +%Y%m%d)
git push origin main --tags
git branch -d feature/[AppName]

# Update framework when new SAP version releases
git checkout -b framework/s4hana-[version]
# ... update .md files ...
git push origin framework/s4hana-[version]
# ... create PR → merge after review ...
```

---

> **End of DEPLOY.md §5**
> Git strategy maintained by: Abdulsamee
> Update §5.6 whenever a new S/4HANA or SAPUI5 version is released.


---

## 6. Transport Release Process — Post Smoke Test (Stage 11)

> **Critical distinction:**
> Transport CREATION happens at Stage 5 (RAP generation).
> Transport VALIDATION happens at Stage 9 (pre-deploy check).
> Transport RELEASE to QAS happens at Stage 11 — ONLY after smoke test passes in DEV.

### 6.1 Correct sequence

```
Stage 5  → Transport created in DEV automatically (writeObjectSource)
Stage 9  → Transport validated (listTransports + validateTransport)
Stage 10 → App deployed to DEV system + smoke tested
Stage 11 → Transport RELEASED to QAS — only after smoke test confirmed
```

### 6.2 Stage 11 — Developer action

After smoke test passes, developer types in Claude Code:
```
APPROVE TRANSPORT
```

> **ADK Hook — Stop:** `.claude/hooks/stop-approve-transport.js` enforces this gate at code level.
> When Claude attempts to end any response after Stage 9, the hook checks:
> 1. Has `validateTransport` been called successfully this session?
> 2. Has the developer typed `APPROVE TRANSPORT`?
> If either check fails → `exit 1` → Claude is blocked → message: *"Transport not approved. Type APPROVE TRANSPORT to release to QAS and notify Team Lead."*
> A transport to QAS is irreversible — this hook prevents accidental release.

Claude then:
1. Writes `/docs/teamlead_notification_trigger.txt`
2. Watch script detects trigger → builds Outlook .eml
3. Outlook opens pre-filled
4. Developer clicks Send — one action

### 6.3 Team Lead action

Team Lead receives email containing:
- Transport number + app name
- Session log summary
- CHANGELOG entry (what was built)
- TS document excerpt
- Review report summary
- Instruction: import via SAP TMS → Transaction STMS → QAS

Team Lead imports transport to QAS at their discretion.

### 6.4 Why release AFTER smoke test?

If transport is released before smoke test:
- A broken app can reach QAS
- Rollback requires reversing a QAS import — complex
- Root cause unclear (deploy issue vs code issue)

Releasing AFTER smoke test:
- DEV confirmed working before QAS receives it
- Clean separation: DEV validation → QAS import
- Team Lead receives notification only when DEV is confirmed good


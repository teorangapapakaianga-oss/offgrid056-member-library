# Next actions

What happens next, and what is waiting on research.

**As at:** 23 September 2026, after Stage 9.40.

---

## Immediate queue

| # | Action | State | Waiting on |
|---|---|---|---|
| 1 | **OG-10 Rainwater Harvesting Planner** — deploy as #17 | prepared and verified; 24 proposed changes | **owner decisions** (Stage 9.40 §15): the 24 changes · quoting MBIE's NZ tank sizes with no AU equivalent · whether to add the electrical block or keep market-specific pump wording · category, difficulty (intermediate) and time (30 min) |
| 2 | On approval: re-render, verify, deploy | — | the route supersession check (OG-10 over demo placeholder `res-0016`), then rollback to `a65a1ef1` |
| 3 | Update this workstream | — | after the stage report |

## Water pathway

The order to work in, and why:

| Order | Resource | State | Notes |
|---|---|---|---|
| ✅ | **OG-08** Water Storage Calculator | **live** | need and storage |
| **now** | **OG-10** Rainwater Harvesting Planner | prepared | collection |
| next | **OG-B08** Water Tank Sizing & Placement Guide | not started | tanks and placement; drinking-water block approved; likely working at height. Best after OG-10, so tank depth lives in one place. |
| blocked | **OG-09** Filtration Comparison Matrix | blocked | **treatment research first** |

**Air still has no resource at all.** OG-13 (Healthy Home Air Audit) is the obvious candidate and needs no new safety
research, so it is a good low-risk stage whenever the water run pauses.

## Research stages (each gates resources)

Each one is research only: read official NZ **and** AU sources live, quote them, return them for approval, and
migrate nothing until the wording is approved.

### 1. Gas / LPG — highest value

- **Unblocks:** OG-17 Solid Fuel Heating Planner, OG-B09 Insulation & Heating Upgrade Checklist, and any LPG or
  gas-appliance content anywhere
- **Needed:** NZ (WorkSafe gas safety, Health NZ unflued heaters) and AU (state gas regulators, enHealth) wording for
  household gas appliances and LPG, including LPG generators
- **Note:** `GAS_SAFETY_REQUIRED` currently fails closed on all of it, which is the intended behaviour until this is
  done

### 2. Water treatment

- **Unblocks:** OG-09, plus treatment detail in OG-10 and OG-B08
- **Needed:** NZ (Taumata Arowai acceptable solutions, Health NZ, MBIE) and AU (enHealth, state health) on filtration,
  UV, chlorination and boiling — with each market's own figures kept separate

### 3. Grants and rebates

- **Unblocks:** OG-16 Grant Eligibility Insulation Planner, and the "grant or rebate" line in OG-21
- **Needed:** current NZ programmes (EECA) and AU state and territory schemes
- **Care:** these change often. Prefer wording that sends the member to the current source rather than naming amounts.

### 4. Consents and approvals

- **Unblocks:** OG-B11 Building Consent Navigator, and sharpens the consent wording already used in OG-10, OG-25,
  OG-27 and OG-B12
- **Needed:** NZ building consents and exemptions (MBIE) and council variation; AU state, territory and council
- **Rule:** no national AU rule where jurisdictions differ

### 5. Diesel

- **Unblocks:** diesel generators and heating (currently `FUEL_GUIDANCE_REQUIRED`)
- **Smaller than the others:** the approved generator block covers petrol only, so this is mostly fuel storage and
  refuelling

## Later

| Work | Notes |
|---|---|
| **The remaining 24 not-started resources** | see `RESOURCE_REGISTER.md`. The general/planning group (OG-01, OG-03, OG-04, OG-07, OG-23, OG-24, OG-28, OG-29, OG-30) is mostly low-hazard and could move quickly. |
| **Start Here rebuilt on real resources** | currently 6 demonstration steps |
| **The 30-Day Programme** | 30 demonstration days; to be rebuilt on real resources, or retired in favour of the pathways |
| **Retiring demo placeholders** | 29 remain. They are superseded one route at a time in the preview; a decision is needed before any public launch. |
| **Production membership system** | accounts, progress across devices, publishing resources from draft |
| **US and Canada** | **non-publishable** until each market has its own safety review. No US or CA wording, figures or rules are used anywhere today. |

## Standing reminders

- **One resource or batch per stage**, ending with owner review. Nothing deploys without approval for that resource.
- **Claims first.** Audit the numbers before rewriting anything.
- **Update this workstream** when a stage report lands: `CURRENT_STATUS.md`, `RESOURCE_REGISTER.md`, and
  `SAFETY_REGISTER.md` / `DEPLOYMENT_REGISTER.md` when they apply.
- **Keep unrelated OffGrid056 work out of this folder.**

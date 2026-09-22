# Next actions

What happens next, and what is waiting on research.

**As at:** 23 September 2026, after Stage 9.42.

---

## Immediate queue

| # | Action | State | Waiting on |
|---|---|---|---|
| 1 | **Water treatment blocks and claim gates** (gate OG-09) | **researched** at Stage 9.42 | owner approval of the draft NZ/AU blocks and the six gates, then implementation |
| 2 | **OG-B08 Water Tank Sizing & Placement Guide** — the next migration in the water pathway | not started | owner go-ahead; no new safety research needed |
| 3 | **OG-13 Healthy Home Air Audit** — the first Air resource | not started | owner go-ahead; a low-risk alternative if the water run pauses |

## Water pathway

The order to work in, and why:

| Order | Resource | State | Notes |
|---|---|---|---|
| ✅ | **OG-08** Water Storage Calculator | **live** | need and storage |
| ✅ | **OG-10** Rainwater Harvesting Planner | **live** | collection |
| **next** | **OG-B08** Water Tank Sizing & Placement Guide | not started | tanks and placement; drinking-water block approved; likely working at height. Best after OG-10, so tank depth lives in one place. |
| blocked | **OG-09** Filtration Comparison Matrix | blocked | research done (Stage 9.42); blocked until the blocks and gates are approved and built. 11 of its 16 claim groups fail against current guidance, and its "Quick Decision Framework" needs removal as written. |

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

### 2. Water treatment — **done, awaiting approval**

- **Unblocks:** OG-09, plus treatment detail in the live OG-10 and in OG-B08
- **Researched at Stage 9.42:** ten NZ sources and ten AU sources read live; draft NZ and AU blocks, a
  storage-vs-treatment matrix, six fail-closed gates and an OG-09 claims inventory are in
  `admin-import/STAGE_9.42_OG09_WATER_TREATMENT_RESEARCH.md`
- **Still open:** enHealth's national rainwater guidance would not download (three attempts); NZ publishes no household
  UV or micron detail; nothing is published in either market on elevation, fuel-contaminated water, saltwater or
  distillation
- **Next:** owner approval, then `water-treatment` in `safety-blocks.json`, a `treatment-sources.json` registry and the
  six gates — **before** OG-09 is prepared

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
| **Retiring demo placeholders** | 28 remain. They are superseded one route at a time in the preview; a decision is needed before any public launch. |
| **Production membership system** | accounts, progress across devices, publishing resources from draft |
| **US and Canada** | **non-publishable** until each market has its own safety review. No US or CA wording, figures or rules are used anywhere today. |

## Standing reminders

- **One resource or batch per stage**, ending with owner review. Nothing deploys without approval for that resource.
- **Claims first.** Audit the numbers before rewriting anything.
- **Update this workstream** when a stage report lands: `CURRENT_STATUS.md`, `RESOURCE_REGISTER.md`, and
  `SAFETY_REGISTER.md` / `DEPLOYMENT_REGISTER.md` when they apply.
- **Keep unrelated OffGrid056 work out of this folder.**

# Next actions

What happens next, and what is waiting on research.

**As at:** 23 September 2026, after Stage 9.51.

---

## Immediate queue

| # | Action | State | Waiting on |
|---|---|---|---|
| 1 | **Three Air safety blocks** — fire-and-smoke-alarms, mould-and-dampness, home-ventilation | **researched and drafted** at Stage 9.51 | owner approval of the drafted NZ/AU wording, then one build stage (blocks + numeric registry entries + a ratio claim type + a full 19-resource re-run) |
| 2 | **OG-13 Healthy Home Air Audit** | blocked behind those blocks | 24 claim groups classified; 5 prices, 3 health claims and 3 unsourced figures to remove; gas wording must be avoided until the gas stage |
| 3 | **Other pathways on real resources** | possible now that the override exists | Energy Basics and Start Here could follow the same private-path pattern once their resources are live |
| 4 | **Retiring demo placeholders** | 28 remain | a decision before any public launch |

## Water pathway

The order to work in, and why:

| Order | Resource | State | Notes |
|---|---|---|---|
| ✅ | **OG-08** Water Storage Calculator | **live** | need and storage |
| ✅ | **OG-10** Rainwater Harvesting Planner | **live** | collection |
| ✅ | **OG-09** → **Household Water Treatment Guide** | **live** | treatment: two market method tables and a six-step fail-safe worksheet (Stage 9.44) |
| ✅ | **OG-B08** Water Tank Sizing & Placement Guide | **live** | tanks and placement (Stage 9.46). Teaches no treatment — it points at OG-09 instead. |

**The water pathway is complete** — OG-08, OG-10, OG-09 and OG-B08 are all live.

## Air pathway

**Air still has no resource.** OG-13 (Healthy Home Air Audit) is the entry assessment, and Stage 9.51's research
found it needs **three safety blocks that do not exist yet** — fire and smoke alarms, mould and dampness, home
ventilation — plus numeric registry entries for a dozen figures. It is a three-stage job (approve the wording, build
the blocks and entries, then migrate), not the low-risk stage it looked like from the outside.

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

### 2. ~~Water treatment~~ — **built (Stage 9.43)**

- **Delivered:** the `water-treatment` block (NZ and AU), `config/treatment-sources.json` (21 approved claims), the
  six fail-closed gates, 33 tests, and OG-09 rebuilt and rendered
- **Still open, and said plainly in both files rather than filled in:** enHealth's national rainwater guidance is
  unreadable and not relied upon; NZ publishes no household UV specification or micron rating; neither market
  publishes an elevation adjustment, a fuel or saltwater method, or a distillation method
- **Closed at Stage 9.44:** OG-09 approved, renamed and deployed as #18; OG-08's audited exemption recorded

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

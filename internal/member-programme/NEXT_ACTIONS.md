# Next actions

What happens next, and what is waiting on research.

**As at:** 5 October 2026, after Stage 9.57.

---

## Immediate queue

| # | Action | State | Waiting on |
|---|---|---|---|
| 1 | **Finish the gas evidence base** | **Stage 9.55 did NZ in full and 5 of 8 AU jurisdictions** | read TAS, ACT and NT live; re-read the four search-only AU pages (ESV heating, NSW gasfitter and gas water heaters, WA servicing) and FENZ; then an owner decision on the AU body shape, because NSW and Queensland give contradictory leak instructions and four jurisdictions give four different servicing intervals |
| 1b | **Rule on the unlabelled Victorian two-year servicing interval** | **live in 5 resources now** | a correctness issue in deployed content, not a future-stage issue. `STAGE_9.55_GAS_LPG_RESEARCH.md` §16 |
| 1c | ~~OG-17 — probably a false positive~~ | **confirmed and released at Stage 9.57** | the detector was wrong, so the detector was fixed — no exemption was created. OG-17 is now blocked only on claims: 10 prices, 6 unsourced efficiency percentages, an unsourced CO five-year lifespan and an epidemiological comparison. Recommended as the next migration |
| 2 | ~~Three Air safety blocks~~ | **built at Stage 9.52** | `fire-and-smoke-alarms`, `mould-and-dampness` (bleach withheld), `home-ventilation` (AU non-numeric), plus 12 numeric entries and the ratio claim type. Full 19-resource re-run green, Bucket C = 0, no member content changed |
| 3 | ~~OG-13~~ | **live as resource #20 (Stage 9.54)** | 22 copy changes applied, all eight blocks carried, no exemption used, Bucket C = 0 in both markets, 40/40 prepared files verified. The first live exercise of the ratio claim type and of a temperature claim |
| 3b | **A second Air resource, then the Air pathway** | not started | a one-resource pathway is not a pathway. Candidates: ventilation and moisture control, or mould and dampness — both exist only as safety blocks today |
| 4 | **Other pathways on real resources** | possible now that the override exists | Energy Basics and Start Here could follow the same private-path pattern once their resources are live |
| 5 | **Retiring demo placeholders** | 28 remain | a decision before any public launch |
| 6 | **`UNSOURCED_TESTING_INTERVAL` scope** | **raised, not changed** | the water-treatment gate has no topic context, so it fires on any "test … every six months" sentence — including a smoke alarm routine. It is working in our favour today (it is what blocks OG-13's two legacy alarm rows), so it was deliberately left alone. Whether it should gain a water-topic condition is an owner decision, and not one to take during a migration |

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

**Air still has no resource, but its safety architecture now exists.** OG-13 (Healthy Home Air Audit) is the entry
assessment. Stage 9.51 researched it; **Stage 9.52 built all three blocks, their twelve numeric entries and the
ratio claim type**, and proved the whole library stays green. What is left is the migration itself, and it is held
by two small rulings rather than by missing research.

**No Air learning path yet, on purpose.** A one-resource pathway is not a pathway. Steps 2–4 of the proposed Air
order (ventilation and moisture, mould and dampness, smoke and combustion safety) are *safety blocks* today, not
resources, so the path waits until a second Air resource exists.

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

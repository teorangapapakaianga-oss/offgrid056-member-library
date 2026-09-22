# OG-B12 — OFF-GRID SYSTEM ARCHITECTURE PLANNER · DEPLOYED TO PRIVATE PREVIEW (#15)

**Status:** OG-B12 is live in the private preview as the **15th** protected draft resource.

- **Worker version:** `61d2acd0`
- **Access:** still on all traffic
- **Changes applied:** all 23 approved changes, including Option A (no LPG, biogas or diesel)
- **Metadata:** general / planning / advanced / 60 min
- **AU CO trim:** scoped to OG-B12
- **Rollback:** `77020e71`

**The fuel detector was corrected first.** There is **no global "gas heater" exemption**: gas-appliance detection is
restored everywhere. OG-15 and OG-26 were reviewed, and **pass only through resource-specific, exact-context
exemptions**.

**Date:** 22 September 2026

---

## 1. Fuel-detector correction

**GAS_SAFETY_REQUIRED** now matches, anywhere in a resource's own text (safety blocks excluded):

- **gas fuels:** LPG, LP gas, natural gas, biogas, gas-powered / fuelled / fired, dual- or tri-fuel
- **gas appliances:** unflued heaters, cabinet heaters, and gas heaters, heating, appliances, cookers, cooktops, hobs,
  stoves, ovens, fires, fireplaces, bottles, cylinders, water heaters, hot water, barbecues, lamps, lanterns, burners,
  rings and fridges

**FUEL_GUIDANCE_REQUIRED** matches **diesel**, because the approved generator block covers petrol only.

**What either finding does:**

- blocks **every market**
- adds a content finding, so the resource is **NEEDS_CONTENT_REVIEW**, never READY

**The "gas heater" loophole is removed.** The previous version deliberately ignored "gas heater" everywhere. That
exception is gone.

**Proof:** with the correction and no exemptions, **OG-15 and OG-26 both failed closed** (GAS_SAFETY_REQUIRED, "gas
heater"; NEEDS_CONTENT_REVIEW).

**Resource-specific exemptions** (`metadata-review.json` → `fuelExemptions`):

- Each one names **one resource** and **one exact piece of text**, with its classification, reason and approval
  reference (Stage 9.36 ruling 3).
- **Reworded:** if the context is reworded, the exemption no longer matches.
- **Repeated:** if the context appears more than once, it's ignored.
- **New gas text:** any other gas wording in the same resource still trips the check.
- **Tests prove each case,** including that OG-15's exemption doesn't cover OG-26's text, and that only OG-15 and
  OG-26 hold one.

**Not flagged, correctly:** OG-25's *"Current power / water / gas bills"* is a utility bill, not an appliance.

## 2. OG-15 gas-heater review (Warm Home Scorecard, live)

| | |
|---|---|
| Exact context | Scorecard item: *"12. Backup heating exists (fireplace, wood burner, gas heater, portable)"*, scored 1–5 |
| Classification | **incidental / list-only** |
| Gas-use instruction? | **none**: no use, installation, ventilation or fuel instruction |
| Safety already carried | approved **carbon-monoxide** and **indoor-combustion** blocks (the latter covers unflued gas and LPG cabinet heaters) |
| Resource-specific exemption safe? | **yes**, recorded for this exact text |
| Remediation needed? | **no**. The PDF is unchanged. |

## 3. OG-26 gas-heater review (3-Tier Budget Planner, live)

| | |
|---|---|
| Exact context | Tier 1 budget table row: *"Heat · Emergency heating (gas heater / thermal blankets) · $ · $ · $"* |
| Classification | **planning reference** (a budget line naming options to price) |
| Gas-use instruction? | **none** |
| Safety already carried | approved **carbon-monoxide** and **indoor-combustion** blocks |
| Resource-specific exemption safe? | **yes**, recorded for this exact text |
| Remediation needed? | **not required**. The PDF is unchanged. |

**Your option for later:** the line does suggest buying a gas heater for emergencies. If you'd prefer it didn't, a
future copy change could name the category ("portable heater") instead. I haven't made or proposed that change.

## 4. Final NZ result

| Check | Result |
|---|---|
| File | `off-grid-system-architecture-planner.NZ.pdf` |
| Pages | 8 |
| Title | Off-Grid System Architecture Planner — OffGrid056 |
| Emergency numbers | **111 only** |
| NZ wording | licensed electrical worker · *"stream (with consent)"* · *"Consent Requirements"* · 10-minute cool-down |
| NZ drinking water | 3 L per person per day for 3 days · the bleach method |
| AU terms | none: no licensed electrician, Permits or Approvals, "water rules that apply", carport, battery-operated CO alarm, 10 L, 000, 112, SES, "Australia" |
| Fuels | **no LPG, biogas or diesel** in OG-B12's own text. The only "LPG" is the approved NZ CO block's *"gas and LPG heaters"*. |
| Removed content | none of: 10-30kWh, 20,000 / 1,000 / 100 L, "3+ years", 230V/48V, single-line design, humanure, waste burning, "closed loop", Tier 4, Bonus, 30-Day, OG-B12 |
| Canning | the method name only (*"water-bath and pressure canning"*); **no times, temperatures, pressures, recipes or shelf-life** |
| Safety blocks | **all five print whole**: each block's title and last sentence are on the same page. The drinking-water block is whole on page 8. |
| Tokens · VERIFY · browser-error page | none |
| Changes | all 23 applied |
| Draft | yes |

## 5. Final AU result

| Check | Result |
|---|---|
| File | `off-grid-system-architecture-planner.AU.pdf` |
| Pages | 7 |
| Title | Off-Grid System Architecture Planner — OffGrid056 |
| Emergency numbers | **000 + 112 only** |
| AU wording | licensed electrician · *"stream (check the water rules that apply)"* · *"Permits or Approvals Needed"* · 10 L per person · generator rain, lead and alarm lines |
| NZ content | **no "New Zealand" or "NZ"**, and no 111, Civil Defence, electrical worker, "with consent", "Consent Requirements", 10 minutes, "three litres" |
| **CO-alarm instruction** | **appears once** (the owner-approved scoped trim applied) |
| LPG | **no "LPG" anywhere** |
| Other checks | the same as NZ: fuels, removed content, canning, all five blocks whole, changes, draft |

**Checks run:**

- `import:verify-prep`: **30/30** files pass.
- **All 15 resources READY_AFTER_FINAL_VALIDATION**, with OG-15 and OG-26 passing through their exact-context
  exemptions.
- `import:verify-build` on the exact build: **15 records, 30 files, 0 broken links**.
- The OG-B12 PDFs in the build are **byte-identical** to the checked PDFs.
- **All 28 earlier PDFs are byte-identical** to the previous live build. OG-15 and OG-26 were not re-rendered.

## 6. Deployment result

**Success.**

**Local preview, before deploying:**

| Check | Result |
|---|---|
| Before a market is chosen | no download offered |
| NZ chosen | NZ file only |
| AU chosen | AU file only |
| Page labels | Foundation **General**, Type Planner, Topic **Planning**, Difficulty **Advanced**, Estimated time **"1 h"**, **Draft** |
| Visible OG code | none |
| Related links | Solar Power 101 · Battery Backup Planner · Alternative Energy Suitability Check · 3-Tier Budget Planner · Resilience Product Wishlist (no Household Risk Identifier) |

**After deploying**, every unauthenticated request was redirected (302) to the Access login. That included `/`,
`/downloads/`, the OG-B12 page, both OG-B12 PDFs, and an OG-26 PDF.

**Records:** all 15 are draft.

## 7. Worker version

**`61d2acd0-4936-425f-a2d8-4cda5082db57`**

## 8. OG-B12 route

`/resources/off-grid-system-architecture-planner/` (behind Access)

## 9. Protected resource count

**15** draft resources: OG-02, OG-11, OG-15, OG-18, OG-19, OG-20, OG-21, OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B07,
OG-B10, **OG-B12**.

## 10. Tests

**300 passed.** Lint and typecheck clean.

**Changes this stage:**

- **Fuel tests rewritten:**
  - gas appliances are detected, with no global "gas heater" exemption
  - OG-15 and OG-26 pass only through their own exact-context exemptions; each covers only its own text, not
    added gas teaching, and not a reworded version
  - only OG-15 and OG-26 hold one
- **OG-B12 tests updated:** metadata general / planning / advanced / 60; the owner-approved AU trim; canning named
  only.
- **Trim test:** approved trims are OG-20 and OG-B12.

**Other status:**

| Check | Result |
|---|---|
| `--real` | refused |
| OG-B12 files in git | 0 |
| `private-assets/` tracked in git | 0 files |

## 11. Rollback confirmation

**`77020e71`** (14 resources) is in the deployment history. Its private files are in
`workspace/backups/private-assets-77020e71` (42 files), and its 28 PDFs are byte-identical to the new build's.

The new live state is backed up in `workspace/backups/private-assets-61d2acd0` (45 files).

## 12. Next recommended resource

**OG-08, Water Storage Calculator** (water / worksheet; no audit safety notes).

**Why OG-08:**

- **The Water foundation has no resource of its own in the library yet.**
- A storage calculator is where a member starts.
- Its figures can be checked directly against the **already-approved NZ and AU drinking-water block**:
  - NZ: 3 L per person per day for 3 days
  - AU: 10 L per person for 3 days
- That makes it a clean claims-first stage, with no new safety research, **provided** its own figures are separated
  per market.

**Water resources that follow:** OG-10 Rainwater Harvesting Planner, OG-09 Filtration Comparison Matrix and OG-B08
Water Tank Sizing & Placement Guide. All use the approved drinking-water block; OG-10 and OG-B08 may also need
working-at-height for gutters and roofs.

**Still held, needing research first:**

| Resource | Reason |
|---|---|
| OG-17 Solid Fuel Heating Planner | gas appliances |
| OG-B09 Insulation & Heating Upgrade Checklist | gas appliances |
| OG-16 Grant Eligibility Insulation Planner | grants and rebates |
| OG-B11 Building Consent Navigator | NZ consents and AU approvals |

**Stopped. No other resource prepared.**

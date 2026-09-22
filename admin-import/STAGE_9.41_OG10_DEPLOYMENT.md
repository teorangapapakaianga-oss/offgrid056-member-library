# OG-10 — RAINWATER HARVESTING PLANNER · DEPLOYED TO PRIVATE PREVIEW (#17)

**Status:** OG-10 is live in the private preview as the **17th** protected draft resource, and the **second** water
resource.

- **Worker version:** `d993cb64`
- **Route:** `/resources/rainwater-harvesting-planner/`, taken over from the demo placeholder **in the private
  preview only**, by the existing reusable override — no OG-10 exception
- **Changes applied:** all 24 approved, with rulings 4, 5, 9, 10 and 11 folded into the wording
- **Rollback:** `a65a1ef1`

**Date:** 23 September 2026

---

## 1. Final NZ collection and tank wording

**Collection (intro):**

> Every square metre of roof catches about 1 litre of water per millimetre of rainfall, **before losses**. *Worked
> example, not your figure:* a 150m² roof where 1,000mm of rain falls in a year catches about 150,000 litres before
> losses. **What lands on the roof is not what you can use: every real system loses some to first flush, overflow,
> gutters and evaporation.** Use your own roof area and your own local rainfall below. **Rainwater from a roof is not
> automatically safe to drink.** If you want to use it for drinking or other household uses it has to be treated, and
> some councils also require testing — check your council's requirements before you start.

**The Math:**

> Annual Harvest (L) = Roof Area (m²) × Annual Rainfall (mm) × Efficiency (%)
> One square metre of roof catches one litre per millimetre of rain, so the first two numbers give the water that
> lands on the roof. Efficiency is what you actually capture after evaporation, overflow, gutter losses and
> first-flush diversion — **there is no standard figure**: ask your supplier or installer what allowance suits your
> roof, gutters and first-flush device. For annual rainfall, use local figures for your area from your regional
> council or NIWA.

**Tank sizing:**

> Tank size depends on your roof area, your local rainfall, what you will use the water for and whether you also have
> mains water. **NZ published planning guidance (Building Performance, MBIE) — examples for each use, not
> requirements or OffGrid056 recommendations:** for garden watering, a rain barrel (generally about 240 litres) or a
> tank of 500 litres plus; for indoor supply you need a larger tank — in areas with year-round rain a 5,000-litre
> tank provides a good proportion of household use, and with dry summers 10,000 litres plus; if rainwater is your only
> water supply, at least 30,000 litres. Talk to local suppliers about the size that suits your climate and household.
> Two smaller tanks can give redundancy that one large tank cannot.

**Every figure keeps the use it belongs to** (garden / indoor supply / sole supply), and a test checks that. The
efficiency default (90%) and *"85–90% is typical"* are gone; the field is blank.

## 2. Final AU collection and tank wording

**Collection:** the same as NZ, except the drinking line — *"NSW Health, for example, recommends that people in urban
areas use the public water supply for drinking and cooking; if you plan to drink rainwater, check what applies where
you live"* — and rainfall from **the Bureau of Meteorology or your local council**.

**Tank sizing:**

> Tank size depends on your roof area, your local rainfall, what you will use the water for and whether you also have
> mains water. **There is no single Australian figure: ask local suppliers, and check what your council and your state
> or territory require.** Two smaller tanks can give redundancy that one large tank cannot.

**No symmetry was manufactured:** NZ's numbers do not appear in the AU file, and no national Australian figure was
invented. Tests enforce both.

## 3. NSW-specific wording decision

**Kept, and explicitly labelled** (ruling 11). The AU tank-placement list now reads:

> **6.** Fit closely fitting, fine insect-proof screens on all inlets and overflows, and clean them regularly —
> *NSW Health guidance, an example rather than a national rule, suggests about 1 mm*

The figure is no longer presented as a national requirement, and it is **absent from the NZ file** (which keeps its
own MBIE-sourced line: screen the inlet, keep the tank tightly covered). A test checks both halves.

## 4. Pump electrical wording

**The electrical block was not added** (ruling 9). A short market-specific line sits under the component list
instead:

| Market | Wording |
|---|---|
| **NZ** | A rainwater system that supplies the house needs a pump. Connecting it to household plumbing is work for a qualified plumber, including the backflow prevention device where there is also a mains supply. **Fixed electrical work and the pump connection must be handled by an appropriately licensed electrical worker.** |
| **AU** | A rainwater system that supplies the house needs a pump. Connecting it to household plumbing, including backflow prevention where there is also a mains supply, is work for a licensed plumber. **Fixed electrical work and the pump connection must be handled by a licensed electrician.** |

**No DIY wiring instructions**, and **the canonical electrical block is unchanged** — it is still the full block
everywhere it is used. The decision is recorded in OG-10's metadata and in the workstream safety register.

**Plumbing and consents (ruling 10).** NZ keeps the verified requirements and now says plainly that **not every tank
needs a consent**:

> Council requirements checked? (Rules differ by council, **and not every tank needs a consent — MBIE notes there is
> usually no problem installing smaller tanks for garden watering only.** Connecting rainwater to the plumbing of a
> house that also has mains water needs a building consent, and the law requires the mains supply to be isolated by a
> backflow prevention device installed by a qualified plumber. A tank on a stand over one metre high generally needs a
> consent too.)

AU stays jurisdiction-specific: *"Council, state and territory requirements checked? (Rules differ by area — contact
your local council… and ask a licensed plumber about connecting to household plumbing.)"*

## 5. Final NZ result

| Check | Result |
|---|---|
| File | `rainwater-harvesting-planner.NZ.pdf` · 7 pages |
| Title | Rainwater Harvesting Planner — OffGrid056 |
| Emergency numbers | **111 only** |
| NZ regulatory wording | building consent; backflow device by a qualified plumber; stand over one metre; not every tank needs a consent; overflow contained; some councils require testing |
| MBIE tank guidance | present and **labelled** *"NZ published planning guidance … examples for each use, not requirements or OffGrid056 recommendations"* |
| AU wording | **none**: no Bureau of Meteorology, NSW Health, licensed electrician, "1 mm", "state or territory", "no single Australian figure", 000, 112, SES |
| Removed claims | none of: 90% default, "85–90% typical", 150–300 L/day, 21–30 days, "3–7 days", "multiples of 5,000L", "many areas exempt", "Type from OG-09", "From roof to tap" |
| Blocks | Stay off the roof (page 2) · Storing drinking water (whole, page 7) |
| Pump electrical line | present |
| OG codes · tokens · VERIFY · browser-error page | none |
| Changes | all 24 applied · 0 content flags |
| Draft | yes |

## 6. Final AU result

| Check | Result |
|---|---|
| File | `rainwater-harvesting-planner.AU.pdf` · 7 pages |
| Title | Rainwater Harvesting Planner — OffGrid056 |
| Emergency numbers | **000 + 112 only** |
| NZ content | **none**: no NIWA, MBIE, 30,000 litres, 5,000-litre, regional council, "electrical worker", building consent, 111, Civil Defence, "New Zealand"/"NZ" |
| AU wording | Bureau of Meteorology; "no single Australian figure"; contact your local council; state or territory; licensed plumber; licensed electrician |
| NSW guidance | present and **labelled as NSW, not national** |
| Other checks | the same as NZ: removed claims, blocks, pump line, draft, all 24 changes |

**Checks run:** `import:verify-prep` **34/34** · all 17 resources READY · `import:verify-build` **17 records, 34
market files, 0 broken links** · the deployed PDFs are byte-identical to the checked ones · **all 32 earlier PDFs
unchanged**.

## 7. Placeholder override result

**The Stage 9.39 rule handled it. No OG-10 exception was added.**

| Build | Result |
|---|---|
| **Private preview** | OG-10 (`res-1010`) supersedes demo placeholder **`res-0016`**. Placeholder count fell 29 → **28**; the build has **45 resources** and validation passes. |
| **Public / demo** | **unchanged**: 30 resources, all demo. `/resources/rainwater-harvesting-planner/` is still the placeholder, with its "DEMONSTRATION ENTRY" text and demo PDF. No OG-10 PDFs, no market files, no real records. |
| Real vs real · placeholder vs placeholder | still **fail the build** (tested) |

**Routing verified in the exact build before deploying:**

| Check | Result |
|---|---|
| OG-10 appears | **once** — one card on Downloads, one on the Water foundation page, one route directory |
| The route resolves to | **OG-10**: Draft, Intermediate, "30 min", no demo text, no OG code |
| Market routing | no market → **no file**; NZ → NZ only; AU → AU only |
| Water pathway | **Water Basics** learning path → OG-10 |
| Programme day 11 | → OG-10 |
| Water Security Guide | → OG-10 |
| Demo PDF links anywhere | **0** |

## 8. Deployment result

**Success.** After deploying, every unauthenticated request was redirected (302) to the Access login: `/`,
`/downloads/`, the OG-10 page, both OG-10 PDFs, and programme day 11.

**Records:** all 17 are draft.

## 9. Worker version

**`d993cb64-676a-46bc-80eb-f4c9850fb0ea`**

## 10. OG-10 route

`/resources/rainwater-harvesting-planner/` (behind Access; the demo placeholder still holds that route in the public
build)

## 11. Protected resource count

**17** draft resources: OG-02, OG-08, **OG-10**, OG-11, OG-15, OG-18, OG-19, OG-20, OG-21, OG-22, OG-25, OG-26,
OG-27, OG-B04, OG-B07, OG-B10, OG-B12.

## 12. Tests

**328 passed** (324 + 4). Lint and typecheck clean.

**The four new tests** cover the rulings: MBIE's figures presented as guidance and examples with each use attached,
and absent from AU; the 1 mm screen figure labelled NSW-specific and absent from NZ; the pump line per market, with no
DIY wiring and the "not every tank needs a consent" point; and "what lands on the roof is not what you can use" in
both markets.

**Other status:** `--real` refused · OG-10 private files in git: **0** · public/demo build unchanged.

## 13. Rollback confirmation

**`a65a1ef1-feea-4e89-9d96-c16b8db40336`** (16 resources) is in the deployment history. Its private files are in
`workspace/backups/private-assets-a65a1ef1` (48 files), and its 32 PDFs are byte-identical to the new build's.
Rolling back also restores the demo placeholder on the rainwater route, because the placeholder record was never
changed. The new live state is backed up in `workspace/backups/private-assets-d993cb64` (51 files).

## 14. Recommendation for the OG-09 research stage

**Run a research-only stage for water treatment before preparing OG-09.** OG-09 is a filtration comparison, so it is
treatment teaching from end to end, and the approved drinking-water block deliberately stops at storage.

**What to research, per market, and never crossed:**

| Topic | NZ | AU |
|---|---|---|
| What makes water safe to drink | Taumata Arowai acceptable solutions for roof water; MBIE's treatment options (chlorine, fine filter, boiling one minute, UV); Health NZ household supplies | enHealth guidance on rainwater tanks; NSW Health's rainwater treatment guide; HealthyWA emergency treatment (boil vigorously for at least one minute) |
| Filters | whether any official source states ratings (microns) — do not assume | the same |
| UV | when official guidance requires or recommends it | the same |
| Chemical dosing | the NZ stored-water bleach method already approved is **for storage, not treatment** — treatment dosing must be sourced separately | WA's ratios depend on bleach strength; no single AU ratio |
| Testing | NZ: annual testing advice; some councils require it | state and territory health advice |
| Boiling | one minute (MBIE) | at least one minute, vigorously (HealthyWA) |

**Deliverables:** verified NZ and AU wording for a proposed `water-treatment` block, each sentence quoted with its
source and date, plus a claims table for anything OG-09's own text asserts (filter ratings, pore sizes, removal
percentages, costs, lifespans).

**Gate:** owner approval of the wording before any OG-09 migration. Until then OG-09 stays blocked, and OG-10 and
OG-08 keep pointing at the approved storage block only.

**Alternative next stages, if you would rather not start treatment research now:** **OG-B08 Water Tank Sizing &
Placement Guide** (no new safety research; drinking-water and working-at-height blocks already approved) or
**OG-13 Healthy Home Air Audit** (the first Air resource; the foundation is still empty).

**Stopped. OG-09 and OG-B08 not prepared.**

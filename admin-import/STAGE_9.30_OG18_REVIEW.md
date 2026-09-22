# OG-18 — SOLAR POWER 101 WORKBOOK · CLAIMS-FIRST REVIEW · NOT DEPLOYED

OG-18 is ready for your review as **PREVIEW_WITH_PROPOSED_COPY**. Its 29 proposed changes appear in the NZ and AU
previews so you can see them, but none is approved yet.

**What the audit found:**

1. **The sizing maths assumes the same sunlight everywhere.** Every sizing row divides by *"4 peak sun hours"*, and
   the off-grid row adds an unsourced *"× 1.5 (winter buffer)"*.
2. **Every dollar figure is unsourced NZ pricing**, and it also appears in the AU file: per-kW costs, prices for 3,
   5 and 8 kW systems, battery add-on costs, and *"Payback period: 7–10 years"*.
3. **The AU file opens with "Solar in New Zealand"**, including NZ sunshine hours and an Auckland generation figure.
4. **It overstates backup.** It says *"With batteries, you store it for night and outages"*, and one sentence shows
   a visible code: *"Batteries (covered in OG-19)"*.
5. **Some of its roof guidance is correct.** Its roof-direction guidance matches official NZ and AU sources, and its
   30–45° tilt figure is confirmed for NZ.

**Safety:** both blocks it needs (electrical, and working at height) are already approved. **One detector result
needs your decision:** it asks for the food-safety block because of a single table row. See §6.

**Live preview unchanged:** `e175bc11`, 11 resources.
**Date:** 22 September 2026

---

## 1. OG-18 audit

| | |
|---|---|
| Title | **Solar Power 101 Workbook** |
| Group | re-skin group B |
| Source | HTML/PDF pair; audit text similarity 0.97 |
| Structure | 21 fields, 3 tables, 7 pages |
| Intro box | "Solar in New Zealand" |
| Step 1 | roof suitability (6 questions) |
| Step 2 | energy consumption profile (6-row table plus a daily average) |
| Step 3 | system size calculator (4 rows) |
| Step 4 | cost estimator (6-row table plus "Typical NZ Pricing") |
| Decision | My Solar Decision (5 fields) |
| Closing | "Day 18 Complete" |
| Audit safety note | *"covers batteries and inverters (16 mentions) with no licensed electrician warning for fixed wiring"* |
| Legacy navigation | "Week 3 — Shelter, Heating & Energy" · "OffGrid056 30-Day Programme" · "Asset OG-18 \| Day 18" ×2 · "Day 18 Complete" · *"Tomorrow: storing that solar energy…"* · *"Next: OG-19 Battery Backup Planner →"* · the visible *"(covered in OG-19)"* in the text |
| Legacy branding | colours and fonts; the re-skin handles these |
| Not present | Action Plan Plus, Skool, old tiers, old CTAs, outdated platforms |
| Products, brands, retailers, installers | **none named**, so §10 of your brief doesn't apply |

**Its method is sound.** It works from the household's real electricity use, asks what can shift to daylight, turns
that into a rough system size, and ends with getting quotes from three suppliers. **The problems are the fixed
figures and the NZ-only content.**

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | Solar Power 101 Workbook | **SOURCE** |
| ID / slug | res-1018 · `solar-power-101-workbook` | |
| Foundation | energy | audit HIGH |
| Type | **workbook** | audit MEDIUM; the document calls itself a workbook, and it's an existing library type |
| Category | **solar** (*"Understanding solar for your home."*) | **INFERRED**; the same category as OG-B07 |
| Difficulty | recommend **beginner** | **OWNER-REVIEW REQUIRED** (none stated) · INFERRED from "101" and "introduces solar" |
| Time | recommend **30 min** | **OWNER-REVIEW REQUIRED** · INFERRED: 6 roof questions, a 6-row estimate from a power bill, 4 sizing rows, a cost table, 7 decision fields. Excludes gathering bills and quotes. |
| Description | *"Sunlight falls on your roof every day. This workbook introduces solar: how it works, what shapes the cost, and whether your home is suitable."* | **PROPOSED**, to match proposed change 3. The original was *"…free, infinite… demystifies… what it costs…"*. |
| Tags | none | none invented |
| Related | Solar Planning Deep Worksheet · Battery Backup Planner | **PROPOSED** (§3) |
| PDF title | Solar Power 101 Workbook — OffGrid056 | standard |

## 3. Relationship to OG-B07, OG-19 and OG-26

**Recommendation: make OG-18 the primary introductory solar resource.** Later solar and battery resources link back
to it. **The three resources barely overlap:**

| | OG-18 Solar 101 (introduction) | OG-B07 Deep Worksheet (advanced) | OG-19 Battery Planner |
|---|---|---|---|
| Roof | a 6-question *suitability* check | *measurements* for installers (area, pitch, azimuth, material, warranties) and shading by time of day | — |
| Electricity use | whole-house monthly use by category, and what can shift to daylight | annual bill, for payback | *essential loads* only (W × hours), for backup |
| Sizing | a rough first estimate of panel kW | — (from quotes) | battery kWh from essential loads |
| Money | compare three quotes; payback *target* | payback *calculation* | quoted battery cost |

- **What OG-18 adds:** it's the only resource that explains how solar sizing works. OG-B07 assumes the member already
  knows, and OG-19 starts once solar is chosen.
- **What I'm not changing:** I haven't moved any teaching between resources. The one duplication, a short roof check
  in both OG-18 and OG-B07, is intentional: the introduction asks *"is my roof suitable?"* and OG-B07 records *the
  numbers for installers*.
- **OG-26:** its Tier 2 line *"Grid-tied solar sized to your household's use"* is sized in OG-18. There's no
  conflict.
- **Proposed links:** OG-18 lists OG-B07 and OG-19 as related.

**Your decision, for later:** adding OG-18 as a related resource on the **deployed** OG-B07 and OG-19 records, so
they link back to it. That changes live records, so I haven't done it.

## 4. Technical-claims table

| # | Exact original | Classification | NZ source | AU source | Action |
|---|---|---|---|---|---|
| C1 | *"NZ receives approximately 1,400–2,000 sunshine hours annually depending on region."* | universal (national climate) | not checked, because not needed | n/a, NZ-only | **REMOVE**. Rewritten without numbers: *generation depends on where you live, roof direction and tilt, shading, and the season*. |
| C2 | *"A typical 5kW residential solar system in Auckland generates 6,500–7,500 kWh per year"* | generation claim | none | n/a | **REMOVE** |
| C3 | *"— enough to cover most household consumption"* | universal | none | none | **REMOVE** |
| C4 | *"With grid-tie, you sell excess back."* | export | EECA: sell unused solar *"back to your power company"* | energy.gov.au: exports; the retailer's *"feed-in tariff"* | **REWRITE** per market |
| C5 | *"With batteries, you store it for night and outages."* | backup | EECA: *"solar without battery will not provide power during an outage"*; prioritise a *"backup-capable inverter"* | energy.gov.au: *"Many grid-connected solar systems shut down…"*; *"Even some battery systems won't power your property during an outage."* | **REWRITE**: *"…only if the system is designed to provide backup power: solar panels on their own will not."* |
| C6 | *"Roof direction (North is ideal; East/West acceptable; South poor)"* | orientation | **VERIFIED** (EECA: ideal north, northeast or northwest; good west or east; poor south) | **VERIFIED** (energy.gov.au: north usually most; south generates less) | **KEEP** |
| C7 | *"Roof pitch / angle (30–45° is ideal in NZ)"* | tilt | **VERIFIED** (EECA: *"A steep roof tilt of 30° to 45° generates maximum electricity"*) | **no single AU figure** (it varies by location) | **KEEP in NZ**, adding where to get the figure; **REMOVE the number in AU** |
| C8 | *"Approximate usable roof area (m²)"* | roof space (fill-in) | — | — | **KEEP**. Members get it from plans or installers (the approved roof note). |
| C9 | *"Roof condition (… structural soundness)"* | roof assessment | EECA: condition over 10 years | energy.gov.au: repair before panels go on | **REWRITE**: ask your installer to check |
| C10 | *"Switchboard capacity (when was it last inspected?)"* | electrical | — | — | **REWRITE**: the installer checks; licensed electrical worker (NZ) / licensed electrician (AU) |
| C11 | *"Monthly kWh (from bill)"* per category | calculation input | a bill shows the total, not categories | the same | **REWRITE**: *"Estimated monthly kWh"* |
| C12 | *"Monthly total ÷ 30 days"* | calculation | — | energy.gov.au: total ÷ days *in the billing period* | **REWRITE** |
| C13 | *"÷ 4 peak sun hours"* ×3 and *"÷ 4"* | system-sizing assumption | none | energy.gov.au: generation varies by region (Sydney, Brisbane, Hobart examples) | **REWRITE**: *"÷ peak sun hours for my area"*; ask your installer |
| C14 | *"× 0.5 / × 0.75 / × 1.0"* | the member's own goal | — | — | **KEEP_AS_EXAMPLE** |
| C15 | *"Offset 50% / 75% / 100% of bill"* | percentage savings | — | energy.gov.au: best value comes from using solar on site, not exporting it | **REWRITE**: *"Generate about half / three-quarters / all my daily use"* |
| C16 | *"Full off-grid: Daily use × 1.5 (winter buffer) ÷ 4"* | system sizing | EECA: *"a very large solar system with batteries"* | energy.gov.au: *"Designing an off-grid system requires specific expertise"* | **REWRITE**: *"Not a simple formula — needs a specialist design…"* |
| C17 | *"A "100% offset" system means you generate enough over 24 hours…"* | generation vs timing | — | — | **REWRITE** to match the renamed row. The teaching is kept. |
| C18 | Panel, inverter, mounting, electrical and consent costs ($1,800–$2,500/kW … $300–$800) | costs | none | none | **REMOVE**: compare three quotes |
| C19 | *"Typical NZ Pricing (2025)"*: 3/5/8 kW prices; *"Payback period: 7–10 years"*; *"Add $8,000–$15,000 for battery storage"* | costs, payback | none | n/a (NZ-only) | **REMOVE**. Replaced by "Comparing quotes" (EECA checklist; energy.gov.au). |
| C20 | *"Answer honestly — any "No" is a solvable problem"* | encouragement | EECA: a non-ideal roof *"doesn't mean solar is a no-go"* | — | **KEEP**. It's slightly optimistic, so flagged for your judgement. |
| C21 | *"Payback target (years)"* | the member's own target | — | — | **KEEP** |

**Not in the source:** panel wattage, panel efficiency, inverter efficiency, loss percentages, battery-charging
assumptions, lifespan, warranty claims, rebates or subsidies. **No new figures were introduced anywhere.** System
losses are named in words only, with no number.

**Sizing now asks members to consider** (your §6):

- household use, from their bill
- daytime versus evening use: the existing *"Can it shift to daylight?"* column
- roof and site conditions (Step 1)
- export arrangements (new decision field)
- battery plans (system type, plus the new backup field)
- future load growth (new field)
- the installer's own design and assumptions

## 5. Grid / hybrid / off-grid assessment

**Distinction:** clear. The decision field keeps *"□ Grid-tie only □ Grid-tie + battery □ Off-grid"*.

**Overstatements corrected** (the OG-19 rule carried forward):

- The intro box: *"With batteries, you store it for night and outages"*.
- The Reality Check's *"Batteries … solve the timing problem"*. It now adds *"Solar panels on their own will not
  power your home during a grid outage: backup depends on the battery, the inverter and how the system is set up."*
- **New:** *"Do I need backup power during outages? … not every system provides it"*. energy.gov.au says to tell
  the installer if you need backup.

**Off-grid:** now presented as a specialist design, not a formula. Both official sources mention generators for
off-grid backup, but **I haven't added a generator mention**, so OG-18 doesn't trigger the generator safety block.

## 6. Required safety blocks

| Block | Needed? | Why |
|---|---|---|
| **Batteries and electrical safety** (approved) | **YES** | Inverters, batteries, switchboard and grid-tie are discussed throughout |
| **Stay off the roof** / working at height (approved) | **YES** | Step 1 asks about roof pitch, area and condition. The approved OG-B07 roof note is added word for word under the roof checklist. |
| Emergency + disclaimer | yes | every resource |
| Generator / CO / indoor combustion | **no** | no generator content (the only mention was removed with the navigation, and none was added) |
| **Food safety in a power cut** | **no, in my assessment. Your decision needed.** | See below |

**The detector result.** Prep marks OG-18 as needing **food-safety-power-cut**. The trigger is the words "fridge"
and "freezer" appearing three or more times. OG-18's only mention is **one row label**, "Fridge / freezer", in the
consumption table, and it's counted in both the PDF and the HTML. OG-18 says nothing about keeping food safe in a
power cut.

**As you instructed, I've flagged this and haven't added a block.** Until you decide, prep marks both markets
"blocked", so OG-18 cannot be deployed.

**My recommendation:** approve an **OG-18-only, recorded exemption** for this block, with that reason, rather than
adding an unrelated block. Your alternative is to add the already-approved food block.

## 7. NZ / AU differences

| Area | NZ | AU |
|---|---|---|
| Intro and export | sell unused solar *"back to your power company"* | exported to the grid; *"your electricity retailer may pay you a feed-in tariff"* |
| Roof tilt | *"30–45° is ideal in NZ — from plans or your installer"* (EECA) | *"from plans or your installer"* (no national figure) |
| Switchboard | *"licensed electrical worker"* | *"licensed electrician"* |
| Consent row | *"Consents and inspection (if required)"* | *"Permits, approvals and inspection (if required)"*. No national rule, because it varies by state and territory (as OG-27 AU). |
| Export field | *"the buy-back rate my power company pays … and any export limit"* | *"the feed-in tariff my electricity retailer pays, and any export limit set by my distribution network"* |
| Removed from both | NZ pricing, NZ sunshine hours, Auckland figure | the same; none of it remains in AU |
| Emergency / agency | 111 · Civil Defence | 000 + 112 · SES |

**Also:**

- **Rebates and subsidies:** none in the source, and none added. That includes AU's Small-scale Renewable Energy
  Scheme, which energy.gov.au mentions.
- **Products:** none.
- **Building and planning terms:** only the consent row above.
- **Retailers and distributors:** NZ uses "power company", as EECA does. AU uses "electricity retailer" and
  "distribution network", as energy.gov.au does.

## 8. Exact proposed copy changes (29; PROPOSED, not approved)

Each change was checked against the **re-skinned** source before being recorded, and all 29 apply.

**Market-specific:**

- NZ + AU pairs: intro box (5–6), roof pitch (8–9), switchboard (11–12), cost table (22–23), decision fields (25–26).

**New teaching, for you to approve or strike individually:**

- 7: the approved roof note
- 19: the peak-sun-hours note
- 25–26: three new decision fields
- 24: the "Comparing quotes" box

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 3 — Shelter, Heating & Energy | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Cover subtitle | Sunlight is free, infinite, and falls on your roof every day. This workbook demystifies solar: how it works, what it costs, and whether your home is suitable. | Sunlight falls on your roof every day. This workbook introduces solar: how it works, what shapes the cost, and whether your home is suitable. |
| 4 | Page headers ×2 | Asset OG-18 \| Day 18 | *removed* |
| 5 | Intro box — **NZ** | **Solar in New Zealand**: NZ receives approximately 1,400–2,000 sunshine hours annually depending on region. A typical 5kW residential solar system in Auckland generates 6,500–7,500 kWh per year — enough to cover most household consumption. With grid-tie, you sell excess back. With batteries, you store it for night and outages. | **What affects how much solar you get**: How much electricity a solar system generates depends on where you live, the direction and tilt of your roof, shading, and the season. With a grid connection, you can sell solar electricity you don't use back to your power company. A battery lets you store solar electricity for the evening. It can also keep essentials running during an outage — but only if the system is designed to provide backup power: solar panels on their own will not. |
| 6 | Intro box — **AU** | the same | the same, except: *"With a grid connection, solar electricity you don't use can be exported to the grid, and your electricity retailer may pay you a feed-in tariff for it."* |
| 7 | Roof check — under the subtitle | Answer honestly — any "No" is a solvable problem | the same, then: *Use existing plans, ground-based estimates, or measurements provided by your installer.* (the approved OG-B07 note) |
| 8 | Roof pitch — **NZ** | Roof pitch / angle (30–45° is ideal in NZ) | Roof pitch / angle (30–45° is ideal in NZ — from plans or your installer) |
| 9 | Roof pitch — **AU** | the same | Roof pitch / angle (from plans or your installer) |
| 10 | Roof condition | Roof condition (age, material, structural soundness) | Roof condition (age, material, and whether it needs repair before panels go on — ask your installer to check) |
| 11 | Switchboard — **NZ** | Switchboard capacity (when was it last inspected?) | Switchboard (ask your installer whether it needs checking or upgrading — this is work for a licensed electrical worker) |
| 12 | Switchboard — **AU** | the same | Switchboard (ask your installer whether it needs checking or upgrading — this is work for a licensed electrician) |
| 13 | Consumption column | Monthly kWh (from bill) | Estimated monthly kWh |
| 14 | Daily average | Monthly total ÷ 30 days | Total kWh on your bill ÷ number of days in the billing period |
| 15 | Sizing row 1 | Offset 50% of bill · Daily use × 0.5 ÷ 4 peak sun hours | Generate about half my daily use · Daily use × 0.5 ÷ peak sun hours for my area |
| 16 | Sizing row 2 | Offset 75% of bill · Daily use × 0.75 ÷ 4 peak sun hours | Generate about three-quarters of my daily use · Daily use × 0.75 ÷ peak sun hours for my area |
| 17 | Sizing row 3 | Offset 100% of bill · Daily use × 1.0 ÷ 4 peak sun hours | Generate about all my daily use (averaged over the year) · Daily use ÷ peak sun hours for my area |
| 18 | Sizing row 4 | Full off-grid · Daily use × 1.5 (winter buffer) ÷ 4 · [input] · ___ kW | Full off-grid · Not a simple formula — needs a specialist design for your lowest-generation season, with battery storage · — · Ask a specialist |
| 19 | Note under the sizing table | *(none)* | Ask your installer for the peak sun hours where you live. Treat this as a first estimate only: real generation also depends on your roof, shading, the season and losses in the system, and installers use design software for your site — ask what assumptions their estimate is based on. |
| 20 | Reality Check | A "100% offset" system means you generate enough over 24 hours to cover consumption — but timing matters. | A system sized to cover all your daily use generates that total over the day — but only while the sun is up, so timing matters. |
| 21 | Reality Check | Batteries (covered in OG-19) solve the timing problem. | A battery can help with the timing — see the Battery Backup Planner. Solar panels on their own will not power your home during a grid outage: backup depends on the battery, the inverter and how the system is set up. |
| 22 | Cost table — **NZ** | Component · Per-kW Cost · My System Size · Estimated Cost, with $1,800–$2,500/kW, $1,000–$2,500, $500–$1,000, $500–$1,500, $300–$800 | Component · Quote 1 · Quote 2 · Quote 3, all fill-ins; the same rows, with *"Consents and inspection (if required)"* |
| 23 | Cost table — **AU** | the same | the same, with *"Permits, approvals and inspection (if required)"* |
| 24 | Pricing box | **Typical NZ Pricing (2025)**: 3kW system: $6,000–$8,500 \| 5kW system: $9,000–$13,000 \| 8kW system: $14,000–$20,000 / Payback period: 7–10 years depending on region, electricity rates, and usage pattern. Add $8,000–$15,000 for battery storage. | **Comparing quotes**: Ask for written quotes that list everything included. Compare the system size, the parts, the estimated yearly generation and savings, and the assumptions each estimate is based on. Prices change, so rely on current quotes rather than published price ranges. |
| 25 | Decision — **NZ** (new fields after "System type") | — | *Do I need backup power during outages? □ Yes □ No — if yes, tell every installer: not every system provides it* · *Ask each installer: the buy-back rate my power company pays for exported solar, and any export limit* · *Future changes that could increase my electricity use (for example an electric vehicle, a heat pump, or more people at home)* |
| 26 | Decision — **AU** | — | the same, except: *Ask each installer: the feed-in tariff my electricity retailer pays, and any export limit set by my distribution network* |
| 27 | Closing heading | Day 18 Complete | Solar Workbook Complete |
| 28 | Closing text | You now know your roof's suitability, your consumption profile, your ideal system size, and a realistic budget. Tomorrow: storing that solar energy for when the sun goes down. | You now have your roof details, your consumption profile, a first estimate of system size, and a way to compare quotes. |
| 29 | Next link | Next: OG-19 Battery Backup Planner → | *removed* |

**Sources read directly this stage:**

- **EECA,** [Plan your solar system](https://www.eeca.govt.nz/for-homes/solar-for-homes/plan-your-solar-system/): roof
  direction, tilt, condition, space; resilience; grid and off-grid; future needs.
- **EECA,** Residential solar PV purchasing checklist (August 2025): written quotes; what the quote includes.
- **energy.gov.au,** [Size your solar system](https://www.energy.gov.au/solar/solar-system-design/size-your-solar-system):
  daily use per billing period; regional generation; installer software and assumptions; network export limits;
  accredited installers.
- **energy.gov.au,** [Design considerations](https://www.energy.gov.au/solar/solar-system-design/design-considerations):
  roof direction, slope, condition; backup in outages; grid-connected vs off-grid.

## 9. NZ PDF readiness

| Check | Result |
|---|---|
| File | `solar-power-101-workbook.NZ.pdf` |
| Pages | 7 |
| Title | Solar Power 101 Workbook — OffGrid056 |
| Emergency numbers | 111 only |
| Other market's terms | none: no licensed electrician, feed-in tariff, distribution network, permits, SES, 000 or 112 |
| Electrical and roof blocks | present; *"Stay off the roof"*, then the roof note |
| Removed figures and prices | **none present** (53 terms checked) |
| Legacy navigation · OG codes · tokens · VERIFY · browser-error page | none |
| Changes | all 29 applied |

**Layout:**

| Page | Content |
|---|---|
| 2 | safety blocks and intro |
| 3 | roof check |
| 4 | consumption table with its daily total |
| 5 | sizing table, note and Reality Check |
| 6 | cost table, "Comparing quotes", Decision |
| 7 | the rest of the Decision box and the closing |

**Status: PREVIEW_WITH_PROPOSED_COPY.** It is also blocked by the food-safety detector result (§6), and difficulty
and time are unset.

## 10. AU PDF readiness

| Check | Result |
|---|---|
| File | `solar-power-101-workbook.AU.pdf` |
| Pages | 7 |
| Title | Solar Power 101 Workbook — OffGrid056 |
| Emergency numbers | 000 + 112 only |
| Other market's content | **no "New Zealand" or "NZ" anywhere** (the verifier now checks this); no 111, Civil Defence, electrical worker, power company, buy-back, consents, or 30–45° |
| Electrical and roof blocks | present |
| Other checks | the same as NZ: no removed figures or prices, no legacy navigation, codes, tokens, VERIFY or browser error; all changes applied |
| Layout | the same as NZ |

**Status: the same as NZ.**

## 11. Tests and tooling

**264 passed** (260 + 4). Lint and typecheck clean. **`import:verify-prep`: 24/24.**

**The four new OG-18 tests** check its copy changes, whether they are still proposals or already approved:

1. None of the removed figures, prices or navigation can come back.
2. Each market keeps its own terms.
3. Wording that solar panels alone give backup power can't come back.
4. OG-18 uses only its two approved safety blocks.

**Verifier changes this stage:**

- **New check: a file may not name the other market.** An AU file can't say "New Zealand", "Aotearoa" or "NZ", and
  an NZ file can't say "Australia" or "AU". The first version was case-sensitive. **A planted proof caught that**: it
  missed the heading printed as "SOLAR IN NEW ZEALAND". Fixed; the planted file then failed, and all 24 real files
  still pass.
- **Input placeholders:** the verifier now reads an empty input as its placeholder text, as it prints.
- **Page-break markers:** the extractor's "-- 6 of 7 --" markers no longer break wording that crosses a page.
- **The cost table is now two market-specific replacements.** Before, a shared table was edited again per market;
  now every recorded change can be checked on its own.

**Other notes:**

- **Fonts and cover:** prep doesn't copy these into a new resource's folder. As before, they were copied from OG-19,
  which uses the same Week 3 cover.
- **The check that no unapplied changes remain** is still in place.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `e175bc11` |
| Deployed resources | the 11 are unchanged; the build verifies as 11 records, 22 files, 0 broken links |
| Access | still blocks, including OG-18's would-be URL and PDF |
| OG-18 in GitHub | 0 files |
| `private-assets/` tracked in git | 0 files |
| `--real` | refused |

**A note on the browser check:** one attempt to open a PDF in the browser pane showed you a download dialog instead.
Nothing was saved, and nothing needs saving.

## 12. Deployment recommendation

**Do not deploy OG-18 yet.** It needs these decisions:

1. **The 29 changes.** I recommend approving all of them. The ones that matter most:
   - **2, 5–6, 22–24:** remove the NZ pricing and NZ-only content from the AU file.
   - **15–18:** replace the fixed "4 peak sun hours" and "winter buffer".
   - **5–6 and 21:** the backup correction.

   Changes 19, 24, 25–26 are new teaching; approve or strike each one.
2. **Metadata:** beginner, 30 min, category solar, type workbook.
3. **The food-safety detector result:** I recommend an OG-18-only recorded exemption (§6).
4. **Optional, later:** link OG-B07 and OG-19 back to OG-18. That changes deployed records.

**After your decisions:** approve, re-render, verify the exact build, then deploy as the **12th** resource with
rollback to `e175bc11`.

**Stopped. OG-18 not deployed. OG-20 not started.**

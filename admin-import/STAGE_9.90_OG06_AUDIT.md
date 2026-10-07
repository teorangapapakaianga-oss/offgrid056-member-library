# Stage 9.90 — OG-06 claims-first audit

**Date:** 8 October 2026 · **Audit only. OG-06 was not rewritten, migrated, rendered, staged or deployed; no live resource, register or count changed.** Live baseline confirmed: 25 protected resources · 50 market files · 0 broken links · Bucket C 0 (live library) · 918 tests passing · Worker `2fb0663d-a7da-4acf-ba4c-957886b21631` (100%), rollback `65437c37-b731-4851-b67e-5b0fae79fe12`. Migration states unchanged (25 / 0 / 0 / 1 / 1 / 18 = 45). The Stage 9.89 tooling decisions are intact.

## 1 · Exact legacy title and source

Not inferred; read from the file. The source uses three wordings:
- HTML `<title>`: **"OG-06 72-Hour Emergency Action Checklist — OffGrid056"**
- Cover heading: **"72-Hour Emergency Action Checklist"**
- Page header: **"72-Hour Emergency Checklist"** · "Asset OG-06 | Day 6" (Week 1 — Foundation); the file name and the resource register say "72-Hour Emergency Checklist".

Source: `…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-06_72Hour_Emergency_Checklist.html` (13,523 bytes) and `…\OffGrid056\PDFs\OG-06_72Hour_Emergency_Checklist.pdf` (447,269 bytes). Read in full; the PDF and HTML carry the same content (the safety detector reads the same topics from both).

## 2 · Purpose and primary output

A **one-to-two-page household emergency-readiness checklist** from the old programme (Week 1, Day 6): a printable, tickable list of what to have for a three-day emergency (water, food, shelter and warmth, communication and safety), plus four fill-in lines for **where the kit is kept** and where the household meets if the house is unsafe. **Primary output: a checklist** (emergency readiness) with member-written kit locations. It is not an assessment (no scoring), not a plan or a schedule, and not education. The legacy wrapper also frames it as the programme's anchor ("If you complete nothing else in this programme, complete this").

## 3 · Complete legacy content inventory

| # | Legacy item | Class | Note |
|---|---|---|---|
| 1 | "Week 1 — Foundation", "OffGrid056 30-Day Programme", "Asset OG-06 \| Day 6", "OFFGRID056.COM" | **REMOVE** | old programme labels (content flags: programme-sequencing ×3) |
| 2 | Title in three variants (above) | **REWRITE** | one member-facing title; "Action" and "Checklist" are the legacy's own |
| 3 | Subtitle: "The first 72 hours are the most critical. This checklist ensures you can survive and communicate through the worst 3 days without outside help." | **REMOVE** | survival claim, a fixed emergency period, "worst", and an outcome promise ("ensures") |
| 4 | "Print This. Laminate It. Keep It Visible." + "In a real emergency your phone may be dead… A physical checklist… is worth more than any app." | **REWRITE** | keep print-and-keep-visible; drop the "worth more than any app" claim |
| 5 | "The 72-Hour Standard: Emergency management agencies worldwide use the 72-hour window as the critical self-sufficiency period. Help may not reach you for 3 days." | **REMOVE / VERIFY** | an unsourced "worldwide" claim and a fixed period; the library already carries sourced, per-market three-day baselines (§12) |
| 5a | Four summary boxes: **Water** "10L per person per day · 3 people = 90 litres total · store in multiple containers"; **Food** "no-cook options preferred · canned, dried, energy bars · manual can opener essential"; **Shelter/Warmth** "one warm room strategy · sleeping bags + blankets · torches + candles + matches"; **Communication** "phone power bank charged · radio (battery or wind-up) · local emergency frequency known" | **REMOVE / REWRITE** | water box conflicts with approved baselines (§12); candles and matches are an open-flame instruction; "essential" and "preferred" are unsupported emphasis |
| 6 | **Water checklist (5):** stored water "10 litres per person per day × 3 days = ___ litres" | **REMOVE the formula; KEEP_AS_MEMBER_INPUT the blank** | the 10 L/day figure conflicts with both markets' approved figures |
| 6a | containers checked (no leaks, clean, food-grade plastic or glass) | **VERIFY** | covered by the approved stored-drinking-water block when taught |
| 6b | backup source: "rainwater tank, creek, neighbour, swimming pool" | **REMOVE** | untreated sources named with no treatment guidance; a pool is not a drinking source |
| 6c | filtration ready: "boiling, tablets, filter, or UV pen" | **REMOVE** | water-treatment teaching (the library's water-treatment block and OG-09 own it) |
| 6d | "Hot water cylinder counted: Typical cylinder = 180L emergency reserve" | **REMOVE** | unsourced figure and an NZ term; OG-08 already has an emergency-only cylinder row with member-entered values |
| 7 | **Food checklist (4):** "3 days of meals that need no refrigeration or cooking" | **REWRITE** | a supply-duration target; the library has approved NZ and AU three-day food baselines (OG-11) |
| 7a | manual can opener "at least 2 (one in kitchen, one in kit)" | **REWRITE** | keep the item, drop the number |
| 7b | infant / pet / special diet "3-day supply of formula, pet food, or special items" | **REWRITE → KEEP_AS_MEMBER_INPUT** | another supply target; make it a tick-and-write item |
| 7c | "Rotate dates checked: Nothing expires within 6 months" | **REMOVE** | unsourced interval (Bucket C) |
| 8 | **Shelter & Warmth checklist (6):** "One warm room identified: smallest room, fewest windows, south-facing if possible" | **VERIFY / REMOVE** | unsourced advice; the library's warm-home content owns heating |
| 8a | "Alternative heat source: Fireplace, wood burner, gas heater, or camping stove" | **REMOVE** | recommends indoor combustion with no safety guidance; **contradicts the approved indoor-combustion and carbon-monoxide wording** (§12) |
| 8b | sleeping bags rated for your winter low; torches + spare batteries (one per person minimum) | **REWRITE** | keep as plain tick items; drop "minimum" and "rated" |
| 8c | "Candles + matches: stored safely, accessible in darkness" | **REMOVE** | open flame during an outage is a fire hazard (fire-and-smoke topic); torches already cover light |
| 8d | "Tarps + rope: for roof leaks, broken windows, draft blocking" | **REMOVE** | invites temporary repairs, including at height (working-at-height topic) |
| 9 | **Communication & Safety checklist (6):** "Phone power bank: 10,000mAh minimum, charged, cable attached" | **REWRITE** | drop the specification; keep "charged power bank" |
| 9a | "Battery or wind-up radio: for civil defence broadcasts" | **REWRITE** | "civil defence" is New Zealand usage (§11) |
| 9b | "Smoke alarms tested: push the button, hear the beep" | **REMOVE / point to OG-13** | OG-13 already carries sourced, per-market alarm maintenance (testing, expiry, replacement) |
| 9c | "CO detector tested: battery good, less than 5 years old" | **REMOVE / point to OG-13** | the "5 years" is unsourced (Bucket C); the library carries CO wording in its blocks |
| 9d | "Fire extinguisher accessible: kitchen and sleeping areas" | **REMOVE / VERIFY** | a fire-safety recommendation with no approved wording in either market |
| 9e | "First aid kit stocked: check expiry dates on medications and bandages" | **REWRITE** | keep as a plain tick item |
| 10 | **"My 72-Hour Kit Location"** — where my emergency water is stored · where my emergency food is stored · where my torches, radio and power bank live · where my family will gather if the house is unsafe | **KEEP_AS_MEMBER_INPUT** | the resource's unique kernel: four member-written lines, no claims |
| 11 | "Laminate & Post: print, laminate, stick to your fridge… everyone in the household should know where to find it." | **REWRITE** | keep the idea; trim |
| 12 | "Day 6 Complete… If you complete nothing else in this programme, complete this. It is the foundation everything else builds on." | **REMOVE** | programme claim; contradicts the library's own journey (content flag: day-complete) |
| 13 | "Next: OG-07 Week 1 Priority Lock Worksheet →" | **REMOVE** | obsolete code (content flags: next-link, cross-reference); OG-07 is not migrated |
| 14 | Duplicate material | **NOTE** | the water and food figures duplicate OG-08 and OG-11 (and conflict with them); the alarm, CO and heat items duplicate OG-13, OG-15 and the safety blocks; the cylinder row duplicates OG-08 |

No price, product, sales language or external link. No Simply Services, HTPS or Skool reference. 21 checklist items, 4 summary boxes, 4 kit-location lines.

## 4 · Five Foundations

**general (cross-foundation).** The checklist spans water, food, shelter and warmth, energy (torches, power bank, radio) and household safety; no single foundation is the subject. Not forced.

## 5 · Program Component

**resilience-emergency** (best fit; OWNER-REVIEW REQUIRED). Applying the locked rule: the primary output is emergency preparation for an outage or disruption, with immediate household readiness, which is exactly the definition ("outages, emergency food, emergency water, household safety, smoke alarms, emergency lighting, evacuation, communication and short-term disruption"). OG-11 (emergency food) is already resilience-emergency. Not resilience-planning (no assessment or phased plan), not planning-implementation (no schedule or budget), not off-grid-living, not advanced-future.

## 6 · Member journey

The current protected journey is OG-01 → OG-02 → OG-04 → OG-22 → OG-03 → OG-26 → OG-27, which is planning and spending. **OG-06 would open a separate Emergency Readiness stage** ahead of it, matching the Emergency Readiness → Household Resilience → Off-Grid Living arc: OG-02 identifies the risks (it lists "power outage lasting 24+ hours"), and OG-06 turns that into a practical three-day kit. Suggested position: **after OG-02 and before OG-04** (or alongside it). It stands apart from the budget path, though OG-26's Tier 1 already refers to "a 72-hour disruption". Suggested pointers (not changed): OG-08 (water baseline), OG-11 (food baseline), OG-13 (alarms and CO), OG-15 (warm home), OG-19 (backup power). **No link was changed.**

## 7 · Overlap (protected resources, from their prepared copy)

| Resource | Overlap with OG-06 |
|---|---|
| OG-01 | low; asks if smoke alarms work and if there is backup power |
| OG-02 | complementary; names "power outage lasting 24+ hours" as a risk, the input to OG-06 |
| OG-08 | **high and conflicting**; owns the stored-water baseline (3 L per person per day for three days in NZ; Queensland's 10 L per person for three days as the AU example) and has an emergency-only cylinder row |
| OG-11 | **high**; owns the three-day food baseline (NZ and AU entries), "food safety in a power cut" and the emergency-supply category |
| OG-09 | medium; water treatment (OG-06's filtration and backup-source lines) |
| OG-13 | **high**; owns sourced smoke-alarm maintenance and CO wording, per market |
| OG-15 | medium; carbon monoxide, "outdoor appliances stay outdoors", winter power cut |
| OG-17 | medium; solid fuel heating, chimney, CO (OG-06's wood-burner and fireplace) |
| OG-19 | medium; backup power and "food safety in a power cut" |
| OG-B09 | low; heating comparison, outage heating consideration |

**Does OG-06 have a unique member job?** Yes, a narrow one: no protected resource gives the household **one printable emergency-readiness checklist with kit locations and a meeting place**. OG-08 and OG-11 give the water and food baselines; OG-13 the alarms; OG-19 the power. The unique part is the cross-cutting list plus the four "where is it" lines; everything quantitative in the legacy duplicates or conflicts with existing, sourced content.

## 8 · Demo and programme relationships

- **No demo placeholder represents this concept.** Of the 30 demo resources only `res-0026` Energy Backup Guide, `res-0027` Household Lighting Checklist, `res-0017` Water Storage Checklist and `res-0014` Water Security Guide are near it; none is an emergency checklist.
- **Programme day mapping:** day 6 is `res-0011` Dampness & Moisture Check (air; `Day 6 — Placeholder action`); day 5 is `res-0010` Ventilation Basics; day 7 is `res-0008` 30-Day Action Planner; day 4 is `res-0009` Household Contacts Template. The demo programme does not follow the legacy codes, so nothing there stands for OG-06.
- **Workshops:** the closest is `demo-power-cut-ready-recording` ("DEMO: Ready for a Power Cut (recording)"; related `res-0026`, download `res-0027`).
- **Start Here / collections:** OG-06 is in none. The protected Start Here lists OG-01 and OG-02 only; the demo Start Here items are `res-0001` to `res-0006`.
- **Route collision risk: none.** No demo resource has a slug like `72-hour-emergency-checklist` or `emergency-readiness-checklist`, and no demo placeholder shares the concept, so no `route-policy.json` entry would be needed. Nothing was changed.

## 9 · Taxonomy note

The taxonomy has **no emergency category** (the only emergency-adjacent one is food/pantry-resilience; the `general` foundation has getting-started, planning and packs). I have not invented one; the metadata below uses an existing category and flags it.

## 10 · NZ / AU differences (flagged, not verified)

| Item | Issue |
|---|---|
| Emergency number | the standing block carries 111 (NZ) and 000 / 112 (AU); a migrated list must not name either itself |
| "civil defence broadcasts", "local emergency frequency" | "Civil Defence" is NZ usage (the NZ block names NEMA); AU guidance points to the state or territory emergency service and its broadcasters |
| Evacuation / "where the family will gather" | the member's own line, market-neutral as written; any guidance would be state-specific |
| Smoke alarms, CO alarms, fire extinguisher | NZ (Fire and Emergency New Zealand) and AU (state law; "Queensland requires…", NSW 10-year rule) differ; the library's per-market wording is in OG-13 |
| Water storage | NZ 3 L per person per day for three days; AU a state example (Queensland 10 L per person for three days); the legacy "10 L per person per day" matches neither |
| Food | NZ and AU three-day baselines exist separately (NSW up to 14 days in AU); the legacy "3 days of meals" is unlabelled |
| "Hot water cylinder … 180L" | NZ usage and an unsourced figure; Australian homes differ ("hot water system", storage and instantaneous types) |
| Heating | "fireplace, wood burner, gas heater, camping stove": "wood burner" is NZ usage ("wood heater" in AU); gas and LPG rules differ by market |
| Generators, electrical, gas / LPG | not taught here; the heat line only names a gas heater and a camping stove |
| Building or tenancy | "tarps for roof leaks, broken windows" assumes the member may repair; tenants differ |
| "Torches", "tarps", "creek", "neighbour" | common to both markets |

## 11 · Price findings

Price detector: **0 detections** (0 PRICE, 0 PLACEHOLDER, 0 NOT_A_PRICE). No product, offer or sales wording.

## 12 · Numeric findings (current hardened detector, ordinary + survival-duration + supply-duration families)

**24 candidates in each market; Bucket C = 6** (identical NZ and AU); 17 classed D (not a claim); 1 B (structural).

- **Bucket C (6), all factual claims:** "10L" (per person per day) · "90 litres" (3 people) · "10 litres" (per person per day, the checklist line) · "180L" (hot water cylinder) · "6 months" (nothing expires within) · "5 years" (CO detector age).
- **Classed D but effectively programme labels, titles or member fields:** "30-Day" (programme name) · "72-Hour" in the title, the page header and the section headings ×8 ("72 Hour Checklist" ×4, "My 72-Hour Kit Location", "72-Hour Standard") · the blank "___ litres total" (member input; no figure) · "07 Week" (the "Next: OG-07 Week 1" link, B structural).
- **Classed D but actually emergency-period or supply claims (a detector gap, below):** "The first 72 hours are the most critical" · "survive … the worst 3 days without outside help" · "Help may not reach you for 3 days" · "72-hour window" (the "worldwide" sentence) · "times 3 days" · "3 days of meals that need no refrigeration" · "3-day supply of formula, pet food, or special items" · "You now have a complete 72-hour readiness checklist".

**Did the two Stage 9.86–9.87 detector families catch the survival and supply statements? No: neither fired on any legacy sentence.** Gaps, reported and not fixed here (the brief says audit only, and no detector was changed):
1. **Survival-duration rule:** "survive … the worst 3 days without outside help" has a person subject of "you" (not in the bodily-subject list) and "outside help" is not a deprivation term; "Help may not reach you for 3 days" has neither.
2. **Supply-duration rule:** "3 days of meals" (meals is not in the supply-thing list) and "3-day supply of formula, pet food, or special items" (a compact "N-day supply" that carries no asserting word, so it reads as a label).
3. **Emergency-period claims** ("the first 72 hours are the most critical", "72-hour window … agencies worldwide") are a third family the detector has no rule for.

These do not threaten the live library (Bucket C 0), but a migrated OG-06 that kept such sentences would pass unflagged. **Owner decision: extend the detector for these three patterns** (suggested as a separate, tested stage, with negative cases for "72-Hour" titles and headings).

**Legacy-extraction Bucket C = 6. Live-library Bucket C = 0** (431 candidates across 25 resources; neither new rule caught a live sentence).

## 13 · Safety findings (detector, document level)

Topics the legacy text requires: **batteries-and-electrical** (battery, batteries, power bank context: 4 mentions), **food-safety-power-cut** (non-perishable, fridge and refrigeration wording), **fire-and-emergency** (fireplace, fire extinguisher, smoke alarms). Fuel check: **GAS_SAFETY_REQUIRED: "gas heater"**. The gas-specific blocks are not triggered by teaching (no gas teaching signal). Market fields the detector infers: emergency number, water per person per day, fridge without power, gasfitter, electrician.

Assessment of the library's blocks (17 in all):

| Topic | Genuine, incidental or remove |
|---|---|
| **emergency-contact** | genuine, standing block in every resource; the list should not repeat 111 or 000 |
| fire-and-smoke-alarms | the alarm and extinguisher lines are **incidental list items that should be removed or pointed at OG-13**, or the block applies |
| carbon-monoxide, indoor-combustion | **genuine hazard in the legacy**: it recommends a fireplace, wood burner, gas heater or camping stove for warmth; **remove the line** (and the candles) rather than add blocks |
| generator-safety | not present (no generator) |
| batteries-and-electrical | torches, a radio and a power bank are **incidental list mentions**; the block is triggered by count, so a rewrite should keep the wording to plain "torches, a charged power bank" or accept the block |
| gas-and-lpg-general, gas-cylinder-safety, gas-leak-response, gas-installation-and-servicing, unflued-gas-heating | **remove "gas heater" and "camping stove"**; none should be needed |
| food-safety-power-cut | a **genuine** topic for a no-cook food line; the existing block fits |
| stored-drinking-water | genuine if the water lines stay; the block is approved |
| water-treatment | the filtration and creek and pool lines teach treatment: **remove**, point at OG-09 |
| working-at-height | the tarps-and-rope line invites roof repairs: **remove** |

I did not add any block. A narrowed OG-06 would carry the standing emergency and disclaimer blocks, and probably food-safety-power-cut and stored-drinking-water only if those lines stay; each legacy topic that leaves needs a recorded disposition, as OG-04 had.

## 14 · Claim conflicts with approved baselines

1. **OG-08, NZ:** approved "at least three litres of drinking water per person per day, for at least three days (nine litres per person)" (registry `nz-storage-litres-per-person-per-day`, verified). **OG-06 says 10 L per person per day, 3 people = 90 litres:** a conflict.
2. **OG-08, AU:** approved "Get Ready Queensland advises storing at least 10 litres of drinking water per person for three days… your state or territory emergency service may advise more" (registry `au-storage-litres-per-person-qld`, an example, never national). **OG-06 reads "10 litres per person per day":** a different quantity (three times the Queensland figure) and unlabelled; it also applies one figure to both markets.
3. **Indoor combustion and CO wording (approved blocks, OG-15 and others):** "Never use a barbecue, patio heater, camping cooker or generator inside your home or garage". **OG-06 lists a camping stove, gas heater, fireplace and wood burner as the "alternative heat source"** and recommends candles: a direct conflict with the approved wording.
4. **Smoke alarms (OG-13, sourced per market):** monthly test, yearly expiry check, replacement every ten years (FENZ; NSW law); **OG-06's "push the button" and CO "less than 5 years old"** have no source and the CO age figure appears in no approved entry.
5. **Food (OG-11, per market):** approved NZ and AU three-day food baselines and "food safety in a power cut"; **OG-06's "3 days of meals" is unlabelled and its "nothing expires within 6 months" is unsourced.**
6. **Emergency wording:** the standing block carries 111 or 000 and the agency (Civil Defence or SES); OG-06's "civil defence broadcasts" would put an NZ term in an AU file.
7. **Generator, gas and electrical architecture:** no conflict; OG-06 does not teach them.

## 15 · Legacy terminology

Found: "Week 1 — Foundation", "Week 1 Priority Lock Worksheet" (link); "Day 6" ×3 ("Asset OG-06 | Day 6" ×2, "Day 6 Complete"); "30-Day Programme"; "Asset OG-06" ×2; "OG-06", "OG-07" codes; "OFFGRID056.COM" footer; "Next: OG-07…"; "If you complete nothing else in this programme"; survival and fear framing ("survive … the worst 3 days", "the most critical", "help may not reach you"); "worldwide". **Not found:** "Pillars", Skool, Simply Services, HTPS, premium or upsell wording, old offer names, prices.

## 16 · Proposed metadata (if the resource is kept) — every field OWNER-REVIEW REQUIRED; no res-ID assigned

| Field | Proposal |
|---|---|
| Title | **Emergency Readiness Checklist** (avoids a fixed number; alternative: the legacy "72-Hour Emergency Checklist") |
| Foundation | general |
| Program Component | resilience-emergency |
| Category | planning (no emergency category exists; none invented) |
| Type | checklist |
| Difficulty | beginner |
| Estimated time | 20 minutes |
| Description (draft) | "A printable checklist for getting your household ready for an emergency or a power cut, with space to record where your supplies are kept and where your household will meet." |
| Tags | `[]` |
| Status | draft |
| Collections | `[]` (not Start Here; not Planning Tools) |
| Related (ids verified) | res-1002 Household Risk Identifier, res-1008 Water Storage Calculator, res-1011 30-Day Pantry Builder, res-1013 Healthy Home Air Audit, res-1015 Warm Home Scorecard, res-1019 Battery Backup Planner |

## 17 · Disposition

**Primary: NARROW.** Keep the one useful job: a short emergency-readiness checklist of plain tick items across water, food, warmth, communication and safety, and the four member-written "where is it" lines (the unique kernel). Remove every figure, formula and period (10 L, 90 L, 180 L, 6 months, 5 years, 10,000 mAh, "3 days"), the "worldwide" and survival claims, the heat-source, candle, tarp, creek and pool, filtration and cylinder lines, and the programme wrapper; point to OG-08, OG-11 and OG-13 for water, food and alarms. 

| | |
|---|---|
| Unique member value | moderate: the only one-page readiness checklist with kit locations and a meeting place |
| Duplication | high in content (water, food, alarms, heat all owned elsewhere), low in form |
| Safety burden | high in the legacy (indoor combustion, candles, untreated water, roof repairs); low once those lines go (standing blocks, and food-safety-power-cut if the no-cook line stays) |
| Market burden | moderate: emergency wording, alarm rules and the water and food baselines differ by market; a market-neutral checklist avoids all of it |
| Claim burden | high in the legacy (6 Bucket C items plus 8 unflagged period and supply claims); near zero once narrowed |
| Journey role | opens an Emergency Readiness stage after OG-02 and before OG-04 |

**Fallback: MERGE_CONCEPTUALLY**, pointing readers from OG-02, OG-08 and OG-11 to the existing baselines and dropping the checklist. Weaker, because no existing resource would host the kit-location and meeting-place lines.

## 18 · Owner decisions required

1. **Disposition:** NARROW (recommended) or MERGE_CONCEPTUALLY.
2. **Title:** "Emergency Readiness Checklist" or the legacy "72-Hour Emergency Checklist". The latter uses a fixed number the library's own approved wording avoids (it says "at least three days", per market).
3. **Program Component:** resilience-emergency (recommended).
4. **Category:** no emergency category exists; use "planning" (proposed), "getting-started", or approve a new category (not invented here).
5. **Which items stay:** confirm that heat sources, candles, tarps, creek and pool, filtration, the cylinder row, the fire extinguisher and the smoke and CO alarm lines are removed (alarm and CO lines replaced by a pointer to OG-13).
6. **Safety blocks:** whether the narrowed list keeps the no-cook food line (food-safety-power-cut) and any water line (stored-drinking-water), or only the standing blocks.
7. **Journey and links:** position after OG-02 and before OG-04, and which pointers (OG-08, OG-11, OG-13, OG-15, OG-19) go in the Where Next table; any related-list change to existing resources is separate.
8. **Detector gaps:** whether to extend the numeric detector for the three patterns the legacy slipped past (emergency-period claims, "N days of meals", an unasserted "N-day supply of X").
9. **Demo `res-0011` and programme day 6:** leave as they are (nothing replaces them).

## Validation (actual exit codes)

| Check | Exit code | Result |
|---|---|---|
| `npm run lint` | **0** | PASS |
| `npx tsc --noEmit` | **0** | PASS |
| full test suite | **0** | **918 passed** |
| content-flag and prep tests | 0 | 122 passed |
| built-output tests | 0 | 14 passed |
| register consistency tests | 0 | 25 passed |
| numeric detector tests (incl. survival and supply families) | 0 | 121 passed |
| live-library numeric scan | 0 | 431 candidates, 25 resources; **Bucket C 0** |
| legacy-extraction scans (price, numeric NZ and AU, survival and supply families, market tokens, safety, content flags, legacy language) | 0 | price 0; Bucket C 6 (legacy only) |
| overlap probe over 15 live resources and the demo data | 0 | see §7 and §8 |
| `import:verify-build` | 0 | 25 records, 50 market files, 0 broken internal links |
| Cloudflare Access probe | 0 | 41 routes redirected to Access, 0 answered 200 |

The registers, the Stage 9.89 tooling, `next.config.ts`, `next/font`, the head-tag handling and the strict comparer were not touched; the retired delta scripts were not restored. **Stopped before rewrite, migration or PDF generation.**

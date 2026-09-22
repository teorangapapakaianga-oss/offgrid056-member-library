# OG-19 — BATTERY BACKUP PLANNER · CLAIMS-FIRST REVIEW · NOT DEPLOYED

OG-19 is prepared for review as **PREVIEW_WITH_PROPOSED_COPY**. Its 17 proposed changes are rendered in NZ and AU
previews so you can see them, but none is approved.

**The headline findings, before any rewrite:**

1. **Its sizing maths contradicts itself.** Step 2's formula divides by depth of discharge, but the three scenario
   rows beneath it (× 0.6, × 1.2, × 2.4) ignore depth of discharge entirely.
2. **Its central promise is overstated.** *"With batteries, your solar keeps running"* is not true of every battery
   system. Official sources in both markets say backup depends on the inverter and how the system is set up.
3. **Generators are incidental.** The only mention is in a legacy closing teaser. No generator block is needed.
4. **It names products:** Tesla Powerwall 3 (with a 13.5 kWh spec) and "Saltwater (Aquion)", whose current
   availability I could not confirm.
5. **It carries an NZ-only legal claim into the AU file:** *"DIY grid-tie is illegal in NZ"*.

**Also found and fixed this stage: a regression in my own pipeline, caught by its safety net.** Details in §10. It
never reached the live preview.

**Live preview unchanged:** `6954a621`, ten resources.
**Date:** 22 September 2026

---

## 1. OG-19 audit

| | |
|---|---|
| Title | **Battery Backup Planner** |
| Purpose | *"Solar panels generate by day. Batteries store for night. This planner helps you size, cost, and select the right battery system for your home's essential loads."* |
| Structure | "Why Batteries Change Everything" · Step 1 essential-loads table (7 loads: W × hours → Wh, priority 1–5) · Step 2 sizing maths box and 3-scenario calculator · Step 3 battery technology comparison · Step 4 decision (6 fields) · "The Non-Negotiables" (4 items) · 21 fields, 3 tables, 7 pages |
| Group | A |
| Required safety | **batteries and electrical** (39 battery mentions) and **food safety in a power cut** (fridge/freezer ×6). Both are already owner-approved for NZ and AU. |
| Legacy navigation | "Week 3 — Shelter, Heating & Energy" · "OffGrid056 30-Day Programme" · "Asset OG-19 \| Day 19" ×2 · "Day 19 Complete" · *"Tomorrow: wind, generators, and hybrid systems…"* · *"Next: OG-20 Alternative Energy Suitability Check →"* |
| Products / suppliers | **Tesla Powerwall 3**, **Saltwater (Aquion)** |
| Platforms / old product names | none |

**Its method is right.** It sizes backup from the household's own essential loads, working in watts × hours →
watt-hours → kWh, and prioritises what matters, as you asked. **What needs attention is the figures around that
method.**

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | Battery Backup Planner | **SOURCE** |
| ID / slug | res-1019 · `battery-backup-planner` | |
| Foundation | energy | your working classification (audit HIGH) |
| Type | planner | your working classification (audit HIGH) |
| Category | **backup-energy** | **INFERRED**: *"Keeping essentials running when the power goes out, safely."* Alternative: household-energy-planning. |
| Difficulty | recommend **intermediate** | **OWNER-REVIEW REQUIRED** (the source states none). Inferred from watt-hour load calculation, depth of discharge and a sizing formula. |
| Time | recommend **45 min** | **OWNER-REVIEW REQUIRED**. Inferred from a 7-row load table needing appliance wattages, three sizing scenarios, a comparison from specifications and quotes, and a 6-field decision. Excludes getting quotes. |
| Description | *"Solar panels generate by day. Batteries store for night. This planner helps you size, cost, and select the right battery system for your home's essential loads."* | **SOURCE**: the cover subtitle, unchanged (no claims) |
| Tags | none | none invented |
| PDF title | Battery Backup Planner — OffGrid056 | standard |

## 3. kWh claims table

The scan's 12 kWh mentions are 6 distinct uses, each counted in both the PDF and the HTML source.

| # | Exact original wording | Used for | Classification | NZ source | AU source | Action |
|---|---|---|---|---|---|---|
| K1 | *"Minimum battery size (kWh) = Total daily Wh ÷ 1000 ÷ Depth of Discharge…"* | the sizing method | **calculation input** (formula) | method sound; EECA: size *"depends on what you want to get out of your system"* | method sound; Solar Victoria: backup *"depends … on how the whole system is designed"* | **KEEP the method, REWRITE the inputs** (K2, P1) |
| K2 | *"(0.8 for lithium, 0.5 for lead-acid)"* | fixed depth-of-discharge values | **battery-sizing assumption** | none | none | **REWRITE**: use *"the battery's usable depth of discharge"* from its specification |
| K3 | *"Minimum kWh"* (column header) and *"___ kWh"* ×3 (fill-ins) | answer fields | **calculation input** (member's own) | n/a | n/a | **KEEP** |
| K4 | *"Daily Wh ÷ 1000 × 0.6"* (overnight), *"× 1.2"* (24 h), *"× 2.4"* (48 h) | scenario multipliers | **battery-sizing assumption**, and **internally inconsistent**: they ignore depth of discharge, and 0.6 assumes loads spread evenly over 24 hours | none | none | **REWRITE** as the same formula: *"Wh used overnight ÷ 1000 ÷ depth of discharge"* · *"Daily Wh ÷ 1000 ÷ depth of discharge"* · *"Daily Wh × 2 ÷ 1000 ÷ depth of discharge"* |
| K5 | *"Cost/kWh"*: $800–$1,200 · $400–$600 · $1,100–$1,400 · $1,000–$1,500 | price per kWh by type | **universal claim** (cost estimate: no currency, time-sensitive, market-dependent) | none | none | **REMOVE**; the member records *"Quoted cost (installed)"* |
| K6 | *"Integrated, smart, 13.5kWh"* (Tesla Powerwall 3) | one product's capacity | **universal claim** (product specification) | n/a | n/a | **REMOVE** with the product row |

**Other fixed figures:**

| # | Exact wording | Classification | Action |
|---|---|---|---|
| F1 | *"Survive 6pm–8am without grid"* | **example** hours | **KEEP_AS_EXAMPLE**: *"Evening to morning without the grid (for example 6pm–8am)"* |
| F2 | *"24-hour backup"*, *"48-hour backup"* | planning scenarios (the member's choice) | **KEEP** |
| F3 | Lifespans *"10–15 years"*, *"5–8 years"*, *"10 years (warranty)"*, *"10+ years"* | **universal claim** | **REMOVE**; the member records the warranty from the specification |
| F4 | *"Warranty matters — 10-year coverage is the benchmark"* | **recommendation** with an unsourced benchmark | **REWRITE**: *"compare the length and terms of each battery's warranty"* |
| F5 | *"÷ 1000"* | unit conversion (Wh → kWh) | **KEEP** (arithmetic) |

## 4. Percentage claims table

The scan's 10 percentages are 5 distinct figures, each counted twice.

| # | Exact original wording | Used for | Classification | NZ source | AU source | Action |
|---|---|---|---|---|---|---|
| P1 | *"Then add 20% buffer for cold weather and battery aging."* | sizing margin | **battery-sizing assumption** | none | none | **REWRITE**: *"add a margin for inverter losses, cold weather and battery ageing — your installer or the specification can tell you how much"*. It also adds inverter losses, which the original ignored. No replacement number. |
| P2 | *"80–95%"* (Lithium, depth of discharge) | depth of discharge | **battery-sizing assumption** (product-dependent) | none | none | **REMOVE**; the member records the value from the specification |
| P3 | *"50%"* (Lead-acid, depth of discharge) | depth of discharge | **battery-sizing assumption** | none | none | **REMOVE** |
| P4 | *"100%"* (Tesla Powerwall 3) | depth of discharge | **universal claim** (product specification) | n/a | n/a | **REMOVE** with the product row |
| P5 | *"100%"* (Saltwater, Aquion) | depth of discharge | **universal claim** (product specification) | n/a | n/a | **REMOVE** with the product row |

**Not in the source:** efficiency, inverter loss, reserve, savings or margin percentages. **No new percentages were
introduced anywhere.**

**Special attention, as you asked:**

| Topic | Result |
|---|---|
| kW power and surge loads | **not addressed by the source.** It sizes energy (kWh), not power (kW). **Worth a future decision:** a battery also needs enough power output for surge loads such as a fridge compressor or water pump. I have **not** added this, because I would need an official source and your approval. |
| Inverter losses and conversion efficiency | now named as part of the margin, with no number |
| Depth of discharge and usable capacity | taken from the battery's specification |
| Runtime and reserve | expressed through the member's own overnight, 24-hour and 48-hour scenarios |
| Solar recharge | not assumed anywhere |

## 5. Generator passage assessment

**INCIDENTAL.** I read every mention, not just the count.

- **The only generator reference is the closing navigation teaser:** *"Tomorrow: wind, generators, and hybrid
  systems for complete energy independence."* It points to OG-20, and it is removed with the rest of the old
  navigation.
- **No passage teaches** generator operation, siting, connection to household circuits, indoor or outdoor use,
  backup integration, charging batteries from a generator, or relying on one.
- **So no generator, carbon-monoxide or indoor-combustion block is required.**
- The generator mentions left in the previews (3 in NZ, 4 in AU) all come from the **approved electrical block's**
  own backfeeding warning.
- **No generator distance is stated anywhere**; it stays `VERIFY`.

## 6. Required safety blocks

| Block | Why | NZ | AU |
|---|---|---|---|
| In an emergency | every resource | 111 | 000 + 112 |
| Batteries and electrical safety (CRITICAL) | 39 battery mentions; install and connection | licensed electrical worker; homeowner wiring rules don't cover PV | licensed electrician; DIY electrical work is illegal |
| Food safety in a power cut (HIGH) | fridge/freezer as an essential load | Get Ready + MPI, **no timings** | NSW Food Authority timings |
| Disclaimer | every resource | | |

**All four are already owner-approved. None is new.**

## 7. NZ / AU market differences

| Area | Source text | NZ | AU |
|---|---|---|---|
| Legal / licensing | *"DIY grid-tie is illegal in NZ"*: **NZ-only wording, currently in the AU file** | *"…installed by a licensed electrical worker — the rules that let homeowners do some of their own wiring do not cover solar (PV) systems"* (WorkSafe NZ) | *"…installed by a licensed electrician — DIY electrical work is illegal"* (Energy Safe Victoria; NSW Government) |
| Installer field | *"must be certified for grid-tie systems"* | *"must be a licensed electrical worker for this work"* | *"must be a licensed electrician"* |
| Food timing | none in the source | none (MPI publishes none) | NSW timings in the safety block |
| Costs / currency | "$" cost ranges | removed; the member records quotes | the same |
| Emergency agency | via the blocks | Civil Defence | SES |
| Rebates / programmes | **none in the source** | none added | **none added** (e.g. the national Cheaper Home Batteries Program was deliberately not introduced) |
| Grid connection | "grid-tie" | the same concept; no market term needed | the same |
| Products / marketplaces | Tesla, Aquion | removed from both | removed from both |

**Optional, not included:** a note for the "Medical device" load. NZ has a verified route: Get Ready says to register
with your power company as a **medically dependent consumer**. I have not verified the AU equivalent, so I have not
added a one-market note.

## 8. Exact proposed copy changes (17; PROPOSED, not approved)

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 3 — Shelter, Heating & Energy | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Page headers ×2 | Asset OG-19 \| Day 19 | *removed* |
| 4 | Closing heading | Day 19 Complete | Battery Plan Complete |
| 5 | Closing | …which technology fits your budget. Tomorrow: wind, generators, and hybrid systems for complete energy independence. | …which technology fits your budget. |
| 6 | Closing | Next: OG-20 Alternative Energy Suitability Check → | *removed* |
| 7 | Why Batteries Change Everything | Without batteries, solar panels shut down during a grid outage — even in bright sunshine. With batteries, your solar keeps running, your lights stay on, and your fridge keeps cold. Batteries turn solar from a money-saver into a survival tool. | Without a battery, solar panels won't provide power during a grid outage — even in bright sunshine. A battery can keep your lights on and your fridge cold, but only if the system is designed to provide backup power: not every battery system does, so ask your installer. Batteries can turn solar from a money-saver into a source of backup power. |
| 8 | Step 2 — the maths | Minimum battery size (kWh) = Total daily Wh ÷ 1000 ÷ Depth of Discharge (0.8 for lithium, 0.5 for lead-acid) / Then add 20% buffer for cold weather and battery aging. | Minimum battery size (kWh) = Energy you need (Wh) ÷ 1000 ÷ the battery's usable depth of discharge / Take the usable depth of discharge from the battery's specification, as a decimal (divide the percentage by 100). Then add a margin for inverter losses, cold weather and battery ageing — your installer or the specification can tell you how much. |
| 9 | Overnight scenario label | Survive 6pm–8am without grid | Evening to morning without the grid (for example 6pm–8am) |
| 10 | Overnight calculation | Daily Wh ÷ 1000 × 0.6 | Wh used overnight ÷ 1000 ÷ depth of discharge |
| 11 | 24-hour calculation | Daily Wh ÷ 1000 × 1.2 | Daily Wh ÷ 1000 ÷ depth of discharge |
| 12 | 48-hour calculation | Daily Wh ÷ 1000 × 2.4 | Daily Wh × 2 ÷ 1000 ÷ depth of discharge |
| 13 | Step 3 comparison table | 4 rows with lifespans, depth-of-discharge %, $/kWh and two named products | 4 rows: **Lithium (for example LiFePO4)** and **Lead-acid (for example AGM)** with the member's own *usable depth of discharge*, *warranty* and *quoted cost* columns; the qualitative pros/cons kept (*"Long life, efficient"* — the unsourced *"Safe"* dropped); plus two *"Other option quoted"* rows. Tesla and Aquion removed. |
| 14 | Installer field — **NZ** | Installer identified (must be certified for grid-tie systems) | Installer identified (must be a licensed electrical worker for this work) |
| 15 | Installer field — **AU** | the same | Installer identified (must be a licensed electrician) |
| 16 | The Non-Negotiables — **NZ** | 1. Use a certified solar installer — DIY grid-tie is illegal in NZ / 2. All battery systems need an isolation switch and smoke detection / 3. Lithium batteries need thermal management — do not install in uninsulated sheds / 4. Warranty matters — 10-year coverage is the benchmark | 1. Solar and battery systems must be installed by a licensed electrical worker — the rules that let homeowners do some of their own wiring do not cover solar (PV) systems / 2. Ask your installer how the system will be isolated and protected, including smoke detection / 3. Follow the manufacturer's instructions on where the battery can be installed and the temperatures it needs / 4. Warranty matters — compare the length and terms of each battery's warranty / **5. Check the system can provide backup power during an outage — not every battery system does** |
| 17 | The Non-Negotiables — **AU** | the same | the same, except item 1: *"Solar and battery systems must be installed by a licensed electrician — DIY electrical work is illegal"* |

**Every change matched its source exactly.** Changes 14–17 are the market-specific ones.

**Notes:**

- **Items 2 and 3 of the Non-Negotiables** were unsourced technical rules. They become installer questions and
  manufacturer instructions; I have not replaced them with standards I could not source.
- **Item 5 is new.** It is supported by EECA ("backup-capable inverter") and Solar Victoria.

**Sources read directly this stage:**

- [Solar Victoria — backup power](https://www.solar.vic.gov.au/what-you-need-know-about-backup-power) (updated 3 Sep
  2025): *"Standard solar PV systems, with or without a battery, are designed to switch off during a power outage"*;
  a battery *"doesn't necessarily mean that they will have access to that power during a grid outage"*; some
  systems *"only provide backup to one or two priority circuits such as your fridge and lights"*.
- [EECA — Plan your solar system](https://www.eeca.govt.nz/for-homes/solar-for-homes/plan-your-solar-system/):
  *"solar without battery will not provide power during an outage"*; prioritise a *"backup-capable inverter"*.

## 9. NZ / AU preview readiness

| Check | NZ | AU |
|---|---|---|
| Pages · PDF title | 7 · Battery Backup Planner — OffGrid056 | 7 · the same |
| Emergency numbers | 111 only | 000 + 112 only |
| Removed claims and products present (0.8/0.5, 20%, × 0.6/1.2/2.4, lifespans, 80–95%/50%/100%, costs, 13.5, Powerwall, Aquion, "10-year", "uninsulated sheds", "survival tool", "certified") | **none** | **none** |
| Backup-capability wording · household-load formula | ✓ · ✓ | ✓ · ✓ |
| Licensing wording | NZ rule only; no "illegal in NZ" | AU rule only; no "illegal in NZ" |
| Food timing | none (MPI refreeze line present) | NSW timings only |
| Tokens / VERIFY / OG codes | 0 / 0 / 0 | 0 / 0 / 0 |
| Load table, comparison table, maths box | **each on one page** | **each on one page** |
| `import:verify-prep` | ✓ | ✓ |

**Readiness: PREVIEW_WITH_PROPOSED_COPY.** It needs:

1. your decisions on the 17 changes
2. category (recommend backup-energy)
3. difficulty (recommend intermediate)
4. time (recommend 45 min)

The safety blocks need nothing more.

---

## 10. Tests and pipeline

**256 passed** (254 + 2). Lint and typecheck clean. **`import:verify-prep`: 22 / 22.**

**Print fixes this stage** (all layout, no wording):

- **Small tables (10 rows or fewer) stay on one page.** OG-19's load table was breaking after its **first row**,
  leaving a header and "Fridge / freezer" stranded on page 2.
- `tip-box` callouts are now kept whole, like the other callout boxes.

**A regression I introduced, and how it was caught.** My first version of the small-table rule edited the `<table>`
tag *before* copy changes ran.

- **What broke:** every approved whole-table change stopped matching. That included OG-26's NZ and AU assistance
  tables (OG-26 is live) and OG-19's comparison table.
- **What held:** the exact-match guard refused them rather than guess.
- **What didn't:** `import:verify-prep` still passed, because it only checked changes that *had* applied. OG-19's
  preview briefly contained the old table.

**Fixed three ways:**

1. The table rule now runs **after all copy changes**. A new test confirms an approved whole-table change still
   applies.
2. **`import:verify-prep` now fails whenever any recorded change did not apply.** Proven by planting exactly that
   on OG-26's AU table: it failed, then passed once restored.
3. Everything was re-prepared: **every approved and proposed change across all 11 resources applies**.

**Nothing live was affected.** The regression existed only in workspace previews for a few minutes, and every
deployed PDF predates it. The nine live resources' HTML now carries the new print rules, but their PDFs were **not**
re-rendered. If they ever are, pagination may shift and they will be re-verified then.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `6954a621` |
| Deployed resources | the ten are unchanged |
| Local build | still verifies as those ten (10 records, 20 files, 0 broken links) |
| Access | still blocks, including OG-19's would-be URL |
| OG-19 in GitHub | 0 files |
| `--real` | refused |

## 11. Deployment recommendation

**Do not deploy OG-19 yet.** The claims tables above need your rulings first.

**My recommendation on each group:**

- **Approve the kWh and percentage actions as proposed.** Keep the household-load method; take every
  battery-specific figure from the member's own specification and quotes; introduce no replacement numbers.
- **Approve the product removals** (Tesla, Aquion). A named product with a spec and price doesn't belong in a
  generic planning worksheet, and it dates quickly.
- **Approve the backup-capability correction.** It is the most important claim change in OG-19: a member could buy
  a battery believing it will keep their fridge running in an outage when it won't.
- **Decide separately** whether to add a sourced note on **power (kW) and surge loads**. That is new teaching, not a
  correction.

Once decided, the path is the same as OG-11: approve, re-render, verify the exact build, then deploy as the **11th**
resource with rollback to `6954a621`.

**Stopped. OG-19 not deployed.**

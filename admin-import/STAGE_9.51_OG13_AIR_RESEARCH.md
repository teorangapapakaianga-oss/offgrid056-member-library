# OG-13 — HEALTHY HOME AIR AUDIT · RESEARCH ONLY (NOT MIGRATED, NO PDFs, NOT DEPLOYED)

**Date:** 23 September 2026 · **Stage:** 9.51

**Nothing was migrated, rendered or deployed.** OG-13 was read only far enough to inventory its claims. Live state
unchanged: Worker `0aff3fcd-7080-4ae7-bf28-c5d09414b90a`, 19 draft resources, 38 market files, 417 tests, numeric
validation **blocking** with Bucket C = 0.

Every source below was read live today. Where a figure has no source, it is recorded as unresolved rather than kept.

---

## 1. Push confirmation

`git push origin main` → `5fbb564..02711ee  main -> main`. **`origin/main` = `02711ee46f735b34b5aa31d0d6f960412c318b11`**,
containing `admin-import/STAGE_9.50_NUMERIC_BLOCKING.md`, the blocking integration (`audit/numeric.ts`, `pilot/prep.ts`,
`cli.mts`), the Stage 9.50 tests, and `numeric-claims.json` with **`"mode": "blocking"`**.

## 2. OG-13 complete legacy claims inventory

**Source:** `OG-13_Healthy_Home_Air_Audit.html` (17 KB) — cover, a 10-row audit table, a score summary, a top-three
worksheet, a "Quick Wins Under $50" box and a closing box.

| # | Claim | Verdict |
|---|---|---|
| 1 | "You can survive 3 weeks without food but only 3 minutes without clean air" | **REMOVE** — an unsourced survival claim, and dramatic framing |
| 2 | "Mould, carbon monoxide, and poor ventilation cause more hospitalisations than power outages" | **REMOVE** — an unsourced epidemiological comparison |
| 3 | "The damage is cumulative — you do not feel it day to day, but your lungs do" | **REWRITE** — NSW Health's actual health wording is available and calmer |
| 4 | "This audit takes 20 minutes" | **KEEP** as the metadata estimate, not as a claim in the copy |
| 5 | Smoke alarms: "Working on every level" | **KEEP** — supported in both markets |
| 6 | Smoke alarms: **"tested monthly"** | **VERIFY → KEEP** — verified in both markets (FENZ; FRNSW) |
| 7 | Smoke alarms: **"under 10 years old"** | **VERIFY → REWRITE** — the *replacement* interval is ten years in both markets, but "under 10 years old" as a pass/fail test is not how either agency puts it; NZ adds "check the expiry date" |
| 8 | CO detectors: "Near sleeping areas" | **KEEP** — already in the approved CO block (AU); NZ block says "consider installing" |
| 9 | CO detectors: **"tested monthly"** | **VERIFY** — no NZ or AU source read states a CO test frequency |
| 10 | CO detectors: **"under 5 years old"** | **REMOVE** — **no source found in either market.** ESV's guidance is "check the expiry date marked on the alarm"; nobody publishes a universal five-year life |
| 11 | Visible mould: "No black/green spots on walls, ceilings, or window frames" | **KEEP** — an observation, not a claim |
| 12 | Musty smell / condensation / "Windows dry in morning" | **KEEP** — observations; MBIE supports condensation as the signal |
| 13 | Kitchen ventilation: "Range hood works; cooking fumes extracted, not recirculated" | **KEEP, strengthen** — MBIE requires venting **outside, not into the roof space** |
| 14 | Bathroom ventilation: **"shower steam clears within 10 minutes"** | **REMOVE** — no NZ or AU source publishes a clearance time |
| 15 | Bedroom air: "Can open windows; no blocked vents; bedding aired regularly" | **KEEP** |
| 16 | Heating safety: "Wood burner serviced; flue clear; no visible cracks in firebox" | **KEEP** — covered by the approved solid-fuel block |
| 17 | Masks: "N95 or P2 masks available for dust/smoke events" | **REWRITE** — supportable in AU (NSW Health), **not verified for NZ** |
| 18 | Scoring scale 1–5 and thresholds "10–20 Critical … 45–50 Excellent" | **KEEP_AS_EXAMPLE** — OffGrid056's own scoring instrument, labelled as such (as OG-02's is) |
| 19 | "Smoke/CO alarms: $15–$30 each — highest life-saving ROI" | **REMOVE** (price + ROI claim) |
| 20 | "Window vents: $10–$20 — trickle vents stop condensation" | **REMOVE** price; **VERIFY** the vent claim |
| 21 | "Dehumidifier (small): $40–$80 — drops humidity below mould threshold" | **REMOVE** — price, and "mould threshold" is an invented figure. MBIE says a dehumidifier should not be needed if moisture is controlled |
| 22 | "Bleach + spray bottle: $5 — kills visible mould on hard surfaces" | **REMOVE price; REWRITE method** — both markets publish dilutions and PPE, and they differ |
| 23 | "Quick Wins Under $50" heading | **REMOVE** — a price bracket |
| 24 | Legacy: "Week 2 — Water, Food & Air", "Asset OG-13 | Day 13" ×2, "Day 13 Complete", "Next: OG-14 …" | **REMOVE** (standard) |

## 3. NZ source register

| # | Source | Agency | Date | Covers |
|---|---|---|---|---|
| NZ-1 | [Smoke alarms](https://www.fireandemergency.nz/home-fire-safety/smoke-alarms/) | Fire and Emergency New Zealand | read live 2026-09-23 | type, placement, testing, cleaning, batteries, replacement |
| NZ-2 | [Smoke alarms in rental properties](https://www.tenancy.govt.nz/maintenance-and-inspections/smoke-alarms/) | Tenancy Services (MBIE) | last updated 6 Sep 2023 | the legal requirements for rentals |
| NZ-3 | [Controlling moisture and damp](https://www.building.govt.nz/getting-started/smarter-homes-guides/air-quality-moisture-and-ventilation/controlling-moisture-and-damp) | Building Performance, MBIE | last updated 9 Aug 2023 | moisture sources, extraction, ventilation, heating, dehumidifiers |
| NZ-4 | [Mould and dampness](https://www.tenancy.govt.nz/maintenance-and-inspections/mould-and-dampness/) | Tenancy Services (MBIE) | last updated 12 May 2022 | prevention, cleaning method, PPE, when to get a professional |
| NZ-5 | [Fires, smoke and health](https://www.healthnz.govt.nz/health-topics/keeping-healthy/healthy-homes-environments/hazardous-substances/fires-smoke) | Health New Zealand | read live 2026-09-23 | smoke events, who is at risk, what to do indoors |
| NZ-6 | The approved `carbon-monoxide` block's own sources | (already in `safety-blocks.json`) | Stage 9.19 | CO alarms, symptoms, emergency action |

**Not found in NZ:** a CO alarm lifespan, a CO alarm test frequency, a bathroom steam-clearance time, an indoor
humidity target, and household mask guidance for smoke events (Health NZ's advice is to stay indoors and shut up the
house; it names no mask on the page read).

## 4. AU source register

| # | Source | Agency | Level | Date | Covers |
|---|---|---|---|---|---|
| AU-1 | [Smoke alarm maintenance guide](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/smoke-alarms/smoke-alarm-maintenance-guide) | Fire and Rescue NSW | **NSW** | read live 2026-09-23 | monthly test, six-monthly vacuum, annual batteries, ten-year replacement |
| AU-2 | [Smoke alarms — what is the law](https://www.fire.nsw.gov.au/fire-safety/home-fire-safety/smoke-alarms/smoke-alarms-what-is-the-law) | Fire and Rescue NSW | **NSW** | read via search 2026-09-23 | replacement within 10 years of manufacture; annual batteries; interconnection recommended |
| AU-3 | [Smoke alarm reforms](https://www.fire.qld.gov.au/about-us/corporate-knowledge-centre/qfdlegislation/smoke-alarm-reforms) | Queensland Fire Department | **QLD** | read via search 2026-09-23 | interconnected photoelectric in every bedroom, hallway and storey; staged 2017 → 2022 → **1 Jan 2027** |
| AU-4 | [Mould fact sheet](https://www.health.nsw.gov.au/environment/factsheets/Pages/mould.aspx) | NSW Health | **NSW** | 20 Dec 2022 | health effects, cleaning dilutions, PPE, professional cleaning, testing |
| AU-5 | [P2/N95 masks](https://www.health.nsw.gov.au/environment/factsheets/Pages/face-mask.aspx) | NSW Health | **NSW** | 17 Mar 2025 | what they do, fit, who should not use them, returning to fire-damaged homes |
| AU-6 | [Bushfires and bushfire smoke](https://www.health.nsw.gov.au/environment/bushfire/) | NSW Health | **NSW** | 27 Nov 2023 | smoke events, who is at higher risk |
| AU-7 | GIS 36: Carbon monoxide alarms for domestic use | Energy Safe Victoria | **VIC** | **identified, not read live** | CO alarm selection and expiry — to be read before any CO alarm wording is written |

**No national Australian rule exists for household smoke alarms.** NSW and Queensland differ materially, and
Queensland's is legislation with a deadline. Any AU wording must say so.

## 5. Smoke-alarm findings

| Topic | NZ (FENZ / Tenancy Services) | AU (NSW / QLD) |
|---|---|---|
| Type | **Long-life photoelectric recommended**; interconnected better, "especially important in multi-storey homes and homes with long hallways" | NSW: several types exist and "the critical factor … is not a specific sensor technology but rather the number of alarms … their location and the interconnection"; **QLD law requires photoelectric** |
| Placement | "a smoke alarm in every bedroom, hallway and living area"; **not in the kitchen** — use a heat alarm; rentals: in every room where someone sleeps **or within 3 metres of each bedroom door**, and on every level | QLD: **every bedroom, hallway and each storey**, interconnected |
| Testing | **"Once a month press the test button"** | NSW: **"every month … pressing and holding the test button for at least five seconds"** |
| Cleaning | **"Every six months vacuum or dust"** | NSW: **"vacuum dust off your smoke alarms every six months"** |
| Batteries | "If you have a 9V battery alarm, replace the battery every year" | NSW: **"Replace lead or alkaline batteries every 12 months"** |
| Expiry | **"Every year check the expiry date … If there's no expiry date, it's best to replace the alarm"** | NSW law: replaced "within 10 years of manufacture, or earlier if specified by the manufacturer" |
| Replacement | **"Every 10 years replace all smoke alarms with new long-life photoelectric"** | NSW: **"Every 10 years … 10-year lithium powered smoke alarms"** |
| Rentals / legal | Compulsory in all rental homes; alarms installed after 1 July 2016 must be long-life photoelectric to the standard; fines apply | QLD: staged law — new/renovated 2017, sold or leased 2022, **all remaining dwellings 1 January 2027**; hard-wired or non-removable 10-year battery |

**The legacy "tested monthly" is verified in both markets. "Under 10 years old" is not the test either agency
publishes** — both say *replace at ten years*, and NZ adds *check the expiry date annually*. The audit line should
become a replacement-and-expiry check, not an age pass/fail.

## 6. CO-alarm findings

- **No lifespan figure exists in either market's household guidance.** ESV's position (via its gas information sheet)
  is to check the **expiry date marked on the alarm** and prefer alarms that warn when the sensor expires. FENZ says
  the same about smoke alarms: if there is no expiry date, replace it.
- **No test frequency was found for CO alarms** in either market.
- The approved `carbon-monoxide` block already carries what is verified: NZ *"consider installing carbon monoxide
  alarms"*; AU a battery-operated alarm near bedrooms, to UL2034/EN50291.
- **"under 5 years old" must go.** Replacing it with "check the expiry date on the alarm" is supportable in AU once
  ESV's sheet is read live, and is consistent with FENZ's expiry advice in NZ.

## 7. Mould / dampness findings

| | NZ (Tenancy Services) | AU (NSW Health) |
|---|---|---|
| Routine clean | **White vinegar**; on painted surfaces **diluted half and half**; leave a few days, then wipe off with soap and water | **Mild detergent or vinegar diluted 4 parts vinegar to 1 part water** |
| Bleach option | **one part bleach to three parts water** | **250 mL of bleach in 4 litres of water**, only if the mould is not readily removed |
| PPE | **"Wear gloves, eye protection and a safety mask"** | **"PVC or nitrate rubber gloves; safety glasses; and safety shoes"**, and ventilate the area |
| Afterwards | rinse the cloth often to stop spreading it | **dry the surface completely** |
| Soft materials | — | **carpet and absorbent materials may need professional cleaning or replacement** |
| When to stop | if the home is still damp and mouldy, **a qualified building surveyor may need to check** | if you cannot find the source, **an occupational hygienist**; health concerns → doctor or the Public Health Unit (1300 066 055) |
| Testing | — | **"Since most mould is visible, it is generally not necessary to test"** |
| Health | — | runny/blocked nose, eye and skin irritation, wheezing; asthma attacks; rarely severe infection. **"most people will not experience any health problems"** |

**The two markets' cleaning methods are different, and the dilutions are different.** Neither may be copied to the
other. The legacy "bleach kills visible mould" line is closest to NSW's, but bleach is the *second* option in both.

## 8. Ventilation findings

**MBIE (NZ), verbatim where it matters:** heat to **18–22 °C**; the kitchen, bathroom and laundry "should have range
hoods or extractor fans"; **"The moist air needs to be vented to the outside (not into the roof space)"**; vent the
dryer outside or use a condensing/heat-pump type; **"Ventilate regularly – for example, by opening windows several
times each day for 15 minutes"**; don't dry clothes inside; cover pots; fix leaks; **up to 40 L per day** can come
from under the floor without a ground vapour barrier; *"If you eliminate moisture sources, heat to healthy
temperatures (18-22ºC) and improve ventilation … you should not need a dehumidifier."*

**Australia:** NSW Health's mould sheet ties mould to "wet or moist areas that lack adequate ventilation" and to
ventilating while cleaning, but **no Australian source read publishes airing times, humidity targets or extraction
rates**. The AU wording must therefore stay non-numeric on ventilation.

**"Shower steam clears within 10 minutes" has no source in either market and must go.** No humidity percentage, no
air-change rate and no airing time may be written for AU.

## 9. Combustion findings

The three approved blocks cover what OG-13 needs and **none of them should change in this stage**:

- `carbon-monoxide` — CO alarms, symptoms, emergency action (both markets)
- `solid-fuel-heating` — flue maintenance, clearances, servicing (both markets)
- `indoor-combustion` — never bring it inside (both markets)

**One addition worth noting:** MBIE's damp guidance says plainly to **avoid unflued gas heaters** indoors as a
moisture and air-quality source. That is gas wording, and gas remains **blocked** under `GAS_SAFETY_REQUIRED` — so
OG-13's migration must either avoid unflued-gas wording entirely or wait for the gas research stage. **Recommend
avoiding it:** the audit does not need to name gas heaters to ask whether a home is damp.

## 10. Mask findings

- **AU: supportable, with care.** NSW Health (17 Mar 2025): P2/N95 masks "can help filter out the fine particles
  found in bushfire smoke when worn correctly"; they must "form a tight seal"; beards must be shaved; they are
  **disposable and replaced after each use**; people with heart or lung conditions should speak to a doctor; they are
  **"not designed to fit the smaller face of children"**; and they are recommended when **returning to fire-damaged
  homes**, with sturdy footwear, heavy-duty gloves and coveralls.
- **NZ: not verified.** Health NZ's fires-and-smoke page tells people to stay indoors, shut windows and doors, switch
  air conditioning to recirculate, avoid indoor combustion and reduce outdoor exercise. **It names no mask.**
- **Recommendation:** keep the audit row, but make it market-specific — AU cites NSW Health's fit and use conditions;
  NZ asks whether the household can shut the house up and follow official advice, with **no mask claim** until an NZ
  source is found. Occupational respirator guidance must not be borrowed for household use.

## 11. Health-claim findings

| Legacy claim | Action |
|---|---|
| "3 weeks without food, 3 minutes without clean air" | **REMOVE.** Unsourced, and it is the kind of line that makes everything after it sound less careful. |
| "cause more hospitalisations than power outages" | **REMOVE.** No source; a comparison nobody publishes. |
| "could prevent years of health problems" | **REMOVE.** |
| Replacement (calm, sourced, AU) | NSW Health: mould spores "may cause health problems if inhaled by people who are sensitive or allergic"; effects include "a runny or blocked nose, irritation of the eyes and skin, and sometimes wheezing"; for people with asthma it "may cause an asthma attack"; **"most people will not experience any health problems"**. |
| Replacement (calm, sourced, NZ) | Health NZ: smoke "can make it hard for some people to breathe"; at-risk groups are the elderly, pregnant people, young children and people with asthma or heart disease; see a healthcare provider or call 111 for shortness of breath, wheezing or chest pain; Healthline 0800 611 116. |

## 12. Price inventory

| Price | Context | Classification |
|---|---|---|
| "Under $50" | section heading | **REMOVE** |
| "$15–$30 each" | smoke/CO alarms | **REMOVE** (and the "highest life-saving ROI" claim with it) |
| "$10–$20" | window/trickle vents | **REMOVE** |
| "$40–$80" | small dehumidifier | **REMOVE** (and "drops humidity below mould threshold") |
| "$5" | bleach and spray bottle | **REMOVE** |

**All five REMOVE.** None is verifiable, all are single-currency across two markets, and the whole box is a shopping
list rather than an audit. **Nothing moves to a pricing system** — there is no pricing system, and Stage 9.48
recommended not building one until prices are actually needed.

## 13. Proposed block — `fire-and-smoke-alarms` (NZ and AU)

**Trigger rules (fail closed).** The existing fire detector already fires on fire, bushfire, wildfire, smoke alarm and
evacuation wording. This block would answer it, via a `NOTE_ANSWERED_BY` entry, **only when the resource carries the
block**. Until the block is approved, any resource teaching alarm guidance stays blocked — which is the current
behaviour and should not change.

**Proposed NZ body (every sentence sourced):**

> **Working smoke alarms are the difference between a fire you escape and one you do not.** Fire and Emergency New
> Zealand recommends **long-life photoelectric smoke alarms**, and interconnected alarms where you can — if one
> detects smoke they all sound, which matters most in multi-storey homes and homes with long hallways. *(FENZ)*
> Install one in **every bedroom, hallway and living area**. Do not put a smoke alarm in the kitchen, where cooking
> smoke will set it off — use a heat alarm there instead. *(FENZ)*
> **Once a month**, press the test button. **Every six months**, vacuum or dust them. **Every year**, check the expiry
> date on the alarm — if there is no expiry date, replace it — and if it takes a 9V battery, replace the battery.
> **Every ten years**, replace the alarm. For hard-wired alarms, follow the installer's schedule. *(FENZ)*
> **If you rent or let a property:** working smoke alarms are compulsory, there must be one in every room where
> someone sleeps or within **three metres of each bedroom door**, and on every level; alarms installed since 1 July
> 2016 must be long-life photoelectric meeting the standard. *(Tenancy Services)*

**Proposed AU body:**

> **Working smoke alarms are the difference between a fire you escape and one you do not**, and **the rules differ by
> state and territory** — check what applies where you live.
> Fire and Rescue NSW advises testing alarms **every month** by holding the test button for **at least five seconds**,
> vacuuming them **every six months**, replacing lead or alkaline batteries **every 12 months**, and replacing the
> alarms themselves **every ten years**, or earlier if the manufacturer says so. NSW law requires replacement within
> ten years of manufacture. *(FRNSW)*
> **Queensland is stricter, and it is law.** Every domestic dwelling must have **interconnected photoelectric** alarms
> in **every bedroom, hallway and on each storey**, hard-wired or powered by a non-removable ten-year battery — since
> 2017 for new and substantially renovated homes, since 2022 when a home is sold or leased, and **from 1 January 2027
> for all remaining dwellings**. *(Queensland Fire Department)*
> Fire and Rescue NSW notes that what matters most is **the number of alarms, where they are, and whether they are
> interconnected** — not the sensor type alone.

**Source requirements:** FENZ and Tenancy Services for NZ; FRNSW and Queensland Fire Department for AU, each labelled
by state. **No national Australian rule may be stated.**

**Numeric dependencies:** monthly test, five-second hold (NSW), six-monthly vacuum, annual battery and expiry check,
ten-year replacement, three metres from a bedroom door (NZ rentals), and Queensland's three dates. **All of these need
`numeric-claims.json` entries before the block can pass the gate.**

## 14. Proposed block — `mould-and-dampness` (NZ and AU)

**NZ body (Tenancy Services + MBIE):** keep the home aired and heated; open windows and use extractor fans when
cooking, bathing or drying; lids on pots; wipe condensation; dry washing outside; furniture away from walls. Remove
mould as soon as it appears: **white vinegar, diluted half and half on painted surfaces**, left a few days then wiped
off with soap and water; **or one part household bleach to three parts water**. **Wear gloves, eye protection and a
safety mask.** If the home is still damp and mouldy, **a qualified building surveyor may need to check for a hidden
source** — and if you rent, tell your landlord.

**AU body (NSW Health):** mould grows in wet or moist areas that lack ventilation. For routine cleaning, **mild
detergent or four parts vinegar to one part water**; if that does not shift it, **250 mL of bleach in 4 litres of
water**, with **PVC or nitrile gloves, safety glasses and safety shoes**, the area well ventilated, and the surface
**dried completely** afterwards. **Carpet and other absorbent materials may need professional cleaning or
replacement.** Testing is generally unnecessary because most mould is visible; if you cannot find the source, an
**occupational hygienist** can help. Health effects are usually minor and **most people will not experience any** —
but if someone in the home reacts, see a doctor, and your local public health unit can advise.

**Fail-closed notes:** the dilutions are market-specific and must never cross; "kills mould" claims are replaced by
the agencies' own wording; **no surface-area threshold, no PPE beyond what the source names, and no respirator
guidance**.

## 15. Proposed block — `home-ventilation` (NZ and AU)

**NZ (MBIE):** vent moisture at the source — range hood or extractor fan in the kitchen, bathroom and laundry,
**vented outside, not into the roof space**; vent the dryer outside or use a condensing or heat-pump dryer; **open
windows several times a day for about 15 minutes**; heat to **18–22 °C**; don't dry clothes inside; cover pots; fix
leaks promptly. **If you eliminate moisture sources, heat properly and ventilate, you should not need a
dehumidifier** — and if you use one, empty it often and close windows while it runs.

**AU:** **non-numeric.** Ventilate wet areas and use extraction where you have it; keep windows open when you can and
when the outdoor air is not smoky; dry the home after leaks or flooding. **No airing time, humidity target or
extraction rate** — no Australian source read publishes one, and one must not be borrowed from New Zealand.

## 16. Numeric-claim impact

Numeric blocking is **active**, so every figure the rebuilt OG-13 keeps must be registered, treatment-owned, inside an
approved block, or removed.

| Figure | Market | Category | Needed entry |
|---|---|---|---|
| test monthly · vacuum six-monthly · battery yearly · expiry yearly · replace at ten years | NZ | interval | FENZ, owning the alarm block |
| three metres from a bedroom door | NZ | distance | Tenancy Services |
| 18–22 °C | NZ | temperature | MBIE — **the first live temperature claim in the library** |
| open windows ~15 minutes, several times a day | NZ | interval | MBIE |
| test monthly · five-second hold · vacuum six-monthly · battery 12-monthly · replace at ten years | AU | interval | FRNSW, labelled NSW |
| 2017 / 2022 / 1 Jan 2027 | AU | (dates) | classified **structural** by the detector — but they must still carry the Queensland label in the copy |
| 250 mL bleach in 4 L water | AU | capacity | NSW Health, labelled NSW |
| 4:1 vinegar, 1:3 bleach | both | **ratio — no unit** | **Architecture gap: the detector cannot see a unitless ratio.** It would pass unregistered |

**Two findings for you:**

1. **Unitless ratios are invisible to the numeric gate.** "One part bleach to three parts water" carries no unit, so
   nothing catches it. Options: add a `ratio` claim type with its own pattern detection (not a new *category*), or
   require dilution wording to carry a measured volume. **Recommend the first, in the stage that builds these blocks.**
2. **Temperature and distance would get their first live exercise here.** Stage 9.50 recorded both as enabled but
   untested; OG-13 would be the test, which is an argument for building the blocks and their registry entries in one
   stage and re-running the whole library.

## 17. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| title | **Healthy Home Air Audit** | unchanged — accurate |
| resourceType | **assessment** | **OWNER-REVIEW REQUIRED** — it scores and ranks, like OG-15 (assessment), rather than teaching like a guide |
| foundation | **air** | the foundation's first resource |
| category | **air-quality** *(or the nearest existing Air category)* | **OWNER-REVIEW REQUIRED** — the Air categories have not been used yet |
| difficulty | **beginner** | **OWNER-REVIEW REQUIRED · INFERRED** — a walk-through checklist with no calculation |
| estimatedTime | **20 minutes** | **OWNER-REVIEW REQUIRED · INFERRED** — the document's own claim, which is plausible for ten rooms |
| description | "Walk through your home and score ten things that decide the air you breathe — alarms, damp, mould, ventilation and smoke — then fix the three that matter most." | **OWNER-REVIEW REQUIRED** |
| tags | **[]** | the convention across all 19 live resources |

## 18. Air Foundation pathway — recommendation only

**Proposed order, none of it built:**

1. **Healthy Home Air Audit (OG-13)** — the entry assessment: what is wrong, and what to fix first
2. **Ventilation and moisture control** — the fix for most audit failures (no resource exists; OG-15 Warm Home
   Scorecard overlaps and is live in Shelter)
3. **Mould and dampness** — what to do about what the audit found (no resource exists)
4. **Smoke, alarms and combustion safety** — alarms, wood burners, CO (partly covered by live Shelter resources)
5. **Ongoing air quality** — seasonal checks (candidate: OG-B15 Annual Maintenance Calendar, not started)

**Honest assessment:** only step 1 exists as a legacy resource with a clear Air identity. Steps 2–4 are *safety
blocks* today, not resources, and two of them would be created by this stage's proposals. **A one-resource pathway is
not a pathway**, so I would not build an Air learning path until at least a second Air resource exists.

## 19. Migration readiness recommendation

**OG-13 is not ready, and it is further away than OG-09 was.**

| Gate | State |
|---|---|
| Fire detector | **blocks it** — OG-13 teaches alarm guidance, so the OG-02 hazard-label exemption does not apply and must not be stretched |
| `fire-and-smoke-alarms` block | **does not exist** — proposed above, needs owner approval |
| `mould-and-dampness` block | **does not exist** — proposed above |
| `home-ventilation` block | **does not exist** — proposed above |
| Numeric gate | **blocks it** — a dozen figures need registry entries, plus a ratio claim type |
| Gas | **must be avoided** — MBIE's damp advice names unflued gas heaters, and gas is still blocked |
| Content | 24 claim groups; **5 prices, 3 health claims and 3 figures to remove outright** |

**Recommended sequence:**

1. **This stage's approvals** — the three blocks, sentence by sentence, as drafted here.
2. **One build stage** — the blocks, their `numeric-claims.json` entries, the ratio claim type, and a full re-run of
   all 19 resources to prove the library stays green.
3. **Then OG-13's migration** — claims-first, as usual, with the audit rewritten around what the blocks say.

That is three stages, not one. The alternative — migrating OG-13 first and writing safety wording around it — is the
order this project deliberately abandoned at Stage 9.42, and the gates would stop it anyway.

**Stopped.** OG-13 was not migrated, no PDFs were prepared, nothing was deployed, and no block was created or changed.

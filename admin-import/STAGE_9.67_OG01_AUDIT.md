# Stage 9.67 — OG-01 Home Resilience Scorecard: claims-first audit

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Audit only. Nothing deployed, nothing rendered, no PDFs, no resource added, no live resource changed.** Baseline held: 22/22 protected resources · 44/44 market files · Bucket C = 0 · rollback `fa23ec74-…` retained · public/demo untouched.

## 0. What the legacy document is

A one-page-plus scorecard (HTML 15.7 KB; PDF the same content). Ten questions, two for each of Air, Water, Shelter, Food and Energy, each scored 1–10 (total /100); a per-question scoring scale; a total-score band line; a "Quick-Fire Household Facts" block of member inputs; "Your Top 3 Priority Pillars"; and a "Day 1 Complete" closing that points to OG-02. **There are no prices and no percentages.**

## 1. Full legacy claim inventory

K = KEEP · V = VERIFY · RW = REWRITE · RM = REMOVE · EX = KEEP_AS_EXAMPLE

| # | Legacy text | Class | Notes |
|---|---|---|---|
| 1 | "OffGrid056 30-Day Programme", "Week 1 — Foundation", "Asset OG-01 \| Day 1" (cover, header ×2) | **RM** | legacy programme sequencing (3 content flags) |
| 2 | "Day 1 Complete … The rest of this programme builds from this score. Keep this scorecard visible — you'll refer to it daily." | **RW** | "Complete" label; programme dependency; "daily" use is not required (flag `day-complete`) |
| 3 | "Next: OG-02 Household Risk Identifier →" | **RM** | next-link / cross-reference flags; a real next step may return as a normal related link |
| 4 | Subtitle: "Know your starting point. Score your home across Air, Water, Shelter, Food, and Energy — then know exactly what to fix first." | **RW** | "know exactly what to fix first" overclaims: the score ranks the member's own answers, not objective priorities |
| 5 | "Rate your household 1–10 on each question below. Be honest — this is for your eyes only. A low score isn't failure; it's your roadmap." | **K** (light edit) | calm and useful; "roadmap" is fine as framing |
| 6 | "Total possible score: 100 points. Complete this in 15–20 minutes." | **K** | owner-defined mechanics; 15–20 min = the resource's own time estimate |
| 7 | Per-question scale: 1–3 "Critical Gap — Immediate action needed"; 4–5 "Weak Spot — Plan upgrade soon"; 6–7 "Adequate — Room to improve"; 8–9 "Strong — Minor tweaks only"; 10 "Resilient — Fully prepared" | **RW** | OffGrid056's own scale (see §2). "Critical", "Immediate action needed" and "Fully prepared" are fear/guarantee language |
| 8 | Total bands: "0–30 Critical \| 31–50 Vulnerable \| 51–70 Developing \| 71–85 Capable \| 86–100 Resilient" | **RW** | a second, **different** band system (see §2) with arbitrary cut-offs and alarming labels |
| 9 | Q1 "Indoor air feels fresh; no persistent dampness, mould, or stuffiness" | **K** (split) | Air; three things in one question |
| 10 | Q2 "Working smoke alarms + CO detector on every level" | **K → move** | household safety (Resilience & Emergency); triggers the fire block. "On every level" is a universal rule — **V**; carries a CO claim |
| 11 | Q3 "At least 3 days of stored water per person (minimum 10L/person/day)" | **RW** | **numeric; contradicts both markets' sources** — see §6 |
| 12 | Q4 "Backup water source identified (rainwater, stream, well, or neighbour)" | **K** | Water; independence. "stream, well" imply untreated sources — a list of options only, no instruction |
| 13 | Q5 "Home stays warm in winter without extreme power bills; insulation adequate" | **K** (split) | Shelter; "extreme power bills" is vague; two questions in one |
| 14 | Q6 "Roof, windows, and doors are weathertight; no leaks or drafts" | **K** | Shelter |
| 15 | Q7 "7+ days of non-perishable food stored and accessible" | **RW** | numeric; exceeds both markets' official three-day baseline (§6) |
| 16 | Q8 "Food rotation system exists; nothing expired or forgotten" | **K** | Food |
| 17 | Q9 "Backup power available (solar, battery, generator, or charged power station)" | **K** | Energy; the electrical-block trigger; four options in one |
| 18 | Q10 "Lighting, phone charging, and basic cooking possible without grid power" | **K** (split) | Energy / outage capability; three capabilities scored as one |
| 19 | Score column "0" placeholders, "Notes…" inputs, "___ / 100", "Add all 10 scores above" | **K** | member inputs |
| 20 | "Quick-Fire Household Facts": property type; number of people; primary heating source; primary water source; approximate monthly power bill; biggest worry if grid goes down for 72 hours | **K** (one **RW**) | context inputs. "72 hours" sets an implicit outage standard — rewrite as "for several days" or keep as the owner's scenario (decision) |
| 21 | "Your Top 3 Priority Pillars … You cannot fix everything at once. Pick 3." | **K** | the useful decision step; rename "pillars" to "foundations" per programme vocabulary |
| 22 | The word "Pillar(s)" (column header, fields) | **RW** | the programme calls them the Five Foundations |

Not present in the source (audited): prices, percentages, temperatures, distances, lifespans, servicing intervals, fuel/gas content, treatment content, official-agency names.

## 2. Scorecard logic classification

**C — MIXED, with B dominant.**
- **B (OffGrid056's own assessment instrument):** the 1–10 member self-rating, the /100 total, the per-question scale and the total bands are the programme's own device. They are **arbitrary internal bands**: nothing external defines "Vulnerable" at 31–50.
- **A (external-looking factual claims embedded in the questions):** Q3's "10L/person/day" and "3 days", Q7's "7+ days" and Q2's "CO detector on every level" read as official minimums. They are not (§6).
- **Problems to correct:** (a) two band systems that disagree (average 7 per question is "Adequate", but a 70/100 total is "Developing"; 8.5 average is "Strong" but 85/100 is "Capable"); (b) alarm labels ("Critical", "Vulnerable"); (c) double-barrelled questions (Q1, Q5, Q9, Q10); (d) no source for any threshold.
- **Required labelling if kept:** state in the document that this is **an OffGrid056 self-assessment scale for your own planning — not an official rating, not validated, not a prediction of safety and not a guarantee of resilience.** Treat every cut-off as **OWNER-DEFINED / OFFGRID056 ASSESSMENT SCALE**, never as a fact.

## 3. Five Foundations mapping

| Q | Item | Foundation | Lens |
|---|---|---|---|
| 1 | air quality, damp, mould | **Air** | resilience-planning |
| 2 | smoke alarms + CO detector | **Air** (household safety) | **resilience-emergency** |
| 3 | stored water, days and litres | **Water** | **resilience-emergency** (emergency water) |
| 4 | backup water source | **Water** | independence / off-grid |
| 5 | warmth, insulation, power bills | **Shelter** | resilience-planning |
| 6 | weathertight envelope | **Shelter** | resilience-planning |
| 7 | days of stored food | **Food** | **resilience-emergency** (emergency food) |
| 8 | food rotation | **Food** | resilience-planning |
| 9 | backup power | **Energy** | resilience-planning / independence |
| 10 | lighting, charging, cooking without grid | **Energy** | outage capability (emergency / independence) |

- **Coverage:** exactly two questions per foundation — balanced.
- **Duplicates:** none. Q5 and Q9 both touch power but ask different things.
- **Belong under Resilience & Emergency:** Q2, Q3, Q7 (and Q10 in part).
- **Missing from the core scorecard (gaps, for the owner):** emergency communication/information; people-specific needs (medical, children, older members, pets); sanitation; fuel for heating/cooking; a plan or practice. None is added without your word.
- **Not in the core:** nothing needs deleting; the emergency items should be **separated, not removed** (§4).

## 4. Resilience / emergency separation

The legacy mixes household resilience (Q1, Q5, Q6, Q8), emergency preparedness (Q2, Q3, Q7) and independence (Q4, Q9, Q10). Proposal: keep the scorecard's **main purpose resilience planning**, keep all ten topics, but present them as **two clearly labelled parts**: **Part A — Your five foundations** (seven questions, one or two per foundation, each scored on the one OffGrid056 scale) and **Part B — Emergency basics** (Q2, Q3, Q7: alarms, stored water, stored food), scored the same way but **kept visibly separate** and pointing to the Resilience & Emergency resources (OG-08 Water Storage Calculator, OG-11 30-Day Pantry Builder; the unmigrated OG-06 72-Hour Emergency Checklist when it exists). Part B carries **no day or litre figure** of its own (§6).

## 5. Safety triggers (confirmed, exact)

| Topic | Required? | Exact trigger | Block |
|---|---|---|---|
| **Electrical** | **Yes** | "solar", "battery" (and "generator") in **Q9** "Backup power available (solar, battery, generator, or charged power station)" | existing approved `batteries-and-electrical` (also needed to answer the "generator" mention) |
| **Fire** | **Yes — with a caveat** | "smoke alarm(s)" in **Q2**, **and** the heading "Quick-**Fire** Household Facts" — the heading is a **false positive** (not fire safety) | existing approved `fire-and-smoke-alarms` (answers `fire-and-emergency`) |
| Carbon monoxide | **No** (no topic detector exists for it) | Q2 mentions a "CO detector" | not required; carrying `carbon-monoxide` would be editorial. Recommendation: do **not**, consistent with the OG-B09 rule — the fire block already covers alarms |
| Gas / solid fuel / water treatment / generator-safety / stored-drinking-water / food-safety-power-cut | **No** | each below its detection threshold (rainwater ×1, perishable ×1, generator ×1) | not required. **Watch:** rewriting Q3 and Q7 could raise `stored-drinking-water` or `food-safety-power-cut` if "drinking water" / "pantry" / "fridge" are repeated three times |
| New architecture | **None needed** | no uncovered topic | — |

The pipeline's own dry run agreed: `batteries-and-electrical` and `fire-and-emergency` missing; no gas finding.

## 6. Numeric inventory

| Figure | Where | Nature | Gate today | Class |
|---|---|---|---|---|
| "10L" (per person per day) | Q3 | **external factual claim** | **C_NEEDS_SOURCE (both markets)** | **RW** — see below |
| "3 days" | Q3 | **external factual claim** | **C_NEEDS_SOURCE (both markets)** | **RW** |
| "7+ days" | Q7 | **external-looking claim / OffGrid056 target** | bucket **D** (see detector gap) | **RW** |
| 1–10 scale, /100, bands 1–3 … 10, 0–30 … 86–100 | scorecard | **owner-defined mechanics** | not claims (no unit) | keep as OFFGRID056 ASSESSMENT SCALE after §2 rewrite |
| "15–20 minutes" | intro | owner-defined time | D | K (becomes the 20-minute estimate) |
| "30-Day", "Day 1", "OG-02" | programme labels | legacy | D / flags | RM |
| "72 hours" | household facts | scenario prompt | D | RW or owner-keep |
| "monthly", "daily" | prompts / closing | passing | D | K / RW |

**The water and food figures conflict with the sources already on file** (read live in Stages 9.27/9.37, registered to OG-08 and OG-11 only): **NZ** (NEMA Get Ready) — at least **three litres** of drinking water per person per day for at least three days, and food for at least three days; **AU** — **no national figure**: Get Ready Queensland says ten litres per person *for three days* and three days of food, NSW Food Authority says up to 14 days, and other states differ. So "minimum 10 L/person/day" is wrong in NZ (three litres) and wrong in Australia (ten litres is the *three-day total* in one state), and "7+ days" is an OffGrid056 target presented beside a three-day official baseline. Another resource's registry claim cannot be borrowed (claims are owned per resource). **Recommendation: REWRITE non-numerically** ("drinking water stored for the number of days your emergency service advises, for every person"), with the numbers living in OG-08, which is the resource that owns them. The alternative — register OG-01-owned NZ and AU claims after a fresh live read — is an owner decision.

**Detector finding (reported, partly fixed).** Q7's "7+ days" was **invisible** to the numeric scanner (the "+" broke the pattern). I fixed that narrowly: "N+ unit" is now read as a figure (tested; no live resource changes). It still lands in bucket D ("a duration in passing") because "stored and accessible" carries no interval verb the gate knows. A rule that always treats "<N> days of food/water/fuel" as a claim would catch it — **but it would also flag live OG-11's sentence "You do not need to buy 30 days of food in one shop."** I tried it, saw the live-library failure, and **withdrew it**: it needs your ruling (register or reword OG-11's sentence, or narrow the rule). Recorded in a test.

## 7. NZ / AU differences

| | NZ | AU |
|---|---|---|
| Emergency number / agencies | 111, NEMA (from the standing block) | 000 / 112, State Emergency Service (from the standing block) — never copied across |
| Water / food baselines | NEMA: 3 L/person/day × 3 days; food 3 days | **no national figure**; state-specific (QLD, NSW differ) — none may be written as national |
| Alarm and CO rules | handled by the approved fire block | state-specific; the approved AU wording stands; no "on every level" legal claim |
| Terms | mould, power bill, weathertight — shared | same; "power station" is generic; keep "foundations", never "pillars" |
| Regulations | none cited | none cited |

No AU national rule is to be invented; Q3 and Q7 are non-numeric in both markets.

## 8. Proposed metadata

| Field | Proposal | Status |
|---|---|---|
| Title | Home Resilience Scorecard | OWNER-REVIEW REQUIRED (keep legacy title; alternative "Household Resilience Scorecard") |
| Foundation | **`general`** — it is the cross-foundation entry assessment spanning all five; it is *not* an Air or Shelter resource | OWNER-REVIEW REQUIRED |
| Programme component | **`resilience-planning`** (confirmed from the content: household assessment, scorecard, gaps and priorities; the emergency items are a labelled sub-part) | OWNER-REVIEW REQUIRED |
| Category | `getting-started` (alternative `planning`, where OG-02 and most general resources sit) | OWNER-REVIEW REQUIRED |
| Type | `assessment` (audit HIGH) | confirm |
| Difficulty | `beginner` | OWNER-REVIEW REQUIRED (inferred) |
| Estimated time | 20 minutes (the legacy says 15–20) | OWNER-REVIEW REQUIRED (inferred) |
| Description | "Rate your household across Air, Water, Shelter, Food and Energy, see where the gaps are, and choose the three foundations to work on first." | OWNER-REVIEW REQUIRED |
| Tags | `[]` | convention |
| Status | draft | |

The pipeline currently reports the foundation unset (an audit inference, not HIGH confidence) and no category, difficulty or time.

## 9. Proposed scorecard structure

1. **Cover and purpose** — "A starting point for your household. Not an official rating."
2. **How to use it** — the legacy intro, plus the labelling statement from §2.
3. **One scoring scale** — your own 1–10 per item with calm band names (owner chooses names and whether to keep any total band); the label "OffGrid056 assessment scale".
4. **Part A — Your five foundations** — Air (air quality; damp and mould), Water (a backup water source), Shelter (warmth and insulation; weathertight), Food (rotation), Energy (backup power; lighting, charging and cooking without grid power) — double-barrelled items split or rewritten, all non-numeric.
5. **Part B — Emergency basics** (separate, clearly labelled): alarms, stored water, stored food — no figures; pointers to the Resilience & Emergency resources.
6. **Your results** — a score **per foundation** (out of 20) and an optional total; recommended: **foundation subtotals plus "lowest three"**, rather than one headline number.
7. **Your top three foundations** — the legacy step, kept, with the member's own reasons.
8. **Household facts** — the legacy inputs (heating source, water source, household size, monthly power bill as a blank, "if the grid is down for several days, my biggest worry").
9. **Where next** — one pointer per foundation (§11).
10. **Close** — calm: what the score does and does not mean. Standing safety blocks: `general-disclaimer`, `emergency-contact`, `batteries-and-electrical`, `fire-and-smoke-alarms`.

## 10. Member-journey role

**Start Here — the entry assessment, and the first step of Resilience Planning.** It is the only resource whose job is to route a member to the right foundation. The `start-here` collection exists in the schema; the owner decides whether OG-01 joins it.

## 11. Recommended follow-on (not added as related links yet)

By lowest foundation: **Air** → Healthy Home Air Audit (res-1013); **Water** → Water Storage Calculator (res-1008), then Rainwater Harvesting Planner (res-1010); **Shelter** → Warm Home Scorecard (res-1015), then the new Resilient Heating & Insulation Upgrade Checklist (res-1509); **Food** → 30-Day Pantry Builder (res-1011); **Energy** → Solar Power 101 Workbook (res-1018) or Battery Backup Planner (res-1019). **Overall next step:** Household Risk Identifier (res-1002). If you want related links, the useful set is one per foundation plus the Risk Identifier (six); I have added none.

## 12. Readiness decision

**PREPARED — NOT READY TO MIGRATE.** The audit is complete. Migration is blocked only by owner decisions (below) and the config work that follows. No new safety architecture is needed; both required blocks already exist and are approved.

## 13. Exact owner decisions required

1. **Foundation and category:** `general` + `getting-started` (or `planning`)? Confirm the cross-foundation framing.
2. **Water and food figures (Q3, Q7):** rewrite non-numerically and point to OG-08 / OG-11 (recommended), **or** register OG-01-owned claims after a fresh live read? Is "7+ days" an OffGrid056 target you want to keep, labelled as such?
3. **Scale:** keep 1–10 and /100? One band system or none? Names for the bands (the legacy "Critical / Vulnerable" are alarming)? Foundation subtotals instead of one headline score?
4. **Emergency separation:** Part A / Part B structure as proposed, or a different split?
5. **Gaps:** add questions on communication, people-specific needs, sanitation or heating fuel — or leave them to later resources?
6. **Safety blocks:** carry `batteries-and-electrical` and `fire-and-smoke-alarms` (recommended); do **not** add `carbon-monoxide`.
7. **"72 hours"** prompt: rewrite to "several days", or keep as your scenario?
8. **Related links:** none, or the six in §11?
9. **Detector ruling:** the "<N> days of food/water/fuel" always-a-claim rule — apply it, and how to treat live OG-11's "30 days of food in one shop" sentence.
10. **Description, title, difficulty and time** (§8).

## 14. Validation

| | |
|---|---|
| lint / typecheck | clean / clean |
| Tests | **644 passing** (637 → 644: +7 OG-01 audit tests) |
| Library | **22 / 22 protected · 44 / 44 market files · Bucket C = 0**; `import:verify-prep` verified; 0 price / safety-removal findings; every live resource still ready (the two "gas requirements" are OG-B09's own, as before) |
| Detector change | "N+ unit" quantities are now seen; no live resource changed. The stronger rule was tried, flagged live OG-11, and was withdrawn |
| `private-assets/` / Worker | 67 files, none modified in this stage · Worker unchanged (`db2fd12a-…`, rollback `fa23ec74-…`) |
| Scheduled | `classify-the-21-live-resources` still scheduled for the next normal deployment; the exemption list is untouched |

# Stage 10.06 — next legacy resource verification and OG-14 claims-first audit

**Audit only.** Nothing was rewritten, migrated, rendered, staged or deployed. The three registers, the protected records, PDFs, `lib/content/route-policy.json`, Start Here, Planning Tools, Five Foundations, programme routes, the same-topic algorithm, Access and the Worker are untouched.

LIVE: **28 protected resources · 56 market files · 0 broken links** · Worker `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` · rollback `e1b31486-afbe-4849-9702-a54e51114717` · Bucket C 0 · 1,204 tests. Migration state (unchanged): Deployed 28 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 15 = 45.

## 1. Not Started list (verified)
`RESOURCE_REGISTER.md`, "Not started (15)", lists exactly the expected 15: OG-14, OG-23, OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15. `CURRENT_STATUS.md` and `NEXT_ACTIONS.md` carry the same count (Not started 15, Deployed 28, Staged 0, 45 total) and the same live figures and Worker IDs; they do not list the individual codes. **No register conflict.** No code in the list has a protected record. The registers carry no explicit priority rule (the "Immediate queue" in `NEXT_ACTIONS.md` is a labelled Stage 9.61 historical snapshot), so the earliest-code rule applies: **OG-14** is the earliest Not Started resource (OG-12 and OG-13 are deployed).

Register row: `| OG-14 | Basic Survival Systems Mini-Plan | — |` under Food (register grouping). **Mismatch found (not a register conflict):** `PROGRAMME_ARCHITECTURE.md` describes the Food pathway as "pantry (OG-11) → rotation (OG-12) → growing and preserving (OG-14)", but the OG-14 source is a Week 2 water, food and air synthesis, not growing or preserving. See owner decisions.

## 2. Source
| | |
|---|---|
| HTML | `...\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-14_Basic_Survival_Systems_MiniPlan.html` (11,019 bytes; copy `workspace/og-14-legacy.html`) |
| PDF | `...\OffGrid056\PDFs\OG-14_Basic_Survival_Systems_MiniPlan.pdf` (4 pages, 463,809 bytes) |
| HTML `<title>` | "OG-14 Basic Survival Systems Mini-Plan — OffGrid056" (PDF title field identical) |
| Cover title | "Basic Survival Systems<br>Mini-Plan" (chip "Week 2 — Water, Food & Air"; label "OffGrid056 30-Day Programme"; brand "OFFGRID056.COM") |
| Cover subtitle | "Week 2 synthesis. Water, Food, and Air — distilled into one actionable document that shows exactly where you stand and what to do next." |
| Page-header title | "Basic Survival Systems Mini-Plan"; header right "Asset OG-14 \| Day 14" |
| Programme context | "Week 2 — Water, Food & Air", "Day 14"; synthesises Days 8–13 (= OG-08 to OG-13, all live) |
| Old next pointer | "Next: Week 3 — Shelter, Heating & Energy →" |
| Cover image reference | `/mnt/agents/output/OffGrid056/Covers/Week2_WaterFoodAir_Cover.jpg`, alt "Week 2" (build path, not member-visible) |

## 3. Primary job and output
The member consolidates the Week 2 work (water, food, air) into one page, chooses up to five actions, checks spending against a declared budget tier and briefs the household. Primary output: **a one-page household snapshot with an action list and briefing notes** (a synthesis worksheet). Classification: **worksheet** (implementation support). Almost every field is a blank for the member; there is almost no teaching text.

## 4. Content inventory
| # | Section | Content | Class |
|---|---|---|---|
| 1 | Cover | chip "Week 2 — Water, Food & Air", "OffGrid056 30-Day Programme", title with "Survival", subtitle, "OFFGRID056.COM", build-path image | REWRITE (shared cover; remove programme, survival framing, legacy brand) |
| 2 | Page header | "Asset OG-14 \| Day 14" | REMOVE |
| 3 | "The Week 2 Lock" box | synthesises Days 8–13; "If you only keep one document from Week 2, keep this"; share with family or a professional | REWRITE (programme wording, promotional line) |
| 4 | "Week 2 Pillar Summary" — Water card | "Days 8–10"; "3-day storage: ___ L"; "7-day target: ___ L"; "Gap to close: ___ L"; "Filtration chosen"; "Score: ___/10" | REWRITE: keep the member fields (storage, gap, treatment chosen) as KEEP_AS_MEMBER_INPUT; VERIFY the 3-day and 7-day labels against OG-08; REMOVE the /10 score |
| 5 | Food card | "Days 11–12"; "Days of supply: ___"; "Target: 30 days"; "Gap: ___ days"; "Rotation system: Yes / No"; "Score: ___/10" | REWRITE: keep days of supply and rotation tick; **REMOVE** "Target: 30 days", the gap-in-days line and the score |
| 6 | Air card | "Day 13"; "Air audit score: ___/50"; "Critical items (score 1–2)"; smoke alarm OK/Fix; CO detector OK/Fix; "Score: ___/10" | VERIFY against OG-13 (its own 1–5 scale, total "___ / 50", items scored 1 or 2); REMOVE the /10 score; keep alarm and detector ticks as member input |
| 7 | "My Week 2 Priority Actions" / Action Lock List | "lock the 5 actions you will complete before Week 3 begins. No more than 5. Focus wins."; five lines "(Pillar: ____)" | REWRITE or REMOVE (duplicates OG-07, which locks three priorities; "Pillar" and "Week 3" legacy) |
| 8 | "Week 2 Budget Check" | three fields: total spent; still needed; "within my declared tier budget? (from OG-03)" | REWRITE or REMOVE (OG-03 is now the Spending Capacity Check; tiers live in OG-26; overlaps OG-26) |
| 9 | "Family Briefing Notes" | four fields: where emergency water is stored; how long our food supply lasts; what to do if the smoke alarm goes off; who checks the pantry rotation each month | **KEEP_AS_MEMBER_INPUT** (the one element no live resource has); VERIFY the smoke alarm prompt (member field, not an instruction) |
| 10 | "Before You Move to Week 3" box | Week 3 covers Shelter, Heating, Energy; "These are the foundations. Week 3 builds the walls." | REMOVE (programme sequencing) |
| 11 | Closing box | "Week 2 Complete"; "You have secured the three pillars of basic survival... You know your gaps, your priorities, and your budget. You are ready for Week 3."; "Next: Week 3 — Shelter, Heating & Energy →" | REWRITE (outcome assurance, survival framing, programme and next pointer) |

Scan of the requested categories: Week/Day yes (14 Week, 6 Day mentions); 30-Day Programme yes (1); Pillars yes (7); fear or survival framing yes (title, "basic survival", closing); emergency-period none; supply-duration yes (food "Target: 30 days", water "3-day"/"7-day", "How long our food supply lasts"); storage-duration none; numeric figures yes; percentages none; ratios (the /10 and /50 scales); prices none; savings none; multiplier none; comparative-performance none; outcome or guarantee yes ("You have secured...", "Focus wins", "keep this"); safety instructions none given (member prompts only); market-specific assumptions none; obsolete links the Week 3 pointer; old codes "Asset OG-14", "OG-03"; promotional wording "If you only keep one document...".

## 5. Foundation
**general.** The job spans three foundations (water, food, air) by design and depends on the outputs of OG-08 to OG-13. Forcing food would be wrong; the register's Food grouping and the architecture document's "growing and preserving" note both mismatch the source. (OWNER-REVIEW REQUIRED.)

## 6. Program Component
**resilience-planning** (recommended; OWNER-REVIEW REQUIRED): it records where the household stands across the three topics, like OG-01 and OG-04. Alternative: `resilience-emergency` (emergency water, smoke alarm and food supply fields). Not `planning-implementation` (the action-lock and budget parts are the ones to drop) and not `advanced-future`.

## 7. Journey position
Not part of the main planning journey (OG-01 → OG-02 → OG-06 → OG-04 → OG-22 → OG-03 → OG-07 → OG-26 → OG-27). Conceptually it is a capstone of the water, food and air pathways (OG-08 → OG-10 → OG-09 → OG-B08; OG-11 → OG-12; OG-13): a summary taken after them, handing off to OG-07 Priority Lock. In the wider bands it sits in Household Resilience. No link was changed.

## 8. Overlap with the live library
| Resource | Overlap |
|---|---|
| **OG-07** Priority Lock Worksheet | **High** on the action lock (three priorities, a first commitment, obstacles). OG-14's five-action list adds nothing and conflicts on the number. |
| **OG-06** Emergency Readiness Checklist | **High** on the status check across water and food, and on recording where things are kept. |
| OG-01 Home Resilience Scorecard | Medium (a cross-area snapshot with a score) |
| OG-26 / OG-03 | Medium on the budget check (tiers are OG-26) |
| OG-27, OG-B04, OG-B10 | Low to medium (action sequencing) |
| OG-08, OG-11, OG-12, OG-13, OG-09 | Each owns its topic; OG-14 only summarises their outputs |
**Unique member value:** the single cross-topic summary and, above all, the household briefing notes (no live resource asks the member to brief the rest of the household). **Duplicated teaching:** none (there is almost no teaching), but the action lock and budget check duplicate OG-07 and OG-26. **Stronger existing resource:** OG-07 for priorities, OG-06 for status. **Standalone status:** justified only as a narrow briefing sheet.

## 9. Demo and programme relationships
- No demo counterpart. The nearest demo entries are unrelated placeholders (`res-0003` Household Resilience Guide is what programme day 14 points to; `res-0008` 30-Day Action Planner and `res-0006` Build Your First 30-Day Action Plan are planners).
- Programme day 14 (`day-14.json`, week 2) is "Day 14 — Placeholder action", general foundation, resource `res-0003`. The legacy day mapping does not match the demo programme. No change proposed.
- Workshops and learning paths: no reference.
- Same-topic: no predictable list; the existing algorithm applies once a record exists.
- Route collision: **none** (no slug, route-policy or record contains "mini-plan", "survival-systems" or a res-1014). No supersedes issue. Approved copy for OG-13 already removed the legacy "Next: OG-14" pointer, so no live page links to OG-14.

## 10. NZ / AU market check (flags only)
The legacy text has no agency, number, tenancy, building or tradesperson content. Market-sensitive prompts: the smoke alarm and CO detector status ticks and "what to do if the smoke alarm goes off" (alarm rules differ; owned by the approved OG-13 and OG-01 handling); the 3-day water label and food-days field (official baselines owned by OG-08 and OG-11); "declared tier budget" (OG-26's NZ and AU assistance wording); "review with a professional" (generic). No external research was done. **Unresolved market claims: none**, provided the rewrite stays member-entered and defers to the owning resources.

## 11. Price scan
Price findings = **0** (PRICE 0, PLACEHOLDER 0, NOT_A_PRICE 0). Money words: "Budget", "spent", "budget" (member-entered fields only). No dollar amount, cost range, savings, payback, affordability or value claim.

## 12. Numeric and claim scan (per market: 4 candidates, legacy **Bucket C 0**)
Families, run on the legacy HTML: ordinary numeric 4; survival-duration 0; supply-duration 0; emergency-period 0; storage-duration 0; multiplier 0; comparative-performance 0; outcome-claim 0 (77 member-facing lines scanned, 0 family hits).

| Class | Items |
|---|---|
| A. Factual claims | none classified by the detector; manual review: "Target: 30 days", "3-day storage", "7-day target" are supply targets that should be treated as unsupported if kept |
| B. Structural labels | "Days of supply", "Gap", "Score: ___/10", "Air audit score: ___/50", "Critical items (score 1–2)" |
| C. Titles | "OffGrid056 30-Day Programme" |
| D. Schedules | "Day 14", "Days 8–13", "Week 2", "Week 3", "each month" |
| E. Member-entered fields | every blank, including the litres, days and scores |
| F. Examples | none |
| G. Non-claims | "5 actions", "No more than 5" |
**Legacy Bucket C: 0.** **Live Bucket C: 0** (28 resources, 56 files, 444 candidates, hardened-rule scan hits 0, price 0).

**Detector gaps (reported, nothing changed):** (1) the supply rule does not claim "Days of supply: ___ Target: 30 days" or "7-day target: ___ L" (classified as a duration in passing); (2) the outcome rule does not claim "You have secured the three pillars of basic survival" (an assurance of readiness). A rewrite removes both; no detector was weakened or changed.

## 13. Safety scan
Required topic by the detector: `food-safety-power-cut` only (the words pantry, rotation and fridge reach the threshold across a handful of fields). Combined with the legacy PDF text the detector also reports `fire-and-emergency`, but that is a double-count of the same words; the PDF alone and the HTML alone require only food-safety-power-cut. All other listed topics (emergency-contact beyond the standing block, fire and smoke alarms, carbon monoxide, generator, batteries and electrical, the four gas topics, water treatment, roof or structural, heating or combustion): none.

| Hit | Class |
|---|---|
| food-safety-power-cut threshold (pantry, rotation, "food supply") | INCIDENTAL_MENTION; REMOVE_IN_REWRITE (a narrow briefing sheet with fewer food terms needs no topic block; owner decision) |
| "Smoke alarms OK/Fix", "CO detectors OK/Fix", "What to do if the smoke alarm goes off" | INCIDENTAL_MENTION (member fields). If kept, NEEDS_MARKET_BLOCK is satisfied by the already-approved fire-and-smoke-alarms handling (owner decision) |
| "Filtration chosen" | INCIDENTAL_MENTION (member field; treatment architecture owns method claims) |
| "emergency water" | INCIDENTAL_MENTION |
No block was added. A rewrite carries the standing emergency-contact and general-disclaimer blocks.

## 14. Claim conflicts
- **OG-07:** locks three priorities; OG-14 locks five.
- **OG-06, OG-07, OG-12 posture:** each states "nothing here is a score, a target or a guarantee"; OG-14's per-topic "Score: ___/10", "Target: 30 days" and "Gap: ___ days" conflict with that posture.
- **OG-08:** the official baseline is three days of water; the 7-day and 14-day figures are OG-08's extended planning labels. OG-14's "3-day storage" and "7-day target" would restate them as fixed targets.
- **OG-11:** "30-day" is the pantry's title and build target, not a household requirement; "Target: 30 days" restates it as one.
- **OG-13:** its own 1–5 scale and total out of 50 are labelled as OffGrid056's own scale, not an official standard; the legacy "___/50" lacks that label.
- **OG-03 / OG-26:** the legacy "(from OG-03)" tier reference is stale (tiers are in OG-26).
- No conflict with OG-09, OG-10, OG-12 (beyond the posture above), OG-15, OG-17, OG-18, OG-19, OG-20, OG-21, OG-B07, OG-B08, OG-B09, OG-B12, the gas or generator architecture, the standing blocks, the numeric-claims registry or the treatment architecture.

## 15. Legacy-language scan (member-facing text)
Pillars 7 ("Pillar Summary", "(Pillar: ____)", "pillars of basic survival"); Week 14 ("Week 2", "Week 3"); Day 6 ("Day 14", "Days 8–13"); 30-Day Programme 1; 72-hour 0; survival 3 ("Basic Survival Systems", "basic survival"); critical 1 ("Critical items"); prepper, panic, worst-case, premium, upsell, Skool, Simply Services, HTPS: 0; legacy codes 2 ("Asset OG-14", "OG-03"); legacy URL "OFFGRID056.COM" and the `/mnt/agents/...` image path; legacy CTA: the "Next: Week 3" pointer. Content flags: 10 (one next-link, five programme-sequencing, three health-claim, one cross-reference).

## 16. Proposed metadata (only if narrowed; no res-ID assigned)
| Field | Proposal |
|---|---|
| Title | Water, Food and Air Household Snapshot — OWNER-REVIEW REQUIRED |
| Foundation | general |
| Program Component | resilience-planning (alternative resilience-emergency) |
| Category | planning — OWNER-REVIEW REQUIRED |
| Type | worksheet |
| Difficulty | beginner |
| Estimated time | 20 minutes — OWNER-REVIEW REQUIRED |
| Description | "Record where your household stands on water, food and air in one place, and brief everyone at home on what they need to know." — OWNER-REVIEW REQUIRED |
| Tags | none (as the live records) |
| Status | draft |
| Collections | none |

## 17. Disposition
**NARROW.** Keep the cross-topic summary (as member-entered fields that point to the owning resources) and the Family Briefing Notes; remove the scores, the 30-day target, the five-action lock (OG-07), the budget check (OG-26/OG-03), the Week 3 pointer and all programme, survival and "Pillar" wording. Unique value is small but real (the household briefing). Claim burden low (no figures once the targets and scores go); safety burden low (standing blocks, no topic block likely); market burden low; rewrite burden medium (the sheet is mostly blanks). Journey role: capstone after OG-13, feeding OG-07.
**Fallback:** MERGE_CONCEPTUALLY into OG-06 and OG-07 (no standalone resource), if the owner judges the snapshot too thin once the duplicated parts are removed.

## 18. Owner decisions required
1. Confirm the disposition (NARROW, or MERGE_CONCEPTUALLY).
2. Foundation: general (recommended), or another.
3. Program Component: resilience-planning (recommended) or resilience-emergency.
4. Resolve the register and architecture mismatch: OG-14 is listed under Food and described as "growing and preserving", but the source is a water, food and air synthesis (a register correction would be a later, separate stage).
5. Keep or drop: the five-action list, the budget check, the smoke alarm prompt in the briefing notes.
6. Title, description, category and time (all marked OWNER-REVIEW REQUIRED).
7. Whether a narrowed sheet that no longer teaches food needs the food-safety-power-cut block (recommended: no).
8. Whether the two detector gaps (supply targets in member-entry lines; assurances such as "You have secured...") should be closed in a later stage.

## 19. Validation (actual exit codes)
Price scan 0 (live: 12 non-price candidates, 0 true prices); live detector scan (`sets-scan`) 0: 28 resources, 56 files, 444 candidates, **Bucket C 0**, survival, supply, emergency-period, multiplier and comparative candidates 0; hardened-rule scan (`live-c97`) 0 with 0 hits; `npm run lint` **0** (0 errors, 27 existing warnings; an earlier run failed only because of four scratch `.cjs` scripts in the git-ignored `workspace/`, which were deleted); `npx tsc --noEmit` **0**; `npx vitest run` **0**, 48 files, **1,204 tests** passed (this includes the content-flag, built-output, register-consistency, route-separation, storage-duration and outcome-claim suites). Legacy OG-14 detector pass (`workspace/og14-detect.mts`) exit 0.

## 20. Not changed
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md`, `RESOURCE_REGISTER.md`, migration-state counts, protected records, PDFs, `route-policy.json`, Start Here, Planning Tools, Five Foundations, programme routes, the same-topic algorithm, Access and the Worker. No rewrite, migration, render, staging or deployment.

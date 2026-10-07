# Stage 9.86 — OG-05 merge plan and claim-detector hardening

**Date:** 7 October 2026 · **No resource created, no PDF, nothing staged or deployed; the Five Foundations page, OG-01, `res-0004`, programme day 3, the routes and the three registers are unchanged.** Live baseline confirmed: 25 / 25 protected · 50 / 50 market files · 0 broken links · Bucket C 0 across the library · Worker `65437c37-b731-4851-b67e-5b0fae79fe12` (100%), rollback `89333107-7c0a-4bdb-8229-f2b5241a9e05` · lint and typecheck clean · **829 tests passing**.

Changes made: one detector rule (`admin-import/audit/numeric.ts`), two new test files, and the decision recorded in `admin-import/config/future-tasks.json` (49 added lines, none removed).

## 1 · Final OG-05 disposition

**MERGED CONCEPTUALLY / NO STANDALONE RESOURCE.** The legacy "5 Pillars Quick Reference" does not become a protected resource: no `res-ID`, no NZ or AU PDF, not staged, not deployed. Recorded as `og-05-merged-conceptually` in `future-tasks.json`, with the follow-up `five-foundations-page-pointer` (NOT STARTED, awaiting your decision).

## 2 · Recorded as NOT CARRIED

None of these is carried into any other resource through the merge:

- the "Rule of 3s" and its memory aid; survival thresholds (the "Survival Threshold" column and the emergency priority table); "fastest killers"
- "3 days without water"; "3 weeks without food"; the "3–4 minutes" (without clean air) and "3–4 hours" (extreme cold or heat) wording
- OG-05's "3 litres per day minimum" wording; its "10 litres per person per day" survival-standard wording; "3-day minimum stored per person (10L/day)" and "10L per person stored?"
- the "30–50%" humidity target; the "7-day" and "30-day" food targets; the unsourced "6-month" water rotation interval; the unsourced greywater and canning, dehydrating and freezing claims; the air-purification health claim
- **smoke-alarm wording** ("working smoke alarms on every level") and **CO wording** ("CO detectors near sleeping areas"): REMOVED / NOT CARRIED; these subjects are already handled by resources with sourced safety architecture, so the sourced wording is not duplicated to preserve OG-05
- "Week 1 — Foundation", "30-Day Programme", "Asset OG-05 | Day 5", "Week 2 covers…" and every other Week / Day / programme label; "Day 5 Complete" and the "anchor for the entire programme" promise; "Next: OG-06 72-Hour Emergency Action Checklist"
- the word "Pillars": the locked framework is the **Five Foundations: Air, Water, Shelter, Food, Energy**

## 3 · The unique ranking kernel

"Rank the Five Foundations from weakest to strongest, or from highest priority to lowest." Preserved as a concept only; no checklist is migrated and no PDF is created. **Finding:** OG-01 already carries this kernel. Its results step "Your Foundation Results" is followed by "Your Three Priority Foundations: use your results to choose the three foundations you want to work on first."

## 4 · Five Foundations page audit (`app/foundations/page.tsx`)

- A static server page, titled "The Five Foundations" ("The OffGrid056 framework"), with a breadcrumb and a header sentence. It lists five cards (Air, Water, Shelter, Food, Energy) from the foundation taxonomy: icon, name, "N topics · M resources", the foundation's one-line description, a progress badge and an "Explore" link to `/foundations/<id>/`. It has no resource content and no member input. `general` has no foundation page.
- It is built from the same code in the public demo build and the private preview, so any change affects both unless gated (the Planning Tools listing used `isPrivatePreview()` for that).
- It could accept a small section without disturbing navigation (the cards and links are independent of anything added below or above them), but the two options differ in what they touch (§5).

## 5 · Option A vs Option B

| | A. A "Rank Your Foundations" interaction | B. A pointer to the Home Resilience Scorecard's priority step |
|---|---|---|
| Disrupts navigation | no | no |
| Duplicates OG-01 | **yes**: OG-01 already asks for the three priority foundations; a 1–5 ranking is a second, competing prioritisation | no: it sends the member to the one that exists |
| Conflicting scores | possible: a member could rank five while OG-01 says three | none: no ranking is added and no score is shown |
| New data | **yes**: a new kind of saved member data in `lib/member/store.ts` (local storage), which also needs backup, restore and start-again handling, tests, and keyboard and screen-reader support for a reordering control | none |
| Demo/protected separation | the page is shared with the public demo build, so the feature needs gating | needs a one-line check that the real scorecard exists (the pointer only shows where `res-1001` is in the build) |
| Unsupported claims | none in itself | none, if the sentence says only what OG-01 does |

**Recommendation: Option B.** It carries the concept without a new feature, new data or a second ranking. Suggested wording, **not implemented**: "Not sure which foundation to start with? The Home Resilience Scorecard helps you choose your three priority foundations." (It states only what OG-01's step says.) If you would rather add nothing, the OG-05 concept is already served by OG-01 and the page.

## 6 · OG-01 impact

**No change is needed, and none was made.** OG-01 already contains the ranking kernel (the three priority foundations). If you ever want a full five-place ranking, the smallest change would be to extend the "Your Three Priority Foundations" step, but that is approved member copy: it changes the OG-01 PDF in both markets (new render, new hashes, a redeploy) and alters an approved results flow. I do not recommend it; the three-priority step is the better design (it avoids ranking foundations that are all fine).

## 7 · `res-0004` Five Foundations Overview (audit only)

- A published **demo placeholder** (`isPlaceholder: true`, status published; guide, getting-started, beginner, 10 minutes; tags air, water, shelter, food, energy, overview; collection `start-here`; no related resources). Its text reads "DEMONSTRATION ENTRY: a placeholder for the Five Foundations Overview", and it points at a demo PDF in `public/resources/general/five-foundations-overview.pdf`.
- Referenced by: the demo learning path `start-here` (step 4), programme day 3 (as resource and worksheet), `household-resilience-guide.json` (a demo resource) and the demo workshop `demo-five-foundations-intro`.
- It has no real counterpart, so `route-policy.json` has no entry for it and none is needed.
- **Pre-existing, outside this stage:** the protected Start Here page still lists six demo placeholders (res-0001 to res-0006, including this one) beside the two real resources (OG-01, OG-02). Stage 9.78B hid the equivalent placeholders from Planning Tools only; Start Here and the library were left alone. Noted for your attention; not changed.

## 8 · Programme day 3 impact

Day 3 is "Day 3 — Placeholder action", week 1, general, with `resourceIds: ["res-0004"]` and the worksheet `res-0004`: wholly demo content. The legacy programme put OG-05 on Day 5, so the day-3 mapping is not tied to it. Retiring OG-05 as a standalone resource creates **no missing protected journey step**: OG-05 never had a protected counterpart, the protected Start Here steps (OG-01 with its priority step, then OG-02) are unchanged, and the Five Foundations page remains the framework's home. Nothing was rerouted.

## 9 · Detector rule added (`admin-import/audit/numeric.ts`)

A **survival / deprivation duration** is now a factual claim candidate (bucket C_NEEDS_SOURCE, reason "a survival or deprivation-outcome duration…") when an interval figure sits in a sentence that either:
- names **going without** something the body needs (air, oxygen, water, food, shelter, heat, heating, warmth, sleep; with lookaheads so "without water damage", "without food waste", "without heat loss" and similar do not count); or
- states a **bodily outcome** (die, death, fatal, lethal, life-threatening, hypothermia, dehydration, starvation, unconscious, suffocate); or
- names **exposure** for a duration ("in extreme cold or heat", "exposed to the elements"); or
- uses **"survive" about a person** (a bodily subject, not a question).

The rule describes the claim pattern: it names no resource and no legacy phrase (a test asserts this). It runs after the sourced-claim, safety-block, treatment-owned and structural checks, so approved wording is unaffected. On the legacy OG-05, Bucket C rises from 7 to **14** in each market. Seven survival intervals are newly caught: "3–4 hours" (extreme cold or heat), "3 days" (without water) and "3 weeks" (without food) from the table, and the four intervals of the "Rule of 3s" line (3 minutes, 3 hours, 3 days, 3 weeks). "3–4 minutes without clean air" was already caught, with the other six figures (30–50%, 3 litres, 10 litres, 10L ×2, 10L/day).

**One false positive found and fixed, not exempted:** the first version also treated any "survive" as an outcome, which flagged a live resource's readiness question, "Can the household survive 72 hours off-grid with only what is on-site?", and the library's blocking test failed. That is a scenario the member plans for, not a claim about what the body withstands, so "survive" now needs a bodily subject and a statement rather than a question. The library is again green with no exemption and no detector weakening.

**Not addressed (existing deferral):** "7-day non-perishable supply minimum" style statements (a supply duration, not a survival outcome) still read as a duration in passing. That is the owner-deferred task `context-aware-duration-of-supply-claim-type`; it is not changed here.

## 10 · Positive detector tests (`tests/unit/numeric-survival.test.ts`)

Each pattern is run with the numbers 2, 3, 3–4, 10 and 36, in both NZ and AU, and must be C_NEEDS_SOURCE with the new reason: "N days without water" · "N days without food" · "N weeks without food (survival mode)" · "N minutes without clean air" · "N minutes without oxygen" · "N hours without shelter in extreme cold" · "N hours without heat" · "N hours without warmth" · a survival statement about a person · exposure to extreme cold or heat · a question about the body ("Can a person survive N days without water?") · hypothermia within N hours · dehydration after N days. Also: spelled-out numbers ("Three days without water", "three weeks without food"), a "3 minutes without air — 3 hours without shelter — 3 days without water — 3 weeks without food" line flags all four intervals, and four table-row phrasings from the legacy source.

## 11 · Negative detector tests

Not flagged as survival (and the scanner's earlier bucket kept): "90-Day Implementation Roadmap" · "Keep the 90-Day Implementation Roadmap beside your plan." · "OffGrid056 30-Day Programme" · "Complete this in 10 minutes." · "This worksheet takes about 15 minutes." · "Plan your next 30 days." · "finish the worksheet in 2 hours" · "without water damage for 5 years" · "Plan 14 days of meals without food waste." · "12 hours without heat loss" · the two household-readiness questions ("Can the household survive 72 hours off-grid…", "Can your household survive 3 days off-grid on what you store?") · "Plan for 72 hours of cooking without the grid." Also: "Complete this in 10 minutes." and "OffGrid056 30-Day Programme" stay D_NOT_A_CLAIM; New Zealand's approved three-litre baseline stays A_ALREADY_SOURCED for OG-08; treatment-owned figures stay E_TREATMENT_OWNED.

## 12 · Tests

**829 passing** (39 files): the 789 baseline plus 33 detector tests (`numeric-survival.test.ts`) and 7 disposition tests (`og-05-disposition.test.ts`). The content-flag, numeric and library-wide blocking tests are in the suite and pass.

## 13 · Bucket C

**0** across the live library (all 25 resources in both markets, re-scanned with the new rule). Price scan: 0 detections. Market, safety and legacy-language scans pass; the regression run shows 0 market problems, 0 content flags, 0 price findings and 0 safety-removal findings. `import:verify-prep` and `import:verify-build` pass (25 records, 50 market files, 0 broken internal links); the Access probe redirects every route.

## 14 · Proposed register treatment

The resource register's states are **Deployed, Staged, Prepared, Blocked, Not started**; it has **no "merged" value**, so I have not invented one. The OG-05 row stays under "Not started" unchanged until you approve a wording (a test pins that the register is unchanged). **Proposed:** keep the five states, and change the OG-05 row's note (not its state) to "MERGED CONCEPTUALLY / NO STANDALONE RESOURCE (Stage 9.86)"; if you prefer a status value, add one explicit state and move the row, with the totals (25 live + 0 staged + 1 blocked + 19 not started = 45) adjusted. The decision itself is recorded in `future-tasks.json`.

## 15 · Owner decisions still required

1. **Page pointer:** Option B (recommended), Option A, or nothing; and the wording of the pointer if B.
2. **Register wording:** approve "MERGED CONCEPTUALLY / NO STANDALONE RESOURCE" as the OG-05 row's note, or choose a new explicit state (§14).
3. **Protected Start Here:** whether to hide the six demo placeholders (including `res-0004`) from the protected Start Here listing, as Planning Tools was done in Stage 9.78B. Not changed.
4. **`res-0004` and programme day 3:** leave as demo placeholders (current state) or plan their replacement later.
5. **Supply-duration claims:** whether to take up the deferred `context-aware-duration-of-supply-claim-type` task now that the survival-duration rule exists.

**Stopped before modifying the Five Foundations page, OG-01, `res-0004`, the programme routes or any live content.**

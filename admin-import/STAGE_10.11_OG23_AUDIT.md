# Stage 10.11 — next legacy resource verification and OG-23 claims-first audit

**Audit only.** Nothing was rewritten, migrated, rendered, staged or deployed. The three registers, the protected records, PDFs, `route-policy.json`, Start Here, Planning Tools, programme routes, the curated-related rule, the same-topic ranking, Access and the Worker are untouched.

LIVE: **29 protected resources · 58 market files · 0 broken links** · Worker `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · rollback `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` · Bucket C 0 · 1,365 tests. Migration state (unchanged): Deployed 29 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 14 = 45.

## 1. Not Started list (verified)
`RESOURCE_REGISTER.md`, "Not started (14)", lists exactly the expected 14: OG-23, OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15. `CURRENT_STATUS.md` and `NEXT_ACTIONS.md` carry the identical migration counts, live figures and Worker IDs. **No register conflict.** The registers carry no explicit priority rule (the "Immediate queue" in `NEXT_ACTIONS.md` is a labelled Stage 9.61 historical snapshot), so the earliest-code rule applies: **OG-23 Supplier Question Bank**, register row `| OG-23 | Supplier Question Bank | — |` under "General, planning and programme".

## 2. Source
| | |
|---|---|
| HTML | `...\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-23_Supplier_Question_Bank.html` (14,238 bytes; copy `workspace/og-23-legacy.html`) |
| PDF | `...\OffGrid056\PDFs\OG-23_Supplier_Question_Bank.pdf` (9 pages, 502,559 bytes) |
| HTML `<title>` / PDF title field | "OG-23 Supplier Question Bank — OffGrid056" (both) |
| Cover title | "OG-23 Supplier Question Bank" (chip "Week 4 — Action Plan & Pathway"; label "OffGrid056 30-Day Programme"; subtitle "Day 23 — Vet sellers and installers before you spend"; brand "OFFGRID056.COM"; image `/mnt/agents/.../Week4_ActionPlanPathway_Cover.jpg`) |
| Page-header title | "Supplier Question Bank"; meta "Day 23 — Week 4: Action Plan & Pathway \| OffGrid056 30-Day Programme" |
| Next pointer | "Next: OG-24 Professional Review Selector →" and "Tomorrow you will select the professionals you need and understand when DIY ends and expert help begins." |
| Original programme role | Day 23 of Week 4 (Action Plan & Pathway): vet sellers and installers before spending |

## 3. Primary job and output
"Avoid costly mistakes by asking the right questions before you buy": the member asks suppliers and installers a bank of 25 questions (10 general, 5 each for solar and battery, water, and heating and insulation), scores each 1–5, compares up to three suppliers side by side and ticks a seven-item red-flag list. Primary output: **a reusable supplier comparison worksheet** (question bank plus side-by-side record). Classification: **worksheet** (implementation support); a checklist or template is the alternative.

## 4. Content inventory
| # | Section | Content | Class |
|---|---|---|---|
| 1 | Cover | chip "Week 4 — Action Plan & Pathway", "30-Day Programme", title with "OG-23", "Day 23 — Vet sellers and installers before you spend", "OFFGRID056.COM", build-path image | REWRITE (shared cover; remove code, programme and legacy brand) |
| 2 | Page header | "Day 23 — Week 4 … 30-Day Programme" | REMOVE |
| 3 | Purpose box | "Avoid costly mistakes… covers solar, water, heating, shelter, and food suppliers… Record answers to compare vendors side-by-side." | REWRITE (outcome wording; "shelter and food" are not in the question sets) |
| 4 | Supplier Scorecard Method | rate 1–5, "below 3 is a red flag", "Total possible: 50. Aim for 40+", five-row score-meaning table | REMOVE (score target and thresholds; conflicts with the live no-score posture) or REWRITE as a member note |
| 5 | General Questions 1–10 | trading history "in New Zealand"; registered NZ company and GST number; warranties "Should be 2-5 years minimum"; insurance; "3 recent references"; lead time; after-sales; exchange-rate pricing; payment terms "Never pay 100% upfront. 50/50 or milestone-based is fair"; failure within warranty | REWRITE as market-neutral questions; **REMOVE** the 2–5 year and payment-norm claims; Q2 and Q9 VERIFY |
| 6 | Solar & Battery Questions 11–15 | NZ grid certification "Must comply with AS/NZS 4777.2"; shading analysis; future expansion; grid-connection application to "the local lines company"; payback "Should be 6-10 years for residential" | Q12 and Q13 KEEP as questions; Q11 and Q14 REWRITE/VERIFY (market); **Q15 REMOVE** (payback claim) |
| 7 | Water System Questions 16–20 | food-grade and UV-stabilised tank; first-flush diverter; pump flow "certify"; install or supply; filtration "NSF/ANSI certified for pathogen reduction… UV and carbon filters should meet international standards" | Q16 and Q17 VERIFY against OG-B08 and OG-10 wording; Q19 KEEP; **Q18 and Q20 REMOVE** (technical or treatment-owned claims) |
| 8 | Heating & Insulation Questions 21–25 | NZ Energy Rating Label "Mandatory in NZ"; BRANZ or CodeMark "Proves compliance with NZ Building Code"; heat-loss calculation; "Warmer Kiwi Homes subsidies… EECA funding"; "COP at 7°C ambient" | Q23 KEEP; Q21, Q22 and Q24 NEEDS_SOURCE and market (NZ-only); **Q25 REMOVE** (technical figure) |
| 9 | Supplier Comparison Worksheet | Suppliers A–C: company, contact, "Years in NZ", "Warranty (Years)", "Quoted Price (incl. GST)", lead time, after-sales, reference check, "TOTAL SCORE (/50)", decision | KEEP_AS_MEMBER_INPUT (drop "/50", "NZ" and "GST") |
| 10 | Red Flag Checklist | seven ticks: no GST or registration, no written quote, "limited offer" pressure, no local references, "could not explain how the product meets NZ standards", full payment demanded before work, no physical address | REWRITE market-neutral; payment and registration items VERIFY |
| 11 | Closing box | "Day 23 Complete", "You now have a systematic way to vet any supplier. Never feel pressured… The best suppliers welcome detailed questions.", "Tomorrow…", "Next: OG-24 …" | REWRITE (assurance and sweeping claims); REMOVE the next pointers |

Scan of the requested categories: Week/Day yes; 30-Day Programme yes (2); Pillars none; survival or prepper none; numeric targets yes (score 1–5, /50, "40+", "below 3"); duration targets yes (warranty "2-5 years minimum", payback "6-10 years"); storage-duration none; emergency-period none; percentages yes ("100%", "50/50"); ratios none beyond 50/50; prices none as amounts but payback, running-cost and cost wording yes; comparative yes ("Higher stars = lower running cost"); multiplier none; outcome and assurance yes ("Avoid costly mistakes", "Saves you significant paperwork", "You now have a systematic way", "Proves compliance"); technical or safety instructions: certification and standards statements, not procedures; market-specific assumptions throughout (NZ only); obsolete links and codes ("OG-23", "OG-24"); old CTAs ("Next:", "Tomorrow").

## 5. Foundation
**general.** It vets suppliers across solar, water and heating; no single foundation is its subject (legacy grouping puts it with the general and planning group).

## 6. Program Component
**planning-implementation.** The locked definition names it directly: "budgets, project briefs, 30-day plans, 90-day plans, implementation tracking and **supplier/installer planning**". Not advanced-future.

## 7. Journey position
Not part of the main planning journey (OG-01 → OG-02 → OG-06 → OG-04 → OG-22 → OG-03 → OG-07 → OG-26 → OG-27). It is an implementation-phase companion used when the household starts approaching sellers and installers: after the budget (OG-26) and roadmap (OG-27), alongside the Project Support Brief (OG-25), and before OG-24 (not yet migrated). In the wider bands it sits in Household Resilience, supporting Off-Grid Living purchases (solar, batteries, water, heating). It is not an Emergency Readiness resource. No link was changed.

## 8. Overlap with the live library
| Resource | Overlap |
|---|---|
| **OG-B09, OG-18, OG-B08, OG-19, OG-B07, OG-17** | **Medium to high, topic by topic.** Each already carries installer or supplier prompts for its own system ("ask your installer", "Ask the supplier" column with the approved tank wording, "Get written quotes", warranty and quote fields). OG-23's solar, water and heating question sets duplicate these. |
| **OG-25** Project Support Brief Template | Medium: briefs tradespeople for quotes ("Vague scopes produce vague quotes"); no supplier comparison. |
| OG-26, OG-27, OG-22 | Low (budget, roadmap, wishlist); OG-22 has its own 1–5 criteria scoring. |
| OG-09, OG-10, OG-20, OG-B12 | Low (incidental supplier mentions). |
**Unique member value:** a general, cross-system supplier vetting worksheet: company and trading questions, insurance, references, lead time, after-sales, payment terms, failure-under-warranty process, a side-by-side comparison of up to three suppliers and a red-flag checklist. No live resource compares suppliers side by side (OG-19 and OG-B09 compare technologies and options). **Duplicated:** the system-specific question sets. **Stronger existing resources:** the system resources for their own questions. **Standalone status:** justified only if narrowed to the general vetting and comparison job.

## 9. Demo and programme relationships
- No demo resource counterpart. The nearest demo item is the `/suppliers` directory (ten placeholder entries, all marked "DEMO"); the `supplier-resource` type exists in the taxonomy but is not what OG-23 is.
- Programme day 23 (`day-23.json`, week 4) is "Day 23 — Placeholder action", food foundation, resource `res-0023` (demo Pantry Rotation Worksheet). The legacy day numbering does not match the demo programme. No change proposed.
- Workshops and learning paths: no reference to suppliers or vetting.
- Same-topic: general / planning peers (OG-25, OG-26, OG-27, OG-B04, OG-B10, OG-22 and others) would be its neighbours; the existing algorithm and the curated-related rule apply once a record exists.
- Route collision: **none** (`res-1023` and `supplier-question-bank` are unused everywhere; `/suppliers/` is a different route). No supersedes issue.

## 10. NZ / AU market check (flags only; no new research)
The legacy text is written for New Zealand only. Items that would differ or need a source if retained: "registered NZ company" and "GST number" (AU: ABN or ACN and GST); "AS/NZS 4777.2" and "certified for NZ grid connection" (a joint standard, but approval routes and installer accreditation differ; none of this wording exists in the live library); "the local lines company" (AU: the network operator); the NZ Energy Rating Label "Mandatory in NZ" (AU labelling differs); BRANZ appraisal and CodeMark "proves compliance with NZ Building Code" (NZ-specific); "Warmer Kiwi Homes… EECA funding" (NZ only; OG-26 carries an approved NZ assistance table); "NSF/ANSI certified for pathogen reduction" (treatment-owned; OG-09's AU text carries NSF/ANSI); "NZ sun"; consumer and payment norms ("Never pay 100% upfront", "50/50 … is fair"), which depend on each country's consumer law; tradesperson wording is carried by the standing disclaimer. **Unresolved market claims: all of the above if kept.** A market-neutral rewrite ("check which standards, approvals and certifications apply where you live") avoids them, as the live OG-B09 and OG-17 do.

## 11. Price scan
Price findings = **0** (PRICE 0, PLACEHOLDER 0, NOT_A_PRICE 0): there is no dollar amount. Money-claim wording found manually: "costly" (×2), payback "Should be 6-10 years for residential", "Higher stars = lower running cost", "Saves you significant paperwork", the payment norms "Never pay 100% upfront" and "50/50 or milestone-based is fair", and the field label "Quoted Price (incl. GST)".

## 12. Numeric and claim scan (per market: 6 candidates, **legacy Bucket C 2**)
Families, run on the legacy HTML: ordinary numeric 6; survival-duration 0; supply-duration 0; emergency-period 0; storage-duration 0; target-label forward 0 and reverse 0; multiplier 0; comparative-performance 0; outcome-claim 0; assurance 0 (126 member-facing lines, 0 family hits).

| Class | Items |
|---|---|
| A. Factual claims | "Never pay 100% upfront" and "COP … at 7°C ambient" (both Bucket C); manually: warranty "2-5 years minimum", payback "6-10 years", "50/50 or milestone-based is fair", "Mandatory in NZ", "Must comply with AS/NZS 4777.2", "Proves compliance with NZ Building Code", "Higher stars = lower running cost", "Registered providers can access EECA funding" |
| B. Structural labels | "Score", "TOTAL SCORE (/50)", column headings |
| C. Titles | "OffGrid056 30-Day Programme" |
| D. Schedules | "Day 23", "Week 4", "Tomorrow" |
| E. Member-entered fields | the question scores, the comparison cells |
| F. Examples | "(e.g., EV charger)" |
| G. Non-claims | "3 recent references", "Suppliers A–C" |
**Legacy Bucket C: 2** (identical in NZ and AU). **Live-library Bucket C = 0** (29 resources, 58 files, 446 candidates).
**Detector gaps (reported, nothing changed):** the payback-period figure and the warranty-duration norm are classified "a duration in passing"; payment-term norms ("Never pay 100% upfront" is caught only as a percentage; "50/50 … is fair" not at all) and regulatory or compliance assertions ("Mandatory in NZ", "Must comply with…", "Proves compliance…") have no rule. A rewrite removes all of them; the owner may want these closed as a general rule before drafting, as at Stage 10.07.

## 13. Safety scan
Detector: `batteries-and-electrical` only (solar, battery and inverter mentions across the questions). All other listed topics (fire and smoke alarms, CO, generator, the four gas topics, food-safety-power-cut, roof or structural, heating or combustion): none.
| Hit | Class |
|---|---|
| solar, battery and inverter questions (Q11–Q14) | INCIDENTAL_MENTION in the legacy (buying questions, no procedure); a rewrite that keeps them reaches the topic threshold, so either **carry the approved batteries-and-electrical block** (NEEDS_MARKET_BLOCK) or REMOVE_IN_REWRITE the solar and battery specifics (owner decision) |
| "NSF/ANSI certified for pathogen reduction… UV and carbon filters" (Q20), "potable water safety" (Q16) | REMOVE_IN_REWRITE; NEEDS_SOURCE if kept (treatment-owned) |
| "AS/NZS 4777.2", "NZ Building Code", "Mandatory in NZ" | NEEDS_SOURCE and NEEDS_MARKET_BLOCK if kept |
| "food-grade" tank | INCIDENTAL_MENTION (not food safety) |
No block was added.

## 14. Claim conflicts with approved baselines
- **Scoring:** the 1–5 scale, the 50-point total and "Aim for 40+" / "below 3 is a red flag" conflict with the live posture ("nothing here is a score, a target or a guarantee", OG-06, OG-07, OG-12, OG-14); OG-13 uses its own scale labelled "OffGrid056's own scale, not an official standard"; OG-22 scores member criteria 1–5 without a pass mark.
- **Payback and warranty:** OG-18 has a member-entered "Payback target (years)" and OG-B07 a member-entered payback estimator; OG-19 has a member-entered "Warranty (years and terms)". OG-23's fixed "6-10 years" and "2-5 years minimum" conflict with that member-entered approach.
- **Technical and standards wording:** none of AS/NZS 4777.2, Energy Rating Label, CodeMark, BRANZ, COP, GST/ABN or "lines company" appears in the live library; the live system resources send the member to "your installer" and "your local authority" instead.
- **Water:** OG-B08 already carries approved "ask the supplier" wording on drinking-water tanks, OG-10 the first-flush teaching, OG-09 the treatment architecture; OG-23's Q16, Q17, Q18 and Q20 restate these as supplier tests.
- **Budgeting and assistance:** OG-26 carries the approved "Assistance to check (New Zealand)" table (Warmer Kiwi Homes); OG-23's "Registered providers can access EECA funding" restates it unsourced and NZ-only.
- **Programme flow:** the "Next: OG-24" and "Tomorrow" pointers.
- No conflict with the gas, generator, fire, CO or food-safety architecture or the standing blocks.

## 15. Legacy-language scan (member-facing text)
Pillars 0; Week 2 ("Week 4 — Action Plan & Pathway", ×2 lines); Day 3 ("Day 23" ×3); 30-Day Programme 2; 72-hour, survival, critical, prepper, panic, worst-case, premium, upsell, Skool, Simply Services, HTPS: 0; legacy codes 2 ("OG-23", "OG-24"); legacy URL "OFFGRID056.COM" and the `/mnt/agents/...` image path; legacy CTAs: "Next: OG-24 Professional Review Selector →", "Tomorrow you will select the professionals…". NZ-only terms: 18 hits (NZ, New Zealand, GST, AS/NZS, EECA, BRANZ, CodeMark, NSF, lines company, Energy Rating). Content flags: 11 (day-complete, three next-link, four programme-sequencing, two figure-needs-source, one cross-reference).

## 16. Curated-related architecture
Under the approved rule, a protected resource with four or more explicit related links shows only those; with fewer it also shows same-topic fills (general / planning peers, protected and demo). Likely candidates, not assigned: Project Support Brief Template (res-1025), 3-Tier Budget Planner (res-1026), 90-Day Implementation Roadmap (res-1027), Resilience Product Wishlist (res-1022), Household Spending Capacity Check (res-1003) as "before" or "alongside"; and, if system pointers are wanted, Solar Power 101 Workbook (res-1018), Battery Backup Planner (res-1019), Water Tank Sizing & Placement Guide (res-1508), Resilient Heating & Insulation Upgrade Checklist (res-1509). The final list is the owner's.

## 17. Proposed metadata (no res-ID)
| Field | Proposal |
|---|---|
| Title | Supplier Question Bank (alternative: Supplier Comparison Worksheet) — OWNER-REVIEW REQUIRED |
| Foundation | general |
| Program Component | planning-implementation |
| Category | planning |
| Type | worksheet |
| Difficulty | beginner — OWNER-REVIEW REQUIRED |
| Estimated time | 30 minutes — OWNER-REVIEW REQUIRED |
| Description | "A practical worksheet to help you prepare questions for suppliers and installers, record their answers side by side and note anything that needs a closer look before you decide." — OWNER-REVIEW REQUIRED |
| Tags | none (as the live records) |
| Status | draft |
| Collections | planning-tools (as OG-25, OG-26 and OG-27) or none — OWNER-REVIEW REQUIRED |

## 18. Disposition
**NARROW.** Keep the general supplier-vetting job: market-neutral company and trading questions, insurance, references, lead time, after-sales, payment-terms and warranty-process questions (as questions, with no claimed norms), the side-by-side comparison for up to three suppliers (member-entered cells), and a market-neutral red-flag checklist. Remove the scoring system and thresholds, the 2–5 year, 6–10 year, 50/50, COP, Energy Rating, BRANZ, CodeMark, AS/NZS, EECA and NSF/ANSI statements, the four system-specific question sets (the system resources own them), and all programme wording and pointers. Unique value moderate; overlap with the system resources high but removable; claim burden medium (two Bucket C and several unsourced assertions, all removable); safety burden low (standing blocks, plus the batteries block only if solar and battery specifics stay); market burden high in the legacy, low once market-neutral; rewrite burden medium. Journey role: an implementation companion after OG-26 and OG-27, with OG-25.
**Fallback:** MERGE_CONCEPTUALLY into OG-25 and the system resources if the owner judges the general worksheet too thin without the system-specific question sets.

## 19. Owner decisions required
1. Confirm NARROW (or MERGE_CONCEPTUALLY).
2. Title: Supplier Question Bank or Supplier Comparison Worksheet.
3. Type: worksheet (or checklist or template) and the time and difficulty.
4. Scoring: remove entirely (recommended) or allow a member-defined note.
5. Whether any solar, battery, water or heating question survives as a generic prompt; if solar or battery wording stays, whether to carry the approved batteries-and-electrical block.
6. Market handling: market-neutral prompts that tell the member to check which standards and approvals apply locally (recommended), or separate NZ and AU variants.
7. Collections: planning-tools or none.
8. Related list (four or more links keeps the page to exactly that list).
9. Whether to close the four detector gaps (payback and warranty-duration norms, payment-term norms, regulatory assertions) as a general rule before drafting.

## 20. Validation (actual exit codes)
Price scan 0 (58 files, 0 true prices); live family scan 0 (29 resources, 58 files, 446 candidates, **Bucket C 0**, target-label forward and reverse 0, assurance 0); hardened storage and outcome scan 0 (0 hits); legacy OG-23 detector pass exit 0; `npm run lint` **0** (0 errors, warnings only in git-ignored workspace scripts); `npx tsc --noEmit` **0** (an earlier run failed only because of four scratch analysis scripts in the git-ignored `workspace/` with implicit-`any` parameters; they were deleted); `npx vitest run` **0**, 51 files, **1,365 tests**; `npm run import:verify-build` **0** (records 29 · market files 58 · broken links 0). The built-output, register-consistency, route-separation, related-resource and content-flag suites are inside the full run.

## 21. Not changed
The registers, migration counts, protected records, PDFs, `route-policy.json`, Start Here, Planning Tools, programme routes, the curated-related rule, the same-topic ranking, Cloudflare Access and the Worker. No rewrite, migration, render, staging or deployment.

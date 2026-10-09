# Stage 10.12A — two sourced live claims registered (Option A), hardened detectors applied, OG-23 rewrite draft

**Draft only.** Nothing was rendered, staged or deployed. No res-ID was assigned to OG-23. Planning Tools is unchanged. `CURRENT_STATUS.md`, `NEXT_ACTIONS.md`, `RESOURCE_REGISTER.md`, the migration counts, protected records, PDFs, routes, `route-policy.json`, Start Here, programme routes, `lib/related.ts`, the Worker and Access are untouched. OG-10 and OG-13 were not rewritten or redeployed.

LIVE: **29 protected resources · 58 market files · 0 broken links** · Worker `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · rollback `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28`. Migration state (unchanged): Deployed 29 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 14 = 45.

## 1. The two registered claims (owner Option A)
| | OG-10 | OG-13 |
|---|---|---|
| Resource / protected ID / market | OG-10 Rainwater Harvesting Planner / `res-1010` / NZ | OG-13 Healthy Home Air Audit / `res-1013` / AU |
| Exact live sentence | "Connecting rainwater to the plumbing of a house that also has mains water needs a building consent, and the law requires the mains supply to be isolated by a backflow prevention device installed by a qualified plumber." | "In Queensland, interconnected photoelectric alarms are required by law — check what applies where you live." |
| Detector family | regulatory assertion ("the law requires") | regulatory assertion ("required by law") |
| Registry entry | `nz-rainwater-plumbing-consent-backflow-mbie` | `au-qld-interconnected-photoelectric-alarms-law-qfd` |
| Source and provenance | Building Performance, MBIE, `https://www.building.govt.nz/getting-started/smarter-homes-guides/water-and-waste/collecting-and-using-rainwater` (page updated 15 Jan 2026, read live 2026-09-23); the statement is recorded verbatim in `STAGE_9.40_OG10_REVIEW.md` section 8 ("Plumbed connection") and the OG-10 approved-copy reason | Queensland Fire Department, `https://www.fire.qld.gov.au/about-us/corporate-knowledge-centre/qfdlegislation/smoke-alarm-reforms` (read 2026-09-23, Stage 9.51), the source already held by `au-qld-alarm-ten-year-battery-qfd`; see `STAGE_9.51_OG13_AIR_RESEARCH.md` and `STAGE_9.52_AIR_SAFETY_ARCHITECTURE.md` |
| Prior owner approval | 2026-09-23 (OG-10 "Consent field (NZ)", deployed Stage 9.41) | 2026-10-05 (OG-13 "Row 1 smoke alarms (AU)", deployed Stage 9.54) |
| Scope | exact sentence, NZ only, OG-10 only | exact sentence, AU only, OG-13 only |
**Neither entry is an exemption.** Each matches one exact sentence in one market in one resource, carries its source, authority, source date, prior approval and a limitation that it is not an exemption, and approves no category: tests prove the same sentence in any other resource or market, near-miss wording, other Queensland statements, "Smoke alarms are required by law" and "mandatory in NZ" all remain Bucket C. The regulatory rule was not weakened and has no carve-out. Provenance was verified from the repository; none was invented.

## 2. Held detector re-applied
The held Stage 10.12 detector (payback-duration, warranty-duration, payment and regulatory-assertion families; table-row context; structural-bypass fix; existing precedence; one statement, one owner) was re-applied unchanged from `admin-import/held-10.12/numeric.ts.hardened.txt`, and its test file restored (133 tests). **One comment-only deviation:** a doc comment said "a statement by OffGrid056", which tripped an existing guard test that forbids that name in the detector source; it now reads "a statement in a resource's own text". No rule changed and no positive case was weakened. The held folder is kept as the record.

## 3. Live-library gate (29 protected resources / 58 market files)
Itemised under the hardened rules plus the two registry entries: 448 candidates, **Bucket C 0**; unresolved payback **0**, warranty **0**, payment **0**, regulatory **0**, other 0; target-label and assurance 0. Before the registry the only sentence-level hits were exactly the two registered statements; with it, OG-10 NZ and OG-13 AU resolve as A_ALREADY_SOURCED through their entries. No other new finding. No exemptions.

## 4. Legacy OG-23 under the hardened rules (both markets: 10 candidates, Bucket C 8, **0 duplicate owners**)
| Statement | Owner |
|---|---|
| "Never pay 100% upfront." | payment norm |
| "50/50 or milestone-based is fair." | payment norm |
| "Must comply with AS/NZS 4777.2 standards." | regulatory assertion |
| "Mandatory in NZ." | regulatory assertion |
| "Proves compliance with NZ Building Code." | regulatory assertion |
| "What warranties do you offer…? Should be 2-5 years minimum on major systems." | warranty-duration norm (table-row context) |
| "What is the expected payback period…? Should be 6-10 years for residential." | payback-duration norm (table-row context) |
| "What is the expected COP … at 7°C ambient?" | ordinary numeric |
No sentence has more than one owner and no sentence has an extra candidate.

## 5. OG-23 draft
**Disposition NARROW.** Title **Supplier Comparison Worksheet**. general / planning-implementation / planning / worksheet / beginner / 30 minutes / draft / collections planning-tools / the owner's description exactly / no res-ID. Prep: publishable in NZ and AU, standing emergency-contact and general-disclaimer blocks only, PDF title "Supplier Comparison Worksheet — OffGrid056".
**Structure:** Cover · Why Use This Worksheet · Before You Contact a Supplier (two member fields) · Questions to Ask (15 market-neutral questions in five groups, each a question for the supplier, plus "Questions of my own") · Compare Supplier A / B / C (ten member-entered rows, no score or total) · Things I Want to Look At More Closely (seven neutral prompts and a notes field) · My Follow-Up Notes (the four member decision fields) · Where Next · Where You Are Now · standing blocks. The body is identical in NZ and AU (4,396 characters each).
**Removed (exact):** Day 23, Week 4, "30-Day Programme", OG-23, OG-24, "Supplier Question Bank", "Vet sellers and installers before you spend", "Tomorrow…", "Next: OG-24 …", "OFFGRID056.COM" and the `/mnt/agents` image path; the Purpose box; the whole scorecard method (1–5, "below 3", "/50", "Aim for 40+", the meaning table), every Score and Why It Matters column; the NZ company, GST and trading-in-NZ questions; the 2–5 year warranty and "Never pay 100% upfront / 50/50 … fair" norms; the solar and battery set (AS/NZS 4777.2, NZ grid, shading, EV, lines company, 6–10 year payback), the water set (food-grade and UV tank, first-flush, pump, NSF/ANSI) and the heating and insulation set (Energy Rating Label "Mandatory in NZ", BRANZ, CodeMark "Proves compliance", heat-loss, Warmer Kiwi Homes, EECA, COP at 7°C); "Years in NZ", "Warranty (Years)", "Quoted Price (incl. GST)" and "TOTAL SCORE (/50)"; the Red Flag Checklist's NZ standards, GST and full-payment items; "Day 23 Complete" and "The best suppliers welcome detailed questions."

## 6. Draft QA (NZ and AU: ALL PASS)
Price 0 (no price, cost or GST wording); ordinary numeric Bucket C **0** (one non-claim: the live title "90-Day Implementation Roadmap"); survival, supply, emergency-period, storage-duration, target-label (forward and reverse), payback, warranty, payment, regulatory, multiplier, comparative, outcome and assurance 0; safety topics raised **0** (no technical-topic trigger); no technical, scoring, ranking or endorsement wording; legacy language 0; market-neutral (no NZ-only or AU-only term, agency, number or standard); no digits other than the live titles; content flags 0; sections in order; all 15 questions end with a question mark; three supplier columns and ten rows with no score row; the four follow-up fields present; blocks emergency-contact and general-disclaimer once each.

## 7. Related resources and Where Next
All four belong. **Recommended list and order (owner's flow):** Project Support Brief Template (res-1025), Resilience Product Wishlist (res-1022), 3-Tier Budget Planner (res-1026), 90-Day Implementation Roadmap (res-1027). Four explicit links trigger the curated-related rule, so no automatic fill would show; `lib/related.ts` is not changed. The members' flow fits the protected journey: Wishlist and Brief come before approaching suppliers, the Budget Planner helps frame what to commit to, and the Roadmap turns decisions into a schedule. **One optional adjustment for the owner:** put the Wishlist before the Brief ("decide what you are buying, then describe the work"), which mirrors the order of the main journey (OG-22 before OG-25's project work). The draft keeps the owner's order. Not included: res-1003, res-1018, res-1019, res-1508, res-1509 (no clear member-flow reason; the system resources own their own supplier prompts). No OG-24, Day 24 or Tomorrow wording.

## 8. Planning Tools
OG-23 is intended for Planning Tools (collections `planning-tools` in the draft metadata), but nothing is added now: the collection stays at its current live membership until OG-23 is staged and deployed, when it is expected to move from 8 to 9.

## 9. Cover concept (proposal only; nothing rendered)
Shared OffGrid056 cover system, corrected treatment, chip "General · Planning". Photograph: a household or project owner at a table in natural light comparing three supplier quotes or proposal sheets, with a notebook and pen, neutral unbranded documents, a grounded real-world setting. No logos, no AI imagery, no certification graphics, no programme labels, no OG code. The draft's cover currently references the old stand-in image file; it must be replaced by the owner's chosen photograph before rendering.

## 10. Validation (actual exit codes)
`npm run lint` **0** (0 errors, warnings only in git-ignored workspace scripts); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 54 files, **1,522 tests** (1,365 + 133 norm tests + 6 registry tests + 18 draft tests; the registry, numeric, price, target-label, reverse-target, outcome, assurance, content-flag, built-output, related-resource, register-consistency and route-separation suites are all inside the run); `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 29 · market files 58 · broken links 0). Whole-live-library Bucket C **0**.

## 11. Owner decisions still required
1. Approve or amend the draft copy, the fifteen questions and the comparison rows.
2. Approve the related list and order (optionally Wishlist before Brief).
3. Choose the cover photograph (the stand-in image must be replaced).
4. Confirm the "Questions of my own" and "Questions to Ask" wording is the right amount of guidance for a worksheet.

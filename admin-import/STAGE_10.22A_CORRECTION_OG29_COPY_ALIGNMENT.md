# Stage 10.22A-CORRECTION — OG-29 Household Action Plan copy alignment fix

**Copy/config correction only.** No render, no cover change, no stable ID (the prep tool's suggested `res-1029` stays SUGGESTED / UNASSIGNED and is recorded nowhere), no protected record, no Planning Tools addition, no staging, no deployment. Live is unchanged: **32 protected resources · 64 market files · Planning Tools 11 · Downloads 54 · My Progress 57 · 0 broken links** · Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`. Migration (unchanged): Deployed 32 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 11 = 45.

## 1. The three corrections applied
1. **Exact description restored** (and verified byte-for-byte against the owner sentence in the review config and its test).
2. **Action table restored to the five approved columns.** The draft had carried a sixth "No." column, an unapproved "Status or notes" header and, in the very first draft, a "Next step" column. The table is now exactly: Action · Why it matters · Owner · Target date · Status / Notes, ten rows. "Next step" is gone; "Why it matters" and "Target date" are kept; there is no number column, fixed date, timing instruction, percentage, score, ranking or cost.
3. **All four related resources print in Where Next**, in the approved order, with metadata in the same order (res-1026 is no longer metadata-only). The cover subtitle drift was also reversed: the draft had reworded your accepted subtitle ("…clear actions and owners"); it is back to the accepted "A calm, practical worksheet for turning your household's decisions into clear actions and next steps."

## 2. Final exact description
"A practical worksheet to bring your household decisions together, turn them into a clear list of priority actions and record who will take each action forward."

## 3. Final action table
**Five columns:** Action · Why it matters · Owner · Target date · Status / Notes. **Exactly 10 rows**, blank. Target date is a blank member-entered column; no "Next step", no "No." column.

## 4. Final printed Where Next (NZ and AU, read from the prepared files)
1. **Before** — 90-Day Implementation Roadmap · 2. **Next** — Household Responsibility Roster · 3. **Also useful** — 3-Tier Budget Planner · 4. **Also useful** — Priority Lock Worksheet. No Later row; res-1504, the demo placeholders and automatic filler are not used.

## 5. Final related metadata order
res-1027, res-1028, res-1026, res-1007. **Engine check (real engine, simulated, nothing changed):** the page shows exactly those four, all "Linked by us", in that order; no res-1504, res-0006, res-0008 or res-1510. `lib/related.ts` unchanged.

## 6. NZ / AU parity
Identical: **2,357 characters** each (the draft was 2,379 before the number column was removed; the earlier 2,455 figure belonged to the first draft; no padding added); body HTML **7,611 bytes** each, byte-identical; one market-neutral body, no override.

## 7. Safety and detector results (`workspace/og29-draft-qa.mts`: ALL PASS, exit 0)
Standing blocks emergency-contact and general-disclaimer only; **technical safety triggers 0**; **regulatory candidates 0, unresolved 0**; **numeric Bucket C 0** (two candidates: the live title "90-Day Implementation Roadmap" and the disclaimer block); price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply, emergency-period, storage and target-label **0**; legacy-language **0**; content flags **0**; **no digits remain in the member-facing body**. No registry claim added, no exemption, no detector change.

## 8. Legacy-removal results (member-facing body, NZ and AU)
OG-29 0 · any OG code 0 · 30-Day Programme 0 · Day 29 0 · Day 29 Complete 0 · Week 0 · Tomorrow 0 · Next: OG-30 0 · OFFGRID056.COM 0 · past 29 days 0 · Review it monthly 0 · Update it quarterly 0 · Work it week by week 0 · "Next step" 0. The "Where Next" heading is legitimate and is not counted. The prepared HTML still references the legacy cover stand-in in a non-visible image source until a cover is supplied; it is not copy.

## 9. Tests (actual exit codes)
Focused `og-29-draft.test.ts`: **17 passed, exit 0** (now asserts the exact five column headers, ten rows, no "Next step", no number column, the four-row Where Next and the accepted subtitle). Full unit suite: **62 files, 1,689 tests, exit 0**.

## 10. Lint, typecheck and import verification (actual exit codes)
`npm run lint`: **exit 0** (0 errors, 58 existing warnings, none in application code). `tsc --noEmit`: **exit 0**. `import:verify-prep`: **exit 0**. `import:verify-build`: **exit 0** (32 records · 64 market files · 0 broken internal links).

## 11. Files changed
`admin-import/config/approved-copy.json` and `admin-import/config/metadata-review.json` (OG-29 draft entries only), `tests/unit/og-29-draft.test.ts`, and this report. Git-ignored scratch: `workspace/add-og29-config.mts`, `workspace/og29-draft-qa.mts`, `workspace/prep/OG-29/`. No live record, PDF, route, registry, detector or related-engine file touched.

## 12. Confirmations
No stable ID assigned · no render · no protected record · no Planning Tools addition (live 11) · no staging · no deployment · Worker unchanged `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` · live counts unchanged.

## 13. Readiness
The copy now matches every owner lock. **Ready for Stage 10.22B — OG-29 final render and visual QA**, once you approve the corrected copy and supply or approve the title-free cover (no ID, staging or deployment unless separately approved). Not started.

# Stage 10.08 — OG-14 owner copy approval, reverse target-label detector closure, PDF render

**Rendered in the workspace only. NOT staged, NOT deployed, no res-ID, no protected record.** `CURRENT_STATUS.md`, `NEXT_ACTIONS.md`, `RESOURCE_REGISTER.md`, the migration counts, `route-policy.json`, Start Here, Planning Tools, Five Foundations, programme routes, the same-topic algorithm, Access and the Worker are untouched.

LIVE: **28 protected resources · 56 market files · 0 broken links** · Worker `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` · rollback `e1b31486-afbe-4849-9702-a54e51114717`. Migration state (unchanged): Deployed 28 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 15 = 45.

## 1. Owner approvals recorded
Copy approved exactly as drafted in Stage 10.07: title Water, Food and Air Household Snapshot; general / resilience-planning / planning / worksheet / beginner / 20 minutes / draft / no collection; the description sentence; related list exactly res-1008, res-1011, res-1013, res-1007 in that order (no Pantry Rotation Tracker, no money-planning resource); Where Next (Review first: Water Storage Calculator, 30-Day Pantry Builder, Healthy Home Air Audit; Next: Priority Lock Worksheet); the existing water, food and air cover image under the shared cover system; standing emergency-contact and general-disclaimer blocks only; the `legacyMetadataDrift` note kept and the historical register and architecture wording not rewritten. Statuses are recorded as OWNER-APPROVED 2026-10-09 (Stage 10.08) in `metadata-review.json`.

## 2. Reverse target-label detector (part of the existing target-label family)
**Rule.** A duration modifier before a prescriptive label: duration (hours, days, weeks, months; digits or spelled out; "7-day", "two-week", "72-hour"), up to three descriptive words, then target, goal, minimum, required or requirement. The label is itself the prescription, so no supply noun is required: "7-day target", "30-day target", "14-day goal", "two-week minimum", "three-day required supply", "30-day preparedness target", "7-day water target", "14-day food goal", "7-day target: ___ L".
**Quiet for:** a trip, programme, roadmap, project, review period, weather forecast or trial (no label); target dates and "What is your target?" (no duration); title-case titles ("30-Day Pantry Builder", "90-Day Implementation Roadmap"); personal-habit and review subjects (fitness, exercise, weight, study, course, sales, challenge, trial, trip, forecast, review); scheduling words (date, deadline, due, by, before, until, finish, complete, project, meeting); questions, negations and examples.
**Precedence.** It is one family with the forward target-label rule, tried after storage-duration. Supply-duration, emergency-period and storage-duration own a sentence first, so one statement is one candidate with one owner (tested: "Keep a 7-day supply of water as a minimum" is owned by supply-duration; "7-day target" by the target-label family). Documented in the `numeric.ts` header comment. No exemptions.
**Tests** (`tests/unit/numeric-target-assurance.test.ts`, now 132 tests): 12 positive phrasings; 7 reverse sentences each as one Bucket C candidate in NZ and AU; 18 negative cases (trip, programme, roadmap, project, review period, forecast, trial, target date, question, titles, schedule labels, fitness goal, negation, deadline); precedence.

## 3. Legacy OG-14 confirmation
Hardened detector on the legacy source, both markets: 5 candidates, **Bucket C 3** (was 2 in Stage 10.07, 0 in Stage 10.06). The three owned statements: **"7-day target: ___ L"** (target-label, reverse form, now caught), **"Target: 30 days"** (target-label), **"You have secured the three pillars of basic survival: Water, Food, and Air."** (assurance). Residual in the legacy only: "3-day storage: ___ L" names no target label and is not claimed; the rewrite removes it. The approved rewritten copy was not changed.

## 4. Live library (hardened rules, 28 resources, 56 market files)
**444 numeric candidates, Bucket C 0, target-label hits 0 (forward and reverse), assurance hits 0, no new unresolved live claim.** Including the OG-14 draft: 29 resources, 58 files, 446 candidates, Bucket C 0.

## 5. Render
Headless Chrome print-to-PDF of the prepared HTML (`workspace/prep/OG-14/`, git-ignored), portrait US Letter 612 × 792, **8 pages** each.
| | Path | SHA-256 | Bytes |
|---|---|---|---|
| NZ | `workspace/prep/OG-14/water-food-and-air-household-snapshot.NZ.pdf` | `5e7bbc1f2463339276bc860e434efb2a0e1f15585c0700003f2d401962d15438` | 240,067 |
| AU | `workspace/prep/OG-14/water-food-and-air-household-snapshot.AU.pdf` | `143b064e9d118ac874db820fa7b166114b923659d55b18621e95f12b2712310e` | 239,757 |
PDF title "Water, Food and Air Household Snapshot — OffGrid056" (both); no legacy code.

**Pages:** 1 cover; 2 emergency-contact box, Why Use This Snapshot, Before You Begin; 3 Water Snapshot; 4 Food Snapshot; 5 Air Snapshot; 6 What Needs Attention Next?; 7 Family Briefing Notes; 8 Where Next, Where You Are Now and the general-disclaimer block.

**Layout corrections made during visual QA (layout only, wording unchanged).** The first render was 9 pages: the general-disclaimer block was orphaned alone on page 9, and the attention field was a three-line stub. Corrected by tightening the Where Next table spacing and fixing its column widths (so "Review first" no longer wraps) and by giving the attention field six writing lines. All other pages unchanged.

## 6. Visual QA (every page of both PDFs inspected as an image)
Cover: shared cover system with the water / food / air image, chip "General · Planning", title and subtitle, no legacy code, no Week or programme label, no dark panel beyond the shared gradient. Water, Food and Air: one page each, generous writing bands (3 + 2 + 3, 3 + 2 + 3, 3 + 3 + 3), headings not orphaned, fields aligned identically. Attention: heading, one-sentence guidance, six writing lines. Family Briefing: three prompts with 4 + 3 + 3 writing bands. Where Next: four rows, clear Review first / Next labelling, concise explanations, no programme pointer; the closing box and the disclaimer sit on the same page. No clipping, overflow, blank page or orphan heading. NZ and AU pages match except the emergency box (111, Civil Defence, 111 TXT / 000, 112, 106 TTY, State Emergency Service) and the tradesperson wording in the disclaimer.

## 7. PDF QA (automated, both markets: ALL PASS, `workspace/og14-pdfqa.mts`)
Page count and orientation; title and metadata; sections and standing blocks in the approved order; exactly the approved fields (13) and the three briefing prompts, no fourth; Where Next order; approved closing wording; no legacy wording (Week, Day, programme, Pillars, survival, Mini-Plan, Basic Survival, Asset OG, OG-14, res-id); no scores, ratings, targets, budget, tier or spent; no smoke alarm, CO or filtration prompts; no currency or percentage; only expected digits; NZ has 111 and none of AU's wording, AU has 000 and 112 and none of NZ's; every extracted word is in the prepared HTML; **NZ and AU body copy identical (2,947 characters each)**.

## 8. Rendered-text detectors
Price 0; ordinary numeric Bucket C **0** (one non-claim: the live title "30-Day Pantry Builder"); survival, supply, emergency-period, storage-duration, target-label (forward and reverse), multiplier, comparative, outcome and assurance 0; safety topics 0; market-neutral body; legacy language 0; content flags 0. Safety blocks: emergency-contact and general-disclaimer only; no topic block was created by the rendered wording.

## 9. CSS and JavaScript
No site build was run (staging is not part of this stage). `app/`, `lib/`, `components/`, `data/` and `public/` have no diff, and the OG-14 copy and its layout rules live only in the prepared PDF HTML (an inline `<style>` in `workspace/prep/OG-14/`, which is git-ignored and is not part of the site stylesheet). Therefore the site stylesheet and the 23 JavaScript chunks cannot change from this work. The new inline rules (the Where Next column widths, the closing-box spacing and the field-help style) are scoped to the OG-14 PDF only. The staging stage must still compare the staged build with the deployed one; any difference there will be attributed then.

## 10. Validation (actual exit codes)
`npm run lint` **0** (0 errors, 27 existing warnings); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 50 files, **1,352 tests** (1,307 + 45 reverse-target tests); `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 28 · market files 56 · broken links 0). The target-label, reverse-target, assurance, storage-duration, numeric, content-flag, built-output and register suites are all inside the full run.

## 11. Not changed
The registers and migration counts, protected records, route-policy, Start Here, Planning Tools, Five Foundations, programme routes, the same-topic algorithm, Cloudflare Access, the Worker and every other live resource. Nothing staged or deployed.

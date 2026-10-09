# Stage 10.13A — OG-23 cover integrated, PDFs rendered and visually checked

**Rendered in the private workspace only. NOT staged, NOT deployed, no res-ID, no protected record.** The registers, migration counts, protected records, existing PDFs, routes, `route-policy.json`, Planning Tools (membership unchanged), Start Here, programme routes, `lib/related.ts`, the application source (`app/`, `lib/`, `components/`, `data/`, `public/`: no diff), site CSS, the Worker and Access are untouched.

LIVE: **29 protected resources · 58 market files · 0 broken links** · Worker `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · rollback `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28`. Migration state (unchanged): Deployed 29 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 14 = 45.

## 1. Cover asset
The owner-supplied photograph (a non-identifiable person comparing three separate neutral Proposal, Quote and Estimate sheets beside a notebook and pen; natural light; no branding, certification imagery or AI look) was accessed and stored as the private prepared-PDF asset **`workspace/prep/OG-23/assets/supplier-comparison-cover.webp`** (the same git-ignored `assets/` pattern the other prepared resources use; a backup copy is kept in `workspace/cover-assets/`; nothing was placed in public site assets). Source file 217,004 bytes, SHA-256 `25a1c838d932c5b2ca6bb5041a3d39b91412ac20026c2f94aec875038ce2b090`, 1536 × 1024, identical to the supplied file. The old Week 4 stand-in reference (`Week4_ActionPlanPathway_Cover.jpg`, alt "Week 4 Cover") is removed from the cover; no legacy programme artwork is used, and the PDF bytes contain no reference to it. Cover alt text: "A person at a table comparing three supplier quote documents beside a notebook and pen".

## 2. Renders and hashes (final; not changed after hashing)
| | Path | SHA-256 | Bytes | Pages |
|---|---|---|---|---|
| NZ | `workspace/prep/OG-23/supplier-comparison-worksheet.NZ.pdf` | `5178e066ae34c8636a6a250402c6d7bcee6c2c1761fe90e731e711284b0df3db` | 2,655,802 | 8 |
| AU | `workspace/prep/OG-23/supplier-comparison-worksheet.AU.pdf` | `5d1658a8ae051adad950a000d05081fbf8ee3f6977332fc9fc6e427e5748f1bc` | 2,655,603 | 8 |
Portrait US Letter 612 × 792; PDF title "Supplier Comparison Worksheet — OffGrid056", with producer and creation date; the cover photograph is embedded at its full 1536 × 1024 (not downsampled, not stretched). These become the approved render hashes if the owner accepts the stage.

## 3. Layout adjustments made (layout only, in the prepared PDF HTML; no wording changed, no site CSS)
The first render showed three problems, all corrected: (1) the cover image box of the shared bottom-anchored cover is a 320 × 480 portrait crop, which cut the photograph to a strip (the third document and most of the person were lost); it is now a full-width 706 × 471 box at the photograph's own 3:2 ratio, so the whole picture shows, with the same gradient, chip, label, title, subtitle and strapline; (2) the page header, the "Before You Contact a Supplier" box title and the writing-field labels and lines did not pick up the shared styling because the OG-23 legacy CSS defines those classes differently, so they were blank or oversized; the shared rules (as used by OG-14) were added; (3) the comparison cells were made taller (62 px) for more writing room. Questions of my own keeps five writing lines.

## 4. Page-by-page visual QA (every page of both PDFs inspected as an image)
1 Cover: whole photograph, no crop or distortion; "General · Planning" chip; title and subtitle readable on the gradient; no legacy code; no old programme artwork; no dark panel behind the image. 2 Emergency box, header, Why Use This Worksheet, Before You Contact a Supplier (info box) and two member fields with writing bands. 3 Questions to Ask: the first three groups, ticks visible. 4 After the sale and Before I agree, and Questions of my own with five writing lines. 5 Compare Supplier A / B / C: three equal columns, ten labelled rows, roomy cells, no score or total. 6 Things I Want to Look At More Closely: the seven prompts as dashed-outline cards in a neutral colour (clearly the member's own prompts, no red or danger styling) and a four-line notes field. 7 My Follow-Up Notes: four labelled fields with generous bands (the last band ends above the page number; nothing clipped). 8 Where Next (four rows in the approved order), Where You Are Now, and the general-disclaimer. No clipping, overflow, orphan headings or blank pages; NZ and AU pages are identical except page 2's emergency box and page 8's disclaimer tradesperson wording.

## 5. PDF verification (automated, both markets: ALL PASS, `workspace/og23-pdfqa.mts`)
Page count, orientation and title; sections and standing blocks in the approved order; emergency box on page 2 once and the disclaimer on the last page once, no other block; all fifteen questions in five groups; exactly the ten approved comparison rows with three supplier columns and no score row; Questions of my own once; the seven prompts and the notes field; the four follow-up fields; Where Next order (Wishlist, Brief, Budget Planner, Roadmap) with no OG-24, Day 24 or Tomorrow; approved closing wording; every word in the PDF body is in the prepared HTML. **Absent from the body:** OG-23, OG-24 and any OG code, res-ID, Week, Day, Tomorrow, 30-Day Programme, /50, 40+, 1–5 scoring, payback, warranty periods or ranges, percentages, 50/50, upfront, AS/NZS, mandatory, Building Code, BRANZ, CodeMark, EECA, Warmer Kiwi, NSF, compliance, legally, required by law, NZ, New Zealand, Australia, GST, ABN, Energy Rating, Question Bank, Red Flag. NZ has 111, Civil Defence (NEMA) and the NZ tradesperson wording in the standing blocks only; AU has 000, 112, SES and the AU wording in the standing blocks only.

## 6. NZ and AU body
Body identical (**4,378 characters each**).

## 7. Hardened detector QA on the rendered text (both markets)
Price 0; ordinary numeric Bucket C **0** (one non-claim: the live title "90-Day Implementation Roadmap"); survival, supply, emergency-period, storage-duration, target-label (forward and reverse), payback, warranty, payment, regulatory, multiplier, comparative, outcome and assurance 0; technical safety triggers **0**; market-neutral; legacy language 0; content flags 0. Safety blocks: emergency-contact and general-disclaimer only.

## 8. Live-library regression
TRUE LIVE (29 resources / 58 files, OG-23 excluded): 448 candidates, **Bucket C 0**; payback, warranty, payment and regulatory unresolved 0. The two registered sourced claims still resolve narrowly (OG-10 NZ `nz-rainwater-plumbing-consent-backflow-mbie`; OG-13 AU `au-qld-interconnected-photoelectric-alarms-law-qfd`); neither entry was altered or broadened; the six registry regression tests pass. No exemption.

## 9. Existing-PDF regression
The render wrote only the OG-23 files in `workspace/prep/OG-23/` (two HTML, two PDF, the cover asset and the shared fonts). The approved OG-14 PDFs are unchanged (NZ `5e7bbc1f…`, AU `143b064e…`); `private-assets` is unchanged (88 files, 58 PDFs); nothing was staged into the live resource set.

## 10. Validation (actual exit codes)
`npm run lint` **0** (0 errors, warnings only in git-ignored workspace scripts); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 54 files, **1,523 tests** (registry, claim-detector, numeric, price, target-label, reverse-target, outcome, assurance, content-flag, built-output, related-resource, register-consistency and route-separation suites are all inside the run); `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 29 · market files 58 · broken links 0). Live Bucket C **0**.

## 11. Environment note
`npx serve@14` (used for earlier renders) is no longer cached and wanted to download, so it was not run. The render used a tiny local Node file server (`workspace/static-serve.mjs`, no dependencies) instead.

## 12. Next steps (owner)
Accept or amend the render; if accepted, the hashes above are the approved render hashes, and the next stage assigns the res-ID and stages OG-23 (when Planning Tools is expected to move from 8 to 9 once it is deployed).

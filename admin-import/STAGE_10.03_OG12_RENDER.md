# Stage 10.03 — OG-12 owner approval, PDF render and visual QA

Resource: **Pantry Rotation Tracker** (narrowed). Status draft. **Nothing staged, nothing deployed**; registers, migration counts and the live site are unchanged (live 27 protected · 54 market files · 0 broken links; Worker `e1b31486-afbe-4849-9702-a54e51114717`; rollback `8834be25-0110-4355-94a5-93b9943f792d`). No res-ID is assigned.

## Approved and recorded
Title, NARROW, food / resilience-emergency / food-storage / template / beginner / 15 minutes / draft / collections none; the description exactly; the six-column tracker with 14 blank rows; the rotation wording; the monthly wording ("a monthly **routine** suits your household", not "monthly check"; no detector refinement, no exemption); the related list `res-1011` then `res-1006`; the Where Next structure; and **Option A for safety**: the owner-approved **food-safety-power-cut** block is carried (the existing topic threshold legitimately requires it for an explicitly pantry-focused resource) together with the standing emergency-contact and general-disclaimer. The copy text is exactly as drafted in Stage 10.02C; only metadata statuses changed to OWNER-APPROVED (Stage 10.03). The legacy-topic "REMOVED" disposition was dropped because the topic is now carried; no exemption exists and the threshold is unchanged.

**Layout-only changes after the first renders** (no wording changed, no writing space reduced): the tracker table got faint column dividers, wider Quantity and Date Label columns and taller rows (46 px); the five check items now render as ticked-box rows (the legacy stylesheet had no checklist rules, so the boxes were missing); Notes got eight lines on a page of its own; the cover image file (`Week2_WaterFoodAir_Cover.jpg`, the same cover image OG-11 uses) was added to the prep assets, because the first render showed a broken image.

## Return items
1. **NZ PDF:** rendered, 7 pages, 225,951 bytes; all 33 checks pass.
2. **AU PDF:** rendered, 7 pages, 224,934 bytes; all 33 checks pass.
3. **SHA-256:** NZ `a27e0cc0f068b6494816fae21d0e0fcc901411c0505ad664eea35a8bfcce45a7`; AU `78b8ddf99a118c59a321b876e73dfde721010566333f84ca1c7fcf5048b70458`.
4. **Page count:** 7 in both markets (cover; emergency block, Why, How to Use It; tracker; Quick Pantry Check; Notes; Where Next; closing with the two blocks).
5. **Orientation:** portrait, MediaBox 612 × 792 on every page.
6. **Cover:** shared OffGrid056 cover, "Food · Storage" chip, the pantry cover image, title "Pantry Rotation Tracker", the approved subtitle, no dark shadow panel, no legacy code; identical NZ and AU.
7. **Tracker table:** page 3, exactly Item · Quantity · Stored Location · Added / Bought · Date Label (as shown) · Use Next / Notes, in dark-green header cells; no "Exp. Date" or "Expiry Date"; readable at the page width, column dividers visible.
8. **14-row usability:** 14 blank rows, each about 54 px high (more than a handwriting line), the whole table on one page with room to spare; the Date Label column is wide enough for a printed date label and the Use Next / Notes column is wide enough for a short note.
9. **Quick Pantry Check:** page 4, the approved sentence and five tick-box rows, then "Items I want to use next" with three writing lines.
10. **Notes space:** page 5, "Anything else I want to remember" with eight writing lines.
11. **Where Next:** page 6, "If you have not yet built your pantry, start with the 30-Day Pantry Builder, then use this tracker."; Learn first = 30-Day Pantry Builder, Also useful = Emergency Readiness Checklist; no OG-13 pointer and no codes.
12. **Food-safety block:** the last page carries the closing box, the general-disclaimer and "Food safety in a power cut" cleanly in that order (NZ and AU each in its own approved wording); the emergency-contact block is first on page 2. No other technical block.
13. **PDF metadata:** title "Pantry Rotation Tracker — OffGrid056", producer and creation date present, no legacy code.
14. **NZ/AU separation:** the body is identical (same characters in both); the standing blocks differ only: NZ has 111, Civil Defence (NEMA), the NZ tradesperson wording and the NZ food-safety wording; AU has 000, 112, 106 TTY, SES, the AU tradesperson wording and the AU food-safety wording; no cross-market leakage.
15. **Numeric:** Bucket C **0**; the four candidates are non-claims (the live title "30-Day Pantry Builder" ×3 and "monthly"); the only digits in the body are 056.
16. **Storage-duration:** 0 (sentence and table-row rules).
17. **Outcome-claim:** 0. Multiplier, comparative, survival, supply and emergency-period: 0.
18. **Legacy language:** none of FIFO, Asset OG, OG-12, OG-13, Day 12, Week 2, 30-Day Programme, OFFGRID056.COM, golden rule, Pro Tip, 30-day supply, 3 months, Exp. Date, shelf-life, eliminates, perpetually, saves money, still safe, gone bad or indefinite appears in the body; no OG-12 or res-id in the PDF text or bytes. (The standing food-safety block is fixed approved wording and is excluded from the body scans.)
19. **Price:** 0 (no currency symbol, percentage, NZD or AUD).
20. **Live-library Bucket C:** 0 (hardened rules, 27 resources, 54 files, 433 candidates; 0 storage-duration, 0 outcome, 0 survival/supply/emergency-period/multiplier/comparative findings; content flags 4 in already-live OG-09 AU and OG-13 NZ). No exemption.
21. **CSS / JS:** a full `build:preview` with the OG-12 content in `approved-copy.json` is **identical to the deployed tree after build-id normalisation (1,016 of 1,016)**: stylesheet byte-identical (`04x21r3261sq4.css`), the same 23 JavaScript chunks, no new or removed rule.
22. **Tests:** 1,204 passed across 48 files (one run showed two timeouts, in the library-green test and an importer test, while Chrome and the render server were using memory; a clean rerun passes all 1,204; no timeout was changed).
23. **Lint exit code:** 0. **Typecheck exit code:** 0. `import:verify-prep` 0 (OG-12 NZ and AU 7 pages) · `import:verify-build` 0 (records 27 · market files 54 · broken internal links 0).
24. **Readiness to stage OG-12:** ready, subject to your approval to stage and to your assignment of the resource ID. Nothing from QA is outstanding.

## Visual QA (all 14 pages viewed as images)
No clipping, overflow, orphan heading, blank page or dark cover panel. Pages 2, 4, 5 and 6 are about half to two-thirds empty by design (each section starts on its own page and the standing blocks sit at the end), which keeps the writing areas uncluttered. The last page's blocks are separated by clean spacing.

## Notes
- **PDF text QA:** the PDF's extracted words are all present in the prepared HTML, so the detectors were run on the exact source; a table row is flattened by text extraction, so the QA script restores the cell boundaries before sentence scanning (otherwise "30-Day Pantry Builder Build up … guidance" reads as one sentence).
- **Prep report:** includes OG-12 as publishable in both markets; it is a git-ignored generated file.

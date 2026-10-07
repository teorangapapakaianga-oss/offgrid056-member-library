# Stage 9.82 — OG-04 Property Type Review: PDF render and visual QA

**Date:** 7 October 2026 · **Rendered in `workspace/prep/OG-04/` only. NOT staged in `private-assets/`, NOT deployed; no live resource changed.** Live baseline: 24 / 24 protected · 48 / 48 market files · 0 broken links · Bucket C 0 · Worker `89333107-7c0a-4bdb-8229-f2b5241a9e05` (100%).

## Result

| | NZ | AU |
|---|---|---|
| File | `property-type-review.NZ.pdf` | `property-type-review.AU.pdf` |
| Size | 260,680 bytes | 260,461 bytes |
| SHA-256 (first 16) | `D486511C8F9A94A0` | `BD18706BBBDFFFC1` |
| Pages | 9 | 9 |
| Orientation | portrait, 612 × 792 pt (US Letter) on every page, as the other live resources | same |
| Title metadata | `Property Type Review — OffGrid056` | same |

Rendered with headless Chrome from the prepared HTML, using the corrected shared cover template and the shared OffGrid056 cover image. The copy is the approved Stage 9.81A copy; no wording was changed.

## One layout fix (no copy change)

The first render put the last field, **Notes**, alone on page 7 (a stray label with three lines, 7 characters of text). I wrapped the two closing fields of Step 4 ("The first thing I will check, and who I will ask" and "Notes") in a keep-together block so they move to page 7 as a pair. No field was removed, no writing space was reduced, and the wording is identical; only the layout markup in `approved-copy.json` changed. Page 7 is therefore a half-page of two worksheet fields with no heading of its own. I judged that usable and honest rather than squeezing Step 4 onto one page, which would have meant compressing writing space. If you would rather it carry a continuation heading or sit elsewhere, that is a copy or layout decision for you.

## Page map (both markets)

1. Cover (shared cover image, title, subtitle; no dark panel)
2. Emergency block (market-specific) · Why This Matters · Before You Begin
3. Step 1: four property-situation questions and the "anything else" field
4. Step 2: the six property facts
5. Step 3: "To Help You Think" and the five-column, 8-row grid
6. Step 4: Rules 1–3
7. Step 4 continued: "The first thing I will check, and who I will ask" and "Notes"
8. Where Next (eight rows)
9. Where You Are Now · general disclaimer

## Writing-space QA (inspected page by page)

- **Property-situation questions:** easy to complete. Tick boxes are large; each Other line is a full-width writing line; the dwelling options wrap to a second line, which reads clearly.
- **Six property facts:** every field has a full-width line; insulation and roof have two lines each. Adequate.
- **Constraints grid:** five columns across the page width, headings in capitals and readable, borders continuous. Each of the 8 rows is tall enough for a short phrase or two short lines, with alternating shading that keeps rows distinct. Columns are narrow for long sentences but sized for the short notes the grid asks for. **No column and no row was removed and nothing was compressed.** Readable in portrait; no layout fix needed.
- **Three rules:** three lines each, plus two lines for the first check and three for Notes. Useful space.
- **"To Help You Think" box:** readable, text not cramped.
- **Closing section:** the closing box and disclaimer sit alone on page 9 with generous space; not cramped.

## Visual QA

Every page of the NZ PDF and the key pages of the AU PDF (2, 3, 5, 6, 9) were inspected as images, and page text was checked for every page of both. No clipping, no overflow, no orphan heading, no blank page, no broken table border, no cut-off writing area, no dark cover panel; the cover title is readable. The market standing blocks are correct and the disclaimer is intact.

## Automated checks (`workspace/og04-pdfqa.mts`, git-ignored): ALL PASS in both markets

- 9 pages, portrait only; title "Property Type Review — OffGrid056", no legacy code in the title; producer and creation date present.
- Sections in the approved order; the emergency block appears once on page 2 and the disclaimer once on page 9.
- All four questions, the six property-fact labels, the five grid headings in order, the three rules, the "To Help You Think" wording, Where Next (eight rows in order, last two labelled later-stage options) and the closing wording are exactly the approved text.
- No currency, percentage or age claim; no legacy label or code; no tenancy, consent, grant, body-corporate, solar, battery, generator or wood-burner wording in the PDF.
- Digits are only page, step, field and rule numbers, "056", "90" (live title) and the emergency numbers.
- **Market separation:** NZ has "call 111" and "licensed electrical worker or licensed or certifying gasfitter" and none of AU's wording; AU has "call 000", 112 and "licensed electrician or licensed gasfitter" and none of NZ's. The worksheet body is **identical in NZ and AU** (5,456 characters each).

## Safety

The legacy electrical topic stays **REMOVED** (owner-approved). The PDFs carry only the two standing blocks (emergency contact and general disclaimer); no electrical or other topic block, and the rendered copy introduces no new trigger.

## Scans

- **Price:** 0 detections in both markets; no price claims.
- **Numeric:** Bucket C = 0 in both markets; the only candidate is "90-Day" (live title), classed D.
- **Market, safety, legacy-language, overlap:** all PASS (`workspace/og04-draft-qa.mts`); the overlap results are as in the 9.81A pack.
- `import:verify-prep` reads both OG-04 PDFs back: verified (9 pages each). Library Bucket C 0.

## Validation

Lint clean; typecheck clean; **768 tests passing**. Two earlier full runs of this stage had timeouts in `tests/unit/importer.test.ts` and `tests/unit/numeric.test.ts` ("Test timed out in 5000ms" and one assertion on the prepared library that ran over time). They pass when run on their own and the full suite then passed 768 of 768 on a rerun, so I treat them as load flakes: the machine had about 1.4 GB of free memory while Chrome, Edge and the preview server were running. I did not change any test or timeout. `import:verify-build`: 24 records · 48 market files · 0 broken internal links. Live Worker unchanged.

## Readiness to stage as protected resource #25

**Ready, pending your approval of the rendered PDFs** (including the page-7 layout above). Staging would register `res-1004` with the locked metadata and the approved related list, place the two PDFs byte-identical, add the standing blocks, and run the full staged-build validation. Nothing has been staged or deployed.

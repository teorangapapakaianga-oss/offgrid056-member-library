# Stage 9.69A — shared cover template fix and OG-01 final PDF QA

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **OG-01 not staged, nothing deployed, no deployed PDF replaced, no wording changed.**

## 1. The defect
The dark panel on the cover was **not a design element**. The shared cover CSS gives the cover image `box-shadow: 0 20px 60px rgba(0,0,0,0.4)`. Chrome's PDF output does not print a large blur as a shadow: it flattens it into a **solid dark rectangle** (about 380 × 455 pt on the centred cover) behind the image. On the centred cover that rectangle ends part-way through the title. On the bottom-anchored cover it shows as a dark block offset to the top right, clipped by the page edge. Proof: the same HTML rendered without that one declaration prints no panel.

## 2. The change (shared, not an OG-01 hack)
`admin-import/reskin/reskin.ts` — new exported `fixCoverImageShadow(html)` removes the `box-shadow` declaration from the `.cover-img` rule only; every other declaration (size, fit, radius, lime border, margin) is untouched. `admin-import/pilot/prep.ts` applies it to every prepared document at the point it is written, so it covers every resource through the one shared pipeline. A shadow has no purpose on a printed page. Option B of the brief (no panel at all) rather than a taller panel, because there is no intended panel. Cover hierarchy, branding, title, subtitle, Start Here chip and image placement are unchanged. Tests: `tests/unit/cover-shadow.test.ts` (4: removes it, keeps the other declarations, leaves other shadows alone, idempotent).

## 3. Impact audit
Every prepared resource whose HTML carries the rule: **21 of 23** (20 live protected resources + OG-01). Not affected: **OG-B04** and **OG-B10** (no cover page).
- **Centred cover (panel cuts the title) — 15 live:** OG-02, 08, 09, 10, 11, 13, 15, 17, 18, 19, 20, 21, B07, B08, **B09 (#22)**.
- **Bottom-anchored cover (panel offset, does not touch the title; confirmed visually on OG-22) — 5 live:** OG-22, 25, 26, 27, B12.
- **OG-01:** was the centred case; now clean.
Titles are per the live library listing. The 20 live PDFs are **not regenerated and not redeployed**; their working HTML now carries the fix, so the next regeneration will print clean. (Pixel scan alone missed the five bottom-anchored covers; those were identified by the rule and by eye.)

## 4–6. Regeneration and cover QA
| | pages | result |
|---|---|---|
| OG-01 NZ (`workspace/prep/OG-01/…NZ.pdf`) | 10 | clean cover |
| OG-01 AU | 10 | clean cover |
| OG-B09 NZ **preview** (`workspace/shots/preview-ogb09/ogb09.NZ.pdf`) | 8 | clean cover; **page-by-page text identical** to the current PDF |
| OG-B09 AU **preview** | 8 | same |
Title fully readable and on the gradient, subtitle, image and Start Here chip unchanged, no clipping or overflow. The live OG-B09 PDFs (working folder and `private-assets/`) were not touched.

## 7. No content changed
`approved-copy.json` and `metadata-review.json` are unchanged this stage; OG-01 page counts and QA (`og01-pdfqa.mts`: ALL PASS both markets) are as approved; the disclaimer stays alone on page 10.

## 8–10. Regression and readiness
**677 tests passing** (673 + 4) · lint clean · typecheck clean · `import:verify-prep` verified (incl. OG-01) · `import:verify-build` verified · 23 / 23 ready, 46 market files, 0 market problems, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · existing baseline 22 / 22 protected, 44 / 44 market files, no existing resource changed · `private-assets/` byte-identical (hash unchanged) · Worker unchanged (`db2fd12a…`, rollback `fa23ec74…`). **OG-01 is ready to stage as protected resource #23** on your approval. A decision for you: whether to regenerate and redeploy the 20 live PDFs with the clean cover (a normal-deployment task alongside `classify-the-21-live-resources`).

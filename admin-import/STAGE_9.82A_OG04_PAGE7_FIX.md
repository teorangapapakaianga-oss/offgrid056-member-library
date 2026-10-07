# Stage 9.82A — OG-04 page 7 continuation fix

**Date:** 7 October 2026 · **Rendered in `workspace/prep/OG-04/` only. NOT staged, NOT deployed; no live resource changed.** Live baseline: 24 / 24 protected · 48 / 48 market files · 0 broken links · Bucket C 0 · Worker `89333107-7c0a-4bdb-8229-f2b5241a9e05` (100%).

## The change

One heading added at the top of page 7: **Step 4 — Your Property Rules (continued)**, in the same style as the other step headings. Nothing else in the member-facing copy, metadata, related resources, safety blocks or market wording changed. The only difference in the worksheet body is those 40 characters (5,456 → 5,497 characters per market; identical in NZ and AU). The same two fields stay on page 7 with the same writing space (two lines, then three); Step 4 was not squeezed back onto one page.

## Result

| | NZ | AU |
|---|---|---|
| SHA-256 (first 16) | `C39C3D561573E181` | `A1E4EF42DE129671` |
| Size | 262,937 bytes | 262,718 bytes |
| Pages | 9 | 9 |
| Orientation | portrait, 612 × 792 on every page | same |

Pagination is unchanged: Where Next is still page 8 and the closing box and disclaimer page 9.

## Page 7

The continuation heading is visible at the top of the page and sits clear of the first field label (the usual heading-to-content gap). The first field keeps two writing lines and Notes keeps three. No orphaned content, no overflow, no page shift. Both markets are identical on this page.

## Visual and PDF QA

Every page's text was checked in both markets (character counts per page are unchanged for pages 1–6, 8 and 9), and pages 6 and 7 were inspected as images in both markets alongside the earlier full inspection from Stage 9.82; the other pages' markup is unchanged. Automated PDF QA passes in both markets: title "Property Type Review — OffGrid056" with no legacy code; sections in the approved order; emergency block once on page 2 and disclaimer once on page 9; the four questions, six property facts, five grid headings and the three rules exactly as approved; "To Help You Think", Where Next and closing wording exactly as approved; 8 blank grid rows; NZ has "call 111" and the NZ wording only, AU has "call 000", 112 and the AU wording only; the worksheet body is identical across markets.

## Scans and validation

Price scan 0 detections (price claims 0). Numeric: Bucket C 0 in both markets (the only candidate is "90-Day", a live title). Market, safety, legacy-language scans: all pass; the electrical topic stays REMOVED and only the two standing blocks are present. `import:verify-prep` reads both OG-04 PDFs back: verified. Lint clean; typecheck clean; **769 tests passing** (768 plus one new test for the continuation heading and its writing space). `import:verify-build`: 24 records · 48 market files · 0 broken internal links.

## Readiness to stage as protected resource #25

**Ready, pending your approval of these PDFs.** Nothing is staged or deployed.

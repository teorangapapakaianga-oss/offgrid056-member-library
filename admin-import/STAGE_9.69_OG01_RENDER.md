# Stage 9.69 — OG-01 PDF render and visual QA

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Rendered and checked. Nothing staged, nothing deployed, OG-01 not added as protected resource #23. No approved wording changed.**

## 1–2. Results

| | NZ | AU |
|---|---|---|
| File | `workspace/prep/OG-01/home-resilience-scorecard.NZ.pdf` (341,912 bytes) | `…AU.pdf` (342,528 bytes) |
| Pages | **10** | **10** |
| Automated PDF QA (`workspace/og01-pdfqa.mts`) | ALL PASS | ALL PASS |
| `import:verify-prep` | verified | verified |

## 3–4. Page count and layout

Portrait US-Letter-size pages (612 × 792 pt) throughout; no landscape.

| Page | Content |
|---|---|
| 1 | Cover (Start Here chip, title, purpose line) |
| 2 | In an emergency box · How To Use · About This Scale · How To Score |
| 3 | Part A — all ten questions on one page |
| 4 | Foundation Results — bands, results table (/ 20, band) |
| 5 | Three Priority Foundations + Part B (Yes / Partly / Not yet) |
| 6 | Household Considerations (six notes areas) |
| 7 | Quick Household Facts (six fields) |
| 8 | Safety Notes — electrical block then fire block |
| 9 | Where Next (all six resources) + Where You Are Now |
| 10 | Before you start (general disclaimer) |

Layout-only changes this stage (no wording): Part A starts on its own page; Part A, results, priorities, Part B, Household Considerations, Quick Facts, Where Next and the Safety Notes heading are kept together; score and priority rows cannot split; Part B response options shown as "Yes / Partly / Not yet" on one line (the earlier input box truncated it).

## 5. Visual QA findings

Every page of both PDFs was inspected. No clipping, no overflow, no orphan headings, no blank pages, no split score boxes, no split priority fields, no Part A question breaks, no truncated Safety Notes. Foundations are visually distinct (label column, banded rows); Start Here is on the cover chip and the running header.
Two things I did **not** change:
- **Cover panel:** the dark image panel stops mid-title. This is the shared cover template — it is identical on live protected resource #22 (OG-B09) — so it is a pre-existing template trait, not an OG-01 defect. Raise as a separate template decision if wanted.
- **Page 10** holds only the standing disclaimer. It must stay at the end and stay whole, so that is intended.

## 6. Score-box / writing-space QA

1–10 score box for every one of the ten questions; a Notes box beside each; "__ / 20" result and "Your band" for all five foundations; three priority fields each with a full-width ruled area; Part B has three Yes / Partly / Not yet checks with a Notes box; Household Considerations has six full-width writing areas; Quick Household Facts has six. Pages 5–7 and 10 have spare space rather than compression.

## 7. Safety-block placement QA

`emergency-contact` — top of page 2, before Part A. `batteries-and-electrical` and `fire-and-smoke-alarms` — inside Safety Notes (page 8), each exactly once, in order, whole. `general-disclaimer` — last page. Order verified: Safety Notes → electrical → fire → Where Next → disclaimer. No gas block, no carbon-monoxide block, no unintended block.

## 8. Market separation QA

NZ: 111, FENZ, NZ wording; no 000/112/SES/Relay/AU agency. AU: 000 and 112, Triple Zero, Australian wording; no 111/FENZ/WorkSafe NZ/heat-pump term. The scorecard body is market-neutral and identical; only the standing blocks differ.

## Content QA
No /100, no old programme labels, no 10L / 3 days / 7+ days / 72 hours, no Critical / Vulnerable / Fully Prepared. Bands 2–9 Starting Point · 10–15 Building Resilience · 16–20 Strong Foundation. Where Next shows Healthy Home Air Audit, Water Storage Calculator, Warm Home Scorecard, 30-Day Pantry Builder, Battery Backup Planner, Household Risk Identifier. `collections: ["start-here"]` remains intended for staging.

## A verifier fix (not a loosening)
`import:verify-prep` demanded the whole rebuilt OG-01 copy as one unbroken run, but the Safety Notes marker means the two blocks are injected into the middle of it. It now splits the approved copy at the marker and requires every stretch to be present **in order**. Everything else is checked as before; the other 22 resources are unaffected.

## 9–11. Validation and readiness
- **Tests: 673 passing** (unchanged) · lint clean · typecheck clean.
- **Bucket C = 0** for OG-01 in both markets (candidates are time/interval figures inside the approved text). Existing library: 22 / 22 protected, 44 / 44 market files, Bucket C = 0, no existing resource changed; `import:verify-build` verified; Worker unchanged.
- **Readiness for protected resource #23: ready**, pending your approval to stage and a separate approval to deploy (rollback `fa23ec74…` retained). `classify-the-21-live-resources` remains scheduled.

# Stage 9.70 — OG-01 staged as protected resource #23

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Staged and verified. NOT deployed. The live Worker is unchanged (`db2fd12a…`, rollback `fa23ec74…`). The 20 existing affected PDFs are untouched.**

## 1. Staged assets (git-ignored `private-assets/`; no member file in git)
| Path | Bytes |
|---|---|
| `private-assets/data-resources/home-resilience-scorecard.private.json` | the record |
| `private-assets/resources/home-resilience-scorecard.NZ.pdf` | 319,433 (byte-identical to the approved corrected-cover PDF) |
| `private-assets/resources/home-resilience-scorecard.AU.pdf` | 320,048 (byte-identical) |
Nothing else in `private-assets/` changed: the other 67 files hash identically to before (67 → 70 files).

## 2. Protected resource #23
`res-1001` · OG-01 · **Home Resilience Scorecard** · foundation `general` · programComponent `resilience-planning` · category `getting-started` · type `assessment` · difficulty `beginner` · 20 minutes · tags `[]` · status **`draft`** · `collections: ["start-here"]` · member journey role Start Here · NZ and AU market files, no default file.

## 3. Related resources (all resolve, to the owner-named titles)
res-1013 Healthy Home Air Audit · res-1008 Water Storage Calculator · res-1015 Warm Home Scorecard · res-1011 30-Day Pantry Builder · res-1019 Battery Backup Planner · res-1002 Household Risk Identifier. Each is a record in `private-assets`, a route in the built site, and an id in the OG-01 page data.

## 4–5. Safety blocks and cover
Exactly `general-disclaimer`, `emergency-contact`, `batteries-and-electrical`, `fire-and-smoke-alarms`; no gas, no carbon monoxide, no suppression; the placement marker and its fail-closed behaviour are unchanged. Each block appears once in both PDFs; emergency first, electrical then fire inside Safety Notes, disclaimer last. The staged PDFs carry the corrected cover: no dark shadow panel (pixel check 44 edge rows vs ≈350+ on a panel build), title readable, image, lime border, subtitle and Start Here chip unchanged.

## 6. Deferred: SHARED COVER CLEANUP
Recorded in `admin-import/config/future-tasks.json` as `shared-cover-cleanup` (NOT STARTED): regenerate all affected live PDFs with the corrected cover, classify the 21 live resources, visually QA every cover, full regression, deploy as one controlled release with rollback. No deployed copy touched.

## 7. Staging QA (`workspace/qa-build-og01.mts`, read from `out/`): ALL PASS
Build **records 23 · market files 46 · broken internal links 0**. NZ and AU PDFs open (10 pages); NZ has 111 and no 000/112/SES; AU has 000 and 112 and no 111/FENZ; the Start Here page lists OG-01; no /100, old programme labels, 10L, 3 days, 7+ days, 72 hours, or old bands; approved Stage 9.68A copy unchanged (the staged files are byte-identical to the approved PDFs).

## 8–11. Validation and readiness
**677 tests passing** · lint clean · typecheck clean · `import:verify-prep` and `import:verify-build` verified · 23 / 23 ready, 46 market files, 0 market problems, 0 findings, 0 flags, 0 price findings · **Bucket C = 0** · fire, electrical, numeric, market and price validation all clean. **Ready to deploy on your approval** (the rollback `fa23ec74…` stays retained). Not deployed.

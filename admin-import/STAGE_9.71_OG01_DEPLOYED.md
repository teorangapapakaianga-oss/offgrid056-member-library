# Stage 9.71 — OG-01 deployed as protected resource #23

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Deployed on the owner's explicit approval. Draft status kept. Nothing else changed.**

## Deployment
| | |
|---|---|
| Command | `wrangler deploy` (563 assets, 397 already uploaded), after a fresh `build:preview` + `import:verify-build` + staged-build QA (ALL PASS) |
| **New Worker version** | **`7de9641f-df4c-4cab-8e84-055c0861879d`** (created 2026-10-06T09:15Z) |
| **Rollback retained** | **`db2fd12a-955e-47c4-b3c9-d174e3da85d8`** (the 22-resource version) — still in the deployment history; earlier: `fa23ec74-85d2-4d91-b484-3f037ccbe38b` (21), `1922f7ba-…` (20). Nothing removed. |

## What is live (res-1001)
Home Resilience Scorecard · general · `resilience-planning` · `getting-started` · `assessment` · beginner · 20 minutes · **draft** · `collections: ["start-here"]` · NZ and AU market files. Related: res-1013 Healthy Home Air Audit, res-1008 Water Storage Calculator, res-1015 Warm Home Scorecard, res-1011 30-Day Pantry Builder, res-1019 Battery Backup Planner, res-1002 Household Risk Identifier. Safety blocks exactly `general-disclaimer`, `emergency-contact`, `batteries-and-electrical`, `fire-and-smoke-alarms` — each once; emergency first, electrical + fire inside Safety Notes, disclaimer last; no gas, no carbon monoxide, no suppression.

## Post-deploy QA
- **Uploaded content = verified build.** I cannot read content behind the login (I did not sign in), so QA is of the exact `out/` that was uploaded: 23 records · 46 market files · 0 broken internal links; the OG-01 page carries `res-1001`; resource #23 is in the library listing; Start Here lists it; all six related routes exist and are in its data; NZ and AU PDFs are **byte-identical** between `out/` and the staged `private-assets/` copies (hash prefixes 15B142F7C0A5 NZ / 85833DB81145 AU); NZ = 111, AU = 000/112, no cross-market leakage; cover has no shadow panel; no private PDF in `public/`.
- **Cloudflare Access:** an unauthenticated probe of 14 routes (home, library, Start Here, OG-01 page and both PDFs, the six related routes, OG-B09, a nonexistent route) — every one answered **302 to Access**; none answered 200. (`workspace/probe-access3.mjs`)
- **Not changed:** the other 67 `private-assets` files hash identically to before; no public/demo content changed; the 20 existing affected PDFs were not regenerated.

## Counts and validation
**23 / 23 protected resources · 46 / 46 market files · Bucket C = 0.** **RESOLVED in Stage 9.72 (`STAGE_9.72_ASSET_RECONCILIATION_AND_RELEASE_PREP.md`): "563" is the number of newly uploaded file contents, not the deployment size; the deployment is 960 files (958 before), i.e. +2, the two PDFs, because OG-01 replaced a same-route demo placeholder in place. The "no public/demo changes" statement above also needs the qualification recorded in 9.72 §4a.** Original note (superseded): wrangler reported 563 assets against 562 at the previous deploy, only one more, although OG-01 adds a page, its text payload and two PDFs. I did not reconcile that figure (it may reflect content-hash de-duplication or changes the previous count did not include). What I did verify is the content that was uploaded: `out/` contains the OG-01 page, both PDFs (46 PDFs in `out/resources`) and passes `import:verify-build` (23 records, 46 market files). Live reads are behind Access, so I could not fetch the live copies to compare. **677 tests passing** · lint clean · typecheck clean · `import:verify-prep` and `import:verify-build` verified · numeric, fire, electrical, market and price validation clean.

## Deferred (both NOT STARTED, for the next normal deployment)
`shared-cover-cleanup` and `classify-the-21-live-resources` (with the `deployedBeforeClassification` exemption list untouched).

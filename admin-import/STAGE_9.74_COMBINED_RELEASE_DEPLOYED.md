# Stage 9.74 — combined library cleanup DEPLOYED

**Date:** 7 October 2026 (deployment created 2026-10-06T22:56Z) · **Model:** Sonnet 5.5 · **Deployed exactly as validated in Stage 9.73B; no content, metadata or routing change was introduced.**

## 1–3 · Deployment
| | |
|---|---|
| Pre-deploy gate | working tree clean at `806dcc7`, in sync with origin; a fresh `build:preview` of exactly that state: `import:verify-build` 23 records · 46 market files · 0 broken links; release QA ALL PASS; content-level attribution against the deployed-state build: 984 files, **NO UNEXPLAINED DIFFERENCE** |
| Command | `wrangler deploy` — `Uploaded 616 files (368 already uploaded)`: **616 + 368 = 984 = every file in `out/`** (the 24 new files are the four demo routes) |
| **New Worker version** | **`e63141a1-380a-4770-a125-9fd7a15d0bdb`**, 100% in the deployment history |
| **Rollback (immediate target, retained until QA passed)** | **`7de9641f-df4c-4cab-8e84-055c0861879d`**; older versions `db2fd12a-955e-47c4-b3c9-d174e3da85d8`, `fa23ec74…`, `1922f7ba…` also retained. Nothing removed. |

## 4–5 · Counts
**23 / 23 protected resources · 46 / 46 market files · 0 broken internal links · Bucket C = 0.** Deployment size 984 files (960 before).

## 6 · Classification — confirmed
All 23 records carry Foundation, Programme Component, Category, Type and all five alignment answers (0 missing). Components: off-grid-living 9 · planning-implementation 6 · resilience-planning 6 · resilience-emergency 1 · advanced-future 1. **OG-B07 = off-grid-living; OG-B12 = advanced-future** (the only one). `deployedBeforeClassification` is **empty** (0 entries); `deployedBeforeClassificationWas` keeps the history only. The deployed page data for all 23 carries the same foundation, component, category and type as the records (release QA).

## 7 · Route policy — confirmed
`supersedes` = **empty**. `separateDemo` = exactly `res-0007 → res-1001`, `res-0015 → res-1008`, `res-0016 → res-1010`, `res-0013 → res-1013`, each **OWNER-APPROVED**. No pending or grandfathered status remains (test-pinned). An unlisted collision fails the build (test-pinned).

## 8 · Programme-day routing — verified in the deployed build
Day 2 and Day 29 → demo OG-01 placeholder (`res-0007`) · Day 9 → demo OG-08 placeholder (`res-0015`) · Day 11 → demo OG-10 placeholder (`res-0016`) · Day 13 → demo OG-13 placeholder (`res-0013`). None contains the protected id or a link to the protected route. **No protected PDF/download link on any of the five days:** the only PDF link on each is the demo's own static placeholder file (`/resources/general/home-resilience-scorecard.pdf`, `/resources/water/water-storage-calculator.pdf`, `/resources/water/rainwater-harvesting-planner.pdf`, `/resources/air/healthy-home-air-audit.pdf`); 0 protected-looking links.

## 9 · Protected / demo separation — verified
Protected routes serve the protected records (`res-1001`, `res-1008`, `res-1010`, `res-1013`), each listed exactly once in the library; the four demo routes serve the DEMONSTRATION placeholders and carry no protected NZ/AU PDF link. The demo placeholders appear in 79 files, all in allowed places (their own routes, the programme and workshops overviews, the five days, the demo workshop, and the demo resources that name them). They do **not** appear in the library, Start Here, foundations, categories, collections (incl. planning-tools), home, progress, saved or downloads (18 listing/page checks), and are not deleted or renamed.

## 10 · 40-PDF cover QA
The 40 deployed PDFs are **byte-identical** to the validated candidates (in `out/` and `private-assets/`), so the Stage 9.73 visual inspection of all 40 (NZ and AU) applies to the deployed bytes: no shadow panel, titles readable, lime border, subtitle and image preserved. Re-run on the deployed tree: gate PASS (same page count and size, identical text on every page, identical later pages) and market/safety PASS (same safety-block counts, same other-market hits, same text). OG-01, OG-B04 and OG-B10 PDFs unchanged. No additional PDF was regenerated.

## 11–12 · Tests and Bucket C
**708 tests passing** · lint clean · typecheck clean · `import:verify-prep` verified · `import:verify-build` verified · 23 / 23 ready, 0 market problems, 0 findings, 0 flags, 0 price findings · numeric, fire, electrical, market, price and safety validation clean · route-policy and separation tests pass · PDF verification pass · **Bucket C = 0**.

## 13 · Access verification
`workspace/probe-access4.mjs` — **41 unauthenticated requests, 41 redirects to Cloudflare Access, 0 answered 200**: library, Start Here, downloads, foundations, collections, progress, saved, programme and workshops overviews, the five programme days, the demo workshop, all four protected resource routes, all four demo routes, protected NZ/AU PDFs (including OG-02's `household-risk-identifier.pdf`, OG-B09, OG-15, OG-19), the demo PDFs, and an unknown route. Access was not changed. **Authenticated live inspection was not available** (I did not sign in to Access), so the deployed content is verified from the exact `out/` tree that was uploaded (984 files, hashes and routes) plus the Access gate.

## 14 · Public / demo safety
`git diff 24bcfc8 HEAD -- data public` is **empty**: no public/demo source file differs from the previously deployed commit; the only behavioural change is the approved route separation (a new `demo-` route per collision, unlisting, no aliasing). Demo routes serve demo content only; no protected PDF is linked from any demo route or programme day; 0 protected PDFs under `public/`; 0 private files tracked in git.

## 15 · Unexpected differences
None. Noted, not unexpected: the demo days and demo workshop now show the demo placeholders' own placeholder worksheet and static demo PDF link (previously they led into protected pages); the programme and workshops overview pages carry those demo references; `library/index.html` carries the usual Next.js build-markup noise.

## 16 · Readiness for the next migration stage
**Ready.** The library baseline is clean: 23 resources, 46 market files, all classified, demo and protected content separated, covers corrected, nothing deferred and no owner decision outstanding. Deferred tasks `shared-cover-cleanup`, `classify-the-21-live-resources` and `demo-protected-route-separation` are all marked DEPLOYED. Next stage (owner's choice): the next resource from `RESOURCE_REGISTER.md` — the general/planning group (OG-03 Budget Pathway Selector, OG-04, OG-07, OG-23, OG-24, OG-28, OG-29, OG-30) was noted as mostly low-hazard — starting with a claims-first audit and the programme-component alignment answers before any render. Standing rules unchanged: new resources enter as drafts, `--real` stays refused, any new demo/protected route clash needs an explicit `route-policy.json` entry, and every deploy keeps a rollback.

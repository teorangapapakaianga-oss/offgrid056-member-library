# Stage 10.27D — res-1514 Local Support Network Planner: production deployment and live verification

**Deployed on the owner's approval of Stage 10.27C. PASS. Rollback not triggered.** Only the approved staged build was deployed. No copy, cover, PDF, metadata, entitlement, OS, Supabase, Railway or Cloudflare Access change. The only repo metadata edits record the LIVE state.

## 1. Deployment
1. Pre-deploy Worker: `baf17c92-4ccf-45fb-aefe-f1ae5565eea6` (100%, confirmed before the deploy). 2. **Rollback target: `baf17c92-4ccf-45fb-aefe-f1ae5565eea6`** (every older version retained).
3. Pre-deploy counts (live): 35 protected · 70 market files · Planning Tools 12 · Downloads 57 · My Progress 60 · 0 broken.
11. Command: `npx wrangler deploy` (static assets Worker `og056-preview`), **exit 0**; 630 files uploaded, 458 already present. 12. **New Worker: `d7480c93-75fb-4ca5-8b40-0383b9cacadf`** (100%, created 2026-10-15T07:48Z; confirmed by `wrangler deployments status`). 13. Production deploy success: **YES**.
Source commit `166a491` (Stage 10.27C), tracked tree clean. What was deployed: `out/` of the second of two fresh clean `build:preview` builds: identical to the first and identical to the approved Stage 10.27C staged build (1,088 files, 0 differences after build-id normalisation); `out/` re-compared to the snapshot immediately before upload: 0 differences.

## 2. Pre-deploy gates (all passed)
4. NZ hash `56F1B2A872E67F2F564EC59838A9FE0502CFC10364D99C7ABDD6EC07C780211A`. 5. AU hash `B8DA6FD4833A210CF8D97D39135B81482DCD3C4DFDE6418844CF5C9641751AE8` (both recomputed from the staged files; byte-identical to Stage 10.27B-R1).
6. Metadata gate: PASS (title, slug, general / resilience-planning / planning / worksheet, beginner, 30 min, no collection, accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION, recommendationEligible false, handoff INACTIVE, route null, contract NOT_APPROVED; asserted by the permanent tests and re-read from the record).
7. Related gate: PASS (res-1502, res-1028, res-1006, res-1024 in that order; exactly four curated cards, no automatic fill, no duplicates; 0 existing pages change). 8. Privacy gate: PASS (no third-party addresses, other-household assets or supplies, vulnerabilities, medical detail, schedules, security, access codes or inventories). 9. Legacy gate: PASS (no OG-B14, Tier 4, 30-Day Programme, Asset Map, Potential Needs, Relationship Status, UHF, CB, HAM, annual drill, 500m, 2km or mutual-aid wording; `ogb14-pdfqa.mjs` ALL PASS on both PDFs, 7 pages each).
10. Pre-deploy tests: default-timeout full suite **65 files, 1,755 tests, exit 0**; lint exit 0 (0 errors; warnings only in git-ignored scratch scripts); typecheck exit 0; `import:verify-prep` exit 0; `import:verify-build` exit 0 (36 records · 72 market files · 0 broken internal links).

## 3. Live counts (measured from the uploaded tree, byte-identical to what Cloudflare serves behind Access)
14. protected **36**. 15. market files **72** (97 PDFs in total including demo). 16. Planning Tools **12** (the new resource is not in it). 17. Downloads **58**. 18. My Progress **61**. 19. broken links **0**. Library resource links 62 (61 before). Counts are exactly 36 / 72 / 12 / 58 / 61 / 0.

## 4. Route, metadata and PDFs
20. Route `/resources/local-support-network-planner/` builds and resolves. 21. Title correct. 22. Description exact. 23. Preview badge present; exact tooltip on **36 of 36** protected detail pages; 0 Draft; 0 listing publication badges. Resource page shows General · Worksheet · Beginner · 30 min · Planning; no OG-B14 or res-1514 wording; not in Planning Tools or Start Here.
24–27. NZ and AU files in the uploaded tree: NZ `56f1b2a8…211a` (1,567,660 bytes) and AU `b8da6fd4…1ae8` (1,567,416 bytes), equal to the approved hashes; 7 pages each; title "Local Support Network Planner — OffGrid056". A live download through Cloudflare Access was not possible without an authenticated session, so the hashes are those of the uploaded tree. 28. Market fail-closed: the page asks for a market before offering a download (existing behaviour, unchanged); no cross-market fallback. Filenames carry the market suffix; the V1 cover is not in the build.

## 5. Access probes (unauthenticated, redirects not followed)
29–35. 24 routes probed (`/`, library, downloads, progress, planning tools, start here; the new resource route, its `index.txt`, NZ PDF, AU PDF and an unsuffixed PDF name; existing resources res-1502 and its NZ PDF, res-1030 and its AU PDF, res-1006, res-1028, res-1024 and the demo res-0009; `robots.txt`; an unknown route; three direct private-asset/data/cover paths): **24 redirected (302) to Cloudflare Access, 0 unauthenticated 200.** Access settings untouched. **Authenticated owner session available: NO** (none was manufactured).

## 6. Integrity and regression
36. Build tree: 1,088 files, 0 differences from the staged build; res-1514 page files and both PDFs present; no unexplained removal. 37. Rejected V1 cover exposed: **NO** (0 files named V1/rejected). 38. Legacy OG-B14 source exposed: **NO** (0 files). 39–40. Existing-resource regression: the visible page text of res-1502, res-1028, res-1006, res-1024, res-1030 and res-0009 is **identical** to the previous live build; related cards on existing pages: **0 changed**; all earlier PDFs unchanged (97 PDFs, the 72 market files include all 70 earlier ones).
41. Detectors (current source, no exemption): technical safety 0 · regulatory unresolved 0 · Bucket C 0 · price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage, target-label all 0 · legacy-language 0 · content flags 0 (suite and PDF QA pass). 42. Library/OS separation: recommendationEligible false, handoffStatus INACTIVE, approvedHandoffRoute null, entitlementContractStatus NOT_APPROVED, accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; no handoff created.

## 7. Registers
43. RESOURCE_REGISTER: OG-B14 / res-1514 DEPLOYED (staged yes, deployed yes, protected record yes, rendered yes, NZ + AU PDFs), classification row LIVE, Deployed (36) / Staged (0). 44. CURRENT_STATUS: live 36 · 72, Worker `d7480c93…`, rollback `baf17c92…`. 45. NEXT_ACTIONS: res-1514 removed from staged / awaiting deployment and recorded DEPLOYED. The canonical index (json and md) and the review config also say LIVE.
46. Migration totals: **Deployed 36 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Archived 2 (OG-B05, OG-B06) · Not started 5 = 45** (36 + 0 + 0 + 1 + 1 + 2 + 5 = 45). 47. Remaining not started: **OG-B01, OG-B03, OG-B11, OG-B13, OG-B15**. No further audit has been started.

## 8. Post-deploy validation
48–54. After the register promotion: focused res-1514 tests pass; default-timeout full suite **65 files, 1,755 tests, exit 0**; lint exit 0 (0 errors; 94 warnings, all in git-ignored scratch scripts); typecheck exit 0; `import:verify-prep` exit 0; `import:verify-build` exit 0 (36 records · 72 market files · 0 broken links); register consistency tests pass; Worker `d7480c93…` still at 100%. 55. Rollback performed: **NO**. 56. Reason: n/a. 57. Final live Worker: `d7480c93-75fb-4ca5-8b40-0383b9cacadf`.

## 9. Verdict and next
61. **PASS.** 62. No owner decision is blocking. Open items (owner's choice): the next legacy audit from OG-B01, OG-B03, OG-B11, OG-B13, OG-B15; the demo placeholder `res-0009` treatment; res-1025 wording review; access tiers and the entitlement contract; res-1510 related curation; an authenticated owner check of the live OG-28, OG-29, OG-30, OG-B02 and OG-B14 pages and downloads, the one step this session cannot perform. 63. Recommended next stage: review the remaining queue and select the next audit deliberately.

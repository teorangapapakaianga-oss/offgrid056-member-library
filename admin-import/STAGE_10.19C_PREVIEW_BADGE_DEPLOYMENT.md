# Stage 10.19C — controlled deployment and post-deploy QA of the Preview badge

**Deployed on the owner's approval of Stage 10.19B.** Only the publication-governance change (publicationStatus, releaseChannel, Preview badge, approved tooltip) was deployed. Nothing else changed: no entitlement, OS integration, Supabase, Railway, Cloudflare Access policy, PDF, route, stable ID or OG-24 work.

## Deployment
| | |
|---|---|
| Result | **Success** (`wrangler deploy` exit 0; 604 assets, 436 already present) |
| Source commit | `4f85cbdf712b05f4fd5f428fe0e9d5481ca3534c` (Stage 10.19B); working tree clean (0 changed or untracked tracked-area files); the ignored private records needed for the build were the 30 protected records |
| Pre-deploy Worker (rollback target) | `9ccff591-fc7b-4827-a1f6-4d9b754cbaa6` (100% before the deploy; confirmed by `wrangler deployments list`) |
| New Worker | `07c5694d-db5b-45e4-a2f5-022ce518c8cb` (100%; created 2026-10-13T04:23:36Z = 17:23 NZDT; confirmed by `wrangler deployments list`) |
| Older versions | all retained (`7bccd708-70a8-479f-90c8-b6f7239e1c91`, `61f3bcf8-c4df-4d52-a060-b760bfbabc26`, `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` and earlier) |
| What was deployed | `out/` from the second of two fresh `build:preview` builds: identical to the first after build-id normalisation (0 differences), byte-identical to the uploaded snapshot (1,040 files) |
| Rollback triggered | **NO** |

## Pre-deploy validation
Fresh builds ×2 (exit 0 both); `import:verify-prep` 0; `import:verify-build` 0 (30 records · 60 market files · 0 broken internal links; includes the publication check); lint 0; typecheck 0. **Default-timeout full suite (5 s): 1,655 passed, 1 failed: `importer.test.ts` > "infers a foundation with confidence and evidence", a 5-second timeout (5,245 ms), the known OneDrive legacy-scan slowness.** `importer.test.ts` alone: 30 of 30 passed. **Full suite with the existing 30-second override: 60 files, 1,656 tests, all passed.** The global timeout was not changed. Canonical-index, publication, register-consistency, route-policy and built-output suites are inside the run.

## Build comparison (independent, build id normalised) — deployed tree vs validated build
1,040 → 1,040 files; **0 added, 0 removed, 300 changed** = 60 resource pages × 5 files; 0 files changed outside resource pages; 0 PDFs changed (85 compared); the stylesheet and all 23 JavaScript chunks byte-identical. **30 protected pages:** visible text differs only by Draft → Preview, and the exact tooltip is present on each. **30 demo pages:** visible text, links and title attributes identical (checked per page). In the raw data, 27 demo pages differ by exactly one `false` → `null` (the old draft check); 3 demo pages (energy-backup-guide, food-resilience-guide, water-security-guide, the ones with a learning-path strip) additionally differ by a renumbered internal render-row reference, which is invisible. No visible demo text, navigation, route, download behaviour or badge changed; no demo Preview badge appears.

## Post-deploy badge QA (the uploaded tree)
Protected detail pages **30**; Preview badges **30**; Draft badges **0**; exact tooltip "Approved resource in the protected OffGrid056 preview." on 30 pages (150 files carry it, including payload files); listing pages (Library, Downloads, Planning Tools, Start Here, Progress, Saved, home) publication badges **0**; occurrences of "not yet approved for members" **0** (it was 180 in 150 files before). Before the deploy the previous tree showed 30 Draft badges and 0 Preview badges, as expected.

## res-1019 Battery Backup Planner
Record status draft; publicationStatus approved; releaseChannel private-preview; register LIVE; route `/resources/battery-backup-planner/` unchanged; title correct; Preview badge visible with the exact tooltip; NZ and AU PDFs unchanged; produced by the shared badge logic (no override).

## Other checks
Protected resources 30; market files 60; PDFs byte-identical to the previous deployment (0 changes; no filename or market-mapping change; `household-risk-identifier.pdf` not renamed); route changes 0; stable-ID changes 0; entitlement changes 0 (`accessTier`, `entitlementRequirement` UNDEFINED_OWNER_DECISION); OS integration changes 0 (`recommendationEligible` false, `handoffStatus` INACTIVE, `approvedHandoffRoute` null, `entitlementContractStatus` NOT_APPROVED; no active handoff). Live claim detectors unchanged (Bucket C 0).

## Access (unauthenticated)
19 routes probed (home, library, res-1019 and its NZ and AU PDFs, res-1001, res-1002 and its NZ file, res-1023, a demo placeholder, a separated demo route, downloads, Planning Tools, Start Here, a programme day, an unknown route, a data path, a chunk path, `robots.txt`): **19 redirected (302) to Cloudflare Access, 0 unauthenticated 200.** Access settings were not touched. Authenticated or authorised verification is not available to this session (Access login is outside it); the deployed content was verified on the exact uploaded tree instead.

## Registers
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` updated: live 30 / 60, Worker `07c5694d…`, rollback `9ccff591…`, Preview badge deployed, 0 broken links; migration counts unchanged (Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 13 = 45); no resource status changed. `tests/unit/registers.test.ts` Worker pins updated.

## Verdict
**PASS.** Deployment succeeded, Access intact, 30 Preview badges and 0 Draft, tooltip exact, listings unchanged, res-1019 correct, routes, IDs, PDFs and the 60 market files unchanged, 0 broken links, no entitlement or OS change, demo behaviour unchanged, validations pass (default-suite timeout is the known importer slowness and the 30-second and isolated runs pass).

## Next stage
OG-24 Professional Support Planner: render, visual QA and staging preparation (the staging record must carry publicationStatus approved and releaseChannel private-preview, or the build fails). Not started.

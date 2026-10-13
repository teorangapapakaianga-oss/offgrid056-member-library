# Stage 10.21D — OG-28 Household Responsibility Roster: controlled deployment and post-deploy QA

**Deployed on the owner's approval of Stage 10.21C. PASS. Rollback not triggered.** Only the staged OG-28 build was deployed. No entitlement, OS, Supabase, Railway or Cloudflare Access policy change; no PDF, copy or metadata change (the only metadata edit records the LIVE state).

## Deployment
| | |
|---|---|
| Result | **Success** (`wrangler deploy` exit 0; 615 files uploaded, 441 already present) |
| Source commit | `2210703` (Stage 10.21C); working tree clean (0 changes; only the git-ignored private records and PDFs the build needs) |
| Pre-deploy Worker (rollback target) | `3e53c3a7-eb7a-450d-8f12-5244c04c0d38` (100% before the deploy, confirmed with `wrangler deployments list`) |
| New Worker | `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` (100%; created 2026-10-13T19:49:12Z = 2026-10-14 08:49 NZDT; confirmed by `wrangler deployments list`) |
| Older versions | all retained (`3e53c3a7…`, `07c5694d…`, `9ccff591…` and earlier) |
| What was deployed | `out/` of the second of two fresh `build:preview` builds: identical to the first (0 differences) and **identical to the approved Stage 10.21C staged build** (1,056 of 1,056 files, 0 differences); the uploaded tree is byte-identical to the pre-upload snapshot (1,056 of 1,056) |
| Rollback triggered | **NO** |

## Pre-deploy gate
Staged state verified against the 10.21C report: `res-1028` / Household Responsibility Roster / `/resources/household-responsibility-roster/`; NZ PDF `1b99def55b26a211efbc39c9eb47e9ecaaa36283beb5be350cad09321559ce41` and AU PDF `52d9b9329df01b2b9fbb48bd7ecb9dfcc62fc868ba8740531aec8191d0f6e93b` (private-assets copies and the built copies equal the approved hashes); cover hash `9CC0814EC0D7C2759C18894DCDFD00A9A02C12B48FDB9736AFA2582977F66BE5`. **Default-timeout full suite: 61 files, 1,672 tests, all passed**; lint 0 errors (53 warnings, none in application code); typecheck 0; `import:verify-prep` 0; `import:verify-build` 0 (**32 records · 64 market files · 0 broken internal links**); staged-build QA (`workspace/staged-qa28.mjs` run on the deploy tree) ALL PASS. Build comparison against the live-equivalent baseline was recorded in Stage 10.21C (8 added, 0 removed, 0 unexplained; related cards on the 61 existing pages unchanged; all 87 existing PDFs, the stylesheet and all 23 JavaScript chunks identical).

## Access (unauthenticated)
22 routes probed without following redirects (`/`, `/resources/`, `/library/`, the OG-28 route and its NZ and AU PDFs, the live OG-24 and OG-07 pages, an existing NZ/AU PDF, downloads, progress, planning tools, start here, saved, foundations, programme, `robots.txt`, an unknown route, a data path, a static chunk path, the OG-28 `index.txt`): **22 redirected (302) to Cloudflare Access (`odd-surf-0ad6.cloudflareaccess.com`), 0 unauthenticated 200.** Access settings untouched. **No authenticated owner session is available to this session; none was manufactured.** The content below was verified on the uploaded tree, which is byte-identical to what Cloudflare serves behind Access.

## Live verification (uploaded tree)
- **OG-28 route and metadata:** page builds with the approved title, description and metadata (Worksheet · General · Beginner · 20 min · Planning); no OG-28, `res-1028` or Day wording visible; both PDFs linked; Planning Tools lists it (**10 → 11**).
- **Badges:** **32 of 32** protected detail pages show **Preview** with the exact tooltip "Approved resource in the protected OffGrid056 preview."; **0 Draft**; **0 listing publication badges** (library, downloads, planning tools, progress); 0 occurrences of the old tooltip.
- **Related (live page order):** Priority Lock Worksheet (res-1007), 90-Day Implementation Roadmap (res-1027), Emergency Readiness Checklist (res-1006), 3-Tier Budget Planner (res-1026); all "Linked by us", automatic fill suppressed; res-0008 and res-1510 absent; no duplicate roadmap. Existing pages' related cards unchanged (0 of 61 differ, from 10.21C on the identical tree).
- **PDFs (uploaded copies):** NZ `household-responsibility-roster.NZ.pdf`, 3,384,967 bytes, sha256 `1b99def5…9e41`; AU `household-responsibility-roster.AU.pdf`, 3,384,723 bytes, sha256 `52d9b932…f7eb`; **8 pages each**; PDF title "Household Responsibility Roster — OffGrid056"; no OG-28 in the text; no "Clubbish"; the owner's title-free cover embedded (1055 × 1491) with the template title once; hashes equal the approved renders. A live download through Access was not possible without a session; the platform serves the uploaded files.
- **Live counts (measured from the uploaded tree):** protected resources **32** (verify-build: 32 records); market files **64** (64 protected PDFs); Planning Tools **11**; Downloads **54**; My Progress **57**; broken links **0**. (Before: 31 · 62 · 10 · 53 · 56.)
- **Entitlement and OS:** accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED; status draft, publicationStatus approved, releaseChannel private-preview; no OS link, no auth coupling.

## Detectors (current source, 32 / 64 library)
OG-28 (`workspace/og28-draft-qa.mts`, NZ and AU): technical safety triggers 0 (standing emergency-contact and general-disclaimer only); regulatory candidates 0, unresolved 0; Bucket C 0; price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage and target-label 0; legacy-language 0; content flags 0. The whole-library numeric scan (in the suite) has zero blocking findings. No exemption added.

## Registers, review config and canonical index
OG-28 promoted STAGED → DEPLOYED in `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md`; live **32 · 64**; Worker `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`, rollback `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`. **Migration totals (recalculated from the register):** Deployed 32 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 11 = 45 (OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). The review config carries OG-28 as DEPLOYED. Canonical index: res-1028 LIVE, badge Preview, firstPublishedToPreview 2026-10-14, reviewStatus NEEDS_ENTITLEMENT_DECISION and NEEDS_METADATA (not VERIFIED_CURRENT). Test expectations moved from staged to live; no validator was weakened. Historical notes untouched.

## Verdict
**PASS.** Deployment succeeded; Access intact; res-1028 live behind Access; 32 resources and 64 market files; Planning Tools 11; Downloads 54; My Progress 57; Preview badges correct and Draft absent; both PDFs with the approved hashes; related resources correct; no unrelated regression; 0 broken links; detectors clean; entitlement unchanged; OS handoff inactive; registers agree; no rollback.

## Owner decisions and next stage
No decision is blocking. Stopped for owner review; nothing else was started. Remaining open items (owner's choice of order): the next legacy-resource audit (OG-29, OG-30 and the B-series), the res-1025 wording review, the public-repository hygiene stage, and access tiers / the entitlement contract (OS handoff stays inactive until then). An authenticated owner check of the live OG-28 page and PDF downloads would close the one verification step this session could not perform.

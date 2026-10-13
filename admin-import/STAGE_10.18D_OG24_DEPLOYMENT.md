# Stage 10.18D — OG-24 Professional Support Planner: controlled deployment and post-deploy QA

**Deployed on the owner's approval of Stage 10.18C. PASS. Rollback not triggered.** Only the staged OG-24 build was deployed. No entitlement, OS, Supabase, Railway or Cloudflare Access policy change; no PDF or copy change.

## Deployment
| | |
|---|---|
| Result | **Success** (`wrangler deploy` exit 0) |
| Source commit | `23efa10` (Stage 10.18C); working tree clean (0 changes; only the git-ignored private records and PDFs the build needs) |
| Pre-deploy Worker (rollback target) | `07c5694d-db5b-45e4-a2f5-022ce518c8cb` (100% before the deploy, confirmed) |
| New Worker | `3e53c3a7-eb7a-450d-8f12-5244c04c0d38` (100%; created 2026-10-13T06:10:36Z = 19:10 NZDT; confirmed by `wrangler deployments list`) |
| Older versions | all retained (`9ccff591-fc7b-4827-a1f6-4d9b754cbaa6`, `7bccd708-70a8-479f-90c8-b6f7239e1c91`, `61f3bcf8-c4df-4d52-a060-b760bfbabc26` and earlier) |
| What was deployed | `out/` of the second of two fresh `build:preview` builds: identical to the first (0 differences), byte-identical to the uploaded snapshot (1,048 files) |
| Rollback triggered | **NO** |

## Pre-deploy validation
Hashes re-verified immediately before the build and before the upload: NZ `574a7308ad479116037d3bcaff968945dc230cb4e30fa26d2b0091cbcce2f462` and AU `460d17cb4b390ee9f8198c7ae01462fb1657cfcba5c1eb2a463afe6a7f6df6b7` (source, staged copy and built copy all equal); cover source hash `92eff0912b3734faa8bbf6757eceda9a27b219977a40d6ef93a7d8afeadf93d3`. Two fresh builds exit 0; `import:verify-build` 0 (31 records · 62 market files · 0 broken internal links); `import:verify-prep` 0; lint 0; typecheck 0; the staged-build QA script (`workspace/staged-qa24.mjs`) ALL PASS. **Default-timeout full suite (5 s): 1,655 passed, 1 failed: `numeric.test.ts` > "leaves the whole live library green: every prepared file has zero blocking findings", a 5-second timeout (5,058 ms).** This is a timeout, not a logic failure: the test scans every prepared file and has grown slower with the library (it passed at the default timeout in earlier stages); `numeric.test.ts` alone passes 27 of 27. This differs from the importer/OneDrive slowness recorded earlier. **Full suite with the existing 30-second override: 60 files, 1,656 tests, all passed** (rerun after the register promotion too). The global timeout was not changed.

## Pre-deploy build comparison (against the live deployment, build id normalised)
1,040 → 1,048 files; **8 added** (six route files and the two PDFs), **0 removed**, **329 changed**, **0 unexplained** (causes: listings and data 29, counters 12, resource-page payloads 300, new resource 8); related cards on existing pages: **0 pages differ**, 0 cards added or removed; all **85 existing PDFs byte-identical**; stylesheet and all 23 JavaScript chunks byte-identical. Expected effects only: Library +1, Downloads 52 → 53 (Worksheets 14 → 15), My Progress 55 → 56, Planning Tools 9 → 10.

## Post-deploy QA (on the exact uploaded tree; the site itself is behind Access)
- **res-1024 / `/resources/professional-support-planner/`:** page builds with the approved title, description and metadata (Worksheet · General · Beginner · 20 min · Planning); no OG-24, `res-1024` or Day wording visible; both PDFs linked; PDF title "Professional Support Planner — OffGrid056"; PDFs byte-identical to the approved hashes; no stand-in asset; related links exactly Supplier Comparison Worksheet (res-1023), Project Support Brief Template (res-1025), Resilience Product Wishlist (res-1022), 90-Day Implementation Roadmap (res-1027), no Same-topic cards.
- **Badges:** 31 of 31 protected detail pages show **Preview** with the exact tooltip "Approved resource in the protected OffGrid056 preview."; **0 Draft**; **0 listing publication badges**; 0 occurrences of the old tooltip; res-1019 still correct; produced by the shared logic (no override).
- **Counts:** protected resources **31**; market files **62**; Planning Tools **10** (OG-24 appears exactly once, the other nine unchanged); Downloads **53**; My Progress **56**; broken links **0**; Start Here, foundations and programme unchanged; programme days 7, 14, 23 and 24 still the demo resources.
- **Regression:** 85 existing PDFs byte-identical, 2 added; no route, stable-ID or unrelated-copy change.
- **Detectors (31 / 62 live library):** Bucket C 0; regulatory, payback, warranty and payment unresolved 0; OG-24 technical safety triggers 0 (standing blocks only), price 0, outcome 0, assurance 0, legacy-language 0, content flags 0; no exemption added.
- **Entitlement and OS:** accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED; no OS link, no auth coupling.

## Access (unauthenticated)
19 routes probed (`/`, `/resources/`, the library, the OG-24 route and its NZ and AU PDFs, res-1019 and its NZ PDF, res-1002's PDF, res-1023, two demo routes, downloads, Planning Tools, Start Here, progress, an unknown route, a data path, `robots.txt`): **19 redirected (302) to Cloudflare Access, 0 unauthenticated 200.** Access settings untouched. Authenticated or authorised verification is not available to this session; the content was verified on the uploaded tree.

## Registers, review config and canonical index
OG-24 promoted STAGED → DEPLOYED in `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md`; live **31 · 62**; Worker `3e53c3a7-eb7a-450d-8f12-5244c04c0d38`, rollback `07c5694d-db5b-45e4-a2f5-022ce518c8cb`. **Migration totals (recalculated):** Deployed 31 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 12 = 45 (OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). The review config carries OG-24 as DEPLOYED. Canonical index: res-1024 LIVE, badge Preview, publicationStatus approved, releaseChannel private-preview, reviewStatus NEEDS_ENTITLEMENT_DECISION and NEEDS_METADATA (not VERIFIED_CURRENT). Test expectations moved from staged to live. Historical notes untouched.

## Verdict
**PASS.** Deployment succeeded; Access intact; res-1024 live; 31 resources and 62 market files; Planning Tools 10; Downloads 53; My Progress 56; Preview badges correct and Draft absent; both PDFs with the approved hashes; related resources correct; no unrelated regression; 0 broken links; detectors clean; entitlement unchanged; OS handoff inactive; registers agree; no rollback.

## Owner decisions and next stage
No decision is blocking. Stopped for owner review; the next work is the owner's choice (the wider roadmap: the next legacy-resource audit, the res-1025 wording review, the repository hygiene stage, access tiers). Nothing was started automatically. One housekeeping item to schedule: the 5-second default timeout is now tight for two scan-heavy tests (importer and the live-library gate); a per-test timeout would be a safer fix than the global change you asked me not to make.

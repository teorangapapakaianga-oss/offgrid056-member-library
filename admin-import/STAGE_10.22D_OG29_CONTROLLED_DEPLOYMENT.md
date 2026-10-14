# Stage 10.22D — OG-29 Household Action Plan: controlled deployment and post-deploy QA

**Deployed on the owner's approval of Stage 10.22C. PASS. Rollback not triggered.** Only the staged OG-29 build was deployed. No entitlement, OS, Supabase, Railway or Cloudflare Access policy change; no OG-29 copy, PDF or metadata change (the only metadata edit records the LIVE state). The engine was not changed and res-1510 was not curated.

## Deployment
| | |
|---|---|
| Result | **Success** (`wrangler deploy` exit 0; 618 files uploaded, 446 already present) |
| Source commit | `5c25858` (Stage 10.22C); working tree clean (0 changes; only the git-ignored private records and PDFs the build needs) |
| Pre-deploy Worker (rollback target) | `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e` (100% before the deploy, confirmed) |
| New Worker | `4b864fb7-6736-46e5-b918-39f92ab37128` (100%; created 2026-10-14T03:15:07Z = 16:15 NZDT; confirmed by `wrangler deployments list`) |
| Older versions | all retained (`dd11e4e9…`, `3e53c3a7…`, `07c5694d…` and earlier) |
| What was deployed | `out/` of the second of two fresh `build:preview` builds: identical to the first (0 differences) and **identical to the approved Stage 10.22C staged build** (1,064 files, 0 differences after build-id normalisation); the uploaded tree is **byte-identical to its pre-upload snapshot (1,064 of 1,064)** |
| Rollback triggered | **NO** |

## Pre-deploy gate
Stage 10.22C state re-verified: record `res-1029` · slug `household-action-plan` · draft / approved / private-preview · planning-tools · related res-1027, res-1028, res-1007, res-1026; route `/resources/household-action-plan/`; NZ PDF `b8a5432752acf97721064e22f150b02768226950a72a7f4afcee19e3db6b5613`, AU PDF `8781aea47ad7a393826dfe1d3e66d1d7fcfada0e8e50469fda1147342a7aab3c` and cover `1B67D0D6829EFBE19B51D2A1D6EAFE13AAC3940309A91C8033E68DAE8905D359` all exact (private-assets, built copies and the PDFs embedded in the build). **Default-timeout full suite 62 files, 1,689 tests, exit 0**; lint exit 0 (0 errors, 64 warnings); typecheck exit 0; `import:verify-prep` exit 0; `import:verify-build` exit 0 (**33 records · 66 market files · 0 broken internal links**); staged-build QA run on the deploy tree (`workspace/staged-qa29d.mjs`): ALL PASS. Build comparison against the live-equivalent baseline matched Stage 10.22C: 8 files added, 0 removed, all 64 existing PDFs and all 24 CSS and JavaScript chunks unchanged.

## Accepted existing-page related-card changes (verified exactly)
Across the 62 existing resource pages, **exactly three** differ in their related cards, each only in the **sixth automatic "Same topic" card** (first five unchanged), which changed from Household Contacts Template to **Household Action Plan**:
1. `30-day-action-planner` (demo)
2. `build-your-first-30-day-action-plan` (demo)
3. `90-day-implementation-roadmap-advanced` (res-1510)
**No other existing page changed**; no existing resource copy, PDF, stable ID or engine code changed. These three are owner-approved and were not treated as defects.

## Access (unauthenticated)
24 routes probed without following redirects (`/`, `/resources/`, `/library/`, the OG-29 route, its NZ and AU PDFs and its `index.txt`, the live OG-28 route and PDF, the Advanced roadmap, the demo 30-Day Action Planner, Priority Lock Worksheet, an existing AU PDF, downloads, progress, planning tools, start here, saved, foundations, programme, `robots.txt`, an unknown route, a data path and a static chunk path): **24 redirected (302) to Cloudflare Access, 0 unauthenticated 200.** Access settings untouched. **Authenticated owner session available: NO** (none was manufactured); content was verified on the uploaded tree, which is byte-identical to what Cloudflare serves behind Access.

## Live verification (uploaded tree)
- **OG-29 route and metadata:** title "Household Action Plan"; the exact description "A practical worksheet to help your household turn its main resilience decisions into a clear list of actions, owners and next steps."; Worksheet · General · Beginner · 20 min · Planning; no OG-29 or `res-1029` wording visible; both PDFs linked; Planning Tools lists it (**11 → 12**).
- **Badges:** **33 of 33** protected detail pages show **Preview** with the exact tooltip "Approved resource in the protected OffGrid056 preview."; **0 Draft**; **0 listing publication badges** (library, downloads, planning tools, progress); 0 occurrences of the old tooltip.
- **OG-29 related cards (live page order):** 90-Day Implementation Roadmap (res-1027), Household Responsibility Roster (res-1028), Priority Lock Worksheet (res-1007), 3-Tier Budget Planner (res-1026); no "Same topic" label; **no res-0006, res-0008, res-1504 or res-1510**.
- **PDFs (uploaded copies):** NZ `household-action-plan.NZ.pdf`, 3,416,494 bytes, sha256 `b8a54327…5613`; AU `household-action-plan.AU.pdf`, 3,416,184 bytes, sha256 `8781aea4…ab3c`; **6 pages each**; title "Household Action Plan — OffGrid056"; subtitle exact with the **curly apostrophe** ("household’s"); approved cover embedded (1536 x 1024); five action-table columns (Action, Why it matters, Owner, Target date, Status / Notes) and ten blank unnumbered rows; Where Next prints exactly **three rows** (Before Roadmap, Next Roster, Also useful Priority Lock), res-1026 not printed; no OG-29, Week, Day, "30-Day Programme", Tomorrow or OFFGRID056.COM. A live download through Access was not possible without a session.
- **Live counts (measured from the uploaded tree):** protected resources **33** (verify-build: 33 records); market files **66** (66 protected PDFs); Planning Tools **12**; Downloads **55**; My Progress **58**; Library resource links 59; broken links **0**. (Before: 32 · 64 · 11 · 54 · 57.)
- **Entitlement and OS:** accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED; status draft, publicationStatus approved, releaseChannel private-preview; no OS link, no auth coupling.

## Detectors (current source, 33 / 66 library)
OG-29 (`workspace/og29-draft-qa.mts`, NZ and AU): technical safety triggers 0 (standing emergency-contact and general-disclaimer only); regulatory candidates 0, unresolved 0; Bucket C 0; price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage and target-label 0; legacy-language 0; content flags 0; NZ and AU body 2,232 characters each, body HTML 7,409 bytes each, identical. The whole-library numeric scan (in the suite) has zero blocking findings. No exemption added. `workspace/og29-pdfqa.mjs`: ALL PASS on both PDFs.

## Registers, review config and canonical index
OG-29 promoted STAGED → DEPLOYED in `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md`; live **33 · 66**; Worker `4b864fb7-6736-46e5-b918-39f92ab37128`, rollback `dd11e4e9-6c2d-4dff-a6f7-5233a8150e2e`. **Migration totals (recalculated from the register):** Deployed 33 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 10 = 45 (OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). The review config carries OG-29 as DEPLOYED. Canonical index: res-1029 LIVE, badge Preview, firstPublishedToPreview 2026-10-14, reviewStatus NEEDS_ENTITLEMENT_DECISION and NEEDS_METADATA (not VERIFIED_CURRENT). Test expectations moved from staged to live; no validator weakened; historical notes untouched.

## Post-deploy validation (actual exit codes)
Focused `og-29-draft.test.ts` 17 passed, **exit 0**. Default-timeout full suite **62 files, 1,689 tests, exit 0** (also after the register promotion). Lint **exit 0** (0 errors, 66 existing warnings). Typecheck **exit 0**. `import:verify-prep` **exit 0**. `import:verify-build` **exit 0** (33 records · 66 market files · 0 broken links). Unrelated-resource changes: **none** beyond the three owner-accepted related cards.

## Verdict
**PASS.** Deployment succeeded; Access intact; res-1029 live behind Access; 33 resources and 66 market files; Planning Tools 12; Downloads 55; My Progress 58; Preview badges correct and Draft absent; both PDFs with the approved hashes; OG-29's related set correct and unfilled; exactly the three accepted existing-page changes and no others; no existing PDF, copy, ID or engine change; 0 broken links; detectors clean; entitlement unchanged; OS handoff inactive; registers agree; no rollback.

## Owner decisions and next stage
No decision is blocking. Stopped for owner review; OG-30, entitlement work, res-1510 curation and engine changes were not started. Open items (owner's choice of order): the next legacy-resource audit (OG-30 and the B-series), the res-1025 wording review, the public-repository hygiene stage, access tiers and the entitlement contract, and (optional) curating res-1510's related list. An authenticated owner check of the live OG-29 page and PDF downloads would close the one verification step this session could not perform.

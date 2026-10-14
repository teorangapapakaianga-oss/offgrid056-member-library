# Stage 10.23D — OG-30 Long-Term Direction Planner: controlled deployment and post-deploy QA

**Deployed on the owner's approval of Stage 10.23C. PASS. Rollback not triggered.** Only the approved staged OG-30 build was deployed. No entitlement, OS, Supabase, Railway or Cloudflare Access change; no copy, cover, PDF or metadata change (the only metadata edits record the LIVE state).

## Deployment
| | |
|---|---|
| Result | **Success** (`npx wrangler deploy`, exit 0; 622 files uploaded, 450 already present) |
| Source commit | `252c3f9` (Stage 10.23C); tracked working tree clean (0 changes) |
| Pre-deploy Worker (rollback target) | `4b864fb7-6736-46e5-b918-39f92ab37128` (100% before the deploy, confirmed) |
| New Worker | `f97d160a-2599-40b6-a4a2-fe3badec1e25` (100%; created 2026-10-14T06:03:07Z; confirmed by `wrangler deployments list`) |
| Older versions | all retained (`4b864fb7…`, `dd11e4e9…`, `3e53c3a7…` and earlier) |
| What was deployed | `out/` of the second of two fresh `build:preview` builds: identical to the first (0 differences) and **identical to the approved Stage 10.23C staged build** (1,072 files, 0 differences after build-id normalisation); the uploaded tree is **byte-identical to its pre-upload snapshot (1,072 of 1,072)** |
| Rollback triggered | **NO** |

## Pre-deploy gate (all passed)
Live baseline confirmed before the deploy: 33 protected resources · 66 market files · Planning Tools 12 · Downloads 55 · My Progress 58 · 0 broken links · Worker `4b864fb7…` at 100%. Staged build confirmed: 34 · 68 · 12 · 56 · 59 · 0. Staged-build QA run on the deploy tree (`workspace/staged-qa30d.mjs`): ALL PASS (record, route, both PDFs with the approved hashes, 4 curated cards in order with no automatic fill, Planning Tools 12 → 12, existing pages untouched, Preview and exact tooltip, 0 Draft). Slug side-effect re-run: **0 existing pages change**. Draft QA and PDF QA: ALL PASS (9 pages each, exact title). **Default-timeout full suite 63 files, 1,706 tests, exit 0**; lint exit 0 (0 errors; warnings come only from git-ignored scratch scripts); typecheck exit 0; `import:verify-prep` exit 0; `import:verify-build` exit 0 (34 records · 68 market files · 0 broken internal links).

## Existing-asset integrity
Against the live-equivalent baseline (the deployed OG-29 build): 8 files added (the new resource's page files and two PDFs), 0 removed; all 91 earlier PDFs byte-identical; stylesheet identical; all 23 JavaScript chunk names identical; programme, Start Here, Foundations, Planning Tools and the other untouched areas have 0 changed files. The changed pages differ only by the new entry and the counts (attributed hunk by hunk in Stage 10.23C). Related cards on existing pages: **0 changed**.

## Access (unauthenticated)
24 routes probed without following redirects (`/`, `/resources/`, `/library/`, the OG-30 route, its NZ and AU PDFs and `index.txt`, the OG-29 route and NZ PDF, the Off-Grid System Architecture Planner, the Advanced roadmap, the demo 30-Day Action Planner, an existing AU PDF, downloads, progress, planning tools, start here, saved, foundations, programme, `robots.txt`, an unknown route, a data path and a static chunk path): **24 redirected (302) to Cloudflare Access, 0 unauthenticated 200.** Access settings untouched. **Authenticated owner session available: NO** (none was manufactured); content was verified on the uploaded tree, which is byte-identical to what Cloudflare serves behind Access. A live download through Access was not possible without a session.

## Live verification (uploaded tree)
- **Route and metadata:** `/resources/long-term-direction-planner/`; title and the exact description; General · Advanced Future · Planning · Worksheet · Intermediate · 30 min; Preview badge; no OG-30 or `res-1030` wording; both PDFs linked; the page asks for a market before offering the download.
- **Badges:** **34 of 34** protected detail pages show the exact tooltip "Approved resource in the protected OffGrid056 preview."; **0 Draft**; **0** listing publication badges (library, downloads, progress, planning tools).
- **Related (live page order):** 90-Day Implementation Roadmap, Off-Grid System Architecture Planner, 3-Tier Budget Planner, Home Energy & Shelter Upgrade Plan; all "Linked by us"; no automatic card; every link resolves.
- **PDFs:** NZ `long-term-direction-planner.NZ.pdf`, 4,075,119 bytes, sha256 `eca257980ea8b3cd439a0947f07d2e42e5aa18d7f1592452b941a3f5cd1cbcbe`; AU `…AU.pdf`, 4,074,987 bytes, sha256 `a29643746bbeecdcf0229426de1928b930cf36e4796c0b982c6782a0c9d413ff`; both equal the approved and staged hashes. 9 pages each; title "Long-Term Direction Planner — OffGrid056"; approved cover embedded; Direction A, B and C intact; Where Next prints exactly three rows and Home Energy & Shelter Upgrade Plan (res-1021) is not printed; no OG-30, Week, Day or legacy wording (`workspace/og30-pdfqa.mjs`: ALL PASS on the same bytes).
- **Live counts (measured from the uploaded tree):** protected resources **34**; market files **68**; Planning Tools **12** (the new resource is not in it); Downloads **56**; My Progress **59**; Library resource links 60; broken links **0**. (Before: 33 · 66 · 12 · 55 · 58.)
- **Entitlement and OS:** accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED; status draft, publicationStatus approved, releaseChannel private-preview.

## Detectors (current source)
OG-30 (`workspace/og30-draft-qa.mts`, NZ and AU): technical safety 0; regulatory candidates 0, unresolved 0; Bucket C 0; price, payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, storage and target-label 0; legacy-language 0; content flags 0; body 3,437 characters each, identical. The whole-library numeric scan (in the suite) has zero blocking findings. No exemption, no detector change.

## Registers, review config and canonical index
OG-30 promoted STAGED → DEPLOYED in `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md`; live **34 · 68**; Worker `f97d160a-2599-40b6-a4a2-fe3badec1e25`, rollback `4b864fb7-6736-46e5-b918-39f92ab37128`. **Migration totals (recalculated from the register):** Deployed 34 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 9 = 45 (OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). The review config carries OG-30 as DEPLOYED. Canonical index: res-1030 LIVE, badge Preview, firstPublishedToPreview 2026-10-14, reviewStatus NEEDS_ENTITLEMENT_DECISION and NEEDS_METADATA (not VERIFIED_CURRENT). Test expectations moved from staged to live; no validator weakened; historical notes untouched.

## Post-deploy validation
After the register promotion: default-timeout full suite **63 files, 1,706 tests, exit 0**; lint exit 0 (0 errors); typecheck exit 0; `import:verify-prep` exit 0; `import:verify-build` exit 0 (34 records · 68 market files · 0 broken links); Worker `f97d160a…` still at 100%. Unrelated-resource changes: **none**.

## Verdict
**PASS.** Deployment succeeded; Access intact; res-1030 live behind Access; 34 resources and 68 market files; Planning Tools 12; Downloads 56; My Progress 59; Preview badges correct and Draft absent; both PDFs with the approved hashes; the related set correct and unfilled; no existing page, PDF, copy, ID or engine change; 0 broken links; detectors clean; entitlement unchanged; OS handoff inactive; registers agree; no rollback.

## Owner decisions and next stage
No decision is blocking. Stopped for owner review; no other resource was started. Open items (owner's choice of order): the next legacy-resource audit (remaining not-started: OG-B01, B02, B03, B05, B06, B11, B13, B14, B15), the res-1025 wording review, the public-repository hygiene stage, access tiers and the entitlement contract, and optional res-1510 related-list curation. An authenticated owner check of the live OG-28, OG-29 and OG-30 pages and PDF downloads would close the one verification step this session cannot perform. Recommended next stage: **the next legacy-resource audit, starting with a general-foundation B-series resource such as OG-B02 Emergency Contacts Info Sheet** (low hazard, no technical safety topics); your call.

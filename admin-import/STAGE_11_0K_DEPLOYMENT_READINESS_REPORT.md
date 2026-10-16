# Stage 11.0K — Deployment Readiness Report (for owner review and authorisation)

**Nothing was deployed, published, redeployed or changed in Cloudflare; the separate Resilience OS was not touched.** This report records the owner's Cloudflare checks, the remaining pre-deployment checks I ran, the final metadata, protected-resource preservation, and the rollback plan. **Recommendation: READY for your authorisation** (decision wording in section 9). Companion records: `STAGE_11_0J_INTEGRATION_REPORT.md`, `STAGE_11_0J_FINAL_DECISION_RECORD.md`.

## 1. Owner-observed Cloudflare security results (recorded as reported by the Project Owner)
| # | Check | Result | Source |
|---|---|---|---|
| 1 | Production automatic builds | **Disabled** (also seen in the dashboard screenshot at 06:34, 17 Oct 2026) | owner-observed |
| 2 | Preview-branch automatic builds | **Disabled** | owner-observed |
| 3 | Deployment hooks | **None configured** (also seen in the screenshot) | owner-observed |
| 4 | Cloudflare Access scope | **All traffic** (whole hostname) | owner-observed |
| 5 | Unauthenticated Member Library access | **Redirected to Cloudflare Access** | owner-observed; independently re-checked by me (below) |
| 6 | Existing PDF download in an authorised session | **Downloaded successfully** | owner-observed; not something I can test |
| 7 | Direct PDF URL in Incognito | **Redirected to Cloudflare Access** | owner-observed; independently re-checked by me (below) |

Items 1, 2, 4 and 6 are the owner's observations and are recorded as such; I cannot read the Cloudflare dashboard or sign in. **My independent unauthenticated check (just now):** 27 requests, no cookies, redirects not followed (home, listings, existing resources and their PDFs including the unsuffixed legacy name, the eight new PDF/DOCX routes, the new pages, a master-package path, `robots.txt`, an unknown route): **27 redirected to Cloudflare Access, 0 unauthenticated 200.** Because Access covers all traffic on the hostname, the new routes and files fall under the same policy; that is what check 4 asserts, and it can only be proven for the new files after deployment (section 7).

## 2. Repository and build gates (actual runs, today)
| Gate | Result |
|---|---|
| Source | branch `main`, HEAD `55e925c`, **working tree clean** (0 changes); source commit to deploy is the commit that contains this report's parent code (`79c3ef1` code + docs) |
| Reproducible build | two fresh clean `build:preview` builds: **identical** (1,108 files, 0 differences); **identical to the Stage 11.0J staged build**; the current `out/` equals both |
| `import:verify-build` | exit 0: 38 records · 76 market files · 0 broken internal links; the four new PDFs ✓; four DOCX companions exist, are zip files, hash-equal to their records; no unrecorded `.docx`; release set B13+B15 present |
| Eight customer files | each of the 4 PDFs and 4 DOCX in the build output matches its `VERSION_MANIFEST.md` fingerprint, one to one (hash search) |
| Staged-build QA | counts **38 protected · 76 market files · Planning Tools 12 · Downloads 60 · My Progress 63 · 0 broken**; 38 of 38 detail pages carry the exact Preview tooltip; 0 Draft; four curated related cards on each new page, in order; NZ and AU links per edition; no master/package file and no unrecorded editable file in the build |
| Full suite / lint / typecheck / `import:verify-prep` | **69 files, 1,791 tests, exit 0** / 0 errors / exit 0 / exit 0 |
| Upload dry run | `wrangler deploy --dry-run` reads 1,649 asset files from `out/`, uploads nothing |
| Live | Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` at 100%; no deployment since 15 Oct 2026 07:48 UTC (the pushes did not trigger one) |

## 3. Final resource metadata (approved on authorisation)
| Field | `res-1513` | `res-1515` |
|---|---|---|
| Title | Resilience Asset & Document Checklist | Seasonal Review & Annual Service Log |
| Slug / route | `resilience-asset-and-document-checklist` | `seasonal-review-and-annual-service-log` |
| Legacy code | OG-B13 | OG-B15 |
| Foundation / component / category / type | general / resilience-planning / planning / checklist | general / resilience-planning / planning / template |
| Difficulty; estimated time | beginner; **none stated** | beginner; **none stated** |
| Collections / tags | none (Planning Tools stays 12) / none | none / none |
| Status; publication; channel | draft; approved; private-preview | same |
| Description (cover subtitle, verbatim) | A practical household tool for organising records, tracking resilience assets and preparing better questions for your insurer. | A practical companion for keeping household resilience systems visible, assigned and maintained over time. |
| Related, in order | res-1502 · res-1024 · res-1514 · res-1515 | res-1006 · res-1012 · res-1028 · res-1513 |
| Files per market | NZ and AU PDF + editable DOCX | NZ and AU PDF + editable DOCX |
| Access tier / entitlement; OS fields | UNDEFINED_OWNER_DECISION; recommendationEligible false, handoff INACTIVE, route null, contract NOT_APPROVED | same |

Editions (SHA-256 prefixes, all equal to the package manifest): B13 NZ pdf `7d6a858a`, docx `7299bc46`; B13 AU pdf `a5008efe`, docx `6ceb842a`; B15 NZ pdf `c67a95c9`, docx `d115694b`; B15 AU pdf `87053d8c`, docx `741db38f`. Release set: B13 and B15 deploy together (enforced by the verifier).

## 4. Protected-resource preservation
36 earlier protected resources: records and routes unchanged; **all 97 earlier PDFs byte-identical** to the live build; **visible text identical on every existing page except the Library, Downloads and My Progress listings** (which gain the new cards and counts); existing resource-page markup identical apart from the documented position of Next.js's `next-size-adjust` meta tag (a known build-to-build variation, normalised by the comparison tool) and, on learning-path and programme pages, React text-separator comments. The registers keep OG-B01, OG-B03, OG-B11 and the archived/blocked/HOLD history. The deployment ships the Stage 11.0J application code (optional estimated time, `companionFiles`, verifier); existing behaviour was verified unchanged. The Resilience OS is not part of this repository or this deployment.

## 5. Deployment procedure (to run only after your authorisation)
1. Confirm tree clean at the authorised commit; note the live Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` as the rollback target.
2. Two fresh clean `build:preview` builds; require 0 differences from each other and from the staged build (`out/` of the second build is what is uploaded).
3. `npm run import:verify-build` must exit 0; re-check the eight fingerprints and the counts above.
4. `npx wrangler deploy` (uploads exactly `out/`); record the exit code and the new version ID. No Git push is involved, Git-triggered builds stay disabled, and no Cloudflare setting is changed.
5. Post-deploy verification, in this order: Worker at 100% on the new version; my unauthenticated probes (expect every route, including the eight new files, to redirect to Access; any 200 is a FAIL); counts and page checks from the uploaded tree; register promotion STAGED → DEPLOYED only if all pass.

## 6. Rollback plan
- **Target:** `npx wrangler rollback d7480c93-75fb-4ca5-8b40-0383b9cacadf` (the current live version; it restores the 36-resource site: no new pages, PDFs or DOCX). Next fallback: `baf17c92-4ccf-45fb-aefe-f1ae5565eea6`, then `f97d160a-2599-40b6-a4a2-fe3badec1e25`; all older versions are retained (listed by `wrangler versions list`).
- **Roll back immediately if:** any protected route or file returns 200 unauthenticated; a new page or file is broken; any PDF/DOCX hash differs from the manifest; broken links appear; live counts differ from 38 / 76 / 12 / 60 / 63 / 0; any existing protected asset disappears; the build tree is incomplete; or a major regression appears.
- **After a rollback:** confirm the Worker is at 100% on the restored version, re-run the unauthenticated probes and the old counts (36 / 72), record the reason, the failed version ID and the result, then stop.
- The rollback is a pointer change (seconds, no data to migrate); no database, entitlement or Access setting is involved.

## 7. What cannot be verified before deployment, and how it will be closed
| Item | Status |
|---|---|
| Authenticated download of the **new** PDFs and DOCX files | **NOT TESTED** (they are not live). Closed after deployment by the owner in an authorised session: for each edition choose NZ, then AU, and open/download the PDF and the "Editable version"; confirm each file opens and is the right country edition |
| Direct URL of a new file in Incognito | NOT TESTED until live; my probes will cover it and the owner repeats one in Incognito |
| Cloudflare Access applying to the new routes | owner reported "All traffic"; proven for the new files only by the post-deploy probes |
| Entitlements / per-member access | none exist; Access is authentication only (unchanged) |

## 8. Residual risks and notes
Local static-site and unauthenticated tests do not validate production authentication, and this report does not claim they do. Git-triggered builds are off; re-enabling them without a design that includes the protected assets would deploy a demo-only site. Google Drive IDs for the legacy B13/B15 sources remain in `RESOURCE_REGISTER.md` of a public repository (optional hygiene stage). The printed PDFs carry the resource codes OG-B13/OG-B15 (owner-approved).

## 9. Authorisation requested
Please reply with an explicit decision. Suggested wording: **"Stage 11.0K APPROVED: deploy res-1513 and res-1515 together from the verified build, with the metadata in section 3 and the rollback plan in section 6."** Without it, nothing is deployed. On approval I will deploy once, run the section 5 checks, promote the registers only if they pass, report, and stop (the owner then completes the authenticated downloads in section 7).

## 10. Clarifications requested by the owner (2026-10-17)
1. **Source commit.** `55e925c` is the commit the verified build came from (clean tree); `f9c87f1` is the same tree plus one added file, this report. Between the last code commit `79c3ef1` and `f9c87f1` only three markdown reports changed (`git diff --name-status 79c3ef1 f9c87f1`: two reports modified, this report added); **0 files changed under `app`, `components`, `lib`, `tools`, `data`, `public`, `styles`, `package*.json`, `next.config`, `wrangler.jsonc`, `tsconfig.json` or the verifier and config folders.** The last commit touching any build input is `79c3ef1`. The deployment source will be the HEAD at the time of your approval, which must still have a clean tree and the same build inputs; the protected, git-ignored inputs are pinned by hash (records `res-1513` `d5a0fc4c…`, `res-1515` `9a68c240…`; the eight customer files per the manifest). The artifact is a fresh `build:preview` from that source; Next.js writes a new build id on every build, so the folder `_next/static/<build id>` differs each time, while the other 1,100+ files are identical after normalisation (verified three times). The verified build identity today: Next build id `bz-xD6PxtgrWptuuDeFtp`, 1,108 files, tree digest `d849d162…3c29`.
2. **1,108 versus 1,649.** 1,108 is the number of files in `out/` (counted by PowerShell, `cmd dir`, .NET and Node alike). Wrangler's "Read 1,649 files" counts directory entries as well: `out/` contains **541 directories**, and 1,108 + 541 = 1,649. The same pattern held at the last deployment (1,080 files + 532 directories = 1,612). `out/` contains exactly 101 PDFs (the 97 earlier ones plus the four new NZ/AU PDFs) and **4 DOCX files**; the QA gate confirms the four PDFs and four DOCX match the package manifest.
3. **Release scope.** The deployment is a manual `wrangler deploy` to the existing `og056-preview` Worker only. It changes no Cloudflare setting, creates no new route or hostname and does not touch Access; every URL stays behind the hostname-wide Cloudflare Access policy that you observed. It does **not** open the library to the public and does **not** make individual paid-member entitlements operational: access remains authentication-only, every access tier and entitlement is UNDEFINED_OWNER_DECISION, and no entitlement or Resilience OS handoff is active.
4. **Rollback.** `wrangler versions list` shows `d7480c93-75fb-4ca5-8b40-0383b9cacadf` (current), `baf17c92-4ccf-45fb-aefe-f1ae5565eea6` and `f97d160a-2599-40b6-a4a2-fe3badec1e25` retained (10 versions listed), and `wrangler versions view` returns the current version. A static-assets Worker version references its own uploaded asset manifest, so rolling back to `d7480c93` serves that version's complete asset set: the 36-resource Library (all earlier pages, 72 market files, unchanged assets), with the new routes and files no longer served. **Not exercised:** I have not performed a rollback in this session; the plan rests on Cloudflare's version model and the evidence above, and the post-rollback verification (counts 36 / 72, new routes absent, unauthenticated probes) is in section 6.
5. **Metadata.** Section 3 of this report holds the exact approved titles, descriptions, classifications, difficulty, collections, status and related links for both resources (and states that no time is shown).
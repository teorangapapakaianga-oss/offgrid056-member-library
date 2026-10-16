# Stage 11.0K — Deployment Completion Report

**Controlled preview deployment of `res-1513` and `res-1515` together: completed once, on the owner's explicit approval, to the existing Cloudflare Access-protected `og056-preview` Worker only. Rollback NOT triggered. Verdict: CONDITIONAL PASS. Every check that can be run without an authenticated session passed; the authenticated downloads of the eight new files are NOT TESTED and remain with the owner.** No commercial member launch, no public access, no entitlement change, no Cloudflare setting change (Access and the disabled Git-triggered builds are untouched), and the separate Resilience OS was not touched.

## 1. Deployment record
| | |
|---|---|
| Result | **Success**: one `npx wrangler deploy`, exit 0 (657 files uploaded, 451 already present; Worker script and triggers deployed) |
| **Deployed Worker version** | **`bde27561-cd8d-4984-bff5-a8bf8489709a`** (100%; created 2026-10-16T19:14:39Z = 17 Oct 2026 08:14 NZDT) |
| Rollback target | `d7480c93-75fb-4ca5-8b40-0383b9cacadf` (the previous live version, retained), then `baf17c92-4ccf-45fb-aefe-f1ae5565eea6`, `f97d160a-2599-40b6-a4a2-fe3badec1e25` |
| Source | branch `main`, HEAD `71800bf` (clean tree); **0 build-input paths changed since the verified code commit `79c3ef1`** (only three markdown reports differ); records pinned by hash (`res-1513` `d5a0fc4c…`, `res-1515` `9a68c240…`) |
| Artifact | `out/` of the second of two fresh clean `build:preview` builds: identical to the first and to the readiness build (1,108 files, 0 differences); the uploaded tree equals its pre-upload snapshot (**1,108 of 1,108 identical**). Wrangler's "files read" counts include directories (1,108 files + 541 directories) |
| Not done | no Cloudflare setting, Access, hook, build or entitlement change; no other deployment; no push-triggered build |

## 2. Pre-deployment gates (all passed immediately before the upload)
Clean HEAD and unchanged build inputs; two fresh builds identical to each other and to the readiness build; `import:verify-build` exit 0 (38 records · 76 market files · 0 broken internal links; the four new PDFs ✓; DOCX companions present, zip, hash-equal to their records; no unrecorded .docx; release set present); the eight customer files hash-equal to the Stage 11.0I manifest; counts 38 / 76 / 12 / 60 / 63 / 0; 38 of 38 detail pages carry the exact Preview tooltip; 0 Draft; the visible text of all 73 existing resource pages equals the previous live build.

## 3. Post-deployment checks: results
| Check | Result |
|---|---|
| Worker | `wrangler deployments status`: **`bde27561-cd8d-4984-bff5-a8bf8489709a` at 100%** |
| Unauthenticated access (the hard gate) | **38 requests, no cookies, redirects not followed: 38 redirected to Cloudflare Access, 0 unauthenticated 200** (home and listings; existing resources and their PDFs; the new pages, `index.txt`, four PDF and four DOCX routes; the old slug; package-name PDF/DOCX; a masters path; a record JSON path; `robots.txt`; an unknown route) |
| URLs | all eight new file routes and both new page routes exist in the uploaded tree at the recorded paths: `/resources/resilience-asset-and-document-checklist{,.NZ.pdf,.AU.pdf,.NZ.docx,.AU.docx}` and `/resources/seasonal-review-and-annual-service-log{,.NZ.pdf,.AU.pdf,.NZ.docx,.AU.docx}` |
| Four country PDFs and four DOCX (bytes) | **8 of 8 MATCH** the manifest SHA-256 in the uploaded tree: B13 NZ pdf `7d6a858a`, docx `7299bc46`; B13 AU pdf `a5008efe`, docx `6ceb842a`; B15 NZ pdf `c67a95c9`, docx `d115694b`; B15 AU pdf `87053d8c`, docx `741db38f`; verifier title and country checks ✓ (4 and 5 pages as approved) |
| Counts (uploaded tree) | **38 protected resources · 76 market files (+4 DOCX) · Planning Tools 12 · Downloads 60 · My Progress 63 · 0 broken links**; 38 of 38 detail pages carry the exact Preview tooltip, 0 Draft |
| New pages | titles, exact descriptions, Foundation General, type, Beginner, Preview, no time shown, four curated related cards in the approved order, NZ and AU links, no resource-code label in the page text |
| Regression | the 97 earlier PDFs are byte-identical (0 mismatches); the visible text of every one of the 159 HTML pages equals the previous live build except the Library, Downloads and My Progress listings; markup identical apart from those three; the 36 earlier resources and records unchanged; no master or package file in the build; no unrecorded editable file |
| Release set | B13 and B15 deployed together (verifier rule satisfied) |
| UI behaviour (Stage 11.0J local check, same code) | market unchosen: nothing offered; NZ: that edition's PDF plus "Editable version"; AU likewise; existing resources unchanged |
| Rollback | **not required** (no security or integrity failure); not exercised, the documented plan stands |

## 4. NOT TESTED and outstanding limitations (not classified as PASS)
1. **Authenticated downloads of the four new PDFs and four DOCX files on the live site**: I have no authorised session. The owner should, signed in, choose NZ then AU on each new page, open the PDF and the "Editable version" (confirm each opens and is the right country edition), and try one new file URL in Incognito (expected: redirect to Cloudflare Access).
2. **Cloudflare Access on the new files** is evidenced by the unauthenticated redirects (38 of 38) and the owner's "all traffic" observation; a signed-in test is the owner's.
3. **No entitlements exist**: access is authentication only; every access tier and entitlement is UNDEFINED_OWNER_DECISION; no member-specific or commercial access is claimed.
4. The deployment also shipped the Stage 11.0J application code (optional estimated time, editable-companion support, verifier); existing behaviour was verified unchanged.
5. Git-triggered builds must stay disabled (re-enabling without a build that includes the protected assets would deploy a demo-only site); the legacy Drive IDs remain in a public repository (optional hygiene stage); the printed PDFs carry the resource codes OG-B13/OG-B15 (owner-approved).

## 5. Registers and repository
OG-B13 and OG-B15 are promoted STAGED → DEPLOYED in the three registers, the canonical index and the review config, with the Stage 10.29-R HOLD history preserved. **Migration totals: Deployed 38 · Staged 0 · Prepared 0 · Blocked 2 (OG-16, OG-B11) · HOLD 0 · Merged 1 (OG-05) · Archived 4 · Not started 0 = 45.** After the promotion: full suite **69 files, 1,791 tests, exit 0**; lint exit 0 (0 errors); typecheck exit 0; `import:verify-prep` and `import:verify-build` exit 0. A docs-only push followed and the live Worker was re-read afterwards: still `bde27561…` at 100%, so no push-triggered build occurred.

## 6. Verdict and next
**CONDITIONAL PASS:** deployed and verified to the limit of unauthenticated and byte-level evidence; one owner action completes it (section 4, item 1). **No commercial member launch is authorised or implied.** Nothing further will be done without your instruction. If the signed-in check finds any problem, the rollback is `npx wrangler rollback d7480c93-75fb-4ca5-8b40-0383b9cacadf`, followed by the counts 36 / 72 and the unauthenticated probes.

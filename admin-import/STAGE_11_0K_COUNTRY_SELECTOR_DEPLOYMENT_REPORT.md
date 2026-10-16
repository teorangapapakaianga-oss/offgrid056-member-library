# Stage 11.0K — Country selector correction: deployment and QA report

**Deployed once, on the owner's explicit approval, to the existing Cloudflare Access-protected `og056-preview` Worker. Rollback NOT triggered. Verdict: PASS for every check that can be run without an authenticated session. Authenticated live downloads remain the owner's check (NOT TESTED by me).** Cloudflare Access, the disabled automatic builds, the approved documents, resource IDs and the separate Resilience OS were not touched; no entitlement change and no commercial launch.

## 1. Deployment
| | |
|---|---|
| Result | **Success**: one `npx wrangler deploy`, exit 0 (638 files uploaded, 470 already present) |
| **Deployed Worker version** | **`2954cb67-1d7c-486f-845e-3be7b3f5fac5`** (100%; created 2026-10-16T20:35:42Z = 17 Oct 2026 09:35 NZDT) |
| Rollback target | `bde27561-cd8d-4984-bff5-a8bf8489709a` (the previous live version, retained), then `d7480c93-75fb-4ca5-8b40-0383b9cacadf`, `baf17c92-4ccf-45fb-aefe-f1ae5565eea6` |
| Source | commit `7790172`, branch `main`, working tree clean (0 changes) |

## 2. Pre-deployment confirmations
- **Clean tree:** 0 tracked changes at `7790172`.
- **No unrelated code:** versus the source deployed in the previous stage (`71800bf`) the only executable files changed are `components/member/market-controls.tsx`, `components/resources/market-download.tsx` and `lib/content/companions.ts` (the country-selector correction); the rest is registers, reports, tests and metadata-review text (not part of the build).
- **Matching production assets:** two fresh clean builds are identical to each other (1,108 files, 0 differences) and to the Stage 11.0K verified fix build; against the build currently live, **2 files differ (client JavaScript chunks)**, 0 pages differ; the eight customer files and all 101 PDFs are byte-identical; `out/` equals the second build.
- **Verification:** `import:verify-build` exit 0 (38 records · 76 market files · 0 broken links; DOCX checks ✓); full suite 70 files, 1,799 tests; lint 0 errors; typecheck 0; `import:verify-prep` 0 (run for the fix commit).

## 3. Post-deployment checks
| # | Required check | Result |
|---|---|---|
| — | Worker | `wrangler deployments status`: **`2954cb67…` at 100%** |
| 7 | Unauthenticated requests | **37 requests, no cookies, redirects not followed: 37 redirected to Cloudflare Access, 0 unauthenticated 200**: the four new PDF and four DOCX routes, both new pages, existing resources and their PDFs (including Emergency Readiness Checklist NZ and AU), the old and package filenames, a masters path, `robots.txt`, an unknown route |
| 8 | Existing Library intact | uploaded tree = pre-upload snapshot (**1,108 of 1,108 identical**); **0 of 161 HTML pages differ in markup** from the previous live build; all 101 PDFs byte-identical; counts **38 protected · 76 market files (+4 DOCX) · Planning Tools 12 · Downloads 60 · My Progress 63**; 38 of 38 detail pages carry the Preview tooltip; the eight new customer files match the manifest (`7d6a858a`, `a5008efe`, `7299bc46`, `6ceb842a`, `c67a95c9`, `87053d8c`, `d115694b`, `741db38f`) |
| 1 | "Change country" visible in the download panel | **PASS** on desktop, tablet and phone: a 44 px button under "This version is for …", present once a country is chosen (absent, correctly, while the chooser is shown) |
| 2 | OG-B13 NZ → AU → NZ | **PASS**: no market → chooser and no files; NZ → NZ PDF + NZ DOCX; Change country → selector → AU → AU PDF + AU DOCX; Change country → NZ → NZ pair; then AU again |
| 3 | OG-B15 NZ → AU → NZ | **PASS**: the AU choice carried over from OG-B13; NZ, AU and NZ again switched correctly each time |
| 4 | PDF and DOCX switch together | **PASS**: in every step the two links carried the same country code; never mixed |
| 5 | Persistence after reload | **PASS**: AU chosen through the control survived a reload (OG-B13); NZ chosen through the control survived a reload (OG-B15); the choice carried between pages |
| 6 | Desktop and mobile layouts | **PASS**: desktop 1024 px (button fully in view), tablet 768 px (no sidebar; button in view and working), phone 375 px (button in view, no horizontal scroll, selector opens, switching works) |
| 8 | An existing country-specific resource | **PASS**: Household Contacts Sheet (PDF only): no editable link, still "20 min", NZ ↔ AU switches; Emergency Readiness Checklist switched NZ ↔ AU in the earlier fix test |

**Important qualification:** the live site is behind Cloudflare Access and I have no session, so checks 1 to 6 and the existing-resource page checks were run in the **browser pane against the exact uploaded tree (`out/`) served locally**, which is byte-identical to what was uploaded; they show behaviour of the deployed code, not a signed-in session on the live hostname. Unauthenticated behaviour on the live hostname (check 7) was tested directly.

## 4. Not tested and outstanding
1. **Signed-in checks on the live site** (the owner): on a new page choose NZ, use Change country → Australia, confirm the PDF and "Editable version" open the Australian files, reload, and try one new file URL in Incognito (expected: redirect to Cloudflare Access). The earlier Stage 11.0K download checks of all eight new files are still the owner's.
2. No entitlements exist; access is authentication only; no commercial or per-member access is claimed.
3. Git-triggered builds remain disabled and must stay so; the legacy Drive IDs remain in a public repository (optional hygiene stage).

## 5. Rollback
Not needed. If the signed-in check finds a problem: `npx wrangler rollback bde27561-cd8d-4984-bff5-a8bf8489709a`, then re-run the unauthenticated probes; the previous behaviour (including the hidden country control) would return.

## 6. Verdict
**PASS (deployed and verified to the limit of unauthenticated and local-uploaded-tree evidence); the owner's signed-in confirmation completes it.** Stopped. No further action without instruction.

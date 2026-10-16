# Stage 11.0J — Controlled Member Resource Library integration report

**Scope:** controlled staging integration only. Nothing deployed, no Worker change, no access or entitlement change, no database or schema change, no edit to the approved PDFs/DOCX, no change to Google Drive, no Resilience OS access. Previous reports are preserved. **Verdict: CONDITIONAL PASS (staged; deployment HELD).**

## A. Repository baseline
- **Application A, Member Resource Library:** repo `teorangapapakaianga-oss/offgrid056-member-library`, local `C:\dev\OffGrid056-System\offgrid056-member-library`; branch `main` (the established development branch; there is no separate one); baseline HEAD `709012b` (Stage 10.29-R). Live Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` at 100% (re-checked; unchanged).
- **Architecture:** static Next.js export; one protected record per resource (`private-assets/data-resources/*.private.json`, git-ignored) with `marketFiles` for NZ and AU; PDFs staged from `private-assets/resources`; the market is **member-chosen**, never inferred (`lib/member/market.ts`: no IP or geolocation); a market-specific resource has no default file, so there is no cross-market fallback. Access is Cloudflare Access on the whole hostname (authentication, not entitlement); there is no login, database or entitlement logic.
- **Register status found (not assumed):** OG-B13 and OG-B15 were on HOLD (Stage 10.29-R, commit `709012b`); OG-B01 and OG-B03 ARCHIVED; OG-B11 BLOCKED; 36 deployed; totals 36 · 0 · 0 · 2 · 2 · 1 · 4 · 0 = 45. These still applied.
- **Baseline tests:** 65 files, 1,756 tests, exit 0 (Stage 10.29-R).

## B. Package validation
Source: `OffGrid056_Stage11_0I_Final_Production_Package_v1.1(1).zip` (476,752 bytes, SHA-256 `3F765FE9…0CB6D`; byte-identical to the `v1.1.zip` in the same download area). Extracted to a scratch folder; nothing run from it. **11 of 11 files present** (4 DOCX, 4 PDF, 3 records). The three production records were read before any change. **All eight customer fingerprints match `VERSION_MANIFEST.md`:**

| File | SHA-256 | Match |
|---|---|---|
| OG-B13_NZ …Checklist.docx | `7299bc46…8a2d` | MATCH |
| OG-B13_NZ …Checklist.pdf | `7d6a858a…19f5` | MATCH |
| OG-B13_AU …Checklist.docx | `6ceb842a…6e83` | MATCH |
| OG-B13_AU …Checklist.pdf | `a5008efe…5f15` | MATCH |
| OG-B15_NZ …Service_Log.docx | `d115694b…4b4b` | MATCH |
| OG-B15_NZ …Service_Log.pdf | `c67a95c9…c3ab` | MATCH |
| OG-B15_AU …Service_Log.docx | `741db38f…ad80f` | MATCH |
| OG-B15_AU …Service_Log.pdf | `87053d8c…eeb8` | MATCH |

PDFs: A4, 4 pages (B13) and 5 pages (B15); NZ and AU are distinct files with cover identification "NEW ZEALAND EDITION" / "AUSTRALIA EDITION · VERSION 1.1". The package's own records say "PRODUCTION CANDIDATES — NOT RELEASED; awaiting Project Owner approval" (the approval is your Stage 11.0J instruction).

## C. Resource mapping
| Edition | Mapped to | Served as (market-chosen) | DOCX companion |
|---|---|---|---|
| OG-B13 NZ | `res-1513` Resilience Asset and Document Checklist | `/resources/resilience-asset-and-document-checklist.NZ.pdf` | master only |
| OG-B13 AU | `res-1513` | `…checklist.AU.pdf` | master only |
| OG-B15 NZ | `res-1515` Seasonal Review and Service Log | `/resources/seasonal-review-and-service-log.NZ.pdf` | master only |
| OG-B15 AU | `res-1515` | `…log.AU.pdf` | master only |

- **Existing versus new:** the legacy OG-B13 and OG-B15 never had IDs or records. `res-1513` / `res-1515` follow the Library's established OG-BNN → res-15NN mapping (also used by the audit tooling), were unused, and create no conflict, no migration and no change to any existing identifier. **These IDs, the classification (general / resilience-planning / planning; checklist and template; beginner; 45 minutes), the descriptions (the editions' own cover subtitles) and the related lists are my proposals and need your confirmation before deployment.**
- **Country/region approach:** the existing architecture covers this: one record per resource with NZ and AU files under `marketFiles`; the member picks a market (existing selector) and is shown only that edition; the PDFs identify the country on the cover. No new geographic system was added.
- **PDF/DOCX association:** the PDFs are the served assets. The DOCX files are **not served**: the record schema (`strict`) has one file per market and no companion field. They are kept verbatim, with original filenames, beside the original PDFs and the three production records in the git-ignored `private-assets/production-masters/stage-11-0i-v1.1`, with `ASSOCIATIONS.json` mapping each DOCX to its PDF, market and ID. Serving them needs a model extension (F.2).
- **Filenames:** the approved masters keep their exact names and bytes; the served PDFs use the Library's `<slug>.<MARKET>.pdf` naming, byte-identical (verified per file). Serving them under the package names would need a naming exception like the res-1002 one.
- **Register mapping:** OG-B13 and OG-B15 move HOLD → STAGED; the Stage 10.29-R HOLD definition and both HOLD records are preserved verbatim as history (quoted, not counted). New totals: **Deployed 36 · Staged 2 · Prepared 0 · Blocked 2 · HOLD 0 · Merged 1 · Archived 4 · Not started 0 = 45.** OG-B01, OG-B03, OG-B11 and all archived/blocked records are unchanged. *Mapping decision for you:* if you would rather keep the HOLD rows and add separate entries, it is a register-only change.

## D. Implementation
- **Added (git-ignored, not committed):** two protected records (SHA-256 `a67c571a…2618`, `580f2955…1340`), four staged PDFs (byte-identical), and the masters folder (11 package files + `ASSOCIATIONS.json`).
- **Added (committed):** `tests/unit/og-b13-b15-integration.test.ts` (6 tests) and this report.
- **Modified (committed):** the three registers; `docs/canonical-resource-index.{json,md}` (two STAGED entries and one new exception value `PDF_METADATA_TITLE_NOT_THE_RESOURCE_TITLE`); `admin-import/config/metadata-review.json` and `program-components.json` (entries and classification for OG-B13/OG-B15, no resource IDs inside); record-count and register-state assertions in 16 existing test files (36→38 records, staged 2, HOLD 0).
- **Preserved:** all 36 protected resources, IDs, routes, records, PDFs and the Worker; no application code, schema, constants, detector, route policy or `lib/related.ts` change; no Resilience OS change.
- **Staged build:** two clean builds identical (1,104 files). Versus the live baseline: 16 files added (the two resources' page files and four PDFs), 0 removed, 354 changed; **the visible text of all 159 HTML pages is identical to the live build except the Library, Downloads and My Progress listings**, as expected; all 97 earlier PDFs byte-identical; **76 protected PDFs** in the tree. Counts: **38 protected · 76 market files · Planning Tools 12 · Downloads 60 · My Progress 63 · 0 broken links**; 38 of 38 detail pages carry the exact "Approved resource in the protected OffGrid056 preview." tooltip, 0 Draft. The related-card engine with the real records in the pool changes **0 existing pages**, and each new page shows exactly its four curated cards (permanent test). No DOCX, master file or V1/legacy file is in the build.
- **Commit:** see the final message (branch `main`).

## E. Quality assurance
| # | Check | Result |
|---|---|---|
| 1 | All 11 ZIP deliverables accounted for | **PASS** |
| 2 | Eight customer hashes match the manifest | **PASS** (8/8) |
| 3 | NZ and AU editions distinguishable | **PASS** (separate market files and cover identification; member-chosen market) |
| 4 | B13/B15 display with the correct titles | **PASS with an exception:** the pages and records show the approved titles; the printed B15 cover reads "Seasonal Review & Annual Service Log" and B13 "Resilience Asset & Document Checklist" |
| 5 | PDF and DOCX correctly associated | **PASS** (masters + `ASSOCIATIONS.json`); DOCX not served |
| 6 | No duplicate or conflicting resource IDs/slugs | **PASS** (38 unique; 15NN unused before) |
| 7 | Existing protected resources unchanged | **PASS** (page text, PDFs, related cards, records) |
| 8 | Archived, blocked and HOLD history preserved | **PASS** (test-asserted) |
| 9 | Unauthorised users cannot reach protected content in the staged app | **NOT TESTED** for the staged app: it is a local static export with no authentication layer (protection exists only as Cloudflare Access on the deployed hostname, and nothing was deployed). Live site re-probed (3 unauthenticated requests, including the two new routes): HTTP 302 to Cloudflare Access, 0 unauthenticated 200; the new routes do not exist live |
| 10 | Tests, lint, typecheck | Full suite **66 files, 1,762 tests, exit 0**; lint exit 0 (0 errors); typecheck exit 0; `import:verify-prep` exit 0 |
| — | **`import:verify-build` (the Library's deployment gate)** | **FAIL for the four new PDFs (F.1).** Records 38 · market files 76 · broken links 0 |
| 11 | No production deployment | **PASS** (Worker unchanged) |
| 12 | No Resilience OS change | **PASS** (not opened) |

Also run read-only on the PDFs' extracted text with the Library's numeric detectors (no exemption, no change): B13: Bucket C 0, price 0 (the safety detector raises "batteries-and-electrical" on asset names); **B15: 5 Bucket C items, all cadence words ("Weekly", "Monthly", "Annual", "once a year") in review and service labels**; two sentences of the standing emergency wording trigger the survival detector. These detectors normally gate prepared copy; the owner-approved production files were not changed.

## F. Outstanding dependencies and exceptions (for the owner)
1. **Deployment gate fails (blocker).** `import:verify-build` enforces, for every protected PDF: (a) the PDF title must be "<resource title> — OffGrid056" (the new PDFs' embedded titles are a page heading such as "1. Start with a simple asset inventory"); (b) no resource code in the text (the pages print "OG-B13"/"OG-B15", and B15 refers to "OG-B13"); (c) NZ files must name 111 and "Civil Defence", AU files must name 000, 112 and "State Emergency Service", with no cross-contamination (B13 has no emergency block; B15 cites 111 / "Triple Zero (000)" without those agencies; the AU B15 lacks 112). I did **not** weaken the verifier or edit the PDFs. Options: (i) owner-approved, edition-specific verifier rules for these externally produced editions (a small, explicit Library change); or (ii) a new production pass with corrected PDF metadata and wording (outside this stage).
2. **DOCX companions cannot be served** without a Library model extension (a `companionFiles` field, UI and tests); proposed as a separate approved change.
3. **Titles:** the printed cover titles use "&", and B15 adds "Annual" ("Seasonal Review & Annual Service Log"); the Library titles follow your brief. Confirm or align.
4. **Printed legacy codes:** "OG-B13"/"OG-B15" appear in footers and in a cross-reference, which the Library otherwise avoids for members. B15's text refers to B13 records, so B13 should be deployed before or with B15.
5. **Detector items** above (B15 cadence labels, standing-wording survival hits): an owner decision; no exemption was added.
6. **Member access and delivery:** no change. Cloudflare Access is the only protection (authentication, not entitlement); access tiers and the entitlement contract remain undefined, and signed or per-member downloads do not exist (a separate dependency, not started).
7. **Metadata confirmation:** IDs `res-1513`/`res-1515`, estimated time, classification, descriptions, related lists.
8. **Production prerequisites:** F.1 and F.7, then a separate owner-approved deployment stage with the usual post-deploy checks (rollback target `d7480c93-75fb-4ca5-8b40-0383b9cacadf`).

## G. Release recommendation
**CONDITIONAL PASS.** The four approved editions are integrated into the non-public staging structure with byte-identical assets, correct NZ/AU separation, no effect on the 36 existing resources, and a green repository (tests, lint, typecheck). **Deployment is HELD** by the verify-build gate failure and the pending metadata confirmation.

**Exact next step (needs your decision, not executed):** answer F.1 (verifier-rules option (i) or a corrected-PDF pass (ii)) and confirm F.7; then authorise **Stage 11.0K — OG-B13 and OG-B15 controlled deployment + live verification**. No other development stage is started.

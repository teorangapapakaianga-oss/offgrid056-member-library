# Stage 11.0J — Complete Verification and Integration Report (final integration decisions applied)

**Scope:** controlled staging integration of the four owner-approved Stage 11.0I v1.1 editions. **Deployment: HOLD. No Stage 11.0K production deployment.** No Worker, Cloudflare Access, entitlement, live-content or Resilience OS change; none of the eight customer files (4 PDF, 4 DOCX) was edited or replaced. History: the first pass is in commit `1e96f5a`, the verification pass in `6550c70` (both superseded by this report); the concise decision record is `STAGE_11_0J_FINAL_DECISION_RECORD.md`. **Verdict: CONDITIONAL PASS: controlled integration complete and verified locally; authenticated member downloads are NOT TESTED and are not classified as PASS.**

## 1. Push of commit `6550c70` to `main`: implications and deployment-trigger status
- **Repository visibility:** `origin` is a **public** GitHub repository (an unauthenticated API request returns HTTP 200). The commits contain code, registers, tests and reports only. **No member PDF, DOCX, protected record or master file is tracked** (`private-assets/` and `workspace/` are git-ignored; 0 tracked files under `private-assets`; the only tracked file matching these resources is a test). The registers do contain the SHA-256 fingerprints, titles and, since Stage 10.29-R, the owner-supplied Google Drive file IDs of the OG-B13/OG-B15 legacy sources (`RESOURCE_REGISTER.md`). Drive IDs are identifiers, not credentials, but they are visible in a public repository and in git history: a repository-hygiene decision for you (no change made; history must be preserved).
- **Automatic deployment: none found in the repository.** No `.github` workflows or other CI configuration, no git hooks, no deploy script in `package.json`; `wrangler.jsonc` has no build or deploy trigger, and deployment is only the manual `npx wrangler deploy` of `out/`. **Behavioural evidence:** after both pushes (`1e96f5a` and `6550c70`) the live Worker is still `d7480c93-75fb-4ca5-8b40-0383b9cacadf` at 100%, with its original creation time, and the new routes redirect to Cloudflare Access without existing live. **Not verifiable from here:** a Cloudflare dashboard "Workers Builds" Git connection would live outside the repository; I cannot read it. Please confirm in the dashboard that no Git-triggered build is attached to this repository.

## 2. Owner decisions applied
1. **IDs** `res-1513` (OG-B13) and `res-1515` (OG-B15): conditionally approved; registry uniqueness verified (section 3); historical identity preserved (the OG-BNN → res-15NN mapping was already the programme's reserved scheme: `STAGE_9.5_REVIEW.md` and `admin-import/audit/programme.ts` and `programme-audit.test.ts` name res-1515 for OG-B15; no record for either legacy code ever existed in history).
2. **HOLD → STAGED** only: done in the three registers, the canonical index and the review config; the Stage 10.29-R HOLD record is preserved verbatim as history; no public access.
3. **Metadata:** approved cover titles kept; **no estimated time is invented**: the editions state none (0 mentions of minutes or hours in the four PDFs), so `estimatedTime` is omitted (section 5).
4. **DOCX companions:** the `companionFiles` design is implemented (section 6).
5. **Australian emergency verification:** Triple Zero (000) is the required number for B15 AU; 112 is not required; cross-country checks preserved (section 7).
6. **Dependency:** B13 and B15 are a **release set**, enforced by the verifier (section 8).
7. **Informational detector flags** reviewed and recorded without weakening a detector (section 9).

## 3. The exact four country-edition mappings (registry verified)
Registry checks (run, not assumed): 38 records have 38 unique ids, slugs, titles and legacy codes; the 76 market-file URLs are unique; `res-1513`/`res-1515` and both slugs collide with no private record, demo record, route-policy entry or canonical-index entry; 36 earlier records are untouched; each edition is a separate file selected by the member's chosen market (no default file, no cross-market fallback).

| ID | Code | Market | Display title | Package PDF (verbatim) | Served PDF | Package DOCX (verbatim) | Served DOCX (secondary "Editable version") |
|---|---|---|---|---|---|---|---|
| `res-1513` | OG-B13 | NZ | Resilience Asset & Document Checklist | `OG-B13_NZ_Resilience_Asset_and_Document_Checklist.pdf` | `/resources/resilience-asset-and-document-checklist.NZ.pdf` | `OG-B13_NZ_Resilience_Asset_and_Document_Checklist.docx` | `/resources/resilience-asset-and-document-checklist.NZ.docx` |
| `res-1513` | OG-B13 | AU | same | `OG-B13_AU_Resilience_Asset_and_Document_Checklist.pdf` | `…checklist.AU.pdf` | `OG-B13_AU_…Checklist.docx` | `…checklist.AU.docx` |
| `res-1515` | OG-B15 | NZ | Seasonal Review & Annual Service Log | `OG-B15_NZ_Seasonal_Review_and_Service_Log.pdf` | `/resources/seasonal-review-and-annual-service-log.NZ.pdf` | `OG-B15_NZ_Seasonal_Review_and_Service_Log.docx` | `…annual-service-log.NZ.docx` |
| `res-1515` | OG-B15 | AU | same | `OG-B15_AU_Seasonal_Review_and_Service_Log.pdf` | `…annual-service-log.AU.pdf` | `OG-B15_AU_…Service_Log.docx` | `…annual-service-log.AU.docx` |

SHA-256 (each equals the Stage 11.0I manifest; served bytes equal the package bytes): B13 NZ pdf `7d6a858a…19f5`, docx `7299bc46…8a2d`; B13 AU pdf `a5008efe…5f15`, docx `6ceb842a…6e83`; B15 NZ pdf `c67a95c9…c3ab`, docx `d115694b…4b4b`; B15 AU pdf `87053d8c…eeb8`, docx `741db38f…ad80f`. The originals (names and bytes) are kept verbatim in the git-ignored `private-assets/production-masters/stage-11-0i-v1.1`.

## 4. Final metadata for your review (exact values)
| Field | `res-1513` | `res-1515` |
|---|---|---|
| Title (printed cover) | Resilience Asset & Document Checklist | Seasonal Review & Annual Service Log |
| Slug | resilience-asset-and-document-checklist | seasonal-review-and-annual-service-log |
| Legacy code | OG-B13 | OG-B15 |
| Foundation / component / category | general / resilience-planning / planning | general / resilience-planning / planning |
| Resource type | checklist | template |
| Difficulty | beginner | beginner |
| Estimated time | **omitted** (stated by neither edition) | **omitted** |
| Collections / tags | none / none (Planning Tools: NO) | none / none |
| Status / publication / channel | draft / approved / private-preview | draft / approved / private-preview |
| Description (the edition's own cover subtitle, verbatim) | "A practical household tool for organising records, tracking resilience assets and preparing better questions for your insurer." | "A practical companion for keeping household resilience systems visible, assigned and maintained over time." |
| Related links, in order | res-1502 Household Contacts Sheet · res-1024 Professional Support Planner · res-1514 Local Support Network Planner · res-1515 Seasonal Review & Annual Service Log | res-1006 Emergency Readiness Checklist · res-1012 Pantry Rotation Tracker · res-1028 Household Responsibility Roster · res-1513 Resilience Asset & Document Checklist |
| Access tier / entitlement | UNDEFINED_OWNER_DECISION | same |
| recommendationEligible / handoff / route / contract | false / INACTIVE / null / NOT_APPROVED | same |

Four curated links on each page: the related-card engine fills nothing automatically; its real-record simulation changes 0 existing pages (permanent test).

## 5. Estimated time: optional, never invented (decision 3)
`estimatedTime` is now optional in the resource schema; the summary carries `null`. Every consumer is null-safe: the resource page and cards simply omit the time; list items and the recommendation/dashboard text join only what exists; the time filter matches no band for a resource with no time; "shortest first" sorts it last; learning-path totals are shown only when every step states a time. Files: `lib/content/schemas.ts`, `summaries.ts`, `format.ts` (`formatMinutesOrNull`), `lib/filters/index.ts`, `lib/progress/index.ts`, `app/resources/[slug]/page.tsx`, `app/learning-paths/page.tsx` and five components. **Evidence:** 9 tests in `companion-files.test.ts` (accepts none, rejects 0 and strings; null summary; no band; sort last); in the staged build the existing resource pages' markup is identical, and the two new pages show no time. Programme-day and learning-path pages differ only by React text-separator comments (visible text identical).

## 6. DOCX companion implementation and tests (decision 4)
- **Model:** optional `companionFiles` (per market, `DOCX` only, local `/…docx` path, SHA-256 required, optional size). Rejected by the schema: no `marketFiles`; a market without its own PDF; an external URL; a non-DOCX; a missing or malformed hash; another market code; the same file for two editions.
- **Presentation:** `components/resources/market-download.tsx` shows "Editable version" (Word document, size, country edition) as a secondary link under the chosen market's Open/Download buttons, via `lib/content/companions.ts` (`companionForMarket`: chosen market only, never a fallback, only where that market has its PDF).
- **Storage and access:** the DOCX is staged with the PDFs (`private-assets/resources`, git-ignored, copied only by `build:preview`) and served only inside the Cloudflare-Access-protected hostname; there is no public URL and no change to protection.
- **Verification (`import:verify-build`):** every companion must exist in the build, be a zip/docx, match its record SHA-256 and sit beside a PDF for the same market (`VB-COMPANION`); any `.docx` in the build that no record names fails (`VB-COMPANION-ORPHAN`). The record hashes equal the package manifest (test).
- **Tests:** `companion-files.test.ts` (schema, helper, manifest pinning), `verify-build-rules.test.ts` (companion pass, missing file, hash mismatch, non-zip, no-PDF, orphan, release set), integration test (records, bytes, masters, associations).
- **UI check in the browser pane** (local static copy of the staged build, which has no authentication layer): with the market unchosen, no file is offered (asks for a market); with New Zealand chosen, B15 shows the NZ PDF Open/Download and "Editable version" → `…annual-service-log.NZ.docx`; with Australia chosen, B13 shows the AU PDF and `…checklist.AU.docx`; an existing resource (Household Contacts Sheet) shows no editable link and still shows its time ("20 min").

## 7. PDF verifier: positive and negative tests (decision 5)
- **Positive:** the four real staged PDFs pass with their resource-scoped profiles (title from the Info dictionary; the printed resource codes; B15 requires its country's number: NZ 111, AU 000). No agency name and no 112 are required. `import:verify-build`: 76 market files ✓, "deployment build verified".
- **Negative (13 tests, all pass):** wrong or other-country title; unexpected resource codes; 000/112 in an NZ file; 111 in an AU file; "State Emergency Service" in an NZ file and "Civil Defence" in an AU file; B15 without its country's number, or with the other country's; an AU-numbered file labelled NZ; removed wording, unresolved tokens, error pages, unknown market; a different resource gets no relief; the default rules (no profile) still reject these editions; companion and release-set failures. The verifier's default behaviour for the 36 existing resources is unchanged.
- The cadence rule (`PLANNING_RHYTHM`) and its 4 tests are as in the verification report: planning review rhythms are not service intervals; technical cadence wording stays flagged.

## 8. B13 / B15 release set (decision 6)
`admin-import/config/verify-build-profiles.json` declares `releaseSets: [res-1513, res-1515]`. `import:verify-build` fails (`VB-RELEASE-SET`) if either is in a build without the other, and the content validator already fails any build where a related link points to a resource that is not there. Tested (both-present, neither-present, either-alone). Their records link to each other and B15's printed text names OG-B13, so a B15 link to an unavailable B13 cannot ship.

## 9. Informational detector flags: classification and reasoning (decision 7)
| Flag | Where | Classification | Reasoning |
|---|---|---|---|
| `batteries-and-electrical` topic | B13 NZ and AU (whole-document detector; needs three battery/solar/inverter words) | **LABEL ONLY / PLANNING PROMPT, informational** | Every mention sits in an asset-category list ("Energy — solar, batteries, generators, heating equipment, backup lighting") or an insurer question ("Do I need to specifically declare solar panels, battery storage, generators…"); none contains an install, wire, test, service or repair instruction (tested). The document's own scope panel excludes technical advice and policy interpretation. Detector unchanged: it still flags genuine technical wording (tested). |
| survival-family sentence flag | B15 AU only (two sentences) | **Standing immediate-danger direction, informational (a keyword hit on "life-threatening")** | "If there is fire, suspected gas or electrical danger…, do not investigate it for this worksheet" and "call Triple Zero (000)…". No duration, outcome or survival claim, no digits other than 000. The NZ wording does not trip it. Detector unchanged (a true survival-duration sentence is still flagged: tested). |
No exemption was added and no detector was relaxed for these flags.

## 10. Registry, regression and unchanged-resource evidence
- **Build/regression (actual runs):** two clean builds of the final code and records are identical (1,108 files). Against the live baseline (the deployed Stage 10.27D build, 1,088 files): 20 resource files added (the two resources' page files, four PDFs, four DOCX) besides the build-id and chunk files; **visible text of all 159 pages is identical except the Library, Downloads and My Progress listings; markup of every existing resource page is identical;** all 97 earlier PDFs are byte-identical; only the four recorded DOCX files exist in the build; no master or package file is in it. Counts: **38 protected · 76 market files · Planning Tools 12 · Downloads 60 · My Progress 63 · 0 broken links**; 38 of 38 detail pages carry the exact Preview tooltip; 0 Draft.
- **Application code changed in this stage (so JavaScript chunk names differ from the live build):** optional time (null-safe consumers), `companionFiles` schema/helper/component/validator, verifier module. This code ships with any future deployment; behaviour for existing resources is verified identical as above.
- **Registers:** Deployed 36 · Staged 2 (OG-B13, OG-B15) · Prepared 0 · Blocked 2 · HOLD 0 · Merged 1 · Archived 4 · Not started 0 = 45; OG-B01, OG-B03, OG-B11 and the archived/blocked entries unchanged; the HOLD record kept as history.

## 11. Security: performed and not performed
- **Performed:** unauthenticated live requests redirect to Cloudflare Access with no unauthenticated 200, and the new routes do not exist live; the Worker is unchanged after both pushes; no DOCX/PDF/master is tracked in the public repository; build output contains no unrecorded editable file; market gating tests; the verifier's SHA-256 pinning of PDFs (record) and DOCX; no cross-market fallback in the UI.
- **NOT TESTED (and not classified as PASS):** authenticated member downloads of the new PDFs and DOCX files; Cloudflare Access on the new routes (not deployed); any entitlement behaviour (no entitlements exist); any authentication test of the staged site (a local static export with no authentication layer; the local browser check proves UI behaviour only). Production authentication is not validated by any local test and this report does not claim it.

## 12. Checks
Full suite **69 files, 1,791 tests, exit 0**; lint exit 0 (0 errors; warnings only); typecheck exit 0; `import:verify-prep` exit 0; `import:verify-build` exit 0 (38 records · 76 market files · 0 broken links; the four new files ✓). Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` confirmed at 100%.

## 13. Commit and affected files
Commit: see the final message (branch `main`). Affected: `lib/content/{schemas,summaries}.ts`, new `lib/content/companions.ts`, `lib/{format.ts,filters/index.ts,progress/index.ts}`, `app/resources/[slug]/page.tsx`, `app/learning-paths/page.tsx`, `components/{member/dashboard,resources/market-download,resources/resource-card,resources/resource-list-item,resources/recommended-next,resources/learning-path-views}.tsx`, `tools/validate-content.ts`, `admin-import/pilot/{verify-build.mts,verify-build-rules.ts}`, `admin-import/config/{verify-build-profiles.json,metadata-review.json}`, the canonical index (json and md), the three registers, tests (`companion-files`, `verify-build-rules`, `og-b13-b15-integration`, `library`), this report and the decision record. Git-ignored (not committed): the two records, eight staged files (4 PDF, 4 DOCX), the masters folder.

## 14. Remaining blockers and decisions before Stage 11.0K
1. **Authenticated-download test:** none exists; it can only be done after a separately approved deployment with an owner session. (Cannot be pre-validated locally.)
2. Your **final review** of section 4 (classification, descriptions, related links). The editions state no time, so none is shown unless you supply one.
3. Confirm in the Cloudflare dashboard that **no Git-triggered build** is attached to the repository (section 1).
4. Decide on the **Drive IDs in the public repository** (hygiene stage; history is preserved).
5. The printed pages carry the resource codes OG-B13/OG-B15 (owner-approved); no action unless you want them removed in a new production pass.
6. **Separate owner approval** for Stage 11.0K; rollback target would be `d7480c93-75fb-4ca5-8b40-0383b9cacadf`; B13 and B15 must deploy together.

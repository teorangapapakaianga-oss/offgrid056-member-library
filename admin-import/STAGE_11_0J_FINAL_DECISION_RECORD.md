# Stage 11.0J — Final decision record (concise)

Full evidence: `STAGE_11_0J_INTEGRATION_REPORT.md`. **Status: controlled integration complete and verified locally. Deployment HOLD. Stage 11.0K not authorised.**

| Item | Decision / result |
|---|---|
| IDs | `res-1513` (OG-B13), `res-1515` (OG-B15): conditionally approved; registry uniqueness verified (38 unique ids, slugs, titles; 76 unique market-file URLs; no demo, route-policy or index collision); the OG-BNN → res-15NN scheme already reserved them |
| Register status | OG-B13 and OG-B15: HOLD → STAGED (history preserved); totals 36 deployed · 2 staged · 2 blocked · 1 merged · 4 archived · 0 hold · 0 not started = 45 |
| Titles | Printed cover titles: "Resilience Asset & Document Checklist", "Seasonal Review & Annual Service Log" (B15 slug aligned: `seasonal-review-and-annual-service-log` → `…-annual-service-log`) |
| Classification | general / resilience-planning / planning; B13 checklist, B15 template; beginner; no collection |
| Estimated time | **Omitted** (no invented value); `estimatedTime` made optional, all consumers null-safe |
| Descriptions | The editions' own cover subtitles, verbatim |
| Related (B13) | res-1502, res-1024, res-1514, res-1515 |
| Related (B15) | res-1006, res-1012, res-1028, res-1513 |
| Four mappings | B13 NZ / AU → `res-1513`; B15 NZ / AU → `res-1515`; one record each, member-chosen market, no fallback; package filenames kept verbatim in the masters folder, served as `<slug>.<MARKET>.pdf` / `.docx` |
| DOCX companions | `companionFiles` implemented: one DOCX per market, secondary "Editable version", SHA-256 pinned to the package manifest, served only inside the protected hostname, verified by `import:verify-build` (exists, zip, hash, beside its PDF, no unrecorded .docx) |
| PDF verifier | Info-dictionary title (bug fixed); resource-scoped profiles for res-1513/res-1515 only; B15 NZ requires 111, B15 AU requires 000 (112 not required); no agency name required; cross-country checks kept; 13 verifier tests (positive and negative) |
| Cadence detector | Weekly / Monthly / Annual review-rhythm labels are planning rhythms (D), unless the sentence prescribes technical work; technical cadence wording still flagged; 4 tests |
| Informational flags | B13 "batteries-and-electrical": label-level asset list and insurer question (tested); B15 AU "survival" flag: standing immediate-danger direction, no duration or outcome claim (tested). No detector weakened |
| Dependency | B13 and B15 are a release set: the verifier fails if either is built without the other (tested) |
| Original resources | 36 protected resources unchanged: existing resource pages' markup identical, all 97 earlier PDFs byte-identical, visible text identical except the Library, Downloads and My Progress listings; no record, route, access or entitlement change |
| Build and tests | Two clean builds identical (1,108 files); counts 38 protected / 76 market files / Planning Tools 12 / Downloads 60 / My Progress 63 / 0 broken links; 69 files, 1,791 tests pass; lint 0 errors; typecheck 0; `import:verify-prep` and `import:verify-build` exit 0 |
| Deployment trigger | Public GitHub repository; no CI, hook or deploy script found; Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` unchanged after both pushes. A dashboard-level Git build cannot be seen from here: owner to confirm |
| Security | Performed: unauthenticated live probes (302 to Cloudflare Access, 0 unauthenticated 200); no master or editable file tracked; no unrecorded editable file in the build. **NOT TESTED:** authenticated member downloads, Cloudflare Access on the new routes, entitlements, authentication of the staged site |

**Remaining blockers to Stage 11.0K:** (1) separate owner approval; (2) owner's final review of the metadata above; (3) dashboard confirmation that no Git-triggered build exists; (4) authenticated-download verification, possible only after an approved deployment with an owner session; (5) optional: Drive IDs in the public repository (hygiene stage).

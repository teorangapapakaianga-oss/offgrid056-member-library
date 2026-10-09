# Stage 10.10 — OG-14 Water, Food and Air Household Snapshot deployed

**Date:** 9 October 2026 · **Deployed on the owner's explicit approval.** The exact Stage 10.09B validated staged build was deployed, not rebuilt. No content was rewritten, no PDF re-rendered, no metadata altered, the curated-related rule was not changed, and Cloudflare Access was not touched. The next legacy-resource audit was not started.

## Deployment
| | |
|---|---|
| Result | **Success.** `og056-preview` and its triggers deployed (`wrangler deploy`, exit 0; 602 assets uploaded, 430 already present). |
| New Worker ID | `61f3bcf8-c4df-4d52-a060-b760bfbabc26` (100%) |
| Immediate rollback | `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` (the Stage 10.05 deployment) |
| Older versions retained | `e1b31486-afbe-4849-9702-a54e51114717` → `8834be25-0110-4355-94a5-93b9943f792d` → `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` → `2fb0663d-a7da-4acf-ba4c-957886b21631` → `65437c37-b731-4851-b67e-5b0fae79fe12` → `89333107-7c0a-4bdb-8229-f2b5241a9e05` → `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | `out/` from the Stage 10.09B rebuild: byte-identical (1,032 of 1,032) to the second validated staged rebuild and identical to the first after build-id normalisation; clean working tree at `79cff19`; both PDF hashes verified immediately before upload; a snapshot of the uploaded tree was taken first. |
| LIVE now | **29 protected resources · 58 market files · 1,032 files · 0 broken links · Bucket C 0** |
| Staged | none |

To roll back, point the Worker at `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28`. Access protects every page, so content was verified on the snapshot of the exact tree uploaded, and the deployment itself was verified from Cloudflare (the active deployment is the new version at 100%) and by unauthenticated probe.

## Live PDFs
| | SHA-256 (verified before upload and again on the uploaded tree) |
|---|---|
| NZ | `5e7bbc1f2463339276bc860e434efb2a0e1f15585c0700003f2d401962d15438` |
| AU | `143b064e9d118ac874db820fa7b166114b923659d55b18621e95f12b2712310e` |

Both: 8 pages, portrait 612 × 792, title "Water, Food and Air Household Snapshot — OffGrid056"; no OG-14, res-1014, Week, Day, programme, Pillars, survival, Mini-Plan, score, target, budget, tier, smoke alarm, CO or filtration wording; emergency-contact box on page 2 and general-disclaimer on the last page, no other technical block; NZ has 111 and NZ tradesperson wording only, AU has 000 and 112 and AU wording only; NZ and AU body copy identical (2,962 characters). **Other PDFs:** the 81 previously live PDFs (56 protected, 25 demo) are byte-identical; exactly two PDFs were added; 58 protected PDFs are now live.

## OG-14 live route and related resources
`/resources/water-food-air-household-snapshot/`: title and the approved description visible; metadata Worksheet · General · Beginner · 20 min · Planning · Draft; no visible OG-14 or res-1014; library and downloads list it; both PDFs linked. Related resources: exactly **Water Storage Calculator, 30-Day Pantry Builder, Healthy Home Air Audit, Priority Lock Worksheet**, all "Linked by us"; **no automatic fill** (no 3-Tier Budget Planner, no demo 30-Day Action Planner, no 90-Day Roadmap, no other card).

## Curated-related rule, live impact
Exactly four existing live pages changed their Related cards, and only by removing automatic demo cards: Priority Lock Worksheet (demo 30-Day Action Planner); Off-Grid System Architecture Planner (demo 30-Day Action Planner); Home Energy & Shelter Upgrade Plan (demo Heating Options Explained, demo Home Weatherproofing Guide); Resilient Heating & Insulation Upgrade Checklist (demo Insulation Planning Worksheet, demo Heating Options Explained). **6 cards removed on live pages (8 including OG-14's own two, which were never live), 0 cards added, 0 explicit links lost, 0 demo pages changed.** The 20 files behind those removals are the five files of each of the four pages and nothing else.

## Deployed tree
- Against the validated Stage 10.09B staged tree: **exact match** (1,032 of 1,032 raw, build id included), 0 changed.
- Against the previous live tree (Stage 10.05): 1,024 → 1,032 files; **8 added** (the six route files and the two PDFs), **0 removed**, **314 changed**, 710 identical. Every changed file is attributed by the structural comparison: 24 listing and payload files (home, library, downloads, progress, saved and the root payloads), 7 counter files, 290 resource-page payloads each carrying the new resource, and the 20 curated-rule files above. **0 unexplained.**
- `/foundations`, `/start-here`, `/planning-tools`, `/programme`, `/workshops`, `/learning-paths`, `/packs`, `/videos`, `/suppliers` and `/brand`: 0 changed or added files.
- The stylesheet is byte-identical (`04x21r3261sq4.css`, sha256 `2aea7654…cc3b`); the 23 JavaScript chunks are byte-identical (no `.js` or `.css` drift). The related-resource change is data and output only.

## Detectors (live, 29 resources / 58 market files, hardened rules)
Storage-duration unresolved **0**; outcome-claim **0**; target-label (forward and reverse) **0**; assurance **0**; survival-duration, supply-duration, emergency-period, multiplier and comparative-performance **0**; price findings 0 (58 files scanned); 446 numeric candidates; content flags 4 (already-live OG-09 AU and OG-13 NZ, unchanged); market, safety and legacy-language scans unchanged; **Bucket C 0.** No exemption was added.

## Access (unauthenticated)
30 routes probed, **30 redirected (302) to Cloudflare Access, 0 answered 200**: the library, the OG-14 route and its NZ and AU PDFs, the four changed live pages, Start Here, Planning Tools, programme and day 14 (both route forms) and day 23, the demo Household Resilience Guide and a separated demo route, an unknown protected route, the home page, downloads, Five Foundations and Food, saved, progress, other protected PDFs, a data path, a chunk path and `robots.txt`. Access settings were not touched.

## Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 29 / 58; nothing staged; OG-14 `res-1014` deployed; 0 broken links; Worker `61f3bcf8…`; rollback `b7091068…`; **Deployed 29 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 14 = 45**; next action = the next legacy-resource audit, on the owner's instruction. Historical notes are untouched.

## Validation
`npm run lint` **0** (0 errors; warnings only in git-ignored workspace scripts); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 51 files, **1,365 tests** (the related-resource, protected/demo separation, route-policy, built-output, register, target-label, reverse-target, assurance, storage-duration, numeric and content-flag suites are all inside the run; the targeted run of those suites alone: 10 files, 0 failures); `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 29 · market files 58 · broken internal links 0).

## Not changed
Cloudflare Access, `route-policy.json`, programme routing (day 14 stays the demo `res-0003`), Start Here, Planning Tools, the demo resources, the detectors, the curated-related rule and every other live resource. The Not started list (14) is: OG-23, OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15.

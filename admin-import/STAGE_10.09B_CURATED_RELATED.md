# Stage 10.09B — curated-related rule and OG-14 re-staging

**Staged, NOT deployed.** OG-14 stays staged as `res-1014` / `water-food-air-household-snapshot`. LIVE and STAGED are reported separately.

| | LIVE (deployed, unchanged) | STAGED (private-assets build, not deployed) |
|---|---|---|
| Protected resources | **28** | **29** |
| Market files | **56** | **58** |
| Broken internal links | 0 | 0 |
| Worker | `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` (100%) | n/a |
| Immediate rollback | `e1b31486-afbe-4849-9702-a54e51114717` | n/a |

## 1. The rule (owner ruling, Stage 10.09A)
"If a protected resource has four or more explicit owner-approved related links, show only those explicit links and do not append automatic same-topic fills."
Implemented in **`lib/related.ts`** (`relatedResources`): after the explicit links are collected, a resource that is not a demonstration resource (`isPlaceholder` false or absent) and has `CURATED_RELATED_MIN` (4) or more resolved explicit links returns exactly those links, in the order written, capped at the existing limit of six. It then appends no same-topic, learning-path, shared-tag or same-foundation card. Nothing else in the file changed: a demonstration resource, and any resource with fewer than four explicit links, run the unchanged fill logic. The resource page already passes the full resource, so no page code changed. No resource is named. The wider "protected pages show no demo fills" rule was **not** implemented.

## 2. Tests (`tests/unit/related-curated.test.ts`, 12 new tests; no existing test changed or loosened)
Four, five and six explicit links return exactly those links, in order, with no fill; no same-topic, learning-path, tag or foundation card is appended even where each would qualify; the explicit order is the order written; an unknown or self link does not count towards four; three explicit links keep the automatic fills up to six (existing behaviour), and so do zero, one and two; a demonstration resource with four or five explicit links keeps its fills; seven explicit links still show six; no self link and no repeated link.

## 3. Impact (measured on the rebuilt staged build)
| | |
|---|---|
| Pages whose Related cards changed | **5**: Priority Lock Worksheet, Off-Grid System Architecture Planner, Home Energy & Shelter Upgrade Plan, Resilient Heating & Insulation Upgrade Checklist (live), and Water, Food and Air Household Snapshot (staged) |
| Cards removed | **8**, all automatic |
| Cards added | **0** |
| Explicit links lost | **0** |
| Demo pages changed | **0** |

Exact removals: Priority Lock Worksheet: demo 30-Day Action Planner. Off-Grid System Architecture Planner: demo 30-Day Action Planner. Home Energy & Shelter Upgrade Plan: demo Heating Options Explained and demo Home Weatherproofing Guide. Resilient Heating & Insulation Upgrade Checklist: demo Insulation Planning Worksheet and demo Heating Options Explained. Water, Food and Air Household Snapshot: 3-Tier Budget Planner and demo 30-Day Action Planner. OG-14 now shows exactly Water Storage Calculator, 30-Day Pantry Builder, Healthy Home Air Audit and Priority Lock Worksheet, all "Linked by us", with no automatic card. Ranking outside the stop rule is unchanged (the rule only truncates; no card is refilled). A pre-implementation simulation that reproduced all 59 built Related lists exactly predicted the same five pages and eight cards.

## 4. Build regression
Two rebuilds are identical (1,032 of 1,032 after normalisation); `import:verify-build` exit 0: **records 29 · market files 58 · broken internal links 0**.
- **New staged build against the previous Stage 10.09 staged build:** 0 added, 0 removed, **25 changed, 1,007 identical.** The 25 are the five files of each of the five pages above (`index.html`, `index.txt`, the two `__PAGE__` payloads and `__next._full.txt`), and nothing else. 8 Related cards removed, 0 added, 0 explicit links lost, **0 unexplained.**
- **New staged build against the deployed live tree:** 8 added (the OG-14 route's six files and its two PDFs, as in Stage 10.09), 0 removed, 314 changed (unchanged from Stage 10.09: 24 listing and payload files, 290 resource-page payloads, each carrying the new resource), 710 identical. The four live pages' extra differences are exactly the six demo cards above (20 files, four pages) and nothing else; the structural attribution reports no other unexplained file.

## 5. OG-14 assets
No PDF was re-rendered or re-staged. The staged PDFs in the rebuilt output are byte-identical to the approved hashes: NZ `5e7bbc1f2463339276bc860e434efb2a0e1f15585c0700003f2d401962d15438`, AU `143b064e9d118ac874db820fa7b166114b923659d55b18621e95f12b2712310e`. All 81 existing PDFs (56 protected, 25 demo) are byte-identical and exactly two were added.

## 6. CSS and JavaScript
The stylesheet is byte-identical (`04x21r3261sq4.css`); the 23 JavaScript chunk names are identical, and no `.js` or `.css` file is among the 25 changed files. `lib/related.ts` is only reached on the server for the resource pages, so no client chunk changed. **No CSS or JavaScript change.**

## 7. Detectors (separately)
| Dataset | Resources / files | Numeric candidates | Bucket C | Target-label (forward and reverse) | Assurance | Storage | Outcome | Price | Content flags |
|---|---|---|---|---|---|---|---|---|---|
| **TRUE LIVE** | 28 / 56 | 444 | **0** | 0 | 0 | 0 | 0 | 0 | 4 |
| **STAGED** | 29 / 58 | 446 | **0** | 0 | 0 | 0 | 0 | 0 | 4 |

The hardened-rule scan finds 0 hits. No exemption was added; no detector changed.

## 8. Routing and separation
Unchanged and verified: `route-policy.json` (no diff), programme routes (day 7 `res-0008`, day 14 `res-0003`, day 23 `res-0023`), demo routes and `demo-*` separation, Start Here, Planning Tools, `/foundations` (no changed file), the OG-14 route, downloads, and the NZ and AU PDFs. `res-1014` is inserted into no other page's Related list. Cloudflare Access and the Worker are untouched.

## 9. Registers and migration state
Narrative only; no count changed. `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 28 / 56; staged 29 / 58; OG-14 `res-1014` STAGED; 0 broken links; Worker `b7091068…`; rollback `e1b31486…`; **Deployed 28 · Staged 1 (OG-14) · Prepared 0 · Blocked 1 · Merged 1 · Not started 14 = 45**; next action = explicit owner approval to deploy OG-14 (after the Stage 10.09B QA). The four live pages that will change on deployment are named in the Stage 10.09B note. Historical notes are untouched.

## 10. Validation
`npm run lint` **0** (0 errors; warnings only in git-ignored workspace scripts); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 51 files, **1,364 tests** (1,352 + 12 new; the related-resource, separation, route-policy, built-output, register, target-label, reverse-target, assurance, storage-duration, numeric and content-flag suites are all inside the run); `npm run import:verify-prep` and `npm run import:verify-build` results are in the stage summary (records 29, market files 58, broken links 0).

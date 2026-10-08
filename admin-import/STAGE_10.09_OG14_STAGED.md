# Stage 10.09 — OG-14 staging and register gate

**Staged, NOT deployed.** LIVE and STAGED are reported separately throughout.

| | LIVE (deployed, unchanged) | STAGED (private-assets build, not deployed) |
|---|---|---|
| Protected resources | **28** | **29** |
| Market files | **56** | **58** |
| Broken internal links | 0 | 0 |
| Worker | `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` (100%) | n/a |
| Immediate rollback | `e1b31486-afbe-4849-9702-a54e51114717` | n/a |

## 1. Assignment and record
- ID **res-1014** (owner-assigned in this stage), slug **water-food-air-household-snapshot**, title **Water, Food and Air Household Snapshot**.
- general / resilience-planning / planning / worksheet / beginner / 20 minutes / draft / collections none; the approved description, exactly.
- Related, in order: `res-1008` Water Storage Calculator, `res-1011` 30-Day Pantry Builder, `res-1013` Healthy Home Air Audit, `res-1007` Priority Lock Worksheet. Not added: `res-1012`, `res-1003`, `res-1026`.
- Record: `private-assets/data-resources/water-food-air-household-snapshot.private.json` (sha256 `e2f5a4ecb709f2cf73199521bbbc7706420bf1fe3812c80c8a65cb0ad92221dd`).
- `res-1014` and `OG-14` do not appear in the PDF titles, the resource title, the member-facing copy or the visible page text, and the review config does not contain the ID. The ID is internal routing and data only. The staging script refused to write unless every locked value matched the review config, the four related titles matched, and each source PDF matched its approved hash.

## 2. Approved PDFs
| | Path | SHA-256 | Result |
|---|---|---|---|
| NZ | `private-assets/resources/water-food-air-household-snapshot.NZ.pdf` | `5e7bbc1f2463339276bc860e434efb2a0e1f15585c0700003f2d401962d15438` | equals the Stage 10.08 hash; 240,067 bytes |
| AU | `private-assets/resources/water-food-air-household-snapshot.AU.pdf` | `143b064e9d118ac874db820fa7b166114b923659d55b18621e95f12b2712310e` | equals the Stage 10.08 hash; 239,757 bytes |

Both are 8 pages, portrait, 612 × 792, titled "Water, Food and Air Household Snapshot — OffGrid056", carrying only the emergency-contact and general-disclaimer blocks. The prepared files were named with the prep slug (`water-food-and-air-household-snapshot`); they were copied byte-for-byte to the owner's staged slug. Nothing was re-rendered.

## 3. Collision check (before staging)
`res-1014` unused; slug `water-food-air-household-snapshot` and `demo-water-food-air-household-snapshot` unused in the protected records, the 30 demo resources, the programme, the code, the data and `route-policy.json`: **no collision.** `supersedes` in `route-policy.json` stays empty. No route-policy exception was added; the file is unchanged.

## 4. Demo and programme separation
Programme day 14 stays `res-0003` (demo Household Resilience Guide); day 7 stays `res-0008`; day 23 stays `res-0023`. No programme route is replaced, no demo resource is superseded and no supersedes relationship exists. The demo placeholder pages (`demo-*`, `household-resilience-guide`, `food-resilience-guide`, `pantry-rotation-worksheet`) keep their own routes.

## 5. Staged build
`npm run build:preview` ×2 exit 0, `import:verify-build` exit 0: **records 29 · market files 58 · broken internal links 0.** Compared with a build of the same tree before the three OG-14 files existed (the baseline), and that baseline was itself identical to the deployed Stage 10.05 tree (1,024 of 1,024 after build-id normalisation):
- **Added files (exact 8):** `resources/water-food-air-household-snapshot/{index.html, index.txt, __next._full.txt, __next._tree.txt, __next.resources.$d$slug.__PAGE__.txt, __next.resources/$d$slug/__PAGE__.txt}` and `resources/water-food-air-household-snapshot.NZ.pdf` / `.AU.pdf`, plus the new build-id folder `_next/static/<build id>/` (3 manifest files). Nothing was removed.
- **Added to private-assets (exact 3):** the record and the two PDFs (85 → 88 files); every other private file is unchanged.
- **Changed text files (314), every one attributed, 0 unexplained, 0 displaced entries:** 24 listing and payload files carry the new card or counters (home, library, downloads, progress, saved and the root payloads); 290 are the resource-page payloads (58 pages × 5 files), each carrying the new resource in its full resource list.
- **Untouched (0 changed or added files):** `/foundations` (index, every foundation and every category page), `/start-here`, `/planning-tools`, `/programme`, `/workshops`, `/learning-paths`, `/packs`, `/videos`, `/suppliers`, `/brand`.
- Reproducibility: two staged builds are identical (1,032 of 1,032 after normalisation).

## 6. Listing and category changes (exact)
A general-foundation resource has no foundation or category page, so **no foundation, category or Food page changes** and no foundation count changes. The visible changes: **Library** gains one card (Water, Food and Air Household Snapshot, link `/resources/water-food-air-household-snapshot/`); **Downloads** gains one entry: "All downloads" 50 → 51, "Worksheets" 12 → 13, files 50 → 51; **My Progress** "of 53 resources completed" → 54. Saved and Home show no visible change. Start Here and Planning Tools are unchanged (collections none); there is no automatic placement in either.

## 7. Same-topic suggestions
`res-1014` is inserted into **0** other resources' same-topic lists (0 protected pages, 0 demo pages); **0 displaced entries**, no protected entry displaced; the ranking and segregation code is untouched (`app/`, `lib/`, `components/`, `data/`, `public/` have no diff).
**Owner-visible finding:** the new page's own Related section shows the four approved "Linked by us" cards in the approved order, then two algorithmic "Same topic" fills from the existing algorithm: the **3-Tier Budget Planner** (res-1026) and the demo **30-Day Action Planner** (general / planning peers). This is the existing six-card behaviour (OG-07's page shows the same demo 30-Day Action Planner); it is not a related link and it was not changed. The 3-Tier Budget Planner is not added to the owner's related list.

## 8. PDF regression
All 81 PDFs in the baseline build (56 protected and 25 demo) are byte-identical in the staged build; exactly two PDFs were added, with the approved hashes. No existing protected PDF and no unrelated private asset changed.

## 9. Detector and claim QA (separately)
| Dataset | Resources / files | Numeric candidates | Bucket C | Price | Survival | Supply | Emergency-period | Storage | Target-label (forward and reverse) | Multiplier | Comparative | Outcome | Assurance | Content flags |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **A. TRUE LIVE** | 28 / 56 | 444 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |
| **B. STAGED** | 29 / 58 | 446 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |

OG-14 adds only non-claim candidates (the live title "30-Day Pantry Builder", twice). Market, safety and legacy-language scans: nothing in OG-14 (the programme labels, "000" separators and AU-in-NZ items are in already-live resources, identical in A and B). No exemption.

## 10. CSS and JavaScript
The staged stylesheet is byte-identical to the baseline and to the deployed one (`04x21r3261sq4.css`, sha256 `2aea7654…cc3b`); no rule added or removed. The 23 JavaScript chunk names are identical, and no `.js` or `.css` file is among the 314 changed files (the only changes under `_next/static` are the 3 manifest files of the new build id). **No CSS rule change, no JavaScript change.** The OG-14 layout rules live only in the prepared PDF HTML.

## 11. Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 28 / 56; staged 29 / 58; OG-14 `res-1014` STAGED; 0 broken links; Worker `b7091068…`; rollback `e1b31486…`; **Deployed 28 · Staged 1 (OG-14) · Prepared 0 · Blocked 1 (OG-16) · Merged / No standalone resource 1 (OG-05) · Not started 14 = 45**; next action = explicit owner approval to deploy OG-14. The OG-14 row left the Not started list. Historical notes are untouched; the legacy metadata drift is recorded, not rewritten. The register, OG-05, OG-06, OG-07, OG-12, OG-14 and classification tests were updated to the staged counts; no detector or check was loosened.

## 12. Validation (actual exit codes)
`npm run lint` **0** (0 errors, 28 warnings, all in git-ignored workspace scripts); `npx tsc --noEmit` **0**; `npx vitest run` **0**: 50 files, **1,352 tests** (the target-label, reverse-target, assurance, storage-duration, numeric, content-flag, built-output, register, route-separation and demo/protected separation suites are all inside the full run; the targeted detector, numeric, register and draft suites alone: 281 tests, exit 0; built-output and route-separation: 36 tests, exit 0); `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 29 · market files 58 · broken internal links 0 on the staged `out/`). An earlier lint run failed (exit 1) only because two scratch `.cjs` scripts in the git-ignored `workspace/` used `require`; they were deleted and lint is clean.

## 13. Not changed
Cloudflare Access, the Worker, `route-policy.json`, Start Here, Planning Tools, programme routing, the demo resources, every other live resource and the detectors. No deployment occurred.

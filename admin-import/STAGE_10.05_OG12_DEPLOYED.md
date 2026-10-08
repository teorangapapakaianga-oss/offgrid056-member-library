# Stage 10.05 — OG-12 Pantry Rotation Tracker deployed

**Date:** 9 October 2026 · **Deployed on the owner's explicit approval.** The exact Stage 10.04 validated staged build was deployed. No content was rewritten, no PDF re-rendered, no taxonomy or `route-policy.json` change, and Cloudflare Access was not touched. The next legacy-resource audit was not started.

## Deployment
| | |
|---|---|
| Result | **Success.** `og056-preview` and its triggers deployed. |
| New Worker ID | `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` (100%) |
| Immediate rollback | `e1b31486-afbe-4849-9702-a54e51114717` (the Stage 10.02B deployment) |
| Older versions retained | `8834be25-0110-4355-94a5-93b9943f792d` → `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` → `2fb0663d-a7da-4acf-ba4c-957886b21631` → `65437c37-b731-4851-b67e-5b0fae79fe12` → `89333107-7c0a-4bdb-8229-f2b5241a9e05` → `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | a snapshot identical to the Stage 10.04 staged tree (1,024 of 1,024 files); both PDF hashes verified before upload |
| LIVE now | **28 protected resources · 56 market files · 1,024 files · 0 broken links · Bucket C 0** |
| Staged | none |

To roll back, point the Worker at `e1b31486-afbe-4849-9702-a54e51114717`. Access protects every page, so content was verified on the snapshot of the exact tree uploaded.

## Live PDFs (res-1012, slug pantry-rotation-tracker)
| | SHA-256 | Result |
|---|---|---|
| NZ | `a27e0cc0f068b6494816fae21d0e0fcc901411c0505ad664eea35a8bfcce45a7` | equals the approved hash |
| AU | `78b8ddf99a118c59a321b876e73dfde721010566333f84ca1c7fcf5048b70458` | equals the approved hash |

Both: 7 pages, portrait 612 × 792, title "Pantry Rotation Tracker — OffGrid056"; the rotation sentence is present once; six tracker columns and no Exp. Date column; emergency-contact box on page 2, general disclaimer and the food-safety-power-cut block on the last page, no other technical block; NZ has 111 and no AU wording, AU has 000 and 112 and no NZ wording. No visible res-1012, OG-12, Day or Week wording, no shelf-life table, no 30-day-supply, 3-month or unsupported outcome claims.

## PDF regression
The 54 previously live protected PDFs and the 25 demo PDFs (79) are byte-identical; exactly two PDFs were added (56 protected); 0 existing PDFs changed.

## Deployed tree
- Against the validated Stage 10.04 staged tree: **exact match** (1,024 of 1,024).
- Against the previous live tree (Stage 10.02B): **8 added** (the route's six files and the two PDFs, plus the new build-id folder), **0 removed**, 324 changed, 692 identical. Every changed file is attributed: listing and payload pages that carry the new card, resource-page payloads that carry the new resource in the full resource list, size/counter files, and the Food foundation pages (verified separately). **0 unexplained.**
- The stylesheet is byte-identical (`04x21r3261sq4.css`); the same 23 JavaScript chunks.

## Foundations
Food count 5 → 6. The Food foundation page and the Food Storage category page each gain exactly one Pantry Rotation Tracker card (link `/resources/pantry-rotation-tracker/`). No other count or category changed. In the payloads the only resource object added is `res-1012`; the remaining hunks are Next.js row renumbering.

## Navigation and relationships
Start Here and Planning Tools are unchanged (collections none). Programme day 23 is still the demo `res-0023`; `res-0022`, `res-0023`, `demo-pantry-basics-recording` and the four `demo-*` routes remain; nothing is superseded. Same-topic suggestions: exactly 5 lists contain res-1012 (protected: 30-Day Pantry Builder; demo: Food Resilience Guide, Pantry Rotation Worksheet, Safe Preserving Basics, Seasonal Growing Planner); 0 entries displaced, ranking unchanged. Related links on the resource: 30-Day Pantry Builder, then Emergency Readiness Checklist.

## Detectors (live, 28 resources / 56 market files, hardened rules)
444 numeric candidates, **Bucket C 0**; storage-duration unresolved 0; outcome-claim unresolved 0; survival-duration, supply-duration, emergency-period, multiplier and comparative-performance 0; price findings 0; hardened-rule scan hits 0; content flags 4 (already-live OG-09 AU and OG-13 NZ, unchanged). No exemption added.

## Access (unauthenticated)
30 routes probed, **30 redirected to Cloudflare Access, 0 answered 200.** Access settings were not touched.

## Validation (actual exit codes)
`npm run lint` **0** (0 errors, 27 existing warnings); `npx tsc --noEmit` **0**; `npm run import:verify-prep` **0**; `npm run import:verify-build` **0** (records 28 · market files 56 · broken internal links 0); `npx vitest run` **0** (48 files, **1,204 tests** passed). Earlier runs hit one intermittent 5000 ms timeout under load (the whole-library test in `numeric.test.ts`, then `importer.test.ts`); each passed on rerun and no timeout was changed.

## Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 28 / 56; nothing staged; OG-12 `res-1012` deployed; 0 broken links; Worker `b7091068…`; rollback `e1b31486…`; **Deployed 28 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 15 = 45**; next action = the next legacy-resource audit, on the owner's instruction. Historical notes are untouched.

## Not changed
Cloudflare Access, `route-policy.json`, Start Here, Planning Tools, programme routing, the demo resources, every other live resource, and the detectors. The Not started list (15) is unchanged: OG-14, OG-23, OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15.

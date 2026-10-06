# Stage 9.66 — OG-B09 deployed as protected resource #22

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Deployed to the private preview behind Cloudflare Access. Status `draft`. Public/demo content untouched. The 21-resource classification task was NOT executed.**

## 1. Staged assets (new files only)

| File | Bytes |
|---|---|
| `private-assets/data-resources/resilient-heating-and-insulation-upgrade-checklist.private.json` | the record |
| `private-assets/resources/resilient-heating-and-insulation-upgrade-checklist.NZ.pdf` | 383,976 (byte-identical to the approved NZ PDF) |
| `private-assets/resources/resilient-heating-and-insulation-upgrade-checklist.AU.pdf` | 381,236 (byte-identical to the approved AU PDF) |

`private-assets/` went from 64 to 67 files. The original 64 were hashed before staging and again after build and deploy: **0 changed**. A copy of the pre-deploy set is kept at `workspace/backups/private-assets-fa23ec74`.

## 2. Protected resource #22

`res-1509` · OG-B09 · **Resilient Heating & Insulation Upgrade Checklist** · foundation `shelter` · **programComponent `resilience-planning`** · category `insulation` · type `checklist` · difficulty `beginner` · 30 minutes · tags `[]` · status **`draft`** · NZ and AU market files (no default file) · related: res-1015 Warm Home Scorecard, res-1017 Solid Fuel Heating Planner, res-1019 Battery Backup Planner, res-1021 Home Energy & Shelter Upgrade Plan.

Safety blocks, exactly: `general-disclaimer`, `emergency-contact`, `gas-and-lpg-general`, `solid-fuel-heating`, `batteries-and-electrical`. No additional gas block; none suppressed.

## 3. Deploy

| | |
|---|---|
| Pre-deploy gates | lint, typecheck, 637 tests, `import:verify-prep`, `build:preview`, `import:verify-build` (22 records · 44 market files · 0 broken internal links) — all green |
| Command | `wrangler deploy` (562 assets, 396 already uploaded) |
| **New Worker version** | **`db2fd12a-955e-47c4-b3c9-d174e3da85d8`** |
| **Rollback retained** | **`fa23ec74-85d2-4d91-b484-3f037ccbe38b`** (the 21-resource version) — still in the deployment history; previous: `1922f7ba-a0b3-4a7b-ba01-593b3df6a160` (20 resources). The rollback is **not** removed. |

## 4. Post-deploy QA

What can and cannot be checked from here: the preview sits behind Cloudflare Access, so an unauthenticated request cannot read pages. The checks therefore run on (a) the exact build that was uploaded (`out/`), and (b) the live Access gate.

| Check | Result |
|---|---|
| Appears in the protected library and shelter / insulation listing | ✓ (build) |
| Resource count | ✓ **22 records** |
| NZ download | ✓ the NZ PDF in the build is byte-identical to the approved file and opens (8 pages) |
| AU download | ✓ same (8 pages) |
| Correct market gets the correct PDF | ✓ record has `marketFiles` NZ → `.NZ.pdf`, AU → `.AU.pdf`, **no default file**; NZ PDF: 111, "Heat pump", "your council"; AU PDF: 000, "Reverse-cycle air conditioner (heat pump)" once |
| Cross-market leakage | ✓ none: no 000 / reverse-cycle in NZ; no 111 / "New Zealand" in AU |
| Metadata | ✓ title, shelter, insulation, checklist, beginner, 30 min, draft |
| `programComponent = resilience-planning` | ✓ in the deployed record |
| Related-resource links | ✓ the four ids are in the page data and the four routes exist in the build (warm-home-scorecard, solid-fuel-heating-planner, battery-backup-planner, home-energy-and-shelter-upgrade-plan) |
| No broken route / missing asset | ✓ verify-build: 0 broken internal links; all market files read back |
| Access gate (live) | ✓ the new page, both PDFs, the listings, an existing resource page and a non-existent route all answer **302 to the Cloudflare Access login** — nothing answered 200 without a login |
| Public/demo untouched | ✓ git working tree had no change to any tracked file during the build or deploy (demo and public sources untouched) |
| Unrelated private resources | ✓ the original 64 private files byte-identical before and after |
| Not verifiable from here | the **authenticated** page as a signed-in member sees it (Access blocks scripted requests). The page and PDFs were verified in the build that was uploaded |

## 5. Full regression

lint clean · typecheck clean · **637 tests passing** · `import:verify-prep` all verified · `import:verify-build` verified · **Bucket C = 0** · 0 price findings · 0 safety-removal findings · 0 content flags · 0 market problems.

**Counts.** Protected resources **22 / 22**; market files **44 / 44**; prepared set 22 ready. The one number that differs from a 21-resource run is "gas requirements = 2": those are OG-B09's own `gas-and-lpg-general` in NZ and AU (its "Flued gas" row) — the intended single gas block. No live resource gained or lost a gas requirement.

## 6. Scheduled, not executed

`classify-the-21-live-resources` stays scheduled for the next normal deployment. The exemption list (`deployedBeforeClassification`, 21 codes) is unchanged; OG-B09 is not on it because it carries its component.

## 7. Next recommended migration target

**OG-01 Home Resilience Scorecard** (proposed `resilience-planning`). Evidence from the detector sweep of the 23 unmigrated resources: no prices, no percentages, no gas, no solid-fuel, no water-treatment; its two required safety topics (electrical and fire) are answered by blocks already approved and live. It is the programme's entry scorecard and the natural companion to OG-02, OG-13 and OG-15. Do a claims-first audit first, as for OG-B09. Runner-up: **OG-04 Property Profile Matrix** (no prices or percentages; electrical only). Avoid for now: OG-03 and OG-B03 (heavy programme-tier prices), OG-16 (grants: prices and per-market eligibility), OG-B15 (maintenance intervals plus five safety topics).

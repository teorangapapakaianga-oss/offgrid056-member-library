# Stage 9.93 — OG-06 staging and register gate

**Staged, NOT deployed.** LIVE and STAGED are reported separately throughout.

| | LIVE (deployed, unchanged) | STAGED (private-assets build, not deployed) |
|---|---|---|
| Protected resources | **25** | **26** |
| Market files | **50** | **52** |
| Broken internal links | 0 | 0 |
| Worker | `2fb0663d-a7da-4acf-ba4c-957886b21631` (100%) | n/a |
| Immediate rollback | `65437c37-b731-4851-b67e-5b0fae79fe12` | n/a |

## 1. Count clarification (the Stage 9.92 "26 resources" scan)
The Stage 9.92 line "433 candidates across 26 resources" came from `workspace/numeric-scan.mts`, which scans every folder in `workspace/prep/`: the 25 live resources **plus the unstaged OG-06 prep resource**. It was LIVE + PREP, not the live library, and Stage 9.92 should have said so. It is relabelled here.

True live-only scan (the 25 protected records in `private-assets` before staging, OG-06 excluded): **25 resources · 50 market files · 431 candidates · Bucket C 0.**
Before staging, `private-assets` held 25 records and 50 PDFs. The live library has 25 resources, so there was no unexpected state and staging went ahead.

## 2. Assignment and record
- ID **res-1006** (owner-assigned in this stage), slug **emergency-readiness-checklist**, title **Emergency Readiness Checklist**.
- general / resilience-emergency / planning / checklist / beginner / 20 minutes / draft / collections none; the approved description, exactly.
- Related, in order: res-1002 Household Risk Identifier, res-1004 Property Type Review, res-1008 Water Storage Calculator, res-1011 30-Day Pantry Builder, res-1013 Healthy Home Air Audit, res-1019 Battery Backup Planner. res-1015 is not added.
- Record: `private-assets/data-resources/emergency-readiness-checklist.private.json` (sha256 `4c979efd068cd5db94d60207c5c8dd8f613087315888b6d8a06e7247d8fac214`).
- `res-1006` and `OG-06` do not appear in the PDF title, the visible resource title, the member-facing copy or the visible page text. The ID is internal routing and data only. The review config does not contain `res-1006` either.
- The conceptual journey OG-01 → OG-02 → OG-06 → OG-04 → OG-22 → OG-03 → OG-26 → OG-27 is documentation only (registers and review config); no other resource's links changed.

## 3. Approved PDFs
| | Path | SHA-256 | Result |
|---|---|---|---|
| NZ | `private-assets/resources/emergency-readiness-checklist.NZ.pdf` | `6a892f0dcb8afba650418f381d97c6440bc8a5e2c22097cfd71af7ae1b98b171` | equals the Stage 9.92 hash; 251,985 bytes |
| AU | `private-assets/resources/emergency-readiness-checklist.AU.pdf` | `dd0cf256810ffde0cc5c1a09ec5e934699ea2c890b0f3b2d6f4295a2358f6aba` | equals the Stage 9.92 hash; 251,778 bytes |

Both are 8 pages, portrait, 612 × 792, titled "Emergency Readiness Checklist — OffGrid056". The staging script refused to copy unless each source matched its approved hash. Nothing was re-rendered.

## 4. Route check (before the route was created)
`workspace/route-check.mjs` searched 55 demo and protected resource records, the programme, learning-path and collection data, the app and lib code, and `route-policy.json` for `res-1006`, the slug and `demo-` + slug. **No collision.** No route-policy exception was added; `route-policy.json` is unchanged. OG-06 has no demo counterpart; programme day 6 still points at `res-0011`; nothing is superseded or separated.

## 5. Staged build
`npm run build:preview` exit 0, `import:verify-build` exit 0: **records 26 · market files 52 · broken internal links 0.**
The build was compared with a build of the same tree with the three OG-06 files held out (the live-equivalent; 25 / 50), and a second staged rebuild was identical to the first (0 differences):
- **Added files (exact):** `resources/emergency-readiness-checklist/{index.html, index.txt, __next._full.txt, __next._tree.txt, __next.resources.$d$slug.__PAGE__.txt, __next.resources/$d$slug/__PAGE__.txt}` and `resources/emergency-readiness-checklist.NZ.pdf` / `.AU.pdf`, plus the new build-id folder `_next/static/<build id>/` (3 manifest files), which is a build artefact.
- **Added to private-assets (exact 3):** the record and the two PDFs; every one of the other 76 files in `private-assets` is byte-identical to before.
- **Changed pages (307):** only listing and related-suggestion payloads that now include the new resource card (library, downloads, home, progress, saved and every resource page's "same topic" suggestions). The sample diffs show the only insertion is the res-1006 card.
- **Untouched (0 changed or added files):** `/programme` (including day 6), `/start-here`, `/planning-tools`, `/workshops`, `/foundations`, `/learning-paths`, `/packs`, `/videos`, `/suppliers`, `/brand`.
- Resource route, both PDF links, six related links in the approved order (no res-1015), library and downloads listing, and the demo-separated routes (`demo-home-resilience-scorecard`, `demo-water-storage-calculator`, `demo-rainwater-harvesting-planner`, `demo-healthy-home-air-audit`) are all verified.
- Planning Tools: unchanged (7 protected resources); the new resource has `collections: []`. Start Here: unchanged (OG-01 and OG-02 only).

## 6. PDF regression
Of the 50 live-equivalent market PDFs in the build, all 50 are byte-identical to the staged build's copies. Exactly two PDFs were added. No existing protected PDF and no unrelated private asset changed.

## 7. Detector and claim QA
| Dataset | Resources / files | Numeric candidates | Bucket C | Price claims | Survival/supply/emergency-period candidates |
|---|---|---|---|---|---|
| **A. TRUE LIVE** | 25 / 50 | 431 | **0** | 0 | 0 |
| **B. STAGED** | 26 / 52 | 433 | **0** | 0 | 0 |

The delta is OG-06's two candidates (one non-claim "30-Day" in a resource name per market). Content flags are 4 in both A and B, all in already-live OG-09 (AU) and OG-13 (NZ); OG-06 adds 0. Market scan: no NZ wording in any AU file and no AU wording in OG-06's NZ file. The only "000" in the live set is the thousands separator in OG-10 and OG-B08. Legacy-language: OG-06 has 0 hits; the programme labels "Day 3", "Week 1" and "Week 5" appear only inside already-live resources (OG-B10, OG-27, OG-02, OG-B04), identical in A and B. Safety: OG-06 carries only the emergency-contact and general-disclaimer blocks, and the rendered text raises no topic. The OG-06 PDFs passed the full Stage 9.92 PDF QA (28 checks per market).

## 8. Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` all state: live 25 / 50; staged 26 / 52; OG-06 = `res-1006`, STAGED; 0 broken links; **Deployed 25 · Staged 1 · Prepared 0 · Blocked 1 (OG-16) · Merged / No standalone 1 (OG-05) · Not started 17 = 45**; Worker `2fb0663d…`; rollback `65437c37…`; next action = explicit owner approval to deploy OG-06. Historical stage notes are untouched. Register tests, the OG-05 disposition test, the classification test and the OG-06 draft test were updated to the new counts (the changes reflect the staged state; no detector or check was loosened).

## 9. Not changed
Cloudflare Access, the Worker, `route-policy.json`, Start Here, Planning Tools, programme day 6, demo resources and every other live resource. No deployment occurred.

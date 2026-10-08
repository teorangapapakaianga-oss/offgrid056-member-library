# Stage 9.99 — OG-07 staging and register gate

**Staged, NOT deployed.** LIVE and STAGED are reported separately throughout.

| | LIVE (deployed, unchanged) | STAGED (private-assets build, not deployed) |
|---|---|---|
| Protected resources | **26** | **27** |
| Market files | **52** | **54** |
| Broken internal links | 0 | 0 |
| Worker | `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` (100%) | n/a |
| Immediate rollback | `2fb0663d-a7da-4acf-ba4c-957886b21631` | n/a |

## 1. Assignment and record
- ID **res-1007** (owner-assigned in this stage), slug **priority-lock-worksheet**, title **Priority Lock Worksheet**.
- general / planning-implementation / planning / worksheet / beginner / 15 minutes / draft / collections none; the approved description, exactly.
- Related, in order: res-1001 Home Resilience Scorecard, res-1002 Household Risk Identifier, res-1003 Household Spending Capacity Check, res-1026 3-Tier Budget Planner, res-1027 90-Day Implementation Roadmap. Not res-1004 or res-1006.
- Record: `private-assets/data-resources/priority-lock-worksheet.private.json` (sha256 `72a0d4b6e1302e84e455dd9f4b385a3e294f952ef526c57e00f85914b1918310`).
- `res-1007` and `OG-07` do not appear in the PDF title, the visible resource title, the member-facing copy or the visible page text, and the review config does not contain `res-1007`. The ID is internal routing and data only.
- The conceptual journey OG-01 → OG-02 → OG-06 → OG-04 → OG-22 → OG-03 → OG-07 → OG-26 → OG-27 is documentation only (registers and review config); no other resource's links changed.

## 2. Approved PDFs
| | Path | SHA-256 | Result |
|---|---|---|---|
| NZ | `private-assets/resources/priority-lock-worksheet.NZ.pdf` | `9480a6e2e7eb58223ed1ac8aee3a3a38b1850baa12f34884fa04c2799c5ac7f5` | equals the Stage 9.98 hash; 236,655 bytes |
| AU | `private-assets/resources/priority-lock-worksheet.AU.pdf` | `71bbc930ad86912eaece09e247ab47f7d74b8fa77d5ad7f163bbaabd77614ced` | equals the Stage 9.98 hash; 236,422 bytes |

Both are 8 pages, portrait, 612 × 792, titled "Priority Lock Worksheet — OffGrid056". The staging script refused to copy unless each source matched its approved hash. Nothing was re-rendered.

## 3. Route check (before staging)
Searched the 55 demo and protected resource records, the programme, learning-path and collection data, the app and lib code, and `route-policy.json` for `res-1007`, the slug and `demo-` + slug: **no collision.** No route-policy exception was added; `route-policy.json` is unchanged. OG-07 has no demo counterpart. Programme day 7 still points at the demo `res-0008`; `res-0006` and `res-0008` are untouched; nothing is superseded or separated.

## 4. Staged build
`npm run build:preview` exit 0 and `import:verify-build` exit 0: **records 27 · market files 54 · broken internal links 0.** Compared with a build of the same tree with the three OG-07 files held out (the baseline), and the baseline was itself identical to the deployed Stage 9.95 tree (1,008 of 1,008 after build-id normalisation):
- **Added files (exact):** `resources/priority-lock-worksheet/{index.html, index.txt, __next._full.txt, __next._tree.txt, __next.resources.$d$slug.__PAGE__.txt, __next.resources/$d$slug/__PAGE__.txt}` and `resources/priority-lock-worksheet.NZ.pdf` / `.AU.pdf`, plus the new build-id folder `_next/static/<build id>/` (3 manifest files). Nothing was removed.
- **Added to private-assets (exact 3):** the record and the two PDFs; the other 79 files in `private-assets` are byte-identical to before.
- **Changed pages (304):** structural attribution of every changed file, no sampling: **24 listing/payload pages (A)**, **280 resource-page payloads (D)** and **7 files with +1 counters (B)**; the 8 added files are direct OG-07 output (E); **0 unexplained**. The 280 resource-page files are the 56 resource pages' five payload files each: the only change is that the new resource appears in the full resource list carried by each page, and nothing else on those pages moves.
- **Untouched (0 changed or added files):** `/programme` (including day 7), `/start-here`, `/planning-tools`, `/workshops`, `/foundations`, `/learning-paths`, `/packs`, `/videos`, `/suppliers`, `/brand`.
- Resource route, both PDF links, the five related links in the approved order (no res-1004, no res-1006), library and downloads listing, and the demo-separated routes are verified.
- Planning Tools: unchanged (the new resource has `collections: []`). Start Here: unchanged (OG-01 and OG-02 only).
- Reproducibility: two staged rebuilds are identical (1,016 of 1,016 after normalisation); the second also equals the current `out/`.

## 5. Same-topic suggestions (specific check)
`res-1007` is **inserted into no same-topic list on any page**. The related list on all 56 resource pages that have one is identical to the baseline: **0 insertions, 0 protected pages, 0 demo pages, 0 displaced entries, no protected entry displaced.** (Stage 9.95 showed `res-1006` entering the capped six-item lists; `res-1007` ranks below the entries already there, so the capped lists are unchanged.) The ranking and segregation code was not touched (`app/`, `lib/`, `components/`, `data/` have no diff).

## 6. PDF regression
All 77 PDFs in the baseline build (the 52 live protected PDFs and 25 demo PDFs) are byte-identical in the staged build; exactly two PDFs were added, with the approved hashes. No existing protected PDF and no unrelated private asset changed.

## 7. Detector and claim QA (separately)
| Dataset | Resources / files | Numeric candidates | Bucket C | Price | Survival | Supply | Emergency-period | Multiplier | Comparative | Content flags |
|---|---|---|---|---|---|---|---|---|---|---|
| **A. TRUE LIVE** | 26 / 52 | 433 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 4 |
| **B. STAGED** | 27 / 54 | 435 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 4 |

The delta is OG-07's two non-claim candidates ("90-Day" in a resource title, one per market). The 4 content flags are in already-live OG-09 (AU) and OG-13 (NZ). Market, safety and legacy-language scans: nothing in OG-07 (the programme labels and "000" thousands separators found elsewhere are in already-live resources, identical in A and B). The OG-07 PDFs passed the Stage 9.98 PDF QA (29 checks per market).

## 8. CSS and build noise
The staged stylesheet is byte-identical to the baseline and to the deployed one (`04x21r3261sq4.css`, sha256 `2aea7654…cc3b`); the 23 JavaScript chunk names are identical. **No new or removed rule, no JavaScript change.** The only new `_next/static` content is the build-id folder.

## 9. Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 26 / 52; staged 27 / 54; OG-07 `res-1007` STAGED; 0 broken links; **Deployed 26 · Staged 1 · Prepared 0 · Blocked 1 (OG-16) · Merged / No standalone 1 (OG-05) · Not started 16 = 45**; Worker `5d88271b…`; rollback `2fb0663d…`; next action = explicit owner approval to deploy OG-07. Historical notes are untouched. The register, OG-05, OG-06, OG-07 and classification tests were updated to the staged counts; no detector or check was loosened.

## 10. Not changed
Cloudflare Access, the Worker, `route-policy.json`, Start Here, Planning Tools, programme day 7, the demo resources and every other live resource. No deployment occurred.

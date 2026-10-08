# Stage 10.04 — OG-12 staging and register gate

**Staged, NOT deployed.** LIVE and STAGED are reported separately throughout.

| | LIVE (deployed, unchanged) | STAGED (private-assets build, not deployed) |
|---|---|---|
| Protected resources | **27** | **28** |
| Market files | **54** | **56** |
| Broken internal links | 0 | 0 |
| Worker | `e1b31486-afbe-4849-9702-a54e51114717` (100%) | n/a |
| Immediate rollback | `8834be25-0110-4355-94a5-93b9943f792d` | n/a |

## 1. Assignment and record
- ID **res-1012** (owner-assigned in this stage), slug **pantry-rotation-tracker**, title **Pantry Rotation Tracker**.
- food / resilience-emergency / food-storage / template / beginner / 15 minutes / draft / collections none; the approved description, exactly.
- Related, in order: `res-1011` 30-Day Pantry Builder, `res-1006` Emergency Readiness Checklist.
- Record: `private-assets/data-resources/pantry-rotation-tracker.private.json` (sha256 `67ad248c73cd1e4a8b26e4ba51064fba518db02ec389b5c31a3f706436f862e8`).
- `res-1012` and `OG-12` do not appear in the PDF title, the visible resource title, the member-facing copy or the visible page text, and the review config's own OG-12 entry does not contain the ID. The ID is internal routing and data only.
- Journey (documentation only): the Food pathway, OG-11 → OG-12. No other resource's links changed.

## 2. Approved PDFs
| | Path | SHA-256 | Result |
|---|---|---|---|
| NZ | `private-assets/resources/pantry-rotation-tracker.NZ.pdf` | `a27e0cc0f068b6494816fae21d0e0fcc901411c0505ad664eea35a8bfcce45a7` | equals the Stage 10.03 hash; 225,951 bytes |
| AU | `private-assets/resources/pantry-rotation-tracker.AU.pdf` | `78b8ddf99a118c59a321b876e73dfde721010566333f84ca1c7fcf5048b70458` | equals the Stage 10.03 hash; 224,934 bytes |

Both are 7 pages, portrait, 612 × 792, titled "Pantry Rotation Tracker — OffGrid056", carrying the emergency-contact, general-disclaimer and food-safety-power-cut blocks. The staging script refused to copy unless each source matched its approved hash. Nothing was re-rendered.

## 3. Route check and demo counterpart
Searched the 55 demo and protected resource records, the programme, learning-path and collection data, the app and lib code, and `route-policy.json` for `res-1012`, the slug and `demo-` + slug: **no collision.** No route-policy exception was added; `route-policy.json` is unchanged.
**Demo counterpart:** `res-0023` **Pantry Rotation Worksheet** (food / food-storage / worksheet, placeholder, no collection, slug `pantry-rotation-worksheet`) is the same concept. It is referenced by programme day 23, the demo workshop `demo-pantry-basics-recording` and the demo Food Resilience Guide (`res-0022`'s related list). All of those are untouched, programme routing is unchanged, nothing is superseded or separated, and the demo page keeps its own route. `res-0022` is related and also untouched.

## 4. Staged build
`npm run build:preview` ×2 exit 0, `import:verify-build` exit 0: **records 28 · market files 56 · broken internal links 0.** Compared with a build of the same tree with the three OG-12 files held out (the baseline), and the baseline itself was identical to the deployed Stage 10.02B tree (1,016 of 1,016 after build-id normalisation):
- **Added files (exact):** `resources/pantry-rotation-tracker/{index.html, index.txt, __next._full.txt, __next._tree.txt, __next.resources.$d$slug.__PAGE__.txt, __next.resources/$d$slug/__PAGE__.txt}` and `resources/pantry-rotation-tracker.NZ.pdf` / `.AU.pdf`, plus the new build-id folder `_next/static/<build id>/` (3 manifest files). Nothing was removed.
- **Added to private-assets (exact 3):** the record and the two PDFs; the other 82 files are byte-identical to before.
- **Changed text files (324):** every one attributed. 39 listing and payload pages carry the new card (library, downloads, home, saved, progress, and others); 285 resource-page payload files carry the new resource in each page's full resource list; 8 are the added files; 17 also carry +1 counters. The 12 files the structural method could not decompose are **Food-foundation pages**, verified separately below.
- **New, expected for a Food resource: the foundation pages.** Fifteen `/foundations/` files changed (the foundations index, the Food page, the Food Storage category page, each as html and payloads). Visible text and links, before and after: the **Food Storage category page and the Food foundation page each gain exactly one card** (Pantry Rotation Tracker, link `/resources/pantry-rotation-tracker/`), and the foundations index shows the Food count **5 → 6 resources**; nothing else changes visibly. In the payloads the only resource object added is `res-1012` and no other resource object or human-readable string differs (the remaining hunks are Next.js row renumbering). The Five Foundations overview page text is unchanged. Earlier stages touched no foundation page because their resources were General, so this is the first staging where `/foundations` legitimately changes.
- **Untouched (0 changed or added files):** `/programme`, `/start-here`, `/planning-tools`, `/workshops`, `/learning-paths`, `/packs`, `/videos`, `/suppliers`, `/brand`.
- Resource route, both PDF links, the two related links in the approved order (30-Day Pantry Builder, then Emergency Readiness Checklist), library and downloads listing and the demo-separated routes are verified. Planning Tools unchanged (the new resource has `collections: []`); Start Here unchanged.
- Reproducibility: two staged rebuilds are identical (1,024 of 1,024 after normalisation); the second equals the current `out/`.

## 5. Same-topic suggestions (specific check)
`res-1012` is inserted into **5** same-topic lists, all in the Food area: **1 protected page** (the 30-Day Pantry Builder) and **4 demo placeholder pages** (Food Resilience Guide, Pantry Rotation Worksheet, Safe Preserving Basics, Seasonal Growing Planner). Every list grew (four to five on three pages, five to six on two); **0 displaced entries, no protected entry displaced**, and surviving items keep their order. The ranking and segregation code is untouched (`app/`, `lib/`, `components/`, `data/` have no diff).

## 6. PDF regression
All 79 PDFs in the baseline build (the 54 live protected PDFs and 25 demo PDFs) are byte-identical in the staged build; exactly two PDFs were added, with the approved hashes. No existing protected PDF and no unrelated private asset changed.

## 7. Detector and claim QA (separately)
| Dataset | Resources / files | Numeric candidates | Bucket C | Price | Survival | Supply | Emergency-period | Storage-duration | Multiplier | Comparative | Outcome | Content flags |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **A. TRUE LIVE** | 27 / 54 | 433 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |
| **B. STAGED** | 28 / 56 | 444 | **0** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |

OG-12 adds non-claim candidates only (the resource title "30-Day Pantry Builder", "monthly", and the block-owned food-safety figures). The 4 content flags are in already-live OG-09 (AU) and OG-13 (NZ). Market, safety and legacy-language scans: nothing in OG-12 (the programme labels and "000" separators elsewhere are in already-live resources, identical in A and B). The OG-12 PDFs passed the Stage 10.03 PDF QA (33 checks per market). The hardened rules scan every prepared file: 0 storage-duration, 0 outcome findings. No exemption.

## 8. CSS and build noise
The staged stylesheet is byte-identical to the baseline and to the deployed one (`04x21r3261sq4.css`, sha256 `2aea7654…cc3b`); the 23 JavaScript chunk names are identical. **No new or removed rule, no JavaScript change.**

## 9. Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 27 / 54; staged 28 / 56; OG-12 `res-1012` STAGED; 0 broken links; **Deployed 27 · Staged 1 · Prepared 0 · Blocked 1 (OG-16) · Merged / No standalone 1 (OG-05) · Not started 15 = 45**; Worker `e1b31486…`; rollback `8834be25…`; next action = explicit owner approval to deploy OG-12. Historical notes are untouched. The register, OG-05, OG-06, OG-07, OG-12 and classification tests were updated to the staged counts; no detector or check was loosened.

## 10. Not changed
Cloudflare Access, the Worker, `route-policy.json`, Start Here, Planning Tools, programme routing, the demo resources and every other live resource. No deployment occurred.

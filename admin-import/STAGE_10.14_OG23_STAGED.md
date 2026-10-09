# Stage 10.14 — OG-23 Supplier Comparison Worksheet assigned `res-1023` and STAGED (not deployed)

**Staged only. NOT deployed.** The live Worker is unchanged. The protected record and the two approved Stage 10.13A PDFs are in `private-assets`; the staged build was produced and validated; nothing was uploaded.

LIVE (unchanged): **29 protected resources · 58 market files · 0 broken links** · Worker `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · rollback `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28`.
STAGED build: **30 protected resources · 60 market files · 0 broken links**.

## 1. Assignment
| | |
|---|---|
| Legacy code | OG-23 |
| Assigned ID | `res-1023` (no collision with any record, legacy ID, demo ID or route) |
| Slug / route | `supplier-comparison-worksheet` → `/resources/supplier-comparison-worksheet/` (no collision; no demo or protected route uses it; `route-policy.json` unchanged, nothing superseded) |
| Staged record | `private-assets/data-resources/supplier-comparison-worksheet.private.json` |
| Metadata | general / planning-implementation / planning / worksheet; beginner; 30 minutes; draft; collections `["planning-tools"]`; completion available; published date 2026-10-09 |
| Description | "A practical worksheet to help you prepare questions for suppliers and installers, record their answers side by side and note anything that needs a closer look before you decide." |
| Safety blocks | emergency-contact and general-disclaimer only |
| Related (exactly four, in order) | Resilience Product Wishlist `res-1022`, Project Support Brief Template `res-1025`, 3-Tier Budget Planner `res-1026`, 90-Day Implementation Roadmap `res-1027` |

## 2. Staged PDFs (byte-identical to the owner-approved Stage 10.13A renders)
| Market | Path | SHA-256 | Bytes |
|---|---|---|---|
| NZ | `private-assets/resources/supplier-comparison-worksheet.NZ.pdf` | `5178e066ae34c8636a6a250402c6d7bcee6c2c1761fe90e731e711284b0df3db` | 2,655,802 |
| AU | `private-assets/resources/supplier-comparison-worksheet.AU.pdf` | `5d1658a8ae051adad950a000d05081fbf8ee3f6977332fc9fc6e427e5748f1bc` | 2,655,603 |

The staging script refuses to overwrite and re-verifies both hashes after copying. Both builds contain exactly these two new PDFs; the 58 earlier protected PDFs (56 + the OG-14 pair) and the 25 demo PDFs (83 files in all) are **byte-identical** to the live tree.

## 3. Builds
Two staged builds were produced from the same inputs and are identical (reproducible). The baseline build (the live inputs with no OG-23) equals the deployed tree (1,032 files identical). Staged versus live: **8 files added** (the six route files under `resources/supplier-comparison-worksheet/` and the NZ and AU PDFs), **0 removed**, 324 changed, 708 identical; changes attributed A (resource data and listings) 29, B 12, C 0, D (resource-page payloads) 295, E 8; **0 unattributed, 0 unexplained, 0 displaced**. The stylesheet (`04x21r3261sq4.css`) is byte-identical and all 23 JavaScript chunks keep their names (no `.js` or `.css` drift). The only new build-id folder content is the three build manifests.

## 4. Listings (before → after, from the staged build against the live-equivalent baseline)
| Page | Change |
|---|---|
| Library (`/library/`) | one new card (title, description, Save button, link `/resources/supplier-comparison-worksheet/`); no other text change |
| Downloads | All downloads **51 → 52** (files 51 → 52); Worksheets **13 → 14**; one new row linking the resource; other type counts unchanged |
| My Progress | resources **54 → 55**; nothing else |
| Planning Tools | distinct resource cards **8 → 9** (the new resource added; live stays at 8 until deployed); Planning Tools in the staged build lists it |
| Saved, Dashboard, Foundations, Start Here, Programme | **no change** |
| Foundation pages | none lists it (a general resource is not invented onto any foundation or category page) |

Resource page: title and approved description visible; Worksheet · General · Beginner · 30 min · Planning · Draft; both PDFs linked; **no** OG code, `res-1023`, Week or Day wording visible.

## 5. Related resources
- **OG-23's own page:** exactly four "Linked by us" cards in the approved order (Resilience Product Wishlist, Project Support Brief Template, 3-Tier Budget Planner, 90-Day Implementation Roadmap); **0 "Same topic" cards** (the Stage 10.09B curated-related rule; `lib/related.ts` is not changed).
- **Existing pages' Related impact:** **0 existing pages change** — no Related card is added, removed, displaced or reordered on any live page (per-page diff of every resource page's Related cards: 0 differ; 0 cards added or removed).

## 6. Programme, Start Here, routes
Programme day 23 stays the demo `res-0023` (Pantry Rotation Worksheet); days 7 and 14 are also unchanged; no programme page changes. Start Here is unchanged. The demo separation holds: the demo `res-0003`, `res-0022` and `res-0023` pages and all demo placeholder pages keep their own routes. `route-policy.json` is unchanged. The OG-23 route is a protected route only (no demo route).

## 7. Claim detectors (hardened set)
| Scan | Resources / files | Numeric candidates | Bucket C | Other families |
|---|---|---|---|---|
| TRUE LIVE (OG-23 excluded) | 29 / 58 | 448 | **0** | price 0; survival, supply, emergency-period, multiplier, comparative 0; payback, warranty, payment, regulatory unresolved 0 |
| STAGED (live + OG-23) | 30 / 60 | 450 | **0** | identical: price 0; all families 0; unresolved 0 |

OG-23 adds two non-claim candidates and no new Bucket C. Content flags (4) and legacy-language hits (8) are the same in both sets (all in earlier live resources; none from OG-23). **Registry regression:** both sourced registry entries (OG-10 NZ `nz-rainwater-plumbing-consent-backflow-mbie`; OG-13 AU `au-qld-interconnected-photoelectric-alarms-law-qfd`) still resolve narrowly and are unchanged; the registry regression tests pass; no exemption was added.

## 8. Registers and review config
CURRENT_STATUS, NEXT_ACTIONS and RESOURCE_REGISTER now show: LIVE 29 / 58 (Worker `61f3bcf8…`, rollback `b7091068…`); STAGED, NOT DEPLOYED: OG-23 `res-1023` (staged build 30 / 60); `res-1023` row in the classification table marked STAGED; migration states **Deployed 29 · Staged 1 (OG-23) · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 13 = 45** (remaining: OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). Next action: **explicit owner approval to deploy OG-23.** Historical notes are not rewritten. The review config records the migration state STAGED, NOT DEPLOYED without the res-ID (config files never carry assigned IDs).

## 9. Tests and validation
Results are recorded in the final reply (lint, `tsc`, full vitest, `import:verify-prep`, `import:verify-build`, each with its actual exit code).

## 10. Not done (by design)
No deployment, no Worker change, no Access change, no rollback, no Start Here, programme or route-policy edit, no change to the shared cover system, site CSS or application source, and no next-resource audit. Waiting on the owner: **explicit approval to deploy OG-23.**

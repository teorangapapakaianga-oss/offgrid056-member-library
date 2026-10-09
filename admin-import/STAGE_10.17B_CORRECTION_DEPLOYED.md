# Stage 10.17B — three live regulatory statements corrected, three PDFs re-rendered and redeployed, licensing/legality detector promoted

**Date:** 9 October 2026 · **Deployed on the owner's ruling.** Only the three unsupported live statements were corrected; none was registered; no exemption or carve-out was added; the detector logic was promoted exactly as held. OG-24 was **not** drafted in this stage.

## Deployment
| | |
|---|---|
| Result | **Success** (`wrangler deploy` exit 0; 607 assets uploaded, 433 already present) |
| New Worker ID | `9ccff591-fc7b-4827-a1f6-4d9b754cbaa6` (100%; confirmed by `wrangler deployments list`) |
| Immediate rollback | `7bccd708-70a8-479f-90c8-b6f7239e1c91` (the Stage 10.15 deployment); older versions retained (`61f3bcf8-c4df-4d52-a060-b760bfbabc26`, `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28`, and all earlier) |
| What was deployed | `out/` of the second validated corrected build (1,040 files), identical to the first after build-id normalisation; clean working tree at `c614b06`; a snapshot of the uploaded tree was taken first and equals `out/` |
| LIVE now | **30 protected resources · 60 market files · 0 broken links · Bucket C 0** (no resource added or removed; migration unchanged) |

## 1. Copy corrections (source files changed)
`admin-import/config/approved-copy.json` only (plus `tests/unit/prep.test.ts` expectations). Each old wording existed once in its market; each replacement was applied once; the prepared HTML of the other 57 files is byte-identical; no route metadata changed.
- **OG-10 NZ** ("Components — plumbing and pump note (NZ)"): "Fixed electrical work and the pump connection must be handled by an appropriately licensed electrical worker." → "Check which electrical work on the pump connection needs a licensed person where you live, and use a suitably qualified professional where it does." OG-10 AU is unchanged ("…must be handled by a licensed electrician.", registered).
- **OG-20 NZ**: new market entry "Plan — permissions (NZ)": "Consents or permits needed" → "Consents or permits to check".
- **OG-20 AU**: "Permits or approvals needed" → "Permits or approvals to check".
- **Layout-only attribute (OG-10 NZ):** the longer sentence pushed the council-requirements label across a page break, so that one label carries `break-inside: avoid` (no wording change, no site CSS).

## 2. PDFs (only the three affected were re-rendered)
| PDF | Pages before → after | New SHA-256 | Old text | New text |
|---|---|---|---|---|
| OG-10 NZ | 7 → 7 | `72adca048f75314bce200273f104ed5ba5a48c82dd5879d01671f03766ac12f5` | ABSENT | PRESENT |
| OG-20 NZ | 7 → 7 | `c461ed15ced687efd050b581feef20ba4b162790bbca9c726ee38b3b3ac311c0` | ABSENT | PRESENT |
| OG-20 AU | 7 → 7 | `7a3f0fcec148a49e5fb4ed1663abf89c477a13264f95928297add77a763ab979` | ABSENT | PRESENT |

**OG-10 AU** is byte-identical (`dee5ced7…`); all other protected PDFs (57) and the 25 demo PDFs are byte-identical; 85 PDFs before and after, 0 added. Text extraction shows no other textual change (per-page text compared with the previous PDFs). All pages of the three PDFs were inspected as images: no clipping, overflow or blank page; headings, footers, page numbers and standing blocks are intact. **Layout notes (pagination only, no text change):** the earlier renders were produced before the print layout kept standing blocks together, so a fresh render moves them whole. OG-20 NZ: the batteries-and-electrical block, which used to split across pages 2 and 3, now sits whole at the top of page 3 (page 2 ends after the carbon-monoxide block). OG-10 NZ: the council label and its field now start page 6 and the general-disclaimer block moves to the top of page 7 (page 5 ends with white space). OG-20 AU keeps its previous pagination exactly (only the label line differs).

## 3. Detector, registry, promotion
- Corrected library under the candidate (hardened) detector: 30 resources / 60 files, 547 candidates, **Bucket C 0**; regulatory unresolved 0, payback, warranty and payment 0. The six Stage 10.17A entries and the two Stage 10.12A entries resolve narrowly; the three corrected sentences raise nothing and match no registry entry; OG-25 has 0 unresolved.
- **Promoted unchanged** (the held `numeric.ts` file became the active source; the held duplicates were removed after promotion). New permanent tests: `licensing-legality.test.ts` (64) and `registry-resolve-1017.test.ts` (resolution scope, the three corrected statements quiet, broader licensing, permit and legality statements still fail), plus `regulatory-registry-1017a.test.ts`.
- Unchanged and unbroadened: `nz-rainwater-plumbing-consent-backflow-mbie`, `au-qld-interconnected-photoelectric-alarms-law-qfd` and the six 10.17A entries.

## 4. Deployed tree comparison
Against the previous live tree (Stage 10.15; build id normalised): 1,040 → 1,040 files, **0 added, 0 removed, 18 changed, 0 unexplained**: the three PDFs, and 15 download and resource-page files (`downloads/` ×5, OG-10 page ×5, OG-20 page ×5) whose only difference is the `sizeBytes` of those PDFs. The stylesheet and all 23 JavaScript chunks are byte-identical; no CSS or JS drift. Against the validated corrected build: exact match.

## 5. Live detector scan (after deployment)
30 resources / 60 files: 547 numeric candidates, **Bucket C 0**; regulatory, payback, warranty and payment unresolved 0; target-label, assurance, survival, supply, emergency-period, multiplier and comparative 0; price claims 0; content flags 4 and legacy-language hits 8 (earlier resources, unchanged). No exemption added.

## 6. Access
18 routes probed (OG-10 and OG-20 routes and their PDFs, the OG-23 PDF, library, Planning Tools, Start Here, downloads, programme day 20, a demo route, an unknown route, the home page, a data path, `robots.txt`): **18 redirected (302) to Cloudflare Access, 0 unauthenticated 200.** Access settings were not touched.

## 7. Registers and validation
The three registers agree: live 30 / 60, Worker `9ccff591…`, rollback `7bccd708…`, Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 13 = 45; next action: resume the OG-24 draft on the owner's instruction. Historical notes untouched. Validation exit codes are in the final reply (lint, `tsc`, full tests, `import:verify-prep`, `import:verify-build`).

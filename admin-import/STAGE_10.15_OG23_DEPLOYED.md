# Stage 10.15 — OG-23 Supplier Comparison Worksheet deployed

**Date:** 9 October 2026 · **Deployed on the owner's explicit approval.** The exact Stage 10.14 validated staged build was deployed, not rebuilt. No content was rewritten, no PDF re-rendered, no metadata or related-resource order changed, Planning Tools gained only OG-23, and Cloudflare Access was not touched. The next legacy-resource audit was not started.

## Deployment
| | |
|---|---|
| Result | **Success.** `og056-preview` and its triggers deployed (`wrangler deploy`, exit 0; 606 assets uploaded, 434 already present). |
| New Worker ID | `7bccd708-70a8-479f-90c8-b6f7239e1c91` (100%; confirmed by `wrangler deployments list`) |
| Immediate rollback | `61f3bcf8-c4df-4d52-a060-b760bfbabc26` (the Stage 10.10 deployment) |
| Older versions retained | `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` → `e1b31486-afbe-4849-9702-a54e51114717` → `8834be25-0110-4355-94a5-93b9943f792d` → `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` → `2fb0663d-a7da-4acf-ba4c-957886b21631` → `65437c37-b731-4851-b67e-5b0fae79fe12` → `89333107-7c0a-4bdb-8229-f2b5241a9e05` → older; none removed |
| What was deployed | `out/` of the Stage 10.14 second staged build: byte-identical (1,040 of 1,040) to that build and, after build-id normalisation, to the first; clean working tree at `4b229e8`; both PDF hashes verified immediately before upload; a snapshot of the uploaded tree was taken first and is identical to `out/`. |
| LIVE now | **30 protected resources · 60 market files · 1,040 files · 0 broken links · Bucket C 0** (OG-23 is live protected resource #30) |
| Staged | none |

To roll back, point the Worker at `61f3bcf8-c4df-4d52-a060-b760bfbabc26`. Access protects every page, so content was verified on the snapshot of the exact tree uploaded, and the deployment was verified from Cloudflare and by unauthenticated probe.

## Live PDFs
| | SHA-256 (verified before upload and again on the uploaded tree) |
|---|---|
| NZ | `5178e066ae34c8636a6a250402c6d7bcee6c2c1761fe90e731e711284b0df3db` |
| AU | `5d1658a8ae051adad950a000d05081fbf8ee3f6977332fc9fc6e427e5748f1bc` |

Both match the approved render hashes exactly. The 58 earlier protected PDFs and the 25 demo PDFs (83 files) are byte-identical; exactly two PDFs were added; 60 protected PDFs are live.

## OG-23 live route
`/resources/supplier-comparison-worksheet/`: title and the approved description visible; Worksheet · General · Beginner · 30 min · Planning · Draft; no visible OG-23, `res-1023`, Week, Day, score, `/50`, `40+`, payback, warranty, percentage or regulatory wording (the only "30-Day Programme" text is the site's shared navigation item); both PDFs linked; library and downloads list it. **Related resources:** exactly Resilience Product Wishlist, Project Support Brief Template, 3-Tier Budget Planner, 90-Day Implementation Roadmap, all "Linked by us", in that order; no automatic fill and no demo card (the curated-related rule works). Safety: emergency-contact and general-disclaimer only; NZ and AU wording stay separate.

## Listings (live, before → after)
Library +1 card (OG-23). Downloads **51 → 52**; Worksheets **13 → 14**. My Progress **54 → 55**. Planning Tools **8 → 9** distinct resources: OG-23 appears once and the original eight are all still present and unchanged; no other resource was added and membership is not inferred from category. Foundation pages, Start Here, Saved, Dashboard and Programme: no change (no General/foundation page invented).

## Programme and routing
Programme day 23 stays the demo `res-0023` (not redirected); the `res-0023` route is unchanged; `res-1023` has its own protected route; nothing is superseded; `route-policy.json` is unchanged; demo placeholder routes are unchanged; Start Here is unchanged (0 changed files under `/programme`, `/start-here`, `/foundations`, `/workshops`, `/learning-paths`, `/packs`, `/videos`, `/suppliers`, `/brand`).

## Deployed tree comparison
- Against the Stage 10.14 staged tree: **exact match**, 1,040 of 1,040, 0 differing.
- Against the previous live tree (Stage 10.10): 1,032 → 1,040 files; **8 added** (six OG-23 route files and the two PDFs), **0 removed**, **324 changed**, 708 identical. Every changed file is attributed (resource data and listings 29; counters 12; resource-page payloads carrying the new resource 295; OG-23 route and PDFs 8). **0 unexplained, 0 displaced related items, 0 existing pages' Related cards changed.**
- The stylesheet (`04x21r3261sq4.css`) and every JavaScript chunk (23) are byte-identical to the previous live tree: no CSS or JS drift; the OG-23 PDF cover styling lives only inside the prepared PDF HTML and has no site effect.

## Detectors (live, 30 resources / 60 market files, hardened rules)
450 numeric candidates; **Bucket C 0**; price 0; payback, warranty, payment and regulatory unresolved 0; target-label (forward and reverse), assurance, outcome, storage-duration, survival-duration, supply-duration, emergency-period, multiplier and comparative-performance 0; content flags 4 and legacy-language hits 8 (already-live resources, unchanged; none from OG-23); market and safety scans unchanged. No exemption added. **Registry:** `nz-rainwater-plumbing-consent-backflow-mbie` (OG-10 NZ) and `au-qld-interconnected-photoelectric-alarms-law-qfd` (OG-13 AU) are unchanged, still resolve only for their exact resource, market and wording; the six registry tests pass.

## Access (unauthenticated)
25 routes probed (library, OG-23 route and both PDFs, Planning Tools, Downloads, My Progress, Start Here, programme and day 23 in both forms, the demo Pantry Rotation Worksheet, existing protected resources, a demo route, an unknown route, the home page, foundations, saved, another protected PDF, a data path, a chunk path and `robots.txt`): **25 redirected (302) to Cloudflare Access, 0 answered 200.** Access settings were not touched.

## Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 30 / 60; nothing staged; OG-23 `res-1023` DEPLOYED; Planning Tools 9 live; 0 broken links; Worker `7bccd708-70a8-479f-90c8-b6f7239e1c91`; rollback `61f3bcf8-c4df-4d52-a060-b760bfbabc26`; **Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · Not started 13 = 45** (OG-24, OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15); next action = the next eligible legacy-resource audit, on the owner's instruction. Historical notes are untouched.

## Not changed
Cloudflare Access, `route-policy.json`, programme routing, Start Here, the demo resources, the detectors, the registry entries, the curated-related rule, the shared cover system, site CSS and every other live resource.

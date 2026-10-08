## Stage 10.00 — OG-07 Priority Lock Worksheet deployed

**Date:** 8 October 2026 · **Deployed on the owner's explicit approval.** Content, PDFs, taxonomy, `route-policy.json` and Cloudflare Access were not changed.

## Deployment
| | |
|---|---|
| Result | **Success.** 594 assets uploaded (422 already present); `og056-preview` and its triggers deployed. |
| New Worker ID | `8834be25-0110-4355-94a5-93b9943f792d` (100%) |
| Immediate rollback | `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` (the Stage 9.95 deployment) |
| Older versions retained | `2fb0663d-a7da-4acf-ba4c-957886b21631` → `65437c37-b731-4851-b67e-5b0fae79fe12` → `89333107-7c0a-4bdb-8229-f2b5241a9e05` → `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | the exact Stage 9.99 validated build, not rebuilt: clean working tree, `out/` raw byte-identical to the validated staged rebuild (1,016 of 1,016), both OG-07 PDF hashes verified immediately before upload, a snapshot of the uploaded tree taken first, no source diff in `app/`, `lib/`, `components/`, `data/` or `public/` |
| LIVE now | **27 protected resources · 54 market files · 1,016 files · 0 broken links · Bucket C 0** |
| Staged | none |

To roll back, point the Worker at `5d88271b-6f06-4be8-9fd9-6b73fa4a002a`. As in earlier deployments, Access protects every page, so content was verified on the snapshot of the exact tree uploaded, and the live Worker was checked for the version, the 100% split and the Access redirects.

## Deployed tree against the staged tree
Snapshot of the uploaded tree against the validated Stage 9.99 staged rebuild: **1,016 files, 1,016 identical, 0 changed, 0 added, 0 removed, 0 unexplained** (raw, including the build id; no normalisation was needed). The snapshot is also identical to `out/`.

## Previous live tree (Stage 9.95) against the new live tree
Build id normalised: 1,008 → 1,016 files; **8 added** (the OG-07 route files and the two PDFs), **0 removed**, **304 changed**, 704 identical. Structural attribution of every changed file, no sampling: 24 listing and payload pages (new card; 7 also carry +1 counters), 280 resource-page payload files (the new resource in each page's full resource list), the 8 added files; **0 unexplained**. The only difference is the new resource appearing in listings and in each resource page's full resource list.

## OG-07 live
`/resources/priority-lock-worksheet/` resolves in the deployed tree: title "Priority Lock Worksheet", the approved description exactly, Worksheet, General, Beginner, 15 min, Planning, Draft. No visible `res-1007`, no visible `OG-07`, no "Week 1", no "72-hour", no multiplier or comparative claim. NZ and AU download links present. Related resources in the approved order: Home Resilience Scorecard, Household Risk Identifier, Household Spending Capacity Check, 3-Tier Budget Planner, 90-Day Implementation Roadmap (no Property Type Review, no Emergency Readiness Checklist). The library and downloads list it. Record: general / planning-implementation / planning / worksheet / beginner / 15 / draft / collections none.

## PDFs
- NZ `9480a6e2e7eb58223ed1ac8aee3a3a38b1850baa12f34884fa04c2799c5ac7f5`; AU `71bbc930ad86912eaece09e247ab47f7d74b8fa77d5ad7f163bbaabd77614ced`; both match the approved hashes in the deployed tree (verified before upload and again on the uploaded snapshot).
- All 52 previously live protected PDFs are byte-identical to the previous deployment (0 changed); 54 protected PDFs are live; the demo PDFs are unchanged (the whole-tree comparison shows no PDF among the changed files).

## Same-topic suggestions
Identical to Stage 9.99: `res-1007` is inserted into **0** same-topic lists (56 resource pages with a list inspected), **0** displaced entries, no protected entry displaced; the ranking code is untouched.

## Navigation and policy
Start Here (OG-01 and OG-02 only), Planning Tools (the same set; `res-1007` has `collections: []`), the programme (day 7 → `res-0008`, still the demo), Five Foundations, workshops, learning paths, collections and the four `demo-*` routes: **0 files changed** in each; `res-0006` and `res-0008` remain; no supersedes relationship exists. `route-policy.json` is unchanged. Cloudflare Access settings were not touched.

## Access probe (unauthenticated)
26 routes probed, **26 redirected (302) to Cloudflare Access, 0 answered 200**: library, the OG-07 route, the OG-07 NZ and AU PDFs, the OG-06 route, Start Here, Planning Tools, OG-01, OG-02 and OG-04 pages, the programme and programme day 7 (two URL forms), a demo route, an unknown protected route, the home page, downloads, Five Foundations, saved, progress, three other protected PDFs, a data path, a chunk path and `robots.txt`.

## CSS and JavaScript
The stylesheet is byte-identical to the previous deployment (`04x21r3261sq4.css`, sha256 `2aea7654799b4eec2b3d270b824ee1e12f7ac44cf1749d4f912d759bc0a7cc3b`); the 23 JavaScript chunks are unchanged; no CSS rule was added or removed.

## Detectors (live, 27 resources / 54 market files)
Numeric candidates **435**; survival-duration 0; supply-duration 0; emergency-period 0; multiplier 0; comparative-performance 0; price findings 0; content flags 4 (already-live OG-09 AU and OG-13 NZ, unchanged); market, safety and legacy-language scans: nothing in OG-07 (the programme labels and "000" thousands separators elsewhere are in already-live resources, unchanged); **Bucket C 0**. No exemption was added.

## Migration state (45 legacy resources)
Deployed **27** · Staged 0 · Prepared 0 · Blocked 1 (OG-16) · Merged / No standalone 1 (OG-05) · Not started 16 = 45. OG-07 DEPLOYED; OG-16 BLOCKED; OG-05 MERGED / NO STANDALONE RESOURCE.

## Registers
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 27 / 54; staged none; `res-1007` and OG-07 deployed; the counts above; Worker `8834be25…`; rollback `5d88271b…`; 0 broken links; next action = the next legacy-resource audit. Historical notes and old reports were not rewritten.

## Validation (exit codes)
lint 0 · typecheck 0 · full tests 0 · register, built-output, route-separation, numeric, multiplier and comparative suites 0 · `import:verify-prep` 0 · `import:verify-build` 0 (records 27 · market files 54 · broken internal links 0) · Bucket C 0. The counts are in the stage return.

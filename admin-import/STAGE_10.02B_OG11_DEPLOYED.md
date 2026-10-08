# Stage 10.02B — OG-11 storage-duration correction deployed

**Date:** 8 October 2026 · **Deployed on the owner's explicit approval.** A revision of an existing live resource: no count changed. OG-12 was not resumed. Content beyond the one approved sentence, taxonomy, relationships and Cloudflare Access were not changed.

## Deployment
| | |
|---|---|
| Result | **Success.** `og056-preview` and its triggers deployed. |
| New Worker ID | `e1b31486-afbe-4849-9702-a54e51114717` (100%) |
| Immediate rollback | `8834be25-0110-4355-94a5-93b9943f792d` (the Stage 10.00 deployment) |
| Older versions retained | `5d88271b-6f06-4be8-9fd9-6b73fa4a002a` → `2fb0663d-a7da-4acf-ba4c-957886b21631` → `65437c37-b731-4851-b67e-5b0fae79fe12` → `89333107-7c0a-4bdb-8229-f2b5241a9e05` → `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | the exact Stage 10.02A validated build, not rebuilt: clean working tree, `out/` raw byte-identical to the validated staged rebuild (1,016 of 1,016), both new PDF hashes verified immediately before upload, a snapshot of the uploaded tree taken first, no source diff in `app/`, `lib/`, `components/`, `data/` or `public/` |
| LIVE now | **27 protected resources · 54 market files · 1,016 files · 0 broken links · Bucket C 0** |
| Staged | none |

To roll back, point the Worker at `8834be25-0110-4355-94a5-93b9943f792d`. As before, Access protects every page, so content was verified on the snapshot of the exact tree uploaded.

## The change
Old: "Some canned foods with a shelf life of more than two years carry no date — write the date you bought them on the can with a permanent marker." New: "Some canned foods carry no date — write the date you bought them on the can with a permanent marker." No other copy changed.

## Live PDFs
| | SHA-256 (verified before upload and again on the uploaded tree) |
|---|---|
| NZ | `74ac281e484acd61349752229deb87a3c9e71fa4ab153a7bd18e15d11575b4d1` |
| AU | `1ba3828edd5e258c0d7d2ea5ea9ddd3e655c54b46ce7c76eb9b8aa980d810220` |

Both: 6 pages, portrait 612 × 792, title "30-Day Pantry Builder — OffGrid056" unchanged; old sentence absent; new sentence present once; the standing blocks and the Food safety in a power cut block present on page 6; NZ has 111 and no AU wording, AU has 000 and 112 and no NZ wording. **Other PDFs:** of the 54 protected PDFs exactly the two OG-11 PDFs changed (52 byte-identical); of all 79 PDFs in the tree no other changed, demo PDFs included.

## Deployed tree
- Against the validated Stage 10.02A staged tree: 1,016 files, **1,016 identical** (raw, build id included), 0 changed.
- Against the previous live tree (Stage 10.00): 1,016 files; **12 changed, 0 added, 0 removed**, 1,004 identical: the two OG-11 PDFs and the ten files that embed their sizes (five `/downloads/` files, five `/resources/30-day-pantry-builder/` files). In all ten the only difference is the two `sizeBytes` values (NZ 294,225 → 294,155; AU 293,575 → 293,505). **0 unexplained.**
- The stylesheet is byte-identical (`04x21r3261sq4.css`); the same 23 JavaScript chunks; no CSS rule added or removed.

## Detectors (live, 27 resources / 54 market files, hardened rules)
Storage-duration unresolved **0**; outcome-claim unresolved **0**; survival-duration, supply-duration, emergency-period, multiplier and comparative-performance **0**; price findings 0; 433 numeric candidates; content flags 4 (already-live OG-09 AU and OG-13 NZ, unchanged); market, safety and legacy-language scans unchanged; **Bucket C 0.** No exemption was added.

## Access (unauthenticated)
26 routes probed, **26 redirected (302) to Cloudflare Access, 0 answered 200**: the library, the OG-11 route and its NZ and AU PDFs, the OG-07 route, Start Here, Planning Tools, OG-01, OG-02 and OG-04, the programme and day 7, a demo route, an unknown protected route, the home page, downloads, Five Foundations, saved, progress, other protected PDFs, a data path, a chunk path and `robots.txt`. Access settings were not touched.

## Registers and migration state
`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree: live 27 / 54; staged none; the OG-11 correction deployed (the pending marker removed); 0 broken links; Worker `e1b31486…`; rollback `8834be25…`; **Deployed 27 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 16 = 45** (unchanged); next action = resume the Stage 10.02 OG-12 rewrite. Historical notes were not rewritten.

## Validation (exit codes)
See the stage return: lint 0 · typecheck 0 · full tests 0 · storage-duration and outcome-claim tests 0 · numeric, content-flag, built-output and register suites 0 · `import:verify-prep` 0 · `import:verify-build` 0 · Bucket C 0.

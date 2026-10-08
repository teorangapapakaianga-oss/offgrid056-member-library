# Stage 10.02A — OG-11 storage-duration claim correction

**Staged, NOT deployed.** The live Worker is unchanged. OG-11 is an existing live resource: this is a content revision, not a new resource, so no count changes.

LIVE: **27 protected resources · 54 market files · 0 broken links** · Worker `8834be25-0110-4355-94a5-93b9943f792d` · rollback `5d88271b-6f06-4be8-9fd9-6b73fa4a002a`. Migration: Deployed 27 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 16 = 45. OG-12 rewrite is not resumed.

## 1. The sentence
- **Old** (OG-11 page 4, "The Expiry Date Trap", both markets): "Some canned foods with a shelf life of more than two years carry no date — write the date you bought them on the can with a permanent marker."
- **New** (owner-approved): "Some canned foods carry no date — write the date you bought them on the can with a permanent marker."
Source of the text: the OG-11 `Worksheet`/box copy in `admin-import/config/approved-copy.json` (one string changed; nothing else in that file). No exemption, no numeric-claims source and no weakening of any detector was used.

## 2. Detector
The held Stage 10.02 detector was reapplied unchanged (`admin-import/audit/numeric.ts`): the **storage-duration rule** (shelf, storage, pantry, freezer and fridge life, "keeps for", "use within", "indefinite", and bare durations in table cells whose column header or heading names a storage life, read as "Subject — Header: cell") and the **absolute outcome-claim rule** ("eliminates expired food", "prevents all food waste", "perpetually fresh", "guarantees freshness", "saves money", "never run out of food", "always prevents waste", "no more waste"; hedged, member-facing, question and negated wording stays quiet). Precedence: treatment-owned → registry-approved → safety block → structural label → survival → supply → emergency-period → **storage-duration** → multiplier → comparative → **absolute outcome** → not-a-claim and the ordinary figure rules. New test file `tests/unit/numeric-storage-outcome.test.ts` (81 tests, NZ and AU, positive and negative).

## 3. Whole live library with the hardened rules
27 protected resources · 54 market files (all re-prepared): **0 storage-duration findings, 0 outcome-claim findings, 0 survival / supply / emergency-period / multiplier / comparative findings, 0 price findings, Bucket C 0** (433 candidates; the two OG-11 "two years" candidates are gone). Content flags 4 (already-live OG-09 AU and OG-13 NZ, unchanged). No other live claim appeared.

## 4. OG-11 PDFs
| | Old SHA-256 (live) | New SHA-256 (staged) | Pages |
|---|---|---|---|
| NZ | `47d44608ca3baf3cd7205569079af8046915207ec79e7f8eb27f69e3ea6ee384` (294,225 bytes) | `74ac281e484acd61349752229deb87a3c9e71fa4ab153a7bd18e15d11575b4d1` (294,155 bytes) | 6 → 6 |
| AU | `bf07b39bfef00a1a6395d4d332d2b832f266da7500d4f44718b3ca949b6758b4` (293,575 bytes) | `1ba3828edd5e258c0d7d2ea5ea9ddd3e655c54b46ce7c76eb9b8aa980d810220` (293,505 bytes) | 6 → 6 |

Rendered from the existing approved OG-11 layout and the shared cover system with the same headless-Chrome settings. Both PDFs: 6 pages, portrait 612 × 792, title "30-Day Pantry Builder — OffGrid056", producer and creation date present.

**Text QA (both markets):** the corrected sentence appears exactly once; the old wording is absent; **page 4 is the only page whose text differs from the live PDF**, and it differs only by the removed qualifier; page 6 (the standing blocks, including the food-safety block) is identical to the live PDF; NZ has 111 and Civil Defence and no AU wording; AU has 000 and 112 and no NZ wording; no OG code or res-id; Bucket C 0 and no storage or outcome candidate on the prepared files. 29 checks pass.

**Visual QA (all 12 pages viewed as images):** no clipping, overflow, orphan heading, dark cover panel or layout regression; the cover and the writing areas are unchanged; the changed sentence reads naturally. Page 4 holds only the "Expiry Date Trap" box (about 15% of the page): that is the existing live layout, identical in the old PDF, and was not changed.

## 5. Staging and regression
Only two private assets changed: `private-assets/resources/30-day-pantry-builder.NZ.pdf` and `.AU.pdf` (82 files before and after; the record, the route and the metadata are untouched). Of the 54 protected PDFs, **only the two OG-11 PDFs changed**; all 52 others and all demo PDFs are byte-identical.

## 6. Staged build against the live tree (deployed in Stage 10.00)
`npm run build:preview` ×2, exit 0; `import:verify-build`: **records 27 · market files 54 · broken internal links 0**. Two staged rebuilds are identical (1,016 of 1,016 after build-id normalisation). Staged against live: 1,016 files, **12 changed, 0 added, 0 removed, 1,004 identical**:
- the two OG-11 PDFs;
- **ten text files** that embed each PDF's size in bytes: the five `/downloads/` files and the five `/resources/30-day-pantry-builder/` files. In every one of them the **only** difference is the two `sizeBytes` values (NZ 294,225 → 294,155; AU 293,575 → 293,505), confirmed by normalising those values and finding the files identical.
The stylesheet is byte-identical (`04x21r3261sq4.css`) and the 23 JavaScript chunks are unchanged. No unexplained difference.

## 7. Registers
No migration count changed. The three registers record the pending revision in the current-state statement and state the next action as explicit owner approval to deploy the OG-11 correction.

## 8. Validation (exit codes)
lint 0 · typecheck 0 · full tests 0 · storage-duration and outcome-claim tests 0 (81) · numeric, content-flag, built-output and register suites 0 · `import:verify-prep` 0 · `import:verify-build` 0 · Bucket C 0. Counts are in the stage return.

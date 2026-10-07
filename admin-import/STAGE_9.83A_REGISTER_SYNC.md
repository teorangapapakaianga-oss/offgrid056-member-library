# Stage 9.83A — Resource register synchronisation

**Date:** 7 October 2026 · **Register edits and one register test only. Nothing deployed; no resource record, PDF, classification, collection, route policy or Access setting changed.** Live: 24 protected · 48 market files · Worker `89333107-7c0a-4bdb-8229-f2b5241a9e05` (100%); rollback `e63141a1-380a-4770-a125-9fd7a15d0bdb`. Staged: 25 protected · 50 market files (OG-04 / `res-1004`).

## Source of truth

The register was derived from the 25 private records (id, title, foundation, program component, category, type, collections), the deployed tree (a resource is LIVE when its NZ and AU market files are in the tree deployed in Stage 9.79) and the staged OG-04 record. Result: 24 live (48 market files) and 1 staged (`res-1004`); the script refuses to write unless it finds exactly that.

## `RESOURCE_REGISTER.md` changes

- Header: current date and stage; LIVE and STAGED lines with counts, Worker and rollback; the "21 deployed" figure kept only as a labelled historical example.
- State table: Deployed / LIVE 24 · Staged, not deployed 1 (OG-04) · Prepared 0 · Blocked 1 · Not started 19 (24 + 1 + 1 + 19 = 45 legacy resources; it was 21 + 0 + 2 + 22).
- Deployed table (now 24 rows): added OG-01 (9.71), OG-03 (9.79) and OG-B09 (9.66), which were live but missing; corrected OG-27's foundation from shelter to **general** (the record says general).
- New "Staged, not deployed (1)" section with the full OG-04 entry (below), and a note that "Prepared" is empty.
- Blocked: OG-B09 removed (it was deployed at Stage 9.66 as "Resilient Heating & Insulation Upgrade Checklist" with gas, solid-fuel and electrical blocks); OG-16 remains.
- Not started: OG-01, OG-03 and OG-04 removed.
- Route clashes: OG-01 changed from "expected" to "resolved and live (Stage 9.71)"; added the Stage 9.73B demo-separation and Stage 9.78B Planning Tools notes. The status flow now has a "staged, not deployed" step.
- New generated section "Protected resource classification": all 25 records with id, code, title, foundation, component, category, type, collections and LIVE / STAGED state.
- A Stage 9.83A note.

**OG-04 entry:** `res-1004` · Property Type Review (legacy Property Profile Matrix) · general · resilience-planning · planning · worksheet · collection planning-tools · **staged / not deployed** (record status draft) · NZ and AU, 9 portrait pages each · standing blocks only, electrical topic REMOVED · staged in Stage 9.83 · staged build 25 / 50 / 0 broken links / Bucket C 0.

## `CURRENT_STATUS.md` and `NEXT_ACTIONS.md` changes

- `CURRENT_STATUS.md`: first line cites Stage 9.83A; "records" wording changed to "protected resources" so the staged count reads the same as in the other registers.
- `NEXT_ACTIONS.md`: a "Current state" block (live 24 / 48, staged 25 / 50, Worker, rollback, next action), a Stage 9.83A note, every earlier note's "Waiting on the owner" relabelled "Then waiting on the owner (resolved or superseded since)", and the Stage 9.61 queue titled as a historical snapshot.

## Other stale entries found

- OG-27 foundation (fixed, above); OG-01, OG-03, OG-B09 missing from Deployed (fixed); OG-B09 wrongly Blocked (fixed); OG-01, OG-03, OG-04 wrongly Not started (fixed); OG-01 route clash "expected" (fixed).
- The Stage 9.61 "Immediate queue" in `NEXT_ACTIONS.md` and the pathway sections below it describe 9.61-era work (for example "28 demo placeholders remain"). They are labelled as a historical snapshot and **not rewritten**: that content is outside this task and needs the owner's attention if it is to be refreshed.
- Checked and consistent: the Safety blocks column for all 24 live rows matches the prep report's block ids; the Deployed table's titles and foundation / type match the records for all 24.

## Mismatch with the data model (reported, not changed)

- The register's Deployed table has no ID, Program Component or Category column. I preserved the table and added the generated classification table instead.
- OG-02's NZ market file is `household-risk-identifier.pdf`, with no `.NZ.` in the name, unlike every other resource. Recorded in the Stage 9.83A note; the file and record are unchanged.

## Consistency cross-check (all pass, 70 checks)

For all three files: no control characters, no mojibake, no "dmin-import" remnant, every file path resolves, resource ids well formed, every Worker id complete and known. They agree on: live 24 protected / 48 market files; staged 25 / 50; live Worker `89333107…`; rollback `e63141a1…`; OG-04 staged and not deployed; the next action being the owner's approval to deploy. No current-state statement says live = 23 or 46, "unchanged since 9.74", OG-03 staged, or OG-04 live. All 25 classification rows match the records.

## Validation

New `tests/unit/registers.test.ts` (15 tests) keeps the three registers consistent. Lint clean; typecheck clean; **789 tests passing** (774 + 15). `import:verify-build`: 25 records · 50 market files · 0 broken internal links; Bucket C 0; the Access probe redirects all routes to Cloudflare Access; the live Worker is unchanged. The private-assets files are byte-identical to their Stage 9.83 state (0 differences).

## Readiness to deploy OG-04 as protected resource #25

Ready, pending the owner's explicit approval. No blocker remains in the registers.

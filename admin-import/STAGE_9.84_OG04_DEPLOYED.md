# Stage 9.84 — OG-04 deployed as protected resource #25

**Date:** 7 October 2026 · **Deployed on the owner's explicit approval. Draft status kept. Nothing else changed.**

## Deployment

| | |
|---|---|
| Result | **Success.** 586 assets uploaded (414 already present); `og056-preview` deployed and triggers deployed. |
| New Worker ID | `65437c37-b731-4851-b67e-5b0fae79fe12` (100%) |
| Immediate rollback | `89333107-7c0a-4bdb-8229-f2b5241a9e05` (the Stage 9.79 deployment) |
| Older versions retained | `e63141a1-380a-4770-a125-9fd7a15d0bdb` → `7de9641f-df4c-4cab-8e84-055c0861879d` → `db2fd12a-955e-47c4-b3c9-d174e3da85d8` → `fa23ec74-85d2-4d91-b484-3f037ccbe38b` → `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`; none removed |
| What was deployed | the validated Stage 9.83 staged build, exactly: before uploading, the normalised manifest of `out/` was identical to the validated one (1,000 files, 25 records, 50 market files, 0 broken links) |
| LIVE now | **25 protected resources · 50 market files · 1,000 files · 0 broken links · Bucket C 0** |
| Staged, not deployed | none |

To roll back, point the Worker at `89333107-7c0a-4bdb-8229-f2b5241a9e05`.

Cloudflare Access protects every route, so live pages can't be read unauthenticated. As in Stage 9.79, the content check ran on a snapshot of the exact `out/` tree that was uploaded (compared file by file with `out/`: identical), and the live Worker was checked for the version, the 100% split and the Access redirects.

## OG-04 live verification (from the deployed tree)

`res-1004` · Property Type Review · slug `property-type-review` · general · resilience-planning · planning · worksheet · beginner · 15 minutes · draft · collections `["planning-tools"]`. The OG-04 page set (6 files) and its two PDFs are in the deployed tree; page data carries the classification; the listing QA and the release QA pass against it.

## PDF full-hash verification

| | SHA-256 |
|---|---|
| NZ | `C39C3D561573E1816AD1C43DDC4B2F3EED2CE086D40EEEB4DC5C437E004CF96E` |
| AU | `A1E4EF42DE129671BDEA6A7D8E03B8EA4CA6B32749E51A0488205CE67D5C0F7E` |

Both match the expected values and the staged files in `private-assets/` (staged = `out/` = the uploaded snapshot). 9 pages each, portrait 612 × 792, title "Property Type Review — OffGrid056"; page 7 opens with "Step 4 — Your Property Rules (continued)" (automated PDF QA passes on the deployed snapshot). **No existing deployed PDF changed**: 73 PDFs compared with the previous deployed tree, 0 changed.

## Planning Tools (8 protected resources, each exactly once; no demo placeholder)

OG-03 (res-1003) · **OG-04 (res-1004)** · OG-22 (res-1022) · OG-25 (res-1025) · OG-26 (res-1026) · OG-27 (res-1027) · OG-B04 (res-1504) · OG-B10 (res-1510). The four demo placeholders are not listed. OG-01, OG-02 and OG-B12 were not added.

## Related resources

OG-04 retains exactly: res-1001, res-1002, res-1022, res-1003, res-1020, res-1512. OG-26 (res-1026) and OG-27 (res-1027) are not related ids (they stay in Where Next only). OG-03 is untouched.

## Routing

The OG-04 route is built and sits behind Access. No demo/protected collision; `route-policy.json` unchanged. Programme days 2, 9, 11, 13 and 29 still point at their demo placeholders; the separated demo routes and the four demo placeholders' own routes are still built; Start Here is unchanged (8 entries, each deep-equal); the library gained only res-1004 and no existing resource summary changed; no route was removed or redirected. Content-level attribution against the previous deployed tree: 992 → 1,000 files, 8 added (OG-04's six page files and two PDFs), 0 removed, 0 existing PDFs changed, **no unexplained difference**.

## Access

An unauthenticated probe of 41 routes redirected all 41 to Cloudflare Access (0 answered 200). Specific probes also redirected: `/`, `/library/`, `/planning-tools/`, `/start-here/`, `/resources/property-type-review/`, `/resources/property-type-review.NZ.pdf`, `/resources/property-type-review.AU.pdf`, an OG-03 page, a demo route, a programme day and an unknown route. Access settings were not changed.

## Market and safety

The worksheet body is identical in NZ and AU (5,497 characters each). NZ carries "call 111" and the New Zealand tradesperson wording only; AU carries "call 000", 112 and the Australian wording only; no cross-market leakage. No tenancy, consent, grant, body-corporate or building-standard wording. The legacy electrical-topic disposition remains **REMOVED**; only the emergency-contact and general-disclaimer blocks apply; no new safety finding (regression: 0 market problems, 0 content flags, 0 price findings, 0 safety-removal findings).

## Register post-deploy state

`CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` now agree: **LIVE 25 protected resources · 50 market files**; Worker `65437c37-b731-4851-b67e-5b0fae79fe12`; immediate rollback `89333107-7c0a-4bdb-8229-f2b5241a9e05`; OG-04 live as #25; **staged: none**; next action: the owner chooses the next resource. In `RESOURCE_REGISTER.md`: OG-04 added to the Deployed table (25), the Staged section is now empty ("none"), the state table reads 25 + 0 + 1 + 19 = 45, and every row of the generated classification table reads LIVE. The register's table structure, the Stage 9.61 snapshot and OG-02's legacy NZ filename were left unchanged, as instructed. Older stage notes that describe earlier states (for example "staged build 24 records") are dated history and are labelled as such; none states a current count.

**Register consistency:** `tests/unit/registers.test.ts` (updated to the new state, 15 tests) passes: counts, Worker ids, rollback, OG-04 live, nothing staged, no stale staged wording in the current-state statements, valid paths, no truncated paths, no "dmin-import", no control characters, no mojibake, well-formed resource ids, and all 25 classification rows match the records.

## Validation

`import:verify-prep`: all prepared files verified (OG-04 9 pages in each market). `import:verify-build`: records 25 · market files 50 · broken internal links 0. Route-policy, demo/protected separation, collection/listing and register tests run in the full suite. Price scan 0 detections; numeric scan Bucket C 0; market, safety and legacy-language scans pass. Lint clean; typecheck clean; **789 tests passing**.

## Unexpected differences

None.

## Readiness for the next resource

Ready. Nothing is staged and no register is out of date. The next resource to audit or migrate is the owner's choice.

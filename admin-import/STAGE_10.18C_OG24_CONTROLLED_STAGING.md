# Stage 10.18C — OG-24 Professional Support Planner: stable ID assigned and controlled staging (NOT deployed)

**OG-24 is STAGED, not live.** `res-1024` is assigned; the protected record and the two approved PDFs are in `private-assets`; the staged preview build was produced and validated. No deployment, no Worker change, no live count change. Cloudflare, Supabase, Railway, the OS and entitlement untouched; no unrelated resource changed.

LIVE (unchanged): **30 protected resources · 60 market files · 0 broken links · Planning Tools 9** · Worker `07c5694d-db5b-45e4-a2f5-022ce518c8cb` · rollback `9ccff591-fc7b-4827-a1f6-4d9b754cbaa6`.
STAGED build: **31 protected resources · 62 market files · 0 broken links · Planning Tools 10**.

## Stable ID and collision checks
`res-1024` assigned to OG-24 Professional Support Planner (owner-approved). Checks before writing (the staging script refuses to proceed on any hit): no protected record with that ID, slug or legacy code; no demo resource with that ID or slug; no route-policy entry; no existing build route `/resources/professional-support-planner/`; no collection conflict (Planning Tools only). **0 collisions.** The ID appears only in the staged record, the registers, the canonical index and the tests, never in the review config, the copy or the PDFs.

## Staged record and assets
| | |
|---|---|
| Record | `private-assets/data-resources/professional-support-planner.private.json` (git-ignored; sha256 `9777598d172b1586544f48c47cea37661c1a70639eb45b166dbdbd629e7a8914`) |
| Fields | id res-1024 · slug professional-support-planner · legacyCode OG-24 · title and description exactly as approved · general / planning-implementation / planning / worksheet · beginner · 20 min · tags none · collections planning-tools · premium false · **status draft · publicationStatus approved · releaseChannel private-preview** · marketFiles NZ and AU · downloadable · publishedDate 2026-10-13 · relatedResources [res-1023, res-1025, res-1022, res-1027] · completionAvailable true. No guessed field: the strict record schema has no entitlement or OS field. |
| NZ PDF | `private-assets/resources/professional-support-planner.NZ.pdf`, 2,434,802 bytes, sha256 `574a7308ad479116037d3bcaff968945dc230cb4e30fa26d2b0091cbcce2f462`, **byte-identical** to the approved render |
| AU PDF | `private-assets/resources/professional-support-planner.AU.pdf`, 2,434,497 bytes, sha256 `460d17cb4b390ee9f8198c7ae01462fb1657cfcba5c1eb2a463afe6a7f6df6b7`, **byte-identical** |
| Cover | The approved photograph (`workspace/prep/OG-24/assets/professional-support-cover.webp`, sha256 `92eff0912b3734faa8bbf6757eceda9a27b219977a40d6ef93a7d8afeadf93d3`, verified identical to the owner's original) is embedded in both approved PDFs (1055 × 1491, checked). A protected resource record carries no cover or thumbnail field and no existing resource has a separate cover location, so no separate copy is needed; the legacy Week 4 stand-in is referenced nowhere. |
| Route | `/resources/professional-support-planner/` (unique), protected build only |
| Related (explicit, in order) | res-1023 Supplier Comparison Worksheet · res-1025 Project Support Brief Template · res-1022 Resilience Product Wishlist · res-1027 90-Day Implementation Roadmap (res-1510 not used); the curated-related rule applies; `lib/related.ts` unchanged |

**Hash correction (documentation only):** the cover hash in my Stage 10.18B report, in the review-config `coverStatus` and in the Stage 10.18C brief carried a one-character transcription error (65 characters). The file itself is unchanged and byte-identical to the original; the correct 64-character hash above replaced the typo in the config and the 10.18B report.

## Staged build validation
Two fresh builds: identical after build-id normalisation. `import:verify-build`: **31 records · 62 market files · 0 broken internal links**; OG-24 NZ and AU read back at 11 pages with the right title. Staged-build QA (`workspace/staged-qa24.mjs`): ALL PASS: the page builds with the approved title, description and metadata (Worksheet · General · Beginner · 20 min · Planning); no OG-24, `res-1024` or Day wording visible; both PDFs linked; the four related links present in the approved order and **no Same-topic cards**; Planning Tools lists it (**9 → 10** distinct resources); Start Here, foundations and programme untouched; programme days 7, 14, 23 and 24 still the demo resources; demo and separated routes unchanged; protected PDFs 60 → 62 and **all 85 existing PDFs byte-identical**, exactly two added with the approved hashes; stylesheet and all 23 JavaScript chunks identical. **Badge:** 31 of 31 protected detail pages show **Preview** with the exact tooltip "Approved resource in the protected OffGrid056 preview.", 0 Draft badges, 0 listing badges, 0 occurrences of the old tooltip.

## Listings (staged vs live)
Library +1 card; Downloads 52 → 53 (Worksheets 14 → 15); My Progress 55 → 56; Planning Tools 9 → 10; Start Here, Five Foundations, Programme and Saved unchanged.

## Build comparison against the live deployment (build id normalised)
1,040 → 1,048 files; **8 added** (the six `resources/professional-support-planner/` route files and the NZ and AU PDFs), **0 removed**, **329 changed**: causes: resource data and listings 29, counters 12, resource-page payloads carrying the new resource 300, new-resource files 8; **0 unattributed, 0 unexplained**; related cards on existing pages: **0 pages differ, 0 cards added or removed**. The changed files are the listing pages (Library, Downloads, Planning Tools, My Progress, Saved, home) and the per-page payloads of existing resources, each carrying the one new resource. No unrelated PDF, resource copy, stylesheet or JavaScript chunk changed.

## Claim and safety validation (OG-24 staged)
Staged library 31 / 62: **Bucket C 0**, regulatory unresolved 0, payback 0, warranty 0, payment 0 (551 candidates); true live 30 / 60: Bucket C 0 (547). OG-24 prepared source: technical safety triggers 0 (standing emergency-contact and general-disclaimer only), price 0, outcome 0, assurance 0, legacy-language 0, content flags 0, regulatory 0. No exemption, no registry change. (The legacy `$33,000` figure appears only in the unprepared legacy-source scan, not in the staged copy.)

## Registers, index and review config
- **Migration state (recalculated from the register):** Deployed 30 · **Staged 1 (OG-24)** · Prepared 0 · Blocked 1 (OG-16) · Merged 1 (OG-05) · **Not started 12** = 45 (OG-28, OG-29, OG-30, OG-B01, OG-B02, OG-B03, OG-B05, OG-B06, OG-B11, OG-B13, OG-B14, OG-B15). `CURRENT_STATUS.md`, `NEXT_ACTIONS.md` and `RESOURCE_REGISTER.md` agree; the resource register carries a `res-1024` row marked STAGED; the live figures stay 30 / 60 and the live Worker is unchanged; next action: explicit owner approval to deploy OG-24.
- **Canonical index:** `res-1024` added as a STAGED record (31 records: 30 live, 1 staged) with ID, title, type, foundation, component, category, route, collection, related IDs, publication status approved, release channel private-preview, access tier and entitlement UNDEFINED_OWNER_DECISION, OS fields inactive, owner / version / dates `UNKNOWN_EXISTING_RECORD`, short description withheld, **reviewStatus NEEDS_ENTITLEMENT_DECISION and NEEDS_METADATA (not VERIFIED_CURRENT)**. The 30 live entries were brought in line with the deployed Preview badge (visible badge Preview; the badge-review flag resolved).
- **Review config:** OG-24 related links recorded as OWNER-APPROVED; migration state STAGED, NOT DEPLOYED. Two tests were adjusted for staging: the OG-23 draft test now checks OG-23's own review entry (OG-24's related list names res-1023), and the Planning Tools collection test expects ten staged members.

## Owner decisions required
Explicit approval to deploy OG-24 (a separate stage: re-verify the staged tree, deploy, post-deploy QA, then update the live counts to 31 / 62 and Planning Tools to 10).

## Next stage
**Stage 10.18D — OG-24 controlled deployment and post-deploy QA.** Not started. Test and lint results are in the final reply.

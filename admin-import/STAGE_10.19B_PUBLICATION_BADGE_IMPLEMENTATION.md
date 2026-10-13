# Stage 10.19B — publicationStatus + releaseChannel + Preview badge (implemented, NOT deployed)

**Implemented in the Library repository and the validated preview build only.** Not deployed; the live Worker still serves the Draft badge until a deployment is approved. No OS, Supabase, Railway or Cloudflare change; no entitlement; no OS handoff; no PDF change; no stable ID, slug, route, status, premium, collection, related link or download path changed; OG-24 untouched.

Live (unchanged): **30 protected resources · 60 market files · 0 broken links** · Worker `9ccff591-fc7b-4827-a1f6-4d9b754cbaa6`.

## What changed
| File | Change |
|---|---|
| `lib/content/constants.ts` | `PUBLICATION_STATUSES` (draft, review, approved, live, withdrawn, superseded, internal) and `RELEASE_CHANNELS` (private-preview, members) |
| `lib/content/schemas.ts` | `publicationStatus` and `releaseChannel` added to the resource schema: optional, enum-validated, declared together or not at all; `status` unchanged; the schema stays strict (no entitlement field exists) |
| `lib/content/publication.ts` (new) | pure badge logic and the exact tooltip |
| `components/resources/badges.tsx` | `DraftBadge` removed; `PublicationBadge` added (renders from `publicationBadge()` only) |
| `app/resources/[slug]/page.tsx` | `r.status === "draft" && <DraftBadge />` replaced by `<PublicationBadge publicationStatus releaseChannel />` |
| `tools/validate-content.ts` | build-time fail-closed check: a non-placeholder resource without an owner-approved pair fails the build |
| `admin-import/pilot/verify-build.mts` | the same check against the private records before deployment |
| `tests/unit/publication.test.ts` (new, 16), `tests/unit/built-output.test.ts` (+2) | see Tests |
| `private-assets/data-resources/*.private.json` (30, git-ignored) | `publicationStatus: approved`, `releaseChannel: private-preview` added after `status` |
| `docs/CANONICAL_RESOURCE_INDEX.md`, `docs/canonical-resource-index.json` | implementation recorded (not deployed) |

## Badge logic and fallback
`approved` + `private-preview` → **Preview**, tooltip exactly "Approved resource in the protected OffGrid056 preview." Every other combination, including recognised-but-unapproved values (for example `live` + `members`, `draft` + `private-preview`), missing values and garbage, returns **no badge** (fail closed: nothing is rendered, nothing is guessed). The build validator and `verify-build` additionally fail any real resource whose pair is not approved, so a mis-declared resource cannot ship silently. The logic reads only `publicationStatus` and `releaseChannel`; it ignores `status`, `premium`, authentication, programme membership, migration state and any OS data (tested). Because `status` is no longer read for display, the technical build gate and the badge are independent. Demo placeholders carry neither field and show only their existing Demo badge.

## Listing and detail
Listings (Library, Downloads, Planning Tools, Start Here, Saved, Progress) show **no** publication badge, as before (the resource card never rendered one). The resource detail page shows **Preview** for all 30; the old "Draft: imported but not yet approved for members" text appears nowhere in the build.

## res-1019 Battery Backup Planner
status draft · publicationStatus approved · releaseChannel private-preview · register LIVE · detail-page badge **Preview** with the exact tooltip · route `/resources/battery-backup-planner/` unchanged · foundation energy, component off-grid-living, category backup-energy, type planner unchanged. It passes through the shared logic; no resource-specific code exists (tested: no resource ID in the badge logic, component or page).

## Counts
Records updated 30 · `status` changes 0 · stable-ID changes 0 · route changes 0 · PDF changes 0 (all 85 PDFs byte-identical to the deployed tree) · entitlement changes 0 · OS integration changes 0. `accessTier` and `entitlementRequirement` stay UNDEFINED_OWNER_DECISION; the OS fields stay recommendationEligible false, handoffStatus INACTIVE, approvedHandoffRoute null, entitlementContractStatus NOT_APPROVED.

## Build comparison against the deployed tree (build id normalised)
1,040 → 1,040 files, 0 added, 0 removed, 300 changed = 60 resource pages × 5 files: **30 protected pages** (Draft → Preview badge) and **30 demo pages** whose only difference is an invisible server-render placeholder (`false` → `null` where the old draft check was); no listing page, PDF, stylesheet or JavaScript chunk changed (CSS and all 23 JS chunks byte-identical).

## Tests and validation (actual results)
- **Default full suite (5-second timeout), run 1:** 60 files, **1,656 tests, all passed**, exit 0 (no timeout).
- **Default full suite, run 2 (after the last documentation edit):** 1,655 passed, **1 failed: importer.test.ts > infers a foundation with confidence and evidence, a 5-second timeout (5,112 ms)**, the known legacy-OneDrive scan slowness; not a logic failure.
- **importer.test.ts isolated:** 30 of 30 passed, exit 0. **Full suite with the existing 30-second override:** 60 files, **1,656 tests, all passed**, exit 0. The global default timeout was not changed.
- Lint **0**; typecheck **0**; `import:verify-prep` and `import:verify-build` **0** (30 records · 60 market files · 0 broken internal links; the new publication check passes); live-library claim gate Bucket C 0.
- Schema tests (valid/invalid values, together-or-neither, strict record), badge tests (exact mapping and tooltip, full fail-closed matrix), no-coupling tests (extra status/premium/auth/OS fields change nothing; logic source contains none of those words), record tests (all 30 approved/private-preview, status draft, premium false), res-1019 tests, built-output tests (Preview and tooltip on all 30 pages, no Draft anywhere, listings show no badge), runtime-scope tests (no canonical-index, OS, Supabase or Railway reference in app, lib or components).

## Remaining owner decisions
Approve deployment of this change (a separate stage: stage, verify the staged build, deploy, post-deploy QA); access tiers and the entitlement contract; the res-1025 wording review; the repository hygiene stage; a source of truth for per-resource owner, version and review dates.

## Recommended next stage
If you approve, deploy 10.19B (it needs a deployment because the live Worker still shows Draft). Then return to **OG-24 Professional Support Planner: render and visual QA, then preparation for staging**. Nothing was started automatically.

# Stage 10.19A — owner governance rulings for the canonical index

**Governance and documentation only.** Recorded in `docs/CANONICAL_RESOURCE_INDEX.md` and `docs/canonical-resource-index.json` (not read by the application). No protected record, PDF, copy, route, badge, status, collection, related link, route policy, Start Here, Planning Tools, programme route, entitlement, Worker, Cloudflare Access, OS, Supabase or Railway item was changed. No deployment. OG-24 rendering was not resumed.

Accepted Stage 10.19 findings (locked): 30 protected resources · 60 market files · 0 broken links · 30 canonical index records · 0 duplicate stable IDs · 0 duplicate routes · 0 missing routes · all 60 market files present · 59 test files / 1,636 tests · lint 0 · typecheck 0. Live Worker (unchanged): `9ccff591-fc7b-4827-a1f6-4d9b754cbaa6`.

## Rulings recorded
1. **Publication model — approved, not implemented.** `status` stays the technical/build gate (draft, published, archived). Future `publicationStatus` (draft, review, approved, live, withdrawn, superseded, internal) and `releaseChannel` (private-preview, members) are separate fields. Also separate: `migrationState` (migration workflow), `accessProtection` (whether access protection exists), `entitlementRequirement` (whether the member is entitled to receive a resource).
2. **Current 30:** `publicationStatus` approved, `releaseChannel` private-preview. This does not mean public, production-member release, paid entitlement, OS entitlement or an OS authentication handoff.
3. **Visible badge:** future **Preview**, never Draft for these resources, computed from `publicationStatus` + `releaseChannel`. Today's Draft badge (resource detail page only) is unchanged.
4. **Exact proposed tooltip (for the owner record):** "Approved resource in the protected OffGrid056 preview. Not a public or final member release." It replaces "Draft: imported but not yet approved for members" in a future stage, and does not imply public release, production entitlement, paid access or a final member launch.
5. **res-1019 Battery Backup Planner:** MODEL / BADGE SEMANTICS ISSUE, not a resource-specific data error; future approved / private-preview / Preview; not changed separately.
6. **Access and entitlement:** no free or paid tier assigned; `accessTier` and `entitlementRequirement` stay UNDEFINED_OWNER_DECISION on all 30; authentication is not entitlement. **OS integration:** `recommendationEligible` false, `handoffStatus` INACTIVE, `approvedHandoffRoute` null, `entitlementContractStatus` NOT_APPROVED; nothing activated.
7. **res-1002 file name:** KEEP AS-IS (`household-risk-identifier.pdf`); recorded as a known legacy naming exception; no correction stage required for the filename alone.
8. **res-1025:** REVIEW LATER; stays live and unchanged; future task `FT-1025-WORDING-REVIEW`, separate from the publication-model implementation.
9. **res-1027 + res-1510:** KEEP BOTH (standard and advanced roadmaps); the near-duplicate title is intentional; no merge, rename or retirement.
10. **Owner / version / review metadata:** now recorded in the index. Where project evidence cannot establish a value the marker `UNKNOWN_EXISTING_RECORD` is used (owner, version, versionDate, lastReviewedDate, sourceLink on all 30); nothing was fabricated. `firstPublishedToPreview` (the record's `publishedDate`) is kept as a separate, evidenced field. For new and reviewed resources these fields become mandatory.
11. **Review status:** unchanged model. No resource is VERIFIED_CURRENT; version, versionDate, sourceLink and entitlement stay visible as unresolved. `NEEDS_ASSET_REVIEW` (res-1002) and `NEEDS_OWNER_REVIEW` (res-1027, res-1510, res-1001, res-1015) were replaced by the rulings above; `NEEDS_OWNER_REVIEW` remains on res-1025; `NEEDS_BADGE_REVIEW` stays until the Preview badge is implemented.
12. **Public repository hygiene:** REVIEW REQUIRED in a separate security/hygiene stage (`FT-REPO-HYGIENE-REVIEW`): internal/, admin-import/, Worker IDs, Access hostnames, account email references, local file paths and historical operational notes. Nothing is removed or rewritten now and repository visibility is not changed. The absence of a credential pattern is not a claim that the repository is clean.
13. **Library ↔ OS contract (locked in the index):** the Library stays a separate protected application; no shared cookies, session tokens, localStorage or household state; the OS must not write Library progress or member state; recommendations use the stable resource ID and approved Library metadata; the OS must not guess URLs or proxy protected content; authentication is not entitlement; recommendation handoff stays inactive until an entitlement contract is approved. Integration is not activated.

## Files changed
`docs/CANONICAL_RESOURCE_INDEX.md`, `docs/canonical-resource-index.json`, `tests/unit/canonical-index.test.ts` (documentation tests, 13), this report. **Runtime files changed: none** (no file under `app/`, `lib/`, `components/`, `data/`, `public/` or `tools/`, and no resource record).

## Remaining owner decisions
Access tiers and entitlement requirements per resource and the entitlement contract owner; approval of the exact tooltip wording; the timing of Stage 10.19B; the future wording review of res-1025; the scope and timing of the repository hygiene stage; a source of truth for per-resource owner, version and review dates.

## Recommended next stage
**Stage 10.19B — implement `publicationStatus` + `releaseChannel` + Preview badge** (code, build and deployment with full regression). Not started.

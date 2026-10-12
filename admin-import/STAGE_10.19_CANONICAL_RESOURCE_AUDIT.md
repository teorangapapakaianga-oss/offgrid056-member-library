# Stage 10.19 — canonical resource index and publication / badge consistency audit

**Audit and index only.** No live resource, PDF, copy, ID, route, badge, publication status, entitlement, collection, related link, programme route, Start Here, Planning Tools, route policy, register, Worker, Cloudflare Access, OS, Supabase or Railway item was changed. The only new artefacts are `docs/CANONICAL_RESOURCE_INDEX.md`, `docs/canonical-resource-index.json` (read by nothing at runtime) and `tests/unit/canonical-index.test.ts`.

Baseline (verified from the current registers, the private records and the current build, not from snapshots): **30 protected resources · 60 market files · 0 broken links** · Worker `9ccff591-fc7b-4827-a1f6-4d9b754cbaa6` · Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 13 = 45.

## Locked integration rules (recorded in the index)
The Library stays separate from the OS: no shared cookies, session tokens, localStorage, household state or authentication records; Library saved/progress/browser state stays Library-owned; the OS never writes into it; any future OS recommendation uses a stable resource ID and approved Library metadata; the OS must not proxy protected content, guess a URL or infer entitlement from authentication; authentication is not entitlement; OS recommendation destinations stay inactive until an entitlement/handoff contract is approved; the Library remains the brand reference; no OS, Supabase, Railway or Cloudflare change belongs to this stage.

## 1–3. Counts and uniqueness
Protected resources **30**; canonical index records **30**; duplicate stable IDs **0**; duplicate slugs/routes **0**; duplicate titles **0**; missing routes **0** (every `/resources/<slug>/` exists in the build and shows its title); stale or guessed routes **0** (routes come from the record slug and are confirmed in the build); redirect-only routes **0**. Route policy: `supersedes` empty; four protected resources (res-1001, 1008, 1010, 1013) share a title with a demo placeholder that is separated onto a `demo-` route, as approved.

## 4–5. Publication-status model found
Five different things are in use and are not interchangeable:
| Concept | Where | Values today |
|---|---|---|
| Canonical record state | `status` in each resource record (schema: draft, published, archived) | all 30 = **draft** |
| Build gate | `OG056_INCLUDE_DRAFTS` | a production build loads only `published`; the private preview loads `draft` and `published` |
| Migration state | operational registers | all 30 = **LIVE** (deployed to the private preview) |
| Visible badge | `DraftBadge` on the **resource detail page only**, shown when `status === "draft"`; tooltip "Draft: imported but not yet approved for members" | all 30 show **Draft**; no listing (Library, Downloads, Planning Tools, Start Here, Saved, Progress) shows it |
| Access protection | Cloudflare Access on the whole preview hostname | authentication only |
| Entitlement | none | no tier or requirement exists; the legacy `premium` flag is false on all 30 and is not used for access |

The `status` field is the build gate, set to draft by owner decision D9-7 ("every import enters as a draft"); it was never a statement about approval or release. The register word LIVE means "deployed behind Access". Readers meet both words ("LIVE" in the register, "Draft" on the page) and cannot tell what either permits.

**Recommendation (not implemented):** keep `status` as the build gate and add a separate explicit `publicationStatus` with the controlled values draft, review, approved, live, withdrawn, superseded, internal, plus a release channel (private-preview, members) so the badge is computed from publication state and channel, not from the build gate. Suggested mapping for today's 30: `approved` in `private-preview`. Changing it alters the badge and possibly the build, so it needs its own approved stage. The badge copy needs a decision either way (keep "Draft", or "Preview").

## 6–7. Access tier and entitlement
Every resource: `accessTier` and `entitlementRequirement` = **UNDEFINED_OWNER_DECISION**; nothing is derived from Cloudflare authentication, route accessibility, the Draft badge, the `premium` flag, OS authentication or programme membership. Fields defined: 30 of 30; unresolved: 30 of 30.

## 8. Source files and assets
Authoritative metadata source: the private resource record (`private-assets/data-resources/<slug>.private.json`, git-ignored) and `admin-import/config/{approved-copy,metadata-review}.json`. Legacy HTML and PDF sources found for all 30 (names recorded; local paths withheld). All 60 market files are present in `private-assets` and byte-identical in the build; every PDF title field equals "<title> — OffGrid056"; no duplicate PDF hashes (NZ and AU differ for every resource); no missing market file; no stale file; no orphan PDF (the one unsuffixed file is declared, see below); every resource page links both files and the Downloads page lists every resource.
**Asset-naming drift (res-1002 Household Risk Identifier):** its NZ file is `household-risk-identifier.pdf` (no `.NZ`), while every other resource uses `<slug>.NZ.pdf`. It works (declared, present, linked, identical) but breaks the naming convention; flagged NEEDS_ASSET_REVIEW. No version or review date is recorded for any resource; `versionDate` is the record's `publishedDate`.

## 9. Duplicate / outdated candidates (nothing merged or deleted)
- res-1027 90-Day Implementation Roadmap and res-1510 90-Day Implementation Roadmap (Advanced): near-duplicate titles (similarity 0.8); the owner kept them as basic and advanced.
- res-1001 Home Resilience Scorecard and res-1015 Warm Home Scorecard: similar words, different jobs.
- Four demo placeholders share a title with a protected resource (res-0007/1001, 0015/1008, 0016/1010, 0013/1013): separated by route policy and hidden from listings.
- res-1025 Project Support Brief Template: the Stage 10.16 observation of legacy-style wording ("Days of autonomy desired", "Required Start Date", "Penalties") is carried as an owner-review note; not re-audited here.
No superseded or withdrawn resource exists; no unresolved related link (every explicit related ID is a protected resource).

## 10–11. Badge consistency and res-1019
| A canonical state | B register | C metadata status | D visible badge | E access |
|---|---|---|---|---|
| draft (all 30) | LIVE (all 30) | review config recordStatus draft, copy OWNER-APPROVED | Draft on the detail page (all 30) | Cloudflare Access (all 30) |

**Mismatches: 30 of 30, one pattern: "LIVE in register + DRAFT visible badge".** Per-field data agree (record, review config, build and badge all say draft); the conflict is in meaning. Other mismatch classes: approved metadata with draft badge (30, same cause); withdrawn resource visible (0); superseded resource listed (0); route accessible but publication inactive (30, by design: every route is accessible only behind Access while the record is draft).

**res-1019 Battery Backup Planner:** foundation energy, component off-grid-living, category backup-energy, type planner, route `/resources/battery-backup-planner/` all match expectations; explicit related: res-1018 only. Canonical record status **draft**; register **LIVE**; visible badge **Draft** on its detail page; no Draft badge in any listing. Verdict **AMBIGUOUS** (a naming and model issue, not a data inconsistency specific to it): the badge faithfully shows the record status, but the status means "build gate" while the register says LIVE, and the badge tooltip says "not yet approved for members", which contradicts the owner-approved, deployed state. Same for all 30.

## 12. Downloads
Expected 60 market files, 60 present, 60 identical in the build, 0 missing, 0 duplicate, 0 stale, 0 mismatched title or ID; NZ and AU files are separate, distinct files for every resource. One naming exception: res-1002 NZ.

## 13. Internal / private exposure (paths and classifications only; no values)
- Built output (`out/`): no internal, admin, workspace, held, review-config or private-record file; no source maps.
- Protected records, protected PDFs and the importer workspace are git-ignored and not tracked (verified).
- **The remote repository is public and tracks `internal/` and `admin-import/` (198 files):** registers and stage reports that name protected resources by ID and title, Worker version IDs (117 files), the preview `workers.dev` hostname (5 files incl. `wrangler.jsonc`), Cloudflare Access hostnames (4 admin reports), the owner's email address (1 report) and local user-path strings (4 files in `admin-import/config`, `held-10.12`, `held-10.17`). No credential-like value was found by pattern scan. Recommended visibility: the registers and reports should be internal or in a private repository; the index deliberately withholds descriptions, local paths, Worker IDs and URLs so it adds no new exposure beyond titles, IDs and routes that the tracked registers already show.

## 14. Required return items
Resources needing entitlement decisions: all 30. Needing owner review: res-1002 (asset naming), res-1025 (wording note), res-1027/res-1510 (near-duplicate). Future OS integration fields: prepared and inactive on all 30 (`recommendationEligible` false, `handoffStatus` INACTIVE, `approvedHandoffRoute` null, `entitlementContractStatus` NOT_APPROVED); no active OS link exists. Review status: none is VERIFIED_CURRENT (version, review date, source link and entitlement are unrecorded); every record carries NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW and NEEDS_METADATA, plus the specific flags above.

## 15. Owner decisions required
1. The publication model (separate `publicationStatus` and release channel) and the badge copy ("Draft" vs "Preview" vs none). 2. Access tiers and entitlement requirements, resource by resource (free, member, paid or programme), and who owns the entitlement contract. 3. Whether res-1002's NZ file is renamed to `.NZ.pdf` (rename plus record update plus redeploy; no re-render). 4. Whether res-1025 gets a wording review. 5. Whether res-1027 and res-1510 stay as they are. 6. Whether the internal registers and reports stay in the public repository. 7. Whether to record per-resource owner, version and review date going forward.

## 16. Proposed correction stages (none started)
10.19A rulings on the publication model, badge copy and entitlement tiers (documentation only); 10.19B implement `publicationStatus` and the badge (code, build and deployment; full regression); 10.19C res-1002 NZ file rename and redeploy; 10.19D res-1025 wording review; 10.19E repository hygiene (move internal registers and reports to a private location, strip local paths); then OG-24 resumes.

## 17. No-change confirmation and validation
No live content, route, badge, status, entitlement, collection, related link, PDF, register, route policy, Start Here, Planning Tools, programme route, Worker or Access was modified; no deployment. Validation exit codes are in the final reply.

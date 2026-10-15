# Canonical resource index

**Stage 10.27C · updated 2026-10-14 · governance document only.** The machine-readable companion is [canonical-resource-index.json](canonical-resource-index.json). Nothing here is read by the Library application, changes a route, a badge, a status or an entitlement, or contains protected content (short descriptions are withheld; they stay in the private resource records).

## Locked Library ↔ OS governance rules

1. The Member Resource Library remains a separate protected application from the OffGrid056 OS.
2. The Library does not share OS cookies.
3. The Library does not share OS session tokens.
4. The Library does not share OS localStorage.
5. The Library does not share OS household state.
6. The Library does not depend on OS authentication records.
7. The OS must not write Library saved, progress or member state; Library state remains Library-owned.
8. OS recommendations must use the stable resource ID.
9. OS recommendations must use approved Library metadata.
10. The OS must not guess Library URLs.
11. The OS must not proxy protected Library content.
12. Authentication is not entitlement; Cloudflare authentication must not imply entitlement.
13. Entitlement remains a separate future contract.
14. Recommendation handoff remains inactive until that contract is approved.
15. The Library remains the visual brand reference for OffGrid056.
16. No OS, Supabase, Railway or Cloudflare infrastructure change is part of the Library programme stages that maintain this index.

## Owner rulings (Stage 10.19A)

- **Publication model — approved (not implemented):** APPROVED: keep `status` as the technical/build gate; add the separate future fields `publicationStatus` and `releaseChannel`; do not merge the concepts. Not implemented: no record, build or badge changed.
- **Definitions (kept separate, never derived from each other):**
  - `status`: technical / build-state gate (draft, published, archived): decides whether a build loads the record; unchanged
  - `publicationStatus`: editorial / publication governance state (draft, review, approved, live, withdrawn, superseded, internal)
  - `releaseChannel`: environment / audience state (private-preview, members)
  - `migrationState`: migration workflow state in the operational registers (Not started, Prepared, Staged, Deployed/LIVE, Blocked, Merged, Archived; Merged and Archived are register-only states that no protected record carries)
  - `accessProtection`: whether access protection exists (Cloudflare Access on the preview hostname)
  - `entitlementRequirement`: whether the member is entitled to receive a resource (undefined until the owner defines it)
- **Accepted Stage 10.19 baseline:** 30 protected resources · 60 market files · 0 broken links · 30 canonical index records · 0 duplicate stable IDs · 0 duplicate routes · 0 missing routes · all 60 market files present · 59 test files / 1,636 tests · lint 0 · typecheck 0.
- **Current 30 resources:** `publicationStatus` **approved**, `releaseChannel` **private-preview**. Protected private-preview resources. NOT public, NOT a production-member release, NOT a paid entitlement, NOT OS entitlement, NOT an OS authentication handoff.
- **Visible badge:** today "Draft" (detail page only); future **Preview**, computed from `publicationStatus` + `releaseChannel`; never "Draft" for these approved private-preview resources. **Proposed tooltip:** "Approved resource in the protected OffGrid056 preview." (exact wording; it must not imply public release, production entitlement, paid access or a final member launch, and "not yet approved for members" is not used for the approved private-preview state). Not implemented.
- **Implementation (Stage 10.19B; deployed Stage 10.19C):** `publicationStatus` and `releaseChannel` now exist in the resource schema and in the 30 protected records (approved / private-preview); the badge is computed by `lib/content/publication.ts` (approved + private-preview => Preview with the exact tooltip; anything else => no badge, fail closed) and shown on resource detail pages only; the live Worker shows Preview on all 30 live resources. A new resource staged from now on must carry an owner-approved pair or the build fails.
- **res-1019 Battery Backup Planner:** MODEL / BADGE SEMANTICS ISSUE; not a resource-specific data error; future approved / private-preview / Preview; not changed separately.
- **Access and entitlement:** No free or paid tier is assigned. accessTier and entitlementRequirement stay UNDEFINED_OWNER_DECISION on all 30. Authentication must not be treated as entitlement.
- **OS integration fields (inactive):** `recommendationEligible` false, `handoffStatus` INACTIVE, `approvedHandoffRoute` null, `entitlementContractStatus` NOT_APPROVED.
- **res-1002 file name:** KEEP AS-IS. household-risk-identifier.pdf stays; recorded as a known legacy naming exception (route and download work, no member-facing defect, a rename adds deployment risk). No correction stage is required for this filename alone.
- **res-1025:** REVIEW LATER. The resource stays live and unchanged; a dedicated wording review is a future task, kept separate from the publication-model implementation.
- **res-1027 + res-1510:** KEEP BOTH. res-1027 is the standard implementation roadmap and res-1510 the advanced roadmap; the near-duplicate title is intentional. No merge, rename or retirement.
- **Metadata policy:** owner, version, versionDate, reviewStatus and lastReviewedDate are now recorded. Where current project evidence cannot establish a value the marker UNKNOWN_EXISTING_RECORD is used; no date or version is fabricated. For new or reviewed resources going forward these fields are mandatory.
- **Review status:** Retained. A resource cannot be VERIFIED_CURRENT until the required canonical fields (version, versionDate, sourceLink, entitlement) are supported; missing values stay visible as unresolved metadata.
- **Public repository hygiene:** REVIEW REQUIRED in a separate security/hygiene stage. Nothing is removed or rewritten now; the repository visibility is not changed. The later review should assess internal/, admin-import/, Worker IDs, Access hostnames, account email references, local file paths and historical operational notes. The Stage 10.19 scan found no credential-like value, which does not establish that the repository is clean.

## Known exceptions

- **res-1002** — KNOWN_LEGACY_NAMING_EXCEPTION: NZ file is household-risk-identifier.pdf (no .NZ suffix); kept as-is by owner ruling.
- **res-1027 and res-1510** — INTENTIONAL_NEAR_DUPLICATE_TITLE: Standard and advanced roadmaps; kept as separate resources by owner ruling.

## Future tasks (open)

- **FT-1025-WORDING-REVIEW** — Project Support Brief Template: Dedicated wording review of the live resource (legacy-style wording noted at Stage 10.16). Keep separate from the publication-model implementation.
- **FT-REPO-HYGIENE-REVIEW** — Public repository hygiene review: Assess internal/, admin-import/, Worker IDs, Access hostnames, account email references, local file paths and historical operational notes. Do not claim the repository is clean from the absence of credential patterns.
- **FT-PUBLICATION-MODEL-IMPLEMENTATION** — Implement publicationStatus, releaseChannel and the Preview badge: Stage 10.19B: add the fields, compute the badge from publicationStatus and releaseChannel, update the tooltip, full regression.

Next stage: Stage 10.19B — implement publicationStatus + releaseChannel + Preview badge (not started).

## Schema (one record per real protected resource)

| Field | Meaning |
|---|---|
| stableResourceId | authoritative, permanent ID (`res-NNNN`) |
| legacyCode | the OG code from the 30-Day Programme source; never shown to members |
| title | member-facing title |
| resourceType / foundation / programComponent / category / topic | controlled classification (topic = category until a separate topic taxonomy exists) |
| shortDescription | member-facing description (withheld here; held in the private record) |
| owner / version / versionDate / lastReviewedDate / sourceLink | recorded going forward; UNKNOWN_EXISTING_RECORD where current evidence cannot establish a value (never fabricated) |
| firstPublishedToPreview | the record's `publishedDate`: when the resource first entered the private preview (not a version date) |
| sourceFile | legacy source file names and the review-config entries |
| status | technical / build gate (draft, published, archived) |
| publicationStatus | editorial / publication governance state |
| releaseChannel | environment / audience state |
| migrationState | operational-register state |
| visibleBadge / futureVisibleBadge / futureBadgeTooltip | what members see today, and the approved future value and tooltip |
| accessTier / entitlementRequirement | UNDEFINED_OWNER_DECISION; never derived from authentication, route access, badge or programme membership |
| accessProtection | Cloudflare Access on the preview hostname: authentication, not entitlement |
| canonicalRoute / routeSource / routeStatus | route from the record slug, confirmed in the build |
| marketAvailability / downloadAssets | NZ and AU files with route, SHA-256 and size |
| reviewStatus | issue flags; no resource is VERIFIED_CURRENT while a required field is unsupported |
| collections / relatedResources / supersededBy / withdrawn / internalOnly / notes / knownExceptions / futureTasks | as stored or ruled |
| recommendationEligible / handoffStatus / approvedHandoffRoute / entitlementContractStatus | future OS integration fields, prepared and INACTIVE |

## Controlled values

```json
{
  "programComponent": [
    "off-grid-living",
    "resilience-planning",
    "resilience-emergency",
    "planning-implementation",
    "advanced-future"
  ],
  "foundation": [
    "general",
    "air",
    "water",
    "shelter",
    "food",
    "energy"
  ],
  "status": [
    "draft",
    "published",
    "archived"
  ],
  "publicationStatus": [
    "draft",
    "review",
    "approved",
    "live",
    "withdrawn",
    "superseded",
    "internal"
  ],
  "releaseChannel": [
    "private-preview",
    "members"
  ],
  "reviewStatus": [
    "VERIFIED_CURRENT",
    "NEEDS_METADATA",
    "NEEDS_BADGE_REVIEW",
    "NEEDS_ROUTE_REVIEW",
    "NEEDS_ASSET_REVIEW",
    "NEEDS_ENTITLEMENT_DECISION",
    "NEEDS_OWNER_REVIEW",
    "WITHDRAWN",
    "SUPERSEDED"
  ],
  "accessTier": [
    "UNDEFINED_OWNER_DECISION"
  ],
  "entitlementRequirement": [
    "UNDEFINED_OWNER_DECISION"
  ],
  "handoffStatus": [
    "INACTIVE"
  ],
  "entitlementContractStatus": [
    "NOT_APPROVED"
  ],
  "missingDataMarker": [
    "UNKNOWN_EXISTING_RECORD"
  ]
}
```

## Index (36 records: 35 live, 1 staged)

**res-1024 Professional Support Planner was deployed in Stage 10.18D** and is live resource #31 (31 resources, 62 market files).

**res-1028 Household Responsibility Roster was deployed in Stage 10.21D** and is live resource #32 (32 resources, 64 market files).

**res-1029 Household Action Plan was deployed in Stage 10.22D** and is live resource #33 (33 resources, 66 market files).

**res-1030 Long-Term Direction Planner was deployed in Stage 10.23D** and is live resource #34 (34 resources, 68 market files).

**res-1502 Household Contacts Sheet was deployed in Stage 10.24D** and is live resource #35 (35 resources, 70 market files).

**res-1514 Local Support Network Planner is STAGED, not deployed (Stage 10.27C):** it is counted in the staged build (36 resources, 72 market files) and not in the live totals (35, 70).

### Identity and classification

| ID | Code | Title | Type | Foundation | Component | Category | Route | Collections |
|---|---|---|---|---|---|---|---|---|
| res-1001 | OG-01 | Home Resilience Scorecard | assessment | general | resilience-planning | getting-started | `/resources/home-resilience-scorecard/` | start-here |
| res-1002 | OG-02 | Household Risk Identifier | worksheet | general | resilience-planning | planning | `/resources/household-risk-identifier/` | start-here |
| res-1003 | OG-03 | Household Spending Capacity Check | worksheet | general | planning-implementation | planning | `/resources/household-spending-capacity-check/` | planning-tools |
| res-1004 | OG-04 | Property Type Review | worksheet | general | resilience-planning | planning | `/resources/property-type-review/` | planning-tools |
| res-1006 | OG-06 | Emergency Readiness Checklist | checklist | general | resilience-emergency | planning | `/resources/emergency-readiness-checklist/` | — |
| res-1007 | OG-07 | Priority Lock Worksheet | worksheet | general | planning-implementation | planning | `/resources/priority-lock-worksheet/` | — |
| res-1008 | OG-08 | Water Storage Calculator | worksheet | water | off-grid-living | water-storage | `/resources/water-storage-calculator/` | — |
| res-1009 | OG-09 | Household Water Treatment Guide | guide | water | off-grid-living | water-security | `/resources/household-water-treatment-guide/` | — |
| res-1010 | OG-10 | Rainwater Harvesting Planner | planner | water | off-grid-living | rainwater | `/resources/rainwater-harvesting-planner/` | — |
| res-1011 | OG-11 | 30-Day Pantry Builder | worksheet | food | resilience-emergency | pantry-resilience | `/resources/30-day-pantry-builder/` | — |
| res-1012 | OG-12 | Pantry Rotation Tracker | template | food | resilience-emergency | food-storage | `/resources/pantry-rotation-tracker/` | — |
| res-1013 | OG-13 | Healthy Home Air Audit | assessment | air | resilience-planning | healthy-home-checks | `/resources/healthy-home-air-audit/` | — |
| res-1014 | OG-14 | Water, Food and Air Household Snapshot | worksheet | general | resilience-planning | planning | `/resources/water-food-air-household-snapshot/` | — |
| res-1015 | OG-15 | Warm Home Scorecard | assessment | shelter | resilience-planning | heating | `/resources/warm-home-scorecard/` | — |
| res-1017 | OG-17 | Solid Fuel Heating Planner | planner | shelter | off-grid-living | heating | `/resources/solid-fuel-heating-planner/` | — |
| res-1018 | OG-18 | Solar Power 101 Workbook | workbook | energy | off-grid-living | solar | `/resources/solar-power-101-workbook/` | — |
| res-1019 | OG-19 | Battery Backup Planner | planner | energy | off-grid-living | backup-energy | `/resources/battery-backup-planner/` | — |
| res-1020 | OG-20 | Alternative Energy Suitability Check | assessment | energy | off-grid-living | household-energy-planning | `/resources/alternative-energy-suitability-check/` | — |
| res-1021 | OG-21 | Home Energy & Shelter Upgrade Plan | planner | shelter | planning-implementation | household-resilience | `/resources/home-energy-and-shelter-upgrade-plan/` | — |
| res-1022 | OG-22 | Resilience Product Wishlist | worksheet | general | resilience-planning | planning | `/resources/resilience-product-wishlist/` | planning-tools |
| res-1023 | OG-23 | Supplier Comparison Worksheet | worksheet | general | planning-implementation | planning | `/resources/supplier-comparison-worksheet/` | planning-tools |
| res-1025 | OG-25 | Project Support Brief Template | template | general | planning-implementation | planning | `/resources/project-support-brief-template/` | planning-tools |
| res-1026 | OG-26 | 3-Tier Budget Planner | planner | general | planning-implementation | planning | `/resources/3-tier-budget-planner/` | planning-tools |
| res-1027 | OG-27 | 90-Day Implementation Roadmap | planner | general | planning-implementation | planning | `/resources/90-day-implementation-roadmap/` | planning-tools |
| res-1504 | OG-B04 | Monthly Planning Challenge Template | planner | general | planning-implementation | planning | `/resources/monthly-planning-challenge-template/` | planning-tools |
| res-1507 | OG-B07 | Solar Planning Deep Worksheet | worksheet | energy | off-grid-living | solar | `/resources/solar-planning-deep-worksheet/` | — |
| res-1508 | OG-B08 | Water Tank Sizing & Placement Guide | guide | water | off-grid-living | household-water-planning | `/resources/water-tank-sizing-and-placement-guide/` | — |
| res-1509 | OG-B09 | Resilient Heating & Insulation Upgrade Checklist | checklist | shelter | resilience-planning | insulation | `/resources/resilient-heating-and-insulation-upgrade-checklist/` | — |
| res-1510 | OG-B10 | 90-Day Implementation Roadmap (Advanced) | planner | general | planning-implementation | planning | `/resources/90-day-implementation-roadmap-advanced/` | planning-tools |
| res-1512 | OG-B12 | Off-Grid System Architecture Planner | planner | general | advanced-future | planning | `/resources/off-grid-system-architecture-planner/` | — |
| res-1024 | OG-24 | Professional Support Planner | worksheet | general | planning-implementation | planning | `/resources/professional-support-planner/` | planning-tools |
| res-1028 | OG-28 | Household Responsibility Roster | worksheet | general | planning-implementation | planning | `/resources/household-responsibility-roster/` | planning-tools |
| res-1029 | OG-29 | Household Action Plan | worksheet | general | planning-implementation | planning | `/resources/household-action-plan/` | planning-tools |
| res-1030 | OG-30 | Long-Term Direction Planner | worksheet | general | advanced-future | planning | `/resources/long-term-direction-planner/` | — |
| res-1502 | OG-B02 | Household Contacts Sheet | worksheet | general | resilience-emergency | planning | `/resources/household-contacts-sheet/` | — |
| res-1514 | OG-B14 | Local Support Network Planner | worksheet | general | resilience-planning | planning | `/resources/local-support-network-planner/` | — |

### Publication, badge, access and review

| ID | status | publicationStatus | releaseChannel | Register | Badge (live) | Access tier | Entitlement | Review status flags |
|---|---|---|---|---|---|---|---|---|
| res-1001 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1002 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1003 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1004 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1006 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1007 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1008 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1009 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1010 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1011 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1012 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1013 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1014 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1015 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1017 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1018 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1019 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1020 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1021 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1022 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1023 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1025 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA, NEEDS_OWNER_REVIEW |
| res-1026 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1027 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1504 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1507 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1508 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1509 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1510 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1512 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1024 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1028 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1029 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1030 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1502 | draft | approved | private-preview | LIVE | Preview | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |
| res-1514 | draft | approved | private-preview | STAGED | — (staged: Preview) | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_METADATA |

### Ownership, version and review (missing values are explicit)

| ID | Owner | Version | Version date | Last reviewed | Source link | First published to preview |
|---|---|---|---|---|---|---|
| res-1001 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-06 |
| res-1002 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-21 |
| res-1003 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-07 |
| res-1004 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-07 |
| res-1006 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-08 |
| res-1007 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-08 |
| res-1008 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1009 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-23 |
| res-1010 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-23 |
| res-1011 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1012 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-09 |
| res-1013 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-05 |
| res-1014 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-09 |
| res-1015 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1017 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-06 |
| res-1018 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1019 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1020 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1021 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1022 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1023 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-09 |
| res-1025 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1026 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1027 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1504 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1507 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1508 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-23 |
| res-1509 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-06 |
| res-1510 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1512 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-09-22 |
| res-1024 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-13 |
| res-1028 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-14 |
| res-1029 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-14 |
| res-1030 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-14 |
| res-1502 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | 2026-10-15 |
| res-1514 | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | UNKNOWN_EXISTING_RECORD | not yet deployed |

### Source and downloads

| ID | Legacy HTML | Legacy PDF | NZ file | AU file | NZ SHA-256 | AU SHA-256 |
|---|---|---|---|---|---|---|
| res-1001 | OG-01_Home_Resilience_Scorecard.html | OG-01_Home_Resilience_Scorecard.pdf | `/resources/home-resilience-scorecard.NZ.pdf` | `/resources/home-resilience-scorecard.AU.pdf` | `15b142f7c0a5…` | `85833db81145…` |
| res-1002 | OG-02_Household_Risk_Identifier.html | OG-02_Household_Risk_Identifier.pdf | `/resources/household-risk-identifier.pdf` | `/resources/household-risk-identifier.AU.pdf` | `f54d0dfa52fb…` | `d3477bdcc486…` |
| res-1003 | OG-03_Budget_Pathway_Selector.html | OG-03_Budget_Pathway_Selector.pdf | `/resources/household-spending-capacity-check.NZ.pdf` | `/resources/household-spending-capacity-check.AU.pdf` | `d0197f0539c1…` | `4811fd4e59bd…` |
| res-1004 | OG-04_Property_Profile_Matrix.html | OG-04_Property_Profile_Matrix.pdf | `/resources/property-type-review.NZ.pdf` | `/resources/property-type-review.AU.pdf` | `c39c3d561573…` | `a1e4ef42de12…` |
| res-1006 | OG-06_72Hour_Emergency_Checklist.html | OG-06_72Hour_Emergency_Checklist.pdf | `/resources/emergency-readiness-checklist.NZ.pdf` | `/resources/emergency-readiness-checklist.AU.pdf` | `6a892f0dcb8a…` | `dd0cf256810f…` |
| res-1007 | OG-07_Week1_Priority_Lock_Worksheet.html | OG-07_Week1_Priority_Lock_Worksheet.pdf | `/resources/priority-lock-worksheet.NZ.pdf` | `/resources/priority-lock-worksheet.AU.pdf` | `9480a6e2e7eb…` | `71bbc930ad86…` |
| res-1008 | OG-08_Water_Storage_Calculator.html | OG-08_Water_Storage_Calculator.pdf | `/resources/water-storage-calculator.NZ.pdf` | `/resources/water-storage-calculator.AU.pdf` | `5ec4c9603578…` | `edd98ad3f02b…` |
| res-1009 | OG-09_Filtration_Comparison_Matrix.html | OG-09_Filtration_Comparison_Matrix.pdf | `/resources/household-water-treatment-guide.NZ.pdf` | `/resources/household-water-treatment-guide.AU.pdf` | `7bfca22a548e…` | `cefcb4bffeed…` |
| res-1010 | OG-10_Rainwater_Harvesting_Planner.html | OG-10_Rainwater_Harvesting_Planner.pdf | `/resources/rainwater-harvesting-planner.NZ.pdf` | `/resources/rainwater-harvesting-planner.AU.pdf` | `72adca048f75…` | `dee5ced7bc21…` |
| res-1011 | OG-11_30Day_Pantry_Builder.html | OG-11_30Day_Pantry_Builder.pdf | `/resources/30-day-pantry-builder.NZ.pdf` | `/resources/30-day-pantry-builder.AU.pdf` | `74ac281e484a…` | `1ba3828edd5e…` |
| res-1012 | OG-12_FIFO_Rotation_Tracker.html | OG-12_FIFO_Rotation_Tracker.pdf | `/resources/pantry-rotation-tracker.NZ.pdf` | `/resources/pantry-rotation-tracker.AU.pdf` | `a27e0cc0f068…` | `78b8ddf99a11…` |
| res-1013 | OG-13_Healthy_Home_Air_Audit.html | OG-13_Healthy_Home_Air_Audit.pdf | `/resources/healthy-home-air-audit.NZ.pdf` | `/resources/healthy-home-air-audit.AU.pdf` | `e00618546c37…` | `6c8cef71b834…` |
| res-1014 | OG-14_Basic_Survival_Systems_MiniPlan.html | OG-14_Basic_Survival_Systems_MiniPlan.pdf | `/resources/water-food-air-household-snapshot.NZ.pdf` | `/resources/water-food-air-household-snapshot.AU.pdf` | `5e7bbc1f2463…` | `143b064e9d11…` |
| res-1015 | OG-15_Warm_Home_Scorecard.html | OG-15_Warm_Home_Scorecard.pdf | `/resources/warm-home-scorecard.NZ.pdf` | `/resources/warm-home-scorecard.AU.pdf` | `36fe5ff0618f…` | `5e99f1d7ff55…` |
| res-1017 | OG-17_Solid_Fuel_Heating_Planner.html | OG-17_Solid_Fuel_Heating_Planner.pdf | `/resources/solid-fuel-heating-planner.NZ.pdf` | `/resources/solid-fuel-heating-planner.AU.pdf` | `35b37749ccb2…` | `8f47f5f674f5…` |
| res-1018 | OG-18_Solar_Power_101_Workbook.html | OG-18_Solar_Power_101_Workbook.pdf | `/resources/solar-power-101-workbook.NZ.pdf` | `/resources/solar-power-101-workbook.AU.pdf` | `d6f52168f9bd…` | `5a77b661e09e…` |
| res-1019 | OG-19_Battery_Backup_Planner.html | OG-19_Battery_Backup_Planner.pdf | `/resources/battery-backup-planner.NZ.pdf` | `/resources/battery-backup-planner.AU.pdf` | `a9b376d90ba8…` | `cb25d02e7a4d…` |
| res-1020 | OG-20_Alternative_Energy_Suitability_Check.html | OG-20_Alternative_Energy_Suitability_Check.pdf | `/resources/alternative-energy-suitability-check.NZ.pdf` | `/resources/alternative-energy-suitability-check.AU.pdf` | `c461ed15ced6…` | `7a3f0fcec148…` |
| res-1021 | OG-21_Home_Energy_Shelter_Upgrade_Plan.html | OG-21_Home_Energy_Shelter_Upgrade_Plan.pdf | `/resources/home-energy-and-shelter-upgrade-plan.NZ.pdf` | `/resources/home-energy-and-shelter-upgrade-plan.AU.pdf` | `37d47fd51113…` | `ea3ccf3b770d…` |
| res-1022 | OG-22_Resilience_Product_Wishlist.html | OG-22_Resilience_Product_Wishlist.pdf | `/resources/resilience-product-wishlist.NZ.pdf` | `/resources/resilience-product-wishlist.AU.pdf` | `b40485520512…` | `a13c1245c193…` |
| res-1023 | OG-23_Supplier_Question_Bank.html | OG-23_Supplier_Question_Bank.pdf | `/resources/supplier-comparison-worksheet.NZ.pdf` | `/resources/supplier-comparison-worksheet.AU.pdf` | `5178e066ae34…` | `5d1658a8ae05…` |
| res-1025 | OG-25_Project_Support_Brief_Template.html | OG-25_Project_Support_Brief_Template.pdf | `/resources/project-support-brief-template.NZ.pdf` | `/resources/project-support-brief-template.AU.pdf` | `6a4f8ef42cd5…` | `418e78d55988…` |
| res-1026 | OG-26_3-Tier_Budget_Planner.html | OG-26_3-Tier_Budget_Planner.pdf | `/resources/3-tier-budget-planner.NZ.pdf` | `/resources/3-tier-budget-planner.AU.pdf` | `0a866302d5c3…` | `ce5a780282dd…` |
| res-1027 | OG-27_90Day_Implementation_Roadmap.html | OG-27_90Day_Implementation_Roadmap.pdf | `/resources/90-day-implementation-roadmap.NZ.pdf` | `/resources/90-day-implementation-roadmap.AU.pdf` | `4487411b4d3f…` | `2b831e65c18e…` |
| res-1504 | OG-B04_Monthly_Planning_Challenge_Template.html | OG-B04_Monthly_Planning_Challenge_Template.pdf | `/resources/monthly-planning-challenge-template.NZ.pdf` | `/resources/monthly-planning-challenge-template.AU.pdf` | `7e860f5c265b…` | `32c643681c03…` |
| res-1507 | OG-B07_Solar_Planning_Deep_Worksheet.html | OG-B07_Solar_Planning_Deep_Worksheet.pdf | `/resources/solar-planning-deep-worksheet.NZ.pdf` | `/resources/solar-planning-deep-worksheet.AU.pdf` | `8fe9a1263870…` | `2a4d269bc2c0…` |
| res-1508 | OG-B08_Water_Tank_Sizing_Placement_Guide.html | OG-B08_Water_Tank_Sizing_Placement_Guide.pdf | `/resources/water-tank-sizing-and-placement-guide.NZ.pdf` | `/resources/water-tank-sizing-and-placement-guide.AU.pdf` | `e3bbfb5d01f5…` | `cb130cc98128…` |
| res-1509 | OG-B09_Insulation_Heating_Upgrade_Checklist.html | OG-B09_Insulation_Heating_Upgrade_Checklist.pdf | `/resources/resilient-heating-and-insulation-upgrade-checklist.NZ.pdf` | `/resources/resilient-heating-and-insulation-upgrade-checklist.AU.pdf` | `38b85d6942ed…` | `c34c64c437d1…` |
| res-1510 | OG-B10_90Day_Roadmap_Advanced.html | OG-B10_90Day_Roadmap_Advanced.pdf | `/resources/90-day-implementation-roadmap-advanced.NZ.pdf` | `/resources/90-day-implementation-roadmap-advanced.AU.pdf` | `d51337d6207f…` | `3553431ef5a2…` |
| res-1512 | OG-B12_OffGrid_System_Architecture_Planner.html | OG-B12_OffGrid_System_Architecture_Planner.pdf | `/resources/off-grid-system-architecture-planner.NZ.pdf` | `/resources/off-grid-system-architecture-planner.AU.pdf` | `52966b32d0b5…` | `81c7e7355932…` |
| res-1024 | OG-24_Professional_Review_Selector.html | OG-24_Professional_Review_Selector.pdf | `/resources/professional-support-planner.NZ.pdf` | `/resources/professional-support-planner.AU.pdf` | `574a7308ad47…` | `460d17cb4b39…` |
| res-1028 | OG-28_Household_Responsibility_Roster.html | OG-28_Household_Responsibility_Roster.pdf | `/resources/household-responsibility-roster.NZ.pdf` | `/resources/household-responsibility-roster.AU.pdf` | `1b99def55b26…` | `52d9b9329df0…` |
| res-1029 | OG-29_30Day_Master_Action_Plan.html | OG-29_30Day_Master_Action_Plan.pdf | `/resources/household-action-plan.NZ.pdf` | `/resources/household-action-plan.AU.pdf` | `b8a5432752ac…` | `8781aea47ad7…` |
| res-1030 | OG-30_Upgrade_Pathway_Decision_Matrix.html | OG-30_Upgrade_Pathway_Decision_Matrix.pdf | `/resources/long-term-direction-planner.NZ.pdf` | `/resources/long-term-direction-planner.AU.pdf` | `eca257980ea8…` | `a29643746bbe…` |
| res-1502 | OG-B02_Emergency_Contacts_Info_Sheet.html | OG-B02_Emergency_Contacts_Info_Sheet.pdf | `/resources/household-contacts-sheet.NZ.pdf` | `/resources/household-contacts-sheet.AU.pdf` | `43272199d224…` | `a8467d92996…` |
| res-1514 | OG-B14_Community_Resilience_Network_Builder.html | OG-B14_Community_Resilience_Network_Builder.pdf | `/resources/local-support-network-planner.NZ.pdf` | `/resources/local-support-network-planner.AU.pdf` | `56f1b2a872e6…` | `b8da6fd4833a…` |

### Future OS integration fields (all resources)

`recommendationEligible: false` · `handoffStatus: INACTIVE` · `approvedHandoffRoute: null` · `entitlementContractStatus: NOT_APPROVED`. No active OS link exists or is created.

Findings and rulings: `admin-import/STAGE_10.19_CANONICAL_RESOURCE_AUDIT.md`, `admin-import/STAGE_10.19A_OWNER_GOVERNANCE_RULINGS.md` and `admin-import/STAGE_10.18C_OG24_CONTROLLED_STAGING.md`.

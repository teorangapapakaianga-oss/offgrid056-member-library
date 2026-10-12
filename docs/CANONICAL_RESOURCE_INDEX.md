# Canonical resource index

**Stage 10.19 · generated 2026-10-13 · governance document only.** The machine-readable companion is [canonical-resource-index.json](canonical-resource-index.json). Nothing here is read by the Library application, changes a route, a badge, a status or an entitlement, or contains protected content (short descriptions are withheld; they stay in the private resource records).

## Locked integration rules

1. The Member Resource Library remains separate from the OffGrid056 OS.
2. The Library must not depend on or share OS cookies, session tokens, localStorage, household state or authentication records.
3. Library saved, progress and browser state remain Library-owned.
4. The OS must never write directly into Library member state.
5. Any future OS recommendation into the Library must use a stable resource ID and approved Library metadata.
6. The OS must not proxy protected Library content, guess a resource URL or infer entitlement from authentication.
7. Authentication is not entitlement.
8. Real OS recommendation destinations remain inactive until the future entitlement/handoff contract is approved.
9. The Library remains the visual brand reference for OffGrid056.
10. No OS, Supabase, Railway or Cloudflare infrastructure change is part of this index.

## Schema (one record per real protected resource)

| Field | Meaning |
|---|---|
| stableResourceId | authoritative, permanent ID (`res-NNNN`) |
| legacyCode | the OG code from the 30-Day Programme source; never shown to members |
| title | member-facing title |
| resourceType / foundation / programComponent / category / topic | controlled classification (topic = category until a separate topic taxonomy exists) |
| shortDescription | member-facing description (withheld here; held in the private record) |
| owner / version / versionDate | content owner and version; only `publishedDate` is recorded today, so version is null |
| sourceFile / sourceLink | legacy source file names and the review-config entries; no external link is recorded |
| recordStatus | the stored `status` of the resource record (draft, published, archived): the build gate |
| migrationState | the operational-register state (LIVE = deployed to the private preview) |
| publicationStatus / proposedPublicationStatus | publicationStatus mirrors the stored record status today; the proposed controlled model is in the audit report |
| visibleBadge | what members see (Draft on the resource detail page) |
| accessTier / entitlementRequirement | UNDEFINED_OWNER_DECISION until the owner defines tiers; never derived from authentication, route access, badge or programme membership |
| canonicalRoute / routeSource / routeStatus | route taken from the record slug and confirmed in the build |
| marketAvailability / downloadAssets | NZ and AU files with route, SHA-256 and size |
| reviewStatus / lastReviewedDate | issue flags (a resource is not VERIFIED_CURRENT while any fact is unrecorded); no review date is recorded |
| collections / relatedResources / supersededBy / withdrawn / internalOnly / notes | as stored; no resource is superseded, withdrawn or internal |
| recommendationEligible / handoffStatus / approvedHandoffRoute / entitlementContractStatus | future OS integration fields, prepared and INACTIVE (false / INACTIVE / null / NOT_APPROVED) |

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
  "recordStatus": [
    "draft",
    "published",
    "archived"
  ],
  "proposedPublicationStatus": [
    "draft",
    "review",
    "approved",
    "live",
    "withdrawn",
    "superseded",
    "internal"
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
  ]
}
```

## Index (30 resources)

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

### Publication, badge, access and review

| ID | Record status | Register state | Visible badge | Access tier | Entitlement | Review status flags | Related (explicit) |
|---|---|---|---|---|---|---|---|
| res-1001 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA, NEEDS_OWNER_REVIEW | res-1013, res-1008, res-1015, res-1011, res-1019, res-1002 |
| res-1002 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA, NEEDS_ASSET_REVIEW | — |
| res-1003 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1001, res-1002, res-1022, res-1026, res-1027, res-1025 |
| res-1004 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1001, res-1002, res-1022, res-1003, res-1020, res-1512 |
| res-1006 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1002, res-1004, res-1008, res-1011, res-1013, res-1019 |
| res-1007 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1001, res-1002, res-1003, res-1026, res-1027 |
| res-1008 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1022, res-1026, res-1512 |
| res-1009 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1008, res-1010 |
| res-1010 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1008, res-1512 |
| res-1011 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | — |
| res-1012 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1011, res-1006 |
| res-1013 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1002, res-1015 |
| res-1014 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1008, res-1011, res-1013, res-1007 |
| res-1015 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA, NEEDS_OWNER_REVIEW | — |
| res-1017 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1015, res-1021 |
| res-1018 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1507, res-1019 |
| res-1019 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1018 |
| res-1020 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1018, res-1019, res-1021 |
| res-1021 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1015, res-1018, res-1019, res-1026 |
| res-1022 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1026 |
| res-1023 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1022, res-1025, res-1026, res-1027 |
| res-1025 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA, NEEDS_OWNER_REVIEW | — |
| res-1026 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1022, res-1027, res-1018 |
| res-1027 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA, NEEDS_OWNER_REVIEW | res-1026, res-1022 |
| res-1504 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | — |
| res-1507 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1018 |
| res-1508 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1008, res-1010, res-1009 |
| res-1509 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1015, res-1017, res-1019, res-1021 |
| res-1510 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA, NEEDS_OWNER_REVIEW | — |
| res-1512 | draft | LIVE | Draft | UNDEFINED_OWNER_DECISION | UNDEFINED_OWNER_DECISION | NEEDS_ENTITLEMENT_DECISION, NEEDS_BADGE_REVIEW, NEEDS_METADATA | res-1018, res-1019, res-1020, res-1026, res-1022 |

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

### Future OS integration fields (all resources)

`recommendationEligible: false` · `handoffStatus: INACTIVE` · `approvedHandoffRoute: null` · `entitlementContractStatus: NOT_APPROVED`. No active OS link exists or is created.

Findings, mismatches and recommendations are in `admin-import/STAGE_10.19_CANONICAL_RESOURCE_AUDIT.md`.

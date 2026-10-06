# Resource register

All 45 legacy resources and where each one stands.

**As at:** 6 October 2026, after Stage 9.60.

| State | Count |
|---|---|
| **Deployed** (private preview, draft) | **21** |
| **Prepared** — awaiting owner approval | **0** |
| **Blocked** — pending research | **2** |
| **Not started** | **22** |

---

## Deployed (21)

Each is a draft with NZ and AU files behind Cloudflare Access.

| Code | Title | Foundation / type | Safety blocks | Stage |
|---|---|---|---|---|
| OG-02 | Household Risk Identifier | general / worksheet | — | 9.13 |
| OG-08 | Water Storage Calculator | water / worksheet | drinking water (audited exemption from water treatment) | 9.39 |
| OG-09 | **Household Water Treatment Guide** | water / guide | drinking water · **water treatment** | 9.44 |
| OG-10 | Rainwater Harvesting Planner | water / planner | drinking water · working at height | 9.41 |
| OG-11 | 30-Day Pantry Builder | food / worksheet | food safety | 9.27 |
| OG-15 | Warm Home Scorecard | shelter / assessment | CO · indoor combustion · solid fuel | 9.19 |
| OG-18 | Solar Power 101 Workbook | energy / workbook | electrical · working at height | 9.31 |
| OG-19 | Battery Backup Planner | energy / planner | electrical · food safety | 9.29 |
| OG-20 | Alternative Energy Suitability Check | energy / assessment | generator · CO · electrical | 9.35 |
| OG-21 | Home Energy & Shelter Upgrade Plan | shelter / planner | electrical · solid fuel | 9.33 |
| OG-22 | Resilience Product Wishlist | general / worksheet | — | 9.23 |
| OG-25 | Project Support Brief Template | general / template | — | 9.13 |
| OG-26 | 3-Tier Budget Planner | general / planner | electrical · indoor combustion · CO · solid fuel · drinking water | 9.23 |
| OG-27 | 90-Day Implementation Roadmap | shelter / planner | electrical · CO · indoor combustion | 9.24 |
| OG-B04 | Monthly Planning Challenge Template | general / planner | — | 9.15 |
| OG-B07 | Solar Planning Deep Worksheet | energy / worksheet | electrical · working at height | 9.19 |
| OG-B08 | **Water Tank Sizing & Placement Guide** | water / guide | drinking water · working at height (audited exemption from fire-and-emergency) | 9.46 |
| OG-B10 | 90-Day Implementation Roadmap (Advanced) | general / planner | — | 9.13 |
| OG-B12 | Off-Grid System Architecture Planner | general / planner | generator · CO · electrical · solid fuel · drinking water | 9.37 |
| **OG-13** | **Healthy Home Air Audit** | air / assessment | **smoke alarms · mould & dampness · ventilation** · CO · solid fuel | 9.54 |
| **OG-17** | **Solid Fuel Heating Planner** | shelter / planner | solid fuel · smoke alarms · CO | 9.60 |

## Prepared — awaiting owner approval (0)

Nothing is waiting on an owner decision. OG-17 was approved and deployed at Stage 9.60 as resource #21 (shelter / heating, intermediate, 25 minutes, NZ 7 pages and AU 7 pages).

## Blocked — pending research (2)

| Code | Title | Blocked by |
|---|---|---|
| OG-16 | Grant Eligibility Insulation Planner | **grants research** — NZ programmes; AU state and territory schemes |
| OG-B09 | Insulation & Heating Upgrade Checklist | **gas research** — its heating comparison table prices a "Flued gas" option and gives it an efficiency band, which the Stage 9.57 detector reads as genuine gas teaching. The last real gas resource |

## Not started (22)

Ordered by foundation. "Notes" are the audit's safety exposure, which tells you which approved blocks a migration
would need.

### Water

**None.** The water pathway is complete: OG-08 → OG-10 → OG-09 → OG-B08 are all live.

### Shelter

| Code | Title | Notes |
|---|---|---|
| OG-B01 | QuickStart Resilience Checklist | solid fuel · drinking water |
| OG-B15 | Annual Maintenance Calendar | generators · solid fuel · electrical · drinking water |

### Air

**None.** OG-13 is live. There is no second Air resource yet, so there is no Air pathway.

### Food

| Code | Title | Notes |
|---|---|---|
| OG-12 | FIFO Rotation Tracker | — |
| OG-14 | Basic Survival Systems Mini-Plan | — |

### Energy

| Code | Title | Notes |
|---|---|---|
| OG-B02 | Emergency Contacts Info Sheet | — |
| OG-B03 | 5 Starter Product Guide | — |
| OG-B14 | Community Resilience Network Builder | — |

### General, planning and programme

| Code | Title | Notes |
|---|---|---|
| OG-01 | Home Resilience Scorecard | — · a Start Here candidate |
| OG-03 | Budget Pathway Selector | — |
| OG-04 | Property Profile Matrix | — |
| OG-05 | 5 Pillars Quick Reference | electrical · **"5 Pillars" is legacy framework wording** |
| OG-06 | 72-Hour Emergency Checklist | electrical |
| OG-07 | Week 1 Priority Lock Worksheet | — · heavy programme framing |
| OG-23 | Supplier Question Bank | — |
| OG-24 | Professional Review Selector | — |
| OG-28 | Household Responsibility Roster | electrical |
| OG-29 | 30-Day Master Action Plan | electrical · heavy programme framing |
| OG-30 | Upgrade Pathway Decision Matrix | electrical |
| OG-B05 | Community Call Prep Sheet | — |
| OG-B06 | Progress Tracker Wall Chart | — |
| OG-B11 | Building Consent Navigator | — · **consents research first** |
| OG-B13 | Resilience Insurance Documentation | generators · electrical · drinking water |

## Route clashes with demo placeholders

A real resource and a demonstration placeholder can want the same address. The reusable rule (Stage 9.39) lets the
real one supersede the placeholder **in the private preview only**.

| Code | Route | Placeholder | State |
|---|---|---|---|
| OG-08 | `water-storage-calculator` | res-0015 | **resolved and live** |
| OG-10 | `rainwater-harvesting-planner` | res-0016 | **resolved and live** (Stage 9.41) |
| OG-01 | `home-resilience-scorecard` | res-0007 (demo) | expected |
| OG-13 | `healthy-home-air-audit` | demo | **resolved and live** (Stage 9.54) |

## How a resource moves through this register

```
NOT STARTED
  → audit (claims, safety exposure, legacy content, market differences)
  → metadata proposed (no fallback defaults)
  → copy changes proposed (exact from → to, market variants marked)
  → NZ + AU previews rendered and verified   ⟶ PREPARED
  → owner approval                           ⟶ approved
  → re-render, verify the exact build, deploy ⟶ DEPLOYED (draft, behind Access)
```

Anything that cannot be verified from an official NZ or AU source **blocks** the resource instead of being guessed.

## Stage 9.62 note

No resource changed. OG-B09 expected blocks: gas-and-lpg-general, gas-installation-and-servicing (recommended), carbon-monoxide. OG-24 requires gas-and-lpg + gas-installation-and-servicing. OG-17 negative control confirmed.


## Stage 9.63 note

OG-B09: claims-first prepared, NOT migrated. Legacy has 6 R-values, 6 prices, 3 efficiency percentages; only gas content is the 'Flued gas' row. Awaiting owner decisions.


# Stage 9.64B — programme component alignment and OG-B09 finalisation

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Nothing deployed. No PDFs. OG-B09 not rendered and not added as protected resource #22.** The new schema field is source-only until the next deploy; the Worker is unchanged.

## 1. Programme-component architecture

**What it is.** A second classification on each resource: its *role in the member journey*. It sits beside, and does not replace, the Five Foundations (air, water, shelter, food, energy). Every resource keeps its foundation.

| Value | Label | Role |
|---|---|---|
| `off-grid-living` | Off-Grid Living | reduced dependence on centralised systems: independent energy, solar, batteries, generators, water capture/storage/treatment, food production, off-grid heating, fuel and waste systems, property/system architecture |
| `resilience-planning` | Resilience Planning | strengthening the household and moving toward partial or full independence: insulation, heating comparisons, warm-home planning, backup power, household assessments, scorecards, budgeting, phased upgrades |
| `resilience-emergency` | Resilience & Emergency | outages, emergency food and water, household safety, gas leaks, smoke alarms, emergency lighting, evacuation, communication, short-term disruption |
| `planning-implementation` | Planning & Implementation | budgets, project briefs, 30- and 90-day plans, implementation tracking, supplier/installer planning |
| `advanced-future` | Advanced / Future | full property independence, advanced system architecture, larger integrated systems, professional implementation, advanced planning |

**Where it lives.**
- `lib/content/constants.ts` — the vocabulary (`PROGRAM_COMPONENTS`, `ProgramComponent`).
- `lib/content/schemas.ts` — `programComponent` on the resource schema, an **optional** enum: a value outside the five fails validation; the 21 live resources carry none and are unaffected.
- `admin-import/config/program-components.json` — the definitions, the five alignment questions, and the explicit list of the **21 resources that predate the model**.
- `admin-import/pilot/prep.ts` — the record carries the component; the **programme-alignment rule** (below).

**The alignment rule (enforced).** Before a resource can be `READY_AFTER_FINAL_VALIDATION` it must have a foundation, a programme component, a category and a type, **and** have answered five questions: (1) which Five Foundation; (2) which programme component; (3) how it supports resilience, independence or off-grid living; (4) whether it is emergency guidance, resilience planning or true off-grid system guidance; (5) whether the member-facing wording matches that role. A missing component or an unanswered question holds the resource at `NEEDS_OWNER_METADATA`: **it stops for owner review before rendering.** Resources not in the pre-model list are always subject to it, so no future migration can skip it.

## 2. OG-B09 final metadata

| Field | Value |
|---|---|
| Title | **Resilient Heating & Insulation Upgrade Checklist** |
| Foundation | shelter |
| **Programme component** | **resilience-planning** — *not* a pure Off-Grid Living resource: it helps a household improve resilience and evaluate heating options through an independence lens |
| Category | insulation |
| Type | checklist |
| Difficulty | beginner (OWNER-APPROVED / INFERRED) |
| Estimated time | 30 minutes (OWNER-APPROVED / INFERRED) |
| Description | Check each room's insulation, then compare heating options against your household's energy, fuel and outage needs, and your own quotes, before you decide what to upgrade. (approved this stage) |
| Tags | `[]` |
| Status | draft |

**Its five alignment answers:** foundation *shelter — heating and insulation of the home* · component *resilience-planning* · role *reduce heat loss first, then compare options by the energy or fuel they depend on and what they do when household electricity is unavailable* · kind *resilience planning (assessment and comparison) — not emergency guidance, not off-grid system design* · wording matches role *yes — framed by energy or fuel source, electricity dependency and outage consideration; no ranking, no buyer-guide framing*.

## 3. Final heating table

Unchanged from Stage 9.64A, as you approved it. Heat pump (NZ) / **Reverse-cycle air conditioner (heat pump)** (AU) is kept and still states that it needs electricity, does not automatically provide outage heating, depends on generation/inverter/battery capacity and on the household energy system, and is not presented as the default. The wood burner keeps its independence framing; flued gas keeps its fuel-availability, model-dependency and outage framing.

| Heating Type | Energy / Fuel Source | Electricity Dependency | Resilience / Outage Consideration | Household Considerations |
|---|---|---|---|---|
| Heat pump · AU: Reverse-cycle air conditioner (heat pump) | Electricity | Needs electricity to run. | Will not run during an outage unless your household power system can supply it. Do not assume it works as outage heating. | Check that your generation, inverter and battery system can support it for the hours you intend to use it. Suitability depends on your household energy system. |
| Wood burner | Firewood or another suitable solid fuel | Does not usually need electricity to burn. | Independent space heating where suitable fuel, installation and local requirements are addressed. Can remain useful when household electricity is unavailable. | Needs a fuel supply you can store or reliably obtain, and installation and approval that meet local requirements. |
| Flued gas | Gas fuel supply | Depends on the model. | Depends on whether your household can keep a gas fuel supply available, and on whether the model needs electricity to run. | Check what the model needs and whether you can rely on the fuel supply during an outage. |
| Panel / convection | Electricity | Needs electricity to run. | Electricity-dependent resistance heating that adds directly to your household electrical load. | Keep it as a comparison option. Check whether your generation, inverter and battery system can support your intended use. |
| Underfloor electric | Electricity | Needs electricity to run. | Electricity-dependent; adds to your household electrical demand. | Suitability depends on your household energy system and how you intend to use it. |
| Central ducted | Depends on the system type | Depends on the system: the heat source and the distribution system may each need electricity. | Whether it stays usable when household power is unavailable depends on the heat source and on the distribution system. | Check the actual requirements of the system you are considering. |

Plus the blank member columns **Your Quote**, **Your Estimated Running Cost**, **Your Notes**. The decision questions and the closing ("There is no single heating system that suits every resilient or off-grid household…") are unchanged.

## 4. Final safety block set

`general-disclaimer`, `emergency-contact`, **`gas-and-lpg-general`** (the only gas block, NZ and AU), **`solid-fuel-heating`**, **`batteries-and-electrical`**. The generation / inverter / battery wording is **kept** (owner ruling) and the electrical block is **required, not suppressed**. No other gas block is triggered.

## 5. Related resources (approved)

res-1015 Warm Home Scorecard · res-1017 Solid Fuel Heating Planner · res-1019 Battery Backup Planner · res-1021 Home Energy & Shelter Upgrade Plan.

## 6. Validation

| Check | Result |
|---|---|
| Programme-component validation | OG-B09 classified; all five answers given; schema accepts the value; an invented value fails; unclassified new resources are held |
| Gas detector | `gas-and-lpg-general` only; available in NZ and AU; 0 unintended gas blocks |
| Solid-fuel detector | `solid-fuel-heating` carried; no disposition used |
| Batteries / electrical detector | **required by the member-facing text and carried** (tested) |
| Numeric (both markets) | **Bucket C = 0** |
| Price | 0 prices (the six legacy prices recorded as removed) |
| R-value targets / efficiency percentages / 2008 rule | 0 / 0 / 0 |
| Market separation | no NZ wording in AU, no AU wording in NZ; AU term only in the AU file |
| Existing library | **21 / 21 READY · 42 / 42 market files · Bucket C 0**; `import:verify-prep` verified |
| Private assets / PDFs / Worker | 64 files, none modified (newest 07:26, the OG-17 deploy); no PDF; Worker unchanged `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |
| Lint / typecheck | clean / clean |

## 7. Tests

**633 passing** (619 → 633: +13 programme-component tests, +1 electrical-detector test). Nothing removed.

## 8. Readiness to render

**Ready to render.** Every gate passes and OG-B09 is classified. Remaining decisions are yours to give in the order: render PDFs → protected resource #22 → deploy. One practical flag: the eight-column heating table is wide for print; the first render may need a smaller type size.

## 9. Recommendation for classifying the remaining legacy resources

**Principle.** Apply the alignment rule as each resource is migrated — not in a blind batch. The classifications below are *proposals*; the ones marked **?** are genuinely ambiguous under your definitions and should be decided once. **The 21 live resources are not blocked**; classifying them is optional metadata. Because the Worker serves the stored records, it needs a redeploy, so do it the next time a deploy happens anyway.

**Unmigrated (23):**

| Code | Resource | Proposed component |
|---|---|---|
| OG-01 | Home Resilience Scorecard | resilience-planning |
| OG-03 | Budget Pathway Selector | planning-implementation |
| OG-04 | Property Profile Matrix | resilience-planning **?** (property assessment, but your Off-Grid definition names property/system architecture) |
| OG-05 | 5 Pillars Quick Reference | resilience-planning **?** (a reference, not a journey step) |
| OG-06 | 72-Hour Emergency Checklist | resilience-emergency |
| OG-07 | Week-1 Priority Lock Worksheet | planning-implementation |
| OG-12 | FIFO Rotation Tracker | resilience-emergency |
| OG-14 | Basic Survival Systems Mini-Plan | resilience-emergency |
| OG-16 | Grant Eligibility Insulation Planner | resilience-planning (**market-blocker risk:** NZ-style grants; read official sources per market first) |
| OG-23 | Supplier Question Bank | planning-implementation |
| OG-24 | Professional Review Selector | planning-implementation (already audited: general + installation gas blocks) |
| OG-28 | Household Responsibility Roster | planning-implementation **?** (or emergency) |
| OG-29 | 30-Day Master Action Plan | planning-implementation |
| OG-30 | Upgrade Pathway Decision Matrix | resilience-planning |
| OG-B01 | QuickStart Resilience Checklist | resilience-planning **?** |
| OG-B02 | Emergency Contacts Info Sheet | resilience-emergency |
| OG-B03 | 5 Starter Product Guide | planning-implementation **?** (price risk) |
| OG-B05 | Community Call Prep Sheet | planning-implementation **?** (may be programme-specific; may not belong in the library) |
| OG-B06 | Progress Tracker Wall Chart | planning-implementation |
| OG-B11 | Building Consent Navigator | planning-implementation (consents research is unfinished; NZ/AU split) |
| OG-B13 | Resilience Insurance Documentation | resilience-planning **?** |
| OG-B14 | Community Resilience Network Builder | resilience-planning **?** |
| OG-B15 | Annual Maintenance Calendar | resilience-planning **?** (intervals are numeric claims) |

**Already live (21):** OG-02 resilience-planning · OG-08 resilience-emergency **?** · OG-09 off-grid-living · OG-10 off-grid-living · OG-11 resilience-emergency **?** · OG-13 resilience-planning · OG-15 resilience-planning · OG-17 off-grid-living · OG-18 off-grid-living · OG-19 resilience-planning (you listed backup power there) · OG-20 off-grid-living · OG-21 resilience-planning · OG-22 planning-implementation **?** · OG-25 planning-implementation · OG-26 planning-implementation **?** (you list *budgeting* under both Resilience Planning and Planning & Implementation) · OG-27 planning-implementation · OG-B04 planning-implementation · OG-B07 off-grid-living · OG-B08 off-grid-living · OG-B10 advanced-future · OG-B12 advanced-future **?** (system architecture is named under both Off-Grid Living and Advanced / Future).

**Two definitional overlaps for you to settle once:** *budgeting* (Resilience Planning vs Planning & Implementation) and *system architecture* (Off-Grid Living vs Advanced / Future). Each affects two or three resources.

## 10. Owner decisions remaining

1. Approve rendering OG-B09 (PDFs, NZ and AU).
2. Then, separately, protected resource #22 and deployment.
3. Rule on the two overlaps in §9 and whether to classify the 21 live resources at the next deploy.

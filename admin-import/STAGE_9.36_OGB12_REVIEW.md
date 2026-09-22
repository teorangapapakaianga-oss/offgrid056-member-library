# OG-B12 — OFF-GRID SYSTEM ARCHITECTURE PLANNER · REVIEW · NOT DEPLOYED

OG-B12 is ready for your review as **PREVIEW_WITH_PROPOSED_COPY**. Two things await your approval:

- its 23 proposed changes
- a scoped CO-alarm trim for its AU file (the same trim as OG-20)

**What the audit found:**

1. **OG-B12 is the resource that brings the household's systems into one plan.** It covers energy, water,
   sanitation, heating and food. It's a planner, but in places it slips into **system design**:
   - "230V AC house panel, 48V DC lighting circuit"
   - a "single-line diagram"
2. **It contains content that fails closed.** In both markets, OG-B12's **original** text is held by:
   - **GAS_SAFETY_REQUIRED:** **LPG** as a generator and heating fuel, and **biogas** as a digester and cooking fuel
   - **FUEL_GUIDANCE_REQUIRED:** **diesel** as a generator and heating fuel. The approved generator block covers
     petrol only.

   This is proven (§6). **Option A** (changes 7, 13, 16 and 19) removes those fuels. **If you reject Option A, OG-B12
   stays blocked.**
3. **It raises hazards with no approved block:** sanitation (greywater, blackwater, composting toilets, septic
   systems, humanure), waste burning, and home canning. These are flagged, and the proposals keep them at planning
   level.
4. **Its figures are unsourced:** battery "10-30kWh+", tanks of 20,000 / 1,000 / 100 L, and "firewood 3+ years
   cured".

**Live preview unchanged:** `77020e71`, 14 resources.
**Date:** 22 September 2026

---

## 1. OG-B12 audit

| | |
|---|---|
| Title (page header) | **Off-Grid System Architecture Planner**. The cover title had the code in it: "OG-B12 Off-Grid…". |
| Group | re-skin group B |
| Source | HTML/PDF pair |
| Audit | energy HIGH · planner HIGH |
| Audit notes | generators (6), solid fuel (4), batteries and inverters (10), stored drinking water (4) |
| Structure | Purpose box · "The Five Integrated Systems" (energy, water, waste and sanitation, heating and thermal mass, food) · System Integration Map (6 links) · My System Architecture Worksheet (4 boxes, 19 fields) · sketch area · closing |
| Legacy content | "Tier 4 Bonus — Advanced Resources" · "OffGrid056 30-Day Programme" · cover title "**OG-B12** Off-Grid…" · "Bonus —" · "Tier 4 Bonus Asset \| OffGrid056 30-Day Programme" · "Tier 4 Bonus Asset Complete" |
| Not present | Week/Day navigation, Next/Previous, Skool, Action Plan Plus |
| Products and brands | none named. The worksheet asked for an inverter "Brand", which is dropped. |

**Components, and how each is classified:**

| Component | Classification | Flag |
|---|---|---|
| Solar, wind, micro-hydro, backup generator (sources) | selection | — |
| Battery bank "10-30kWh+" | sizing | unsourced figure |
| Generator fuel reserve "(diesel/petrol/LPG)" | selection + fuel | **GAS / DIESEL**: fail closed |
| "230V AC house panel, 48V DC lighting circuit, USB charging" | integration → **technical design** | installation-level detail |
| BMS, inverter monitoring, voltage logging | operating (monitoring) | — |
| Roof, spring/bore, stream "(with consent)", water delivery | selection | NZ-only term "consent" in AU |
| Tanks 20,000 L / 1,000 L / 100 L | sizing | unsourced figures |
| First-flush, sediment, carbon, UV, chlorine dosing | selection (treatment chain) | the approved drinking-water block covers emergency storage |
| Pressure pump, gravity, backup pump | integration | — |
| Greywater to mulch pits or subsurface irrigation | **operating** | **unapproved hazard** (public health; local rules) |
| Composting toilet, septic tank with leach field, **biogas digester** | selection / **installation** | **unapproved hazard**; biogas is **GAS** |
| Burning solid waste | operating | **unapproved hazard** (fire, air rules, fire bans) |
| Passive solar, thermal mass, shade, ventilation | selection | — |
| Wood burner, heat pump "(if generator sized)", solar thermal, hydronics | selection + sizing | "if generator sized" is an unsourced dependency |
| Fuel: firewood "3+ years cured", **LPG**, **diesel** | fuel storage | unsourced figure; **GAS / DIESEL** |
| Vegetables, orchard, chickens, bees; soil methods | selection | — |
| Root cellar, dehydrator, **water-bath and pressure canning**, fermentation | selection | canning has a food-safety risk and no approved block; listed as methods only |
| Pantry, containers, rotation (FIFO) | selection | — |
| Integration map (solar→water, solar→heat, water→food, food→waste, waste→soil, heat→comfort) | dependency | humanure, biogas, and "closed loop achieved" flagged |
| Worksheet (energy, water, sanitation, heating and food) | sizing / planning (member fill-ins) | "Brand"; "Consent" wording |
| "single-line diagram" sketch | integration → **technical design** | an electrical design artefact |

**Not present:** grid connection or export, refrigeration sizing, communications, shelter structure. **Nothing was
added.**

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | Off-Grid System Architecture Planner | **SOURCE** (page header) |
| PDF title | Off-Grid System Architecture Planner — OffGrid056 | standard |
| Route | `/resources/off-grid-system-architecture-planner/` | |
| ID | res-1512 | |
| Foundation | energy | audit HIGH. **Alternative: general**, since it spans all systems. |
| Type | planner | audit HIGH |
| Category | **household-energy-planning** | **INFERRED**. Alternative: general → planning (*"Household planning across all five foundations"*). |
| Difficulty | **advanced** | **SOURCE-SUPPORTED**: the source labels itself *"Tier 4 Bonus — Advanced Resources"*. OWNER-REVIEW REQUIRED to confirm. |
| Time | **60 min** | **OWNER-REVIEW REQUIRED** · INFERRED: five systems, 19 worksheet fields and a sketch. Excludes the specialist resources and quotes. |
| Description | *"Design integrated energy, water, and shelter systems"* | **PROPOSED**: the cover subtitle without "Bonus —". Alternative: the Purpose line. |
| Tags | none | none invented |

## 3. System-architecture role

**Recommendation: yes, OG-B12 is the integration step.** It places each system in one household plan and shows how
the systems feed each other. **It shouldn't teach the detail itself**, so the proposals point to the specialist
resources instead:

| OG-B12 area | Detail lives in | How the proposals connect them |
|---|---|---|
| Solar sources | **Solar Power 101 Workbook** | related link |
| Battery size; capacity vs power; backup | **Battery Backup Planner** | *"Battery bank (size it with the Battery Backup Planner)"*; worksheet: *"Inverter Output (kW) — a separate check from battery capacity (kWh)"* plus *"Can the system supply backup power during an outage? (ask your installer)"* |
| Wind, micro-hydro, generator choice | **Alternative Energy Suitability Check** | related link; *"(see Using a generator safely)"* |
| Costs | **3-Tier Budget Planner** | related link |
| What to buy | **Resilience Product Wishlist** | related link |
| Emergency drinking water | the approved drinking-water block | tank sizes rewritten without numbers |

**The Household Risk Identifier** was reviewed and **not linked**. It identifies hazards; OG-B12 designs systems. The
connection is weak.

## 4. Dependency map (as the proposals present it)

```
ENERGY   sources (solar / wind / micro-hydro / generator)
           → inverter  [output kW — a separate check from battery capacity kWh]
           → battery   [size with the Battery Backup Planner]
           → distribution (switchboard, any DC circuits, USB)   ← designed and installed by a licensed electrical worker (NZ) / licensed electrician (AU)
           → backup during outages?  ← ask your installer (not assumed)
         generator → fuel reserve  [see Using a generator safely]  (petrol only; no inlet or wiring instructions here)

WATER    capture (roof / spring / bore / stream [NZ: with consent | AU: check the water rules that apply])
           → storage (main tank, header tank, emergency containers — sized to household use and rainfall)
           → treatment chain (first-flush → sediment → carbon → UV or chlorine)
           → distribution (pressure pump / gravity / backup pump)

WASTE    greywater → reuse (not on edible crops) ← check with your council first
         blackwater → composting toilet or septic ← approval and professional design and installation

HEAT     passive design → wood burner / heat pump (check your power supply) / solar thermal
         fuel → firewood, kept dry and rotated

LOOPS    solar → water pumping · solar → heat · water → food · food → compost · heat → comfort
```

**No step is an installation instruction.** Each technical step names who does it, or which resource sizes it.

## 5. Claims table

| # | Original | Type | Action |
|---|---|---|---|
| C1 | *"Lithium battery bank (10-30kWh+)"* | capacity (kWh) | **REMOVE**: size it with the Battery Backup Planner |
| C2 | *"230V AC house panel, 48V DC lighting circuit"* | voltage / technical design | **REWRITE** as a concept, with a licensed installer |
| C3 | *"Main tank (20,000L+), header tank (1,000L), emergency jerry cans (100L)"* | storage | **REMOVE**: sized to use and rainfall |
| C4 | *"Firewood (3+ years cured)"* | fuel / storage | **REWRITE**: *"keep a dry store and rotate stock"* (AU block: *"burn only dry, clean wood"*) |
| C5 | *"heat pump (if generator sized)"* | sizing dependency | **REWRITE**: *"check your power supply can run it"* |
| C6 | *"Closed loop achieved."* | outcome claim | **REMOVE** |
| C7 | *"Wood burner cooks and heats simultaneously."* | universal claim | **REWRITE**: *"A wood burner with a cooktop can…"* |
| C8 | *"Greywater extends growing season."* | claim | **REWRITE**: *"can help where your council allows it"* |
| C9 | *"not on edible crops"* | greywater safety point | **KEEP** |
| C10 | *"Excess summer solar powers pump to fill tanks to maximum before winter."* | integration concept | **KEEP** |
| C11 | *"North-facing glazing"* | orientation | **KEEP**: correct for both markets (EECA, energy.gov.au) |
| C12 | Worksheet fields: "Battery Capacity (kWh)", "Total Storage Capacity (Litres)", "Days of Autonomy", "Growing Area (m2)", "Months of Food Autonomy" | the member's own figures | **KEEP** |
| C13 | *"Inverter Capacity (kW) and Brand"* | power output / brand | **REWRITE**: output kW as a separate check; brand dropped |

**Not in OG-B12:** wattages, runtimes, efficiency percentages, costs, lifespans, distances, fuel use, temperatures,
treatment doses, boiling times. **No figures were added.**

## 6. Required safety blocks

| Block (approved) | Trigger in OG-B12's own text | Where it applies | Essential? | Overlap to trim? |
|---|---|---|---|---|
| **Using a generator safely** | "backup generator", "generator fuel reserve", "Backup Generation" | energy system; fuel reserve | **yes** | leads on generator connection and fuel |
| **Carbon monoxide** | generator (audit note: *"no carbon monoxide … warning"*); wood burner | energy and heating | **yes** | **AU: alarm sentence duplicated.** PROPOSED scoped trim for OG-B12 AU, the same as OG-20 (pending your approval) |
| **Batteries and electrical safety** | battery bank, inverter, distribution, BMS | energy system | **yes** | **automatic:** its generator lines drop because the generator block is present (the canonical block is unchanged) |
| **Wood burners and open fires** | "Wood burner (primary)", firewood fuel | heating | **yes** | none |
| **Storing drinking water** | roof rainwater, bore, treatment chain, storage | water system | **yes** | none. Tank sizes were removed, so there are no competing figures. |

**All five are genuinely triggered, not added automatically.** No other approved block applies:

- food safety in a power cut: not triggered ("pantry" once)
- working at height: no roof task
- indoor combustion: covered by the generator block

**Hazards with no approved block (flagged, not improvised):**

- sanitation
- waste burning
- home canning

The proposals keep sanitation at planning level, with *"check with your council"* and *"approval and professional
design and installation"*. They remove waste burning and humanure. **Canning stays as a named method only.** If you
want it kept with guidance, that needs its own research.

**Fail-closed proof.** I prepared OG-B12's **original** text, without Option A. Both markets were **blocked**:

- `GAS_SAFETY_REQUIRED: "LPG"`
- `FUEL_GUIDANCE_REQUIRED: "diesel"`

The status was NEEDS_CONTENT_REVIEW. With Option A, the NZ and AU previews contain **no** LPG, biogas or diesel. The
only "LPG" left is the NZ CO block's *"gas and LPG heaters"*, which is outside the check.

**Tooling change:** the fuel check now covers LPG, natural gas, biogas and dual-fuel **anywhere** in a resource's own
text, plus diesel. Before, it only caught gas next to "generator". **"Gas heater" is deliberately not matched,**
because the live, owner-approved OG-15 and OG-26 each name one in an options list. **All 14 live resources still
pass.** Tests pin this.

## 7. Overlap and trimming

1. **Electrical:** automatic, as with OG-20. The generator lines drop wherever the generator block is present. No new
   rule was needed.
2. **CO alarm, AU:** **a PROPOSED scoped trim** (`OG-B12.safetyBlockTrims`). It removes the CO block's alarm sentence
   from OG-B12's AU file only, because the generator block already has it.
   - **Needs your approval.** Until then, OG-B12 is held at preview.
   - **New rule:** an unapproved trim holds a resource, and a test covers this.
   - The canonical CO block is unchanged, and NZ has no duplicate.
3. **Print layout (all resources, future renders only):** safety blocks now stay whole on a page. OG-B12's NZ
   drinking-water block was split mid-sentence across pages 7 and 8.
   - **Deployed PDFs are not re-rendered**, so nothing live changes.
   - All 30 prepared files still verify.

## 8. NZ / AU differences

| Area | NZ | AU |
|---|---|---|
| Electrical distribution | *"designed and installed by a licensed electrical worker"* | *"…by a licensed electrician"* |
| Stream water | *"stream (with consent)"* (source, unchanged) | *"stream (check the water rules that apply)"*. No national rule, because it varies by state and territory. |
| Sanitation approvals | worksheet *"Consent Requirements (if any)"* | *"Permits or Approvals Needed (if any)"* |
| Council checks | *"check with your council"* | the same. Councils handle these in both markets. |
| Generator | NZ block: 10-minute cool-down, RCD, no rain or lead lines | AU block: rain shelter, leads, CO alarm, no cool-down time |
| Drinking water | NZ block: 3 L per person per day for 3 days; bleach method | AU block: 10 L per person for 3 days; boil method |
| Emergency | 111 · Civil Defence | 000 + 112 · SES |
| Solid fuel | NZ block wording | AU block wording |
| Grid / export | not in OG-B12 | not in OG-B12 |

## 9. Exact proposed copy changes (23; PROPOSED, not approved)

**Groups:**

- **Market-specific:** 8–9 (distribution), 10 (AU stream), 22 (AU approvals).
- **OPTION A (removes the fuels that fail closed):** 7, 13, 16, 19.
- **Hazard flags (planning level):** 12, 13, 14, 17, 18.

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover tier label | Tier 4 Bonus — Advanced Resources | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Cover title | OG-B12 Off-Grid System Architecture Planner | Off-Grid System Architecture Planner |
| 4 | Cover subtitle | Bonus — Design integrated energy, water, and shelter systems | Design integrated energy, water, and shelter systems |
| 5 | Page header meta | Tier 4 Bonus Asset \| OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 6 | Closing heading | Tier 4 Bonus Asset Complete | System Plan Complete |
| 7 | Energy — storage **(OPTION A)** | Storage: Lithium battery bank (10-30kWh+), generator fuel reserve (diesel/petrol/LPG). | Storage: Battery bank (size it with the Battery Backup Planner) and a generator fuel reserve (see Using a generator safely). |
| 8 | Energy — distribution **(NZ)** | Distribution: 230V AC house panel, 48V DC lighting circuit, USB charging stations. | Distribution: How power reaches where you use it — for example the switchboard, any separate DC circuits and USB charging points. This is designed and installed by a licensed electrical worker. |
| 9 | Energy — distribution **(AU)** | the same | the same, with a **licensed electrician** |
| 10 | Water — capture **(AU)** | stream (with consent) | stream (check the water rules that apply) |
| 11 | Water — storage | Storage: Main tank (20,000L+), header tank (1,000L), emergency jerry cans (100L). | Storage: Main tank, header tank and emergency containers — sized to your household's use and your rainfall. |
| 12 | Greywater | Greywater: Kitchen and shower water to mulch pits or subsurface irrigation (not on edible crops). | Greywater: Reuse options such as mulch pits or subsurface irrigation (not on edible crops). Rules vary, so check with your council before you set anything up. |
| 13 | Blackwater **(OPTION A)** | Blackwater: Composting toilet, septic tank with leach field, or biogas digester. | Blackwater: Composting toilet or septic system. These need approval and professional design and installation — check with your council first. |
| 14 | Solid waste | Composting, burning (where permitted), recycling storage, landfill minimisation plan. | Composting, recycling storage, landfill minimisation plan. |
| 15 | Heating — active | heat pump (if generator sized) | heat pump (check your power supply can run it) |
| 16 | Heating — fuel **(OPTION A)** | Fuel: Firewood (3+ years cured), LPG, or diesel (store safely, rotate stock). | Fuel: Firewood — keep a dry store and rotate stock. |
| 17 | Integration — water → food | Stored rainwater irrigates garden during drought. Greywater extends growing season. | Stored rainwater irrigates the garden during drought, and greywater can help where your council allows it. |
| 18 | Integration — food → waste | … Humanure composts (separately). | *(sentence removed)* |
| 19 | Integration — waste → soil **(OPTION A)** | Compost returns nutrients. Biogas provides cooking fuel. Closed loop achieved. | Compost returns nutrients to the garden. |
| 20 | Integration — heat → comfort | Wood burner cooks and heats simultaneously. | A wood burner with a cooktop can cook and heat at the same time. |
| 21 | Worksheet — inverter | Inverter Capacity (kW) and Brand | Inverter Output (kW) — a separate check from battery capacity (kWh) **+ new field:** Can the system supply backup power during an outage? (ask your installer) |
| 22 | Worksheet — approvals **(AU)** | Consent Requirements (if any) | Permits or Approvals Needed (if any) |
| 23 | Sketch area | Draw or describe your single-line energy and water flows. | Draw or describe your energy and water flows — a simple sketch for your own planning, not an electrical design. |

**Each change was checked against the re-skinned source, and all 23 apply.**

## 10. Related-resource recommendations

**Link:** Solar Power 101 Workbook (res-1018) · Battery Backup Planner (res-1019) · Alternative Energy Suitability
Check (res-1020) · 3-Tier Budget Planner (res-1026) · Resilience Product Wishlist (res-1022).

**Not linked:** Household Risk Identifier (weak connection); Home Energy & Shelter Upgrade Plan (it covers the same
ground as a summary).

**No back-links from live resources are proposed.**

## 11. NZ PDF readiness

| Check | Result |
|---|---|
| File | `off-grid-system-architecture-planner.NZ.pdf` |
| Pages | 8 |
| Title | Off-Grid System Architecture Planner — OffGrid056 |
| Emergency numbers | 111 only |
| Blocks | Using a generator safely · Carbon monoxide · Batteries and electrical safety (trimmed) · Wood burners and open fires · Storing drinking water. All present; the drinking-water block sits whole on page 8. |
| NZ wording | licensed electrical worker; *"stream (with consent)"*; *"Consent Requirements"*; 10-minute cool-down; 3 L per person per day |
| AU terms | none: no licensed electrician, Permits or Approvals, carport, battery-operated CO alarm, 10 L, 000, 112, SES, "Australia" |
| Removed content | none of: 10-30kWh, tank litres, "3+ years", diesel, biogas, humanure, waste burning, "closed loop", 230V/48V, "Brand", Tier 4, Bonus, 30-Day, OG-B12 |
| Distances | no 20-foot rule, no 20 m rule, no 50 L figure |
| Tokens · VERIFY · browser-error page | none |
| CO-alarm lines | 1 |
| Changes | all 23 applied |
| Flags | none |
| Draft | yes |

**Page 8** is the drinking-water block alone. It now prints whole instead of splitting mid-sentence.

**Status: PREVIEW_WITH_PROPOSED_COPY.**

## 12. AU PDF readiness

| Check | Result |
|---|---|
| File | `off-grid-system-architecture-planner.AU.pdf` |
| Pages | 7 |
| Title | Off-Grid System Architecture Planner — OffGrid056 |
| Emergency numbers | 000 + 112 only |
| AU wording | licensed electrician; *"check the water rules that apply"*; *"Permits or Approvals Needed"*; 10 L per person; battery-operated CO alarm |
| **CO-alarm lines** | **1** (the proposed scoped trim applied) |
| NZ content | no "New Zealand", "NZ", 111, Civil Defence, electrical worker, "with consent", "Consent Requirements", 10 minutes, "three litres" |
| LPG | **no "LPG" anywhere** |
| Other checks | the same as NZ |
| Status | the same as NZ |

**Checks run:**

- `import:verify-prep`: **30/30** files pass.
- The other 14 resources are all still READY_AFTER_FINAL_VALIDATION.
- The live build verifies as 14 records, 28 files, 0 broken links.

## 13. Tests

**298 passed** (288 + 10). Lint and typecheck clean.

**The ten new tests:**

- **Fuel checks:**
  - OG-B12's exact original gas, diesel and biogas lines are held
  - the OG-15 and OG-26 "gas heater" lists are left alone
  - diesel blocks both markets
- **Trims and layout:**
  - an unapproved scoped trim holds the resource at preview
  - safety blocks stay whole when printing
- **OG-B12 copy:**
  - no unsourced figures, installation detail, tiers or codes
  - no gas or diesel under Option A
  - each market's licence and approval terms
  - the OG-19 capacity/power and backup rule
  - the five blocks, with the trim still a proposal

**Adjusted:** the OG-20 trim test now counts owner-approved trims only.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `77020e71` |
| Deployed resources | the 14 are unchanged |
| Access | still blocks, including OG-B12's would-be URL and PDF |
| OG-B12 in GitHub | 0 files |
| `--real` | refused |

## 14. Deployment recommendation

**Do not deploy OG-B12 yet.** It needs these decisions:

1. **Option A** (changes 7, 13, 16, 19): remove LPG, biogas and diesel. **I recommend approving it.**
   - The alternative is to keep them, which holds OG-B12 until NZ/AU gas and diesel guidance is researched and
     approved.
2. **The hazard handling:**
   - sanitation at planning level, with council checks
   - waste burning and humanure removed
   - canning kept as a named method only
3. **The other changes** (legacy, figures, market variants, the capacity/power and backup fields). I recommend
   approving all of them.
4. **The AU scoped CO-alarm trim**, the same as OG-20.
5. **Metadata:** foundation **energy** (or general) · category **household-energy-planning** (or planning) ·
   **advanced** · **60 min**.

**After that:** re-render, verify, then deploy as the **15th** resource, with rollback to `77020e71`.

**Stopped. OG-B12 not deployed. OG-17 and OG-16 not started.**

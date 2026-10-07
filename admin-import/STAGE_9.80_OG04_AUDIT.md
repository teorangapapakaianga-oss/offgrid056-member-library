# Stage 9.80 — OG-04 claims-first audit

**Date:** 7 October 2026 · **Audit only.** OG-04 was not migrated, rendered, staged or deployed. Live baseline confirmed unchanged: 24 / 24 protected · 48 / 48 market files · 0 broken links · Bucket C 0 · Worker `89333107-7c0a-4bdb-8229-f2b5241a9e05` (100%) · 750 tests passing · lint and typecheck clean.

**Source read in full:** `OG-04_Property_Profile_Matrix.html` (12.9 KB) and `.pdf` (3 pages). Text extracted from the PDF and the HTML matches; nothing appears in one and not the other. Read-only; the source folder was not touched.

> **Title discrepancy — needs your confirmation.** Your brief calls OG-04 "Property **Type Review**". The legacy file, the scan and the Stage 9.64B register all call it "Property **Profile Matrix**" (Asset OG-04, Day 4). It is the same asset code. I treat "Property Type Review" as your intended library title (see §13); no migration has used either name yet.

## 1 · Purpose

A **property-situation intake plus a "what can I do" capability matrix**, from the old 30-Day Programme (Week 1, Day 4). The member picks one of six property profiles (Step 1), notes six property facts (Step 2), reads a profile × action Yes/No/"ask landlord" table (Step 3), and writes three personal rules: what I can do, what I cannot, what I must check first (Step 4).

**Primary output:** three member-written rules about what the property allows. So it is mainly **property classification / planning intake** (constraints on later choices), with a **programme-navigation wrapper** (Day 4 / "from Day 5 forward"). It is **not** a resilience assessment (no scoring, no gaps), **not** off-grid suitability (it does not assess sun, wind, water source or climate), and not project scoping. Its genuine, unique job is **tenure and dwelling constraints**: what the member is able and permitted to change.

## 2 · Legacy content inventory

| # | Legacy item | Class | Note |
|---|---|---|---|
| 1 | "Week 1 — Foundation", "OffGrid056 30-Day Programme", "Asset OG-04 \| Day 4" (cover and both page headers), "OFFGRID056.COM" | **REMOVE** | old programme labels (content flags: programme-sequencing ×3) |
| 2 | Title "Property Profile Matrix"; tagline "Pick your profile and get the right rules." | **REWRITE** | "get the right rules" implies the library tells the member what rules apply; it cannot (see item 8) |
| 3 | "Why Property Type Matters": "A renter cannot install solar panels"; "a lifestyle block owner must plan for water independence"; "a new build has different insulation standards than a 1970s home"; "what rules apply" | **REWRITE** | absolute, unsourced, market-specific claims. Keep the idea (your property shapes your options); drop the claims |
| 4 | Step 1 six profiles, each with a one-line description (e.g. "Standard homeowner. Can modify structure, install tanks, solar, insulation. Council consents may apply.") | **REWRITE** | keep the member-selection mechanic; the descriptions carry permission claims and mix tenure, dwelling type and lifecycle (§3) |
| 5 | "You can only pick one primary profile." | **REWRITE** | a single pick cannot describe a rural renter or an apartment owner (§3) |
| 6 | Step 2 six property facts: year built, floor area, storeys, land size, insulation status, roof type and condition | **KEEP_AS_MEMBER_INPUT** | blank fields for the member. "(sqm or sqft)" → one market-appropriate unit, to confirm |
| 7 | Step 3 capability matrix: 9 actions × 5 profiles = 45 Yes/No cells (solar, water tank, insulation, grow food, wood burner, backup generator, 30-day food supply, home battery) | **REMOVE** (replace) | unsourced absolute permissions, tenancy and consent law, and grant claims; incompatible with both markets. Replace with a member-completed "what is allowed / what do I need to ask or check" grid with no answers pre-filled |
| 8 | Cell wording: "Ask landlord", "Yes (council check)", "Yes (consent check)", "Yes (grants available)", "Build to code+", "Yes (design in)", "Portable only" | **VERIFY → REMOVE** | tenancy, consent, grant and building-standard claims; none sourced; "code+" has no meaning in either market |
| 9 | "Cheaper to build right than retrofit later" (new build) | **REMOVE** | a cost claim with no source (same class as the soft cost claim removed from OG-03) |
| 10 | "Multiple Properties / Estate … Staff or contractor management. Premium approach." | **REMOVE** | "Premium approach" is offer language; the profile has no column in the matrix (orphan); not a household resilience situation |
| 11 | "Body corporate rules apply" (apartment) | **VERIFY → REWRITE** | NZ term; Australian equivalents differ by state (§8) |
| 12 | Step 4 three rules: "I CAN do this", "I CANNOT do this (so I won't waste energy on it)", "I need to CHECK before doing this" | **KEEP_AS_MEMBER_INPUT** | the strongest part of the resource; rewrite "CANNOT" so it records what the member has confirmed, not a guess |
| 13 | "Day 4 Complete … Every action from Day 5 forward respects these rules." | **REMOVE** | promises programme behaviour the library does not have (content flag: day-complete) |
| 14 | "Next: OG-05 The 5 Pillars Quick Reference →" | **REMOVE** | obsolete code and programme sequencing (content flags: next-link, cross-reference) |
| 15 | "write the 3 rules that will guide your 30-day plan" / "Store 30-day food supply" | **REWRITE** / **REMOVE** | the 30-day plan is a programme concept; "30-day food supply" is an unsourced target, and the row goes with the matrix |
| 16 | Duplicate content | **NOTE** | none within the file. Conceptual overlap only (§12): solar, tanks, generator and battery rows pre-empt OG-20, OG-B12 and the water resources |

No price, subscription, product or tier language. No outdated links (the only link text is the "Next: OG-05" line, item 14).

## 3 · Property-type inventory

**Six profiles in Step 1:** Renter / Flat · Owned Home (Suburban) · Owned Home (Rural / Lifestyle Block) · New Build / Under Construction · Apartment / Townhouse · Multiple Properties / Estate.
**Five columns in the matrix:** Renter · Suburban Owner · Lifestyle Block · New Build · Apartment. "Multiple Properties / Estate" has no column, and the matrix gives no answers for it.

Are the legacy categories still useful? **Partly.** They mix three different questions:
- **Tenure** — renter, owner (Renter / Flat vs Owned Home).
- **Dwelling and land** — apartment/townhouse, suburban house, rural block with land.
- **Lifecycle** — new build vs existing (not tenure or type).

Because the six are not mutually exclusive, a single pick fails real households: a tenant in an apartment fits two profiles, a rural renter fits two, and an owner building new fits two. Tenure and dwelling type are the two properties that actually change what a member may do, and both are already named in the legacy list, so they can be asked as separate member answers without inventing a category. "Multiple Properties / Estate" has no matrix column and should be left out. Which labels survive is an owner decision (§15).

"Existing home" appears only implicitly (the comparison with "a 1970s home"). I did not invent it as a category.

## 4 · OffGrid056 alignment

OG-04 should be the **"what can I change here?" step**: the member records their situation and works out which later decisions are theirs to make, which need someone else's permission, and which need checking. That supports:
- **Resilience planning** — it is the property-side constraint on the plan that OG-01 and OG-02 start.
- **Household independence** — separates what the member controls from what a landlord, body corporate or council controls.
- **System selection** — gates later choices (solar, tanks, heating, generators) without making them; the system-by-system content stays in OG-20, OG-B12 and the foundation resources.
- **Implementation planning** — the "can / cannot / must check" rules feed OG-22, OG-26 and OG-27.
- **Off-grid readiness** — only indirectly (permission to modify), not suitability.

It must not become a real-estate worksheet: no valuation, no property features for their own sake, no buying advice. Step 2's facts should be kept only where a later resource uses them (insulation, roof, land) — year built, floor area and storeys are the weakest candidates and need the owner's ruling (§15).

## 5 · Foundation

**general (cross-foundation).** The content touches energy (solar, battery, generator), water (tank), shelter (insulation, wood burner) and food (grow food, pantry), and no single Foundation is the subject. Same as OG-03. Not forced into a Foundation.

## 6 · Program Component

Assessed against the locked five:

| Component | Fit |
|---|---|
| **resilience-planning** | **Best fit.** The primary output is the property's constraints on the plan; OG-01 and OG-02 sit here. Stage 9.64B recorded this as "resilience-planning **?**" because the Off-Grid definition names property/system architecture. |
| planning-implementation | Plausible alternative (the three rules direct later action), but the resource gathers context rather than produces a plan, budget or schedule |
| off-grid-living | Weak. The definition names property/system architecture, but OG-04 does not assess systems; that is OG-20 (off-grid-living) and OG-B12 (advanced-future) |
| resilience-emergency, advanced-future | No |

**Recommendation: resilience-planning — OWNER-REVIEW REQUIRED** (already flagged "?" in 9.64B). OG-04 has no entry in `program-components.json` yet; none is written in this stage.

## 7 · Member-journey role

Recommended: **OG-01 → OG-02 → OG-04 → OG-22 → OG-03 → OG-26 → OG-27** (OG-20 and OG-B12 later).
- **Before OG-04:** OG-01 (where do I stand) and OG-02 (which risks matter). Both are Start Here.
- **After OG-04:** OG-22 (what I want, now limited to what the property allows), then OG-03 (what I can spend), OG-26 (3-tier budget) and OG-27 (90-day roadmap). Later, OG-20 and OG-B12 use the "can / cannot / must check" rules for system choices.

The legacy order was budget (Day 3) then property (Day 4). I recommend property first because the wishlist and budget are only realistic once the member knows what they may change. OG-03's approved copy and its six related links are locked; linking OG-03 ↔ OG-04 would be a change to approved content and needs your approval. **Owner decision.**

## 8 · NZ / AU differences

The scan found no market-specific number or price. These wording and law points differ or may differ. I have not verified any of them against a source and treat none as applying to both markets:

| Item | Legacy wording | Issue |
|---|---|---|
| Tenancy | "Renter cannot install solar", "Ask landlord", "No" for tanks | tenancy law differs between New Zealand and each Australian state or territory; absolute statements are unsafe in both |
| Building / consent | "Council consents may apply", "council check", "consent check" | NZ building consent vs state-based approvals in Australia (council, private certifier); wording and process differ |
| Apartment governance | "Body corporate rules apply" | NZ term; Australian terms and rules are state-specific (strata, owners corporation) |
| Grants | "Yes (grants available)" | existence, scope and eligibility of any grant is market- and state-specific; unsourced |
| Property terms | "Flat", "Lifestyle Block", "wood burner", "Townhouse" | "Lifestyle block" and "wood burner" are common in NZ; the AU-equivalent terms need to come from the AU market check, not be assumed |
| Units | "sqm or sqft" | both markets are metric; one unit |
| Building standards | "Build to code+", "insulation standards" | different codes in each market |

A market-split check needs the prepared NZ and AU files, which do not exist for OG-04. The scan above is a manual terminology pass over the legacy text, not the prep AU-ism detector.

## 9 · Price findings

Price detector (member-facing HTML): **0 detections** — 0 PRICE, 0 PLACEHOLDER, 0 NOT_A_PRICE. No product, tier, subscription or fee language.
Price-adjacent wording that the detector does not and cannot flag: "Cheaper to build right than retrofit later" (cost claim, item 9), "grants available" (financial benefit claim, item 8) and "Premium approach" (offer language, item 10). All three are removed or verified under §2.

## 10 · Numeric findings

Numeric scan, NZ and AU: **3 candidates, all D_NOT_A_CLAIM, Bucket C = 0** in both markets. All three are programme-length wording ("30-Day Programme", "Store 30-day food supply", "your 30-day plan").

Full manual inventory (the scanner finds only the three above):
- **Member-input fields (keep):** year built (approximate), floor area, number of levels/storeys, land size, insulation status (ceiling, walls, floor), roof type and condition. None carries a threshold.
- **Factual or quasi-factual claims (remove or verify):** "1970s home" with different insulation standards (an age/date claim the scanner does not flag; unsourced); "Build to code+"; "30-day food supply"; "Multiple Properties". No distance, percentage, threshold, duration or quantity claim exists beyond these.
- **Structure counts (not claims):** 6 profiles, 5 matrix columns, 9 actions, 3 rules, "Day 4" and "Day 5", "Week 1".

Detector gap, noted and not fixed: the numeric scanner does not recognise decade references such as "1970s". I did not change any detector.

## 11 · Safety findings

Safety-topic detector: **batteries-and-electrical** (HTML and PDF both), from five mentions: solar panels ×3, backup generator, home battery system. Fuel/gas teaching signals: none. Fire/smoke/CO: 0 detector mentions.

Does it genuinely trigger a block? **Not on current content, which offers no instruction.** Every mention is a one-word entry in the capability matrix ("Install solar panels — No/Yes"), not guidance on installing or running anything. If the narrowed rewrite names solar, batteries or generators only as things to ask permission about, the detector will still require the existing batteries-and-electrical block, exactly as it does for OG-01. That block already exists in `safety-blocks.json`; no new wording is invented. If the rewrite drops those words, the topic does not trigger. **Owner decision.**

Checked and **not triggered** by the detector, and not added: gas (none), fire/smoke ("wood burner / fireplace" row — a heating appliance with a real fire and carbon-monoxide dimension, but the row is removed with the matrix), structural ("modify structure"), water ("install tank", "septic"), roof ("roof type and condition" is a member input, not instruction). No block is proposed for incidental wording.

## 12 · Overlap

| Resource | Role | Overlap with OG-04 |
|---|---|---|
| OG-01 Home Resilience Scorecard | scores household resilience across foundations | none on purpose; OG-04's Step 2 touches insulation and roof, which OG-01 may also cover (to confirm in the OG-01 text) |
| OG-02 Household Risk Identifier | which risks apply | none |
| OG-20 Alternative Energy Suitability Check | which energy sources suit a property's conditions (wind, stream, climate, budget), with prices and outputs | OG-04's solar/generator/battery rows pre-empt it; OG-20 asks what the **site** offers, OG-04 asks what the **member may change** |
| OG-B12 Off-Grid System Architecture Planner | advanced design of five integrated systems | the property facts and constraints would feed it; OG-04 designs nothing |

**OG-04 has a unique role:** it is the only resource that records tenure and dwelling constraints (what the member is allowed to change), and it comes before OG-20, OG-B12 and the foundation resources. Nothing is to be merged or retired on this evidence.

## 13 · Proposed metadata (draft, nothing written)

| Field | Proposal |
|---|---|
| Title | **Property Type Review** (your brief's name; legacy "Property Profile Matrix") — OWNER-REVIEW REQUIRED |
| Foundation | general |
| Program Component | resilience-planning — OWNER-REVIEW REQUIRED |
| Category | planning (as OG-02, OG-03, OG-22) — OWNER-REVIEW REQUIRED |
| Type | worksheet |
| Difficulty | beginner — OWNER-REVIEW REQUIRED |
| Estimated time | 15 minutes — OWNER-REVIEW REQUIRED |
| Description | "Record your tenure and property type, then note which changes are yours to make, which need someone else's permission and which you need to check first." — OWNER-REVIEW REQUIRED (draft; no claims) |
| Tags | property, tenure, planning — OWNER-REVIEW REQUIRED (check against existing tags before use) |
| Status | draft |
| Collections | planning-tools — OWNER-REVIEW REQUIRED (a member-completed worksheet; not Start Here) |

## 14 · Recommendation — **NARROW**

Keep the one useful core — the member records their situation and writes three rules (can / cannot / must check) — and remove everything else: the programme wrapper, the 45-cell capability matrix, every tenancy, consent, grant and cost claim, "Premium approach", and the Estate profile. KEEP is wrong because the matrix states unsourced legal and permission claims as fact in two markets. REWRITE is wrong because the structure and the three-rules mechanic are worth keeping. MERGE_CONCEPTUALLY and RETIRE are wrong because no other resource records tenure and dwelling constraints (§12).

## 15 · Owner decisions required

1. **Title:** "Property Type Review" or the legacy "Property Profile Matrix" (or another).
2. **Program Component:** resilience-planning (recommended) or planning-implementation.
3. **Category:** planning (as proposed) or another existing category.
4. **Property types:** replace the single six-way pick with separate member answers for tenure (own / rent) and dwelling type (house / apartment-townhouse / rural property with land) and a "building new" yes/no, all taken from the legacy list; and drop "Multiple Properties / Estate".
5. **Step 2 property facts:** keep all six, or only those a later resource uses (insulation, roof, land)?
6. **Capability matrix:** confirm removal, replaced by a blank member-completed "allowed / ask / check" grid with no pre-filled answers.
7. **Market-specific wording:** confirm that no tenancy, consent, body-corporate, grant or building-standard statement is carried, so the copy can be market-neutral, as OG-03 was.
8. **Safety:** whether the rewrite names solar, batteries or generators (which brings the existing batteries-and-electrical block) or avoids them.
9. **Member journey:** confirm OG-04 sits after OG-02 and before OG-22 (not after OG-03), and whether to link OG-03 ↔ OG-04 (OG-03's approved related links change).
10. **Collections:** planning-tools (proposed) or none.
11. **Difficulty, time, tags, description:** confirm or change the proposals in §13.

## Validation

Price scan, numeric scan (NZ and AU), safety scan, legacy-language scan: run (`workspace/og04-detect.mts`, git-ignored). Market scan: manual only (§8). Overlap check: conceptual (§12). Lint clean, typecheck clean, 750 of 750 tests passing. `import:verify-build`: 24 records · 48 market files · 0 broken internal links. Live Worker `89333107-7c0a-4bdb-8229-f2b5241a9e05` at 100%, unchanged. No file under `private-assets/`, `data/` or `public/` changed.

**Stopped before migration or PDF generation.**

# OG-B08 — WATER TANK SIZING & PLACEMENT GUIDE · PREPARED FOR OWNER REVIEW (NOT DEPLOYED)

**Date:** 23 September 2026 · **Stage:** 9.45

**Nothing was deployed.** Worker still `ac0d053a-8abd-4965-8bfe-3cae8ea943a5` with **18** draft resources;
`private-assets/` unchanged (54 files, 18 records — OG-B08 is **not** staged); public `data/resources` still 30 demo
records; `--real` refused.

---

## 1. Push confirmation

`git push origin main` → `627ad87..1434a31  main -> main`. **`origin/main` = `1434a31862ff551284f37befbb4bbc0d1b37659b`**,
containing `admin-import/STAGE_9.44_OG09_DEPLOYMENT.md` and the Stage 9.44 code (the `title` override in prep and the
CLI, the exemption teaching-signal test, the register updates). The local branch and the remote are identical.

## 2. OG-B08 audit

**Source:** `OG-B08_Water_Tank_Sizing_Placement_Guide.html` (10 KB, one cover + two content pages).

| Category | Found |
|---|---|
| Visible OG codes | none in the body; the header carries **"Bonus Asset \| Tier 3"** |
| Old programme navigation | none (no Day/Next links) |
| Old branding | cover label **"OffGrid056 Action Plan Plus"**, `OFFGRID056.COM`, and the **Week 3 shelter cover image on a water resource** |
| Old tiers | **"Tier 3"** |
| Old CTAs | none |
| Unsupported figures | six lifespan ranges, a four-level cost column, "Within 3m of downpipes", "1,000L standard", "Not for above 1,000L without stand" |
| Treatment instructions | **none** — see item 7 |
| Plumbing advice | none beyond "council consent required?" |
| Structural claims | "engineered stand", "Not for above 1,000L without stand", "Heavy — needs crane" |
| Site-placement rules | the 8-point checklist (level ground, 3m, egress, access, overflow, trees, dark, secure) |
| Tank sizes | no size table; the only capacity is IBC "1,000L standard" |
| Weights | none stated (the guide never mentions weight, though it warns about "foundation damage") |
| Foundation/base requirements | "Before you pour the pad", "Level ground or engineered stand" |
| Clearance distances | **"Within 3m of downpipes (ideally)"** — the only one |
| Overflow/drainage claims | "Overflow can drain away from foundations" |
| Pump claims | none |
| Consent/permit claims | "council compliance issues", "Council consent required? □ Yes □ No" |

**Detectors:** `safetyExposureFor` → **stored-drinking-water** (7 mentions) and **fire-and-emergency** (three fire
words: "bushfire zones", "fire resistance", "fire egress paths"). Working-at-height is not triggered by the source;
it is carried anyway because the migrated text asks for gutters and the roof catchment to be kept clear.

### Claims classification (item 14)

| # | Claim | Verdict |
|---|---|---|
| 1 | Lifespans: 15–20 / 50+ / 20–30 / 30–50 / 5–10 / 10–15 years | **REMOVE** — no source; manufacturer- and site-specific |
| 2 | Cost column `$` → `$$$$` | **REMOVE** — unsourced, and one scale across two markets |
| 3 | "Not for above 1,000L without stand" | **REMOVE** — a structural rule with no source |
| 4 | "Heavy — needs crane" | **REWRITE** → "how it will be delivered and placed, and what the site access needs to be" |
| 5 | "Good for bushfire zones" | **REMOVE** — an unsourced fire-performance claim (and AU-specific) |
| 6 | "Liner required" / "Can rust if liner fails" | **REWRITE** → ask the supplier what the coating or liner is and how to check it |
| 7 | "304/316 stainless", "No liner needed. Hygienic." | **REWRITE** → NSW Health's material list with AS/NZS 4020 and AS 2070, no hygiene claim |
| 8 | IBC "1,000L standard" | **REMOVE** — the row goes with the comparison table |
| 9 | "Within 3m of downpipes (ideally)" | **REMOVE** — an invented distance |
| 10 | "Level ground or engineered stand" | **REWRITE** → MBIE's stand rules (NZ) / manufacturer and professional (AU), plus "not DIY engineering" |
| 11 | "Not blocking fire egress paths" | **REWRITE** → "Not blocking escape routes or access for emergency services" |
| 12 | "Overflow can drain away from foundations" | **REWRITE** → MBIE: contained on your property or diverted to stormwater, with liability (NZ); council (AU) |
| 13 | "Dark or covered to prevent algae" | **KEEP**, sourced — MBIE (NZ) and NSW Health's opaque-material wording (AU) |
| 14 | "Secure from tampering / children" | **KEEP**, sourced — MBIE's tap lock and warning sign (NZ); NSW Health's sealed access cover (AU) |
| 15 | "Accessible for cleaning and maintenance" | **KEEP**, expanded to desludging and screen checks |
| 16 | "Not under overhanging trees" | **KEEP**, with gutter clearing routed to the ground or a contractor |
| 17 | "causes algae, contamination, foundation damage, and council compliance issues" | **REWRITE** — "foundation damage" replaced by "a base that can carry the weight" |
| 18 | "Council consent required? Yes/No" | **REWRITE** per market — NZ names MBIE's actual triggers, including that not every tank needs one; AU routes to council, state and territory |
| 19 | 1 mm screens (added, AU only) | **KEEP_AS_EXAMPLE** — NSW Health, labelled as an example, as in OG-10 |
| 20 | Water weight ≈ 1 kg per litre (added) | **KEEP** — MBIE states it; framed as a conversion, never as a design figure |

**Verified sources used:** Building Performance (MBIE), *Collecting and using rainwater* (last updated 15 Jan 2026);
NSW Health, *Managing rainwater tanks for safe drinking water* (current as at **11 September 2026**, read live today).

## 3. Proposed metadata

| Field | Proposed | Basis |
|---|---|---|
| title | **Water Tank Sizing & Placement Guide** | unchanged — it still describes the resource |
| resourceType | **guide** | **SOURCE-SUPPORTED** (audit HIGH) |
| foundation | **water** | **SOURCE-SUPPORTED** (audit HIGH) |
| category | **household-water-planning** | **OWNER-REVIEW REQUIRED** — the alternative is `water-storage` |
| difficulty | **intermediate** | **INFERRED · OWNER-REVIEW REQUIRED** — site judgement, supplier questions and a council check, a step beyond the beginner calculator |
| estimatedTime | **25 min** | **INFERRED · OWNER-REVIEW REQUIRED** — five-row table, ten-point checklist, twelve-field plan; excludes quotes, council checks and installation |
| description | "Turn the litres you need into a tank you can site: materials, the base and the overflow, access for maintenance, and which parts are a supplier, plumber, professional or council job." | replaces the cover subtitle, which promised "council requirements" as if one rule existed |
| tags | **[]** | no reviewed tag vocabulary yet — the convention across all 18 live resources |

## 4. Tank-sizing findings

**No size is prescribed, and none is invented.** The source carried no size table, so nothing had to be removed
except the IBC "1,000L standard".

Both markets now say: *"How big? That comes from two numbers you already have — what your household needs (the Water
Storage Calculator) and what your roof can supply (the Rainwater Harvesting Planner). **There is no single right tank
size** … Two smaller tanks can give redundancy that one large tank cannot."* AU adds *"and no national Australian
figure"*.

**MBIE's published example sizes (240 L barrel, 500 L+, 5,000, 10,000, 30,000 for sole supply) are deliberately NOT
repeated here.** They already live in OG-10, labelled as NZ published planning guidance and examples; repeating them
in a second resource is how a labelled example turns into a rule. A test asserts that the only capacity figure
anywhere in OG-B08's copy is the **1,000-litre weight illustration**.

## 5. Placement findings

| Topic | NZ (MBIE-sourced) | AU (NSW-labelled and planning-level) |
|---|---|---|
| Ground and weight | about a kilogram per litre — a full 1,000-litre tank is about a tonne | same conversion, no jurisdictional claim |
| Stand | robust, concreted in, over 30cm and under one metre; **over one metre generally needs a building consent** | manufacturer's requirements; a qualified professional where the site needs one |
| Below ground | **consult a structural engineer** (MBIE) | manufacturer and professional; sealed ground-level covers (NSW Health) |
| Light and algae | dark or covered (MBIE) | opaque material that excludes light (NSW Health) |
| Screens and covers | screen the inlet, keep the tank covered | fine insect-proof screens — **NSW Health gives 1 mm as an example** — and a sealed access cover |
| Overflow | contained on your property or diverted to stormwater; **you can be liable** | somewhere it can drain safely; check the council |
| Access | cleaning, desludging (MBIE: annually), screens, first-flush | inspection, desludging, screen checks |
| Gutters | kept clear — **from the ground, or by a contractor** | same |
| Security | tap lock and warning sign (MBIE) | sealed cover keeps animals and children out (NSW Health) |
| Emergency access | not blocking escape routes or access for emergency services | same |

**No setback or clearance distance is invented** — the legacy 3 m is gone, and a test fails on any `N m` figure in the
copy other than MBIE's own stand heights in the NZ file.

## 6. Structural-safety findings

Every structural decision is routed, not taught: *"**The base, the stand and anything the tank is fixed to are not DIY
engineering.** Follow the manufacturer's requirements, ask your supplier, and use an appropriately qualified
professional where the site needs one."* NZ adds MBIE's structural-engineer instruction for in-ground tanks and the
consent threshold for stands over one metre; AU routes to the council first, because building and planning rules
differ by council, state and territory.

**No slab thickness, no mix, no reinforcement, no footing depth, no retaining-wall design** — a test enforces their
absence. The weight conversion is stated so a member can ask the right question, not so they can design a base.

## 7. Treatment-trigger result (ruling 9)

| Layer | Treatment mentions | Teaching signals | Gates |
|---|---|---|---|
| **A. Legacy source** | **0** | **0** | NZ 0 · AU 0 |
| **B. Migrated own text** | **0** | **0** | NZ 0 · AU 0 |
| **C. Injected blocks** | the storage block's registered claims only | 0 | NZ 0 · AU 0 |

**OG-B08 does not teach treatment, incidentally or otherwise.** No classification and no exemption were needed for it:
the water-treatment block is **not** required, and the resource points members at the Household Water Treatment Guide
instead. The drinking-water framing uses the approved `stored-drinking-water` block plus the plain statement that
**water stored in a tank is not automatically safe to drink**.

**One exemption is proposed, and it is not about treatment.** The legacy source tripped the **fire** detector three
times ("bushfire zones", "fire resistance", "fire egress paths"). All three are removed in migration, no approved
`fire-and-emergency` block exists, and the migrated text contains **no fire wording at all** — so the exemption's
`allowedMentions` is empty and it lapses on any fire, smoke-alarm or evacuation wording. It is recorded as
**PROPOSED — requires owner approval before deployment**.

## 8. NZ regulatory findings

All from MBIE, and none generalised: a **building consent** is needed to connect a rainwater system to the plumbing of
a house that also has mains water, and the mains must be isolated by a **backflow prevention device installed by a
qualified plumber**; a tank on a **stand over one metre** high generally needs consent; **not every tank does** —
there is usually no problem installing smaller tanks for garden watering only; **overflow** must be contained on the
property or diverted to stormwater; consult a **structural engineer** for an in-ground tank; **some councils require
periodic testing** where the water is for drinking. The worksheet asks the member to record their own council's
answer rather than assuming one applies.

## 9. AU regulatory findings

**No national Australian rule is stated.** NSW Health's tank guidance is labelled NSW throughout (materials,
AS/NZS 4020, AS 2070, opaque material, 1 mm screens, sealed covers, in-ground seals), and NSW Health's own
instruction — *contact your local council for building or planning regulations for rainwater tanks in your area* — is
carried as the first step wherever the member lives. Plumbing goes to a **licensed plumber**, fixed electrical work
for a pump to a **licensed electrician**, and approvals to **council, state and territory**.

## 10. Proposed copy changes

**15 changes, all applied.** Every `from` was cut from the legacy file by script.

| # | Where | Markets | Change |
|---|---|---|---|
| 1 | Cover image | both | Week 3 shelter cover → the water cover, alt text "Water" |
| 2 | Cover label | both | "OffGrid056 Action Plan Plus" → "OffGrid056 Member Library" |
| 3–4 | Cover subtitle | NZ / AU | buying-guide promise → site-planning, market-specific |
| 5 | Page header | both | "Bonus Asset \| Tier 3" → "Water · Tanks" |
| 6 | Intro box | both | "foundation damage" and the "decades of clean water" promise → what the guide decides, plus the pointer to the calculator, the planner and the treatment guide |
| 7 | Materials heading | both | "Tank Type Comparison" → "Tank Materials, and How Big" |
| 8–9 | **Materials table** | NZ / AU | lifespans, costs, crane, bushfire, hygienic, 1,000L → MBIE's materials (NZ) / NSW Health's materials and standards (AU), plus the sizing paragraph |
| 10 | Placement heading | both | "Placement Rules" → "Where The Tank Goes" |
| 11–12 | **Site checklist** | NZ / AU | 3 m distance and "engineered stand" gone; MBIE / NSW Health wording in, "not DIY engineering" added, fire egress reworded |
| 13–14 | **Tank plan** | NZ / AU | type/capacity/consent Y/N → the two carried numbers, who does each job, the real consent triggers, overflow, access and treatment |
| 15 | Closing | both | "Water Tank Guide Complete" → "One Tank, One Place, One Plan" |

## 11. Related-resource recommendation

**`res-1008` (Water Storage Calculator) → `res-1010` (Rainwater Harvesting Planner) → `res-1009` (Household Water
Treatment Guide).** That is the journey the guide actually depends on: two of them supply its numbers and the third
answers the question it deliberately does not.

**OG-B12 (Off-Grid System Architecture Planner) was considered and left out** — it is a general architecture planner
rather than a water step, and a fourth link dilutes a clear path. Easy to add if you would rather have it.

## 12. Water Basics learning path — current vs proposed

**CURRENT** (`data/learning-paths/water-basics.json`): description *"DEMONSTRATION learning path: Water Basics."*,
steps `res-0014` → `res-0015` → `res-0017` → `res-0016`. All four are demo placeholders in the public build. In the
**private preview** the route override resolves two of them, so a member actually walks: Water Security Guide
(demo) → **Water Storage Calculator (OG-08, real)** → Water Storage Checklist (demo) → **Rainwater Harvesting Planner
(OG-10, real)**. The treatment guide is absent.

**PROPOSED** (not implemented): *Water Basics* — **OG-08 → OG-10 → OG-09 → OG-B08**
(`res-1008`, `res-1010`, `res-1009`, `res-1508`), with a written description replacing the DEMONSTRATION line.

**RATIONALE:** it is the order the member decides in — how much water you need, how much your roof can supply, how to
make it safe, and where the tank goes. Three of the four already exist as real resources; the fourth is this stage's
work. The two demo steps have no real equivalent yet, and a path that teaches should not be half demonstration.

**PLACEHOLDER IMPACT:** `res-0014` (Water Security Guide) and `res-0017` (Water Storage Checklist) lose their only
pathway entry. They remain demo resources in the public build and on the Water foundation page, so nothing 404s.
`res-0015` and `res-0016` are already superseded in the preview, so naming their real ids changes nothing a member
sees there.

**ROUTING IMPACT — the blocker:** `data/learning-paths/` is **public** data, while every real record lives only in
`private-assets/`. A path naming `res-1008`/`res-1009`/`res-1010`/`res-1508` would reference ids that do not exist in
the public build, and validation would fail it — correctly, since that is the rule that keeps members from broken
links. Implementing the proposal therefore needs one of:

1. **A private learning-path override**, staged exactly as the private records are (`private-assets/data-learning-paths/…`
   plus a step in `build:preview` and the validator). Smaller, and it mirrors what already works. **Recommended.**
2. **Extending route supersession from resources to learning paths**, so the public path stays demo and the preview
   swaps it. More machinery, and it hides the real path from the public build in a less obvious place.

**Nothing was changed.** The current path file is untouched.

## 13. NZ PDF readiness

| Check | Result |
|---|---|
| File | `water-tank-sizing-and-placement-guide.NZ.pdf` · **6 pages** |
| PDF title | Water Tank Sizing & Placement Guide — OffGrid056 |
| Emergency numbers | **111 only** |
| Blocks | Storing drinking water · Stay off the roof |
| Treatment gates | **0 findings** |
| NZ wording | MBIE; structural engineer; building consent; qualified plumber; licensed electrical worker; stand over 30cm and under one metre |
| AU wording | **none** — no NSW, WA Health, AS/NZS 4020, 000, SES, licensed electrician, "state or territory" |
| Removed | no lifespans, no `$` costs, no "Within 3m", no bushfire, no crane, no "Hygienic", no "1,000L standard", no Tier 3, no Action Plan Plus, no Week 3 |
| Tokens · VERIFY · legacy code | none |
| `import:verify-prep` | **pass** |
| Record | draft |

## 14. AU PDF readiness

| Check | Result |
|---|---|
| File | `water-tank-sizing-and-placement-guide.AU.pdf` · **6 pages** |
| Emergency numbers | **000 (and 112) only** |
| NZ wording | **none** — no MBIE, NIWA, Taumata Arowai, HE10148, 111, Civil Defence, building consent, "electrical worker", "New Zealand" |
| AU wording | NSW Health (labelled); AS/NZS 4020 and AS 2070; 1 mm as an example; licensed plumber; licensed electrician; council, state and territory; "no national Australian figure" |
| Everything else | as NZ: gates 0, removed content gone, no tokens, draft |

## 15. Tests

**376 passing** (368 → **+8**). Lint clean, typecheck clean.

The eight new tests: the lifespans, costs, crane and bushfire claims are gone; no tank size is prescribed and the only
capacity figure is the weight illustration; weight stays a conversion and no structural design wording appears; the
3 m clearance is removed and no `N m` figure survives outside MBIE's stand heights; each market routes to its own
trades and regulator with no crossing; Australian guidance is NSW-labelled with no national rule; tank water is never
implied safe and no treatment method is taught; and the blocks plus the **proposed** fire exemption are recorded
correctly. The exemption-register test now expects three holders — OG-18 and OG-08 approved, OG-B08 proposed — and
still asserts there is no global exemption.

**A gap worth naming:** the figure detector that asks "does this number have a source?" only looks for `%` and `°C`.
A reintroduced tank size or clearance distance would **not** be flagged by it today; what catches them here are the
eight tests above. Extending the detector to capacities and distances would flag sourced figures across the live set
too (OG-08's litres, OG-10's MBIE examples), so it needs the same registry-style allowance the treatment gates use.
**Proposed as its own small stage, not done here.**

## 16. Deployment recommendation

**Recommend deploying OG-B08 as #19 — after two approvals.**

1. **The proposed fire exemption** (item 7). It is narrow and empty-handed by design, but it is an exemption, and the
   standing rule is that you approve those.
2. **The metadata marked OWNER-REVIEW REQUIRED**: category, difficulty and estimated time.

Everything else is done and checked: 15 of 15 changes applied, both markets publishable, validation passes, readiness
**READY_AFTER_FINAL_VALIDATION**, `import:verify-prep` passes on all **38** files, and both PDFs are clean.

**On approval the remaining steps are the usual ones:** stage the record and the two PDFs into `private-assets/`,
`npm run build:preview`, `import:verify-build`, routing checks, `wrangler deploy`, Access probes, with rollback
`ac0d053a` retained.

**The learning path stays as it is** until you rule on item 12.

**Stopped.** OG-B08 not deployed, the Water Basics path not changed, OG-13 not started.

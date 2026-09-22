# OG-10 — RAINWATER HARVESTING PLANNER · REVIEW · NOT DEPLOYED

OG-10 is ready for your review as **PREVIEW_WITH_PROPOSED_COPY**. Its 24 proposed changes appear in the NZ and AU
previews so you can see them, but none is approved yet.

**What the audit found:**

1. **Its collection maths rests on an unsourced efficiency.** Every row defaults to **90%**, and the note claims
   *"85–90% is typical for a well-designed system"*. **No NZ or AU official source I read publishes a
   collection-efficiency figure.**
2. **Its headline reads as a promise:** *"A 150m² roof … can harvest **150,000 litres per year**"*. That's the water
   landing on the roof **before** any losses — the same losses the next box says to subtract.
3. **Its tank guidance is unsourced and prescriptive:** *"A 1,000L tank … only covers 3–7 days"*, *"think in multiples
   of 5,000L or 10,000L"*, plus *"Typical NZ home: 150–300L/day"* and *"Recommended: 21–30 days minimum"*.
4. **It invents a compliance rule:** *"Council consent required? (Check local rules — **many areas exempt under
   certain sizes**)"*.
5. **It says nothing about who may do the work,** while listing a pressure pump and household supply, and the cover
   promises *"From roof to tap"*.
6. **It never says roof water isn't automatically drinkable.**

**Good news:** NZ has published, quotable tank-size guidance and connection rules, so the NZ file gains real figures
rather than losing everything. **Australia has no equivalent national figure**, so the AU file uses none.

**Live preview unchanged:** `a65a1ef1`, 16 resources.
**Date:** 23 September 2026

---

## 1. OG-10 audit

| | |
|---|---|
| Title | **Rainwater Harvesting Planner** |
| Audit | water HIGH · planner HIGH · **"Civil Defence" not present**; audit note: stored drinking water (11 mentions) |
| Structure | intro *"Rainwater Is Free — If You Catch It"* · Step 1 catchment table (3 roof sections × 7 columns) · "The Math" box · Step 2 tank sizing (3 steps) · "Tank Size Reality" · Step 3 components (8 rows + 3 fields) · "Tank Placement Rules" · closing |
| Legacy content | "Week 2 — Water, Food & Air" · "OffGrid056 30-Day Programme" · "Asset OG-10 \| Day 10" ×2 · "Day 10 Complete" · *"The next asset turns attention to food security"* · *"Next: OG-11 30-Day Pantry Builder →"* · **a visible OG-09 code** in the filtration row |
| Not present | Skool, Action Plan Plus, tiers, old product names |
| Products/brands | none named |

**Every component and claim, classified:**

| Content | Classification | Flag |
|---|---|---|
| Roof catchment (length × width) | calculation | **measuring a roof** → the approved roof note |
| Annual rainfall input | calculation | no source named for local rainfall |
| Collection efficiency (90% default; "85–90% typical") | calculation | **unsourced** |
| "1 litre per m² per mm" | calculation | **correct** (1 mm over 1 m² = 1 L), before losses |
| "150,000 litres per year" example | calculation | ignores losses; unlabelled |
| Daily household use ("150–300L/day") | calculation | **unsourced**, NZ-only wording |
| Dry spell ("21–30 days minimum") | planning | **unsourced** |
| Tank size = daily use × dry spell days | calculation | fine, but hides that it ignores refill |
| "1,000L covers 3–7 days", "multiples of 5,000L or 10,000L" | planning | **unsourced prescriptions** |
| Gutter guards / leaf screens | planning | — |
| First-flush diverter | planning | **no volumes given** (good) |
| Downpipe filters | planning | — |
| Tanks, base/stand | planning | stand height is regulated in NZ |
| Overflow pipe & soakage | planning | **regulatory** in NZ (containment) |
| Pressure pump | planning | **installation**: no licensed-work wording |
| Filtration ("Type from OG-09") | planning | visible code; resource not in the library |
| "Council consent required? … many areas exempt" | **regulatory advice** | **invented rule** |
| Tank placement rules 1–5 | planning / maintenance | algae point is supported; screening and overflow missing |
| Drinking use ("From roof to tap") | safety | **missing**: roof water is not automatically potable |

**Nothing in OG-10 is DIY plumbing, roof or electrical instruction** once the proposals add who does the regulated
work.

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | Rainwater Harvesting Planner | **SOURCE** |
| PDF title | Rainwater Harvesting Planner — OffGrid056 | standard |
| Route | `/resources/rainwater-harvesting-planner/` | supersedes the demo placeholder in preview (§11) |
| ID | res-1010 | |
| Foundation | water | audit HIGH |
| Type | planner | audit HIGH |
| Category | **rainwater** (*"Collecting and using rainwater, within local rules."*) | **INFERRED**; alternative: water-storage |
| Difficulty | recommend **intermediate** | **OWNER-REVIEW REQUIRED** · INFERRED: roof measurements, a two-stage calculation, a component list and council requirements |
| Time | recommend **30 min** | **OWNER-REVIEW REQUIRED** · INFERRED; excludes quotes and council checks |
| Description | *"Calculate how much rainwater your roof can catch, what size tank you need, and where to put it. From roof to tank — the numbers you need to plan."* | **PROPOSED**: the cover subtitle with change 3 |
| Tags | none | none invented |

## 3. Role in the water pathway

**NEED → STORAGE → COLLECTION → TREATMENT → MAINTENANCE.** OG-10 is **collection**, the third step.

| Step | Resource | Status |
|---|---|---|
| Need and storage | **Water Storage Calculator** (OG-08) | live · **linked** |
| **Collection** | **OG-10** | this stage |
| Treatment | OG-09 Filtration Comparison Matrix | not deployed · **not linked**; OG-10's visible "OG-09" reference is removed |
| Maintenance / tanks | OG-B08 Water Tank Sizing & Placement Guide | not deployed · **not linked** |
| Whole system | Off-Grid System Architecture Planner (OG-B12) | live · **linked** |

**How they should connect later:**

- **OG-09** takes the treatment detail. OG-10 deliberately stops at *"it has to be treated"* and keeps no filter
  ratings, UV or chlorine dosing.
- **OG-B08** takes tank sizing and placement depth. OG-10 keeps one planning-level tank estimate and the placement
  list; if OG-B08 arrives, the deeper material moves there rather than being duplicated.

## 4. Claims table

| # | Original | Type | Action |
|---|---|---|---|
| C1 | *"approximately 1 litre … per millimetre of rainfall"* | conversion | **VERIFY — kept**: 1 mm over 1 m² is 1 L. Now says *"before losses"*. |
| C2 | *"A 150m² roof … 1,000mm … can harvest 150,000 litres per year"* | worked figure | **REWRITE**: *"Worked example, not your figure … catches about 150,000 litres before losses."* |
| C3 | *"85–90% is typical for a well-designed system"* | efficiency | **REMOVE**: no NZ/AU source publishes one |
| C4 | `placeholder="90%"` ×3 | efficiency default | **REMOVE**: the field is now blank |
| C5 | Annual rainfall (member input) | calculation input | **KEEP**, with a market-specific data source (NZ: regional council or NIWA; AU: Bureau of Meteorology or council) |
| C6 | *"Typical NZ home: 150–300L/day"* | daily use | **REMOVE**: unsourced, and NZ-only in the AU file |
| C7 | *"Recommended: 21–30 days minimum"* | dry spell | **REMOVE**: use local rainfall records |
| C8 | *Tank Size = Daily Use × Dry Spell Days* | calculation | **KEEP**, with the assumption stated (no refill during the dry spell) |
| C9 | *"A 1,000L tank … only covers 3–7 days"* | tank size | **REMOVE** |
| C10 | *"think in multiples of 5,000L or 10,000L"* | tank size | **REMOVE**, replaced per market (§6) |
| C11 | *"Two smaller tanks are often better than one giant"* | planning opinion | **REWRITE**: *"can give redundancy"* |
| C12 | *"many areas exempt under certain sizes"* | **compliance claim** | **REMOVE** (§8) |
| C13 | *"Dark location or opaque tank — sunlight grows algae"* | placement | **VERIFY — kept**, in MBIE's wording |
| C14 | *"On stable, level ground — concrete pad recommended"*, *"Close to downpipes"*, *"Above garden if gravity-feeding"*, *"Accessible for cleaning"* | placement | **KEEP** |
| C15 | Estimated cost fields | the member's own figures | **KEEP** |
| C16 | *"From roof to tap — every number you need"* | claim | **REWRITE**: *"From roof to tank — the numbers you need to plan."* |
| C17 | *"every component your system needs"* | claim | **REWRITE** |

**Not in OG-10:** first-flush volumes, filter ratings, treatment quantities, pump ratings, maintenance intervals,
costs. **None were added** — the maintenance and treatment detail I found in the official sources is deliberately
left for OG-09 and the approved blocks.

## 5. Collection-formula assessment

**Formula:** `Annual Harvest (L) = Roof Area (m²) × Annual Rainfall (mm) × Efficiency (%)`

| Variable | Where it comes from | Verdict |
|---|---|---|
| Roof area (m²) | the member's own L × W, from **plans, ground-based estimates or their installer** | **KEEP** |
| Annual rainfall (mm) | **local data**: NZ regional council or NIWA; AU Bureau of Meteorology or council | **KEEP**, with the source named per market — no universal rainfall |
| Efficiency (%) | **the member's own allowance**, from their supplier or installer | **REWRITE**: the 90% default and the "85–90%" claim are gone; the new wording says what efficiency covers (evaporation, overflow, gutter losses, first-flush diversion) and that **there is no standard figure** |
| Units | m² × mm = litres | **VERIFIED** and now explained in the box |

**The formula is kept**, because the arithmetic is right. What changed is that **no number is supplied for the
member** except their own.

## 6. Tank-sizing assessment

**The formula** (daily use × dry spell days) is kept, with its limit stated: it's the minimum for a dry spell with no
rain, and what you can actually hold also depends on roof area and rainfall.

| Market | What replaces the removed rules of thumb |
|---|---|
| **NZ** | **MBIE Building Performance's published guidance**: a rain barrel (about 240 litres) or a 500-litre-plus tank for the garden; for indoor supply, **5,000 litres** where rain falls year-round and **10,000 litres plus** with dry summers; **at least 30,000 litres** if rainwater is the only supply; talk to local suppliers. |
| **AU** | **No figures.** No national Australian tank-size guidance was found, and requirements vary by state, territory and council: *"There is no single Australian figure: ask local suppliers, and check what your council and your state or territory require."* |

**NZ's figures are not copied into AU**, and a test enforces that.

## 7. Required safety blocks

| Block | Needed? | Why |
|---|---|---|
| **Storing drinking water** (approved NZ + AU) | **YES** | the resource plans water a household may drink; the block carries each market's own storage and treatment guidance |
| **Stay off the roof** (working at height, approved NZ + AU) | **YES** | Step 1 needs roof measurements. The approved OG-B07 note is added under the heading: *"Use existing plans, ground-based estimates, or measurements provided by your installer."* |
| Emergency + disclaimer | yes | every resource |
| **Batteries and electrical safety** | **no — flagged** | The pump needs licensed electrical work, but that block is about solar, batteries and generators. Instead the pump note carries the market-specific wording (licensed electrical worker / licensed electrician). **Say if you would rather the block were added.** |
| Others | no | no gas, generator, solid fuel, food or CO content |

**Drinking-water safety:** both files now say roof water **is not automatically safe to drink**, and send the member
to their own market's guidance. **No treatment detail beyond the approved block** — filters, UV, chlorine and boiling
are left for OG-09.

## 8. NZ / AU regulatory differences

| Topic | NZ (MBIE Building Performance, updated 15 Jan 2026) | AU (NSW Health, current 11 Sep 2026; enHealth) |
|---|---|---|
| Council rules | *"Rules differ by council."* Check before you start. | *"Rules differ by area"* — contact your **local council**; state and territory requirements also apply |
| Plumbed connection | Connecting rainwater to a house that also has mains water **needs a building consent**, and the law requires the mains supply to be isolated by a **backflow prevention device installed by a qualified plumber** | Connecting to household plumbing, including backflow prevention, is work for a **licensed plumber** |
| Tank stand | A tank on a stand **over one metre high** generally needs a consent | no equivalent national rule claimed |
| Electrical (pump) | **licensed electrical worker** | **licensed electrician** |
| Drinking use | must be treated for drinking or other household use; **some councils require testing** | **NSW Health recommends the public supply for drinking and cooking in urban areas** (named as an example) |
| Overflow | must be **contained on your property or directed to the stormwater system**; damage can leave you liable | not claimed |
| Screens | screen the inlet; keep the tank tightly covered | **fine insect-proof screens (for example 1 mm) on all inlets and overflows**, cleaned regularly; tanks sealed around pipe connections |
| Rainfall data | regional council or **NIWA** | **Bureau of Meteorology** or local council |
| Tank sizes | MBIE's published figures | none |

**No national AU rule is asserted anywhere**, and NZ's council-level differences are stated rather than flattened.

## 9. Exact proposed copy changes (24; PROPOSED, not approved)

**Market-specific:** 5–6 (intro), 9–10 (The Math), 14–15 (tank size), 17–18 (pump/plumbing), 19–20 (consent),
21–22 (placement).

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 2 — Water, Food & Air | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Cover subtitle | From roof to tap — every number you need. | From roof to tank — the numbers you need to plan. |
| 4 | Page headers ×2 | Asset OG-10 \| Day 10 | *removed* |
| 5 | Intro — **NZ** | …can harvest **150,000 litres per year**. This planner helps you size your system correctly. | …catches about 1 litre per millimetre **before losses**. *Worked example, not your figure:* … about 150,000 litres before losses. Use your own roof area and local rainfall. **Rainwater from a roof is not automatically safe to drink.** It has to be treated for drinking or other household use, and some councils also require testing — check your council's requirements before you start. |
| 6 | Intro — **AU** | the same | the same, ending: **NSW Health, for example, recommends that people in urban areas use the public water supply for drinking and cooking**; if you plan to drink rainwater, check what applies where you live. |
| 7 | Step 1 heading | *(none)* | Use existing plans, ground-based estimates, or measurements provided by your installer. |
| 8 | Efficiency field ×3 | placeholder **90%** | placeholder **%** (blank) |
| 9 | The Math — **NZ** | …Efficiency accounts for evaporation, overflow, and first-flush diversion. **85–90% is typical for a well-designed system.** | …the first two numbers give the water that lands on the roof. Efficiency is what you actually capture after evaporation, overflow, gutter losses and first-flush diversion — **there is no standard figure**: ask your supplier or installer. For annual rainfall, use local figures from **your regional council or NIWA**. |
| 10 | The Math — **AU** | the same | the same, with **the Bureau of Meteorology or your local council** |
| 11 | Daily water use | (Typical NZ home: 150–300L/day) | Use your own figure — your water bill or meter if you have one, or a supplier's estimate for a household your size. |
| 12 | Dry spell | (Recommended: 21–30 days minimum) | Choose a length that suits your area — local rainfall records show how long dry spells usually last where you live. |
| 13 | Tank formula | Tank Size (L) = Daily Use × Dry Spell Days | the same, plus: This is the minimum to cover that dry spell with no rain at all. What you can actually keep in the tank also depends on your roof area and rainfall (Step 1). |
| 14 | Tank Size Reality — **NZ** | A 1,000L tank … only covers 3–7 days … think in multiples of 5,000L or 10,000L. Two smaller tanks are often better than one giant. | Tank size depends on your roof area, rainfall, use and whether you have mains water. **Building Performance (MBIE) guidance:** garden — a rain barrel (about 240 litres) or 500 litres plus; indoor supply — **5,000 litres** with year-round rain, **10,000 litres plus** with dry summers; **at least 30,000 litres** if rainwater is your only supply. Talk to local suppliers. Two smaller tanks **can** give redundancy. |
| 15 | Tank Size Reality — **AU** | the same | the same opening, then: **There is no single Australian figure**: ask local suppliers, and check what your council and your state or territory require. Two smaller tanks can give redundancy. |
| 16 | Filtration row | placeholder "Type from **OG-09**…" | placeholder "Type / rating…" |
| 17 | Components — **NZ** | *(none)* | A rainwater system that supplies the house needs a pump. Connecting it to household plumbing is work for a **qualified plumber** — including the backflow prevention device where there is also a mains supply — and the pump's fixed electrical work is for a **licensed electrical worker**. |
| 18 | Components — **AU** | *(none)* | …is work for a **licensed plumber**, and the pump's fixed electrical work is for a **licensed electrician**. |
| 19 | Consent field — **NZ** | Council consent required? (Check local rules — **many areas exempt under certain sizes**) | Council requirements checked? (Rules differ by council. Connecting rainwater to the plumbing of a house that also has mains water **needs a building consent**, and the law requires the mains supply to be isolated by a **backflow prevention device installed by a qualified plumber**. A tank on a stand **over one metre high** generally needs a consent too.) |
| 20 | Consent field — **AU** | the same | Council, state and territory requirements checked? (Rules differ by area — contact your local council about building or planning rules for rainwater tanks, and ask a licensed plumber about connecting to household plumbing.) |
| 21 | Tank placement — **NZ** | 5 rules, incl. *"sunlight grows algae"* | the same 5, with the algae point in MBIE's wording, plus **6.** screen the inlet and keep the tank tightly covered · **7.** overflow contained on your property or directed to the stormwater system — damage can leave you liable |
| 22 | Tank placement — **AU** | the same | the same 5, plus **6.** fine insect-proof screens (for example 1 mm) on all inlets and overflows, cleaned regularly · **7.** keep the tank sealed around pipe connections, hatches closed tightly |
| 23 | Closing | **Day 10 Complete**: …every component your system needs. The next asset turns attention to food security. | **Rainwater Plan Complete**: You now have your roof's harvest potential, a minimum tank size to aim for, and the components to price and plan. |
| 24 | Next link | Next: OG-11 30-Day Pantry Builder → | *removed* |

**Each change was checked against the re-skinned source, and all 24 apply.**

**Caught during preparation:** my first version of changes 8 and 16 edited only the `placeholder="…"` fragment, which
the verifier can't compare against printed text. It failed them, and both now replace the whole input field.

**Sources read directly this stage:**

- **MBIE Building Performance,** [Collecting and using rainwater](https://www.building.govt.nz/getting-started/smarter-homes-guides/water-and-waste/collecting-and-using-rainwater) (last updated 15 January 2026)
- **NSW Health,** [Managing rainwater tanks for safe drinking water](https://www.health.nsw.gov.au/environment/water/Pages/rainwater.aspx) (current as at 11 September 2026), which also points to the Australian Government's enHealth guidance

## 10. Related-resource recommendations

**Link:** **Water Storage Calculator** (res-1008) — need and storage come before collection; **Off-Grid System
Architecture Planner** (res-1512) — the whole water chain.

**Not linked:** OG-09 and OG-B08 (not deployed). **The visible "OG-09" reference in the filtration row is removed.**

## 11. Placeholder override result

**OG-10 will clash with the demo placeholder `res-0016` (`rainwater-harvesting-planner`),** which is referenced by the
water-basics learning path, programme day 11 and the Water Security Guide.

**The Stage 9.39 rule handles it with no OG-10 exception.** A test now runs OG-10's own record shape through it:

- **Private preview:** OG-10 (`res-1010`) supersedes `res-0016`, and that id becomes an alias of OG-10, so the path,
  day 11 and the guide point at the real resource.
- **Any other build:** the same pair **fails the build**.

**Nothing is staged yet,** so the live preview and the public build are untouched. The end-to-end routing check (one
card, one route, one Downloads entry, market routing) runs at deployment, as it did for OG-08.

## 12. NZ PDF readiness

| Check | Result |
|---|---|
| File | `rainwater-harvesting-planner.NZ.pdf` · 7 pages |
| Title | Rainwater Harvesting Planner — OffGrid056 |
| Emergency numbers | 111 only |
| Blocks | Stay off the roof; Storing drinking water (whole on page 7) |
| NZ wording | MBIE tank sizes (240 L / 500 L+ / 5,000 / 10,000+ / 30,000); building consent; backflow device by a qualified plumber; stand over one metre; licensed electrical worker; overflow containment; regional council or NIWA; *"some councils also require testing"* |
| AU content | none: no Bureau of Meteorology, NSW Health, licensed electrician, "1 mm", "state or territory", "no single Australian figure", 000, 112, SES |
| Removed content | none of: "can harvest", 85–90%, 90% default, 150–300L, 21–30 days, 3–7 days, "multiples of 5,000L", "many areas exempt", "Type from OG-09", "From roof to tap", Day/Week navigation, OG codes |
| Required wording | worked-example label, "before losses", "there is no standard figure", the roof note, "not automatically safe to drink" |
| Tokens · VERIFY · browser-error page | none |
| Changes | all 24 applied · 0 content flags |
| Draft | yes |

## 13. AU PDF readiness

| Check | Result |
|---|---|
| File | `rainwater-harvesting-planner.AU.pdf` · 7 pages |
| Title | Rainwater Harvesting Planner — OffGrid056 |
| Emergency numbers | 000 + 112 only |
| AU wording | Bureau of Meteorology; "no single Australian figure"; NSW Health; licensed plumber; licensed electrician; "for example 1 mm"; contact your local council; state or territory |
| NZ content | **none**: no NIWA, MBIE, 30,000 litres, 5,000-litre, regional council, electrical worker, building consent, 111, Civil Defence, "New Zealand"/"NZ" |
| Other checks | the same as NZ: removed content, required wording, blocks (drinking-water block whole on page 7), changes, draft |

**Checks run:** `import:verify-prep` passes **34/34** files. The other 16 resources are all still READY, and the live
build verifies as 16 records, 32 files, 0 broken links.

## 14. Tests

**324 passed** (317 + 7). Lint and typecheck clean.

**The seven new tests:**

- **OG-10 (6):** no unsourced efficiency, daily use, dry spell or tank rules of thumb; the 150,000 L figure only as a
  labelled example "before losses"; each market's own regulator, rainfall source and licensed trades; NZ's tank sizes
  kept out of AU, with no national AU rule; roof water never called automatically drinkable and no treatment detail;
  the two approved blocks, with the electrical-block decision recorded.
- **Supersession (1):** OG-10's own record supersedes `res-0016` in preview, and fails the build outside it.

**Live and public state:**

| Check | Result |
|---|---|
| Worker | unchanged, `a65a1ef1` |
| Deployed resources | the 16 are unchanged |
| Access | still blocks, including OG-10's would-be URL and PDF |
| Public/demo build | unchanged: validation still reports **30 resources, all demo** |
| OG-10 in GitHub | 0 real files (the two tracked `rainwater-harvesting-planner` files are the Stage 5 demo placeholder) |
| `--real` | refused |

## 15. Deployment recommendation

**Do not deploy OG-10 yet.** It needs these decisions:

1. **The 24 changes.** I recommend approving all of them. The ones that matter most:
   - **9–10 and 8:** remove the unsourced efficiency, which drives every harvest number.
   - **19–20:** replace the invented exemption claim with each market's real position.
   - **17–18:** name who may do the plumbing and electrical work.
   - **5–6:** say that roof water isn't automatically drinkable.
2. **The NZ tank figures:** confirm you're happy quoting MBIE's published sizes in the NZ file, with **no AU
   equivalent**.
3. **The electrical block question** (§7): market-specific pump wording only, or add the battery/electrical block?
4. **Metadata:** rainwater (or water-storage), **intermediate**, **30 min**.

**After that:** re-render, verify, then deploy as the **17th** resource — with the placeholder override check — and
rollback to `a65a1ef1`.

**Stopped. OG-10 not deployed. OG-09 and OG-B08 not started.**

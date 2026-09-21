# DEPLOYED: OG-15, OG-B07 + UPDATED OG-02, OG-25, OG-B10 · OG-26 PREPARED, NOT READY

The private preview is now **version `d1644b97`**, with **six protected draft resources**. **OG-27 is held**
(`BLOCKED_BY_RESOURCE_DEPENDENCY` on OG-26).

OG-26 is prepared for review only. It is **not ready**, and it exposes **a second dependency** that affects both
OG-26 and OG-27: **OG-22**.

**Date:** 22 September 2026

---

## 1. Deployment result

**Successful.** Five resources went out, and every pre-deployment check passed first.

| Resource | Change |
|---|---|
| OG-15 Warm Home Scorecard | **new** |
| OG-B07 Solar Planning Deep Worksheet | **new** |
| OG-02 Household Risk Identifier | **updated**: PDF title, programme navigation removed |
| OG-25 Project Support Brief Template | **updated**: legacy cleanup, cover fix, new description |
| OG-B10 90-Day Implementation Roadmap (Advanced) | **updated**: Action Plan Plus header, 10–20% removed |
| OG-B04 | unchanged |
| OG-27 | **not deployed** — no page and no file in the build |

**Build:** 18 private files staged (6 records, 12 PDFs) and removed after the build. Nothing was left in
`public/`.

## 2. New Worker version

**`d1644b97-5d3f-4c4d-8924-e9ca7dbaccf3`**

Rollback target: `619b70d5`, kept in the deployment history. The previous private files are also backed up
locally.

## 3. OG-B07 final wording

| Where | Before | After |
|---|---|---|
| Roof specifications note | Measure carefully or provide to installer | **Use existing plans, ground-based estimates, or measurements provided by your installer.** |

- Your preferred (longer) wording fits the layout on one line.
- The **Stay off the roof** block above it is intact: re-checked in the rendered page and in both PDFs.

## 4. OG-02 title cleanup

**PDF title:** *"OG-02 Household Risk Identifier — OffGrid056"* → ***"Household Risk Identifier — OffGrid056"***.
`legacyCode: OG-02` is kept in the record.

**Programme navigation also removed, under your standing rule.** Your deployment validation requires "no obsolete
programme navigation" on every deployed resource, and OG-02 still had it. Navigation only:

| Before | After |
|---|---|
| Week 1 — Foundation (cover) | *removed* |
| OffGrid056 30-Day Programme (cover) | OffGrid056 Member Library |
| Asset OG-02 \| Day 2 (both page headers) | *removed* |
| Day 2 Complete | Assessment Complete |
| Next: OG-03 Budget Pathway Selector → | *removed* |

**Proof that nothing else changed.** OG-02 moved from the old pilot path onto the same prep pipeline as the rest,
so I diffed the new NZ and AU documents against the live ones:

- **the only text changes are the rows above**
- **styles and safety blocks are byte-identical**
- the only markup lost is the two removed elements
- same 5 pages

The deployed OG-02 record is unchanged.

## 5. Validation results (before deployment, on the exact build that was deployed)

| Check | Result |
|---|---|
| Market routing, 7 surfaces × 3 states | **21 / 21 correct** |
| No market selected | no file anywhere; Downloads shows "Choose your market" ×6 |
| NZ selected | NZ file only, on every surface |
| AU selected | AU file only, on every surface |
| Draft badge | on all 6 resource pages, in every state |
| NZ files | 111 only · Civil Defence · licensed electrical worker |
| AU files | 000 + 112 · SES · licensed electrician |
| Tokens / VERIFY markers | 0 / 0 |
| Browser-error PDFs | none |
| OG codes in PDF titles | none among the five deployed |
| "Action Plan Plus" anywhere in the build | 0 |
| Programme navigation | none in deployed documents |
| Unsupported numeric claims | none in deployed documents |
| `import:verify-prep` | all deployed PDFs pass |
| Real resources in public GitHub | none — private files git-ignored, staged only for the build |

**Access after deployment:** **20 / 20 addresses → 302 to the Cloudflare Access login.** That covers the home
page, Downloads, all six resource pages, all their PDFs, and OG-27's would-be URLs. Access blocks before routing,
so OG-27's URLs also return 302; the build output confirms OG-27 is absent.

**Two checks were tightened while validating:**

- **Verifier false positive fixed.** It read "000" inside prices such as "$1,000" as Australia's emergency number.
  Numbers are now matched only when they stand alone. A real AU file planted under an NZ name still fails, on four
  separate checks.
- **Cross-market check widened.** It now covers **every agency** in each market's profile (EECA, WorkSafe,
  Healthy Homes and the rest), not only the emergency agency. It immediately caught OG-26 (§7).

## 6. Protected resources after deployment

**Six**, all drafts, all behind Access:

- OG-02
- OG-B04
- OG-B10
- OG-25
- **OG-15**
- **OG-B07**

---

## 7. OG-26 — 3-Tier Budget Planner — audit and prep

**Status: NOT READY — NEEDS_CONTENT_REVIEW.** Both markets are also blocked by a missing required safety block.

### Metadata (proposed, not approved)

| Field | Proposal | Basis |
|---|---|---|
| Title | 3-Tier Budget Planner | document (the code is stripped from the cover) |
| ID / slug | res-1026 · `3-tier-budget-planner` | |
| Type | planner | inferred, HIGH (title) |
| Foundation | general | inferred: the audit found five foundations scoring similarly, so it is cross-cutting; matches OG-27 and OG-B10 |
| Category | planning | same as OG-27 |
| Difficulty | **NEEDS_OWNER_REVIEW** — recommend *intermediate* | not stated; costing, subsidies, contingency and a funding-gap decision |
| Time | **NEEDS_OWNER_REVIEW** — recommend 45 min | four costing tables and a decision section, with prices to hand |
| Description | "Align your spend with your actual capacity" | cover subtitle without "Day 26 —" |
| PDFs | NZ 9 pages · AU 8 pages | prepared for review only |

### How OG-26 defines the tiers (exact wording)

The tiers are **cumulative**. Each carries forward everything below it, and each adds a 15% contingency line.

**Tier 1 — Essential Budget · *The "Sleep Safe" Tier***

> *"Covers only the items that protect life and basic function in a 72-hour disruption. No frills. No expansion.
> Just core survival."*

| Category | Item |
|---|---|
| Water | emergency water storage (200L minimum) |
| Water | portable water filter + purification tablets |
| Food | 4-week emergency food supply |
| Heat | emergency heating (gas heater / thermal blankets) |
| Power | portable power station + solar panel |
| First aid | comprehensive first aid kit + medications |
| Comms | crank/solar radio + backup phone power |

**Tier 2 — Balanced Budget · *The "Live Well" Tier***

> *"Adds comfort, efficiency, and extended autonomy. Suitable for most households who want resilience without
> radical lifestyle change."*

Everything from Tier 1, plus:

| Category | Item |
|---|---|
| Water | rainwater tank (5,000L+) + pump + filtration |
| Food | extended pantry + preserving |
| Heat | heat pump or wood burner (installed) |
| Insulation | ceiling + underfloor insulation |
| Power | grid-tied solar (3–5kW) + monitoring |
| Shelter | weatherproofing + repair kit |

**Tier 3 — Complete Budget · *The "Full Autonomy" Tier***

> *"For households seeking near-total independence from grid and supply chains. Significant capital required but
> maximum resilience."*

Everything from Tiers 1 and 2, plus:

| Category | Item |
|---|---|
| Water | bore/spring + large tank + UV treatment |
| Power | off-grid solar + battery (10kWh+) + backup generator |
| Heat | secondary heat source + thermal mass |
| Food | garden/orchard + livestock + seed bank |
| Shelter | secondary dwelling |
| Comms | satellite comms + HAM radio |

**An internal inconsistency to note:** Tier 1 is defined around a **72-hour** disruption but budgets a **4-week**
food supply.

### Findings

**A. The whole budget method is written for New Zealand only.** This is the largest issue.

- *"Assign realistic **NZ market costs**. Use **Trade Me**, local suppliers, or quotes from OG-23 enquiries."*
- *"Subtract available subsidies. **Warmer Kiwi Homes, EECA grants**, and council programmes reduce net cost."*
- A full **"Subsidy & Grant Reference (NZ)"** table:
  - Warmer Kiwi Homes: "Up to $3,000"
  - EECA Business Grants
  - Regional Council Rebates: "$200–$1,000"
  - "Solar Zero-Interest Loans: Up to $30,000"
  - Rural Support Trust
- Closing: *"grounded in actual NZ costs and available subsidies"*.

**The AU file currently carries all of this.** The widened verifier **fails OG-26 AU** on *"contains NZ energy
agency EECA"*, which is correct.

**The NZ values themselves are unsourced**, and may be out of date. Two rows fit a household planner badly: EECA
*Business* Grants are for businesses and farms, and "Solar Zero-Interest Loans" is not clearly a government
programme.

Under your rules, **none of these figures can publish without live official sources**. Australia would need its
own, state-based, sourced subsidy content, or a neutral version.

**B. Safety — blocked.**

- **Required and missing: stored drinking water** (water storage, rainwater tank, bore/spring, UV treatment ×14).
  No NZ/AU live-verified block exists yet, so both markets are unpublishable. The standard's water block has not
  been through the Stage 9.17–9.18 process.
- **Required and present:**
  - batteries and electrical (solar, batteries and inverter ×16)
  - wood burners (×4)
- **Recommended and included:**
  - never bring it inside, and carbon monoxide: Tier 1 lists *"Emergency heating (**gas heater** / thermal
    blankets)"*, and Tier 3 a *"backup gen"*
- **Generator distance:** still `VERIFY`; nothing states one.

**C. Unsupported figures.**

| Figure | Note |
|---|---|
| *"Add **15%** contingency"* and *"Contingency (15%)"* ×3 | the same class as OG-B10's 10–20%, which you removed |
| *"200L minimum"* water storage | no official source; NZ and AU guidance is per person per day |
| *"5,000L+"* tank, *"3–5kW"* solar, *"10kWh+"* battery | sizing figures without a source |
| All subsidy values | see A |

The detector flags percentages; litres, kW and dollars I found by reading. **Recommendation:** extend the detector
to flag unit-bearing figures (L, kW, kWh, $ amounts) as `NEEDS_SOURCE`.

**D. Legacy programme navigation** (the same types as OG-25 and OG-27):

- Week 4 label
- "OffGrid056 30-Day Programme"
- "Day 26 —" (cover and header)
- "OG-26" in the cover title
- "Day 26 Complete"
- *"Next: Tomorrow you will map your chosen tier onto a 90-Day Implementation Roadmap…"*
- *"Next: OG-27 90-Day Implementation Roadmap →"*

**E. Other.**

- *"Just core survival"* is flagged; it is the same framing you replaced in OG-15.
- *"Starlink"* is a commercial brand in Tier 3.
- *"Trade Me"* is an NZ marketplace (see A).

**F. Dependencies.**

| Reference | Kind |
|---|---|
| *"Start with MUST items only (**from OG-22**)"* | **hard**: the MUST list is defined in OG-22, "Resilience Product Wishlist", which is not in the library |
| *"quotes from **OG-23** enquiries"* | soft: OG-23, "Supplier Question Bank", not in the library; the budget works without it |
| *"Next: **OG-27**"* | navigation |

---

## 8. OG-26 → OG-27 dependency recommendation

**The link is clean.** The tier names match exactly (**Essential / Balanced / Complete**), and OG-27's sprints
follow OG-26's tier contents line for line:

- **Sprint 1** buys *water storage, filtration, 4-week food, portable power station, emergency heating, first
  aid, comms*. That is exactly Tier 1's seven rows.
- **Sprint 2** installs *"Tier 2 (Balanced) upgrades for water, energy, heating, and shelter"*: the tank, solar,
  heat pump or burner, and insulation. That is Tier 2.
- **Sprint 3** ends with *"Decide on Tier 3 (Complete) pathway"*.

**How OG-27 should reference OG-26 once it is live.** Name it; don't weaken it:

| OG-27 today | Proposed |
|---|---|
| Confirm budget tier from OG-26. | Confirm the budget tier you chose in the **3-Tier Budget Planner**. |
| Compare actual spend to OG-26 budget. | Compare actual spend to your **3-Tier Budget Planner** budget. |

Also link them in the library itself, so a member can move between them without in-document "Next:" arrows:

- OG-27 `relatedResources: ["res-1026"]`
- OG-26 `relatedResources: ["res-1027"]`

**The catch: both depend on OG-22.** OG-26 says *"Start with MUST items only (from OG-22)"*, and OG-27 says
*"Tier 1 (Essential) **MUST** items"*. The MUST / SHOULD classification is made in **OG-22, Resilience Product
Wishlist**. It is a Group-A resource, not yet migrated.

**Recommendation:** migrate **OG-22 → OG-26 → OG-27** in that order, and treat OG-26 as
**BLOCKED_BY_RESOURCE_DEPENDENCY on OG-22** in the same way.

**The alternative:** decide that "MUST items" means "the items your household cannot do without" and define it
inside OG-26. That changes teaching content, so it needs your approval.

---

## 9. Tests

**246 passed** (243 + 3). Lint and typecheck clean.

New tests:

- a dependency-blocked resource stays blocked whatever else is approved
- an owner-specified PDF title is used
- **required safety is computed for any resource, not only Group A**

**That last one is a real fix.** Required safety blocks were computed only inside the Group-A analysis, so a
Group-B resource like OG-26 reached prep with **no required blocks at all**: a gate that passed silently.

Also: prep now **inserts** a `<title>` when a source has none, rather than leaving the PDF untitled. A new test
found this.

---

## 10. Remaining owner decisions

1. **OG-22 dependency:** migrate OG-22 first (recommended), or define "MUST items" within OG-26.
2. **OG-26 NZ subsidy content:** live-verify each scheme and value for NZ, or replace it with neutral wording
   pointing to current official programmes.
3. **OG-26 AU version:** sourced state-based equivalents, or neutral wording. As it stands, the AU file carries NZ
   schemes and fails verification.
4. **Stored-drinking-water safety block:** authorise NZ and AU sourcing, live-verified as for Stage 9.18. OG-26
   cannot publish in either market without it.
5. **OG-26 unsupported figures:**
   - the 15% contingency (consistent with OG-B10: remove?)
   - 200L, 5,000L+, 3–5kW, 10kWh+
6. **OG-26 metadata:** difficulty (recommend intermediate), time (recommend 45 min), and confirm general/planning.
7. **OG-26 legacy navigation:** confirm the standing rule applies (Day and Week labels, Day 26 Complete, Next:
   lines, cover code). Also *"Just core survival"*, *Starlink* and *Trade Me*.
8. **PDF title format:** OG-02 now reads *"Household Risk Identifier — OffGrid056"*, as you specified. The others
   read the title alone (*"Warm Home Scorecard"*). Choose one format; I'll apply it everywhere.
9. **OG-B04:** its live PDF title still reads *"OG-B04 Monthly Planning Challenge Template — OffGrid056"*. It was
   not in the approved update set. Approve a re-render; content is otherwise identical.

**Stopped. OG-26 and OG-27 are not deployed.**

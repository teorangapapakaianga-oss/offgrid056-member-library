# Programme architecture

How the member library is organised: the Five Foundations, the pathways through them, and what a member's progress
looks like now and later.

**As at:** 23 September 2026.

---

## The Five Foundations

Every resource belongs to one foundation, and each foundation has its own categories (`data/taxonomy/foundations.json`).

| Foundation | What it covers | Categories | Live resources |
|---|---|---|---|
| **Air** | ventilation, moisture, indoor air quality | air-quality, ventilation, moisture, heating-and-air | **0** |
| **Water** | supply, storage, collection, treatment | water-storage, rainwater, water-security, household-water-planning, worksheets, checklists | **1** (OG-08) |
| **Shelter** | the home itself: warmth, insulation, weathertightness | household-resilience, heating, insulation, weatherproofing, maintenance, property-assessment, worksheets | **3** (OG-15, OG-21, OG-27) |
| **Food** | supply, storage, rotation | pantry-resilience, growing, preserving, food-planning | **1** (OG-11) |
| **Energy** | power, backup, solar, batteries | backup-energy, solar, lighting, household-energy-planning, energy-use, worksheets, checklists | **4** (OG-18, OG-19, OG-20, OG-B07) |
| **General** *(not one of the five; the cross-cutting home for planning)* | getting started, planning, packs | getting-started, planning, packs | **7** (OG-02, OG-22, OG-25, OG-26, OG-B04, OG-B10, OG-B12) |

**Air has nothing yet.** OG-13 (Healthy Home Air Audit) is the obvious first one, and it is not started.

## Pathways

### 1. Start Here

The entry pathway (`data/learning-paths/start-here.json`), currently 6 demonstration steps. **It has not been rebuilt
around real resources yet.** When it is, the natural spine is:

1. what resilience means for this household (OG-01 Home Resilience Scorecard, or OG-02 Household Risk Identifier,
   which is live)
2. the property's own conditions (OG-04 Property Profile Matrix)
3. the first week's priorities (OG-07)
4. a budget pathway (OG-03, or the live OG-26 3-Tier Budget Planner)

### 2. Planning pathway

Working out what this household actually needs, foundation by foundation. This is where most live resources sit
today:

| Foundation | Sequence (live resources in bold) |
|---|---|
| Water | need → storage (**OG-08**) → collection (OG-10, prepared) → treatment (OG-09) → tanks and maintenance (OG-B08) |
| Energy | solar basics (**OG-18**) → deeper solar data (**OG-B07**) → batteries and backup (**OG-19**) → alternatives (**OG-20**) → whole-system integration (**OG-B12**) |
| Shelter | warmth assessment (**OG-15**) → insulation and grants (OG-16) → solid fuel heating (OG-17) → the combined plan (**OG-21**) |
| Food | pantry (**OG-11**) → rotation (OG-12) → growing and preserving (OG-14) |
| Air | (none yet) |

### 3. Implementation pathway

Turning plans into spending and action — all live:

1. **OG-22 Resilience Product Wishlist** — what to buy
2. **OG-26 3-Tier Budget Planner** — what it costs, in three tiers
3. **OG-25 Project Support Brief Template** — briefing a professional
4. **OG-27 90-Day Implementation Roadmap** (and **OG-B10**, the advanced version) — when it happens
5. **OG-B04 Monthly Planning Challenge Template** — keeping it going

### How resources connect

Resources link to each other by **id**, through `relatedResources`. The rule is that a link has to earn its place:
each one points at the resource that takes the next real step, and links to resources that are not deployed are not
added. Current links:

- **OG-08** → OG-22, OG-26, OG-B12
- **OG-18** → OG-B07, OG-19 · **OG-B07, OG-19, OG-26** → OG-18
- **OG-19** → (none) · **OG-20** → OG-18, OG-19, OG-21
- **OG-21** → OG-15, OG-18, OG-19, OG-26
- **OG-B12** → OG-18, OG-19, OG-20, OG-26, OG-22

## Market routing

Every migrated resource carries `marketFiles` for **NZ** and **AU**:

- **no market chosen → no market-specific download is offered**
- NZ members are offered the NZ file only; AU members the AU file only
- each market's file carries its own emergency numbers, agencies, licence terms and figures
- **US and CA are non-publishable** until their own safety review is done

## Progress today, and later

**Today**, in the private preview: a member can mark a resource saved or complete, and the programme day view tracks
completion and private notes. This is browser-side only.

**Later**, for the production membership system (not started, and not designed here):

- member accounts instead of Cloudflare Access
- progress that follows the member across devices
- pathway completion, and what to do next
- publishing: resources move from `draft` to `published` once the owner approves them for real members
- the 30-Day Programme: currently 30 demonstration days, to be rebuilt on the real resources

## The legacy 30-Day Programme

The library is being built from 45 legacy resources (30 day resources plus 15 bonus). **The day-by-day programme
structure is deliberately not carried across:** every migration removes Week/Day labels, "Next: OG-xx" navigation and
visible codes. The resources stand on their own, and the pathways above do the sequencing.

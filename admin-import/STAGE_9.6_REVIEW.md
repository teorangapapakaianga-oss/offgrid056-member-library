# STAGE 9.6 — SAFETY + MIGRATION PILOT — OWNER REVIEW

**Parts delivered: 9.6A (safety standard) and 9.6B (market architecture), plus the Group-A plan.**
**9.6C and 9.6D are NOT started** — you gated them on safety approval, and the safety standard is not yet
approved.

**Nothing re-skinned. Nothing imported. No original file modified. Nothing published.**
`git status data public`: unchanged. **Date:** 21 September 2026.

---

## 1. Git ahead/behind — I was wrong, you were right

```
git status                              →  On branch main, up to date with origin/main, working tree clean
git rev-list --count origin/main..main  →  0
git log --oneline origin/main..main     →  (no unpushed commits)
git rev-list --count main..origin/main  →  0
```

| | Commit |
|---|---|
| local `main` | `4a505a2` |
| local `origin/main` | `4a505a2` |
| **live remote** (`git ls-remote`) | `4a505a2e7db864cb1da074883ef0891c98c347c8` |

**Nothing was unpushed. Nothing needed pushing. No history rewritten.**

I had been reporting "N commits waiting for your GitHub push" at the end of several stages. That was wrong —
the pushes were going through. I was reading a stale assumption from early in the project, when the credential
problem was real, and never re-checked it. Thank you for catching it; I have stopped making that claim.

---

## 2. Safety-content standard — `OFFGRID056_SAFETY_CONTENT_STANDARD.md`

Eleven reusable blocks, by topic, placed at the point of hazard — not one generic disclaimer.

| # | Block | Severity | Sourced? |
|---|---|---|---|
| 0 | General safety disclaimer | STANDARD | editorial |
| 1 | **Emergency contact architecture (by market)** | **CRITICAL** | ✅ NZ, AU, US, CA |
| 2 | Generator safety | **CRITICAL** | ✅ CPSC |
| 3 | Carbon monoxide | **CRITICAL** | ✅ Health Canada / Ontario / CPSC |
| 4 | Indoor combustion | **CRITICAL** | ✅ CPSC |
| 5 | Solid-fuel heating | HIGH | ✅ Fire and Emergency NZ |
| 6 | Gas and LPG | **CRITICAL** | ⚠ **needs a per-market source** |
| 7 | Batteries and electrical | **CRITICAL** | ✅ CPSC |
| 8 | Stored drinking water | HIGH | ✅ NZ + US · ⚠ AU/CA pending |
| 9 | Food safety in a power cut | HIGH | ⚠ **figures pending** |
| 10 | Fire and emergency response | **CRITICAL** | ✅ Fire and Emergency NZ |

**Three blocks are deliberately incomplete.** Block 6 has no named licensing source per market; Block 8 has no
verified AU or CA storage figure; Block 9's official power-cut timings could not be retrieved (the
FoodSafety.gov page returned HTTP 403 while I was preparing this). In each case the numbers are **left out and
marked `VERIFY`** rather than written from memory. I would rather hand you three visible gaps than eleven
confident-looking blocks with three of them guessed.

**Verified examples of what is in there:**

- CPSC: generators run "outside only, at least 20 feet away from the house"; opening doors or windows "will not
  provide enough ventilation to prevent the buildup of lethal levels of CO"; nearly 100 US deaths a year.
- NZ Get Ready: "at least three litres of drinking water per person per day… at least nine litres per person
  for the three days"; ideally 21 litres for a week.
- Ready.gov: "at least one gallon of water per person per day for several days"; in very hot temperatures
  "water needs can double".
- Canada/Ontario: CO alarms "adjacent to each sleeping area and on every storey"; if one sounds, "get everyone
  out of the home immediately and call 9-1-1… from outside the building".
- NZ Police: 111 calls are free and work on a mobile with no credit; if unsure, call and ask.
- Triple Zero: 000 from any phone, **112** from a mobile reaches the same service, **106** TTY via the NRS.

**One thing I cannot do:** approve safety advice. I can draft it and cite it. My recommendation is that the
CRITICAL blocks are reviewed by someone suitably qualified in the launch market before anything is published.

---

## 3. Market-variant design — core + overrides, proven in code

Four complete copies of 45 resources would be **180 documents drifting apart**. The design rests on one
observation from the audit: *almost none of the variance is per-resource*. The emergency number, the agencies,
the units and the safety wording are properties of the **market**, not of the water storage calculator.

```
market profile   (4 files, shared by everything)
      +  safety blocks   (11 blocks, each with optional per-market wording)
      +  resource core   (45 documents, market-neutral)
      +  resource override  (rare — one per market at most, usually none)
      =  what a member in that market reads
```

**Totals: 45 resources stay 45 documents.** Four markets add 4 profile files, not 135 extra resources.

### Worked sample — OG-08 Water Storage Calculator

The resource where variance bites hardest. One core document resolves to:

| | New Zealand | United States |
|---|---|---|
| Storage figure | **3 litres** per person per day | **one gallon** per person per day |
| Agency | Civil Defence (NEMA) | FEMA / Ready.gov |
| Emergency block | "call **111** … free, works with no credit" | "call **911**" |
| Australia | "call **000** … also 112 from a mobile" | Canada: "call **911**" |

`{{emergency.number}}`, `{{agency.emergencyManagement}}`, `{{figure.waterPerPersonPerDay}}` and
`{{term.electrician}}` resolve per market. The US is the only market needing a body override here, and only
because Ready.gov frames it as drinking *and sanitation*.

### Owner ruling 2 is enforced structurally

EECA, Healthy Homes, Civil Defence, R-values and litres are **not deleted as outdated wording**. They live in
the NZ profile as valid NZ references, and are simply absent from the US profile. The audit's "market-specific"
flags become profile entries, exactly as you directed.

### It fails loudly, by design

AU and CA have no verified water figure yet. So `{{figure.waterPerPersonPerDay}}` **does not resolve** there —
the token stays visible on the page, the resolver reports it, and `publishable()` refuses the resource for
those markets. **A missing official safety figure can never silently render as a blank.** That is a test, not
a promise.

**Building it rather than only designing it earned its keep immediately:** the first run failed because I was
lowercasing the whole token path, so `agency.emergencyManagement` was looked up as `emergencymanagement` and
silently missed. A design document would have shipped that bug into the implementation.

---

## 4. AIR_CONTENT_GAP — recorded as instructed

Recorded as a programme-development finding in the audit output:

> Air has 1 resource of 45, against shelter, energy, water and food. Recorded as a gap in the programme to be
> filled by writing new Air resources for the current Five Foundations framework. **No existing resource is to
> be reclassified into Air to balance the count** (owner ruling 3).

Nothing was reclassified. OG-13 Healthy Home Air Audit remains the only Air resource.

---

## 5. Group-A migration plan — the 11 pilot resources

| OG | Title | Foundation | Type | Confidence |
|---|---|---|---|---|
| OG-02 | Household Risk Identifier | general | worksheet | HIGH |
| OG-11 | 30-Day Pantry Builder | food | worksheet | MEDIUM |
| OG-15 | Warm Home Scorecard | shelter | assessment | HIGH |
| OG-19 | Battery Backup Planner | energy | planner | HIGH |
| OG-22 | Resilience Product Wishlist | general | *unresolved* | LOW |
| OG-25 | Project Support Brief Template | general | template | HIGH |
| OG-27 | 90-Day Implementation Roadmap | shelter | planner | HIGH |
| OG-B04 | Monthly Planning Challenge Template | general | planner | MEDIUM |
| OG-B07 | Solar Planning Deep Worksheet | energy | planner | MEDIUM |
| OG-B10 | 90-Day Roadmap Advanced | general | planner | HIGH |
| OG-B11 | Building Consent Navigator | general | *unresolved* | LOW |

All 11 carry **zero** safety gaps, **zero** market-specific terms and **zero** legacy terminology — which is
precisely why they are Group A. Their only problem is presentation: legacy navy, gold, orange, Playfair
Display and Inter.

**Planned steps per resource** (not yet executed):
1. HTML source → current brand tokens (Resilience Green, Deep Green, Charcoal, Graphite, Warm White, Earth
   Taupe; Bebas Neue headings, Montserrat body; Design A logo; Prepare • Adapt • Thrive).
2. Context-aware terminology pass — "5 Pillars" → "Five Foundations" **only where it names the framework**;
   bare "pillar" left alone (none of these 11 contain either, so this is a no-op for the pilot set and will be
   properly exercised in Group B).
3. Attach Block 0, plus Block 1 where the resource touches emergencies.
4. HTML → PDF, preserving content meaning. No teaching content rewritten.
5. Validate against `ResourceSchema`, import as **draft** into a sandbox, private preview.

**Two of the 11 (OG-22, OG-B11) have unresolved types** and need your call from the Stage 9.5 list before they
can be imported — they can still be re-skinned.

---

## 6. One-resource pilot recommendation

**OG-02 — Household Risk Identifier.** My recommendation, for four reasons:

1. **Group A** — presentation-only, so the pilot tests the pipeline rather than a content rewrite.
2. **HIGH confidence on both foundation (general) and type (worksheet)** — metadata is settled, so the import
   gate has nothing to argue with.
3. **Zero safety exposure of its own** — so the pilot is not blocked behind the three `VERIFY` blocks. It still
   exercises the safety layer through Block 0 and Block 1, and Block 1's emergency numbers are **verified in
   all four markets**, so it exercises the market layer end to end too.
4. **A clean, small HTML source** (17 KB) against a 537 KB PDF — a realistic re-skin without being a monster.

Proposed identity: `res-1002` / `household-risk-identifier`, `legacyCode: OG-02`.

**Second pilot, if you want market-variant depth:** OG-15 Warm Home Scorecard — shelter, HIGH confidence, and
it naturally pulls in NZ Healthy Homes, which would exercise a real per-market override rather than only the
emergency number.

---

## 7. Test count

**179 tests pass, 0 failures** (8 files) — up from 164.

| Suite | Tests |
|---|---:|
| V1 member library | 58 (unchanged) |
| Importer | 30 |
| Admin review workflow | 33 |
| Import engine | 22 |
| Programme audit | 21 |
| **Market resolution (new)** | **15** |

The 15 new tests pin the market layer's safety properties: the emergency number resolves correctly in all four
markets; an unknown token stays visible instead of blanking; a missing official figure can never render as an
empty string; the publish gate refuses a market with unverified figures; a missing CRITICAL safety block blocks
publication; and NZ-specific references stay valid rather than being translated into nonsense.

**Member build unchanged:** 800 files, 20.03 MB, 956 KB JS. No Stage 9.6 content appears in `out/` — checked
by searching for `OFFGRID056_SAFETY_CONTENT_STANDARD`, `safetyBlocks`, `emergency-contact`, `Triple Zero` and
`getready`: none found. (A plain search for "safety" does match the build, but that is the V1 demo resource
`safe-preserving-basics.json` and its "food safety" tag, present since Stage 5.)

---

## 8. Owner decisions required

1. **Approve or amend the safety standard** (blocks 0–10). 9.6C is gated on this.
2. **Who signs off the CRITICAL safety blocks?** I can draft and cite; I should not be the approver of safety
   advice. My recommendation: a suitably qualified reviewer in the launch market.
3. **Name the launch market** so the three `VERIFY` gaps can be closed for that market first, rather than
   trying to close all four at once. If it is New Zealand, the gaps are: a gasfitting licensing source, and
   MPI's power-cut food timings — NZ water and emergency figures are already verified.
4. **Approve the market architecture** (core + profile + blocks + rare override) before anything is built on it.
5. **Confirm OG-02 as the end-to-end pilot**, or pick another.
6. **Resolve the two unresolved Group-A types** — OG-22 Resilience Product Wishlist and OG-B11 Building Consent
   Navigator. My reading: Worksheet and Guide respectively.
7. **Where does the private deployment live?** 9.6D ends in a private preview, and there is nowhere to put it
   yet. The public repository is not a suitable home for member resources.

---

## 9. What happens next, once you approve

9.6C — re-skin the 11 Group-A resources, with before/after for at least two.
9.6D — run OG-02 the whole way: audit → safety → terminology → re-skin → validation → draft import → private
preview.

`--real` stays disabled throughout, per your ruling, until that pilot is approved.

**No bulk re-skinning has started. No real batch import has been enabled.**

# Safety register

The approved safety wording, how the markets differ, what fails closed, and what still needs research.

**As at:** 6 October 2026, after Stage 9.61. Config: `admin-import/config/safety-blocks.json`, `admin-import/config/metadata-review.json`.

---

## Approved safety blocks (12)

Every one is owner-approved for **NZ and AU separately**, with each market's own sources. A block with no wording for
a market fails closed there: the shared body is `{{safety.notVerifiedForMarket}}`.

| Block | Title | Severity | Approved | Used by |
|---|---|---|---|---|
| `general-disclaimer` | Before you start | standard | all | every resource |
| `emergency-contact` | In an emergency | critical | all | every resource |
| `batteries-and-electrical` | Batteries and electrical safety | **critical** | 22 Sep 2026 | OG-18, OG-19, OG-20, OG-21, OG-26, OG-27, OG-B07, OG-B12 |
| `carbon-monoxide` | Carbon monoxide | **critical** | 22 Sep 2026; AU servicing sentence corrected 5 Oct 2026 (Stage 9.56) | OG-13, OG-15, OG-20, OG-26, OG-27, OG-B12 |
| `indoor-combustion` | Never bring it inside | **critical** | 22 Sep 2026; AU servicing clause corrected 5 Oct 2026 (Stage 9.56) | OG-15, OG-26, OG-27 |

**No Australian gas figure without its jurisdiction (Stage 9.56).** All eight Australian jurisdictions were read live at Stages 9.55 and 9.56. Three publish a gas servicing interval and the three differ — NSW annually and only for gas water heaters, Victoria every two years, WA every two years or annually over ten years old — and five publish none. The cylinder test interval is ten years in QLD and SA but "no more than 10 or 15 years" in NSW. Only SA publishes a hose interval. The jurisdictions give at least four different instructions about electrical switches during a gas leak, and **NSW's own two pages differ from each other**. The Australian bodies therefore carry **no gas interval and no leak-switch instruction**; anything beyond the shared floor must name the state it comes from, in the shape `fire-and-smoke-alarms` already uses. New Zealand is unaffected: it is one jurisdiction, and its figures are verified and stay.
| `working-at-height` | Stay off the roof | **critical** | 22 Sep 2026 | OG-10, OG-18, OG-B07, OG-B08 |
| `solid-fuel-heating` | Wood burners and open fires | high | 22 Sep 2026 | OG-15, OG-21, OG-26, OG-B12 |
| `stored-drinking-water` | Storing drinking water | high | 22 Sep 2026 | OG-08, OG-10, OG-26, OG-B08, OG-B12 |
| `food-safety-power-cut` | Food safety in a power cut | high | 22 Sep 2026 | OG-11, OG-19 |
| `generator-safety` | Using a generator safely | **critical** | 22 Sep 2026 (Stage 9.34) | OG-20, OG-B12 |
| `water-treatment` | Making water safe to drink | **critical** | 23 Sep 2026 (Stage 9.42 rulings 1–2) | OG-09 |
| `fire-and-smoke-alarms` | Smoke alarms and fire safety | **critical** | 23 Sep 2026 (Stage 9.52) | OG-13 |
| `mould-and-dampness` | Mould and dampness | high | 23 Sep 2026 (Stage 9.52), bleach removed 5 Oct 2026 (Stage 9.53 ruling 1) | OG-13 |
| `home-ventilation` | Ventilation and moisture | standard | 23 Sep 2026 (Stage 9.52), AU body corrected 5 Oct 2026 | OG-13 |

**The three Air blocks (Stage 9.52).** Built, tested and unused: no resource carries them yet, because OG-13 is not
migrated. Three things about them matter beyond their wording:

- **`fire-and-smoke-alarms` answers the detector without renaming it.** The topic detector asks for
  `fire-and-emergency`; the block declares `answers: ["fire-and-emergency"]`, and prep treats a requirement as met by
  an included block that declares it. The two reviewed hazard-label exemptions (OG-02, OG-B08) therefore still point
  at the requirement they were approved against. The mechanism can satisfy a requirement, never suppress one.
- **No national Australian alarm rule is stated.** NSW and Queensland differ materially, Queensland's is legislation
  staged to **1 January 2027**, and every Australian sentence names its state.
- **The bleach step is WITHHELD in both markets' mould wording**, pending an owner ruling: NSW Health's reads as a
  sequence after vinegar, Tenancy Services' as an alternative, and wording that places the two together risks a
  member mixing them. Each market's vinegar dilution is approved and registered; neither bleach dilution has a
  registry entry, so neither can pass anything. The only mention of bleach anywhere is the Victorian never-mix
  caution in the AU block, which instructs nobody to use it. The NZ block does not mention bleach at all.
  **`home-ventilation` AU is deliberately non-numeric** and says so in the member-facing text — no Australian source
  read publishes an airing time, humidity target or extraction rate, and New Zealand's figures may not be borrowed.

**All three went live with OG-13 at Stage 9.54.** What Stage 9.53 changed in them (owner ruling 1, and two fixes found by reading the rendered files):

- **Bleach is gone from both markets.** Stage 9.52 withheld every bleach *instruction*; the ruling removes bleach
  entirely, so the Victorian never-mix caution went too — it was the only sentence left in either market that named
  bleach at all. A test asserts no mention in either body and none in the numeric registry. The withheld dilutions
  (one part bleach to three parts water, NZ; 250 mL in 4 litres, NSW) remain unregistered and cannot pass anything.
- **AU gained PPE.** NSW Health's PPE list is written for cleaning *with bleach*, so it cannot be attached to the
  vinegar method. Better Health Channel's non-bleach mould-removal guidance supplies AU's instead — ventilation,
  shower cap, rubber gloves, eye protection, overalls, footwear, a P1 or P2 face mask, who should not do the work,
  the P2 medical caveat, no dry brushing, HEPA-only vacuuming. NZ's (Tenancy Services) is unchanged.
- **`home-ventilation` AU named New Zealand** in an internal rule written into member-facing wording by mistake.
  `verify-prep` caught it. It is removed, and a test now asserts no AU block names NZ, FENZ, Tenancy Services or
  MBIE, and no NZ block names Australia, NSW, Queensland or Victoria.
- **`indoor-combustion` is deliberately NOT carried by OG-13** (owner ruling 2, Stage 9.54). The audit has no row about bringing an outdoor appliance inside, `carbon-monoxide` covers the risk row 2 asks about, and that block's unflued-LPG paragraph would put gas wording in an Air resource before the gas research stage. **The block and the detector are unchanged** — this is a resource-level selection, recorded in `metadata-review.json`, and the resources that need it still carry it.
- **A sentence printed twice** when both blocks were carried. `home-ventilation` AU now drops NSW Health's
  lacking-ventilation clause **only when `mould-and-dampness` is also present**, through the existing
  `marketBodyWhen` mechanism. Carried alone, it keeps the full wording.

**The numeric claim registry (blocking since Stage 9.50; 29 claims since Stage 9.52).** `admin-import/config/numeric-claims.json` holds 29 approved non-treatment figures — the storage and pantry baselines, the roof conversion and its worked example, MBIE's tank sizes, stand heights and annual desludging, NSW's 1 mm screen example and the water-weight conversion. Each carries its market, jurisdiction, owning resources, context patterns, required label, source, authority, date and limitations. **It blocks from Stage 9.50**: an unexplained figure fails preparation for that market, exactly as the treatment gates do. Structure, member inputs and treatment-owned figures never block, an empty registry approves nothing, and percentages and currency are detected but held out of this first activation. The live library returns **zero** findings.

**The ratio claim type (Stage 9.52).** A dilution carries no unit, so the unit scanner could never see one: "one part
bleach to three parts water" would have reached a member with nothing checking it. `claimType: "ratio"` closes that.
A ratio is detected as a **capacity** candidate measured in **parts** — a ratio of volumes is still a volume claim —
so it blocks under the existing capacity activation rather than needing a new blocking category. Two guards keep it
narrow: the sentence must be about mixing or diluting, and a scoring instrument is refused outright, so a 1–5 room
score or a "10–20 = Critical" band is never read as chemistry. A **bleach** ratio still belongs to
`treatment-sources.json`; the numeric scanner defers to it and offers no second opinion. Nothing in the live 19
resources carries a dilution outside treatment, so the path is exercised by tests and by the new blocks' own wording,
not yet by live member content.

**The treatment source registry.** `admin-import/config/treatment-sources.json` holds the 21 approved treatment
claims — 9 NZ, 12 AU — each with its market, jurisdiction, method, wording, numeric value, source, authority, date,
household applicability, limitations and contamination exclusions. No claim serves both markets. enHealth's national
rainwater guidance is recorded as **SOURCE_UNAVAILABLE / NOT RELIED UPON** and is cited nowhere.

**The gas topic detector reads teaching, not word count (Stage 9.57).** It used to require a gas safety block from any resource using the bare word three times, with no teaching condition — which demanded one from OG-17, a wood-burner planner whose only gas content is "the gas stops flowing" and "Gas supplies can be disrupted". It now requires the block only when a document names a gas appliance beside an action or a figure, names a fuel beside gas equipment, or routes a member to a licensed gasfitter. `gas supply` is deliberately not a subject; fuels are held to a stricter test than appliances, because listing a fuel among options is how planning documents work (OG-B12 and OG-26 both do it, and both are live); and proximity never crosses a sentence or line, because PDF-extracted tables flatten into long runs. `fuelTeachingSignals()` is exported so any future gas exemption lapses automatically, as the treatment and fire ones do. The compound fuel check `GAS_SAFETY_REQUIRED` gained propane, butane, mains and reticulated gas, patio heater, camping stove, flued gas, gas leak/meter/line/fitting, LCC27 and POL valve — but **not** `gasfitter`, which is approved, universal and printed in the disclaimer on all 20 live resources.

**Safety enforcement reads the migrated output, not the legacy source (Stage 9.58).** Until this stage a resource could be held for a safety block because of a sentence migration had already removed — every other gate read the member-facing file, and safety requirements alone read the source. There are now two layers. **`sourceSafetyTopics`** is what the legacy document taught: migration evidence, used for comparison and removal tracking, and it requires nothing by itself. **`requiredSafety`** is what the migrated market file teaches, read per market before the blocks are injected so a block's own wording can never create a requirement; a topic taught without its block still fails closed, and teaching *introduced* during migration is now caught, which the old rule could not see at all.

The balancing rule is **removal accountability**: a safety topic may leave a resource, but not quietly. A removal is accounted for automatically when the resource still carries that topic's block (`REPLACED_BY_BLOCK`) or holds an owner-approved exemption for it (`OWNER_APPROVED_REMOVAL`, which keeps the owner's own reason, approver and date). Anything else needs a written `safetyTopicDispositions` entry — `REMOVED`, `REWRITTEN`, `REPLACED_BY_BLOCK`, `NON_TEACHING_CONTEXT` or `OWNER_APPROVED_REMOVAL` — and without one preparation fails with `SAFETY_TOPIC_REMOVED_WITHOUT_RECORD` and the topic stays required. A disposition can never hide teaching that is still present. Eight of the twenty live resources have such a removal (OG-02, OG-08, OG-13, OG-18, OG-26, OG-B08 and OG-B12 twice); all eight were already accounted for by a carried block or a reviewed exemption, so no disposition had to be written and no resource lost a block it needed.

**Prices need a disposition (Stage 9.61).** `currency` is held out of numeric blocking by the Stage 9.50 activation and prep's `figure-needs-source` flag matches only `%` and `°C`, so a member-facing price used to pass every gate — 55 of them were removed across seven migrations by a person reading the document. `admin-import/audit/price.ts` now scans each resource's own text, before blocks are injected, for currency symbols and codes with amounts, amounts written in words, and numeric cells under a cost-like table header. Each price found needs a recorded `priceDisposition` — **REMOVE**, **CURRENT-SOURCE-REQUIRED** (with source, authority, date checked, scope and freshness) or **OWNER-APPROVED-LIVE-PRICE** (owner, date, owning product, and only for a price OffGrid056 itself controls) — or preparation fails. REMOVE fails if the price is still present. Market scoping is strict: an NZ approval does not validate an AU file, and no currency is converted. A missing or empty list approves nothing.

It deliberately does not fire on a currency symbol with no amount (OG-26's budget tiers, OG-17's worksheet line, OG-20's and OG-21's blanks), a percentage in a cost column, a date, a standard's number, a resource id or a helpline number — and it skips any table row whose cell count differs from the header's, because a colspan makes the column index meaningless. **It is a presence-and-review gate, not a freshness validator:** it never judges whether a price is correct or current.

## Market differences that must never be crossed

| Topic | NZ | AU |
|---|---|---|
| Emergency number | **111** | **000** (and 112) |
| Emergency agency | Civil Defence | State Emergency Service |
| Electrical licence | **licensed electrical worker** | **licensed electrician** |
| Plumbing licence | qualified plumber | licensed plumber |
| Solar DIY rule | homeowner wiring rules do not cover PV | DIY electrical work is illegal |
| Generator refuelling | shut down, **cool at least 10 minutes** (WorkSafe) | off and cooled — **no time given** |
| Generator weather / leads | **no NZ wording exists** — not borrowed from AU | shelter from rain, don't cover, heavy-duty outdoor leads rated to the generator |
| CO alarm | "consider installing carbon monoxide alarms" | battery-operated alarm; near bedrooms; UL2034/EN50291 |
| Drinking water (storage) | **3 L per person per day for 3 days**; bleach method (5 drops/L); check every 6 months | **10 L per person for 3 days**; boil 1 minute; check twice a year; **no single national bleach ratio** |
| Water treatment (approved, live in OG-09) | boil **one minute**; bleach **5 drops/L or ½ tsp/10 L, 30 min**, plain unscented; annual testing; **no micron or UV figures published** | rolling boil (NSW) / "at least 1 minute" (WA); bleach ratios **differ by state and by bleach strength**; NSW publishes micron ratings and UV requirements; **no national household frequency** |
| Food in a power cut | Get Ready order, MPI doors/refreeze/discard — **no timings, MPI publishes none** | NSW Food Authority: about 4 hours fridge, at least 24 hours freezer, eskies, 2-hour cooking rule |
| Consents / approvals | building consent, "consents", council | permits or approvals; varies by state and territory |
| Rainfall / weather data | regional council, NIWA | Bureau of Meteorology |
| Rainwater tank sizes | MBIE's published figures, labelled as NZ guidance and examples for each use | **none published** — suppliers, council, state and territory |
| Rainwater plumbing | building consent for a mains-connected system; backflow device by a qualified plumber; not every tank needs a consent | licensed plumber; council, state and territory rules |
| Insect screens | screen the inlet; keep the tank covered | NSW Health's about-1 mm figure, **labelled NSW guidance, not a national rule** |

**The invalid figure:** the old NZ fridge figure of "less than 24 hours" is **wrong and must never return**. MPI
publishes no timings.

## Fail-closed rules

| Rule | What it does | Where |
|---|---|---|
| **Unverified market** | a block with no wording for a market renders the not-verified token and blocks that market | `safety-blocks.json` |
| **Required block missing** | a topic detector (generator, solid fuel, gas, batteries, drinking water, food, fire) requires its block; without it every market is blocked | `admin-import/audit/group-a.ts`, `prep.ts` |
| **GAS_SAFETY_REQUIRED** | LPG, natural gas, biogas, dual-fuel or a gas appliance in a resource's own text blocks every market — **no gas guidance is approved** | `prep.ts` |
| **FUEL_GUIDANCE_REQUIRED** | diesel blocks every market — the generator block covers **petrol only** | `prep.ts` |
| **Unapplied copy change** | any recorded change that did not apply fails verification | `verify-prep.mts` |
| **Other market named** | an AU file naming New Zealand (or an NZ file naming Australia) fails verification | `verify-prep.mts` |
| **Scoped trim mismatch** | a resource-specific sentence removal whose source wording changed blocks that market | `prep.ts` |
| **Route collision** | real vs real, or placeholder vs placeholder, on one route fails the build; real vs placeholder fails outside the private preview | `lib/content/supersession.ts` |
| **Learning-path collision** | private vs private, or demo vs demo, on one path id fails the build; private vs demo fails outside the private preview. A path step that names an unknown resource, or the same step twice, fails validation | `lib/content/supersession.ts`, `tools/validate-content.ts` |
| **Unapproved trim** | a scoped trim that is still a proposal holds the resource at preview | `prep.ts` |
| **`--real`** | refused | `admin-import/cli.mts` |
| **`UNSOURCED_BLEACH_RATIO`** | a chlorination dose with no approved entry for that market blocks it | `admin-import/audit/treatment.ts` |
| **`UNSOURCED_BOIL_TIME`** | a boil duration with no approved entry blocks it; **any** altitude wording near boiling blocks it | same |
| **`UNSOURCED_FILTER_CLAIM`** | a filter efficacy claim, micron value or "makes it safe" with no approved entry blocks it (table rows count as claims) | same |
| **`UNSOURCED_UV_CLAIM`** | a UV dose or performance claim with no approved entry blocks it; NZ may only name UV as an option | same |
| **`UNSOURCED_TESTING_INTERVAL`** | a testing or inspection interval with no approved entry blocks it; AU operator schedules need their label | same |
| **`UNSAFE_CONTAMINATED_SOURCE_GUIDANCE`** | contaminated-source guidance blocks the market unless the document carries that market's approved limitation | same |
| **No registry** | with no treatment registry supplied, nothing is approved and every treatment claim fails | `prep.ts` |
| **`UNSOURCED_NUMERIC_CLAIM`** | a capacity, distance, height, weight, pressure, interval, temperature, area or power figure with no approved entry for that market **and** that resource blocks the market; percentages and currency are reported but do not block in this first activation | `admin-import/audit/numeric.ts`, `prep.ts` |

## Scoped exceptions (resource-specific only)

**There are no global exceptions.** Each one names one resource and, where relevant, one exact piece of text; if that
text changes, the exception stops applying.

| Resource | Exception | Why | Approved |
|---|---|---|---|
| **OG-18** | exempt from `food-safety-power-cut` | its only trigger is the "Fridge / freezer" row of an energy-use table; it teaches nothing about food in an outage. **Lapses automatically** if any other fridge/freezer/pantry mention appears. | Stage 9.30 |
| **OG-20** | AU: the CO block drops its alarm sentence | the generator block already gives that instruction; the CO block keeps risk, symptoms, emergency action and numbers | Stage 9.34 |
| **OG-B12** | AU: the same CO trim | same reason | Stage 9.36 |
| **OG-15** | fuel check: exact text *"12. Backup heating exists (fireplace, wood burner, gas heater, portable)"* | list-only; no gas-use instruction; the resource already carries CO and indoor-combustion | Stage 9.36 |
| **OG-26** | fuel check: exact text *"Emergency heating (gas heater / thermal blankets)"* | a budget line naming options; no gas-use instruction | Stage 9.36 |
| **OG-02** | exempt from `fire-and-emergency`, allowed mentions *"Fire in the home"* and *"Bushfire risk area"* | a risk identifier: the member ticks hazards. Audited in three layers — those two checklist labels are its only fire references, in the legacy source and unchanged by migration, with no fire teaching anywhere and none in the blocks. **Hazard identification only:** it lapses on any other fire or bushfire wording, and on any fire-teaching signal (extinguisher, smoke alarm, defensible space, escape planning, evacuation, suppression…), including wording that never says "fire". | Stage 9.47 |
| **OG-B08** | exempt from `fire-and-emergency`, **zero allowed mentions** | the legacy source's three fire phrases ("Good for bushfire zones", "Rural; fire resistance", "Not blocking fire egress paths") are all removed in migration; the member-facing text carries no fire, bushfire, smoke-alarm or evacuation wording, and no approved fire block exists. **Lapses on any of that wording** — the detector now also catches "bushfire" and "wildfire". | Stage 9.46 (ruling 2) |
| **OG-08** | exempt from `water-treatment`, allowed mention *"filtration systems"* | audited in three layers: its own migrated text has one treatment word, in a sequencing line, and no teaching signal; the legacy source's bleach dosing was removed at migration; the injected storage block's claims are registry-backed. Final-output gates: 0 findings in both markets. **Lapses automatically** on any other treatment word *or* any treatment-teaching signal, even one using no treatment word at all. | Stage 9.43 (rulings 8–10) |

**Pump electrical wording (OG-10, owner ruling 9, Stage 9.40):** a resource that only mentions a pump does **not** get the solar/battery/generator electrical block. It carries a short market-specific line instead — NZ *"an appropriately licensed electrical worker"*, AU *"a licensed electrician"*. The canonical electrical block is unchanged.

**Block-level trimming** (not resource-specific, but narrow): where the generator block is present, the electrical
block drops its generator paragraph, so one point is not made twice. Every other resource keeps the full electrical
block.

## Pending safety research

Each of these blocks resources until it is researched from official NZ **and** AU sources and approved.

| Research | Needed for | Notes |
|---|---|---|
| **Gas / LPG** | OG-17, OG-B09, any gas appliance or LPG generator | the strict gas rule stands. No NZ/AU household gas-appliance block exists. **It also blocks MBIE's unflued-gas advice in any Air resource.** |
| **Diesel** | diesel generators or heating | the generator block is petrol-only |
| ~~Fire and smoke alarms~~ | ~~OG-13~~ | **DONE.** Researched at Stage 9.51, built at Stage 9.52 as `fire-and-smoke-alarms`: FENZ and Tenancy Services (NZ); Fire and Rescue NSW and the Queensland Fire Department (AU, each state-labelled; Queensland's is law, staged to 1 Jan 2027). **No national Australian rule is stated.** The block answers the fire detector's `fire-and-emergency` requirement via `answers`, so the two reviewed hazard-label exemptions are untouched. |
| **Mould and dampness** | OG-13, and any mould guidance | **BUILT at Stage 9.52 with the bleach step WITHHELD.** Approved and registered: white vinegar half and half on painted surfaces (NZ, Tenancy Services); mild detergent or four parts vinegar to one part water (AU, NSW Health). **Still needs an owner ruling:** NSW Health's bleach step reads as a sequence after vinegar and Tenancy Services' as an alternative, so neither bleach dilution is implemented or registered. The dilutions differ by market and may not cross. NSW's PPE list belongs to bleach cleaning, not to vinegar. |
| ~~Home ventilation~~ | ~~OG-13~~ | **DONE.** Built at Stage 9.52 as `home-ventilation`: MBIE for NZ (18–22°C, airing about 15 minutes several times a day, up to 40 litres a day of ground moisture without a vapour barrier, vent outside not into the roof space). **AU is non-numeric and says so in the member-facing text** — no Australian source read publishes an airing time, humidity target or extraction rate, and NZ's figures may not be borrowed. No gas appliance is named in either market. |
| ~~Water treatment~~ | ~~OG-09~~ | **DONE.** Researched at Stage 9.42, approved and built at Stage 9.43: the `water-treatment` block, the source registry and the six gates are in place. OG-09 is live as the Household Water Treatment Guide. |
| **Grants and rebates** | OG-16 | NZ programmes; AU state and territory schemes |
| **Consents and approvals** | OG-B11, and tank/plumbing wording | NZ council consents; AU state, territory and council |
| **Generator separation distance** | any generator resource | **no NZ or AU official figure exists**; the US 20-foot rule is not used, and wording stays non-numeric |
| **US and CA** | publishing to those markets | **non-publishable** until their own review |

## Standing wording rules

- **No invented safety wording.** Every sentence traces to an official NZ or AU source, read live, with the date
  recorded in the block's `sources`.
- **No borrowed figures.** A market that publishes no figure gets non-numeric wording, and the limitation is
  reported.
- **Workplace rules are not household rules.** WorkSafe's petrol limits (20 m smoking, 50 L storage) are excluded
  until a household-specific source supports them.
- **Do not bypass bot protection** to read a source. If a page cannot be read, the figure stays unresolved.

## Stage 9.62 - gas blocks

gas-and-lpg-general, unflued-gas-heating, gas-cylinder-safety, gas-leak-response, gas-installation-and-servicing built. AU core non-numeric; AU state figures are category B/C overrides, never served. AU gas-leak-response has no body (fails closed; ACT has no published procedure). All pending owner approval.


## Stage 9.62A - gas hardening

AU common core: national source or 4+ independent jurisdictions, none contradicting, no state limit; 15 claims demoted to labelled category B (not served). AU unflued-gas-heating and gas-leak-response have no body (fail closed). Gas release = detected topic -> required block set -> every block carried, owner-approved and with market wording; no blanket release. OG-B09 requires gas-and-lpg-general only (installation 'recommended' withdrawn). OG-24 requires general + installation (licensing routing).


## Stage 9.62C

Numeric block ownership is exact (a figure inside block A is not credited to block B or to resource text). OG-27 weekly-review cadence = OWNER-DEFINED SCHEDULE, OG-27 only, not safety guidance.


## Stage 9.62D

Gas blocks: AU approved (general, cylinder, installation); AU unflued + leak fail closed; NZ pending for all five. OG-B09 = general only (no editorial additions); OG-24 = general + installation; OG-17 = none.


## Stage 9.63

Gas blocks: NZ and AU (three blocks) approved; AU unflued + leak fail closed. NZ numeric gas claims OWNER-APPROVED. OG-B09 requires gas-and-lpg-general only; solid-fuel-heating needs an owner decision (carry or disposition).


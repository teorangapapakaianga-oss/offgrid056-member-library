# SAFETY REBUILT FROM NZ + AU SOURCES · CORRECTIONS PROPOSED · NOTHING DEPLOYED

- All five topic safety blocks are rewritten **separately for New Zealand and Australia**, from each country's
  own official guidance. **No US or Canadian wording remains.**
- The roof-work block is new.
- Every copy change below is a proposal. None is applied.
- Batch 2 is **not deployed**, and the live preview is unchanged at `619b70d5`.

**Date:** 22 September 2026

---

## Read this first

1. **The old electrical block was wrong for New Zealand.** It said anything touching fixed wiring must be done by
   a licensed worker. In NZ, homeowners may legally do some of their own wiring. **Solar (PV) is excluded from
   that, and the new NZ wording says exactly this.** In Australia, *all* DIY electrical work is illegal, so the
   two markets cannot share one sentence.
2. **Two official sites could not be read directly.** Fire and Emergency NZ (wood burners, the one-metre rule) and
   ACC (ladders) block automated access, and I did not try to get round that. Their wording here comes from
   search-indexed text of their pages. **Please confirm those three NZ sentences against the live pages before
   approving**; they are marked below.
3. **"Action Plan Plus" is in your July 2026 offer ladder** as Tier 4, a paid, Skool-delivered upsell. So it may
   not be legacy. That decision is yours (§6).
4. **OG-15's "10% per degree" is overstated.** The Australian government figure (energy.gov.au) is **5–10%**, and
   New Zealand's EECA gives no percentage.
5. **Resolved from sources, no decision needed:** the NZ sources disagree on how often a gas heater should be
   serviced (Health NZ: yearly; WorkSafe: at least every other year), so the NZ CO block states no interval.
   Unflued heaters are the exception: Health NZ's page on them says "at least once a year", and that is used.

---

## 1. Final metadata

| | OG-27 | OG-B07 | OG-15 |
|---|---|---|---|
| Title | 90-Day Implementation Roadmap | Solar Planning Deep Worksheet | Warm Home Scorecard |
| Type | planner (HIGH-confidence inference) | **worksheet** (owner-approved) | assessment (HIGH-confidence inference) |
| Foundation | **general** (owner-approved) | energy — **source-supported** (title and content are solar) | shelter — **source-supported** (audit HIGH; warmth, insulation and draughts) |
| Category | **planning** (owner-approved) | solar — **source-supported** (solar planning throughout) | **heating** (owner-approved) |
| Difficulty | **intermediate** — owner-approved classification | **advanced** — source-supported by cover | **beginner** — owner-approved classification |
| Estimated time | **30 min** (owner-approved) | **30 min** (owner-approved) | **30 min** (owner-approved) |
| Tags | none | none | none |
| Validation | ✅ passes | ✅ passes | ✅ passes |

All three are recorded with their basis in `config/metadata-review.json`.

---

## 2. NZ / AU safety-source matrix

All five blocks are **PROPOSED**, and every block's wording **varies by market**.

**Fail-closed rule:** a market without its own verified wording (US, CA) now resolves to an unresolvable token
and is **not publishable**. It no longer inherits another country's advice. A regression test covers this.

### Block A — Batteries and electrical safety (CRITICAL)

**Resources:** OG-27, OG-B07

**Why the wording varies:** the law and the licence name differ, and so does the battery-fire instruction.

**NZ sources:**

- [WorkSafe — DIY solar installations](https://www.worksafe.govt.nz/about-us/news-and-media/diy-solar-installation) (28 Aug 2024)
- [WorkSafe — Portable generators after an emergency](https://www.worksafe.govt.nz/topic-and-industry/natural-events-and-emergencies/using-portable-generators-after-a-natural-event-or-emergency/) (18 Jul 2024)
- [WorkSafe — Doing your own electrical work](https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-electricity/getting-electrical-work-done/doing-your-own-electrical-work/)
- [FENZ — Lithium-ion battery flyer](https://www.fireandemergency.nz/assets/Uploads-v2/Lithium-ion-batteries/FENZ-2055-Li-ion-flyer-03.pdf)

**AU sources:**

- [Energy Safe Victoria — Electrical DDIY](https://www.energysafe.vic.gov.au/electrical-ddiy-dont-do-it-yourself)
- [ESV — Using a generator safely](https://www.energysafe.vic.gov.au/community-safety/emergencies/using-generator-safely)
- [Electrical Safety Office Qld](https://www.electricalsafety.qld.gov.au/electrical-safety-home/dont-do-your-own-electrical-work)
- [ACCC — Lithium-ion batteries guide](https://www.productsafety.gov.au/consumers/be-safe-around-the-home/safely-use-batteries-and-technology/lithium-ion-batteries-guide)

**NZ wording:**

> **Solar panels, home batteries, inverters and any permanent generator connection must be installed by a
> licensed electrical worker.** The rules that let homeowners do some of their own wiring do not cover solar
> (PV) systems, and some battery systems can give off flammable gases, so how and where they are installed
> matters.
> **Never connect a generator to your house wiring unless the connection was installed by an electrician.** Plug
> appliances directly into the generator instead, and use a safety switch (RCD) when equipment is outside or in a
> damp place.
> Stop using any lithium-ion battery that is too hot to touch, swelling, leaking, cracked or dented. **If a battery
> is giving off smoke, vapour or flames, do not touch or pick it up: get out of the building and call 111.**

**AU wording:**

> **Electrical work in your home — including solar, home batteries, inverters and generator connections — must be
> done by a licensed electrician.** DIY electrical work is illegal, even for small jobs, and DIY home-battery
> installations are a serious fire risk.
> **Never power the house by plugging a generator into a power point or switchboard** unless a licensed
> electrician has installed a dedicated generator inlet: it can back-feed the network and put utility workers and
> neighbours at risk. Plug appliances into the generator with heavy-duty extension leads rated for it.
> Do not use a lithium-ion battery that is swelling, leaking, overheating, damaged or venting gas. **If a battery
> is overheating, smoking or on fire, call Triple Zero (000) and get to a safe place.** Do not try to put it out
> with a fire extinguisher.

### Block B — Carbon monoxide (CRITICAL)

**Resources:** OG-27, OG-15

**Why the wording varies:** the first-aid path differs. NZ says get outside, then call 111. AU says call 000 for
severe symptoms, or the Poisons Information Centre for mild ones.

**NZ sources:**

- [Health NZ — Carbon monoxide poisoning](https://www.healthnz.govt.nz/conditions-treatments/emergencies-and-first-aid/carbon-monoxide-poisoning)
- [WorkSafe — Keep yourself safe from carbon monoxide](https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/carbon-monoxide-hazards/)

**AU sources:**

- [NSW Health — Carbon monoxide safety factsheet](https://www.health.nsw.gov.au/environment/factsheets/Factsheets/carbon-monoxide.pdf) (May 2025)
- [Vic Dept of Health — CO in the home](https://www.health.vic.gov.au/environmental-health/carbon-monoxide-poisoning-in-the-home)

**NZ wording:**

> **Carbon monoxide (CO) is a poisonous gas you cannot see or smell.** It comes from anything that burns fuel —
> gas and LPG heaters, wood burners, barbecues, generators and vehicle engines.
> Symptoms include headache, dizziness, weakness, confusion and feeling sick. **If you suspect CO poisoning, get
> outside into fresh air immediately, then call 111 for an ambulance.**
> Signs a gas appliance is not burning properly include a yellow rather than blue flame (unless it is a
> flame-effect heater designed that way), soot around it, or a smell like car exhaust. Turn it off and contact a
> licensed gas worker. Have heating appliances serviced by a qualified person, and consider installing carbon
> monoxide alarms.

**AU wording:**

> **Carbon monoxide (CO) is a dangerous gas you cannot see or smell.** It is made by burning fuels such as gas,
> petrol, wood and charcoal, and it can build up inside when doors and windows are closed.
> Small amounts can cause headaches, nausea, vomiting and weakness; larger amounts cause dizziness, fainting and
> loss of consciousness. **If someone is dizzy, fainting or unconscious, call Triple Zero (000).** If people have
> milder symptoms, get everyone out into fresh air and call the Poisons Information Centre on 13 11 26.
> Have gas heaters checked by a licensed gasfitter at least every two years. Consider a carbon monoxide alarm near
> bedrooms and rooms with gas heaters; NSW Health advises choosing one that meets the US (UL2034) or European
> (EN50291) standard.

The AU alarm standards are named because **NSW Health itself** names them; Australia has no national CO-alarm
standard. The standard's old line about buying alarms with "your country's certification mark" is gone: it was
Canadian guidance.

### Block C — Heaters and indoor combustion, "Never bring it inside" (CRITICAL)

**Resources:** OG-27, OG-15

**Why the wording varies:** the unflued-heater rules differ, and neither country's source bans unflued heaters
outright, so no ban is stated.

**NZ sources:**

- [WorkSafe — CO hazards](https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/carbon-monoxide-hazards/)
- [WorkSafe — Generators](https://www.worksafe.govt.nz/topic-and-industry/natural-events-and-emergencies/using-portable-generators-after-a-natural-event-or-emergency/)
- [Health NZ — Unflued gas heaters](https://www.healthnz.govt.nz/health-topics/keeping-healthy/healthy-homes-environments/household-items-and-electronics/unflued-gas-heaters)
- [WorkSafe — Cabinet heater safety](https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/cabinet-heater-safety/) ⚠ search-indexed text

**AU sources:**

- [NSW Health — CO factsheet](https://www.health.nsw.gov.au/environment/factsheets/Factsheets/carbon-monoxide.pdf)
- [NSW Health — Unflued gas heaters](https://www.health.nsw.gov.au/environment/factsheets/Pages/unflued-gas-heaters.aspx)
- [ESV — Generators](https://www.energysafe.vic.gov.au/community-safety/emergencies/using-generator-safely)

**NZ wording:**

> **Outdoor appliances stay outdoors.** Never use a barbecue, patio heater, camping cooker or generator inside your
> home or garage — they are not built for indoor use and they produce carbon monoxide. Run a generator only
> outside in a well-ventilated place, with its exhaust directed away from the house.
> If you use an unflued gas heater, such as an LPG cabinet heater: never use it in a bedroom, bathroom, caravan or
> tent; keep internal doors and at least one window open; have it serviced by a qualified person at least once a
> year; and use it for as short a time as you can. Unflued heaters are not recommended in homes where someone has
> a breathing condition. ⚠

**AU wording:**

> **Outdoor appliances stay outdoors.** Never bring barbecues, grills, outdoor gas heaters or patio heaters inside,
> and never run a generator or other petrol engine inside your home or garage — even with the doors or windows
> open. Use a portable generator only outside, in a well-ventilated area.
> If you use an unflued gas heater: check its instructions allow indoor use, never use it overnight in the room
> where you sleep, keep the room's air vents clear (or a door or window open if it has none), and have it checked
> by a licensed gasfitter at least every two years.

**Generator distance:** neither market's source states a minimum distance, so none is given. The US "20 feet" is
gone.

### Block D — Wood burners and open fires (HIGH)

**Resources:** OG-15

**Why the wording varies:** it is similar in substance, but each sentence traces to its own market's source, and
the five-day ash figure is NZ-only.

**NZ sources** (⚠ both search-indexed text):

- [FENZ — Urban home fire safety checklist](https://www.fireandemergency.nz/at-home/urban-home-fire-safety-checklist/)
- [FENZ — Keep a metre from the heater](https://www.fireandemergency.nz/incidents-and-news/news-and-media/keep-a-metre-from-the-heater/)

**AU sources:**

- [CFA — Home heating safety factsheet](https://www.cfa.vic.gov.au/ArticleDocuments/372/Factsheet%20Heating.pdf) (Aug 2019)
- [CFA — Chimney and flue](https://www.cfa.vic.gov.au/plan-prepare/fires-in-the-home/home-fire-safety-communications-kit/chimney-and-flue)

**NZ wording (⚠ confirm against FENZ):**

> **Have your chimney checked or swept every year**, before you rely on it through winter. Always use a fireguard
> or spark guard when the fire is lit.
> Keep clothes, bedding and anything else that can burn **at least one metre** from any heater or fire.
> Let ashes cool, then empty them into a metal bin and pour water over them — ashes can take up to five days to
> cool completely.

**AU wording:**

> **Have your chimney and flue cleaned every year**, and checked before winter. Always use a fire screen in front
> of an open fire.
> Keep firewood, drying clothes and anything else that can burn **at least one metre** from the fire or heater,
> and burn only dry, clean wood.
> Make sure ashes are cold before you get rid of them, keep them in a metal container, and put the fire out before
> you go to bed or leave the house.

The CFA factsheet is dated **August 2019**, older than the other sources. It is still linked from the CFA site,
but I have not confirmed that it is CFA's latest guidance.

### Block E — Working at height, "Stay off the roof" (CRITICAL, new)

See §3.

---

## 3. Roof-work safety wording (OG-B07)

This follows your principle: the worksheet must not send anyone onto a roof. It is **CRITICAL** and sits at the
top of the document.

**The first paragraph is shared** between NZ and AU:

> **You do not need to climb onto the roof to complete this worksheet.** Take measurements from your house plans,
> ask the installers who are quoting to measure the roof for you, or estimate from the ground — and leave blank
> anything you cannot fill in safely.

**The second paragraph varies by market.**

**NZ** (ACC ⚠ search-indexed text):

> Falls are the most common cause of injury in Aotearoa. If you do use a ladder, use one in good condition on a
> firm, even surface, keep three points of contact, avoid the top rungs, and get down and move the ladder rather
> than over-reaching. Leave work on the roof itself to a professional.

**AU** ([ACCC — Ladders guide](https://www.productsafety.gov.au/consumers/be-safe-around-the-home/use-garden-and-outdoor-products-safely/ladders-guide)):

> On average more than 30 Australians die each year after falling from a ladder. If you do use one, set it up on a
> firm, flat surface, have another person hold it, and do not work in wet or windy conditions. Leave work on the
> roof itself to a professional.

**Deliberately not stated:** heights, ladder angles, load ratings and roof-pitch limits. WorkSafe's roof figures
are **workplace** requirements, not household advice.

**A matching copy change** (in §7) replaces the worksheet's own *"Measure carefully or provide to installer"*,
which currently invites measuring.

---

## 4. OG-15 — the five claims

**1. Hypothermia**

- **Original:** *"In a grid-down winter scenario, hypothermia is a real threat within hours — not days."*
- **Findings:** Victorian and NSW health guidance says hypothermia can happen **indoors** in a cold home, and older
  people, babies and people with health conditions are most at risk. **No official source gives "within hours"**
  for a home.
- **Action:** **B — rewrite, without the timing.**
- **Proposed:** *"In a winter power cut, a cold home can quickly become a health risk — especially for babies,
  older people and anyone with a health condition."*

**2. "About survival"**

- **Original:** *"A warm home is not just about comfort; it is about survival."*
- **Findings:** This is framing, not a fact. Health NZ says cold, damp homes increase the risk of respiratory
  illness.
- **Action:** **B — rewrite.**
- **Proposed:** *"A warm, dry home is about health, not just comfort."*

**3. Bedroom temperature**

- **Original:** *"Bedrooms comfortable for sleeping (16–18°C) without excessive heating"*
- **Findings:** No source supports **16°C for adults**; the figure mixes in guidance meant for babies.
  - [Health NZ](https://www.healthnz.govt.nz/health-topics/keeping-healthy/healthy-homes-environments/healthy-homes):
    keep the home **at least 18°C**, and **above 20°C** with babies, children or older people.
  - The Better Health Channel (Vic): **at least 18°C** for people at risk, and 16–20°C only for a **baby's**
    sleeping room.
- **Action:** **B — rewrite, without a number.** A scoring question should not carry a threshold.
- **Proposed:** *"Bedrooms stay comfortably warm overnight without excessive heating"*

**4. The 10% saving**

- **Original:** *"Every 1°C you lower your thermostat saves approximately 10% on heating bills."*
- **Findings:**
  - **AU:** energy.gov.au says each extra degree adds **5–10%** to energy use, and recommends 18–20°C. ⚠ The page
    timed out from here; the figure comes from search-indexed text.
  - **NZ:** [EECA](https://www.eeca.govt.nz/for-homes/energy-saving-technology/heating-and-cooling/use-your-heat-pump-efficiently/)
    says 18–21°C is the sweet spot and higher settings use more energy, but gives **no percentage**.
  - "Approximately 10%" overstates both.
- **Action:** **B — rewrite, without a number**, so NZ and AU can share it.
- **Proposed:** *"Each extra degree of heating uses more energy, so heat to a healthy temperature rather than a
  higher one."*

**5. The 30% difference**

- **Original:** *"A home heated to 21°C costs roughly 30% more than one heated to 18°C."*
- **Findings:** This is derived from claim 4, not sourced, and it inherits the overstated rate.
- **Action:** **C — remove.**
- **Proposed:** *(deleted)*

**What stays:** *"Wear layers. Use hot water bottles. Heat the person, not the whole house."* It is general
advice with no figure.

**For you to consider:** a sourced **positive** line, *"Health NZ recommends keeping your home at least 18°C,
and above 20°C with babies, children or older people"*. It would be NZ-only, so it would need a market override.
Not included unless you want it.

---

## 5. OG-25 correction proposal (live resource — nothing changed)

**Cover overlap: fixed in the pipeline, not yet live.** The corrected preview is rendered in `workspace/` and
shows the label clear of the title. **The live PDF will change only at a deployment you approve.**

**Legacy sequencing:**

| Where | Original | Proposed |
|---|---|---|
| Cover week label | Week 4 — Action Plan & Pathway | *remove* |
| Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| Cover title (in the document) | OG-25 Project Support Brief Template | Project Support Brief Template |
| Cover subtitle **and library description** | Day 25 — A professional brief anyone can understand | A professional brief anyone can understand |
| Header line | Day 25 — Week 4: Action Plan & Pathway \| OffGrid056 30-Day Programme | *remove* |
| Field 7 | Primary Risks You Are Addressing (from OG-01 Audit) | Primary Risks You Are Addressing (from your household risk assessment) |
| Closing heading | Day 25 Complete | Brief Complete |
| Closing | Next: Tomorrow you will build a 3-Tier Budget Planner that aligns spend with your actual financial capacity. | *remove* |
| Closing | Next: OG-26 3-Tier Budget Planner → | *remove* (OG-26 is not in the library) |

**Also flagged:** *"from OG-01 Audit"* refers to a programme resource that is not in the library. The replacement
wording deliberately does **not** point to OG-02 (Household Risk Identifier), which is live. If you want the
brief to point members to OG-02, say so.

**One flag that is not legacy:** *"Previous reports or assessments"* is an ordinary field in the brief. The
detector no longer flags it.

---

## 6. OG-B10 header — assessment

**Current:** *"OffGrid056 Action Plan Plus | Automated milestone tracking, budget burn-down, dependency mapping"*

**Is it current product wording?** It appears in your **July 2026 offer ladder** as **Tier 4, "Action Plan
Plus"**: an optional upsell delivered through **Skool**. So it is not obviously dead. But in the Member Library it
is a paid-tier name inside a resource, and the tier depends on Skool, which the library has moved away from.

**My assessment:** legacy **for this library**, whatever its status as an offer.

**Recommendation:**

- **Replace:** *"OffGrid056 Member Library | Automated milestone tracking, budget burn-down, dependency mapping"*
- **Or, if Action Plan Plus remains a live offer and you want resources to name it:** keep it, and I will remove
  it from the legacy list in `config/legacy-terms.json`.

**Not changed.**

Same question for **OG-B07**, whose cover label (*"OffGrid056 Action Plan Plus"*), description (*"…for Action
Plan Plus members"*) and header (*"Bonus Asset | Tier 3"*) all carry it. **"Tier 3" in the offer ladder is the
Skool community tier.**

---

## 7. Exact copy changes proposed (Batch 2) — none applied

**OG-27**

| Where | Original | Proposed |
|---|---|---|
| Cover week label | Week 4 — Action Plan & Pathway | *remove* |
| Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| Cover title (document) | OG-27 90-Day Implementation Roadmap | 90-Day Implementation Roadmap |
| Cover subtitle and description | Day 27 — Turn your plan into phased action with deadlines | Turn your plan into phased action with deadlines |
| Header line | Day 27 — Week 4: Action Plan & Pathway \| OffGrid056 30-Day Programme | *remove* |
| Week 1 | Confirm budget tier from OG-26. | Confirm your budget tier. |
| Week 5 | Submit any building consents. | Submit any building consent or permit applications. |
| Week 11 | Compare actual spend to OG-26 budget. | Compare actual spend to your budget. |
| Closing heading | Day 27 Complete | Roadmap Complete |
| Closing | Next: Tomorrow you will assign household responsibilities so resilience is a team sport, not a solo burden. | *remove* |
| Closing | Next: OG-28 Household Responsibility Roster → | *remove* |

**OG-B07**

| Where | Original | Proposed |
|---|---|---|
| Cover label | OffGrid056 Action Plan Plus | OffGrid056 Member Library *(subject to §6)* |
| Cover subtitle and description | Advanced solar planning for Action Plan Plus members. Roof orientation, shading analysis, load profile, and payback estimator — everything a professional installer needs to quote accurately. | Advanced solar planning: roof orientation, shading analysis, load profile, and payback estimator — everything a professional installer needs to quote accurately. |
| Header | Bonus Asset \| Tier 3 | *remove* |
| Roof section note | Measure carefully or provide to installer | Use your house plans or ask your installer — do not climb onto the roof to measure |
| Financial field | Feed-in tariff rate ($/kWh you sell back) | Feed-in tariff or buy-back rate ($/kWh you sell back) |

**OG-15**

| Where | Original | Proposed |
|---|---|---|
| Cover week label | Week 3 — Shelter, Heating & Energy | *remove* |
| Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| Header | Asset OG-15 \| Day 15 | *remove* |
| Why warmth matters | *(claims 1 and 2)* | *(see §4)* |
| Question 3 | *(claim 3)* | *(see §4)* |
| Heating cost reality check | *(claims 4 and 5)* | *(see §4)* |
| Closing heading | Day 15 Complete | Scorecard Complete |
| Closing | You now know exactly where your home loses heat and which 3 zones to tackle first. Tomorrow: what grants and programmes can help pay for the fixes. | You now know exactly where your home loses heat and which 3 zones to tackle first. |
| Closing | Next: OG-16 Grant Eligibility & Insulation Planner → | *remove* |

**On approval**, each change goes into `config/approved-copy.json` with its expected match count, as OG-B04's
did. The pipeline refuses any change whose original wording no longer matches exactly.

---

## 8. Updated readiness

| | Readiness | What stands between it and deployment |
|---|---|---|
| **OG-15** | **NOT READY** | approve Blocks B, C and D (confirm D's NZ wording against FENZ) · approve the §4 claim rewrites · approve the §7 copy |
| **OG-27** | **NOT READY** | approve Blocks A, B and C · approve the §7 copy |
| **OG-B07** | **NOT READY** (per your ruling) | approve Block A · approve roof-work Block E (confirm its NZ ladder sentence against ACC) · decide "Action Plan Plus" (§6) · approve the §7 copy |

**Metadata is complete** and validates for all three. What remains is safety approval and copy approval. All six
NZ/AU PDFs pass verification with the new blocks.

**The deployed four:**

- OG-B04: unchanged and still clean.
- OG-25 and OG-B10: flagged, with corrections proposed in §5–6.
- OG-02: not re-checked by the new detector (it runs through the pilot path, not prep). Worth a pass before its
  next redeploy.

---

## 9. Tests

**240 passed** (236 + 4 new). Lint and typecheck clean.

New tests:

- a market with no verified wording of its own fails closed
- no NZ block contains an AU number, and no AU block contains 111
- "Previous:" links and config-driven product and platform names are flagged
- a resource's own "Week 1: Learn" structure and the ordinary word "previous" are **not** flagged (false positives
  found and fixed this stage)

**Legacy detector:** everything it finds is marked `LEGACY_PROGRAMME_CONTEXT`. Unsourced claims are marked
`NEEDS_SOURCE`. Nothing is removed automatically.

The detector covers:

- "Day X Complete"
- "Next:" and "Previous:" links
- "Tomorrow" teasers
- 30-Day Programme and week labels
- asset/tier headers
- cross-references to other OG codes
- old product and platform names, from the new `config/legacy-terms.json`

## 10. Live Worker

**Unchanged:** version `619b70d5`, with OG-02, OG-B04, OG-B10 and OG-25.

- Access still returns **302** on `/` and on live and would-be PDF URLs.
- `private-assets/` is untouched: the same 12 files.
- Nothing from Batch 2 is staged.
- No real content is in GitHub.
- `--real` is refused.

**Stopped. Batch 2 not deployed; live resources not modified.**

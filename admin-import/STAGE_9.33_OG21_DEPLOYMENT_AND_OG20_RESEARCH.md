# OG-21 DEPLOYED (#13) · OG-20 GENERATOR-SAFETY RESEARCH (RESEARCH ONLY)

**Status:**

- **OG-21 is live** in the private preview as the 13th protected draft resource.
  - Worker `20a35551`; rollback `4daef2b4`.
  - Deployed with the OG-18 back-links on OG-B07, OG-19 and OG-26.
- **OG-20 generator-safety research:** the results are in Part B. **OG-20 itself is not prepared.** Nothing was
  added to the safety-block config.

**Date:** 22 September 2026

---

# PART A — OG-21 DEPLOYMENT

## 1. Deployment result

**Success.** Applied as ruled:

- all 23 approved changes (unchanged)
- title "Home Energy & Shelter Upgrade Plan" (keeping the "&")
- planner / shelter / household-resilience / beginner / 30 min / draft

**Checks before deploying:**

| Check | Result |
|---|---|
| Prep | all 13 resources READY_AFTER_FINAL_VALIDATION; OG-21 has 23/23 changes applied, 0 flags, no missing blocks |
| `import:verify-prep` | 26/26 files pass |
| `import:verify-build` on the exact build | **13 records, 26 files, 0 broken links** |
| OG-21 PDFs in the build | byte-identical to the checked PDFs |
| **The 24 earlier PDFs** | **byte-identical to the previous live build**, so the back-links changed records only |

**Local preview, before deploying:**

- Before a market is chosen: no download offered.
- NZ chosen: NZ file only. AU chosen: AU file only.
- The page shows "beginner" and "30 min", and no OG code.
- Related links: Warm Home Scorecard, Solar Power 101 Workbook, Battery Backup Planner, 3-Tier Budget Planner.

**After deploying**, every unauthenticated request was redirected (302) to the Access login at `odd-surf-0ad6`:

- `/`
- `/downloads/`
- the OG-21 page and both OG-21 PDFs
- the OG-B07 page
- an OG-26 PDF

## 2. Worker version

**`20a35551-e013-406d-968b-2aec8c6f5ddf`**

## 3. OG-21 route

`/resources/home-energy-and-shelter-upgrade-plan/` (behind Access)

## 4. Protected resource count

**13** draft resources: OG-02, OG-11, OG-15, OG-18, OG-19, **OG-21**, OG-22, OG-25, OG-26, OG-27, OG-B04, OG-B07,
OG-B10.

**All 13 records are `status: "draft"`** (checked).

## 5. NZ / AU validation

| Check | NZ | AU |
|---|---|---|
| Pages | 6 | 6 |
| PDF title | Home Energy & Shelter Upgrade Plan — OffGrid056 | the same |
| Emergency numbers | **111 only** | **000 + 112 only** |
| Electrical wording | licensed electrical worker | licensed electrician |
| Other market's content | no AU terms (licensed electrician, SES, 000, 112, "Australia") | **no New Zealand references** ("New Zealand", "NZ", EECA, Warmer Kiwi, Civil Defence, 111) |
| Blocks | Wood burners and open fires; Batteries and electrical safety | the same |
| Legacy content | **none** (25 terms checked): Week/Day navigation, OG codes, "Pillar", "fortress" | the same |
| Missing resources named | **none**: only live titles; no "supplier questions" | the same |
| Tokens · VERIFY · browser-error page | none | none |
| Priority table | whole on page 3 | the same |
| Changes | all 23 applied | the same |
| Draft | yes | yes |

**The 14-day line** reads *"I commit to starting these actions within 14 days:"*. It sits under "My Commitment"
and "Sign to lock your priorities", so it's clearly the member's own first-person commitment, not an official
minimum.

## 6. OG-18 back-link verification

| Page | Links to OG-18? | Link resolves |
|---|---|---|
| Solar Planning Deep Worksheet (OG-B07) | **yes** | 200 |
| Battery Backup Planner (OG-19) | **yes** | 200 |
| 3-Tier Budget Planner (OG-26) | **yes** | 200 |

- **Record-only change:** these three resources' PDFs are byte-identical to before.
- `import:verify-build` finds **0 broken internal links**.
- **Live:** the pages are behind Access, so I checked them in the exact build that was deployed.

## 7. Tests

**274 passed.** Lint and typecheck clean.

The OG-21 tests now check the **approved** changes. They include one that confirms the back-links stay recorded.

**Other status:**

| Check | Result |
|---|---|
| `--real` | refused |
| OG-21 files in git | 0 |
| `private-assets/` tracked in git | 0 files |

## 8. Rollback

**`4daef2b4`** (12 resources, without the back-links). Its private files are in
`workspace/backups/private-assets-4daef2b4`, and all 24 PDFs are byte-identical to that live build.

The new live state is also backed up, in `workspace/backups/private-assets-20a35551`.

---

# PART B — OG-20 GENERATOR + CARBON-MONOXIDE SAFETY RESEARCH (RESEARCH ONLY)

**Method:**

- Official NZ and AU pages only, read directly in an ordinary browser session this stage.
- **No bot protection was bypassed.**
- Quotes are verbatim.
- **Nothing was written into the safety-block config. OG-20 was not touched.**

## B1. Sources read

| Market | Source | Date shown |
|---|---|---|
| NZ | **WorkSafe NZ**, [Using portable generators after a natural event or emergency](https://www.worksafe.govt.nz/topic-and-industry/natural-events-and-emergencies/using-portable-generators-after-a-natural-event-or-emergency/) | last updated 18 Jul 2024 |
| NZ | **WorkSafe NZ**, [Connecting a generator to the wiring of a house or building following an emergency](https://www.worksafe.govt.nz/about-us/news-and-media/connecting-a-generator-to-the-wiring-of-a-house-or-building-following-an-emergency/) (technical bulletin) | 3 Mar 2023 |
| NZ | **WorkSafe NZ**, [Petrol](https://www.worksafe.govt.nz/topic-and-industry/hazardous-substances/guidance/substances/petrol/) | none shown |
| NZ | **WorkSafe NZ**, [Carbon monoxide poisoning from small petrol engine plant](https://www.worksafe.govt.nz/about-us/news-and-media/carbon-monoxide-poisoning-from-small-petrol-engine-plant/) (workplace alert) | 18 Jul 2016 |
| NZ | **Fire and Emergency NZ**, [Managing hazardous substances](https://www.fireandemergency.nz/outdoor-and-rural-fire-safety/hazardous-substances/managing-hazardous-substances/) | none shown |
| NZ | **Get Ready**, [No power](https://getready.govt.nz/prepared/household/impacts/no-power): refers generator users to WorkSafe | — |
| AU (Vic) | **Energy Safe Victoria**, [Using a generator safely](https://www.energysafe.vic.gov.au/community-safety/emergencies/using-generator-safely) | reviewed 16 Mar 2026 |
| AU (Qld) | **Electrical Safety Office Queensland**, [Generators](https://www.electricalsafety.qld.gov.au/electrical-equipment/generators) and [Do's and don'ts of running generators](https://www.electricalsafety.qld.gov.au/dos-and-donts-running-generators) | none shown |

**Already approved and reused, not re-researched:**

- the **carbon-monoxide** block (Health NZ, WorkSafe NZ; NSW Health, Vic Health)
- the **indoor-combustion** block (generators outdoors only)
- the **batteries-and-electrical** block (generator connection and backfeeding)

## B2. Verified guidance by topic

| Topic | NZ (official wording) | AU (official wording) |
|---|---|---|
| **Outdoor use / placement** | *"The generator must be located in a well-ventilated place and that exhaust gases must be funnelled away from any internal or confined space. The generator must never be used in an indoor space where people are present; this includes areas such as an internal garage."* (WorkSafe) | *"A generator should only be used outside, in a well-ventilated area."* · *"Portable generators should never be used indoors or in enclosed areas."* · *"place the generator on flat ground"* · *"ensure the exhaust is not blowing onto flammable or combustible materials, or back into the house"* (ESV) · *"Keep the generator outside. Never use it indoors."* (ESO Qld) |
| **Carbon monoxide** | exhaust fumes *"contain the poisonous gas carbon monoxide"*; CO *"has no smell, taste or colour"*; it can *"build up to dangerous levels in a short time"* in poorly ventilated spaces (WorkSafe alert). **Already covered** by the approved CO block (symptoms, fresh air, 111). | CO *"you cannot see or smell"* may cause *"carbon monoxide poisoning and asphyxiation very quickly, and death"* (ESV) · *"If you feel sick, dizzy or weak using a generator, move away immediately and get some fresh air."* (ESO Qld). The approved CO block covers 000 and Poisons 13 11 26. |
| **Ventilation** | *"well-ventilated place"* (WorkSafe) | *"well-ventilated area"* (ESV) |
| **Weather / rain** | **no NZ official wording found** beyond *"always use a safety switch (RCD) where the supplied equipment is outside or in a damp location"* (WorkSafe) | *"located outside in a well-ventilated area sheltered from the weather, such as a carport"* · *"do not cover the generator as the exhaust is very hot and will burn any material in direct contact with it and cause a fire"* (ESV) · *"Keep the generator dry. Do not use in rain or wet conditions or touch it with wet hands."* (ESO Qld) |
| **Electrical connection / loads** | *"Plug appliances directly into the generator."* · *"The rating of the connected equipment should not exceed the rating of the generator."* (WorkSafe) | *"plug in an extension lead and then use a double adaptor or power boards"* (ESV) · *"Plug appliances directly into the generator or use a heavy duty outdoor-rated extension lead…"* (ESO Qld) |
| **Extension leads** | **no NZ official wording found**. Use WorkSafe's *"Plug appliances directly into the generator"* and the RCD line. | *"Only use heavy-duty extension cords that are in good condition and rated in watts or amps at least equal to the rating of the generator."* · *"Protect connection points between extension cords and appliances from the weather."* (ESV) · *"heavy duty outdoor-rated extension lead that is rated in watts or amps at least equal to the sum of the connected appliance loads … the plug has all three prongs, especially an earthing pin"* (ESO Qld) |
| **Transfer / changeover switch; household connection** | *"Do not connect a generator to building wiring unless the connection has been installed by an electrician."* (WorkSafe) · *"Connecting a generator to the wiring of an installation must be carried out by a licenced Electrical worker"* · smaller generators with 10 amp outlets *"must not be connected directly to the main switchboard or installation wiring, unless there is a permanent connection point installed to the requirements AS/NZS 3010, which would include a changeover switch"* (WorkSafe bulletin) | *"Never try to power the house by connecting the generator into a wall socket or switchboard, unless there is an existing dedicated generator inlet"*; back-feed risks *"utility workers and neighbours"* · *"Any changes to household wiring must be carried out by a licensed electrician."* (ESV) · *"A licensed electrician must install a changeover switch."* (ESO Qld) |
| **Refuelling** | *"Never refuel a hot engine or an engine that is running. Shut down the engine and let it cool off for at least 10 minutes."* · *"Decant (pour) in the open air - not inside the garage"* · *"Use a pouring spout or funnel."* (WorkSafe Petrol) | *"Always ensure the generator is off and has cooled down before re-fuelling"* · *"Be conscious not to spill fuel as the hot exhaust can ignite the fuel"* · *"Do not smoke near the generator, and extinguish any naked flames before refuelling."* (ESV) · *"turn it off and let it cool down. Fuel spilt on hot engine parts could ignite."* (ESO Qld) |
| **Fuel storage** | *"Use only approved petrol containers."* · *"Be sure your containers have secure lids."* · *"Do not leave petrol containers in direct sunlight or in the boot of a car."* · *"Never store petrol containers or equipment with petrol tanks near a flame, for example natural gas water heaters or heating systems."* (WorkSafe Petrol) | *"Ensure fuel is stored in proper safety containers and away from ignition sources (for example a gas water heater)."* (ESV) · *"Store fuel for your generator in properly labelled non-glass safety containers. Store out of the home and away from fuel-burning appliances…"* (ESO Qld) |
| **Fire risk** | ignition sources include *"hot surfaces such as … vehicle engines and exhaust systems, pumps and generators"*; *"Flammable substances must be stored away from ignition sources."* (FENZ) | *"electrocution, fire or asphyxiation when not used correctly"*; *"do not cover the generator…"* (ESV) · *"Avoid creating a fire hazard."* (ESO Qld) |
| **CO alarm** | the approved CO block: *"consider installing carbon monoxide alarms"* (Health NZ) | *"Install a battery operated carbon monoxide alarm."* (ESO Qld) |
| **Emergency use** | the approved CO block: fresh air, then **111** | the approved CO block: **000**; Poisons 13 11 26 |
| **Licensing** | **licensed electrical worker** (WorkSafe bulletin: *"authorised by the Board"*; certificates of compliance for this work) | **licensed electrician** (ESV; ESO Qld) |

## B3. Distances and figures

| Figure | Finding | Recommendation |
|---|---|---|
| **Generator separation distance** (the US "20 feet") | **No NZ or AU official source gives one.** NZ says "well-ventilated", with exhaust *"funnelled away"* from indoor spaces. AU says "well-ventilated", with exhaust not *"back into the house"*. | **Do not use the US figure.** Use the non-numeric wording above. `figure.generatorDistance` stays unresolved: there is no local official figure to verify. |
| Refuelling cool-down, **"at least 10 minutes"** | **VERIFIED for NZ** (WorkSafe Petrol) | may be used in NZ only. AU sources say *"cooled down"*, with no time. |
| **"Never smoke within 20 metres of petrol"** | on WorkSafe's hazardous-substances page, but written as a workplace handling rule | **Don't use it** in member copy. *"No smoking or naked flames nearby"* is sourced in both markets. |
| Petrol containers max **25 L**; storing **more than 50 L** needs a compliance certifier | WorkSafe hazardous-substances guidance; **whether it applies to households isn't confirmed** | **Don't use it** unless you ask for a separate check. |
| ESV generator sizes (750–1000 W / 2000 W / 5000–8000 W, and what each runs) | ESV, Victoria | These are **product-selection examples, not safety rules.** If OG-20 needs them, treat them as an AU example only, and review them as claims. |

## B4. Proposed `generator-safety` block (DRAFT, not in config, not approved)

**Title:** *Using a generator safely*.

It's meant to sit alongside the approved carbon-monoxide block (symptoms, what to do, emergency number) and not
repeat it.

**NZ:**

> **Run a generator only outside, in a well-ventilated place, with its exhaust pointing away from the house.** Never
> use it indoors or anywhere people are, including an internal garage.
> Plug appliances directly into the generator, and do not connect more than it is rated for. Use a safety switch
> (RCD) when equipment is outside or in a damp place.
> **Never connect a generator to your house wiring or switchboard yourself.** That is work for a licensed electrical
> worker, and a small generator must not be connected unless a permanent connection point with a changeover switch has
> been installed.
> The engine and exhaust get hot enough to start a fire: keep fuel and anything that can burn away from them.
> Refuel only when the engine is off and has cooled for at least 10 minutes, and pour fuel outside using a funnel.
> Store petrol only in approved containers with secure lids, out of direct sunlight, and never near a flame such as a
> gas water heater.

*Sources, sentence by sentence:* WorkSafe generators; WorkSafe generators; WorkSafe bulletin; FENZ; WorkSafe
Petrol; WorkSafe Petrol.

**AU:**

> **Use a generator only outside, in a well-ventilated area — never indoors or in an enclosed space.** Put it on flat,
> dry ground with the exhaust pointing away from the house and from anything that can burn, sheltered from rain (for
> example under a carport or veranda). Do not cover it, and do not use it in the rain or touch it with wet hands.
> Plug appliances in directly, or use heavy-duty outdoor extension leads in good condition, rated at least as high as
> the load, and protect the plug connections from the weather.
> **Never plug a generator into a power point or switchboard to power the house.** Any connection — such as a
> dedicated generator inlet or changeover switch — must be installed by a licensed electrician.
> Turn it off and let it cool before refuelling, do not spill fuel, and keep cigarettes and naked flames away.
> Store fuel in labelled safety containers (not glass), outside the home and away from gas water heaters and other
> ignition sources. Consider a battery-operated carbon monoxide alarm, and if you feel sick, dizzy or weak while using
> a generator, move away into fresh air.

*Sources:* ESV and ESO Qld. **The two states agree on every point**, so no single national rule is claimed and no
state-specific network company is named.

## B5. Limitations and decisions for you

1. **NZ has no official wording on rain or weather shelter or on extension leads.** The NZ draft uses WorkSafe's
   "plug directly in" and the RCD line instead. **Nothing was borrowed from AU.**
2. **The AU wording comes from two state regulators (Vic, Qld).** Other states weren't read. The wording is kept to
   what both agree on.
3. **Overlap with approved blocks.** The draft repeats a little of the electrical block's connection line and the
   indoor-combustion block's outdoor line. When OG-20 is prepared, choose one:
   - (a) use the new block and trim the overlap, **or**
   - (b) keep the three approved blocks and add only the missing parts (placement and weather, loads and leads,
     refuelling, fuel storage, fire risk).
4. **Gas and LPG generators:** not researched. If OG-20 covers LPG generators, **the strict gas rule applies** and
   the gas/LPG block stays required.
5. **Before OG-20 prep:** approve or edit the NZ and AU drafts, and confirm that `figure.generatorDistance` stays
   **non-numeric** in both markets.

**Stopped. OG-20 not prepared or migrated.**

# OG-20 — ALTERNATIVE ENERGY SUITABILITY CHECK · REVIEW · NOT DEPLOYED

OG-20 is ready for your review as **PREVIEW_WITH_PROPOSED_COPY**. Two things are awaiting your approval: its 19
proposed changes, and the **final wording of the new "Using a generator safely" block**. The block's points are
already approved (Stage 9.33).

**What the audit found:**

1. **OG-20 is mostly a comparison of alternatives:** wind, micro-hydro, portable and standby generators, and hybrid.
   Its generator content is **planning advice**, not operating instruction, with one exception flagged below.
2. **Its numbers are rules of thumb and prices:**
   - wind "> 4 m/s" and micro-hydro "> 10m head"
   - output ranges (kW), setup costs ($800–$30,000) and lifespans (10–30 years)
   - "50–70%" solar loss
   - "Test monthly"
3. **It had one siting problem:** *"□ Space for generator shed"* reads as running a generator in an enclosed space.
4. **It had one overstatement for portable generators:** *"Any location"*.
5. **LPG:** OG-20 doesn't mention LPG or gas generators, so there's **no GAS_SAFETY_REQUIRED flag**.

**Live preview unchanged:** `20a35551`, 13 resources.
**Date:** 22 September 2026

---

## 1. OG-20 audit

| | |
|---|---|
| Title | **Alternative Energy Suitability Check** |
| Group | re-skin group B |
| Source | HTML/PDF pair |
| Audit notes | *"covers generators (14 mentions) with no carbon monoxide and outdoor-use warning"*; type unresolved |
| Structure | intro "Beyond Solar Panels" · Option Comparison Matrix (5 technologies × 6 columns) · My Property Assessment (8 ticks) · Decision Flowchart (Q1 micro-hydro, Q2 wind, Q3 generators) · My Alternative Energy Plan (7 fields) · "The Hybrid Principle" · closing |
| Legacy content | "Week 3 — Shelter, Heating & Energy" · "OffGrid056 30-Day Programme" · "Asset OG-20 \| Day 20" ×2 · "Day 20 Complete" · *"Tomorrow: synthesise Week 3…"* · *"Next: OG-21 Home Energy & Shelter Upgrade Plan →"* |
| Not present | Action Plan Plus, Skool, tiers, old products |
| Products and brands | none named |
| Heating and other hazards | "solid fuel" once, in the Hybrid Principle, so no block is needed · micro-hydro and wind: no hazard teaching (both go to a specialist or installer) |

## 2. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| Title | Alternative Energy Suitability Check | **SOURCE** |
| PDF title | Alternative Energy Suitability Check — OffGrid056 | standard |
| Route | `/resources/alternative-energy-suitability-check/` | |
| ID | res-1020 | |
| Foundation | energy | audit HIGH |
| Type | **assessment** | **INFERRED**: the audit couldn't resolve a type. It's a suitability check (property checklist plus decision flowchart). Alternative: worksheet. |
| Category | **household-energy-planning** (*"Working out what your household really needs to run."*) | **INFERRED**. Alternative: backup-energy. |
| Difficulty | recommend **beginner** | **OWNER-REVIEW REQUIRED** · INFERRED: ticks and yes/no questions, no calculations |
| Time | recommend **20 min** | **OWNER-REVIEW REQUIRED** · INFERRED: 8 ticks, 3 questions, 7 plan fields. Excludes site assessments and quotes. |
| Description | *"Solar is not the only option. Wind, micro-hydro, and generators all have their place. This flowchart helps you decide which alternatives suit your property, climate, and budget."* | **SOURCE**: the cover subtitle, unchanged (no claims) |
| Tags | none | none invented |
| Related | Solar Power 101 · Battery Backup Planner · Home Energy & Shelter Upgrade Plan | **PROPOSED** |

## 3. Generator passage classification

**No passage is an operating, refuelling, electrical-wiring or emergency instruction** beyond the three flagged
below. Safe-use guidance now comes from the generator block, not from OG-20's own text.

| # | Passage (original) | Classification | Flag | Action |
|---|---|---|---|---|
| G1 | Cover: *"Wind, micro-hydro, and generators all have their place."* | incidental mention | — | keep |
| G2 | Matrix, Portable Generator: *"Any location; occasional backup use · 2–10 kW · $800–$4,000 · High (fuel) · 10–15 years"* | planning advice **+ siting** | **"Any location"** contradicts outdoor-only use | rewrite: *"Occasional backup use; run outdoors only"*; figures removed; *"See Using a generator safely"* |
| G3 | Matrix, Standby Generator: *"Automatic switchover; whole-house backup · 5–20 kW · $5,000–$15,000 · High (fuel) · 15–20 years"* | planning advice **+ connection** | implies a permanent connection without saying who installs it | rewrite: *"Permanently connected: must be installed by a licensed electrical worker"* (NZ) / *"licensed electrician"* (AU); figures removed |
| G4 | Property check: *"□ Space for generator shed"* | **siting instruction** | **unsafe**: an enclosed shed conflicts with *"never in enclosed areas"* (ESV) and *"well-ventilated place"* (WorkSafe) | rewrite: *"□ A safe outdoor spot to run a generator (well ventilated, exhaust pointing away from the house)"* |
| G5 | Property check: *"□ Reliable fuel supply access"* | planning advice | — | keep |
| G6 | Q3 YES: *"Standby generator with auto-transfer switch. Most reliable for whole-house backup. Higher running costs but seamless."* | **connection instruction** + planning | no licensed-work statement; "most reliable" and "seamless" are unsourced | rewrite per market, with a licensed electrical worker (NZ) or electrician (AU) installing the changeover connection |
| G7 | Q3 NO: *"Portable generator for essential loads only. Store safely. Test monthly. Keep fuel fresh."* | **operating + fuel-storage instruction** | "Test monthly" and "Keep fuel fresh" unsourced | rewrite: *"…use it and store its fuel safely (see Using a generator safely), and test it regularly as the manufacturer's instructions describe"* |
| G8 | Hybrid Principle: *"…generator for extended outages…"* | planning advice | — | keep |
| G9 | Closing teaser (*"Tomorrow… Week 3…"*) | incidental (legacy) | — | removed with the navigation |

## 4. Claims table

| # | Original | Type | Action |
|---|---|---|---|
| C1 | *"reduce output by 50–70%"* (winter, storms, cloud) | efficiency / generation | **REWRITE**: *"less in winter, storms and long cloudy spells"* (energy.gov.au: less in winter) |
| C2 | *"Average wind > 4 m/s"* ×3 (matrix, property check, Q2) | sizing rule of thumb | **REWRITE**: *"strong, steady winter winds"*, plus a site wind assessment |
| C3 | *">10m head"* ×3 (matrix, property check, Q1) | sizing rule of thumb | **REWRITE**: *"enough vertical drop (head)"*, plus a specialist assessment |
| C4 | Typical Output: 1–5 / 0.5–5 / 2–10 / 5–20 kW / "Variable" | wattage / kW | **REMOVE** (column removed) |
| C5 | Setup Cost: $3,000–$15,000 / $5,000–$25,000 / $800–$4,000 / $5,000–$15,000 / $10,000–$30,000 | cost | **REMOVE**. The member records it in *"Estimated setup cost"*. |
| C6 | Running Cost: Low / Very low / High (fuel) | qualitative running cost | **KEEP** (qualitative) |
| C7 | Lifespan: 15–25 / 20–30 / 10–15 / 15–20 / 20+ years | lifespan | **REMOVE** |
| C8 | *"micro-hydro is likely your best option. Consistent, reliable, low maintenance."* | performance claim | **REMOVE** |
| C9 | *"Small wind turbine viable … (solar summer + wind winter = balanced year)"* | performance claim | **REWRITE** as "may be viable" plus an assessment |
| C10 | *"Most reliable for whole-house backup … seamless"* | backup-duration and reliability claim | **REMOVE** |
| C11 | *"Test monthly"* | frequency rule | **REWRITE**: follow the manufacturer's instructions |
| C12 | *"Keep fuel fresh"* | fuel-storage rule | **REWRITE**: store fuel safely (generator block) |
| C13 | *"The most resilient homes use multiple energy sources"* | absolute claim | **REWRITE**: *"Resilient homes often use…"* |

**Not in OG-20:** fuel-use figures, runtimes, extension-lead ratings, fuel-storage amounts, distances, cooling times.
Those now appear only in the generator block, sourced per market. **No new figures were added**, apart from the
block's NZ-verified "at least 10 minutes".

## 5. Final NZ generator-safety wording

**Using a generator safely** (CRITICAL):

> **Run a generator only outside, in a well-ventilated place, with its exhaust pointing away from the house.** Never
> use it indoors or anywhere people are, including an internal garage: its exhaust contains carbon monoxide, a
> poisonous gas you cannot see, smell or taste.
> Plug appliances directly into the generator, and do not connect more than it is rated for. Use a safety switch
> (RCD) when equipment is outside or in a damp place.
> **Never connect a generator to your house wiring or switchboard yourself.** Connecting it is work for a licensed
> electrical worker, and a small generator must not be connected to the switchboard or house wiring unless a permanent
> connection point with a changeover switch has been installed.
> The engine and exhaust get hot enough to start a fire, so keep fuel and anything that can burn away from them.
> Before refuelling, shut the engine down and let it cool for at least 10 minutes, then pour the fuel outside using a
> funnel.
> Store petrol only in approved containers with secure lids, out of direct sunlight, and never near a flame such as a
> gas water heater.

**Sources, line by line:**

1. WorkSafe NZ, portable generators (18 Jul 2024); CO facts from WorkSafe's small-engine alert.
2. WorkSafe NZ, portable generators.
3. WorkSafe NZ technical bulletin (3 Mar 2023; AS/NZS 3010).
4. FENZ (generators as ignition sources); WorkSafe Petrol (shut down, cool 10 minutes, pour in the open air with a
   funnel).
5. WorkSafe Petrol.

**Deliberately left out** (no current NZ official source):

- rain or weather shelter
- extension-lead ratings
- any CO alarm line (the approved generic CO block already says *"consider installing carbon monoxide alarms"*)
- any distance

## 6. Final AU generator-safety wording

**Using a generator safely** (CRITICAL):

> **Use a generator only outside, in a well-ventilated area — never indoors or in an enclosed space such as a
> garage.** It gives off carbon monoxide, which you cannot see or smell and which can kill very quickly.
> Put it on flat ground with the exhaust pointing away from the house and from anything that can burn, somewhere
> sheltered from the weather such as a carport or veranda. Keep it dry — do not use it in rain or wet conditions or
> touch it with wet hands — and do not cover it: the exhaust is very hot and can start a fire.
> Plug appliances in directly, or use heavy-duty, outdoor-rated extension leads in good condition, rated in watts or
> amps at least equal to the generator's rating, and protect the plug connections from the weather.
> **Never plug a generator into a power point or switchboard to power the house.** Any connection — such as a
> dedicated generator inlet or a changeover switch — must be installed by a licensed electrician.
> Turn the generator off and let it cool down before refuelling, avoid spilling fuel, and keep cigarettes and naked
> flames away. Store fuel in labelled safety containers (not glass), outside the home and away from ignition sources
> such as a gas water heater.
> Install a battery-operated carbon monoxide alarm. If you feel sick, dizzy or weak while using a generator, move away
> immediately into fresh air.

**Sources:** Energy Safe Victoria (reviewed 16 Mar 2026) and the Electrical Safety Office, Queensland.

**Notes:**

- **Extension-lead rating:** ESV says *"at least equal to the rating of the generator"* and Qld says *"at least equal
  to the sum of the connected appliance loads"*. I used ESV's, which is the stricter and satisfies both.
- **No cool-down time,** because AU sources give none.
- **No distance.**
- **No state-specific network companies** are named.

**How the blocks fit together** (your ruling 7):

| Block in OG-20 | What it does |
|---|---|
| **Using a generator safely** | the main generator block |
| **Batteries and electrical safety** | **trimmed for OG-20 only.** Its generator paragraph (*"Never connect a generator…"* / *"Never power the house…"*) and "generator connection" wording are dropped, because the generator block covers them. The solar, battery and lithium-ion lines are kept. **Every other resource keeps the full wording** (tested). |
| **Carbon monoxide** | **kept whole**: symptoms, what to do, 111 / 000 and Poisons 13 11 26, gas-appliance signs. None of that is in the generator block. |
| Indoor-combustion ("Never bring it inside") | **not used**: its generator line is covered, and OG-20 teaches nothing about unflued heaters or outdoor gas appliances |

**Small remaining overlap in AU:** the generator block says *"Install a battery-operated carbon monoxide alarm"*,
and the CO block says *"Consider a carbon monoxide alarm near bedrooms…"* with the standards to look for. Each adds
something the other doesn't, so both are kept. Say if you'd rather drop the generator block's line.

**Status:** both markets' points were approved at Stage 9.33. **The final wording above is PROPOSED**, which is why
OG-20 isn't ready yet.

## 7. LPG finding / status

**NOT PRESENT.**

- OG-20 never mentions LPG, gas or dual-fuel generators. Its only fuel words are "fuel", "High (fuel)" and "fuel
  supply".
- **No GAS_SAFETY_REQUIRED flag**, and no content is held.
- The generator block is written for **petrol** generators only, and a test enforces that it says nothing about LPG.
- **If a later edit adds LPG generators:** flag GAS_SAFETY_REQUIRED and hold that content until NZ/AU LPG-generator
  guidance is researched and approved (Stage 9.33 ruling 6).

## 8. Exact proposed copy changes (19; PROPOSED, not approved)

**Market-specific:** 5–6 (comparison table), 13–14 (Q3 YES), 16 (AU permission wording).

| # | Where | Before | After |
|---|---|---|---|
| 1 | Cover week label | Week 3 — Shelter, Heating & Energy | *removed* |
| 2 | Cover label | OffGrid056 30-Day Programme | OffGrid056 Member Library |
| 3 | Page headers ×2 | Asset OG-20 \| Day 20 | *removed* |
| 4 | Intro | Solar works brilliantly in summer and on clear days. But winter, storms, and extended cloudy periods reduce output by 50–70%. | Solar generates most in summer and on clear days, and less in winter, storms and long cloudy spells. |
| 5 | Comparison table — **NZ** | Technology · Best Conditions · Typical Output · Setup Cost · Running Cost · Lifespan, with the figures in §4 | **Technology · Best Conditions · Running Cost · Things to Check**: Small Wind Turbine · Exposed, windy site; rural; no neighbours close · Low · Have the site's wind assessed first; check your council's rules, including on noise / Micro-Hydro · Running stream with year-round flow and enough vertical drop (head) · Very low · Needs a specialist site assessment; check what rules and permissions apply / Portable Generator · Occasional backup use; run outdoors only · High (fuel) · See Using a generator safely: where to run it, fuel, and connection / Standby Generator · Automatic changeover; backup for more of the house, depending on its size · High (fuel) · Permanently connected: must be installed by a **licensed electrical worker** / Hybrid (Solar + Wind) · Sites where sun and wind complement each other across the seasons · Very low · Needs a design that combines both sources |
| 6 | Comparison table — **AU** | the same | the same, with *"…must be installed by a **licensed electrician**"* |
| 7 | Property check | □ Significant elevation drop (>10m) | □ Significant elevation drop along a stream |
| 8 | Property check | □ Winter winds > 4 m/s average | □ Strong, steady winter winds |
| 9 | Property check | □ Space for generator shed | □ A safe outdoor spot to run a generator (well ventilated, exhaust pointing away from the house) |
| 10 | Q1 YES | Measure the head (vertical drop) and flow rate. If head > 10m: micro-hydro is likely your best option. Consistent, reliable, low maintenance. | Micro-hydro may suit your property. Ask a specialist to assess the head (vertical drop) and flow, and check what rules and permissions apply to using the stream. |
| 11 | Q2 | Q2: Is your property exposed with average winter winds > 4 m/s? | Q2: Is your property exposed to strong, steady winter winds? |
| 12 | Q2 YES | Small wind turbine viable. Best paired with solar (solar summer + wind winter = balanced year). Check council noise rules. | A small wind turbine may be viable — have the site's wind assessed first. Where winter winds are strong, wind can complement solar. Check your council's rules, including on noise. |
| 13 | Q3 YES — **NZ** | Standby generator with auto-transfer switch. Most reliable for whole-house backup. Higher running costs but seamless. | A standby generator with an automatic changeover (transfer) switch can start supplying power when the grid fails. Its connection must be installed by a **licensed electrical worker**. Running costs are higher (fuel). |
| 14 | Q3 YES — **AU** | the same | the same, with a **licensed electrician** |
| 15 | Q3 NO | Portable generator for essential loads only. Store safely. Test monthly. Keep fuel fresh. | A portable generator can run a few essential appliances. Use it and store its fuel safely (see Using a generator safely), and test it regularly as the manufacturer's instructions describe. |
| 16 | Plan — **AU only** | Consents or permits needed | Permits or approvals needed |
| 17 | Hybrid Principle | The most resilient homes use **multiple energy sources** | Resilient homes often use **multiple energy sources** |
| 18 | Closing | **Day 20 Complete**: You have now explored every major energy option for your property. Tomorrow: synthesise Week 3 into your Shelter, Heating & Energy upgrade plan. | **Energy Options Check Complete**: You have now looked at the main alternatives to solar for your property. Bring your choice into the Home Energy & Shelter Upgrade Plan. |
| 19 | Next link | Next: OG-21 Home Energy & Shelter Upgrade Plan → | *removed* |

**Each change was checked against the re-skinned source, and all 19 apply.**

**Layout fix:** Q3's "NO" answer was stranded alone on page 5. Decision-flowchart boxes (`flow-box`) are now kept
whole when printing. That class is used only by OG-20 and the unprepared OG-03, so no live resource is affected.

## 9. NZ PDF readiness

| Check | Result |
|---|---|
| File | `alternative-energy-suitability-check.NZ.pdf` |
| Pages | 7 |
| Title | Alternative Energy Suitability Check — OffGrid056 |
| Emergency numbers | 111 only |
| Blocks | Using a generator safely (NZ); Carbon monoxide; Batteries and electrical safety (trimmed: the old generator lines are absent) |
| Generator wording | the NZ block's key points are present: licensed electrical worker, internal garage, RCD, changeover, at least 10 minutes, approved containers |
| Left out of NZ | **no** carport, veranda, rain, extension leads or battery-operated CO-alarm lines |
| AU terms | none: no licensed electrician, SES, 000, 112, "Australia", or "Permits or approvals" |
| Removed figures and claims | **none present**, and no distance of any kind |
| Legacy content · OG codes · tokens · VERIFY · browser-error page | none |
| Changes | all 19 applied |
| Flags | none |
| Draft | yes |
| Comparison table | whole on page 3 |
| Flowchart | Q1 and Q2 on page 4; Q3 whole on page 5 |

**Status: PREVIEW_WITH_PROPOSED_COPY.** Waiting on:

1. the 19 changes
2. the final generator-block wording
3. type, category, difficulty and time

## 10. AU PDF readiness

| Check | Result |
|---|---|
| File | `alternative-energy-suitability-check.AU.pdf` |
| Pages | 7 |
| Title | Alternative Energy Suitability Check — OffGrid056 |
| Emergency numbers | 000 + 112 only |
| Blocks | Using a generator safely (AU); Carbon monoxide; Batteries and electrical safety (trimmed) |
| Generator wording | every AU point is present: licensed electrician, enclosed space and garage, carport or veranda, not in rain, don't cover, outdoor-rated leads rated at least equal to the generator, dedicated inlet or changeover, cool before refuelling, labelled non-glass containers, battery-operated CO alarm |
| Left out of AU | **no "10 minutes"** |
| NZ content | no "New Zealand", "NZ", 111, Civil Defence, electrical worker or "Consents" |
| Other checks | the same as NZ |
| Status | the same as NZ |

**Checks run:**

- `import:verify-prep`: 28/28 files pass, including the unapplied-change and other-market checks.
- **The other 13 resources are unchanged:** all READY_AFTER_FINAL_VALIDATION, and `import:verify-build` on the live
  build gives 13 records, 26 files, 0 broken links.

## 11. Tests

**283 passed** (274 + 9). Lint and typecheck clean.

**The nine new tests:**

- **Generator block:**
  - no distance, US rule or workplace petrol limits
  - each market's own points only
  - petrol-only
  - electrical wording trimmed only where the generator block is present (other resources keep the full wording)
  - a generator audit note is answered by the generator block plus CO, or by the old pair
  - flow boxes kept whole
- **OG-20:**
  - no unsourced figures
  - each market's licence and permission terms
  - blocks as proposed

**A note on the test run:** on the first full run, one **unrelated** importer test (*"never guesses a foundation for
artwork"*) failed by timing out at 5.5 seconds under load. It passed alone (30/30), and the next full run passed
283/283. I didn't change it.

**Live state:**

| Check | Result |
|---|---|
| Worker | unchanged, `20a35551` |
| Deployed resources | the 13 are unchanged |
| Access | still blocks, including OG-20's would-be page and PDF |
| OG-20 in GitHub | 0 files |
| `--real` | refused |

## 12. Deployment recommendation

**Do not deploy OG-20 yet.** It needs these decisions:

1. **The final NZ and AU generator-block wording** (§5–6), including whether to keep the AU generator block's CO-alarm
   line alongside the CO block's.
2. **The 19 changes.** I recommend approving all of them. The ones that matter most:
   - **9:** replaces the generator shed.
   - **5–6:** removes "Any location" and adds who installs a standby generator.
   - **13–14:** the licensed connection for a standby generator.
   - **15:** replaces "Test monthly" and "Keep fuel fresh".
3. **Metadata:**
   - type **assessment** (or worksheet)
   - category **household-energy-planning** (or backup-energy)
   - **beginner**
   - **20 min**

**After your decisions:** approve, re-render, verify the exact build, then deploy as the **14th** resource, with
rollback to `20a35551`.

**Stopped. OG-20 not deployed.**

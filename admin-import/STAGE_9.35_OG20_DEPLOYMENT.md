# OG-20 — ALTERNATIVE ENERGY SUITABILITY CHECK · DEPLOYED TO PRIVATE PREVIEW (#14)

**Status:** OG-20 is live in the private preview as the **14th** protected draft resource.

- **Worker version:** `77020e71`
- **Access:** still on all traffic
- **Changes applied:** all 19 approved changes
- **Generator block:** the NZ and AU petrol-generator blocks are approved
- **CO de-duplication:** scoped to OG-20, AU only
- **Rollback:** `20a35551`

**Date:** 22 September 2026

---

## 1. Final NZ generator block

**Using a generator safely** (CRITICAL), owner-approved (Stage 9.34 ruling 3), petrol generators only:

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

**Sources:** WorkSafe NZ (generators; the connection bulletin; Petrol; CO alert) and FENZ.

**Not included:** a distance, the US rule, rain-shelter wording, extension-lead wording, workplace petrol limits.

## 2. Final AU generator block

**Using a generator safely** (CRITICAL), owner-approved (Stage 9.34 ruling 4), petrol generators only:

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

**Not included:** the NZ 10-minute figure, a distance, the US rule, workplace limits.

## 3. CO de-duplication result

**Done, scoped to OG-20 AU only.**

- **Recorded** in `metadata-review.json` → `OG-20.safetyBlockTrims`, citing Stage 9.34 ruling 6.
- **For OG-20's AU file only**, prep removes the CO block's alarm sentence: *"Consider a carbon monoxide alarm near
  bedrooms and rooms with gas heaters; NSW Health advises choosing one that meets the US (UL2034) or European
  (EN50291) standard."*
- **The generator block's** *"Install a battery-operated carbon monoxide alarm."* stays.
- **The OG-20 AU CO block keeps** the CO risk explanation, symptoms, emergency action (000; Poisons Information
  Centre 13 11 26) and the gasfitter check.
- **Result:** the AU file now has **one** CO-alarm instruction, where before it had two. The NZ file has one (the CO
  block's), unchanged.
- **The canonical CO block is unchanged.** Every other resource keeps the full sentence, and a test proves it.

**Fail-closed:** the trim removes one exact sentence. If the shared CO wording ever changes, so the sentence isn't
there exactly once, that market is **blocked** with a clear message rather than trimmed wrongly. This is also tested.

**The electrical block** keeps its current rule (ruling 7): its generator lines are dropped only where the generator
block is present, which is currently OG-20 alone. Every other resource keeps the full electrical block.

**LPG (ruling 8):** prep now raises **GAS_SAFETY_REQUIRED** and blocks every market if a resource's own text
mentions LPG, gas-fuelled, natural-gas or dual-fuel generators. The CO block's mention of LPG heaters doesn't trigger
it. **All 14 prepared resources pass, and OG-20 has no such content.** Tests cover the positive and negative cases.

## 4. Final NZ PDF result

| Check | Result |
|---|---|
| File | `alternative-energy-suitability-check.NZ.pdf` |
| Pages | 7 |
| Title | Alternative Energy Suitability Check — OffGrid056 |
| Emergency numbers | **111 only** |
| Electrical wording | **licensed electrical worker** |
| 10-minute cool-down | **retained** |
| AU-only lines | none: no carport, veranda, rain, extension leads, battery-operated CO alarm, "Permits or approvals", licensed electrician, SES, 000, 112 |
| Blocks | Using a generator safely · Carbon monoxide (unchanged) · Batteries and electrical safety (generator lines trimmed) |
| Removed content | none of: kW ranges, prices, lifespans, "50–70%", "4 m/s", "10m", "Any location", "generator shed", "Test monthly", "Keep fuel fresh", "most reliable", "seamless" |
| Distances | no 20-foot rule, no 20 m rule, no 50 L figure, no distance at all |
| OG codes · legacy navigation · tokens · VERIFY · browser-error page | none |
| Tables and flowchart | comparison table whole on page 3; flowchart Q1–Q2 on page 4; Q3 whole on page 5 |
| Changes | all 19 applied |
| Draft | yes |

## 5. Final AU PDF result

| Check | Result |
|---|---|
| File | `alternative-energy-suitability-check.AU.pdf` |
| Pages | 7 |
| Title | Alternative Energy Suitability Check — OffGrid056 |
| Emergency numbers | **000 + 112 only** |
| Electrical wording | **licensed electrician** |
| NZ 10-minute figure | **absent** |
| Rain and extension-lead wording | AU wording only |
| **CO-alarm instruction** | **appears once** |
| NZ content | no "New Zealand", "NZ", 111, Civil Defence, electrical worker or "Consents" |
| Other checks | the same as NZ (removed content, distances, codes, layout, changes, draft) |

**Checks run:**

- `import:verify-prep`: **28/28** files pass.
- `import:verify-build` on the exact build: **14 records, 28 files, 0 broken links**.
- The deployed OG-20 PDFs are **byte-identical** to the checked ones.
- **All 26 earlier PDFs are byte-identical** to the previous live build.

## 6. Deployment result

**Success.**

**Local preview, before deploying:**

| Check | Result |
|---|---|
| Before a market is chosen | no download offered |
| NZ chosen | NZ file only |
| AU chosen | AU file only |
| Metadata on the page | "assessment", "beginner" and "20 min" shown |
| Visible OG code | none |
| Related links | Solar Power 101 · Battery Backup Planner · Home Energy & Shelter Upgrade Plan |

**After deploying**, every unauthenticated request was redirected (302) to the Access login. That included `/`,
`/downloads/`, the OG-20 page, both OG-20 PDFs, and an OG-21 PDF.

**Records:** all 14 are draft.

## 7. Worker version

**`77020e71-6239-4d67-9da4-a05a6a07582f`**

## 8. OG-20 route

`/resources/alternative-energy-suitability-check/` (behind Access)

## 9. Protected resource count

**14** draft resources: OG-02, OG-11, OG-15, OG-18, OG-19, **OG-20**, OG-21, OG-22, OG-25, OG-26, OG-27, OG-B04,
OG-B07, OG-B10.

## 10. Tests

**288 passed** (283 + 5). Lint and typecheck clean.

**The five new tests:**

1. The CO trim removes the sentence in that market only, and keeps the rest of the block.
2. A resource without the trim keeps the sentence.
3. A changed shared wording blocks the market.
4. Gas, LPG and dual-fuel generator content fails closed.
5. Petrol generators, and the CO block's LPG heaters, don't trip the gas check.

**Also:** the OG-20 tests now check that the trim is recorded for OG-20 only, and that all three blocks are approved.

**Other status:**

| Check | Result |
|---|---|
| `--real` | refused |
| OG-20 files in git | 0 |
| `private-assets/` tracked in git | 0 files |

## 11. Rollback confirmation

**`20a35551`** (13 resources) is in the deployment history. Its private files are in
`workspace/backups/private-assets-20a35551` (39 files), and its 26 PDFs are byte-identical to the new build's.

The new live state is backed up in `workspace/backups/private-assets-77020e71` (42 files).

## 12. Next recommended resource

**OG-B12, Off-Grid System Architecture Planner** (energy · planner, audit HIGH).

**Why OG-B12:**

- It builds directly on the energy set now live: OG-18, OG-19 and OG-20.
- **Every block its audit notes call for now exists and is approved for NZ and AU:**

| Audit note | Block |
|---|---|
| generators (6) | generator-safety + carbon monoxide |
| solid fuel (4) | solid-fuel-heating |
| batteries and inverters (10) | batteries-and-electrical |
| stored drinking water (4) | stored-drinking-water |

- It can go claims-first with no new safety research, as long as its generator content is petrol-only. The new gas
  check will flag it if not.

**Held for now:**

- **OG-17, Solid Fuel Heating Planner:** its audit notes include *gas appliances (4)*, and the gas rule stays strict
  until verified NZ/AU gas/LPG guidance exists. It would need a gas research stage first.
- **OG-16, Grant Eligibility Insulation Planner:** it's built around grants. That needs separate NZ research
  (current EECA programmes) and AU state and territory research before any wording.

**Stopped. No other resource prepared.**

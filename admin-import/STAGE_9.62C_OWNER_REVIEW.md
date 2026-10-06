# Stage 9.62C â€” OG-27 ruling applied, and the gas wording for owner review

**Date:** 6 October 2026 Â· **Model:** Sonnet 5.5 Â· **Nothing deployed. All five gas blocks remain PENDING OWNER APPROVAL. OG-B09 and OG-24 not migrated. Stage 9.63 not started. No member content changed. No private asset changed.**

The five blocks' **full member-facing wording is written out in full below** (section 4), paragraph by paragraph, with the provenance directly under each paragraph. Nothing in this report says "see elsewhere" for the words themselves.

## 1. OG-27 owner ruling â€” applied

The sentence *"15 minutes every Sunday reviewing what is done, what is next, what is blocked."* is **approved as an OWNER-DEFINED SCHEDULE**, sentence unchanged, registered narrowly:

| | |
|---|---|
| Registry entries | `nz-og27-weekly-review-15-minutes-owner-defined` and `au-og27-weekly-review-15-minutes-owner-defined` (one per market, as the registry requires) |
| Owning resource | **`["OG-27"]` only** â€” any other resource carrying the same words still fails (tested for OG-26, OG-99, OG-B09, both markets) |
| Match | that exact sentence only. "30 minutes every Sunday reviewing what is done." is **not** approved, even for OG-27 (tested) |
| Jurisdiction / authority | `owner-defined` / "OffGrid056 owner (planning cadence)" â€” **not** government, **not** source-backed |
| Limitations recorded | planning cadence only; NOT safety guidance; NOT an official recommendation; NOT a general factual claim; OG-27 only, never reusable |
| Status | `OWNER-APPROVED 2026-10-06 (Stage 9.62C) â€” OWNER-DEFINED SCHEDULE` |

## 2. Validation after the ruling

| Check | Result |
|---|---|
| lint | clean |
| typecheck | clean |
| full suite | **587 / 587 passing** (576 â†’ 587: +9 ownership tests, +1 provenance test, +1 OG-27 scope test) |
| 21-resource prep | **21 / 21 ready** |
| market files | **42 / 42 publishable**; `import:verify-prep`: all prepared files verified |
| numeric scan | **Bucket C = 0**; 0 market problems; 0 other findings; 0 content flags |
| gas scan | **0 unexpected gas requirements**; no live resource carries or requires a gas block |
| price / safety-removal findings | 0 / 0 |
| private-asset diff | **64 files, 0 modified**; no member-content change; Worker unchanged `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |

## 3. Classification kept (detector results, unchanged)

| | REQUIRED | NOT required |
|---|---|---|
| **OG-B09** | `gas-and-lpg-general` | `gas-installation-and-servicing`, `carbon-monoxide`, unflued, cylinder, leak |
| **OG-24** | `gas-and-lpg-general` + `gas-installation-and-servicing` | leak, cylinder, unflued |
| **OG-17** | none | all |

## 4. THE FIVE GAS BLOCKS â€” full wording and provenance

How to read this: each block gives its **NZ WORDING** (whole body, then paragraph-by-paragraph provenance) and its **AU WORDING** (whole body, then provenance, then claims that are **NOT SERVED**, then **state-specific wording** grouped by state). NZ is one regulator, so NZ paragraphs are national. In AU only the **common core** is served; **NSW-only, QLD-only and other state-specific wording is never served** â€” it is stored for a future state-routing stage. "Read live 2026-10-05" means read directly from the official page, not from a search snippet.

---

# BLOCK: gas-and-lpg-general

**Severity HIGH Â· PENDING OWNER APPROVAL (NZ and AU)** Â· Gas and LPG appliances

**Shared or varies:** VARIES. New Zealand is one jurisdiction with one regulator (WorkSafe), so its body is specific. Australia has eight regulators and no national source that could be read, so the AU body carries only what four or more jurisdictions state and no number; everything else is a labelled state record that is not served.

## gas-and-lpg-general â€” NZ WORDING (verbatim; this is exactly what an NZ member reads)

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

**Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up.

Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately.

If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

### NZ â€” provenance, paragraph by paragraph

**NZ paragraph 1**

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

- **Source:** intended use, manufacturer instructions, a cooker griller or barbecue is not a heater â€” WorkSafe NZ (Keep yourself safe from carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** intended use, manufacturer instructions, a cooker griller or barbecue is not a heater
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 2**

**Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up.

- **Source:** outdoor appliances never indoors: no oxygen-depletion shut-off â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** outdoor appliances never indoors: no oxygen-depletion shut-off
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 3**

Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

- **Source:** faulty/small space/blocked ventilation â†’ carbon monoxide â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** faulty/small space/blocked ventilation â†’ carbon monoxide
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 4**

Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately.

- **Source:** yellow flame, soot, car-exhaust smell â†’ turn off, licensed gas worker â€” WorkSafe NZ (Gas heating; Carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** yellow flame, soot, car-exhaust smell â†’ turn off, licensed gas worker
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 5**

If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

- **Source:** smell LPG or fumes â†’ turn off appliance and cylinder, service agent or gasfitter â€” WorkSafe NZ (Gas heating; Cabinet heater safety)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** smell LPG or fumes â†’ turn off appliance and cylinder, service agent or gasfitter
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 6**

Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

- **Source:** turn off completely; light back â€” WorkSafe NZ (Carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** turn off completely; light back
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

NZ dedup variants (shorter wording used when the named blocks are also carried, so nothing is said twice): `indoor-combustion`, `carbon-monoxide`, `indoor-combustion+carbon-monoxide`.

## gas-and-lpg-general â€” AU WORDING (verbatim)

Gas appliances that are faulty, poorly maintained or short of fresh air can produce carbon monoxide. Keep permanent ventilation clear, and never use a gas appliance in an unventilated space.

Gas safety rules â€” including how often an appliance must be serviced â€” differ between states and territories, so check with your state or territory's energy safety regulator.

### AU â€” provenance, paragraph by paragraph (served common core, category A)

**AU paragraph 1**

Gas appliances that are faulty, poorly maintained or short of fresh air can produce carbon monoxide. Keep permanent ventilation clear, and never use a gas appliance in an unventilated space.

- **Source:** Energy Safe Victoria â€” Using gas safely; Heating your home with gas (VIC; read live 2026-10-05): https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/using-gas-safely || Consumer Affairs Tasmania â€” Preventing carbon monoxide poisoning (TAS; updated 29 January 2021; read live 2026-10-05): https://consumeraffairs.tas.gov.au/topics/technical-regulation/gas-standards-safety/carbon-monoxide/preventing-carbon-monoxide-poisoning || Building and Energy, WA â€” Gas cylinder safety WA (WA; updated 2 April 2026; read live 2026-10-05): https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa || WorkSafe ACT â€” Liquid petroleum gas (LPG) safety (ACT; read live 2026-10-05): https://www.worksafe.act.gov.au/health-and-safety-portal/safety-topics/dangerous-goods-and-hazardous-substances/liquid-petroleum-gas-lpg-safety
- **Authority:** Energy Safe Victoria; Consumer Affairs Tasmania; Building and Energy (WA); WorkSafe ACT
- **Jurisdiction:** VIC, TAS, WA, ACT (4 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** Gas appliances that are faulty, poorly maintained or short of fresh aiâ€¦ â€” Energy Safe Victoria (VIC), Consumer Affairs Tasmania (TAS), Building and Energy (WA) (WA), WorkSafe ACT (ACT) â€” 4 independent official jurisdictions (VIC, TAS, WA, ACT), none contradicting, no state-specific limitation
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 4 independent official jurisdictions (VIC, TAS, WA, ACT), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 4 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

**AU paragraph 2**

Gas safety rules â€” including how often an appliance must be serviced â€” differ between states and territories, so check with your state or territory's energy safety regulator.

- **Source:** Energy Safe Victoria â€” Using gas safely; Heating your home with gas (VIC; read live 2026-10-05): https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/using-gas-safely || NSW Government â€” Gas safety requirements and consumer rights; Using a gasfitter (NSW; read live 2026-10-05): https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/gas-safety-requirements-and-consumer-rights || Queensland Government â€” Using natural gas and LPG safely; Gas cylinder safety (QLD; cylinder page updated 3 September 2026; read live 2026-10-05): https://www.qld.gov.au/emergency/safety/home/gas/gas-safety || SA.GOV.AU â€” LPG cylinders and fittings (SA; read live 2026-10-05): https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings || Building and Energy, WA â€” Gas cylinder safety WA (WA; updated 2 April 2026; read live 2026-10-05): https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa || Consumer Affairs Tasmania â€” Preventing carbon monoxide poisoning (TAS; updated 29 January 2021; read live 2026-10-05): https://consumeraffairs.tas.gov.au/topics/technical-regulation/gas-standards-safety/carbon-monoxide/preventing-carbon-monoxide-poisoning || WorkSafe ACT â€” Liquid petroleum gas (LPG) safety (ACT; read live 2026-10-05): https://www.worksafe.act.gov.au/health-and-safety-portal/safety-topics/dangerous-goods-and-hazardous-substances/liquid-petroleum-gas-lpg-safety || NT WorkSafe â€” Gas safety (NT; read live 2026-10-05): https://worksafe.nt.gov.au/safety-and-prevention/gas-safety
- **Authority:** Energy Safe Victoria; NSW Government; Queensland Government; SA.GOV.AU; Building and Energy (WA); Consumer Affairs Tasmania; WorkSafe ACT; NT WorkSafe
- **Jurisdiction:** VIC, NSW, QLD, SA, WA, TAS, ACT, NT (8 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** Gas safety rules â€” including how often an appliance must be serviced â€”â€¦ â€” Energy Safe Victoria (VIC), NSW Government (NSW), Queensland Government (QLD), SA.GOV.AU (SA), Building and Energy (WA) (WA), Consumer Affairs Tasmania (TAS), WorkSafe ACT (ACT), NT WorkSafe (NT) â€” 8 independent official jurisdictions (VIC, NSW, QLD, SA, WA, TAS, ACT, NT), none contradicting, no state-specific limitation â€” a limitation disclosure, evidenced by the eight jurisdictions' differing servicing, cylinder and leak rules
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 8 independent official jurisdictions (VIC, NSW, QLD, SA, WA, TAS, ACT, NT), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 8 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

### AU â€” claims NOT in the served wording (kept as labelled, unserved records)

**gen-intended-use** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 2 recorded jurisdictions (VIC, TAS); common core needs 4+ or a national source

Gas and LPG appliances are safe when they are installed, used and maintained as intended. Use each appliance only for its intended purpose and follow the manufacturer's instructions. A gas cooker or oven is not a heater.

- Recorded jurisdictions: VIC (Energy Safe Victoria); TAS (Consumer Affairs Tasmania)
- Read/live status: read live 2026-10-05

**gen-outdoor-appliances** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (VIC, TAS, ACT); common core needs 4+ or a national source

Appliances made for outdoor use â€” such as barbecues, patio heaters and camping stoves â€” are for outdoor use only. Do not bring them inside a home, caravan, car or tent.

- Recorded jurisdictions: VIC (Energy Safe Victoria); TAS (Consumer Affairs Tasmania); ACT (WorkSafe ACT)
- Read/live status: read live 2026-10-05

**gen-combustibles** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 2 recorded jurisdictions (VIC, QLD); common core needs 4+ or a national source

Keep clothing, paper and anything else that can burn well away from gas appliances.

- Recorded jurisdictions: VIC (Energy Safe Victoria); QLD (Queensland Government)
- Read/live status: read live 2026-10-05

**gen-flame-signs** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (VIC, QLD, WA); common core needs 4+ or a national source

If an appliance's flame changes, soot appears, or it will not light properly, stop using it and call a licensed gasfitter.

- Recorded jurisdictions: VIC (Energy Safe Victoria); QLD (Queensland Government); WA (Building and Energy (WA))
- Read/live status: read live 2026-10-05

**gen-no-tampering** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (VIC, SA, WA); common core needs 4+ or a national source

Never tamper with safety valves or fittings, and never try to repair a gas appliance yourself.

- Recorded jurisdictions: VIC (Energy Safe Victoria); SA (SA.GOV.AU); WA (Building and Energy (WA))
- Read/live status: read live 2026-10-05


---

# BLOCK: unflued-gas-heating

**Severity CRITICAL Â· PENDING OWNER APPROVAL (NZ and AU)** Â· Unflued and portable gas heaters

**Shared or varies:** VARIES, and asymmetrically. New Zealand states the whole rule set; Australia's household guidance read is thinner and written heater-generally, and no unflued-heater claim reaches four jurisdictions, so Australia has NO common core for this block and it fails closed there.

## unflued-gas-heating â€” NZ WORDING (verbatim; this is exactly what an NZ member reads)

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep.

While it is on, keep internal doors and at least one window open, and check that room vents are not blocked.

Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself.

WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter.

LPG cabinet heaters are not recommended in homes where someone has a respiratory condition.

If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

### NZ â€” provenance, paragraph by paragraph

**NZ paragraph 1**

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

- **Source:** what an unflued heater is; flued carries products outside â€” WorkSafe NZ (Gas heating); Health NZ
- **Authority:** WorkSafe New Zealand and/or Health New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** what an unflued heater is; flued carries products outside
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 2**

Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep.

- **Source:** never in a bedroom, bathroom, small room, caravan or tent â€” WorkSafe NZ; Health NZ
- **Authority:** WorkSafe New Zealand and/or Health New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** never in a bedroom, bathroom, small room, caravan or tent
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 3**

While it is on, keep internal doors and at least one window open, and check that room vents are not blocked.

- **Source:** internal doors and a window open; vents unblocked â€” Health NZ; WorkSafe NZ
- **Authority:** WorkSafe New Zealand and/or Health New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** internal doors and a window open; vents unblocked
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 4**

Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

- **Source:** nitrogen dioxide, carbon monoxide, water vapour feeding mould and dust mites; asthma â€” Health NZ
- **Authority:** WorkSafe New Zealand and/or Health New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** nitrogen dioxide, carbon monoxide, water vapour feeding mould and dust mites; asthma
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 5**

Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself.

- **Source:** short a time as possible; manufacturer's instructions; no DIY maintenance â€” Health NZ; WorkSafe NZ
- **Authority:** WorkSafe New Zealand and/or Health New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** short a time as possible; manufacturer's instructions; no DIY maintenance
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 6**

WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

- **Source:** Heater Metre Rule; clothing; fireguard â€” WorkSafe NZ (Cabinet heater safety)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** Heater Metre Rule; clothing; fireguard
- **Numeric claim IDs:** `nz-gas-heater-clearance-one-metre-worksafe` â€” VERIFIED_LIVE 2026-10-05; wording pending owner approval; valid only inside block(s): unflued-gas-heating
- **Limitations:** A clearance for a heater in use, from WorkSafe's cabinet-heater page. NZ only: it is not an Australian figure and must not appear in an AU file. It approves 'one metre' of nothing else â€” not a cylinder clearance, a flue clearance or a generator distance.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 7**

WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter.

- **Source:** cabinet heater serviced every 12 months, before winter â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** cabinet heater serviced every 12 months, before winter
- **Numeric claim IDs:** `nz-lpg-cabinet-heater-service-12-months-worksafe` â€” VERIFIED_LIVE 2026-10-05; wording pending owner approval; valid only inside block(s): unflued-gas-heating; gas-installation-and-servicing
- **Limitations:** SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 8**

LPG cabinet heaters are not recommended in homes where someone has a respiratory condition.

- **Source:** not recommended with a respiratory condition â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** not recommended with a respiratory condition
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 9**

If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

- **Source:** alternatives that do not release pollutants â€” Health NZ
- **Authority:** WorkSafe New Zealand and/or Health New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** alternatives that do not release pollutants
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

NZ dedup variants (shorter wording used when the named blocks are also carried, so nothing is said twice): `indoor-combustion`, `gas-installation-and-servicing`, `indoor-combustion+gas-installation-and-servicing`.

## unflued-gas-heating â€” AU WORDING (verbatim)

**NO AU SHARED BODY â€” FAILS CLOSED.** An Australian file carrying this block shows `{{safety.notVerifiedForMarket}}` and is not publishable.

### AU â€” STATE-SPECIFIC wording researched for this block (NOT SERVED to any member; waits for state routing)

**VIC-ONLY (Energy Safe Victoria)**

Don't use kitchen rangehoods or bathroom exhaust fans at the same time as the heater: it can create a negative-pressure environment that draws carbon monoxide into living spaces.

- Record: `vic-extraction-fans` Â· category B Â· scope: â€” Â· figure: none
- Source: https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/heating-your-home-gas Â· authority: Energy Safe Victoria Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-label); informational: only ever with the agency's name beside it

### AU â€” claims NOT in the served wording (kept as labelled, unserved records)

**unf-combustion-products** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (TAS, VIC, WA); common core needs 4+ or a national source

An unflued or portable gas heater releases its combustion products into the room it heats. Check that the manufacturer's instructions allow indoor use, never use one in an unventilated space, and keep the room's ventilation clear.

- Recorded jurisdictions: TAS (Consumer Affairs Tasmania); VIC (Energy Safe Victoria); WA (Building and Energy (WA))
- Read/live status: read live 2026-10-05

**unf-overnight** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 2 recorded jurisdictions (VIC, NSW); common core needs 4+ or a national source

Do not leave a gas heater on overnight or while you sleep.

- Recorded jurisdictions: VIC (Energy Safe Victoria); NSW (NSW Government)
- Read/live status: read live 2026-10-05

**unf-flame-signs** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (VIC, WA, QLD); common core needs 4+ or a national source

If a gas heater's flame changes colour, soot appears or it is not working normally, stop using it and have a licensed gasfitter inspect it and check it for carbon monoxide.

- Recorded jurisdictions: VIC (Energy Safe Victoria); WA (Building and Energy (WA)); QLD (Queensland Government)
- Read/live status: read live 2026-10-05


---

# BLOCK: gas-cylinder-safety

**Severity HIGH Â· PENDING OWNER APPROVAL (NZ and AU)** Â· LPG cylinders

**Shared or varies:** VARIES â€” and the cylinder test interval varies inside Australia: 10 years in QLD and SA, 'no more than 10 or 15 years' in NSW. Only SA publishes a hose interval. New Zealand publishes cylinder TRANSPORT guidance and a leak test, and nothing on storing a cylinder at home or on test intervals, so the NZ body says nothing about either.

## gas-cylinder-safety â€” NZ WORDING (verbatim; this is exactly what an NZ member reads)

**LPG cylinders hold gas under pressure, so handle them with care.** To stop the gas flow from an LPG cylinder, close the valve on top of it. If more than one cylinder is connected, close every valve.

After you fill or change a cylinder on a portable LPG heater such as a cabinet heater, test the connections for leaks. Spread soapy water on the cylinder connections and turn the cylinder valve on. If bubbles appear there is a leak: close the valve and contact your LPG service agent.

When you carry LPG cylinders in a vehicle: they should be in good condition; secured upright, to stop liquid leaking â€” which is even more dangerous than a gas leak; with every control valve protected from damage; not connected to any appliance; and with no smoking. Never leave a cylinder unattended in a vehicle, particularly in hot weather.

Store a portable LPG appliance that you only use in some seasons, such as a cabinet heater or a barbecue, under cover, so debris, insects or spiders cannot get into the area around the burner.

### NZ â€” provenance, paragraph by paragraph

**NZ paragraph 1**

**LPG cylinders hold gas under pressure, so handle them with care.** To stop the gas flow from an LPG cylinder, close the valve on top of it. If more than one cylinder is connected, close every valve.

- **Source:** close the cylinder valve; every valve if more than one â€” WorkSafe NZ (Gas supply to your property)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** close the cylinder valve; every valve if more than one
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 2**

After you fill or change a cylinder on a portable LPG heater such as a cabinet heater, test the connections for leaks. Spread soapy water on the cylinder connections and turn the cylinder valve on. If bubbles appear there is a leak: close the valve and contact your LPG service agent.

- **Source:** soapy-water connection test on a portable LPG heater â€” WorkSafe NZ (Cabinet heater safety; Gas heating)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** soapy-water connection test on a portable LPG heater
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 3**

When you carry LPG cylinders in a vehicle: they should be in good condition; secured upright, to stop liquid leaking â€” which is even more dangerous than a gas leak; with every control valve protected from damage; not connected to any appliance; and with no smoking. Never leave a cylinder unattended in a vehicle, particularly in hot weather.

- **Source:** transport: condition, upright, valves protected, not connected, no smoking, not unattended in heat â€” WorkSafe NZ (Gas supply to your property)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** transport: condition, upright, valves protected, not connected, no smoking, not unattended in heat
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 4**

Store a portable LPG appliance that you only use in some seasons, such as a cabinet heater or a barbecue, under cover, so debris, insects or spiders cannot get into the area around the burner.

- **Source:** store seasonal portable LPG appliances under cover â€” WorkSafe NZ (Carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** store seasonal portable LPG appliances under cover
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

NZ dedup variants (shorter wording used when the named blocks are also carried, so nothing is said twice): none.

## gas-cylinder-safety â€” AU WORDING (verbatim)

**LPG cylinders hold gas under pressure.** Keep a cylinder upright â€” when you store it and when you carry it â€” and make sure it is secured when you carry it.

Keep cylinders cool and away from heat, flames and sparks.

### AU â€” provenance, paragraph by paragraph (served common core, category A)

**AU paragraph 1**

**LPG cylinders hold gas under pressure.** Keep a cylinder upright â€” when you store it and when you carry it â€” and make sure it is secured when you carry it.

- **Source:** Queensland Government â€” Using natural gas and LPG safely; Gas cylinder safety (QLD; cylinder page updated 3 September 2026; read live 2026-10-05): https://www.qld.gov.au/emergency/safety/home/gas/gas-safety || SA.GOV.AU â€” LPG cylinders and fittings (SA; read live 2026-10-05): https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings || Building and Energy, WA â€” Gas cylinder safety WA (WA; updated 2 April 2026; read live 2026-10-05): https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa || WorkSafe ACT â€” Liquid petroleum gas (LPG) safety (ACT; read live 2026-10-05): https://www.worksafe.act.gov.au/health-and-safety-portal/safety-topics/dangerous-goods-and-hazardous-substances/liquid-petroleum-gas-lpg-safety
- **Authority:** Queensland Government; SA.GOV.AU; Building and Energy (WA); WorkSafe ACT
- **Jurisdiction:** QLD, SA, WA, ACT (4 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** LPG cylinders hold gas under pressure. Keep a cylinder upright â€” when â€¦ â€” Queensland Government (QLD), SA.GOV.AU (SA), Building and Energy (WA) (WA), WorkSafe ACT (ACT) â€” 4 independent official jurisdictions (QLD, SA, WA, ACT), none contradicting, no state-specific limitation
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 4 independent official jurisdictions (QLD, SA, WA, ACT), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 4 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

**AU paragraph 2**

Keep cylinders cool and away from heat, flames and sparks.

- **Source:** Queensland Government â€” Using natural gas and LPG safely; Gas cylinder safety (QLD; cylinder page updated 3 September 2026; read live 2026-10-05): https://www.qld.gov.au/emergency/safety/home/gas/gas-safety || Building and Energy, WA â€” Gas cylinder safety WA (WA; updated 2 April 2026; read live 2026-10-05): https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa || WorkSafe ACT â€” Liquid petroleum gas (LPG) safety (ACT; read live 2026-10-05): https://www.worksafe.act.gov.au/health-and-safety-portal/safety-topics/dangerous-goods-and-hazardous-substances/liquid-petroleum-gas-lpg-safety || SA.GOV.AU â€” LPG cylinders and fittings (SA; read live 2026-10-05): https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings
- **Authority:** Queensland Government; Building and Energy (WA); WorkSafe ACT; SA.GOV.AU
- **Jurisdiction:** QLD, WA, ACT, SA (4 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** Keep cylinders cool and away from heat, flames and sparks.â€¦ â€” Queensland Government (QLD), Building and Energy (WA) (WA), WorkSafe ACT (ACT), SA.GOV.AU (SA) â€” 4 independent official jurisdictions (QLD, WA, ACT, SA), none contradicting, no state-specific limitation
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 4 independent official jurisdictions (QLD, WA, ACT, SA), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 4 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

### AU â€” STATE-SPECIFIC wording researched for this block (NOT SERVED to any member; waits for state routing)

**NSW-ONLY (NSW Government)**

Reusable only with a current, legible test mark of no more than 10 or 15 years old.

- Record: `nsw-cylinder-test` Â· category C Â· scope: refillable LPG cylinders Â· figure: 10 or 15
- Source: https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/gas-safety-requirements-and-consumer-rights Â· authority: NSW Government Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with qld-cylinder-test, sa-cylinder-test â€” never merged

**QLD-ONLY (Queensland Government)**

The test date stamped on the base or neck is valid for 10 years.

- Record: `qld-cylinder-test` Â· category C Â· scope: LPG cylinders Â· figure: 10 years
- Source: https://www.qld.gov.au/emergency/safety/home/gas/cylinder-safety Â· authority: Queensland Government Â· date: 3 September 2026 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with nsw-cylinder-test â€” never merged

Insert a valve plug when transporting a 9 kg or smaller POL cylinder to exchange or refill.

- Record: `qld-valve-plug-9kg` Â· category C Â· scope: POL-valve cylinders of 9 kg or less Â· figure: 9 kg
- Source: https://www.qld.gov.au/emergency/safety/home/gas/cylinder-safety Â· authority: Queensland Government Â· date: 3 September 2026 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**SA-ONLY (SA.GOV.AU)**

Safety tested or replaced every 10 years, stamped T plus month and year.

- Record: `sa-cylinder-test` Â· category C Â· scope: portable LPG cylinders Â· figure: 10 years
- Source: https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings Â· authority: SA.GOV.AU (Office of the Technical Regulator) Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with nsw-cylinder-test â€” never merged

Hoses should be replaced every five years. The only hose interval in either market.

- Record: `sa-hose-interval` Â· category C Â· scope: LPG hoses Â· figure: 5 years
- Source: https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings Â· authority: SA.GOV.AU Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

A POL cylinder is not compatible with an LCC27 appliance; an LCC27 cylinder connects to both.

- Record: `sa-adaptor-compat` Â· category B Â· scope: â€” Â· figure: none
- Source: https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings Â· authority: SA.GOV.AU Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-label); informational: only ever with the agency's name beside it

**WA-ONLY (Building and Energy (WA))**

Move the cylinder to a safe location at least 20 metres from any sources of ignition.

- Record: `wa-leaking-cylinder-distance` Â· category C Â· scope: LPG cylinder with a valve leak Â· figure: 20 m
- Source: https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa Â· authority: Building and Energy (WA) Â· date: 2 April 2026 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

### AU â€” claims NOT in the served wording (kept as labelled, unserved records)

**cyl-test-date** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (NSW, QLD, SA); common core needs 4+ or a national source

Check the test date stamped on a cylinder. Do not use or refill a cylinder that is out of test date or that is damaged or corroded. How long a test date lasts is set by your state or territory.

- Recorded jurisdictions: NSW (NSW Government); QLD (Queensland Government); SA (SA.GOV.AU)
- Read/live status: read live 2026-10-05

**cyl-no-tampering** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (QLD, SA, WA); common core needs 4+ or a national source

Never tamper with a cylinder valve or force it, and do not try to repair or remove a cylinder valve yourself.

- Recorded jurisdictions: QLD (Queensland Government); SA (SA.GOV.AU); WA (Building and Energy (WA))
- Read/live status: read live 2026-10-05

**cyl-appliance-hose** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (SA, QLD, ACT); common core needs 4+ or a national source

Use an LPG cylinder only with an appliance made for LPG, and only with a certified regulator and hose made for it. Check hoses and seals for damage.

- Recorded jurisdictions: SA (SA.GOV.AU); QLD (Queensland Government); ACT (WorkSafe ACT)
- Read/live status: read live 2026-10-05

**cyl-soapy-water** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 2 recorded jurisdictions (QLD, ACT); common core needs 4+ or a national source

Check the connections for leaks with soapy water or detergent and water. If bubbles appear there is a leak: turn the gas off, do not use the appliance, and call a licensed gasfitter.

- Recorded jurisdictions: QLD (Queensland Government); ACT (WorkSafe ACT)
- Read/live status: read live 2026-10-05

**cyl-valve-off** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (SA, QLD, ACT); common core needs 4+ or a national source

Turn the cylinder valve off before you disconnect a cylinder.

- Recorded jurisdictions: SA (SA.GOV.AU); QLD (Queensland Government); ACT (WorkSafe ACT)
- Read/live status: read live 2026-10-05

**cyl-closed-vehicle** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 2 recorded jurisdictions (NSW, ACT); common core needs 4+ or a national source

Do not leave or carry LPG cylinders loose in a closed vehicle, even when they seem empty.

- Recorded jurisdictions: NSW (NSW Government); ACT (WorkSafe ACT)
- Read/live status: read live 2026-10-05


---

# BLOCK: gas-leak-response

**Severity CRITICAL Â· PENDING OWNER APPROVAL (NZ and AU)** Â· If you smell gas

**Shared or varies:** VARIES â€” and the Australian jurisdictions CONFLICT, not merely differ. SA tells you to go outside at once and switch the electricity off at the outdoor meter; WA says to touch no switch and 'if lights are on, leave them on', and to evacuate only 'if you consider it necessary'; VIC and QLD say do not operate switches; NSW says exit immediately, call 000 and isolate power (and its own two pages differ); TAS says isolate power at the main switchboard; NT puts calling 000 before turning the gas off. The ACT has no household procedure on any page that could be read. New Zealand is one jurisdiction and its procedure is unambiguous.

## gas-leak-response â€” NZ WORDING (verbatim; this is exactly what an NZ member reads)

**If you smell gas inside your home:** keep flames and cigarettes out of the room and away from the area. **Never operate any electrical switch** â€” switching one on or off could cause a spark. Do not use your mobile phone in the area. If you can do it safely, turn off the valves to gas appliances, then turn off the gas at the meter or at the LPG cylinder. Open doors and windows to ventilate the area. If the smell persists, go outside to a safe place away from the building.

**If you smell gas outside:** keep flames, cigarettes, vehicles and electrical equipment â€” including mobile phones â€” away from the area. Turn off the gas at the meter or at the LPG cylinder, and leave the area.

In an emergency call 111. If there is a problem with your gas supply, contact your gas retailer â€” the company that sends your gas bills â€” immediately. If there is a problem with your gas installation or appliances, contact a licensed gas worker immediately.

### NZ â€” provenance, paragraph by paragraph

**NZ paragraph 1**

**If you smell gas inside your home:** keep flames and cigarettes out of the room and away from the area. **Never operate any electrical switch** â€” switching one on or off could cause a spark. Do not use your mobile phone in the area. If you can do it safely, turn off the valves to gas appliances, then turn off the gas at the meter or at the LPG cylinder. Open doors and windows to ventilate the area. If the smell persists, go outside to a safe place away from the building.

- **Source:** inside: flames, switches, mobile phone, valves, meter or cylinder, ventilate, go outside â€” WorkSafe NZ (Gas leaks)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** inside: flames, switches, mobile phone, valves, meter or cylinder, ventilate, go outside
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 2**

**If you smell gas outside:** keep flames, cigarettes, vehicles and electrical equipment â€” including mobile phones â€” away from the area. Turn off the gas at the meter or at the LPG cylinder, and leave the area.

- **Source:** outside: flames, vehicles, electrical equipment; meter or cylinder; leave â€” WorkSafe NZ (Gas leaks)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** outside: flames, vehicles, electrical equipment; meter or cylinder; leave
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 3**

In an emergency call 111. If there is a problem with your gas supply, contact your gas retailer â€” the company that sends your gas bills â€” immediately. If there is a problem with your gas installation or appliances, contact a licensed gas worker immediately.

- **Source:** 111; gas retailer for supply; licensed gas worker for installation or appliances â€” WorkSafe NZ (Gas leaks)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** 111; gas retailer for supply; licensed gas worker for installation or appliances
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

NZ dedup variants (shorter wording used when the named blocks are also carried, so nothing is said twice): none.

## gas-leak-response â€” AU WORDING (verbatim)

**NO AU SHARED BODY â€” FAILS CLOSED.** An Australian file carrying this block shows `{{safety.notVerifiedForMarket}}` and is not publishable.

**Drafted, NOT served** (stored only; the owner may approve it as written):

**A smell of gas is an emergency.** Do not light or use any flame, do not smoke, and avoid anything else that could ignite gas. Open doors and windows if it is safe to do so. If the smell is strong or does not go away, leave the building. Report it to your gas supplier's emergency number â€” it is on your gas bill â€” or call 000.

**What else to do differs between states and territories â€” in particular whether to switch electrical devices on or off, and whether to turn off power â€” and official advice does not agree, so this resource gives no instruction about it.** Follow your state or territory's gas safety regulator and your gas supplier.

### AU â€” STATE-SPECIFIC wording researched for this block (NOT SERVED to any member; waits for state routing)

**ACT-ONLY (WorkSafe ACT)**

NO HOUSEHOLD LEAK PROCEDURE was found on any ACT Government page that could be read. WorkSafe ACT's LPG page covers an appliance leak-check only. ACT is NOT RELIED UPON for leak guidance.

- Record: `act-leak-absent` Â· category C Â· scope: â€” Â· figure: none
- Source: WorkSafe ACT LPG safety page; no leak page found Â· authority: ACT Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**NSW-ONLY (NSW Government)**

EXIT THE BUILDING IMMEDIATELY and call 000 asking for NSW Fire and Rescue; turn off gas at the meter or cylinder if safe; turn off all appliances INCLUDING ELECTRICAL and pilot lights (the consumer-rights page says 'isolate your power supply'); open doors and windows only if safe; extinguish flames; contact a licensed gasfitter and the supplier. NSW's own two pages differ.

- Record: `nsw-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://www.nsw.gov.au/housing-and-construction/building-or-renovating-a-home/preparing/using-a-gasfitter Â· authority: NSW Government Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with qld-leak, wa-leak, vic-leak, tas-leak â€” never merged

**NT-ONLY (NT WorkSafe)**

Turn off all pilot lights and appliances; ventilate; LEAVE THE BUILDING AND CALL 000 (listed before turning the gas off); if safe, turn off the gas at the cylinder or meter; contact your supplier; do not enter the affected area.

- Record: `nt-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://worksafe.nt.gov.au/safety-and-prevention/gas-safety Â· authority: NT WorkSafe Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with qld-leak â€” never merged

**QLD-ONLY (Queensland Government)**

Don't light fires; DON'T TURN ANY ELECTRICAL DEVICES (LIGHT SWITCHES) ON OR OFF; turn off the appliance; open doors and windows; if you can still smell gas, turn off the supply and contact your supplier or a gasfitter; call 000 ONLY IF YOU STILL SMELL GAS AFTER TURNING OFF THE SUPPLY. Evacuate only for fire, explosion or an uncontrolled leak.

- Record: `qld-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://www.qld.gov.au/emergency/safety/home/gas/gas-safety Â· authority: Queensland Government Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with nsw-leak, sa-leak, nt-leak â€” never merged

**SA-ONLY (SA.GOV.AU)**

GO OUTSIDE AT ONCE, opening doors and windows and extinguishing flames as you go; once outside, TURN OFF THE GAS AND ELECTRICITY at the outdoor meters; call a licensed gas fitter by mobile or via a neighbour; do not re-enter until inspected. Do not plug in, unplug or switch anything on or off; no telephone indoors; no torch or lights; no fan. 000 only if gas catches fire.

- Record: `sa-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/gas-leaks Â· authority: SA.GOV.AU (Department for Energy and Mining) Â· date: updated 13 July 2023 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with wa-leak, vic-leak, qld-leak â€” never merged

**TAS-ONLY (Consumer Affairs Tasmania)**

Do not operate any appliance (gas and electrical); turn off gas appliances and the supply at the meter or cylinder; open doors and windows; EVACUATE; if the smell remains call 000 and the gas supplier; ISOLATE POWER AT THE MAIN SWITCHBOARD. Ignition sources include light switches, power points and mobile phones.

- Record: `tas-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://consumeraffairs.tas.gov.au/topics/technical-regulation/gas-standards-safety/emergency/what-to-do Â· authority: Consumer Affairs Tasmania Â· date: 28 March 2018 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with nsw-leak â€” never merged

**VIC-ONLY (Energy Safe Victoria)**

Turn off the gas at the meter or cylinder if safe; extinguish flames, do not smoke or strike matches; DO NOT OPERATE ELECTRICAL SWITCHES OR DEVICES; open doors and windows; keep people away; call your gas distributor or the number on your bill. 000 is named only for a fire.

- Record: `vic-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://www.energysafe.vic.gov.au/community-safety/emergencies/gas-emergencies Â· authority: Energy Safe Victoria Â· date: reviewed 29 January 2023 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with sa-leak, wa-leak, nsw-leak â€” never merged

**WA-ONLY (Building and Energy (WA))**

Turn off the supply at the meter or cylinder (which may not stop the leak); EVACUATE ONLY 'IF YOU CONSIDER IT NECESSARY'; no flames, smoking, matches or lighters; DON'T TOUCH ELECTRICAL SWITCHES â€” IF LIGHTS ARE ON, LEAVE THEM ON; ventilate; report to the supplier and the Director of Energy Safety.

- Record: `wa-leak` Â· category C Â· scope: â€” Â· figure: none
- Source: https://www.wa.gov.au/organisation/building-and-energy/gas-safety-home Â· authority: Building and Energy (WA) Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with sa-leak, nsw-leak â€” never merged


---

# BLOCK: gas-installation-and-servicing

**Severity HIGH Â· PENDING OWNER APPROVAL (NZ and AU)** Â· Gas work and servicing

**Shared or varies:** VARIES. Licensing is the one thing all eight Australian jurisdictions agree on â€” a licensed gasfitter â€” and even there the trade name, regulator and certificate differ. Three jurisdictions publish a servicing interval and the three differ (NSW annually for gas WATER heaters only; VIC every two years; WA two years, or annually over ten years old); five publish none. New Zealand publishes intervals by appliance type.

## gas-installation-and-servicing â€” NZ WORDING (verbatim; this is exactly what an NZ member reads)

**Only a licensed gasfitter may do gas work.** Have any gasfitting â€” pipework, gas appliances and flues, and any addition or alteration â€” done by a currently licensed gasfitter or certifying gasfitter, and ask to see their current practising licence ID card.

Gasfitting done since 1 July 2013 has to be certified. Once the work is connected, the person responsible must issue a Gas Safety Certificate that says the installation is safe to use. Ask for it and keep it.

Owners, landlords and tenants are responsible for the safe operation and maintenance of their gas appliances. Have them checked regularly by an authorised and competent person.

WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually. WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.

Whenever a licensed gas worker is in your home, ask them to check that your gas appliances and installation are safe. Consider replacing old appliances, and avoid buying second-hand ones.

If the gas supply to your property has been interrupted, or an appliance may have been left on, a certifying gasfitter must be involved in turning the gas back on, because the pipes may have filled with air.

### NZ â€” provenance, paragraph by paragraph

**NZ paragraph 1**

**Only a licensed gasfitter may do gas work.** Have any gasfitting â€” pipework, gas appliances and flues, and any addition or alteration â€” done by a currently licensed gasfitter or certifying gasfitter, and ask to see their current practising licence ID card.

- **Source:** licensed or certifying gasfitter for pipework, appliances, flues and alterations; ask for the licence card â€” WorkSafe NZ (Getting gas work done)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** licensed or certifying gasfitter for pipework, appliances, flues and alterations; ask for the licence card
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 2**

Gasfitting done since 1 July 2013 has to be certified. Once the work is connected, the person responsible must issue a Gas Safety Certificate that says the installation is safe to use. Ask for it and keep it.

- **Source:** certification since 1 July 2013; Gas Safety Certificate â€” WorkSafe NZ (Getting gas work done)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** certification since 1 July 2013; Gas Safety Certificate
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 3**

Owners, landlords and tenants are responsible for the safe operation and maintenance of their gas appliances. Have them checked regularly by an authorised and competent person.

- **Source:** owners, landlords and tenants are responsible; regular checks â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** owners, landlords and tenants are responsible; regular checks
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 4**

WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually. WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.

- **Source:** flame effect and LPG cabinet heaters annually; other space and water heaters at least every two years â€” WorkSafe NZ (Getting gas work done)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** flame effect and LPG cabinet heaters annually; other space and water heaters at least every two years
- **Numeric claim IDs:** `nz-lpg-cabinet-heater-service-12-months-worksafe` â€” VERIFIED_LIVE 2026-10-05; wording pending owner approval; valid only inside block(s): unflued-gas-heating; gas-installation-and-servicing; `nz-gas-other-heater-service-two-years-worksafe` â€” VERIFIED_LIVE 2026-10-05; wording pending owner approval; valid only inside block(s): gas-installation-and-servicing
- **Limitations:** SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none. SCOPED TO space heaters other than flame effect and cabinet heaters, and to water heaters. Cabinet and flame effect heaters are the annual entry, not this one. NZ only. It must never appear in an AU file, and the Victorian two-year figure must never be read as supporting it: they are different agencies' advice for different appliances in different countries.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 5**

Whenever a licensed gas worker is in your home, ask them to check that your gas appliances and installation are safe. Consider replacing old appliances, and avoid buying second-hand ones.

- **Source:** ask a licensed gas worker to check; replace old; avoid second-hand â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** ask a licensed gas worker to check; replace old; avoid second-hand
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

**NZ paragraph 6**

If the gas supply to your property has been interrupted, or an appliance may have been left on, a certifying gasfitter must be involved in turning the gas back on, because the pipes may have filled with air.

- **Source:** a certifying gasfitter turns the gas back on after an interruption â€” WorkSafe NZ (Gas supply to your property)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national regulator)
- **Read/live status:** read live 2026-10-05 (Stage 9.55/9.56 research; wording built Stage 9.62; unchanged in 9.62A)
- **Claim supported:** a certifying gasfitter turns the gas back on after an interruption
- **Numeric claim IDs:** none (no registered figure in this paragraph)
- **Limitations:** New Zealand only; must not appear in an Australian file; no figure.
- **Status:** NZ national guidance (one regulator) â€” not applicable to Australia

NZ dedup variants (shorter wording used when the named blocks are also carried, so nothing is said twice): none.

## gas-installation-and-servicing â€” AU WORDING (verbatim)

**Gas work must be done by a licensed gasfitter** â€” installing, altering, relocating, repairing, servicing or testing gas appliances, pipework and connections, and replacing a gas appliance. Ask to see the licence, and check it with your state or territory's regulator.

After gas work, ask the gasfitter for the compliance certificate, inspection certificate or service record that applies where you live, and keep it.

Have gas appliances serviced regularly by a licensed gasfitter. How often depends on the appliance, the manufacturer's instructions and your state or territory â€” some set an interval and some do not â€” so check your state or territory's energy safety regulator.

### AU â€” provenance, paragraph by paragraph (served common core, category A)

**AU paragraph 1**

**Gas work must be done by a licensed gasfitter** â€” installing, altering, relocating, repairing, servicing or testing gas appliances, pipework and connections, and replacing a gas appliance. Ask to see the licence, and check it with your state or territory's regulator.

- **Source:** Energy Safe Victoria â€” Using gas safely; Heating your home with gas (VIC; read live 2026-10-05): https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/using-gas-safely || NSW Government â€” Gas safety requirements and consumer rights; Using a gasfitter (NSW; read live 2026-10-05): https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/gas-safety-requirements-and-consumer-rights || Queensland Government â€” Using natural gas and LPG safely; Gas cylinder safety (QLD; cylinder page updated 3 September 2026; read live 2026-10-05): https://www.qld.gov.au/emergency/safety/home/gas/gas-safety || SA.GOV.AU â€” LPG cylinders and fittings (SA; read live 2026-10-05): https://www.sa.gov.au/topics/energy-and-environment/safe-energy-use/using-gas-appliances-safely/lpg-cylinders-and-fittings || Building and Energy, WA â€” Gas cylinder safety WA (WA; updated 2 April 2026; read live 2026-10-05): https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa || Consumer Affairs Tasmania â€” Preventing carbon monoxide poisoning (TAS; updated 29 January 2021; read live 2026-10-05): https://consumeraffairs.tas.gov.au/topics/technical-regulation/gas-standards-safety/carbon-monoxide/preventing-carbon-monoxide-poisoning || WorkSafe ACT â€” Liquid petroleum gas (LPG) safety (ACT; read live 2026-10-05): https://www.worksafe.act.gov.au/health-and-safety-portal/safety-topics/dangerous-goods-and-hazardous-substances/liquid-petroleum-gas-lpg-safety || NT WorkSafe â€” Gas safety (NT; read live 2026-10-05): https://worksafe.nt.gov.au/safety-and-prevention/gas-safety
- **Authority:** Energy Safe Victoria; NSW Government; Queensland Government; SA.GOV.AU; Building and Energy (WA); Consumer Affairs Tasmania; WorkSafe ACT; NT WorkSafe
- **Jurisdiction:** VIC, NSW, QLD, SA, WA, TAS, ACT, NT (8 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** Gas work must be done by a licensed gasfitter â€” installing, altering, â€¦ â€” Energy Safe Victoria (VIC), NSW Government (NSW), Queensland Government (QLD), SA.GOV.AU (SA), Building and Energy (WA) (WA), Consumer Affairs Tasmania (TAS), WorkSafe ACT (ACT), NT WorkSafe (NT) â€” 8 independent official jurisdictions (VIC, NSW, QLD, SA, WA, TAS, ACT, NT), none contradicting, no state-specific limitation â€” the list of kinds of work is recorded at paragraph level, not verified verb by verb per jurisdiction
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 8 independent official jurisdictions (VIC, NSW, QLD, SA, WA, TAS, ACT, NT), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 8 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

**AU paragraph 2**

After gas work, ask the gasfitter for the compliance certificate, inspection certificate or service record that applies where you live, and keep it.

- **Source:** NSW Government â€” Gas safety requirements and consumer rights; Using a gasfitter (NSW; read live 2026-10-05): https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/gas-safety-requirements-and-consumer-rights || Consumer Affairs Tasmania â€” Preventing carbon monoxide poisoning (TAS; updated 29 January 2021; read live 2026-10-05): https://consumeraffairs.tas.gov.au/topics/technical-regulation/gas-standards-safety/carbon-monoxide/preventing-carbon-monoxide-poisoning || NT WorkSafe â€” Gas safety (NT; read live 2026-10-05): https://worksafe.nt.gov.au/safety-and-prevention/gas-safety || Energy Safe Victoria â€” Using gas safely; Heating your home with gas (VIC; read live 2026-10-05): https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/using-gas-safely
- **Authority:** NSW Government; Consumer Affairs Tasmania; NT WorkSafe; Energy Safe Victoria
- **Jurisdiction:** NSW, TAS, NT, VIC (4 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** After gas work, ask the gasfitter for the compliance certificate, inspâ€¦ â€” NSW Government (NSW), Consumer Affairs Tasmania (TAS), NT WorkSafe (NT), Energy Safe Victoria (VIC) â€” 4 independent official jurisdictions (NSW, TAS, NT, VIC), none contradicting, no state-specific limitation
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 4 independent official jurisdictions (NSW, TAS, NT, VIC), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 4 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

**AU paragraph 3**

Have gas appliances serviced regularly by a licensed gasfitter. How often depends on the appliance, the manufacturer's instructions and your state or territory â€” some set an interval and some do not â€” so check your state or territory's energy safety regulator.

- **Source:** Energy Safe Victoria â€” Using gas safely; Heating your home with gas (VIC; read live 2026-10-05): https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/using-gas-safely || NSW Government â€” Gas safety requirements and consumer rights; Using a gasfitter (NSW; read live 2026-10-05): https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/gas-safety-requirements-and-consumer-rights || Building and Energy, WA â€” Gas cylinder safety WA (WA; updated 2 April 2026; read live 2026-10-05): https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa || Queensland Government â€” Using natural gas and LPG safely; Gas cylinder safety (QLD; cylinder page updated 3 September 2026; read live 2026-10-05): https://www.qld.gov.au/emergency/safety/home/gas/gas-safety || Consumer Affairs Tasmania â€” Preventing carbon monoxide poisoning (TAS; updated 29 January 2021; read live 2026-10-05): https://consumeraffairs.tas.gov.au/topics/technical-regulation/gas-standards-safety/carbon-monoxide/preventing-carbon-monoxide-poisoning
- **Authority:** Energy Safe Victoria; NSW Government; Building and Energy (WA); Queensland Government; Consumer Affairs Tasmania
- **Jurisdiction:** VIC, NSW, WA, QLD, TAS (5 of 8)
- **Read/live status:** read live 2026-10-05; page dates are in the source strings above
- **Claim supported:** Have gas appliances serviced regularly by a licensed gasfitter. How ofâ€¦ â€” Energy Safe Victoria (VIC), NSW Government (NSW), Building and Energy (WA) (WA), Queensland Government (QLD), Consumer Affairs Tasmania (TAS) â€” 5 independent official jurisdictions (VIC, NSW, WA, QLD, TAS), none contradicting, no state-specific limitation â€” NSW's evidence is gas WATER heaters only; the claim is non-numeric ('regularly') and the interval is left to the regulator. Without NSW it is still 4
- **Numeric claim IDs:** none â€” non-numeric by rule; no AU gas figure is registered
- **Limitations:** 5 independent official jurisdictions (VIC, NSW, WA, QLD, TAS), none contradicting, no state-specific limitation. Provenance is recorded at paragraph level; wording is the shared proposal, not any one jurisdiction's own sentence.
- **Status:** COMMON CORE (category A) â€” 5 recorded jurisdictions, no national source (AS/NZS 5601 is paywalled), none contradicting

### AU â€” STATE-SPECIFIC wording researched for this block (NOT SERVED to any member; waits for state routing)

**ACT-ONLY (WorkSafe ACT)**

No household servicing interval is published on the pages read. QLD says appliances should be 'periodically checked and serviced'; TAS says 'regular servicing'.

- Record: `act-service-interval-absent` Â· category C Â· scope: gas appliances Â· figure: none
- Source: see the Stage 9.55/9.56 reports Â· authority: ACT Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**NSW-ONLY (NSW Government)**

Make sure your water heater is serviced once a year by a licensed gasfitter. NSW publishes no space-heater interval on the pages read.

- Record: `nsw-wh-service-interval` Â· category C Â· scope: gas water heater (indoor or outdoor) ONLY Â· figure: 1 years
- Source: https://www.nsw.gov.au/legal-and-justice/consumer-rights-and-protection/safety/gas-safety-requirements-and-consumer-rights/gas-water-heaters Â· authority: NSW Government (Building Commission NSW / NSW Fair Trading) Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with vic-service-interval â€” never merged

**NT-ONLY (NT WorkSafe)**

No household servicing interval is published on the pages read. QLD says appliances should be 'periodically checked and serviced'; TAS says 'regular servicing'.

- Record: `nt-service-interval-absent` Â· category C Â· scope: gas appliances Â· figure: none
- Source: see the Stage 9.55/9.56 reports Â· authority: NT Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**QLD-ONLY (Queensland Government)**

No household servicing interval is published on the pages read. QLD says appliances should be 'periodically checked and serviced'; TAS says 'regular servicing'.

- Record: `qld-service-interval-absent` Â· category C Â· scope: gas appliances Â· figure: none
- Source: see the Stage 9.55/9.56 reports Â· authority: QLD Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**SA-ONLY (SA.GOV.AU)**

No household servicing interval is published on the pages read. QLD says appliances should be 'periodically checked and serviced'; TAS says 'regular servicing'.

- Record: `sa-service-interval-absent` Â· category C Â· scope: gas appliances Â· figure: none
- Source: see the Stage 9.55/9.56 reports Â· authority: SA Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**TAS-ONLY (Consumer Affairs Tasmania)**

No household servicing interval is published on the pages read. QLD says appliances should be 'periodically checked and serviced'; TAS says 'regular servicing'.

- Record: `tas-service-interval-absent` Â· category C Â· scope: gas appliances Â· figure: none
- Source: see the Stage 9.55/9.56 reports Â· authority: TAS Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches

**VIC-ONLY (Energy Safe Victoria)**

Serviced once every two years by a qualified gasfitter, with a CO analyser used as part of the service.

- Record: `vic-service-interval` Â· category C Â· scope: gas water heaters, space heaters and central heaters Â· figure: 2 years
- Source: https://www.energysafe.vic.gov.au/community-safety/energy-safety-guides/home-safety/using-gas-safely Â· authority: Energy Safe Victoria and the Building and Plumbing Commission Â· date: read live 2026-10-05
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with nsw-wh-service-interval, wa-service-interval â€” never merged

**WA-ONLY (Building and Energy (WA))**

Serviced by a licensed gas fitter at least every two years, or annually if the equipment is more than 10 years old.

- Record: `wa-service-interval` Â· category C Â· scope: gas appliances; annual if the equipment is more than 10 years old Â· figure: or annually when over 10 years old
- Source: https://www.wa.gov.au/government/announcements/winter-gas-safety Â· authority: Building and Energy, Government of Western Australia Â· date: 18 June 2025 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-routing); must never be shown unless the member's state is known and matches; CONFLICTS with vic-service-interval, nsw-wh-service-interval â€” never merged

Sale, hire and use of POL-to-LCC27 cylinder adaptors is prohibited by order of the Director of Energy Safety.

- Record: `wa-adaptor-ban` Â· category B Â· scope: â€” Â· figure: none
- Source: https://www.wa.gov.au/organisation/building-and-energy/gas-cylinder-safety-wa Â· authority: Building and Energy (WA) Â· date: 2 April 2026 (read live 2026-10-05)
- Status: STATE-SPECIFIC, NOT SERVED (state-label); informational: only ever with the agency's name beside it

### AU â€” claims NOT in the served wording (kept as labelled, unserved records)

**ins-no-diy** â€” status: **NOT SERVED â€” jurisdiction-labelled (category B); common-core rule not met** â€” only 3 recorded jurisdictions (VIC, SA, WA); common core needs 4+ or a national source

Never attempt gas work yourself, and never tamper with safety valves or fittings.

- Recorded jurisdictions: VIC (Energy Safe Victoria); SA (SA.GOV.AU); WA (Building and Energy (WA))
- Read/live status: read live 2026-10-05


---

# 5. Exact owner approvals required

1. **Approve, change or reject, per block, the NZ wording and the AU wording** (five blocks Ã— two markets). Approval removes that block's `pendingOwnerApproval` entry for the market; I have not touched any.
2. **AU unflued heating and AU leak response:** confirm they stay without a body (fail closed). The drafted AU leak wording is stored unserved; say whether you want it ever approved as written.
3. **The three NZ numeric claims** (1 m clearance; 12-month cabinet-heater service; 2-year other-heater service) â€” approve their NZ wording as shown; they then move to `OWNER-APPROVED`, scope unchanged.
4. **Whether `gas-installation-and-servicing` / `carbon-monoxide` should be carried by OG-B09 at all** (editorial; the detector does not require them).
5. Only then: Stage 9.63 (OG-B09 claims-first), which I have not started.


# 6. Stage 9.62B work included in this commit

- **Exact safety-block ownership in the numeric scan** (admin-import/audit/numeric.ts): a figure is credited to a safety block only when it occurs inside that block's own rendered content. Resource text after a block, in the same container, or repeating a block's sentence, is credited to no block. The old pattern credited everything from the first block to the end of its container to the first block. The only live consequence was OG-27's 15-minute sentence (section 1). 9 ownership tests: tests/unit/numeric-ownership.test.ts.
- **Provenance fix:** four AU claims cited a jurisdiction missing from their block's own source list (including the served 'rules differ' paragraph). All had been read live; the lists were completed and a test added.
- **Nothing else changed:** NZ wording byte-identical to Stage 9.62; AU wording unchanged since 9.62A.


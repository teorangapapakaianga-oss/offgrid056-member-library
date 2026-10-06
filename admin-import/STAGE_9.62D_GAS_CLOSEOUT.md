# Stage 9.62D â€” Final gas owner-review closeout

**Date:** 6 October 2026 Â· **Model:** Sonnet 5.5 Â· **Status/owner-review work only. Nothing deployed. No gas block deployed or migrated. OG-B09 not started. Stage 9.63 not started.**

## 1. AU approval state, recorded in `admin-import/config/safety-blocks.json`

| Block | AU state | `pendingOwnerApproval` |
|---|---|---|
| `gas-and-lpg-general` | **AU wording OWNER-APPROVED** (2026-10-06, Stage 9.62D; subject to the recorded provenance remaining valid and unchanged) | `["NZ"]` |
| `unflued-gas-heating` | **AU FAIL-CLOSED / NO SERVED BODY** | `["NZ","AU"]` |
| `gas-cylinder-safety` | **AU wording OWNER-APPROVED** (same condition) | `["NZ"]` |
| `gas-leak-response` | **AU FAIL-CLOSED; drafted wording UNSERVED** â€” NOT approved as AU common-core wording; reconsider only as jurisdiction-specific wording with valid sources, or as AU common-core if the 4-jurisdiction / national-source threshold is met | `["NZ","AU"]` |
| `gas-installation-and-servicing` | **AU wording OWNER-APPROVED** (same condition) | `["NZ"]` |

Effect: an Australian file may now use the three approved AU bodies; **NZ wording of all five is still pending, so any resource carrying them still fails closed in NZ**, and AU unflued / AU leak stay unavailable even when carried. No live resource carries any gas block, so no live behaviour changed. Detector requirements are unchanged: **OG-B09 = `gas-and-lpg-general` only** (no installation/servicing, no carbon monoxide, added editorially or otherwise); **OG-24 = `gas-and-lpg-general` + `gas-installation-and-servicing`**; **OG-17 = none**.

## 2. Validation

| Check | Result |
|---|---|
| tests | **587 existing tests all pass; 588 total** (one new test records the approval state above) |
| 21-resource prep | **21 / 21 ready** |
| market files | **42 / 42**; `import:verify-prep`: all prepared files verified |
| Bucket C | **0** (0 market problems, 0 other findings, 0 content flags, 0 price findings, 0 safety-removal findings) |
| gas scan | 0 unexpected gas requirements |
| lint / typecheck | clean / clean |
| PDFs / private assets | **64 files; newest change 07:26 today (the OG-17 deploy), before this work; 0 PDFs and 0 files modified in this stage**; nothing tracked in git |
| member content | no change |
| Worker | unchanged `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |

## 3. NZ wording â€” FULL, below

The complete NZ member-facing body of each of the five blocks follows, with provenance directly under each paragraph, then the three held NZ numeric claims. NZ wording is byte-identical to what was reviewed in Stage 9.62C.

---

# BLOCK 1. Gas and LPG appliances  (`gas-and-lpg-general`, HIGH)

## NZ WORDING â€” FULL VERBATIM TEXT (NZ wording: PENDING OWNER APPROVAL)

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

**Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up.

Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately.

If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

## NZ â€” provenance directly under each paragraph

**Paragraph 1:** **Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

- **Source:** intended use, manufacturer instructions, a cooker griller or barbecue is not a heater â€” WorkSafe NZ (Keep yourself safe from carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** intended use, manufacturer instructions, a cooker griller or barbecue is not a heater
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 2:** **Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up.

- **Source:** outdoor appliances never indoors: no oxygen-depletion shut-off â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** outdoor appliances never indoors: no oxygen-depletion shut-off
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 3:** Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

- **Source:** faulty/small space/blocked ventilation â†’ carbon monoxide â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** faulty/small space/blocked ventilation â†’ carbon monoxide
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 4:** Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately.

- **Source:** yellow flame, soot, car-exhaust smell â†’ turn off, licensed gas worker â€” WorkSafe NZ (Gas heating; Carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** yellow flame, soot, car-exhaust smell â†’ turn off, licensed gas worker
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 5:** If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

- **Source:** smell LPG or fumes â†’ turn off appliance and cylinder, service agent or gasfitter â€” WorkSafe NZ (Gas heating; Cabinet heater safety)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** smell LPG or fumes â†’ turn off appliance and cylinder, service agent or gasfitter
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 6:** Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

- **Source:** turn off completely; light back â€” WorkSafe NZ (Carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** turn off completely; light back
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

## NZ â€” shorter variants used when another block already says a point (so nothing is said twice)

**When `indoor-combustion` is also carried, the NZ wording is:**

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately.

If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

**When `carbon-monoxide` is also carried, the NZ wording is:**

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

**Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up.

Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

**When `indoor-combustion+carbon-monoxide` is also carried, the NZ wording is:**

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.

Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.

If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.

Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.


---

# BLOCK 2. Unflued and portable gas heaters  (`unflued-gas-heating`, CRITICAL)

## NZ WORDING â€” FULL VERBATIM TEXT (NZ wording: PENDING OWNER APPROVAL)

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep.

While it is on, keep internal doors and at least one window open, and check that room vents are not blocked.

Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself.

WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter.

LPG cabinet heaters are not recommended in homes where someone has a respiratory condition.

If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

## NZ â€” provenance directly under each paragraph

**Paragraph 1:** **Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

- **Source:** what an unflued heater is; flued carries products outside â€” WorkSafe NZ (Gas heating); Health NZ
- **Authority:** WorkSafe New Zealand and Health New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** what an unflued heater is; flued carries products outside
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 2:** Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep.

- **Source:** never in a bedroom, bathroom, small room, caravan or tent â€” WorkSafe NZ; Health NZ
- **Authority:** WorkSafe New Zealand and Health New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** never in a bedroom, bathroom, small room, caravan or tent
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 3:** While it is on, keep internal doors and at least one window open, and check that room vents are not blocked.

- **Source:** internal doors and a window open; vents unblocked â€” Health NZ; WorkSafe NZ
- **Authority:** WorkSafe New Zealand and Health New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** internal doors and a window open; vents unblocked
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 4:** Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

- **Source:** nitrogen dioxide, carbon monoxide, water vapour feeding mould and dust mites; asthma â€” Health NZ
- **Authority:** WorkSafe New Zealand and Health New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** nitrogen dioxide, carbon monoxide, water vapour feeding mould and dust mites; asthma
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 5:** Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself.

- **Source:** short a time as possible; manufacturer's instructions; no DIY maintenance â€” Health NZ; WorkSafe NZ
- **Authority:** WorkSafe New Zealand and Health New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** short a time as possible; manufacturer's instructions; no DIY maintenance
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 6:** WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

- **Source:** Heater Metre Rule; clothing; fireguard â€” WorkSafe NZ (Cabinet heater safety)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** Heater Metre Rule; clothing; fireguard
- **Numeric claim ID:** `nz-gas-heater-clearance-one-metre-worksafe`
- **Limitation:** A clearance for a heater in use, from WorkSafe's cabinet-heater page. NZ only: it is not an Australian figure and must not appear in an AU file. It approves 'one metre' of nothing else â€” not a cylinder clearance, a flue clearance or a generator distance.

**Paragraph 7:** WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter.

- **Source:** cabinet heater serviced every 12 months, before winter â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** cabinet heater serviced every 12 months, before winter
- **Numeric claim ID:** `nz-lpg-cabinet-heater-service-12-months-worksafe`
- **Limitation:** SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none.

**Paragraph 8:** LPG cabinet heaters are not recommended in homes where someone has a respiratory condition.

- **Source:** not recommended with a respiratory condition â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** not recommended with a respiratory condition
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 9:** If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

- **Source:** alternatives that do not release pollutants â€” Health NZ
- **Authority:** WorkSafe New Zealand and Health New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** alternatives that do not release pollutants
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

## NZ â€” shorter variants used when another block already says a point (so nothing is said twice)

**When `indoor-combustion` is also carried, the NZ wording is:**

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

**When `gas-installation-and-servicing` is also carried, the NZ wording is:**

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep.

While it is on, keep internal doors and at least one window open, and check that room vents are not blocked.

Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself.

WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

LPG cabinet heaters are not recommended in homes where someone has a respiratory condition.

If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

**When `indoor-combustion+gas-installation-and-servicing` is also carried, the NZ wording is:**

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.

Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.

WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.

If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.


---

# BLOCK 3. LPG cylinders  (`gas-cylinder-safety`, HIGH)

## NZ WORDING â€” FULL VERBATIM TEXT (NZ wording: PENDING OWNER APPROVAL)

**LPG cylinders hold gas under pressure, so handle them with care.** To stop the gas flow from an LPG cylinder, close the valve on top of it. If more than one cylinder is connected, close every valve.

After you fill or change a cylinder on a portable LPG heater such as a cabinet heater, test the connections for leaks. Spread soapy water on the cylinder connections and turn the cylinder valve on. If bubbles appear there is a leak: close the valve and contact your LPG service agent.

When you carry LPG cylinders in a vehicle: they should be in good condition; secured upright, to stop liquid leaking â€” which is even more dangerous than a gas leak; with every control valve protected from damage; not connected to any appliance; and with no smoking. Never leave a cylinder unattended in a vehicle, particularly in hot weather.

Store a portable LPG appliance that you only use in some seasons, such as a cabinet heater or a barbecue, under cover, so debris, insects or spiders cannot get into the area around the burner.

## NZ â€” provenance directly under each paragraph

**Paragraph 1:** **LPG cylinders hold gas under pressure, so handle them with care.** To stop the gas flow from an LPG cylinder, close the valve on top of it. If more than one cylinder is connected, close every valve.

- **Source:** close the cylinder valve; every valve if more than one â€” WorkSafe NZ (Gas supply to your property)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** close the cylinder valve; every valve if more than one
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 2:** After you fill or change a cylinder on a portable LPG heater such as a cabinet heater, test the connections for leaks. Spread soapy water on the cylinder connections and turn the cylinder valve on. If bubbles appear there is a leak: close the valve and contact your LPG service agent.

- **Source:** soapy-water connection test on a portable LPG heater â€” WorkSafe NZ (Cabinet heater safety; Gas heating)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** soapy-water connection test on a portable LPG heater
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 3:** When you carry LPG cylinders in a vehicle: they should be in good condition; secured upright, to stop liquid leaking â€” which is even more dangerous than a gas leak; with every control valve protected from damage; not connected to any appliance; and with no smoking. Never leave a cylinder unattended in a vehicle, particularly in hot weather.

- **Source:** transport: condition, upright, valves protected, not connected, no smoking, not unattended in heat â€” WorkSafe NZ (Gas supply to your property)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** transport: condition, upright, valves protected, not connected, no smoking, not unattended in heat
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 4:** Store a portable LPG appliance that you only use in some seasons, such as a cabinet heater or a barbecue, under cover, so debris, insects or spiders cannot get into the area around the burner.

- **Source:** store seasonal portable LPG appliances under cover â€” WorkSafe NZ (Carbon monoxide)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** store seasonal portable LPG appliances under cover
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.


---

# BLOCK 4. If you smell gas  (`gas-leak-response`, CRITICAL)

## NZ WORDING â€” FULL VERBATIM TEXT (NZ wording: PENDING OWNER APPROVAL)

**If you smell gas inside your home:** keep flames and cigarettes out of the room and away from the area. **Never operate any electrical switch** â€” switching one on or off could cause a spark. Do not use your mobile phone in the area. If you can do it safely, turn off the valves to gas appliances, then turn off the gas at the meter or at the LPG cylinder. Open doors and windows to ventilate the area. If the smell persists, go outside to a safe place away from the building.

**If you smell gas outside:** keep flames, cigarettes, vehicles and electrical equipment â€” including mobile phones â€” away from the area. Turn off the gas at the meter or at the LPG cylinder, and leave the area.

In an emergency call 111. If there is a problem with your gas supply, contact your gas retailer â€” the company that sends your gas bills â€” immediately. If there is a problem with your gas installation or appliances, contact a licensed gas worker immediately.

## NZ â€” provenance directly under each paragraph

**Paragraph 1:** **If you smell gas inside your home:** keep flames and cigarettes out of the room and away from the area. **Never operate any electrical switch** â€” switching one on or off could cause a spark. Do not use your mobile phone in the area. If you can do it safely, turn off the valves to gas appliances, then turn off the gas at the meter or at the LPG cylinder. Open doors and windows to ventilate the area. If the smell persists, go outside to a safe place away from the building.

- **Source:** inside: flames, switches, mobile phone, valves, meter or cylinder, ventilate, go outside â€” WorkSafe NZ (Gas leaks)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** inside: flames, switches, mobile phone, valves, meter or cylinder, ventilate, go outside
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 2:** **If you smell gas outside:** keep flames, cigarettes, vehicles and electrical equipment â€” including mobile phones â€” away from the area. Turn off the gas at the meter or at the LPG cylinder, and leave the area.

- **Source:** outside: flames, vehicles, electrical equipment; meter or cylinder; leave â€” WorkSafe NZ (Gas leaks)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** outside: flames, vehicles, electrical equipment; meter or cylinder; leave
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 3:** In an emergency call 111. If there is a problem with your gas supply, contact your gas retailer â€” the company that sends your gas bills â€” immediately. If there is a problem with your gas installation or appliances, contact a licensed gas worker immediately.

- **Source:** 111; gas retailer for supply; licensed gas worker for installation or appliances â€” WorkSafe NZ (Gas leaks)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** 111; gas retailer for supply; licensed gas worker for installation or appliances
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.


---

# BLOCK 5. Gas work and servicing  (`gas-installation-and-servicing`, HIGH)

## NZ WORDING â€” FULL VERBATIM TEXT (NZ wording: PENDING OWNER APPROVAL)

**Only a licensed gasfitter may do gas work.** Have any gasfitting â€” pipework, gas appliances and flues, and any addition or alteration â€” done by a currently licensed gasfitter or certifying gasfitter, and ask to see their current practising licence ID card.

Gasfitting done since 1 July 2013 has to be certified. Once the work is connected, the person responsible must issue a Gas Safety Certificate that says the installation is safe to use. Ask for it and keep it.

Owners, landlords and tenants are responsible for the safe operation and maintenance of their gas appliances. Have them checked regularly by an authorised and competent person.

WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually. WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.

Whenever a licensed gas worker is in your home, ask them to check that your gas appliances and installation are safe. Consider replacing old appliances, and avoid buying second-hand ones.

If the gas supply to your property has been interrupted, or an appliance may have been left on, a certifying gasfitter must be involved in turning the gas back on, because the pipes may have filled with air.

## NZ â€” provenance directly under each paragraph

**Paragraph 1:** **Only a licensed gasfitter may do gas work.** Have any gasfitting â€” pipework, gas appliances and flues, and any addition or alteration â€” done by a currently licensed gasfitter or certifying gasfitter, and ask to see their current practising licence ID card.

- **Source:** licensed or certifying gasfitter for pipework, appliances, flues and alterations; ask for the licence card â€” WorkSafe NZ (Getting gas work done)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** licensed or certifying gasfitter for pipework, appliances, flues and alterations; ask for the licence card
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 2:** Gasfitting done since 1 July 2013 has to be certified. Once the work is connected, the person responsible must issue a Gas Safety Certificate that says the installation is safe to use. Ask for it and keep it.

- **Source:** certification since 1 July 2013; Gas Safety Certificate â€” WorkSafe NZ (Getting gas work done)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** certification since 1 July 2013; Gas Safety Certificate
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 3:** Owners, landlords and tenants are responsible for the safe operation and maintenance of their gas appliances. Have them checked regularly by an authorised and competent person.

- **Source:** owners, landlords and tenants are responsible; regular checks â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** owners, landlords and tenants are responsible; regular checks
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 4:** WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually. WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.

- **Source:** flame effect and LPG cabinet heaters annually; other space and water heaters at least every two years â€” WorkSafe NZ (Getting gas work done)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** flame effect and LPG cabinet heaters annually; other space and water heaters at least every two years
- **Numeric claim ID:** `nz-lpg-cabinet-heater-service-12-months-worksafe`, `nz-gas-other-heater-service-two-years-worksafe`
- **Limitation:** SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none. SCOPED TO space heaters other than flame effect and cabinet heaters, and to water heaters. Cabinet and flame effect heaters are the annual entry, not this one. NZ only. It must never appear in an AU file, and the Victorian two-year figure must never be read as supporting it: they are different agencies' advice for different appliances in different countries.

**Paragraph 5:** Whenever a licensed gas worker is in your home, ask them to check that your gas appliances and installation are safe. Consider replacing old appliances, and avoid buying second-hand ones.

- **Source:** ask a licensed gas worker to check; replace old; avoid second-hand â€” WorkSafe NZ
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** ask a licensed gas worker to check; replace old; avoid second-hand
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.

**Paragraph 6:** If the gas supply to your property has been interrupted, or an appliance may have been left on, a certifying gasfitter must be involved in turning the gas back on, because the pipes may have filled with air.

- **Source:** a certifying gasfitter turns the gas back on after an interruption â€” WorkSafe NZ (Gas supply to your property)
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** New Zealand (national)
- **Live-read status:** read live 2026-10-05 from the official pages (not a search snippet)
- **Claim supported:** a certifying gasfitter turns the gas back on after an interruption
- **Numeric claim ID:** none
- **Limitation:** New Zealand only; must not appear in an Australian file; carries no registered figure.


---

# THE THREE NZ NUMERIC CLAIMS â€” HELD, PENDING OWNER APPROVAL

## `nz-gas-heater-clearance-one-metre-worksafe`

**Exact member-facing sentence(s) containing the number:**

- (block `unflued-gas-heating`) "WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source."
- (block `unflued-gas-heating`) "Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children."

- **Block(s) that own it:** unflued-gas-heating
- **Source:** https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/cabinet-heater-safety/
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** national (New Zealand)
- **Source status:** read live 2026-10-05; registry status: VERIFIED_LIVE 2026-10-05 â€” built 2026-10-06 (Stage 9.62); wording pending owner approval with the block
- **Numeric registry ID:** `nz-gas-heater-clearance-one-metre-worksafe`
- **Limitations:** A clearance for a heater in use, from WorkSafe's cabinet-heater page. NZ only: it is not an Australian figure and must not appear in an AU file. It approves 'one metre' of nothing else â€” not a cylinder clearance, a flue clearance or a generator distance.

Full registry entry (`admin-import/config/numeric-claims.json`):

```json
{
  "id": "nz-gas-heater-clearance-one-metre-worksafe",
  "market": "NZ",
  "jurisdiction": "national",
  "owningBlock": "unflued-gas-heating",
  "owningResources": [],
  "category": "distance",
  "claimType": "threshold",
  "unit": "m",
  "value": {
    "exact": 1
  },
  "allowedWording": "WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source; keep an unflued heater at least one metre from anything that could catch fire.",
  "match": [
    "\\bHeater Metre Rule\\b[\\s\\S]{0,120}\\bone metre\\b",
    "\\bunflued heater at least one metre\\b"
  ],
  "requiresLabel": null,
  "source": "https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/cabinet-heater-safety/",
  "authority": "WorkSafe New Zealand",
  "sourceDate": "read live 2026-10-05",
  "limitations": [
    "A clearance for a heater in use, from WorkSafe's cabinet-heater page. NZ only: it is not an Australian figure and must not appear in an AU file.",
    "It approves 'one metre' of nothing else â€” not a cylinder clearance, a flue clearance or a generator distance."
  ],
  "status": "VERIFIED_LIVE 2026-10-05 â€” built 2026-10-06 (Stage 9.62); wording pending owner approval with the block"
}
```

## `nz-lpg-cabinet-heater-service-12-months-worksafe`

**Exact member-facing sentence(s) containing the number:**

- (block `unflued-gas-heating`) "WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter."
- (block `gas-installation-and-servicing`) "WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually."

- **Block(s) that own it:** unflued-gas-heating; gas-installation-and-servicing
- **Source:** https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/getting-gas-work-done/
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** national (New Zealand)
- **Source status:** read live 2026-10-05; registry status: VERIFIED_LIVE 2026-10-05 â€” built 2026-10-06 (Stage 9.62); wording pending owner approval with the block
- **Numeric registry ID:** `nz-lpg-cabinet-heater-service-12-months-worksafe`
- **Limitations:** SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none.

Full registry entry (`admin-import/config/numeric-claims.json`):

```json
{
  "id": "nz-lpg-cabinet-heater-service-12-months-worksafe",
  "market": "NZ",
  "jurisdiction": "national",
  "owningBlock": "unflued-gas-heating; gas-installation-and-servicing",
  "owningResources": [],
  "category": "interval",
  "claimType": "interval",
  "unit": "months",
  "value": {
    "exact": 12,
    "text": "annually"
  },
  "allowedWording": "WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months; flame effect heaters and LPG cabinet heaters should be serviced annually.",
  "match": [
    "\\bLPG cabinet heater\\b[\\s\\S]{0,80}\\bevery 12 months\\b",
    "\\bflame effect heaters and LPG cabinet heaters should be serviced annually\\b"
  ],
  "requiresLabel": "WorkSafe New Zealand",
  "source": "https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/getting-gas-work-done/",
  "authority": "WorkSafe New Zealand",
  "sourceDate": "read live 2026-10-05",
  "limitations": [
    "SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters.",
    "NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none."
  ],
  "status": "VERIFIED_LIVE 2026-10-05 â€” built 2026-10-06 (Stage 9.62); wording pending owner approval with the block"
}
```

## `nz-gas-other-heater-service-two-years-worksafe`

**Exact member-facing sentence(s) containing the number:**

- (block `gas-installation-and-servicing`) "WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years."

- **Block(s) that own it:** gas-installation-and-servicing
- **Source:** https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/getting-gas-work-done/
- **Authority:** WorkSafe New Zealand
- **Jurisdiction:** national (New Zealand)
- **Source status:** read live 2026-10-05; registry status: VERIFIED_LIVE 2026-10-05 â€” built 2026-10-06 (Stage 9.62); wording pending owner approval with the block
- **Numeric registry ID:** `nz-gas-other-heater-service-two-years-worksafe`
- **Limitations:** SCOPED TO space heaters other than flame effect and cabinet heaters, and to water heaters. Cabinet and flame effect heaters are the annual entry, not this one. NZ only. It must never appear in an AU file, and the Victorian two-year figure must never be read as supporting it: they are different agencies' advice for different appliances in different countries.

Full registry entry (`admin-import/config/numeric-claims.json`):

```json
{
  "id": "nz-gas-other-heater-service-two-years-worksafe",
  "market": "NZ",
  "jurisdiction": "national",
  "owningBlock": "gas-installation-and-servicing",
  "owningResources": [],
  "category": "interval",
  "claimType": "interval",
  "unit": "years",
  "value": {
    "exact": 2
  },
  "allowedWording": "WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.",
  "match": [
    "\\bother space heaters and water heaters should be serviced at least every two years\\b"
  ],
  "requiresLabel": "WorkSafe New Zealand",
  "source": "https://www.worksafe.govt.nz/managing-health-and-safety/consumers/safe-living-with-gas/getting-gas-work-done/",
  "authority": "WorkSafe New Zealand",
  "sourceDate": "read live 2026-10-05",
  "limitations": [
    "SCOPED TO space heaters other than flame effect and cabinet heaters, and to water heaters. Cabinet and flame effect heaters are the annual entry, not this one.",
    "NZ only. It must never appear in an AU file, and the Victorian two-year figure must never be read as supporting it: they are different agencies' advice for different appliances in different countries."
  ],
  "status": "VERIFIED_LIVE 2026-10-05 â€” built 2026-10-06 (Stage 9.62); wording pending owner approval with the block"
}
```


---

# Exact remaining owner decisions

1. **NZ wording of each of the five blocks:** approve, change or reject (five decisions). Approval removes `"NZ"` from that block's `pendingOwnerApproval`.
2. **The three NZ numeric claims** (1 m, 12 months, 2 years): approve their member-facing sentences as shown so they move to `OWNER-APPROVED`. They stay PENDING until you say so.
3. Anything you want changed in the NZ wording before approval (every NZ sentence is shown above).
4. Then â€” and only then â€” whether to start OG-B09 (claims-first, `gas-and-lpg-general` only). **Not started.**

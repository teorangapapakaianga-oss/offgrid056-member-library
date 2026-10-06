# Stage 9.62A â€” Gas / LPG architecture: owner review and hardening

**Date:** 6 October 2026 Â· **Model:** Sonnet 5.5 Â· **Nothing deployed. No gas block released, approved or marked approved. OG-B09 and OG-24 not migrated. No member content changed.**

Locked state: Worker `fa23ec74-85d2-4d91-b484-3f037ccbe38b`, 21 resources, 42 market files. Tests 512 â†’ 551 (9.62) â†’ **576**. Bucket C = 0.

> **Note on the brief.** The Stage 9.62A continuation message was cut off at its item 5 ("OG-B09 RECLASSIFICATION â€” For â€¦"). Items 1â€“4 and the original 16-point return were followed. Â§8 records the corrected OG-B09 detector result in full, since that is what the cut-off item was evidently asking for; if it asked for something more, send the rest.

## 1. Push confirmation

`2a6edb1` pushed; `origin/main` = `2a6edb1` (five proposed gas blocks, AU override architecture, gas tests; no member-content change; no deployment). The Stage 9.62A work is committed locally only.

## 2. Lint (investigated first)

12 errors, all one rule, all in **temporary, git-ignored `workspace/` diagnostic scripts I wrote this stage** â€” no project code:

| File | Line | Rule | Reason | Decision |
|---|---|---|---|---|
| workspace/dryrun3.mts | 2:86 | no-explicit-any | `as any[]` on a JSON read | **deleted** (one-off) |
| workspace/dryrun4.mts | 3:12, 5:32 | no-explicit-any | same | **deleted** (found nothing useful) |
| workspace/dump6.mts | 3:36 | no-explicit-any | same | **deleted** (one-off) |
| workspace/nzcheck.mts | 6:21, 6:109 | no-explicit-any | same | **deleted** (its result is recorded in Â§3) |
| workspace/dryrun6.mts | 8:38 | no-explicit-any | `topicBlocks.blocks as any` | **corrected** (typed `SafetyBlock`) â€” kept for the OG-B09 proof |
| workspace/regress.mts | 2:84, 7:32, 8:44, 12:47, 14:54 | no-explicit-any | untyped report rows | **corrected** (typed `Row`) â€” reusable regression summary |

No lint configuration was changed or excluded. **lint clean Â· typecheck clean Â· 576/576.**

## 3. What changed since the first 9.62 review (summary)

- **Tightened Category-A rule** (Â§5), applied to every AU claim; `classifyCommonClaim` and `COMMON_CORE_MIN_JURISDICTIONS = 4` in `admin-import/markets/resolve.ts`. Two jurisdictions never qualify. No national source was readable (AS/NZS 5601 is paywalled), so route A is empty and every AU claim needs â‰¥4 independent jurisdictions.
- **AU unflued heating now fails closed** (no claim reaches four jurisdictions). AU leak response still fails closed.
- **Required-block-set mechanism replaces the blanket release** (Â§6).
- **Numeric detector**: annual/recurring wording and spelled numbers (Â§9, Â§10).
- **Block-owned numeric claims are scoped** to their own block's sentence (Â§11).
- **Leak detector**: "If you smell gas, turn off at the meter" now triggers (it named no appliance, so it was invisible).
- NZ wording of all five blocks and their NZ dedup variants: **byte-identical** to Stage 9.62 (checked against `HEAD`). The 12 earlier blocks: byte-identical.

## 4. Exact proposed member-facing wording, with provenance

Provenance is **paragraph-level** (one source row per paragraph, which may hold several sentences). The "numeric claims used" column lists registry claims whose match pattern hits the paragraph. Dates are "read live 2026-10-05"; per-page dates for dated AU pages (TAS 29 Jan 2021, QLD cylinder page 3 Sep 2026, WA 2 Apr 2026, VIC leak page reviewed 29 Jan 2023, SA 13 Jul 2023, TAS leak 28 Mar 2018) are in the override table.

## gas-and-lpg-general â€” HIGH â€” PENDING OWNER APPROVAL (NZ, AU)

### gas-and-lpg-general Â· NEW ZEALAND â€” exact member-facing wording (what a member would read)

| # | Exact wording | Source authority and page | Jurisdiction | Source date | Source stage | Numeric claims used | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater. | intended use, manufacturer instructions, a cooker griller or barbecue is not a heater â€” WorkSafe NZ (Keep yourself safe from carbon monoxide) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 2 | **Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up. | outdoor appliances never indoors: no oxygen-depletion shut-off â€” WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 3 | Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear. | faulty/small space/blocked ventilation â†’ carbon monoxide â€” WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 4 | Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately. | yellow flame, soot, car-exhaust smell â†’ turn off, licensed gas worker â€” WorkSafe NZ (Gas heating; Carbon monoxide) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 5 | If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter. | smell LPG or fumes â†’ turn off appliance and cylinder, service agent or gasfitter â€” WorkSafe NZ (Gas heating; Cabinet heater safety) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 6 | Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide. | turn off completely; light back â€” WorkSafe NZ (Carbon monoxide) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |

NZ dedup variants (shorter wording used when these blocks are also carried, so nothing is said twice): `indoor-combustion`, `carbon-monoxide`, `indoor-combustion+carbon-monoxide`.

### gas-and-lpg-general Â· AUSTRALIA â€” common core

| # | Exact wording | Category | Jurisdictions that state it (authority) | Source date | Source stage | Numeric claims | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | Gas appliances that are faulty, poorly maintained or short of fresh air can produce carbon monoxide. Keep permanent ventilation clear, and never use a gas appliance in an unventilated space. | A | VIC, TAS, WA, ACT | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 4 independent official jurisdictions (VIC, TAS, WA, ACT), none contradicting, no state-specific limitation |
| 2 | Gas safety rules â€” including how often an appliance must be serviced â€” differ between states and territories, so check with your state or territory's energy safety regulator. | A | VIC, NSW, QLD, SA, WA, TAS, ACT, NT | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 8 independent official jurisdictions (VIC, NSW, QLD, SA, WA, TAS, ACT, NT), none contradicting, no state-specific limitation |

Claims **removed from the AU core** by the tightened rule (kept as category-B labelled records, not served):

| Claim id | Wording | Recorded jurisdictions | Previous | Now | Why |
|---|---|---|---|---|---|
| gen-intended-use | **Gas and LPG appliances are safe when they are installed, used and maintained as intended.** Use each appliance only for its intended purpose and follow the manufacturer's instructions. A gas cooker or oven is not a heater. | VIC, TAS (2) | A (served) | B (not served) | only 2 recorded jurisdictions (VIC, TAS); common core needs 4+ or a national source |
| gen-outdoor-appliances | Appliances made for outdoor use â€” such as barbecues, patio heaters and camping stoves â€” are for outdoor use only. Do not bring them inside a home, caravan, car or tent. | VIC, TAS, ACT (3) | A (served) | B (not served) | only 3 recorded jurisdictions (VIC, TAS, ACT); common core needs 4+ or a national source |
| gen-combustibles | Keep clothing, paper and anything else that can burn well away from gas appliances. | VIC, QLD (2) | A (served) | B (not served) | only 2 recorded jurisdictions (VIC, QLD); common core needs 4+ or a national source |
| gen-flame-signs | If an appliance's flame changes, soot appears, or it will not light properly, stop using it and call a licensed gasfitter. | VIC, QLD, WA (3) | A (served) | B (not served) | only 3 recorded jurisdictions (VIC, QLD, WA); common core needs 4+ or a national source |
| gen-no-tampering | Never tamper with safety valves or fittings, and never try to repair a gas appliance yourself. | VIC, SA, WA (3) | A (served) | B (not served) | only 3 recorded jurisdictions (VIC, SA, WA); common core needs 4+ or a national source |


## unflued-gas-heating â€” CRITICAL â€” PENDING OWNER APPROVAL (NZ, AU)

### unflued-gas-heating Â· NEW ZEALAND â€” exact member-facing wording (what a member would read)

| # | Exact wording | Source authority and page | Jurisdiction | Source date | Source stage | Numeric claims used | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside. | what an unflued heater is; flued carries products outside â€” WorkSafe NZ (Gas heating); Health NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 2 | Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep. | never in a bedroom, bathroom, small room, caravan or tent â€” WorkSafe NZ; Health NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 3 | While it is on, keep internal doors and at least one window open, and check that room vents are not blocked. | internal doors and a window open; vents unblocked â€” Health NZ; WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 4 | Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide. | nitrogen dioxide, carbon monoxide, water vapour feeding mould and dust mites; asthma â€” Health NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 5 | Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself. | short a time as possible; manufacturer's instructions; no DIY maintenance â€” Health NZ; WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 6 | WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children. | Heater Metre Rule; clothing; fireguard â€” WorkSafe NZ (Cabinet heater safety) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | `nz-gas-heater-clearance-one-metre-worksafe` (VERIFIED_LIVE, pending owner approval) | A clearance for a heater in use, from WorkSafe's cabinet-heater page. NZ only: it is not an Australian figure and must not appear in an AU file. It approves 'one metre' of nothing else â€” not a cylinder clearance, a flue clearance or a generator distance. |
| 7 | WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter. | cabinet heater serviced every 12 months, before winter â€” WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | `nz-lpg-cabinet-heater-service-12-months-worksafe` (VERIFIED_LIVE, pending owner approval) | SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none. |
| 8 | LPG cabinet heaters are not recommended in homes where someone has a respiratory condition. | not recommended with a respiratory condition â€” WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 9 | If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner. | alternatives that do not release pollutants â€” Health NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |

NZ dedup variants (shorter wording used when these blocks are also carried, so nothing is said twice): `indoor-combustion`, `gas-installation-and-servicing`, `indoor-combustion+gas-installation-and-servicing`.

### unflued-gas-heating Â· AUSTRALIA â€” common core

**NO AU SHARED BODY â€” FAILS CLOSED.** An Australian file carrying this block renders `{{safety.notVerifiedForMarket}}` and is not publishable.

Claims **removed from the AU core** by the tightened rule (kept as category-B labelled records, not served):

| Claim id | Wording | Recorded jurisdictions | Previous | Now | Why |
|---|---|---|---|---|---|
| unf-combustion-products | **An unflued or portable gas heater releases its combustion products into the room it heats.** Check that the manufacturer's instructions allow indoor use, never use one in an unventilated space, and keep the room's ventilation clear. | TAS, VIC, WA (3) | A (served) | B (not served) | only 3 recorded jurisdictions (TAS, VIC, WA); common core needs 4+ or a national source |
| unf-overnight | Do not leave a gas heater on overnight or while you sleep. | VIC, NSW (2) | A (served) | B (not served) | only 2 recorded jurisdictions (VIC, NSW); common core needs 4+ or a national source |
| unf-flame-signs | If a gas heater's flame changes colour, soot appears or it is not working normally, stop using it and have a licensed gasfitter inspect it and check it for carbon monoxide. | VIC, WA, QLD (3) | A (served) | B (not served) | only 3 recorded jurisdictions (VIC, WA, QLD); common core needs 4+ or a national source |


## gas-cylinder-safety â€” HIGH â€” PENDING OWNER APPROVAL (NZ, AU)

### gas-cylinder-safety Â· NEW ZEALAND â€” exact member-facing wording (what a member would read)

| # | Exact wording | Source authority and page | Jurisdiction | Source date | Source stage | Numeric claims used | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **LPG cylinders hold gas under pressure, so handle them with care.** To stop the gas flow from an LPG cylinder, close the valve on top of it. If more than one cylinder is connected, close every valve. | close the cylinder valve; every valve if more than one â€” WorkSafe NZ (Gas supply to your property) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 2 | After you fill or change a cylinder on a portable LPG heater such as a cabinet heater, test the connections for leaks. Spread soapy water on the cylinder connections and turn the cylinder valve on. If bubbles appear there is a leak: close the valve and contact your LPG service agent. | soapy-water connection test on a portable LPG heater â€” WorkSafe NZ (Cabinet heater safety; Gas heating) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 3 | When you carry LPG cylinders in a vehicle: they should be in good condition; secured upright, to stop liquid leaking â€” which is even more dangerous than a gas leak; with every control valve protected from damage; not connected to any appliance; and with no smoking. Never leave a cylinder unattended in a vehicle, particularly in hot weather. | transport: condition, upright, valves protected, not connected, no smoking, not unattended in heat â€” WorkSafe NZ (Gas supply to your property) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 4 | Store a portable LPG appliance that you only use in some seasons, such as a cabinet heater or a barbecue, under cover, so debris, insects or spiders cannot get into the area around the burner. | store seasonal portable LPG appliances under cover â€” WorkSafe NZ (Carbon monoxide) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |

NZ dedup variants (shorter wording used when these blocks are also carried, so nothing is said twice): none.

### gas-cylinder-safety Â· AUSTRALIA â€” common core

| # | Exact wording | Category | Jurisdictions that state it (authority) | Source date | Source stage | Numeric claims | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **LPG cylinders hold gas under pressure.** Keep a cylinder upright â€” when you store it and when you carry it â€” and make sure it is secured when you carry it. | A | QLD, SA, WA, ACT | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 4 independent official jurisdictions (QLD, SA, WA, ACT), none contradicting, no state-specific limitation |
| 2 | Keep cylinders cool and away from heat, flames and sparks. | A | QLD, WA, ACT, SA | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 4 independent official jurisdictions (QLD, WA, ACT, SA), none contradicting, no state-specific limitation |

Claims **removed from the AU core** by the tightened rule (kept as category-B labelled records, not served):

| Claim id | Wording | Recorded jurisdictions | Previous | Now | Why |
|---|---|---|---|---|---|
| cyl-test-date | Check the test date stamped on a cylinder. Do not use or refill a cylinder that is out of test date or that is damaged or corroded. How long a test date lasts is set by your state or territory. | NSW, QLD, SA (3) | A (served) | B (not served) | only 3 recorded jurisdictions (NSW, QLD, SA); common core needs 4+ or a national source |
| cyl-no-tampering | Never tamper with a cylinder valve or force it, and do not try to repair or remove a cylinder valve yourself. | QLD, SA, WA (3) | A (served) | B (not served) | only 3 recorded jurisdictions (QLD, SA, WA); common core needs 4+ or a national source |
| cyl-appliance-hose | Use an LPG cylinder only with an appliance made for LPG, and only with a certified regulator and hose made for it. Check hoses and seals for damage. | SA, QLD, ACT (3) | A (served) | B (not served) | only 3 recorded jurisdictions (SA, QLD, ACT); common core needs 4+ or a national source |
| cyl-soapy-water | Check the connections for leaks with soapy water or detergent and water. If bubbles appear there is a leak: turn the gas off, do not use the appliance, and call a licensed gasfitter. | QLD, ACT (2) | A (served) | B (not served) | only 2 recorded jurisdictions (QLD, ACT); common core needs 4+ or a national source |
| cyl-valve-off | Turn the cylinder valve off before you disconnect a cylinder. | SA, QLD, ACT (3) | A (served) | B (not served) | only 3 recorded jurisdictions (SA, QLD, ACT); common core needs 4+ or a national source |
| cyl-closed-vehicle | Do not leave or carry LPG cylinders loose in a closed vehicle, even when they seem empty. | NSW, ACT (2) | A (served) | B (not served) | only 2 recorded jurisdictions (NSW, ACT); common core needs 4+ or a national source |


## gas-leak-response â€” CRITICAL â€” PENDING OWNER APPROVAL (NZ, AU)

### gas-leak-response Â· NEW ZEALAND â€” exact member-facing wording (what a member would read)

| # | Exact wording | Source authority and page | Jurisdiction | Source date | Source stage | Numeric claims used | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **If you smell gas inside your home:** keep flames and cigarettes out of the room and away from the area. **Never operate any electrical switch** â€” switching one on or off could cause a spark. Do not use your mobile phone in the area. If you can do it safely, turn off the valves to gas appliances, then turn off the gas at the meter or at the LPG cylinder. Open doors and windows to ventilate the area. If the smell persists, go outside to a safe place away from the building. | inside: flames, switches, mobile phone, valves, meter or cylinder, ventilate, go outside â€” WorkSafe NZ (Gas leaks) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 2 | **If you smell gas outside:** keep flames, cigarettes, vehicles and electrical equipment â€” including mobile phones â€” away from the area. Turn off the gas at the meter or at the LPG cylinder, and leave the area. | outside: flames, vehicles, electrical equipment; meter or cylinder; leave â€” WorkSafe NZ (Gas leaks) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 3 | In an emergency call 111. If there is a problem with your gas supply, contact your gas retailer â€” the company that sends your gas bills â€” immediately. If there is a problem with your gas installation or appliances, contact a licensed gas worker immediately. | 111; gas retailer for supply; licensed gas worker for installation or appliances â€” WorkSafe NZ (Gas leaks) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |

NZ dedup variants (shorter wording used when these blocks are also carried, so nothing is said twice): none.

### gas-leak-response Â· AUSTRALIA â€” common core

**NO AU SHARED BODY â€” FAILS CLOSED.** An Australian file carrying this block renders `{{safety.notVerifiedForMarket}}` and is not publishable.

Drafted, NOT served (for owner approval as written):

> **A smell of gas is an emergency.** Do not light or use any flame, do not smoke, and avoid anything else that could ignite gas. Open doors and windows if it is safe to do so. If the smell is strong or does not go away, leave the building. Report it to your gas supplier's emergency number â€” it is on your gas bill â€” or call 000.
> **What else to do differs between states and territories â€” in particular whether to switch electrical devices on or off, and whether to turn off power â€” and official advice does not agree, so this resource gives no instruction about it.** Follow your state or territory's gas safety regulator and your gas supplier.


## gas-installation-and-servicing â€” HIGH â€” PENDING OWNER APPROVAL (NZ, AU)

### gas-installation-and-servicing Â· NEW ZEALAND â€” exact member-facing wording (what a member would read)

| # | Exact wording | Source authority and page | Jurisdiction | Source date | Source stage | Numeric claims used | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **Only a licensed gasfitter may do gas work.** Have any gasfitting â€” pipework, gas appliances and flues, and any addition or alteration â€” done by a currently licensed gasfitter or certifying gasfitter, and ask to see their current practising licence ID card. | licensed or certifying gasfitter for pipework, appliances, flues and alterations; ask for the licence card â€” WorkSafe NZ (Getting gas work done) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 2 | Gasfitting done since 1 July 2013 has to be certified. Once the work is connected, the person responsible must issue a Gas Safety Certificate that says the installation is safe to use. Ask for it and keep it. | certification since 1 July 2013; Gas Safety Certificate â€” WorkSafe NZ (Getting gas work done) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 3 | Owners, landlords and tenants are responsible for the safe operation and maintenance of their gas appliances. Have them checked regularly by an authorised and competent person. | owners, landlords and tenants are responsible; regular checks â€” WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 4 | WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually. WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years. | flame effect and LPG cabinet heaters annually; other space and water heaters at least every two years â€” WorkSafe NZ (Getting gas work done) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | `nz-lpg-cabinet-heater-service-12-months-worksafe` (VERIFIED_LIVE, pending owner approval); `nz-gas-other-heater-service-two-years-worksafe` (VERIFIED_LIVE, pending owner approval) | SCOPED TO flame effect heaters and LPG cabinet heaters. It is not an interval for water heaters or other space heaters. NZ only. Australia has no national interval: NSW publishes one annual figure for gas WATER heaters only, Victoria two years, WA two years or annually over ten years old, and five jurisdictions none. SCOPED TO space heaters other than flame effect and cabinet heaters, and to water heaters. Cabinet and flame effect heaters are the annual entry, not this one. NZ only. It must never appear in an AU file, and the Victorian two-year figure must never be read as supporting it: they are different agencies' advice for different appliances in different countries. |
| 5 | Whenever a licensed gas worker is in your home, ask them to check that your gas appliances and installation are safe. Consider replacing old appliances, and avoid buying second-hand ones. | ask a licensed gas worker to check; replace old; avoid second-hand â€” WorkSafe NZ | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |
| 6 | If the gas supply to your property has been interrupted, or an appliance may have been left on, a certifying gasfitter must be involved in turning the gas back on, because the pipes may have filled with air. | a certifying gasfitter turns the gas back on after an interruption â€” WorkSafe NZ (Gas supply to your property) | New Zealand (national) | read live 2026-10-05 | researched Stage 9.55/9.56; wording built Stage 9.62 | none registered | New Zealand only. No figure. Not for an Australian file. |

NZ dedup variants (shorter wording used when these blocks are also carried, so nothing is said twice): none.

### gas-installation-and-servicing Â· AUSTRALIA â€” common core

| # | Exact wording | Category | Jurisdictions that state it (authority) | Source date | Source stage | Numeric claims | Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **Gas work must be done by a licensed gasfitter** â€” installing, altering, relocating, repairing, servicing or testing gas appliances, pipework and connections, and replacing a gas appliance. Ask to see the licence, and check it with your state or territory's regulator. | A | VIC, NSW, QLD, SA, WA, TAS, ACT, NT | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 8 independent official jurisdictions (VIC, NSW, QLD, SA, WA, TAS, ACT, NT), none contradicting, no state-specific limitation |
| 2 | After gas work, ask the gasfitter for the compliance certificate, inspection certificate or service record that applies where you live, and keep it. | A | NSW, TAS, NT, VIC | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 4 independent official jurisdictions (NSW, TAS, NT, VIC), none contradicting, no state-specific limitation |
| 3 | Have gas appliances serviced regularly by a licensed gasfitter. How often depends on the appliance, the manufacturer's instructions and your state or territory â€” some set an interval and some do not â€” so check your state or territory's energy safety regulator. | A | VIC, NSW, WA, QLD, TAS | read live 2026-10-05 (per-jurisdiction dates in the source list) | researched Stage 9.55/9.56; classified Stage 9.62A | none (non-numeric by rule) | 5 independent official jurisdictions (VIC, NSW, WA, QLD, TAS), none contradicting, no state-specific limitation |

Claims **removed from the AU core** by the tightened rule (kept as category-B labelled records, not served):

| Claim id | Wording | Recorded jurisdictions | Previous | Now | Why |
|---|---|---|---|---|---|
| ins-no-diy | Never attempt gas work yourself, and never tamper with safety valves or fittings. | VIC, SA, WA (3) | A (served) | B (not served) | only 3 recorded jurisdictions (VIC, SA, WA); common core needs 4+ or a national source |


## AU state / territory override table (stored, NEVER served)

| Block | Id | State | Cat | Appliance / scope | Figure | Authority | Source date | Serving rule | Conflicts with |
|---|---|---|---|---|---|---|---|---|---|
| gas-and-lpg-general | gen-intended-use-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-intended-use-tas | TAS | B | â€” | â€” | Consumer Affairs Tasmania | updated 29 January 2021 (read live 2026-10-05) | state-label | â€” |
| gas-and-lpg-general | gen-outdoor-appliances-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-outdoor-appliances-tas | TAS | B | â€” | â€” | Consumer Affairs Tasmania | updated 29 January 2021 (read live 2026-10-05) | state-label | â€” |
| gas-and-lpg-general | gen-outdoor-appliances-act | ACT | B | â€” | â€” | WorkSafe ACT | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-combustibles-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-combustibles-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-and-lpg-general | gen-flame-signs-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-flame-signs-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-and-lpg-general | gen-flame-signs-wa | WA | B | â€” | â€” | Building and Energy (WA) | updated 2 April 2026 (read live 2026-10-05) | state-label | â€” |
| gas-and-lpg-general | gen-no-tampering-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-no-tampering-sa | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-and-lpg-general | gen-no-tampering-wa | WA | B | â€” | â€” | Building and Energy (WA) | updated 2 April 2026 (read live 2026-10-05) | state-label | â€” |
| unflued-gas-heating | vic-extraction-fans | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| unflued-gas-heating | unf-combustion-products-tas | TAS | B | â€” | â€” | Consumer Affairs Tasmania | updated 29 January 2021 (read live 2026-10-05) | state-label | â€” |
| unflued-gas-heating | unf-combustion-products-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| unflued-gas-heating | unf-combustion-products-wa | WA | B | â€” | â€” | Building and Energy (WA) | updated 2 April 2026 (read live 2026-10-05) | state-label | â€” |
| unflued-gas-heating | unf-overnight-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| unflued-gas-heating | unf-overnight-nsw | NSW | B | â€” | â€” | NSW Government | read live 2026-10-05 | state-label | â€” |
| unflued-gas-heating | unf-flame-signs-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| unflued-gas-heating | unf-flame-signs-wa | WA | B | â€” | â€” | Building and Energy (WA) | updated 2 April 2026 (read live 2026-10-05) | state-label | â€” |
| unflued-gas-heating | unf-flame-signs-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | nsw-cylinder-test | NSW | C | refillable LPG cylinders | 10 or 15 | NSW Government | read live 2026-10-05 | state-routing | qld-cylinder-test, sa-cylinder-test |
| gas-cylinder-safety | qld-cylinder-test | QLD | C | LPG cylinders | 10 years | Queensland Government | 3 September 2026 (read live 2026-10-05) | state-routing | nsw-cylinder-test |
| gas-cylinder-safety | sa-cylinder-test | SA | C | portable LPG cylinders | 10 years | SA.GOV.AU (Office of the Technical Regulator) | read live 2026-10-05 | state-routing | nsw-cylinder-test |
| gas-cylinder-safety | sa-hose-interval | SA | C | LPG hoses | 5 years | SA.GOV.AU | read live 2026-10-05 | state-routing | â€” |
| gas-cylinder-safety | wa-leaking-cylinder-distance | WA | C | LPG cylinder with a valve leak | 20 m | Building and Energy (WA) | 2 April 2026 (read live 2026-10-05) | state-routing | â€” |
| gas-cylinder-safety | qld-valve-plug-9kg | QLD | C | POL-valve cylinders of 9 kg or less | 9 kg | Queensland Government | 3 September 2026 (read live 2026-10-05) | state-routing | â€” |
| gas-cylinder-safety | sa-adaptor-compat | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-test-date-nsw | NSW | B | â€” | â€” | NSW Government | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-test-date-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | cyl-test-date-sa | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-no-tampering-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | cyl-no-tampering-sa | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-no-tampering-wa | WA | B | â€” | â€” | Building and Energy (WA) | updated 2 April 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | cyl-appliance-hose-sa | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-appliance-hose-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | cyl-appliance-hose-act | ACT | B | â€” | â€” | WorkSafe ACT | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-soapy-water-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | cyl-soapy-water-act | ACT | B | â€” | â€” | WorkSafe ACT | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-valve-off-sa | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-valve-off-qld | QLD | B | â€” | â€” | Queensland Government | cylinder page updated 3 September 2026 (read live 2026-10-05) | state-label | â€” |
| gas-cylinder-safety | cyl-valve-off-act | ACT | B | â€” | â€” | WorkSafe ACT | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-closed-vehicle-nsw | NSW | B | â€” | â€” | NSW Government | read live 2026-10-05 | state-label | â€” |
| gas-cylinder-safety | cyl-closed-vehicle-act | ACT | B | â€” | â€” | WorkSafe ACT | read live 2026-10-05 | state-label | â€” |
| gas-leak-response | vic-leak | VIC | C | â€” | â€” | Energy Safe Victoria | reviewed 29 January 2023 (read live 2026-10-05) | state-routing | sa-leak, wa-leak, nsw-leak |
| gas-leak-response | sa-leak | SA | C | â€” | â€” | SA.GOV.AU (Department for Energy and Mining) | updated 13 July 2023 (read live 2026-10-05) | state-routing | wa-leak, vic-leak, qld-leak |
| gas-leak-response | wa-leak | WA | C | â€” | â€” | Building and Energy (WA) | read live 2026-10-05 | state-routing | sa-leak, nsw-leak |
| gas-leak-response | nsw-leak | NSW | C | â€” | â€” | NSW Government | read live 2026-10-05 | state-routing | qld-leak, wa-leak, vic-leak, tas-leak |
| gas-leak-response | qld-leak | QLD | C | â€” | â€” | Queensland Government | read live 2026-10-05 | state-routing | nsw-leak, sa-leak, nt-leak |
| gas-leak-response | tas-leak | TAS | C | â€” | â€” | Consumer Affairs Tasmania | 28 March 2018 (read live 2026-10-05) | state-routing | nsw-leak |
| gas-leak-response | nt-leak | NT | C | â€” | â€” | NT WorkSafe | read live 2026-10-05 | state-routing | qld-leak |
| gas-leak-response | act-leak-absent | ACT | C | â€” | â€” | ACT | read live 2026-10-05 | state-routing | â€” |
| gas-installation-and-servicing | vic-service-interval | VIC | C | gas water heaters, space heaters and central heaters | 2 years | Energy Safe Victoria and the Building and Plumbing Commission | read live 2026-10-05 | state-routing | nsw-wh-service-interval, wa-service-interval |
| gas-installation-and-servicing | nsw-wh-service-interval | NSW | C | gas water heater (indoor or outdoor) ONLY | 1 years | NSW Government (Building Commission NSW / NSW Fair Trading) | read live 2026-10-05 | state-routing | vic-service-interval |
| gas-installation-and-servicing | wa-service-interval | WA | C | gas appliances; annual if the equipment is more than 10 years old | or annually when over 10 years old | Building and Energy, Government of Western Australia | 18 June 2025 (read live 2026-10-05) | state-routing | vic-service-interval, nsw-wh-service-interval |
| gas-installation-and-servicing | qld-service-interval-absent | QLD | C | gas appliances | â€” | QLD | read live 2026-10-05 | state-routing | â€” |
| gas-installation-and-servicing | sa-service-interval-absent | SA | C | gas appliances | â€” | SA | read live 2026-10-05 | state-routing | â€” |
| gas-installation-and-servicing | tas-service-interval-absent | TAS | C | gas appliances | â€” | TAS | read live 2026-10-05 | state-routing | â€” |
| gas-installation-and-servicing | act-service-interval-absent | ACT | C | gas appliances | â€” | ACT | read live 2026-10-05 | state-routing | â€” |
| gas-installation-and-servicing | nt-service-interval-absent | NT | C | gas appliances | â€” | NT | read live 2026-10-05 | state-routing | â€” |
| gas-installation-and-servicing | wa-adaptor-ban | WA | B | â€” | â€” | Building and Energy (WA) | 2 April 2026 (read live 2026-10-05) | state-label | â€” |
| gas-installation-and-servicing | ins-no-diy-vic | VIC | B | â€” | â€” | Energy Safe Victoria | read live 2026-10-05 | state-label | â€” |
| gas-installation-and-servicing | ins-no-diy-sa | SA | B | â€” | â€” | SA.GOV.AU | read live 2026-10-05 | state-label | â€” |
| gas-installation-and-servicing | ins-no-diy-wa | WA | B | â€” | â€” | Building and Energy (WA) | updated 2 April 2026 (read live 2026-10-05) | state-label | â€” |

## 5. Reclassification under the tightened Category-A rule

Rule (locked): AU-common only with **(A)** a valid national source, or **(B)** â‰¥ 4 independent jurisdictions, no contradiction, no state-specific limitation. Numeric, contradicted or state-limited â†’ C. Otherwise protective-but-under-evidenced â†’ B (labelled, not served). Evidence counted = jurisdictions *recorded* in the Stage 9.62 sentence sources; an unrecorded jurisdiction is not evidence.

**Claims whose category changed (A served â†’ B, not served): 15**

| Block | Claim | Recorded jurisdictions | Count |
|---|---|---|---|
| general | gen-intended-use (intended purpose, manufacturer, cooker is not a heater) | VIC, TAS | 2 |
| general | gen-outdoor-appliances (not indoors) | VIC, TAS, ACT | 3 |
| general | gen-combustibles | VIC, QLD | 2 |
| general | gen-flame-signs | VIC, QLD, WA | 3 |
| general | gen-no-tampering | VIC, SA, WA | 3 |
| unflued | unf-combustion-products | TAS, VIC, WA | 3 |
| unflued | unf-overnight | VIC, NSW | 2 |
| unflued | unf-flame-signs | VIC, WA, QLD | 3 |
| cylinder | cyl-test-date | NSW, QLD, SA | 3 |
| cylinder | cyl-no-tampering | QLD, SA, WA | 3 |
| cylinder | cyl-appliance-hose | SA, QLD, ACT | 3 |
| cylinder | cyl-soapy-water | QLD, ACT | 2 |
| cylinder | cyl-valve-off | SA, QLD, ACT | 3 |
| cylinder | cyl-closed-vehicle | NSW, ACT | 2 |
| installation | ins-no-diy | VIC, SA, WA | 3 |

Also removed: the old unflued fourth paragraph ("serviced regularlyâ€¦") â€” it duplicated the installation block's servicing paragraph, which is itself category A.

**Claims that stay category A (served): 7** â€” gen-ventilation (VIC, TAS, WA, ACT = 4), gen-rules-differ (all 8; a limitation disclosure), cyl-upright (QLD, SA, WA, ACT = 4), cyl-cool (4), ins-licensed (all 8), ins-certificate (NSW, TAS, NT, VIC = 4), ins-servicing (VIC, NSW, WA, QLD, TAS = 5; non-numeric "regularly"; NSW's evidence is water heaters only, and without NSW it is still 4).

**Honest consequences for the owner to weigh.** The AU core is now thin: general = ventilation + "rules differ"; cylinder = upright + cool; installation = licensed gasfitter + certificate + servicing; unflued = nothing. Several of the demoted statements are plainly protective ("keep flammables away", "stop using the appliance if the flame changes") and are very likely true everywhere â€” but **the evidence recorded does not prove it for four jurisdictions, so they fail closed**. Re-reading further jurisdictions could promote them (candidates at 3: outdoor appliances, flame signs, no-tampering, unflued x2, test date, hose/regulator, valve-off). That is a research stage, not a drafting one. Two weaker points to be aware of: ins-licensed's list of kinds of work is recorded at paragraph level and was not verified verb-by-verb per jurisdiction; and the existing, previously approved AU carbon-monoxide and indoor-combustion blocks were approved under the earlier regime and were **not** re-audited against this rule.

## 6. Gas release mechanism â€” topic â†’ required block set â†’ all available and approved

`GAS_BLOCK_SET` in `admin-import/pilot/prep.ts`:

| Detected gas teaching | Required set |
|---|---|
| generic gas (`gas-and-lpg`), or a gas fuel finding with no specific topic | `gas-and-lpg-general` |
| unflued / portable heater | general + `unflued-gas-heating` |
| cylinder | general + `gas-cylinder-safety` |
| leak response | general + `gas-leak-response` |
| installation / servicing | general + `gas-installation-and-servicing` |

Every block in the set must be (1) a real block, (2) **carried** by the resource, (3) not a *proposal* for that resource, (4) **not `pendingOwnerApproval` for the market** (new block-level field; all five gas blocks carry `["NZ","AU"]`), and (5) have its **own `marketBody` for the market** (otherwise it fails closed). If any is unavailable: the `GAS_SAFETY_REQUIRED` finding stays, a `GAS_BLOCK_SET_UNSATISFIED` problem is added, and the market is unpublishable. The blanket "general block present â†’ cleared" rule is **removed**. Diesel is never released. The per-market result is recorded in the prep report (`safety.gas`).

Because the five blocks are pending, **nothing can be released today** â€” a resource carrying them still fails closed in both markets (tested).

## 7. AU leak response and AU unflued heating

Both **FAIL CLOSED** in Australia: no shared body, `{{safety.notVerifiedForMarket}}`, tested to stay unavailable even when carried and approved. State leak procedures stay unserved until state routing exists. The ACT has no household leak procedure on any readable page (NOT RELIED UPON).

## 8. OG-B09 and OG-24 (read-only dry runs; neither migrated)

**OG-B09 â€” corrected result.**
- **Teaching signal:** the heating-comparison table row `Flued gas | $1,500â€“$4,000 | Moderate | 80â€“90% | No (gas supply) | Quick heat, no power needed` â€” a gas appliance beside a price and an efficiency band (table-figure teaching). Signals reported: `flued gas $1`.
- **Detection path:** the audit-level source topic `gas-and-lpg` is found on the extracted text (HTML + PDF, â‰¥3 mentions); on the member-facing HTML the topic needs three mentions and finds one, so in the pipeline the requirement arrives through the **own-text fuel check** (`GAS_SAFETY_REQUIRED`: "Flued gas"). Both routes give the same answer.
- **Required gas set: `gas-and-lpg-general` alone.**
- **Installation/servicing: NOT required.** The legacy text has 0 mentions of install, service, ventilation, gasfitter or carbon monoxide. My Stage 9.62 statement that it was "recommended" was my judgement, not a detector result, and is **withdrawn**; carrying it would be an owner choice.
- **Carbon monoxide: NOT required** (0 mentions). The general block already carries its own CO sentences.
- **Leak, unflued, cylinder: NOT required** (0 mentions each; the row says *flued*).
- **Today:** with the general block pending, OG-B09 would fail closed in NZ and AU.
- Other facts for Stage 9.63: 9 price/percentage figures (6 prices, 3 efficiency percentages) fail Bucket C and must be removed or sourced; content flags: programme sequencing/product name (2) and figure-needs-source (3).

**OG-24 â€” audit.**
- **Exact legacy teaching:** a selector row "3. Certifying Plumber / Gasfitter / Drainlayer â€” What they do: Potable water, gas, drainage, and sanitary work. When you need one: Connection to mains, gas appliance install, septic or greywater. How to verify: â€¦", in both the HTML and PDF.
- **Triggers:** `gas-installation-and-servicing` (licensing: "certifying plumber / gasfitter"), `gas-and-lpg` (`gas appliance` + `install`), and the own-text fuel check on "gas appliance".
- **Genuine teaching or contextual mention?** It is **licensing routing**, not instruction on using or maintaining gas appliances â€” but routing a member to a professional is itself gas guidance under the detector's own rule, and it states a legal requirement (gas appliance installation needs a certifying gasfitter). I classify it as **genuine but narrow licensing teaching**, not narrative. It does not teach leaks, cylinders or unflued heaters (tested).
- **Required future set:** `gas-and-lpg-general` + `gas-installation-and-servicing`. Its numeric Bucket C items (120V, 50V, $33,000) are electrical/legal, not gas.

**OG-17:** no gas block required, no teaching signals, no fuel finding â€” negative control holds.

## 9. Annual / recurring interval detection

Now detected as interval claims: `annually`, `annual` (adjective), `yearly` (only as an adverb â€” "estimated yearly generation" is not an interval; a live resource uses that phrase), `once/twice a year`, `every year`, `each year`, `every other year`, `once or twice a year`, `N times a year`, and `every <number> months/years`. Annually / yearly / once-a-year / every-year / each-year are **always claims**, so a sentence cannot dodge the gate by using a verb the interval list does not know ("The tank is flushed every year."). Nothing is registered automatically: an unregistered one still fails as `C_NEEDS_SOURCE` / `UNSOURCED_NUMERIC_CLAIM` (tested). `valid` / `validity` / `expires` were added to the interval-verb list so "valid for twenty years" is caught.

## 10. Spelled numbers â€” decision

**Implemented, narrowly.** A closed list: 1â€“19, the tens, tens+units ("twenty-five"), hundred, thousand, half â€” and every one still needs a unit beside it. Tested: *twenty years*, *fifteen metres*, *fourteen days*, *twenty-five metres*. **Not read, and recorded** (`SPELLED_NUMBER_LIMITS`, tested): vague quantities such as "a couple of years", "a dozen", "several", "a few", "a decade". This is not a natural-language parser. A claim worded that way is not caught by this gate and has no other flag to fall back on.

## 11. NZ numeric claims awaiting approval, and registry ownership

| Claim | Figure | Block | Status |
|---|---|---|---|
| `nz-gas-heater-clearance-one-metre-worksafe` | 1 m | unflued-gas-heating | PENDING OWNER APPROVAL |
| `nz-lpg-cabinet-heater-service-12-months-worksafe` | 12 months / annually | unflued-gas-heating; gas-installation-and-servicing | PENDING OWNER APPROVAL |
| `nz-gas-other-heater-service-two-years-worksafe` | 2 years | gas-installation-and-servicing | PENDING OWNER APPROVAL |

Exact NZ wording is unchanged from Stage 9.62. **Proposed transition, on your approval of the NZ wording:** `OWNER-APPROVED`, scope unchanged (NZ only, no broadening). I have not made it.

**Ownership fix.** These claims have `owningResources: []`, which previously meant "any resource". They are now scoped: a block-owned claim validates **only a sentence that actually sits inside its own block**, in its own market; a resource's own sentence saying the same thing is still Bucket C (tested for the 1 m, annual and two-year wording). The 1 m claim carries no required label because its second sentence ("Keep an unflued heater at least one metreâ€¦") has no agency name in the same sentence; block-scoping is the stronger guard.

## 12. Live-library regression

21/21 ready Â· 42/42 market files publishable Â· `verify-prep` passed Â· market problems 0 Â· other findings 0 Â· content flags 0 Â· price findings 0 Â· safety-removal findings 0 Â· **unexpected gas requirements 0** Â· gas set entries 0 Â· Bucket C = 0 Â· `private-assets` 64 files, none modified this session Â· Worker unchanged. **0 member-content changes.**

## 13. Tests

**576 passing** (551 â†’ 576): the five required-set tests, missing CRITICAL block, pending-block, proposal, AU leak, AU unflued, category-A rule (two-state never A; four or national; numeric/contradicted/state-limited never A; every served AU line traces to an A claim; demoted claims kept as B records), annual and every-year detection, spelled numbers and their recorded limit, block-scoped numeric ownership, OG-B09's exact required set, OG-24 understood, OG-17 negative. No test removed; the "3b blind-spot" test now asserts the gap is **closed**, and the fuel-release tests were rewritten for the set mechanism. Lint and typecheck clean.

## 14. Findings for the owner

1. **Latent weakness in a locked validator (not changed).** The numeric scan's "this sentence is inside a safety block" test requires two closing `</div>`s in a row, so it credits everything from the first block to the end of its container to the *first* block's id â€” including resource text after it. Correcting it surfaces a live resource's unsourced figure ("15 minutes every Sunday reviewing what is doneâ€¦"), i.e. it would change live gate behaviour. I left it exactly as it was and used a separate, correct attribution for block-owned claims only. It needs your ruling.
2. **Detector gap closed:** the most natural leak instruction names no appliance, so the leak topic never fired on it. Fixed; a heading that merely names the topic still does not trigger.
3. **OG-B09's "recommended" blocks were withdrawn** (Â§8).
4. The AU core is thin by rule (Â§5); promotion needs more jurisdiction reading.
5. Existing approved AU CO / indoor-combustion wording was not re-audited against the tightened rule.

## 15. Recommendation â€” ready for FINAL OWNER APPROVAL?

**Architecture and mechanism: yes. Wording: not yet final, and nothing should be marked approved.**
- Ready for your decision: the five-block structure, the required-set mechanism, the NZ wording (unchanged), the tightened AU core, AU leak + unflued failing closed.
- Needs your ruling first: finding 1 (the block-span weakness); whether the thin AU core is acceptable or you want a research stage to read the remaining jurisdictions; and whether to keep `ins-licensed`'s list of kinds of work.

## 16. Proposed Stage 9.63 (only after your approval of the wording)

**OG-B09 claims-first migration, no deploy:** (a) remove the 6 legacy table prices and 3 efficiency percentages (or source them) and the programme/product-name flags; (b) carry `gas-and-lpg-general` only (approved by you first), plus the existing solid-fuel block for the wood-burner row; (c) keep AU wording non-numeric; (d) confirm no leak/unflued/cylinder block is needed; (e) metadata and readiness. OG-24 afterwards, with general + installation/servicing. Optional separate stage: AU evidence round to promote category-B claims.

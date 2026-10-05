# Stage 9.62 â€” Gas / LPG safety architecture build

**Date:** 6 October 2026 Â· **Model:** Sonnet 5.5 (handover rule applied) Â· **Nothing deployed. OG-B09 not migrated. No low-hazard batch. No live resource copy changed.**

Every block below is BUILT and **PENDING OWNER APPROVAL**. None is carried by a live resource.

## 1. Push confirmation

`f75874d` (Stage 9.61 price gate) was pushed at the start of this stage, before any 9.62 work.

## 2. Final gas block architecture

| Block | Severity | NZ | AU | Notes |
|---|---|---|---|---|
| `gas-and-lpg-general` (A) | HIGH | WorkSafe NZ wording | **non-numeric national core** | `answers: ["gas-and-lpg"]`; 7 dedup variants (indoor-combustion / carbon-monoxide / gas-installation-and-servicing) |
| `unflued-gas-heating` (B) | CRITICAL | full body | minimal | VIC rangehood item stored as unserved override (B) |
| `gas-cylinder-safety` (C) | HIGH | full body | **non-numeric, protective-only core** | no AU interval/distance in served text |
| `gas-leak-response` (D) | CRITICAL | WorkSafe NZ body | **NO BODY â€” FAILS CLOSED** | drafted wording stored, never served |
| `gas-installation-and-servicing` (E) | HIGH | full body | **non-numeric core** | AU intervals are state/appliance-specific overrides only |

The 12 earlier blocks are untouched (tested). No gas block carries a price (price gate green on every body variant).

## 3â€“4. Block bodies (NZ and AU core)

Verbatim from `admin-import/config/safety-blocks.json` (NZ full bodies shown; shorter dedup variants exist where indoor-combustion, carbon-monoxide or gas-installation-and-servicing is also carried, so one point is never said twice).

### gas-and-lpg-general â€” NZ (full body)

**Gas and LPG appliances are safe when they are installed, used and serviced properly.** Use each appliance only for what it is designed for, and follow the manufacturer's instructions. A cooker, griller or barbecue is not a heater.
**Outdoor gas appliances â€” patio heaters, barbecues and camping cookers â€” must never be used indoors.** They do not have the safety systems that shut off the gas when oxygen runs low or carbon monoxide builds up.
Gas appliances that are faulty, badly installed, used in a small space or short of ventilation can produce dangerous levels of carbon monoxide. Keep ventilation inlets clear.
Signs that a gas appliance is not working properly or its flue is blocked: a yellow flame rather than a blue one (unless it is a flame-effect heater designed that way), soot in or around the appliance, or an unusual smell like car exhaust. If you notice any of these, turn it off and contact a licensed gas worker immediately.
If you smell LPG or fumes from an appliance, turn it off â€” and turn off the cylinder â€” straight away, and have it checked by an appliance service agent or a gasfitter.
Turn a gas appliance off completely after use. A control knob that is not fully off can allow "light back", a dangerous fault that releases carbon monoxide.

### gas-and-lpg-general â€” AU

**Gas and LPG appliances are safe when they are installed, used and maintained as intended.** Use each appliance only for its intended purpose and follow the manufacturer's instructions. A gas cooker or oven is not a heater.
Appliances made for outdoor use â€” such as barbecues, patio heaters and camping stoves â€” are for outdoor use only. Do not bring them inside a home, caravan, car or tent.
Gas appliances that are faulty, poorly maintained or short of fresh air can produce carbon monoxide. Keep permanent ventilation clear, and never use a gas appliance in an unventilated space.
Keep clothing, paper and anything else that can burn well away from gas appliances.
If an appliance's flame changes, soot appears, or it will not light properly, stop using it and call a licensed gasfitter.
Never tamper with safety valves or fittings, and never try to repair a gas appliance yourself.
Gas safety rules â€” including how often an appliance must be serviced â€” differ between states and territories, so check with your state or territory's energy safety regulator.

### unflued-gas-heating â€” NZ (full body)

**Unflued gas heaters need special care.** An unflued heater â€” including an LPG cabinet heater â€” has no flue or chimney. It draws the air it needs from the room and releases its combustion products straight back into it. A flued heater carries them outside.
Do not use an unflued gas heater in a bedroom, a bathroom or any small or confined room, or in a caravan or tent. Never use one in the room where you sleep.
While it is on, keep internal doors and at least one window open, and check that room vents are not blocked.
Unflued gas heaters release nitrogen dioxide and carbon monoxide, and they release water vapour that can feed mould and dust mites. People with asthma are particularly affected by nitrogen dioxide.
Use it for as short a time as you can, follow the manufacturer's instructions, and do not carry out maintenance on it yourself.
WorkSafe New Zealand's 'Heater Metre Rule' is to keep at least one metre from any heat source. Keep an unflued heater at least one metre from anything that could catch fire â€” curtains, clothes, furniture and rugs â€” never dry clothing on it, and use a fireguard around it if there are children.
WorkSafe New Zealand advises that an LPG cabinet heater should be serviced every 12 months by a service agent or gasfitter, before winter.
LPG cabinet heaters are not recommended in homes where someone has a respiratory condition.
If you are choosing a heater, Health New Zealand points to options that do not release pollutants into the room: flued gas heating, central heating, an electric heater or a reverse cycle air conditioner.

### unflued-gas-heating â€” AU

**An unflued or portable gas heater releases its combustion products into the room it heats.** Check that the manufacturer's instructions allow indoor use, never use one in an unventilated space, and keep the room's ventilation clear.
Do not leave a gas heater on overnight or while you sleep.
If a gas heater's flame changes colour, soot appears or it is not working normally, stop using it and have a licensed gasfitter inspect it and check it for carbon monoxide.
Have a gas heater serviced regularly by a licensed gasfitter, at the interval the manufacturer and your state or territory's energy safety regulator give.

### gas-cylinder-safety â€” NZ (full body)

**LPG cylinders hold gas under pressure, so handle them with care.** To stop the gas flow from an LPG cylinder, close the valve on top of it. If more than one cylinder is connected, close every valve.
After you fill or change a cylinder on a portable LPG heater such as a cabinet heater, test the connections for leaks. Spread soapy water on the cylinder connections and turn the cylinder valve on. If bubbles appear there is a leak: close the valve and contact your LPG service agent.
When you carry LPG cylinders in a vehicle: they should be in good condition; secured upright, to stop liquid leaking â€” which is even more dangerous than a gas leak; with every control valve protected from damage; not connected to any appliance; and with no smoking. Never leave a cylinder unattended in a vehicle, particularly in hot weather.
Store a portable LPG appliance that you only use in some seasons, such as a cabinet heater or a barbecue, under cover, so debris, insects or spiders cannot get into the area around the burner.

### gas-cylinder-safety â€” AU

**LPG cylinders hold gas under pressure.** Keep a cylinder upright â€” when you store it and when you carry it â€” and make sure it is secured when you carry it.
Keep cylinders cool and away from heat, flames and sparks.
Check the test date stamped on a cylinder. Do not use or refill a cylinder that is out of test date or that is damaged or corroded. How long a test date lasts is set by your state or territory.
Never tamper with a cylinder valve or force it, and do not try to repair or remove a cylinder valve yourself.
Use an LPG cylinder only with an appliance made for LPG, and only with a certified regulator and hose made for it. Check hoses and seals for damage.
Check the connections for leaks with soapy water or detergent and water. If bubbles appear there is a leak: turn the gas off, do not use the appliance, and call a licensed gasfitter.
Turn the cylinder valve off before you disconnect a cylinder.
Do not leave or carry LPG cylinders loose in a closed vehicle, even when they seem empty.

### gas-leak-response â€” NZ (full body)

**If you smell gas inside your home:** keep flames and cigarettes out of the room and away from the area. **Never operate any electrical switch** â€” switching one on or off could cause a spark. Do not use your mobile phone in the area. If you can do it safely, turn off the valves to gas appliances, then turn off the gas at the meter or at the LPG cylinder. Open doors and windows to ventilate the area. If the smell persists, go outside to a safe place away from the building.
**If you smell gas outside:** keep flames, cigarettes, vehicles and electrical equipment â€” including mobile phones â€” away from the area. Turn off the gas at the meter or at the LPG cylinder, and leave the area.
In an emergency call 111. If there is a problem with your gas supply, contact your gas retailer â€” the company that sends your gas bills â€” immediately. If there is a problem with your gas installation or appliances, contact a licensed gas worker immediately.

### gas-leak-response â€” AU

**NO AU BODY â€” FAILS CLOSED** (`{{safety.notVerifiedForMarket}}`)

**Drafted, NOT served (owner may approve as written):**

**A smell of gas is an emergency.** Do not light or use any flame, do not smoke, and avoid anything else that could ignite gas. Open doors and windows if it is safe to do so. If the smell is strong or does not go away, leave the building. Report it to your gas supplier's emergency number â€” it is on your gas bill â€” or call 000.
**What else to do differs between states and territories â€” in particular whether to switch electrical devices on or off, and whether to turn off power â€” and official advice does not agree, so this resource gives no instruction about it.** Follow your state or territory's gas safety regulator and your gas supplier.

### gas-installation-and-servicing â€” NZ (full body)

**Only a licensed gasfitter may do gas work.** Have any gasfitting â€” pipework, gas appliances and flues, and any addition or alteration â€” done by a currently licensed gasfitter or certifying gasfitter, and ask to see their current practising licence ID card.
Gasfitting done since 1 July 2013 has to be certified. Once the work is connected, the person responsible must issue a Gas Safety Certificate that says the installation is safe to use. Ask for it and keep it.
Owners, landlords and tenants are responsible for the safe operation and maintenance of their gas appliances. Have them checked regularly by an authorised and competent person.
WorkSafe New Zealand advises that flame effect heaters and LPG cabinet heaters should be serviced annually. WorkSafe New Zealand also advises that other space heaters and water heaters should be serviced at least every two years.
Whenever a licensed gas worker is in your home, ask them to check that your gas appliances and installation are safe. Consider replacing old appliances, and avoid buying second-hand ones.
If the gas supply to your property has been interrupted, or an appliance may have been left on, a certifying gasfitter must be involved in turning the gas back on, because the pipes may have filled with air.

### gas-installation-and-servicing â€” AU

**Gas work must be done by a licensed gasfitter** â€” installing, altering, relocating, repairing, servicing or testing gas appliances, pipework and connections, and replacing a gas appliance. Ask to see the licence, and check it with your state or territory's regulator.
After gas work, ask the gasfitter for the compliance certificate, inspection certificate or service record that applies where you live, and keep it.
Have gas appliances serviced regularly by a licensed gasfitter. How often depends on the appliance, the manufacturer's instructions and your state or territory â€” some set an interval and some do not â€” so check your state or territory's energy safety regulator.
Never attempt gas work yourself, and never tamper with safety valves or fittings.

## 5. AU state-override data structure

`SafetyBlock.stateOverrides?: StateOverride[]` (`admin-import/markets/resolve.ts`). Fields: `id, jurisdiction, label, category (A|B|C), topic, appliance?, claim, figure?, source, authority, sourceDate, servedWhen ("state-label"|"state-routing"), conflictsWith?`.

- **A** â€” safe for every Australian member. Lives in the served AU core, not stored as an override. Threshold (owner-reviewable): protective-only, stated by â‰¥2 read jurisdictions, contradicted by none.
- **B** â€” state-labelled informational. Servable only with the agency's name attached (`overrideServable`).
- **C** â€” state-specific. Servable only when the member's state is known and equals the jurisdiction.
- No jurisdiction or no label â†’ never servable.

Nothing resolves overrides into a member file: `resolveForMarket` reads only `marketBody`/`body` (a test proves no override wording reaches any served body).

### Per-claim classification

| Override | State | Cat | Scope | Figure |
|---|---|---|---|---|
| vic-extraction-fans | VIC | B | unflued heating, rangehood/exhaust fan | â€” |
| nsw-cylinder-test | NSW | C | refillable LPG cylinders | 10 or 15 yr |
| qld-cylinder-test | QLD | C | LPG cylinders | 10 yr |
| sa-cylinder-test | SA | C | portable LPG cylinders | 10 yr |
| sa-hose-interval | SA | C | LPG hoses | 5 yr |
| wa-leaking-cylinder-distance | WA | C | leaking cylinder valve | 20 m |
| qld-valve-plug-9kg | QLD | C | POL-valve cylinders â‰¤ 9 kg | 9 kg |
| sa-adaptor-compat | SA | B | adaptors | â€” |
| wa-adaptor-ban | WA | B | adaptors | â€” |
| vic-service-interval | VIC | C | gas water/space/central heaters | 2 yr |
| nsw-wh-service-interval | NSW | C | gas **water heater ONLY** | 1 yr |
| wa-service-interval | WA | C | gas appliances; annual if >10 yr old | 2 yr / annual |
| qld / sa / tas / act / nt service interval | â€” | C | "no interval published" records | â€” |
| vic / sa / wa / nsw / qld / tas / nt / act leak records | â€” | C | leak response (8) | â€” |

NSW â‰  QLD â‰  VIC: no override validates another state's figure (tested).

## 6. Gas leak-response decision

**FAIL CLOSED for AU.** Seven of eight jurisdictions publish a procedure, and they conflict: VIC/QLD say do not operate switches; SA says go outside and switch electricity off at the outdoor meter; WA says leave lights as they are and evacuate only if you consider it necessary; NSW says exit, call 000 and isolate power (its two pages differ); TAS says isolate power at the switchboard; NT puts calling 000 first. **The ACT has no household leak procedure on any readable page.** No universally safe action is supported, so AU has no `marketBody`; it renders `{{safety.notVerifiedForMarket}}` and the resource is not publishable. Limited wording is stored in `draftedNotServed.AU` (gives no electrical instruction; declines to give one) for the owner to approve as written. Eight records carry `conflictsWith` links and are never merged. NZ uses WorkSafe NZ's wording.

## 7. Numeric registry additions (NZ only, 32 claims total, +3)

| Claim | Figure | Label required |
|---|---|---|
| `nz-gas-heater-clearance-one-metre-worksafe` | 1 m | â€” |
| `nz-lpg-cabinet-heater-service-12-months-worksafe` | 12 months / annually | WorkSafe New Zealand |
| `nz-gas-other-heater-service-two-years-worksafe` | 2 years | WorkSafe New Zealand |

Each has `owningBlock`, `owningResources: []`, status "VERIFIED_LIVE 2026-10-05 â€¦ wording pending owner approval". **No AU gas figure is registered**; AU figures stay Bucket C. The "at least every two years" AU wording is **not** restored.

**Test change (reported):** `numeric.test.ts` "records a sourceâ€¦" previously demanded every claim have owning resources and an OWNER-APPROVED status. Block-owned claims (`owningBlock` set) may now be "pending owner approval" **only if** the named block exists and is itself still pending. Resource-owned claims are unchanged. When a block is approved the exception stops applying.

## 8. Trigger rules

Teaching-sensitive detector (Stage 9.57; no bare-word triggering; proximity within one sentence/line):

| Topic | Triggers on |
|---|---|
| `gas-and-lpg` (existing, unchanged) | needs 3 signals, or teaching (appliance+action, fuel+figure, licensing, table rows) |
| `unflued-gas-heating` | unflued, cabinet / patio / portable gas or LPG heaters. **Not** "flued" heaters |
| `gas-cylinder-safety` | LPG/gas/propane/butane cylinders or bottles, LCC27, POL valves, butane cartridges, camping stove/cooker |
| `gas-leak-response` | gas leak, smell of gas, leaking gas, suspected leak |
| `gas-installation-and-servicing` | gasfitter, licensed gas worker, certifying gasfitter, gas fitting, or service/install beside a gas appliance |

`gas supply` alone is not a subject. Fuel listed among options does not trigger.

## 9. Overlap / dedup result

- Composite `marketBodyWhen` keys (`"a+b"`, all must be carried; most specific key wins). Variants generated for every subset of indoor-combustion / carbon-monoxide / gas-installation-and-servicing.
- **Bug found and fixed:** NZ and AU dedup keys differ, so an AU-only key could out-rank a valid NZ key and silently serve the untrimmed NZ body. Entries now compete only for the market being resolved. Tested.
- Guard in `prep.test.ts` now uses `FAILS_CLOSED = {"gas-leak-response": ["AU"]}` so no other block can silently lose a market.

## 10. Existing 21-resource regression

21/21 ready Â· 42/42 verified Â· 0 problems / findings / flags Â· Bucket C 0 Â· 0 price findings Â· 0 safety-removal findings Â· **0 unexpected gas block requirements** Â· 0 member-content changes Â· `verify-prep` passed Â· private-assets 64 files. No live resource carries or requires a gas block.

Sweep of all 45 legacy sources: only **OG-B09** and **OG-24** require any gas block.

## 11. OG-B09 positive control

Triggers `gas-and-lpg` through table-figure teaching (table teaching still triggers). It does **not** require `unflued-gas-heating` (its row says "Flued gas"). **Expected future block set:** `gas-and-lpg-general` (required), `gas-installation-and-servicing` (recommended â€” audit note wants installer/ventilation warnings), `carbon-monoxide`. Not B, C or D.

## 12. OG-17 negative control

No gas block required, no teaching signals, no fuel finding. Unchanged.

## 13. Test count

**551 passing** (512 â†’ 551: +39 in `tests/unit/gas-architecture.test.ts`). 22 files. Nothing removed. The 39 tests cover the blocks, AU non-numeric core, NZ/AU figure separation, leak fail-closed, override categories, detector triggers, dedup, price gate, fuel-check release and the live-library-unchanged check.

## 14. Lint / typecheck

Both clean.

## 15. Worker unchanged

`fa23ec74-85d2-4d91-b484-3f037ccbe38b`, 21 resources. No `wrangler deploy` run; rollback `1922f7ba-â€¦` still held.

## 16. Future AU state-routing note (no implementation)

1. A member **state** field (captured at sign-up, nullable; unknown never receives C).
2. A routing layer that resolves market â†’ AU â†’ state before block resolution.
3. Per-state content/PDF selection; PDFs are built per market today.
4. Serve overrides only through `overrideServable`; B needs the agency label in the sentence.
5. Source gaps first: **ACT leak procedure absent**; QLD/SA/TAS/ACT/NT publish no service interval.
6. Re-read dated sources before use: TAS (2018/2021), VIC leak page (reviewed Jan 2023), SA (July 2023).
7. Leak response (D) must be owner-approved per state, never merged.

## 17. Stage 9.63 recommendation â€” OG-B09 claims-first migration

Claims-first preparation only, no deploy: (a) list claims to remove â€” legacy table **prices** and **efficiency percentages**, any AU figure; (b) required gas blocks: `gas-and-lpg-general` + `carbon-monoxide`, recommend `gas-installation-and-servicing`; (c) AU wording stays non-numeric; (d) market blockers: AU leak response fails closed â€” confirm OG-B09 does not need D; (e) metadata gaps and readiness to be assessed; (f) owner must approve the gas blocks' wording first (all are PENDING).

## Findings flagged for the owner

1. **Numeric detector blind spots (locked, not changed):** does not see "once a year", "every year", "each year", or spelled numbers above twelve ("fifteen", "twenty"). A test records the gap (rewrite when closed); AU gas bodies are asserted clean of those shapes.
2. **New mechanism â€” GAS_SAFETY_REQUIRED release:** once `gas-and-lpg-general` is carried and approved, the own-text fuel check's `GAS_SAFETY_REQUIRED` finding is released (OG-B09's "Flued gas" row would otherwise trip forever). Diesel is never released. Beyond the listed mechanisms, so flagged.
3. **OG-24** also requires gas blocks (Certifying Plumber/Gasfitter row).
4. Composite dedup keys and the bug fix (Â§9).
5. ACT leak-evidence gap (Â§6).
6. Category-A threshold is my design; owner may tighten it.
7. All five blocks are pending owner approval; the numeric-test exception depends on that.

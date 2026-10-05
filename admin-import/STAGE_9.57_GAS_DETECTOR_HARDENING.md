# GAS DETECTOR HARDENING · OG-17 RELEASED BY THE DETECTOR, NOT BY AN EXEMPTION

**Date:** 5 October 2026 · **Stage:** 9.57

**Worker unchanged: `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`** · **20** protected drafts · **40** market files ·
`private-assets/` still 61 files, none written · **all 40 prepared files still verify against the deployed PDFs** ·
Bucket C = 0 · `--real` refused · all resources draft · public/demo unchanged.

**Nothing was deployed. No gas block was built. OG-B09 was not migrated. OG-17 was not migrated.**

**No exemption was created — and none is needed.** The detector now reads what a document does.

---

## 1. Push confirmation for `85b5cf1`

`git push origin main` → `843da0f..85b5cf1  main -> main`. **`origin/main` =
`85b5cf155128876955c4c160e422ba867d3a64d2`**, containing:

- `admin-import/STAGE_9.56_AU_GAS_COMPLETION.md` — the Stage 9.56 report
- **the AU gas correctness fix** — `admin-import/config/safety-blocks.json`, the two corrected sentences plus the
  new sources, verification records and `changeRule`. **This file is the configuration behind the six corrected AU
  PDFs**; the PDFs themselves live in git-ignored `private-assets/` by design, and are reproducible from it
- the Stage 9.56 tests — `tests/unit/gas-wording.test.ts` (new) and the updated assertion in `tests/unit/prep.test.ts`
- the three register updates

## 2. The old detector logic, stated in full

Two independent mechanisms, which **disagreed with each other** on OG-17.

**(a) The topic detector** — `audit/group-a.ts`, run on the audit's extracted text (**PDF and HTML together**):

```ts
{ pattern: /\bgas\b/gi, block: "gas-and-lpg", needs: 3 }
```

Three occurrences of the bare word and the resource required a gas safety block. **No `teaching` condition** — the
water-treatment topic has had one since Stage 9.43, and gas never did.

**(b) The compound fuel check** `GAS_SAFETY_REQUIRED` — `pilot/prep.ts`, run on each resource's **own** text before
safety blocks are injected. Compound-only: `LPG | LP gas | natural gas | biogas | gas-powered | gas-fuelled |
gas-fired | dual-fuel | tri-fuel | unflued | cabinet heater | gas-(heater|heating|appliance|cooker|cooktop|hob|
stove|oven|fire|fireplace|bottle|cylinder|water heater|hot water|barbecue|bbq|lamp|lantern|burner|ring|fridge|
refrigerator)`.

**The false-positive pathway, exactly:** OG-17 is a wood-burner planner. It writes *"Plan your solid fuel system
for when the power goes out and **the gas** stops flowing"* and *"electric heaters stop. **Gas** supplies can be
disrupted."* Read from both the HTML and the PDF, that is **four** bare occurrences. Mechanism (a) demanded a block
that does not exist; mechanism (b) found **nothing**, because the document names no gas compound at all. The
keyword rule was wrong and the compound rule was right, and the keyword rule won.

**The false-negative risks, as they stood:** `patio heater` (named in our own approved `indoor-combustion` block),
`propane`, `butane`, `camping stove`, `gas leak`, `gas meter`, `gas line`, `mains gas`, `reticulated gas`, `flued
gas`, `LCC27`, `POL valve` — every one invisible to (b). And a document teaching entirely in compounds ("refill the
LPG cylinder, check the regulator") scored **zero** against `\bgas\b` and so would never have required the block at
all.

## 3. The new teaching-sensitive logic

The word count stays as a floor; **a teaching condition now decides**, in the shape water treatment has used since
Stage 9.43. Four named pieces, in `audit/group-a.ts`:

| Piece | What it is |
|---|---|
| **`GAS_APPLIANCE`** | the things a document must NAME: gas heater/heating/cooker/cooktop/hob/stove/oven/fire/fireplace/bottle/cylinder/water heater/hot water/barbecue/bbq/lamp/lantern/burner/ring/fridge/refrigerator/appliance/meter/line/leak/fitting, (un)flued gas, cabinet heater, patio heater, camping stove or cooker, gasfitter, unflued, dual-fuel |
| **`GAS_FUEL`** | LPG, LP gas, natural gas, mains gas, reticulated gas, biogas, propane, butane — held to a **stricter** test (below) |
| **`GAS_ACTION`** | use, operate, install, connect, disconnect, service, inspect, repair, ventilate, store, place, shut off, turn off, leak, test, replace, maintain, maintenance, check, clean, refill, transport, handle, secure, vent |
| **`GAS_FIGURE`** | a price, a percentage, a kW/MJ/kPa/kg/mm/cm/metre/litre value, or an "every N years/months" interval |

**A document teaches gas when:** an appliance appears **within 80 characters of an action**, in either direction; or
an appliance appears **within 60 characters of a figure**; or a **fuel** appears within 60 characters of **gas
equipment or a gas-specific action**; or it names a **licensed, certifying, qualified or registered gasfitter**.

**Three design decisions worth stating, because each one came from a resource that would otherwise have broken:**

- **`gas supply` is deliberately not a subject.** A sentence about mains gas failing in an outage is a narrative
  premise. It is the exact phrase that trapped OG-17, and admitting it would undo the whole stage.
- **Fuels are stricter than appliances.** Naming a fuel among options is how every planning document lists
  alternatives — OG-B12 writes *"generator fuel reserve (diesel/petrol/LPG)"* and *"Firewood, LPG, or diesel"*.
  A fuel only counts beside **gas equipment** (cylinder, bottle, regulator, hose, valve, fitting, appliance, heater,
  cooker) or a gas-specific action (refill, connect, disconnect, leak, ventilate, service, install). Without this,
  **OG-B12 — which is live — would have newly required a gas block it cannot have.**
- **Proximity never crosses a sentence or a line** (`[^.\n]`, never `[\s\S]`). The audit reads text extracted from
  PDFs, where tables flatten into long runs and unrelated rows end up adjacent. An unbounded window let one
  checklist row's verb teach the next row's appliance.

**A bug this found, which is worth recording because it nearly passed:** `plac(e|ing)` matched inside
**fire**place**. A checklist row reading *"Fireplace, wood burner, gas heater"* therefore looked like an
instruction about a gas heater — in **OG-15, which is live**. The mention count happened to save it. Every part of
the rule is now word-anchored, which is what should have been saving it.

`fuelTeachingSignals(text)` is exported alongside `treatmentTeachingSignals` and `fireTeachingSignals`, so any
future gas exemption can be held to the same test the detector uses and lapse automatically.

## 4. Compound-term coverage

Every term the brief listed, in both mechanisms:

| Term | Topic detector | Fuel check |
|---|---|---|
| gas heater · LPG heater · unflued gas heater | ✅ | ✅ |
| gas cooker · gas cooktop · gas water heater | ✅ | ✅ |
| LPG cylinder · gas bottle | ✅ | ✅ |
| propane · butane | ✅ | ✅ **new** |
| camping stove | ✅ **new** | ✅ **new** |
| patio heater | ✅ **new** | ✅ **new** |
| gas leak · gas meter | ✅ **new** | ✅ **new** |
| gasfitter | ✅ **new** | ❌ **deliberately not** |
| dual-fuel · biogas | ✅ | ✅ |
| **gas supply** | ❌ **deliberately not** | ❌ **deliberately not** |

Also added to the fuel check: mains gas, reticulated gas, (un)flued gas, gas line, gas fitting, LCC27, POL valve.

**Why `gasfitter` is a teaching signal but not a blocker.** Telling a member to use a licensed gasfitter is the one
piece of gas wording that is already approved, universal across New Zealand and all eight Australian jurisdictions,
and **printed in the general disclaimer on all 20 live resources**. Blocking on it would make the library's own
standing safety sentence a blocker. In the topic detector it means something different and useful: a document that
routes a member to a gasfitter is giving gas guidance.

**Why a bare `cylinder`, `bottle` or `regulator` stays out of both:** OG-10 and OG-B08 are full of water tanks and
OG-18/OG-19 of electrical regulators.

## 5. Table-shaped teaching coverage

Stage 9.56 named this the likely false negative and OG-B09 is the live example. Its heating comparison row is:

> `Flued gas | $1,500–$4,000 | Moderate | 80–90% | No (gas supply) | Quick heat, no power needed`

**There is no verb in that row.** The `GAS_FIGURE` branch is what catches it: an appliance named within 60
characters of a price or an efficiency band is a comparison, and comparing is teaching. Confirmed on the real
extracted text — OG-B09 still requires the gas block, with the matched signal
`"$2,000–$5,000 low 65–85% yes backup + ambiance flued gas"`.

**A bare number is deliberately not a figure**, which is what keeps OG-15's scorecard row (which ends in a score)
and OG-26's budget row (empty `$ $ $` placeholders, no digits) out.

**The honest limit:** the signal needs the appliance and the figure in the same flattened row. A table whose
appliance column and price column are separated by a page break in the extracted text would still be missed. I have
not found such a case in the 45, but I have not proved there isn't one.

## 6. OG-17 re-audit

**All four gas mentions — which is two sentences, read once from the HTML and once from the PDF:**

| # | Mention | Classification |
|---|---|---|
| 1 | "Plan your solid fuel system for when the power goes out and **the gas** stops flowing." (cover subtitle) | **narrative** — mains gas as an example of a supply that fails |
| 2 | "When the grid fails in winter, electric heaters stop. **Gas** supplies can be disrupted." (intro) | **narrative** — the same point, in the body |
| 3 | mention 1 again, from the PDF extraction | **narrative** (duplicate) |
| 4 | mention 2 again, from the PDF extraction | **narrative** (duplicate) |

| Check | Result |
|---|---|
| `fuelTeachingSignals` | **none** — zero signals |
| `safetyExposureFor` | **`solid-fuel-heating`, `fire-and-emergency`** — **no `gas-and-lpg`** |
| `GAS_SAFETY_REQUIRED` (fuel check on its own text) | **none** |
| Solid-fuel mentions | **45**, against 2 unique gas mentions |

**Solid-fuel and fire requirements are intact**, which was the thing to be careful about: the point was never to
make OG-17 easier, only to stop asking it for the wrong block.

## 7. Exemption: not created, and not needed

**The improved detector classifies OG-17 correctly, so under your ruling 7 no exemption is created.** The drafted
Stage 9.56 exemption is discarded rather than carried forward. OG-17 now has **no unmet safety requirement**:
`solid-fuel-heating` is approved and live in four resources, and `fire-and-emergency` is answered by
`fire-and-smoke-alarms` through the Stage 9.52 `answers` field.

**This is the better outcome.** An exemption would have recorded "this resource is allowed past a rule"; the fix
records "the rule was wrong". The first needs re-reviewing every time the document changes; the second does not.

## 8. OG-B09 still-trigger proof

| Check | Result |
|---|---|
| `safetyExposureFor` on the real extracted text | **includes `gas-and-lpg`** ✅ |
| `fuelTeachingSignals` | **2 signals**, both the comparison row |
| Mechanism | the `GAS_FIGURE` branch — "Flued gas" within 60 characters of "$1,500–$4,000" and "80–90%" |

**OG-B09 remains blocked pending the gas architecture, which is correct.** It names an appliance class, prices it,
and gives it an efficiency band.

**Sweep across all 45 legacy resources — only one verdict changed:**

```
OG-17: was required -> now NOT required
```

Nothing else moved. OG-B09 and OG-24 still require the block; OG-06, OG-15, OG-16, OG-25, OG-26, OG-28, OG-B02 and
OG-B12 still do not.

## 9. Full-library validation

| Check | Result |
|---|---|
| `import:prep`, 20 resources | **20/20 `READY_AFTER_FINAL_VALIDATION`** |
| Market files | **40** |
| Market problems · gate findings · content flags | **0 · 0 · 0** |
| `import:verify-prep` | **all 40 prepared files verified — against the PDFs already deployed**, which is the proof that no member content changed |
| Numeric scan | **328 candidates · A 171 · B 2 · C_NEEDS_SOURCE 0 · D 111 · E 44** — identical to Stage 9.56 |
| Required-block set, every live resource | **unchanged** — no resource gained or lost a block |
| `private-assets/` | **61 files, none written this stage** |
| Public/demo | untouched |

**No deployed resource lost a required gas block** — none had one, because `gas-and-lpg` has never existed as a
block. **And none gained one**, which was the real risk and is reported in full below.

> **One thing I want to be explicit about, because it was a near miss.** My first version of the rule made
> **OG-B12 — a live, deployed resource — newly require a gas block that does not exist**, which would have made both
> its markets unpublishable. It was triggered by legacy source text ("generator fuel reserve (diesel/petrol/LPG)")
> that **its migrated member-facing file does not contain at all** — I checked, and every gas word in OG-B12's
> prepared files comes from the approved CO, generator and disclaimer blocks.
>
> I tightened the fuel rule rather than report it as a blocker, because the rule was wrong: naming a fuel among
> options is not teaching. But it exposes a real architectural quirk that is worth your attention and that I have
> not changed: **`requiredSafety` is computed from the LEGACY SOURCE text, while every other gate runs on the
> MIGRATED output.** A resource can therefore be held for a block because of a sentence that was removed during
> migration. That is a conservative failure direction, which is why I have left it alone — but it is not obvious,
> and it will surprise someone eventually.

## 10. Test count

**456 passing** (441 → **+15**), lint clean, typecheck clean. One new file, `tests/unit/gas-detector.test.ts`:

| # | Test | Result |
|---|---|---|
| 1 | a supply-disruption narrative does not trigger | ✅ |
| 2 | repeating the narrative does not trigger — the count is not the test | ✅ |
| 3 | a gas heater instruction triggers | ✅ |
| 4 | an LPG cylinder instruction triggers | ✅ |
| 5 | gas leak guidance triggers | ✅ |
| 6 | servicing and gasfitter advice triggers | ✅ |
| 7 | table-shaped teaching is recognised, with no instruction verb anywhere | ✅ |
| 8 | a patio heater triggers, in both mechanisms | ✅ |
| 9 | propane, butane and camping stoves trigger, in both mechanisms | ✅ |
| 10 | "gas supply" on its own is never enough | ✅ |
| 10b | a fuel listed among options is not teaching (the OG-B12 case) | ✅ |
| 10c | "fireplace" is not read as an instruction about a gas heater (the OG-15 case) | ✅ |
| 11 | OG-17 requires no gas block, and keeps solid-fuel and fire | ✅ |
| 12 | OG-B09 still requires a gas block | ✅ |
| 13 | no live resource trips the widened fuel check | ✅ |

Test 13 reads **prep's own report** rather than re-running the check on finished files, because the fuel check runs
on a resource's own text *before* blocks are injected — run afterwards it fires on the approved blocks' own wording,
which is precisely why prep checks before. Writing it the naive way is what caught the `gasfitter` problem in §4.

## 11. Worker unchanged confirmation

**`1922f7ba-a0b3-4a7b-ba01-593b3df6a160` — unchanged.** No deployment was performed or needed: this stage changes
what preparation *requires*, not what the preview *serves*. All 40 prepared files still verify against the PDFs
already deployed, `private-assets/` holds the same 61 files, and all 20 resources remain draft behind Cloudflare
Access. The corrected AU gas wording from Stage 9.56 is untouched, and so is every NZ file.

## 12. OG-17 migration readiness

| Field | Value |
|---|---|
| **Source** | `OG-17_Solid_Fuel_Heating_Planner.html` (14 KB) + PDF |
| **Title** | **Solid Fuel Heating Planner** |
| **resourceType** | **planner** (audit inference) — OWNER-REVIEW REQUIRED |
| **foundation** | **shelter** — audit confidence **MEDIUM** ("text mentions shelter 1×"), so **OWNER-REVIEW REQUIRED**. Heating sits in shelter today (OG-15, OG-21, OG-27) |
| **category** | **OWNER DECISION** — `heating` is where OG-15 sits |
| **difficulty** | **not inferable** — OWNER DECISION |
| **estimatedTime** | **not inferable** — OWNER DECISION |
| **Proposed id / slug** | `res-1017` / `solid-fuel-heating-planner` |
| **Required safety blocks** | **`solid-fuel-heating`** and **`fire-and-emergency`** — both available (the latter answered by `fire-and-smoke-alarms`). `carbon-monoxide` is not detector-required but the document has a CO row, so it should be carried deliberately |
| **Gas** | **No longer a blocker.** No gas requirement, no teaching signal, no fuel finding |

**Remaining unsupported claims — this is where the work actually is:**

| Claim | Verdict |
|---|---|
| **"Replace unit if over 5 years old"** — in the **CO Detector Test** row | **MUST REMOVE.** This is the *same unsourced five-year carbon monoxide alarm lifespan* Stage 9.52 removed from OG-13, because **no source in either market publishes one**. Stage 9.56 re-confirmed it: the only lifespan statement anywhere is Victoria's "around 2 to 7 years, will vary" |
| **"Solid fuel heating kills more people than grid failures"** | **MUST REMOVE** — an unsourced epidemiological comparison, the same shape as OG-13's "more hospitalisations than power outages" |
| **Ten prices** — $0, $500–$1,500, $2,000–$5,000, $3,000–$6,000, $2,500–$4,500, $5,000–$15,000, $80–$120/m³, $15–$25/bag, $300–$500/tonne, $5–$15/box | **MUST REMOVE** — standing rule, every migration |
| **Six efficiency percentages** — 10–15%, 30–50%, 65–85%, 80–90%, 70–80%, 60–70% | **VERIFY or REMOVE.** Unsourced appliance efficiency claims. Percentage is currently held out of numeric blocking, so **the gate will not stop these** — they need a human decision |
| **"The 3-Metre Rule"** and "6–8 cubic metres of firewood" (fuel storage) | **VERIFY or REMOVE** — no source read publishes either |
| **"Accessible within 3 metres of the burner"** (fire extinguisher) | **VERIFY** — no approved source gives this |
| **"Remove combustible materials within 1 metre"** | **likely KEEP** — the approved `solid-fuel-heating` block already carries FENZ's one-metre rule, so this would become block-sourced |
| **"Book a professional sweep every 12 months"** | **likely KEEP** — the approved block says "Have your chimney flue cleaned every year" |
| **"Every installation needs a building consent"** | **RESEARCH** — consents are an open research stage |

**Numeric findings against the raw source: 21 Bucket C candidates in each market** (12 currency, 6 percentage, 2
interval, 3 distance — some shared). Several would resolve once the approved solid-fuel block is injected; the
prices and efficiency percentages would not.

**Honest readiness verdict: OG-17 is unblocked on gas and blocked on claims.** It is a normal claims-first
migration — closer to OG-13's than to a research problem — but it is **not a quick one**: ten prices, six
percentages, a removed CO lifespan, an epidemiological claim, and a building-consent sentence that touches an
unfinished research stage.

## 13. Recommendation for Stage 9.58

**Migrate OG-17, claims-first.** The gas blocker is gone, both its required blocks exist, and the remaining work is
the kind this project has done eight times. The stage would: remove the ten prices and the CO five-year lifespan;
rule on the six efficiency percentages (I would remove them — they are manufacturer claims we cannot source);
decide the 3-metre rule, the 3-metre extinguisher line and the 6–8 cubic metres; carry `solid-fuel-heating`,
`fire-and-smoke-alarms` and `carbon-monoxide`; and settle the consent sentence, which may need to point at the
council rather than assert a rule.

**Two things to decide before it starts**, both metadata: OG-17's **foundation** is only a MEDIUM audit inference,
and its **difficulty and estimated time** are not inferable at all.

**Then Stage 9.59: draft gas blocks A–E** on the Stage 9.56 architecture — a non-numeric Australian core plus
labelled state overrides, **no shared Australian leak sentence** — and OG-B09 after that.

**One thing I would raise separately, not bundle:** the `requiredSafety`-from-source quirk in §9. It is a
conservative failure and nothing is broken today, but a resource can be held for a block because of a sentence
that migration removed. Worth a small stage of its own rather than a line in a migration.

**Stopped.** No gas block built, OG-B09 not migrated, OG-17 not migrated, no member content deployed.

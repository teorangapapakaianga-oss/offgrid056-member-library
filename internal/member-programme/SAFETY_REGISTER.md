# Safety register

The approved safety wording, how the markets differ, what fails closed, and what still needs research.

**As at:** 23 September 2026. Config: `admin-import/config/safety-blocks.json`, `admin-import/config/metadata-review.json`.

---

## Approved safety blocks (8)

Every one is owner-approved for **NZ and AU separately**, with each market's own sources. A block with no wording for
a market fails closed there: the shared body is `{{safety.notVerifiedForMarket}}`.

| Block | Title | Severity | Approved | Used by |
|---|---|---|---|---|
| `general-disclaimer` | Before you start | standard | all | every resource |
| `emergency-contact` | In an emergency | critical | all | every resource |
| `batteries-and-electrical` | Batteries and electrical safety | **critical** | 22 Sep 2026 | OG-18, OG-19, OG-20, OG-21, OG-26, OG-27, OG-B07, OG-B12 |
| `carbon-monoxide` | Carbon monoxide | **critical** | 22 Sep 2026 | OG-15, OG-20, OG-26, OG-27, OG-B12 |
| `indoor-combustion` | Never bring it inside | **critical** | 22 Sep 2026 | OG-15, OG-26, OG-27 |
| `working-at-height` | Stay off the roof | **critical** | 22 Sep 2026 | OG-18, OG-B07 (+ OG-10 proposed) |
| `solid-fuel-heating` | Wood burners and open fires | high | 22 Sep 2026 | OG-15, OG-21, OG-26, OG-B12 |
| `stored-drinking-water` | Storing drinking water | high | 22 Sep 2026 | OG-08, OG-26, OG-B12 (+ OG-10 proposed) |
| `food-safety-power-cut` | Food safety in a power cut | high | 22 Sep 2026 | OG-11, OG-19 |
| `generator-safety` | Using a generator safely | **critical** | 22 Sep 2026 (Stage 9.34) | OG-20, OG-B12 |

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
| Drinking water | **3 L per person per day for 3 days**; bleach method (5 drops/L); check every 6 months | **10 L per person for 3 days**; boil 1 minute; check twice a year; **no bleach ratio published** |
| Food in a power cut | Get Ready order, MPI doors/refreeze/discard — **no timings, MPI publishes none** | NSW Food Authority: about 4 hours fridge, at least 24 hours freezer, eskies, 2-hour cooking rule |
| Consents / approvals | building consent, "consents", council | permits or approvals; varies by state and territory |
| Rainfall / weather data | regional council, NIWA | Bureau of Meteorology |

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
| **Unapproved trim** | a scoped trim that is still a proposal holds the resource at preview | `prep.ts` |
| **`--real`** | refused | `admin-import/cli.mts` |

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

**Block-level trimming** (not resource-specific, but narrow): where the generator block is present, the electrical
block drops its generator paragraph, so one point is not made twice. Every other resource keeps the full electrical
block.

## Pending safety research

Each of these blocks resources until it is researched from official NZ **and** AU sources and approved.

| Research | Needed for | Notes |
|---|---|---|
| **Gas / LPG** | OG-17, OG-B09, any gas appliance or LPG generator | the strict gas rule stands. No NZ/AU household gas-appliance block exists. |
| **Diesel** | diesel generators or heating | the generator block is petrol-only |
| **Water treatment** | OG-09, and any treatment detail | beyond the approved storage block: filters, UV, chlorine dosing, boiling |
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

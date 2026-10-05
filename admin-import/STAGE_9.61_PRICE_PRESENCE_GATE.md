# PRICE / CURRENCY PRESENCE GATE · BUILT AND GREEN (NOTHING DEPLOYED)

**Date:** 6 October 2026 · **Stage:** 9.61

**Worker unchanged: `fa23ec74-85d2-4d91-b484-3f037ccbe38b`** · **21** protected drafts · **42** market files ·
`private-assets/` still **64 files, none written** · all 42 prepared files still verify against the deployed PDFs ·
Bucket C = 0 · `--real` refused · all resources draft · public/demo unchanged.

**Validation architecture only. No deployment was performed and none was needed.**

---

## 1. Push confirmation

`git push origin main` → `b572896..d7da471  main -> main`. **`origin/main` =
`d7da4711923760bc5397409a7e6726fefbec19c5`**, containing `admin-import/STAGE_9.60_OG17_DEPLOYED.md`, OG-17's
deployment state (`metadata-review.json` — the four owner-approved `…Basis` fields and the gas ruling), the Stage
9.60 tests (`og17-claims.test.ts` +35), and the four register updates. **`git ls-files` matching `private-assets`
or `*.private.json` returns 0.**

## 2. Price detector architecture

`admin-import/audit/price.ts`. Two passes over the resource's **own** member-facing text, taken **before safety
blocks are injected**, per the Stage 9.58 ruling. No approved block carries a price today; if one ever does, that
block owns it and the resource is not asked to dispose of it.

**Pass 1 — text.** Three patterns, each requiring an **amount**:

| Pattern | Covers |
|---|---|
| `(NZ\|AU\|US\|CA)?$` + amount, optionally a range | `$50`, `$1,500`, `NZ$120`, `AU$ 40`, `$1.5k`, `$1,500–$4,000`, `$25/month`, `$120 per cubic metre` |
| `NZD\|AUD\|USD\|CAD` + amount | `AUD 250`, `NZD 100` |
| amount + `dollars` | `2,000 dollars` |

Qualifiers — *from*, *under*, *over*, *approximately*, *about*, *up to* — need no rule of their own: the price
inside them is what matches.

**Pass 2 — tables**, which is how a comparison carries its prices and how OG-17 and OG-B09 both carry theirs. A
header matching `cost·price·pricing·budget·fee·per unit·$` marks a column; each body cell in that column with a
digit in it is a price, **even with no currency symbol at all**. A `Cost` column whose cells are empty is a
placeholder, not a claim.

**What it refuses to fire on, and why each one is there:**

| Not a price | Why it matters |
|---|---|
| **A currency symbol with no amount** — `$`, `$ $ $`, `$___` | OG-26's budget tiers and OG-17's worksheet cost line. **Firing here blocks two live resources on day one.** |
| **A row whose cell count differs from the header's** | a colspan means the column index no longer means what it says — see §6 |
| **A percentage in a cost column** | a share of a budget, not an amount |
| **A date** — `from 1 January 2027` | Queensland's alarm deadline. I made exactly this mistake in Stage 9.60's checker by making the `$` optional |
| **A standard's number** — `AS/NZS 5601`, `UL2034`, `EN50291`, `ANSI/NSF 53` | |
| **A resource or route id** — `OG-13`, `res-1017` | |
| **A helpline or emergency number** — `13 11 26`, `0800 611 116`, `1300 066 055`, `1802 111`, `111`, `000` | |
| **A `Cost` heading with no numeric value**, a formula, a member's own blank | |

**Fail-closed.** The gate always runs; it has no mode switch and no off position. A **missing or empty** disposition
list approves **nothing**, so every detected price blocks. "The config was not there" is not a pass condition, and a
test asserts it with no records at all and with the argument omitted entirely.

**Wired in beside the fuel, treatment and numeric checks** in `prepareResource`, per market, feeding both
`otherFindings` and the market's `problems`.

> **A wiring bug I shipped into my own first run and then caught.** I added the findings to `otherFindings` but not
> to the market's `problems`, so readiness failed while **both markets still reported `publishable: true`**. A gate
> that blocks the report but not the deployment path is worse than no gate, because it looks like it is working.
> It was caught by my own Stage 9.59 test flipping — see §9 — and the fix is one line, now covered by a test that
> asserts both markets become unpublishable.

## 3. Disposition model

Every price in the member-facing output needs one record, in `metadata-review.json` under
`priceDispositions`. **No disposition → `UNDISPOSED_PRICE` → preparation fails.** A price is never approved because
it was in the legacy content.

| Disposition | When | Required fields | Enforced by |
|---|---|---|---|
| **`REMOVE`** | the price should not appear | `price`, `reason` | **fails if the price is still in the output** — `PRICE_MARKED_REMOVED_BUT_PRESENT` |
| **`CURRENT-SOURCE-REQUIRED`** | a live price genuinely matters | `source`, `authority`, `dateChecked`, `scope`, `freshness` (+ `limitations`) | `INCOMPLETE_PRICE_SOURCE` names the missing fields |
| **`OWNER-APPROVED-LIVE-PRICE`** | a price OffGrid056 itself controls — a membership, product or service fee | `approvedBy`, `approvedOn`, `owningProduct` | `INCOMPLETE_OWNER_PRICE` |

**Markets are scoped, not shared.** A record with `markets: ["NZ"]` satisfies the NZ file and leaves the AU file
blocked. Omitting `markets` covers both — an explicit choice, not a default anyone can fall into by accident.
**No currency is converted and no equivalence is inferred:** an approved `NZ$120` does not validate `AU$120`, and a
test proves it.

**No freshness system was built.** `CURRENT-SOURCE-REQUIRED` records what would have to be true; nothing refreshes
or re-checks. The guidance in the gate's own error text is that a price which cannot be kept current should be
`REMOVE` instead.

## 4. Legacy versus migrated

Two separate ideas, exactly as the safety architecture separates them.

- **`prices.legacyOnly`** — prices the legacy source carried that the migrated text does not. **Evidence. Never
  blocking.** It is how a removal is visible rather than invisible.
- **`prices.inOutput`** — prices in the member-facing text. **These alone decide the blocking result.**

A legacy price that *survived* migration is not legacy-only: it is an output price and it blocks. Both directions
are tested.

## 5. Live-library scan result

**42 files, 21 resources. Zero blocking findings.**

| | Count |
|---|---|
| Total candidates | **12** |
| **True prices** | **0** |
| Placeholders (correctly ignored) | **12** |
| Non-price matches (dates, standards, ids, helplines) | **0 — none even reached classification** |
| Disposed prices | **0** (none needed one) |
| **Blocked prices** | **0** ✅ |

The twelve placeholders: **OG-20** (3 per market — a cost column with no amount in the cell), **OG-21** (2 per
market — a currency symbol with no amount), **OG-18** (1 per market). All member-entry blanks. OG-26's and OG-22's
`$` placeholders had already been removed in their own migrations — their own text now contains **no dollar sign at
all**, which I checked rather than assumed.

**The number that makes the case for the gate is the other one:**

| Resource | Legacy prices removed in migration |
|---|---|
| **OG-17** | **15** — `$0 (existing)`, `$500–$1,500`, `$2,000–$5,000`, `$3,000–$6,000`, `$2,500–$4,500`, `$5,000–$15,000`, `$80–$120/m³`, `$15–$25/bag`, `$300–$500/tonne`, `$5–$15/box` and their duplicates |
| **OG-09** | **13** — `$30–$100`, `$20–$80`, `$80–$300`, `$200–$800`, `$100–$400`, `$5` … |
| **OG-18** | **10** — `$1,800–$2,500/kW`, `$1,000–$2,500`, `$500–$1,000`, `$500–$1,500`, `$300–$800` … |
| **OG-20** | **5** — `$3,000–$15,000`, `$5,000–$25,000`, `$800–$4,000`, `$10,000–$30,000` … |
| **OG-13** | **5** — `$50`, `$15–$30`, `$10–$20`, `$40–$80`, `$5` |
| **OG-19** | **4** — `$800–$1,200`, `$400–$600`, `$1,100–$1,400`, `$1,000–$1,500` |
| **OG-26** | **3** — `$3,000`, `$200–$1,000`, `$30,000` |
| **Total** | **55 across 7 resources** |

I expected fifteen, from OG-13 and OG-17. It is **fifty-five**, across seven migrations, every one removed by a
person reading the document with no gate behind them. The gate's value is not in today's zero — it is in the 24
resources still to migrate.

## 6. False-positive proof

Every case the brief named, plus the two the live library forced:

| Case | Result |
|---|---|
| **OG-26: `$ $ $`** | ✅ does not trigger — classified placeholder |
| **OG-17: empty worksheet cost line** | ✅ does not trigger |
| **Queensland: `from 1 January 2027`** | ✅ does not trigger |
| **`AS/NZS 5601`** (and 4348, UL2034, EN50291, ANSI/NSF 53) | ✅ does not trigger |
| **OG-22: member-entered `Est. Cost ($NZD)` column** | ✅ does not trigger |
| **OG-22: the `GRAND TOTAL` row** | ✅ does not trigger — see below |
| Resource and route ids, helpline numbers | ✅ do not trigger |
| A `Cost` heading with no amount, a formula | ✅ do not trigger |

> **The one the live run found, which no fixture would have.** OG-22's wishlist summary table has a four-column
> header — `Category | Items | Total Est. Cost | % of Budget` — and a `GRAND TOTAL` row only **three** cells wide,
> because of a colspan. Indexing the cost column by position read **`100%` as a cost**, and the gate's first run
> blocked a live, deployed resource. The fix is to skip any row whose cell count differs from the header's: a
> colspan means the column index no longer means what it says, and guessing is worse than not looking. A
> percentage in a cost column is now separately excluded as well. Both have their own tests.

## 7. True-positive proof

All fourteen shapes, each asserted to be detected **and** to block without a disposition:

`$50` · `from $50` · `under $100` · `over $500` · `approximately $200` · `$1,500–$4,000` · `AUD 250` · `NZD 100` ·
`NZ$120` · `$25/month` · `$180/year` · `$120 per cubic metre` · `2,000 dollars` · `$1.5k`

Plus: a price in a table cost column; **a bare number in a cost column with no currency symbol at all**; and a
third-party market price with no disposition, which produces `UNDISPOSED_PRICE`.

## 8. Full-library validation

| Check | Result |
|---|---|
| `import:prep`, 21 resources | **21/21 `READY_AFTER_FINAL_VALIDATION`** |
| Market files | **42** |
| Market problems · gate findings · content flags | **0 · 0 · 0** |
| **Blocked price findings** | **0** |
| `import:verify-prep` | **42/42 verified — against the PDFs already deployed**, which is the proof no member content changed |
| Numeric scan | **343 candidates · A 186 · B 2 · C_NEEDS_SOURCE 0 · D 111 · E 44** — unchanged |
| `private-assets/` | **64 files, none written** |
| Public/demo | untouched |

## 9. Test count

**512 passing** (477 → **+35**), lint clean, typecheck clean. New file `tests/unit/price-gate.test.ts`: 14
true-positive shapes, 2 table cases, 9 false-positive cases, 6 disposition cases including market scoping and
fail-closed, 2 legacy-versus-migrated cases, and a live-library assertion that no price survived into any
member-facing file while the legacy evidence is non-zero.

**One existing test was rewritten, not deleted — and it is the reason the wiring bug was caught.** Stage 9.59's
test 4 was written to *record the gap*: "a PRICE has no gate at all — neither numeric blocking nor the content flag
catches it", asserting the document came out `READY_AFTER_FINAL_VALIDATION`. Building the gate flipped it, which is
exactly what a test documenting a known hole should do. It now asserts that the price gate catches the price **and
that both markets become unpublishable** — while keeping the two facts that made the gate necessary, because they
are still true: numeric blocking still excludes `currency`, and `figure-needs-source` still matches only `%` and
`°C`.

## 10. Worker unchanged confirmation

**`fa23ec74-85d2-4d91-b484-3f037ccbe38b` — unchanged, and no deployment was necessary.**

This stage adds a check to preparation. It changes what the pipeline *permits*, not what the preview *serves*:
there is no runtime component, no record changed, no PDF re-rendered. All 42 prepared files still verify against
the PDFs already deployed, `private-assets/` holds the same 64 files with no write, all 21 resources remain draft
behind Cloudflare Access, and the public/demo build is untouched.

## 11. Recommendation for Stage 9.62

**A — the Gas/LPG block architecture.** Not the low-hazard batch.

**Why gas first.** It is the only thing still *blocking* a resource. OG-B09 is the last gas-held resource and it is
genuinely gas content — a heating comparison that prices a "Flued gas" option and gives it an efficiency band. The
research is **complete**: New Zealand read in full, all eight Australian jurisdictions read live at Stages 9.55 and
9.56, the architecture shape settled (non-numeric Australian core plus labelled state overrides, **no shared
Australian leak sentence**), and five blocks drafted. Leaving that evidence unbuilt is the one place where this
project is carrying research it has not converted into anything.

There is also a cost to waiting that is easy to miss: the gas evidence has **dates on it**. Tasmania's consumer
pages are from 2018 and 2021, the WA media release from June 2025, and ESV's GIS 36 was reviewed 1 January 2025.
Every month that passes is a month closer to needing some of it re-read.

**Why not the low-hazard batch.** It would move the resource count faster — fifteen resources, two or three a stage
— and that is a real argument. But none of them is blocked, they will still be there afterwards, and starting a
batch now means the gas research sits for another five or six stages. The batch is the right call **after** gas,
and it is where I would expect the pace to visibly change.

**Shape for 9.62:** draft blocks A–E for approval only — `gas-and-lpg-general`, `unflued-gas-heating`,
`gas-cylinder-safety`, `gas-leak-response`, `gas-installation-and-servicing` — sentence by sentence with each
jurisdiction labelled, then a build stage, then OG-B09. **I would still not build a shared Australian leak-response
sentence**: four jurisdictional framings exist and NSW's own two pages differ from each other.

**Stopped.** No Gas/LPG blocks built, OG-B09 not migrated, no other resource started, nothing deployed.

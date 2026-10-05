# OG-17 SOLID FUEL HEATING PLANNER · DEPLOYED AS RESOURCE #21

**Date:** 6 October 2026 · **Stage:** 9.60

**Worker `fa23ec74-85d2-4d91-b484-3f037ccbe38b`** · **21** protected drafts · **42** market files · 0 broken links ·
Cloudflare Access verified on every route including the new one · rollback retained · `--real` refused ·
public/demo unchanged · no private member file in GitHub.

**The heaviest claims removal this project has done is live.**

---

## 1. Push confirmation for `b572896`

`git push origin main` → `df9c47c..b572896  main -> main`. **`origin/main` =
`b572896d123abcda0eab41bfd442c923e02a68a6`**, containing:

- `admin-import/STAGE_9.59_OG17_PREPARED.md` — the claims-first preparation report
- OG-17's preparation: 16 approved copy changes (`approved-copy.json` +149) and its metadata
  (`metadata-review.json` +38), plus the safety-note alignment in `pilot/prep.ts` (+33)
- the Stage 9.59 tests — `tests/unit/og17-claims.test.ts` (180 lines)
- **no private member files.** `git ls-files` matching `private-assets` or `*.private.json` returns **0**

## 2. Metadata confirmation

**`heating` was confirmed an existing category of the shelter foundation before anything was approved.** The seven
shelter slugs are `household-resilience`, **`heating`**, `insulation`, `weatherproofing`, `maintenance`,
`property-assessment` and `shelter-worksheets`. **No taxonomy category was added**, and the approval script fails
hard if the slug is ever missing. A test asserts both that the slug exists and that OG-17's recorded category is
one of them.

| Field | Value | Basis recorded |
|---|---|---|
| title | **Solid Fuel Heating Planner** | the document's own cover |
| resourceType | **planner** | owner-approved |
| **foundation** | **shelter** | **`foundationBasis: OWNER-APPROVED / INFERRED`** |
| **category** | **heating** | **`categoryBasis: OWNER-APPROVED / INFERRED`** |
| **difficulty** | **intermediate** | **`difficultyBasis: OWNER-APPROVED / INFERRED`** |
| **estimatedTime** | **25** minutes | **`timeBasis: OWNER-APPROVED / INFERRED`** |
| **status** | **draft** | kept |
| id · slug | `res-1017` · `solid-fuel-heating-planner` | |
| PDF title | **`Solid Fuel Heating Planner — OffGrid056`** | owner standard, no legacy code |
| tags · relatedResources | `[]` · `res-1015`, `res-1021` | |

## 3. Final safety block list

**Five blocks, identical in both markets**, each resolved to that market's own wording:

| # | Block | NZ | AU |
|---|---|---|---|
| 1 | `emergency-contact` | 111 · Civil Defence | 000 / 112 / 106 TTY · SES |
| 2 | **`fire-and-smoke-alarms`** | FENZ + Tenancy Services | FRNSW + Queensland Fire Department, state-labelled |
| 3 | `carbon-monoxide` | Health NZ / WorkSafe wording | NSW Health wording, no servicing interval |
| 4 | `general-disclaimer` | licensed electrical worker / gasfitter | licensed electrician / gasfitter |
| 5 | **`solid-fuel-heating`** | "cleaned every year", "at least one metre", ash handling | "inspected and cleaned every year", "at least one metre", ash handling |

| Requirement | Result |
|---|---|
| `sourceSafetyTopics` | `solid-fuel-heating`, `fire-and-emergency` |
| `requiredSafety` — **NZ** | `solid-fuel-heating`, `fire-and-emergency` |
| `requiredSafety` — **AU** | `solid-fuel-heating`, `fire-and-emergency` |
| `missingRequired` | **[]** ✅ |
| `SAFETY_TOPIC_REMOVED_WITHOUT_RECORD` | **0** ✅ — nothing was removed; the migrated text still teaches both |
| New exemption | **none** ✅ |
| `gas-and-lpg` | **not required, not carried** |

`fire-and-smoke-alarms` answers the detector's `fire-and-emergency` requirement through the Stage 9.52 `answers`
field. `carbon-monoxide` is carried deliberately — the seasonal checklist has a CO alarm step and no topic detector
exists for CO.

## 4. Gas narrative removal confirmation

**Confirmed removed and recorded as an owner ruling in `metadata-review.json`.** Neither sentence is restored.

**The resource's own text names gas nowhere** — verified directly on both files with the safety blocks stripped out:
zero matches for LPG, propane, butane or any `gas*` word. The only gas words in the finished files come from
**approved blocks**: the `carbon-monoxide` block (NZ names "gas and LPG heaters" among fuels that burn; AU names gas
appliances and the gasfitter) and the standing disclaimer sentence carried by all 21 resources. Both have been
owner-approved since Stage 9.19.

No Gas/LPG block is required. No gas exemption exists.

## 5. Price absence proof

**Zero, in both markets, against eight separate patterns** run on the finished member-facing text:

| Pattern | NZ | AU |
|---|---|---|
| `$` symbol | ✅ none | ✅ none |
| `NZ$` | ✅ none | ✅ none |
| `AU$` | ✅ none | ✅ none |
| `NZD` / `AUD` / `USD` / `CAD` | ✅ none | ✅ none |
| price range (`$X–$Y`) | ✅ none | ✅ none |
| `from $…` | ✅ none | ✅ none |
| cost amount ("cost … 2,000") | ✅ none | ✅ none |
| dollars in words | ✅ none | ✅ none |

**One honest note about how that proof was produced.** My first version of the `from $…` pattern made the dollar
sign optional, and it matched **"from 1 January 2027"** in the Queensland alarm block — a legislative deadline, not
a price. The pattern now requires the `$`. I mention it because a price checker that cries wolf on dates is worse
than useless, and because the same mistake is easy to make in Stage 9.61's real gate.

**The architecture gap stands, and it is recorded as the first action for Stage 9.61:** nothing in the pipeline
*gates* on a price. `currency` is excluded from numeric blocking (Stage 9.50) and the `figure-needs-source` content
flag matches only `%` and `°C`. OG-17's ten prices are gone because they were removed by approved copy change and
proved absent by assertion. **This stage did not build the price-presence architecture.** See §17.

## 6. Percentage absence proof

**Reported separately from the numeric system, as instructed.**

| Check | Result |
|---|---|
| `%` figures in either market file | **0** |
| `figure-needs-source` content flags, OG-17 | **0** |
| `figure-needs-source` content flags, all 21 resources | **0** |
| Numeric Bucket C | **0** |

The six efficiency bands are gone with the column that held them, and the table now says in member-facing words why:
*"no official source publishes efficiency bands for classes of solid fuel appliance. Get written quotes and the
manufacturer's own efficiency rating for the specific model you are considering."*

**Global percentage blocking was not activated.** The content-flag backstop is what holds this, and Stage 9.59
proved it fires on a bare `%` while the numeric gate stays silent.

## 7. NZ final PDF result

**7 pages** — `solid-fuel-heating-planner.NZ.pdf`, 327,979 bytes. Matches the Stage 9.59 expectation.

## 8. AU final PDF result

**7 pages** — `solid-fuel-heating-planner.AU.pdf`, 329,572 bytes. Matches the Stage 9.59 expectation.

**Neither PDF was re-rendered.** The owner approvals changed the record's metadata, not a single character of
member-facing copy, so the Stage 9.59 renders remain correct — and `verify-prep` re-confirmed both against the
prepared HTML rather than being taken on trust.

**Every §8 check, run on both files:**

| Check | NZ | AU |
|---|---|---|
| Title `Solid Fuel Heating Planner — OffGrid056` | ✅ | ✅ |
| Record metadata (shelter / heating / intermediate / 25) | ✅ | ✅ |
| Status **draft** | ✅ | ✅ |
| No prices | ✅ | ✅ |
| No unsupported percentages | ✅ | ✅ |
| No "3-Metre Rule" | ✅ | ✅ |
| No universal consent assertion, and local-authority routing present | ✅ | ✅ |
| No narrative gas framing | ✅ | ✅ |
| No cross-market wording | ✅ | ✅ |
| **No blank pages** | ✅ 233 / 2,359 / 1,906 / 411 / 885 / 1,227 / 1,056 chars | ✅ 233 / 2,710 / 1,472 / 905 / 885 / 1,227 / 930 chars |
| No duplicated block | ✅ 5 distinct | ✅ 5 distinct |
| No `{{tokens}}` or VERIFY markers | ✅ | ✅ |

All 17 removed claims confirmed absent from the resource's own text in both markets.

## 9. Numeric result

**Blocking ON. Bucket C = 0 everywhere.**

| Scope | Candidates | A sourced | **C needs source** |
|---|---|---|---|
| OG-17 NZ | 7 | 7 | **0** |
| OG-17 AU | 8 | 8 | **0** |
| **Library-wide** | **343** | **186** | **0** |

Every OG-17 candidate is `A_ALREADY_SOURCED`, and every one comes from an injected block — the resource's own text
now contains no factual figure at all. Library buckets: A 186 · B 2 · **C 0** · D 111 · E 44.

## 10. Content-flag result

**0 content flags across all 21 resources**, including 0 `figure-needs-source`, 0 legacy-programme flags and 0
health-claim flags. Reported separately from §9 on purpose: Bucket C = 0 says nothing about percentages or prices,
and this line is the one that does.

## 11. Full-library validation

| Check | Result |
|---|---|
| `import:prep`, 21 resources | **21/21 `READY_AFTER_FINAL_VALIDATION`** |
| Market files | **42** |
| Market problems · gate findings · content flags | **0 · 0 · 0** |
| Unaccounted safety-topic removals | **0** |
| `import:verify-prep` | **42/42 verified** |
| `import:verify-build` | **records 21 · market files 42 · broken internal links 0 · deployment build verified** |
| The 20 previously deployed resources | **unchanged** — no copy, record, block or PDF touched |

## 12. Test count

**477 passing** (475 → **+2**), lint clean, typecheck clean. Two final regressions added to
`tests/unit/og17-claims.test.ts`:

| # | Test |
|---|---|
| 8b | carries no currency in any form, in either market — `$`, NZD/AUD/USD/CAD, dollars in words, and `from $…` with the dollar sign **required**, so a date is not mistaken for a price |
| 8c | records the owner-approved metadata with all four `…Basis` fields marked `OWNER-APPROVED / INFERRED`, status draft, and a category the taxonomy already held |

**A lint note, since the project reports lint clean every stage:** my scratch validator introduced nine
`no-unused-expressions` warnings by using ternaries as statements. They are rewritten as `if/else` and lint is
clean again. Scratch files are git-ignored but they are still linted, and "clean" should mean clean.

## 13. Deployment result

**Deployed.** `wrangler deploy` → `Deployed og056-preview triggers`, 559 files uploaded (391 already present).

- **Cloudflare Access verified on all nine probed routes** — 302 → `odd-surf-0ad6.cloudflareaccess.com` — including
  `/foundations/shelter/heating/`, `/resources/solid-fuel-heating-planner/` and **both market PDFs**.
- **All 21 resources are `draft`.** Nothing was published.
- **`--real` was not run** and remains hard-refused.
- **Public/demo untouched** — `git diff` on `public/` and `data/` is empty.
- **No private member file in GitHub.** `private-assets/` now holds **64 files and 42 PDFs**; `build:preview`
  staged all 64, built, and removed all 64. `git status` shows no private or PDF path.
- OG-17 takes a **new route** — `/resources/solid-fuel-heating-planner/` — so no demonstration placeholder was
  superseded this time.

## 14. New Worker version

**`fa23ec74-85d2-4d91-b484-3f037ccbe38b`**

## 15. Protected resource count

**21** protected drafts, **42** market files, behind Cloudflare Access.

## 16. Rollback version

**`1922f7ba-a0b3-4a7b-ba01-593b3df6a160`** — the 20-resource deployment, private files retained at
`workspace/backups/private-assets-1922f7ba` (61 files). It is a clean rollback: it restores the corrected
Australian gas wording and loses only OG-17.

## 17. Stage 9.61 — price-presence gate

**Recommended next stage, and it is a validation stage, not a migration.**

**The problem, stated exactly.** A member-facing price passes everything today. `currency` is excluded from numeric
blocking by the Stage 9.50 activation — deliberately, because prices need a freshness system and not a safety gate
— and the `figure-needs-source` content flag matches only `%` and `°C`. Across OG-13 and OG-17 the project has
removed **fifteen prices**, every one caught by a human reading the document. That is not a control.

**What to build: a presence-and-review gate.** It answers "is there a price here that nobody has signed off?" and
nothing else. It must **not** try to decide whether a price is correct, current or fair.

**Detection — the shapes to cover:**

| Shape | Examples |
|---|---|
| Bare symbol | `$5`, `$1,500`, `$ 80` |
| Market-prefixed | `NZ$120`, `AU$ 40`, `NZD 500`, `AUD 2,000` |
| Ranges | `$80–$120`, `$15 to $25`, `$5-$15/box` |
| Qualified | `from $2,000`, `under $50`, `around $400`, `up to $1,500` |
| Per-unit | `$300/tonne`, `$120 per m³`, `$25/bag` |
| Words | `2,000 dollars`, `two thousand dollars` |
| Table columns | a header matching `cost`, `price`, `$`, `budget`, `per unit` — which is how OG-17 and OG-B09 both carry theirs |

**Distinguishing a real price from noise — the part that decides whether this gate is usable:**

- **A `$` in a worksheet blank is not a price.** OG-26's budget rows are literally `$ $ $` for the member to fill
  in, and OG-17's worksheet says "Estimated setup cost" with an empty line. **`$` with no digits after it must not
  fire**, or the gate's first run blocks two live resources.
- **A date is not a price.** "from 1 January 2027" is Queensland's alarm deadline. I made exactly this mistake in
  this stage's checker; requiring the `$` fixes it.
- **A standard or model number is not a price.** `AS/NZS 5601`, `UL2034`, `EN50291`.
- **A member's own figure is not our claim.** The existing numeric classifier already recognises "your figure",
  empty worksheet lines and variable formulas; the price gate should reuse `NOT_A_CLAIM` rather than invent a
  second opinion.
- **Run it on the resource's OWN text, before blocks are injected** — the Stage 9.58 rule. No approved block
  carries a price today, but the fuel check learned this lesson the expensive way.

**Dispositions — each detected price needs one, in `metadata-review.json`:**

| Disposition | Meaning |
|---|---|
| `REMOVE` | it goes, as all fifteen have so far |
| `CURRENT-SOURCE-REQUIRED` | it may stay only once a live authoritative source is recorded for it |
| `OWNER-APPROVED-LIVE-PRICE` | you have accepted it as a current price, with the date you accepted it |

Undisposed price → **fail preparation**, exactly as `SAFETY_TOPIC_REMOVED_WITHOUT_RECORD` does.

**Explicitly out of scope:** no pricing freshness system, no currency conversion, no retail checking, no NZD/AUD
pairs, no registry of approved prices. Those are a later decision, and this gate should make that decision easier
rather than pre-empt it.

**Expected first-run result, honestly:** **zero findings across the 21 live resources.** Every price has already
been removed by hand. The gate's value is entirely in the 24 resources not yet migrated — OG-B09's heating
comparison alone carries four — and in making sure the sixteenth price is caught by the pipeline rather than by
somebody noticing.

**Stopped.** No Gas/LPG block implementation begun, OG-B09 not begun, no other resource started.

# BUCKET C RESOLVED · ZERO-FINDING NUMERIC BASELINE

**Date:** 23 September 2026 · **Stage:** 9.49

- **Worker version:** `0aff3fcd-7080-4ae7-bf28-c5d09414b90a`
- **No new resource:** still **19** protected drafts, 38 market files. One PDF changed — OG-08's **AU** file.
- **Rollback:** `1e4ab83b-4086-4c18-bf09-f6024152abbb`
- **Numeric detector: still REPORT-ONLY.** Blocking is not enabled.

---

## 1. Push confirmation

`git push origin main` → `843aafe..fd0997f  main -> main`. **`origin/main` = `fd0997f245f75a921a91dc4d9debc741aa6f20ee`**,
containing `admin-import/STAGE_9.48_NUMERIC_DISCOVERY.md`, `admin-import/config/numeric-claims.json`,
`admin-import/audit/numeric.ts` and `tests/unit/numeric.test.ts`.

## 2. OG-08 AU — exact before and after

**Before** (the Stage 9.48 finding, in the closing paragraph of Step 1's needs table, AU only):

> The official baseline is drinking water for three days; your state or territory emergency service may advise more
> for your area. The 7-, 14- and 30-day rows scale that three-day amount to more days — **optional extended
> resilience storage**: an OffGrid056 planning extrapolation based on the 3-day baseline, not an official Australian
> daily allowance. Round each total up to the next whole litre.

**After:**

> **Get Ready Queensland advises storing drinking water for three days.** Check your own state or territory emergency
> service for the advice that applies where you live. The 7-, 14- and 30-day rows scale that three-day amount to more
> days — **optional extended resilience storage**: an OffGrid056 planning extrapolation based on the **Queensland**
> three-day figure, not an official Australian daily allowance. Round each total up to the next whole litre.

**Two things changed and nothing else:** the unattributed "official baseline" became Queensland's advice, and the
extrapolation note now points at the *Queensland* three-day figure rather than an unowned "3-day baseline". The
calculator, the formulas, the storage architecture, OG-08's treatment classification, the NZ file and every other
resource are untouched.

## 3. Source attribution used

**Get Ready Queensland (Queensland Government) — Emergency kit checklist**, already verified at Stage 9.37 and read
2026-09-22: *"Water for three days – 10 litres of drinking water per person at a minimum."* No new research was done,
no stronger wording was invented, and no national Australian source is claimed.

The AU file now carries the attribution in three places, all consistent: the intro (*"Emergency guidance such as Get
Ready Queensland advises storing at least 10 litres … per person for three days"*), the table row label (*"OFFICIAL
EMERGENCY BASELINE (for example Get Ready Queensland)"*), and the corrected closing paragraph.

## 4–6. Numeric re-scan · Bucket C = 0

**300 candidates** across the 17 resources that contain figures.

| Bucket | Stage 9.48 | **Stage 9.49** |
|---|---|---|
| **A — already sourced** | 151 | **152** |
| **B — structural** | 2 | **2** |
| **C — NEEDS SOURCE** | 1 | **0** |
| **D — not a claim** | 110 | **109** |
| **E — treatment-owned** | 37 | **37** |

**Bucket C is zero.** By category: interval 231 · capacity 47 · distance 14 · height 4 · power 2 · area 2.

**The detector was sharpened while doing this, and it matters.** The old sentence had been classified as *"a duration
in passing"* — a duration is now also a claim when the sentence **asserts** it (*"the baseline is…"*, *"advises…"*,
*"official…"*), unless the sentence is denying it (*"not an official Australian daily allowance"*, *"not official NZ
requirements"*). That is what makes the before/after test meaningful: the old wording now **fails**, and it would not
have before. A second pass recognises a **back-reference** — a row label like "3-Day Official Baseline", or "any gap
in your 3-day official baseline" — as a restatement of a figure the same document sources elsewhere, and only when
that sourced figure is actually present.

## 7. Registry update

**17 claims** (was 16).

| Change | Why |
|---|---|
| `au-storage-days-qld` → `owningResources: ["OG-08"]` | ruling 9: OG-08 only |
| `au-storage-days-qld` → wording and patterns now require a **drinking-water** context plus the Queensland label | so it cannot explain OG-11's *food* three-day sentence, or any other three-day figure |
| **new** `au-food-days-qld` → `owningResources: ["OG-11"]` | the food figure is a separate claim with its own scope, shown beside NSW's 14-day figure |
| `requiresLabel: "Get Ready Queensland"` on both | the attribution has to be in the sentence, not merely somewhere in the file |

Market stays `AU`, jurisdiction stays `QLD (state-specific, used as a labelled example)`, and the source, authority
and date are the Stage 9.48 ones. Nothing was broadened.

## 8. OG-08 PDF validation

| Check | AU | NZ |
|---|---|---|
| File | `water-storage-calculator.AU.pdf` — **re-rendered** | `water-storage-calculator.NZ.pdf` — **byte-identical, not re-rendered** |
| Three-day guidance | **explicitly attributed** to Get Ready Queensland in three places | unchanged: Get Ready (NZ), 3 L per person per day |
| National baseline implied | **no** — no "Australian official baseline", "national baseline" or "Australia's baseline" anywhere | n/a |
| Treatment claims | valid — gates return 0 findings | unchanged |
| Market routing · title · draft | unchanged | unchanged |
| New unsupported figure | none — the re-scan is C = 0 | none |
| `import:verify-prep` | pass (38/38 files) | pass |

**Unavoidable differences:** none. The NZ PDF was not re-rendered and its hash is unchanged; of the 38 staged PDFs,
**exactly one** differs from the previous deployment.

## 9. Deployment result

**Success.** Unauthenticated probes return **302** to the Access login for `/`, the OG-08 page, **both** OG-08 PDFs
and `/learning-paths/water-basics/`.

Pre-flight: `import:prep` 19/19 · `import:verify-prep` **38/38** · `import:verify-build` **19 records, 38 market
files, 0 broken internal links** · the staged AU PDF is byte-identical to the verified one · **37 of 38 PDFs
unchanged**.

## 10–13. State

| | |
|---|---|
| **Worker** | **`0aff3fcd-7080-4ae7-bf28-c5d09414b90a`** |
| **Protected resources** | **19**, all `status: draft` |
| **Tests** | **410 passing** (404 → +6), lint clean, typecheck clean |
| **Rollback** | **`1e4ab83b-4086-4c18-bf09-f6024152abbb`**, private files in `workspace/backups/private-assets-1e4ab83b` (58 files); the new state is in `workspace/backups/private-assets-0aff3fcd` (58 files) |

`--real` refused · public `data/resources` unchanged at 30 demo records · public demonstration learning path
unchanged · no private file in git.

**The six new tests:** the attributed Queensland wording passes; the same figure as *Australian*, *national* or
*Australia's* baseline fails; the exact pre-fix sentence fails; the Queensland claim does not validate NZ; it does
not carry to another AU resource, while OG-11's food figure passes under its own entry and fails under OG-08's; and
the live OG-08 copy really does say the new sentence, with the NZ change untouched.

## 14. Stage 9.50 proposal — REPORT-ONLY → BLOCKING

**Not implemented.** For your review.

### What would change

One hook, beside the treatment gates in `prepareResource`:

```ts
const numeric = blockingFindings(scanNumericClaims(withSafety, { resource, market, registry, treatment }));
for (const finding of numeric) problems.push(finding);   // fails the market, as UNSOURCED_* does today
```

and `"mode": "blocking"` in `numeric-claims.json`, which the scanner reads so the config states the truth about
itself.

### The rule

**Fail on `C_NEEDS_SOURCE` only.** Buckets B, D and E never fail: structure is not a claim, a member's own figure is
not a claim, and a treatment figure is the treatment gates' business. With no registry, nothing is approved and every
figure fails — the fail-closed property already proved by test.

### What it would do to the current library

**Nothing.** The scan is C = 0 across all 19 resources and 38 market files, so switching the flag today produces zero
findings. That is the condition worth having before turning a gate on, and it is why this stage existed.

### Scope of the stage

1. The hook, the flag, and the finding text (`UNSOURCED_NUMERIC_CLAIM (<market>): "<sentence>" — <why>`).
2. Tests: blocking fails a resource carrying an unregistered figure; passes the current 19; an empty registry blocks
   everything; treatment figures still defer.
3. A full re-prep and `verify-prep` of all 19 to prove the green build, with no deployment — no member content
   changes, so nothing needs to go out.

### What stays out of the first activation

- **Percentages.** No live percentage claim exists, so the rule has never been exercised on real content. It stays in
  the schema, unenforced, until a resource brings one.
- **Currency.** No price exists anywhere; pricing needs a freshness system, not a safety gate.
- **Treatment figures.** They remain owned by `treatment-sources.json`, and the numeric scanner keeps deferring.

### The cost, stated plainly

Every new sourced figure in a future resource needs a registry entry in the same stage — market, jurisdiction, owning
resource, context patterns, label requirement, source, authority, date and limitations. That is the same discipline
the treatment registry imposes, and it is the point: a figure a member could act on has to be able to say where it
came from.

**Stopped.** Numeric blocking is **not** enabled, OG-13 is untouched, and nothing beyond OG-08's AU wording changed.

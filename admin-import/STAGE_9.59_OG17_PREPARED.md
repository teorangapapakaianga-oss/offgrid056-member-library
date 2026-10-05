# OG-17 SOLID FUEL HEATING PLANNER · PREPARED FOR OWNER REVIEW (NOT DEPLOYED, NOT STAGED)

**Date:** 6 October 2026 · **Stage:** 9.59

**Worker unchanged: `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`** · **20** deployed drafts, untouched · `private-assets/`
still **61 files, none written** — OG-17 is **not staged into the protected library** · all 40 live market files
still verify · `--real` refused · public/demo unchanged.

OG-17 is prepared in `workspace/prep/OG-17/` with both market PDFs rendered and verified. **Nothing was deployed.**

---

## 1. Push confirmation for `df9c47c`

`git push origin main` → `18c86aa..df9c47c  main -> main`. **`origin/main` =
`df9c47cc6c3722132bbaf278ddf643e761935ec9`**, containing `STAGE_9.58_SAFETY_ENFORCEMENT_ALIGNMENT.md`, the
`sourceSafetyTopics` / `requiredSafety` separation and removal-accountability logic (`pilot/prep.ts` +127,
`cli.mts` +5), the `memberFacingText` table-row fix, `tests/unit/safety-enforcement.test.ts` (193 lines), the
updated `prep.test.ts` assertions and three register updates. **No member content changed.**

## 2. Complete OG-17 claim inventory

**37 items across the whole source.**

### Prices — all REMOVE (10)

| Claim | Where | Verdict |
|---|---|---|
| `$0 (existing)` · `$500–$1,500` · `$2,000–$5,000` · `$3,000–$6,000` · `$2,500–$4,500` · `$5,000–$15,000` | Setup Cost column | **REMOVE** (column deleted) |
| `$80–$120/m³` · `$15–$25/bag` · `$300–$500/tonne` · `$5–$15/box` | Cost per Unit column | **REMOVE** (column deleted) |

### Efficiency percentages — all REMOVE (6)

`10–15%` · `30–50%` · `65–85%` · `80–90%` · `70–80%` · `60–70%` (Efficiency column) → **REMOVE**, column deleted.

### Safety, lifespan and distance claims

| Claim | Verdict |
|---|---|
| "Replace unit if over 5 years old" (CO alarm) | **REMOVE** — no replacement lifespan |
| "Accessible within 3 metres of the burner" (extinguisher) | **REWRITE non-numeric** |
| "Remove combustible materials within 1 metre" | **REWRITE non-numeric** — the approved block carries "at least one metre" in both markets |
| "Book a professional sweep every 12 months" | **REWRITE non-numeric** — the approved block carries "every year" in both markets |
| "Press the test button. Replace if it does not beep." | **KEEP** |
| "Check for rust, cracks, loose joints, and bird nests. Replace damaged sections." | **KEEP** |
| "Verify pressure gauge is in green zone" | **KEEP** |
| "Creosote buildup causes chimney fires" | **KEEP** — a mechanism, not a figure |

### Comparison and statistical claims

| Claim | Verdict |
|---|---|
| "Solid fuel heating kills more people than grid failures" | **REMOVE** — unsourced comparative mortality |
| "Solid fuel heating is the ultimate resilience heating" | **REMOVE** — marketing superlative |
| "independent of infrastructure, fuelled by a renewable resource you can stockpile" | **REWRITE** — kept as the plain, true part |
| "The cost of doing it right is far less than the cost of a house fire" | **REMOVE** — an unsupported cost comparison |

### Regulatory claims

| Claim | Verdict |
|---|---|
| "Consent Needed" column: **No / No (retrofit) / Yes ×4** | **REWRITE** — six per-system consent assertions, all removed |
| "Every installation needs a building consent" | **REWRITE** — universal rule across two countries |
| "professional flue installation" | **KEEP** |
| "Consent / building approval needed? □ Yes □ No" (worksheet) | **KEEP** — a question, not an assertion |

### Durations, quantities and other figures

| Claim | Verdict |
|---|---|
| "2–3 years (if kept dry)" firewood shelf life | **REMOVE** — unsourced |
| "Season for 12+ months" | **REWRITE non-numeric** |
| "Indefinite (if dry)" ×3 | **REWRITE** — "keeps well while it stays dry" |
| "6–8 cubic metres of firewood" for "a typical home in a cold NZ climate" | **REMOVE** — unsourced, and NZ wording in shared copy |
| "The 3-Metre Rule" (heading) | **REMOVE** — see §7 |
| "Buy in spring when prices are lowest" | **REMOVE** — a price claim |
| Step numbers 1–5, worksheet blanks | **KEEP** — structural |

### Gas (narrative only — Stage 9.57)

| Claim | Verdict |
|---|---|
| "when the power goes out and the gas stops flowing" | **REMOVE** — not required to, but the resource now mentions gas nowhere |
| "Gas supplies can be disrupted" | **REMOVE** — same |

### Legacy programme references

"Week 3 — Shelter, Heating & Energy" · "OffGrid056 30-Day Programme" · `alt="Week 3"` · "Asset OG-17 | Day 17" ×2 ·
"Day 17 Complete" · "Tomorrow: the sun…" · "Next: OG-18 Solar Power 101 Workbook" — all **REMOVE**.

**KEEP_AS_EXAMPLE: nothing.** Unlike OG-02, OG-13 and OG-18, this resource has no OffGrid056 scoring instrument —
every figure in it was presented as fact, which is why so many had to go.

**16 approved copy changes** record all of it (15 shared, 1 Australian), each with an exact `from → to` and a
reason, in `config/approved-copy.json`.

## 3. CO lifespan decision

**REMOVED, with no replacement lifespan.**

> ~~"Press the test button. Replace if it does not beep. **Replace unit if over 5 years old.**"~~
>
> **"Press the test button. If it does not beep, replace it. Follow the manufacturer's instructions for how long
> your alarm lasts and when to replace it."**

Three stages established the same thing independently: 9.52 found no source in either market, 9.55 confirmed it
across NZ and five Australian jurisdictions, 9.56 across all eight. The only lifespan statement anywhere is Energy
Safe Victoria's **"around 2 to 7 years, but their life expectancy and effectiveness will vary"** — a range with a
dependency, not a rule, and Victorian industry guidance at that. **No universal lifespan was substituted.**

The step heading also changes from "CO Detector Test" to "Carbon Monoxide Alarm", matching the approved
`carbon-monoxide` block's own term. The member is routed to the manufacturer — not to an expiry rule the library
cannot source.

## 4. Mortality claim decision

**REMOVED, and not replaced with another statistic.**

> ~~"**Solid fuel heating kills more people than grid failures.** Carbon monoxide, chimney fires, and ember escape
> are real risks. Every installation needs a building consent, professional flue installation, and annual chimney
> sweep. The cost of doing it right is far less than the cost of a house fire."~~
>
> **"Carbon monoxide, chimney fires and ember escape are the three things that go wrong with solid fuel heating,
> and all three are addressed by installation and maintenance rather than by how you light the fire. Have the flue
> installed by a qualified professional, check with your local authority what approvals apply where you live, and
> work through the seasonal checks below. The safety guidance at the end of this resource sets out the clearances
> and the maintenance."**

The box title moves from "Safety First — Every Time" to "Get It Installed Properly". The three named risks are
kept because they are the real ones; what goes is the comparison, the universal consent rule and the cost
argument.

## 5. Price removals

**All ten removed, by deleting both price columns.** No current prices were researched, no currency was converted,
no NZD/AUD figures were created, no pricing registry was made, and no placeholder was left behind. The member is
told to **get written quotes**, which is the only honest number.

The worksheet line "Estimated setup cost" stays — that is the member writing their own figure, not ours.

## 6. Efficiency percentage removals

**All six removed.** The default ruling applied: no NZ or Australian authority publishes efficiency bands for
*classes* of solid fuel appliance, and the figures read as vendor performance claims. The Efficiency column is
deleted, and a line above the table says so plainly:

> "Setup costs and efficiency figures have been removed: the legacy versions were vendor-style performance
> numbers, and no official source publishes efficiency bands for classes of solid fuel appliance. Get written
> quotes and the manufacturer's own efficiency rating for the specific model you are considering."

**Global percentage blocking was not activated.** See §11 for the proof of what actually controls this.

## 7. The 3-Metre Rule decision

**REMOVED — and the audit found something worth reporting: the rule did not exist.**

The box reads:

> **The 3-Metre Rule** — "Store at least one full winter's worth of fuel. For a typical home in a cold NZ climate,
> that is 6–8 cubic metres of firewood. Stack it neatly under cover, off the ground, with airflow around the
> stack. Buy in spring when prices are lowest and wood has time to dry further."

| Question | Answer |
|---|---|
| What appliance or system does it refer to? | **None.** The body is about **fuel quantity and stacking**. There is no three-metre measurement anywhere in it |
| Installation, clearance, fire, flue or other? | **None of them.** The only "3 metres" in the whole document was the unrelated fire-extinguisher line |
| NZ applicability | The body names "a cold NZ climate" — NZ-specific wording sitting in shared copy |
| AU applicability | None stated |
| Source status | **No source. The heading does not describe its own content** — it reads as a copy-paste artefact from another document |

**Decision: REMOVE the heading and REWRITE the body non-numeric.** The box becomes **"Storing Your Fuel"**, and the
quantity becomes the member's own calculation: *"Work out one full winter's worth of fuel for your own home and
your own system, and write it in the worksheet above — the amount depends on your climate, your house and what you
are burning."* **No new research stage was opened to rescue the number.**

## 8. Consent assertion decision

**NEUTRALISED — not blocked.**

Two separate assertions had to go. The warning box's **"Every installation needs a building consent"** is replaced
by *"check with your local authority what approvals apply where you live"*. The comparison table's **"Consent
Needed"** column — which asserted **No / No (retrofit) / Yes / Yes / Yes / Yes** per system — becomes **"Approval
and installation"**, and every row sends the member to their local authority.

The resource now implies **none** of the three forbidden things: not that consent is always required, not that it
is never required, and not that one rule covers both countries. It is **not** marked
`BLOCKED_BY_CONSENTS_RESEARCH`, because neutral routing wording was achievable without asserting anything — and a
test asserts that no universal consent claim survives in either file while the "local authority" routing does.

## 9. `sourceSafetyTopics`

**`solid-fuel-heating`, `fire-and-emergency`** — from the legacy source, as evidence.

## 10. `requiredSafety`

**NZ: `solid-fuel-heating`, `fire-and-emergency`. AU: identical.** Read from each migrated market file under the
Stage 9.58 architecture.

| | |
|---|---|
| Topics removed during migration | **none** — the migrated text still teaches both |
| `SAFETY_TOPIC_REMOVED_WITHOUT_RECORD` | **0** ✅ |
| `missingRequired` | **[]** |
| Exemptions used | **none** |
| **`gas-and-lpg`** | **not required and not carried** — the resource's own text now names no gas appliance, fuel or supply at all |

**Blocks carried: `general-disclaimer`, `emergency-contact`, `solid-fuel-heating`, `fire-and-smoke-alarms`,
`carbon-monoxide`.** The first two are standard; `solid-fuel-heating` and `fire-and-smoke-alarms` answer the
detector (the latter answering `fire-and-emergency` via the Stage 9.52 `answers` field); `carbon-monoxide` is
carried deliberately because the seasonal checklist has a CO alarm step and **no topic detector exists for CO**.

**Solid-fuel safety was not weakened by the gas classification** — a test asserts solid fuel and fire are still
required and still answered.

## 11. Percentage-backstop proof

**Proved, not assumed — and the proof turned up something you should know.**

| Figure type | Numeric gate | `figure-needs-source` flag | Net effect |
|---|---|---|---|
| **Percentage** | **excluded** — `numericBlockingFindings` returns `[]` for "65-85% efficiency" | **fires** | **Readiness fails** ✅ |
| **Currency** | **excluded** | **does not fire** — the pattern matches only `%` and `°C` | **Nothing stops it** ⚠️ |

Three new tests run this directly: the numeric gate is silent on a percentage; prep nonetheless returns a
`figure-needs-source` flag containing `65-85%` and readiness becomes `NEEDS_CONTENT_REVIEW`; and the same document
without the percentage is `READY_AFTER_FINAL_VALIDATION`.

**The thing I did not expect, and will not paper over: a price has no gate at all.** `currency` is excluded from
numeric blocking by the Stage 9.50 activation, and the content flag's pattern covers `%` and `°C` only — not `$`.
A test now records that fact explicitly rather than leaving a future stage to assume otherwise. **OG-17's ten
prices are gone because they were removed by approved copy change and proved absent by direct assertion**, not
because a gate caught them. If you want a gate, the cheapest honest fix is adding currency to the
`figure-needs-source` pattern — I have not done it, because it would change readiness for any resource that
mentions money and that is a decision, not a cleanup.

**Final OG-17 contains no percentage figure and no price**, in either market, verified on the prepared files.

## 12. Numeric result

**Reported separately from the content system, as instructed.**

| System | Result |
|---|---|
| **Numeric blocking** (ON) | **Bucket C = 0.** Library-wide with OG-17: **343 candidates · A 186 · B 2 · C 0 · D 111 · E 44**. OG-17 contributes 15 candidates, all `A_ALREADY_SOURCED` — every one from its injected blocks |
| **Content flags** | **0** across all 21 resources, including **0 `figure-needs-source`** |
| **Unsupported percentages** | **0** — none remain in either file |
| **Unsupported prices** | **0** — none remain in either file |
| **Unsupported distances** | **0** — the extinguisher 3-metre and hearth 1-metre figures are gone from the resource's own text; the one-metre clearance reaches the member through the approved block, which is sourced |

**Bucket C = 0 is not by itself evidence the percentages are clean**, and it is not being used as such: the
percentages are clean because the content-flag count is zero and because the prepared files were read directly.

## 13. The exact four metadata gaps

Stage 9.58 named four fields as unresolved. They are:

1. **`foundation`** — audit inference only, **MEDIUM** confidence ("text mentions shelter 1×")
2. **`category`** — nothing in the document indicates one
3. **`difficulty`** — the document states no level
4. **`estimatedTime`** — the document states no estimate

## 14. Proposed metadata

| Field | Proposal | Basis |
|---|---|---|
| **title** | **Solid Fuel Heating Planner** | the document's own cover; accurate, no legacy code |
| **resourceType** | **planner** | **OWNER-REVIEW REQUIRED** — audit inference, MEDIUM. It compares options and ends in a plan, like OG-21 (planner), rather than scoring like OG-15 (assessment) |
| **foundation** | **shelter** | **OWNER-REVIEW REQUIRED** — MEDIUM inference. Heating sits in shelter today: OG-15 and OG-21 are both there |
| **category** | **heating** | **OWNER-REVIEW REQUIRED** — proposed to match OG-15, the shelter foundation's other heating resource. The slug exists |
| **difficulty** | **intermediate** | **OWNER-REVIEW REQUIRED / INFERRED** — proposed one step above its siblings (OG-15 and OG-21 are both beginner) because it asks a member to choose between six systems, plan a flue and hearth, and deal with a local authority |
| **estimatedTime** | **25** minutes | **OWNER-REVIEW REQUIRED / INFERRED** — one comparison table, a seven-field worksheet, a five-step checklist, a fuel table. Between OG-13 (20) and OG-15/OG-21 (30) |
| **description** | "Compare the solid fuel heating options, plan the one you choose, and keep it safe season to season — with the approval and installation questions to put to your local authority before you commit." | **OWNER-REVIEW REQUIRED** — written for this migration; the legacy subtitle named gas and called solid fuel "the ultimate resilience heating" |
| **tags** | `[]` | the convention across all 20 live resources |
| *(also proposed)* **relatedResources** | `res-1015` (Warm Home Scorecard), `res-1021` (Home Energy & Shelter Upgrade Plan) | both live, both shelter |
| *(also proposed)* **status** | **draft** | as every real resource |

**Nothing was silently defaulted.** Every inferred field is marked and reasoned in `metadata-review.json`.

## 15. NZ / AU prepared content

**Both markets prepared and verified. NZ 7 pages · AU 7 pages.**

- `solid-fuel-heating-planner.NZ.pdf` — 327,979 bytes
- `solid-fuel-heating-planner.AU.pdf` — 329,572 bytes

PDF rendering is part of the normal pre-deployment preparation, so it was done; **the files stay in
`workspace/prep/` and were not staged into `private-assets/`.**

**Market separation, checked directly on both files:** the NZ file names no Australian jurisdiction or agency; the
AU file names no New Zealand agency or figure. The per-market differences are the emergency number (111 / 000),
the trade names in the disclaimer, each market's own `solid-fuel-heating`, `fire-and-smoke-alarms` and
`carbon-monoxide` wording, and **one terminology change**: the AU worksheet says "approvals" where NZ says
"consent". **No state rule is presented nationally** — the Australian alarm block keeps its NSW and Queensland
labels. No US or Canadian wording anywhere.

**One thing I corrected mid-stage, because it would have failed verification.** My replacement sentence above the
comparison table originally read *"no New Zealand or Australian authority publishes efficiency bands"* — naming
**both** markets, in **both** files. `verify-prep` rejects a market file that names the other market, and rightly.
It now reads "no official source publishes…", which is market-neutral and equally true.

## 16. Remaining blockers

**None for preparation. Four metadata decisions for you** (§13–14) — `foundation`, `category`, `difficulty`,
`estimatedTime`. All four have proposals with reasoning; none can be settled from the document.

Everything else is clean: 21/21 `READY_AFTER_FINAL_VALIDATION`, 42 market files, **zero** market problems, **zero**
gate findings, **zero** content flags, 42/42 verified, Bucket C = 0, no safety topic unaccounted.

## 17. Test count

**475 passing** (467 → **+8**), lint clean, typecheck clean. New file `tests/unit/og17-claims.test.ts`:

| # | Test |
|---|---|
| 1 | percentage is still excluded from numeric blocking — the gate does **not** catch it |
| 2 | but an unsupported `%` still fails readiness, through the content-flag system |
| 3 | the same document without the percentage is ready |
| 4 | **a price has no gate at all** — neither numeric blocking nor the content flag catches it |
| 5 | neither prepared market file carries a price, a percentage or any removed claim |
| 6 | no universal consent rule survives, and the member is routed to their local authority |
| 7 | gas is not reintroduced: the resource's own text names no gas appliance or fuel |
| 8 | solid fuel and fire safety are not weakened by the gas classification |

**One change to shipped behaviour this stage, and it needs flagging.** OG-17 was still being held by a *third*
legacy-source mechanism I had not touched at 9.57 or 9.58: the audit's safety note *"covers gas appliances
(4 mentions) with no ventilation and certified-installer warning"*, which `unansweredSafetyNotes` could only
answer with a `gas-and-lpg` block that does not exist. That note is the same class of evidence as
`sourceSafetyTopics`, so the Stage 9.58 ruling now applies to it: **a note about a topic the migrated output no
longer teaches is answered.** It cannot let anything through — a topic the output *does* teach is in
`requiredSafety`, and an unaccounted removal fails the market before this is reached — and omitting the new
argument preserves the old behaviour for every existing caller.

## 18. Readiness recommendation

**`READY_AFTER_FINAL_VALIDATION`. Recommend deploying as resource #21 — after the four metadata decisions, and on
your explicit approval.**

OG-17 is the heaviest claims removal the project has done: **10 prices, 6 percentages, a CO lifespan, a mortality
comparison, a cost comparison, a superlative, seven consent assertions, four unsourced durations, two distances
and a heading that described nothing.** What is left is a comparison the member can act on, a worksheet, a
seasonal checklist, and three sourced safety blocks.

**One judgement I'd flag for disagreement:** I removed the two narrative gas sentences even though Stage 9.57
established they were harmless and required nothing. My reasoning is that they were also legacy framing — "when
the gas stops flowing" is a 2026 energy-crisis sentence, not timeless resilience advice — and removing them means
the resource mentions gas nowhere, which is the cleanest possible state while gas architecture is unbuilt. If you'd
rather keep the original framing, it is one copy change to revert.

## 19. Proposed Stage 9.60

**Deploy OG-17 as resource #21.** The usual shape: settle the four metadata fields, stage the record and the two
PDFs into `private-assets/`, build, verify, deploy with a rollback retained, verify Access and both market
downloads, update the deployment register.

**Then Stage 9.61: draft gas blocks A–E** on the Stage 9.56 architecture — non-numeric Australian core plus
labelled state overrides, no shared Australian leak sentence — and **OG-B09 after that**, since it is the one
genuine gas resource left.

**One small thing worth its own decision at some point, not bundled into a migration:** whether `currency` should
join `%` and `°C` in the `figure-needs-source` pattern (§11). Today prices are controlled by review and assertion
alone.

**Stopped.** OG-17 not deployed and not staged, no Gas/LPG blocks built, OG-B09 not begun.

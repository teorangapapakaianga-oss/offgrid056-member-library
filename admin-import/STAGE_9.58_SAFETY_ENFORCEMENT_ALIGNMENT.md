# REQUIRED-SAFETY ENFORCEMENT ALIGNED TO THE MIGRATED OUTPUT

**Date:** 5 October 2026 · **Stage:** 9.58

**Worker unchanged: `1922f7ba-a0b3-4a7b-ba01-593b3df6a160`** · **20** protected drafts · **40** market files ·
`private-assets/` still 61 files, **none written** · **all 40 prepared files still verify against the deployed
PDFs** · Bucket C = 0 · `--real` refused · all resources draft · public/demo unchanged.

**Nothing was deployed. OG-17 was not migrated. No gas block was built.**

---

## 1. Push confirmation for `18c86aa`

`git push origin main` → `85b5cf1..18c86aa  main -> main`. **`origin/main` =
`18c86aa37efd7af99664b0d4db69288c3b923b9d`**, containing `admin-import/STAGE_9.57_GAS_DETECTOR_HARDENING.md`, the
teaching-sensitive gas detector (`audit/group-a.ts` +105 lines, `pilot/prep.ts` +12), the new
`tests/unit/gas-detector.test.ts` (160 lines) and the three register updates. **No member content changed** — the
commit touches no record, no copy, no block body and no PDF.

## 2. The old `requiredSafety` architecture

**Where it was calculated:** `admin-import/cli.mts`, before `prepareResource` ever ran:

```ts
const exposureOf = (i) => safetyExposureFor([i.pdf, i.html].map((f) => ws.texts[f.candidateId] ?? "").join("\n"));
…
requiredSafety: exposureOf(item),
```

| Question | Answer |
|---|---|
| **Which representation was scanned?** | The **legacy source** — the audit's extracted text, PDF **and** HTML concatenated. Never the migrated file. |
| **When did it run?** | At the audit stage, before re-skin, before any approved copy change, before safety blocks. |
| **How did findings enter preparation?** | As a fixed array passed in. `prepareResource` did `lacking = requiredSafety.filter((b) => !answered.has(b))`, then applied exemptions, then blocked every market that still lacked a block. |
| **How was migrated copy handled afterwards?** | **It was not.** Nothing re-checked the member-facing output for safety topics. Every *other* gate — fuel, treatment, numeric, content flags — reads the migrated market file. Safety requirements alone read the source. |

**A concrete example, from this library.** **OG-B12** (live, resource 19) — its legacy source says
*"generator fuel reserve (diesel/petrol/LPG)"* and *"Fuel: Firewood, LPG, or diesel"*. At Stage 9.57 the first
version of the hardened gas rule counted those and would have required a gas safety block. I checked the migrated
file: **OG-B12's member-facing text contains no LPG, no biogas and no gas content of its own at all** — every gas
word in its prepared files comes from the approved CO, generator and disclaimer blocks. The fuel lists were removed
during migration. A member would have been shown a resource held for a block because of a sentence they will never
read.

The same shape is visible in four more places today. Measured on the current library, **the legacy source teaches a
safety topic that the migrated output does not in 8 of the 20 live resources**: OG-02, OG-08, OG-13, OG-18, OG-26,
OG-B08, OG-B12 (×2). Under the old architecture every one of those was still a requirement.

## 3. The new `sourceSafetyTopics` layer

**`sourceSafetyTopics`** — safety topics detected in the legacy source, exactly as before. Still computed by
`exposureOf(item)` in the CLI, still the audit's PDF + HTML text. **It no longer requires anything by itself.** Its
job is migration evidence: what the original document taught, so that anything which disappears can be noticed.

Reported on every prepared resource as `safety.sourceTopics`. The old input name `requiredSafety` is kept as a
deprecated alias so no caller breaks.

## 4. The new `requiredSafety` layer

**Computed inside `prepareResource`, per market, from the migrated member-facing output**, immediately before the
safety blocks are injected:

```ts
const outputTopics = safetyExposureFor(memberFacingText(marketHtml));
…
const marketRequired = [...new Set([...outputTopics, ...unaccounted])];
```

| Property | How it holds |
|---|---|
| **Reads the member-facing file** | after re-skin, after every approved and market-specific copy change, after print layout |
| **Before block injection** | so a block's own wording can never create a requirement — the CO block names gas heaters, and that must not demand a gas block |
| **Per market** | NZ and AU can differ; a topic taught in one market's wording is required in that market |
| **Fail-closed** | a topic the output teaches without its block blocks that market, exactly as before |
| **Catches what the old one could not** | teaching *introduced* in migration. The audit had nothing to report, so the old rule required nothing. Regression test 4 covers it |

**One fix this stage forced, which is worth stating because the architecture would have been quietly weaker
without it.** `visibleText` ends a line at every `</td>`, so a table row becomes one line per **cell**. The gas rule
built at Stage 9.57 recognises a comparison table by an appliance sitting beside a price — *"Flued gas |
$1,500–$4,000 | 80–90%"* — and deliberately refuses to look across a line break. Split cell by cell, the appliance
never meets its figure. **The table teaching that Stage 9.57 proved on the audit's text would have been invisible
on the migrated output**, which is now the enforcement target. `memberFacingText()` joins cells within a row and
still ends a line at `</tr>`, so a row is one line and nothing bleeds between rows. My own test 6 caught this; it
would otherwise have shipped as a silent false negative.

## 5. The removal-accountability rule

> A safety topic may leave a resource. It may not leave quietly.

Any topic in `sourceSafetyTopics` that the migrated output does not teach must be accounted for. **Two dispositions
are established by the resource itself and need no written record:**

| Disposition | Established when |
|---|---|
| **`REPLACED_BY_BLOCK`** | the resource still carries that topic's block, so the member still gets the safety wording |
| **`OWNER_APPROVED_REMOVAL`** | the resource holds an owner-approved exemption for it — the exemption's own reason, approver and date become the record |

Anything else must be written into `metadata-review.json` as
`safetyTopicDispositions: { "<topic>": { disposition, reason, approvedBy?, approvedOn? } }`, using one of
**`REMOVED`**, **`REWRITTEN`**, **`REPLACED_BY_BLOCK`**, **`NON_TEACHING_CONTEXT`** or
**`OWNER_APPROVED_REMOVAL`**.

**If nothing accounts for it, preparation fails.** The market gets
`SAFETY_TOPIC_REMOVED_WITHOUT_RECORD (<market>): the legacy source teaches "<topic>" and the migrated text does
not, with no block carried, no exemption and no recorded disposition…` **and the topic stays required**, so the
market is unpublishable. Fail-closed, not fail-silent.

**A disposition cannot be used to hide live teaching.** It only ever accounts for a topic the output no longer
teaches. Write `REMOVED` against a topic the resource still teaches and the block is required anyway — regression
test 2b.

## 6. Resources whose block requirements changed

**Eight resources have a legacy topic the migrated output does not teach. Every one was already accounted for —
no disposition had to be written, and no resource lost a block it needed.**

| Resource | Legacy topic | Migrated? | Reason for the change | Disposition |
|---|---|---|---|---|
| **OG-02** | `fire-and-emergency` | no | the two fire hazard labels are reviewed; it teaches no fire safety | **OWNER_APPROVED_REMOVAL** (Stage 9.47 exemption) |
| **OG-08** | `water-treatment` | no | the legacy bleach dosing was removed at migration | **OWNER_APPROVED_REMOVAL** (Stage 9.43 exemption) |
| **OG-13** | `solid-fuel-heating` | no | the wood-burner row survives but below the mention threshold | **REPLACED_BY_BLOCK** — it carries `solid-fuel-heating` |
| **OG-18** | `food-safety-power-cut` | no | one appliance row, reviewed | **OWNER_APPROVED_REMOVAL** (Stage 9.30 exemption) |
| **OG-26** | `solid-fuel-heating` | no | budget lines, not teaching | **REPLACED_BY_BLOCK** |
| **OG-B08** | `fire-and-emergency` | no | the bushfire and egress claims were removed at migration | **OWNER_APPROVED_REMOVAL** (Stage 9.46 exemption) |
| **OG-B12** | `solid-fuel-heating` | no | planning lines, not teaching | **REPLACED_BY_BLOCK** |
| **OG-B12** | `stored-drinking-water` | no | planning lines, not teaching | **REPLACED_BY_BLOCK** |

**No deployed resource lost a genuinely required block.** The check that matters is the other direction, and it is
clean: **for every one of the 20, every topic the migrated output teaches is answered by a block the resource
actually carries.** Nothing became publishable that was not publishable before.

**What this proves about the rule:** it is not vacuous. Delete OG-08's exemption and OG-08 fails preparation —
not because the block is missing, but because the removal is unexplained.

## 7. OG-17 result

Unchanged by this stage, and confirmed again:

| Check | Result |
|---|---|
| `safetyExposureFor` (source) | `solid-fuel-heating`, `fire-and-emergency` — **no `gas-and-lpg`** |
| `fuelTeachingSignals` | **none** |
| `GAS_SAFETY_REQUIRED` | **none** |
| Solid fuel | **required** — 45 mentions |
| Fire | **required** — answered by `fire-and-smoke-alarms` |
| Exemption needed | **no** |

**Not migrated**, as instructed.

## 8. OG-B09 result

**Still requires the gas block, through both layers.** At source level the Stage 9.57 table-figure branch catches
*"Flued gas | $1,500–$4,000 | 80–90%"*. At output level it now also catches it, because `memberFacingText()` keeps
a table row on one line — before this stage's fix it would have been missed once migrated. Regression test 6
asserts the output-level behaviour directly.

**Not migrated**, as instructed.

## 9. Full-library validation

| Check | Result |
|---|---|
| `import:prep`, 20 resources | **20/20 `READY_AFTER_FINAL_VALIDATION`** |
| Market files | **40** |
| Market problems · gate findings · content flags | **0 · 0 · 0** |
| Unaccounted removals | **none** |
| Output topic without its block | **none, in any resource** |
| `import:verify-prep` | **all 40 verified — against the PDFs already deployed**, which is the proof no member content changed |
| Numeric scan | **328 candidates · A 171 · B 2 · C_NEEDS_SOURCE 0 · D 111 · E 44** — unchanged |
| `private-assets/` | **61 files, none written** |
| Public/demo | untouched |

## 10. Test count

**467 passing** (456 → **+11**), lint clean, typecheck clean. New file
`tests/unit/safety-enforcement.test.ts`:

| # | Test |
|---|---|
| 1 | legacy taught gas, migration removed it, removal recorded → no gas block required |
| 2 | legacy taught gas, migration removed it, **nothing recorded → preparation fails** with `SAFETY_TOPIC_REMOVED_WITHOUT_RECORD` |
| 2b | a disposition cannot hide teaching that is still there |
| 3 | the migrated output still teaches gas → block required |
| 4 | the output introduces teaching the legacy source never had → block required |
| 5 | a narrative gas-supply reference requires nothing |
| 6 | **table-shaped gas teaching in the output** requires the block |
| 7 | OG-17's two narrative sentences require no gas block, even declared as a source topic |
| 8 | every deployed resource keeps its requirements, every removal is accounted for, and nothing the output teaches is missing its block |
| + | the two automatic dispositions: `REPLACED_BY_BLOCK` and `OWNER_APPROVED_REMOVAL` (which keeps the owner's reason, approver and date) |

**Five existing tests in `prep.test.ts` were updated, not deleted.** Their fixture teaches electrical
("Install the solar inverter and batteries"), which under output-derived enforcement is now a genuine requirement;
each now carries `batteries-and-electrical` so the test is about the thing it was written to test. That is the new
architecture working on the test suite itself.

## 11. Worker unchanged confirmation

**`1922f7ba-a0b3-4a7b-ba01-593b3df6a160` — unchanged.** No deployment was performed or needed: this stage changes
what preparation *requires*, not what the preview *serves*. All 40 prepared files still verify against the already
deployed PDFs, `private-assets/` holds the same 61 files with no write, all 20 resources remain draft behind
Cloudflare Access, the corrected AU gas wording and every NZ file are untouched, and the public/demo build is
unchanged.

## 12. Stage 9.59 — OG-17 claims-first migration

**Recommended next stage.** The gas blocker is gone and both required blocks exist. The work is claims, and there
is a lot of it.

| Item | What has to happen |
|---|---|
| **Unsourced CO lifespan** — "CO Detector Test … Replace unit if over 5 years old" | **REMOVE, with no replacement.** This is the identical claim Stage 9.52 removed from OG-13. Stages 9.55 and 9.56 confirmed across both markets that **no source publishes a CO alarm lifespan**; the only statement anywhere is Victoria's "around 2 to 7 years, will vary", which is a range with a dependency, not a rule |
| **Mortality comparison** — "Solid fuel heating kills more people than grid failures" | **REMOVE.** Unsourced epidemiology, the same shape as OG-13's "more hospitalisations than power outages" |
| **Ten prices** — $0, $500–$1,500, $2,000–$5,000, $3,000–$6,000, $2,500–$4,500, $5,000–$15,000, $80–$120/m³, $15–$25/bag, $300–$500/tonne, $5–$15/box | **REMOVE**, standing rule. No pricing registry entry |
| **Six efficiency percentages** — 10–15%, 30–50%, 65–85%, 80–90%, 70–80%, 60–70% | **See below — this one needs a decision, not a gate** |
| **"The 3-Metre Rule"** (fuel storage) and "6–8 cubic metres of firewood" | **VERIFY or REMOVE** — no source read publishes either. My expectation is REMOVE |
| **"Accessible within 3 metres of the burner"** (fire extinguisher) | **VERIFY or REMOVE** — no approved source gives this distance |
| **"Remove combustible materials within 1 metre"** | **likely KEEP** — the approved `solid-fuel-heating` block already carries FENZ's one-metre rule, so it becomes block-sourced |
| **"Book a professional sweep every 12 months"** | **likely KEEP** — the block says "Have your chimney flue cleaned every year" |
| **Consent assertion** — "Every installation needs a building consent" | **REWRITE.** Consents are an unfinished research stage, and it is a jurisdictional claim. It should point at the council rather than assert a rule |
| **Metadata gaps** | **foundation** is only a MEDIUM audit inference; **category**, **difficulty** and **estimatedTime** are not inferable at all. All four need an owner decision before preparation |

**How the six percentages will be controlled, given percentage blocking is excluded.**

This is the honest problem in the stage: **the numeric gate will not stop them.** `blockingExcludes` holds
`percentage` and `currency`, by the Stage 9.50 ruling, so appliance efficiency bands would pass validation
silently. Three ways to control them, and I recommend the first:

1. **Remove them in the approved copy changes** — the same mechanism that removed OG-13's five prices. Each removal
   is an exact `from → to` with a reason, reviewable in `approved-copy.json`, and `verify-prep` then proves the
   figure is absent from both rendered files. **This needs no architecture change and no new ruling**, and these
   are manufacturer marketing claims we cannot source from any NZ or AU authority.
2. **Turn percentage blocking on for this resource** — would require lifting a standing exclusion, and Stage 9.50
   recorded that no live percentage claim has ever exercised that path. Changing a global gate to police one
   document is the wrong order.
3. **Register them** — would need a source. There isn't one: no agency publishes efficiency bands for classes of
   heater, and a manufacturer's figure is not an authority.

**Backstop whichever is chosen:** prep's own `figure-needs-source` content flag already catches a bare `%`, and
content flags block readiness. So the percentages cannot reach a member silently even though the *numeric* gate
ignores them — they will surface as content flags and have to be dealt with. I will say so explicitly in the stage
report rather than let the green numeric result imply more than it means.

**Stopped.** OG-17 not migrated, no gas block built, nothing deployed.

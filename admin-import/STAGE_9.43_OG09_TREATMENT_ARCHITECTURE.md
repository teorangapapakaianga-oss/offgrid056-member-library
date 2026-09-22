# OG-09 — WATER TREATMENT ARCHITECTURE BUILT · OG-09 REBUILT FOR OWNER REVIEW (NOT DEPLOYED)

**Date:** 23 September 2026 · **Stage:** 9.43 · Implements the Stage 9.42 owner rulings 1–17.

**Nothing was deployed.** The live Worker is still `d993cb64-676a-46bc-80eb-f4c9850fb0ea` with **17** draft
resources and 34 market files. `private-assets/` is unchanged (51 files, 34 PDFs — OG-09's two PDFs are **not** in
it). `--real` is still refused.

---

## 1. Push confirmation

`2ec6dc6` is on the remote: `git push origin main` reported `6c0774a..2ec6dc6  main -> main`, `origin/main` is at
**2ec6dc6ad7867bca4e1e4f46633771073fc2e8e4**, and `git ls-tree origin/main` lists
`admin-import/STAGE_9.42_OG09_WATER_TREATMENT_RESEARCH.md`. The Stage 9.42 research report is in the public
repository; no member content went with it.

## 2. Final NZ treatment block

`water-treatment` → `marketBody.NZ` (CRITICAL, title *"Making water safe to drink"*). Approved as drafted:

> **Rainwater, stream, bore and tank water is not automatically safe to drink.** If you want to use it for drinking or
> other household uses, it has to be treated. If you are uncertain about the quality of the water, do not drink it.
>
> **Boiling is the simplest and most effective way to kill germs, including Cryptosporidium: boil the water for one
> minute.** A jug with an automatic cut-off switch is fine as long as the jug is full — let it turn off by itself, and
> never hold the switch down. Store cooled boiled water in a clean container with a lid; it is best used within 24
> hours, and it can be boiled again.
>
> If you cannot boil water, add 5 drops of plain, unperfumed household bleach to 1 litre of water — or half a teaspoon
> to 10 litres — stir, and leave it to stand for 30 minutes before drinking. Use only plain, unscented bleach: nothing
> with perfume, colour, surfactants or other additives, and treat words like "thick", "gel", "foam" or "cleaner" on the
> label as a sign the product is not suitable. **Bleach and purification tablets do not work on protozoa such as
> Giardia and Cryptosporidium**, which is why boiled or bottled water is recommended.
>
> **Do not assume a household water filter makes water safe.** Most filters only remove one or two types of impurity,
> and filters can become contaminated — ask the supplier what the device can and cannot do before you buy it.
>
> **If harmful chemicals or toxins could be in the water, boiling will not make it safe.** Use bottled or tankered
> water instead, and follow the advice of your water supplier or public health unit.
>
> For a rainwater system used for drinking, Building Performance (MBIE) lists the options as adding chlorine, using a
> very fine in-line filter or purifier, boiling the water for one minute, and ultraviolet light treatment. You should
> have drinking water tested annually, and some councils also require periodic testing. If you are concerned about your
> water, contact a Health Protection Officer at your local public health unit or an Environmental Health Officer at
> your council; they can also advise on testing laboratories.

Nine `sentenceSources` entries record which agency each sentence comes from. **No Australian figure or method
appears.** No micron rating, no UV specification, no elevation adjustment, no tank dosing rate — because no New
Zealand source publishes them.

## 3. Final AU treatment block

`water-treatment` → `marketBody.AU`, national and state labelled throughout:

> **Rainwater and surface water are not automatically safe to drink.** The national Australian Drinking Water
> Guidelines say surface water or shallow groundwater should not be used as a source of drinking water without
> treatment. NSW Health, for example, recommends that people in urban areas use the public water supply for drinking
> and cooking, and advises that water from dams, streams and rivers is not recommended as a source of drinking water
> unless it is filtered and disinfected — check what applies where you live.
>
> **If water may be contaminated with microorganisms, bring it to a rolling boil** — a kettle with an automatic
> shut-off switch does this — then let it cool and store it in a clean covered container in the fridge (NSW Health).
> WA Health advises vigorous boiling for at least one minute.
>
> **Bleach dosing is not the same across Australia, and it depends on the strength of the bleach.** NSW Health advises
> 2 drops of unscented 4–5% bleach per litre, or 4 drops if the water is cloudy, left to stand 30 minutes and longer in
> colder water. WA Health gives doses by strength: 10 drops per litre for 1% available chlorine, 2 drops for 4–6%, and
> 1 drop for 7–10%, left to stand 30 minutes. Follow the advice for your state or territory and the instructions on the
> product.
>
> **NSW Health advises that not all filters remove harmful microorganisms.** NSW Health notes that ceramic and
> polypropylene cartridges remove sediment and bacteria but not viruses, and that activated carbon filters treat taste,
> odour and some chemicals but remove no bacteria, parasites or viruses. WA Health says filters should not be relied
> upon to disinfect water. If a filter is being used for health reasons, look for the WaterMark or Plumbing Safety Type
> Test Mark and certification to AS/NZS 4348 or ANSI/NSF 53, and ask the supplier for the contaminant-removal claims
> and data.
>
> **NSW Health advises that UV disinfection works against most bacteria, viruses and protozoa, but only in clear
> water.** It also advises that rainwater usually has to be filtered first, that a UV unit needs a constant power
> supply and regular lamp and sleeve maintenance, and that UV leaves no residual disinfectant, so UV-treated water
> should be used straight away rather than stored.
>
> **Boiling and disinfection do not remove chemicals, blue-green algae toxins or metals.** If chemical contamination or
> an algal bloom is suspected, the water is unsuitable for drinking — use an alternative supply and follow the advice of
> your state or territory health department. NSW Health advises that professional advice be sought for the design and
> installation of a treatment system, and your local public health unit can help you find a NATA-accredited laboratory
> for testing.

**Two sentences were re-attributed during implementation** (the only wording change to the approved drafts): the
filter and UV paragraphs now begin *"NSW Health advises that…"* rather than carrying the attribution in the following
sentence. The gates showed why — once rendered, the bold lead sentence stands alone, and a claim without its source in
the same sentence is exactly what the gates are built to stop.

**NHMRC is the only national voice.** Everything else says NSW or WA.

## 4. Treatment source registry

`admin-import/config/treatment-sources.json` — **21 approved claims**, each carrying market, jurisdiction, method,
claim type, allowed wording, numeric value, source URL, authority, source date, household applicability, limitations,
contamination exclusions and status, plus the regular expressions that let a sentence match it and the gates it
answers.

| Market | Claims | Covering |
|---|---|---|
| **NZ (9)** | boiling one minute · bleach 5 drops/L and ½ tsp/10 L (treatment) · bleach 5 drops/L (storage, the live OG-08 method) · filter limitation · MBIE's four options · annual testing · annual tank inspection · contamination limitation | Taumata Arowai, Health NZ, HE10148, MBIE, MPI, Get Ready |
| **AU (12)** | rolling boil (NSW) · at least one minute (WA) · 2 drops/L (NSW) · strength table (WA) · filter classes and microns (NSW) · filters do not disinfect (WA) · certification · UV (NSW) · UV (WA) · NSF 55 Class A · operator testing schedules · contamination limitation · NHMRC source selection | NHMRC, NSW Health, WA Health |

**No claim serves both markets** — a test enforces it — so nothing can be reused across the Tasman. enHealth is
recorded under `unavailableSources` as **SOURCE_UNAVAILABLE / NOT RELIED UPON**, is cited by no claim, and appears in
neither block; a test checks that too.

## 5. The six gates

`admin-import/audit/treatment.ts`, run in `prepareResource` on each market's **finished** file — the resource's own
text *and* its injected safety blocks — so a block's figures are held to the same registry.

| Gate | Fires on | Passes only on |
|---|---|---|
| `UNSOURCED_BLEACH_RATIO` | a quantity and unit in a bleach, chlorine, hypochlorite, disinfect or tablet sentence | a market-matched registry entry |
| `UNSOURCED_BOIL_TIME` | a duration attached to the boiling itself ("boil … for N minutes", "N minutes' rolling boil") | a market-matched entry. **Altitude or elevation wording near boiling always fails** — nothing can source it |
| `UNSOURCED_FILTER_CLAIM` | a filter noun with an efficacy claim (removes, kills, makes safe, a pathogen, a micron value, a percentage) | a market-matched entry; micron values only with their NSW attribution, never in NZ |
| `UNSOURCED_UV_CLAIM` | UV with a dose unit, a percentage, or a performance verb | AU entries only; in NZ, naming UV as an option is all that passes |
| `UNSOURCED_TESTING_INTERVAL` | an interval in a testing, sampling, laboratory or inspection sentence | NZ annual testing and annual tank inspection; AU only with the operator label |
| `UNSAFE_CONTAMINATED_SOURCE_GUIDANCE` | a contamination term with a treatment verb | **the document must also carry that market's approved limitation.** Silence fails |

**Two properties worth naming.** A **table** is read as claims too: a matrix whose header says "Removes Bacteria" has
every body row turned back into the claim it makes, which is how the legacy OG-09 matrix is caught — **30 findings per
market**. And **prep fails closed without a registry**: with none supplied, nothing is approved and every claim fails.

**Gate results:**

| Check | Result |
|---|---|
| NZ block in NZ, AU block in AU | **0 findings** |
| NZ block in an AU file | **5 findings** — bleach ratio, boil time, filter claim, MBIE options, annual testing |
| AU block in an NZ file | **6 findings** — both state ratios, three filter claims, the UV claim |
| Legacy OG-09 matrix | **30 findings** in each market |
| The 34 live prepared files | **0 findings** — every existing claim matched an approved entry |
| Rebuilt OG-09 | **0 findings** in both markets |

## 6. OG-09 rebuilt structure

| Part | What it is now |
|---|---|
| Cover | *"Start with your water source, not the hardware"* — market-specific, no buying promise |
| Intro | source first, six steps, and a plain statement that **some contamination cannot be treated at home at all** |
| **A. NZ method table** | 8 rows — boiling, bleach, purification tablets, filters and purifiers, UV, adding chlorine, testing, distillation — each with *what NZ guidance supports*, *what it does not do*, and its source |
| **B. AU method table** | 9 rows — source selection (NHMRC), boiling, bleach, sediment and cartridge filters, activated carbon, membranes and reverse osmosis, UV, testing, distillation — each labelled national or state |
| Decision ladder | six steps, market-specific: name the source → check for a warning → is household treatment appropriate at all → only then a method → respect the limits → if uncertain, do not drink it |
| **C. Worksheet** | the owner's six questions, in order, plus a backup-method line. The cost and replacement-cost fields are gone |
| Maintenance and testing | "follow the manufacturer's instructions" plus each market's sourced position; no invented intervals |
| Closing | what the member decided, and the instruction to get official advice if anything is uncertain |
| Blocks | **Making water safe to drink** (new) and **Storing drinking water** |

## 7. Change table

**17 approved changes, all applied.** Every `from` string was cut from the legacy file by script, so nothing was
transcribed by hand.

| # | Where | Markets | What changed |
|---|---|---|---|
| 1 | Cover week label | both | "Week 2 — Water, Food & Air" removed |
| 2 | Cover label | both | "OffGrid056 30-Day Programme" → "OffGrid056 Member Library" |
| 3–4 | Cover subtitle | NZ / AU | "so you buy the right tool" → source-first, market-specific |
| 5 | Page headers (×2) | both | "Asset OG-09 | Day 9" → "Water · Treatment" |
| 6 | Intro box | both | "use this matrix to match your source" → the fail-safe order |
| 7 | Method heading | both | "Filtration Method Comparison" → "What Each Method Does — and Does Not — Do" |
| 8–9 | **Method table** | NZ / AU | the 9-row efficacy matrix, its costs, the Berkey-style row, all-Yes claims, carbon "bacteria Partial", ceramic "viruses Partial", distillation and portable-pump rows → two sourced market tables |
| 10–11 | **Decision framework** | NZ / AU | "Creek / stream / lake: Sediment filter + UV, or RO" → the six-step ladder with the warning check first |
| 12 | Worksheet heading | both | "My Water Source & Filter Selection" → "…& Treatment Decision" |
| 13 | **Worksheet** | both | source ticks and cost fields → the six questions; "cite from matrix above" gone |
| 14 | Maintenance heading | both | "Maintenance Reminder Schedule" → "Maintenance and Testing" |
| 15–16 | **Maintenance table** | NZ / AU | monthly/3–6/6–12/12–24-month intervals and $20–$200 costs → manufacturer's instructions plus sourced testing |
| 17 | Closing | both | "Day 9 Complete", the next-day pointer and "no more guessing at the hardware store" → what you decided |

**Not changed, deliberately:** the running header still reads *"Filtration Comparison Matrix"*, because the resource
keeps its title (see item 8).

## 8. Proposed metadata

| Field | Value | Basis |
|---|---|---|
| foundation | **water** | audit HIGH |
| category | **water-security** | treatment and safety, not storage or collection |
| resourceType | **guide** | the audit inferred "worksheet"; after the rebuild it is a method table plus a decision worksheet |
| difficulty | **beginner** | INFERRED — six decision steps, no calculation |
| estimatedTime | **20 min** | INFERRED — six steps, one market table, one maintenance table |
| description | "Work out whether your water needs treating, whether treating it at home is appropriate at all, and which methods official guidance supports — with the limits of each, and when to ask for official advice." | replaces the buying-matrix subtitle |
| safety blocks | stored-drinking-water, water-treatment | both owner-approved |
| relatedResources | res-1008 (OG-08), res-1010 (OG-10) | the stored-water fallback and the collection system |
| **title** | **unchanged — "Water Filtration Comparison Matrix"** | a rename (e.g. "Water Treatment & Source Guide") suits the rebuilt content but changes the slug and the route. **Owner decision; not taken here.** |

## 9. NZ PDF readiness

| Check | Result |
|---|---|
| File | `water-filtration-comparison-matrix.NZ.pdf` · **8 pages** |
| PDF title | Water Filtration Comparison Matrix — OffGrid056 |
| Emergency numbers | **111 only** |
| Blocks | Making water safe to drink · Storing drinking water |
| Treatment gates | **0 findings** |
| AU wording | **none** — no NSW, WA Health, micron, rolling boil, "Australian", 000, SES, Bureau of Meteorology |
| Removed content | no Berkey, no prices, no "Removes Bacteria", no maintenance intervals, no "Quick Decision Framework", no "Creek / stream / lake:" |
| Legacy | no OG code, no "Asset", no "Day 9 Complete", no "Week 2", no 30-Day Programme |
| Tokens · VERIFY | none |
| `import:verify-prep` | **pass** |
| Record | draft |

## 10. AU PDF readiness

| Check | Result |
|---|---|
| File | `water-filtration-comparison-matrix.AU.pdf` · **9 pages** |
| PDF title | Water Filtration Comparison Matrix — OffGrid056 |
| Emergency numbers | **000 (and 112) only** |
| NZ wording | **none** — no MBIE, Taumata Arowai, HE10148, NIWA, 111, Civil Defence, "New Zealand" |
| National vs state | NHMRC labelled national; every NSW and WA figure labelled by state; "no single national Australian ratio" present |
| Operator testing | present **and labelled** "for private water supply operators, not for households" |
| Everything else | as NZ: gates 0, removed content gone, legacy gone, draft |

## 11. Tests

**361 passing** (328 → **+33**). Lint clean, typecheck clean.

- **23 new in `tests/unit/treatment.test.ts`** — the blocks pass their own gates; the storage block still passes; each
  of the six gates blocks an invented figure; a standing time is not misread as a boil time; altitude always fails;
  micron values are AU-only; NZ carries no UV performance claim; a matrix table is read as claims; the registry has no
  cross-market claim and records source, authority, applicability and status for every entry; enHealth is not relied
  upon.
- **7 new for OG-09 in `prep.test.ts`** — the matrix, brand, prices and intervals are gone; the creek shortcut is
  replaced by the fail-safe order; each market keeps its own figures; Australian guidance is labelled national or
  state; what nobody publishes is stated as such; the six questions are in order; the blocks and the title decision are
  recorded.
- **3 new for the gates inside prep** — prep with **no registry blocks every market**; the same NZ-verified sentence
  passes NZ and blocks AU; a registered figure stops being flagged as needing a source, and still flags in the market
  it is not registered for.

## 12. Deployment readiness recommendation

**Ready to deploy as #18 — after your content approval, which is what ruling 15 reserves.**

Everything mechanical is done: 17 of 17 changes applied, both markets publishable, validation passes, readiness
**READY_AFTER_FINAL_VALIDATION**, `import:verify-prep` passes on all **36** files, and the OG-09 PDFs are clean in both
markets. Nothing has been deployed and no member file has moved.

**Before any deployment, three things are yours to decide:**

1. **The rebuilt teaching content** (items 6 and 7) — this is the substantial rewrite ruling 15 holds for you.
2. **The title.** Keep "Water Filtration Comparison Matrix", or rename it and accept a new slug and route.
3. **OG-08.** The new detector reads the *legacy* OG-09-era source text, and OG-08's legacy source teaches bleach
   dosing — so on re-preparation **OG-08 now requires the water-treatment block** and its prep reports
   `NEEDS_CONTENT_REVIEW`. **The deployed OG-08 is untouched** and its PDFs were not re-rendered. The choice is to add
   the block to OG-08 (a content change to a live resource, and its own review), or to record an owner decision that
   OG-08's storage block is sufficient because the migrated text teaches no treatment. **Until you decide, OG-08 cannot
   be re-prepared and re-deployed** — which only matters when something else changes it.

**If you approve the content**, the remaining steps are the usual ones: stage the two PDFs into `private-assets/`,
`npm run build:preview`, `import:verify-build`, routing checks, `wrangler deploy`, Access probes, with rollback
`d993cb64` retained.

**Stopped.** Not deployed. OG-B08 and OG-13 not started.

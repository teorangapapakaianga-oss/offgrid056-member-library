# Stage 9.68A — OG-01 final copy corrections and render prep

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **All corrections applied and validated. Nothing rendered, no PDFs, nothing deployed, OG-01 not added as protected resource #23.**

## What changed in this stage

1. Five questions reworded as ruled (Air 1, Shelter 5, Food 7, Energy 10; the rest kept).
2. Bands approved; labelled OWNER-DEFINED / OFFGRID056 SELF-ASSESSMENT SCALE; still no /100.
3. Member flow reordered as ruled; the electrical and fire blocks now sit in a labelled **Safety Notes** section after the assessment (§5).
4. **Rendering-architecture change (reported):** safety-block injection gained an opt-in placement marker. See §5.
5. No carbon monoxide question or block; no gas; no exemptions or dispositions.

## 1. The ten revised Part A questions (verbatim)

| Foundation | Question |
|---|---|
| **AIR** | 1. We do not regularly notice damp, condensation or visible mould in our home. |
| | 2. The air inside our home feels fresh rather than stuffy. |
| **WATER** | 3. We know where our household water comes from and how it reaches us. |
| | 4. We have identified a backup source of water we could use if our usual supply were interrupted. |
| **SHELTER** | 5. Our home holds warmth reasonably well and does not feel difficult to keep comfortable in colder weather. |
| | 6. Our roof, windows and doors keep the weather out, with no leaks or draughts. |
| **FOOD** | 7. We know what food we have available and where it is stored. |
| | 8. We rotate the food we store so that nothing is forgotten or out of date. |
| **ENERGY** | 9. We have a backup source of power for our essential needs (for example solar, a battery, a generator or a charged power station). |
| | 10. We have a safe backup plan for essential lighting, phone charging and food preparation if mains power is unavailable. |

Scoring instructions are unchanged: *"For each question, choose a number from 1 to 10. A 1 means it is not in place at all, a 5 means it is partly in place, and a 10 means it is fully in place and you feel confident about it. Score what is true today, not what you plan to do. Then add your two scores for each foundation to get a result out of 20."*

## 2. Band wording (verbatim)

> **OffGrid056 self-assessment scale — foundation bands**
> **2–9 · Starting Point** · **10–15 · Building Resilience** · **16–20 · Strong Foundation**
> *These bands are OffGrid056's own guide for choosing where to start. They are not an official rating, and a strong foundation does not mean nothing can go wrong.*

Introduction to the results: *"Add the two scores for each foundation and write the result below. Do not add the foundations together: each foundation stands on its own, and the aim is to see which ones need the most attention."* Each foundation has a "Your result (`__ / 20`)" and a "Your band" box. **No overall /100 score.** Recorded as OWNER-DEFINED / OFFGRID056 SELF-ASSESSMENT SCALE; the document says it is not scientifically validated, not approved by any government or agency, does not predict safety and is not a guarantee of preparedness.

## 3. Part B — Emergency Basics (verbatim, unscored)

> **PART B — EMERGENCY BASICS** — Part B is a quick check that the basics are in place. It is not scored and is not part of your foundation results. The detail lives in the dedicated resources listed under Where Next.

| Check | Question | Yes / Partly / Not yet | Notes |
|---|---|---|---|
| Smoke alarms | Our home has working smoke alarms. | *(member enters)* | *(member enters)* |
| Emergency water | Our household has stored emergency drinking water. | *(member enters)* | *(member enters)* |
| Emergency food | Our household keeps food that could support us through a disruption. | *(member enters)* | *(member enters)* |

No quantities, no durations.

## 4. Household Considerations (verbatim, unscored)

> **HOUSEHOLD CONSIDERATIONS** — These are not scored. Use them to note anyone or anything in your home that needs particular planning.
> - Communication — how we would stay in touch with each other and with others if phones or the internet were down
> - Children, older people, or anyone with disability or mobility needs
> - Essential medications or other health-related needs, including any equipment that needs power
> - Sanitation — how we would manage toilets and hygiene if services were interrupted
> - Heating and cooking fuel, where it applies to our home
> - Pets or animals, where they apply to our household

Followed by **Quick Household Facts** (*"Fill these in quickly. They give your results some context."*): property type · number of people in the household · primary heating source · primary water source · approximate monthly power bill · our biggest worry if the grid went down for several days.

## 5. Exact safety-block placement

**Member flow, in order:** Cover → How To Use This Scorecard → About This Scale → How To Score → Part A — Your Five Foundations → Your Foundation Results (with the bands) → Your Three Priority Foundations → Part B — Emergency Basics → Household Considerations (with Quick Household Facts) → **Safety Notes** → Where Next → Where You Are Now (closing) → the standing "Before you start" disclaimer.

**The Safety Notes section** (heading and introduction are approved copy; the blocks follow, intact):

> **SAFETY NOTES** — These safety notes apply to topics that came up in this scorecard: backup power and home batteries, and smoke alarms. Read them before you act on any of your answers.
> → **Batteries and electrical safety** (the full approved block, NZ or AU)
> → **Smoke alarms and fire safety** (the full approved block, NZ or AU)

**What did not move:** the short **"In an emergency"** box (111 NZ / 000 and 112 AU) stays at the **top**, where a hurried reader sees it first; the **"Before you start"** disclaimer stays at the **end**. Only the two topic blocks moved. Neither block is shortened, edited or weakened (tested: every word present, each exactly once).

**The limitation I found, and how it was handled.** The injector hard-coded "critical blocks first". Repositioning therefore needed a rendering change, which is now in place as an **opt-in marker**: a resource sets `safetyBlockPlacement: "safety-notes"` and carries `<!-- og056:safety-notes -->` in its own Safety Notes section. Every other resource is unchanged (default placement tested). Safeguards: (a) the emergency block and the disclaimer can never be moved; (b) if the marker is missing, the blocks go to the default places and the resource is held with `SAFETY_PLACEMENT_MARKER_MISSING` — never dropped; (c) the check that every block was placed still runs. While there I also made the injector's replacement text-safe (a "$" in a block body can no longer be read as a replacement pattern); no live block contains one, so nothing live changes.

## 6. Where Next (verbatim)

> **WHERE NEXT** — Each foundation has a resource in the library to take you further. Start with the one that matches your lowest result, and use the Household Risk Identifier when you want the wider picture.

| If this needs attention | Start with | What it helps with |
|---|---|---|
| Air | **Healthy Home Air Audit** | Walk through your home and look at damp, mould, ventilation and alarms in more detail. |
| Water | **Water Storage Calculator** | Work out how much water your household needs and what you hold now. |
| Shelter | **Warm Home Scorecard** | Look at warmth, insulation and heating room by room. |
| Food | **30-Day Pantry Builder** | Build up a food store your household will actually use. |
| Energy | **Battery Backup Planner** | Think through backup power for your essential needs. |
| Wider View | **Household Risk Identifier** | Look at the wider risks your household faces and what to tackle first. |

"30-Day Pantry Builder" keeps its existing library title. Library links: res-1013, res-1008, res-1015, res-1011, res-1019, res-1002. Collection at staging: `collections: ["start-here"]`.

## 7. Closing (verbatim)

> **WHERE YOU ARE NOW** — You now have a starting picture of your household across the five foundations. Score it again after you have made an improvement. This is your own guide: it is not an official rating, it does not predict safety, and it does not guarantee preparedness.

## 8. Final safety block set

`general-disclaimer`, `emergency-contact`, `batteries-and-electrical`, `fire-and-smoke-alarms`. **No gas. No carbon monoxide** (no universal CO question, no CO block). **No exemptions, dispositions or trims.** The pipeline reports nothing missing; the legacy fire topic is accounted for as REPLACED_BY_BLOCK in both markets.

## 9. Numeric findings

Both markets: **Bucket C = 0**; no price; no percentage. The only candidates are "20 minutes" (the document's time estimate), "monthly" (a prompt) and "30-Day" (the live title "30-Day Pantry Builder"), all not claims, plus the figures inside the two already-sourced approved blocks. 10L, 3 days, 7+ days and 72 hours remain removed and unregistered; the broad duration-of-supply rule is still not applied; OG-11 is untouched.

## 10. Tests and validation

**673 passing** (659 → 673: +14 — placement behaviour and fail-safe, revised wording, member flow, no CO). Lint clean · typecheck clean. Draft: ready in both markets, 0 findings, 0 flags, electrical and fire detectors satisfied by the carried blocks, no gas finding, no market leakage. **Existing library: 22 / 22 protected · 44 / 44 market files · Bucket C = 0**, `import:verify-prep` verified, no existing resource changed. `private-assets/`: original 64 files byte-identical. Worker unchanged (`db2fd12a-…`, rollback `fa23ec74-…`). `classify-the-21-live-resources` still scheduled.

## 11. Readiness to render

**Ready.** All your corrections are in, the placement is safe, and every gate is green. Next, on your word: render the NZ and AU PDFs with the same landscape-free portrait layout and run the PDF QA, then protected resource #23 and deployment as separate decisions.

# Stage 9.64 — OG-B09 owner rulings and migrated draft (final owner copy review, before rendering)

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Nothing deployed. No PDFs generated. OG-B09 is not added to the protected resources.** The draft exists only as owner-approved configuration (`approved-copy.json`, `metadata-review.json`) plus a dry-run HTML in the working folder, which has been deleted again.

## 1. Owner rulings — implementation

| # | Ruling | Implementation |
|---|---|---|
| 1 | Carry `solid-fuel-heating` | `safetyBlocks` and `approvedSafetyBlocks` = `["gas-and-lpg-general","solid-fuel-heating"]`. **No** disposition, exemption, trim or fuel exemption exists on the entry (tested), so nothing suppresses a trigger |
| 2 | Remove all six R-value targets | Removed from both markets; replaced by non-numeric text and **blank member-entered R-value fields** (current, and "level my installer or authority gave me", for ceiling / walls / floor). The insulation numeric detector stays active |
| 3 | Remove "built before 2008" | Removed; no replacement threshold |
| 4 | Remove efficiency percentages | Removed (300–400%, 65–85%, 80–90%, 100%, "Varies"); replaced by "compare the current energy-efficiency information or rating shown for each product, where available". No "most efficient / best / cheapest to run" |
| 5 | Remove prices and Running Cost | All six prices and the Low/Moderate/High column removed; **no relative bands**. Replaced by member-entered **Your Quote** and **Your Estimated Running Cost** |
| 6 | AU terminology | AU first reference **"Reverse-cycle air conditioner (heat pump)"**; NZ keeps "Heat pump". The change is market-scoped (`markets: ["AU"]`); there is no global replacement (tested). The AU file has no subsequent reference, so the "subsequent = reverse-cycle air conditioner" rule has nothing to apply to |
| 7 | Metadata | as approved (§2) |
| 8 | Structure | as approved (§9): purpose → non-numeric insulation guidance → audit → blank R-value fields → comparison → installer questions → household decision → closing |
| 9 | Hype / contradictions | "most efficient", "Luxury", "know exactly", "no power needed" vs "Grid Independent: No (gas supply)", "Complete", "which system fits your budget" — all removed; nothing replaced with new hype |
| 10 | Flued gas row | verbatim in §6; no gasfitter / servicing / installation / CO wording |
| 11 | Wood-burner row | verbatim in §7; no safety wording duplicated from the block |
| 14 | Market separation | NZ and AU copy changes are separate; no NZ R-values, no inferred AU R-values; AU uses the approved AU gas body and the solid-fuel block's existing AU body (publishable, so valid) |

## 2. Metadata (as approved)

| Field | Value | Basis |
|---|---|---|
| Title | Insulation & Heating Upgrade Checklist | from the cover |
| resourceType | checklist | audit HIGH |
| foundation | shelter | audit HIGH |
| category | insulation | existing shelter category |
| difficulty | beginner | OWNER-APPROVED / INFERRED |
| estimatedTime | 30 minutes | OWNER-APPROVED / INFERRED |
| description | Check each room's insulation, then compare heating options against your own quotes and priorities before you decide what to upgrade. | owner-approved |
| tags | `[]` | convention |
| status | draft | |
| relatedResources | `[]` | none proposed — see decision 6 |

## 3. Final required block set

`general-disclaimer`, `emergency-contact`, **`gas-and-lpg-general`** (NZ and AU), **`solid-fuel-heating`** (NZ and AU). Required-and-missing: none. Gas set per market: `gas-and-lpg-general` only, available and approved. **No other gas block** — the draft's own text triggers none (tested).

## 4. NZ / AU differences

| | NZ | AU |
|---|---|---|
| Insulation guidance | "…ask your insulation installer or **your council**…" | "…ask your insulation installer or **your state or territory building authority**…" |
| First heating row | Heat pump | Reverse-cycle air conditioner (heat pump) |
| Gas block | full NZ general body (6 paragraphs, WorkSafe NZ) | AU general core (2 paragraphs) |
| Solid-fuel block | NZ body | AU body |
| Emergency block | 111 | 000 / 112 |
| Everything else | identical | identical |

No R-value, price or percentage appears in either market. No NZ wording is in the AU file and no AU wording is in the NZ file (checked).

---

# 5. VERBATIM — A. The complete six-row heating comparison

Introduction (both markets): *Prices, running costs and efficiency figures are not shown here, because they depend on your home, your supplier and the product. Fill in your own quotes and estimates, and compare the current energy-efficiency information or rating shown for each product, where available.*

**NZ — columns:** Heating Type ¦ Typically Used For ¦ Needs Electricity To Run? ¦ Fuel Or Supply ¦ Your Quote ¦ Your Estimated Running Cost

| Heating Type | Typically Used For | Needs Electricity To Run? | Fuel Or Supply | Your Quote | Your Estimated Running Cost |
|---|---|---|---|---|---|
| Heat pump | Main heating for living areas | Yes | Electricity | *[member enters: Your quote]* | *[member enters: Your estimate]* |
| Wood burner | Backup heat and atmosphere | Usually no | Firewood | *[member enters: Your quote]* | *[member enters: Your estimate]* |
| Flued gas | Quick heat | Depends on the model | Needs a gas supply | *[member enters: Your quote]* | *[member enters: Your estimate]* |
| Panel / convection | Extra heat in small rooms | Yes | Electricity | *[member enters: Your quote]* | *[member enters: Your estimate]* |
| Underfloor electric | Heating tiled floors | Yes | Electricity | *[member enters: Your quote]* | *[member enters: Your estimate]* |
| Central ducted | Heating the whole house | Usually yes | Varies by system | *[member enters: Your quote]* | *[member enters: Your estimate]* |

**AU — identical, except the first row's first cell:** *Reverse-cycle air conditioner (heat pump)*.

Below the table (both markets), a "Your Notes On The Options" box — *What suits your household:* "Which options suit the rooms I want to heat?" · "Which options still work during a power cut, and does that matter to my household?" · "Notes".

# 6. VERBATIM — B. The complete Flued gas row (NZ and AU identical)

| Flued gas | Quick heat | Depends on the model | Needs a gas supply | *[member enters: Your quote]* | *[member enters: Your estimate]* |
|---|---|---|---|---|---|

HTML: `<tr><td>Flued gas</td><td>Quick heat</td><td>Depends on the model</td><td>Needs a gas supply</td><td><input … placeholder="Your quote"></td><td><input … placeholder="Your estimate"></td></tr>`

It contains no "gasfitter", "licensed", "servicing", "install", "carbon monoxide", "cylinder", "leak", "unflued" or "ventilation" (tested). The label "Flued gas" alone raises the gas check, which is satisfied by `gas-and-lpg-general`.

# 7. VERBATIM — C. The complete wood-burner row (NZ and AU identical)

| Wood burner | Backup heat and atmosphere | Usually no | Firewood | *[member enters: Your quote]* | *[member enters: Your estimate]* |
|---|---|---|---|---|---|

No chimney, flue, clearance, ash, fire or carbon-monoxide wording (tested); all of that is the `solid-fuel-heating` block's.

# 8. VERBATIM — D. The insulation guidance

**NZ**

> **Insulation Levels To Aim For** — Minimum insulation requirements vary, so ask your insulation installer or your council what applies to your home, and write the levels you are given in the R-value fields below. Higher R-values mean less heat loss.

**AU**

> **Insulation Levels To Aim For** — Minimum insulation requirements vary, so ask your insulation installer or your state or territory building authority what applies to your home, and write the levels you are given in the R-value fields below. Higher R-values mean less heat loss.

**Room-by-Room Insulation Audit (both markets).** *Walk through each room. Write the R-value where you know it — your installer or your records will have it — and leave it blank if you do not. Note the windows, any drafts, and how urgent each room feels to you.*
Table: Room ¦ Ceiling Insul. ¦ Wall Insul. ¦ Floor Insul. ¦ Windows ¦ Drafts ¦ Priority — rows Living room, Main bedroom, Second bedroom, Bathroom, Kitchen; each cell a blank entry (R-__ , R-__ , R-__ , Type, Y/N, 1-5 as placeholders).

**Your R-Values (both markets).** *Enter the figures your installer or authority gives you.* Six blank lines: "Ceiling — current R-value" · "Ceiling — level my installer or authority gave me" · "Walls — current R-value" · "Walls — level my installer or authority gave me" · "Floor — current R-value" · "Floor — level my installer or authority gave me".

# 9. VERBATIM — E. The installer / supplier question section (both markets)

**Questions To Ask An Installer Or Supplier**

- What is the total installed cost for my home, in writing?
- What does the product's current energy-efficiency information or rating say, and how does it compare with the other options I am considering?
- What would it cost to run in my home, based on my own electricity or fuel supplier?
- Does it need electricity to run, and what happens in a power cut?
- Is it suitable for the size and layout of my home, and for the rooms I want to heat?
- Does it need any approval or consent where I live?
- What upkeep does it need, and who does it?

**Your Decision** — *Household decision and next actions.* Four blank lines: "The options I am considering" · "The quotes I still need" · "What matters most to my household" · "My next step".

# 10. VERBATIM — F. The closing section (both markets)

> **Where You Are Now** — You have a picture of each room's insulation and a side-by-side view of your heating options. Use them, together with written quotes and an installer's advice, to decide which upgrades suit your household. There is no single best heater for every home.

**Other member-facing text.** Cover label: *OffGrid056 Member Library*. Cover title: *Insulation & Heating Upgrade Checklist*. Cover subtitle: *Check each room's insulation, then compare heating options against your own quotes and priorities before you decide what to upgrade.* Page header: *Shelter · Insulation*. Then the approved safety blocks (standing disclaimer, `gas-and-lpg-general`, `solid-fuel-heating`) and the emergency box — unchanged approved wording, not authored here.

---

# 11. Numeric scan (draft, per market)

| | NZ | AU |
|---|---|---|
| Bucket C | **0** | **0** |
| R-values in text | **0** (the legacy six removed; blank fields only) | **0** |
| Prices in text | **0** (legacy six removed) | **0** |
| Percentages in text | **0** | **0** |
| "2008" / construction-year threshold | **0** | **0** |
| Superlatives / "luxury" / "know exactly" | none; the word "best" appears once, in the negation "no single best heater" | same |

# 12. Price scan

Prices in output: **0**. Legacy-only prices recorded as removed evidence: 6 ($1,500–$3,500, $2,000–$5,000, $1,500–$4,000, $100–$500, $3,000–$8,000, $8,000–$15,000). No price disposition was needed and none was created. Content flags: **0** (the three efficiency `figure-needs-source` flags and the two legacy-name flags are gone).

# 13. Safety / gas / solid-fuel scan

- Own-text gas check: raised by the label "Flued gas" → set `gas-and-lpg-general`; **unavailable: none**, both markets.
- **Unintended gas blocks: 0** — own text triggers no unflued, cylinder, leak or installation topic.
- `solid-fuel-heating`: carried; the legacy topic is accounted as REPLACED_BY_BLOCK in both markets (no disposition used); `gas-and-lpg` likewise (the general block answers it).
- Safety-removal findings: 0. Market problems: 0. Both markets publishable; readiness `READY_AFTER_FINAL_VALIDATION` as a draft.
- Market separation: no NZ wording in the AU file and no AU wording in the NZ file.

# 14. Existing library and tests

| | |
|---|---|
| Existing library | **21 / 21 READY · 42 / 42 market files · Bucket C = 0** · 0 price / safety-removal / gas findings · `import:verify-prep` verified |
| Tests | **610 passing** (599 → 610: +11 for the rulings and the migrated draft). Lint and typecheck clean |
| Note | on one full run, two tests in `importer.test.ts` timed out under load; they passed in isolation and on the next full run (610/610). They read the source documents on OneDrive and are timing-sensitive |
| Private assets | 64 files; none modified (newest = the OG-17 deploy, 07:26) · no PDF generated · Worker unchanged `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |

# 15. Readiness for PDF rendering

**Ready for rendering once you approve this copy.** The draft passes every gate: ready, publishable in both markets, 0 numeric / price / flag / safety findings, correct block set. Rendering, the protected-resource entry and deployment are separate steps that need your word.

# 16. Exact remaining owner decisions

1. **Approve the copy** in §5–§10 as the final owner copy (or mark changes).
2. **Three editorial facts in the table are my wording, not sourced:** wood burner "Usually no" electricity; flued gas "Depends on the model"; central ducted "Usually yes". They are hedged and I believe true, but confirm — or replace any with a blank "Check the model" prompt.
3. **Role phrases** — "Main heating for living areas", "Backup heat and atmosphere", "Quick heat", "Extra heat in small rooms", "Heating tiled floors", "Heating the whole house": confirm they are acceptable descriptions rather than rankings.
4. **The insulation text asserts only that requirements "vary"** and points to the installer / council / authority — no code is named in either market, so nothing in it needs a source. Confirm that is what you want.
5. **"There is no single best heater for every home"** contains the word "best" in the negation; confirm.
6. **relatedResources** is empty. OG-15 (Warm Home Scorecard) and OG-17 (Solid Fuel Heating Planner) are natural links — say if you want them.
7. **Approve rendering** (PDFs, both markets) as the next step, and separately the protected-resource entry and deployment (#22).

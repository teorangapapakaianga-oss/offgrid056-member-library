# Stage 9.63 — OG-B09 claims-first migration preparation

**Date:** 6 October 2026 · **Model:** Sonnet 5.5 · **Nothing deployed. No PDFs generated. OG-B09 is NOT migrated or rendered** (a dry-run `import:prep` was used to read the pipeline's own verdict; its working output was deleted and the 21-resource prep report restored).

## 1. Approval-status updates (applied, wording unchanged)

| Item | Before | After |
|---|---|---|
| NZ wording — `gas-and-lpg-general`, `unflued-gas-heating`, `gas-cylinder-safety`, `gas-leak-response`, `gas-installation-and-servicing` | PENDING | **OWNER-APPROVED 2026-10-06 (Stage 9.63)** |
| `nz-gas-heater-clearance-one-metre-worksafe` | pending | **OWNER-APPROVED** |
| `nz-lpg-cabinet-heater-service-12-months-worksafe` | pending | **OWNER-APPROVED** |
| `nz-gas-other-heater-service-two-years-worksafe` | pending | **OWNER-APPROVED** |

Ownership (`owningBlock`), market, jurisdiction, wording, limitations and source provenance of the three claims are unchanged; scope not broadened. AU state unchanged and locked: general, cylinder and installation **AU OWNER-APPROVED**; unflued and leak **AU FAIL-CLOSED / no served body**. The NZ body text of every block is byte-identical to the reviewed wording (the diff shows only status/pending lines). `pendingOwnerApproval` is now `[]` for the three AU-approved blocks and `["AU"]` for unflued and leak (no AU body, nothing to approve). Tests that encoded "pending" were updated to simulate a pending block instead (a pending block still satisfies nothing); the registry test now requires block-owned claims to be `OWNER-APPROVED` and **never ahead of their block's wording**.

## 2. Post-approval validation

| Check | Result |
|---|---|
| lint / typecheck | clean / clean |
| full suite | **599 passing** (588 → 599: +11 OG-B09 claims-first tests) |
| 21-resource prep | **21 / 21 READY** |
| market files | **42 / 42**; `import:verify-prep` all verified |
| Bucket C (numeric) | **0** |
| price / safety-removal findings | 0 / 0; content flags 0; market problems 0; other findings 0 |
| gas validation | 0 unexpected gas requirements; no live resource carries or requires a gas block |
| treatment validation | unchanged (treatment suite green; treatment precedence tested) |
| private-asset diff | 64 files; **none modified** (newest is the OG-17 deploy, 07:26 today); no PDF generated |
| Worker | unchanged `fa23ec74-85d2-4d91-b484-3f037ccbe38b` |

One validator change this stage, reported: the numeric scanner **did not see insulation R-values** ("R-2.9" carries no unit it knew), so OG-B09's six R-value targets passed the numeric gate invisibly. A new `insulation` category now detects `R-2.9`, `R-3.3+`, `R 1.3` and similar, in both markets. No live resource contains one (the library stays 21/21, Bucket C 0). Nothing is registered automatically.

## 3. OG-B09 legacy source — what it actually is

An 11.9 KB HTML (plus a 442 KB PDF of the same content): a cover, an R-value target line, a blank room-by-room insulation audit table, a six-row "Heating Options Comparison" table, and a closing line. **It is NZ-framed** ("NZ Building Code"). It contains **no** gas instruction, no servicing, installation, ventilation or carbon-monoxide text, no lifespans and no running-cost figures — only the single "Flued gas" row.

## 4. Legacy claim inventory and classification

KEEP · VERIFY · REWRITE · REMOVE · KEEP_AS_EXAMPLE. "Legacy" is not a reason to keep a figure.

| # | Legacy text | Class | Notes |
|---|---|---|---|
| 1 | "OffGrid056 Action Plan Plus" (cover) and "Bonus Asset \| Tier 3" | **REMOVE** | legacy programme/product naming (content flags `product-name`, `programme-sequencing`); already handled by the re-skin/approved-copy mechanism |
| 2 | Subtitle: "Room-by-room insulation assessment, R-value targets, and heating options comparison. Know exactly what to upgrade and in what order." | **REWRITE** | "know exactly" and "in what order" overclaim — the document gives no ordering. "R-value targets" goes if the targets go |
| 3 | "R-Value Targets (NZ Building Code)": Ceiling R-2.9 min (R-3.3+ recommended); Walls R-1.9 min (R-2.0+); Floor R-1.3 min (R-1.9+) | **VERIFY → recommend REMOVE the figures** | **NZ only; market: NZ.** Six fixed numeric claims. They look like an older Building Code edition — **unconfirmed**: MBIE's H1 page returned an empty page / a 404 on this stage's live reads, so this is **SOURCE_UNAVAILABLE / NOT RELIED UPON** and nothing is asserted about current values. Source needed: the current NZ Building Code clause H1 / Acceptable Solution (MBIE, Building Performance). Safety significance: low (comfort/energy), but it is presented as a code minimum. Numeric impact: 6 × `insulation`, now blocking. **AU: not applicable** — Australia uses the NCC by climate zone, which this document never read; no AU target is available |
| 4 | "If your home was built before 2008, it likely falls well below these targets." | **REMOVE** (or VERIFY) | NZ-only, date-bound, unsourced; depends on #3 |
| 5 | "Every R-value improvement reduces heat loss proportionally." | **REWRITE** | an overstatement (heat loss falls as R rises, not in proportion to the increase). Safe non-numeric rewrite: "Higher R-values mean less heat loss." |
| 6 | Room-by-room insulation audit table (5 rooms × ceiling, wall, floor, windows, drafts, priority) | **KEEP_AS_EXAMPLE** | blank worksheet; no figure, no claim |
| 7 | Heating comparison: **Upfront Cost** column (6 price ranges) | **REMOVE** (see §5) | |
| 8 | **Running Cost** column: Low / Low / Moderate / High / High / Moderate | **REMOVE** | six unsourced relative claims; internally dubious (wood "Low" depends entirely on the fuel supply; "Moderate" for gas and ducted depends on tariff and house); not a figure, but a performance claim |
| 9 | **Efficiency** column: 300–400% (heat pump), 65–85% (wood burner), 80–90% (flued gas), 100% (panel and underfloor), "Varies" (ducted) | **VERIFY → recommend REWRITE non-numeric** | see §6 |
| 10 | **Grid Independent?** column: Heat pump No; Wood burner Yes; **Flued gas "No (gas supply)"**; panel/underfloor/ducted No | **REWRITE** | binary answers are wrong in places: a gas heater on an LPG cylinder does not need the gas network; many flued heaters need power for a fan. It also **contradicts row 25's own "no power needed"**. Rewrite as "Needs electricity to run? / Needs a fuel supply?" with conditional wording |
| 11 | Best For: "Primary heating, most efficient" (heat pump) | **REWRITE** | "most efficient" is a universal superlative — the owner's brief forbids a "best heater" |
| 12 | Best For: "Backup + ambiance" (wood burner) | **KEEP** (light edit) | editorial use description |
| 13 | Best For: "Quick heat, no power needed" (flued gas) | **REWRITE** | "no power needed" is unsupported and contradicts #10 |
| 14 | Best For: "Supplementary, small rooms" (panel) | **KEEP** | |
| 15 | Best For: "Luxury, tile floors" (underfloor) | **REWRITE** | "luxury" is hype; keep "tiled floors" as a use |
| 16 | Best For: "Whole-house even heat" (central ducted) | **VERIFY → REWRITE** | "even heat" is a performance claim; "heats the whole house" is descriptive |
| 17 | Closing: "Now you know every room's insulation status and which heating system fits your budget, efficiency goals, and resilience needs." | **REWRITE** | the document never says which system fits; "budget" implies the removed prices |
| 18 | Heater type labels: Heat pump, Wood burner, Flued gas, Panel / convection, Underfloor electric, Central ducted | **KEEP** (AU term: see §9) | |

**Not present anywhere in the legacy source** (audited and recorded so they are not assumed): lifespans, installation cost (separate from upfront cost), servicing intervals, carbon-monoxide or ventilation text, household-suitability criteria beyond the Best-For column, energy-use figures, and any gas safety instruction.

## 5. Price inventory

Six prices, each appearing in the header cell and the data cell (the pipeline reports each twice, NZ and AU): **$1,500–$3,500** (heat pump), **$2,000–$5,000** (wood burner), **$1,500–$4,000** (flued gas), **$100–$500** (panel), **$3,000–$8,000** (underfloor), **$8,000–$15,000** (central ducted).

| Price | Classification |
|---|---|
| all six | **REMOVE.** Prices are not evergreen, carry no currency label in the source (NZ$ and AU$ differ), and are undated and unsourced. They are the reason the price gate fires (`UNDISPOSED_PRICE`, 24 findings across both markets) |
| their eventual home | **FUTURE PRICING SYSTEM** — not built in this stage and not stubbed. Nothing in the rebuild may imply a number |
| NON-NUMERIC CATEGORY ONLY | The column is replaced by a member-fill field ("Your quote"), **not** by relative bands (`$`, `$$`, "lower/higher"), because a relative band is itself an unsourced comparison. If you want bands, that is an owner decision |

## 6. Numeric claim inventory (legacy, both markets identical)

| Figure | Category | Gate today | Class |
|---|---|---|---|
| R-2.9, R-3.3+, R-1.9, R-2.0+, R-1.3, R-1.9+ | insulation (new) | **C_NEEDS_SOURCE, blocking** | VERIFY (source unavailable) → recommend REMOVE |
| $1,500–$3,500 · $2,000–$5,000 · $1,500–$4,000 · $100–$500 · $3,000–$8,000 · $8,000–$15,000 | currency | C, **not** numerically blocking (currency is excluded) — **blocked by the price gate** | REMOVE |
| 300–400% · 65–85% · 80–90% | percentage | C, not numerically blocking (percentage is excluded) — **blocked by the `figure-needs-source` content flag** (→ NEEDS_CONTENT_REVIEW) | VERIFY → recommend REWRITE non-numeric |
| 100% (panel, underfloor) | percentage | D, "column total" rule | still a performance claim → REMOVE with the column |
| 2008 | year | structural | goes with #4 |

**Efficiency figures — VERIFY detail.** *Market:* NZ (the document is NZ-framed; no AU equivalent was audited). *Exact claims:* heat pump 300–400%; wood burner 65–85%; flued gas 80–90%; panel and underfloor 100%. *Source needed:* an NZ official efficiency source (EECA or equivalent), read live, and separately for AU an Australian source (GEMS/energy-rating) — NOT researched this stage. *Safety significance:* low to moderate — it steers a gas-versus-electric decision but not an operating-safety action. *Numeric impact:* percentages do not block numerically, so **only the content flag stops them**; an unsupported figure must be removed or sourced, and the recommendation is a non-numeric replacement ("check the efficiency rating on the product's label or data sheet").

**Registry:** nothing is registered for OG-B09, and nothing needs to be if the figures are removed. No exemption is created.

## 7. Gas trigger audit

- **The only gas content is one table row: "Flued gas".** The legacy row triggers gas teaching through *an appliance beside a figure* (`flued gas $1…`, a price and an efficiency band).
- **Two routes both give the same answer.** (a) Audit/source topic `gas-and-lpg` on the extracted text. (b) The pipeline's own-text fuel check `GAS_SAFETY_REQUIRED: "Flued gas"` — which fires on the **label alone**, with or without the figures.
- **Consequence for the rebuild:** removing the prices and percentages does **not** remove the gas requirement; the label "Flued gas" still raises the fuel check and requires `gas-and-lpg-general`. The only ways to avoid it would be deleting the row (a content loss) or a fuel exemption (not created, not authorised). Carrying the approved general block is the owner's ruling. **Tested.**
- **Detector-required gas block: `gas-and-lpg-general` only** (NZ and AU). **Not required** (0 mentions, tested): `gas-installation-and-servicing`, `carbon-monoxide`, `unflued-gas-heating` (the row says *flued*), `gas-cylinder-safety`, `gas-leak-response`.
- **Trap in the rewrite:** do **not** put "ask a licensed gasfitter" or "install/service" beside "gas heater" in the table — that wording is itself a gas-installation trigger (`GAS_LICENSING`) and would pull in `gas-installation-and-servicing`. The general block and the standing disclaimer already route members to a gasfitter. The proposed Flued-gas row below avoids it.

## 8. Required safety blocks (the pipeline's own verdict, dry run)

| Block | Status | Why |
|---|---|---|
| `general-disclaimer`, `emergency-contact` | always | standing |
| **`gas-and-lpg-general`** | **REQUIRED — gas, NZ and AU** | the "Flued gas" row (fuel check + legacy figures). Available and owner-approved in both markets |
| **`solid-fuel-heating`** | **REQUIRED by the audit as written — NOT a gas block, needs your decision** | the "Wood burner" row; audit note: "covers solid fuel heating (4 mentions) with no flue maintenance and clearance warning". The pipeline reports it missing |
| `gas-and-lpg` (topic) | answered by `gas-and-lpg-general` (it declares `answers`) | |

The audit's other note ("covers gas appliances … with no ventilation and certified-installer warning") is a *source* observation. It is answered once the migrated text no longer **teaches** gas (the figures and the contradictory power claims go) and the general block is carried; it does **not** require the installation block, and I have not added it.

## 9. NZ / AU differences

| Topic | NZ | AU |
|---|---|---|
| Insulation targets | "NZ Building Code" figures in the legacy; source unverified | **No AU figure was ever in the document and none may be inferred from NZ.** The NCC sets values by climate zone — a state/zone-specific matter, not national guidance. Rebuild: non-numeric ("check the minimum for your climate zone with your building authority or installer") |
| Gas wording | full `gas-and-lpg-general` NZ body (6 paragraphs, WorkSafe NZ) | `gas-and-lpg-general` AU core (2 paragraphs: ventilation; "rules differ by state or territory") |
| Gas leak / unflued / cylinder | not required | not required; AU unflued and AU leak would fail closed if the content ever started to teach them |
| Heat pump | "Heat pump" | AU commonly "reverse-cycle air conditioner" — no term mapping exists in the market profiles; **OWNER-REVIEW REQUIRED** |
| Money | no currency label in source | would need NZ$/AU$ separation — avoided by removing prices |
| Wood burner | local authority / NZ rules | state/council rules — handled by the solid-fuel block if carried |

## 10. Proposed metadata — **every inferred field is OWNER-REVIEW REQUIRED**

| Field | Proposal | Basis | Status |
|---|---|---|---|
| Current member title | **Insulation & Heating Upgrade Checklist** | the legacy title, with the code and the "Action Plan Plus" label removed (the pipeline already produces this) | confirm |
| resourceType | `checklist` | audit HIGH | auto, confirm |
| foundation | `shelter` | audit HIGH; sits beside OG-15 / OG-17 | auto, confirm |
| category | **`insulation`** (alternative: `heating`) | the shelter categories include both; the document is insulation-first with a heating comparison | **OWNER-REVIEW REQUIRED** |
| difficulty | `beginner` | a blank audit and a comparison; OG-15 (assessment) is beginner | **OWNER-REVIEW REQUIRED** |
| estimatedTime | `30` | five rooms plus a comparison; OG-15 precedent (30) | **OWNER-REVIEW REQUIRED** |
| description | "Check each room's insulation, then compare heating options against your own quotes and priorities before you decide what to upgrade." | rewritten from the legacy subtitle (no "know exactly", no "targets") | **OWNER-REVIEW REQUIRED** |
| tags | `[]` | the heating resources (OG-15, OG-17) carry none; alternative `["insulation","heating"]` | **OWNER-REVIEW REQUIRED** |

The pipeline currently fails validation on exactly the three unset fields (category, difficulty, estimatedTime).

## 11. Proposed migrated structure (not rendered)

Principles: simple household decision support; a framework, not a verdict; no universal "best heater"; no price, efficiency or code figure; no safety wording duplicated (gas and solid-fuel safety live in their blocks).

**Cover:** Insulation & Heating Upgrade Checklist · subtitle (rewrite of #2). No legacy product or tier labels.

**1. Purpose** — "Use this checklist to see where your home loses heat and to compare heating options before you decide what to upgrade. It helps you gather information and ask better questions of an installer or supplier; it does not recommend a product."

**2. Insulation levels to aim for** *(non-numeric, market-specific text)*
- **NZ:** "The minimum insulation for new homes is set by the New Zealand Building Code. Ask your installer or council for the current minimum for your area, and write what they give you in the table below."
- **AU:** "The minimum insulation for new homes is set by the National Construction Code and depends on your climate zone. Ask your installer or building authority for the current minimum for your zone, and write what they give you in the table below."
- Followed by: "Higher R-values mean less heat loss." *(replaces #5; #3 and #4 removed)*

**3. Room-by-room insulation audit** — the legacy table, unchanged (KEEP_AS_EXAMPLE). Add three blank fields for ceiling, walls and floor: "Current R-value (from your records or installer)" and "Level your installer or authority gives for your home".

**4. Heating options comparison** — six rows; no price, running-cost or efficiency figure:

| Heating type | Needs electricity to run? | Fuel or supply | Your quote | Efficiency (rating label) | Often used for |
|---|---|---|---|---|---|
| Heat pump *(AU: reverse-cycle air conditioner — owner to confirm)* | Yes | Electricity | *(blank)* | *(blank — read the rating label or data sheet)* | Heating a main living area |
| Wood burner | Usually no | Firewood | *(blank)* | *(blank)* | Backup heat and atmosphere |
| **Flued gas** | Depends on the model | Needs a gas supply | *(blank)* | *(blank)* | Quick heat |
| Panel / convection | Yes | Electricity | *(blank)* | *(blank)* | Supplementary heat in small rooms |
| Underfloor electric | Yes | Electricity | *(blank)* | *(blank)* | Heating tiled floors |
| Central ducted | Yes | Varies by system | *(blank)* | *(blank)* | Heating the whole house |

(The "Flued gas" row deliberately says nothing about gasfitters or servicing — see §7.)

**5. Questions to take to an installer or supplier** — "Ask for the running cost and efficiency on the product's rating label or data sheet. Get quotes for your own home. Ask what the system needs to keep working during a power cut." *(non-numeric)*

**6. Close** — "Use your insulation audit and comparison to decide, with an installer or supplier, which upgrades suit your home, budget and resilience needs."

**Safety blocks carried:** `general-disclaimer`, `emergency-contact`, **`gas-and-lpg-general`** (both markets), and **either** `solid-fuel-heating` **or** an owner-recorded disposition (decision 1 below).

## 12. Claims-first readiness decision

**PREPARED — NOT READY TO RENDER.** The claims audit is complete and the rules the rebuild must meet are now tested. Rendering is blocked only by owner decisions (§13) and the config work that follows from them: approved-copy changes for the rewrites, a `metadata-review.json` entry, and the price/section dispositions. No figure needs registering if the recommendations are taken. If you instead want any R-value or efficiency figure **kept**, it needs a live-read official source first (NZ and AU separately) — currently SOURCE_UNAVAILABLE for the NZ Building Code.

## 13. Exact owner decisions required before rendering

1. **Wood burner / `solid-fuel-heating`:** carry the approved solid-fuel block (adds its fire-safety wording to a heating checklist), **or** record a disposition for the legacy topic (the row becomes a one-line comparison label with no instruction — I recommend `NON_TEACHING_CONTEXT` / REWRITTEN, but it is your call).
2. **R-value targets:** remove all six figures and the "built before 2008" line (recommended), or hold them until a current live-read NZ source exists. Confirm the non-numeric NZ and AU wording in §11.2.
3. **Efficiency percentages:** replace with "check the rating label" (recommended), or supply sources to keep any.
4. **Price column:** remove; confirm a member-fill "Your quote" column rather than relative bands.
5. **Running Cost Low/Moderate/High column:** remove (recommended) or give sources.
6. **Rewrites:** approve the wording changes #2, #5, #10, #11, #13, #15, #16, #17 (hype and contradiction fixes) and the proposed "Flued gas" row.
7. **AU term** for "heat pump" ("reverse-cycle air conditioner" suggested).
8. **Metadata:** confirm or change category (`insulation` vs `heating`), difficulty, estimatedTime, description, tags (§10).
9. **Confirm** that the migrated text carries `gas-and-lpg-general` and **no** other gas block, and that the "Flued gas" row must not mention gasfitters or servicing.

Nothing is deployed, no PDFs were generated, and Stage 9.64 is not started.

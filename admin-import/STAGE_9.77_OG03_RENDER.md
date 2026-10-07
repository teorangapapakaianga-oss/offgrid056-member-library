# Stage 9.77 — OG-03 Household Spending Capacity Check: final copy lock and PDF render

**Date:** 7 October 2026 · **Model:** Sonnet 5.5 · **Rendered and checked. NOT staged as protected resource #24, NOT deployed; no OG-03 file is in `private-assets/`; no live resource changed.** Live baseline: 23 / 23 protected · 46 / 46 market files · 0 broken links · Worker `e63141a1-380a-4770-a125-9fd7a15d0bdb` (rollback `7de9641f-df4c-4cab-8e84-055c0861879d`).
The PDFs are in the git-ignored `workspace/prep/OG-03/` (`household-spending-capacity-check.NZ.pdf`, `…AU.pdf`).

## 1 · The one wording change (applied exactly)
Savings helper text, Step 1 field 4 — now:
> **Savings you have chosen to make available for resilience projects. Keep any savings you want to protect for other purposes separate.**

The old sentence ("Savings you could use for resilience. Do not include retirement savings, or money you keep for emergencies.") is gone from both PDFs. **Proof that nothing else in the member-facing copy changed:** I regenerated the complete copy from the new render and diffed it against the approved Stage 9.76A review pack. The only wording difference is that one helper line; the only other differences are added writing lines (layout). Metadata and locked values are unchanged (Household Spending Capacity Check · general · planning-implementation · planning · worksheet · beginner · 15 minutes · draft · your exact description).

## 2 · NZ and AU PDFs
| | NZ | AU |
|---|---|---|
| File | `household-spending-capacity-check.NZ.pdf` | `household-spending-capacity-check.AU.pdf` |
| Size | 283,976 bytes | 283,712 bytes |
| **Pages** | **9** | **9** |
| Layout | **portrait throughout**, US-Letter (612 × 792 pt); no landscape page | same |
| `import:verify-prep` | verified | verified |

## 3 · Page map (same in both markets)
| Page | Content |
|---|---|
| 1 | Cover: *General · Planning* chip, *OffGrid056 Member Library*, title, subtitle, the approved OG-01 image, *Prepare • Adapt • Thrive* |
| 2 | In an emergency box (market-specific) · running header · **Why This Matters** · **The Honesty Rule** (with the single financial note) |
| 3 | **Step 1: Take a Financial Snapshot** — five fields with helper text |
| 4 | **Step 2: Work Out Your Available Capacity** — four prompts, two writing lines each |
| 5 | Step 2 closing: *If it helps* tip box · *What is left each month, using my own method* · *In my own words: what we can realistically allocate* |
| 6 | **Step 3: Choose a Realistic Spending Position** — four tick boxes and *Why this position fits us right now* |
| 7 | **Your Spending Capacity Decision** — five fields |
| 8 | **Where Next** — the seven-row table |
| 9 | **Where You Are Now** · the *Before you start* general disclaimer (market-specific) |
Layout decisions (no wording changed): each major section starts its own page and is kept whole; Step 2 needs two pages at generous line height, so the break is deliberate (prompts on page 4, the tip and the two summary fields together on page 5), which also fixed the first render where the last Step 2 field spilled onto the Step 3 page; the closing box and disclaimer sit together on the last page.

## 4 · Writing-space QA (every area checked on the page images)
- **Step 1:** all five fields have useful space — income, savings and the allocatable amount have one 46-px line each (single figures); **essential expenses and debt/commitments have two lines each** (they are lists).
- **Step 2:** all four prompts have **two** full writing lines each; the *what is left* field has one line; *in my own words* has **four** lines.
- **Step 3:** four clear lime-outlined tick boxes, one per position, each in its own card; *why this position fits us* has **three** lines.
- **Decision:** amount now (1 line), amount later (2), first priority (2), what I am not prepared to compromise (2), notes (3). Nothing was squeezed to save pages; two pages carry more white space than text on purpose (pages 5 and 9).

## 5 · Visual QA — every page of both PDFs inspected
Cover has **no dark shadow panel**, the title is fully readable, the approved OG-01 image and its lime border are intact, *Prepare • Adapt • Thrive* present. No clipping, no overflow, no orphan heading, no blank page, no broken or cut-off tick box, no cut-off writing area; the Where Next table is clear with the Advanced roadmap labelled *Later, for a larger plan*; the disclaimer is intact at the end. **AU is not assumed from NZ:** I compared every page pixel by pixel — pages 1 and 3–8 are **identical**, and only page 2 (the emergency box) and page 9 (the disclaimer's last sentence) differ; I also looked at the AU pages 2 and 9 directly.

## 6 · Final savings-field wording
As in §1.

## 7 · Safety-block result
Exactly the standing blocks: **In an emergency** (first, page 2) and **Before you start** (last, page 9), each once. No electrical, gas, fire/smoke, carbon-monoxide, generator, solid-fuel or water block. Safety-topic detection finds none.

## 8 · Market separation
The worksheet body is **identical** (3,955 characters each, and pixel-identical on seven pages). NZ: 111, "in New Zealand, that means a licensed electrical worker…", none of AU's wording. AU: 000 and 112, 106 TTY / State Emergency Service, "in Australia, that means a licensed electrician or licensed gasfitter", none of NZ's. No subsidy, agency, grant, tax or currency wording.

## 9 · Scans (HTML draft and the rendered PDFs)
| Scan | Result |
|---|---|
| Price scan | **0**; no currency symbol, price or percentage in the PDF text; **price claims = 0** |
| Numeric scan | **Bucket C = 0** (NZ and AU); only four Bucket D labels ("Monthly" ×2, "90-Day" ×2 in live titles); the digits in the PDFs are page, step and field numbers, the brand, "90" in the live titles, and the emergency numbers |
| Market scan | body identical; standing blocks correct per market |
| Safety scan | no topic; blocks = general-disclaimer + emergency-contact |
| Legacy-language scan | none of Week/Day labels, 30-Day Programme, Asset OG-03, footer URL, product names, Skool, "pillars", OG-04, internal codes, funnel wording; "tier" only inside "3-Tier Budget Planner" |
| OG-26 overlap | no shared phrase, none of OG-26's framework; OG-03 names OG-26 as the next step |
| Financial note | exactly one instance, in the owner's exact words |
| Soft claim / "less secure" | absent; planning principle present; no cost claim anywhere |
| PDF text verification | 40+ checks per PDF PASS (page count and blank pages, order and placement of every section, fields, helper text, positions and statement, decision fields, Where Next order, markets, blocks) |
| PDF metadata verification | title **"Household Spending Capacity Check — OffGrid056"** in both, no legacy code; producer and creation date present; every page 612 × 792 |
| Reading level | Flesch-Kincaid grade about 7; longest sentence 22 words |

## 10 · Validation
**736 tests passing** (727 + 9 new: savings wording, the four unchanged helpers, section page starts, and the 9.76A rulings) · lint clean · typecheck clean · `import:verify-prep` verified (OG-03 NZ and AU included) · `import:verify-build` verified (**23 records · 46 market files · 0 broken links**) · **Bucket C = 0** · Worker unchanged · `private-assets/` contains no OG-03 file · no OG-03 file in git (the PDFs are git-ignored).
Git changes this stage: the OG-03 entry in `admin-import/config/approved-copy.json` (the one wording change and the layout wrappers), the draft test, this report and the registers.

## 11 · Readiness to stage as protected resource #24
**Ready**, on your approval. Staging would copy the record (`res-1003`, `household-spending-capacity-check`) and the two PDFs into `private-assets/`, build the preview, and verify (expected: 24 records, 48 market files, 0 broken links, Bucket C 0); there is no demo placeholder with that slug or id, so no `route-policy.json` entry is needed. Deployment would be a separate decision with `7de9641f…`→`e63141a1…` retained as the rollback chain. Stopped before staging.

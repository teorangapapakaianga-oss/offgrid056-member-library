# Stage 10.28 — Remaining legacy batch triage (OG-B01, OG-B03, OG-B11, OG-B13, OG-B15)

## RESULT
**PASS.** Audit only, one batch. All five sources found and read; no source conflict. Nothing rewritten, rendered, covered, assigned an ID, staged or deployed.

## SUMMARY
Each resource has exactly one HTML/PDF pair in the OffGrid056 30-Day Programme archive (`…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source` and `\PDFs`, all dated 2 May 2026). No duplicates, renamed copies, earlier versions, spreadsheets, images or repository/prep copies exist. The HTML is authoritative in every case (the PDF is its Chromium render). The shared Downloads folder at large was not searched (project-boundary lock).

| Code | Legacy title | HTML (bytes, SHA-256 prefix) | PDF (bytes) | Duplicate / version issue |
|---|---|---|---|---|
| OG-B01 | QuickStart Resilience Checklist | 5,649 · `1CDBA8CB60E3` | 112,432 | NO |
| OG-B03 | 5 Starter Product Guide ("$5 Starter Product Guide") | 10,197 · `EE7D9BF4363F` | 410,504 | NO |
| OG-B11 | Building Consent Navigator (NZ) | 12,040 · `138C5A992409` | 455,700 | NO (see exceptions: git-ignored visual reskin, not a version) |
| OG-B13 | Resilience Insurance Documentation | 11,004 · `A7013D9314FB` | 432,771 | NO |
| OG-B15 | Annual Maintenance Calendar | 15,404 · `4F7287231578` | 466,116 | NO |

**Outcome:** two to build (B13, B15, both rewrites), two to archive (B01, B03), one blocked on the consents research the register already requires (B11). If the owner agrees, the migration ends with 38 deployed resources and the legacy queue is empty.

## DECISION MATRIX
| Resource | Legacy Title | Member Job | Overlap | Privacy | Safety | Platform Dependency | Member Value | Disposition | Priority | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| OG-B01 | QuickStart Resilience Checklist | A one-page 30-day "one action per day" starting sequence | HIGH (res-1027, res-1029, res-1006, res-1007; the programme pages themselves) | LOW | MODERATE (PLANNING PROMPT: alarms, fireplace, solar, battery, generator, water) | HIGH (Week/Day, 30-Day Programme, Simply Services, grant names, "sign the commitment") | LOW | **D — ARCHIVE / DO NOT MIGRATE** | N/A | MEDIUM |
| OG-B03 | 5 Starter Product Guide | A shortlist of 20 cheap first-purchase items by pillar | MODERATE (res-1022, res-1006, res-1023) | LOW | HIGH (GUIDANCE: smoke/CO alarms, extinguisher, first aid, water treatment, power) | MODERATE (Tier 1 Bonus, OG-01/OG-02 refs, "$5" brand) | LOW | **D — ARCHIVE / DO NOT MIGRATE** | N/A | MEDIUM |
| OG-B11 | Building Consent Navigator (NZ) | Know when building consent is needed and how to apply | LOW (res-1025, res-1021, res-1024 touch consents only in passing) | LOW | HIGH (GUIDANCE: building, consents/exemptions, licensed practitioners, fire separation, solid fuel) | MODERATE (Tier 4, 30-Day Programme) | MEDIUM | **E — BLOCK PENDING OWNER DECISION** (consents research) | N/A | HIGH |
| OG-B13 | Resilience Insurance Documentation | Keep insurance questions and the household's key records located and current | LOW (res-1502 and res-1514 touch contacts only; res-1024) | HIGH (title, wills, banking, inventories, encryption method, safe-combination location, trusted-contact name) | MODERATE (LABEL ONLY for assets; insurance/legal claims are the real risk) | MODERATE (Tier 4, 30-Day Programme) | MEDIUM | **B — REWRITE BEFORE MIGRATION** | P2 | MEDIUM |
| OG-B15 | Annual Maintenance Calendar | A year-round schedule for inspecting and servicing household systems | LOW (res-1012 covers pantry rotation only; res-1006 has a one-off kit check) | LOW | HIGH (PROCEDURE and GUIDANCE: solar, battery, generator, chimney/solid fuel, water, fire, first aid) | MODERATE (Tier 4, 30-Day Programme, "Network" community-list line) | HIGH | **B — REWRITE BEFORE MIGRATION** | P1 | MEDIUM |

### Triage answers (A to J, compact)
| | A. Job | B. Still useful | C. Covered live | D. Retired-platform dependency | E. Sensitive data | F. Technical safety | G. Regulatory / legal / professional | H. Stale numbers, cadence, scores | I. Format useful | J. Worth migrating |
|---|---|---|---|---|---|---|---|---|---|---|
| B01 | 30-day daily action list | Yes, but it is the programme | YES (programme day pages, res-1027/1029) | YES, wholly Week/Day | No | Prompts only | Grant and provider names | Day count, "0–100", "top 3", "30-day supply" | Fridge poster, yes | NO |
| B03 | Cheap first purchases | Partly | Partly (res-1022 wishlist, res-1006 kit list) | Light | No | Yes (alarms, CO, extinguisher, first aid) | Product-safety implications | Every item priced; "40%", "90%", "500 L", "1,000+ litres", replacement intervals | List format, partly | NO (price rules and safety claims outweigh value) |
| B11 | Consent triage | Yes | NO | Light | Light (project tracker) | Yes | **Heavily** (Building Act, exemptions, fees, timelines, NZ only) | Area thresholds, volume, fees, working-day timelines | Table + tracker, yes | Only after research |
| B13 | Insurance questions and records | Yes | NO (records vault is new to the Library) | Light | **Yes, heavily** | Labels only | Insurance cover assertions, will/legal documents, producer statements | "$10k cap", "three places" | Checklist + log, yes | YES, as a rewrite |
| B15 | Maintenance schedule | **Yes, strongly** | NO | Light | Light | **Yes** (procedures) | Electrician, chimney sweep, service intervals | 10 m clearance, 30-minute run, 24-hour test, "$20 vs $2,000", monthly cadence, NZ-seasonal months | Log + seasonal grid, yes | YES, as a rewrite |

## RESOURCE EXCEPTIONS
**OG-B11 (E).** Not a copy problem but a content-authority problem. It is NZ-only and states legal thresholds, exemption categories, fees and timelines as fact. The register already holds the rule "consents research first" (NEXT_ACTIONS research topic 4: NZ building consents and exemptions from MBIE, council variation, AU state/territory/council; "no national AU rule where jurisdictions differ"). I did not assert whether any figure in the source is current; each would have to be sourced. Without that research, any migration would either repeat unverified legal claims or become an empty shell. A market-structure question also sits behind it: a Library resource is NZ + AU, and this one has no AU equivalent. A `git`-ignored visual reskin exists at `workspace/reskin/building-consent-navigator.html`; its text differs from the source only by the removed "OFFGRID056.COM" and an added "Prepare • Adapt • Thrive" tagline, so it is a styling derivative, not a competing version.

**OG-B13 (B).** Highest privacy risk in the batch. The source asks for a safe-combination *location*, the encryption method, an off-site trusted contact and a document vault including wills, banking and title. A rewrite must record only *where* a document type is kept (or "not yet gathered"), never content, codes or credentials, and must not assert what any insurer covers or excludes. It should stay a neutral "questions to ask" and "records to gather" worksheet, and must not read as financial, legal or insurance advice. The one-line asset list (solar, battery, generator, tank) is label-only and acceptable as prompts.

**OG-B15 (B).** Highest safety content in the batch (every row is a maintenance procedure). A rewrite should turn it into a household maintenance *log and reminder planner*: the member lists their own systems, notes the manufacturer or installer's service guidance, and records last done and next due; the Library gives no procedure, interval, test duration or clearance distance. The month-by-month structure is Southern-Hemisphere temperate and will not suit all of Australia, so the rewrite should use seasons or member-chosen months. Of the two B candidates it is the one most exposed to the numeric and cadence detectors.

**OG-B01 (D).** Not a lost job: the programme pages carry the day sequence, and res-1027/1029 carry the planning job. The one distinctive thing is the fridge-poster format, which is not worth keeping on its own. **OG-B03 (D).** A priced product list cannot pass the price rules without becoming a different document, and its safety claims (alarm replacement, extinguisher size, filter capacity) would need the technical-source work OG-B11 needs. The real job is mostly served by res-1022 and res-1006.

No source conflicts. No other exceptions.

## DRAFT BUILD CARDS (A/B only; DRAFT, nothing reserved or locked)
Titles, slugs and classifications below are working proposals only. No stable ID has been assigned or reserved.

**Card 1 — OG-B15 (P1)**
- RESOURCE CODE: OG-B15 · WORKING TITLE: Household Maintenance Planner · DISPOSITION: B — REWRITE BEFORE MIGRATION
- PROPOSED STABLE ID: NOT ASSIGNED (to be proposed in the Locked Build Card) · SLUG: not locked
- FOUNDATION: general · PROGRAM COMPONENT: resilience-planning · CATEGORY: planning · TYPE: template (log) · DIFFICULTY: beginner · ESTIMATED TIME: 30 minutes (to confirm)
- PLANNING TOOLS: NO (owner to confirm)
- MARKET STRUCTURE: one body for NZ and AU, season- or member-chosen months only; standing emergency-contact and general-disclaimer blocks; no procedures, intervals, distances or test durations
- RELATED RESOURCES (draft order): res-1006, res-1012, res-1028, res-1024
- COPY STATUS: UNLOCKED · COVER STATUS: NOT STARTED · RENDER STATUS: NOT STARTED · STAGING STATUS: NOT STARTED · DEPLOYMENT STATUS: NOT STARTED
- Cover direction (future): a tidy household utility space or shed wall with tools, a ladder and a single person logging a note in a small notebook, daylight, no readable text. AVOID: kitchen-table scenes, clipboard at a table, map on a table, a standing pair at a noticeboard, any couple already used.

**Card 2 — OG-B13 (P2)**
- RESOURCE CODE: OG-B13 · WORKING TITLE: Household Records and Insurance Questions · DISPOSITION: B — REWRITE BEFORE MIGRATION
- PROPOSED STABLE ID: NOT ASSIGNED · SLUG: not locked
- FOUNDATION: general · PROGRAM COMPONENT: resilience-planning · CATEGORY: planning · TYPE: worksheet · DIFFICULTY: beginner · ESTIMATED TIME: 30 to 45 minutes (to confirm)
- PLANNING TOOLS: NO (owner to confirm)
- MARKET STRUCTURE: one body for NZ and AU; no cover, exclusion, cap or legal claims; "where kept" fields only; no codes, combinations, credentials or account details; standing blocks
- RELATED RESOURCES (draft order): res-1502, res-1514, res-1024, res-1006
- COPY STATUS: UNLOCKED · COVER STATUS: NOT STARTED · RENDER STATUS: NOT STARTED · STAGING STATUS: NOT STARTED · DEPLOYMENT STATUS: NOT STARTED
- Cover direction (future): close view of a shelf of plain labelled storage boxes or folders with one hand placing a folder, no readable text, no people facing the camera. AVOID: kitchen table with papers, clipboard, a standing pair at a noticeboard, map on a table.

**Cover Register (started here).** Patterns to avoid because they are already used: OG-30 (a couple, seated planning scene), OG-B02 (a couple at a table with forms), OG-B14 V1 rejected (three adults and a map on a table), OG-B14 V2 live (a standing pair at a cork noticeboard in a kitchen). Earlier covers were not re-audited in this stage; the register should be completed from the covers' source files when the next Locked Build Card is written.

## OWNER DECISIONS
1. **OG-B01:** approve D (archive, do not migrate)? 2. **OG-B03:** approve D (archive, do not migrate)? 3. **OG-B11:** confirm E, and decide whether to commission the consents research (MBIE and AU state/territory sources) as its own stage, and whether a resource may be NZ-only or must have an AU counterpart. 4. **OG-B13:** approve B and the privacy-minimised "where kept" model; confirm no insurer-specific or cover claims. 5. **OG-B15:** approve B as a log/reminder planner with no procedures or intervals; confirm month-neutral wording. 6. Approve the build order below (or reverse B13 and B15). 7. Planning Tools membership for the two builds (draft says NO for both). 8. Whether to keep an optional future idea for a short "getting started" page (from B01) or a no-price "first items" shortlist (from B03); neither is scheduled.

## RECOMMENDED BUILD BATCHES
- **Batch 1 (now, after approval):** register B01 and B03 as ARCHIVED, and B11 as BLOCKED with its research dependency. Register-only changes, no build.
- **Batch 2:** OG-B15 Household Maintenance Planner (P1: highest member value, no live overlap, complete source; most detector exposure, so the Locked Build Card should fix the "no procedures" rule up front).
- **Batch 3:** OG-B13 Household Records and Insurance Questions (P2: distinct job and low overlap, but needs the strict privacy and no-claims rule locked first). This is a close call; B13 is lower in safety content, so reversing the order is reasonable.
- **Later, separate:** consents research, then a fresh decision on OG-B11.
Each build uses the Locked Build Card, Cover Register, Standard QA and exception-only reporting.

## STANDARD QA
**17/17 PASS.** (Sources searched for all five; authoritative source identified, no conflict; overlap, privacy, safety, platform dependency and member value assessed; dispositions and priorities assigned; draft cards for both B candidates; no IDs, rewrites, covers, renders, staging or deployment; live state unchanged.)

## LIVE STATE
Unchanged: Protected 36 · Market files 72 · Planning Tools 12 · Downloads 58 · My Progress 61 · Broken links 0 · Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` (rollback `baf17c92-4ccf-45fb-aefe-f1ae5565eea6`). Migration totals unchanged: Deployed 36 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Archived 2 · Not started 5 = 45. No register, config, test or Worker change; this report is the only file added.

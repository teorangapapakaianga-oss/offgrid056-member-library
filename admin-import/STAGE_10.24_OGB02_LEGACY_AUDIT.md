# Stage 10.24 — OG-B02 Emergency Contacts Info Sheet: legacy resource audit and disposition

**Audit only.** No rewrite, no cover, no render, no stable ID, no protected record, no staging, no deployment. LIVE (unchanged): **34 protected resources · 68 market files · Planning Tools 12 · Downloads 56 · My Progress 59 · 0 broken links** · Worker `f97d160a-2599-40b6-a4a2-fe3badec1e25` · rollback `4b864fb7-6736-46e5-b918-39f92ab37128`. Migration (unchanged): Deployed 34 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 9 = 45.

**Recommended disposition: B — REWRITE BEFORE MIGRATION** (narrow rewrite; the member job is real and distinct, the form needs privacy, market and cadence cleanup).

## 1. Source discovery (items 1 to 4)
Searched the two enabled OffGrid056 archives (the 30-Day Programme archive and the Household Resilience Guide V1 folder), the repository, and the Work project folder, by filename (`B02`, `Emergency Contact`). The shared Downloads folder at large was not searched (project-boundary lock). **One candidate, no duplicates, no renamed copies, no earlier versions, no repository or prep copies.**

| Type | Path | Size | Modified | SHA-256 |
|---|---|---|---|---|
| HTML | `…\kingitanga\OffGrid056_Complete_30Day_Programme\OffGrid056\HTML_Source\OG-B02_Emergency_Contacts_Info_Sheet.html` | 6,118 bytes | 2 May 2026 08:41 | `17C5E0364FA6E42B2FEE67A91D276C3D72FC99951CBBF821D8890EF2A1DD9A14` |
| PDF | `…\OffGrid056\PDFs\OG-B02_Emergency_Contacts_Info_Sheet.pdf` | 92,944 bytes, 2 pages | 2 May 2026 08:42 | `414CABE617B0CFC5B660E3F9363B92DF52A2D6CD78518D9B2C0FEF7D3563A525` |

**Authoritative source:** the HTML (the PDF is its Chromium render, created 1 May 2026; its text matches the HTML field for field, so the two do not materially differ). Nothing else mentions the resource beyond the Stage 9.5 programme audit (listed as energy by an early guess), the safety standard (flagged as emergency-related) and the register (Not started, no safety blocks).

## 2. What the source is (items 5 to 11)
- **Legacy title:** "Emergency Contacts & Information Sheet" (HTML and PDF title field "OG-B02 Emergency Contacts & Info Sheet — OffGrid056"). **Date/version:** none recorded in the file (file dates only). A bonus resource (B-series): no Day, Week or programme sequencing.
- **Purpose (its words):** "Keep this accessible. Fill it out once. Update yearly." **Audience:** a household member filling in a printed or on-screen sheet.
- **Structure (one sheet, 2 PDF pages, 28 blank fields in two columns):** (1) Household Information (6 labels, three with two lines); (2) Emergency Contacts (10); (3) Utility & Service Information (6); (4) Emergency Kit Location (6). Footer: "OFFGRID056.COM | UPDATE THIS SHEET EVERY 12 MONTHS". No instructions, no explanatory paragraphs, no introduction, no closing, no next step; page 2 holds only the last two kit rows and the footer (an orphan layout).
- **Member action:** write details by hand against each label. No scoring, no calculation, no checklist, no decision.
- **Images/artwork:** none (the legacy navy and gold palette with Playfair Display and Inter fonts, not the current brand). **External links:** only the legacy Google Fonts import. **CTAs:** the OFFGRID056.COM footer.

## 3. Contact and field categories (items 12 and 13, exactly as in the source)
- **Household Information:** Address; Emergency Rally Point; Number of People; Pets / Animals; Medical Conditions / Allergies; Medications Required.
- **Emergency Contacts:** Civil Defence / Emergency Services; Local Police; Doctor / Medical Centre; Pharmacy; Insurance Provider; Policy Number; Out-of-Area Contact; Neighbour (Left); Neighbour (Right); Neighbour (Across).
- **Utility & Service Information:** Power Provider / Account; Water Provider / Account; Gas Provider / Account; Internet / Phone Provider; Power Outage Hotline; Water Supply Hotline.
- **Emergency Kit Location:** Water Storage Location; Food / Pantry Location; Torches / Batteries; First Aid Kit; Radio / Communication; Important Documents.
Not in the source (so not added): school, childcare, workplace, council, electrician, plumber, builder, vet, family or friends as a named category, household member names, children's details.

## 4. Privacy and personal data (item 14)
The sheet is blank and member-completed; the Library stores nothing, so risk is what the member writes on paper or in a saved PDF.
- **Reasonable household contact information:** out-of-area contact, neighbours, doctor or medical centre, pharmacy, utility and phone providers, hotline numbers, rally point, number of people, pets, where documents are kept.
- **Sensitive and optional at most:** **Address** (home address on a sheet that is shared or photographed); **Medical Conditions / Allergies** and **Medications Required** (health information, and the form implies an emergency use without saying who may read it).
- **Remove in a rewrite:** **Policy Number** and the **account numbers** implied by "Power / Water / Gas Provider / Account" (account and policy numbers add identity and fraud risk and are not needed to contact a provider); the detailed health fields (replace with who to tell and where health information is kept).
- The source gives no guidance on where to keep the sheet or who should see it; a rewrite needs one plain sentence (not a privacy policy).

## 5. Safety, emergency, medical, regulatory (items 15 to 20)
- **Emergency instructions found:** **none.** The sheet only stores contacts; it teaches no action. **Medical content:** field labels only (conditions, allergies, medications, doctor, pharmacy, first aid kit location): no treatment, dose, first-aid instruction or claim. **Technical/household safety:** none taught; "Gas Provider" and "Torches / Batteries" are labels. `safetyExposureFor` returns **no topic**; a rewrite needs the standing emergency-contact and general-disclaimer blocks only (the standing emergency-contact block already carries the number and the agency for each market, so the body need not).
- **Fixed emergency numbers or phone-number examples:** **none** (no 111, 000 or any digits besides the cadence below). **Market-specific references:** "Civil Defence / Emergency Services" (NZ-specific agency label; Australia uses State and Territory emergency services) and "Local Police". Recommendation: replace with a generic label such as "Local emergency management contact"; keep the numbers in the standing block only.
- **Regulatory:** only simple contact labels (Civil Defence, Police, providers). No legal requirement, consent, permit, licence or compliance claim. Regulatory assertions **0**. Risk: **low**.

## 6. Detectors (items 21 to 23; no exemption, no detector change)
Run against the source HTML for NZ and AU (current numeric registry and treatment registry): **2 numeric candidates, both Bucket C** and identical in both markets: "yearly" and "12 MONTHS" (the review cadence "Update yearly" / "UPDATE THIS SHEET EVERY 12 MONTHS", unit time). It is a maintenance cadence rather than a safety or product claim, but the hardened detector treats an unsourced fixed period as Bucket C, so the rewrite must not state a fixed interval (existing precedent: OG-28's "a regular time" and OG-30's "when your plans change"). **Every other family 0:** price (none), payback, warranty, payment, multiplier, comparative, outcome, assurance, survival, supply-duration, emergency-period, storage-duration, target-label, regulatory; content flags 0; safety topics 0. Digits in the member-facing text: "056" (brand) and "12".

## 7. Legacy language (item 24)
To remove or replace: the resource code in the PDF/HTML title ("OG-B02"); the footer **OFFGRID056.COM** and the cadence; "Civil Defence / Emergency Services" (market-specific); the legacy navy and gold look and fonts; "Emergency Rally Point" and "Emergency Kit Location" wording (calm, household tone preferred); the imperative strapline "Keep this accessible. Fill it out once. Update yearly." No Day, Week, 30-Day Programme, panic, completion or sequencing wording exists. The legacy title "Emergency Contacts & Information Sheet" is plain and not alarmist (acceptable; shorter title recommended below to avoid the sort-order effect).

## 8. Overlap (items 27 to 30)
| Resource | Overlap | Note |
|---|---|---|
| Emergency Readiness Checklist (res-1006) | **moderate** | Its checklist asks whether contact details are written down and where important documents and supplies are kept, but offers no place to record them; OG-B02's contacts and utilities are the missing record, while its Emergency Kit Location section duplicates res-1006's job |
| Household Responsibility Roster (res-1028) | low | Who looks after what inside the household; no contact data |
| Household Action Plan (res-1029) | low | Actions and owners |
| Long-Term Direction Planner (res-1030) | low | Direction planning |
| Water, Food and Air Household Snapshot (res-1014) | low | Records what the household has and key points to know; no contact list |
| Professional Support Planner (res-1024) | low | Contacts for tradespeople being considered, a different job |
| Household Contacts Template (res-0009, **demo placeholder**) | **same intended job** | A placeholder in Planning Tools reading "The final OffGrid056 resource will replace this text"; not a real resource, no protected file; its slug differs from any proposed OG-B02 slug, so no route clash. Owner decision on how a future real resource relates to it (see section 14) |
**Closest existing real resource:** res-1006. **Distinct member job (item 29):** *keep the household's key contact details in one place, so they are easy to find when normal routines are disrupted* (supported by the source: neighbours, out-of-area contact, doctor, pharmacy, providers, hotlines, documents). **Verdict (item 30): distinct and useful as a standalone resource**, not merged and not archived, once the kit-location and sensitive fields are removed.

## 9. Classification recommendation (items 31 to 38)
- **Foundation:** general (it spans all five foundations; the Stage 9.5 "energy" guess is not supported by the content).
- **Program Component:** **resilience-emergency** (it supports readiness for disruption and sits beside res-1006); alternative planning-implementation (an organising worksheet like res-1028/res-1029). **OWNER DECISION**, because Planning Tools tends to follow the component.
- **Category:** planning. **Resource type:** worksheet (template acceptable). **Difficulty:** beginner. **Estimated time:** 20 minutes (lookups included; res-1006 is 20).
- **Planning Tools: OWNER DECISION.** If resilience-emergency, consistency with res-1006 and res-1014 suggests **NO** (they are in no collection); if planning-implementation, **YES** would match res-1028 and res-1029.
- **Market structure:** **A, fully market-neutral NZ/AU body.** Agency names and numbers belong only to the existing standing emergency-contact block; no override needed.

## 10. Related resources and the engine (items 39 and 40)
Recommended four curated links (metadata order): **BEFORE** res-1006 Emergency Readiness Checklist (check what is in place, then record the contacts); **NEXT** res-1014 Water, Food and Air Household Snapshot (record the key household points); **ALSO USEFUL** res-1028 Household Responsibility Roster (who looks after what, with backups); **LATER** res-1024 Professional Support Planner (contacts for professionals when needed). Printed Where Next could show three rows (the fourth metadata-only), as in OG-30.
**Engine simulation (real `lib/related.ts`, hypothetical record, nothing changed):** four curated links give exactly four "Linked by us" cards and no automatic fill. **With three curated links the engine adds three "Same topic" cards** (3-Tier Budget Planner, 30-Day Action Planner demo, 90-Day Implementation Roadmap (Advanced)), so four are needed to keep the page curated. **Slug side effect:** a slug that sorts before `emergency-readiness-checklist` (for example `emergency-contacts-sheet` or `emergency-contacts-info-sheet`) **changes the automatic related cards on 11 existing pages** (res-0008, res-1510, res-1027, res-0006, res-0007, res-0009, res-1002, res-1504, res-1025, res-1022, res-0030). Slugs that sort later change **0** pages: `household-contacts-sheet`, `household-contact-sheet`, `household-contacts-and-key-information`, `household-emergency-contacts`, `household-information-sheet`, `household-key-information-sheet`, `important-contacts-sheet`, `key-contacts-sheet`. The title and slug must be chosen with this in mind (the legacy-style title would change 11 pages).

## 11. Cover concept (item 41; no image generated)
Title-free, bright and calm: a household member at a kitchen counter or hallway table writing on a paper contact sheet, with a noticeboard or fridge door nearby holding a few clipped notes, daylight through a window; a clear upper area for the template title. No phone screens with alerts, no sirens or flashing lights, no uniforms, no weapons, no disaster imagery, no readable generated text or logos.

## 12. Disposition and rewrite proposal (items 42 to 50)
**B — REWRITE BEFORE MIGRATION.** A is not suitable (two Bucket C candidates, an NZ-only agency label, policy and account number fields, medical fields, legacy branding, orphan page, no introduction or privacy line). C is not needed (no existing resource holds this job). D is not appropriate (distinct job, low safety risk).
- **Proposed future title:** **Household Contacts Sheet** (slug `household-contacts-sheet`, which changes 0 existing pages; owner may choose another that sorts after `emergency-readiness-checklist`).
- **Proposed description (one sentence, for approval):** "A practical worksheet to help your household record the people, services and key details you may want to find quickly, and keep them in one place."
- **Section architecture:** What This Sheet Is For (with a one-sentence note to record only what you are comfortable keeping on paper and to keep it somewhere your household can reach) · Our Household · People We Can Contact · Services We Use · Where Key Things Are Kept (documents only) · Keeping It Up To Date (no fixed interval) · Where Next · closing line.
- **Field categories (from the source only):** household (people count, pets, rally point, optional address), contacts (out-of-area contact, neighbours, doctor or medical centre, pharmacy, local emergency management contact, local police), services (power, water, gas and internet or phone providers by name, outage and supply hotlines), where documents are kept. **Removed:** policy number, account numbers, medication and condition detail (replaced by who to tell and where health information is kept), the whole Emergency Kit Location section (covered by res-1006, and avoids implying supply guidance).
- **Standing blocks:** emergency-contact and general-disclaimer only; **no topic block** (the legacy topics are labels).
- **Market:** one identical NZ/AU body. **Related:** section 10.
- **Merge target / archive rationale:** not applicable.

## 13. Stable ID and state (items 51 to 57)
Suggested ID from the historical mapping (B-series bonus numbering): **res-1502, SUGGESTED ONLY / UNASSIGNED**; it is recorded nowhere in code or config. **Stable ID assigned: NO. Protected record: NO. Staging: NO. Deployment: NO.** Worker `f97d160a-2599-40b6-a4a2-fe3badec1e25` (100%, confirmed). Live counts as above.

## 14. Owner decisions required next (item 59)
1. Approve disposition B (narrow rewrite) for OG-B02.
2. Approve the working title **Household Contacts Sheet** and slug (or name another that sorts after `emergency-readiness-checklist`).
3. Program Component: resilience-emergency (recommended) or planning-implementation, and Planning Tools YES or NO (see section 9).
4. Approve removing Policy Number, account numbers, medical-condition and medication detail and the Emergency Kit Location section; and whether Address stays as an optional field.
5. Approve the four related links and their order (section 10).
6. Decide how the future real resource relates to the demo placeholder "Household Contacts Template" (res-0009), for example leave it as a hidden placeholder as it stands today. This audit changes neither.
7. Supply or approve the title-free cover route later (no cover is generated now).

## 15. Repo changes (item 58) and next stage (item 60)
Repo changes: this report only. Scratch analysis scripts and output (`workspace/ogb02-*`) were git-ignored and have been removed. No config, test, record, PDF or live change. **Recommended next stage:** **Stage 10.24A — OG-B02 rewrite draft for owner copy review** (config only, then 10.24B cover and render, 10.24C staging, 10.24D deployment), after the decisions above.

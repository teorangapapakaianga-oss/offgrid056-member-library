# Stage 10.24A — OG-B02 Household Contacts Sheet: rewrite and owner copy review

**Copy rewrite for owner review only.** Not rendered, no cover generated, no stable ID, no protected record, not staged, not deployed. The prep tool prints a suggested internal ID `res-1502` (**SUGGESTED / UNASSIGNED**); it is recorded nowhere. OG-B02 stays Not started. The demo placeholder `res-0009` Household Contacts Template is **unchanged**. Live is unchanged: **34 protected resources · 68 market files · Planning Tools 12 · Downloads 56 · My Progress 59 · 0 broken links** · Worker `f97d160a-2599-40b6-a4a2-fe3badec1e25` · rollback `4b864fb7-6736-46e5-b918-39f92ab37128`. Migration: Deployed 34 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 9 = 45. The draft lives only in the review config (`approved-copy.json`, `metadata-review.json`, `program-components.json`; generator `workspace/add-ogb02-config.mts`, git-ignored) and in git-ignored prep HTML (`workspace/prep/OG-B02/`, no PDF).

## 1. Owner rulings applied
**Household Contacts Sheet**, slug `household-contacts-sheet`; description (exact, curly apostrophe): "A practical worksheet to keep your household’s key contact details together so they are easier to find when routines are disrupted." General / **resilience-emergency** / planning / worksheet; **beginner**; **20 minutes**; **Planning Tools: NO** (collections empty; live stays 12). One identical market-neutral NZ/AU body. Standing emergency-contact and general-disclaimer blocks only.

## 2. Section architecture
Cover · About This Sheet (with a short privacy note) · Our Household · People We Can Contact · Health & Support Contacts · Home & Essential Service Contacts · Other Useful Contacts · Where We Keep Important Information · Notes · Where Next · Where You Are Now · standing emergency-contact block (injected at the top of the content) · standing general-disclaimer block (injected at the end).

## 3. Complete proposed member-facing copy
**Cover (text only; no image).** Chip: General · Resilience Emergency · OffGrid056 Member Library · **Household Contacts Sheet** · subtitle (drafted, for your approval): "A calm, simple place to keep your household’s key contact details together." · Prepare • Adapt • Thrive.

**Running header (inside pages):** OffGrid056 | Household Contacts Sheet · General · Resilience Emergency.

**About This Sheet.** "This sheet helps your household keep its key contact details together in one place, so they are easier to find when routines are disrupted." "You decide which contacts are useful. Fill in what suits your household and leave blank anything that does not apply. This sheet is a record of contacts, and it does not replace emergency-service or professional advice."
**A Note on Privacy (boxed).** "A completed sheet may include personal information, so record only what you are comfortable keeping here. This sheet does not ask for account numbers, policy numbers, passwords or access codes. Keep your completed copy somewhere that suits your household, and think about who else may see it."

**Our Household** (six single-line fields): Household name or reference · Household address (optional) · Main household contact · Main household contact phone · Backup household contact · Backup household contact phone.

**People We Can Contact.** "List the trusted people you may want to reach, such as family, friends or neighbours." Table, columns: **Name · Relationship / role · Phone · Other contact detail · Notes**; eight blank rows.

**Health & Support Contacts.** "This section records who to contact. It does not need any health details." Table, columns **Contact · Name · Phone · Other contact detail · Notes**, three labelled rows: Health clinic or medical practice · Pharmacy · Other support contact. Open fields (two lines each): **Who should be told about important health information?** · **Where does our household keep important health information?**

**Home & Essential Service Contacts.** "Record who to contact for each service. Irrelevant rows can stay blank." Table, columns **Contact · Name or organisation · Phone · Other contact detail · Notes**, six labelled rows: Electricity or energy provider · Water contact or provider (if relevant) · Internet or communications provider · Property manager or landlord (if relevant) · Insurer contact · Trusted trades or service contact.

**Other Useful Contacts.** "Add any other contacts that matter to your household, such as a school, childcare, workplace, veterinarian or community contact." Table, columns **Name · Role or reason · Phone · Other contact detail · Notes**; five blank rows.

**Where We Keep Important Information.** "Write down where things are kept, not what they say." Fields (two lines each): Where we keep important household documents · Where we keep health information · Where we keep insurance information · Where we keep other useful household information.

**Notes.** One open field (fourteen lines): Notes:

**Where Next.** "Use these resources alongside your sheet." Three printed rows: Before: **Emergency Readiness Checklist**, "See what your household already has in place and what still needs organising." · Next: **Water, Food and Air Household Snapshot**, "Note what your household has in place across water, food and air." · Also useful: **Household Responsibility Roster**, "Agree who looks after what and record a backup for each area." (The later link, Professional Support Planner, is metadata only and is not printed.)

**Where You Are Now.** "You now have your household’s key contacts gathered together, places for the contacts that matter to you, and a record of where other important information is kept. Keep this sheet somewhere your household can find it, and update it when your details change."

**Standing blocks (existing architecture, injected, not drafted here):** emergency-contact (market-aware: NZ 111 and Civil Defence guidance, AU 000 and State emergency service guidance) and general-disclaimer. No topic block.

## 4. Removed from the legacy source (and not recreated)
OG-B02 and the legacy title; the OFFGRID056.COM footer and "UPDATE THIS SHEET EVERY 12 MONTHS", "Update yearly" and the imperative strapline; the legacy navy and gold look; **Policy Number**; the **Account** half of Power, Water and Gas "Provider / Account"; **Medical Conditions / Allergies** and **Medications Required** (replaced by the two open who-to-tell and where-kept prompts); Emergency Rally Point, Number of People and Pets / Animals; "Civil Defence / Emergency Services" and "Local Police" (market-specific; official emergency information stays in the standing block); Power Outage and Water Supply Hotline rows; and the whole **Emergency Kit Location** section (Water Storage, Food / Pantry, Torches / Batteries, First Aid Kit, Radio / Communication), already covered by the Emergency Readiness Checklist. Address is kept only as **"Household address (optional)"**; no ownership, access, alarm, lockbox or gate codes, passwords or security answers, date of birth, identity numbers, banking details, diagnoses, medication names or children's details are requested.

## 5. Validation (prepared NZ and AU files; `workspace/ogb02-draft-qa.mts`: ALL PASS, 71 checks)
**NZ and AU body identical: 3,159 characters each** (inside the 2,000 to 3,200 target); body HTML **13,422 bytes** each, byte-identical; whole prepared files 21,410 bytes (NZ) and 21,384 bytes (AU), differing only in the standing blocks. Standing blocks: **emergency-contact and general-disclaimer only; technical safety triggers 0**. **Regulatory candidates 0, unresolved 0.** **Numeric Bucket C 0** (one Bucket A candidate, the sourced licensing sentence in the standing disclaimer). Price 0; payback 0; warranty 0; payment 0; multiplier 0; comparative 0; outcome 0; assurance 0; survival 0; supply-duration 0; emergency-period 0; storage 0; target-label 0; legacy-language **0**; content flags **0**; no digits in the member-facing body. "yearly", "12 months" and every other fixed interval are absent, and no replacement interval was added. No fixed emergency number appears in the body. No agency or jurisdiction term appears in the body. The only negative privacy statement (account numbers, policy numbers, passwords, access codes) is the single sentence in the privacy note, counted and allowed by name in the check; no exemption, no registry entry, no detector change.

## 6. Related resources and automatic fill
Metadata order: **BEFORE res-1006** Emergency Readiness Checklist · **NEXT res-1014** **Water, Food and Air Household Snapshot** (exact canonical title read from the protected record, not guessed) · **ALSO USEFUL res-1028** Household Responsibility Roster · **LATER res-1024** Professional Support Planner; the printed Where Next shows the first three. **Engine check (real engine, simulated, nothing changed):** the four curated links produce exactly those four cards, all "Linked by us", no "Same topic" fill, no duplicates. `lib/related.ts` unchanged.

## 7. Slug hard gate
Using the real engine over the live pool (the 34 protected records plus the demo records, in file-name order), a hypothetical general / planning resource with the approved slug **`household-contacts-sheet`** changes the related cards on **0 existing pages** (PASS). As a control, the legacy-style slug `emergency-contacts-sheet` changes several. The slug was not changed. This check is now a permanent test.

## 8. Demo placeholder res-0009
**Unchanged: YES.** A test asserts its record fields and that the route policy still separates only res-0007, res-0013, res-0015 and res-0016. Not deleted, remapped, superseded or converted; no link points at the new resource. Overlap recorded: the placeholder names the same intended job, but it is not a real resource and its slug (`household-contacts-template`) differs from the new slug, so there is no route clash. Its relationship to the real resource is for controlled staging.

## 9. Cover, classification and governance
- **Cover direction (recorded, nothing generated):** a calm household scene with one or two adults reviewing a simple contact sheet or notebook at a kitchen table, phone nearby, natural daylight, tidy home background; no sirens, ambulances, dominant uniforms, disaster scenes, panic expressions, flashing lights, destruction, readable generated text or logos. **Suggested future asset tag:** OGB02_COVER_v1 — Household Contacts Sheet. **Suggested file name:** OGB02_Household-Contacts-Sheet_Cover_v1.png. The draft cover shows the template title on the dark brand background with no image (`coverStatus` PENDING).
- **Governance to apply at staging:** status draft; publicationStatus approved; releaseChannel private-preview; accessTier and entitlementRequirement UNDEFINED_OWNER_DECISION; recommendationEligible false; handoffStatus INACTIVE; approvedHandoffRoute null; entitlementContractStatus NOT_APPROVED.

## 10. Tests and repo (actual exit codes)
Focused `tests/unit/og-b02-draft.test.ts`: **22 passed, exit 0** (metadata, exact description, no ID/record/PDF, related order and titles, real-engine curation, slug gate, res-0009 unchanged, privacy, medical, kit, cadence, emergency-number and agency absence, market parity, sections, three printed rows, concise length). Full default-timeout suite: **64 files, 1,728 tests, exit 0**. Lint: **exit 0** (0 errors; 75 warnings, all in git-ignored scratch scripts). Typecheck: **exit 0**. `import:verify-prep`: **exit 0**. `import:verify-build`: **exit 0** (34 records · 68 market files · 0 broken links). Two earlier tests (OG-14 and OG-24 "ID is internal only") were scoped to skip the OG-B02 entry, because it now lists res-1014 and res-1024 as owner-approved related links; they still forbid those IDs everywhere else. Repo changes: the OG-B02 entries in the three review-config files, `og-b02-draft.test.ts`, the two scoped tests and this report. Git-ignored: `workspace/add-ogb02-config.mts`, `workspace/ogb02-draft-qa.mts` and output, `workspace/ogb02-legacy.html`, `workspace/prep/OG-B02/`.
Stable ID **NO** · protected record **NO** · render **NO** · staging **NO** · deployment **NO** · Worker unchanged (`f97d160a-2599-40b6-a4a2-fe3badec1e25`, confirmed 100%) · live counts unchanged.

## 11. Owner decisions required before the render stage
1. Approve the copy, including the drafted cover subtitle ("A calm, simple place to keep your household’s key contact details together."). 2. Approve the Where Next wording and the three printed rows (res-1024 stays metadata only). 3. Approve the privacy note and the removals in section 4. 4. Supply the title-free cover image (or approve a named image workflow) under the suggested tag. 5. Then, as separate approvals: render, stable ID and staging (including how the demo placeholder res-0009 is treated), deployment.

## 12. Next stage
**Stage 10.24B — OG-B02 cover insertion, final render and visual QA**, once you approve the copy and supply the cover (no ID, staging or deployment unless separately approved). Not started.

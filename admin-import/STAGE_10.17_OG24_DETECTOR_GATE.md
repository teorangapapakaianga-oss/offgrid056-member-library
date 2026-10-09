# Stage 10.17 — OG-24 owner rulings applied; licensing/legality detector HELD at the live-library gate (drafting NOT started)

**The whole-live-library gate found 10 unresolved statements in three live resources, so, as instructed, drafting did not start.** Nothing was rendered, staged or deployed; no res-ID was assigned; no OG-24 config, copy or metadata was written. No exemption was added and no live copy was altered. The hardened detector is **held** in `admin-import/held-10.17/` (`numeric.ts.hardened.txt`, `numeric.ts.patch`, `licensing-legality.test.ts.txt`, outputs) and is NOT in the committed tree, so the committed suite stays green. Registers, records, PDFs, route policy, Start Here, Planning Tools, programme routes, `lib/related.ts`, the registry, the Worker and Access are untouched.

LIVE: **30 protected resources · 60 market files · 0 broken links** · Worker `7bccd708-70a8-479f-90c8-b6f7239e1c91` · rollback `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · Bucket C 0 (at the committed detector) · 1,523 tests. Migration (unchanged): Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 13 = 45.

## 1. Owner rulings recorded (OG-24)
NARROW; standalone; title **Professional Support Planner**; general / planning-implementation / planning / worksheet / beginner / 20 min / draft / collections planning-tools (YES; count 9 → 10 only after deployment); one market-neutral body; no systems or appliances named; standing blocks only; journey OG-23 → OG-24 → OG-25; no merge into OG-25. None of this is written to config yet (drafting is held).

## 2. The gap is confirmed
Probed at the committed detector, the regulatory family returned 0 for "Illegal and dangerous otherwise", "Always licensed", "valid licence … required", "Building consent and certified flue work required", "Refrigerant handling requires certified technician", "Public health and environmental regulations apply" and "Doing everything yourself is not always legal".

## 3. Detector change (held)
General wording rules, no resource named, no country named, no exemption. The licensing and legality assertions join the **regulatory family** (one owner per statement; same Bucket C `performance / regulatory` unit; no new bucket):
- **Licensing:** "always / only / must / has to / need to / never use|hire|engage … a licensed|registered|certified|accredited|authorised|qualified|approved …"; "must be carried out|done|installed|… by a …"; "only a certified installer may/can …"; "a (valid) licence|registration|certification … is/are required|mandatory|needed"; "valid licence … required"; "requires a (valid) licence | licensed|… person"; "licensed professionals are required"; "consent|permit|approval|inspection|licence|certificate … required|mandatory|needed"; "always licensed"; "regulations|laws|rules apply|govern".
- **Legality:** illegal, unlawful, against the law, breaks the law, not legally allowed|permitted, legally prohibited|required, a legal requirement|obligation, "not (always) legal" (not when followed by "advice"), "is prohibited", "prohibited by|under|from".
- **Quiet for:** questions; blanks; openers that tell the member to ask, check, record, write, confirm or verify; wording attributed to a supplier, installer, professional, contractor, tradesperson, adviser or consultant ("says", "told", "provided" …); hedged wording (if, unless, might, could, sometimes, depending, some, usually, typically, may be required); "may" except in "only a … may". Registry-approved exact sentences resolve as before.
- **Precedence:** unchanged order (…target-label → payback → warranty → payment figure → multiplier → comparative → outcome → assurance → figure-free payment and regulatory). A statement raised by several spans still has one owning family (regulatory) and each span is reported once; a figure-bearing sentence ("work over 50V") stays with the numeric owner; the structural bypass for payment/regulatory is unchanged; safety blocks and registry-approved claims are consulted first, exactly as before.

## 4. Tests (held)
`licensing-legality.test.ts.txt`: **64 tests, all passing before the hold**: 16 licensing positives and 18 licensing negatives, 10 legality positives and 13 legality negatives (licence and license spelling; licensed, registered, certified, accredited, authorised and authorized; illegal, unlawful, must use, required; questions, blanks, member-entered fields, supplier- and professional-attributed wording, neutral verification instructions; NZ and AU wording), single-owner and registry checks (the two registered claims still resolve for their exact resource and market only) and the legacy OG-24 sentences.

## 5. Legacy OG-24 retest (hardened detector; `held-10.17/og24-legacy-retest.out.txt`)
Candidates **14 per market**; Bucket C **12 per market** (4 numeric: `>120V`, `$33,000`, `50V`, `120V` as before, plus **8 newly owned regulatory statements**); regulatory-owned **8**; duplicate-owner count **0**. Newly owned: "Doing everything yourself is not always legal, safe, or efficient."; "Illegal and dangerous otherwise."; "Always licensed."; "Heat pump installation … Refrigerant handling requires certified technician."; "… Building consent and certified flue work required."; "… Public health and environmental regulations apply."; "How to verify: Search the LBP register … valid licence and category match required."; "You now know exactly which projects require licensed professionals …". Not owned (a detector limit, recorded): the table cells "Yes — electrician / plumber / LBP builder…" under the question header "Licensed Required?" (they carry no sentence).

## 6. Whole live library under the hardened detector — STOP
30 resources / 60 files: 550 candidates, **Bucket C 10, all regulatory** (the two registered claims still resolve). Unresolved:

| Resource | Market | Exact sentence | Owner and why it now flags |
|---|---|---|---|
| OG-10 | NZ | "Fixed electrical work and the pump connection must be handled by an appropriately licensed electrical worker." | regulatory (licensing): "must be handled by … licensed" asserts who must do the work |
| OG-10 | AU | "Fixed electrical work and the pump connection must be handled by a licensed electrician." | same |
| OG-19 | AU | "Solar and battery systems must be installed by a licensed electrician — DIY electrical work is illegal …" (reported twice: the licensing and the legality span) | regulatory (licensing + legality) |
| OG-20 | NZ | "Permanently connected: must be installed by a licensed electrical worker" | regulatory (licensing) |
| OG-20 | NZ | "Its connection must be installed by a licensed electrical worker." | same |
| OG-20 | NZ | "Consents or permits needed" | regulatory (consent/permit … needed) |
| OG-20 | AU | "Permanently connected: must be installed by a licensed electrician" | regulatory (licensing) |
| OG-20 | AU | "Its connection must be installed by a licensed electrician." | same |
| OG-20 | AU | "Permits or approvals needed" | regulatory (permit/approval … needed) |

Earlier in testing the gate also flagged OG-04's "It is not legal, building or professional advice" (NZ and AU): that was a false positive of the first draft of the legality rule and was fixed in the held detector (a negative test now pins it). **No other live resource flags.**

## 7. OG-25 check
Under the hardened detector OG-25 (Project Support Brief Template) produces **0** new unresolved claims. As instructed, OG-25 is left untouched and its stale-wording note is not acted on.

## 8. Owner decisions required before drafting
1. How to treat the 10 live statements (all say a licensed person must do electrical work, or that consents are needed): (A) register them as sourced claims after the same research approach as 10.12A (each exact sentence, market and resource; sources would be the NZ and AU electrical-work authorities), (B) revise the live copy of OG-10, OG-19 and OG-20 to neutral wording through a separate correction stage, or (C) a different ruling. The licensing hardening stays held until then.
2. Confirm the detector wording rules in §3, in particular that "needed" and "required" with consent/permit/approval count (the OG-20 table cells), that "regulations apply" counts, and that "should" does not.
3. Then re-apply the held detector (`git apply admin-import/held-10.17/numeric.ts.patch`, restore the held test), re-run the gate to Bucket C 0 and resume the OG-24 draft.

## 9. Validation (committed tree, detector not applied)
Recorded in the final reply: lint, `tsc`, full vitest, `import:verify-prep`, `import:verify-build`, each with its actual exit code.

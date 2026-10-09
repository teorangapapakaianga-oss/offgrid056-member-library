# Stage 10.12 — OG-23 detector hardening: STOPPED at the live-library gate (no draft created)

**The whole-live-library gate found 2 statements, so, as instructed, drafting did not start.** Nothing was rendered, staged or deployed; no res-ID was assigned; no OG-23 config, copy or metadata was written. The hardened detector is **held** in `admin-import/held-10.12/` (as `.txt`/`.patch`, not compiled), and the tracked source is back at the committed detector, so the repository and its test suite stay green. No exemption was added.

LIVE: **29 protected resources · 58 market files · 0 broken links** · Worker `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · rollback `b7091068-bbee-4ac5-9f8b-1e9f7cb47b28` · Bucket C 0 · 1,365 tests. Migration state (unchanged): Deployed 29 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 14 = 45.

## 1. The four rules (general; no resource named)
- **Payback-duration norm:** a payback (or "pays for itself", "break-even") with a duration in years or months in a statement that is not a question, a blank, an instruction to ask, write or compare, hedged, or attributed to the supplier.
- **Warranty-duration norm:** a warranty with a duration and a normative word (good, should, at least, minimum, typical, standard, expect, look for, usually ...), plus a bare "Look for at least 10 years."
- **Payment norm:** a payment term (pay, deposit, upfront, hold back, hand over ...) with a quantity (a percentage, a fraction, "half", "in full", "all upfront") and a normative word (never, always, only, must, fair, standard, no more than ...), or a split such as "50/50 is fair". A sentence with a percentage is owned through that percentage; a figure-free payment sentence raises its own hit.
- **Regulatory assertion:** mandatory, legally required, required by law, must comply or be approved, proves or guarantees compliance, approved under, meets the Building Code, required in NZ or Australia, government approved.
- **Table rows:** a "Question | Why It Matters" rationale sentence is also read with its row's question (as storage-life rows are read with their header); the combined sentence is adopted only when a norm fires on it and not on the rationale alone.
- **Structural shortcut:** a payment norm or regulatory assertion is not filed as a structural label merely because it contains a standard designation ("Must comply with AS/NZS 4777.2").

## 2. Precedence (one statement, one owner)
treatment-owned → registry-approved → safety block → structural label (not for a payment or regulatory hit) → survival-duration → supply-duration → emergency-period → storage-duration → target-label duration → **payback-duration norm → warranty-duration norm → payment figure** → multiplier → comparative performance → absolute outcome → assurance → **payment norm without a figure and regulatory assertion** → not-a-claim and ordinary numeric rules. A sentence owned by an earlier family raises none of the later ones; a test confirms every positive example raises exactly one Bucket C owner.

## 3. Tests (held: `admin-import/held-10.12/numeric-norms.test.ts.txt`, 133 tests, all passing before the hold)
| Family | Positive examples | Negative examples |
|---|---|---|
| Payback | 9 | 11 |
| Warranty | 9 | 10 |
| Payment | 12 | 12 |
| Regulatory | 12 | 13 |
Plus, in both NZ and AU: one-Bucket-C-candidate scans for 3 payback, 4 warranty, 5 payment and 5 regulatory examples; precedence and no-duplicate tests; the table-row tests (warranty and payback rationale owned once, bare cell not judged twice, neutral rows raise nothing, a table without question and rationale headers unchanged); and the structural-bypass test. Negatives include questions, member blanks, supplier-attributed answers, neutral instructions, titles, hedged wording and unrelated figures. No exemptions.

## 4. Legacy OG-23 retest (hardened rules, both markets: 10 candidates, **Bucket C 8**; was 2)
| Statement | Owner |
|---|---|
| "Never pay 100% upfront." | payment norm |
| "50/50 or milestone-based is fair." | payment norm |
| "Must comply with AS/NZS 4777.2 standards." | regulatory assertion |
| "Mandatory in NZ." | regulatory assertion |
| "Proves compliance with NZ Building Code." | regulatory assertion |
| "What warranties do you offer…? Should be 2-5 years minimum on major systems." | warranty-duration norm (row context) |
| "What is the expected payback period…? Should be 6-10 years for residential." | payback-duration norm (row context) |
| "What is the expected COP … at 7°C ambient?" | ordinary numeric (temperature) |
All six expected claims are now owned; the count is the actual one.

## 5. Whole-live-library gate: 2 findings (STOP)
Hardened rules against 29 resources / 58 files (448 candidates): payback, warranty and payment norms **0**; target-label 0; assurance 0; regulatory assertions **2**.
| Resource | Market | Exact wording | Owner | Classification |
|---|---|---|---|---|
| OG-10 Rainwater Harvesting Planner | NZ | "Connecting rainwater to the plumbing of a house that also has mains water needs a building consent, and the law requires the mains supply to be isolated by a backflow prevention device installed by a qualified plumber." | regulatory assertion ("the law requires") | **Owner-approved, sourced live copy** (Consent field (NZ), approved by the owner 2026-09-23; reason records the MBIE statement it follows). Not an invented claim, but no registry entry covers it. |
| OG-13 Healthy Home Air Audit | AU | "In Queensland, interconnected photoelectric alarms are required by law — check what applies where you live." | regulatory assertion ("required by law") | **Owner-approved, sourced live copy** (Row 1 smoke alarms (AU), approved 2026-10-05; Queensland named as state law, not national). The registry already has `au-qld-alarm-ten-year-battery-qfd` (Queensland Fire Department) for the neighbouring battery claim, but no entry for this sentence. |
Neither is a draft problem: both are already live and were approved with their sources. The new rule simply has nothing to match them against.

## 6. Options for the owner (nothing was applied)
- **A. Register both as owner-approved sourced claims in `numeric-claims.json`** (recommended). This is the existing registry-approved path, which precedes the new rule in the ownership order. It is a sourced approval, not an exemption: OG-10 / NZ, authority MBIE (the consent and backflow requirement); OG-13 / AU, authority Queensland Fire Department (state law). The rule stays strict for every future resource.
- **B. Add a "verify locally" carve-out to the rule** (sentences that tell the member to check what applies). It would clear the OG-13 sentence but not the OG-10 one, and it loosens a rule that was just specified; not recommended.
- **C. Rewrite the two live sentences** (would need a staged re-deployment of OG-10 and OG-13); not recommended for an audit-stage finding.
After a ruling, the held detector is re-applied (`git apply admin-import/held-10.12/numeric.ts.patch` and the held test file restored), the gate is re-run to confirm Bucket C 0, and drafting resumes at §26 of the brief.

## 7. State and validation (committed detector)
Lint **0** (0 errors, warnings only in git-ignored workspace scripts); typecheck **0**; full tests **0** (51 files, **1,365 tests**); `import:verify-build` **0** (records 29 · market files 58 · broken links 0); live family scan at the committed detector: 29 resources, 58 files, 446 candidates, **Bucket C 0**. An earlier typecheck run failed only because a scratch script imported the held exports; it was moved into the held folder.

## 8. Not done (by design, after the gate)
OG-23 rewrite draft, config, metadata, cover concept, related list, Where Next, draft QA and the register/system checks beyond the above. Registers, protected records, PDFs, route-policy, Start Here, Planning Tools (still 8 collection members, no change), programme routes, `lib/related.ts`, the Worker and Access are untouched.

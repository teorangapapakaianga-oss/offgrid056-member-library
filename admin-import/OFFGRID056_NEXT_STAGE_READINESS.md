# OffGrid056 Member Library — Next-stage readiness

Companion to `OFFGRID056_MEMBER_LIBRARY_MASTER_STATUS_REPORT.md`. Assessment only; nothing here has been executed.

**Readiness: READY for one register-only stage; NOT READY to rebuild or publish anything.**

## Tasks already completed
- 36 resources deployed and verified in the build tree: 72 market files, 0 broken links, Worker `d7480c93-75fb-4ca5-8b40-0383b9cacadf` at 100%, rollback `baf17c92-4ccf-45fb-aefe-f1ae5565eea6`.
- Legacy queue triaged in one batch (Stage 10.28): OG-B01 and OG-B03 recommended archive, OG-B11 blocked on research, OG-B13 and OG-B15 candidates for rewrite.
- OG-05 merged; OG-B05 and OG-B06 archived (register-only states).
- Canonical index, registers and tests agree on 36 / 72.

## Tasks still necessary
1. **Stage 10.29 execution** (register-only): record OG-B01 and OG-B03 as ARCHIVED, OG-B11 as BLOCKED, OG-B13 and OG-B15 as HOLD — INVENTORY REVIEW; add the HOLD state to the register and update the hard-coded register tests; refresh the stale "As at" dates.
2. Define the **inventory review** for OG-B13 and OG-B15 (what is compared with what, and the pass rule).
3. Record per-resource **version / version date / source hash** for the 36 resources if the Research & Strategy Agent needs source-to-publication traceability.

## Awaiting owner approval
- The complete wording of Stage 10.29 (the earlier message was cut off) and the HOLD state definition.
- Whether OG-B11 may ever be NZ-only, and whether to commission the consents research.
- Access tiers and the entitlement contract (any member-level access control or Resource Agent handoff depends on it).
- The treatment of the 30 demo placeholders (res-0009 and the rest), the res-1025 wording review and res-1510 related curation.

## Dependencies on Google Drive research
- Which Water and Energy masters are complete (full HTML versus short "Source.docx" summaries) and whether any differ materially from the legacy HTML recorded for res-1008 to res-1010, res-1508, res-1018 to res-1020 and res-1507.
- Any such comparison must start from the Library's recorded legacy filenames; the Library holds no hashes or Drive links. Note res-1009's source filename (`OG-09_Filtration_Comparison_Matrix.html`) differs from its title.
- Not needed for the register-only stage above.

## Critical blockers
- No HOLD state exists; no definition of "inventory review".
- Legacy master files are outside the repository and unhashed.
- No entitlement design, so no per-member access exists (authentication only).

## Smallest recommended next action
Send the full, untruncated Stage 10.29 brief (including the HOLD definition and the inventory-review meaning) so the register-only reconciliation can be executed as **Stage 10.29-R**. Do not start any rewrite, cover, render, ID assignment, staging or deployment until that is done and the owner decides on OG-B13 and OG-B15.

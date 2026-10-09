# Stage 10.17A — live regulatory claims verified; six registered; three in the live-copy correction queue; gate NOT clean (OG-24 drafting still held)

**The hardened live gate still returns Bucket C 3, so OG-24 was NOT drafted.** The hardened detector remains **held** (`admin-import/held-10.17/`), unchanged and unweakened (no carve-outs, no exemptions). Nothing was rendered, staged, deployed or rewritten; no live copy, PDF, route, register, Start Here, Planning Tools, programme route, related rule, Worker or Access was changed. The only committed change is six narrow registry entries and a structure test.

LIVE: **30 protected resources · 60 market files · 0 broken links** · Worker `7bccd708-70a8-479f-90c8-b6f7239e1c91` · rollback `61f3bcf8-c4df-4d52-a060-b760bfbabc26` · committed Bucket C 0 · migration unchanged (Deployed 30 · Staged 0 · Prepared 0 · Blocked 1 · Merged 1 · Not started 13 = 45).

## 1. Held detector re-applied
Applied unchanged (the full held file `numeric.ts.hardened.txt`; `git apply` of the patch failed only on line endings, so the file was copied; the diff against the committed file is the same 54 insertions, 3 deletions). Retained: licensing, registration and legality assertions; "consent / permit / approval required or needed"; "regulations apply"; one statement = one owning family; registry-approved exact claims resolve before Bucket C; the OG-04 "not legal … advice" guard. Its 64 tests and the 7 registry-resolution tests (held) all pass with it applied.

## 2. Provenance per flagged statement (project evidence only)
Evidence used: `config/safety-blocks.json` (owner-approved AU and NZ batteries-and-electrical and generator-safety blocks, verified OWNER-APPROVED 2026-09-22, with per-block official sources and sentence sources), `STAGE_9.17_SAFETY_AND_CORRECTIONS.md`, `STAGE_9.29_OG19_DEPLOYMENT.md`, `STAGE_9.34_OG20_REVIEW.md` (items G3 and G6), `STAGE_9.35_OG20_DEPLOYMENT.md`, `STAGE_9.41_OG10_DEPLOYMENT.md`.

| # | Resource (ID) | Market | Exact sentence | Owner | Source (project evidence) | Exact support | Market ok | Registry-ready |
|---|---|---|---|---|---|---|---|---|
| 1 | OG-10 Rainwater Harvesting Planner (`res-1010`) | NZ | "Fixed electrical work and the pump connection must be handled by an appropriately licensed electrical worker." | regulatory (licensing) | none for this sentence. Stage 9.17 records that the broad NZ rule "anything touching fixed wiring must be done by a licensed worker" was **wrong for NZ** (homeowners may legally do some wiring; the NZ block limits the licensed-worker rule to solar, batteries, inverters and generator connections) | **NO** (broader than the source; contradicts the recorded NZ position) | YES | **NO** |
| 2 | OG-10 (`res-1010`) | AU | "Fixed electrical work and the pump connection must be handled by a licensed electrician." | regulatory (licensing) | owner-approved AU electrical rule (electrical work in the home must be done by a licensed electrician; DIY electrical work is illegal, even for small jobs): Energy Safe Victoria Electrical DDIY, Electrical Safety Office Queensland "Don't do your own electrical work", NSW Government electrical safety (read directly 2026-09-22); sentence approved in Stage 9.41 (owner ruling 9) | YES (a narrower application of the approved AU rule; no source addresses pumps by name, so the pump wording is read as the pump's electrical connection) | YES | **YES** (owner may reject the pump reading; see §3) |
| 3 | OG-19 Battery Backup Planner (`res-1019`) | AU | "Solar and battery systems must be installed by a licensed electrician — DIY electrical work is illegal" | regulatory (licensing + legality, two spans of one sentence) | A: AU block "Electrical work in your home — including solar, home batteries, inverters … — must be done by a licensed electrician" (ESV DDIY, ESO Qld). B: "DIY electrical work is illegal, even for small jobs" and NSW Government "DIY electrical work is dangerous and illegal" (read directly 2026-09-22). Deployed Stage 9.29 | A YES; B YES (verified separately) | YES (Australian rule) | **YES** |
| 4 | OG-20 Alternative Energy Suitability Check (`res-1020`) | NZ | "Permanently connected: must be installed by a licensed electrical worker" | regulatory (licensing) | NZ generator-safety block: "Connecting it is work for a licensed electrical worker" (WorkSafe NZ technical bulletin, 3 Mar 2023, read directly 2026-09-22); rewrite G3 in Stage 9.34, deployed Stage 9.35 | YES (generator connection) | YES | **YES** |
| 5 | OG-20 | NZ | "Its connection must be installed by a licensed electrical worker." | regulatory (licensing) | as 4 (rewrite G6) | YES | YES | **YES** |
| 6 | OG-20 | NZ | "Consents or permits needed" | regulatory (consent … needed) | none. A worksheet field label; Stage 9.34 and 9.35 do not cite any source that consents or permits are needed for the generator options | **NO** | n/a | **NO** |
| 7 | OG-20 | AU | "Permanently connected: must be installed by a licensed electrician" | regulatory (licensing) | AU generator-safety block: dedicated generator inlet or changeover switch must be installed by a licensed electrician (ESV "Using a generator safely", reviewed 16 Mar 2026; ESO Qld; read directly 2026-09-22); rewrite G3 | YES | YES | **YES** |
| 8 | OG-20 | AU | "Its connection must be installed by a licensed electrician." | regulatory (licensing) | as 7 (rewrite G6) | YES | YES | **YES** |
| 9 | OG-20 | AU | "Permits or approvals needed" | regulatory (permit/approval … needed) | none (field label; named in Stage 9.35 only as an AU-specific line) | **NO** | n/a | **NO** |

The gate listed ten rows because OG-19 AU appears twice (see §4). OG-04's disclaimer is not in this list (false positive, already fixed in the held detector).

## 3. New registry entries (six; `numeric-claims.json` now holds 42)
`au-electrical-fixed-work-pump-licensed-electrician-esv` (AU, OG-10), `au-electrical-solar-battery-licensed-electrician-diy-illegal-esv` (AU, OG-19), `nz-generator-permanent-connection-table-licensed-worker-worksafe` and `nz-generator-connection-flow-licensed-worker-worksafe` (NZ, OG-20), `au-generator-permanent-connection-table-licensed-electrician-esv` and `au-generator-connection-flow-licensed-electrician-esv` (AU, OG-20). Each: one resource, one market, one exact phrase, `requiresLabel` the licensed-person wording, official source and authority recorded, source date, owner-approval history (Stages 9.29, 9.34, 9.35, 9.41), limitations including "not an exemption". None is a market-wide, resource-wide or profession-wide rule; none approves another sentence. The two Stage 10.12A entries are unchanged (registry tests pass). Held test `held-registry-resolve.test.ts.txt` proves each resolves only in its exact resource and market, that the three unsupported sentences stay unresolved and that a broader sentence is not approved. **Owner note:** entry 1 (OG-10 AU) rests on reading "fixed electrical work and the pump connection" as electrical work covered by the approved AU rule; reject it if you want the pump wording sourced by name, and it moves to the queue below.

## 4. OG-19 AU duplicate
Not a duplicated sentence or rendered copy. The sentence occurs **once** (the "Non-Negotiables" box). It contains **two** regulatory spans ("must be installed by a licensed electrician" and "DIY electrical work is illegal"), each reported once by the gate. The standing AU electrical safety block in the same resource also says both things but resolves as an approved block. One registry entry covers the sentence; no duplicate entry was created.

## 5. Live copy correction queue (NOT applied)
| Resource | Market | Current wording | Why not registered | Proposed neutral replacement | PDF rerender | Redeploy |
|---|---|---|---|---|---|---|
| OG-10 | NZ | "Fixed electrical work and the pump connection must be handled by an appropriately licensed electrical worker." | broader than the recorded NZ position (homeowners may do some wiring); no source for the pump | "Check which electrical work on the pump connection needs a licensed person where you live, and use a suitably qualified professional where it does." | yes (OG-10 NZ PDF) | yes |
| OG-20 | NZ | field label "Consents or permits needed" | no source; asserts a requirement as a label | "Consents or permits to check" | yes (OG-20 NZ PDF) | yes |
| OG-20 | AU | field label "Permits or approvals needed" | same | "Permits or approvals to check" | yes (OG-20 AU PDF) | yes |

Both OG-20 labels and the OG-10 NZ sentence are in the PDFs only (resource pages carry titles and descriptions, not the PDF text), so a correction means re-rendering three PDFs (or two, if the owner takes the OG-10 correction separately), re-staging and a deployment. Replacements are proposals and make no regulatory assertion.

## 6. Live hardened scan after the registry entries
30 resources / 60 files, **550 candidates, Bucket C 3** (all regulatory): OG-10 NZ (1), OG-20 NZ "Consents or permits needed", OG-20 AU "Permits or approvals needed". Registered claims resolved: the 2 from Stage 10.12A plus the 6 new entries (OG-19 AU, OG-20 NZ and AU rows, OG-10 AU). Output: `held-10.17/live-gate-1017a.out.txt`. At the **committed** detector the live Bucket C is 0.

## 7. OG-25
Re-run through the hardened detector: **0 unresolved**. Untouched.

## 8. OG-24
Not drafted: the gate must reach Bucket C 0 first (owner instruction). The Stage 10.17 rulings stand and nothing about them changed.

## 9. Owner decisions required
1. Approve the correction queue (three items) as a correction stage: re-render OG-10 NZ, OG-20 NZ and OG-20 AU PDFs with the neutral replacements, re-stage and deploy. Only then does the hardened detector reach Bucket C 0 and get promoted, and OG-24 drafting resumes.
2. Confirm or reject registry entry 1 (OG-10 AU pump wording).
3. Alternatively, rule that the two OG-20 field labels may be registered; I recommend the neutral label replacements because no source says a consent or permit is needed.

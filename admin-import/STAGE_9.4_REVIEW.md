# STAGE 9.4 — IMPORT ENGINE — OWNER REVIEW

**Status:** complete, awaiting owner review.
**No real OffGrid056 resource has been imported.** `data/` and `public/` are untouched — confirmed by `git status`.
**Date:** 21 September 2026.

---

## 1. Owner rulings 1–5 applied first

| Ruling | Result |
|---|---|
| **1. Narrow the Work folder** | Still inventoried read-only, but a file there is a resource candidate only on positive evidence: a programme code, or a confident type **and** a specific foundation. Sales, marketing, campaign, funnel, lead-generation, promotional and operational material is INTERNAL. Half-evidence is flagged `CANDIDACY_REVIEW`. **Work-folder resource candidates: 45 → 5.** |
| **2. Guide illustrations** | Unchanged and confirmed: supporting assets, attached where the owning resource is clear, `ASSET_LINK_REVIEW` where it is not. Never standalone resources. |
| **3. General foundation** | Re-inference now consults body text and folder context when the filename is household-wide, and the broad foundation itself is excluded from that second look. **General: 91 → 49** of 104 resource candidates. Nothing was forced. |
| **4. Planner** | No longer a fallback. Kept only when the name says "planner", never on body text alone. **Planners: 52 → 30 — 22 HIGH, 8 MEDIUM, 0 LOW.** 11 items had their type cleared and went to NEEDS_REVIEW with a `TYPE_REVIEW` flag. |
| **5. PDF/HTML pairs** | Clean pairs resolve automatically: both kept, PDF as member artefact, HTML as re-skin source, neither held back from import. **Manual duplicate queue: 92 → 47 groups**, 45 auto-resolved, 0 content mismatches. |

### Revised General count — and why 49 is right

The 49 are the programme's whole-household layer: OG-01 Home Resilience Scorecard, OG-02 Household Risk
Identifier, OG-03 Budget Pathway Selector, OG-05 5 Pillars Quick Reference, OG-06 72-Hour Emergency Checklist,
OG-22 Product Wishlist, OG-23 Supplier Question Bank, OG-26 3-Tier Budget Planner, OG-29 30-Day Master Action
Plan, and similar. 21 of them were reached by the cross-cutting rule (several foundations scoring alike) and 28
scored General directly. The foundation-specific resources (OG-08…OG-21) keep their own foundation.

**Revised foundation spread across 104 resource candidates:** general 49 · shelter 20 · energy 18 · water 8 ·
food 6 · air 3.

---

## 2. What the import engine is

`admin-import/import/engine.ts`, driven by `npm run import:apply`. Planning is separate from doing:

- **`planImport()`** works out what *would* happen and writes nothing. Its plan can be read and argued with.
- **`runImport()`** carries a plan out, and only with `commit: true`.

Five properties it is built around:

1. **Nothing is written without an explicit commit.** A dry run is the default at every level.
2. **The Stage 9.3 gate is re-checked at the moment of import**, not trusted. Being marked ready yesterday is
   not a reason to import something invalid today.
3. **Everything that will be overwritten is backed up first**, into `workspace/backups/<timestamp>/`.
4. **A failed batch is rolled back** — records created are removed, records replaced are restored.
5. **Every resource enters as a draft** (decision D9-7), whatever the editor said.

Source files are opened only to copy the member download. They are never written to, moved or renamed.

---

## 3. Commands

```bash
npm run import:apply -- --demo              # build fixtures, plan, write nothing
npm run import:apply -- --demo --commit     # carry it out, into a sandbox library
npm run import:apply                        # plan the real workspace into a sandbox library
npm run import:apply -- --commit --real     # REFUSED until Stage 9.5
```

`--real` is the only way to write into the actual member library, and it is refused outright:

```
Refused: --real would write into the member library.
Stage 9.4 is fixtures only; importing real OffGrid056 resources needs owner approval at Stage 9.5.
```

The refusal is written to the audit log. Without `--real`, the target is a sandbox library inside the
workspace, which is git-ignored and never deployed.

---

## 4. The demonstration run

`--demo` builds its own world under `workspace/demo/` — three fixture PDFs, three candidates, three decisions
and an empty library. No OffGrid056 material is involved. The three fixtures are chosen to show the engine's
behaviour rather than flatter it:

```
target: workspace\demo\library (sandbox — not the member library)
plan: create 1 · replace 0 · skip 0 · reject 2

  + create  water-storage-fixture    Water_Storage_Fixture.pdf
  ✗ reject  incomplete-fixture       Incomplete_Fixture.pdf
      description: a description is required: members see this on the card
  ✗ reject  readme-fixture           README_Fixture.pdf
      this is internal or source material … not a member resource — a written override is required

Dry run: nothing was written. Add --commit to carry this out.
```

With `--commit`: **imported 1 · rejected 2 · skipped 0**, producing exactly two files —
`data/resources/water-storage-fixture.json` and `public/resources/water-storage-fixture.pdf`.

Running it a second time: **imported 0 · rejected 2 · skipped 1** — "already imported from an identical file".

**The imported record was then checked against the member library's own `ResourceSchema`:**

```
VALID against the member library ResourceSchema
status in file: draft | downloadable: true | fileFormat: PDF
```

The editor had said `published`; the engine wrote `draft`, as decision D9-7 requires.

---

## 5. Test results

**143 tests pass, 0 failures** (6 files):

| Suite | Tests |
|---|---:|
| V1 member library | 58 (unchanged) |
| Importer (scan + classify + dedupe + rulings) | 30 |
| Admin review workflow | 33 |
| **Import engine (new)** | **22** |

The 22 new tests cover every area the brief named, plus the ones that matter most for damage control:

- **Planning** — ignores anything not marked ready; create vs replace; re-checks the gate instead of trusting
  the stored status; refuses non-resource material.
- **Dry run** — writes nothing at all, and still records that it was asked.
- **Batch import** — several candidates in one run; the record is one the library can actually read; the
  download is copied beside it; the status is forced to draft; no half-written `.importing` files remain.
- **Backup before replacement** — the existing record is backed up intact before being overwritten; an existing
  download is backed up too; no backup folder is created when nothing is replaced.
- **Rollback** — when a write fails part way through a batch, records created are removed and records replaced
  are restored byte-for-byte; the rollback is logged.
- **Invalid import rejection** — rejected without writing, with the reason given; one rejection does not stop
  the valid items; a candidate with unconfirmed low-confidence guesses is refused.
- **Importing twice** — identical bytes are skipped; changed bytes plan a replace.
- **Audit logging** — every write records what it was, what it replaced and who ran it; the log only appends.
- **Source integrity** — after a full three-item import, every source file is byte-identical including its
  modified time.

Also passing: `npm run lint` clean, `npm run typecheck` clean (via the build).

---

## 6. Member-build isolation proof

| | Files | Total | JS |
|---|---:|---:|---:|
| Stage 8 baseline | 800 | 20.03 MB | 956 KB |
| After Stage 9.4 | 800 | 20.03 MB | 956 KB |

**Unchanged.** No occurrence in `out/` of `admin-import`, `importer`, `workspace`, `3810`, `imported.json`,
`fixture`, `demo-0001` or `sha256:`.

`git status data public` reports **no changes**: not one real resource record or download was written.

One thing worth saying plainly: the member build's type check *does* cover `admin-import/`, and it caught a
real type error in the engine during this stage. Type checking is not bundling — nothing from the importer
reaches `out/` — but it does mean a broken importer will fail the member build, which is the safer direction
for that coupling to run.

---

## 7. Deliberate limits

- **No UI for importing yet.** The engine is driven from the command line. An "import selected" button in the
  admin interface is easy to add, but it would make it possible to import by accident, and nothing may be
  imported for real until Stage 9.5. Say the word and it goes in.
- **The ledger is keyed by candidate id and source checksum.** If the same document is scanned again with a
  different candidate id, the engine will see it as new. Re-importing a changed file works correctly; a full
  re-scan followed by an import would need the ledger keyed by checksum alone, which is a small change to make
  once the real import is approved.
- **Replacement keeps the last backup only per run.** Every run gets its own timestamped folder, so history is
  preserved across runs, but a single run that replaces the same file twice would keep only the first backup.
  That cannot currently happen, since a plan holds one item per candidate.

---

## 8. Owner decisions required

1. **Approve importing for real at Stage 9.5?** That is what `--real` is waiting on. Worth deciding alongside:
   the repository is public, so importing real member resources would publish them. My recommendation is that
   the real import targets a private deployment, not this public repository.
2. **An "import" action in the admin UI** — add it, or keep imports to the command line?
3. **Where do member downloads live?** The engine currently copies the file to `public/resources/<slug>.<ext>`
   and points `fileUrl` there. For real resources on a public repository that is a publishing decision, not a
   technical one.

---

## 9. Next stage

**STAGE 9.5 — 30-DAY PROGRAMME AUDIT** (audit only, no import), per the approved Stage 9 plan.
Awaiting owner approval of this package.

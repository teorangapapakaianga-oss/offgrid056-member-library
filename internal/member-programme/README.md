# OffGrid056 — Member Programme & Resource Library

**The internal workstream for the member-facing library: the resources, their safety architecture, and the private
preview they are reviewed in.**

This is project organisation only. It documents work that already exists in this build; it changes nothing about the
build, the deployment or the data.

**Created:** 23 September 2026

---

## Purpose

To keep Member Programme and Resource Library work separate from unrelated OffGrid056 work in this project, with one
place that answers: what is live, what is prepared, what is blocked, what is next, and which safety wording is
approved.

## Scope — this workstream owns

- the Member Resource Library (member-facing pages, downloads, pathways)
- migrating the 45 legacy programme resources
- the Stage 9 migration reports
- NZ and AU market variants of every resource
- the safety architecture: approved blocks, market wording, detectors, exemptions
- PDF preparation and rendering
- the Five Foundations programme
- member learning pathways
- the Cloudflare private-preview deployment
- the future production membership system

## Not in scope

- social media content
- weekly campaigns
- general marketing
- any other OffGrid056 business work

Work in those areas does not belong in this folder, and this folder is not a place to track it.

## Where the work lives

| What | Where |
|---|---|
| Build | `C:\dev\OffGrid056-System\offgrid056-member-library\` |
| Site content (public, demo) | `data/`, `public/` — tracked in GitHub |
| Real member records and PDFs | `private-assets/` — **git-ignored, never committed** |
| Migration pipeline | `admin-import/` (audit, re-skin, prep, verify) |
| Owner decisions | `admin-import/config/` — `approved-copy.json`, `proposed-copy.json`, `metadata-review.json`, `safety-blocks.json` |
| Stage reports | `admin-import/STAGE_*.md` |
| Prepared previews | `workspace/prep/<code>/` — git-ignored |
| Rollback snapshots | `workspace/backups/private-assets-<worker version>/` — git-ignored |
| This workstream | `internal/member-programme/` |

## Deployment status

| | |
|---|---|
| Private preview | https://og056-preview.offgrid056-member-library.workers.dev |
| Worker | `og056-preview` |
| Current version | **`a65a1ef1-feea-4e89-9d96-c16b8db40336`** |
| Protected resources | **16**, all `status: draft` |
| Access | Cloudflare Access on all traffic; signed-out visitors are redirected to the Access login |
| Public / demo build | unchanged: 30 demonstration resources, no member files |
| Production membership system | not started |

## The rules this workstream works under

These are owner rules, carried across every stage:

1. **Cloudflare Access on all traffic**, and every real resource stays a **draft**.
2. **NZ and AU only.** No market chosen means no market-specific download. NZ members get NZ files, AU members get AU
   files, and no market's wording or figures are copied into the other.
3. **No real member resource files in public GitHub**, and `--real` stays disabled.
4. **Every number is verified, rewritten, removed, or kept clearly as an example.** No invented safety wording, and
   official NZ/AU sources only, read live.
5. **No visible legacy OG codes.** PDF titles are `<Resource Title> — OffGrid056`; `legacyCode` stays internal.
6. **Teaching content is not rewritten without owner approval.** Everything is proposed first.
7. **Fail closed.** If a check cannot be satisfied, the build stops rather than guessing.
8. **Rollback is retained** for every deployment.

## Working rule

When a stage report is finished, update:

- `CURRENT_STATUS.md` — always
- `RESOURCE_REGISTER.md` — always
- `SAFETY_REGISTER.md` — if safety wording, blocks, exemptions or detectors changed
- `DEPLOYMENT_REGISTER.md` — if anything was deployed
- `NEXT_ACTIONS.md` — always

## Files here

| File | What it holds |
|---|---|
| `README.md` | this: purpose, scope, where things are, the standing rules |
| `CURRENT_STATUS.md` | the live snapshot: resources, worker, tests, next resource, blockers |
| `PROGRAMME_ARCHITECTURE.md` | Five Foundations, Start Here, planning and implementation pathways, future progress system |
| `RESOURCE_REGISTER.md` | all 45 legacy resources and their state |
| `SAFETY_REGISTER.md` | approved blocks, market differences, fail-closed rules, pending research |
| `DEPLOYMENT_REGISTER.md` | worker versions, rollbacks, counts, dates, stages |
| `NEXT_ACTIONS.md` | the queue, and the research that gates it |

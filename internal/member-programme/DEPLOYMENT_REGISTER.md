# Deployment register

Every private-preview deployment: version, what went out, and what it can roll back to.

**Worker:** `og056-preview` · **URL:** https://og056-preview.offgrid056-member-library.workers.dev
**Access:** Cloudflare Access on all traffic, at every version.

**As at:** 23 September 2026.

---

## Current

| | |
|---|---|
| **Live version** | **`a65a1ef1-feea-4e89-9d96-c16b8db40336`** |
| Deployed | 22 September 2026, 09:58 UTC |
| Resources | **16** (32 market files) |
| Stage | 9.39 — OG-08 Water Storage Calculator |
| **Rollback** | `61d2acd0-4936-425f-a2d8-4cda5082db57` (15 resources) |
| Private files for rollback | `workspace/backups/private-assets-61d2acd0` (45 files) |

## History

| Version | Deployed (UTC) | Resources | Stage | What went out |
|---|---|---|---|---|
| `a65a1ef1` | 22 Sep 2026 09:58 | **16** | 9.39 | **OG-08** Water Storage Calculator · route supersession (real resource over demo placeholder, preview only) |
| `61d2acd0` | 22 Sep 2026 09:22 | 15 | 9.37 | **OG-B12** Off-Grid System Architecture Planner · fuel-detector correction (no global "gas heater" exemption) |
| `77020e71` | 22 Sep 2026 08:29 | 14 | 9.35 | **OG-20** Alternative Energy Suitability Check · the generator-safety block · scoped AU CO trim |
| `20a35551` | 22 Sep 2026 07:39 | 13 | 9.33 | **OG-21** Home Energy & Shelter Upgrade Plan · OG-18 back-links on OG-B07, OG-19, OG-26 (records only) |
| `4daef2b4` | 22 Sep 2026 06:35 | 12 | 9.31 | **OG-18** Solar Power 101 Workbook |
| `e175bc11` | 22 Sep 2026 05:33 | 11 | 9.29 | **OG-19** Battery Backup Planner |
| `6954a621` | 22 Sep 2026 04:45 | 10 | 9.27 | **OG-11** 30-Day Pantry Builder |
| `87d2301c` | 22 Sep 2026 03:10 | 9 | 9.24 | **OG-27** 90-Day Implementation Roadmap · corrected OG-25 AU |
| `2aa8a131` | 22 Sep 2026 02:28 | earlier | 9.23 | OG-22 and OG-26, with five title corrections |
| `d1644b97` | 21 Sep 2026 23:11 | earlier | 9.19–9.20 | OG-15 and OG-B07, plus updated OG-02, OG-25, OG-B10 |

Earlier versions exist in the Cloudflare deployment history (Stages 9.8–9.15: the first demo deployment, the private
preview, and OG-B04). They are retained but not itemised here.

## Rollback

Every deployment keeps two things:

1. **The previous Worker version**, in Cloudflare's deployment history.
2. **A snapshot of the private files** that version was built from, in `workspace/backups/private-assets-<version>/`
   (git-ignored).

| Snapshot | Files | Matches |
|---|---|---|
| `private-assets-a65a1ef1` | 48 | the live build |
| `private-assets-61d2acd0` | 45 | 15 resources — the current rollback |
| `private-assets-77020e71` | 42 | 14 resources |
| `private-assets-20a35551` | 39 | 13 resources |
| `private-assets-4daef2b4` | 36 | 12 resources, without the OG-18 back-links |
| `private-assets-e175bc11` | 33 | 11 resources |
| `private-assets-6954a621` | 30 | 10 resources |

**Rolling back a route supersession** also restores the demo placeholder on that route, because the placeholder
record in `data/` is never changed.

## What is checked before every deployment

1. `import:prep` — every approved change applies; no content flags; readiness READY_AFTER_FINAL_VALIDATION
2. PDFs re-rendered from the prepared HTML
3. `import:verify-prep` — every prepared file: safety blocks, applied changes, market terms, no tokens, no VERIFY, no
   browser-error page, draft status, correct PDF title
4. A per-resource content check: removed figures, each market's own wording, layout
5. `npm run build:preview` then `import:verify-build` — the exact build: record count, market files, broken links
6. Byte-for-byte comparison: the deployed PDFs match the checked PDFs, and earlier resources' PDFs are unchanged
7. Local routing: no market means no download; NZ gets NZ; AU gets AU; one card; one Downloads entry
8. `wrangler deploy`
9. Access probes on the new routes (302 to the Access login), and `--real` still refused

## Deployment discipline

- **Nothing is deployed without explicit owner approval** for that resource.
- **Only the new resource changes.** Earlier PDFs are not re-rendered, and their records are only touched when the
  owner approves it (as with the OG-18 back-links).
- **`private-assets/` is never committed.** Public GitHub has no member files.
- **A failed check stops the deployment.** It has happened and worked: the OG-08 build failed validation on a
  programme-day worksheet link, and nothing went out.

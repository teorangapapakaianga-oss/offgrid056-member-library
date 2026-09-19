# OffGrid056 Member Resource Library

Member education, resource and implementation library for OffGrid056, built around the Five Foundations:
**AIR • WATER • SHELTER • FOOD • ENERGY**.

*Prepare • Adapt • Thrive. Prepared, not panicked.*

**Status:** V1 in development. The Stage 2 architecture is approved; see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

> **This repository is public.** It contains placeholder and demo content only. Paid member resources, member
> data, credentials and `.env` files must never be committed.

- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, built as a static export
- Local development port: 3800
- The architecture, owner decisions and working notes are kept in `../internal/`, outside this repository.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 24) |
| `npm run dev` | Development server on http://localhost:3800 |
| `npm run validate` | Check every content file (runs automatically before each build) |
| `npm run build` | Validate the content, then build the static site into `out/` |
| `npm run test` | Unit tests: filters, search, progress |
| `npm run lint` · `npm run typecheck` | Code checks |

## Adding a resource (V1)

Add one JSON file to `data/resources/` (copy an existing one), then run `npm run validate`. The resource
appears automatically in its foundation, its category, search and filters, plus any collection it lists.
Full instructions arrive with the Stage 8 documentation.

## Known workaround

`tools/flatten-segment-prefetch.mjs` runs after every build. Next.js 16.3.5's static export writes its
page-prefetch files under names the browser doesn't request, so without this step every prefetch fails
(404) on a static host. Re-check whether it is still needed on each Next.js upgrade.

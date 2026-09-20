# OffGrid056 Member Resource Library

Member education, resource and implementation library for OffGrid056, built around the Five Foundations:
**AIR • WATER • SHELTER • FOOD • ENERGY**.

*Prepare • Adapt • Thrive. Prepared, not panicked.*

> **This repository is public and the library is demonstration content only.** No real paid or member resource,
> no member data, no credentials and no `.env` file belongs here. See
> [Member progress and privacy](docs/MEMBER_PROGRESS_AND_PRIVACY.md).

---

## What it is

A static site that gives members one place to find, work through and keep track of OffGrid056 resources:

- **Dashboard** — continue where you left off, recommended next step, progress across the Five Foundations, the
  30-Day Programme, recently viewed, saved and what is new.
- **Library** — search that tolerates typos and NZ/AU vs US/CA spellings, with filters for foundation, type,
  difficulty, time and status. Every view is a shareable link.
- **Five Foundations** — a page per foundation with its topics, and a page per topic.
- **Resources** — description, objectives, time, difficulty, Open/Download, save, mark complete, related
  resources and a recommended next step.
- **Learning paths** — short ordered routes with progress and a continue action.
- **30-Day Programme** — a day at a time, with linked resources, a worksheet, completion and private notes.
- **Member Downloads** — every file in one table, with format, size and updated date.
- **Suppliers & Services** and **Workshops & Events** — directories for New Zealand, Australia, the United States
  and Canada, with external booking links.
- **My Progress** — the full picture, plus back up, restore and start again.

**V1 has no login, no database and no server.** A member's progress lives in their own browser.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · static export · Vitest · ESLint.
Local development runs on port **3800**.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:3800.

## Documentation

| Document | What it covers |
|---|---|
| [Setup and building](docs/SETUP.md) | Installing, local development, commands, release checks |
| [Deployment](docs/DEPLOYMENT.md) | Hosting the built site, and keeping V1 private until accounts exist |
| [Content guide](docs/CONTENT_GUIDE.md) | Adding resources, learning paths, programme days, suppliers and workshops |
| [Member progress and privacy](docs/MEMBER_PROGRESS_AND_PRIVACY.md) | What is stored, backup and restore, start again, and the limits of V1 |
| [Architecture](docs/ARCHITECTURE.md) | How the whole thing is put together, and the path to accounts and a database |

## Project layout

```
app/          pages (one folder per route)
components/   interface: layout, resources, member, programme, directory, ui
data/         all content as JSON: resources, learning paths, programme, suppliers, workshops, taxonomy
lib/          logic: content repository, search, filters, progress, member state, formatting
public/       brand images, icons, and the resource files themselves
docs/         the documents above
tools/        content validation, QA audits, build helpers
tests/        unit tests
```

Two rules keep it maintainable: **pages never read `data/` directly** (they go through `lib/content`), and
**components never touch browser storage** (they go through `lib/member`). Those two modules are the swap points
for a future content system and for accounts.

## Adding a resource

Add one JSON file to `data/resources/`, then `npm run validate`. It appears in its foundation, its category,
search, filters, the download centre and any collection it lists, with no code change. Full details in the
[content guide](docs/CONTENT_GUIDE.md).

## Known workaround

`tools/flatten-segment-prefetch.mjs` runs after every build. Next.js 16.3.5's static export writes its
page-prefetch files under names the browser never requests, so without this step every prefetch fails on a static
host. Re-check whether it is still needed after a Next.js upgrade.

## Status

V1: demonstration content only — 30 resources, 3 learning paths, 30 programme days, 10 suppliers and 5 workshops,
all clearly marked. Real OffGrid056 resources are imported once the architecture and interface are approved.

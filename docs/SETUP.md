# Setup, local development and building

## What you need

| Tool | Version | Why |
|---|---|---|
| Node.js | 24 or newer | Runs the site and the build |
| npm | comes with Node | Installs packages |
| A browser | any modern one | Viewing and checking the site |
| Google Chrome | optional | Only for regenerating the demo PDFs |

No database, no server and no accounts are needed. V1 is a static site.

## Install

```
cd offgrid056-member-library
npm install
```

## Local development

```
npm run dev
```

Then open **http://localhost:3800**. Pages reload as you edit. Content files reload too, but if a change to
`data/` does not show up, restart the command.

## Everyday commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3800 |
| `npm run validate` | Checks every content file. Runs automatically before each build. |
| `npm run build` | Validates content, then builds the static site into `out/` |
| `npm run serve` | Serves the built `out/` folder so you can check the real thing |
| `npm run test` | Unit tests (filters, search, progress, member state, resource system) |
| `npm run lint` | Code style |
| `npm run typecheck` | Types |

## Building for release

```
npm run build
```

This does three things:

1. **Validates all content.** A bad entry stops the build with a message naming the file and the field.
2. **Builds the static site** into `out/` — plain HTML, CSS, JavaScript and files. 124 pages at V1.
3. **Runs `tools/flatten-segment-prefetch.mjs`**, a workaround for a Next.js 16.3.5 static-export quirk (see
   "Known workaround" in the README). Re-check whether it is still needed after a Next.js upgrade.

### Before any release, check

- `npm run validate -- --release` — fails while any demonstration content is still published.
- `out/` contains no QA tooling (`qa-contrast.js`, `qa-sweep.html`). Those are copied in by hand for testing only.
- The build printed no warnings.

## Checking accessibility and responsiveness

`tools/qa-sweep.md` explains how to run the two audits (`tools/qa-contrast.js`) across every route at 360, 768
and 1440 px using `tools/qa-sweep.html`. Both are QA-only and must never be deployed.

## Regenerating the demo files (rarely needed)

The 25 placeholder PDFs and the ZIP pack in `public/resources/` were generated from the resource data with headless
Chrome. They are committed, so a normal build does not need Chrome. They are replaced one-for-one by real OffGrid056
files at the import phase.

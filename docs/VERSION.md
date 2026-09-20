# Version information

| | |
|---|---|
| **Product** | OffGrid056 Member Resource Library |
| **Version** | **V1** |
| **Status** | **RELEASE READY — DEMO / PRIVATE DEPLOYMENT** |
| **Released** | 20 September 2026 |
| **Brand** | OffGrid056 · Prepare • Adapt • Thrive · "Prepared, not panicked" |
| **Framework** | The Five Foundations: AIR • WATER • SHELTER • FOOD • ENERGY |
| **Markets** | New Zealand, Australia, United States, Canada |
| **Repository** | https://github.com/teorangapapakaianga-oss/offgrid056-member-library |

## What "release ready — demo / private deployment" means

V1 is complete, tested and safe to deploy **privately** or with **demonstration content only**.

**It is not production-ready for unrestricted public member access.** It has:

- **no login**, so anyone with the address can open every page;
- **no paid-access enforcement**, so the `premium` flag is stored but never checked.

Real member-only or paid resources must not be published openly until authentication and access control are added.
See `MEMBER_PROGRESS_AND_PRIVACY.md` and `DEPLOYMENT.md`.

## Build at this version

| Measure | Figure |
|---|---|
| Routes | 124 (123 HTML pages) |
| Unit tests | 58 |
| Accessibility audits | 72 page audits (24 routes × 360, 768, 1440 px): 0 failures |
| First-load JavaScript | 576–624 KB per page |
| Fonts / CSS | 247 KB / 36 KB |
| Built site | 21.0 MB, of which 9.2 MB is demonstration files |
| Content | 30 resources · 3 learning paths · 30 programme days · 10 suppliers · 5 workshops — **all demonstration content** |

## Stack

Next.js 16.3.5 · React 19.2.8 · TypeScript 5.9 · Tailwind CSS 4.3 · MiniSearch 7.2 · Zod 4.6 (build time only) ·
Vitest 5 · ESLint 9. Static export; no server, database or runtime dependency.

## Known workaround at this version

`tools/flatten-segment-prefetch.mjs` runs after every build to fix a Next.js 16.3.5 static-export quirk
(page-prefetch files are written under names the browser never requests). Re-check after a Next.js upgrade.

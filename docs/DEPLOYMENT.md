# Deployment

V1 builds to a folder of plain files (`out/`). Anything that can serve static files can host it: there is no
server, database or runtime to manage.

## Before you deploy

1. `npm run build` completes with no warnings.
2. `npm run validate -- --release` — **for a real launch**, this must pass, which means no demonstration content
   is still published. While the library is still demo-only, expect it to fail by design.
3. `out/` contains no QA tooling: `qa-contrast.js`, `qa-sweep.html`, `qa-seed.html`.
4. **Access:** V1 has **no login and no paid-access enforcement**. Anyone with the address can read every page and
   download every file. Until accounts exist, either deploy privately (see below) or publish demonstration content
   only.

## Hosts

| Host | Setup |
|---|---|
| **Vercel** | Import the repository. The framework is detected automatically; build `npm run build`, output `out`. |
| **Cloudflare Pages** | Build command `npm run build`, output directory `out`. Headers come from `public/_headers` if you add one. |
| **Railway** | Build, then serve `out/` with any static file server. |
| **Any web host / CDN** | Upload the contents of `out/`. Keep the folder structure exactly as built. |

Every page is exported as `route/index.html` (trailing slashes are on), so no URL rewriting is needed.

## Keeping V1 private until accounts exist

Pick whichever suits you:

- **Cloudflare Access** in front of Cloudflare Pages: free for small teams, sign-in by email.
- **Vercel password protection** (a paid plan feature).
- **Basic authentication** on your own web host.
- **Publish demonstration content only** and keep real member resources out of the build.

`robots.txt` and a `noindex` tag are already in place, which keeps the site out of search results but does **not**
stop anyone who has the address.

## After deploying

- Open the site and check the dashboard, the library search, one resource page and one download.
- Check that no QA file is reachable: `/qa-contrast.js` and `/qa-sweep.html` must return "not found".
- Confirm the site is not indexable: `/robots.txt` should disallow everything.

## Moving to a server later

When accounts, paid tiers or progress syncing are added, remove `output: "export"` from `next.config.ts` and host
on a platform that runs Next.js (Vercel or Railway). The pages and components do not change; see
`docs/ARCHITECTURE.md` §14 for the full path.

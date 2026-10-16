# Stage 11.0K — Country selector usability correction (not deployed)

**Status: fixed and verified locally; NOT deployed (the live Worker is still `bde27561-cd8d-4984-bff5-a8bf8489709a`). Redeployment needs the Project Owner's explicit approval.** No change to Cloudflare Access, automatic builds, entitlements, the approved documents, market metadata or resource IDs; the separate Resilience OS was not touched.

## 1. Cause (identified before any change)
- The behaviour is by design: the chosen country is stored in the browser (`og056.member.v1`) and is never re-asked or inferred, so leaving the page, opening Start Here and returning keeps New Zealand.
- The only control that changes the country was `MarketIndicator` ("Market: … Change") at the **foot of the desktop-only sidebar** (`member-sidebar.tsx`, `lg:` and up). On a 1024 × 768 screen the button sits about 1,286 px down inside a scrolling sidebar (off screen); on tablet and phone the sidebar is not shown and the drawer and bottom bar do not contain the control, so there was **no way to change country at all**. The download panel itself, where the choice matters, had no control.
- Verified on the deployed code: calling that sidebar control worked (NZ → AU switched the PDF and DOCX together and stored `AU`). So the defect was discoverability, not the store or the file selection.

## 2. Correction (smallest change)
- **`components/member/market-controls.tsx`:** new `MarketSwitcher`: a clearly visible, 44-px "Change country" button (with the current country for screen readers) that opens the same New Zealand / Australia buttons and writes the same stored choice. It renders only when a country has been chosen. The "Not available for … yet" state of `MarketGate` also shows it.
- **`components/resources/market-download.tsx`:** renders `MarketSwitcher` under the "This version is for …" line, so every market-specific download uses it (OG-B13, OG-B15 and the existing country-specific resources; `MarketDownload` is the only component that renders `marketFiles`).
- **`lib/content/companions.ts`:** `editionForMarket` selects the PDF and editable DOCX as one pair for the chosen country (never another country's file); `MarketDownload` uses it.
- Unchanged: the documents, record data and IDs, the sidebar indicator, the store, Access, routes and security. No new geographic inference.

## 3. Test evidence
- **Unit tests (`tests/unit/market-switch.test.ts`, 8 tests):** NZ → AU → NZ returns the matching PDF and DOCX pair each time and the market code of the PDF and DOCX always agree; no market: nothing offered; no fallback to the other country; the editable version is absent (not the other country's) when its country has none; the store persists NZ → AU → NZ and each value is read back by a fresh store (a reload); a fresh browser has no market; the control is in the download panel, shows only when a country is chosen, uses the same store write, and is used once by the resource page.
- **Real browser, on a clean build of the fix (local static copy; localStorage cleared first):**
  - OG-B13: no market → chooser, no files; choose New Zealand → NZ PDF + NZ DOCX and "Change country" shown; Change country → selector opens → Australia → AU PDF + AU DOCX and "This version is for Australia"; Change country → New Zealand → NZ pair again.
  - **Persistence:** chosen through the control, NZ survived a page reload; AU, chosen through the control, survived navigating to Start Here and opening OG-B15 (which showed the AU PDF and DOCX).
  - OG-B15: NZ → AU → NZ switched PDF and DOCX together each time.
  - An existing country-specific resource (Emergency Readiness Checklist, PDF only): NZ → AU → NZ switched correctly and the control is present.
  - **Phone width (375 px):** the "Change country" button is visible inside the download panel (it was previously unreachable there).
- **Repository checks:** full suite **70 files, 1,799 tests, exit 0**; lint exit 0 (0 errors); typecheck exit 0; `import:verify-prep` and `import:verify-build` exit 0 (38 records · 76 market files · 0 broken links; DOCX checks ✓).

## 4. Regression against what is live
Two fresh clean builds of the fix are identical to each other. Compared with the build deployed in Stage 11.0K (1,108 files): **2 files differ (client JavaScript chunks), 0 HTML pages differ in visible text or in markup** (the download panel is rendered client-side, so the static HTML is unchanged), all 101 PDFs are byte-identical, and the four DOCX are unchanged. Nothing is added or removed apart from the build id and the two chunk names.

## 5. Not tested
Live behaviour (the fix is not deployed); authenticated downloads on the live site (still the owner's check from Stage 11.0K); Cloudflare Access on the changed code (no Access change and no new route).

## 6. Deployment proposal (not executed; needs your approval)
Same controlled procedure as Stage 11.0K, from the commit containing this fix: clean tree, two fresh builds identical, `import:verify-build` exit 0, one `npx wrangler deploy`, then unauthenticated probes (expect every route to redirect to Access), worker version check and the NZ → AU → NZ test on the new pages. Rollback target: `bde27561-cd8d-4984-bff5-a8bf8489709a` (then `d7480c93-75fb-4ca5-8b40-0383b9cacadf`). Until then, workarounds on the live site: on desktop scroll the sidebar to its foot and use "Market: … Change"; on a phone, clear this site's saved data (or use a private window).

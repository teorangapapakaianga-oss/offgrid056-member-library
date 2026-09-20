# Browser QA sweep (Stage 6)

`tools/qa-contrast.js` provides two audits for a page that is being served from `out/`:

- `ogContrastAudit()` — WCAG 2.2 AA text contrast, measured on the painted colours
- `ogA11yAudit()` — headings, alt text, accessible names, tap targets, landmarks, skip link, overflow

## Running a sweep

```
npm run build
copy tools\qa-contrast.js out\        # QA only: delete from out/ before deploying
python -m http.server 3801 --directory out
```

Then, in the page console, for each route and at each width (375, 768, 1440):

```js
await import('/qa-contrast.js');
({ contrast: ogContrastAudit(), a11y: ogA11yAudit() });
```

Notes:

- A hidden browser tab freezes CSS transitions part-way, so `ogContrastAudit()` disables transitions while it
  measures. Without that, selected chips and tabs report false failures.
- Interactive states (drawer open, filter sheet open, a tab or chip selected) must be audited too: open the state
  first, then run the audit.
- `out/qa-contrast.js` must be deleted before any deployment. It is QA tooling, not part of the product.

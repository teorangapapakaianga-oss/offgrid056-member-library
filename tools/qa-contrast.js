/**
 * Browser QA: WCAG 2.2 AA text-contrast audit of the rendered page.
 *
 * Colours are resolved through a canvas, so Tailwind's oklab()/color-mix() opacity values are measured as the
 * browser actually paints them (a naive rgb() regex reports false failures). Backgrounds are composited up the
 * ancestor chain. Hidden text, screen-reader-only text and closed dialogs are skipped.
 *
 * Usage while a build is being served:
 *   copy tools\qa-contrast.js out\   (QA only: delete it from out/ before deploying)
 *   then in the page console: await import('/qa-contrast.js'); ogContrastAudit(); ogA11yAudit();
 */
(function () {
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const cache = new Map();

  function toRGBA(col) {
    if (cache.has(col)) return cache.get(col);
    cv.clearRect(0, 0, 1, 1);
    cv.fillStyle = col;
    cv.fillRect(0, 0, 1, 1);
    const d = cv.getImageData(0, 0, 1, 1).data;
    const m = col.match(/\/\s*([\d.]+)\s*\)/) || (col.startsWith("rgba") ? col.match(/,\s*([\d.]+)\s*\)$/) : null);
    const a = m ? Number(m[1]) : d[3] / 255;
    const res = { r: Math.min(255, d[0] / (a || 1)), g: Math.min(255, d[1] / (a || 1)), b: Math.min(255, d[2] / (a || 1)), a };
    cache.set(col, res);
    return res;
  }
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  function bgOf(el) {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const c = toRGBA(getComputedStyle(e).backgroundColor);
      if (c.a > 0) stack.push(c);
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }
  function visible(el) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width >= 1 && r.height >= 1 && cs.visibility !== "hidden" && cs.opacity !== "0" && !el.closest(".sr-only") && !el.closest("dialog:not([open])");
  }

  window.ogContrastAudit = function () {
    // A hidden tab (the pane in the background) freezes CSS transitions part-way, so computed colours would be
    // half-finished. Turn transitions off for the duration of the audit and measure the settled colours.
    const killTransitions = document.createElement("style");
    killTransitions.textContent = "*,*::before,*::after{transition:none !important;animation:none !important}";
    document.head.appendChild(killTransitions);
    void document.body.offsetHeight; // force a style recalculation
    const rows = [];
    const seen = new Set();
    for (const el of document.querySelectorAll("body *")) {
      if (el.children.length || !el.textContent.trim() || !visible(el)) continue;
      const cs = getComputedStyle(el);
      const bg = bgOf(el);
      const fg = over(toRGBA(cs.color), bg);
      const L1 = lum(fg);
      const L2 = lum(bg);
      const ratio = Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100;
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || 400;
      const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
      const key = `${cs.color}|${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}|${Math.round(size)}|${weight}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ text: el.textContent.trim().slice(0, 30), size, weight, ratio, need, pass: ratio >= need });
    }
    killTransitions.remove();
    return { page: location.pathname, checked: rows.length, failures: rows.filter((r) => !r.pass), min: Math.min(...rows.map((r) => r.ratio)) };
  };

  /** Interface checks that do not need a screenshot: landmarks, headings, labels, tap targets. */
  window.ogA11yAudit = function () {
    const issues = [];
    const h1 = document.querySelectorAll("main h1, h1");
    if (h1.length !== 1) issues.push(`h1 count = ${h1.length}`);
    const levels = [...document.querySelectorAll("main h1,main h2,main h3,main h4")].map((h) => Number(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) issues.push(`heading jump h${levels[i - 1]} → h${levels[i]}`);
    for (const img of document.querySelectorAll("img")) if (!img.hasAttribute("alt")) issues.push(`img without alt: ${img.src}`);
    for (const c of document.querySelectorAll("button, a, input, select")) {
      const name = (c.textContent || "").trim() || c.getAttribute("aria-label") || c.getAttribute("title") || (c.labels && c.labels[0]?.textContent) || "";
      const r = c.getBoundingClientRect();
      if (r.width >= 1 && !name.trim()) issues.push(`${c.tagName} without an accessible name`);
      // A card title link stretches over its whole card (::after inset-0), so measure that card instead.
      const stretched = c.tagName === "A" && c.closest("article") && getComputedStyle(c, "::after").position === "absolute";
      const box = stretched ? c.closest("article").getBoundingClientRect() : r;
      // WCAG 2.5.8 exempts a link inside a sentence of text ("inline" exception).
      const parent = c.parentElement;
      const inlineInSentence =
        c.tagName === "A" && parent && /^(P|LI|SPAN|DD|TD)$/.test(parent.tagName) && parent.textContent.trim().length > name.trim().length + 12;
      if (inlineInSentence) continue;
      if (r.width >= 1 && (c.tagName === "BUTTON" || c.tagName === "A") && (box.height < 24 || box.width < 24)) {
        issues.push(`tap target ${Math.round(box.width)}×${Math.round(box.height)}: ${name.slice(0, 20)}`);
      }
    }
    if (!document.querySelector("main")) issues.push("no <main> landmark");
    if (!document.querySelector('a[href="#main"]')) issues.push("no skip link");
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth + 1) issues.push(`horizontal overflow: ${doc.scrollWidth} > ${doc.clientWidth}`);
    return { page: location.pathname, width: doc.clientWidth, issues };
  };
})();

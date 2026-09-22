/**
 * Re-skin: legacy programme HTML → current OffGrid056 brand (Stage 9.6C).
 *
 * A tool rather than hand-editing, for three reasons: eleven files is too many to do consistently by hand, the
 * same transformation has to run again on the other 34 later, and a tool can be tested. Every change it makes
 * is recorded, so the before/after is auditable rather than a matter of trust.
 *
 * **It never touches the source.** It reads legacy HTML and returns new HTML; writing is the caller's job, and
 * the CLI writes only into `workspace/reskin/`.
 *
 * What it deliberately does NOT do:
 *  - rewrite teaching content. Copy changes are Group B work and need owner approval.
 *  - recolour semantic status indicators. The risk matrix's red / amber / green carry meaning, and turning
 *    them into brand greens would destroy the very thing the member reads them for.
 *  - replace the word "pillar" blindly. Only the framework phrase is changed (owner ruling 4).
 */

/** The locked brand (Stage 3, unchanged since). */
export const BRAND = {
  resilienceGreen: "#A8CF20",
  deepGreen: "#35551A",
  charcoal: "#11130F",
  graphite: "#242720",
  warmWhite: "#F4F2EA",
  earthTaupe: "#756B5B",
  /** derived, used for hairlines on warm white */
  line: "#D8D4C6",
} as const;

/**
 * Legacy colour → brand colour.
 *
 * The legacy palette used navy as its dark, gold as its accent and orange as its secondary. The brand's
 * equivalents are Deep Green, Resilience Green and Earth Taupe. Graphite stands in for the legacy slate used
 * in gradients.
 */
export const COLOUR_MAP: Record<string, string> = {
  "#1A2332": BRAND.deepGreen, // legacy navy
  "#2D3A4D": BRAND.graphite, // legacy slate (gradient mid-stop)
  "#C9A227": BRAND.resilienceGreen, // legacy gold
  "#E8703A": BRAND.earthTaupe, // legacy orange
  "#F5F5F0": BRAND.warmWhite, // legacy warm white
  "#FAFAF8": BRAND.warmWhite,
  "#1A1A1A": BRAND.charcoal, // legacy charcoal
  "#444444": BRAND.graphite, // legacy body text
  "#E0DFDA": BRAND.line, // legacy hairline
};

/**
 * Colours that carry meaning rather than brand, and are therefore left alone.
 *
 * Red means "urgent", amber means "plan", green means "monitor". A member reads the colour before the words.
 */
export const SEMANTIC_COLOURS = new Set([
  "#C53030", "#FDE8E8", // high / urgent
  "#B7791F", "#FEF5E7", "#FFF5F0", // medium / plan
  "#2F855A", "#E6FFFA", // low / monitor
]);

/** Legacy → brand typography. Fonts are served locally: no Google Fonts call in a member artefact. */
const FONT_FACES = `
@font-face { font-family: 'Bebas Neue'; src: url('fonts/BebasNeue-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Montserrat'; src: url('fonts/Montserrat-Regular.woff') format('woff'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Montserrat'; src: url('fonts/Montserrat-SemiBold.woff') format('woff'); font-weight: 600; font-display: swap; }
@font-face { font-family: 'Montserrat'; src: url('fonts/Montserrat-Bold.woff') format('woff'); font-weight: 700; font-display: swap; }
`.trim();

export interface ReskinChange {
  kind: "colour" | "font" | "token" | "terminology" | "asset" | "brand" | "layout" | "note";
  from: string;
  to: string;
  count: number;
}

export interface ReskinOptions {
  /** where the cover images actually live, relative to the output file */
  assetBase?: string;
  /** the strapline to apply to covers */
  strapline?: string;
}

export interface ReskinResult {
  html: string;
  changes: ReskinChange[];
  /** things a person must look at before this is published */
  warnings: string[];
}

const countOf = (haystack: string, needle: RegExp) => (haystack.match(needle) ?? []).length;

/** How much bigger a Bebas Neue heading must be to carry the weight a Playfair Display heading did. */
export const HEADING_SCALE = 1.18;

/** Selectors whose font-size is a heading size rather than body copy. */
const HEADING_SELECTOR = /(^|[\s,>])(h1|h2|h3|h4)\b|\.(cover-title|section-title|matrix-title|info-box-title|page-header-title|card-title)\b/i;

/**
 * Scale the font-size of heading rules only.
 *
 * Done by rewriting the original declarations rather than appending overrides: an appended `em` rule would
 * resolve against whatever the parent happens to be, which is exactly the kind of quiet layout drift this
 * pilot exists to catch.
 */
export function scaleHeadings(html: string, factor: number): { html: string; count: number } {
  let count = 0;
  const out = html.replace(/([^{}]+)\{([^{}]*)\}/g, (whole, selector: string, body: string) => {
    if (!HEADING_SELECTOR.test(selector)) return whole;
    const newBody = body.replace(/font-size:\s*(\d+(?:\.\d+)?)px/gi, (decl, px: string) => {
      const scaledPx = Math.round(Number(px) * factor);
      if (scaledPx === Number(px)) return decl;
      count++;
      return `font-size: ${scaledPx}px`;
    });
    return `${selector}{${newBody}}`;
  });
  return { html: out, count };
}

/**
 * Mark small tables (up to 10 rows) to be kept whole when printing, so a table is never broken after its first row
 * with a header and one row stranded at the foot of a page (found in OG-19's load table). Taller tables may still
 * break between rows, which avoids large gaps.
 *
 * This runs LAST — after every copy change — because it edits the <table> tag: run earlier, it made approved
 * whole-table changes (OG-26's assistance tables, OG-19's comparison table) stop matching.
 */
export function keepSmallTablesTogether(html: string): string {
  return html.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (whole, attrs: string, inner: string) => {
    if ((inner.match(/<tr\b/gi) ?? []).length > 10 || /og-keep-together/.test(attrs)) return whole;
    const withClass = /\bclass="/.test(attrs) ? attrs.replace(/\bclass="([^"]*)"/, 'class="$1 og-keep-together"') : `${attrs} class="og-keep-together"`;
    return `<table${withClass}>${inner}</table>`;
  });
}

export function reskinHtml(source: string, options: ReskinOptions = {}): ReskinResult {
  const changes: ReskinChange[] = [];
  const warnings: string[] = [];
  let html = source;

  const record = (kind: ReskinChange["kind"], from: string, to: string, count: number) => {
    if (count > 0) changes.push({ kind, from, to, count });
  };

  // --- 1. typography ---------------------------------------------------------------------------------------
  const googleFonts = /@import\s+url\(['"]https:\/\/fonts\.googleapis\.com[^)]*\);?/gi;
  const googleCount = countOf(html, googleFonts);
  html = html.replace(googleFonts, FONT_FACES);
  record("font", "Google Fonts @import (Inter, Playfair Display)", "local Bebas Neue + Montserrat @font-face", googleCount);
  if (!googleCount) warnings.push("no Google Fonts import found: check how this document loads its fonts");

  const playfair = /'Playfair Display',\s*serif|"Playfair Display",\s*serif|'Playfair Display'|"Playfair Display"/g;
  const playfairCount = countOf(html, playfair);
  html = html.replace(playfair, "'Bebas Neue', Impact, sans-serif");
  record("font", "Playfair Display", "Bebas Neue", playfairCount);

  const inter = /'Inter',\s*sans-serif|"Inter",\s*sans-serif|'Inter'|"Inter"/g;
  const interCount = countOf(html, inter);
  html = html.replace(inter, "'Montserrat', system-ui, sans-serif");
  record("font", "Inter", "Montserrat", interCount);

  // Bebas Neue is condensed where Playfair Display is wide, so a heading set at the same pixel size lands
  // noticeably lighter on the page. Heading sizes are scaled up and given a little letter-spacing so the
  // re-skinned document keeps the original's visual hierarchy rather than quietly flattening it.
  const scaled = scaleHeadings(html, HEADING_SCALE);
  html = scaled.html;
  record("font", "heading sizes", `×${HEADING_SCALE} to match Bebas Neue's condensed proportions`, scaled.count);
  html = html.replace(/(\.cover-title\s*\{[^}]*)\}/, "$1 letter-spacing: 0.01em; }");

  // The cover's label, title and subtitle were each pinned to the bottom of the page at fixed offsets. With the
  // larger heading, a title that wraps to a third line grows upward over the label ("OffGrid056 30-Day
  // Programme" disappeared behind "OG-27 90-Day Implementation Roadmap"). They are stacked in one
  // bottom-anchored column instead, so a longer title pushes the label up rather than covering it.
  // A table row must never split across a page: a row torn between pages 3 and 4 reads as two broken rows
  // (found when an approved, longer OG-27 cell pushed its row over a page boundary).
  if (/<table/i.test(html)) {
    html = html.replace("</head>", `<style>\n  tr { break-inside: avoid; page-break-inside: avoid; }\n  table.og-keep-together { break-inside: avoid; page-break-inside: avoid; }\n</style>\n</head>`);
    record("layout", "table rows could split across pages", "rows kept whole when printing", 1);
  }

  // Short callout boxes must not split across a page either, and a heading must not be stranded at the foot of a
  // page away from its text (found in OG-11: "The Expiry Date Trap" split mid-sentence in NZ, and its title was
  // left alone on the page before its text in AU). Large section containers are deliberately not included:
  // forcing a tall worksheet section whole would leave large gaps.
  // flow-box: a decision-flowchart question and its answers (OG-20's Q3 "NO" answer was stranded alone on a page).
  const CALLOUTS = ["warning-box", "info-box", "closing-box", "total-box", "tip-box", "flow-box"];
  const present = CALLOUTS.filter((c) => html.includes(`class="${c}"`));
  if (present.length) {
    html = html.replace(
      "</head>",
      `<style>\n  ${present.map((c) => `.${c}`).join(", ")} { break-inside: avoid; page-break-inside: avoid; }\n  h2, h3, .warning-title, .info-box-title, .tip-title { break-after: avoid; page-break-after: avoid; }\n</style>\n</head>`,
    );
    record("layout", "callout boxes could split across pages", "callout boxes kept whole; headings kept with their text", 1);
  }

  // Only that layout: the centred cover design already stacks these in normal flow, and wrapping it would break
  // its centring.
  const coverText = /(<div class="cover-label">[\s\S]*?<\/div>\s*<h1 class="cover-title">[\s\S]*?<\/h1>\s*<p class="cover-subtitle">[\s\S]*?<\/p>)/;
  const pinnedLabel = /\.cover-label\s*\{[^}]*position:\s*absolute/.test(html);
  if (pinnedLabel && coverText.test(html)) {
    html = html.replace(coverText, '<div class="cover-text">$1</div>');
    html = html.replace(
      "</head>",
      `<style>
  .cover-text { position: absolute; left: 55px; right: 55px; bottom: 40px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
  .cover-text > .cover-label, .cover-text > .cover-title, .cover-text > .cover-subtitle { position: static; margin: 0; }
  .cover-text > .cover-title { max-width: 361px; }
  .cover-text > .cover-subtitle { max-width: 480px; }
</style>
</head>`,
    );
    record("layout", "cover label, title and subtitle at fixed offsets", "one bottom-anchored column (no overlap)", 1);
  }

  // --- 2. colour -------------------------------------------------------------------------------------------
  for (const [legacy, brand] of Object.entries(COLOUR_MAP)) {
    const pattern = new RegExp(legacy.replace("#", "#"), "gi");
    const n = countOf(html, pattern);
    html = html.replace(pattern, brand);
    record("colour", legacy, brand, n);
  }
  for (const semantic of SEMANTIC_COLOURS) {
    if (new RegExp(semantic, "i").test(source)) {
      record("note", `${semantic} kept`, "semantic status colour, not brand", 1);
    }
  }

  // --- 3. custom property names ------------------------------------------------------------------------------
  // The variables were named after the legacy palette. Leaving `--navy: #35551A` in place would be a trap for
  // whoever edits this next.
  const renames: [RegExp, string, string][] = [
    [/--navy\b/g, "--navy", "--deep-green"],
    [/--gold\b/g, "--gold", "--resilience-green"],
    [/--amber\b/g, "--amber", "--earth-taupe"],
    [/--warm-white\b/g, "--warm-white", "--warm-white"],
    [/--text-body\b/g, "--text-body", "--text-body"],
    [/--light-border\b/g, "--light-border", "--line"],
  ];
  for (const [pattern, from, to] of renames) {
    if (from === to) continue;
    const n = countOf(html, pattern);
    html = html.replace(pattern, to);
    record("token", from, to, n);
  }

  // --- 4. terminology (context-aware, owner ruling 4) ---------------------------------------------------------
  // Only the phrase naming the framework. A bare "pillar" is left exactly as it is.
  const framework = /\b(the\s+)?(5|five)\s+(pillars?)\b/gi;
  const frameworkCount = countOf(html, framework);
  html = html.replace(framework, (_match, the: string | undefined, five: string, pillar: string) => {
    // Capitalisation follows the framework words themselves ("the 5 Pillars" → "the Five Foundations"),
    // not the first character of the match, which is often a lowercase "the".
    const titleCase = /^[A-Z]/.test(pillar) || /^F/.test(five);
    return `${the ?? ""}${titleCase ? "Five Foundations" : "five foundations"}`;
  });
  record("terminology", '"5 Pillars" (the framework)', '"Five Foundations"', frameworkCount);

  // A CSS class named for the old framework is not member-visible copy, but it misleads the next editor.
  // Renamed before counting what is left, or the class itself shows up as copy needing review.
  const classCount = countOf(html, /cover-pillar/g);
  html = html.replace(/cover-pillar/g, "cover-foundation");
  record("token", ".cover-pillar", ".cover-foundation", classCount);

  // Whatever says "pillar" now is prose, and prose is a person's call.
  const barePillar = countOf(html, /\bpillars?\b/gi);
  if (barePillar > 0) {
    warnings.push(
      `${barePillar} use(s) of "pillar" remain in the copy and were deliberately not changed. Check each one: in structural content a pillar is a real pillar (owner ruling 4).`,
    );
  }

  // --- 5. assets ---------------------------------------------------------------------------------------------
  // The generation environment's absolute paths do not exist anywhere else, so every cover image is broken.
  const brokenAsset = /src="\/mnt\/[^"]*\/([^/"]+)"/g;
  const brokenAssets = [...html.matchAll(brokenAsset)].map((m) => m[1]);
  if (brokenAssets.length) {
    const base = options.assetBase ?? "assets";
    html = html.replace(brokenAsset, (_whole, filename: string) => `src="${base}/${filename}"`);
    record("asset", "/mnt/agents/output/… (broken absolute path)", `${base}/…`, brokenAssets.length);
  }

  // --- 6. strapline ------------------------------------------------------------------------------------------
  if (options.strapline) {
    const brandMark = /(<div class="cover-brand">)([^<]*)(<\/div>)/;
    if (brandMark.test(html)) {
      html = html.replace(brandMark, `$1${options.strapline}$3`);
      record("brand", "OFFGRID056.COM", options.strapline, 1);
    }
  }

  // --- 7. anything legacy left behind --------------------------------------------------------------------------
  const leftovers = [...html.matchAll(/#(1A2332|C9A227|E8703A|2D3A4D)\b/gi)].map((m) => m[0]);
  if (leftovers.length) warnings.push(`legacy colours still present after re-skin: ${[...new Set(leftovers)].join(", ")}`);
  if (/Playfair Display|(?<!-)\bInter\b(?=['",])/.test(html)) warnings.push("legacy typography still referenced after re-skin");

  return { html, changes, warnings };
}

/** A short, readable summary of what changed — what goes in the migration log. */
export function summariseChanges(changes: ReskinChange[]): string[] {
  return changes
    .filter((c) => c.kind !== "note")
    .map((c) => `${c.kind}: ${c.from} → ${c.to}${c.count > 1 ? ` (×${c.count})` : ""}`);
}

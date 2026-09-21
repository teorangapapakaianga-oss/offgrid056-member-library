import { describe, expect, it } from "vitest";
import { BRAND, COLOUR_MAP, HEADING_SCALE, reskinHtml, scaleHeadings, summariseChanges } from "@/admin-import/reskin/reskin";
import { injectSafety, injectSafetyChecked } from "@/admin-import/pilot/run";
import profilesFile from "@/admin-import/markets/profiles.json";
import { resolveTokens, publishable, resolveForMarket, UNVERIFIED, type CoreResource, type MarketProfile, type SafetyBlock } from "@/admin-import/markets/resolve";

/**
 * Stage 9.6C/D. The re-skin changes how a resource looks, never what it teaches, so these tests are largely
 * about what it must leave alone.
 */
const LEGACY = `<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap');
:root { --navy: #1A2332; --gold: #C9A227; --amber: #E8703A; --light-border: #E0DFDA; }
body { font-family: 'Inter', sans-serif; color: #444444; }
h2 { font-family: 'Playfair Display', serif; font-size: 20px; }
.cover-title { font-family: 'Playfair Display', serif; font-size: 44px; }
.matrix-cell.high { background: #FDE8E8; color: #C53030; }
.matrix-cell.low { background: #E6FFFA; color: #2F855A; }
</style></head><body>
<div class="cover-page"><div class="cover-pillar">Week 1 — Foundation</div>
<img src="/mnt/agents/output/OffGrid056/Covers/Week1_Foundation_Cover.jpg" class="cover-img" alt="Week 1">
<div class="cover-brand">OFFGRID056.COM</div></div>
<div class="content"><h2>The Risk Matrix</h2>
<p>Every worksheet maps back to the 5 Pillars. Which pillar needs attention?</p>
<p>Check the pillars and piles under the subfloor for rot.</p>
</div></body></html>`;

describe("colour", () => {
  it("maps every legacy brand colour to its brand replacement", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).toContain(BRAND.deepGreen);
    expect(html).toContain(BRAND.resilienceGreen);
    expect(html).toContain(BRAND.earthTaupe);
    for (const legacy of Object.keys(COLOUR_MAP)) {
      expect(html.toUpperCase()).not.toContain(legacy.toUpperCase());
    }
  });

  it("leaves semantic status colours alone", () => {
    // Red means urgent, green means monitor. A member reads the colour before the words.
    const { html } = reskinHtml(LEGACY);
    expect(html).toContain("#C53030");
    expect(html).toContain("#FDE8E8");
    expect(html).toContain("#2F855A");
    expect(html).toContain("#E6FFFA");
  });

  it("renames the custom properties so the next editor is not misled", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).toContain("--deep-green");
    expect(html).toContain("--resilience-green");
    expect(html).not.toContain("--navy");
    expect(html).not.toContain("--gold:");
  });
});

describe("typography", () => {
  it("drops the Google Fonts call and serves the brand fonts locally", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).toContain("@font-face");
    expect(html).toContain("BebasNeue-Regular.woff2");
    expect(html).toContain("Montserrat-Regular.woff");
  });

  it("replaces the legacy typefaces", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).toContain("Bebas Neue");
    expect(html).toContain("Montserrat");
    expect(html).not.toContain("Playfair Display");
    expect(html).not.toMatch(/'Inter'/);
  });

  it("scales heading sizes so Bebas Neue keeps the original hierarchy", () => {
    const { html } = scaleHeadings("h2 { font-size: 20px; } p { font-size: 20px; }", 1.18);
    expect(html).toContain("h2 { font-size: 24px; }"); // heading scaled
    expect(html).toContain("p { font-size: 20px; }"); // body untouched
  });

  it("does not scale body copy", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).toMatch(/body\s*\{[^}]*color:/); // body rule still there
    expect(html).not.toMatch(/body\s*\{[^}]*font-size:\s*\d+px/); // and gained no scaled size
  });
});

describe("terminology (owner ruling 4)", () => {
  it("replaces the framework name", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).toContain("Five Foundations");
    expect(html).not.toMatch(/\b5 Pillars\b/);
  });

  it("leaves a bare 'pillar' alone and says so", () => {
    const { html, warnings } = reskinHtml(LEGACY);
    // The structural sentence must survive untouched: these are real pillars.
    expect(html).toContain("Check the pillars and piles under the subfloor");
    expect(warnings.join(" ")).toMatch(/pillar.*deliberately not changed/i);
  });

  it("renames the framework CSS class without counting it as copy", () => {
    const { html, warnings } = reskinHtml(LEGACY);
    expect(html).toContain("cover-foundation");
    expect(html).not.toContain("cover-pillar");
    // Two prose uses of "pillar" remain in the fixture; the class must not inflate that count.
    expect(warnings.join(" ")).toMatch(/2 use\(s\) of "pillar"/);
  });
});

describe("assets and brand", () => {
  it("repoints the broken absolute cover path", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).not.toContain("/mnt/agents/output");
    expect(html).toContain('src="assets/Week1_Foundation_Cover.jpg"');
  });

  it("applies the strapline when asked", () => {
    const { html } = reskinHtml(LEGACY, { strapline: "Prepare • Adapt • Thrive" });
    expect(html).toContain("Prepare • Adapt • Thrive");
    expect(html).not.toContain("OFFGRID056.COM");
  });
});

describe("what it must not do", () => {
  it("never modifies the input", () => {
    const before = LEGACY;
    reskinHtml(LEGACY);
    expect(LEGACY).toBe(before);
  });

  it("preserves the teaching content word for word", () => {
    const { html } = reskinHtml(LEGACY);
    expect(html).toContain("Every worksheet maps back to the Five Foundations");
    expect(html).toContain("The Risk Matrix");
    expect(html).toContain("Check the pillars and piles under the subfloor for rot.");
  });

  it("reports what it changed", () => {
    const { changes } = reskinHtml(LEGACY);
    const summary = summariseChanges(changes);
    expect(summary.some((s) => s.startsWith("colour:"))).toBe(true);
    expect(summary.some((s) => s.startsWith("font:"))).toBe(true);
    expect(summary.some((s) => s.startsWith("terminology:"))).toBe(true);
    expect(HEADING_SCALE).toBeGreaterThan(1);
  });
});

describe("safety injection", () => {
  const blocks = [
    { id: "emergency-contact", title: "In an emergency", body: "**Call 111 now.**", severity: "CRITICAL" },
    { id: "general-disclaimer", title: "Before you start", body: "General education, not advice.", severity: "STANDARD" },
  ];

  it("puts the critical block where someone skimming will see it", () => {
    const html = injectSafety(reskinHtml(LEGACY).html, blocks);
    const critical = html.indexOf('data-block="emergency-contact"');
    const heading = html.indexOf("The Risk Matrix");
    expect(critical).toBeGreaterThan(-1);
    expect(critical).toBeLessThan(heading); // above the teaching content
  });

  it("puts the disclaimer at the end, not in the middle of the teaching", () => {
    const html = injectSafety(reskinHtml(LEGACY).html, blocks);
    expect(html.indexOf('data-block="general-disclaimer"')).toBeGreaterThan(html.indexOf("The Risk Matrix"));
  });

  it("renders emphasis rather than leaving raw markdown on the page", () => {
    const html = injectSafety(reskinHtml(LEGACY).html, blocks);
    expect(html).toContain("<strong>Call 111 now.</strong>");
    expect(html).not.toContain("**Call 111 now.**");
  });

  it("places the critical block in a document with no .content wrapper", () => {
    // The bonus templates use a plain header and sections. Matching only `.content` silently dropped the
    // emergency block from every one of them — a safety block that is not there is the worst possible bug.
    const bonus = `<!DOCTYPE html><html><head><style>body{}</style></head><body>
<div class="header"><h1>Monthly Planning Challenge</h1><p>Reusable framework</p></div>
<div class="section">Fill this in.</div></body></html>`;
    const result = injectSafetyChecked(bonus, blocks);
    expect(result.unplaced).toEqual([]);
    expect(result.placed).toContain("emergency-contact");
    expect(result.html).toContain("Call 111 now.");
    // …and it must land before the teaching content, not after it.
    expect(result.html.indexOf('data-block="emergency-contact"')).toBeLessThan(result.html.indexOf("Fill this in."));
  });

  it("reports a block it could not place instead of dropping it quietly", () => {
    const notADocument = "<p>no body element at all</p>";
    const result = injectSafetyChecked(notADocument, blocks);
    expect(result.unplaced).toContain("emergency-contact");
  });
});

describe("unverified market figures fail closed", () => {
  const markets = profilesFile.markets as unknown as MarketProfile[];
  const market = (code: string) => markets.find((m) => m.code === code)!;

  it("treats a VERIFY placeholder as missing, not as a value", () => {
    const { text, unresolved } = resolveTokens("Stand {{figure.generatorDistance}} away.", market("NZ"));
    // NZ has not confirmed a generator distance yet.
    expect(market("NZ").figures.generatorDistance).toBe(UNVERIFIED);
    expect(text).toContain("{{figure.generatorDistance}}"); // never renders the word VERIFY as guidance
    expect(text).not.toContain("Stand VERIFY away");
    expect(unresolved).toContain("figure.generatorDistance");
  });

  it("blocks publication of a resource that depends on an unverified figure", () => {
    const resource: CoreResource = {
      id: "res-9999",
      legacyCode: "OG-TEST",
      slug: "generator-siting",
      title: "Generator Siting",
      description: "Where to put a generator.",
      body: "Run it {{figure.generatorDistance}} from the house.",
      safetyBlocks: [],
    };
    const resolved = resolveForMarket(resource, market("NZ"), {} as Record<string, SafetyBlock>);
    expect(publishable(resolved).ok).toBe(false);
  });

  it("clears the launch markets for figures that are verified", () => {
    for (const code of ["NZ", "AU"]) {
      const m = market(code);
      expect(m.figures.waterPerPersonPerDay).not.toBe(UNVERIFIED);
      expect(m.figures.fridgeWithoutPower).not.toBe(UNVERIFIED);
      expect(m.figures.freezerWithoutPower).not.toBe(UNVERIFIED);
      expect(m.emergency.number).toBeTruthy();
    }
  });

  it("keeps NZ and AU official figures distinct, never shared", () => {
    // NZ and AU publish materially different power-cut food guidance. Sharing one figure would be a safety bug.
    expect(market("NZ").figures.fridgeWithoutPower).not.toBe(market("AU").figures.fridgeWithoutPower);
    expect(market("NZ").figures.waterPerPersonPerDay).not.toBe(market("AU").figures.waterPerPersonPerDay);
  });
});

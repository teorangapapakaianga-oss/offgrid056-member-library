import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Stage 9.89 — state-based checks of the BUILT private preview (`out/`), replacing the stage-specific QA scripts that asserted a
 * historical starting state (a delta from Stage 9.73, 9.78A, 9.78B or 9.83). Nothing here hard-codes a stage: every expectation
 * is derived from the protected records, so the checks stay true as resources are added.
 *
 * Skipped unless `out/` is the PRIVATE PREVIEW build of the current records (the public/demo build has no protected resources,
 * and a checkout without private assets has no records). Run `npm run build:preview` first to exercise it.
 */
const root = process.cwd();
const recDir = path.join(root, "private-assets/data-resources");
type Rec = { id: string; slug: string; legacyCode: string; title: string; status: string; programComponent: string; foundation: string; category: string; resourceType: string; collections?: string[]; marketFiles: Record<string, { fileUrl: string }> };
const recs: Rec[] = fs.existsSync(recDir) ? fs.readdirSync(recDir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(recDir, f), "utf8")) as Rec) : [];
const read = (p: string) => fs.readFileSync(path.join(root, "out", p), "utf8");
const unescape = (s: string) => s.replace(/\\"/g, '"');
const isPreviewBuildOfTheseRecords = recs.length > 0 && fs.existsSync(path.join(root, "out/start-here/index.html")) && recs.every((r) => fs.existsSync(path.join(root, `out/resources/${r.slug}/index.html`)));

type Summary = { id: string; slug: string; title: string; isPlaceholder: boolean; collections?: string[] };
/** The resource summaries embedded in a page's React Server Component payload, by id. */
function summaries(rel: string): Map<string, Summary> {
  const out = new Map<string, Summary>();
  const walk = (v: unknown) => {
    if (Array.isArray(v)) { for (const x of v) walk(x); return; }
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.id === "string" && /^res-\d+$/.test(o.id) && typeof o.slug === "string" && "foundation" in o) { out.set(o.id, o as unknown as Summary); return; }
      for (const x of Object.values(o)) walk(x);
    }
  };
  for (const line of read(rel).split("\n")) {
    const m = line.match(/^[0-9a-f]+:(.*)$/);
    if (!m) continue;
    try { walk(JSON.parse(m[1])); } catch { /* framing row */ }
  }
  return out;
}
const payloads = (page: string) => [`${page}/index.txt`, `${page}/__next._full.txt`, `${page}/__next.${page}/__PAGE__.txt`, `${page}/__next.${page}.__PAGE__.txt`];
const links = (html: string, slug: string) => (html.match(new RegExp(`href="/resources/${slug}/"`, "g")) ?? []).length;

describe.skipIf(!isPreviewBuildOfTheseRecords)("Stage 9.89 · the built private preview, derived from the protected records", () => {
  it("has one page per protected record, every market file present, and every record still a draft", () => {
    const urls = recs.flatMap((r) => Object.values(r.marketFiles).map((m) => m.fileUrl.replace(/^\//, "")));
    expect(urls.length).toBe(recs.length * 2); // NZ and AU for each
    for (const u of urls) expect(fs.existsSync(path.join(root, "out", u)), u).toBe(true);
    expect(recs.every((r) => r.status === "draft")).toBe(true);
    expect(new Set(recs.map((r) => r.id)).size).toBe(recs.length);
    expect(new Set(recs.map((r) => r.slug)).size).toBe(recs.length);
  });

  it("carries Foundation, Programme Component, Category and Type in every protected page's data", () => {
    for (const r of recs) {
      const page = unescape(read(`resources/${r.slug}/index.txt`));
      for (const s of [`"programComponent":"${r.programComponent}"`, `"foundation":"${r.foundation}"`, `"category":"${r.category}"`, `"resourceType":"${r.resourceType}"`]) expect(page.includes(s), `${r.legacyCode} ${s}`).toBe(true);
    }
  });

  it("keeps no private PDF in public/", () => {
    for (const r of recs) for (const m of Object.values(r.marketFiles)) expect(fs.existsSync(path.join(root, "public", m.fileUrl)), m.fileUrl).toBe(false);
  });

  describe("Planning Tools lists exactly the protected planning resources", () => {
    const members = recs.filter((r) => r.collections?.includes("planning-tools"));
    const html = isPreviewBuildOfTheseRecords ? read("planning-tools/index.html") : "";

    it("each member appears exactly once on the page, and no other protected resource does", () => {
      for (const r of recs) expect(links(html, r.slug), `${r.legacyCode} ${r.title}`).toBe(members.includes(r) ? 1 : 0);
    });

    it("the page data lists exactly those members, each a real resource, in every payload file", () => {
      const want = members.map((r) => r.id).sort().join(",");
      for (const f of payloads("planning-tools")) {
        const found = summaries(f);
        expect([...found.keys()].sort().join(","), f).toBe(want);
        expect([...found.values()].every((s) => !s.isPlaceholder), f).toBe(true);
      }
      for (const r of members) expect(summaries("planning-tools/index.txt").get(r.id)?.title).toBe(r.title);
    });
  });

  describe("protected Start Here lists the protected start-here resources only", () => {
    const members = recs.filter((r) => r.collections?.includes("start-here"));

    it("lists exactly those members in every payload file, none a demo placeholder, with no demonstration text", () => {
      const want = members.map((r) => r.id).sort().join(",");
      for (const f of payloads("start-here")) {
        const found = summaries(f);
        expect([...found.keys()].sort().join(","), f).toBe(want);
        expect([...found.values()].every((s) => !s.isPlaceholder), f).toBe(true);
      }
      const html = read("start-here/index.html");
      expect(html).not.toMatch(/DEMONSTRATION ENTRY/);
      for (const r of members) expect(links(html, r.slug), r.title).toBe(1);
    });
  });

  describe("the Five Foundations page points to the protected scorecard", () => {
    it("links the scorecard's own route (never a demo route) with the owner's wording", () => {
      const html = read("foundations/index.html").replace(/<!-- -->/g, "");
      const scorecard = recs.find((r) => r.id === "res-1001")!;
      expect(html).toContain("Not sure which foundation to start with?");
      expect(html).toContain("helps you identify your three priority foundations.");
      expect(html).toContain(`href="/resources/${scorecard.slug}/"`);
      expect(html).not.toMatch(/href="\/resources\/demo-/);
    });
  });

  describe("the library lists every protected resource exactly once", () => {
    it("holds each protected id once in the library data", () => {
      const lib = read("library/index.txt");
      for (const r of recs) expect((lib.match(new RegExp(`"id":"${r.id}"`, "g")) ?? []).length, `${r.legacyCode} ${r.title}`).toBe(1);
    });
  });

  describe("demo and protected routes stay separate", () => {
    const PAIRS = [
      { real: "res-1001", demo: "res-0007", slug: "home-resilience-scorecard", days: [2, 29], refs: ["household-resilience-assessment"], workshops: [] as string[] },
      { real: "res-1008", demo: "res-0015", slug: "water-storage-calculator", days: [9], refs: ["water-security-guide"], workshops: ["demo-water-storage-workshop"] },
      { real: "res-1010", demo: "res-0016", slug: "rainwater-harvesting-planner", days: [11], refs: ["water-security-guide"], workshops: [] as string[] },
      { real: "res-1013", demo: "res-0013", slug: "healthy-home-air-audit", days: [13], refs: ["ventilation-basics"], workshops: [] as string[] },
    ];

    it("each protected route serves the protected resource and each demo route serves its placeholder, with no protected PDF on the demo page", () => {
      for (const p of PAIRS) {
        const real = unescape(read(`resources/${p.slug}/index.txt`));
        const demo = unescape(read(`resources/demo-${p.slug}/index.txt`));
        expect(real.includes(`"id":"${p.real}"`) && /"programComponent"/.test(real), p.slug).toBe(true);
        expect(demo.includes(`"id":"${p.demo}"`) && /DEMONSTRATION ENTRY/.test(demo), p.slug).toBe(true);
        expect(new RegExp(`${p.slug}\\.(NZ|AU)\\.pdf`).test(demo), p.slug).toBe(false);
      }
    });

    it("the programme days, demo resources and demo workshop still name the demo placeholders, never the protected resources", () => {
      for (const p of PAIRS) {
        for (const d of p.days) {
          const h = read(`programme/day/${d}/index.html`);
          expect(h.includes(p.demo) && h.includes(`demo-${p.slug}`) && !h.includes(p.real) && !new RegExp(`resources/${p.slug}/`).test(h), `${p.slug} day ${d}`).toBe(true);
        }
        for (const r of p.refs) expect(read(`resources/${r}/index.html`).includes(`demo-${p.slug}`), `${p.slug} via ${r}`).toBe(true);
        for (const w of p.workshops) {
          const h = read(`workshops/${w}/index.html`);
          expect(!new RegExp(`resources/${p.slug}/|${p.slug}\\.(NZ|AU)\\.pdf`).test(h) && !h.includes(p.real), `${p.slug} via ${w}`).toBe(true);
        }
      }
    });

    it("programme day 3, res-0004 and the demo workshop for the Five Foundations are still demo content", () => {
      expect(read("programme/day/3/index.html")).toContain("res-0004");
      expect(unescape(read("resources/five-foundations-overview/index.txt"))).toMatch(/DEMONSTRATION ENTRY/);
      expect(fs.existsSync(path.join(root, "out/workshops/demo-five-foundations-intro/index.html"))).toBe(true);
    });

    it("the four separated demo placeholders appear in no listing or protected page", () => {
      const DEMO = /res-0007|res-0013|res-0015|res-0016|demo-home-resilience-scorecard|demo-water-storage-calculator|demo-rainwater-harvesting-planner|demo-healthy-home-air-audit/;
      for (const page of ["library", "start-here", "planning-tools", "foundations", "foundations/general", "foundations/water", "foundations/air", "downloads", "progress", "saved", "learning-paths", "learning-paths/water-basics", "resources/home-resilience-scorecard", "resources/warm-home-scorecard", "resources/household-risk-identifier", "resources/property-type-review"]) {
        if (fs.existsSync(path.join(root, `out/${page}/index.html`))) expect(DEMO.test(read(`${page}/index.html`)), page).toBe(false);
      }
    });

    it("the private water-basics learning path, not the demo path, is what the preview serves", () => {
      const t = unescape(read("learning-paths/water-basics/index.txt"));
      for (const id of ["res-1008", "res-1010", "res-1009", "res-1508"]) expect(t.includes(id), id).toBe(true);
      expect(/"res-0014"|"res-0017"/.test(t.slice(t.indexOf('"steps"'), t.indexOf('"steps"') + 200))).toBe(false);
    });

    it("an unknown route has no page (the site's own 404 serves it)", () => {
      expect(fs.existsSync(path.join(root, "out/resources/no-such-resource/index.html"))).toBe(false);
      expect(fs.existsSync(path.join(root, "out/404.html"))).toBe(true);
    });
  });
});

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { safetyExposureFor } from "@/admin-import/audit/group-a";
import { isSurvivalClaimSentence } from "@/admin-import/audit/numeric";
import { extractText, detectFileType } from "@/admin-import/parsers/index";
import { relatedResources } from "@/lib/related";
import type { ResourceSummary } from "@/lib/content/summaries";

/**
 * Stage 11.0J — the owner-approved Stage 11.0I v1.1 editions of OG-B13 and OG-B15, staged (not deployed) as res-1513 and res-1515.
 * Records, PDFs and masters are git-ignored, so those checks run only where the private assets are present.
 */
const root = process.cwd();
const dir = path.join(root, "private-assets/data-resources");
const have = fs.existsSync(dir);
const sha = (f: string) => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const EDITIONS = [
  { id: "res-1513", slug: "resilience-asset-and-document-checklist", code: "OG-B13", title: "Resilience Asset & Document Checklist", type: "checklist", time: 45, related: ["res-1502", "res-1024", "res-1514", "res-1515"], hashes: { NZ: "7d6a858a173ee92a9f323f0dc0a1a86dc31f7dfe24cf909a14d0e55cd37319f5", AU: "a5008efe0c4dd2f7037e07f65854e2ac5f1d141a71afaf2303e1b3f3ebca5f15" }, docx: { NZ: "7299bc46282845b1d78422afc60036e9636876be9ace53a40b51527c28988a2d", AU: "6ceb842a98397023c37c6fdc254748a196751d5c8bd94c79417c28870b296e83" }, master: "OG-B13_%M%_Resilience_Asset_and_Document_Checklist" },
  { id: "res-1515", slug: "seasonal-review-and-annual-service-log", code: "OG-B15", title: "Seasonal Review & Annual Service Log", type: "template", time: 60, related: ["res-1006", "res-1012", "res-1028", "res-1513"], hashes: { NZ: "c67a95c9f86225c06785510631fa8be04efebffa9d538dcf5b38076cc5afc3ab", AU: "87053d8cf9455ccdabdb06ebbf83d0e0cbc9e6549ab4f042b1cb400f8677aeb8" }, docx: { NZ: "d115694b80443b97a009180816bcc96a59a637cac689ba9a150c65f568b0be4b", AU: "741db38fc61bc15b98d0c025b55a8f8a8a13fc0842cab7d7deb600cc3cdad80f" }, master: "OG-B15_%M%_Seasonal_Review_and_Service_Log" },
] as const;

describe("Stage 11.0J · OG-B13 / OG-B15 staged editions", () => {
  it.skipIf(!have)("are staged as one protected record each, with NZ and AU market files, approved / private-preview, in no collection, with the proposed related links", () => {
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Record<string, unknown>);
    expect(recs).toHaveLength(38);
    expect(new Set(recs.map((r) => r.id)).size).toBe(38);
    expect(new Set(recs.map((r) => r.slug)).size).toBe(38);
    for (const e of EDITIONS) {
      const r = recs.filter((x) => x.id === e.id || x.legacyCode === e.code);
      expect(r).toHaveLength(1);
      expect(r[0]).toMatchObject({ id: e.id, slug: e.slug, legacyCode: e.code, title: e.title, foundation: "general", programComponent: "resilience-planning", category: "planning", resourceType: e.type, difficulty: "beginner", collections: [], status: "draft", publicationStatus: "approved", releaseChannel: "private-preview", downloadable: true, relatedResources: e.related });
      expect(r[0].marketFiles).toEqual({ NZ: { fileUrl: `/resources/${e.slug}.NZ.pdf`, fileFormat: "PDF" }, AU: { fileUrl: `/resources/${e.slug}.AU.pdf`, fileFormat: "PDF" } });
      expect(r[0]).not.toHaveProperty("fileUrl"); // a market-specific resource has no default file: no cross-market fallback
      expect(r[0]).not.toHaveProperty("estimatedTime"); // the editions state no time and none is invented (owner decision 3)
      expect(r[0].companionFiles).toEqual({ NZ: expect.objectContaining({ fileUrl: `/resources/${e.slug}.NZ.docx`, fileFormat: "DOCX", sha256: e.docx.NZ }), AU: expect.objectContaining({ fileUrl: `/resources/${e.slug}.AU.docx`, fileFormat: "DOCX", sha256: e.docx.AU }) });
    }
    expect(recs.filter((r) => ((r.collections as string[] | undefined) ?? []).includes("planning-tools"))).toHaveLength(12);
    const urls = recs.flatMap((r) => Object.values((r.marketFiles ?? {}) as Record<string, { fileUrl: string }>).map((f) => f.fileUrl));
    expect(urls).toHaveLength(76);
    expect(new Set(urls).size).toBe(76); // every country edition is a distinct, uniquely selectable file; none overwrites another edition or a protected legacy resource
    expect(new Set(recs.map((r) => r.title)).size).toBe(38);
    expect(recs.filter((r) => ["OG-B01", "OG-B03", "OG-B11"].includes(r.legacyCode as string))).toEqual([]);
  });
  it.skipIf(!have)("serve the approved PDFs byte-identically, one edition per market, and the DOCX companions only as the recorded secondary option for the same market", () => {
    const pdfs = path.join(root, "private-assets/resources");
    for (const e of EDITIONS) for (const m of ["NZ", "AU"] as const) expect(sha(path.join(pdfs, `${e.slug}.${m}.pdf`)), `${e.id} ${m}`).toBe(e.hashes[m]);
    expect(EDITIONS[0].hashes.NZ).not.toBe(EDITIONS[0].hashes.AU);
    for (const e of EDITIONS) for (const m of ["NZ", "AU"] as const) expect(sha(path.join(pdfs, `${e.slug}.${m}.docx`)), `${e.id} ${m} docx`).toBe(e.docx[m]);
    expect(fs.readdirSync(pdfs).filter((f) => /\.docx$/i.test(f)).sort()).toEqual(EDITIONS.flatMap((e) => (["AU", "NZ"] as const).map((m) => `${e.slug}.${m}.docx`)).sort()); // nothing else editable is staged
    expect(fs.existsSync(path.join(root, "public/resources")) ? fs.readdirSync(path.join(root, "public/resources")).filter((f) => /\.docx$/i.test(f)) : []).toEqual([]);
  });
  it.skipIf(!have)("keep the approved package verbatim in the non-public masters folder, with the DOCX companion associated to each PDF", () => {
    const m = path.join(root, "private-assets/production-masters/stage-11-0i-v1.1");
    if (!fs.existsSync(m)) return;
    for (const e of EDITIONS) for (const k of ["NZ", "AU"] as const) {
      const base = e.master.replace("%M%", k);
      expect(sha(path.join(m, "02_PDF", `${base}.pdf`))).toBe(e.hashes[k]);
      expect(sha(path.join(m, "01_DOCX", `${base}.docx`))).toBe(e.docx[k]);
    }
    expect(fs.readdirSync(path.join(m, "03_PRODUCTION_RECORDS")).sort()).toEqual(["FINAL_PRODUCTION_QA.md", "SOURCE_AND_RIGHTS_RECORD.md", "VERSION_MANIFEST.md"]);
    const assoc = (JSON.parse(fs.readFileSync(path.join(m, "ASSOCIATIONS.json"), "utf8")) as { associations: { resource: string; market: string; docxServed: boolean }[] }).associations;
    expect(assoc).toHaveLength(4);
    expect(assoc.every((a) => a.docxServed === true)).toBe(true);
  });
  it("limit the Library model change to optional estimatedTime and companionFiles: no HOLD value, no new market", () => {
    const schema = fs.readFileSync(path.join(root, "lib/content/schemas.ts"), "utf8") + fs.readFileSync(path.join(root, "lib/content/constants.ts"), "utf8");
    expect(schema).not.toMatch(/INVENTORY REVIEW|\bHOLD\b/i);
    expect(schema).toMatch(/MARKET_CODES/);
  });
  it("record the HOLD history, and the owner-approved dispositions of OG-B01, OG-B03 and OG-B11, in the register", () => {
    const rr = fs.readFileSync(path.join(root, "internal/member-programme/RESOURCE_REGISTER.md"), "utf8");
    expect(rr).toContain("## HOLD — inventory review (0)");
    expect(rr).toMatch(/> \| OG-B13 \| Resilience Insurance Documentation \| \*\*HOLD — INVENTORY REVIEW\*\*/);
    expect(rr).toMatch(/> \| OG-B15 \| Annual Maintenance Calendar \| \*\*HOLD — INVENTORY REVIEW\*\*/);
    expect(rr).toMatch(/\| OG-B11 \| Building Consent Navigator \| \*\*consents research\*\*/);
    expect(rr).toContain("## Archived (4)");
    expect(rr).toMatch(/\| OG-B01 \| QuickStart Resilience Checklist \| \*\*ARCHIVED\*\*/);
    expect(rr).toMatch(/\| OG-B03 \| 5 Starter Product Guide \| \*\*ARCHIVED\*\*/);
  });
});

describe.skipIf(!have)("Stage 11.0J · related cards: the two new slugs change no existing page", () => {
  type R = { id: string; slug: string; title: string; foundation: string; category: string; tags: string[]; relatedResources: string[]; learningPath?: string; isPlaceholder: boolean };
  const all: [string, R][] = [];
  for (const f of fs.readdirSync(path.join(root, "data/resources")).filter((x) => x.endsWith(".json"))) all.push([f, JSON.parse(fs.readFileSync(path.join(root, "data/resources", f), "utf8")) as R]);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".private.json"))) all.push([f, { tags: [], isPlaceholder: false, ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) } as R]);
  const policy = JSON.parse(fs.readFileSync(path.join(root, "lib/content/route-policy.json"), "utf8")) as { separateDemo: Record<string, string> };
  const unlisted = new Set(Object.keys(policy.separateDemo));
  const summary = (r: R) => ({ id: r.id, slug: r.slug, title: r.title, foundation: r.foundation, category: r.category, tags: r.tags ?? [], isPlaceholder: r.isPlaceholder }) as unknown as ResourceSummary;
  const cards = (entries: [string, R][]) => {
    const resources = [...entries].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([, r]) => r);
    const listed = resources.filter((r) => !unlisted.has(r.id)).map(summary);
    const out = new Map<string, string>();
    for (const r of resources) {
      const named = new Set(r.relatedResources);
      const pool = [...listed, ...resources.filter((x) => named.has(x.id) && !listed.some((l) => l.id === x.id)).map(summary)];
      out.set(r.id, JSON.stringify(relatedResources({ current: { id: r.id, foundation: r.foundation, category: r.category, tags: r.tags ?? [], learningPath: r.learningPath, relatedResources: r.relatedResources }, all: pool }).map((c) => [c.reason, c.resource.id])));
    }
    return out;
  };
  it("shows exactly the four curated cards on each new page, and changes the related cards on 0 existing pages", () => {
    const without = all.filter(([, r]) => !["res-1513", "res-1515"].includes(r.id));
    const base = cards(without), withNew = cards(all);
    expect([...base].filter(([id, v]) => withNew.get(id) !== v).map(([id]) => id)).toEqual([]);
    for (const e of EDITIONS) expect(JSON.parse(withNew.get(e.id)!)).toEqual(e.related.map((id) => ["Linked by us", id]));
  });
});
function e0(s: string): string {
  return s;
}

describe.skipIf(!have)("Stage 11.0J · the two informational detector flags are reviewed, and the detectors still catch genuine technical content", () => {
  const read = async (slug: string, m: "NZ" | "AU") => {
    const file = path.resolve(root, "private-assets/resources", `${slug}.${m}.pdf`);
    return (await extractText(file, detectFileType(file, ".pdf"), 400000)).text.replace(/\s+/g, " ");
  };
  it("B13 'batteries-and-electrical': every battery/solar mention is an asset-category label or an insurer question (LABEL ONLY / PLANNING PROMPT), never guidance or a procedure", async () => {
    for (const m of ["NZ", "AU"] as const) {
      const text = await read("resilience-asset-and-document-checklist", m);
      expect(safetyExposureFor(text), m).toContain("batteries-and-electrical"); // still detected: the detector is not weakened
      const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => /\b(?:batter\w*|solar|inverter)\b/i.test(s));
      expect(sentences.length, m).toBeGreaterThan(0);
      for (const s of sentences) {
        expect(s, m).toMatch(/generators|storage|panels|heating equipment/i); // an asset list or a "do I declare…" question
        expect(s, m).not.toMatch(/\b(?:install\w*|replace\w*|wire\w*|connect\w*|isolate\w*|disconnect\w*|test\w*|service\w*|repair\w*|charge\w*|discharge\w*)\b/i);
      }
    }
  }, 60000);
  it("B15 AU 'survival' sentences are the standing immediate-danger direction (call Triple Zero; do not investigate), with no duration or outcome claim", async () => {
    const text = await read("seasonal-review-and-annual-service-log", "AU");
    const hits = text.split(/(?<=[.!?])\s+/).filter((s) => isSurvivalClaimSentence(s));
    expect(hits).toHaveLength(2);
    for (const s of hits) {
      expect(s).toMatch(/do not investigate it for this worksheet|call Triple Zero \(000\)/);
      expect(s.replace("(000)", "")).not.toMatch(/\d/);
    }
    const nz = await read("seasonal-review-and-annual-service-log", "NZ");
    expect(nz.split(/(?<=[.!?])\s+/).filter((s) => isSurvivalClaimSentence(s))).toEqual([]); // the NZ wording ("serious, immediate or imminent risk") does not trip it
  }, 60000);
  it("the detectors are unchanged: genuine technical wording is still flagged", () => {
    expect(safetyExposureFor("Wire the battery bank to the inverter and the solar array, then test the inverter.")).toContain("batteries-and-electrical");
    expect(isSurvivalClaimSentence("A person can survive three days without water.")).toBe(true);
  });
});
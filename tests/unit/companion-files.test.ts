import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getSummaries } from "@/lib/content/repository";
import { companionForMarket } from "@/lib/content/companions";
import { ResourceSchema } from "@/lib/content/schemas";
import { toSummary } from "@/lib/content/summaries";
import { applyFilters, EMPTY_FILTERS, sortResources } from "@/lib/filters";
import { formatMinutesOrNull } from "@/lib/format";

/**
 * Stage 11.0J — owner decisions 3 and 4: an optional estimated time (never invented), and one editable DOCX companion per market,
 * offered only beside that market's own PDF.
 */
const HASH = "a".repeat(64);
const base = {
  id: "res-9999", slug: "test-resource", title: "Test Resource", description: "A resource used to test the record schema only.", learningObjectives: [], foundation: "general",
  programComponent: "resilience-planning", category: "planning", resourceType: "checklist", difficulty: "beginner", tags: [], featured: false, premium: false, isPlaceholder: false,
  status: "draft", publicationStatus: "approved", releaseChannel: "private-preview", downloadable: true, publishedDate: "2026-10-16", relatedResources: [], completionAvailable: true,
  marketFiles: { NZ: { fileUrl: "/resources/test.NZ.pdf", fileFormat: "PDF" }, AU: { fileUrl: "/resources/test.AU.pdf", fileFormat: "PDF" } },
};
const docx = (m: string) => ({ fileUrl: `/resources/test.${m}.docx`, fileFormat: "DOCX", sha256: HASH });
const ok = (o: object) => ResourceSchema.safeParse({ ...base, ...o });

describe("Stage 11.0J · optional estimated time", () => {
  it("accepts a record with no time and still rejects an invalid one", () => {
    expect(ok({}).success).toBe(true);
    expect(ok({ estimatedTime: 45 }).success).toBe(true);
    expect(ok({ estimatedTime: 0 }).success).toBe(false);
    expect(ok({ estimatedTime: "45" }).success).toBe(false);
  });
  it("is null in the summary, shows no time, matches no time band and sorts last", () => {
    expect(formatMinutesOrNull(undefined)).toBeNull();
    expect(formatMinutesOrNull(null)).toBeNull();
    expect(formatMinutesOrNull(45)).toBe("45 min");
    const parsed = ResourceSchema.parse(ok({}).success ? { ...base } : {});
    expect(toSummary({ ...parsed, updatedDate: undefined } as never).estimatedTime).toBeNull();
    const items = getSummaries();
    const none = { ...items[0], id: "res-none", estimatedTime: null };
    const ctx = { now: new Date("2026-09-20T12:00:00Z"), completed: new Set<string>() };
    for (const band of ["under-10", "10-30", "30-60", "60-plus"]) expect(applyFilters([none], { ...EMPTY_FILTERS, time: [band] }, ctx), band).toEqual([]);
    expect(applyFilters([none], EMPTY_FILTERS, ctx)).toHaveLength(1); // no filter: still listed
    const sorted = sortResources([none, { ...items[1], estimatedTime: 5 }, { ...items[2], estimatedTime: 90 }], "shortest");
    expect(sorted.map((r) => r.estimatedTime)).toEqual([5, 90, null]);
  });
});

describe("Stage 11.0J · companionFiles schema", () => {
  it("accepts one DOCX per market beside that market's PDF", () => {
    expect(ok({ companionFiles: { NZ: docx("NZ"), AU: docx("AU") } }).success).toBe(true);
    expect(ok({ companionFiles: { NZ: docx("NZ") } }).success).toBe(true);
  });
  it("rejects a companion without a PDF for its market, or without any market files", () => {
    expect(ok({ marketFiles: { NZ: base.marketFiles.NZ }, companionFiles: { AU: docx("AU") } }).success).toBe(false);
    const { marketFiles: _m, ...noMarket } = base;
    void _m;
    expect(ResourceSchema.safeParse({ ...noMarket, fileUrl: "/resources/x.pdf", fileFormat: "PDF", companionFiles: { NZ: docx("NZ") } }).success).toBe(false);
  });
  it("rejects anything that is not a local .docx pinned by a SHA-256", () => {
    expect(ok({ companionFiles: { NZ: { ...docx("NZ"), fileUrl: "https://example.com/x.docx" } } }).success).toBe(false); // never an external link
    expect(ok({ companionFiles: { NZ: { ...docx("NZ"), fileUrl: "/resources/test.NZ.pdf" } } }).success).toBe(false);
    expect(ok({ companionFiles: { NZ: { ...docx("NZ"), fileFormat: "PDF" } } }).success).toBe(false);
    expect(ok({ companionFiles: { NZ: { ...docx("NZ"), sha256: "xyz" } } }).success).toBe(false);
    expect(ok({ companionFiles: { NZ: { fileUrl: "/resources/test.NZ.docx", fileFormat: "DOCX" } } }).success).toBe(false); // no hash
    expect(ok({ companionFiles: { US: docx("NZ") } }).success).toBe(false); // no new market
  });
  it("rejects a companion that is another edition's file", () => {
    expect(ok({ companionFiles: { NZ: { ...docx("NZ"), fileUrl: "/resources/test.AU.docx" }, AU: docx("AU") } }).success).toBe(false); // the same file for two editions
    expect(ok({ companionFiles: { NZ: docx("NZ"), AU: { ...docx("AU"), fileUrl: "/resources/test.NZ.docx" } } }).success).toBe(false);
  });
});

describe("Stage 11.0J · the editable version is offered only for the chosen market", () => {
  const c = { NZ: { fileUrl: "/resources/t.NZ.docx", format: "DOCX", sizeBytes: 1 }, AU: { fileUrl: "/resources/t.AU.docx", format: "DOCX", sizeBytes: 2 } };
  const pdfs = { NZ: {}, AU: {} };
  it("returns that market's companion and no other", () => {
    expect(companionForMarket(c, pdfs, "NZ")?.fileUrl).toBe("/resources/t.NZ.docx");
    expect(companionForMarket(c, pdfs, "AU")?.fileUrl).toBe("/resources/t.AU.docx");
  });
  it("fails closed: no market, no companion, or no PDF for the market means nothing is offered", () => {
    expect(companionForMarket(c, pdfs, null)).toBeNull();
    expect(companionForMarket(undefined, pdfs, "NZ")).toBeNull();
    expect(companionForMarket({ NZ: c.NZ }, pdfs, "AU")).toBeNull(); // never falls back to the other country
    expect(companionForMarket(c, { NZ: {} }, "AU")).toBeNull(); // no AU PDF to sit beside
  });
});

describe("Stage 11.0J · the staged editions' companions match the approved package", () => {
  const dir = path.join(process.cwd(), "private-assets/data-resources");
  const manifestFile = path.join(process.cwd(), "private-assets/production-masters/stage-11-0i-v1.1/03_PRODUCTION_RECORDS/VERSION_MANIFEST.md");
  const have = fs.existsSync(dir) && fs.existsSync(manifestFile);
  it.skipIf(!have)("pins each served DOCX to the Stage 11.0I manifest fingerprint, and the served bytes equal it", () => {
    const want = new Map([...fs.readFileSync(manifestFile, "utf8").matchAll(/- `([^`]+\.docx)` .{1,6}`([0-9a-f]{64})`/g)].map((m) => [m[1], m[2]] as const));
    expect(want.size).toBe(4);
    const recs = fs.readdirSync(dir).filter((f) => f.endsWith(".private.json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as { id: string; legacyCode: string; companionFiles?: Record<string, { fileUrl: string; sha256: string }> });
    const staged = recs.filter((r) => r.companionFiles);
    expect(staged.map((r) => r.id).sort()).toEqual(["res-1513", "res-1515"]);
    const fingerprints = [...want.values()].sort();
    const recorded = staged.flatMap((r) => Object.values(r.companionFiles!).map((c) => c.sha256)).sort();
    expect(recorded).toEqual(fingerprints);
    for (const r of staged) for (const c of Object.values(r.companionFiles!)) {
      const f = path.join(process.cwd(), "private-assets/resources", path.basename(c.fileUrl));
      expect(crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex"), c.fileUrl).toBe(c.sha256);
    }
  });
});

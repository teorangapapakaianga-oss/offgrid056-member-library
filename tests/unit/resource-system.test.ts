import { describe, expect, it } from "vitest";
import { getDownloads, getProgrammeDays, getResourceById, getSummaries, getSuppliers, getWorkshops, loadLearningPaths } from "@/lib/content/repository";
import { formatBytes, formatDate } from "@/lib/format-bytes";
import { recommendedNext, relatedResources } from "@/lib/related";
import { parseVideo } from "@/lib/video";

const all = getSummaries();
const byId = new Map(all.map((r) => [r.id, r]));

describe("video support", () => {
  it("reads YouTube links in every common shape", () => {
    for (const url of [
      "https://www.youtube.com/watch?v=abc123XYZ_-",
      "https://youtu.be/abc123XYZ_-",
      "https://m.youtube.com/watch?v=abc123XYZ_-&t=30s",
    ]) {
      const v = parseVideo(url);
      expect(v.provider).toBe("youtube");
      expect(v.id).toBe("abc123XYZ_-");
      expect(v.embedUrl).toContain("youtube-nocookie.com/embed/abc123XYZ_-");
    }
  });

  it("reads Vimeo links", () => {
    const v = parseVideo("https://vimeo.com/123456789");
    expect(v.provider).toBe("vimeo");
    expect(v.embedUrl).toBe("https://player.vimeo.com/video/123456789?autoplay=1&dnt=1");
  });

  it("reads direct video files", () => {
    const v = parseVideo("https://media.offgrid056.example/clip.mp4");
    expect(v.provider).toBe("file");
    expect(v.embedUrl).toBe("https://media.offgrid056.example/clip.mp4");
  });

  it("marks stand-in URLs as placeholders so no player is ever embedded for them", () => {
    expect(parseVideo("https://www.youtube.com/watch?v=PLACEHOLDER-DEMO").isPlaceholder).toBe(true);
    expect(parseVideo("https://vimeo.com/000000000").isPlaceholder).toBe(true);
    expect(parseVideo("https://example.com/demo/x.mp4").isPlaceholder).toBe(true);
    expect(parseVideo("not a url").provider).toBe("unknown");
  });

  it("uses the privacy-enhanced YouTube domain and never autoplays without a choice", () => {
    const v = parseVideo("https://www.youtube.com/watch?v=abc123XYZ_-");
    expect(v.embedUrl).toMatch(/^https:\/\/www\.youtube-nocookie\.com/);
    expect(v.watchUrl).not.toEqual(v.embedUrl); // the embed only exists once play is pressed
  });
});

describe("related resources", () => {
  const water = getResourceById("res-0014")!; // Water Security Guide, has manual links and a learning path

  it("puts manually chosen links first and never repeats one", () => {
    const related = relatedResources({ current: water, all });
    expect(related[0].reason).toBe("Linked by us");
    expect(new Set(related.map((r) => r.resource.id)).size).toBe(related.length);
  });

  it("never links a resource to itself and never returns an unknown id", () => {
    for (const r of getSummaries()) {
      const current = getResourceById(r.id)!;
      const related = relatedResources({ current, all });
      expect(related.some((x) => x.resource.id === r.id)).toBe(false);
      expect(related.every((x) => byId.has(x.resource.id))).toBe(true);
    }
  });

  it("ignores a manual link to an id the library does not have", () => {
    const current = { ...water, relatedResources: ["res-9999", ...water.relatedResources] };
    const related = relatedResources({ current, all });
    expect(related.some((x) => x.resource.id === "res-9999")).toBe(false);
    expect(related.length).toBeGreaterThan(0);
  });

  it("falls back through topic, path and foundation when there are no manual links", () => {
    const solo = { id: "res-0010", foundation: "energy", category: "backup-energy", tags: ["outage"], relatedResources: [] };
    const related = relatedResources({ current: solo, all });
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((x) => x.resource.id !== solo.id)).toBe(true);
  });

  it("recommends the next learning-path step before anything else", () => {
    const path = loadLearningPaths().find((p) => p.id === "water-basics")!;
    const related = relatedResources({ current: water, all });
    const next = recommendedNext(water, related, path.steps, all, new Set());
    expect(next?.resource.id).toBe(path.steps[path.steps.indexOf(water.id) + 1]);
    // and skips steps the member has already completed
    const skipped = recommendedNext(water, related, path.steps, all, new Set([path.steps[1]]));
    expect(skipped?.resource.id).toBe(path.steps[2]);
  });
});

describe("downloads", () => {
  const downloads = getDownloads();

  it("lists every downloadable resource with a real size read from the file", () => {
    expect(downloads.length).toBeGreaterThan(10);
    for (const d of downloads) {
      expect(d.sizeBytes).toBeGreaterThan(0);
      expect(d.fileUrl.startsWith("/resources/")).toBe(true);
      expect(["PDF", "ZIP"]).toContain(d.format);
    }
  });

  it("only offers Open for formats a browser can display", () => {
    expect(downloads.filter((d) => d.format === "ZIP").every((d) => !d.openable)).toBe(true);
    expect(downloads.filter((d) => d.format === "PDF").every((d) => d.openable)).toBe(true);
  });

  it("formats sizes and dates for people", () => {
    expect(formatBytes(41280)).toBe("40 KB");
    expect(formatBytes(1_572_864)).toBe("1.5 MB");
    expect(formatBytes(null)).toBe("size unknown");
    expect(formatDate("2026-09-19")).toBe("19 Sept 2026"); // en-NZ abbreviates September as "Sept"
    expect(formatDate("2026-11-12")).toBe("12 Nov 2026");
  });
});

describe("programme resource links", () => {
  it("gives every day at least one real resource and a worksheet that exists", () => {
    for (const day of getProgrammeDays()) {
      expect(day.resourceIds.length).toBeGreaterThan(0);
      for (const id of day.resourceIds) expect(byId.has(id)).toBe(true);
      const ws = day.worksheet?.resourceId;
      if (ws) expect(getResourceById(ws)?.fileUrl).toBeTruthy();
    }
  });
});

describe("directory data", () => {
  it("keeps every supplier clearly marked as demonstration content", () => {
    const suppliers = getSuppliers();
    expect(suppliers.length).toBeGreaterThan(5);
    for (const s of suppliers) {
      expect(s.isDemo).toBe(true);
      expect(s.name.startsWith("DEMO:")).toBe(true);
      expect(s.website).toBe("https://example.com"); // no real supplier is named or linked
      expect(s.description).toContain("DEMONSTRATION ENTRY");
    }
    expect(new Set(suppliers.map((s) => s.country))).toEqual(new Set(["NZ", "AU", "US", "CA"]));
  });

  it("keeps workshops demo-flagged, with valid dates and real handouts", () => {
    for (const w of getWorkshops()) {
      expect(w.isDemo).toBe(true);
      expect(Number.isNaN(Date.parse(w.startDate))).toBe(false);
      if (w.endDate) expect(Date.parse(w.endDate)).toBeGreaterThanOrEqual(Date.parse(w.startDate));
      for (const d of w.downloads) if (d.resourceId) expect(getResourceById(d.resourceId)?.fileUrl).toBeTruthy();
      for (const id of w.relatedResources) expect(byId.has(id)).toBe(true);
    }
  });
});

describe("learning paths", () => {
  it("has ordered steps that all exist and never repeat", () => {
    for (const p of loadLearningPaths()) {
      expect(p.steps.length).toBeGreaterThan(1);
      expect(new Set(p.steps).size).toBe(p.steps.length);
      for (const id of p.steps) expect(byId.has(id)).toBe(true);
    }
  });
});

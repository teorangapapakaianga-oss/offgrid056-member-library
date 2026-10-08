import { describe, expect, it } from "vitest";
import { CURATED_RELATED_MIN, relatedResources } from "@/lib/related";
import type { ResourceSummary } from "@/lib/content/summaries";

/**
 * Stage 10.09B — the curated-related rule (owner ruling): a protected resource with four or more explicit related links shows exactly
 * those links and no automatic fill. A demonstration resource, and a protected resource with fewer than four explicit links, keep the
 * existing behaviour. General rule: no resource is named.
 */
const mk = (id: string, over: Partial<ResourceSummary> = {}) => ({ id, slug: id, title: `T ${id}`, foundation: "general", category: "planning", tags: [] as string[], isPlaceholder: false, ...over }) as unknown as ResourceSummary;
// twelve same-foundation, same-category peers: plenty of automatic-fill candidates, protected and demo
const peers = [...Array.from({ length: 6 }, (_, i) => mk(`res-10${20 + i}`)), ...Array.from({ length: 6 }, (_, i) => mk(`res-00${20 + i}`, { isPlaceholder: true }))];
const links = Array.from({ length: 6 }, (_, i) => mk(`res-20${10 + i}`, { foundation: "water", category: "water-storage" }));
const all = [...peers, ...links];
const cur = (n: number, over: Record<string, unknown> = {}) => ({ id: "res-1999", foundation: "general", category: "planning", tags: [] as string[], relatedResources: links.slice(0, n).map((l) => l.id), ...over });

describe("curated related list (Stage 10.09B)", () => {
  it("the threshold is four", () => expect(CURATED_RELATED_MIN).toBe(4));

  for (const n of [4, 5, 6]) {
    it(`a protected resource with ${n} explicit links returns exactly those ${n}, in order, with no automatic fill`, () => {
      const related = relatedResources({ current: cur(n), all });
      expect(related.map((r) => r.resource.id)).toEqual(links.slice(0, n).map((l) => l.id));
      expect(related.every((r) => r.reason === "Linked by us")).toBe(true);
    });
  }

  it("no same-topic, learning-path, shared-tag or same-foundation card is appended, even when each would qualify", () => {
    const current = cur(4, { learningPath: "any-path", tags: ["shared"] });
    const rich = [...all, mk("res-1090", { tags: ["shared"] }), mk("res-1091", { foundation: "water", category: "water-storage" })];
    const related = relatedResources({ current, all: rich });
    expect(related.map((r) => r.resource.id)).toEqual(links.slice(0, 4).map((l) => l.id));
  });

  it("the explicit-link order is the order written, not the pool order", () => {
    const reversed = links.slice(0, 5).map((l) => l.id).reverse();
    const related = relatedResources({ current: cur(5, { relatedResources: reversed }), all });
    expect(related.map((r) => r.resource.id)).toEqual(reversed);
  });

  it("an unknown or self link does not count towards the four", () => {
    const current = cur(3, { relatedResources: ["res-9999", "res-1999", ...links.slice(0, 3).map((l) => l.id)] });
    const related = relatedResources({ current, all });
    expect(related.slice(0, 3).map((r) => r.resource.id)).toEqual(links.slice(0, 3).map((l) => l.id));
    expect(related.length).toBe(6);
    expect(related.slice(3).every((r) => r.reason !== "Linked by us")).toBe(true);
  });

  it("three explicit links keep the automatic fills, up to six cards (existing behaviour)", () => {
    const related = relatedResources({ current: cur(3), all });
    expect(related.length).toBe(6);
    expect(related.slice(0, 3).every((r) => r.reason === "Linked by us")).toBe(true);
    expect(related.slice(3).every((r) => r.reason === "Same topic")).toBe(true);
  });

  it("zero, one and two explicit links keep the automatic fills", () => {
    for (const n of [0, 1, 2]) {
      const related = relatedResources({ current: cur(n), all });
      expect(related.length, String(n)).toBe(6);
      expect(related.filter((r) => r.reason === "Linked by us").length).toBe(n);
    }
  });

  it("a demonstration resource with four or more explicit links keeps the automatic fills (unchanged)", () => {
    for (const n of [4, 5]) {
      const related = relatedResources({ current: cur(n, { isPlaceholder: true }), all });
      expect(related.length, String(n)).toBe(6);
      expect(related.slice(0, n).map((r) => r.resource.id)).toEqual(links.slice(0, n).map((l) => l.id));
      expect(related.slice(n).every((r) => r.reason === "Same topic")).toBe(true);
    }
  });

  it("the card limit still applies: seven explicit links on a protected resource show six", () => {
    const seven = Array.from({ length: 7 }, (_, i) => mk(`res-30${10 + i}`));
    const related = relatedResources({ current: { ...cur(0), relatedResources: seven.map((s) => s.id) }, all: [...all, ...seven] });
    expect(related.length).toBe(6);
    expect(related.map((r) => r.resource.id)).toEqual(seven.slice(0, 6).map((s) => s.id));
  });

  it("never links a resource to itself and never repeats a link", () => {
    const current = cur(0, { relatedResources: ["res-1999", links[0].id, links[0].id, links[1].id, links[2].id, links[3].id] });
    const related = relatedResources({ current, all });
    expect(related.map((r) => r.resource.id)).toEqual(links.slice(0, 4).map((l) => l.id));
  });
});

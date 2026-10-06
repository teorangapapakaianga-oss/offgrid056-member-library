import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import routePolicy from "@/lib/content/route-policy.json";
import { aliasOf, demoSlug, resolveRouteCollisions, RouteCollisionError, type RoutePolicy } from "@/lib/content/supersession";

/**
 * Stage 9.73 (owner ruling): DEMO CONTENT AND PROTECTED MEMBER CONTENT MUST REMAIN EXPLICITLY SEPARATED. A real
 * resource must not silently replace demo content merely because both use the same route. Found when the real OG-01
 * replaced the placeholder `res-0007`, which silently re-pointed programme days 2 and 29 and the demo Household
 * Resilience Assessment at protected content.
 */
const demo = { id: "res-0007", slug: "home-resilience-scorecard", isPlaceholder: true, relatedResources: [] as string[] };
const real = { id: "res-1001", slug: "home-resilience-scorecard", isPlaceholder: false, relatedResources: [] as string[] };
const SEPARATE: RoutePolicy = { supersedes: {}, separateDemo: { "res-0007": "res-1001" } };

describe("route clashes need an owner-approved resolution (fail closed)", () => {
  it("stops the build on a clash with no recorded resolution — a real resource never replaces demo content by default", () => {
    expect(() => resolveRouteCollisions([demo, real], { preview: true })).toThrow(RouteCollisionError);
    expect(() => resolveRouteCollisions([demo, real], { preview: true, policy: { supersedes: {}, separateDemo: {} } })).toThrow(/no owner-approved resolution/);
  });

  it("does not accept a resolution recorded for a different real resource", () => {
    const wrong = { supersedes: {}, separateDemo: { "res-0007": "res-1002" } };
    expect(() => resolveRouteCollisions([demo, real], { preview: true, policy: wrong })).toThrow(/no owner-approved resolution/);
    const wrongSupersede = { supersedes: { "res-0007": "res-1002" }, separateDemo: {} };
    expect(() => resolveRouteCollisions([demo, real], { preview: true, policy: wrongSupersede })).toThrow(/no owner-approved resolution/);
  });

  it("still stops any build that is not the private preview, whatever the policy says", () => {
    expect(() => resolveRouteCollisions([demo, real], { preview: false, policy: SEPARATE })).toThrow(/outside the private preview/);
  });
});

describe("separated demo placeholder", () => {
  const out = resolveRouteCollisions([demo, real], { preview: true, policy: SEPARATE });
  const byId = (id: string) => out.resources.find((r) => r.id === id)!;

  it("the protected resource keeps its route and the demo placeholder stays a placeholder on a route of its own", () => {
    expect(byId("res-1001").slug).toBe("home-resilience-scorecard");
    expect(byId("res-1001").isPlaceholder).toBe(false);
    expect(byId("res-0007").slug).toBe("demo-home-resilience-scorecard");
    expect(byId("res-0007").slug).toBe(demoSlug("home-resilience-scorecard"));
    expect(byId("res-0007").isPlaceholder).toBe(true);
    expect(new Set(out.resources.map((r) => r.slug)).size).toBe(out.resources.length);
  });

  it("nothing is redirected: a reference to the placeholder still means the placeholder", () => {
    expect(out.aliases.size).toBe(0);
    expect(aliasOf(out.aliases)("res-0007")).toBe("res-0007");
  });

  it("Stage 9.73A: a separated placeholder is reported as separated (so listings can hide it); a superseded one is not", () => {
    expect([...out.separated]).toEqual(["res-0007"]);
    const sup = resolveRouteCollisions([{ id: "res-0015", slug: "water-storage-calculator", isPlaceholder: true, relatedResources: [] as string[] }, { id: "res-1008", slug: "water-storage-calculator", isPlaceholder: false, relatedResources: [] as string[] }], { preview: true, policy: { supersedes: { "res-0015": "res-1008" }, separateDemo: {} } });
    expect(sup.separated.size).toBe(0);
  });

  it("fails closed if the demo route is itself already taken", () => {
    const taken = { id: "res-0099", slug: "demo-home-resilience-scorecard", isPlaceholder: true, relatedResources: [] as string[] };
    expect(() => resolveRouteCollisions([demo, real, taken], { preview: true, policy: SEPARATE })).toThrow(/still claimed more than once/);
  });

  it("leaves every resource that does not clash untouched", () => {
    const other = { id: "res-0014", slug: "water-security-guide", isPlaceholder: true, relatedResources: [] as string[] };
    expect(resolveRouteCollisions([other, demo, real], { preview: true, policy: SEPARATE }).resources.find((r) => r.id === "res-0014")).toBe(other);
  });
});

describe("the recorded owner policy", () => {
  const policy = routePolicy as RoutePolicy;

  it("Stage 9.73B: all four collisions — OG-01, OG-08, OG-10, OG-13 — are explicitly separated, and nothing is superseded", () => {
    expect(policy.separateDemo).toEqual({ "res-0007": "res-1001", "res-0015": "res-1008", "res-0016": "res-1010", "res-0013": "res-1013" });
    expect(policy.supersedes).toEqual({});
  });

  it("no pending or grandfathered approval remains: every entry is OWNER-APPROVED, and there is no 'pending' status anywhere", () => {
    expect(JSON.stringify(routePolicy)).not.toMatch(/PENDING OWNER RULING|grandfathered(?! is not)/i);
    expect((routePolicy as unknown as Record<string, unknown>).supersedesStatus).toBeUndefined();
  });

  it("every entry of the policy has a status, and the approved separation says so in words", () => {
    const sep = (routePolicy as unknown as { separateDemoStatus: Record<string, string> }).separateDemoStatus;
    for (const id of Object.keys(policy.separateDemo)) expect(sep[id], id).toMatch(/^OWNER-APPROVED/);
  });

  it("a placeholder is resolved one way only", () => {
    for (const id of Object.keys(policy.separateDemo)) expect(policy.supersedes[id]).toBeUndefined();
  });
});

describe("the library as built (public data + the staged private records, when present)", () => {
  const root = process.cwd();
  const readDir = (d: string) => (fs.existsSync(path.join(root, d)) ? fs.readdirSync(path.join(root, d)).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(root, d, f), "utf8")) as Record<string, unknown> & { id: string; slug: string; isPlaceholder?: boolean; relatedResources?: string[]; marketFiles?: Record<string, { fileUrl: string }>; fileUrl?: string }) : []);
  const publicRes = readDir("data/resources").filter((r) => !("legacyCode" in r));
  const privateRes = readDir("private-assets/data-resources").map((r) => ({ ...r, isPlaceholder: false }));
  const all = [...publicRes.map((r) => ({ ...r, isPlaceholder: r.isPlaceholder ?? false })), ...privateRes].map((r) => ({ id: r.id, slug: r.slug, isPlaceholder: !!r.isPlaceholder, relatedResources: r.relatedResources ?? [] }));
  const resolved = resolveRouteCollisions(all, { preview: true, policy: routePolicy as RoutePolicy });

  it("every clash in the real data has an owner-approved resolution (so the preview build cannot stop on one)", () => {
    expect(() => resolveRouteCollisions(all, { preview: true, policy: routePolicy as RoutePolicy })).not.toThrow();
  });

  it("the demo placeholder route stays demo, the protected OG-01 route resolves to the protected resource", () => {
    if (!privateRes.some((r) => r.id === "res-1001")) return; // public checkout: no private records staged
    expect(resolved.resources.find((r) => r.slug === "home-resilience-scorecard")?.id).toBe("res-1001");
    expect(resolved.resources.find((r) => r.slug === "demo-home-resilience-scorecard")?.id).toBe("res-0007");
    expect(resolved.resources.find((r) => r.id === "res-0007")?.isPlaceholder).toBe(true);
  });

  it("Stage 9.73B: NO demo id is aliased to a protected one, and all four demo placeholders are separated and unlisted", () => {
    expect(Object.fromEntries(resolved.aliases)).toEqual({});
    expect([...resolved.separated].sort()).toEqual(privateRes.length ? ["res-0007", "res-0013", "res-0015", "res-0016"] : []);
  });

  it("each of the four protected routes resolves to the protected resource and each demo placeholder stays demo on its own demo- route", () => {
    if (!privateRes.length) return;
    const pairs: [string, string, string][] = [["res-1001", "res-0007", "home-resilience-scorecard"], ["res-1008", "res-0015", "water-storage-calculator"], ["res-1010", "res-0016", "rainwater-harvesting-planner"], ["res-1013", "res-0013", "healthy-home-air-audit"]];
    for (const [realId, demoId, slug] of pairs) {
      expect(resolved.resources.find((r) => r.slug === slug)?.id, `/resources/${slug}/`).toBe(realId);
      const d = resolved.resources.find((r) => r.id === demoId)!;
      expect(d.slug, demoId).toBe(`demo-${slug}`);
      expect(d.isPlaceholder, demoId).toBe(true);
    }
  });

  it("programme days 2, 9, 11, 13 and 29 point at the DEMO placeholders and resolve exactly as configured (no promotion)", () => {
    const want: Record<string, string> = { "day-02": "res-0007", "day-09": "res-0015", "day-11": "res-0016", "day-13": "res-0013", "day-29": "res-0007" };
    for (const [d, demoId] of Object.entries(want)) {
      const day = JSON.parse(fs.readFileSync(path.join(root, `data/programme/days/${d}.json`), "utf8")) as { resourceIds: string[]; worksheet?: { resourceId?: string }; isPlaceholder: boolean };
      expect(day.resourceIds, d).toEqual([demoId]);
      expect(day.worksheet?.resourceId, d).toBe(demoId);
      expect(day.isPlaceholder, d).toBe(true);
      expect(aliasOf(resolved.aliases)(demoId), `${demoId} must not be an alias`).toBe(demoId);
    }
  });

  it("the demo references stay demo: the demo workshop, the demo Household Resilience Assessment, Water Security Guide and Ventilation Basics", () => {
    const ws = JSON.parse(fs.readFileSync(path.join(root, "data/workshops/demo-water-storage-workshop.json"), "utf8")) as { downloads: { resourceId?: string }[] };
    expect(ws.downloads.map((x) => x.resourceId)).toContain("res-0015");
    const rel = (slug: string) => publicRes.find((r) => r.slug === slug)?.relatedResources ?? [];
    expect(rel("household-resilience-assessment")).toContain("res-0007");
    expect(rel("water-security-guide")).toEqual(expect.arrayContaining(["res-0015", "res-0016"]));
    expect(rel("ventilation-basics")).toContain("res-0013");
    // None of the demo records is aliased, so every one of these resolves to itself.
    for (const id of ["res-0007", "res-0013", "res-0015", "res-0016"]) expect(aliasOf(resolved.aliases)(id)).toBe(id);
  });

  it("the demo water-basics learning path names the demo placeholders; in the preview it is replaced as a whole by the explicit private path, not aliased", () => {
    const demoPath = JSON.parse(fs.readFileSync(path.join(root, "data/learning-paths/water-basics.json"), "utf8")) as { steps: string[] };
    expect(demoPath.steps).toEqual(["res-0014", "res-0015", "res-0017", "res-0016"]);
    const priv = path.join(root, "private-assets/data-learning-paths/water-basics.private.json");
    if (fs.existsSync(priv)) expect((JSON.parse(fs.readFileSync(priv, "utf8")) as { steps: string[] }).steps).toEqual(["res-1008", "res-1010", "res-1009", "res-1508"]);
  });

  it("no demo placeholder inherits a protected file or link, and no protected record falls back to demo — for all four pairs", () => {
    const pairs: [string, string][] = [["res-0007", "res-1001"], ["res-0015", "res-1008"], ["res-0016", "res-1010"], ["res-0013", "res-1013"]];
    for (const [demoId, realId] of pairs) {
      const demoRec = publicRes.find((r) => r.id === demoId)!;
      expect(demoRec.marketFiles, `${demoId} has no market files`).toBeUndefined();
      expect(String(demoRec.fileUrl), demoId).toMatch(/^\/resources\/[a-z]+\/[a-z0-9-]+\.pdf$/);
      expect(String(demoRec.fileUrl), demoId).not.toMatch(/\.(NZ|AU)\.pdf$/);
      const realRec = privateRes.find((r) => r.id === realId);
      if (!realRec) continue; // public checkout: no private records staged
      expect(realRec.fileUrl, `${realId} has no default (demo-shaped) file`).toBeUndefined();
      for (const m of Object.values(realRec.marketFiles ?? {})) expect(m.fileUrl, realId).toMatch(/\.(NZ|AU)\.pdf$|^\/resources\/household-risk-identifier\.pdf$/);
      expect(realRec.relatedResources ?? [], realId).not.toContain(demoId);
      expect(JSON.stringify(realRec), realId).not.toMatch(/DEMONSTRATION ENTRY|placeholder content/i);
      expect(realRec.isPlaceholder, realId).toBe(false);
      // The demo's own file path is never the protected one.
      expect(String(demoRec.fileUrl)).not.toBe(Object.values(realRec.marketFiles ?? {})[0]?.fileUrl);
    }
  });
});

describe("a missing route stays missing, and protected routes stay behind Access", () => {
  const root = process.cwd();
  const wrangler = fs.readFileSync(path.join(root, "wrangler.jsonc"), "utf8");

  it("unknown paths get the site's own 404 — no single-page-app fallback that could serve other content", () => {
    expect(wrangler).toMatch(/"not_found_handling":\s*"404-page"/);
    expect(wrangler).not.toMatch(/"not_found_handling":\s*"single-page-application"/);
  });

  it("the Worker has no script and no routes of its own: Access fronts the whole hostname, assets included", () => {
    expect(wrangler).toMatch(/"directory":\s*"\.\/out"/);
    expect(wrangler).not.toMatch(/"main"\s*:/);
  });
});

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

  it("separates the demo Home Resilience Scorecard (res-0007) from the protected one (res-1001), and does not supersede it", () => {
    expect(policy.separateDemo["res-0007"]).toBe("res-1001");
    expect(policy.supersedes["res-0007"]).toBeUndefined();
  });

  it("keeps exactly the three resolved-and-live supersessions, each tied to its one real id", () => {
    expect(policy.supersedes).toEqual({ "res-0015": "res-1008", "res-0016": "res-1010", "res-0013": "res-1013" });
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

  it("no demo id is aliased to a protected one except the three approved supersessions", () => {
    expect(Object.fromEntries(resolved.aliases)).toEqual(privateRes.length ? { "res-0015": "res-1008", "res-0016": "res-1010", "res-0013": "res-1013" } : {});
  });

  it("programme days 2 and 29 and the demo Household Resilience Assessment still point at the demo placeholder res-0007", () => {
    for (const d of ["day-02", "day-29"]) {
      const day = JSON.parse(fs.readFileSync(path.join(root, `data/programme/days/${d}.json`), "utf8")) as { resourceIds: string[]; worksheet?: { resourceId?: string }; isPlaceholder: boolean };
      expect(day.resourceIds, d).toEqual(["res-0007"]);
      expect(day.worksheet?.resourceId, d).toBe("res-0007");
      expect(day.isPlaceholder, d).toBe(true);
      // They resolve exactly as configured: res-0007 is not an alias of anything.
      expect(aliasOf(resolved.aliases)("res-0007")).toBe("res-0007");
    }
    const hra = publicRes.find((r) => r.slug === "household-resilience-assessment");
    expect(hra?.relatedResources).toContain("res-0007");
  });

  it("the demo placeholder cannot inherit protected content or links; the protected record does not fall back to demo", () => {
    const demoRec = publicRes.find((r) => r.id === "res-0007")!;
    expect(demoRec.marketFiles).toBeUndefined();
    expect(String(demoRec.fileUrl)).toMatch(/^\/resources\/general\//);
    expect(String(demoRec.fileUrl)).not.toMatch(/\.(NZ|AU)\.pdf$/);
    const realRec = privateRes.find((r) => r.id === "res-1001");
    if (!realRec) return;
    expect(realRec.fileUrl).toBeUndefined();
    expect(Object.values(realRec.marketFiles ?? {}).map((m) => m.fileUrl)).toEqual(["/resources/home-resilience-scorecard.NZ.pdf", "/resources/home-resilience-scorecard.AU.pdf"]);
    expect(realRec.relatedResources ?? []).not.toContain("res-0007");
    expect(JSON.stringify(realRec)).not.toMatch(/DEMONSTRATION ENTRY|placeholder content/i);
    expect(realRec.isPlaceholder).toBe(false);
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

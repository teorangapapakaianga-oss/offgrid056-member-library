import { describe, expect, it } from "vitest";
import { aliasOf, resolveRouteCollisions, RouteCollisionError } from "@/lib/content/supersession";
import { loadAllResourceFiles } from "@/lib/content/repository";

/**
 * Stage 9.38. One route per resource: in the private preview a real resource supersedes a demo placeholder on the
 * same route; every other collision stops the build.
 */
const placeholder = { id: "res-0015", slug: "water-storage-calculator", isPlaceholder: true, title: "demo" };
const real = { id: "res-1008", slug: "water-storage-calculator", isPlaceholder: false, title: "real" };
const other = { id: "res-0014", slug: "water-security-guide", isPlaceholder: true, title: "other" };

describe("route supersession", () => {
  it("lets a real resource replace a demo placeholder in the private preview, and points its id at the real one", () => {
    const { resources, aliases } = resolveRouteCollisions([placeholder, other, real], { preview: true });
    expect(resources.map((r) => r.id)).toEqual(["res-0014", "res-1008"]);
    expect(resources.filter((r) => r.slug === "water-storage-calculator")).toHaveLength(1);
    expect(aliasOf(aliases)("res-0015")).toBe("res-1008");
    expect(aliasOf(aliases)("res-0014")).toBe("res-0014");
  });

  it("does not depend on file order", () => {
    expect(resolveRouteCollisions([real, placeholder], { preview: true }).resources.map((r) => r.id)).toEqual(["res-1008"]);
  });

  it("stops any build that is not the private preview", () => {
    expect(() => resolveRouteCollisions([placeholder, real], { preview: false })).toThrow(RouteCollisionError);
    expect(() => resolveRouteCollisions([placeholder, real], { preview: false })).toThrow(/outside the private preview/);
  });

  it("fails closed when two real resources claim one route, in any build", () => {
    const real2 = { ...real, id: "res-1099" };
    for (const preview of [true, false]) expect(() => resolveRouteCollisions([real, real2], { preview })).toThrow(/more than one real resource/);
  });

  it("fails closed when two placeholders collide", () => {
    const p2 = { ...placeholder, id: "res-0099" };
    expect(() => resolveRouteCollisions([placeholder, p2], { preview: true })).toThrow(/more than one placeholder/);
  });

  it("leaves resources without a collision untouched", () => {
    const input = [placeholder, other];
    expect(resolveRouteCollisions(input, { preview: true }).resources).toEqual(input);
    expect(resolveRouteCollisions(input, { preview: false }).aliases.size).toBe(0);
  });

  it("keeps the public demo build unchanged: the placeholder is still there, once", () => {
    const all = loadAllResourceFiles();
    const onRoute = all.filter((r) => r.slug === "water-storage-calculator");
    expect(onRoute.map((r) => [r.id, r.isPlaceholder])).toEqual([["res-0015", true]]);
    // No real member record is in the public data.
    expect(all.some((r) => r.legacyCode)).toBe(false);
  });
});

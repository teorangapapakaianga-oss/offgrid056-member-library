import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { aliasOf, PathCollisionError, resolveLearningPathCollisions, resolveRouteCollisions, RouteCollisionError } from "@/lib/content/supersession";
import { loadAllResourceFiles, loadLearningPaths } from "@/lib/content/repository";

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

  it("handles the next known clash the same way, with no OG-10 exception (Stage 9.40)", () => {
    // OG-10's record shape, against the demo placeholder it will supersede.
    const og10 = { id: "res-1010", slug: "rainwater-harvesting-planner", isPlaceholder: false };
    const demo = { id: "res-0016", slug: "rainwater-harvesting-planner", isPlaceholder: true };
    const { resources, aliases } = resolveRouteCollisions([demo, og10, placeholder], { preview: true });
    expect(resources.map((r) => r.id)).toEqual(["res-1010", "res-0015"]);
    expect(aliasOf(aliases)("res-0016")).toBe("res-1010");
    expect(() => resolveRouteCollisions([demo, og10], { preview: false })).toThrow(/outside the private preview/);
  });

  it("keeps the public demo build unchanged: the placeholder is still there, once", () => {
    const all = loadAllResourceFiles();
    const onRoute = all.filter((r) => r.slug === "water-storage-calculator");
    expect(onRoute.map((r) => [r.id, r.isPlaceholder])).toEqual([["res-0015", true]]);
    // No real member record is in the public data.
    expect(all.some((r) => r.legacyCode)).toBe(false);
  });
});

/**
 * Stage 9.47. The same rule for pathways: a private learning path staged for the preview supersedes the
 * demonstration path with its id, in the preview and nowhere else.
 */
describe("learning path supersession", () => {
  const demo = { id: "water-basics", isPrivate: false, from: "demo" };
  const priv = { id: "water-basics", isPrivate: true, from: "private" };
  const elsewhere = { id: "energy-basics", isPrivate: false, from: "demo" };

  it("lets a private path replace the demonstration path in the preview", () => {
    expect(resolveLearningPathCollisions([demo, priv, elsewhere], { preview: true })).toEqual([priv, elsewhere]);
  });

  it("refuses the same swap outside the private preview", () => {
    expect(() => resolveLearningPathCollisions([demo, priv], { preview: false })).toThrow(PathCollisionError);
  });

  it("fails on two private paths with one id, in any build", () => {
    for (const preview of [true, false]) {
      expect(() => resolveLearningPathCollisions([priv, { ...priv, from: "second" }], { preview })).toThrow(/more than one private file/);
    }
  });

  it("fails on two demonstration paths with one id, in any build", () => {
    for (const preview of [true, false]) {
      expect(() => resolveLearningPathCollisions([demo, { ...demo, from: "second" }], { preview })).toThrow(/more than one demonstration file/);
    }
  });

  it("leaves paths that do not collide alone", () => {
    const paths = [demo, elsewhere];
    expect(resolveLearningPathCollisions(paths, { preview: true })).toEqual(paths);
  });
});

describe("the private Water Basics path", () => {
  const root = process.cwd();
  const privateFile = path.join(root, "private-assets/data-learning-paths/water-basics.private.json");
  const privatePath = fs.existsSync(privateFile) ? (JSON.parse(fs.readFileSync(privateFile, "utf8")) as { id: string; steps: string[]; description: string }) : null;

  it("walks the four real water resources in order, with no placeholder", () => {
    expect(privatePath, "private-assets/data-learning-paths/water-basics.private.json is missing").not.toBeNull();
    expect(privatePath!.id).toBe("water-basics");
    expect(privatePath!.steps).toEqual(["res-1008", "res-1010", "res-1009", "res-1508"]);
    expect(privatePath!.description).not.toMatch(/DEMONSTRATION/i);
    // Every step is a real private record, and no step is a demo id.
    const records = fs
      .readdirSync(path.join(root, "private-assets/data-resources"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(root, "private-assets/data-resources", f), "utf8")) as { id: string });
    for (const step of privatePath!.steps) {
      expect(records.some((r) => r.id === step), `${step} has no private record`).toBe(true);
      expect(step).not.toMatch(/^res-0\d/);
    }
    expect(new Set(privatePath!.steps).size).toBe(privatePath!.steps.length); // no duplicate step
  });

  it("stays out of the public build: staged for the preview only, and git-ignored", () => {
    const build = fs.readFileSync(path.join(root, "tools/build-preview.mjs"), "utf8");
    expect(build).toContain('"private-assets", "data-learning-paths"');
    expect(build).toContain('"data", "learning-paths"');
    expect(fs.readFileSync(path.join(root, ".gitignore"), "utf8")).toContain("data/learning-paths/*.private.json");
    expect(fs.readdirSync(path.join(root, "data/learning-paths")).filter((f) => f.endsWith(".private.json"))).toEqual([]);
  });

  it("leaves the public demonstration path exactly as it was", () => {
    const demoPath = JSON.parse(fs.readFileSync(path.join(root, "data/learning-paths/water-basics.json"), "utf8")) as { steps: string[]; description: string };
    expect(demoPath.steps).toEqual(["res-0014", "res-0015", "res-0017", "res-0016"]);
    expect(demoPath.description).toMatch(/DEMONSTRATION/);
    // This is the one the public build loads.
    expect(loadLearningPaths().find((p) => p.id === "water-basics")?.steps).toEqual(["res-0014", "res-0015", "res-0017", "res-0016"]);
  });
});

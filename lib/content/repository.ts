/**
 * Content repository: the ONLY code that reads data/ (docs/ARCHITECTURE.md §6).
 * Runs at build time (server components, tools). Replacing this file's internals with a CMS or database
 * reader is the content migration path (§14); callers do not change.
 */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { LearningPathSchema, ResourceSchema, type LearningPath, type Resource } from "./schemas";
import { toSummary, type ResourceSummary } from "./summaries";

const DATA_DIR = path.join(process.cwd(), "data");

export class ContentError extends Error {}

function readJsonDir<T>(dir: string, parse: (raw: unknown, file: string) => T): T[] {
  const full = path.join(DATA_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const file = path.join(dir, f);
      let raw: unknown;
      try {
        raw = JSON.parse(fs.readFileSync(path.join(full, f), "utf8"));
      } catch (e) {
        throw new ContentError(`${file}: invalid JSON (${(e as Error).message})`);
      }
      return parse(raw, file);
    });
}

function parseWith<S extends z.ZodType>(schema: S) {
  return (raw: unknown, file: string): z.output<S> => {
    const res = schema.safeParse(raw);
    if (!res.success) {
      const issues = res.error.issues.map((i) => `  - ${i.path.map(String).join(".") || "(root)"}: ${i.message}`).join("\n");
      throw new ContentError(`${file}:\n${issues}`);
    }
    return res.data;
  };
}

let resourceCache: Resource[] | null = null;
let pathCache: LearningPath[] | null = null;

/** Every resource file, including drafts and archived (used by validation). */
export function loadAllResourceFiles(): Resource[] {
  resourceCache ??= readJsonDir("resources", parseWith(ResourceSchema));
  return resourceCache;
}

export function loadLearningPaths(): LearningPath[] {
  pathCache ??= readJsonDir("learning-paths", parseWith(LearningPathSchema));
  return pathCache;
}

/** Published resources only: what the site builds. */
export function getResources(): Resource[] {
  return loadAllResourceFiles().filter((r) => r.status === "published");
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getResources().find((r) => r.slug === slug);
}

export function getResourceById(id: string): Resource | undefined {
  return getResources().find((r) => r.id === id);
}

export function getSummaries(filter?: (r: Resource) => boolean): ResourceSummary[] {
  return getResources()
    .filter(filter ?? (() => true))
    .map(toSummary);
}

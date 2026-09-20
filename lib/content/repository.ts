/**
 * Content repository: the ONLY code that reads data/ (docs/ARCHITECTURE.md §6).
 * Runs at build time (server components, tools). Replacing this file's internals with a CMS or database
 * reader is the content migration path (§14); callers do not change.
 */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { SupplierSchema, WorkshopSchema, type Supplier, type Workshop } from "./directory-schemas";
import { ProgrammeDaySchema, ProgrammeSchema, type Programme, type ProgrammeDay } from "./programme-schemas";
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

let programmeCache: Programme | null = null;
let programmeDayCache: ProgrammeDay[] | null = null;

export function getProgramme(): Programme {
  if (!programmeCache) {
    const file = path.join(DATA_DIR, "programme", "programme.json");
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      throw new ContentError(`programme/programme.json: invalid JSON (${(e as Error).message})`);
    }
    programmeCache = parseWith(ProgrammeSchema)(raw, "programme/programme.json");
  }
  return programmeCache;
}

export function getProgrammeDays(): ProgrammeDay[] {
  programmeDayCache ??= readJsonDir("programme/days", parseWith(ProgrammeDaySchema)).sort((a, b) => a.day - b.day);
  return programmeDayCache;
}

export function getProgrammeDay(day: number): ProgrammeDay | undefined {
  return getProgrammeDays().find((d) => d.day === day);
}

export function getSummaries(filter?: (r: Resource) => boolean): ResourceSummary[] {
  return getResources()
    .filter(filter ?? (() => true))
    .map(toSummary);
}

let supplierCache: Supplier[] | null = null;
let workshopCache: Workshop[] | null = null;

export function getSuppliers(): Supplier[] {
  supplierCache ??= readJsonDir("suppliers", parseWith(SupplierSchema)).sort((a, b) => a.name.localeCompare(b.name));
  return supplierCache;
}

export function getWorkshops(): Workshop[] {
  workshopCache ??= readJsonDir("workshops", parseWith(WorkshopSchema)).sort((a, b) => b.startDate.localeCompare(a.startDate));
  return workshopCache;
}

export function getWorkshopBySlug(slug: string): Workshop | undefined {
  return getWorkshops().find((w) => w.slug === slug);
}

export interface DownloadEntry {
  id: string;
  slug: string;
  title: string;
  resourceType: Resource["resourceType"];
  foundation: Resource["foundation"];
  format: string;
  sizeBytes: number | null;
  updatedDate: string;
  fileUrl: string;
  isPlaceholder: boolean;
  /** true when the browser can show it in a tab (PDF, image); otherwise only download makes sense */
  openable: boolean;
}

/** File size read from disk at build time for local files, so it can never be wrong or forgotten. */
export function fileSizeBytes(fileUrl: string, declared?: number): number | null {
  if (!fileUrl.startsWith("/")) return declared ?? null;
  try {
    return fs.statSync(path.join(process.cwd(), "public", fileUrl)).size;
  } catch {
    return declared ?? null;
  }
}

/** Everything downloadable, newest update first: the Member Download Centre. */
export function getDownloads(): DownloadEntry[] {
  return getResources()
    .filter((r) => r.downloadable && r.fileUrl)
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      resourceType: r.resourceType,
      foundation: r.foundation,
      format: r.fileFormat ?? "FILE",
      sizeBytes: fileSizeBytes(r.fileUrl!, r.fileSizeBytes),
      updatedDate: r.updatedDate ?? r.publishedDate,
      fileUrl: r.fileUrl!,
      isPlaceholder: r.isPlaceholder,
      openable: (r.fileFormat ?? "") === "PDF" || (r.fileFormat ?? "") === "PNG",
    }))
    .sort((a, b) => b.updatedDate.localeCompare(a.updatedDate) || a.title.localeCompare(b.title));
}

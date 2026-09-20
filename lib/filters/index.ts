/**
 * Library filtering: pure functions (docs/ARCHITECTURE.md §9). OR within a group, AND across groups.
 * Filter state round-trips through the URL query string so views are shareable and Back works.
 */
import { DIFFICULTIES, FOUNDATION_IDS, RESOURCE_TYPE_IDS } from "@/lib/content/constants";
import type { ResourceSummary } from "@/lib/content/summaries";
import { TIME_BANDS, isNewResource } from "@/lib/format";

export const STATUS_OPTIONS = [
  { id: "new", label: "New" },
  { id: "featured", label: "Featured" },
  { id: "completed", label: "Completed" },
  { id: "not-completed", label: "Not completed" },
] as const;

export interface FilterState {
  q: string;
  foundation: string[];
  type: string[];
  difficulty: string[];
  time: string[];
  status: string[];
}
export type FilterGroup = Exclude<keyof FilterState, "q">;
export const FILTER_GROUPS: FilterGroup[] = ["foundation", "type", "difficulty", "time", "status"];

const ALLOWED: Record<FilterGroup, readonly string[]> = {
  foundation: FOUNDATION_IDS,
  type: RESOURCE_TYPE_IDS,
  difficulty: DIFFICULTIES,
  time: TIME_BANDS.map((b) => b.id),
  status: STATUS_OPTIONS.map((s) => s.id),
};

export const EMPTY_FILTERS: FilterState = { q: "", foundation: [], type: [], difficulty: [], time: [], status: [] };

/** Reads ?q=&foundation=air,water&... Unknown values are dropped silently. */
export function parseFilters(params: URLSearchParams): FilterState {
  const list = (g: FilterGroup) =>
    (params.get(g) ?? "").split(",").map((s) => s.trim()).filter((v) => ALLOWED[g].includes(v));
  return {
    q: (params.get("q") ?? "").slice(0, 100),
    foundation: list("foundation"),
    type: list("type"),
    difficulty: list("difficulty"),
    time: list("time"),
    status: list("status"),
  };
}

export function serializeFilters(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  for (const g of FILTER_GROUPS) if (f[g].length) p.set(g, f[g].join(","));
  return p.toString();
}

export function activeFilterCount(f: FilterState): number {
  return FILTER_GROUPS.reduce((n, g) => n + f[g].length, 0);
}

export interface FilterContext {
  now: Date | null; // null until mounted in the browser: "new" is never decided at build time
  completed: ReadonlySet<string>;
}

function matchesGroup(r: ResourceSummary, g: FilterGroup, values: string[], ctx: FilterContext): boolean {
  if (!values.length) return true;
  switch (g) {
    case "foundation":
      return values.includes(r.foundation);
    case "type":
      return values.includes(r.resourceType);
    case "difficulty":
      return values.includes(r.difficulty);
    case "time":
      return TIME_BANDS.some((b) => values.includes(b.id) && b.test(r.estimatedTime));
    case "status":
      return values.some((v) => {
        if (v === "new") return ctx.now !== null && isNewResource(r, ctx.now);
        if (v === "featured") return r.featured;
        if (v === "completed") return ctx.completed.has(r.id);
        if (v === "not-completed") return r.completionAvailable && !ctx.completed.has(r.id);
        return false;
      });
  }
}

export function applyFilters(items: ResourceSummary[], f: FilterState, ctx: FilterContext, skip?: FilterGroup): ResourceSummary[] {
  return items.filter((r) => FILTER_GROUPS.every((g) => g === skip || matchesGroup(r, g, f[g], ctx)));
}

/** Facet counts: for each option, how many results it would give with the other groups applied. */
export function facetCounts(items: ResourceSummary[], f: FilterState, ctx: FilterContext): Record<FilterGroup, Record<string, number>> {
  const out = {} as Record<FilterGroup, Record<string, number>>;
  for (const g of FILTER_GROUPS) {
    const base = applyFilters(items, f, ctx, g);
    out[g] = Object.fromEntries(ALLOWED[g].map((v) => [v, base.filter((r) => matchesGroup(r, g, [v], ctx)).length]));
  }
  return out;
}

export type SortId = "recommended" | "newest" | "title" | "shortest";
export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "newest", label: "Newest first" },
  { id: "title", label: "A–Z" },
  { id: "shortest", label: "Shortest first" },
];

export function sortResources(items: ResourceSummary[], sort: SortId): ResourceSummary[] {
  const s = [...items];
  switch (sort) {
    case "newest":
      return s.sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
    case "title":
      return s.sort((a, b) => a.title.localeCompare(b.title, "en"));
    case "shortest":
      return s.sort((a, b) => a.estimatedTime - b.estimatedTime);
    default:
      return s.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || b.publishedDate.localeCompare(a.publishedDate),
      );
  }
}

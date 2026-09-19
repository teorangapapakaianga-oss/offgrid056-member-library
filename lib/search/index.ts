/**
 * Library search (docs/ARCHITECTURE.md §9): MiniSearch with prefix + fuzzy matching, field weights,
 * and a synonym map so NZ/AU and US/CA spellings find each other.
 */
import MiniSearch from "minisearch";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getFoundation, getResourceType } from "@/lib/content/taxonomy";

/** Each group is a set of interchangeable spellings/terms across the four markets. */
const SYNONYM_GROUPS: string[][] = [
  ["mould", "mold"],
  ["colour", "color"],
  ["programme", "program"],
  ["fibre", "fiber"],
  ["storey", "story"],
  ["metre", "meter"],
  ["litre", "liter", "litres", "liters"],
  ["centre", "center"],
  ["tyre", "tire"],
  ["aluminium", "aluminum"],
  ["draught", "draft", "draughts", "drafts"],
  ["torch", "flashlight", "torches", "flashlights"],
  ["gas bottle", "propane tank", "lpg"],
  ["power cut", "outage", "blackout"],
];

const synonymIndex = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) for (const term of group) synonymIndex.set(term, group);

/** Expand a query so "mold" also searches "mould", etc. */
export function expandQuery(q: string): string {
  const lower = q.toLowerCase();
  const extra = new Set<string>();
  for (const [term, group] of synonymIndex) {
    if (new RegExp(`\\b${term}\\b`).test(lower)) for (const alt of group) if (alt !== term) extra.add(alt);
  }
  return extra.size ? `${q} ${[...extra].join(" ")}` : q;
}

interface Doc {
  id: string;
  title: string;
  description: string;
  tags: string;
  category: string;
  foundation: string;
  type: string;
}

export function createSearch(items: ResourceSummary[]) {
  const ms = new MiniSearch<Doc>({
    fields: ["title", "tags", "category", "foundation", "type", "description"],
    storeFields: ["id"],
    searchOptions: {
      boost: { title: 5, tags: 3, category: 2, foundation: 2, type: 2, description: 1 },
      prefix: true,
      fuzzy: (term) => (term.length > 4 ? 0.2 : false),
      combineWith: "OR",
    },
  });
  ms.addAll(
    items.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description.replace(/^DEMONSTRATION ENTRY:\s*/, ""),
      tags: r.tags.join(" "),
      category: r.categoryName,
      foundation: getFoundation(r.foundation).name,
      type: `${getResourceType(r.resourceType).label} ${getResourceType(r.resourceType).plural}`,
    })),
  );

  /** Returns matching ids in relevance order; empty query → null (no search applied). */
  return function search(q: string): string[] | null {
    const query = q.trim();
    if (!query) return null;
    const expanded = expandQuery(query);
    // Every word the member typed must match something (AND); synonyms only widen each word.
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = ms.search(expanded);
    if (words.length <= 1) return hits.map((h) => h.id as string);
    const strict = new Set(ms.search(query, { combineWith: "AND" }).map((h) => h.id as string));
    const ordered = hits.map((h) => h.id as string);
    const andFirst = ordered.filter((id) => strict.has(id));
    return andFirst.length ? andFirst : ordered;
  };
}

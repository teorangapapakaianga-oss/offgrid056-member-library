/**
 * Related resources and the recommended next resource (Stage 5).
 *
 * Reusable for the real library: manual links first, then the same category, the same learning path, shared tags
 * and finally the same foundation. A resource never links to itself, never links to an id the library does not
 * have, and never repeats a link, so no combination of data can produce a circular or broken suggestion.
 */
import type { ResourceSummary } from "@/lib/content/summaries";

export interface RelatedReason {
  resource: ResourceSummary;
  reason: "Linked by us" | "Same topic" | "Same learning path" | "Similar tags" | "Same foundation";
}

export interface RelatedInput {
  /** the resource we are showing */
  current: { id: string; foundation: string; category: string; tags: string[]; learningPath?: string; relatedResources: string[] };
  /** every published resource (unknown ids simply never match) */
  all: ResourceSummary[];
  limit?: number;
}

export function relatedResources({ current, all, limit = 6 }: RelatedInput): RelatedReason[] {
  const pool = all.filter((r) => r.id !== current.id);
  const byId = new Map(pool.map((r) => [r.id, r]));
  const picked = new Map<string, RelatedReason>();

  const add = (r: ResourceSummary | undefined, reason: RelatedReason["reason"]) => {
    if (!r || picked.has(r.id) || picked.size >= limit) return;
    picked.set(r.id, { resource: r, reason });
  };

  // 1. Manually chosen links, in the order the author wrote them (unknown ids are skipped, never rendered).
  for (const id of current.relatedResources) add(byId.get(id), "Linked by us");

  // 2. Same category, 3. same learning path, 4. shared tags (most tags in common first), 5. same foundation.
  const sameCategory = pool.filter((r) => r.foundation === current.foundation && r.category === current.category);
  for (const r of sameCategory) add(r, "Same topic");

  if (current.learningPath) {
    for (const r of pool.filter((r) => r.foundation === current.foundation)) add(r, "Same learning path");
  }

  const tags = new Set(current.tags.map((t) => t.toLowerCase()));
  if (tags.size) {
    const scored = pool
      .map((r) => ({ r, score: r.tags.filter((t) => tags.has(t.toLowerCase())).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.r.title.localeCompare(b.r.title));
    for (const { r } of scored) add(r, "Similar tags");
  }

  for (const r of pool.filter((r) => r.foundation === current.foundation)) add(r, "Same foundation");

  return [...picked.values()].slice(0, limit);
}

/**
 * The single "next" suggestion under a resource: the next step of its learning path when it has one, otherwise
 * the closest related resource the member has not completed.
 */
export function recommendedNext(
  current: { id: string; learningPath?: string },
  related: RelatedReason[],
  pathSteps: string[],
  all: ResourceSummary[],
  completed: ReadonlySet<string>,
): { resource: ResourceSummary; reason: string } | null {
  const byId = new Map(all.map((r) => [r.id, r]));
  if (current.learningPath && pathSteps.length) {
    const index = pathSteps.indexOf(current.id);
    for (const id of pathSteps.slice(index + 1)) {
      const r = byId.get(id);
      if (r && !completed.has(r.id)) return { resource: r, reason: "Next step in this learning path" };
    }
  }
  const open = related.find((x) => !completed.has(x.resource.id));
  return open ? { resource: open.resource, reason: open.reason } : null;
}

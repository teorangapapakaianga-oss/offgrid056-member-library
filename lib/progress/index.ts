/**
 * Progress and recommendations: pure functions of (content, member state). Nothing derived is stored
 * (docs/ARCHITECTURE.md §10).
 */
import type { FoundationId } from "@/lib/content/schemas";
import type { ResourceSummary } from "@/lib/content/summaries";

const DIFFICULTY_RANK = { beginner: 0, intermediate: 1, advanced: 2 } as const;

export interface FoundationProgress {
  foundation: FoundationId;
  completed: number;
  total: number;
  percent: number;
  assessment: "not-started" | "done" | "none";
  next: ResourceSummary | null;
}

export function foundationProgress(
  items: ResourceSummary[],
  foundation: FoundationId,
  completed: ReadonlySet<string>,
  pathSteps: string[] = [],
): FoundationProgress {
  const mine = items.filter((r) => r.foundation === foundation && r.completionAvailable);
  const done = mine.filter((r) => completed.has(r.id)).length;
  const assessments = mine.filter((r) => r.resourceType === "assessment");
  return {
    foundation,
    completed: done,
    total: mine.length,
    percent: mine.length ? Math.round((done / mine.length) * 100) : 0,
    assessment: !assessments.length ? "none" : assessments.some((a) => completed.has(a.id)) ? "done" : "not-started",
    next: nextRecommended(mine, completed, pathSteps),
  };
}

/** First incomplete learning-path step → incomplete featured → easiest, shortest incomplete. */
export function nextRecommended(items: ResourceSummary[], completed: ReadonlySet<string>, pathSteps: string[] = []): ResourceSummary | null {
  const open = items.filter((r) => r.completionAvailable && !completed.has(r.id));
  if (!open.length) return null;
  const byId = new Map(open.map((r) => [r.id, r]));
  for (const id of pathSteps) if (byId.has(id)) return byId.get(id)!;
  const featured = open.find((r) => r.featured);
  if (featured) return featured;
  return [...open].sort(
    (a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty] || a.estimatedTime - b.estimatedTime,
  )[0];
}

export function overallProgress(items: ResourceSummary[], completed: ReadonlySet<string>) {
  const total = items.filter((r) => r.completionAvailable).length;
  const done = items.filter((r) => r.completionAvailable && completed.has(r.id)).length;
  return { completed: done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

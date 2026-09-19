"use client";
import type { FoundationId } from "@/lib/content/schemas";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getFoundation } from "@/lib/content/taxonomy";
import { useMemberState } from "@/lib/member";
import { foundationProgress } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/progress-bar";

/** Compact progress line for one foundation (foundation cards and foundation page headers). */
export function FoundationProgressBadge({ foundation, items }: { foundation: FoundationId; items: ResourceSummary[] }) {
  const { ready, completedIds } = useMemberState();
  const p = foundationProgress(items, foundation, completedIds);
  return (
    <div className="min-w-48">
      <div className="mb-1 flex justify-between text-xs text-og-taupe">
        <span>Your progress</span>
        <span className="font-semibold text-og-charcoal">{ready ? `${p.completed}/${p.total} · ${p.percent}%` : "…"}</span>
      </div>
      <ProgressBar value={ready ? p.percent : 0} label={`${getFoundation(foundation).name} progress`} />
    </div>
  );
}

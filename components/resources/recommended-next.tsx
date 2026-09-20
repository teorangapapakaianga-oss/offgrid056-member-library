"use client";
import Link from "next/link";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getFoundation, getResourceType } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";
import { useMemberState } from "@/lib/member";
import { recommendedNext, type RelatedReason } from "@/lib/related";
import { Icon } from "@/components/ui/icon";

/** "Recommended next" under a resource: the next path step, or the closest related resource not yet completed. */
export function RecommendedNext({
  current,
  related,
  pathSteps,
  all,
}: {
  current: { id: string; learningPath?: string };
  related: RelatedReason[];
  pathSteps: string[];
  all: ResourceSummary[];
}) {
  const { ready, completedIds } = useMemberState();
  const next = recommendedNext(current, related, pathSteps, all, completedIds);
  if (!ready || !next) return null;

  return (
    <section aria-labelledby="recommended-next" className="mt-10 rounded-xl bg-og-charcoal p-5 text-og-white ring-1 ring-og-line on-dark sm:p-6">
      <h2 id="recommended-next" className="font-display text-2xl leading-none">
        Recommended next
      </h2>
      <p className="mt-1 text-sm text-og-white/70">{next.reason}</p>
      <Link
        href={`/resources/${next.resource.slug}/`}
        className="mt-4 flex items-center gap-3 rounded-lg bg-og-graphite p-4 transition hover:brightness-110"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
        <img src={getFoundation(next.resource.foundation).icon} alt="" width={40} height={40} className="size-10 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{next.resource.title}</span>
          <span className="block text-xs text-og-white/70">
            {getResourceType(next.resource.resourceType).label} · {formatMinutes(next.resource.estimatedTime)}
          </span>
        </span>
        <Icon name="arrowRight" className="size-5 shrink-0 text-og-green" />
      </Link>
    </section>
  );
}

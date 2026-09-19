"use client";
import Link from "next/link";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getFoundation, getResourceType } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";
import { FOUNDATION_STYLES } from "@/lib/foundation-style";

/** Compact row for dashboard lists (recently viewed, saved, next steps). */
export function ResourceListItem({ resource: r, meta }: { resource: ResourceSummary; meta?: string }) {
  const s = FOUNDATION_STYLES[r.foundation];
  return (
    <Link
      href={`/resources/${r.slug}/`}
      className="flex min-h-14 items-center gap-3 rounded-lg p-2 transition hover:bg-og-white"
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-md ${s.surface} ${s.ring}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
        <img src={getFoundation(r.foundation).icon} alt="" width={28} height={28} className="size-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-og-charcoal">{r.title}</span>
        <span className="block truncate text-xs text-og-taupe">
          {getResourceType(r.resourceType).label} · {getFoundation(r.foundation).name} · {meta ?? formatMinutes(r.estimatedTime)}
        </span>
      </span>
    </Link>
  );
}

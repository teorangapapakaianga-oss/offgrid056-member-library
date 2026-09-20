"use client";
import Link from "next/link";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getResourceType } from "@/lib/content/taxonomy";
import { formatMinutes, isNewResource } from "@/lib/format";
import { useNow } from "@/lib/hooks/use-now";
import { useMemberState } from "@/lib/member";
import { SaveButton } from "@/components/member/member-actions";
import { Icon } from "@/components/ui/icon";
import { DemoBadge, DifficultyBadge, FeaturedBadge, FoundationBadge, NewBadge, ResourceTypeBadge } from "./badges";
import { PlaceholderThumbnail } from "./placeholder-thumbnail";

/**
 * Resource card. One link per card (the title), stretched over the whole card, so screen readers hear one
 * clear link and keyboard users get one tab stop. The "Open resource" button is its visual affordance.
 */
export function ResourceCard({ resource: r, headingLevel = 3 }: { resource: ResourceSummary; headingLevel?: 2 | 3 | 4 }) {
  const now = useNow();
  const { completedIds } = useMemberState();
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const completed = completedIds.has(r.id);
  const href = `/resources/${r.slug}/`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-og-line transition focus-within:ring-2 focus-within:ring-og-deep hover:shadow-md">
      <div className="relative">
        {r.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export: images are pre-sized at import
          <img src={r.thumbnail.src} alt={r.thumbnail.alt} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
        ) : (
          <PlaceholderThumbnail foundation={r.foundation} type={r.resourceType} />
        )}
        <div className="absolute top-2 right-2">
          <SaveButton resourceId={r.id} title={r.title} compact />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <FoundationBadge foundation={r.foundation} />
          <ResourceTypeBadge type={r.resourceType} />
          {now && isNewResource(r, now) && <NewBadge />}
          {r.featured && <FeaturedBadge />}
          {r.isPlaceholder && <DemoBadge />}
        </div>

        <Heading className="text-base leading-snug font-semibold text-og-charcoal">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {r.title}
          </Link>
        </Heading>

        <p className="line-clamp-3 text-sm leading-relaxed text-og-graphite/90">{r.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-og-taupe">
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="size-4" />
            <span className="sr-only">Estimated time: </span>
            {formatMinutes(r.estimatedTime)}
          </span>
          <DifficultyBadge difficulty={r.difficulty} />
          {r.downloadable && (
            <span className="inline-flex items-center gap-1">
              <Icon name="download" className="size-4" />
              Download
            </span>
          )}
          {completed && (
            <span className="inline-flex items-center gap-1 font-semibold text-og-deep">
              <Icon name="check" className="size-4" />
              Completed
            </span>
          )}
        </div>

        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-og-charcoal px-4 py-2.5 text-sm font-semibold text-og-white transition group-hover:bg-og-deep"
        >
          {getResourceType(r.resourceType).action}
          <Icon name="arrowRight" className="size-4" />
        </span>
      </div>
    </article>
  );
}

export function ResourceGrid({ items, headingLevel = 3 }: { items: ResourceSummary[]; headingLevel?: 2 | 3 | 4 }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((r) => (
        <li key={r.id}>
          <ResourceCard resource={r} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

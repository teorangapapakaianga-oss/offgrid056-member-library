import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DemoBadge, DifficultyBadge, FeaturedBadge, FoundationBadge, ResourceTypeBadge } from "@/components/resources/badges";
import { PlaceholderThumbnail } from "@/components/resources/placeholder-thumbnail";
import { ResourceGrid } from "@/components/resources/resource-card";
import { Icon } from "@/components/ui/icon";
import { getResourceBySlug, getResources, getSummaries } from "@/lib/content/repository";
import { getCategory, getFoundation } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return getResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const r = getResourceBySlug((await params).slug);
  return { title: r?.title ?? "Resource", description: r?.description };
}

/**
 * STAGE 3: layout and content of the detail view. Stage 4 adds Save and Mark complete; Stage 5 adds the
 * resource viewer, Open/Download, video support and recommended-next logic.
 */
export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const r = getResourceBySlug((await params).slug);
  if (!r) notFound();
  const f = getFoundation(r.foundation);
  const c = getCategory(r.foundation, r.category);
  const related = getSummaries((x) => r.relatedResources.includes(x.id));
  const trail =
    r.foundation === "general"
      ? [{ label: "All Resources", href: "/library/" }]
      : [
          { label: f.name, href: `/foundations/${f.id}/` },
          ...(c ? [{ label: c.name, href: `/foundations/${f.id}/${c.slug}/` }] : []),
        ];

  return (
    <>
      <Breadcrumbs items={[...trail, { label: r.title }]} />
      {r.isPlaceholder && (
        <p className="mb-5 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
          <span>
            <strong>Demonstration content.</strong> This is a placeholder used to build the library. The final OffGrid056 resource will replace it.
          </span>
        </p>
      )}
      <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <FoundationBadge foundation={r.foundation} />
            <ResourceTypeBadge type={r.resourceType} />
            {r.featured && <FeaturedBadge />}
            {r.isPlaceholder && <DemoBadge />}
          </div>
          <h1 className="font-display text-4xl leading-none text-og-charcoal sm:text-5xl">{r.title}</h1>
          <p className="mt-3 text-lg text-og-graphite/90">{r.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-og-taupe">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" className="size-4" />
              <span className="sr-only">Estimated time: </span>
              {formatMinutes(r.estimatedTime)}
            </span>
            <DifficultyBadge difficulty={r.difficulty} />
          </div>
          <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-og-line">
            {r.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element -- static export
              <img src={r.thumbnail.src} alt={r.thumbnail.alt} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <PlaceholderThumbnail foundation={r.foundation} type={r.resourceType} size="hero" />
            )}
          </div>
          {r.summary && <p className="mt-6 max-w-prose leading-relaxed text-og-graphite">{r.summary}</p>}
        </div>

        <aside className="flex flex-col gap-4">
          {r.learningObjectives.length > 0 && (
            <section aria-labelledby="objectives" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
              <h2 id="objectives" className="font-display mb-3 text-2xl leading-none">
                What you will learn
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                {r.learningObjectives.map((o) => (
                  <li key={o} className="flex gap-2">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-og-deep" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className="rounded-xl border border-dashed border-og-taupe/50 p-4 text-sm text-og-taupe">
            Open / Download, Save and Mark complete are added in Stages 4–5.
          </p>
        </aside>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-12">
          <h2 id="related" className="font-display mb-4 text-3xl leading-none">
            Related resources
          </h2>
          <ResourceGrid items={related} headingLevel={3} />
        </section>
      )}
    </>
  );
}

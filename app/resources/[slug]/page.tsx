import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CompletionButton, RecordView, SaveButton, StorageNotice } from "@/components/member/member-actions";
import { DemoBadge, DifficultyBadge, FeaturedBadge, FoundationBadge, ResourceTypeBadge } from "@/components/resources/badges";
import { DownloadActions } from "@/components/resources/download-actions";
import { LearningPathStrip } from "@/components/resources/learning-path-views";
import { PlaceholderThumbnail } from "@/components/resources/placeholder-thumbnail";
import { RecommendedNext } from "@/components/resources/recommended-next";
import { ResourceCard } from "@/components/resources/resource-card";
import { VideoEmbed } from "@/components/resources/video-embed";
import { Icon } from "@/components/ui/icon";
import { fileSizeBytes, getResourceBySlug, getResources, getSummaries, loadLearningPaths } from "@/lib/content/repository";
import { getCategory, getFoundation, getResourceType } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";
import { formatDate } from "@/lib/format-bytes";
import { relatedResources } from "@/lib/related";

export const dynamicParams = false;

export function generateStaticParams() {
  return getResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const r = getResourceBySlug((await params).slug);
  return { title: r?.title ?? "Resource", description: r?.description };
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const r = getResourceBySlug((await params).slug);
  if (!r) notFound();

  const all = getSummaries();
  const f = getFoundation(r.foundation);
  const c = getCategory(r.foundation, r.category);
  const type = getResourceType(r.resourceType);
  const related = relatedResources({ current: r, all });
  const path = r.learningPath ? loadLearningPaths().find((p) => p.id === r.learningPath) : undefined;
  const pathSteps = path ? path.steps.map((id) => all.find((x) => x.id === id)).filter((x) => x !== undefined) : [];
  const packItems = r.packItems ? all.filter((x) => r.packItems!.includes(x.id)) : [];

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
      <RecordView resourceId={r.id} />
      <StorageNotice />
      {r.isPlaceholder && (
        <p className="mb-5 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
          <span>
            <strong>Demonstration content.</strong> This is a placeholder used to build the library, and the file attached to it is a
            placeholder too. The final OffGrid056 resource will replace both.
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

          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-og-taupe">
            <div className="inline-flex items-center gap-1.5">
              <dt className="sr-only">Estimated time</dt>
              <Icon name="clock" className="size-4" />
              <dd>{formatMinutes(r.estimatedTime)}</dd>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <dt className="sr-only">Difficulty</dt>
              <dd>
                <DifficultyBadge difficulty={r.difficulty} />
              </dd>
            </div>
            {c && (
              <div className="inline-flex items-center gap-1.5">
                <dt className="sr-only">Topic</dt>
                {/* "General" has no foundation page, so its topic is shown as plain text. */}
                <dd>
                  {r.foundation === "general" ? (
                    <span>{c.name}</span>
                  ) : (
                    <Link href={`/foundations/${f.id}/${c.slug}/`} className="inline-flex min-h-6 items-center font-semibold text-og-deep underline-offset-2 hover:underline">
                      {c.name}
                    </Link>
                  )}
                </dd>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5">
              <dt className="sr-only">Updated</dt>
              <dd>Updated {formatDate(r.updatedDate ?? r.publishedDate)}</dd>
            </div>
          </dl>

          <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-og-line">
            {r.videoUrl ? (
              <VideoEmbed url={r.videoUrl} title={r.title} />
            ) : r.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element -- static export
              <img src={r.thumbnail.src} alt={r.thumbnail.alt} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <PlaceholderThumbnail foundation={r.foundation} type={r.resourceType} size="hero" />
            )}
          </div>

          {r.summary && <p className="mt-6 max-w-prose leading-relaxed text-og-graphite">{r.summary}</p>}

          {packItems.length > 0 && (
            <section aria-labelledby="pack-contents" className="mt-8 rounded-xl bg-white p-5 ring-1 ring-og-line">
              <h2 id="pack-contents" className="font-display text-2xl leading-none text-og-charcoal">
                What is in this pack
              </h2>
              <ul role="list" className="mt-3 flex flex-col gap-2 text-sm">
                {packItems.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <Icon name="check" className="size-4 shrink-0 text-og-deep" />
                    <Link href={`/resources/${p.slug}/`} className="font-semibold text-og-deep underline-offset-2 hover:underline">
                      {p.title}
                    </Link>
                    <span className="text-og-taupe">· {getResourceType(p.resourceType).label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          {r.fileUrl && (
            <section aria-labelledby="get-this" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
              <h2 id="get-this" className="font-display mb-3 text-2xl leading-none text-og-charcoal">
                Get this {type.label.toLowerCase()}
              </h2>
              <DownloadActions
                file={{
                  fileUrl: r.fileUrl,
                  format: r.fileFormat ?? "FILE",
                  sizeBytes: fileSizeBytes(r.fileUrl, r.fileSizeBytes),
                  updatedDate: r.updatedDate ?? r.publishedDate,
                  title: r.title,
                  openable: r.fileFormat === "PDF" || r.fileFormat === "PNG",
                }}
              />
            </section>
          )}

          {r.externalUrl && (
            <a
              href={r.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep"
            >
              Open on the provider&apos;s site
              <Icon name="arrowRight" className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}

          <div className="flex flex-col gap-3 rounded-xl bg-white p-5 ring-1 ring-og-line">
            <CompletionButton resourceId={r.id} disabled={!r.completionAvailable} />
            <SaveButton resourceId={r.id} title={r.title} />
            <p className="text-xs text-og-taupe">
              Your progress is kept in this browser. Back it up from{" "}
              <Link href="/progress/" className="font-semibold text-og-deep underline underline-offset-2">
                My Progress
              </Link>
              .
            </p>
          </div>

          {path && pathSteps.length > 0 && <LearningPathStrip path={path} steps={pathSteps} currentId={r.id} />}

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
        </aside>
      </article>

      <RecommendedNext current={r} related={related} pathSteps={path?.steps ?? []} all={all} />

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-10">
          <h2 id="related" className="font-display mb-4 text-3xl leading-none">
            Related resources
          </h2>
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map(({ resource, reason }) => (
              <li key={resource.id} className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-og-taupe">{reason}</p>
                <ResourceCard resource={resource} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

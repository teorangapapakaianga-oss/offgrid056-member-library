import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { WorkshopStatus, WorkshopWhen } from "@/components/directory/workshop-views";
import { DownloadActions } from "@/components/resources/download-actions";
import { ResourceGrid } from "@/components/resources/resource-card";
import { VideoEmbed } from "@/components/resources/video-embed";
import { Icon } from "@/components/ui/icon";
import { fileSizeBytes, getResourceById, getSummaries, getWorkshopBySlug, getWorkshops } from "@/lib/content/repository";
import { getFoundation } from "@/lib/content/taxonomy";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWorkshops().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/workshops/[slug]">): Promise<Metadata> {
  const w = getWorkshopBySlug((await params).slug);
  return { title: w?.title ?? "Workshop", description: w?.description };
}

export default async function WorkshopPage({ params }: PageProps<"/workshops/[slug]">) {
  const w = getWorkshopBySlug((await params).slug);
  if (!w) notFound();
  const related = getSummaries((r) => w.relatedResources.includes(r.id));
  const handouts = w.downloads
    .map((d) => {
      const r = d.resourceId ? getResourceById(d.resourceId) : undefined;
      const url = r?.fileUrl ?? d.fileUrl;
      if (!url) return null;
      return {
        label: d.label,
        title: r?.title ?? d.label,
        slug: r?.slug,
        file: {
          fileUrl: url,
          format: r?.fileFormat ?? "PDF",
          sizeBytes: fileSizeBytes(url, r?.fileSizeBytes),
          updatedDate: r?.updatedDate ?? r?.publishedDate ?? w.startDate.slice(0, 10),
          title: r?.title ?? d.label,
          openable: (r?.fileFormat ?? "PDF") === "PDF",
        },
      };
    })
    .filter((h) => h !== null);

  return (
    <>
      <Breadcrumbs items={[{ label: "Workshops & Events", href: "/workshops/" }, { label: w.title }]} />
      {w.isDemo && (
        <p className="mb-5 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
          <span>
            <strong>Demonstration content.</strong> This is an example workshop listing. No workshop is scheduled, and no booking is
            available.
          </span>
        </p>
      )}
      <PageHeader eyebrow="Workshop" title={w.title} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          {w.videoUrl && (
            <div className="mb-6 overflow-hidden rounded-xl ring-1 ring-og-line">
              <VideoEmbed url={w.videoUrl} title={`${w.title} recording`} />
            </div>
          )}
          <p className="max-w-prose leading-relaxed text-og-graphite">{w.description}</p>

          {handouts.length > 0 && (
            <section aria-labelledby="handouts" className="mt-8">
              <h2 id="handouts" className="font-display mb-3 text-2xl leading-none text-og-charcoal">
                Handouts
              </h2>
              <ul role="list" className="flex flex-col gap-3">
                {handouts.map((h) => (
                  <li key={h.label} className="flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-og-line sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-og-charcoal">{h.title}</p>
                      {h.slug && (
                        <Link href={`/resources/${h.slug}/`} className="text-xs font-semibold text-og-deep underline-offset-2 hover:underline">
                          Open the resource page
                        </Link>
                      )}
                    </div>
                    <DownloadActions file={h.file} compact />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <section aria-labelledby="details" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
            <h2 id="details" className="font-display mb-3 text-2xl leading-none text-og-charcoal">
              Details
            </h2>
            <WorkshopStatus workshop={w} />
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-og-taupe">When</dt>
                <dd className="text-og-charcoal">
                  <WorkshopWhen workshop={w} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-og-taupe">Where</dt>
                <dd className="text-og-charcoal">{w.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-og-taupe">Format</dt>
                <dd className="text-og-charcoal">
                  {w.mode === "online" ? "Online" : w.mode === "in-person" ? "In person" : "Online and in person"}
                </dd>
              </div>
              {w.foundations.length > 0 && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-og-taupe">Foundations</dt>
                  <dd className="text-og-charcoal">{w.foundations.map((f) => getFoundation(f).name).join(" · ")}</dd>
                </div>
              )}
            </dl>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="workshop-related" className="mt-10">
          <h2 id="workshop-related" className="font-display mb-4 text-3xl leading-none">
            Related resources
          </h2>
          <ResourceGrid items={related} headingLevel={3} />
        </section>
      )}
    </>
  );
}

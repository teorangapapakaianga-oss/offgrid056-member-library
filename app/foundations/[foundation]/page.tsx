import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { FoundationProgressBadge } from "@/components/member/foundation-progress";
import { LibrarySection } from "@/components/resources/library-section";
import { Icon } from "@/components/ui/icon";
import { getSummaries } from "@/lib/content/repository";
import { FIVE_FOUNDATIONS, type FiveFoundationId } from "@/lib/content/schemas";
import { getFoundation, inCategory } from "@/lib/content/taxonomy";

export const dynamicParams = false;

export function generateStaticParams() {
  return FIVE_FOUNDATIONS.map((foundation) => ({ foundation }));
}

function resolve(id: string) {
  return (FIVE_FOUNDATIONS as readonly string[]).includes(id) ? getFoundation(id as FiveFoundationId) : null;
}

export async function generateMetadata({ params }: PageProps<"/foundations/[foundation]">): Promise<Metadata> {
  const f = resolve((await params).foundation);
  return { title: f ? `${f.name} Foundation` : "Foundation" };
}

export default async function FoundationPage({ params }: PageProps<"/foundations/[foundation]">) {
  const f = resolve((await params).foundation);
  if (!f) notFound();
  const items = getSummaries((r) => r.foundation === f.id);

  return (
    <>
      <Breadcrumbs items={[{ label: "Five Foundations", href: "/foundations/" }, { label: f.name }]} />
      <PageHeader eyebrow="Foundation" title={f.name} description={f.description} icon={f.icon}>
        <FoundationProgressBadge foundation={f.id} items={items} />
      </PageHeader>

      <section aria-labelledby="topics" className="mb-10">
        <h2 id="topics" className="font-display mb-4 text-3xl leading-none text-og-charcoal">
          Topics
        </h2>
        <ul role="list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {f.categories.map((c) => {
            const n = items.filter((r) => inCategory(r, f.id, c)).length;
            return (
              <li key={c.slug}>
                <Link
                  href={`/foundations/${f.id}/${c.slug}/`}
                  className="flex h-full items-start justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-og-line transition hover:shadow-md"
                >
                  <span>
                    <span className="block font-semibold text-og-charcoal">{c.name}</span>
                    <span className="mt-1 block text-sm text-og-taupe">{c.description}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-og-deep">
                    {n} {n === 1 ? "resource" : "resources"}
                    <Icon name="chevronRight" className="size-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="all-resources">
        <h2 id="all-resources" className="font-display mb-4 text-3xl leading-none text-og-charcoal">
          All {f.name} resources
        </h2>
        <LibrarySection items={items} hideGroups={["foundation"]} searchLabel={`Search ${f.name}`} />
      </section>
    </>
  );
}

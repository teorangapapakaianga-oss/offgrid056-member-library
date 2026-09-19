import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { LibrarySection } from "@/components/resources/library-section";
import { getSummaries } from "@/lib/content/repository";
import { FIVE_FOUNDATIONS, type FiveFoundationId } from "@/lib/content/schemas";
import { getCategory, getFoundation, inCategory } from "@/lib/content/taxonomy";

export const dynamicParams = false;

export function generateStaticParams() {
  return FIVE_FOUNDATIONS.flatMap((foundation) =>
    getFoundation(foundation).categories.map((c) => ({ foundation, category: c.slug })),
  );
}

function resolve(foundation: string, category: string) {
  if (!(FIVE_FOUNDATIONS as readonly string[]).includes(foundation)) return null;
  const f = getFoundation(foundation as FiveFoundationId);
  const c = getCategory(f.id, category);
  return c ? { f, c } : null;
}

export async function generateMetadata({ params }: PageProps<"/foundations/[foundation]/[category]">): Promise<Metadata> {
  const { foundation, category } = await params;
  const hit = resolve(foundation, category);
  return { title: hit ? `${hit.c.name} · ${hit.f.name}` : "Topic" };
}

export default async function CategoryPage({ params }: PageProps<"/foundations/[foundation]/[category]">) {
  const { foundation, category } = await params;
  const hit = resolve(foundation, category);
  if (!hit) notFound();
  const { f, c } = hit;
  const items = getSummaries((r) => inCategory(r, f.id, c));

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Five Foundations", href: "/foundations/" },
          { label: f.name, href: `/foundations/${f.id}/` },
          { label: c.name },
        ]}
      />
      <PageHeader eyebrow={`${f.name} foundation`} title={c.name} description={c.description} icon={f.icon} />
      <LibrarySection
        items={items}
        hideGroups={c.matchTypes ? ["foundation", "type"] : ["foundation"]}
        searchLabel={`Search ${c.name}`}
        emptyTitle={`No ${c.name} resources yet`}
        emptyText={`Resources for ${c.name} will be added as the library grows. In the meantime, explore the rest of ${f.name}.`}
      />
    </>
  );
}

import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import type { ResourceSummary } from "@/lib/content/summaries";
import type { FilterGroup } from "@/lib/filters";
import { LibrarySection } from "./library-section";

/** A library section defined by a rule over the resource data (Planning Tools, Packs, Videos, Downloads…). */
export function CollectionPage({
  title,
  eyebrow,
  description,
  items,
  hideGroups,
  emptyTitle,
  emptyText,
  children,
}: {
  title: string;
  eyebrow: string;
  description: ReactNode;
  items: ResourceSummary[];
  hideGroups?: FilterGroup[];
  emptyTitle?: string;
  emptyText?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      {children}
      <LibrarySection items={items} hideGroups={hideGroups} searchLabel={`Search ${title}`} emptyTitle={emptyTitle} emptyText={emptyText} />
    </>
  );
}

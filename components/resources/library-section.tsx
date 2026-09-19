import { Suspense } from "react";
import type { ResourceSummary } from "@/lib/content/summaries";
import type { FilterGroup } from "@/lib/filters";
import { sortResources } from "@/lib/filters";
import { EmptyState } from "@/components/ui/empty-state";
import { LibraryBrowser } from "./library-browser";
import { ResourceGrid } from "./resource-card";

/**
 * Server wrapper: the static HTML carries the full, unfiltered grid (useful before JavaScript loads);
 * the interactive browser takes over in the browser once the URL query string is known.
 */
export function LibrarySection({
  items,
  hideGroups,
  searchLabel,
  emptyTitle = "No resources here yet",
  emptyText = "Resources for this section will be added as the library grows.",
}: {
  items: ResourceSummary[];
  hideGroups?: FilterGroup[];
  searchLabel?: string;
  emptyTitle?: string;
  emptyText?: string;
}) {
  if (!items.length) {
    return (
      <EmptyState icon="library" title={emptyTitle} action={{ href: "/library/", label: "Browse all resources" }}>
        {emptyText}
      </EmptyState>
    );
  }
  return (
    <Suspense fallback={<ResourceGrid items={sortResources(items, "recommended")} headingLevel={2} />}>
      <LibraryBrowser items={items} hideGroups={hideGroups} searchLabel={searchLabel} />
    </Suspense>
  );
}

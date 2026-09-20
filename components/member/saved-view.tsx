"use client";
import type { ResourceSummary } from "@/lib/content/summaries";
import { useMemberState } from "@/lib/member";
import { ResourceGrid } from "@/components/resources/resource-card";
import { EmptyState } from "@/components/ui/empty-state";

export function SavedView({ items }: { items: ResourceSummary[] }) {
  const { ready, state } = useMemberState();
  const byId = new Map(items.map((r) => [r.id, r]));
  const saved = Object.entries(state.saved)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .map(([id]) => byId.get(id))
    .filter((r): r is ResourceSummary => Boolean(r));

  if (!ready) {
    return (
      <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-white" />
        ))}
      </div>
    );
  }

  if (!saved.length) {
    return (
      <EmptyState icon="saved" title="No saved resources yet" action={{ href: "/library/", label: "Browse the library" }}>
        Use the bookmark button on any resource card, or “Save this resource” on a resource page, and it will appear
        here on this device.
      </EmptyState>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-og-taupe" role="status">
        {saved.length} saved {saved.length === 1 ? "resource" : "resources"}, newest first
      </p>
      <ResourceGrid items={saved} headingLevel={2} />
    </>
  );
}

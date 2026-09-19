import type { Metadata } from "next";
import { CollectionPage } from "@/components/resources/collection-page";
import { getSummaries } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Resource Packs" };

export default function PacksPage() {
  return (
    <CollectionPage
      title="Resource Packs"
      eyebrow="Bundles"
      description="Related resources bundled together, so you can get everything for a topic at once."
      items={getSummaries((r) => r.resourceType === "download-pack")}
      hideGroups={["type"]} emptyTitle="No resource packs yet" emptyText="Packs will be added as the library grows."
    />
  );
}

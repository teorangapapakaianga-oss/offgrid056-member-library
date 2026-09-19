import type { Metadata } from "next";
import { CollectionPage } from "@/components/resources/collection-page";
import { getSummaries } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Videos & Tutorials" };

export default function VideosPage() {
  return (
    <CollectionPage
      title="Videos & Tutorials"
      eyebrow="Watch and learn"
      description="Short videos and step-by-step tutorials."
      items={getSummaries((r) => r.resourceType === "video" || r.resourceType === "tutorial" || Boolean(r.videoUrl))}
      hideGroups={[]} emptyTitle="No videos yet" emptyText="Videos and tutorials will be added as the library grows."
    />
  );
}

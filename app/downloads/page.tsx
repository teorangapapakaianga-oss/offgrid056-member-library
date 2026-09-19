import type { Metadata } from "next";
import { CollectionPage } from "@/components/resources/collection-page";
import { getSummaries } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Member Downloads" };

export default function DownloadsPage() {
  return (
    <CollectionPage
      title="Member Downloads"
      eyebrow="Download centre"
      description="Every downloadable guide, workbook, planner, checklist, assessment, worksheet and pack in one place."
      items={getSummaries((r) => r.downloadable)}
      hideGroups={[]} emptyTitle="No downloads yet" emptyText="V1 demo entries have no files yet. The download centre (format, file size, updated date, download button) is completed in Stage 5."
    />
  );
}

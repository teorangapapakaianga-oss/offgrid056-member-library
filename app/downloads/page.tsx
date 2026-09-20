import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DownloadCentre } from "@/components/resources/download-centre";
import { getDownloads } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Member Downloads" };

export default function DownloadsPage() {
  const downloads = getDownloads();
  return (
    <>
      <Breadcrumbs items={[{ label: "Member Downloads" }]} />
      <PageHeader
        eyebrow="Download centre"
        title="Member Downloads"
        description="Every downloadable guide, workbook, planner, checklist, assessment, worksheet and pack in one place. Files open in your browser or save to your device; nothing downloads until you choose it."
      />
      <DownloadCentre downloads={downloads} />
    </>
  );
}

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { LibrarySection } from "@/components/resources/library-section";
import { getSummaries } from "@/lib/content/repository";

export const metadata: Metadata = { title: "All Resources" };

export default function LibraryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "All Resources" }]} />
      <PageHeader
        eyebrow="Resource library"
        title="All resources"
        description="Search and filter every resource across the Five Foundations."
      />
      <LibrarySection items={getSummaries()} />
    </>
  );
}

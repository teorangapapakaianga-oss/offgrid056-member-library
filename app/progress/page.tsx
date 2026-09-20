import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { StorageNotice } from "@/components/member/member-actions";
import { ProgressView } from "@/components/member/progress-view";
import { getSummaries, loadLearningPaths } from "@/lib/content/repository";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  const paths = loadLearningPaths().map((p) => ({ id: p.id, foundation: p.foundation, steps: p.steps }));
  return (
    <>
      <Breadcrumbs items={[{ label: "My Progress" }]} />
      <StorageNotice />
      <PageHeader
        eyebrow="My library"
        title="My progress"
        description="Where you are across the Five Foundations and the 30-Day Programme, kept in this browser."
      />
      <ProgressView items={getSummaries()} paths={paths} />
    </>
  );
}

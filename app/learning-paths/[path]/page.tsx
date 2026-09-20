import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { StorageNotice } from "@/components/member/member-actions";
import { LearningPathSteps } from "@/components/resources/learning-path-views";
import { getSummaries, loadLearningPaths } from "@/lib/content/repository";
import { getFoundation } from "@/lib/content/taxonomy";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadLearningPaths().map((p) => ({ path: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/learning-paths/[path]">): Promise<Metadata> {
  const { path: id } = await params;
  const p = loadLearningPaths().find((x) => x.id === id);
  return { title: p ? p.title : "Learning path" };
}

export default async function LearningPathPage({ params }: PageProps<"/learning-paths/[path]">) {
  const { path: id } = await params;
  const path = loadLearningPaths().find((x) => x.id === id);
  if (!path) notFound();
  const all = getSummaries();
  const steps = path.steps.map((id) => all.find((r) => r.id === id)).filter((r) => r !== undefined);

  return (
    <>
      <Breadcrumbs items={[{ label: "Learning paths", href: "/learning-paths/" }, { label: path.title }]} />
      <StorageNotice />
      <PageHeader eyebrow="Learning path" title={path.title} description={path.description} icon={getFoundation(path.foundation).icon} />
      <LearningPathSteps path={path} steps={steps} />
    </>
  );
}

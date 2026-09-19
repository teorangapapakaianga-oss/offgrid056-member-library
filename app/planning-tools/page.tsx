import type { Metadata } from "next";
import { CollectionPage } from "@/components/resources/collection-page";
import { getSummaries } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Planning Tools" };

export default function PlanningToolsPage() {
  return (
    <CollectionPage
      title="Planning Tools"
      eyebrow="Tools"
      description="Planners, templates and assessments that work across every foundation."
      items={getSummaries((r) => r.collections?.includes("planning-tools") ?? false)}
      hideGroups={[]}
    />
  );
}

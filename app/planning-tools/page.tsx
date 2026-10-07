import type { Metadata } from "next";
import { CollectionPage } from "@/components/resources/collection-page";
import { inCollection } from "@/lib/content/collection-rules";
import { getSummaries, isPrivatePreview } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Planning Tools" };

export default function PlanningToolsPage() {
  const privatePreview = isPrivatePreview();
  return (
    <CollectionPage
      title="Planning Tools"
      eyebrow="Tools"
      description="Planners, templates and assessments that work across every foundation."
      // In the private preview the protected library lists the real planning resources only; demo placeholders stay reachable
      // through the programme, the workshops and their own routes (Stage 9.78B). The public demo build still lists them.
      items={getSummaries((r) => inCollection(r, "planning-tools", { hidePlaceholders: true, privatePreview }))}
      hideGroups={[]}
    />
  );
}

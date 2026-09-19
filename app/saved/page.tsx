import type { Metadata } from "next";
import { StagePlaceholder } from "@/components/layout/stage-placeholder";

export const metadata: Metadata = { title: "Saved resources" };

export default function SavedPage() {
  return (
    <StagePlaceholder title="Saved resources" eyebrow="My library" description="Resources you have saved, all in one place." stage={4} icon="saved">
      Saving resources arrives in Stage 4 (member functionality). Saved items will be kept in this browser for V1.
    </StagePlaceholder>
  );
}

import type { Metadata } from "next";
import { StagePlaceholder } from "@/components/layout/stage-placeholder";

export const metadata: Metadata = { title: "Suppliers & Services" };

export default function SuppliersPage() {
  return (
    <StagePlaceholder title="Suppliers & Services" eyebrow="Directory" description="A directory of suppliers and services for New Zealand, Australia, the United States and Canada." stage={5} icon="suppliers">
      The supplier directory and its filters arrive in Stage 5. V1 will contain clearly marked demonstration listings only.
    </StagePlaceholder>
  );
}

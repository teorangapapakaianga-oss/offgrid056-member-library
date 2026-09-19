import type { Metadata } from "next";
import { StagePlaceholder } from "@/components/layout/stage-placeholder";

export const metadata: Metadata = { title: "Workshops & Events" };

export default function WorkshopsPage() {
  return (
    <StagePlaceholder title="Workshops & Events" eyebrow="Workshops" description="Upcoming and past workshops, recordings and handouts." stage={5} icon="workshops">
      Workshop listings, recordings and handouts arrive in Stage 5, using demonstration data.
    </StagePlaceholder>
  );
}

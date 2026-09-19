import type { Metadata } from "next";
import { StagePlaceholder } from "@/components/layout/stage-placeholder";

export const metadata: Metadata = { title: "My progress" };

export default function ProgressPage() {
  return (
    <StagePlaceholder title="My progress" eyebrow="My library" description="Your progress across the Five Foundations and the 30-Day Programme." stage={4} icon="progress">
      Completion tracking, foundation progress and programme progress arrive in Stage 4.
    </StagePlaceholder>
  );
}

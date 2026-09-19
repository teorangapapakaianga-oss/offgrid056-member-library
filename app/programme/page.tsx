import type { Metadata } from "next";
import { StagePlaceholder } from "@/components/layout/stage-placeholder";

export const metadata: Metadata = { title: "30-Day Resilience Programme" };

export default function ProgrammePage() {
  return (
    <StagePlaceholder title="30-Day Resilience Programme" eyebrow="Programme" description="A structured 30-day plan across the Five Foundations, one small action a day." stage={4} icon="programme">
      Day-by-day navigation, progress, completion ticks and notes arrive in Stage 4 (member functionality), using placeholder programme data.
    </StagePlaceholder>
  );
}

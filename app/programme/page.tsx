import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { StorageNotice } from "@/components/member/member-actions";
import { ProgrammeOverview } from "@/components/programme/programme-views";
import { Icon } from "@/components/ui/icon";
import { getProgramme, getProgrammeDays } from "@/lib/content/repository";

export const metadata: Metadata = { title: "30-Day Resilience Programme" };

export default function ProgrammePage() {
  const programme = getProgramme();
  const days = getProgrammeDays();
  return (
    <>
      <Breadcrumbs items={[{ label: "30-Day Programme" }]} />
      <StorageNotice />
      <PageHeader eyebrow="Programme" title={programme.title} description="One small action a day, across the Five Foundations." />
      {programme.isPlaceholder && (
        <p className="mb-6 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
          <span>
            <strong>Demonstration content.</strong> {programme.overview}
          </span>
        </p>
      )}
      <ProgrammeOverview programme={programme} days={days} />
    </>
  );
}

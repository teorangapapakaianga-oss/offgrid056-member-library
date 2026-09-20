import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { StorageNotice } from "@/components/member/member-actions";
import { ProgrammeDayView } from "@/components/programme/programme-views";
import { Icon } from "@/components/ui/icon";
import { getProgrammeDay, getProgrammeDays, getSummaries } from "@/lib/content/repository";
import { getFoundation } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProgrammeDays().map((d) => ({ day: String(d.day) }));
}

export async function generateMetadata({ params }: PageProps<"/programme/day/[day]">): Promise<Metadata> {
  const day = getProgrammeDay(Number((await params).day));
  return { title: day ? `Day ${day.day}: ${day.title}` : "Programme day" };
}

export default async function ProgrammeDayPage({ params }: PageProps<"/programme/day/[day]">) {
  const day = getProgrammeDay(Number((await params).day));
  if (!day) notFound();
  const resources = getSummaries((r) => day.resourceIds.includes(r.id));
  const f = getFoundation(day.foundation);

  return (
    <>
      <Breadcrumbs items={[{ label: "30-Day Programme", href: "/programme/" }, { label: `Day ${day.day}` }]} />
      <StorageNotice />
      <PageHeader
        eyebrow={`Day ${day.day} of 30 · Week ${day.week} · ${f.name}`}
        title={day.title}
        description={`About ${formatMinutes(day.estimatedTime)}`}
        icon={f.icon}
      />
      {day.isPlaceholder && (
        <p className="mb-6 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
          <span>
            <strong>Demonstration content.</strong> This day is placeholder data. Completion and notes work exactly as they will
            with the final programme.
          </span>
        </p>
      )}
      <ProgrammeDayView day={day} resources={resources} />
    </>
  );
}

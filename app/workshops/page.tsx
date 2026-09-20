import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { WorkshopTabs } from "@/components/directory/workshop-views";
import { Icon } from "@/components/ui/icon";
import { getWorkshops } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Workshops & Events" };

export default function WorkshopsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Workshops & Events" }]} />
      <PageHeader
        eyebrow="Workshops"
        title="Workshops & Events"
        description="Upcoming sessions, past workshops, their recordings and their handouts. Dates are shown in your own time zone."
      />
      <p className="mb-6 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
        <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
        <span>
          <strong>Demonstration content.</strong> These are example listings used to build the workshop system. No workshop is
          scheduled and no booking is available.
        </span>
      </p>
      <WorkshopTabs workshops={getWorkshops()} />
    </>
  );
}

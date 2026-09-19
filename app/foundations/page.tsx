import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { FoundationProgressBadge } from "@/components/member/foundation-progress";
import { Icon } from "@/components/ui/icon";
import { getSummaries } from "@/lib/content/repository";
import { fiveFoundations } from "@/lib/content/taxonomy";

export const metadata: Metadata = { title: "The Five Foundations" };

export default function FoundationsPage() {
  const items = getSummaries();
  return (
    <>
      <Breadcrumbs items={[{ label: "Five Foundations" }]} />
      <PageHeader
        eyebrow="The OffGrid056 framework"
        title="The Five Foundations"
        description="Air, Water, Shelter, Food and Energy: the five things every household depends on. Choose a foundation to see its topics and resources."
      />
      <ul role="list" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fiveFoundations.map((f) => {
          const mine = items.filter((r) => r.foundation === f.id);
          return (
            <li key={f.id}>
              <Link
                href={`/foundations/${f.id}/`}
                className="flex h-full flex-col gap-4 rounded-xl bg-white p-5 ring-1 ring-og-line transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
                  <img src={f.icon} alt="" width={56} height={56} className="size-14" />
                  <div>
                    <h2 className="font-display text-3xl leading-none text-og-charcoal">{f.name}</h2>
                    <p className="text-xs text-og-taupe">
                      {f.categories.length} topics · {mine.length} resources
                    </p>
                  </div>
                </div>
                <p className="text-sm text-og-graphite/90">{f.description}</p>
                <FoundationProgressBadge foundation={f.id} items={mine} />
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-og-deep">
                  Explore {f.name}
                  <Icon name="arrowRight" className="size-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

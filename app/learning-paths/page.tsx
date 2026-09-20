import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Icon } from "@/components/ui/icon";
import { getSummaries, loadLearningPaths } from "@/lib/content/repository";
import { getFoundation } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";

export const metadata: Metadata = { title: "Learning paths" };

export default function LearningPathsPage() {
  const all = getSummaries();
  const paths = loadLearningPaths();
  return (
    <>
      <Breadcrumbs items={[{ label: "Learning paths" }]} />
      <PageHeader
        eyebrow="Guided routes"
        title="Learning paths"
        description="Short, ordered routes through the library. Work through the steps in order, and your progress is kept as you go."
      />
      <ul role="list" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paths.map((p) => {
          const steps = p.steps.map((id) => all.find((r) => r.id === id)).filter((r) => r !== undefined);
          const minutes = steps.reduce((n, s) => n + s.estimatedTime, 0);
          const f = getFoundation(p.foundation);
          return (
            <li key={p.id}>
              <Link href={`/learning-paths/${p.id}/`} className="flex h-full flex-col gap-3 rounded-xl bg-white p-5 ring-1 ring-og-line transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
                  <img src={f.icon} alt="" width={44} height={44} className="size-11" />
                  <h2 className="font-display text-2xl leading-none text-og-charcoal">{p.title}</h2>
                </div>
                <p className="text-sm text-og-graphite/90">{p.description}</p>
                <p className="mt-auto text-xs text-og-taupe">
                  {steps.length} steps · about {formatMinutes(minutes)}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-og-deep">
                  Open path
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

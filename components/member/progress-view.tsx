"use client";
import Link from "next/link";
import type { ResourceSummary } from "@/lib/content/summaries";
import { fiveFoundations } from "@/lib/content/taxonomy";
import { useMemberState } from "@/lib/member";
import { PROGRAMME_DAYS } from "@/lib/member/types";
import { foundationProgress, overallProgress } from "@/lib/progress";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BackupRestore } from "./backup-restore";
import { StartAgain } from "./start-again";
import type { PathLite } from "./dashboard";

export function ProgressView({ items, paths }: { items: ResourceSummary[]; paths: PathLite[] }) {
  const { ready, state, completedIds } = useMemberState();
  const byId = new Map(items.map((r) => [r.id, r]));
  const overall = overallProgress(items, completedIds);
  const programmeDone = Object.values(state.programme.days).filter((d) => d.completed).length;
  const completedList = Object.entries(state.completed)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .map(([id, at]) => ({ r: byId.get(id), at }))
    .filter((x): x is { r: ResourceSummary; at: string } => Boolean(x.r));

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="overall" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
        <h2 id="overall" className="font-display text-2xl leading-none text-og-charcoal">
          Overall
        </h2>
        <p className="font-display mt-3 text-6xl leading-none text-og-charcoal">
          {ready ? overall.percent : 0}
          <span className="text-2xl">%</span>
        </p>
        <p className="mt-1 mb-3 text-sm text-og-taupe">
          {ready ? overall.completed : 0} of {overall.total} resources completed
        </p>
        <ProgressBar value={ready ? overall.percent : 0} label="Overall progress" />
      </section>

      <section aria-labelledby="foundations" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
        <h2 id="foundations" className="font-display text-2xl leading-none text-og-charcoal">
          Five Foundations
        </h2>
        <ul role="list" className="mt-4 flex flex-col gap-4">
          {fiveFoundations.map((f) => {
            const p = foundationProgress(items, f.id, completedIds, paths.find((x) => x.foundation === f.id)?.steps);
            return (
              <li key={f.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Link href={`/foundations/${f.id}/`} className="flex min-w-44 items-center gap-3 rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
                  <img src={f.icon} alt="" width={36} height={36} className="size-9" />
                  <span className="font-display text-2xl leading-none text-og-charcoal">{f.name}</span>
                </Link>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-xs text-og-taupe">
                    <span>
                      {ready ? p.completed : 0}/{p.total} completed · Assessment:{" "}
                      {p.assessment === "done" ? "Done" : p.assessment === "none" ? "Not available yet" : "Not started"}
                    </span>
                    <span className="font-semibold text-og-charcoal">{ready ? p.percent : 0}%</span>
                  </div>
                  <ProgressBar value={ready ? p.percent : 0} label={`${f.name} progress`} />
                </div>
                {p.next && (
                  <Link href={`/resources/${p.next.slug}/`} className="inline-flex min-h-6 items-center text-xs font-semibold text-og-deep underline-offset-2 hover:underline">
                    Next: {p.next.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="programme-progress" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
        <div className="flex items-baseline justify-between">
          <h2 id="programme-progress" className="font-display text-2xl leading-none text-og-charcoal">
            30-Day Programme
          </h2>
          <Link href="/programme/" className="inline-flex min-h-6 items-center gap-1 text-sm font-semibold text-og-deep hover:underline">
            Open programme
            <Icon name="chevronRight" className="size-4" />
          </Link>
        </div>
        <p className="mt-3 mb-3 text-sm text-og-taupe">
          {ready ? programmeDone : 0} of {PROGRAMME_DAYS} days completed
        </p>
        <ProgressBar value={((ready ? programmeDone : 0) / PROGRAMME_DAYS) * 100} label="Programme progress" />
      </section>

      <section aria-labelledby="completed-list" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
        <h2 id="completed-list" className="font-display mb-4 text-2xl leading-none text-og-charcoal">
          Completed resources
        </h2>
        {!ready ? (
          <div aria-hidden="true" className="h-11 animate-pulse rounded-lg bg-og-white" />
        ) : completedList.length ? (
          <ul role="list" className="flex flex-col">
            {completedList.map(({ r, at }) => (
              <li key={r.id}>
                <ResourceListItem
                  resource={r}
                  meta={`Completed ${new Date(at).toLocaleDateString("en-NZ", { day: "numeric", month: "short" })}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState compact icon="check" title="Nothing completed yet" action={{ href: "/start-here/", label: "Go to Start Here" }}>
            Mark a resource complete from its page, and it will appear here.
          </EmptyState>
        )}
      </section>

      <BackupRestore />
      <StartAgain />
    </div>
  );
}

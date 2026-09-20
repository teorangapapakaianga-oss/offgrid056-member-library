"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ResourceSummary } from "@/lib/content/summaries";
import { fiveFoundations, getResourceType } from "@/lib/content/taxonomy";
import { formatMinutes, isNewResource } from "@/lib/format";
import { useNow } from "@/lib/hooks/use-now";
import { useMemberState } from "@/lib/member";
import { foundationProgress, nextRecommended, overallProgress } from "@/lib/progress";
import { ResourceGrid } from "@/components/resources/resource-card";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";

export interface PathLite {
  id: string;
  foundation: string;
  steps: string[];
}

function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const id = `panel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className={`rounded-xl bg-white p-5 ring-1 ring-og-line ${className}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id={id} className="font-display text-2xl leading-none text-og-charcoal">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Skeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col gap-2">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-11 rounded-lg bg-og-white" />
      ))}
    </div>
  );
}

const seeAll = (href: string, label = "See all") => (
  <Link href={href} className="inline-flex min-h-6 items-center gap-1 text-sm font-semibold text-og-deep underline-offset-2 hover:underline">
    {label}
    <Icon name="chevronRight" className="size-4" />
  </Link>
);

export function Dashboard({ items, paths }: { items: ResourceSummary[]; paths: PathLite[] }) {
  const { ready, state, completedIds } = useMemberState();
  const now = useNow();
  const byId = new Map(items.map((r) => [r.id, r]));
  const startPath = paths.find((p) => p.id === "start-here")?.steps ?? [];

  const recent = state.recent.map((e) => byId.get(e.id)).filter((r): r is ResourceSummary => Boolean(r)).slice(0, 8);
  const saved = Object.entries(state.saved)
    .sort((a, b) => b[1].localeCompare(a[1]))
    .map(([id]) => byId.get(id))
    .filter((r): r is ResourceSummary => Boolean(r));
  const overall = overallProgress(items, completedIds);
  const programmeDone = Object.values(state.programme.days).filter((d) => d.completed).length;
  const newThisMonth = now ? items.filter((r) => isNewResource(r, now)).sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)) : [];

  // Continue Learning: where the member actually left off, then the last unfinished thing they viewed,
  // then the next Start Here step.
  const last = state.lastLocation;
  const lastDay = last?.kind === "programme-day" ? Number(last.id) : null;
  const lastDayOpen = lastDay !== null && !state.programme.days[String(lastDay)]?.completed;
  const lastResource = last?.kind === "resource" ? byId.get(last.id) : undefined;
  const continueWith =
    (lastResource && lastResource.completionAvailable && !completedIds.has(lastResource.id) ? lastResource : undefined) ??
    recent.find((r) => r.completionAvailable && !completedIds.has(r.id)) ??
    nextRecommended(items, completedIds, startPath);
  // Recommended Next Step: assessment first, then the foundation with the lowest progress.
  const assessment = items.find((r) => r.slug === "household-resilience-assessment");
  const perFoundation = fiveFoundations.map((f) =>
    foundationProgress(items, f.id, completedIds, paths.find((p) => p.foundation === f.id)?.steps),
  );
  const weakest = [...perFoundation].filter((p) => p.next).sort((a, b) => a.percent - b.percent)[0];
  const recommended =
    assessment && !completedIds.has(assessment.id)
      ? { resource: assessment, why: `Start by finding where your household actually is. It takes about ${formatMinutes(assessment.estimatedTime)}.` }
      : weakest?.next
        ? { resource: weakest.next, why: `${fiveFoundations.find((f) => f.id === weakest.foundation)?.name} is your least-developed foundation so far.` }
        : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome + Continue Learning */}
      <section aria-labelledby="welcome" className="on-dark grid gap-6 overflow-hidden rounded-2xl bg-og-charcoal p-6 text-og-white sm:p-8 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-og-green">Member Resource Library</p>
          <h1 id="welcome" className="font-display mt-2 text-5xl leading-none sm:text-6xl">
            Welcome back
          </h1>
          <p className="mt-3 max-w-xl text-og-white/85">
            <span className="font-semibold text-og-green">Prepared, not panicked.</span> Pick up where you left off, or take the next small step
            across the Five Foundations.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-og-white/70">
            {fiveFoundations.map((f, i) => (
              <span key={f.id}>
                {f.name}
                {i < fiveFoundations.length - 1 && <span className="ml-2 text-og-green">•</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-og-graphite p-5">
          <h2 className="font-display text-2xl leading-none">Continue learning</h2>
          {!ready ? (
            <div className="mt-4 h-20 animate-pulse rounded-lg bg-og-white/10" aria-hidden="true" />
          ) : lastDayOpen ? (
            <div className="mt-4">
              <p className="text-lg leading-snug font-semibold">30-Day Programme, day {lastDay}</p>
              <p className="mt-1 text-sm text-og-white/75">You were last here</p>
              <Link
                href={`/programme/day/${lastDay}/`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-og-green px-4 text-sm font-semibold text-og-charcoal hover:brightness-95"
              >
                Continue day {lastDay}
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          ) : continueWith ? (
            <div className="mt-4">
              <p className="text-lg leading-snug font-semibold">{continueWith.title}</p>
              <p className="mt-1 text-sm text-og-white/75">
                {getResourceType(continueWith.resourceType).label} · {formatMinutes(continueWith.estimatedTime)}
              </p>
              <Link
                href={`/resources/${continueWith.slug}/`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-og-green px-4 text-sm font-semibold text-og-charcoal hover:brightness-95"
              >
                {recent.length ? "Continue" : "Start here"}
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-og-white/80">You have completed everything available. New resources will appear here.</p>
          )}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Recommended next step">
          {!ready ? (
            <Skeleton />
          ) : recommended ? (
            <>
              <ResourceListItem resource={recommended.resource} />
              <p className="mt-2 text-sm text-og-taupe">{recommended.why}</p>
            </>
          ) : (
            <EmptyState compact icon="check" title="Nothing waiting">
              You are up to date.
            </EmptyState>
          )}
        </Panel>

        <Panel title="My progress" action={seeAll("/progress/", "Details")}>
          {!ready ? (
            <Skeleton />
          ) : (
            <>
              <p className="font-display text-5xl leading-none text-og-charcoal">
                {overall.percent}
                <span className="text-2xl">%</span>
              </p>
              <p className="mt-1 mb-3 text-sm text-og-taupe">
                {overall.completed} of {overall.total} resources completed
              </p>
              <ProgressBar value={overall.percent} label="Overall progress" />
            </>
          )}
        </Panel>

        <Panel title="30-Day Programme" action={seeAll("/programme/", "Open")} className="md:col-span-2 xl:col-span-1">
          {!ready ? (
            <Skeleton />
          ) : (
            <>
              <p className="font-display text-5xl leading-none text-og-charcoal">
                {programmeDone}
                <span className="text-2xl"> / 30 days</span>
              </p>
              <p className="mt-1 mb-3 text-sm text-og-taupe">{programmeDone ? "Keep going: one day at a time." : "Not started yet."}</p>
              <ProgressBar value={(programmeDone / 30) * 100} label="30-Day Programme progress" />
              <Link
                href="/programme/"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-og-charcoal px-4 text-sm font-semibold text-og-white hover:bg-og-deep"
              >
                {programmeDone ? `Continue with day ${Math.min(programmeDone + 1, 30)}` : "Start day 1"}
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </>
          )}
        </Panel>
      </div>

      <Panel title="Five Foundations progress" action={seeAll("/foundations/", "All foundations")}>
        <ul role="list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {perFoundation.map((p) => {
            const f = fiveFoundations.find((x) => x.id === p.foundation)!;
            return (
              <li key={p.foundation} className="flex flex-col gap-3 rounded-lg bg-og-white/60 p-4 ring-1 ring-og-line">
                <Link href={`/foundations/${f.id}/`} className="flex items-center gap-3 rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
                  <img src={f.icon} alt="" width={40} height={40} className="size-10" />
                  <span className="font-display text-2xl leading-none text-og-charcoal">{f.name}</span>
                </Link>
                {!ready ? (
                  <Skeleton lines={1} />
                ) : (
                  <>
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-og-taupe">
                        <span>
                          {p.completed}/{p.total} completed
                        </span>
                        <span className="font-semibold text-og-charcoal">{p.percent}%</span>
                      </div>
                      <ProgressBar value={p.percent} label={`${f.name} progress`} />
                    </div>
                    <p className="text-xs text-og-taupe">
                      Assessment:{" "}
                      <span className="font-semibold text-og-charcoal">
                        {p.assessment === "done" ? "Done" : p.assessment === "none" ? "Not available yet" : "Not started"}
                      </span>
                    </p>
                    {p.next && (
                      <Link href={`/resources/${p.next.slug}/`} className="mt-auto inline-flex min-h-6 items-center text-xs font-semibold text-og-deep underline-offset-2 hover:underline">
                        Next: {p.next.title}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Recently viewed">
          {!ready ? (
            <Skeleton lines={3} />
          ) : recent.length ? (
            <ul role="list" className="flex flex-col">
              {recent.map((r) => (
                <li key={r.id}>
                  <ResourceListItem resource={r} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact icon="clock" title="Nothing viewed yet" action={{ href: "/start-here/", label: "Go to Start Here" }}>
              Resources you open will appear here so you can find them again quickly.
            </EmptyState>
          )}
        </Panel>

        <Panel title="Saved resources" action={saved.length > 0 ? seeAll("/saved/") : undefined}>
          {!ready ? (
            <Skeleton lines={3} />
          ) : saved.length ? (
            <ul role="list" className="flex flex-col">
              {saved.slice(0, 6).map((r) => (
                <li key={r.id}>
                  <ResourceListItem resource={r} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact icon="saved" title="No saved resources yet" action={{ href: "/library/", label: "Browse the library" }}>
              Save useful resources to keep them one tap away.
            </EmptyState>
          )}
        </Panel>
      </div>

      <section aria-labelledby="new-this-month">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="new-this-month" className="font-display text-3xl leading-none text-og-charcoal">
            New this month
          </h2>
          {seeAll("/library/?status=new")}
        </div>
        {!now ? (
          <Skeleton lines={2} />
        ) : newThisMonth.length ? (
          <ResourceGrid items={newThisMonth.slice(0, 8)} headingLevel={3} />
        ) : (
          <EmptyState compact icon="sparkle" title="Nothing new this month">
            New resources added in the last 30 days will appear here.
          </EmptyState>
        )}
      </section>
    </div>
  );
}

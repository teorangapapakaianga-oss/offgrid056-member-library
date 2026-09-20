"use client";
import Link from "next/link";
import type { LearningPath } from "@/lib/content/constants";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getFoundation } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";
import { useMemberState } from "@/lib/member";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";

function pathProgress(steps: ResourceSummary[], completed: ReadonlySet<string>) {
  const done = steps.filter((s) => completed.has(s.id)).length;
  const current = steps.find((s) => !completed.has(s.id)) ?? null;
  return { done, total: steps.length, percent: steps.length ? Math.round((done / steps.length) * 100) : 0, current };
}

/** Ordered steps, progress, current step and a continue action. Reused by the path page and resource pages. */
export function LearningPathSteps({ path, steps }: { path: LearningPath; steps: ResourceSummary[] }) {
  const { ready, completedIds } = useMemberState();
  const p = pathProgress(steps, completedIds);

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="path-progress" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="path-progress" className="font-display text-2xl leading-none text-og-charcoal">
            Your progress
          </h2>
          <p className="text-sm text-og-taupe">
            {ready ? p.done : 0} of {p.total} steps · {ready ? p.percent : 0}%
          </p>
        </div>
        <div className="mt-3">
          <ProgressBar value={ready ? p.percent : 0} label={`${path.title} progress`} />
        </div>
        {ready && p.current && (
          <Link
            href={`/resources/${p.current.slug}/`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-og-green px-4 text-sm font-semibold text-og-charcoal hover:brightness-95"
          >
            {p.done === 0 ? "Start step 1" : `Continue: step ${steps.indexOf(p.current) + 1}`}
            <Icon name="arrowRight" className="size-4" />
          </Link>
        )}
        {ready && !p.current && p.total > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-og-green/25 px-4 py-2 text-sm font-semibold text-og-charcoal">
            <Icon name="check" className="size-5 text-og-deep" />
            Path complete
          </p>
        )}
      </section>

      <ol role="list" className="flex flex-col gap-3">
        {steps.map((s, i) => {
          const done = ready && completedIds.has(s.id);
          const isCurrent = ready && p.current?.id === s.id;
          return (
            <li key={s.id}>
              <Link
                href={`/resources/${s.slug}/`}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex items-center gap-4 rounded-xl bg-white p-4 ring-1 transition hover:shadow-md ${
                  isCurrent ? "ring-2 ring-og-deep" : "ring-og-line"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full font-display text-xl ${
                    done ? "bg-og-green text-og-charcoal" : "bg-og-white text-og-charcoal ring-1 ring-og-line"
                  }`}
                >
                  {done ? <Icon name="check" className="size-5" /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-og-charcoal">{s.title}</span>
                  <span className="block text-xs text-og-taupe">
                    {getFoundation(s.foundation).name} · {formatMinutes(s.estimatedTime)}
                    {done && " · Completed"}
                    {isCurrent && " · You are here"}
                  </span>
                </span>
                <Icon name="chevronRight" className="size-5 shrink-0 text-og-taupe" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Small "step 2 of 4" strip shown on a resource that belongs to a path. */
export function LearningPathStrip({ path, steps, currentId }: { path: LearningPath; steps: ResourceSummary[]; currentId: string }) {
  const { ready, completedIds } = useMemberState();
  const index = steps.findIndex((s) => s.id === currentId);
  const p = pathProgress(steps, completedIds);
  if (index < 0) return null;
  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-og-line">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-og-deep">Learning path</p>
      <Link href={`/learning-paths/${path.id}/`} className="font-display mt-1 block text-2xl leading-none text-og-charcoal hover:underline">
        {path.title}
      </Link>
      <p className="mt-2 mb-3 text-sm text-og-taupe">
        Step {index + 1} of {steps.length}
        {ready && ` · ${p.done} completed`}
      </p>
      <ProgressBar value={ready ? p.percent : 0} label={`${path.title} progress`} />
    </div>
  );
}

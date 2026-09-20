"use client";
import Link from "next/link";
import { useState } from "react";
import type { Workshop } from "@/lib/content/directory-schemas";
import { useNow } from "@/lib/hooks/use-now";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";

const MODE_LABELS = { online: "Online", "in-person": "In person", hybrid: "Online and in person" } as const;

/** Upcoming or past is decided in the member's browser, so a static build never goes stale. */
function partition(workshops: Workshop[], now: Date | null) {
  if (!now) return { upcoming: [], past: [], undecided: workshops };
  const upcoming = workshops.filter((w) => new Date(w.endDate ?? w.startDate) >= now).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = workshops.filter((w) => new Date(w.endDate ?? w.startDate) < now).sort((a, b) => b.startDate.localeCompare(a.startDate));
  return { upcoming, past, undecided: [] };
}

export function formatWorkshopDate(w: Workshop, now: Date | null): string {
  if (!now) return "";
  const d = new Date(w.startDate);
  return d.toLocaleString("en-NZ", { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function WorkshopCard({ w, now }: { w: Workshop; now: Date | null }) {
  return (
    <li className="flex h-full flex-col gap-3 rounded-xl bg-white p-5 ring-1 ring-og-line">
      <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide">
        <span className="rounded-full bg-og-deep px-2.5 py-0.5 text-og-white">{MODE_LABELS[w.mode]}</span>
        {w.videoUrl && <span className="rounded-full bg-og-green px-2.5 py-0.5 text-og-charcoal">Recording</span>}
        {w.downloads.length > 0 && <span className="rounded-full bg-white px-2.5 py-0.5 text-og-charcoal ring-1 ring-og-graphite/30">Handouts</span>}
        {w.isDemo && <span className="rounded-full border border-dashed border-og-taupe px-2.5 py-0.5 text-og-taupe">Demonstration content</span>}
      </div>
      <h2 className="text-base leading-snug font-semibold text-og-charcoal">
        <Link href={`/workshops/${w.slug}/`} className="inline-flex min-h-6 items-center underline-offset-2 hover:text-og-deep hover:underline">
          {w.title}
        </Link>
      </h2>
      <p className="text-sm text-og-taupe" suppressHydrationWarning>
        {now ? formatWorkshopDate(w, now) : "…"} · {w.location}
      </p>
      <p className="line-clamp-3 text-sm text-og-graphite/90">{w.description}</p>
      <Link href={`/workshops/${w.slug}/`} className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-og-deep">
        View workshop
        <Icon name="arrowRight" className="size-4" />
      </Link>
    </li>
  );
}

export function WorkshopTabs({ workshops }: { workshops: Workshop[] }) {
  const now = useNow();
  const { upcoming, past } = partition(workshops, now);
  const recordings = past.filter((w) => w.videoUrl);
  const handouts = workshops.filter((w) => w.downloads.length > 0);
  const tabs = [
    { id: "upcoming", label: "Upcoming", items: upcoming },
    { id: "past", label: "Past", items: past },
    { id: "recordings", label: "Recordings", items: recordings },
    { id: "handouts", label: "Handouts", items: handouts },
  ];
  const [active, setActive] = useState("upcoming");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <>
      <div role="tablist" aria-label="Workshops" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
              active === t.id ? "bg-og-charcoal text-og-white" : "bg-white text-og-charcoal ring-1 ring-og-taupe/35 hover:ring-og-deep"
            }`}
          >
            {t.label}
            <span className={active === t.id ? "text-og-green" : "text-og-taupe"} suppressHydrationWarning>
              {now ? t.items.length : "…"}
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
        {!now ? (
          <div aria-hidden="true" className="h-40 animate-pulse rounded-xl bg-white" />
        ) : current.items.length ? (
          <ul role="list" className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {current.items.map((w) => (
              <WorkshopCard key={w.id} w={w} now={now} />
            ))}
          </ul>
        ) : (
          <EmptyState icon="workshops" title={`No ${current.label.toLowerCase()} workshops`}>
            {current.id === "upcoming"
              ? "When a workshop is scheduled, it will appear here."
              : "Past workshops, recordings and handouts appear here after each event."}
          </EmptyState>
        )}
      </div>
    </>
  );
}

/** Local date and time on a workshop page (the member's own time zone). */
export function WorkshopWhen({ workshop }: { workshop: Workshop }) {
  const now = useNow();
  return (
    <span suppressHydrationWarning>
      {now ? formatWorkshopDate(workshop, now) : "…"}
      {now && <span className="text-og-taupe"> (your local time)</span>}
    </span>
  );
}

export function WorkshopStatus({ workshop }: { workshop: Workshop }) {
  const now = useNow();
  if (!now) return null;
  const past = new Date(workshop.endDate ?? workshop.startDate) < now;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide ${past ? "bg-white text-og-charcoal ring-1 ring-og-graphite/30" : "bg-og-green text-og-charcoal"}`}>
      {past ? "Past workshop" : "Upcoming"}
    </span>
  );
}

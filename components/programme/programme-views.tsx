"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Programme, ProgrammeDay } from "@/lib/content/programme-schemas";
import type { ResourceSummary } from "@/lib/content/summaries";
import { getFoundation } from "@/lib/content/taxonomy";
import { formatMinutes } from "@/lib/format";
import { FOUNDATION_STYLES } from "@/lib/foundation-style";
import { memberStore, useMemberState, useProgrammeDay } from "@/lib/member";
import { NOTES_MAX, PROGRAMME_DAYS } from "@/lib/member/types";
import { DownloadActions, type FileInfo } from "@/components/resources/download-actions";
import { ResourceListItem } from "@/components/resources/resource-list-item";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";

/** Programme overview: progress, continue button, and every day by week. */
export function ProgrammeOverview({ programme, days }: { programme: Programme; days: ProgrammeDay[] }) {
  const { ready, state } = useMemberState();
  const dayState = state.programme.days;
  const completedDays = Object.values(dayState).filter((d) => d.completed).length;
  const firstIncomplete = days.find((d) => !dayState[String(d.day)]?.completed)?.day ?? PROGRAMME_DAYS;
  const percent = (completedDays / PROGRAMME_DAYS) * 100;

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="programme-progress" className="on-dark rounded-2xl bg-og-charcoal p-6 text-og-white sm:p-8">
        <h2 id="programme-progress" className="font-display text-3xl leading-none">
          Your progress
        </h2>
        <p className="font-display mt-3 text-6xl leading-none">
          {ready ? completedDays : 0}
          <span className="text-2xl"> / {PROGRAMME_DAYS} days</span>
        </p>
        <div className="mt-4 max-w-xl">
          <ProgressBar value={ready ? percent : 0} label="30-Day Programme progress" tone="dark" />
        </div>
        <Link
          href={`/programme/day/${firstIncomplete}/`}
          className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-og-green px-5 text-sm font-semibold text-og-charcoal hover:brightness-95"
        >
          {completedDays === 0 ? "Start day 1" : completedDays === PROGRAMME_DAYS ? "Review day 30" : `Continue with day ${firstIncomplete}`}
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </section>

      {programme.weeks.map((week) => (
        <section key={week.number} aria-labelledby={`week-${week.number}`}>
          <h2 id={`week-${week.number}`} className="font-display mb-3 text-2xl leading-none text-og-charcoal">
            {week.title}
          </h2>
          <ul role="list" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {week.days.map((n) => {
              const day = days.find((d) => d.day === n);
              if (!day) return null;
              const done = ready && dayState[String(n)]?.completed;
              const hasNotes = Boolean(dayState[String(n)]?.notes);
              const s = FOUNDATION_STYLES[day.foundation];
              return (
                <li key={n}>
                  <Link
                    href={`/programme/day/${n}/`}
                    className="flex h-full items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-og-line transition hover:shadow-md"
                  >
                    <span className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-lg ${s.surface} ${s.ink} ${s.ring}`}>
                      <span className="text-[0.6rem] leading-none font-semibold uppercase">Day</span>
                      <span className="font-display text-xl leading-none">{n}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-og-charcoal">{day.title}</span>
                      <span className="block text-xs text-og-taupe">
                        {getFoundation(day.foundation).name} · {formatMinutes(day.estimatedTime)}
                        {hasNotes && " · Notes"}
                      </span>
                    </span>
                    {done ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-og-green px-2.5 py-1 text-[0.7rem] font-semibold text-og-charcoal">
                        <Icon name="check" className="size-3.5" />
                        Done
                      </span>
                    ) : (
                      <Icon name="chevronRight" className="size-5 shrink-0 text-og-taupe" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** One programme day: action, linked resources, worksheet download, completion tick and private notes. */
export function ProgrammeDayView({
  day,
  resources,
  worksheetFile,
}: {
  day: ProgrammeDay;
  resources: ResourceSummary[];
  worksheetFile?: FileInfo;
}) {
  const { ready, completed, notes, setCompleted, setNotes } = useProgrammeDay(day.day);
  const [draft, setDraft] = useState(notes);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const loaded = useRef(false);

  // Fill the box once the store has loaded, without overwriting anything being typed.
  useEffect(() => {
    if (ready && !loaded.current) {
      loaded.current = true;
      setDraft(notes);
    }
  }, [ready, notes]);

  // Notes save themselves shortly after typing stops.
  useEffect(() => {
    if (!loaded.current || draft === notes) return;
    const t = setTimeout(async () => {
      await setNotes(draft);
      setSavedAt(new Date().toLocaleTimeString("en-NZ", { hour: "numeric", minute: "2-digit" }));
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setNotes is stable via the store
  }, [draft, notes]);

  useEffect(() => {
    void memberStore.setLastLocation({ kind: "programme-day", id: String(day.day), at: new Date().toISOString() });
  }, [day.day]);

  const prev = day.day > 1 ? day.day - 1 : null;
  const next = day.day < PROGRAMME_DAYS ? day.day + 1 : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <section aria-labelledby="objective" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
          <h2 id="objective" className="font-display text-2xl leading-none text-og-charcoal">
            Objective
          </h2>
          <p className="mt-2 text-og-graphite">{day.objective}</p>
          <h3 className="font-display mt-5 text-2xl leading-none text-og-charcoal">Today&apos;s action</h3>
          <p className="mt-2 text-og-graphite">{day.action}</p>
        </section>

        {resources.length > 0 && (
          <section aria-labelledby="day-resources" className="mt-6 rounded-xl bg-white p-5 ring-1 ring-og-line">
            <h2 id="day-resources" className="font-display mb-3 text-2xl leading-none text-og-charcoal">
              Resources for today
            </h2>
            <ul role="list" className="flex flex-col">
              {resources.map((r) => (
                <li key={r.id}>
                  <ResourceListItem resource={r} />
                </li>
              ))}
            </ul>
            {worksheetFile && (
              <div className="mt-4 flex flex-col gap-3 rounded-lg bg-og-white/70 p-4 ring-1 ring-og-line sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-og-charcoal">
                  Worksheet: {day.worksheet?.label}
                  <span className="block text-xs font-normal text-og-taupe">Print it, or fill it in on paper as you go.</span>
                </p>
                <DownloadActions file={worksheetFile} compact />
              </div>
            )}
          </section>
        )}

        {day.notesEnabled && (
          <section aria-labelledby="day-notes" className="mt-6 rounded-xl bg-white p-5 ring-1 ring-og-line">
            <h2 id="day-notes" className="font-display text-2xl leading-none text-og-charcoal">
              My notes
            </h2>
            <p className="mt-1 mb-3 text-sm text-og-taupe">
              Private to this browser. Saved automatically, and included in your progress backup.
            </p>
            <label htmlFor="notes" className="sr-only">
              Notes for day {day.day}
            </label>
            <textarea
              id="notes"
              value={draft}
              maxLength={NOTES_MAX}
              rows={5}
              disabled={!ready}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What you did, what you found, what to do next…"
              className="w-full rounded-lg border border-og-taupe/35 bg-og-white p-3 text-sm text-og-charcoal placeholder:text-og-taupe focus:border-og-deep"
            />
            <p className="mt-1 flex justify-between text-xs text-og-taupe">
              <span aria-live="polite">{savedAt ? `Saved at ${savedAt}` : ""}</span>
              <span>
                {draft.length} / {NOTES_MAX}
              </span>
            </p>
          </section>
        )}
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-xl bg-white p-5 ring-1 ring-og-line">
          <button
            type="button"
            onClick={() => setCompleted(!completed)}
            aria-pressed={completed}
            disabled={!ready}
            className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
              completed ? "bg-og-green text-og-charcoal hover:brightness-95" : "bg-og-charcoal text-og-white hover:bg-og-deep"
            }`}
          >
            <Icon name="check" className="size-5" />
            {completed ? `Day ${day.day} complete` : `Mark day ${day.day} complete`}
          </button>
          <p className="mt-3 text-xs text-og-taupe">
            {completed ? "Press again to mark it as not complete." : "Tick it off when you have done today's action."}
          </p>
        </div>

        <nav aria-label="Programme days" className="flex items-center justify-between gap-2">
          {prev ? (
            <Link href={`/programme/day/${prev}/`} className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-white px-3 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/35">
              <Icon name="chevronRight" className="size-4 rotate-180" />
              Day {prev}
            </Link>
          ) : (
            <span />
          )}
          <Link href="/programme/" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-og-deep hover:underline">
            All days
          </Link>
          {next ? (
            <Link href={`/programme/day/${next}/`} className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-white px-3 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/35">
              Day {next}
              <Icon name="chevronRight" className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </aside>
    </div>
  );
}

"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { memberStore, useMemberState } from "@/lib/member";
import { emptyState } from "@/lib/member/types";
import { backupFileName, createBackup } from "@/lib/member/backup";

const CONFIRM_WORD = "START AGAIN";

/**
 * Start Again (owner decision S4-2, built in Stage 6).
 *
 * Deliberately awkward: it sits apart from everything else, opens a dialog that lists exactly what will be
 * erased, offers a backup first, and only enables the erase button once the member types START AGAIN.
 * It clears through the existing store (`importState(empty, "replace")`), so Stage 4 logic is unchanged.
 */
export function StartAgain() {
  const { ready, state } = useMemberState();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  const counts = {
    saved: Object.keys(state.saved).length,
    completed: Object.keys(state.completed).length,
    recent: state.recent.length,
    days: Object.values(state.programme.days).filter((d) => d.completed).length,
    notes: Object.values(state.programme.days).filter((d) => d.notes).length,
  };
  const nothingToErase = ready && !counts.saved && !counts.completed && !counts.recent && !counts.days && !counts.notes;

  function open() {
    setTyped("");
    setDone(false);
    dialogRef.current?.showModal();
  }

  function backupFirst() {
    const blob = new Blob([JSON.stringify(createBackup(state), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFileName();
    a.click();
    URL.revokeObjectURL(url);
  }

  async function eraseEverything() {
    await memberStore.importState(emptyState(), "replace");
    setDone(true);
    setTyped("");
    dialogRef.current?.close();
  }

  return (
    <section aria-labelledby="start-again" className="rounded-xl border border-og-taupe/50 bg-white p-5">
      <h2 id="start-again" className="font-display text-2xl leading-none text-og-charcoal">
        Start again
      </h2>
      <p className="mt-2 text-sm text-og-taupe">
        Erase everything this browser remembers about your progress and begin with a clean library. This cannot be undone, so
        back up first if you might want any of it back.
      </p>

      {done && (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-lg bg-og-green/25 px-4 py-3 text-sm text-og-charcoal">
          <Icon name="check" className="mt-0.5 size-5 shrink-0 text-og-deep" />
          Your progress in this browser has been erased. Nothing else was changed.
        </p>
      )}

      <button
        type="button"
        onClick={open}
        disabled={!ready || nothingToErase}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-og-taupe bg-white px-4 text-sm font-semibold text-og-charcoal hover:border-og-charcoal disabled:opacity-50"
      >
        <Icon name="close" className="size-4" />
        Start again…
      </button>
      {nothingToErase && <p className="mt-2 text-xs text-og-taupe">There is nothing stored in this browser to erase.</p>}

      <dialog
        ref={dialogRef}
        aria-labelledby="start-again-title"
        aria-describedby="start-again-body"
        className="og-sheet m-auto w-[min(34rem,92vw)] rounded-2xl bg-white p-0 text-og-charcoal"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            dialogRef.current?.close();
          }
        }}
      >
        <div className="flex flex-col gap-4 p-6">
          <h3 id="start-again-title" className="font-display text-3xl leading-none">
            Erase your progress?
          </h3>
          <div id="start-again-body" className="text-sm text-og-graphite">
            <p className="font-semibold text-og-charcoal">This will permanently remove, from this browser only:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>
                {counts.saved} saved {counts.saved === 1 ? "resource" : "resources"}
              </li>
              <li>
                {counts.completed} completed {counts.completed === 1 ? "resource" : "resources"}, and every foundation percentage they
                feed
              </li>
              <li>
                {counts.days} completed programme {counts.days === 1 ? "day" : "days"}, and {counts.notes} programme{" "}
                {counts.notes === 1 ? "note" : "notes"}
              </li>
              <li>
                {counts.recent} recently viewed {counts.recent === 1 ? "item" : "items"}, and where you left off
              </li>
            </ul>
            <p className="mt-3">
              Your library, resources and downloads are not affected, and nothing is sent anywhere. Any backup file you have
              already saved still works.
            </p>
          </div>

          <button
            type="button"
            onClick={backupFirst}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-og-charcoal px-4 text-sm font-semibold text-og-white hover:bg-og-deep"
          >
            <Icon name="download" className="size-5" />
            Back up my progress first
          </button>

          <div>
            <label htmlFor="start-again-confirm" className="block text-sm font-semibold text-og-charcoal">
              To confirm, type <span className="font-display tracking-wide">{CONFIRM_WORD}</span>
            </label>
            <input
              id="start-again-confirm"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="mt-2 h-11 w-full rounded-lg border border-og-taupe/40 bg-og-white px-3 text-sm text-og-charcoal focus:border-og-deep"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="button"
              onClick={eraseEverything}
              disabled={typed.trim().toUpperCase() !== CONFIRM_WORD}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-og-charcoal px-4 text-sm font-semibold text-og-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Erase my progress
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep"
            >
              Keep my progress
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

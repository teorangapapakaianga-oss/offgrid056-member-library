"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { backupFileName, createBackup, parseBackup, type BackupSummary } from "@/lib/member/backup";
import { memberStore, useMemberState } from "@/lib/member";

type Pending = { summary: BackupSummary; state: import("@/lib/member").MemberState } | null;

/**
 * Back up / restore member progress (owner decision D3).
 * A restore never changes anything until the member picks Merge or Replace, and an invalid file is rejected with
 * a plain-language reason.
 */
export function BackupRestore() {
  const { ready, state, storage } = useMemberState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [done, setDone] = useState<string | null>(null);

  const counts = {
    saved: Object.keys(state.saved).length,
    completed: Object.keys(state.completed).length,
    days: Object.values(state.programme.days).filter((d) => d.completed).length,
    notes: Object.values(state.programme.days).filter((d) => d.notes).length,
  };

  function download() {
    const backup = createBackup(state);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFileName();
    a.click();
    URL.revokeObjectURL(url);
    setDone(`Backup file created: ${backupFileName()}`);
    setError(null);
  }

  async function onFile(file: File) {
    setDone(null);
    setError(null);
    setPending(null);
    const text = await file.text();
    const result = parseBackup(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPending({ summary: result.summary, state: result.backup.state });
  }

  async function apply(mode: "merge" | "replace") {
    if (!pending) return;
    await memberStore.importState(pending.state, mode);
    setDone(
      mode === "merge"
        ? "Backup merged. Nothing you already had was removed."
        : "Progress replaced with the backup file.",
    );
    setPending(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section aria-labelledby="backup" className="rounded-xl bg-white p-5 ring-1 ring-og-line">
      <h2 id="backup" className="font-display text-2xl leading-none text-og-charcoal">
        Back up my progress
      </h2>
      <p className="mt-2 text-sm text-og-taupe">
        Your progress is kept in this browser only. Save a backup file to move it to another device, or to keep it safe
        if you clear your browser.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={download}
          disabled={!ready}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-og-charcoal px-4 text-sm font-semibold text-og-white hover:bg-og-deep disabled:opacity-60"
        >
          <Icon name="download" className="size-5" />
          Back up my progress
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={!ready}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep disabled:opacity-60"
        >
          <Icon name="start" className="size-5" />
          Restore from a backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose a backup file to restore"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </div>

      <p className="mt-3 text-xs text-og-taupe">
        This browser currently holds {counts.saved} saved, {counts.completed} completed, {counts.days} programme{" "}
        {counts.days === 1 ? "day" : "days"} and {counts.notes} {counts.notes === 1 ? "note" : "notes"}.
        {storage === "memory" && " Storage is unavailable in this browser, so a restore lasts only for this visit."}
      </p>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-og-taupe bg-og-white px-4 py-3 text-sm text-og-charcoal">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-deep" />
          <span>
            {error} <span className="text-og-taupe">Your current progress has not been changed.</span>
          </span>
        </p>
      )}

      {done && (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-lg bg-og-green/25 px-4 py-3 text-sm text-og-charcoal">
          <Icon name="check" className="mt-0.5 size-5 shrink-0 text-og-deep" />
          {done}
        </p>
      )}

      {pending && (
        <div className="mt-4 rounded-lg border border-og-deep/40 bg-og-white p-4">
          <p className="font-semibold text-og-charcoal">This backup contains:</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-og-graphite">
            <li>
              {pending.summary.saved} saved {pending.summary.saved === 1 ? "resource" : "resources"}
            </li>
            <li>
              {pending.summary.completed} completed {pending.summary.completed === 1 ? "resource" : "resources"}
            </li>
            <li>
              {pending.summary.programmeDays} completed programme {pending.summary.programmeDays === 1 ? "day" : "days"},{" "}
              {pending.summary.notes} with notes
            </li>
            <li>Made on {new Date(pending.summary.exportedAt).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}</li>
          </ul>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => apply("merge")}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-og-green px-4 text-sm font-semibold text-og-charcoal hover:brightness-95"
            >
              Merge with my progress (recommended)
            </button>
            <button
              type="button"
              onClick={() => apply("replace")}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep"
            >
              Replace my progress
            </button>
            <button
              type="button"
              onClick={() => {
                setPending(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-og-deep"
            >
              Cancel
            </button>
          </div>
          <p className="mt-3 text-xs text-og-taupe">
            Merge keeps everything you already have and adds anything the backup has. Replace discards your current
            progress in this browser.
          </p>
        </div>
      )}
    </section>
  );
}

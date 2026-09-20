"use client";
import { useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { memberStore, useCompletion, useMemberState, useSaved } from "@/lib/member";

/** Save / unsave a resource. Used on cards (compact) and on the detail page (full). */
export function SaveButton({ resourceId, title, compact = false }: { resourceId: string; title: string; compact?: boolean }) {
  const { ready, saved, toggle } = useSaved(resourceId);

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        title={saved ? "Saved" : "Save this resource"}
        className={`relative z-10 flex size-11 items-center justify-center rounded-lg backdrop-blur-sm transition ${
          saved ? "bg-og-green text-og-charcoal" : "bg-og-charcoal/55 text-og-white hover:bg-og-charcoal/80"
        }`}
      >
        <Icon name="saved" className={`size-5 ${saved ? "fill-current" : ""}`} />
        <span className="sr-only">{saved ? `Remove ${title} from saved` : `Save ${title}`}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      disabled={!ready}
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
        saved ? "bg-og-deep text-og-white" : "bg-white text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep"
      }`}
    >
      <Icon name="saved" className={`size-5 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save this resource"}
    </button>
  );
}

/** Mark a resource complete or not complete. Every progress view updates immediately. */
export function CompletionButton({ resourceId, disabled = false }: { resourceId: string; disabled?: boolean }) {
  const { ready, completed, toggle } = useCompletion(resourceId);
  if (disabled) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={completed}
      disabled={!ready}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
        completed ? "bg-og-green text-og-charcoal hover:brightness-95" : "bg-og-charcoal text-og-white hover:bg-og-deep"
      }`}
    >
      <Icon name={completed ? "check" : "check"} className="size-5" />
      {completed ? "Completed — mark as not complete" : "Mark as complete"}
    </button>
  );
}

/** Records that the member opened a resource (recently viewed + continue where you left off). */
export function RecordView({ resourceId }: { resourceId: string }) {
  useEffect(() => {
    void memberStore.recordView(resourceId);
  }, [resourceId]);
  return null;
}

/** Shown once when this browser cannot store progress, or when damaged data had to be reset. */
export function StorageNotice() {
  const { ready, storage, recovered } = useMemberState();
  if (!ready || (storage === "local" && !recovered)) return null;
  return (
    <p className="mb-5 flex items-start gap-2 rounded-lg border border-og-taupe/50 bg-white px-4 py-3 text-sm text-og-graphite">
      <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
      {storage === "memory" ? (
        <span>
          <strong>Your progress can&apos;t be saved in this browser.</strong> Saving, completion and programme notes will work while
          this tab is open, but they will be lost when you close it. This usually means private browsing or blocked site data.
        </span>
      ) : (
        <span>
          <strong>Your saved progress could not be read, so it has been reset.</strong> A copy of the unreadable data was kept in
          this browser. If you have a backup file, you can restore it from My Progress.
        </span>
      )}
    </p>
  );
}

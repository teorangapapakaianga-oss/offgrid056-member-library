"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PROVIDER_LABELS, parseVideo } from "@/lib/video";

/**
 * Click-to-play video (Stage 5).
 *
 * **No player is loaded until the member presses play**: until then the page contains only this panel, so no
 * YouTube or Vimeo code, cookies or requests are involved. YouTube uses the privacy-enhanced domain.
 * A placeholder URL (example.com, PLACEHOLDER) never embeds anything; it says so instead.
 */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideo(url);
  const label = PROVIDER_LABELS[video.provider];

  if (playing && video.embedUrl && !video.isPlaceholder) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-og-charcoal">
        {video.provider === "file" ? (
          // Captions are attached with the real video at import.
          <video src={video.embedUrl} controls autoPlay className="size-full" />
        ) : (
          <iframe
            src={video.embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full border-0"
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-og-charcoal p-6 text-center text-og-white">
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="flex size-16 items-center justify-center rounded-full bg-og-green text-og-charcoal transition hover:brightness-95"
      >
        <span className="sr-only">Play {title}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 size-8 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <p className="text-sm font-semibold">{playing && video.isPlaceholder ? "Demonstration video" : `Play (${label})`}</p>
      <p className="max-w-sm text-xs text-og-white/75">
        {playing && video.isPlaceholder
          ? "This is a placeholder entry, so there is no video to play yet. The real recording is added with the resource import."
          : "The video player only loads when you press play, so this page stays fast."}
      </p>
      {video.isPlaceholder && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-dashed border-og-white/50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide">
          <Icon name="info" className="size-3.5" />
          Demo
        </span>
      )}
    </div>
  );
}

/**
 * Video support (docs/ARCHITECTURE.md §12). Pure URL parsing, so the player is never needed to work out what a
 * link is. Nothing here loads a player: the component only builds an embed when the member presses play.
 */
export type VideoProvider = "youtube" | "vimeo" | "file" | "unknown";

export interface ParsedVideo {
  provider: VideoProvider;
  id: string | null;
  /** Built only when the member chooses to play. YouTube uses the privacy-enhanced domain. */
  embedUrl: string | null;
  watchUrl: string;
  /** true when the URL is obviously a stand-in (example.com, PLACEHOLDER), so the UI says so instead of embedding */
  isPlaceholder: boolean;
}

const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"];
const VIMEO_HOSTS = ["vimeo.com", "www.vimeo.com", "player.vimeo.com"];
const VIDEO_FILE = /\.(mp4|webm|ogv|ogg|mov)(\?.*)?$/i;

export function parseVideo(url: string): ParsedVideo {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return { provider: "unknown", id: null, embedUrl: null, watchUrl: url, isPlaceholder: true };
  }

  const host = u.hostname.toLowerCase();
  const placeholder = /(^|\.)example\.(com|org|net)$/.test(host) || /placeholder/i.test(url) || /^0+$/.test(u.pathname.replace(/\D/g, ""));

  if (YOUTUBE_HOSTS.includes(host)) {
    const id = host === "youtu.be" ? u.pathname.slice(1) : (u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop() ?? null);
    return {
      provider: "youtube",
      id,
      embedUrl: id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1` : null,
      watchUrl: url,
      isPlaceholder: placeholder,
    };
  }

  if (VIMEO_HOSTS.includes(host)) {
    const id = u.pathname.split("/").filter(Boolean).pop() ?? null;
    return {
      provider: "vimeo",
      id,
      embedUrl: id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}?autoplay=1&dnt=1` : null,
      watchUrl: url,
      isPlaceholder: placeholder,
    };
  }

  if (VIDEO_FILE.test(u.pathname)) {
    return { provider: "file", id: null, embedUrl: url, watchUrl: url, isPlaceholder: placeholder };
  }

  return { provider: "unknown", id: null, embedUrl: null, watchUrl: url, isPlaceholder: true };
}

export const PROVIDER_LABELS: Record<VideoProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  file: "Video file",
  unknown: "Video link",
};

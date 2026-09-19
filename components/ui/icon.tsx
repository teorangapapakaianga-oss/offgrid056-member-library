/** Interface glyphs (24 × 24, stroke). Decorative by default: pair with visible text or an aria-label. */
const PATHS = {
  home: "M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9",
  start: "M5 4v16M5 4h11l-2 4 2 4H5",
  library: "M4 5h5v15H4zM10 5h5v15h-5zM16 6l4 1-3 13-4-1",
  foundations: "M4 20h16M6 20V10l6-5 6 5v10M10 20v-5h4v5",
  planning: "M7 3v3M17 3v3M4 7h16v13H4zM8 12h3M8 16h8",
  programme: "M4 5h16v15H4zM4 10h16M9 5v5M8 14l2 2 4-4",
  packs: "M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8",
  video: "M4 6h12v12H4zM16 10l4-2v8l-4-2",
  suppliers: "M4 9l2-5h12l2 5M4 9h16v11H4zM9 20v-6h6v6",
  workshops: "M4 6h16v10H4zM8 20h8M12 16v4",
  downloads: "M12 4v11M7 10l5 5 5-5M5 20h14",
  saved: "M6 4h12v16l-6-4-6 4z",
  progress: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  search: "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM16 16l5 5",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  filter: "M4 6h16M7 12h10M10 18h4",
  clock: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 7v5l3 2",
  check: "M5 12l5 5 9-10",
  chevronRight: "M9 5l7 7-7 7",
  chevronDown: "M5 9l7 7 7-7",
  arrowRight: "M4 12h15M13 6l6 6-6 6",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  info: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 11v6M12 7.5v.5",
  sparkle: "M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "size-5", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

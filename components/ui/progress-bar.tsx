export function ProgressBar({
  value,
  label,
  tone = "light",
  className = "",
}: {
  value: number;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={`h-2.5 w-full overflow-hidden rounded-full ${tone === "dark" ? "bg-og-white/15" : "bg-og-taupe/20"} ${className}`}
    >
      <div className="h-full rounded-full bg-og-green transition-[width] duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}

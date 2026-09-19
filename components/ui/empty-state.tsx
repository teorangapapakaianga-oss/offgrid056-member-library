import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";

export function EmptyState({
  icon = "info",
  title,
  children,
  action,
  compact = false,
}: {
  icon?: IconName;
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string } | ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center rounded-xl border border-dashed border-og-taupe/40 bg-white/60 text-center ${compact ? "gap-2 p-5" : "gap-3 px-6 py-10"}`}>
      <span className="flex size-11 items-center justify-center rounded-full bg-og-white text-og-deep ring-1 ring-og-line">
        <Icon name={icon} className="size-5" />
      </span>
      <p className="font-semibold text-og-charcoal">{title}</p>
      {children && <div className="max-w-md text-sm text-og-taupe">{children}</div>}
      {action &&
        (typeof action === "object" && action !== null && "href" in action ? (
          <Link href={action.href} className="mt-1 inline-flex items-center gap-2 rounded-lg bg-og-green px-4 py-2 text-sm font-semibold text-og-charcoal hover:brightness-95">
            {action.label}
            <Icon name="arrowRight" className="size-4" />
          </Link>
        ) : (
          action
        ))}
    </div>
  );
}

import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  icon?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element -- static export, local SVG
          <img src={icon} alt="" width={64} height={64} className="size-14 shrink-0 sm:size-16" />
        )}
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-og-deep">{eyebrow}</p>}
          <h1 className="font-display text-4xl leading-none text-og-charcoal sm:text-5xl">{title}</h1>
          {description && <div className="mt-2 max-w-2xl text-og-graphite/90">{description}</div>}
        </div>
      </div>
      {children}
    </header>
  );
}

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Dashboard", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-og-taupe">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="inline-flex min-h-6 items-center gap-1">
              {i > 0 && <Icon name="chevronRight" className="size-3.5 opacity-60" />}
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-og-charcoal" : ""}>
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="inline-flex min-h-6 items-center px-0.5 underline-offset-2 hover:text-og-deep hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

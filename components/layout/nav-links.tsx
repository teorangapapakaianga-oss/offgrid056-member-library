"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import { NAV_GROUPS, isActive, type NavIconName } from "@/lib/navigation";

const FOUNDATION_ICONS = new Set<NavIconName>(["air", "water", "shelter", "food", "energy"]);

function NavGlyph({ icon }: { icon: NavIconName }) {
  if (FOUNDATION_ICONS.has(icon)) {
    // eslint-disable-next-line @next/next/no-img-element -- local brand SVG
    return <img src={`/icons/og-icon-${icon}.svg`} alt="" width={20} height={20} className="size-5 shrink-0" />;
  }
  return <Icon name={icon as IconName} className="size-5 shrink-0" />;
}

/** The full member navigation, used by the desktop sidebar and the tablet/mobile drawer (both dark). */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  return (
    <div className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-og-white/55">{group.label}</p>
          <ul role="list" className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-og-green font-semibold text-og-charcoal"
                        : "text-og-white/85 hover:bg-og-graphite hover:text-og-white"
                    }`}
                  >
                    <NavGlyph icon={item.icon} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Member navigation: one definition used by the sidebar, the drawer and the mobile bottom bar. */
export type NavIconName =
  | "home" | "start" | "library" | "foundations" | "planning" | "programme" | "packs"
  | "video" | "suppliers" | "workshops" | "downloads" | "saved" | "progress"
  | "air" | "water" | "shelter" | "food" | "energy";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconName;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Library",
    items: [
      { href: "/", label: "Dashboard", icon: "home" },
      { href: "/start-here/", label: "Start Here", icon: "start" },
      { href: "/library/", label: "All Resources", icon: "library" },
    ],
  },
  {
    label: "Five Foundations",
    items: [
      { href: "/foundations/air/", label: "Air", icon: "air" },
      { href: "/foundations/water/", label: "Water", icon: "water" },
      { href: "/foundations/shelter/", label: "Shelter", icon: "shelter" },
      { href: "/foundations/food/", label: "Food", icon: "food" },
      { href: "/foundations/energy/", label: "Energy", icon: "energy" },
    ],
  },
  {
    label: "Tools & Programme",
    items: [
      { href: "/planning-tools/", label: "Planning Tools", icon: "planning" },
      { href: "/learning-paths/", label: "Learning Paths", icon: "foundations" },
      { href: "/programme/", label: "30-Day Programme", icon: "programme" },
      { href: "/packs/", label: "Resource Packs", icon: "packs" },
      { href: "/videos/", label: "Videos & Tutorials", icon: "video" },
      { href: "/downloads/", label: "Member Downloads", icon: "downloads" },
    ],
  },
  {
    label: "Directory",
    items: [
      { href: "/suppliers/", label: "Suppliers & Services", icon: "suppliers" },
      { href: "/workshops/", label: "Workshops & Events", icon: "workshops" },
    ],
  },
  {
    label: "My Library",
    items: [
      { href: "/saved/", label: "Saved", icon: "saved" },
      { href: "/progress/", label: "My Progress", icon: "progress" },
    ],
  },
];

export const MOBILE_BAR: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/library/", label: "Library", icon: "library" },
  { href: "/programme/", label: "Programme", icon: "programme" },
  { href: "/saved/", label: "Saved", icon: "saved" },
];

/** Active if exact match, or a section prefix (never "/" as a prefix). */
export function isActive(pathname: string, href: string): boolean {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (href === "/") return p === "/";
  return p === href || p.startsWith(href);
}

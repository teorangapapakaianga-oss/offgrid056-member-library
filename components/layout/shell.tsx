"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { MOBILE_BAR, isActive } from "@/lib/navigation";
import { NavLinks } from "./nav-links";

const DrawerContext = createContext<{ open: () => void }>({ open: () => {} });

/**
 * Client shell: header (tablet/mobile logo, menu button, search), the navigation drawer (native <dialog>:
 * focus trap, Esc to close and focus return come from the browser), and the mobile bottom bar.
 */
export function ShellChrome({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname() ?? "/";
  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  // Close the drawer after navigation.
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <DrawerContext.Provider value={{ open }}>
      <AppHeader />
      {children}
      <MobileNavigation />
      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="og-drawer on-dark m-0 h-dvh max-h-dvh w-[min(20rem,88vw)] max-w-none bg-og-charcoal p-0 text-og-white"
        onClick={(e) => {
          if (e.target === e.currentTarget) close(); // backdrop click
        }}
        onKeyDown={(e) => {
          // Browsers close modal dialogs on Esc, but not in every case (e.g. without user activation); be explicit.
          if (e.key === "Escape") {
            e.preventDefault();
            close();
          }
        }}
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 pb-8">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-og-charcoal py-3 pl-3">
            <p className="font-display text-2xl text-og-white">Menu</p>
            <button type="button" autoFocus onClick={close} className="flex size-11 items-center justify-center rounded-lg hover:bg-og-graphite" aria-label="Close menu">
              <Icon name="close" className="size-6" />
            </button>
          </div>
          <nav aria-label="Main">
            <NavLinks onNavigate={close} />
          </nav>
        </div>
      </dialog>
    </DrawerContext.Provider>
  );
}

function AppHeader() {
  const { open } = useContext(DrawerContext);
  const pathname = usePathname() ?? "/";
  const [searchOpen, setSearchOpen] = useState(false);
  const onLibrary = pathname.startsWith("/library");

  return (
    <header className="sticky top-0 z-30 border-b border-og-line bg-og-white/95 backdrop-blur supports-[backdrop-filter]:bg-og-white/85">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={open}
          className="flex size-11 items-center justify-center rounded-lg text-og-charcoal hover:bg-white lg:hidden"
          aria-label="Open menu"
          aria-haspopup="dialog"
        >
          <Icon name="menu" className="size-6" />
        </button>
        <Link href="/" className="block w-32 shrink-0 rounded-md sm:w-36 lg:hidden" aria-label="OffGrid056 Member Library, dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element -- approved Design A compact logo (PNG) */}
          <img src="/brand/offgrid056-logo-compact.png" alt="" width={440} height={158} className="h-auto w-full" />
        </Link>

        {!onLibrary && <HeaderSearch className="ml-auto hidden w-full max-w-md md:flex" />}

        <div className={`ml-auto flex items-center gap-1 ${onLibrary ? "" : "md:ml-2"}`}>
          {!onLibrary && (
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex size-11 items-center justify-center rounded-lg text-og-charcoal hover:bg-white md:hidden"
              aria-label={searchOpen ? "Close search" : "Search the library"}
              aria-expanded={searchOpen}
              aria-controls="mobile-search"
            >
              <Icon name={searchOpen ? "close" : "search"} className="size-6" />
            </button>
          )}
          <Link
            href="/saved/"
            className="hidden size-11 items-center justify-center rounded-lg text-og-charcoal hover:bg-white md:flex"
            aria-label="Saved resources"
          >
            <Icon name="saved" className="size-6" />
          </Link>
        </div>
      </div>
      {searchOpen && !onLibrary && (
        <div id="mobile-search" className="border-t border-og-line px-4 py-3 md:hidden">
          <HeaderSearch autoFocus className="flex w-full" />
        </div>
      )}
    </header>
  );
}

/** Plain GET form to /library/?q=… : works before JavaScript loads, and is shareable. */
function HeaderSearch({ className = "", autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  return (
    <form role="search" action="/library/" method="get" className={`relative items-center ${className}`}>
      <label htmlFor={autoFocus ? "q-mobile" : "q-header"} className="sr-only">
        Search the library
      </label>
      <Icon name="search" className="pointer-events-none absolute left-3 size-5 text-og-taupe" />
      <input
        id={autoFocus ? "q-mobile" : "q-header"}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search guides, checklists, topics…"
        className="h-11 w-full rounded-lg border border-og-taupe/35 bg-white pr-3 pl-10 text-sm text-og-charcoal placeholder:text-og-taupe focus:border-og-deep"
      />
    </form>
  );
}

function MobileNavigation() {
  const { open } = useContext(DrawerContext);
  const pathname = usePathname() ?? "/";
  return (
    <nav
      aria-label="Quick"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-og-graphite bg-og-charcoal pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul role="list" className="on-dark grid grid-cols-5">
        {MOBILE_BAR.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold ${active ? "text-og-green" : "text-og-white/80"}`}
              >
                <Icon name={item.icon as IconName} className="size-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold text-og-white/80"
          >
            <Icon name="menu" className="size-6" />
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}

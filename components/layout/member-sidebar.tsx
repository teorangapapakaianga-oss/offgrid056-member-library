import Link from "next/link";
import { MarketIndicator } from "@/components/member/market-controls";
import { NavLinks } from "./nav-links";

/** Desktop (≥ 1024 px) persistent sidebar. Tablet and mobile use the drawer instead. */
export function MemberSidebar() {
  return (
    <aside
      aria-label="Member library"
      className="on-dark sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto bg-og-charcoal px-3 pb-6 lg:flex"
    >
      <Link href="/" className="mx-auto mt-4 mb-6 block w-44 rounded-md" aria-label="OffGrid056 Member Library, dashboard">
        {/* eslint-disable-next-line @next/next/no-img-element -- approved Design A logo (PNG), static export */}
        <img src="/brand/offgrid056-logo-primary-dark.png" alt="" width={480} height={312} className="h-auto w-full" />
      </Link>
      <p className="mb-6 px-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-og-green">
        Member Resource Library
      </p>
      <nav aria-label="Main">
        <NavLinks />
      </nav>
      {/* Quiet, always reachable, and deliberately not styled like an account or a sign-in. */}
      <MarketIndicator className="mt-auto px-3 pt-6" />
    </aside>
  );
}

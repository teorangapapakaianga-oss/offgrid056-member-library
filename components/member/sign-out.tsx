"use client";

/**
 * Sign out of the Library: a visible control in the navigation (desktop sidebar, tablet/mobile drawer) that asks first, then follows
 * Cloudflare Access's own logout path.
 *
 * Deliberately:
 *  - a plain <a>, never next/link: a link component can prefetch, and a prefetched logout would sign the member out without a click
 *  - the logout link exists only after the member opens the confirmation, so it is never in the static HTML
 *  - the confirmation says plainly that Access signs the member out of every application behind the same login
 *  - nothing is cleared locally: saved items and progress stay in this browser (they are not an account)
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ACCESS_LOGOUT_PATH } from "@/lib/member/access";

export function SignOutControl({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Keyboard and screen-reader users: focus moves to Cancel (the safe choice) when the confirmation opens, and back to Sign out when it closes.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
    else if (wasOpen.current) openRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (!open) {
    return (
      <div className={className}>
        <button
          ref={openRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-og-white/30 px-3 py-2 text-sm font-semibold text-og-white transition hover:border-og-green hover:bg-og-graphite"
        >
          <Icon name="signOut" className="size-5 shrink-0" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={className} role="group" aria-label="Confirm sign out" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <div className="rounded-lg border border-og-white/30 bg-og-graphite p-3 text-og-white">
        <p className="text-sm font-semibold">Sign out of OffGrid056?</p>
        <p className="mt-1 text-xs leading-relaxed text-og-white/85">
          This ends your secure Cloudflare Access sign-in. Access signs you out of <strong className="font-semibold">every application protected by the same login</strong>, so you
          may need to sign in again elsewhere too. Your saved items and progress stay in this browser.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={ACCESS_LOGOUT_PATH}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-og-green px-4 text-sm font-semibold text-og-charcoal hover:brightness-110"
          >
            <Icon name="signOut" className="size-4" />
            Sign out now
          </a>
          <button
            type="button"
            ref={cancelRef}
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-og-white/30 px-4 text-sm font-semibold text-og-white hover:bg-og-charcoal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

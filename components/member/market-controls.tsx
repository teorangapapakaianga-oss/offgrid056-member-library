"use client";

/**
 * Market selection.
 *
 * The member chooses; nothing is inferred. There is no IP lookup, no locale sniffing and no silent switching —
 * a wrong market here means the wrong emergency number, which is worse than asking.
 *
 * Three pieces:
 *  - `MarketIndicator`  — a quiet line saying which market is in use, with a way to change it
 *  - `MarketChooser`    — the first-visit prompt, shown before market-dependent content is opened
 *  - `MarketGate`       — wraps content that cannot be shown safely until a market is chosen
 */
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { memberStore, useMemberState } from "@/lib/member";
import { MARKETS, marketName, type MarketCode } from "@/lib/member/market";

function MarketButtons({ onChoose, current }: { onChoose: (code: MarketCode) => void; current?: MarketCode | null }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {MARKETS.map((m) => (
        <button
          key={m.code}
          type="button"
          onClick={() => onChoose(m.code)}
          aria-current={current === m.code ? "true" : undefined}
          className={`rounded-lg border px-4 py-3 text-left transition-colors ${
            current === m.code
              ? "border-og-deep bg-og-deep text-og-white"
              : "border-og-line bg-white text-og-charcoal hover:border-og-deep"
          }`}
        >
          <span className="block font-semibold">{m.name}</span>
          <span className={`block text-xs ${current === m.code ? "text-og-white/80" : "text-og-taupe"}`}>{m.summary}</span>
        </button>
      ))}
    </div>
  );
}

/** The quiet, always-available indicator. Deliberately not styled like an account or a sign-in. */
export function MarketIndicator({ className = "" }: { className?: string }) {
  const view = useMemberState();
  const [open, setOpen] = useState(false);
  const market = view.state.market?.code ?? null;

  if (!view.ready) return null;

  return (
    <div className={className}>
      {open ? (
        <div className="rounded-lg border border-og-line bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-og-taupe">Choose your market</p>
          <MarketButtons
            current={market}
            onChoose={(code) => {
              void memberStore.setMarket(code);
              setOpen(false);
            }}
          />
          <button type="button" onClick={() => setOpen(false)} className="mt-2 text-xs text-og-taupe underline">
            Cancel
          </button>
        </div>
      ) : (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-og-taupe">
          <Icon name="foundations" className="size-4" aria-hidden="true" />
          <span>
            Market: <strong className="font-semibold text-og-charcoal">{market ? marketName(market) : "not set"}</strong>
          </span>
          <button type="button" onClick={() => setOpen(true)} className="underline hover:text-og-deep">
            {market ? "Change" : "Choose"}
          </button>
        </p>
      )}
    </div>
  );
}

/**
 * Shown when the member has not chosen yet and is about to open market-dependent content.
 *
 * It explains why it is asking, because "pick a country" with no reason invites a careless answer.
 */
export function MarketChooser({ onChosen }: { onChosen?: (code: MarketCode) => void }) {
  return (
    <section className="rounded-xl border border-og-green bg-white p-5" aria-labelledby="market-chooser-heading">
      <h2 id="market-chooser-heading" className="font-display text-2xl text-og-charcoal">
        Which market are you in?
      </h2>
      <p className="mb-4 mt-1 text-sm text-og-graphite">
        Choose your market so OffGrid056 can show the correct emergency numbers, safety guidance and local resources.
      </p>
      <MarketButtons
        onChoose={(code) => {
          void memberStore.setMarket(code);
          onChosen?.(code);
        }}
      />
      <p className="mt-3 text-xs text-og-taupe">
        This is kept in this browser only. It is not an account, and your location is never detected or stored. You can
        change it at any time.
      </p>
    </section>
  );
}

/**
 * Wraps content that depends on the member's market.
 *
 * Two ways it refuses to show something:
 *  - no market chosen yet → ask
 *  - a market is chosen but this resource has nothing verified for it → say so plainly
 *
 * It never falls back to another country's guidance. That is the whole point.
 */
export function MarketGate({
  availableMarkets,
  children,
}: {
  /** markets this content has verified guidance for; omit when the content is the same everywhere */
  availableMarkets?: MarketCode[];
  children: (market: MarketCode | null) => React.ReactNode;
}) {
  const view = useMemberState();
  const market = view.state.market?.code ?? null;

  if (!view.ready) return <div className="h-24 animate-pulse rounded-lg bg-og-taupe/10" aria-hidden="true" />;
  if (!market) return <MarketChooser />;

  if (availableMarkets && !availableMarkets.includes(market)) {
    return (
      <div className="rounded-lg border border-og-taupe bg-og-white p-4 text-sm text-og-graphite">
        <p className="mb-1 font-semibold text-og-charcoal">Not available for {marketName(market)} yet</p>
        <p>
          The guidance in this resource — emergency numbers, agencies and safety wording — is still being verified for{" "}
          {marketName(market)}. We would rather show you nothing than show you another country&rsquo;s answer.
        </p>
      </div>
    );
  }

  return <>{children(market)}</>;
}

/**
 * The member's market.
 *
 * A market decides which emergency number, agency, safety wording and download a member is shown. Getting it
 * wrong is not a cosmetic problem — telling an Australian member to dial 111 is worse than telling them
 * nothing — so the market is always **chosen by the member**, never inferred.
 *
 * Deliberately not done, and not to be added later without a decision:
 *  - no IP or geolocation lookup
 *  - no locale sniffing
 *  - no silent switching
 *
 * Plain types and constants only: this module is loaded by the browser, like the rest of `lib/member`.
 */

export const MARKET_CODES = ["NZ", "AU"] as const;

/** Markets the library can serve today. US and CA are designed for but not yet verified. */
export type MarketCode = (typeof MARKET_CODES)[number];

/** Every market the architecture anticipates, including ones not yet offered. */
export const PLANNED_MARKET_CODES = ["NZ", "AU", "US", "CA"] as const;
export type PlannedMarketCode = (typeof PLANNED_MARKET_CODES)[number];

export interface MarketOption {
  code: MarketCode;
  name: string;
  /** what changes for this member, in one line, so the choice is meaningful rather than a flag */
  summary: string;
}

export const MARKETS: MarketOption[] = [
  { code: "NZ", name: "New Zealand", summary: "Emergency 111 · Civil Defence · litres" },
  { code: "AU", name: "Australia", summary: "Emergency 000 · State Emergency Service · litres" },
];

export const isMarketCode = (v: unknown): v is MarketCode => typeof v === "string" && (MARKET_CODES as readonly string[]).includes(v);

export const marketName = (code: MarketCode): string => MARKETS.find((m) => m.code === code)?.name ?? code;

/** What the member chose, and when — the timestamp is what makes merging two devices decidable. */
export interface MarketChoice {
  code: MarketCode;
  at: string;
}

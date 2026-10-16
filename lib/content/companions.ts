/**
 * Editable companions (Stage 11.0J). Pure helpers, shared by the resource page and the tests.
 *
 * A companion is only ever shown for the member's CHOSEN market and only when that market has its own PDF: there is no choice between countries and no fallback.
 */
import type { MarketCode } from "@/lib/member/market";

export interface CompanionFile {
  fileUrl: string;
  format: string;
  sizeBytes: number | null;
}

/** Exactly one edition for the chosen market: its PDF and (if any) its editable version. Never another market's file. */
export function editionForMarket<F>(
  files: Partial<Record<MarketCode, F>>,
  companions: Partial<Record<MarketCode, CompanionFile>> | undefined,
  market: MarketCode | null,
): { file: F; companion: CompanionFile | null } | null {
  if (!market) return null;
  const file = files[market];
  if (!file) return null;
  return { file, companion: companionForMarket(companions, files, market) };
}

/** The editable version for this market, or null. Never another market's, and never one without its PDF. */
export function companionForMarket(
  companions: Partial<Record<MarketCode, CompanionFile>> | undefined,
  pdfs: Partial<Record<MarketCode, unknown>>,
  market: MarketCode | null,
): CompanionFile | null {
  if (!market || !companions || !pdfs[market]) return null;
  return companions[market] ?? null;
}

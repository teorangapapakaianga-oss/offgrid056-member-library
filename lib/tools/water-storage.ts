/**
 * The Water Storage Calculator's arithmetic, as printed in the resource (OG-08), so it can be tested.
 *
 * Official emergency baselines (owner-approved drinking-water guidance):
 * - NZ: at least 3 L of drinking water per person per day, for at least 3 days (Get Ready).
 * - AU: at least 10 L of drinking water per person for 3 days — a three-day total, not a daily rate (for example
 *   Get Ready Queensland; states and territories may advise more).
 * Longer periods are OffGrid056 planning, not official figures: NZ keeps the daily rate for more days; AU scales the
 * three-day total (× days ÷ 3). Every total rounds up to the next whole litre.
 */
export type WaterMarket = "NZ" | "AU";

export const OFFICIAL_BASELINE_DAYS = 3;

/** Litres needed for `people` over `days`, rounded up. */
export function litresNeeded(market: WaterMarket, people: number, days: number): number {
  if (people < 0 || days < 0) throw new RangeError("people and days cannot be negative");
  const exact = market === "NZ" ? people * 3 * days : (people * 10 * days) / OFFICIAL_BASELINE_DAYS;
  // Guard against floating-point noise (e.g. 400.00000000000006) before rounding up.
  return Math.ceil(Math.round(exact * 1e9) / 1e9);
}

/** Whether a period is the official baseline or OffGrid056 extended planning. */
export function periodBasis(days: number): "official-baseline" | "offgrid056-planning" {
  return days === OFFICIAL_BASELINE_DAYS ? "official-baseline" : "offgrid056-planning";
}

/** Gap = max(Need − Have, 0); a surplus only when Have exceeds Need. */
export function storageGap(need: number, have: number): { gap: number; surplus: number } {
  return { gap: Math.max(need - have, 0), surplus: Math.max(have - need, 0) };
}

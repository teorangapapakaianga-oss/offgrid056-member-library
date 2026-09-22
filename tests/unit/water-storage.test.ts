import { describe, expect, it } from "vitest";
import { litresNeeded, periodBasis, storageGap } from "@/lib/tools/water-storage";

/** Stage 9.38. The Water Storage Calculator's printed formulas (OG-08), NZ and AU, and the gap rule. */
describe("water storage calculator", () => {
  it("NZ: 3 L per person per day", () => {
    expect([3, 7, 14, 30].map((d) => litresNeeded("NZ", 4, d))).toEqual([36, 84, 168, 360]);
  });

  it("AU: 10 L per person for three days — not per day — scaled and rounded up for longer periods", () => {
    expect(litresNeeded("AU", 4, 3)).toBe(40);
    expect([7, 14, 30].map((d) => litresNeeded("AU", 4, d))).toEqual([94, 187, 400]);
    expect(litresNeeded("AU", 1, 3)).toBe(10);
    expect(litresNeeded("AU", 1, 3)).not.toBe(30); // never 10 L per person per day
  });

  it("marks only the three-day row as the official baseline", () => {
    expect([3, 7, 14, 30].map(periodBasis)).toEqual(["official-baseline", "offgrid056-planning", "offgrid056-planning", "offgrid056-planning"]);
  });

  it("never shows a negative gap: Gap = max(Need − Have, 0), with a surplus only when positive", () => {
    expect(storageGap(40, 60)).toEqual({ gap: 0, surplus: 20 });
    expect(storageGap(40, 25)).toEqual({ gap: 15, surplus: 0 });
    expect(storageGap(40, 40)).toEqual({ gap: 0, surplus: 0 });
  });
});

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadNumericRegistry, scanNumericClaims } from "@/admin-import/audit/numeric";
import { loadTreatmentRegistry } from "@/admin-import/audit/treatment";
import { extractText, detectFileType } from "@/admin-import/parsers/index";

/**
 * Stage 11.0J — a household review rhythm ("Weekly / quick reset", "Annual / full review") is a planning label, not a technical service interval.
 * The rule is narrow: only these labelled rhythms, and never when the same sentence prescribes technical work.
 */
const root = process.cwd();
const registry = loadNumericRegistry(path.join(root, "admin-import/config/numeric-claims.json"));
const treatment = loadTreatmentRegistry(path.join(root, "admin-import/config/treatment-sources.json"));
const scan = (text: string) => scanNumericClaims(`<p>${text}</p>`, { resource: "OG-B15", market: "NZ", registry, treatment });
const buckets = (text: string) => scan(text).map((c) => `${c.figure}:${c.bucket[0]}`);

describe("Stage 11.0J · planning review rhythm", () => {
  it("is not a claim: the four approved review-rhythm rows", () => {
    expect(buckets("Weekly / quick reset What changed?")).toEqual(["Weekly:D"]);
    expect(buckets("Monthly / household check Look across all five foundations and close simple gaps.")).toEqual(["Monthly:D"]);
    expect(buckets("Annual / full review Reassess the household, contacts, plans, records and professional service due dates.")).toEqual(["Annual:D"]);
    expect(buckets("Annual resilience review Use this once a year, or after a major change, to reset the household plan rather than simply repeating last year’s assumptions.").sort()).toEqual(["Annual:D", "once a year:D"]);
  });
  it("stays a claim when the sentence prescribes technical work", () => {
    expect(buckets("Monthly / household check: replace the smoke alarm battery.")).toEqual(["Monthly:C"]);
    expect(buckets("Annual / full review: inspect the chimney and replace the batteries.")).toEqual(["Annual:C"]);
    expect(buckets("Weekly / quick reset: test the smoke alarm.")).toEqual(["Weekly:C"]);
    expect(buckets("Annual / full review: service the generator.")).toEqual(["Annual:C"]);
  });
  it("is unchanged for ordinary technical cadence wording", () => {
    expect(buckets("Service the generator annually.")).toEqual(["annually:C"]);
    expect(buckets("Replace the smoke alarm battery once a year.")).toEqual(["once a year:C"]);
    expect(buckets("Test the alarm monthly.")).toEqual(["monthly:C"]);
    expect(buckets("Inspect the chimney every year.")).toEqual(["every year:C"]);
  });
  const pdfs = path.join(root, "private-assets/resources");
  it.skipIf(!fs.existsSync(pdfs))("clears Bucket C on the real staged B15 editions, with every decision recorded", async () => {
    for (const m of ["NZ", "AU"] as const) {
      const file = path.resolve(pdfs, `seasonal-review-and-annual-service-log.${m}.pdf`);
      const { text } = await extractText(file, detectFileType(file, ".pdf"), 400000);
      const c = scanNumericClaims(text.replace(/\s+/g, " "), { resource: "OG-B15", market: m, registry, treatment });
      expect(c.filter((x) => x.bucket === "C_NEEDS_SOURCE"), m).toEqual([]);
      expect(c.filter((x) => /review-rhythm|review rhythm/.test(x.why)).map((x) => x.figure).sort(), m).toEqual(["Annual", "Annual", "Monthly", "Weekly", "once a year"]);
    }
  }, 60000);
});

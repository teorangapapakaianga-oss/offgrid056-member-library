import type { Difficulty } from "@/lib/content/constants";

/** 8 → "8 min" · 60 → "1 h" · 90 → "1 h 30 min" */
export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const TIME_BANDS = [
  { id: "under-10", label: "Under 10 minutes", test: (m: number) => m < 10 },
  { id: "10-30", label: "10–30 minutes", test: (m: number) => m >= 10 && m <= 30 },
  { id: "30-60", label: "30–60 minutes", test: (m: number) => m > 30 && m <= 60 },
  { id: "60-plus", label: "1 hour+", test: (m: number) => m > 60 },
] as const;
export type TimeBandId = (typeof TIME_BANDS)[number]["id"];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const NEW_WINDOW_DAYS = 30;

/** "New" = manual override, else published within the last 30 days. Always evaluated in the browser. */
export function isNewResource(r: { newOverride: boolean | null; publishedDate: string }, now: Date): boolean {
  if (r.newOverride !== null) return r.newOverride;
  const published = new Date(r.publishedDate).getTime();
  const age = now.getTime() - published;
  return age >= 0 && age <= NEW_WINDOW_DAYS * 86_400_000;
}

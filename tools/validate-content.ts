/**
 * Content validation. Runs before every build (npm run validate / prebuild).
 * A broken entry fails here with a readable message instead of breaking a page.
 *
 *   npm run validate              check all content
 *   npm run validate -- --release fail if any placeholder/demo content remains (for a real launch)
 */
import fs from "node:fs";
import path from "node:path";
import { ContentError, getProgramme, getProgrammeDays, loadAllResourceFiles, loadLearningPaths } from "../lib/content/repository";
import { getCategory } from "../lib/content/taxonomy";
import { PROGRAMME_DAYS } from "../lib/member/types";

const release = process.argv.includes("--release");
const errors: string[] = [];
const warnings: string[] = [];

try {
  const all = loadAllResourceFiles();
  const paths = loadLearningPaths();
  const ids = new Map<string, string>();
  const slugs = new Map<string, string>();
  const published = new Set(all.filter((r) => r.status === "published").map((r) => r.id));
  const pathIds = new Set(paths.map((p) => p.id));

  for (const r of all) {
    const at = `resources/${r.slug}.json`;
    if (ids.has(r.id)) errors.push(`${at}: id "${r.id}" is already used by ${ids.get(r.id)}`);
    ids.set(r.id, at);
    if (slugs.has(r.slug)) errors.push(`${at}: slug "${r.slug}" is already used by ${slugs.get(r.slug)}`);
    slugs.set(r.slug, at);
    if (!getCategory(r.foundation, r.category)) errors.push(`${at}: category "${r.category}" is not a category of foundation "${r.foundation}"`);
    for (const id of [...r.relatedResources, ...(r.packItems ?? [])]) {
      if (!ids.has(id) && !all.some((x) => x.id === id)) errors.push(`${at}: references unknown resource "${id}"`);
      else if (r.status === "published" && !published.has(id)) warnings.push(`${at}: references "${id}", which is not published`);
    }
    if (r.relatedResources.includes(r.id)) errors.push(`${at}: lists itself as related`);
    if (r.learningPath && !pathIds.has(r.learningPath)) errors.push(`${at}: unknown learningPath "${r.learningPath}"`);
    for (const url of [r.fileUrl, r.thumbnail?.src]) {
      if (url?.startsWith("/") && !fs.existsSync(path.join(process.cwd(), "public", url))) errors.push(`${at}: file not found: public${url}`);
    }
    if (r.fileUrl?.startsWith("https://") && !r.fileSizeBytes) warnings.push(`${at}: remote file has no fileSizeBytes`);
    if (release && r.isPlaceholder && r.status === "published") errors.push(`${at}: placeholder content in a release build`);
  }
  for (const p of paths) {
    for (const id of p.steps) if (!published.has(id)) errors.push(`learning-paths/${p.id}.json: step "${id}" is not a published resource`);
  }

  // 30-Day Programme: all 30 days present exactly once, every linked resource real
  const programme = getProgramme();
  const days = getProgrammeDays();
  const dayNumbers = days.map((d) => d.day);
  for (let n = 1; n <= PROGRAMME_DAYS; n++) {
    const found = dayNumbers.filter((d) => d === n).length;
    if (found === 0) errors.push(`programme: day ${n} is missing`);
    if (found > 1) errors.push(`programme: day ${n} is defined ${found} times`);
  }
  const weekDays = programme.weeks.flatMap((w) => w.days);
  if (new Set(weekDays).size !== PROGRAMME_DAYS) errors.push(`programme.json: weeks must cover days 1–${PROGRAMME_DAYS} exactly once`);
  for (const d of days) {
    const at = `programme/days/day-${String(d.day).padStart(2, "0")}.json`;
    if (!programme.weeks.some((w) => w.number === d.week && w.days.includes(d.day))) errors.push(`${at}: day ${d.day} is not listed in week ${d.week}`);
    for (const id of [...d.resourceIds, ...(d.worksheet?.resourceId ? [d.worksheet.resourceId] : [])]) {
      if (!published.has(id)) errors.push(`${at}: links resource "${id}", which is not published`);
    }
    if (release && d.isPlaceholder) errors.push(`${at}: placeholder programme day in a release build`);
  }
  console.log(`Programme: ${days.length} days · ${programme.weeks.length} weeks${programme.isPlaceholder ? " (placeholder content)" : ""}`);

  const placeholders = all.filter((r) => r.isPlaceholder).length;
  console.log(`Content: ${all.length} resources (${published.size} published, ${placeholders} placeholder/demo) · ${paths.length} learning paths`);
} catch (e) {
  if (e instanceof ContentError) errors.push(e.message);
  else throw e;
}

for (const w of warnings) console.warn(`WARN  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  console.error(`\nContent validation FAILED (${errors.length} error${errors.length === 1 ? "" : "s"}).`);
  process.exit(1);
}
console.log("Content validation passed.");

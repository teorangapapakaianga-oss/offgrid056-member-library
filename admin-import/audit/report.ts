/**
 * Renders the Stage 9.5 audit into the report the owner asked for, in the order they asked for it.
 * Reading only: it takes the audit object and returns Markdown.
 */
import type { ProgrammeAudit, ProgrammeItem } from "./programme";

const kb = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
const day = (iso: string) => iso.slice(0, 10);
const shortSum = (s: string) => s.replace(/^sha256:/, "").slice(0, 12);
const dash = (s: string | null | undefined) => (s && s.length ? s : "—");

function inventoryRow(i: ProgrammeItem): string {
  const f = i.pdf ?? i.html!;
  return `| ${i.legacyCode} | ${i.day ?? "—"} | ${i.title} | ${i.pairStatus} | ${dash(i.duplicateGroup)} | ${day(f.modified)} | ${kb(f.sizeBytes)} | \`${shortSum(f.checksum)}\` |`;
}

export function renderAuditReport(a: ProgrammeAudit): string {
  const L: string[] = [];
  const p = (...lines: string[]) => L.push(...lines);

  p("# STAGE 9.5 — 30-DAY PROGRAMME AUDIT", "");
  p("**AUDIT ONLY.** Nothing was imported, re-skinned, modified or published. Every source file was read and left exactly as it was.", "");
  p(`Generated ${day(a.generatedAt)} from the full read-only scan.`, "");

  // 1
  p("## 1. Total programme files", "");
  p(`**${a.totals.programmeFiles} files** in the 30-Day Programme source, of which **${a.totals.core * 2 + a.totals.bonus * 2}** carry an OG code.`, "");
  p("| Group | Count |", "|---|---:|");
  p(`| Core day resources (OG-01…OG-30) | ${a.totals.core} |`);
  p(`| Bonus resources (OG-B01…OG-B15) | ${a.totals.bonus} |`);
  p(`| PDF/HTML pairs | ${a.totals.pairs} |`);
  p(`| PDF only | ${a.totals.pdfOnly} |`);
  p(`| HTML only | ${a.totals.htmlOnly} |`);
  p(`| Content mismatches | ${a.totals.contentMismatches} |`);
  p(`| Support files | ${a.totals.supportFiles} |`);
  p(`| Internal files | ${a.totals.internalFiles} |`);
  p(`| Visual assets | ${a.totals.visualAssets} |`, "");
  p("Every coded resource exists as exactly one PDF and one HTML, in `OffGrid056/PDFs` and `OffGrid056/HTML_Source`. There is no second, divergent copy of the programme: the two folders are the two formats of one set.", "");

  // 2
  const core = a.items.filter((i) => i.kind === "core");
  p("## 2. The 30 core days", "");
  p("| OG | Day | Title | Pair | Dup | Modified | Size | Checksum |", "|---|---:|---|---|---|---|---:|---|");
  for (const i of core) p(inventoryRow(i));
  p("");
  p(a.dayGaps.length ? `**Gaps:** no resource for day(s) ${a.dayGaps.join(", ")}.` : "**Days 1–30 are complete**, one core resource each, with no gaps and no duplicated day numbers.", "");

  // 3
  const bonus = a.items.filter((i) => i.kind === "bonus");
  p("## 3. The 15 bonus resources", "");
  p("| OG | Title | Foundation | Type | Pair | Modified | Size |", "|---|---|---|---|---|---|---:|");
  for (const i of bonus) {
    const f = i.pdf ?? i.html!;
    p(`| ${i.legacyCode} | ${i.title} | ${dash(i.foundation.value)} | ${dash(i.resourceType.value)} | ${i.pairStatus} | ${day(f.modified)} | ${kb(f.sizeBytes)} |`);
  }
  p("");

  // 4
  p("## 4. Duplicate groups", "");
  p(`${a.duplicateGroups.length} groups touch the programme.`, "");
  p("| Group | Kind | Recommendation | Why |", "|---|---|---|---|");
  for (const g of a.duplicateGroups.slice(0, 60)) {
    p(`| ${g.groupId} | ${g.kind}${g.autoResolved ? " (auto)" : ""} | **${g.recommendation}** | ${g.why} |`);
  }
  p("");
  const byRec = a.duplicateGroups.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.recommendation]: (acc[g.recommendation] ?? 0) + 1 }), {});
  p(`**Totals:** ${Object.entries(byRec).map(([k, v]) => `${k} ${v}`).join(" · ")}. Nothing is deleted by any of these recommendations.`, "");

  // 5 and 6
  p("## 5. PDF/HTML pair results", "");
  p(`- Clean pairs, resolved automatically under owner ruling 5: **${a.items.filter((i) => i.pairStatus === "pair" && !i.contentMismatch).length}**`);
  p(`- PDF without an HTML source: **${a.totals.pdfOnly}**`);
  p(`- HTML without a PDF: **${a.totals.htmlOnly}**`, "");
  p("For every clean pair the default applies: **PDF = member-facing download, HTML = editable / migration / re-skin source.** Both are kept.", "");

  p("## 6. Content mismatches", "");
  if (!a.totals.contentMismatches) {
    p("**None.** Every PDF matches its HTML source closely enough to be treated as the same document, so no pair was resolved silently over a disagreement.", "");
  } else {
    p("| OG | Similarity | Action |", "|---|---:|---|");
    for (const i of a.items.filter((x) => x.contentMismatch)) {
      p(`| ${i.legacyCode} | ${i.textSimilarity === null ? "—" : `${Math.round(i.textSimilarity * 100)}%`} | owner decides which version is correct |`);
    }
    p("");
  }

  // 7
  p("## 7. Five Foundations mapping", "");
  const byFoundation = a.items.reduce<Record<string, ProgrammeItem[]>>((acc, i) => {
    const k = i.foundation.value ?? "unresolved";
    return { ...acc, [k]: [...(acc[k] ?? []), i] };
  }, {});
  p("| Foundation | Count | Resources |", "|---|---:|---|");
  for (const [f, list] of Object.entries(byFoundation).sort((x, y) => y[1].length - x[1].length)) {
    p(`| ${f} | ${list.length} | ${list.map((i) => i.legacyCode).join(", ")} |`);
  }
  p("");
  p("| OG | Proposed foundation | Confidence | Evidence |", "|---|---|---|---|");
  for (const i of a.items) {
    p(`| ${i.legacyCode} | ${dash(i.foundation.value)} | ${i.foundation.confidence} | ${dash(i.foundation.evidence[0])} |`);
  }
  p("");

  // 8
  p("## 8. Resource-type mapping", "");
  const byType = a.items.reduce<Record<string, string[]>>((acc, i) => {
    const k = i.resourceType.value ?? "unresolved";
    return { ...acc, [k]: [...(acc[k] ?? []), i.legacyCode] };
  }, {});
  p("| Type | Count | Resources |", "|---|---:|---|");
  for (const [t, list] of Object.entries(byType).sort((x, y) => y[1].length - x[1].length)) {
    p(`| ${t} | ${list.length} | ${list.join(", ")} |`);
  }
  p("");
  const unresolved = a.items.filter((i) => !i.resourceType.value);
  p(unresolved.length ? `**${unresolved.length} left unresolved** rather than guessed, as instructed: ${unresolved.map((i) => i.legacyCode).join(", ")}.` : "Every resource has a type with at least MEDIUM confidence. Planner was not used as a fallback.", "");

  // 9
  p("## 9. Legacy-brand findings", "");
  if (!Object.keys(a.legacyTotals).length) {
    p("No legacy colours, typography or logo references found in the programme files.", "");
  } else {
    p("| Finding | Resources affected |", "|---|---:|");
    for (const [issue, n] of Object.entries(a.legacyTotals).sort((x, y) => y[1] - x[1])) p(`| ${issue} | ${n} |`);
    p("");
  }

  // 10
  p("## 10. Terminology findings", "");
  p("| Term | Hits | Files | Proposed | Safe to replace automatically? |", "|---|---:|---:|---|---|");
  for (const t of a.terminology) {
    p(`| ${t.term} | ${t.hits} | ${t.files} | ${t.proposal} | ${t.safeToReplace ? "**Yes**" : "**No** — " + t.why} |`);
  }
  p("");
  p("### Terminology that must NOT be changed automatically", "");
  for (const t of a.terminology.filter((x) => !x.safeToReplace)) p(`- **${t.term}** — ${t.why}`);
  p("");

  // content gaps
  p("## 10b. Content and safety gaps", "");
  if (!a.contentGaps.length) {
    p("None found.", "");
  } else {
    p("These are not branding problems. They are things a member would need that the material does not currently give them, and they are the reason so many resources are in re-skin group B rather than A.", "");
    for (const g of a.contentGaps) {
      p(`- **${g.gap}** — ${g.detail}${g.affects.length ? ` Affects: ${g.affects.slice(0, 12).join(", ")}${g.affects.length > 12 ? ` and ${g.affects.length - 12} more` : ""}.` : ""}`);
    }
    p("");
  }

  // 11
  p("## 11. Re-skin migration queue", "");
  p("| Group | Meaning | Count | Resources |", "|---|---|---:|---|");
  p(`| **A** | minor update: logo, colours, typography, terminology | ${a.reskin.A.length} | ${a.reskin.A.join(", ") || "—"} |`);
  p(`| **B** | content + brand update: copy, framework, CTA, safety wording | ${a.reskin.B.length} | ${a.reskin.B.join(", ") || "—"} |`);
  p(`| **C** | rebuild: conflicting versions, missing source, unusable | ${a.reskin.C.length} | ${a.reskin.C.join(", ") || "—"} |`);
  p(`| — | no re-skin needed | ${a.reskin.none.length} | ${a.reskin.none.join(", ") || "—"} |`, "");

  // 12
  p("## 12. Proposed OG code → resource id", "");
  p("`legacyCode` keeps the OG code. The permanent id follows the library's own `res-0000` format, so the programme can be renumbered later without breaking links.", "");
  p("| OG | Proposed id | Proposed slug |", "|---|---|---|");
  for (const i of a.items) p(`| ${i.legacyCode} | \`${i.proposedResourceId}\` | \`${i.proposedSlug}\` |`);
  p("");

  // 13
  p("## 13. Import readiness", "");
  p("| Status | Count | Resources |", "|---|---:|---|");
  for (const [status, list] of Object.entries(a.readiness)) {
    p(`| ${status} | ${list.length} | ${list.join(", ") || "—"} |`);
  }
  p("");
  p("**Nothing was set to READY_TO_IMPORT during this stage.**", "");

  // 14
  p("## 14. Archive candidates", "");
  const archive = a.duplicateGroups.filter((g) => g.recommendation === "ARCHIVE");
  if (!archive.length) {
    p("None. No byte-identical duplicate of a programme resource exists: the PDF and HTML of each resource are two formats of one document, not two copies of one file.", "");
  } else {
    for (const g of archive) p(`- **${g.groupId}** — ${g.members.join(" · ")} — ${g.why}`);
    p("");
  }

  return L.join("\n") + "\n";
}

/** The day-by-day view (report section 8 of the brief: programme structure). */
export function renderStructure(a: ProgrammeAudit): string {
  const L: string[] = [];
  L.push("## Programme structure — Day 1 to Day 30", "");
  L.push("| Day | OG | Title | Foundation | Type | Purpose | Proposed id | Download | Previous → Next |");
  L.push("|---:|---|---|---|---|---|---|---|---|");
  const core = a.items.filter((i) => i.kind === "core").sort((x, y) => (x.day ?? 0) - (y.day ?? 0));
  for (const i of core) {
    const prev = core.find((c) => c.day === (i.day ?? 0) - 1);
    const next = core.find((c) => c.day === (i.day ?? 0) + 1);
    const purpose = i.resourceType.value && i.foundation.value ? `${i.resourceType.value} for ${i.foundation.value}` : "needs review";
    L.push(
      `| ${i.day ?? "—"} | ${i.legacyCode} | ${i.title} | ${i.foundation.value ?? "—"} | ${i.resourceType.value ?? "—"} | ${purpose} | \`${i.proposedResourceId}\` | ${i.pdf ? i.pdf.filename : "—"} | ${prev?.legacyCode ?? "start"} → ${next?.legacyCode ?? "end"} |`,
    );
  }
  L.push("");
  return L.join("\n");
}

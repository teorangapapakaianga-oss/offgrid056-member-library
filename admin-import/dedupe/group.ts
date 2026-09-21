/**
 * Duplicate grouping (Stage 9.1 §7).
 *
 * Three kinds: EXACT (identical file), LIKELY (same thing under different names or folders) and
 * VERSION_CANDIDATE (the same document at different dates, in different formats, or in old versus current brand).
 *
 * **No winner is chosen and nothing is deleted.** Every group is presented for a human decision.
 */
import type { Candidate, DuplicateGroup } from "../types";
import type { TextBundle } from "../mappers/classify";

const stem = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[_\-\s]+/g, " ")
    .trim();

/** Dice coefficient on letter pairs: 1 means identical strings. */
export function stringSimilarity(a: string, b: string): number {
  const pairs = (s: string) => {
    const out = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
    return out;
  };
  const A = pairs(a);
  const B = pairs(b);
  if (!A.size || !B.size) return a === b ? 1 : 0;
  let shared = 0;
  for (const p of A) if (B.has(p)) shared++;
  return (2 * shared) / (A.size + B.size);
}

/** Overlap of the distinctive words in two documents: 1 means the same wording. */
export function textSimilarity(a: string, b: string): number {
  const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{4,}/g)?.slice(0, 4000) ?? []);
  const A = words(a);
  const B = words(b);
  if (A.size < 20 || B.size < 20) return 0;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / Math.min(A.size, B.size);
}

export interface GroupOptions {
  likelyFilenameSimilarity: number; // default 0.85
  likelyTextSimilarity: number; // default 0.9
  /** below this, a PDF and its HTML twin are flagged CONTENT_MISMATCH for review (decision D9-10) */
  pairMismatchBelow: number; // default 0.6
}

export const DEFAULT_GROUP_OPTIONS: GroupOptions = {
  likelyFilenameSimilarity: 0.85,
  likelyTextSimilarity: 0.9,
  pairMismatchBelow: 0.6,
};

export function groupDuplicates(
  candidates: Candidate[],
  texts: Map<string, TextBundle>,
  options: GroupOptions = DEFAULT_GROUP_OPTIONS,
): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const assigned = new Set<string>();
  let counter = 0;
  const nextId = () => `dup-${String(++counter).padStart(3, "0")}`;

  const assign = (group: DuplicateGroup) => {
    groups.push(group);
    for (const id of group.members) {
      assigned.add(id);
      const c = candidates.find((x) => x.candidateId === id)!;
      // A file can be an exact duplicate AND a version of another file. The first (strongest) grouping owns the
      // record; later ones only add the relationship, so no information is lost.
      if (!c.duplicateGroup) {
        c.duplicateGroup = group.groupId;
        c.duplicateKind = group.kind;
      }
      c.duplicateOf = [...new Set([...c.duplicateOf, ...group.members.filter((m) => m !== id)])];

      if (group.autoResolved) {
        // Owner ruling 5: a clean PDF/HTML pair is not a question. Both files are kept — the PDF as the
        // member artefact, the HTML as the re-skinning source — so neither is held back from import and
        // neither appears in the manual queue.
        c.disposition = "KEEP";
        c.pairRole = c.source.fileType === "pdf" ? "member artefact" : "migration source";
      } else if (c.status === "CLASSIFIED") {
        c.status = "DUPLICATE";
      }
    }
  };

  // 1. EXACT — identical checksums.
  const byChecksum = new Map<string, Candidate[]>();
  for (const c of candidates) {
    if (!c.source.checksum) continue;
    const list = byChecksum.get(c.source.checksum) ?? [];
    list.push(c);
    byChecksum.set(c.source.checksum, list);
  }
  for (const [sum, list] of byChecksum) {
    if (list.length < 2) continue;
    assign({
      groupId: nextId(),
      kind: "EXACT",
      members: list.map((c) => c.candidateId),
      reason: `identical file (${sum.slice(0, 19)}…) in ${new Set(list.map((c) => c.source.folder)).size} folder(s)` +
        (new Set(list.map((c) => c.source.sourceLabel)).size > 1 ? ` across ${new Set(list.map((c) => c.source.sourceLabel)).size} sources` : ""),
    });
  }

  // 2. VERSION_CANDIDATE — the same document in two formats (PDF ↔ HTML), or the same name with different
  //    content (an original and a resized or re-branded copy). Files already in an EXACT group take part too,
  //    with one representative each, so "same name, different bytes" is never missed.
  const byStem = new Map<string, Candidate[]>();
  for (const c of candidates) {
    const key = c.inferred.legacyCode.value ?? stem(c.source.filename);
    const list = byStem.get(key) ?? [];
    list.push(c);
    byStem.set(key, list);
  }
  for (const [key, all] of byStem) {
    // One representative per distinct file: an exact-duplicate set counts once here.
    const representatives = new Map<string, Candidate>();
    for (const c of all) {
      const sum = c.source.checksum || c.candidateId;
      if (!representatives.has(sum)) representatives.set(sum, c);
    }
    const list = [...representatives.values()];
    if (list.length < 2) continue;
    const kinds = new Set(list.map((c) => c.source.fileType));
    const isPair = kinds.has("pdf") && kinds.has("html");
    let mismatch = false;
    let similarity: number | null = null;
    if (isPair) {
      const pdf = list.find((c) => c.source.fileType === "pdf")!;
      const html = list.find((c) => c.source.fileType === "html")!;
      similarity = textSimilarity(texts.get(pdf.candidateId)?.text ?? "", texts.get(html.candidateId)?.text ?? "");
      mismatch = similarity > 0 && similarity < options.pairMismatchBelow;
      pdf.pairedWith = html.candidateId;
      html.pairedWith = pdf.candidateId;
      pdf.contentMismatch = html.contentMismatch = mismatch;
    }
    // Owner ruling 5: a clean pair — exactly one PDF and one HTML of the same document, whose text agrees —
    // resolves itself. Anything else stays a question for a person.
    const cleanPair = isPair && list.length === 2 && !mismatch;
    assign({
      groupId: nextId(),
      kind: "VERSION_CANDIDATE",
      members: list.map((c) => c.candidateId),
      reason: isPair
        ? `PDF and HTML of the same document (${key}); keep both: PDF for members, HTML for re-skinning`
        : `same name or code "${key}" with different dates or formats`,
      pdfHtmlPair: isPair,
      contentMismatch: mismatch,
      textSimilarity: similarity,
      autoResolved: cleanPair,
    });
  }

  // 3. LIKELY — different names, but the same thing: similar filenames or near-identical wording.
  const remaining = candidates.filter((c) => !assigned.has(c.candidateId) && c.source.fileType !== "image" && c.source.fileType !== "video");
  for (let i = 0; i < remaining.length; i++) {
    const a = remaining[i];
    if (assigned.has(a.candidateId)) continue;
    const members = [a.candidateId];
    const reasons: string[] = [];
    for (let j = i + 1; j < remaining.length; j++) {
      const b = remaining[j];
      if (assigned.has(b.candidateId)) continue;
      const nameSim = stringSimilarity(stem(a.source.filename), stem(b.source.filename));
      const titleSame =
        !!a.inferred.title.value && a.inferred.title.value.toLowerCase() === b.inferred.title.value?.toLowerCase();
      const textSim = textSimilarity(texts.get(a.candidateId)?.text ?? "", texts.get(b.candidateId)?.text ?? "");
      if (nameSim >= options.likelyFilenameSimilarity || titleSame || textSim >= options.likelyTextSimilarity) {
        members.push(b.candidateId);
        reasons.push(
          titleSame ? "same title" : nameSim >= options.likelyFilenameSimilarity ? `filenames ${(nameSim * 100) | 0}% alike` : `wording ${(textSim * 100) | 0}% alike`,
        );
      }
    }
    if (members.length > 1) {
      assign({ groupId: nextId(), kind: "LIKELY", members, reason: [...new Set(reasons)].join(", ") });
    }
  }

  return groups;
}

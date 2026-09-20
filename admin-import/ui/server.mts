/**
 * The admin review interface — LOCAL ONLY.
 *
 *   npm run import:admin        →  http://127.0.0.1:3810
 *
 * Deliberately a separate little server, not a page in the member site. The member site is a static export, so
 * anything added to it ends up in `out/` and ships. Keeping the admin UI outside Next entirely means it cannot
 * appear in member navigation, in a static route, in the build output or in public assets — by construction,
 * not by configuration.
 *
 * It binds to 127.0.0.1 only, so it is not reachable from the network.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { loadWorkspace, saveDecisions, audit } from "../review/store";
import { canTransition, draftFromCandidate, lowConfidenceFields, toResourceRecord, validateDraft, type Decision } from "../review/workflow";
import { FOUNDATION_IDS, RESOURCE_TYPE_IDS, DIFFICULTIES, COLLECTION_IDS } from "@/lib/content/constants";
import { foundations } from "@/lib/content/taxonomy";
import type { CandidateStatus } from "../types";

const HOST = "127.0.0.1";
const PORT = Number(process.env.ADMIN_PORT ?? 3810);
const ROOT = path.resolve(import.meta.dirname, "..", "..");
const WORKSPACE = path.join(ROOT, "workspace");
const UI_DIR = import.meta.dirname;
const FONT_DIR = path.join(ROOT, "styles", "fonts");

let ws = loadWorkspace(WORKSPACE);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const json = (res: http.ServerResponse, status: number, body: unknown) => {
  const text = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(text);
};

const readBody = (req: http.IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) reject(new Error("body too large"));
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
  });

/** What the list view needs: enough to filter and search, without shipping every extract. */
function listRow(candidateId: string) {
  const c = ws.candidates.find((x) => x.candidateId === candidateId)!;
  const d = ws.decisions[candidateId];
  const draft = { ...draftFromCandidate(c), ...d.draft };
  return {
    id: c.candidateId,
    filename: c.source.filename,
    title: draft.title,
    extension: c.source.extension,
    fileType: c.source.fileType,
    sizeBytes: c.source.sizeBytes,
    modified: c.source.modified,
    sourceLabel: c.source.sourceLabel,
    folder: path.basename(c.source.folder),
    materialKind: c.materialKind,
    // What the classifier actually worked out, or what the admin has since chosen — never the editor's
    // fallback, so an image that has no foundation does not appear in the list as though it had one.
    foundation: d.draft.foundation ?? c.inferred.foundation.value ?? "",
    resourceType: d.draft.resourceType ?? c.inferred.resourceType.value ?? "",
    legacyCode: draft.legacyCode,
    tags: draft.tags,
    confidence: c.inferred.foundation.confidence,
    typeConfidence: c.inferred.resourceType.confidence,
    legacyBranding: c.legacyBranding,
    duplicateKind: c.duplicateKind,
    duplicateGroup: c.duplicateGroup,
    reviewFlags: c.reviewFlags,
    status: d.status,
    disposition: d.disposition,
    approved: d.approved,
  };
}

function dashboard() {
  const rows = ws.candidates.map((c) => listRow(c.candidateId));
  const tally = <T extends string | number | boolean | null>(get: (r: ReturnType<typeof listRow>) => T) =>
    rows.reduce<Record<string, number>>((acc, r) => {
      const k = String(get(r) ?? "—");
      return { ...acc, [k]: (acc[k] ?? 0) + 1 };
    }, {});

  const byStatus = tally((r) => r.status);
  return {
    scannedAt: ws.summary.scannedAt,
    sources: ws.summary.sources,
    totals: {
      candidates: rows.length,
      readyToReview: rows.filter((r) => r.materialKind === "resource" && !["REJECTED", "READY_TO_IMPORT", "IMPORTED"].includes(r.status)).length,
      current: rows.filter((r) => r.materialKind === "resource" && !r.legacyBranding).length,
      legacy: rows.filter((r) => r.legacyBranding).length,
      duplicates: rows.filter((r) => r.duplicateKind).length,
      needsReview: rows.filter((r) => r.status === "NEEDS_REVIEW").length,
      rejected: byStatus.REJECTED ?? 0,
      readyToImport: byStatus.READY_TO_IMPORT ?? 0,
      imported: byStatus.IMPORTED ?? 0,
      internal: rows.filter((r) => r.materialKind === "internal").length,
      assets: rows.filter((r) => r.materialKind === "asset").length,
      packages: rows.filter((r) => r.materialKind === "package").length,
    },
    byFoundation: tally((r) => r.foundation),
    byResourceType: tally((r) => r.resourceType),
    byConfidence: tally((r) => r.confidence),
    byTypeConfidence: tally((r) => r.typeConfidence),
    byFileType: ws.summary.byFileType,
    byStatus,
    duplicateGroups: ws.groups.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.kind]: (acc[g.kind] ?? 0) + 1 }), {}),
    legacyFindings: ws.candidates.reduce((n, c) => n + c.legacyIssues.length, 0),
    onlineOnly: ws.summary.onlineOnly,
    unreadable: ws.summary.unreadable,
    assetsAttached: ws.candidates.filter((c) => c.materialKind === "asset" && c.asset?.attachTo).length,
    assetsBrand: ws.candidates.filter((c) => c.asset?.scope === "brand").length,
    assetsNeedingReview: ws.candidates.filter((c) => c.reviewFlags.includes("ASSET_LINK_REVIEW")).length,
  };
}

function detail(id: string) {
  const c = ws.candidates.find((x) => x.candidateId === id);
  if (!c) return null;
  const d = ws.decisions[id];
  const draft = { ...draftFromCandidate(c), ...d.draft };
  const group = c.duplicateGroup ? ws.groups.find((g) => g.groupId === c.duplicateGroup) : null;

  return {
    candidate: c,
    decision: d,
    draft,
    validation: validateDraft(d.draft, c),
    lowConfidence: lowConfidenceFields(c),
    readiness: canTransition(c, d, "READY_TO_IMPORT"),
    preview: toResourceRecord(draft, c),
    textExcerpt: (ws.texts[id] ?? "").slice(0, 1500),
    duplicateGroup: group
      ? {
          ...group,
          members: group.members.map((m) => {
            const other = ws.candidates.find((x) => x.candidateId === m)!;
            return {
              id: m,
              filename: other.source.filename,
              fileType: other.source.fileType,
              checksum: other.source.checksum,
              sizeBytes: other.source.sizeBytes,
              modified: other.source.modified,
              title: other.inferred.title.value,
              legacyBranding: other.legacyBranding,
              sourceLabel: other.source.sourceLabel,
              status: ws.decisions[m]?.status,
              disposition: ws.decisions[m]?.disposition ?? null,
            };
          }),
        }
      : null,
    attachedAssets: ws.candidates
      .filter((a) => a.asset?.attachTo === id)
      .map((a) => ({ id: a.candidateId, filename: a.source.filename, role: a.asset!.role, evidence: a.asset!.attachEvidence })),
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);
  const route = url.pathname;

  try {
    if (req.method === "GET" && route === "/api/dashboard") return json(res, 200, dashboard());

    if (req.method === "GET" && route === "/api/candidates") {
      return json(res, 200, {
        rows: ws.candidates.map((c) => listRow(c.candidateId)),
        vocab: {
          foundations: FOUNDATION_IDS,
          resourceTypes: RESOURCE_TYPE_IDS,
          difficulties: DIFFICULTIES,
          collections: COLLECTION_IDS,
          categories: Object.fromEntries(foundations.map((f) => [f.id, f.categories.map((cat) => cat.slug)])),
          sources: ws.summary.sources.map((s) => s.label),
        },
      });
    }

    if (req.method === "GET" && route.startsWith("/api/candidate/")) {
      const body = detail(decodeURIComponent(route.slice("/api/candidate/".length)));
      return body ? json(res, 200, body) : json(res, 404, { error: "no such candidate" });
    }

    if (req.method === "GET" && route === "/api/duplicates") {
      return json(res, 200, {
        groups: ws.groups.map((g) => ({
          ...g,
          members: g.members.map((m) => {
            const c = ws.candidates.find((x) => x.candidateId === m)!;
            return {
              id: m,
              filename: c.source.filename,
              fileType: c.source.fileType,
              checksum: c.source.checksum,
              sizeBytes: c.source.sizeBytes,
              modified: c.source.modified,
              title: c.inferred.title.value,
              legacyBranding: c.legacyBranding,
              sourceLabel: c.source.sourceLabel,
              textLength: c.textLength,
              disposition: ws.decisions[m]?.disposition ?? null,
              status: ws.decisions[m]?.status,
            };
          }),
        })),
      });
    }

    if (req.method === "POST" && route.startsWith("/api/decision/")) {
      const id = decodeURIComponent(route.slice("/api/decision/".length));
      const c = ws.candidates.find((x) => x.candidateId === id);
      if (!c) return json(res, 404, { error: "no such candidate" });

      const patch = (await readBody(req)) as Partial<Decision> & { status?: CandidateStatus };
      const current = ws.decisions[id];
      const next: Decision = {
        ...current,
        draft: { ...current.draft, ...(patch.draft ?? {}) },
        reviewedFields: patch.reviewedFields ?? current.reviewedFields,
        approved: patch.approved ?? current.approved,
        override: patch.override !== undefined ? patch.override : current.override,
        disposition: patch.disposition !== undefined ? patch.disposition : current.disposition,
        notes: patch.notes ?? current.notes,
        updatedAt: new Date().toISOString(),
      };

      // A status change is checked against the workflow rules before anything is written.
      if (patch.status && patch.status !== current.status) {
        const check = canTransition(c, next, patch.status);
        if (!check.ok) return json(res, 422, { error: "that change is not allowed yet", blockers: check.blockers });
        next.status = patch.status;
      }

      ws.decisions[id] = next;
      saveDecisions(WORKSPACE, ws.decisions);
      audit(WORKSPACE, "decision", { candidateId: id, status: next.status, disposition: next.disposition, approved: next.approved, fields: Object.keys(patch.draft ?? {}) });
      return json(res, 200, detail(id));
    }

    if (req.method === "POST" && route === "/api/reload") {
      ws = loadWorkspace(WORKSPACE);
      return json(res, 200, { ok: true, candidates: ws.candidates.length });
    }

    // --- static files ------------------------------------------------------------------------------------
    if (req.method === "GET") {
      const name = route === "/" ? "app.html" : path.basename(route);
      const dir = /\.woff2?$/.test(name) ? FONT_DIR : UI_DIR;
      const file = path.join(dir, name);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { "content-type": MIME[path.extname(name)] ?? "application/octet-stream", "cache-control": "no-store" });
        return res.end(fs.readFileSync(file));
      }
    }

    json(res, 404, { error: "not found" });
  } catch (e) {
    json(res, 500, { error: (e as Error).message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  OffGrid056 importer — admin review`);
  console.log(`  http://${HOST}:${PORT}`);
  console.log(`  ${ws.candidates.length} candidates · workspace ${path.relative(ROOT, WORKSPACE)}`);
  console.log(`  local only: not exposed to the network, not part of the member build.\n`);
});

/**
 * Scanner: builds the file inventory from the approved source folders.
 *
 * READ-ONLY, and provably so: files are opened with the read flag only, and `tests/unit/importer.test.ts` checks
 * that every source file's checksum and modified time are unchanged after a scan.
 *
 * OneDrive "online only" files are detected BEFORE anything is read, so scanning never silently downloads
 * gigabytes of cloud content (Stage 9.1 risk R4).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { detectFileType, extractText } from "../parsers/index";
import type { InventoryEntry, ScanSummary } from "../types";

export interface SourceConfig {
  label: string;
  path: string;
  enabled: boolean;
  misplaced?: boolean;
  /** "narrow": a file here is a member-resource candidate only on positive evidence (owner ruling 1) */
  resourceCandidacy?: "normal" | "narrow";
}

export interface ScanOptions {
  ignore: { folders: string[]; filenames: string[]; extensions: string[] };
  limits: { maxTextBytesPerFile: number; textExtractionSkipOver: number };
  /** Only these exact files (absolute paths). Used for the controlled sample. */
  only?: string[];
  onProgress?: (done: number, total: number, file: string) => void;
}

/**
 * Windows file attributes for a whole folder in one call, so OneDrive placeholders can be spotted without
 * touching the files. Offline / RecallOnOpen / RecallOnDataAccess all mean "not downloaded".
 */
function offlineFiles(root: string): Set<string> {
  const offline = new Set<string>();
  if (process.platform !== "win32") return offline;
  const ps = `Get-ChildItem -LiteralPath '${root.replace(/'/g, "''")}' -Recurse -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.Attributes -band [IO.FileAttributes]::Offline -or $_.Attributes.ToString() -match 'RecallOn' } | ForEach-Object { $_.FullName }`;
  const res = spawnSync("powershell", ["-NoProfile", "-NonInteractive", "-Command", ps], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  for (const line of (res.stdout ?? "").split(/\r?\n/)) {
    const p = line.trim();
    if (p) offline.add(p.toLowerCase());
  }
  return offline;
}

function* walk(dir: string, ignore: ScanOptions["ignore"]): Generator<string> {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (ignore.folders.includes(e.name)) continue;
      yield* walk(full, ignore);
    } else if (e.isFile()) {
      if (ignore.filenames.includes(e.name)) continue;
      if (ignore.extensions.includes(path.extname(e.name).toLowerCase())) continue;
      yield full;
    }
  }
}

/** SHA-256, streamed so a large video does not have to fit in memory. */
export function checksum(filePath: string): string {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(filePath, "r"); // read-only handle
  try {
    const buf = Buffer.alloc(1024 * 1024);
    let pos = 0;
    for (;;) {
      const read = fs.readSync(fd, buf, 0, buf.length, pos);
      if (read <= 0) break;
      hash.update(buf.subarray(0, read));
      pos += read;
    }
  } finally {
    fs.closeSync(fd);
  }
  return `sha256:${hash.digest("hex")}`;
}

export interface ScanResult {
  entries: InventoryEntry[];
  /** extracted text, kept beside the inventory in the workspace (never committed, never deployed) */
  texts: Map<string, { text: string; raw: string; meta: Record<string, unknown> }>;
  summary: ScanSummary;
}

export async function scanSources(sources: SourceConfig[], options: ScanOptions): Promise<ScanResult> {
  const started = Date.now();
  const entries: InventoryEntry[] = [];
  const texts = new Map<string, { text: string; raw: string; meta: Record<string, unknown> }>();
  const summary: ScanSummary = {
    scannedAt: new Date().toISOString(),
    sources: [],
    files: 0,
    bytes: 0,
    byFileType: {},
    onlineOnly: 0,
    misplaced: 0,
    unreadable: 0,
    durationMs: 0,
  };

  let counter = 0;
  const onlyLower = options.only?.map((p) => p.toLowerCase());

  for (const source of sources.filter((s) => s.enabled)) {
    if (!fs.existsSync(source.path)) {
      summary.sources.push({ label: source.label, path: source.path, files: 0, bytes: 0 });
      continue;
    }
    const offline = offlineFiles(source.path);
    const files = [...walk(source.path, options.ignore)].filter((f) => !onlyLower || onlyLower.includes(f.toLowerCase()));
    let bytes = 0;

    for (const filePath of files) {
      const stat = fs.statSync(filePath);
      const extension = path.extname(filePath).toLowerCase();
      const isOffline = offline.has(filePath.toLowerCase());
      const fileType = isOffline ? "unknown" : detectFileType(filePath, extension);

      const entry: InventoryEntry = {
        candidateId: `cand-${String(++counter).padStart(4, "0")}`,
        source: {
          path: filePath,
          folder: path.dirname(filePath),
          sourceLabel: source.label,
          filename: path.basename(filePath),
          extension,
          sizeBytes: stat.size,
          modified: new Date(stat.mtimeMs).toISOString(),
          checksum: isOffline ? "" : checksum(filePath),
          fileType,
          onlineOnly: isOffline,
          misplacedSource: Boolean(source.misplaced),
          narrowCandidacy: source.resourceCandidacy === "narrow",
        },
        textLength: 0,
        textError: isOffline ? "online-only: not downloaded, content not read" : null,
      };

      if (!isOffline && stat.size <= options.limits.textExtractionSkipOver) {
        const extraction = await extractText(filePath, fileType, options.limits.maxTextBytesPerFile);
        entry.textLength = extraction.text.length;
        entry.textError = extraction.error;
        if (extraction.error) summary.unreadable++;
        texts.set(entry.candidateId, { text: extraction.text, raw: extraction.raw, meta: extraction.meta });

        if (fileType === "image") entry.image = { width: (extraction.meta.width as number) ?? null, height: (extraction.meta.height as number) ?? null };
        if (fileType === "video") entry.video = { durationSeconds: (extraction.meta.durationSeconds as number) ?? null, hostingUrl: null };
        if (fileType === "zip") entry.archive = { entries: (extraction.meta.entries as number) ?? 0, sample: (extraction.meta.sample as string[]) ?? [] };
      } else if (!isOffline && fileType === "video") {
        // Too large to read text from, but provenance still matters (decision D9-1).
        entry.video = { durationSeconds: null, hostingUrl: null };
      }

      entries.push(entry);
      bytes += stat.size;
      summary.byFileType[fileType] = (summary.byFileType[fileType] ?? 0) + 1;
      if (isOffline) summary.onlineOnly++;
      if (entry.source.misplacedSource) summary.misplaced++;
      options.onProgress?.(entries.length, files.length, filePath);
    }

    summary.sources.push({ label: source.label, path: source.path, files: files.length, bytes });
  }

  summary.files = entries.length;
  summary.bytes = entries.reduce((n, e) => n + e.source.sizeBytes, 0);
  summary.durationMs = Date.now() - started;
  return { entries, texts, summary };
}

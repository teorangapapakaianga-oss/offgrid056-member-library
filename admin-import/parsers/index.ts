/**
 * Parsers: work out what a file really is, and read text out of it where that is useful.
 *
 * READ-ONLY. Every file is opened for reading only; nothing is written, moved or changed. Failures are recorded,
 * never thrown away, and a file that cannot be read simply gets lower confidence later.
 */
import fs from "node:fs";
import AdmZip from "adm-zip";
import type { DetectedFileType } from "../types";

const MARKDOWN_EXT = new Set([".md", ".markdown", ".mdx"]);
const TEXT_EXT = new Set([".txt", ".csv", ".json", ".log"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv"]);

/** Sniff the real type from the first bytes, so a wrong extension cannot fool us. */
export function detectFileType(filePath: string, extension: string): DetectedFileType {
  let head = Buffer.alloc(0);
  try {
    const fd = fs.openSync(filePath, "r");
    try {
      const buf = Buffer.alloc(512);
      const read = fs.readSync(fd, buf, 0, 512, 0);
      head = buf.subarray(0, read);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return "unknown";
  }

  if (head.subarray(0, 4).toString("latin1") === "%PDF") return "pdf";
  if (head[0] === 0x89 && head.subarray(1, 4).toString("latin1") === "PNG") return "image";
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "image";
  if (head.subarray(0, 6).toString("latin1").startsWith("GIF8")) return "image";
  if (head.subarray(8, 12).toString("latin1") === "WEBP") return "image";
  if (head.subarray(4, 8).toString("latin1") === "ftyp") return "video";
  if (head.subarray(0, 4).toString("latin1") === "\x1aE\xdf\xa3") return "video";

  if (head[0] === 0x50 && head[1] === 0x4b) {
    // A ZIP container: DOCX and XLSX are ZIPs too.
    try {
      const names = new AdmZip(filePath).getEntries().map((e) => e.entryName);
      if (names.some((n) => n.startsWith("word/"))) return "docx";
      if (names.some((n) => n.startsWith("xl/"))) return "xlsx";
    } catch {
      /* unreadable archive: still a zip */
    }
    return "zip";
  }

  const sample = head.toString("utf8").toLowerCase();
  if (sample.includes("<!doctype html") || sample.includes("<html")) return "html";
  if (IMAGE_EXT.has(extension)) return "image"; // SVG and anything text-based
  if (VIDEO_EXT.has(extension)) return "video";
  if (MARKDOWN_EXT.has(extension)) return "markdown";
  if (TEXT_EXT.has(extension)) return "text";
  if (extension === ".html" || extension === ".htm") return "html";
  return "unknown";
}

export interface Extraction {
  text: string;
  /** raw source kept for legacy-brand detection (HTML markup, for example) */
  raw: string;
  error: string | null;
  meta: Record<string, unknown>;
}

const empty = (error: string | null = null): Extraction => ({ text: "", raw: "", error, meta: {} });

/**
 * PDFs built from letter-spaced headings extract as single letters ("W A T E R  S T O R A G E").
 * Rejoin those runs so keyword matching works on real words.
 */
export function unspace(text: string): string {
  return text
    .replace(/(?:\b[A-Za-z0-9]\s){2,}[A-Za-z0-9]\b/g, (run) => run.replace(/\s+/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Read whatever text a file can give us. Large files are capped; video and images give metadata only. */
export async function extractText(filePath: string, fileType: DetectedFileType, maxBytes: number): Promise<Extraction> {
  try {
    switch (fileType) {
      case "pdf": {
        // pdf-parse v2: `new PDFParse({ data }).getText()`. Loaded lazily so a PDF problem cannot hold up a
        // scan of other file types.
        const { PDFParse } = (await import("pdf-parse")) as unknown as {
          PDFParse: new (opts: { data: Uint8Array }) => { getText(): Promise<{ text: string; total: number }>; destroy?: () => Promise<void> };
        };
        const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(filePath)) });
        try {
          const data = await parser.getText();
          return { text: unspace(data.text).slice(0, maxBytes), raw: "", error: null, meta: { pages: data.total } };
        } finally {
          await parser.destroy?.();
        }
      }
      case "html": {
        const raw = fs.readFileSync(filePath, "utf8").slice(0, maxBytes);
        const title = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
        const h1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
        return { text: stripHtml(raw), raw, error: null, meta: { title, h1: h1 ? stripHtml(h1) : undefined } };
      }
      case "markdown":
      case "text": {
        const raw = fs.readFileSync(filePath, "utf8").slice(0, maxBytes);
        const heading = raw.match(/^#\s+(.+)$/m)?.[1]?.trim();
        return { text: raw.replace(/\s+/g, " ").trim(), raw, error: null, meta: { title: heading } };
      }
      case "docx": {
        const zip = new AdmZip(filePath);
        const doc = zip.getEntry("word/document.xml");
        if (!doc) return empty("no word/document.xml inside the file");
        const xml = doc.getData().toString("utf8");
        const text = xml.replace(/<\/w:p>/g, "\n").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        return { text: text.slice(0, maxBytes), raw: "", error: null, meta: {} };
      }
      case "xlsx": {
        const zip = new AdmZip(filePath);
        const shared = zip.getEntry("xl/sharedStrings.xml");
        const sheets = zip.getEntries().filter((e) => e.entryName.startsWith("xl/worksheets/")).length;
        const text = shared ? shared.getData().toString("utf8").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
        return { text: text.slice(0, maxBytes), raw: "", error: null, meta: { sheets } };
      }
      case "zip": {
        const entries = new AdmZip(filePath).getEntries().map((e) => e.entryName);
        return { text: entries.join(" ").slice(0, maxBytes), raw: "", error: null, meta: { entries: entries.length, sample: entries.slice(0, 12) } };
      }
      case "image": {
        return { text: "", raw: "", error: null, meta: imageSize(filePath) };
      }
      case "video": {
        return { text: "", raw: "", error: null, meta: { durationSeconds: mp4Duration(filePath) } };
      }
      default:
        return empty("unsupported file type");
    }
  } catch (e) {
    return empty((e as Error).message.slice(0, 200));
  }
}

/** Width and height from the file header only: no image library needed. */
export function imageSize(filePath: string): { width: number | null; height: number | null } {
  try {
    const fd = fs.openSync(filePath, "r");
    try {
      const buf = Buffer.alloc(65536);
      const read = fs.readSync(fd, buf, 0, 65536, 0);
      const b = buf.subarray(0, read);
      if (b.subarray(1, 4).toString("latin1") === "PNG") return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
      if (b[0] === 0xff && b[1] === 0xd8) {
        let i = 2;
        while (i < b.length - 9) {
          if (b[i] !== 0xff) { i++; continue; }
          const marker = b[i + 1];
          const len = b.readUInt16BE(i + 2);
          if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
            return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
          }
          i += 2 + len;
        }
      }
      const svg = b.toString("utf8");
      if (svg.includes("<svg")) {
        const w = Number(svg.match(/width="(\d+)/)?.[1] ?? NaN);
        const h = Number(svg.match(/height="(\d+)/)?.[1] ?? NaN);
        return { width: Number.isFinite(w) ? w : null, height: Number.isFinite(h) ? h : null };
      }
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    /* unreadable: no dimensions */
  }
  return { width: null, height: null };
}

/** Duration in seconds from the mp4 header (mvhd atom), so videos keep useful provenance (decision D9-1). */
export function mp4Duration(filePath: string): number | null {
  try {
    const fd = fs.openSync(filePath, "r");
    try {
      const buf = Buffer.alloc(200000);
      const read = fs.readSync(fd, buf, 0, buf.length, 0);
      const b = buf.subarray(0, read);
      const i = b.indexOf("mvhd");
      if (i < 0) return null;
      const version = b[i + 4];
      if (version === 0) {
        const timescale = b.readUInt32BE(i + 16);
        const duration = b.readUInt32BE(i + 20);
        return timescale ? Math.round(duration / timescale) : null;
      }
      const timescale = b.readUInt32BE(i + 24);
      const duration = Number(b.readBigUInt64BE(i + 28));
      return timescale ? Math.round(duration / timescale) : null;
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return null;
  }
}

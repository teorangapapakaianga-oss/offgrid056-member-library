/**
 * Post-build fix for Next.js 16.3.5 static export (runs automatically as `postbuild`).
 *
 * The export writes nested segment-prefetch payloads, e.g.
 *   out/saved/__next.saved/__PAGE__.txt
 * but the client router requests them with dot-joined names, e.g.
 *   /saved/__next.saved.__PAGE__.txt
 * so every prefetch 404s on a plain static host. This script adds the flat copies next to the nested
 * originals (which are left untouched). Remove it once Next.js writes the flat names itself; re-check on
 * every Next.js upgrade (tools/ and docs/DEPLOYMENT.md note this).
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
if (!fs.existsSync(OUT)) {
  console.error("flatten-segment-prefetch: out/ not found. Run next build first.");
  process.exit(1);
}

let written = 0;

function flatten(segmentDir, flatPrefix, parentDir) {
  for (const entry of fs.readdirSync(segmentDir, { withFileTypes: true })) {
    const full = path.join(segmentDir, entry.name);
    const flatName = `${flatPrefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(full, flatName, parentDir);
    else if (entry.name.endsWith(".txt")) {
      const target = path.join(parentDir, flatName);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(full, target);
        written++;
      }
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) flatten(full, entry.name, dir);
    else if (entry.name !== "_next") walk(full);
  }
}

walk(OUT);
console.log(`flatten-segment-prefetch: wrote ${written} flat prefetch file(s).`);

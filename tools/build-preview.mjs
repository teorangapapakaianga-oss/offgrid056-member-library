/**
 * Build the PRIVATE PREVIEW.
 *
 *   npm run build:preview
 *
 * The preview differs from production in exactly two ways, and both are temporary by design:
 *
 *  1. draft resources are included (`OG056_INCLUDE_DRAFTS=1`), so a freshly imported resource can be reviewed
 *     before it is approved;
 *  2. real member downloads are staged into `public/resources/` for the build, then removed again.
 *
 * Point 2 is the important one. `public/` is copied wholesale into the build output, so leaving a real member
 * PDF there would put it into every build — including a production one. Keeping those files outside `public/`
 * and staging them only for this build means a plain `npm run build` cannot pick them up, whatever else
 * happens.
 *
 * Nothing here is committed: `private-assets/` and the staged copies are both git-ignored.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/**
 * Both the record and its download live outside the tree the build normally reads, and are staged together.
 *
 * The record has to be out of `data/` as well as the file out of `public/`: content validation checks that
 * every resource's download exists, so a record sitting in `data/` without its file fails a plain production
 * build. Keeping the pair together means production sees neither and passes, and the preview sees both.
 */
const STAGE = [
  { from: path.join(ROOT, "private-assets", "resources"), to: path.join(ROOT, "public", "resources"), what: "download" },
  { from: path.join(ROOT, "private-assets", "data-resources"), to: path.join(ROOT, "data", "resources"), what: "record" },
  // Learning paths built on real resources. They name private ids, so a public build must never see them: staged
  // for this build and removed again, exactly like the records and the downloads.
  { from: path.join(ROOT, "private-assets", "data-learning-paths"), to: path.join(ROOT, "data", "learning-paths"), what: "learning path" },
];

const staged = [];

function stage() {
  for (const { from, to, what } of STAGE) {
    if (!fs.existsSync(from)) continue;
    fs.mkdirSync(to, { recursive: true });
    for (const file of fs.readdirSync(from)) {
      const dest = path.join(to, file);
      if (fs.existsSync(dest)) {
        console.warn(`build:preview: ${what} ${file} is already in place — leaving it alone.`);
        continue;
      }
      fs.copyFileSync(path.join(from, file), dest);
      staged.push(dest);
    }
  }
  console.log(staged.length ? `build:preview: staged ${staged.length} private file(s).` : "build:preview: nothing private to stage — demo content only.");
}

/** Always runs, including when the build fails: a real member file must never be left in public/. */
function unstage() {
  for (const file of staged) {
    try {
      fs.rmSync(file);
    } catch (e) {
      console.error(`build:preview: could not remove staged file ${file}: ${e.message}`);
    }
  }
  if (staged.length) console.log(`build:preview: removed ${staged.length} staged file(s).`);
}

process.on("exit", unstage);
process.on("SIGINT", () => process.exit(130));

stage();
try {
  execSync("npm run build", { stdio: "inherit", env: { ...process.env, OG056_INCLUDE_DRAFTS: "1" } });
} catch {
  process.exitCode = 1;
}

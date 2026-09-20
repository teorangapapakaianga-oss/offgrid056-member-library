"""
Stage 8: build the V1 delivery ZIP.

Copies only approved files into OffGrid056_Member_Resource_Library_V1.zip, then re-opens the ZIP and verifies
every entry byte-for-byte, checks the forbidden list, and reports the structure.

Never included: node_modules, .next, .git, .env or any secret, browser profiles, caches, local backups,
QA-only artefacts that are not part of maintenance, screenshots, or anything from another project.

Usage (from the project root, after `npm run build`):
    python tools/make-delivery-package.py [--readme <path to README_FIRST.txt>]
"""

import hashlib
import pathlib
import re
import shutil
import subprocess
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
INTERNAL = ROOT.parent / "internal"
OUT_ZIP = ROOT.parent / "delivery" / "OffGrid056_Member_Resource_Library_V1.zip"

# --- what goes in -----------------------------------------------------------------------------------------

SOURCE_DIRS = ["app", "components", "data", "lib", "public", "styles", "tests", "tools", "docs"]
SOURCE_FILES = [
    "package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "eslint.config.mjs",
    "postcss.config.mjs", "vitest.config.mts", ".gitignore", ".gitattributes", "README.md", "AGENTS.md",
]
# Documentation copied to /documentation (name in package -> source path)
DOCS = {
    "README.md": ROOT / "README.md",
    "SETUP.md": ROOT / "docs" / "SETUP.md",
    "DEPLOYMENT.md": ROOT / "docs" / "DEPLOYMENT.md",
    "CONTENT_GUIDE.md": ROOT / "docs" / "CONTENT_GUIDE.md",
    "MEMBER_PROGRESS_AND_PRIVACY.md": ROOT / "docs" / "MEMBER_PROGRESS_AND_PRIVACY.md",
    "ARCHITECTURE.md": ROOT / "docs" / "ARCHITECTURE.md",
    "VERSION.md": ROOT / "docs" / "VERSION.md",
    "CHANGELOG.md": ROOT / "docs" / "CHANGELOG.md",
    "STAGE7_FINAL_QC_REPORT.md": INTERNAL / "STAGE7_FINAL_QC_REPORT.md",
    "OWNER_DECISIONS.md": INTERNAL / "OWNER_DECISIONS.md",
}
# Maintenance scripts that ship in /tools (the same files are in /source/tools)
TOOLS = ["validate-content.ts", "flatten-segment-prefetch.mjs", "qa-contrast.js", "qa-sweep.html", "qa-sweep.md"]

SKIP_DIR_NAMES = {"node_modules", ".next", ".git", ".vercel", "out", "coverage", "test-results", "playwright-report", "__pycache__", ".cache"}
SKIP_FILE_PATTERNS = re.compile(
    r"(^\.env|\.env\.|\.pem$|\.key$|\.bak$|\.backup$|\.orig$|\.tmp$|\.log$|^Thumbs\.db$|^\.DS_Store$|^desktop\.ini$"
    r"|^og056-progress-.*\.json$|^qa-seed\.html$|^next-env\.d\.ts$|\.tsbuildinfo$)"
)

FORBIDDEN_IN_PACKAGE = re.compile(
    r"(^|/)(node_modules|\.git|\.next|\.vercel|__pycache__)/|(^|/)\.env|\.pem$|\.key$|\.bak$|qa-seed\.html$"
    r"|(^|/)(ITEEK|iteek)|og056-progress-\d",
    re.I,
)

entries: dict[str, pathlib.Path] = {}


def add(arc: str, src: pathlib.Path) -> None:
    if not src.is_file():
        sys.exit(f"MISSING: {src}")
    entries[arc] = src


def add_tree(arc_prefix: str, base: pathlib.Path) -> None:
    for p in sorted(base.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(base)
        if any(part in SKIP_DIR_NAMES for part in rel.parts[:-1]):
            continue
        if SKIP_FILE_PATTERNS.search(p.name):
            continue
        add(f"{arc_prefix}/{rel.as_posix()}", p)


def build_entries(readme_first: pathlib.Path) -> None:
    add("README_FIRST.txt", readme_first)
    for d in SOURCE_DIRS:
        add_tree(f"source/{d}", ROOT / d)
    for f in SOURCE_FILES:
        add(f"source/{f}", ROOT / f)
    for name, path in DOCS.items():
        add(f"documentation/{name}", path)
    add_tree("build", ROOT / "out")
    add_tree("demo-content/data", ROOT / "data")
    add_tree("demo-content/files", ROOT / "public" / "resources")
    for t in TOOLS:
        add(f"tools/{t}", ROOT / "tools" / t)


def sha(p: pathlib.Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def main() -> None:
    readme = pathlib.Path(sys.argv[sys.argv.index("--readme") + 1]) if "--readme" in sys.argv else ROOT / "README_FIRST.txt"
    build_entries(readme)

    # --- guards before writing anything ---
    bad = [a for a in entries if FORBIDDEN_IN_PACKAGE.search(a)]
    if bad:
        sys.exit("FORBIDDEN FILES WOULD BE PACKAGED:\n  " + "\n  ".join(bad))
    if not any(a.startswith("build/") and a.endswith("index.html") for a in entries):
        sys.exit("The static build output is missing: run npm run build first.")
    qa_in_build = [a for a in entries if a.startswith("build/") and "qa-" in a]
    if qa_in_build:
        sys.exit("QA tooling found inside the build output:\n  " + "\n  ".join(qa_in_build))

    manifest_rows = ["path,bytes,sha256"] + [f"{a},{s.stat().st_size},{sha(s)}" for a, s in sorted(entries.items())]
    manifest = (
        "# OffGrid056 Member Resource Library V1 - package manifest\n"
        f"# {len(entries)} files (this manifest excluded)\n" + "\n".join(manifest_rows) + "\n"
    )

    OUT_ZIP.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(OUT_ZIP, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for arc, src in sorted(entries.items()):
            z.write(src, arc)
        z.writestr("documentation/PACKAGE_MANIFEST.csv", manifest)

    # --- verify the written ZIP ---
    with zipfile.ZipFile(OUT_ZIP) as z:
        if z.testzip() is not None:
            sys.exit("ZIP CRC failure")
        names = set(z.namelist())
        assert names == set(entries) | {"documentation/PACKAGE_MANIFEST.csv"}, "entry list mismatch"
        for arc, src in entries.items():
            if hashlib.sha256(z.read(arc)).hexdigest() != sha(src):
                sys.exit(f"content mismatch: {arc}")

    size = OUT_ZIP.stat().st_size
    print(f"wrote {OUT_ZIP.name}  {size / 1024 / 1024:.1f} MB ({size:,} bytes)  {len(names)} files")
    for top in ["README_FIRST.txt", "source", "documentation", "build", "demo-content", "tools"]:
        n = sum(1 for a in names if a == top or a.startswith(top + "/"))
        print(f"  {top:<16} {n:>5} files")
    print("VERIFY: CRC ok, every entry byte-identical to its source, no forbidden files, build output present")


if __name__ == "__main__":
    main()

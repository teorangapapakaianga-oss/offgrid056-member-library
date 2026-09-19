import type { NextConfig } from "next";

// V1 is a fully static export (docs/ARCHITECTURE.md §12). Removing `output: "export"`
// is the switch to server mode later (§14); nothing else here depends on it.
const nextConfig: NextConfig = {
  output: "export",
  // Every route exports as route/index.html, which works on any host without rewrites.
  trailingSlash: true,
  // Static export has no image server. Real thumbnails are pre-sized by tools/ at import time.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;

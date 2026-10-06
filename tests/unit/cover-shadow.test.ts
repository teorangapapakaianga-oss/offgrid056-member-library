import { describe, expect, it } from "vitest";
import { fixCoverImageShadow } from "@/admin-import/reskin/reskin";

/**
 * Stage 9.69A — a printed cover image must not carry a blurred shadow. Chrome's PDF output flattens it into a solid dark
 * rectangle that stops partway through the cover title.
 */
const COVER = `.cover-img {
  width: 220px; height: 300px; object-fit: cover; border-radius: 12px;
  border: 3px solid var(--resilience-green); margin-bottom: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.other { box-shadow: 0 1px 2px rgba(0,0,0,0.2); }`;

describe("Stage 9.69A · shared cover image shadow", () => {
  it("removes the box-shadow from .cover-img and keeps every other declaration", () => {
    const out = fixCoverImageShadow(COVER);
    const cover = out.match(/\.cover-img\s*\{[^}]*\}/)![0];
    expect(cover).not.toMatch(/box-shadow/);
    for (const keep of ["width: 220px", "height: 300px", "object-fit: cover", "border-radius: 12px", "border: 3px solid var(--resilience-green)", "margin-bottom: 40px"]) expect(cover).toContain(keep);
  });

  it("leaves shadows on other elements alone", () => {
    expect(fixCoverImageShadow(COVER)).toContain(".other { box-shadow: 0 1px 2px rgba(0,0,0,0.2); }");
  });

  it("is a no-op for a document with no cover image rule", () => {
    expect(fixCoverImageShadow("<style>.x{color:red}</style>")).toBe("<style>.x{color:red}</style>");
  });

  it("is idempotent", () => {
    const once = fixCoverImageShadow(COVER);
    expect(fixCoverImageShadow(once)).toBe(once);
  });
});

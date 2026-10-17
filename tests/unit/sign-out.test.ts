import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ACCESS_LOGOUT_PATH } from "@/lib/member/access";
import { NAV_GROUPS } from "@/lib/navigation";

/**
 * Sign out (controlled staging): the control uses Cloudflare Access's own logout path, asks first, and never simulates or pre-fetches a sign-out.
 * The live sign-out and re-authentication can only be tested in a signed-in session on the protected hostname (owner test, after approval).
 */
const root = process.cwd();
const src = (f: string) => fs.readFileSync(path.join(root, f), "utf8");
const controlFull = src("components/member/sign-out.tsx");
const control = controlFull.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""); // code only: the explanatory comments mention "prefetch"

describe("Sign Out uses Cloudflare Access's documented logout endpoint", () => {
  it("is the application-domain path /cdn-cgi/access/logout, relative, with no team name or secret", () => {
    expect(ACCESS_LOGOUT_PATH).toBe("/cdn-cgi/access/logout");
    expect(ACCESS_LOGOUT_PATH.startsWith("/")).toBe(true);
    expect(src("lib/member/access.ts")).not.toMatch(/cloudflareaccess\.com|https?:\/\//i);
  });
  it("is a plain anchor to that path (no router link that could prefetch it)", () => {
    expect(control).toMatch(/<a\s[^>]*href=\{ACCESS_LOGOUT_PATH\}/);
    expect(control).not.toMatch(/from "next\/link"|<Link\b|prefetch|router\.|fetch\(|XMLHttpRequest|sendBeacon/);
  });
  it("does not simulate a sign-out in the browser or clear the member's local data", () => {
    expect(control).not.toMatch(/localStorage|sessionStorage|memberStore|document\.cookie|window\.location|location\.href|location\.assign|indexedDB/);
  });
  it("is nowhere else in the app: not in the navigation list, so nothing can prefetch or auto-follow it", () => {
    expect(JSON.stringify(NAV_GROUPS)).not.toMatch(/cdn-cgi/);
    for (const f of ["components/layout/nav-links.tsx", "components/layout/shell.tsx", "components/layout/member-sidebar.tsx"]) expect(src(f)).not.toMatch(/cdn-cgi|ACCESS_LOGOUT_PATH/);
  });
});

describe("the confirmation says what Access sign-out does", () => {
  it("warns that every application behind the same Access login is signed out, and that local data stays", () => {
    expect(control).toMatch(/every application protected by the same login/);
    expect(control).toMatch(/Cloudflare Access/);
    expect(control).toMatch(/saved items and progress stay in this browser/);
  });
  it("asks before signing out: the logout link only exists inside the confirmation, with a Cancel", () => {
    const beforeConfirm = control.slice(0, control.indexOf("return (\n    <div className={className} role=\"group\""));
    expect(beforeConfirm).not.toMatch(/ACCESS_LOGOUT_PATH\}/);
    expect(control).toMatch(/Cancel/);
    expect(control).toMatch(/aria-label="Confirm sign out"/);
  });
});

describe("the control is in the navigation on every screen size", () => {
  it("is above the main navigation in the desktop sidebar (visible without scrolling) and in the tablet/mobile drawer", () => {
    const sidebar = src("components/layout/member-sidebar.tsx");
    expect(sidebar).toMatch(/<SignOutControl[\s\S]*<nav aria-label="Main">/);
    const shell = src("components/layout/shell.tsx");
    const drawer = shell.slice(shell.indexOf("<dialog"));
    expect(drawer).toMatch(/<SignOutControl[\s\S]*<nav aria-label="Main">/);
  });
});

describe("the built static pages never contain the logout link", () => {
  const out = path.join(root, "out");
  const have = fs.existsSync(path.join(out, "index.html"));
  it.skipIf(!have)("no HTML page or payload carries /cdn-cgi/access/logout before the member opens the confirmation", () => {
    const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    const hits = walk(out).filter((f) => /\.(html|txt)$/.test(f)).filter((f) => fs.readFileSync(f, "utf8").includes("cdn-cgi/access/logout"));
    expect(hits).toEqual([]);
  });
});

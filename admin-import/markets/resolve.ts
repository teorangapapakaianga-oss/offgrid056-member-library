/**
 * Market variant resolution (Stage 9.6B) — PROPOSAL.
 *
 * One core document, resolved per market. Four complete copies of 45 resources would be 180 documents to keep
 * in step, and they would drift apart within a month.
 *
 * The design rests on one observation from the Stage 9.5 audit: **almost none of the market variance is
 * per-resource.** The emergency number, the agencies, the units and the safety wording are properties of the
 * market, not of the water storage calculator. So they live in a market profile, shared by every resource, and
 * a resource only carries an override where it genuinely differs.
 *
 *   market profile  (4 files, shared by everything)
 *        +
 *   safety blocks   (11 blocks, each with optional per-market wording)
 *        +
 *   resource core   (45 documents, market-neutral)
 *        +
 *   resource override  (rare, per resource per market)
 *        =
 *   what a member in that market reads
 *
 * This module is a proposal and is not wired into the member build.
 */

export type MarketCode = "NZ" | "AU" | "US" | "CA";

export interface MarketProfile {
  code: MarketCode;
  name: string;
  /** what a member dials, and how they reach it if they cannot speak or hear */
  emergency: { number: string; alternatives: string[]; accessibility: string };
  /** measurement system: decides which unit strings a resource renders */
  units: "metric" | "us-customary";
  /** named bodies, so a resource can say "your energy agency" and resolve to the right one */
  agencies: Record<string, { name: string; url?: string } | undefined>;
  /** official guidance figures that differ by market */
  figures: Record<string, string | undefined>;
  /** terminology substitutions: the NZ term on the left, this market's term on the right */
  terms: Record<string, string | undefined>;
  links: Record<string, string | undefined>;
}

/** A resource as authored: market-neutral, with optional per-market overrides. */
export interface CoreResource {
  id: string;
  legacyCode: string;
  slug: string;
  title: string;
  description: string;
  /** body written with {{tokens}}; see resolveTokens */
  body: string;
  /** safety blocks this resource requires, by id */
  safetyBlocks: string[];
  /** the markets this resource is offered in; omitted means all */
  markets?: MarketCode[];
  /** the rare genuine per-market difference */
  overrides?: Partial<Record<MarketCode, Partial<Pick<CoreResource, "title" | "description" | "body">> & { note?: string }>>;
}

export interface SafetyBlock {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "STANDARD";
  /** the shared wording, with {{tokens}} */
  body: string;
  /** wording that replaces the shared body entirely in a given market */
  marketBody?: Partial<Record<MarketCode, string>>;
  sources: string[];
}

export interface ResolvedResource {
  market: MarketCode;
  id: string;
  legacyCode: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  safety: { id: string; title: string; severity: string; body: string; sources: string[] }[];
  /** tokens that could not be resolved: a resource with any of these must not be published */
  unresolvedTokens: string[];
}

const TOKEN = /\{\{\s*([a-z][\w.]*)\s*\}\}/gi;

/**
 * A profile field whose official value has not been verified yet carries this sentinel.
 *
 * It must behave exactly like a missing value, not like a string: otherwise "VERIFY" renders into the page as
 * if it were an answer ("store VERIFY of water per person"), and `publishable()` waves it through. An
 * unverified safety figure has to fail closed.
 */
export const UNVERIFIED = "VERIFY";

/**
 * Resolve `{{token}}` against a market profile.
 *
 * An unknown token is **left visible and reported**, never silently blanked. A missing emergency number that
 * quietly renders as an empty string is exactly the kind of failure this whole layer exists to prevent.
 */
export function resolveTokens(text: string, market: MarketProfile): { text: string; unresolved: string[] } {
  const unresolved: string[] = [];
  const resolved = text.replace(TOKEN, (whole, path: string) => {
    const value = lookup(path, market);
    if (value === undefined || value === UNVERIFIED) {
      unresolved.push(path);
      return whole; // stays visible, so it cannot be missed in review
    }
    return value;
  });
  return { text: resolved, unresolved: [...new Set(unresolved)] };
}

function lookup(path: string, m: MarketProfile): string | undefined {
  const [rawHead, ...rest] = path.split(".");
  // Only the prefix is case-insensitive. The key keeps its case, or `agency.emergencyManagement` would be
  // looked up as `emergencymanagement` and silently miss.
  const head = rawHead.toLowerCase();
  const key = rest.join(".");
  switch (head) {
    case "market":
      if (key === "code") return m.code;
      if (key === "name") return m.name;
      if (key === "units") return m.units;
      return undefined;
    case "emergency":
      if (key === "number") return m.emergency.number;
      if (key === "alternatives") return m.emergency.alternatives.join(" or ");
      if (key === "accessibility") return m.emergency.accessibility;
      return undefined;
    case "agency":
      return m.agencies[key]?.name;
    case "agencyurl":
      return m.agencies[key]?.url;
    case "figure":
      return m.figures[key];
    case "term":
      return m.terms[key];
    case "link":
      return m.links[key];
    default:
      return undefined;
  }
}

export function resolveForMarket(
  resource: CoreResource,
  market: MarketProfile,
  blocks: Record<string, SafetyBlock>,
): ResolvedResource {
  const override = resource.overrides?.[market.code] ?? {};
  const unresolved: string[] = [];

  const take = (text: string) => {
    const r = resolveTokens(text, market);
    unresolved.push(...r.unresolved);
    return r.text;
  };

  const safety = resource.safetyBlocks.map((id) => {
    const block = blocks[id];
    if (!block) {
      unresolved.push(`safetyBlock:${id}`);
      return { id, title: "MISSING BLOCK", severity: "CRITICAL", body: "", sources: [] };
    }
    const body = block.marketBody?.[market.code] ?? block.body;
    return { id: block.id, title: block.title, severity: block.severity, body: take(body), sources: block.sources };
  });

  return {
    market: market.code,
    id: resource.id,
    legacyCode: resource.legacyCode,
    slug: resource.slug,
    title: take(override.title ?? resource.title),
    description: take(override.description ?? resource.description),
    body: take(override.body ?? resource.body),
    safety,
    unresolvedTokens: [...new Set(unresolved)],
  };
}

/** Every market a resource is offered in, resolved at once — what a build step would call. */
export function resolveAll(
  resource: CoreResource,
  markets: MarketProfile[],
  blocks: Record<string, SafetyBlock>,
): ResolvedResource[] {
  const offered = resource.markets ?? markets.map((m) => m.code);
  return markets.filter((m) => offered.includes(m.code)).map((m) => resolveForMarket(resource, m, blocks));
}

/**
 * A resource is publishable in a market only when every token resolved and every CRITICAL safety block is
 * present. This is the market layer's own gate, sitting alongside the Stage 9.3 import gate.
 */
export function publishable(resolved: ResolvedResource, requiredCritical: string[] = []): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  for (const token of resolved.unresolvedTokens) problems.push(`{{${token}}} does not resolve in ${resolved.market}`);
  for (const id of requiredCritical) {
    if (!resolved.safety.some((s) => s.id === id)) problems.push(`safety block "${id}" is required but missing`);
  }
  for (const s of resolved.safety) {
    if (s.severity === "CRITICAL" && !s.body.trim()) problems.push(`critical safety block "${s.id}" resolved to nothing`);
  }
  return { ok: problems.length === 0, problems };
}

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
  /**
   * Shorter wording for when another block is also in the resource, so one point is not said twice: the electrical
   * block drops its generator paragraph when the generator block is there. Keyed by that other block's id.
   */
  marketBodyWhen?: Record<string, Partial<Record<MarketCode, string>>>;
  /**
   * Topic-detector requirements this block satisfies, where the block's own id is not the detector's id.
   *
   * The fire detector asks for "fire-and-emergency"; the approved wording is `fire-and-smoke-alarms`. Declaring the
   * answer here — rather than renaming the detector — keeps the two reviewed hazard-label exemptions (OG-02 and
   * OG-B08) pointing at the requirement the owner approved them against. It can only ever *satisfy* a requirement,
   * and only for a resource that actually carries the block: it cannot remove one.
   */
  answers?: string[];
  /**
   * Researched claims that are specific to ONE Australian state or territory (Stage 9.62).
   *
   * The library routes NZ or AU, never an Australian state, so none of these is ever resolved into a member-facing
   * body: `resolveForMarket` reads only `marketBody`/`body`, and a test proves no override's wording reaches any
   * served file. They are stored so that (a) the research is not lost, (b) each claim's category is explicit, and
   * (c) a future state-routing stage has a typed, source-backed starting point rather than prose.
   */
  stateOverrides?: StateOverride[];
  /**
   * Wording drafted for a market whose block deliberately FAILS CLOSED (Stage 9.62). It is never served; it exists so
   * the owner can approve it as written, rather than a compromise being improvised later.
   */
  draftedNotServed?: Partial<Record<MarketCode, string>>;
  /**
   * Markets in which this block's wording is built but NOT yet owner-approved (Stage 9.62A). A block with no entry is
   * approved (the original twelve). A pending block can be carried, but it never satisfies a gas requirement: the
   * resource fails closed until the owner approves the wording and this entry is removed.
   */
  pendingOwnerApproval?: MarketCode[];
  /**
   * The Australian common-core claims, each with the evidence behind it and the category the Stage 9.62A rule gives it
   * (`classifyCommonClaim`). Only category-A claims are in the served AU body; the rest are kept here so the research
   * and the reason for leaving them out are not lost.
   */
  commonCoreClaims?: CommonCoreClaim[];
  sources: string[];
}

/** What stands behind one Australian claim. Only recorded evidence counts: an unrecorded jurisdiction is not evidence. */
export interface CommonClaimEvidence {
  /** official jurisdictions whose own pages state it (VIC, NSW, QLD, SA, WA, TAS, ACT, NT) */
  jurisdictions: string[];
  /** an authoritative NATIONAL Australian source that states it (none was readable at Stage 9.62: AS/NZS 5601 is paywalled) */
  nationalSource?: boolean;
  /** jurisdictions that say something different */
  contradictedBy?: string[];
  /** the claim only holds under a state-specific limitation, appliance or figure */
  jurisdictionSpecificLimitation?: boolean;
  /** the claim carries a number, interval, distance or size */
  numeric?: boolean;
}

export interface CommonCoreClaim {
  id: string;
  text: string;
  topicCore: boolean;
  evidence: CommonClaimEvidence;
  category: StateOverrideCategory;
  reason: string;
  served: boolean;
}

/**
 * Jurisdictions that must state a claim, independently, before it can be common Australian core wording without a
 * national source (Stage 9.62A owner ruling): "multiple independent official jurisdictions … enough coverage that the
 * statement is reasonably common rather than merely coincidentally present in two". Four is half of the eight. Two is
 * explicitly NOT enough. Owner-reviewable.
 */
export const COMMON_CORE_MIN_JURISDICTIONS = 4;

/**
 * The Stage 9.62A Category-A rule. A claim enters the common AU core only when
 *   A. an authoritative national Australian source supports it; OR
 *   B. at least COMMON_CORE_MIN_JURISDICTIONS independent official jurisdictions state it, none contradicts it, and
 *      it carries no material jurisdiction-specific limitation.
 * Anything numeric, contradicted or state-limited is C (serve only when the member's state matches); everything else
 * that is protective but under-evidenced is B (labelled jurisdiction-specific information).
 */
export function classifyCommonClaim(e: CommonClaimEvidence): { category: StateOverrideCategory; reason: string } {
  const states = [...new Set(e.jurisdictions.map((j) => j.toUpperCase()))];
  if (e.numeric || e.jurisdictionSpecificLimitation || (e.contradictedBy?.length ?? 0) > 0) {
    return { category: "C", reason: "numeric, state-limited or contradicted: serve only when the member's state matches" };
  }
  if (e.nationalSource) return { category: "A", reason: "an authoritative national Australian source supports it" };
  if (states.length >= COMMON_CORE_MIN_JURISDICTIONS) {
    return { category: "A", reason: `${states.length} independent official jurisdictions (${states.join(", ")}), none contradicting, no state-specific limitation` };
  }
  return {
    category: "B",
    reason: `only ${states.length} recorded jurisdiction${states.length === 1 ? "" : "s"} (${states.join(", ") || "none"}); common core needs ${COMMON_CORE_MIN_JURISDICTIONS}+ or a national source`,
  };
}

/** A, B or C: who may be shown this, and when. See the Stage 9.62 report. */
export type StateOverrideCategory = "A" | "B" | "C";

export interface StateOverride {
  id: string;
  /** state or territory code: NSW, VIC, QLD, SA, WA, TAS, ACT, NT */
  jurisdiction: string;
  /** the words that MUST appear beside the claim for it to be safe to show: the agency, by name */
  label: string;
  /**
   * A — safe for every Australian member (these live in the served AU core, not here).
   * B — informational, safe if labelled with the state, but not served yet.
   * C — must NOT be served unless the member's state is known.
   */
  category: StateOverrideCategory;
  topic: string;
  /** the appliance or thing the claim is scoped to — "gas water heater" is not "gas heater" */
  appliance?: string;
  claim: string;
  figure?: { value?: number; unit: string; text?: string } | null;
  source: string;
  authority: string;
  sourceDate: string;
  /** "state-routing" for C; "state-label" for B */
  servedWhen: "state-label" | "state-routing";
  /** claims in the same topic that CONFLICT with this one, by override id — never to be merged */
  conflictsWith?: string[];
  /** limits of the record — e.g. wording is the generic proposal, not this jurisdiction's own sentence */
  note?: string;
}

/**
 * Whether a state override may be shown to a member (Stage 9.62). Nothing calls this yet — the library routes NZ or AU,
 * never an Australian state — but the rule is written down and tested now so a state-routing stage inherits a decision
 * rather than inventing one:
 *
 * - **A** is already in the served AU core, so it is always servable (and has no business being stored as an override).
 * - **B** may be shown to anyone ONLY with its state label attached — the agency's name in the sentence it is shown in.
 * - **C** may be shown ONLY to a member whose state is KNOWN and equals the override's jurisdiction. An unknown state
 *   never receives it, and another state's member never receives it: that is the whole point of the category.
 * - An override with no jurisdiction or no label is never servable.
 */
export function overrideServable(override: StateOverride, member: { state?: string | null; renderedWith?: string }): boolean {
  if (!override.jurisdiction || !override.label) return false;
  if (override.category === "A") return true;
  if (override.category === "B") return !!member.renderedWith && member.renderedWith.includes(override.label);
  return !!member.state && member.state.toUpperCase() === override.jurisdiction.toUpperCase();
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
    // A key names the other block(s) whose presence trims this one. "a+b" means BOTH must be carried (Stage 9.62):
    // two blocks can each repeat a different paragraph of a third, and a single-id key cannot express "drop both".
    // The most specific matching key wins; single-id keys behave exactly as before.
    const trimmed = Object.entries(block.marketBodyWhen ?? {})
      // Only entries that carry wording for THIS market compete: the NZ and AU variants of a block can be keyed by
      // different sets of blocks, and an AU-only key must not out-rank (and so silently discard) a valid NZ one.
      .filter(([key, bodies]) => bodies?.[market.code] !== undefined && key.split("+").every((other) => resource.safetyBlocks.includes(other)))
      .sort((a, b) => b[0].split("+").length - a[0].split("+").length)[0]?.[1]?.[market.code];
    const body = trimmed ?? block.marketBody?.[market.code] ?? block.body;
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

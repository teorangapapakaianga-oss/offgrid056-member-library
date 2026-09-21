/**
 * Stage 9.7C — launch readiness per market.
 *
 * Computed from the market profiles and the safety standard rather than asserted in prose, so the answer to
 * "can we launch in Australia?" is derived from the same data the resolver uses at render time. If a figure is
 * unverified, this says so and the market is not publishable for anything that needs it.
 */
import { UNVERIFIED, type MarketProfile } from "./resolve";

export interface SafetyBlockStatus {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "STANDARD";
  /** market fields the block's wording depends on */
  requires: string[];
  verified: boolean;
  missing: string[];
}

export interface MarketReadiness {
  code: string;
  name: string;
  emergency: { number: string; alternatives: string; accessibility: string; verified: boolean };
  units: string;
  blocks: SafetyBlockStatus[];
  unresolved: string[];
  references: { label: string; value: string }[];
  /** publishable for a resource that needs only the verified blocks */
  publishableBaseline: boolean;
  /** publishable for a resource that needs everything, including the unverified fields */
  publishableFull: boolean;
}

/**
 * The eleven blocks of the safety standard, and the market fields each one's wording needs resolved.
 * A block is "verified" for a market when every field it depends on has a real value in that market's profile.
 */
export const SAFETY_BLOCK_REQUIREMENTS: { id: string; title: string; severity: SafetyBlockStatus["severity"]; requires: string[] }[] = [
  { id: "general-disclaimer", title: "General safety disclaimer", severity: "STANDARD", requires: ["term.electrician", "term.gasfitter", "market.name"] },
  { id: "emergency-contact", title: "Emergency contact architecture", severity: "CRITICAL", requires: ["emergency.number", "emergency.accessibility", "agency.emergencyManagement"] },
  { id: "generator-safety", title: "Generator safety", severity: "CRITICAL", requires: ["figure.generatorDistance"] },
  { id: "carbon-monoxide", title: "Carbon monoxide", severity: "CRITICAL", requires: ["emergency.number"] },
  { id: "indoor-combustion", title: "Indoor combustion", severity: "CRITICAL", requires: [] },
  { id: "solid-fuel-heating", title: "Solid-fuel heating", severity: "HIGH", requires: ["agency.fire"] },
  { id: "gas-and-lpg", title: "Gas and LPG", severity: "CRITICAL", requires: ["term.gasfitter", "figure.gasCertificate", "agency.gasRegulator"] },
  { id: "batteries-and-electrical", title: "Batteries and electrical", severity: "CRITICAL", requires: ["term.electrician"] },
  { id: "stored-drinking-water", title: "Stored drinking water", severity: "HIGH", requires: ["figure.waterPerPersonPerDay", "figure.waterThreeDays", "agency.emergencyManagement"] },
  { id: "food-safety-power-cut", title: "Food safety in a power cut", severity: "HIGH", requires: ["figure.fridgeWithoutPower", "figure.freezerWithoutPower", "agency.foodSafety"] },
  { id: "fire-and-emergency", title: "Fire and emergency response", severity: "CRITICAL", requires: ["emergency.number", "agency.fire"] },
];

/** Does this market have a real value for this field? */
export function fieldValue(market: MarketProfile, token: string): string | undefined {
  const [head, ...rest] = token.split(".");
  const key = rest.join(".");
  const raw = (() => {
    switch (head) {
      case "market":
        return key === "name" ? market.name : key === "code" ? market.code : undefined;
      case "emergency":
        return key === "number" ? market.emergency.number : key === "accessibility" ? market.emergency.accessibility : undefined;
      case "agency":
        return market.agencies[key]?.name;
      case "figure":
        return market.figures[key];
      case "term":
        return market.terms[key];
      case "link":
        return market.links[key];
      default:
        return undefined;
    }
  })();
  return raw === UNVERIFIED || raw === undefined || raw === "" ? undefined : raw;
}

export function assessMarket(market: MarketProfile): MarketReadiness {
  const blocks: SafetyBlockStatus[] = SAFETY_BLOCK_REQUIREMENTS.map((b) => {
    const missing = b.requires.filter((token) => fieldValue(market, token) === undefined);
    return { id: b.id, title: b.title, severity: b.severity, requires: b.requires, verified: missing.length === 0, missing };
  });

  const unresolved = [...new Set(blocks.flatMap((b) => b.missing))];

  const references: { label: string; value: string }[] = [
    { label: "Emergency management", value: market.agencies.emergencyManagement?.name ?? "—" },
    { label: "Fire service", value: market.agencies.fire?.name ?? "—" },
    { label: "Food safety authority", value: market.agencies.foodSafety?.name ?? "—" },
    { label: "Gas regulator", value: market.agencies.gasRegulator?.name ?? "—" },
    { label: "Trade registration", value: market.agencies.tradeRegistration?.name ?? "—" },
    { label: "Energy agency", value: fieldValue(market, "agency.energy") ?? "not set" },
    { label: "Water per person", value: fieldValue(market, "figure.waterPerPersonPerDay") ?? "UNVERIFIED" },
    { label: "Fridge without power", value: fieldValue(market, "figure.fridgeWithoutPower") ?? "UNVERIFIED" },
    { label: "Freezer without power", value: fieldValue(market, "figure.freezerWithoutPower") ?? "UNVERIFIED" },
    { label: "Gas certificate", value: fieldValue(market, "figure.gasCertificate") ?? "UNVERIFIED" },
    { label: "Generator distance", value: fieldValue(market, "figure.generatorDistance") ?? "UNVERIFIED" },
  ];

  // A market can launch resources that do not depend on an unverified field. It cannot launch ones that do.
  const criticalUnverified = blocks.filter((b) => b.severity === "CRITICAL" && !b.verified);
  const baselineBlocks = ["general-disclaimer", "emergency-contact", "carbon-monoxide", "indoor-combustion", "batteries-and-electrical", "fire-and-emergency"];
  const baselineOk = blocks.filter((b) => baselineBlocks.includes(b.id)).every((b) => b.verified);

  return {
    code: market.code,
    name: market.name,
    emergency: {
      number: market.emergency.number,
      alternatives: market.emergency.alternatives.join(", ") || "—",
      accessibility: market.emergency.accessibility,
      verified: Boolean(market.emergency.number),
    },
    units: market.units,
    blocks,
    unresolved,
    references,
    publishableBaseline: baselineOk,
    publishableFull: criticalUnverified.length === 0,
  };
}

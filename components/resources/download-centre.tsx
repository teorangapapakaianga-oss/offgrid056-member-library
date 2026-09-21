"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DownloadEntry } from "@/lib/content/repository";
import { getFoundation, getResourceType } from "@/lib/content/taxonomy";
import { formatBytes, formatDate } from "@/lib/format-bytes";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { useMemberState } from "@/lib/member";
import { marketName, type MarketCode } from "@/lib/member/market";

/** The filters named in the brief, mapped onto resource types. */
const GROUPS = [
  { id: "guide", label: "Guides", types: ["guide"] },
  { id: "workbook", label: "Workbooks", types: ["workbook"] },
  { id: "planner", label: "Planners", types: ["planner", "template"] },
  { id: "checklist", label: "Checklists", types: ["checklist"] },
  { id: "assessment", label: "Assessments", types: ["assessment"] },
  { id: "worksheet", label: "Worksheets", types: ["worksheet"] },
  { id: "pack", label: "Packs", types: ["download-pack"] },
] as const;

/**
 * The file for one row.
 *
 * Most resources have one file for everyone. A market-specific resource has one per market and no default, so
 * the member's own market picks it — and with no market chosen, or no verified file for theirs, the row offers
 * nothing and sends them to the resource page instead. It never falls back to another country's file.
 */
function FileCells({ entry: d, market }: { entry: DownloadEntry; market: MarketCode | null }) {
  const file = d.marketFiles ? (market ? d.marketFiles[market] : undefined) : d.fileUrl ? { fileUrl: d.fileUrl, format: d.format, sizeBytes: d.sizeBytes } : undefined;

  if (!file) {
    const reason = !market ? "Choose your market" : `Not yet for ${marketName(market)}`;
    return (
      <>
        <td className="px-4 py-3 text-og-graphite">{d.format}</td>
        <td className="hidden px-4 py-3 text-og-taupe sm:table-cell">—</td>
        <td className="hidden px-4 py-3 text-og-graphite md:table-cell">{formatDate(d.updatedDate)}</td>
        <td className="px-4 py-3 text-right">
          <Link href={`/resources/${d.slug}/`} className="inline-flex min-h-11 items-center text-sm font-semibold text-og-deep underline-offset-2 hover:underline">
            {reason}
            <span className="sr-only"> for {d.title}</span>
          </Link>
        </td>
      </>
    );
  }

  return (
    <>
      <td className="px-4 py-3 text-og-graphite">
        {file.format}
        {d.marketFiles && market && <span className="block text-xs text-og-taupe">{marketName(market)}</span>}
      </td>
      <td className="hidden px-4 py-3 text-og-graphite sm:table-cell">{formatBytes(file.sizeBytes)}</td>
      <td className="hidden px-4 py-3 text-og-graphite md:table-cell">{formatDate(d.updatedDate)}</td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {d.openable && (
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-og-deep ring-1 ring-og-taupe/35 hover:ring-og-deep"
            >
              Open<span className="sr-only"> {d.title} in a new tab</span>
            </a>
          )}
          <a
            href={file.fileUrl}
            download
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-og-charcoal px-3 text-sm font-semibold text-og-white hover:bg-og-deep"
          >
            <Icon name="download" className="size-4" />
            <span className="hidden sm:inline">Download</span>
            <span className="sr-only"> {d.title}</span>
          </a>
        </div>
      </td>
    </>
  );
}

export function DownloadCentre({ downloads }: { downloads: DownloadEntry[] }) {
  const [group, setGroup] = useState<string>("all");
  const view = useMemberState();
  // Until the member state has loaded, treat the market as unknown: that offers nothing market-specific, which
  // is the safe state to render in, rather than briefly showing a default country's file.
  const market = view.ready ? (view.state.market?.code ?? null) : null;

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: downloads.length };
    for (const g of GROUPS) out[g.id] = downloads.filter((d) => (g.types as readonly string[]).includes(d.resourceType)).length;
    return out;
  }, [downloads]);

  const shown = useMemo(() => {
    if (group === "all") return downloads;
    const types = GROUPS.find((g) => g.id === group)?.types ?? [];
    return downloads.filter((d) => (types as readonly string[]).includes(d.resourceType));
  }, [downloads, group]);

  return (
    <>
      <div role="group" aria-label="Filter downloads by type" className="mb-5 flex flex-wrap gap-2">
        {[{ id: "all", label: "All downloads" }, ...GROUPS].map((g) => {
          const active = group === g.id;
          const n = counts[g.id] ?? 0;
          if (!n && g.id !== "all") return null;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              aria-pressed={active}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                active ? "bg-og-charcoal text-og-white" : "bg-white text-og-charcoal ring-1 ring-og-taupe/35 hover:ring-og-deep"
              }`}
            >
              {g.label}
              <span className={active ? "text-og-green" : "text-og-taupe"}>{n}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm text-og-taupe" role="status">
        {shown.length} {shown.length === 1 ? "file" : "files"}
      </p>

      {shown.length === 0 ? (
        <EmptyState icon="downloads" title="No downloads in this group yet" action={{ href: "/library/", label: "Browse the library" }}>
          Files will appear here as resources are added.
        </EmptyState>
      ) : (
        <div
          role="region"
          aria-label="Member downloads table"
          tabIndex={0}
          className="relative overflow-x-auto rounded-xl bg-white ring-1 ring-og-line"
        >
          {/*
            A table cannot shrink below its content, so on a narrow phone the table scrolls inside this box
            instead of the whole page scrolling sideways. tabIndex makes that scroller reachable by keyboard.
          */}
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Member downloads: title, format, file size, updated date and actions</caption>
            <thead className="border-b border-og-line bg-og-white/70 text-xs uppercase tracking-wide text-og-taupe">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Format
                </th>
                <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Size
                </th>
                <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">
                  Updated
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Get it
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((d) => (
                <tr key={d.id} className="border-b border-og-line last:border-0">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <Link href={`/resources/${d.slug}/`} className="inline-flex min-h-6 items-center font-semibold text-og-charcoal underline-offset-2 hover:text-og-deep hover:underline">
                      {d.title}
                    </Link>
                    <span className="block text-xs text-og-taupe">
                      {getResourceType(d.resourceType).label} · {getFoundation(d.foundation).name}
                      {d.isPlaceholder && " · Demo"}
                    </span>
                  </th>
                  <FileCells entry={d} market={market} />

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

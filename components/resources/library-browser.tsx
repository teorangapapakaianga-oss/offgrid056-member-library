"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { ResourceSummary } from "@/lib/content/summaries";
import {
  FILTER_GROUPS,
  SORT_OPTIONS,
  activeFilterCount,
  applyFilters,
  facetCounts,
  parseFilters,
  serializeFilters,
  sortResources,
  type FilterGroup,
  type FilterState,
  type SortId,
} from "@/lib/filters";
import { useNow } from "@/lib/hooks/use-now";
import { useMemberState } from "@/lib/member";
import { createSearch } from "@/lib/search";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { ResourceGrid } from "./resource-card";
import { GROUP_OPTIONS, ResourceFilters } from "./resource-filters";

/**
 * Search + filters + results (architecture §9). State lives in the URL query string.
 * `hideGroups` removes filter groups that are fixed by the page (e.g. Foundation on a foundation page).
 */
export function LibraryBrowser({
  items,
  hideGroups = [],
  searchLabel = "Search the library",
  autoFocusSearch = false,
}: {
  items: ResourceSummary[];
  hideGroups?: FilterGroup[];
  searchLabel?: string;
  autoFocusSearch?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const now = useNow();
  const { completedIds } = useMemberState();

  const urlFilters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const sort = (SORT_OPTIONS.some((s) => s.id === params.get("sort")) ? params.get("sort") : "recommended") as SortId;
  const [query, setQuery] = useState(urlFilters.q);
  const deferredQuery = useDeferredValue(query);
  const groups = FILTER_GROUPS.filter((g) => !hideGroups.includes(g));

  // The latest URL state, read by the debounced search update so it never re-applies stale filters.
  const latest = useRef({ filters: urlFilters, sort });
  useEffect(() => {
    latest.current = { filters: urlFilters, sort };
  }, [urlFilters, sort]);

  // Keep the input in step when the URL changes from outside (Back button, header search).
  const lastPushed = useRef(urlFilters.q);
  useEffect(() => {
    if (urlFilters.q !== lastPushed.current) {
      lastPushed.current = urlFilters.q;
      setQuery(urlFilters.q);
    }
  }, [urlFilters.q]);

  function pushState(next: FilterState, nextSort: SortId = latest.current.sort) {
    const qs = new URLSearchParams(serializeFilters(next));
    if (nextSort !== "recommended") qs.set("sort", nextSort);
    lastPushed.current = next.q.trim();
    latest.current = { filters: { ...next, q: next.q.trim() }, sort: nextSort };
    const s = qs.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }

  // Debounced URL update while typing; results update instantly from local state.
  useEffect(() => {
    if (query.trim() === lastPushed.current) return;
    const t = setTimeout(() => pushState({ ...latest.current.filters, q: query }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pushState reads the latest URL state from a ref
  }, [query]);

  const search = useMemo(() => createSearch(items), [items]);
  const ctx = useMemo(() => ({ now, completed: completedIds }), [now, completedIds]);
  const filters: FilterState = { ...urlFilters, q: deferredQuery };

  const { results, counts } = useMemo(() => {
    const ids = search(deferredQuery);
    let pool = items;
    if (ids) {
      const byId = new Map(items.map((r) => [r.id, r]));
      pool = ids.map((id) => byId.get(id)).filter((r): r is ResourceSummary => Boolean(r));
    }
    const filtered = applyFilters(pool, filters, ctx);
    return {
      results: ids && sort === "recommended" ? filtered : sortResources(filtered, sort),
      counts: facetCounts(pool, filters, ctx),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filters is derived from urlFilters + deferredQuery
  }, [items, search, deferredQuery, urlFilters, ctx, sort]);

  const toggle = (g: FilterGroup, v: string) => {
    const cur = urlFilters[g];
    pushState({ ...urlFilters, q: query, [g]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  };
  const clearAll = () => {
    setQuery("");
    pushState({ q: "", foundation: [], type: [], difficulty: [], time: [], status: [] });
  };
  const nActive = activeFilterCount(urlFilters);
  const sheetRef = useRef<HTMLDialogElement>(null);

  const chips = groups.flatMap((g) =>
    urlFilters[g].map((v) => ({ g, v, label: GROUP_OPTIONS[g].options.find((o) => o.id === v)?.label ?? v })),
  );

  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-8">
      {/* Desktop filter column */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-xl bg-white p-4 ring-1 ring-og-line">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-og-charcoal">Filters</h2>
            {nActive > 0 && (
              <button type="button" onClick={clearAll} className="text-sm font-semibold text-og-deep underline-offset-2 hover:underline">
                Clear all
              </button>
            )}
          </div>
          <ResourceFilters filters={urlFilters} counts={counts} groups={groups} onToggle={toggle} idPrefix="side" />
        </div>
      </aside>

      <div className="min-w-0">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
          <label htmlFor="library-search" className="sr-only">
            {searchLabel}
          </label>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-og-taupe" />
          <input
            id="library-search"
            type="search"
            value={query}
            autoFocus={autoFocusSearch}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${searchLabel}…`}
            className="h-13 w-full rounded-xl border border-og-taupe/35 bg-white pr-4 pl-12 text-base text-og-charcoal shadow-sm placeholder:text-og-taupe focus:border-og-deep"
          />
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => sheetRef.current?.showModal()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/35 lg:hidden"
            aria-haspopup="dialog"
          >
            <Icon name="filter" className="size-5" />
            Filters{nActive > 0 && <span className="rounded-full bg-og-deep px-2 text-xs text-og-white">{nActive}</span>}
          </button>

          {chips.map((c) => (
            <button
              key={`${c.g}-${c.v}`}
              type="button"
              onClick={() => toggle(c.g, c.v)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-og-deep px-3 text-xs font-semibold text-og-white"
              aria-label={`Remove filter: ${c.label}`}
            >
              {c.label}
              <Icon name="close" className="size-3.5" />
            </button>
          ))}
          {nActive > 0 && (
            <button type="button" onClick={clearAll} className="min-h-9 px-2 text-xs font-semibold text-og-deep underline-offset-2 hover:underline lg:hidden">
              Clear all
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="library-sort" className="text-sm text-og-taupe">
              Sort
            </label>
            <select
              id="library-sort"
              value={sort}
              onChange={(e) => pushState({ ...urlFilters, q: query }, e.target.value as SortId)}
              className="min-h-11 rounded-lg border border-og-taupe/35 bg-white px-3 text-sm text-og-charcoal"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 mb-4 text-sm text-og-taupe" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "resource" : "resources"}
          {deferredQuery.trim() && (
            <>
              {" "}
              for “<span className="font-semibold text-og-charcoal">{deferredQuery.trim()}</span>”
            </>
          )}
        </p>

        {results.length ? (
          <ResourceGrid items={results} headingLevel={2} />
        ) : (
          <EmptyState
            icon="search"
            title="No resources match"
            action={
              <button type="button" onClick={clearAll} className="mt-1 rounded-lg bg-og-green px-4 py-2 text-sm font-semibold text-og-charcoal">
                Clear search and filters
              </button>
            }
          >
            Try fewer filters or a different word. Searching “mold” also finds “mould”, and “flashlight” finds “torch”.
          </EmptyState>
        )}
      </div>

      {/* Tablet/mobile filter sheet */}
      <dialog
        ref={sheetRef}
        aria-label="Filters"
        className="og-sheet fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none rounded-t-2xl bg-white p-0 text-og-charcoal md:mx-auto md:max-w-lg"
        onClick={(e) => {
          if (e.target === e.currentTarget) sheetRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            sheetRef.current?.close();
          }
        }}
      >
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-center justify-between border-b border-og-line px-5 py-3">
            <h2 className="font-display text-2xl">Filters</h2>
            <button type="button" autoFocus onClick={() => sheetRef.current?.close()} className="flex size-11 items-center justify-center rounded-lg hover:bg-og-white" aria-label="Close filters">
              <Icon name="close" className="size-6" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-4">
            <ResourceFilters filters={urlFilters} counts={counts} groups={groups} onToggle={toggle} idPrefix="sheet" />
          </div>
          <div className="flex gap-3 border-t border-og-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button type="button" onClick={clearAll} className="min-h-11 flex-1 rounded-lg px-4 text-sm font-semibold text-og-deep ring-1 ring-og-deep/40">
              Clear all
            </button>
            <button type="button" onClick={() => sheetRef.current?.close()} className="min-h-11 flex-1 rounded-lg bg-og-charcoal px-4 text-sm font-semibold text-og-white">
              Show {results.length} {results.length === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

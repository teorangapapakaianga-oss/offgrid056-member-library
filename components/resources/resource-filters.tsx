"use client";
import { fiveFoundations, foundations, resourceTypes } from "@/lib/content/taxonomy";
import { DIFFICULTY_LABELS, TIME_BANDS } from "@/lib/format";
import { STATUS_OPTIONS, type FilterGroup, type FilterState } from "@/lib/filters";

export interface FilterOption {
  id: string;
  label: string;
}

export const GROUP_OPTIONS: Record<FilterGroup, { label: string; options: FilterOption[] }> = {
  foundation: { label: "Foundation", options: [...fiveFoundations, foundations.find((f) => f.id === "general")!].map((f) => ({ id: f.id, label: f.name })) },
  type: { label: "Resource type", options: resourceTypes.map((t) => ({ id: t.id, label: t.label })) },
  difficulty: { label: "Difficulty", options: Object.entries(DIFFICULTY_LABELS).map(([id, label]) => ({ id, label })) },
  time: { label: "Time", options: TIME_BANDS.map((b) => ({ id: b.id, label: b.label })) },
  status: { label: "Status", options: STATUS_OPTIONS.map((s) => ({ id: s.id, label: s.label })) },
};

/**
 * Filter panel: checkbox groups in fieldsets. Options with no results are hidden unless already selected,
 * so members never pick a combination that returns nothing.
 */
export function ResourceFilters({
  filters,
  counts,
  groups,
  onToggle,
  idPrefix,
}: {
  filters: FilterState;
  counts: Record<FilterGroup, Record<string, number>>;
  groups: FilterGroup[];
  onToggle: (group: FilterGroup, value: string) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => {
        const { label, options } = GROUP_OPTIONS[g];
        const visible = options.filter((o) => counts[g][o.id] > 0 || filters[g].includes(o.id));
        if (!visible.length) return null;
        return (
          <fieldset key={g}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-og-deep">{label}</legend>
            <ul role="list" className="flex flex-col gap-0.5">
              {visible.map((o) => {
                const id = `${idPrefix}-${g}-${o.id}`;
                const checked = filters[g].includes(o.id);
                return (
                  <li key={o.id}>
                    <label htmlFor={id} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-og-white">
                      <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(g, o.id)}
                        className="size-4.5 shrink-0 accent-og-deep"
                      />
                      <span className="flex-1 text-og-charcoal">{o.label}</span>
                      <span className="text-xs tabular-nums text-og-taupe" aria-label={`${counts[g][o.id]} results`}>
                        {counts[g][o.id]}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
    </div>
  );
}

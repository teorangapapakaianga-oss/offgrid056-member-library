"use client";
import { useMemo, useState } from "react";
import { COUNTRY_NAMES, SERVICE_TYPE_LABELS, type Supplier } from "@/lib/content/directory-schemas";
import { getFoundation } from "@/lib/content/taxonomy";
import { FOUNDATION_STYLES } from "@/lib/foundation-style";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";

/** Suppliers & Services directory: filter by country, foundation and category. Demonstration data only. */
export function SupplierDirectory({ suppliers }: { suppliers: Supplier[] }) {
  const [country, setCountry] = useState("all");
  const [foundation, setFoundation] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => [...new Set(suppliers.map((s) => s.category))].sort(), [suppliers]);
  const foundations = useMemo(() => [...new Set(suppliers.flatMap((s) => s.foundations))], [suppliers]);
  const countries = useMemo(() => [...new Set(suppliers.map((s) => s.country))].sort(), [suppliers]);

  const shown = suppliers.filter(
    (s) =>
      (country === "all" || s.country === country) &&
      (foundation === "all" || s.foundations.includes(foundation as Supplier["foundations"][number])) &&
      (category === "all" || s.category === category),
  );

  const select = "min-h-11 rounded-lg border border-og-taupe/35 bg-white px-3 text-sm text-og-charcoal";

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="sup-country" className="text-xs font-semibold uppercase tracking-[0.14em] text-og-deep">
            Country
          </label>
          <select id="sup-country" value={country} onChange={(e) => setCountry(e.target.value)} className={select}>
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {COUNTRY_NAMES[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="sup-foundation" className="text-xs font-semibold uppercase tracking-[0.14em] text-og-deep">
            Foundation
          </label>
          <select id="sup-foundation" value={foundation} onChange={(e) => setFoundation(e.target.value)} className={select}>
            <option value="all">All foundations</option>
            {foundations.map((f) => (
              <option key={f} value={f}>
                {getFoundation(f).name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="sup-category" className="text-xs font-semibold uppercase tracking-[0.14em] text-og-deep">
            Category
          </label>
          <select id="sup-category" value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-og-taupe" role="status">
        {shown.length} {shown.length === 1 ? "listing" : "listings"}
      </p>

      {shown.length === 0 ? (
        <EmptyState icon="suppliers" title="No listings match those filters">
          Try a wider country or foundation.
        </EmptyState>
      ) : (
        <ul role="list" className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {shown.map((s) => (
            <li key={s.id} className="flex h-full flex-col gap-3 rounded-xl bg-white p-5 ring-1 ring-og-line">
              <div className="flex flex-wrap items-center gap-1.5">
                {s.foundations.map((f) => {
                  const st = FOUNDATION_STYLES[f];
                  return (
                    <span key={f} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide ${st.surface} ${st.ink} ${st.ring}`}>
                      {getFoundation(f).name}
                    </span>
                  );
                })}
                {s.isDemo && (
                  <span className="inline-flex items-center rounded-full border border-dashed border-og-taupe px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-og-taupe">
                    Demonstration content
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold text-og-charcoal">{s.name}</h2>
              <p className="text-sm text-og-graphite/90">{s.description}</p>
              <dl className="flex flex-col gap-1 text-xs text-og-taupe">
                <div className="flex gap-2">
                  <dt className="font-semibold">Category</dt>
                  <dd>{s.category}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold">Where</dt>
                  <dd>
                    {s.region}, {COUNTRY_NAMES[s.country]}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold">Services</dt>
                  <dd>{s.serviceTypes.map((t) => SERVICE_TYPE_LABELS[t]).join(" · ")}</dd>
                </div>
              </dl>
              <a
                href={s.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep"
              >
                Visit website
                <Icon name="arrowRight" className="size-4" />
                <span className="sr-only"> for {s.name} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

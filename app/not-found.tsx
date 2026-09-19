import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="py-6">
      <h1 className="font-display mb-6 text-4xl leading-none text-og-charcoal sm:text-5xl">Page not found</h1>
      <EmptyState icon="search" title="We couldn't find that page" action={{ href: "/library/", label: "Search the library" }}>
        The link may be out of date, or the resource may have moved. Try searching the library, or go back to your dashboard.
      </EmptyState>
    </div>
  );
}

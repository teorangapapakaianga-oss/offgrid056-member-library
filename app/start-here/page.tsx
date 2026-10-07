import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceCard } from "@/components/resources/resource-card";
import { EmptyState } from "@/components/ui/empty-state";
import { inCollection } from "@/lib/content/collection-rules";
import { getSummaries, isPrivatePreview } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Start Here" };

export default function StartHerePage() {
  const privatePreview = isPrivatePreview();
  // In the private preview, Start Here lists the protected member resources only. Demonstration placeholders stay reachable on
  // their own routes and through the programme, the workshops and the demo learning path (Stage 9.87). The public demo build
  // is not the private preview, so it lists them exactly as before.
  const steps = getSummaries((r) => inCollection(r, "start-here", { hidePlaceholders: true, privatePreview })).sort((a, b) => a.order - b.order);
  return (
    <>
      <Breadcrumbs items={[{ label: "Start Here" }]} />
      <PageHeader
        eyebrow="Your first steps"
        title="Start here"
        description="New to the library? Work through these in order. Each one is short, and together they give you a clear picture of where your household is and what to do next."
      />
      {steps.length ? (
        <ol role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((r, i) => (
            <li key={r.id} className="flex flex-col gap-2">
              <p className="font-display text-xl leading-none text-og-deep">Step {i + 1}</p>
              <ResourceCard resource={r} headingLevel={2} />
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState title="Start Here resources are on their way" action={{ href: "/library/", label: "Browse the library" }} />
      )}
      <p className="mt-8 text-sm text-og-taupe">
        Ready for more? Explore <Link href="/foundations/" className="font-semibold text-og-deep underline underline-offset-2">the Five Foundations</Link>.
      </p>
    </>
  );
}

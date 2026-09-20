import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { SupplierDirectory } from "@/components/directory/supplier-directory";
import { Icon } from "@/components/ui/icon";
import { getSuppliers } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Suppliers & Services" };

export default function SuppliersPage() {
  const suppliers = getSuppliers();
  return (
    <>
      <Breadcrumbs items={[{ label: "Suppliers & Services" }]} />
      <PageHeader
        eyebrow="Directory"
        title="Suppliers & Services"
        description="Suppliers and services across New Zealand, Australia, the United States and Canada, filtered by country, foundation and category."
      />
      <p className="mb-6 flex items-start gap-2 rounded-lg border border-dashed border-og-taupe bg-white px-4 py-3 text-sm text-og-graphite">
        <Icon name="info" className="mt-0.5 size-5 shrink-0 text-og-taupe" />
        <span>
          <strong>Demonstration content.</strong> Every listing below is an example used to build the directory. No real supplier is
          listed, recommended or endorsed yet, and every website link points to <code>example.com</code>. OffGrid056 will always
          leave the choice of supplier to you.
        </span>
      </p>
      <SupplierDirectory suppliers={suppliers} />
    </>
  );
}

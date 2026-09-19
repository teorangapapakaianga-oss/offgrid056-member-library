import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import type { IconName } from "@/components/ui/icon";
import { Breadcrumbs } from "./breadcrumbs";
import { PageHeader } from "./page-header";

/** Section shell for areas built in a later stage: navigable now, and clearly labelled as not built yet. */
export function StagePlaceholder({
  title,
  eyebrow,
  description,
  stage,
  icon,
  children,
}: {
  title: string;
  eyebrow?: string;
  description: string;
  stage: 4 | 5;
  icon: IconName;
  children?: ReactNode;
}) {
  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState icon={icon} title={`This section is built in Stage ${stage}`} action={{ href: "/library/", label: "Browse the library" }}>
        {children}
      </EmptyState>
    </>
  );
}

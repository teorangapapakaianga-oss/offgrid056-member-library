import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { StorageNotice } from "@/components/member/member-actions";
import { SavedView } from "@/components/member/saved-view";
import { getSummaries } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Saved resources" };

export default function SavedPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Saved" }]} />
      <StorageNotice />
      <PageHeader eyebrow="My library" title="Saved resources" description="Everything you have saved, newest first." />
      <SavedView items={getSummaries()} />
    </>
  );
}

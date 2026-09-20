import { Dashboard } from "@/components/member/dashboard";
import { StorageNotice } from "@/components/member/member-actions";
import { getSummaries, loadLearningPaths } from "@/lib/content/repository";

export default function DashboardPage() {
  const items = getSummaries();
  const paths = loadLearningPaths().map((p) => ({ id: p.id, foundation: p.foundation, steps: p.steps }));
  return (
    <>
      <StorageNotice />
      <Dashboard items={items} paths={paths} />
    </>
  );
}

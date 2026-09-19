import { Dashboard } from "@/components/member/dashboard";
import { getSummaries, loadLearningPaths } from "@/lib/content/repository";

export default function DashboardPage() {
  const items = getSummaries();
  const paths = loadLearningPaths().map((p) => ({ id: p.id, foundation: p.foundation, steps: p.steps }));
  return <Dashboard items={items} paths={paths} />;
}

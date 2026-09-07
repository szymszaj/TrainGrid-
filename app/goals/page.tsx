import { GoalFormDialog } from "@/components/goals/GoalFormDialog";
import { GoalList } from "@/components/goals/GoalList";
import { getCategories } from "@/lib/data/categories.data";
import { getEntriesForPeriod } from "@/lib/data/entries.data";
import { getGoals } from "@/lib/data/goals.data";
import { parseCategoryOptions } from "@/lib/parsers/categories.parser";
import { parseGoalCards } from "@/lib/parsers/goals.parser";
import { goalProgressWindow } from "@/lib/stats/date-utils";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const now = new Date();
  const { start, end } = goalProgressWindow(now);

  const [categories, goals, entriesInWindow] = await Promise.all([
    getCategories(),
    getGoals(),
    getEntriesForPeriod(start, end),
  ]);

  const categoryOptions = parseCategoryOptions(categories);
  const goalCards = parseGoalCards(goals, entriesInWindow, now);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Cele</h1>
        <GoalFormDialog categories={categoryOptions} />
      </div>

      <GoalList goals={goalCards} />
    </div>
  );
}

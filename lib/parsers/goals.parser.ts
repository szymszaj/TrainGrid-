import type { EntryWithCategory } from "@/lib/data/entries.data";
import type { GoalWithCategory } from "@/lib/data/goals.data";
import { sumDistance, sumDuration } from "@/lib/stats/aggregations";
import { endOfUTCMonth, endOfUTCWeek, startOfUTCMonth, startOfUTCWeek } from "@/lib/stats/date-utils";
import type { GoalCardData } from "@/types/goal.types";
import type { GoalMetric } from "@prisma/client";

function valueForMetric(entries: EntryWithCategory[], metric: GoalMetric): number {
  switch (metric) {
    case "SESSIONS":
      return entries.length;
    case "DURATION_MINUTES":
      return sumDuration(entries);
    case "DISTANCE_KM":
      return sumDistance(entries);
    default:
      return 0;
  }
}

export function parseGoalCards(
  goals: GoalWithCategory[],
  entriesInWindow: EntryWithCategory[],
  now: Date = new Date(),
): GoalCardData[] {
  const weekStart = startOfUTCWeek(now);
  const weekEnd = endOfUTCWeek(now);
  const monthStart = startOfUTCMonth(now);
  const monthEnd = endOfUTCMonth(now);

  return goals.map((goal) => {
    const periodStart = goal.period === "WEEKLY" ? weekStart : monthStart;
    const periodEnd = goal.period === "WEEKLY" ? weekEnd : monthEnd;

    const relevantEntries = entriesInWindow.filter((entry) => {
      const withinPeriod = entry.date >= periodStart && entry.date <= periodEnd;
      const matchesCategory = !goal.categoryId || entry.categoryId === goal.categoryId;
      return withinPeriod && matchesCategory;
    });

    const currentValue = valueForMetric(relevantEntries, goal.metric);
    const progressPercent =
      goal.targetValue > 0 ? Math.min(100, Math.round((currentValue / goal.targetValue) * 100)) : 0;

    return {
      id: goal.id,
      title: goal.title,
      metric: goal.metric,
      period: goal.period,
      targetValue: goal.targetValue,
      currentValue,
      progressPercent,
      categoryName: goal.category?.name ?? null,
      categoryColor: goal.category?.color ?? null,
    };
  });
}

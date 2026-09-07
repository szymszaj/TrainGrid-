import type { GoalMetric, GoalPeriod } from "@prisma/client";

export interface GoalCardData {
  id: string;
  title: string;
  metric: GoalMetric;
  period: GoalPeriod;
  targetValue: number;
  currentValue: number;
  progressPercent: number;
  categoryName: string | null;
  categoryColor: string | null;
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeleteGoalButton } from "@/components/goals/DeleteGoalButton";
import type { GoalCardData } from "@/types/goal.types";

const METRIC_LABELS: Record<GoalCardData["metric"], string> = {
  SESSIONS: "wpisów",
  DURATION_MINUTES: "min",
  DISTANCE_KM: "km",
};

const PERIOD_LABELS: Record<GoalCardData["period"], string> = {
  WEEKLY: "w tym tygodniu",
  MONTHLY: "w tym miesiącu",
};

interface GoalCardProps {
  goal: GoalCardData;
}

export function GoalCard({ goal }: GoalCardProps) {
  const unit = METRIC_LABELS[goal.metric];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-base">{goal.title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {goal.categoryName ? `${goal.categoryName} · ` : ""}
            {PERIOD_LABELS[goal.period]}
          </p>
        </div>
        <DeleteGoalButton goalId={goal.id} />
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={goal.progressPercent} />
        <p className="text-sm text-muted-foreground">
          {goal.currentValue} / {goal.targetValue} {unit} ({goal.progressPercent}%)
        </p>
      </CardContent>
    </Card>
  );
}

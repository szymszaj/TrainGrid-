import { GoalCard } from "@/components/goals/GoalCard";
import type { GoalCardData } from "@/types/goal.types";

interface GoalListProps {
  goals: GoalCardData[];
}

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak celów. Dodaj pierwszy cel.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

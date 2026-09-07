import type { EntryWithCategory } from "@/lib/data/entries.data";
import { sumDistance, sumDuration } from "@/lib/stats/aggregations";
import { computeCurrentStreak, computeLongestStreak } from "@/lib/stats/streaks";
import type { StatsSummary } from "@/types/stats.types";

export function parseStatsSummary(
  entriesForYear: EntryWithCategory[],
  allActiveDates: Date[],
): StatsSummary {
  return {
    totalSessions: entriesForYear.length,
    totalDurationMinutes: sumDuration(entriesForYear),
    totalDistanceKm: sumDistance(entriesForYear),
    currentStreak: computeCurrentStreak(allActiveDates),
    longestStreak: computeLongestStreak(allActiveDates),
  };
}

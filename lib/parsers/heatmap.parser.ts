import type { EntryWithCategory } from "@/lib/data/entries.data";
import { groupEntriesByDay, sumDuration } from "@/lib/stats/aggregations";
import { addUTCDays, toDayKey } from "@/lib/stats/date-utils";
import type { HeatmapData, HeatmapDay, HeatmapLevel } from "@/types/heatmap.types";

function levelForCount(count: number): HeatmapLevel {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export function parseHeatmapData(entries: EntryWithCategory[], year: number): HeatmapData {
  const byDay = groupEntriesByDay(entries);

  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31));

  const gridStart = addUTCDays(yearStart, -yearStart.getUTCDay());
  const gridEnd = addUTCDays(yearEnd, 6 - yearEnd.getUTCDay());

  const days: HeatmapDay[] = [];
  let maxCount = 0;
  for (let cursor = gridStart; cursor <= gridEnd; cursor = addUTCDays(cursor, 1)) {
    const key = toDayKey(cursor);
    const dayEntries = byDay.get(key) ?? [];
    const count = dayEntries.length;
    maxCount = Math.max(maxCount, count);
    days.push({
      date: key,
      count,
      level: levelForCount(count),
      totalDurationMinutes: sumDuration(dayEntries),
    });
  }

  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { year, weeks, maxCount };
}

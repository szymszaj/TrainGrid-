import { addUTCDays, startOfUTCDay, toDayKey, utcDaysBetween } from "@/lib/stats/date-utils";

export function computeCurrentStreak(activeDates: Date[], today: Date = new Date()): number {
  const daySet = new Set(activeDates.map(toDayKey));
  let cursor = startOfUTCDay(today);

  if (!daySet.has(toDayKey(cursor))) {
    cursor = addUTCDays(cursor, -1);
  }

  let streak = 0;
  while (daySet.has(toDayKey(cursor))) {
    streak += 1;
    cursor = addUTCDays(cursor, -1);
  }
  return streak;
}

export function computeLongestStreak(activeDates: Date[]): number {
  if (activeDates.length === 0) return 0;

  const uniqueDays = Array.from(new Set(activeDates.map(toDayKey)))
    .sort()
    .map((key) => new Date(`${key}T00:00:00.000Z`));

  let longest = 1;
  let current = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    const diff = utcDaysBetween(uniqueDays[i - 1], uniqueDays[i]);
    if (diff === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

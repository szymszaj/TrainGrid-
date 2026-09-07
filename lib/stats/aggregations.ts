import { toDayKey } from "@/lib/stats/date-utils";

export function sumDuration(entries: { durationMinutes: number | null }[]): number {
  return entries.reduce((total, entry) => total + (entry.durationMinutes ?? 0), 0);
}

export function sumDistance(entries: { distanceKm: number | null }[]): number {
  return entries.reduce((total, entry) => total + (entry.distanceKm ?? 0), 0);
}

export function groupEntriesByDay<T extends { date: Date }>(entries: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const entry of entries) {
    const key = toDayKey(entry.date);
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(entry);
    } else {
      map.set(key, [entry]);
    }
  }
  return map;
}

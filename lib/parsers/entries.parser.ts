import type { EntryWithCategory } from "@/lib/data/entries.data";
import { toDayKey } from "@/lib/stats/date-utils";
import type { EntryListItem } from "@/types/entry.types";

export function parseEntryListItems(entries: EntryWithCategory[]): EntryListItem[] {
  return entries.map((entry) => ({
    id: entry.id,
    date: toDayKey(entry.date),
    topic: entry.topic,
    description: entry.description,
    durationMinutes: entry.durationMinutes,
    distanceKm: entry.distanceKm,
    category: {
      id: entry.category.id,
      name: entry.category.name,
      color: entry.category.color,
      icon: entry.category.icon,
    },
  }));
}

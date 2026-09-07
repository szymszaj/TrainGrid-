import type { CategoryOption } from "@/types/category.types";

export interface EntryListItem {
  id: string;
  date: string;
  topic: string;
  description: string | null;
  durationMinutes: number | null;
  distanceKm: number | null;
  category: CategoryOption;
}

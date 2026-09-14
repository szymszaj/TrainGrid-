import { EntryListItem } from "@/components/entries/EntryListItem";
import type { CategoryOption } from "@/types/category.types";
import type { EntryListItem as EntryListItemData } from "@/types/entry.types";

interface EntryListProps {
  entries: EntryListItemData[];
  categories: CategoryOption[];
  emptyMessage?: string;
}

export function EntryList({
  entries,
  categories,
  emptyMessage = "Brak wpisów.",
}: EntryListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <EntryListItem key={entry.id} entry={entry} categories={categories} />
      ))}
    </div>
  );
}

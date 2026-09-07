"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteEntryButton } from "@/components/entries/DeleteEntryButton";
import { EntryFormDialog } from "@/components/entries/EntryFormDialog";
import { formatDisplayDate } from "@/lib/format/date";
import type { CategoryOption } from "@/types/category.types";
import type { EntryListItem as EntryListItemData } from "@/types/entry.types";

interface EntryListItemProps {
  entry: EntryListItemData;
  categories: CategoryOption[];
}

export function EntryListItem({ entry, categories }: EntryListItemProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${entry.category.color}26`, color: entry.category.color }}
          >
            {entry.category.icon && <span>{entry.category.icon}</span>}
            {entry.category.name}
          </span>
          <span className="text-xs text-muted-foreground">{formatDisplayDate(entry.date)}</span>
        </div>
        <p className="font-medium">{entry.topic}</p>
        {entry.description && (
          <p className="whitespace-pre-line text-sm text-muted-foreground">{entry.description}</p>
        )}
        {(entry.durationMinutes || entry.distanceKm) && (
          <p className="text-xs text-muted-foreground">
            {entry.durationMinutes ? `${entry.durationMinutes} min` : null}
            {entry.durationMinutes && entry.distanceKm ? " · " : null}
            {entry.distanceKm ? `${entry.distanceKm} km` : null}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Edytuj wpis" onClick={() => setEditOpen(true)}>
          <PencilIcon className="size-4" />
        </Button>
        <DeleteEntryButton entryId={entry.id} />
      </div>
      <EntryFormDialog categories={categories} open={editOpen} onOpenChange={setEditOpen} entry={entry} />
    </div>
  );
}

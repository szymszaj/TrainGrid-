"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EntryForm } from "@/components/entries/EntryForm";
import { createEntry, updateEntry } from "@/lib/actions/entry.actions";
import type { EntryFormValues } from "@/lib/validation/entry.schema";
import type { CategoryOption } from "@/types/category.types";
import type { EntryListItem } from "@/types/entry.types";

interface EntryFormDialogProps {
  categories: CategoryOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: EntryListItem;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultValuesFor(entry: EntryListItem | undefined): EntryFormValues {
  if (!entry) {
    return {
      categoryId: "",
      date: todayIso(),
      topic: "",
      description: "",
      durationMinutes: undefined,
      distanceKm: undefined,
    };
  }
  return {
    categoryId: entry.category.id,
    date: entry.date,
    topic: entry.topic,
    description: entry.description ?? "",
    durationMinutes: entry.durationMinutes ?? undefined,
    distanceKm: entry.distanceKm ?? undefined,
  };
}

export function EntryFormDialog({ categories, open, onOpenChange, entry }: EntryFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!entry;

  function handleSubmit(values: EntryFormValues) {
    startTransition(async () => {
      try {
        if (isEdit) {
          await updateEntry(entry.id, values);
          toast.success("Wpis zaktualizowany");
        } else {
          await createEntry(values);
          toast.success("Wpis dodany");
        }
        onOpenChange(false);
      } catch {
        toast.error("Nie udało się zapisać wpisu");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj wpis" : "Nowy wpis"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Zmień szczegóły tego wpisu." : "Zapisz co dzisiaj zrobiłeś."}
          </DialogDescription>
        </DialogHeader>
        <EntryForm
          key={entry?.id ?? "create"}
          categories={categories}
          defaultValues={defaultValuesFor(entry)}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel={isEdit ? "Zapisz zmiany" : "Dodaj wpis"}
        />
      </DialogContent>
    </Dialog>
  );
}

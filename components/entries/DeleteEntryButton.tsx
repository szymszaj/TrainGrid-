"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEntry } from "@/lib/actions/entry.actions";

interface DeleteEntryButtonProps {
  entryId: string;
}

export function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteEntry(entryId);
        toast.success("Wpis usunięty");
        setOpen(false);
      } catch {
        toast.error("Nie udało się usunąć wpisu");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Usuń wpis">
        <TrashIcon className="size-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć ten wpis?</AlertDialogTitle>
          <AlertDialogDescription>Tej operacji nie można cofnąć.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Usuwanie..." : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </AlertDialog>
  );
}

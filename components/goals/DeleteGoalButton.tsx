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
import { deleteGoal } from "@/lib/actions/goal.actions";

interface DeleteGoalButtonProps {
  goalId: string;
}

export function DeleteGoalButton({ goalId }: DeleteGoalButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteGoal(goalId);
        toast.success("Cel usunięty");
        setOpen(false);
      } catch {
        toast.error("Nie udało się usunąć celu");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Usuń cel">
        <TrashIcon className="size-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć ten cel?</AlertDialogTitle>
          <AlertDialogDescription>Tej operacji nie można cofnąć.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Usuwanie..." : "Usuń"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

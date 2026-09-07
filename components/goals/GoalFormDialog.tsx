"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategorySelect } from "@/components/categories/CategorySelect";
import { createGoal } from "@/lib/actions/goal.actions";
import {
  goalFormSchema,
  goalMetricValues,
  goalPeriodValues,
  type GoalFormInput,
  type GoalFormValues,
} from "@/lib/validation/goal.schema";
import type { CategoryOption } from "@/types/category.types";

const METRIC_LABELS: Record<(typeof goalMetricValues)[number], string> = {
  SESSIONS: "Liczba wpisów",
  DURATION_MINUTES: "Czas (minuty)",
  DISTANCE_KM: "Dystans (km)",
};

const PERIOD_LABELS: Record<(typeof goalPeriodValues)[number], string> = {
  WEEKLY: "Tygodniowo",
  MONTHLY: "Miesięcznie",
};

interface GoalFormDialogProps {
  categories: CategoryOption[];
}

export function GoalFormDialog({ categories }: GoalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalFormInput, unknown, GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: { title: "", metric: "DURATION_MINUTES", period: "WEEKLY", targetValue: 0, categoryId: "" },
  });

  function onSubmit(values: GoalFormValues) {
    startTransition(async () => {
      try {
        await createGoal(values);
        toast.success("Cel dodany");
        reset();
        setOpen(false);
      } catch {
        toast.error("Nie udało się dodać celu");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" size="sm">
            <PlusIcon className="size-4" />
            Nowy cel
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nowy cel</DialogTitle>
          <DialogDescription>Ustaw cel tygodniowy lub miesięczny.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="goal-title">Nazwa celu</FieldLabel>
            <Input id="goal-title" placeholder="np. 60 min treningu tygodniowo" {...register("title")} />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field>
            <FieldLabel>Kategoria (opcjonalnie)</FieldLabel>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <CategorySelect
                  categories={categories}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  allowAllOption
                  placeholder="Wszystkie kategorie"
                />
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.metric}>
              <FieldLabel>Metryka</FieldLabel>
              <Controller
                control={control}
                name="metric"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalMetricValues.map((metric) => (
                        <SelectItem key={metric} value={metric}>
                          {METRIC_LABELS[metric]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field data-invalid={!!errors.period}>
              <FieldLabel>Okres</FieldLabel>
              <Controller
                control={control}
                name="period"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalPeriodValues.map((period) => (
                        <SelectItem key={period} value={period}>
                          {PERIOD_LABELS[period]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <Field data-invalid={!!errors.targetValue}>
            <FieldLabel htmlFor="goal-target">Wartość docelowa</FieldLabel>
            <Input id="goal-target" type="number" min={0} step={1} {...register("targetValue")} />
            <FieldError errors={[errors.targetValue]} />
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Zapisywanie..." : "Dodaj cel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

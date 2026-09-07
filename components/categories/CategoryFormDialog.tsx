"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import { createCategory } from "@/lib/actions/category.actions";
import { CATEGORY_COLOR_PRESETS, CATEGORY_ICON_PRESETS } from "@/lib/constants/category-presets";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validation/category.schema";
import type { Category } from "@prisma/client";
import { PlusIcon } from "lucide-react";

interface CategoryFormDialogProps {
  onCreated?: (category: Category) => void;
  trigger?: React.ReactNode;
}

export function CategoryFormDialog({ onCreated, trigger }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", color: CATEGORY_COLOR_PRESETS[0].value, icon: CATEGORY_ICON_PRESETS[0] },
  });

  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  function onSubmit(values: CategoryFormValues) {
    startTransition(async () => {
      try {
        const category = await createCategory(values);
        toast.success("Kategoria dodana");
        onCreated?.(category);
        reset();
        setOpen(false);
      } catch {
        toast.error("Nie udało się dodać kategorii");
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
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon className="size-4" />
            Nowa kategoria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nowa kategoria</DialogTitle>
          <DialogDescription>Dodaj hobby lub aktywność, którą chcesz śledzić.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="category-name">Nazwa</FieldLabel>
            <Input id="category-name" placeholder="np. Gitara" {...register("name")} />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel>Kolor</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  aria-label={preset.label}
                  onClick={() => setValue("color", preset.value, { shouldValidate: true })}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform",
                    selectedColor === preset.value ? "scale-110 border-foreground" : "border-transparent",
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
            <FieldError errors={[errors.color]} />
          </Field>

          <Field>
            <FieldLabel>Ikona</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ICON_PRESETS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("icon", icon, { shouldValidate: true })}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md border text-base transition-colors",
                    selectedIcon === icon ? "border-primary bg-primary/10" : "border-border",
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Dodawanie..." : "Dodaj kategorię"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "@/components/categories/CategorySelect";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import { entryFormSchema, type EntryFormValues } from "@/lib/validation/entry.schema";
import type { CategoryOption } from "@/types/category.types";

interface EntryFormProps {
  categories: CategoryOption[];
  defaultValues: EntryFormValues;
  onSubmit: (values: EntryFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function EntryForm({ categories, defaultValues, onSubmit, isSubmitting, submitLabel }: EntryFormProps) {
  const [extraCategories, setExtraCategories] = useState<CategoryOption[]>([]);
  const allCategories = [...categories, ...extraCategories];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field data-invalid={!!errors.categoryId}>
        <div className="flex items-center justify-between">
          <FieldLabel>Kategoria</FieldLabel>
          <CategoryFormDialog
            trigger={
              <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs">
                + Nowa kategoria
              </Button>
            }
            onCreated={(category) => {
              const option: CategoryOption = {
                id: category.id,
                name: category.name,
                color: category.color,
                icon: category.icon,
              };
              setExtraCategories((prev) => [...prev, option]);
              setValue("categoryId", option.id, { shouldValidate: true });
            }}
          />
        </div>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <CategorySelect categories={allCategories} value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError errors={[errors.categoryId]} />
      </Field>

      <Field data-invalid={!!errors.date}>
        <FieldLabel htmlFor="entry-date">Data</FieldLabel>
        <Input id="entry-date" type="date" {...register("date")} />
        <FieldError errors={[errors.date]} />
      </Field>

      <Field data-invalid={!!errors.topic}>
        <FieldLabel htmlFor="entry-topic">Temat</FieldLabel>
        <Input id="entry-topic" placeholder="np. Trening" {...register("topic")} />
        <FieldError errors={[errors.topic]} />
      </Field>

      <Field data-invalid={!!errors.description}>
        <FieldLabel htmlFor="entry-description">Opis</FieldLabel>
        <Textarea
          id="entry-description"
          placeholder={"- 45 min góry\n- 20 min biegania"}
          rows={4}
          {...register("description")}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.durationMinutes}>
          <FieldLabel htmlFor="entry-duration">Czas (min)</FieldLabel>
          <Input id="entry-duration" type="number" min={0} step={1} {...register("durationMinutes")} />
          <FieldError errors={[errors.durationMinutes]} />
        </Field>
        <Field data-invalid={!!errors.distanceKm}>
          <FieldLabel htmlFor="entry-distance">Dystans (km)</FieldLabel>
          <Input id="entry-distance" type="number" min={0} step={0.1} {...register("distanceKm")} />
          <FieldError errors={[errors.distanceKm]} />
        </Field>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Zapisywanie..." : submitLabel}
      </Button>
    </form>
  );
}

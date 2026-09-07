import { z } from "zod";

const optionalPositiveNumber = z.preprocess(
  (value) => (value === "" || value === undefined || value === null ? undefined : value),
  z.coerce.number().min(0).optional(),
);

export const entryFormSchema = z.object({
  categoryId: z.string().min(1, "Wybierz kategorię"),
  date: z.string().min(1, "Wybierz datę"),
  topic: z.string().min(1, "Podaj temat").max(120, "Maksymalnie 120 znaków"),
  description: z.string().max(2000, "Maksymalnie 2000 znaków").optional().or(z.literal("")),
  durationMinutes: optionalPositiveNumber,
  distanceKm: optionalPositiveNumber,
});

export type EntryFormInput = z.input<typeof entryFormSchema>;
export type EntryFormValues = z.output<typeof entryFormSchema>;

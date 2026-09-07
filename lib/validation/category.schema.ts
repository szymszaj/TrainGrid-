import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Podaj nazwę").max(60, "Maksymalnie 60 znaków"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Nieprawidłowy kolor"),
  icon: z.string().max(8).optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

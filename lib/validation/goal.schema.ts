import { z } from "zod";

export const goalMetricValues = ["SESSIONS", "DURATION_MINUTES", "DISTANCE_KM"] as const;
export const goalPeriodValues = ["WEEKLY", "MONTHLY"] as const;

export const goalFormSchema = z.object({
  title: z.string().min(1, "Podaj nazwę celu").max(120, "Maksymalnie 120 znaków"),
  metric: z.enum(goalMetricValues),
  period: z.enum(goalPeriodValues),
  targetValue: z.coerce.number().positive("Wartość docelowa musi być większa od 0"),
  categoryId: z.string().optional().or(z.literal("")),
});

export type GoalFormInput = z.input<typeof goalFormSchema>;
export type GoalFormValues = z.output<typeof goalFormSchema>;

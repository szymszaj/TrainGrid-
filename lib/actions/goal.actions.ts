"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import { goalFormSchema } from "@/lib/validation/goal.schema";

export async function createGoal(input: unknown): Promise<void> {
  const userId = await getCurrentUserId();
  const data = goalFormSchema.parse(input);

  await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      metric: data.metric,
      period: data.period,
      targetValue: data.targetValue,
      categoryId: data.categoryId || null,
    },
  });

  revalidatePath("/goals");
}

export async function deleteGoal(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.goal.delete({ where: { id, userId } });
  revalidatePath("/goals");
}

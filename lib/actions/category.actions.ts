"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import { categoryFormSchema } from "@/lib/validation/category.schema";
import type { Category } from "@prisma/client";

export async function createCategory(input: unknown): Promise<Category> {
  const userId = await getCurrentUserId();
  const data = categoryFormSchema.parse(input);

  const category = await prisma.category.create({
    data: {
      userId,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/entries");
  revalidatePath("/goals");

  return category;
}

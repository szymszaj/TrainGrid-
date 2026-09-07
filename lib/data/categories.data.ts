import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import type { Category } from "@prisma/client";

export async function getCategories(): Promise<Category[]> {
  const userId = await getCurrentUserId();
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

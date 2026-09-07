import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import type { Prisma } from "@prisma/client";

export type GoalWithCategory = Prisma.GoalGetPayload<{ include: { category: true } }>;

export async function getGoals(): Promise<GoalWithCategory[]> {
  const userId = await getCurrentUserId();
  return prisma.goal.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
}

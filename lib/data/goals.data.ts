import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import type { Prisma } from "@prisma/client";

const goalWithCategory = {
  include: { category: true },
} satisfies Prisma.GoalDefaultArgs;

export type GoalWithCategory = Prisma.GoalGetPayload<typeof goalWithCategory>;

export async function getGoals(): Promise<GoalWithCategory[]> {
  const userId = await getCurrentUserId();
  return prisma.goal.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
}

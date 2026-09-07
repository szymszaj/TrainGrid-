import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import type { Prisma } from "@prisma/client";

export type EntryWithCategory = Prisma.EntryGetPayload<{ include: { category: true } }>;

export async function getEntriesForYear(
  year: number,
  categoryId?: string,
): Promise<EntryWithCategory[]> {
  const userId = await getCurrentUserId();
  return prisma.entry.findMany({
    where: {
      userId,
      categoryId: categoryId || undefined,
      date: {
        gte: new Date(Date.UTC(year, 0, 1)),
        lte: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
      },
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });
}

export async function getRecentEntries(
  limit: number,
  categoryId?: string,
): Promise<EntryWithCategory[]> {
  const userId = await getCurrentUserId();
  return prisma.entry.findMany({
    where: { userId, categoryId: categoryId || undefined },
    include: { category: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export interface PaginatedEntries {
  entries: EntryWithCategory[];
  total: number;
}

export async function getEntriesPaginated(options: {
  categoryId?: string;
  page: number;
  pageSize: number;
}): Promise<PaginatedEntries> {
  const userId = await getCurrentUserId();
  const where: Prisma.EntryWhereInput = {
    userId,
    categoryId: options.categoryId || undefined,
  };
  const [entries, total] = await Promise.all([
    prisma.entry.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
    }),
    prisma.entry.count({ where }),
  ]);
  return { entries, total };
}

export async function getEntriesForPeriod(
  start: Date,
  end: Date,
  categoryId?: string,
): Promise<EntryWithCategory[]> {
  const userId = await getCurrentUserId();
  return prisma.entry.findMany({
    where: {
      userId,
      categoryId: categoryId || undefined,
      date: { gte: start, lte: end },
    },
    include: { category: true },
  });
}

export async function getAllEntryDates(categoryId?: string): Promise<Date[]> {
  const userId = await getCurrentUserId();
  const rows = await prisma.entry.findMany({
    where: { userId, categoryId: categoryId || undefined },
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" },
  });
  return rows.map((row) => row.date);
}

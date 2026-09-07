"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/data/user.data";
import { entryFormSchema } from "@/lib/validation/entry.schema";

function revalidateEntryPaths(): void {
  revalidatePath("/");
  revalidatePath("/entries");
  revalidatePath("/goals");
}

export async function createEntry(input: unknown): Promise<void> {
  const userId = await getCurrentUserId();
  const data = entryFormSchema.parse(input);

  await prisma.entry.create({
    data: {
      userId,
      categoryId: data.categoryId,
      date: new Date(`${data.date}T00:00:00.000Z`),
      topic: data.topic,
      description: data.description || null,
      durationMinutes: data.durationMinutes ?? null,
      distanceKm: data.distanceKm ?? null,
    },
  });

  revalidateEntryPaths();
}

export async function updateEntry(id: string, input: unknown): Promise<void> {
  const userId = await getCurrentUserId();
  const data = entryFormSchema.parse(input);

  await prisma.entry.update({
    where: { id, userId },
    data: {
      categoryId: data.categoryId,
      date: new Date(`${data.date}T00:00:00.000Z`),
      topic: data.topic,
      description: data.description || null,
      durationMinutes: data.durationMinutes ?? null,
      distanceKm: data.distanceKm ?? null,
    },
  });

  revalidateEntryPaths();
}

export async function deleteEntry(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.entry.delete({ where: { id, userId } });
  revalidateEntryPaths();
}

import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_EMAIL } from "@/lib/constants/user";

export async function getCurrentUserId(): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEFAULT_USER_EMAIL },
    select: { id: true },
  });
  return user.id;
}

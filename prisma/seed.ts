import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "../lib/constants/user";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - n);
  return date;
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: {},
    create: { email: DEFAULT_USER_EMAIL, name: DEFAULT_USER_NAME },
  });

  const trening = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: "Trening" } },
    update: {},
    create: { userId: user.id, name: "Trening", color: "#22c55e", icon: "🏃" },
  });

  const ksiazki = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: "Książki" } },
    update: {},
    create: { userId: user.id, name: "Książki", color: "#3b82f6", icon: "📚" },
  });

  const gry = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: "Gry" } },
    update: {},
    create: { userId: user.id, name: "Gry", color: "#a855f7", icon: "🎮" },
  });

  await prisma.entry.deleteMany({ where: { userId: user.id } });

  const seedEntries: {
    categoryId: string;
    date: Date;
    topic: string;
    description: string;
    durationMinutes?: number;
    distanceKm?: number;
  }[] = [
    {
      categoryId: trening.id,
      date: daysAgo(0),
      topic: "Trening",
      description: "- 45 min góry\n- 20 min biegania",
      durationMinutes: 65,
      distanceKm: 8,
    },
    {
      categoryId: ksiazki.id,
      date: daysAgo(0),
      topic: "Projekt Hail Mary",
      description: "- rozdziały 12-14",
      durationMinutes: 40,
    },
    {
      categoryId: trening.id,
      date: daysAgo(1),
      topic: "Trening",
      description: "- 30 min siłownia (nogi)",
      durationMinutes: 30,
    },
    {
      categoryId: trening.id,
      date: daysAgo(2),
      topic: "Trening",
      description: "- 60 min rower",
      durationMinutes: 60,
      distanceKm: 22,
    },
    {
      categoryId: gry.id,
      date: daysAgo(2),
      topic: "Baldur's Gate 3",
      description: "- akt 2, questy poboczne",
      durationMinutes: 90,
    },
    {
      categoryId: trening.id,
      date: daysAgo(3),
      topic: "Trening",
      description: "- 40 min bieganie",
      durationMinutes: 40,
      distanceKm: 6,
    },
    {
      categoryId: ksiazki.id,
      date: daysAgo(5),
      topic: "Projekt Hail Mary",
      description: "- rozdziały 9-11",
      durationMinutes: 35,
    },
    {
      categoryId: trening.id,
      date: daysAgo(6),
      topic: "Trening",
      description: "- 50 min siłownia (góra)",
      durationMinutes: 50,
    },
    {
      categoryId: gry.id,
      date: daysAgo(9),
      topic: "Baldur's Gate 3",
      description: "- akt 1, finał",
      durationMinutes: 120,
    },
    {
      categoryId: trening.id,
      date: daysAgo(10),
      topic: "Trening",
      description: "- 35 min bieganie",
      durationMinutes: 35,
      distanceKm: 5.5,
    },
    {
      categoryId: ksiazki.id,
      date: daysAgo(14),
      topic: "Projekt Hail Mary",
      description: "- rozdziały 1-8",
      durationMinutes: 80,
    },
    {
      categoryId: trening.id,
      date: daysAgo(17),
      topic: "Trening",
      description: "- 45 min siłownia (całość)",
      durationMinutes: 45,
    },
    {
      categoryId: trening.id,
      date: daysAgo(18),
      topic: "Trening",
      description: "- 30 min pływanie",
      durationMinutes: 30,
      distanceKm: 1.2,
    },
    {
      categoryId: gry.id,
      date: daysAgo(21),
      topic: "Hades II",
      description: "- kilka podejść do bossa",
      durationMinutes: 60,
    },
  ];

  for (const entry of seedEntries) {
    await prisma.entry.create({
      data: { userId: user.id, ...entry },
    });
  }

  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.goal.create({
    data: {
      userId: user.id,
      categoryId: trening.id,
      title: "60 min treningu tygodniowo",
      metric: "DURATION_MINUTES",
      targetValue: 180,
      period: "WEEKLY",
    },
  });

  console.log(`Seed complete for user ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { CategoryFilterBar } from "@/components/categories/CategoryFilterBar";
import { EntryList } from "@/components/entries/EntryList";
import { YearHeatmap } from "@/components/heatmap/YearHeatmap";
import { StatsCards } from "@/components/stats/StatsCards";
import { getCategories } from "@/lib/data/categories.data";
import { getAllEntryDates, getEntriesForYear, getRecentEntries } from "@/lib/data/entries.data";
import { parseCategoryOptions } from "@/lib/parsers/categories.parser";
import { parseEntryListItems } from "@/lib/parsers/entries.parser";
import { parseHeatmapData } from "@/lib/parsers/heatmap.parser";
import { parseStatsSummary } from "@/lib/parsers/stats.parser";

interface DashboardPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const categoryId = params.category || undefined;
  const year = new Date().getUTCFullYear();

  const [categories, entriesForYear, allActiveDates, recentEntries] = await Promise.all([
    getCategories(),
    getEntriesForYear(year, categoryId),
    getAllEntryDates(categoryId),
    getRecentEntries(8, categoryId),
  ]);

  const categoryOptions = parseCategoryOptions(categories);
  const heatmapData = parseHeatmapData(entriesForYear, year);
  const stats = parseStatsSummary(entriesForYear, allActiveDates);
  const recentItems = parseEntryListItems(recentEntries);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Panel</h1>
        <CategoryFilterBar categories={categoryOptions} activeCategoryId={categoryId ?? null} basePath="/" />
      </div>

      <StatsCards stats={stats} />

      <div className="rounded-lg border border-border p-4">
        <YearHeatmap data={heatmapData} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Ostatnie wpisy</h2>
        <EntryList entries={recentItems} categories={categoryOptions} emptyMessage="Brak wpisów. Dodaj pierwszy!" />
      </div>
    </div>
  );
}

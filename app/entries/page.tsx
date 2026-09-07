import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryFilterBar } from "@/components/categories/CategoryFilterBar";
import { EntryList } from "@/components/entries/EntryList";
import { getCategories } from "@/lib/data/categories.data";
import { getEntriesPaginated } from "@/lib/data/entries.data";
import { parseCategoryOptions } from "@/lib/parsers/categories.parser";
import { parseEntryListItems } from "@/lib/parsers/entries.parser";

const PAGE_SIZE = 20;

interface EntriesPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

function pageHref(categoryId: string | undefined, targetPage: number): string {
  const params = new URLSearchParams();
  if (categoryId) params.set("category", categoryId);
  if (targetPage > 1) params.set("page", String(targetPage));
  const query = params.toString();
  return query ? `/entries?${query}` : "/entries";
}

export default async function EntriesPage({ searchParams }: EntriesPageProps) {
  const params = await searchParams;
  const categoryId = params.category || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const [categories, { entries, total }] = await Promise.all([
    getCategories(),
    getEntriesPaginated({ categoryId, page, pageSize: PAGE_SIZE }),
  ]);

  const categoryOptions = parseCategoryOptions(categories);
  const items = parseEntryListItems(entries);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Historia</h1>
        <CategoryFilterBar categories={categoryOptions} activeCategoryId={categoryId ?? null} basePath="/entries" />
      </div>

      <EntryList entries={items} categories={categoryOptions} emptyMessage="Brak wpisów w tej kategorii." />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          {page > 1 ? (
            <Button variant="outline" size="sm" render={<Link href={pageHref(categoryId, page - 1)} />}>
              Poprzednia
            </Button>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted-foreground">
            Strona {page} z {totalPages}
          </span>
          {page < totalPages ? (
            <Button variant="outline" size="sm" render={<Link href={pageHref(categoryId, page + 1)} />}>
              Następna
            </Button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}

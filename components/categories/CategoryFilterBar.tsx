import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CategoryOption } from "@/types/category.types";

interface CategoryFilterBarProps {
  categories: CategoryOption[];
  activeCategoryId: string | null;
  basePath: string;
}

export function CategoryFilterBar({ categories, activeCategoryId, basePath }: CategoryFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={cn(
          "rounded-full border px-3 py-1 text-sm transition-colors",
          activeCategoryId === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:text-foreground",
        )}
      >
        Wszystko
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`${basePath}?category=${category.id}`}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
            activeCategoryId === category.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.name}
        </Link>
      ))}
    </div>
  );
}

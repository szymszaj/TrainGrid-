import type { Category } from "@prisma/client";
import type { CategoryOption } from "@/types/category.types";

export function parseCategoryOptions(categories: Category[]): CategoryOption[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
  }));
}

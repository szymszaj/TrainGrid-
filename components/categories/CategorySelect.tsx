"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CategoryOption } from "@/types/category.types";

const ALL_CATEGORIES_VALUE = "__all__";

interface CategorySelectProps {
  categories: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowAllOption?: boolean;
  disabled?: boolean;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  placeholder = "Wybierz kategorię",
  allowAllOption = false,
  disabled,
}: CategorySelectProps) {
  return (
    <Select
      value={value === "" ? (allowAllOption ? ALL_CATEGORIES_VALUE : null) : value}
      onValueChange={(next) => onChange(next === ALL_CATEGORIES_VALUE ? "" : (next ?? ""))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowAllOption && <SelectItem value={ALL_CATEGORIES_VALUE}>Wszystkie kategorie</SelectItem>}
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <span className="flex items-center gap-2">
              {category.icon && <span>{category.icon}</span>}
              {category.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

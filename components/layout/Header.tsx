"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryFormDialog } from "@/components/entries/EntryFormDialog";
import { cn } from "@/lib/utils";
import type { CategoryOption } from "@/types/category.types";

const NAV_LINKS = [
  { href: "/", label: "Panel" },
  { href: "/entries", label: "Historia" },
  { href: "/goals", label: "Cele" },
];

interface HeaderProps {
  categories: CategoryOption[];
}

export function Header({ categories }: HeaderProps) {
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold">
            TrainGrid
          </Link>
          <nav className="flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  pathname === link.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <PlusIcon className="size-4" />
          Dodaj wpis
        </Button>
      </div>
      <EntryFormDialog categories={categories} open={addOpen} onOpenChange={setAddOpen} />
    </header>
  );
}

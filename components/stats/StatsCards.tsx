"use client";

import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap, useGSAP } from "@/lib/gsap";
import type { StatsSummary } from "@/types/stats.types";

interface StatsCardsProps {
  stats: StatsSummary;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} godz.` : `${hours} godz. ${rest} min`;
}

function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

interface StatTile {
  label: string;
  value: string;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const tiles: StatTile[] = [
    { label: "Wpisy w tym roku", value: String(stats.totalSessions) },
    { label: "Łączny czas", value: formatDuration(stats.totalDurationMinutes) },
    { label: "Łączny dystans", value: formatDistance(stats.totalDistanceKm) },
    { label: "Aktualna passa", value: `${stats.currentStreak} ${stats.currentStreak === 1 ? "dzień" : "dni"}` },
    { label: "Najdłuższa passa", value: `${stats.longestStreak} ${stats.longestStreak === 1 ? "dzień" : "dni"}` },
  ];

  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-stat-card]", {
        opacity: 0,
        y: 12,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
      });
    },
    { scope: gridRef, dependencies: [stats] },
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" ref={gridRef}>
      {tiles.map((tile) => (
        <Card key={tile.label} data-stat-card className="gap-1 py-4">
          <CardHeader className="px-4">
            <CardDescription className="text-xs">{tile.label}</CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <CardTitle className="text-2xl">{tile.value}</CardTitle>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

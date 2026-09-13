"use client";

import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDisplayDate, MONTH_LABELS_PL } from "@/lib/format/date";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { HeatmapData, HeatmapDay, HeatmapLevel } from "@/types/heatmap.types";

const LEVEL_CLASSES: Record<HeatmapLevel, string> = {
  0: "bg-zinc-800",
  1: "bg-emerald-900",
  2: "bg-emerald-700",
  3: "bg-emerald-500",
  4: "bg-emerald-400",
};

function monthLabelForWeek(week: HeatmapDay[], year: number): string | null {
  const firstOfMonthDay = week.find((day) => {
    const [dayYear, , dayNum] = day.date.split("-").map(Number);
    return dayYear === year && dayNum === 1;
  });
  if (!firstOfMonthDay) return null;
  const month = Number(firstOfMonthDay.date.split("-")[1]);
  return MONTH_LABELS_PL[month - 1];
}

interface YearHeatmapProps {
  data: HeatmapData;
}

export function YearHeatmap({ data }: YearHeatmapProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-cell]", {
        opacity: 0,
        scale: 0.4,
        duration: 0.35,
        ease: "back.out(1.7)",
        stagger: {
          each: 0.0035,
          from: "start",
        },
      });
    },
    { scope: gridRef, dependencies: [data] },
  );

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex items-center gap-4" ref={gridRef}>
        <div className="inline-flex flex-col gap-1.5">
          <div className="flex gap-1.5 pl-0">
            {data.weeks.map((week, index) => {
              const label = monthLabelForWeek(week, data.year);
              return (
                <div key={index} className="w-4 shrink-0 text-[10px] text-muted-foreground">
                  {label ?? ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-1.5">
            {data.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger
                      render={
                        <div
                          data-cell
                          className={cn(
                            "size-4 rounded-sm border border-black/40",
                            LEVEL_CLASSES[day.level],
                          )}
                        />
                      }
                    />
                    <TooltipContent>
                      <p className="font-medium">{formatDisplayDate(day.date)}</p>
                      <p className="text-muted-foreground">
                        {day.count === 0
                          ? "Brak aktywności"
                          : `${day.count} ${day.count === 1 ? "wpis" : "wpisy"}${
                              day.totalDurationMinutes > 0 ? ` · ${day.totalDurationMinutes} min` : ""
                            }`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
        <span className="self-center text-lg font-semibold text-muted-foreground">{data.year}</span>
      </div>
    </div>
  );
}

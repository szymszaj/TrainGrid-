import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDisplayDate, MONTH_LABELS_PL } from "@/lib/format/date";
import { cn } from "@/lib/utils";
import type { HeatmapData, HeatmapDay, HeatmapLevel } from "@/types/heatmap.types";

const LEVEL_CLASSES: Record<HeatmapLevel, string> = {
  0: "bg-neutral-800/60",
  1: "bg-emerald-950",
  2: "bg-emerald-800",
  3: "bg-emerald-600",
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
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-1 pl-0">
          {data.weeks.map((week, index) => {
            const label = monthLabelForWeek(week, data.year);
            return (
              <div key={index} className="w-3 shrink-0 text-[10px] text-muted-foreground">
                {label ?? ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-1">
          {data.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <Tooltip key={day.date}>
                  <TooltipTrigger
                    render={
                      <div
                        className={cn(
                          "size-3 rounded-sm border border-neutral-900",
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
    </div>
  );
}

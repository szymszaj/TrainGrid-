export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export interface HeatmapDay {
  date: string;
  count: number;
  level: HeatmapLevel;
  totalDurationMinutes: number;
}

export interface HeatmapData {
  year: number;
  weeks: HeatmapDay[][];
  maxCount: number;
}

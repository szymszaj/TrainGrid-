export interface CategoryColorPreset {
  label: string;
  value: string;
}

export const CATEGORY_COLOR_PRESETS: CategoryColorPreset[] = [
  { label: "Zieleń", value: "#22c55e" },
  { label: "Błękit", value: "#3b82f6" },
  { label: "Fiolet", value: "#a855f7" },
  { label: "Róż", value: "#ec4899" },
  { label: "Bursztyn", value: "#f59e0b" },
  { label: "Czerwień", value: "#ef4444" },
  { label: "Turkus", value: "#14b8a6" },
];

export const CATEGORY_ICON_PRESETS: string[] = [
  "🏃",
  "📚",
  "🎮",
  "🎸",
  "🎨",
  "🧘",
  "🚴",
  "🏊",
  "💪",
  "✍️",
];

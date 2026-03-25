export type DrinkCategory = "beer" | "wine" | "spirit" | "cocktail";

export interface DrinkEntry {
  id: string;
  category: DrinkCategory;
  name: string;
  quantity: number; // in standard drinks
  timestamp: Date;
  note?: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  total: number;
  entries: DrinkEntry[];
}

export const DRINK_CATEGORIES: {
  key: DrinkCategory;
  label: string;
  icon: string;
  defaultName: string;
  defaultQty: number;
}[] = [
  { key: "beer", label: "Beer", icon: "🍺", defaultName: "Beer", defaultQty: 1 },
  { key: "wine", label: "Wine", icon: "🍷", defaultName: "Wine", defaultQty: 1 },
  { key: "spirit", label: "Spirit", icon: "🥃", defaultName: "Spirit", defaultQty: 1.5 },
  { key: "cocktail", label: "Cocktail", icon: "🍹", defaultName: "Cocktail", defaultQty: 1.5 },
];

export function getWeekDays(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

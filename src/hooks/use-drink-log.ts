import { useState, useCallback, useEffect } from "react";
import { DrinkEntry, DrinkCategory, DailySummary, getWeekDays } from "@/lib/drink-types";

const STORAGE_KEY = "alcohol-tracker-log";

function loadEntries(): DrinkEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }));
  } catch {
    return [];
  }
}

function saveEntries(entries: DrinkEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useDrinkLog() {
  const [entries, setEntries] = useState<DrinkEntry[]>(loadEntries);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const addDrink = useCallback(
    (category: DrinkCategory, name: string, quantity: number, note?: string) => {
      const entry: DrinkEntry = {
        id: crypto.randomUUID(),
        category,
        name,
        quantity,
        timestamp: new Date(),
        note,
      };
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const removeDrink = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter(
    (e) => new Date(e.timestamp).toISOString().split("T")[0] === todayStr
  );
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.quantity, 0);

  const weekDays = getWeekDays();
  const weekData: DailySummary[] = weekDays.map((date) => {
    const dayEntries = entries.filter(
      (e) => new Date(e.timestamp).toISOString().split("T")[0] === date
    );
    return {
      date,
      total: dayEntries.reduce((sum, e) => sum + e.quantity, 0),
      entries: dayEntries,
    };
  });

  const weekTotal = weekData.reduce((sum, d) => sum + d.total, 0);

  return { entries, todayEntries, todayTotal, weekData, weekTotal, addDrink, removeDrink };
}

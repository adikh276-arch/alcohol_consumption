import { useState, useCallback, useEffect } from "react";
import { DrinkEntry, DrinkCategory, DailySummary, getWeekDays } from "@/lib/drink-types";
import { apiFetch } from "@/lib/api";

export function useDrinkLog() {
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const userId = sessionStorage.getItem('user_id');

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await apiFetch('/api/consumption', {
        headers: { 'x-user-id': userId }
      });
      const data = await response.json();
      setEntries(data.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })));
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addDrink = useCallback(
    async (category: DrinkCategory, name: string, quantity: number, note?: string) => {
      if (!userId) return;
      const entry: DrinkEntry = {
        id: crypto.randomUUID(),
        category,
        name,
        quantity,
        timestamp: new Date(),
        note,
      };
      
      try {
        await apiFetch('/api/consumption', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify(entry)
        });
        setEntries((prev) => [entry, ...prev]);
      } catch (err) {
        console.error('Failed to add drink:', err);
      }
      return entry;
    },
    [userId]
  );

  const removeDrink = useCallback(async (id: string) => {
    if (!userId) return;
    try {
      await apiFetch(`/api/consumption/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId }
      });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to remove drink:', err);
    }
  }, [userId]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter(
    (e) => new Date(e.timestamp).toISOString().split("T")[0] === todayStr
  );
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.quantity, 0);

  const weekDays = getWeekDays(weekOffset);
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

  const prevWeek = useCallback(() => setWeekOffset((o) => o - 1), []);
  const nextWeek = useCallback(() => setWeekOffset((o) => Math.min(o + 1, 0)), []);

  return {
    entries, todayEntries, todayTotal, weekData, weekTotal,
    weekOffset, prevWeek, nextWeek,
    addDrink, removeDrink,
  };
}

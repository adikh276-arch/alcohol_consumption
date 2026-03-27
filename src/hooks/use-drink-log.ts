import { useState, useCallback, useEffect } from "react";
import { DrinkEntry, DrinkCategory, DailySummary, getWeekDays } from "@/lib/drink-types";
import { pool } from "@/lib/db";

export function useDrinkLog() {
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const userId = sessionStorage.getItem('user_id');

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    try {
      const result = await pool.query('SELECT * FROM drink_entries WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
      setEntries(result.rows.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })));
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
        await pool.query(
          'INSERT INTO drink_entries (id, user_id, category, name, quantity, timestamp, note) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [entry.id, userId, entry.category, entry.name, entry.quantity, entry.timestamp, entry.note || '']
        );
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
      await pool.query('DELETE FROM drink_entries WHERE id = $1 AND user_id = $2', [id, userId]);
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

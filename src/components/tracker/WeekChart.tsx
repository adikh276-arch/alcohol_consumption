import { motion } from "framer-motion";
import { DailySummary, formatDateShort, isToday } from "@/lib/drink-types";

interface WeekChartProps {
  data: DailySummary[];
}

export function WeekChart({ data }: WeekChartProps) {
  const maxVal = Math.max(...data.map((d) => d.total), 4);

  return (
    <div className="flex items-end justify-between gap-2 h-32 px-1">
      {data.map((day, i) => {
        const height = day.total > 0 ? Math.max((day.total / maxVal) * 100, 8) : 4;
        const today = isToday(day.date);

        return (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.div
              className="relative w-full flex flex-col items-center"
              style={{ height: "100px" }}
            >
              <motion.div
                className={`absolute bottom-0 w-full max-w-[28px] rounded-t-lg ${
                  today
                    ? "bg-primary"
                    : day.total > 0
                    ? "bg-primary/40"
                    : "bg-muted"
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
              />
              {day.total > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  className="absolute -top-5 text-xs font-semibold text-foreground"
                >
                  {day.total % 1 === 0 ? day.total : day.total.toFixed(1)}
                </motion.span>
              )}
            </motion.div>
            <span
              className={`text-[11px] font-medium ${
                today ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {today ? "Today" : formatDateShort(day.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

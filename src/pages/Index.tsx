import { useDrinkLog } from "@/hooks/use-drink-log";
import { QuickAdd } from "@/components/tracker/QuickAdd";
import { WeekChart } from "@/components/tracker/WeekChart";
import { DrinkLog } from "@/components/tracker/DrinkLog";
import { TodayStats } from "@/components/tracker/TodayStats";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DRINK_CATEGORIES, getWeekLabel } from "@/lib/drink-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const {
    todayEntries, todayTotal, weekData, weekTotal,
    weekOffset, prevWeek, nextWeek,
    addDrink, removeDrink,
  } = useDrinkLog();

  const handleAdd = (category: string, name: string, qty: number) => {
    const cat = DRINK_CATEGORIES.find((c) => c.key === category)!;
    addDrink(category as any, name, qty);
    toast(`${cat.icon} ${name} logged`, { description: `${qty} standard drink${qty !== 1 ? "s" : ""}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-foreground">Drink Tracker</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <TodayStats todayTotal={todayTotal} weekTotal={weekTotal} />

        {/* Quick Add */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Quick Log
          </h2>
          <QuickAdd onAdd={handleAdd} />
        </div>

        {/* Week Chart */}
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevWeek}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {getWeekLabel(weekOffset)}
            </h2>
            <button
              onClick={nextWeek}
              disabled={weekOffset >= 0}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <WeekChart data={weekData} />
        </div>

        {/* Today's Log */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Today's Log
          </h2>
          <DrinkLog entries={todayEntries} onRemove={removeDrink} />
        </div>
      </div>
    </div>
  );
};

export default Index;

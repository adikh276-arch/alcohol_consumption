import { useDrinkLog } from "@/hooks/use-drink-log";
import { QuickAdd } from "@/components/tracker/QuickAdd";
import { WeekChart } from "@/components/tracker/WeekChart";
import { DrinkLog } from "@/components/tracker/DrinkLog";
import { TodayStats } from "@/components/tracker/TodayStats";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DRINK_CATEGORIES } from "@/lib/drink-types";

const Index = () => {
  const { todayEntries, todayTotal, weekData, weekTotal, addDrink, removeDrink } = useDrinkLog();

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
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            This Week
          </h2>
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

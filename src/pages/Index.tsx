import { useDrinkLog } from "@/hooks/use-drink-log";
import { QuickAdd } from "@/components/tracker/QuickAdd";
import { WeekChart } from "@/components/tracker/WeekChart";
import { DrinkLog } from "@/components/tracker/DrinkLog";
import { TodayStats } from "@/components/tracker/TodayStats";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DRINK_CATEGORIES, getWeekLabel } from "@/lib/drink-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const { t } = useTranslation();
  const {
    todayEntries, todayTotal, weekData, weekTotal,
    weekOffset, prevWeek, nextWeek,
    addDrink, removeDrink,
  } = useDrinkLog();

  const handleAdd = (category: string, name: string, qty: number) => {
    const cat = DRINK_CATEGORIES.find((c) => c.key === category)!;
    addDrink(category as any, name, qty);
    const drinkName = t(name.toLowerCase() as any, { defaultValue: name });
    toast(`${cat.icon} ${drinkName} ${t('logged')}`, {
      description: `${qty} ${qty === 1 ? t('standard_drink') : t('standard_drinks')}`
    });
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
            <h1 className="text-xl font-bold text-foreground">{t('drink_tracker')}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <LanguageSelector />
        </motion.div>

        {/* Stats */}
        <TodayStats todayTotal={todayTotal} weekTotal={weekTotal} />

        {/* Quick Add */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            {t('quick_log')}
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
              {weekOffset === 0 ? t('this_week') : (weekOffset === -1 ? t('last_week') : getWeekLabel(weekOffset))}
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
            {t('todays_log')}
          </h2>
          <DrinkLog entries={todayEntries} onRemove={removeDrink} />
        </div>
      </div>
    </div>
  );
};

export default Index;

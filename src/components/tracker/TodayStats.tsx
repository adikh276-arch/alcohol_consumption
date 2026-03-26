import { motion } from "framer-motion";
import { Wine, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TodayStatsProps {
  todayTotal: number;
  weekTotal: number;
}

export function TodayStats({ todayTotal, weekTotal }: TodayStatsProps) {
  const { t } = useTranslation();
  const DAILY_LIMIT = 4;
  const progress = Math.min((todayTotal / DAILY_LIMIT) * 100, 100);
  const overLimit = todayTotal > DAILY_LIMIT;

  return (
    <div className="flex gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 rounded-2xl bg-card border border-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Wine className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{t('today')}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`text-3xl font-bold ${overLimit ? "text-destructive" : "text-foreground"}`}>
            {todayTotal % 1 === 0 ? todayTotal : todayTotal.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">/ {DAILY_LIMIT}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${overLimit ? "bg-destructive" : "bg-primary"}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="flex-1 rounded-2xl bg-card border border-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="h-4 w-4 text-success" />
          <span className="text-xs font-medium text-muted-foreground">{t('this_week')}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">
            {weekTotal % 1 === 0 ? weekTotal : weekTotal.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">{t('drinks')}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{t('last_7_days')}</p>
      </motion.div>
    </div>
  );
}

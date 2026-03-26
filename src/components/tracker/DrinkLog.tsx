import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { DrinkEntry, DRINK_CATEGORIES, formatTime, DrinkCategory } from "@/lib/drink-types";
import { useTranslation } from "react-i18next";

interface DrinkLogProps {
  entries: DrinkEntry[];
  onRemove: (id: string) => void;
}

const dotColors: Record<DrinkCategory, string> = {
  beer: "bg-drink-beer",
  wine: "bg-drink-wine",
  spirit: "bg-drink-spirit",
  cocktail: "bg-drink-cocktail",
};

export function DrinkLog({ entries, onRemove }: DrinkLogProps) {
  const { t } = useTranslation();
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <span className="text-3xl mb-2">🌿</span>
        <p className="text-sm">{t('no_drinks_logged')}</p>
        <p className="text-xs mt-1">{t('tap_above_to_log')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {entries.map((entry) => {
          const cat = DRINK_CATEGORIES.find((c) => c.key === entry.category);
          return (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="flex items-center gap-3 rounded-xl bg-card border border-border p-3"
            >
              <span className="text-xl">{cat?.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotColors[entry.category]}`} />
                  <span className="text-sm font-medium text-foreground truncate">
                    {t(entry.name.toLowerCase() as any, { defaultValue: entry.name })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {entry.quantity} {entry.quantity === 1 ? t('std_drink') : t('std_drinks')}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(entry.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

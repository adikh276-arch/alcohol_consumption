import { motion } from "framer-motion";
import { DRINK_CATEGORIES, DrinkCategory } from "@/lib/drink-types";

interface QuickAddProps {
  onAdd: (category: DrinkCategory, name: string, quantity: number) => void;
}

const categoryColors: Record<DrinkCategory, string> = {
  beer: "bg-drink-beer/15 border-drink-beer/30 hover:bg-drink-beer/25",
  wine: "bg-drink-wine/15 border-drink-wine/30 hover:bg-drink-wine/25",
  spirit: "bg-drink-spirit/15 border-drink-spirit/30 hover:bg-drink-spirit/25",
  cocktail: "bg-drink-cocktail/15 border-drink-cocktail/30 hover:bg-drink-cocktail/25",
};

export function QuickAdd({ onAdd }: QuickAddProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {DRINK_CATEGORIES.map((cat, i) => (
        <motion.button
          key={cat.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => onAdd(cat.key, cat.defaultName, cat.defaultQty)}
          className={`flex flex-col items-center gap-1.5 rounded-2xl border p-4 transition-colors ${categoryColors[cat.key]}`}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-medium text-foreground">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

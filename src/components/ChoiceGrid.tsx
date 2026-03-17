import { motion } from "framer-motion";

interface Choice {
  value: string;
  idn: string;
  en: string;
}

interface ChoiceGridProps {
  choices: Choice[];
  selected: string | string[];
  onSelect: (value: string) => void;
  columns?: 2 | 3;
  multi?: boolean;
}

const ChoiceGrid = ({ choices, selected, onSelect, columns = 2, multi = false }: ChoiceGridProps) => {
  const isSelected = (value: string) =>
    multi ? (selected as string[]).includes(value) : selected === value;

  return (
    <div className={`grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {choices.map((choice, i) => (
        <motion.button
          key={choice.value}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.15, ease: [0.2, 0, 0, 1] }}
          whileTap={{ scale: 0.98 }}
          className="starvo-choice text-left"
          data-selected={isSelected(choice.value)}
          onClick={() => onSelect(choice.value)}
        >
          <span className="text-sm font-semibold text-foreground leading-tight">{choice.idn}</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">{choice.en}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ChoiceGrid;

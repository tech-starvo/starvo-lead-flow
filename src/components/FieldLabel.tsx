import { forwardRef } from "react";

interface FieldLabelProps {
  id: string;
  idn: string;
  en: string;
  optional?: boolean;
}

const FieldLabel = forwardRef<HTMLDivElement, FieldLabelProps>(({ id, idn, en, optional }, ref) => (
  <div ref={ref} className="flex flex-col mb-2">
    <label htmlFor={id} className="text-sm font-bold text-foreground">
      {idn} {optional && <span className="text-muted-foreground font-normal">(Opsional)</span>}
    </label>
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
      {en} {optional && <span className="lowercase">(Optional)</span>}
    </span>
  </div>
));

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;

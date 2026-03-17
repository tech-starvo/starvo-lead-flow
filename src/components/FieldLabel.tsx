import { forwardRef } from "react";

interface FieldLabelProps {
  id: string;
  label: string;
  optional?: boolean;
  optionalLabel?: string;
}

const FieldLabel = forwardRef<HTMLDivElement, FieldLabelProps>(({ id, label, optional, optionalLabel }, ref) => (
  <div ref={ref} className="flex flex-col mb-2">
    <label htmlFor={id} className="text-sm font-bold text-foreground">
      {label} {optional && optionalLabel != null && <span className="text-muted-foreground font-normal">({optionalLabel})</span>}
    </label>
  </div>
));

FieldLabel.displayName = "FieldLabel";

export default FieldLabel;

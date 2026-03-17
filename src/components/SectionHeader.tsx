interface SectionHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ step, totalSteps, title, subtitle }: SectionHeaderProps) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-semibold text-primary uppercase tracking-widest">
        {step}/{totalSteps}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
    <h2 className="text-2xl font-semibold tracking-tight text-foreground" style={{ textWrap: "balance" }}>
      {title}
    </h2>
    {subtitle != null && subtitle !== title && (
      <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
    )}
  </div>
);

export default SectionHeader;

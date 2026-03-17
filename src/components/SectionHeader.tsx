interface SectionHeaderProps {
  step: number;
  totalSteps: number;
  idn: string;
  en: string;
}

const SectionHeader = ({ step, totalSteps, idn, en }: SectionHeaderProps) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-semibold text-primary uppercase tracking-widest">
        {step}/{totalSteps}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
    <h2 className="text-2xl font-semibold tracking-tight text-foreground" style={{ textWrap: "balance" }}>
      {idn}
    </h2>
    <p className="text-sm text-muted-foreground mt-0.5">{en}</p>
  </div>
);

export default SectionHeader;

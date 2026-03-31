import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import FieldLabel from "./FieldLabel";
import ChoiceGrid from "./ChoiceGrid";
import SectionHeader from "./SectionHeader";
import MapPicker from "./MapPicker";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

interface FormData {
  fullName: string;
  company: string;
  whatsapp: string;
  email: string;
  city: string;
  interest: string;
  hasLocation: string;
  locationType: string;
  budget: string;
  units: string;
  chargerType: string;
  currentPowerCapacity: string;
  parkingSlots: string;
  estimatedVehicles: string;
  address: string;
  landArea: string;
  mapPosition: [number, number] | null;
  timeline: string;
  notes: string;
}

const initial: FormData = {
  fullName: "",
  company: "",
  whatsapp: "",
  email: "",
  city: "",
  interest: "",
  hasLocation: "",
  locationType: "",
  budget: "",
  units: "",
  chargerType: "",
  currentPowerCapacity: "",
  parkingSlots: "",
  estimatedVehicles: "",
  address: "",
  landArea: "",
  mapPosition: null,
  timeline: "",
  notes: "",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.2, 0, 0, 1] as const } },
};

const TOTAL_STEPS = 6;

const StarvoForm = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refNumber] = useState(() => `STV-${Date.now().toString(36).toUpperCase()}`);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.whatsapp || !form.interest) return;
    setIsSubmitting(true);
    const payload = {
      ref_number: refNumber,
      full_name: form.fullName,
      company: form.company || null,
      whatsapp: form.whatsapp,
      email: form.email || null,
      city: form.city || null,
      interest: form.interest,
      has_location: form.hasLocation || null,
      location_type: form.locationType || null,
      budget: form.budget || null,
      units: form.units || null,
      charger_type: form.chargerType || null,
      current_power_capacity: form.currentPowerCapacity || null,
      parking_slots: form.parkingSlots || null,
      estimated_vehicles: form.estimatedVehicles || null,
      address: form.address || null,
      land_area: form.landArea || null,
      map_lat: form.mapPosition ? form.mapPosition[0] : null,
      map_lng: form.mapPosition ? form.mapPosition[1] : null,
      timeline: form.timeline || null,
      notes: form.notes || null,
    };
    const { error } = await supabase.from("leads").insert(payload);
    setIsSubmitting(false);
    if (error) {
      toast.error("Failed to submit. Please try again.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("submitSuccessTitle")}</h1>
        <p className="text-muted-foreground mb-4">{t("submitSuccessSubtitle")}</p>
        <div className="bg-card border border-input rounded-lg px-6 py-3 mb-6">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("submitRefLabel")}</span>
          <p className="text-lg font-mono font-bold text-foreground mt-1">{refNumber}</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs" style={{ textWrap: "balance" }}>
          {t("submitContactNote")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Info */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="starvo-section-card">
        <SectionHeader step={1} totalSteps={TOTAL_STEPS} title={t("section1Title")} subtitle={t("section1Subtitle")} />
        <div className="space-y-4">
          <motion.div variants={fadeUp}>
            <FieldLabel id="fullName" label={t("fieldFullName")} />
            <input id="fullName" className="starvo-input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required placeholder={t("placeholderFullName")} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="company" label={t("fieldCompany")} optional optionalLabel={t("optional")} />
            <input id="company" className="starvo-input" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder={t("placeholderCompany")} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="whatsapp" label={t("fieldWhatsapp")} />
            <input id="whatsapp" className="starvo-input" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} required placeholder={t("placeholderWhatsapp")} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="email" label={t("fieldEmail")} />
            <input id="email" className="starvo-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("placeholderEmail")} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="city" label={t("fieldCity")} />
            <input id="city" className="starvo-input" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder={t("placeholderCity")} />
          </motion.div>
        </div>
      </motion.div>

      {/* Section 2: Interest */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={2} totalSteps={TOTAL_STEPS} title={t("section2Title")} subtitle={t("section2Subtitle")} />
        <ChoiceGrid
          selected={form.interest}
          onSelect={(v) => set("interest", v)}
          choices={[
            { value: "business", label: t("interest_business") },
            { value: "purchase", label: t("interest_purchase") },
            { value: "personal", label: t("interest_personal") },
            { value: "explore", label: t("interest_explore") },
          ]}
        />
      </motion.div>

      {/* Section 3: Plan & Needs */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={3} totalSteps={TOTAL_STEPS} title={t("section3Title")} subtitle={t("section3Subtitle")} />
        <div className="space-y-5">
          <div>
            <FieldLabel id="hasLocation" label={t("fieldHasLocation")} />
            <ChoiceGrid
              selected={form.hasLocation}
              onSelect={(v) => set("hasLocation", v)}
              choices={[
                { value: "yes", label: t("hasLocation_yes") },
                { value: "no", label: t("hasLocation_no") },
              ]}
            />
          </div>

          <AnimatePresence>
            {form.hasLocation === "yes" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <FieldLabel id="locationType" label={t("fieldLocationType")} optional optionalLabel={t("optional")} />
                <ChoiceGrid
                  selected={form.locationType}
                  onSelect={(v) => set("locationType", v)}
                  columns={3}
                  choices={[
                    { value: "mall", label: t("locationType_mall") },
                    { value: "office", label: t("locationType_office") },
                    { value: "restarea", label: t("locationType_restarea") },
                    { value: "gasstation", label: t("locationType_gasstation") },
                    { value: "private", label: t("locationType_private") },
                    { value: "other", label: t("locationType_other") },
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <FieldLabel id="budget" label={t("fieldBudget")} optional optionalLabel={t("optional")} />
            <ChoiceGrid
              selected={form.budget}
              onSelect={(v) => set("budget", v)}
              choices={[
                { value: "<300", label: t("budget_300") },
                { value: "300-1000", label: t("budget_300_1000") },
                { value: ">1000", label: t("budget_1000") },
              ]}
            />
          </div>

          <div>
            <FieldLabel id="units" label={t("fieldUnits")} optional optionalLabel={t("optional")} />
            <ChoiceGrid
              selected={form.units}
              onSelect={(v) => set("units", v)}
              columns={3}
              choices={[
                { value: "1", label: t("units_1") },
                { value: "2-5", label: t("units_2_5") },
                { value: ">5", label: t("units_5") },
              ]}
            />
          </div>

          <div>
            <FieldLabel id="chargerType" label={t("fieldChargerType")} optional optionalLabel={t("optional")} />
            <ChoiceGrid
              selected={form.chargerType}
              onSelect={(v) => set("chargerType", v)}
              columns={2}
              choices={[
                { value: "dc-fast-30", label: "DC Fast Charger 30kW (1 Gun)" },
                { value: "dc-ultra-60", label: "DC Ultra Fast Charger 60kW (2 Gun)" },
                { value: "dc-ultra-80", label: "DC Ultra Fast Charger 80kW (2 Gun)" },
                { value: "dc-ultra-120", label: "DC Ultra Fast Charger 120kW (2 Gun)" },
              ]}
            />
          </div>

          <motion.div variants={fadeUp}>
            <FieldLabel id="currentPowerCapacity" label="Daya listrik tersedia saat ini" optional optionalLabel={t("optional")} />
            <input
              id="currentPowerCapacity"
              className="starvo-input"
              value={form.currentPowerCapacity}
              onChange={(e) => set("currentPowerCapacity", e.target.value)}
              placeholder="Contoh: 66 kVA / 100 kVA"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <FieldLabel id="parkingSlots" label="Parking Slot" optional optionalLabel={t("optional")} />
            <input
              id="parkingSlots"
              className="starvo-input"
              value={form.parkingSlots}
              onChange={(e) => set("parkingSlots", e.target.value)}
              placeholder="Contoh: 10 slot"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <FieldLabel id="estimatedVehicles" label="Estimasi Kendaraan" optional optionalLabel={t("optional")} />
            <input
              id="estimatedVehicles"
              className="starvo-input"
              value={form.estimatedVehicles}
              onChange={(e) => set("estimatedVehicles", e.target.value)}
              placeholder="Contoh: 50 kendaraan/hari"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Section 4: Location Details */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={4} totalSteps={TOTAL_STEPS} title={t("section4Title")} subtitle={t("section4Subtitle")} />
        <div className="space-y-4">
          <motion.div variants={fadeUp}>
            <FieldLabel id="address" label={t("fieldAddress")} optional optionalLabel={t("optional")} />
            <textarea
              id="address"
              className="starvo-input h-auto min-h-[80px] py-3 resize-none"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder={t("placeholderAddress")}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="landArea" label={t("fieldLandArea")} optional optionalLabel={t("optional")} />
            <input
              id="landArea"
              className="starvo-input"
              value={form.landArea}
              onChange={(e) => set("landArea", e.target.value)}
              placeholder={t("placeholderLandArea")}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="map" label={t("fieldMap")} optional optionalLabel={t("optional")} />
            <MapPicker position={form.mapPosition} onPositionChange={(pos) => set("mapPosition", pos)} />
            {form.mapPosition && (
              <p className="text-xs text-muted-foreground mt-2">
                📍 {form.mapPosition[0].toFixed(5)}, {form.mapPosition[1].toFixed(5)}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Section 5: Timeline */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={5} totalSteps={TOTAL_STEPS} title={t("section5Title")} subtitle={t("section5Subtitle")} />
        <ChoiceGrid
          selected={form.timeline}
          onSelect={(v) => set("timeline", v)}
          choices={[
            { value: "immediate", label: t("timeline_immediate") },
            { value: "1-3", label: t("timeline_1_3") },
            { value: "3-6", label: t("timeline_3_6") },
            { value: "exploring", label: t("timeline_exploring") },
          ]}
        />
      </motion.div>

      {/* Section 6: Notes */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={6} totalSteps={TOTAL_STEPS} title={t("section6Title")} subtitle={t("section6Subtitle")} />
        <FieldLabel id="notes" label={t("fieldNotes")} optional optionalLabel={t("optional")} />
        <textarea
          id="notes"
          className="starvo-input h-auto min-h-[100px] py-3 resize-none"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder={t("placeholderNotes")}
        />
      </motion.div>

      {/* CTA */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.01 } : undefined}
        whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
        className="starvo-cta disabled:opacity-70 disabled:pointer-events-none"
      >
        <span className="text-lg">{isSubmitting ? "Sending…" : t("ctaPrimary")}</span>
        <span className="text-xs opacity-70 uppercase tracking-wider">{t("ctaSecondary")}</span>
      </motion.button>

      <p className="text-center text-xs text-muted-foreground pb-8">
        {t("footerConsent")}
      </p>
    </form>
  );
};

export default StarvoForm;

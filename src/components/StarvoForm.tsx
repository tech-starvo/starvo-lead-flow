import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";
import FieldLabel from "./FieldLabel";
import ChoiceGrid from "./ChoiceGrid";
import SectionHeader from "./SectionHeader";

const MapPicker = lazy(() => import("./MapPicker"));

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
  address: string;
  mapPosition: [number, number] | null;
  timeline: string;
  contactPref: string;
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
  address: "",
  mapPosition: null,
  timeline: "",
  contactPref: "",
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

const TOTAL_STEPS = 7;

const StarvoForm = () => {
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber] = useState(() => `STV-${Date.now().toString(36).toUpperCase()}`);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.whatsapp || !form.interest) return;
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Permintaan Diterima!</h1>
        <p className="text-muted-foreground mb-4">Request Received</p>
        <div className="bg-card border border-input rounded-lg px-6 py-3 mb-6">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Referensi / Reference</span>
          <p className="text-lg font-mono font-bold text-foreground mt-1">{refNumber}</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs" style={{ textWrap: "balance" }}>
          Tim kami akan menghubungi Anda dalam 1×24 jam kerja.<br />
          <span className="italic">Our team will contact you within 1 business day.</span>
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Info */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="starvo-section-card">
        <SectionHeader step={1} totalSteps={TOTAL_STEPS} idn="Informasi Dasar" en="Basic Information" />
        <div className="space-y-4">
          <motion.div variants={fadeUp}>
            <FieldLabel id="fullName" idn="Nama Lengkap" en="Full Name" />
            <input id="fullName" className="starvo-input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required placeholder="John Doe" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="company" idn="Nama Perusahaan" en="Company Name" optional />
            <input id="company" className="starvo-input" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="PT Contoh Indonesia" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="whatsapp" idn="Nomor WhatsApp" en="WhatsApp Number" />
            <input id="whatsapp" className="starvo-input" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} required placeholder="+62 812 3456 7890" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="email" idn="Email" en="Email" />
            <input id="email" className="starvo-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@company.com" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="city" idn="Kota" en="City" />
            <input id="city" className="starvo-input" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Jakarta" />
          </motion.div>
        </div>
      </motion.div>

      {/* Section 2: Interest */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={2} totalSteps={TOTAL_STEPS} idn="Ketertarikan Anda" en="Your Interest" />
        <ChoiceGrid
          selected={form.interest}
          onSelect={(v) => set("interest", v)}
          choices={[
            { value: "business", idn: "Peluang bisnis SPKLU", en: "EV charging business opportunity" },
            { value: "purchase", idn: "Pembelian mesin SPKLU", en: "Purchasing EV charging machines" },
            { value: "personal", idn: "Penggunaan pribadi / operasional", en: "Personal or operational use" },
            { value: "explore", idn: "Masih mencari informasi", en: "Just exploring" },
          ]}
        />
      </motion.div>

      {/* Section 3: Plan & Needs */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={3} totalSteps={TOTAL_STEPS} idn="Rencana & Kebutuhan" en="Plan & Needs" />
        <div className="space-y-5">
          <div>
            <FieldLabel id="hasLocation" idn="Apakah Anda sudah memiliki lokasi?" en="Do you already have a location?" />
            <ChoiceGrid
              selected={form.hasLocation}
              onSelect={(v) => set("hasLocation", v)}
              choices={[
                { value: "yes", idn: "Sudah", en: "Yes" },
                { value: "no", idn: "Belum", en: "Not yet" },
              ]}
            />
          </div>

          <AnimatePresence>
            {form.hasLocation === "yes" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <FieldLabel id="locationType" idn="Jenis lokasi" en="Type of location" optional />
                <ChoiceGrid
                  selected={form.locationType}
                  onSelect={(v) => set("locationType", v)}
                  columns={3}
                  choices={[
                    { value: "mall", idn: "Mall / Retail", en: "Mall / Retail" },
                    { value: "office", idn: "Perkantoran", en: "Office" },
                    { value: "restarea", idn: "Rest Area", en: "Rest Area" },
                    { value: "gasstation", idn: "SPBU", en: "Gas Station" },
                    { value: "private", idn: "Lahan Pribadi", en: "Private Land" },
                    { value: "other", idn: "Lainnya", en: "Others" },
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <FieldLabel id="budget" idn="Estimasi budget" en="Estimated budget" optional />
            <ChoiceGrid
              selected={form.budget}
              onSelect={(v) => set("budget", v)}
              choices={[
                { value: "<100", idn: "< 100 juta", en: "< 100M IDR" },
                { value: "100-500", idn: "100 – 500 juta", en: "100–500M IDR" },
                { value: "500-1000", idn: "500 juta – 1 M", en: "500M–1B IDR" },
                { value: ">1000", idn: "> 1 Miliar", en: "> 1B IDR" },
              ]}
            />
          </div>

          <div>
            <FieldLabel id="units" idn="Jumlah unit" en="Number of units needed" optional />
            <ChoiceGrid
              selected={form.units}
              onSelect={(v) => set("units", v)}
              columns={3}
              choices={[
                { value: "1", idn: "1", en: "1 unit" },
                { value: "2-5", idn: "2–5", en: "2–5 units" },
                { value: ">5", idn: ">5", en: ">5 units" },
              ]}
            />
          </div>

          <div>
            <FieldLabel id="chargerType" idn="Jenis charger yang diminati" en="Preferred charger type" optional />
            <ChoiceGrid
              selected={form.chargerType}
              onSelect={(v) => set("chargerType", v)}
              columns={3}
              choices={[
                { value: "ac", idn: "AC", en: "AC Charger" },
                { value: "dc", idn: "DC Fast", en: "DC Fast Charging" },
                { value: "unsure", idn: "Belum tahu", en: "Not sure" },
              ]}
            />
          </div>
        </div>
      </motion.div>

      {/* Section 4: Location Details */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={4} totalSteps={TOTAL_STEPS} idn="Detail Lokasi" en="Location Details (Optional)" />
        <div className="space-y-4">
          <motion.div variants={fadeUp}>
            <FieldLabel id="address" idn="Alamat" en="Address" optional />
            <textarea
              id="address"
              className="starvo-input h-auto min-h-[80px] py-3 resize-none"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Jl. Contoh No. 123, Jakarta Selatan"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FieldLabel id="map" idn="Tandai lokasi di peta" en="Pin location on map" optional />
            <Suspense fallback={<div className="w-full h-64 bg-muted animate-pulse rounded-xl flex items-center justify-center"><span className="text-muted-foreground text-sm">Loading map...</span></div>}>
              <MapPicker position={form.mapPosition} onPositionChange={(pos) => set("mapPosition", pos)} />
            </Suspense>
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
        <SectionHeader step={5} totalSteps={TOTAL_STEPS} idn="Waktu Rencana" en="Timeline" />
        <ChoiceGrid
          selected={form.timeline}
          onSelect={(v) => set("timeline", v)}
          choices={[
            { value: "immediate", idn: "Segera (0–1 bulan)", en: "Immediately (0–1 month)" },
            { value: "1-3", idn: "1–3 bulan", en: "1–3 months" },
            { value: "3-6", idn: "3–6 bulan", en: "3–6 months" },
            { value: "exploring", idn: "Masih eksplorasi", en: ">6 months / Exploring" },
          ]}
        />
      </motion.div>

      {/* Section 6: Contact Preference */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={6} totalSteps={TOTAL_STEPS} idn="Preferensi Kontak" en="Contact Preference" />
        <FieldLabel id="contactPref" idn="Apakah Anda ingin dihubungi oleh tim kami?" en="Do you want our team to contact you?" />
        <ChoiceGrid
          selected={form.contactPref}
          onSelect={(v) => set("contactPref", v)}
          choices={[
            { value: "yes", idn: "Ya", en: "Yes" },
            { value: "no", idn: "Tidak", en: "No" },
          ]}
        />
      </motion.div>

      {/* Section 7: Notes */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="starvo-section-card">
        <SectionHeader step={7} totalSteps={TOTAL_STEPS} idn="Catatan" en="Notes" />
        <FieldLabel id="notes" idn="Pesan atau pertanyaan" en="Message or questions" optional />
        <textarea
          id="notes"
          className="starvo-input h-auto min-h-[100px] py-3 resize-none"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Tulis pesan Anda di sini... / Write your message here..."
        />
      </motion.div>

      {/* CTA */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="starvo-cta"
      >
        <span className="text-lg">Konsultasi Sekarang</span>
        <span className="text-xs opacity-70 uppercase tracking-wider">Get Consultation</span>
      </motion.button>

      <p className="text-center text-xs text-muted-foreground pb-8">
        Dengan mengirim formulir ini, Anda menyetujui untuk dihubungi oleh tim Starvo.<br />
        <span className="italic">By submitting, you agree to be contacted by the Starvo team.</span>
      </p>
    </form>
  );
};

export default StarvoForm;

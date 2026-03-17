import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MapPin, Phone, Building2, Calendar } from "lucide-react";
import { getAdminT } from "@/locales/translations";
import { fetchAdminLeadById, type Lead } from "@/lib/adminLeadsApi";

const t = getAdminT();

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
};

const DetailRow = ({ label, value }: { label: string; value: string | null | number }) => {
  const display = value == null || value === "" ? "—" : String(value);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground min-w-[140px]">{label}</span>
      <span className="text-foreground">{display}</span>
    </div>
  );
};

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchAdminLeadById(id);
        setLead(data ?? null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
        setLead(null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>{t("admin_loadingLead")}</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-input">
          <div className="container flex items-center h-14 px-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> {t("admin_backToLeads")}
            </Link>
          </div>
        </header>
        <main className="container px-4 py-8 max-w-2xl mx-auto">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error ?? t("admin_leadNotFound")}
          </div>
        </main>
      </div>
    );
  }

  const mapUrl =
    lead.map_lat != null && lead.map_lng != null
      ? `https://www.google.com/maps?q=${lead.map_lat},${lead.map_lng}`
      : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-input">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("admin_backToLeads")}
          </Link>
          <div className="flex items-center gap-2">
            <img src="/starvo-circle-logo.png" alt="Starvo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-semibold text-foreground">{t("admin_leadDetailTitle")}</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="container px-4 py-8 max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("admin_reference")}</span>
          <p className="text-lg font-mono font-bold text-foreground">{lead.ref_number}</p>
          <p className="text-sm text-muted-foreground">{t("admin_submittedOn")} {formatDate(lead.created_at)}</p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-lg border border-input bg-card p-4"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            {t("admin_sectionContact")}
          </h2>
          <div className="space-y-0">
            <DetailRow label={t("admin_labelFullName")} value={lead.full_name} />
            <DetailRow label={t("admin_labelCompany")} value={lead.company} />
            <DetailRow label={t("admin_labelWhatsApp")} value={lead.whatsapp} />
            <DetailRow label={t("admin_labelEmail")} value={lead.email} />
            <DetailRow label={t("admin_labelCity")} value={lead.city} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-input bg-card p-4"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            {t("admin_sectionInterestPlan")}
          </h2>
          <div className="space-y-0">
            <DetailRow label={t("admin_labelInterest")} value={lead.interest} />
            <DetailRow label={t("admin_labelHasLocation")} value={lead.has_location} />
            <DetailRow label={t("admin_labelLocationType")} value={lead.location_type} />
            <DetailRow label={t("admin_labelBudget")} value={lead.budget} />
            <DetailRow label={t("admin_labelUnitsNeeded")} value={lead.units} />
            <DetailRow label={t("admin_labelChargerType")} value={lead.charger_type} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg border border-input bg-card p-4"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {t("admin_sectionLocationDetails")}
          </h2>
          <div className="space-y-0">
            <DetailRow label={t("admin_labelAddress")} value={lead.address} />
            <DetailRow label={t("admin_labelLandArea")} value={lead.land_area} />
            {mapUrl && (
              <div className="pt-2">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  {t("admin_viewOnMap")} ({lead.map_lat?.toFixed(5)}, {lead.map_lng?.toFixed(5)})
                </a>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-input bg-card p-4"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            {t("admin_sectionTimelineNotes")}
          </h2>
          <div className="space-y-0">
            <DetailRow label={t("admin_labelTimeline")} value={lead.timeline} />
            {lead.notes && (
              <div className="flex flex-col gap-1 pt-2 border-t border-border/50 mt-2">
                <span className="text-sm text-muted-foreground">{t("admin_labelNotesMessage")}</span>
                <p className="text-foreground whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default LeadDetail;

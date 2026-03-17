import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AuthButton from "@/components/AuthButton";
import { getAdminT } from "@/locales/translations";
import { fetchAdminLeads, type Lead } from "@/lib/adminLeadsApi";

const t = getAdminT();

export type { Lead } from "@/lib/adminLeadsApi";

const Admin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminLeads();
        setLeads(data ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
        setLeads([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-input">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("admin_backToForm")}
          </Link>
          <div className="flex items-center gap-2">
            <img src="/starvo-circle-logo.png" alt="Starvo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-semibold text-foreground">{t("admin_leadsTitle")}</span>
          </div>
          <AuthButton />
        </div>
      </header>

      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          {t("admin_leadsTitle")}
        </motion.h1>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t("admin_loadingLeads")}</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && !error && leads.length === 0 && (
          <p className="text-muted-foreground py-8">{t("admin_noLeadsYet")}</p>
        )}

        {!loading && !error && leads.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-input bg-card overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin_tableRef")}</TableHead>
                  <TableHead>{t("admin_tableName")}</TableHead>
                  <TableHead>{t("admin_tableCompany")}</TableHead>
                  <TableHead>{t("admin_tableWhatsApp")}</TableHead>
                  <TableHead>{t("admin_tableInterest")}</TableHead>
                  <TableHead>{t("admin_tableTimeline")}</TableHead>
                  <TableHead className="text-right">{t("admin_tableSubmitted")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className="text-primary hover:underline"
                      >
                        {lead.ref_number}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className="hover:underline text-foreground"
                      >
                        {lead.full_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.company ?? "—"}</TableCell>
                    <TableCell>{lead.whatsapp}</TableCell>
                    <TableCell>{lead.interest}</TableCell>
                    <TableCell>{lead.timeline ?? "—"}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {formatDate(lead.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;

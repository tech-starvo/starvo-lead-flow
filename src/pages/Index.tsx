import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarvoForm from "@/components/StarvoForm";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-input">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <img src="/starvo-circle-logo.png" alt="Starvo" className="w-8 h-8 rounded-lg object-contain" />
            <img src="/starvo-logo.png" alt="Starvo" className="h-6 object-contain hidden sm:block" />
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="container px-4 pt-10 pb-6 text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2" style={{ textWrap: "balance" }}>
          {t("heroTitle")}
        </h1>
        <p className="text-base text-muted-foreground italic">
          {t("heroSubtitle")}
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto" style={{ textWrap: "balance" }}>
          {t("heroDescription")}
        </p>
      </motion.section>

      {/* Form */}
      <main className="container px-4 pb-12 max-w-lg mx-auto">
        <StarvoForm />
      </main>
    </div>
  );
};

export default Index;

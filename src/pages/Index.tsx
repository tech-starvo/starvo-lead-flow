import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import StarvoForm from "@/components/StarvoForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-input">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground tracking-tight text-lg">Starvo</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">SPKLU</span>
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
          Tenagai Masa Depan Anda.
        </h1>
        <p className="text-base text-muted-foreground italic">
          Power Your Future.
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto" style={{ textWrap: "balance" }}>
          Lengkapi penilaian 2 menit ini untuk memulai perjalanan infrastruktur EV Anda.
          <br />
          <span className="italic">Complete this 2-minute assessment to start your EV infrastructure journey.</span>
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

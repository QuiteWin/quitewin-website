import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import ScrambledText from "./ScrambledText";

const comparisonData = [
  { feature: "Offline Capable", quitewin: true, competitor: false },
  { feature: "Stealth Overlay", quitewin: true, competitor: false },
  { feature: "Privacy-First", quitewin: true, competitor: false },
  { feature: "Free Tier", quitewin: true, competitor: true },
  { feature: "Local AI Models", quitewin: true, competitor: false },
  { feature: "Screenshot", quitewin: true, competitor: true },
  { feature: "Adaptive Audio", quitewin: true, competitor: false },
  { feature: "Cross-Platform", quitewin: true, competitor: true },
];

const Comparison = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Why QuiteWin?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <ScrambledText as="span" className="inline">Built for privacy. Built for developers. Built different.</ScrambledText>
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-border/50 bg-muted/20">
              <div className="text-muted-foreground font-medium">Feature</div>
              <div className="text-center">
                <span className="text-neon-green font-bold text-lg">QuiteWin</span>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground">Others</span>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/30">
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 p-6 hover:bg-muted/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="text-foreground font-medium">{row.feature}</div>
                  <div className="flex justify-center">
                    {row.quitewin ? (
                      <motion.div
                        className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", delay: index * 0.05 + 0.2 }}
                      >
                        <Check className="w-5 h-5 text-neon-green" />
                      </motion.div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                        <X className="w-5 h-5 text-destructive" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {row.competitor ? (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Check className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <X className="w-5 h-5 text-destructive/50" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <motion.p
            className="text-center mt-8 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-neon-green">✦</span> QuiteWin: The only AI assistant that puts your privacy first.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Comparison;

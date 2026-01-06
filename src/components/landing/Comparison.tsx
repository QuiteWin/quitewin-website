import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonData = [
  { feature: "Auto-Typing Ghost Mode", quitewin: true, others: false, description: "Types responses automatically with human-like rhythm" },
  { feature: "Hardware-Level Invisibility", quitewin: true, others: false, description: "Invisible to screen sharing and recordings" },
  { feature: "Personalized RAG Engine", quitewin: true, others: false, description: "AI trained on your resume and experience" },
  { feature: "Local-Private AI (Ollama)", quitewin: true, others: false, description: "100% offline processing option" },
  { feature: "Multi-Model Racing", quitewin: true, others: false, description: "Queries multiple AI models simultaneously" },
  { feature: "Real-time Transcription", quitewin: true, others: true, description: "Whisper-powered audio capture" },
  { feature: "Screen Context OCR", quitewin: true, others: true, description: "Reads and understands your screen" },
  { feature: "Zero Trace Operation", quitewin: true, others: false, description: "Doesn't hook into browser processes" },
  { feature: "Humanized Typing Rhythm", quitewin: true, others: false, description: "Mimics natural typing with realistic pauses" },
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
            <span className="text-gradient-hero">The QuiteWin Edge</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See why QuiteWin kills the competition.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-border/50 bg-muted/20">
              <div className="col-span-6 text-muted-foreground font-medium">Feature</div>
              <div className="col-span-3 text-center">
                <span className="text-neon-green font-bold text-lg">QuiteWin</span>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-muted-foreground">The Others</span>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/30">
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  className="grid grid-cols-12 gap-4 p-4 md:p-6 hover:bg-muted/10 transition-colors group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <div className="col-span-6">
                    <div className="text-foreground font-medium">{row.feature}</div>
                    <div className="text-xs text-muted-foreground/60 mt-1 hidden group-hover:block">
                      {row.description}
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-center items-center">
                    {row.quitewin ? (
                      <motion.div
                        className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", delay: index * 0.03 + 0.1 }}
                      >
                        <Check className="w-5 h-5 text-neon-green" />
                      </motion.div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="col-span-3 flex justify-center items-center">
                    {row.others ? (
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-muted-foreground/50" />
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

        </motion.div>
      </div>
    </section>
  );
};

export default Comparison;

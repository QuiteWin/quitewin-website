import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonData = [
  { feature: "Auto-Typing Ghost Mode", quitewin: true, competitor: false, description: "Types responses automatically with human-like rhythm" },
  { feature: "Hardware-Level Invisibility", quitewin: true, competitor: false, description: "Invisible to screen sharing and recordings" },
  { feature: "Personalized RAG Engine", quitewin: true, competitor: false, description: "AI trained on your resume and experience" },
  { feature: "Local-Private AI (Ollama)", quitewin: true, competitor: false, description: "100% offline processing option" },
  { feature: "Multi-Model Racing", quitewin: true, competitor: false, description: "Queries multiple AI models simultaneously" },
  { feature: "Real-time Transcription", quitewin: true, competitor: true, description: "Whisper-powered audio capture" },
  { feature: "Screen Context OCR", quitewin: true, competitor: true, description: "Reads and understands your screen" },
  { feature: "Manual Copy-Paste", quitewin: false, competitor: true, description: "Requires manual intervention" },
  { feature: "Detectable UI", quitewin: false, competitor: true, description: "Visible in screen recordings" },
  { feature: "Generic Answers", quitewin: false, competitor: true, description: "No personalization" },
  { feature: "Cloud-Only Processing", quitewin: false, competitor: true, description: "Data leaves your device" },
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
                    {row.competitor ? (
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Check className="w-5 h-5 text-destructive/50" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Summary */}
          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass-card p-6 rounded-xl border border-destructive/20">
              <h3 className="text-lg font-bold text-destructive mb-3">❌ The Others</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Manual copying required</li>
                <li>• Detectable, visible UI</li>
                <li>• Generic, impersonal answers</li>
                <li>• Cloud-only processing</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-xl border border-neon-green/30 neon-glow-green">
              <h3 className="text-lg font-bold text-neon-green mb-3">✓ QuiteWin</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Auto-Typing Ghost Mode</li>
                <li>• Hardware-level invisibility</li>
                <li>• Personalized RAG Engine</li>
                <li>• Local-Private AI option</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Comparison;

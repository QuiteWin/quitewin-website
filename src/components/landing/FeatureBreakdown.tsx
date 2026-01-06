import { motion } from "framer-motion";
import { Zap, Eye, Mic, Command } from "lucide-react";

const features = [
  {
    icon: Zap,
    name: "Parallel AI Race",
    benefit: "Instant Accuracy",
    why: "Queries multiple models (Llama, Gemini, GPT) simultaneously to give you the perfect answer in <500ms.",
    color: "purple"
  },
  {
    icon: Eye,
    name: "Vision OCR",
    benefit: "Instant Context",
    why: "Sees what you see on screen. It understands your code, diagrams, and browser tabs instantly.",
    color: "green"
  },
  {
    icon: Mic,
    name: "Silent Whisper",
    benefit: "Zero Distraction",
    why: "High-accuracy transcription that handles heavy accents and technical jargon with ease.",
    color: "pink"
  },
  {
    icon: Command,
    name: "Global Shortcuts",
    benefit: "Total Control",
    why: "Toggle invisibility, clear memory, or trigger ghost-typing with customizable, near-silent hotkeys.",
    color: "amber"
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    purple: { text: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/30" },
    green: { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30" },
    pink: { text: "text-neon-pink", bg: "bg-neon-pink/10", border: "border-neon-pink/30" },
    amber: { text: "text-neon-amber", bg: "bg-neon-amber/10", border: "border-neon-amber/30" }
  };
  return colors[color] || colors.purple;
};

const FeatureBreakdown = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-neon-pink uppercase tracking-widest mb-4 block">
            Technical Excellence
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Feature{" "}
            <span className="text-gradient-hero">Breakdown</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every feature engineered for professional excellence
          </p>
        </motion.div>

        {/* Feature Table - Desktop */}
        <motion.div
          className="hidden md:block glass-card rounded-2xl border border-border/50 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left py-4 px-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">Feature</th>
                <th className="text-left py-4 px-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">The Benefit</th>
                <th className="text-left py-4 px-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">Why it's "The Best"</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => {
                const colors = getColorClasses(feature.color);
                const Icon = feature.icon;
                
                return (
                  <motion.tr
                    key={feature.name}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <span className="font-semibold">{feature.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`font-mono text-sm ${colors.text}`}>{feature.benefit}</span>
                    </td>
                    <td className="py-5 px-6 text-muted-foreground text-sm max-w-md">{feature.why}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Feature Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.name}
                className={`glass-card rounded-xl p-5 border ${colors.border}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feature.name}</h4>
                    <span className={`font-mono text-xs ${colors.text}`}>{feature.benefit}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{feature.why}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureBreakdown;

import { motion } from "framer-motion";
import { Shield, Eye, Activity, Lock, Server } from "lucide-react";

const layers = [
  {
    icon: Shield,
    title: "setContentProtection",
    subtitle: "OS-Level Block",
    desc: "Hardware-level window cloaking that makes QuiteWin invisible to screen capture APIs.",
    color: "purple"
  },
  {
    icon: Eye,
    title: "Process Obfuscation",
    subtitle: "Stealth Windows Process",
    desc: "Runs as an innocuous system process, undetectable in task managers.",
    color: "green"
  },
  {
    icon: Activity,
    title: "Zero-Telemetry",
    subtitle: "No Analytics, Ever",
    desc: "No data collection, no tracking, no phone-home. Your sessions are yours alone.",
    color: "pink"
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    subtitle: "Secured Secrets",
    desc: "All sensitive data encrypted at rest and in transit. Your API keys and credentials never exposed.",
    color: "amber"
  },
  {
    icon: Server,
    title: "Local-Only Inference",
    subtitle: "Private Mode",
    desc: "Toggle full offline mode with Ollama. Zero cloud dependencies when privacy is paramount.",
    color: "cyan"
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
    purple: { text: "text-neon-purple", border: "border-neon-purple/30", bg: "bg-neon-purple/10", glow: "shadow-neon-purple/20" },
    green: { text: "text-neon-green", border: "border-neon-green/30", bg: "bg-neon-green/10", glow: "shadow-neon-green/20" },
    pink: { text: "text-neon-pink", border: "border-neon-pink/30", bg: "bg-neon-pink/10", glow: "shadow-neon-pink/20" },
    amber: { text: "text-neon-amber", border: "border-neon-amber/30", bg: "bg-neon-amber/10", glow: "shadow-neon-amber/20" },
    cyan: { text: "text-neon-cyan", border: "border-neon-cyan/30", bg: "bg-neon-cyan/10", glow: "shadow-neon-cyan/20" }
  };
  return colors[color] || colors.purple;
};

const SecurityLayers = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-neon-green uppercase tracking-widest mb-4 block">
            Security Protocol
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Five Layers of{" "}
            <span className="text-gradient-hero">Protection</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enterprise-grade security architecture for absolute peace of mind
          </p>
        </motion.div>

        {/* Central Shield with Scanning Animation */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Shield Icon */}
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-green/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40, left: "50%", top: "50%" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-purple/30"
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40, left: "50%", top: "50%" }}
              />
              
              <div className="w-20 h-20 rounded-full glass-card border border-neon-green/40 flex items-center justify-center">
                <Shield className="w-10 h-10 text-neon-green" />
              </div>
            </div>
          </motion.div>

          {/* Layers stacked below the shield */}
          <div className="pt-28 space-y-4">
            {layers.map((layer, index) => {
              const colors = getColorClasses(layer.color);
              const Icon = layer.icon;
              
              return (
                <motion.div
                  key={layer.title}
                  className={`glass-card rounded-xl p-5 border ${colors.border} hover:shadow-lg ${colors.glow} transition-all duration-300`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, x: index % 2 === 0 ? 5 : -5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-bold text-lg font-mono">{layer.title}</h3>
                        <span className={`text-xs font-mono ${colors.text}`}>({layer.subtitle})</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{layer.desc}</p>
                    </div>
                    <motion.div
                      className={`w-2 h-2 rounded-full ${colors.bg} border ${colors.border}`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityLayers;

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Wifi, WifiOff, Crown, Sparkles } from "lucide-react";
import { useState } from "react";
import LatencyVisualizer from "./LatencyVisualizer";

type Mode = "private" | "power" | "ultimate";

const HybridToggle = () => {
  const [mode, setMode] = useState<Mode>("private");

  const getModeColor = () => {
    switch (mode) {
      case "private":
        return "hsl(160 84% 39%)";
      case "power":
        return "hsl(263 70% 66%)";
      case "ultimate":
        return "hsl(45 93% 58%)";
    }
  };

  const getModeGlow = () => {
    switch (mode) {
      case "private":
        return "0 0 80px hsl(160 84% 39% / 0.2), inset 0 0 40px hsl(160 84% 39% / 0.05)";
      case "power":
        return "0 0 80px hsl(263 70% 66% / 0.2), inset 0 0 40px hsl(263 70% 66% / 0.05)";
      case "ultimate":
        return "0 0 80px hsl(45 93% 58% / 0.3), inset 0 0 40px hsl(45 93% 58% / 0.1), 0 0 120px hsl(263 70% 66% / 0.15), 0 0 120px hsl(160 84% 39% / 0.15)";
    }
  };

  const getModeGradient = () => {
    switch (mode) {
      case "private":
        return "radial-gradient(circle at center, hsl(160 84% 39% / 0.1) 0%, transparent 70%)";
      case "power":
        return "radial-gradient(circle at center, hsl(263 70% 66% / 0.1) 0%, transparent 70%)";
      case "ultimate":
        return "radial-gradient(circle at center, hsl(45 93% 58% / 0.15) 0%, hsl(263 70% 66% / 0.05) 40%, hsl(160 84% 39% / 0.05) 70%, transparent 100%)";
    }
  };

  return (
    <section id="hybrid-toggle" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Hybrid Engine</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Private when you want. Powerful when you need. Ultimate when you demand both.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Toggle Card */}
          <div
            className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              boxShadow: getModeGlow(),
              transition: "box-shadow 0.5s ease",
            }}
          >
            {/* Background glow transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: getModeGradient(),
                }}
              />
            </AnimatePresence>

            {/* Ultimate mode sparkle effects */}
            {mode === "ultimate" && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-neon-gold rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeOut",
                    }}
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10">
              {/* Three-way Toggle Switch */}
              <div className="flex flex-col items-center mb-12">
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
                  {/* Private Button */}
                  <motion.button
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 flex items-center gap-2 ${
                      mode === "private"
                        ? "bg-neon-green/20 text-neon-green border border-neon-green/50"
                        : "bg-background/50 text-muted-foreground border border-border/30 hover:border-neon-green/30"
                    }`}
                    onClick={() => setMode("private")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    Private
                  </motion.button>

                  {/* Ultimate Button (Center - Featured) */}
                  <motion.button
                    className={`px-5 py-2.5 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center gap-2 relative ${
                      mode === "ultimate"
                        ? "bg-gradient-to-r from-neon-green/20 via-neon-gold/30 to-neon-purple/20 text-neon-gold border border-neon-gold/50"
                        : "bg-background/50 text-muted-foreground border border-border/30 hover:border-neon-gold/30"
                    }`}
                    onClick={() => setMode("ultimate")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      boxShadow: mode === "ultimate" ? "0 0 30px hsl(45 93% 58% / 0.4)" : "none",
                    }}
                  >
                    {mode === "ultimate" && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-neon-gold" />
                      </motion.div>
                    )}
                    <Crown className="w-4 h-4 md:w-5 md:h-5" />
                    Ultimate
                  </motion.button>

                  {/* Power Button */}
                  <motion.button
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 flex items-center gap-2 ${
                      mode === "power"
                        ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/50"
                        : "bg-background/50 text-muted-foreground border border-border/30 hover:border-neon-purple/30"
                    }`}
                    onClick={() => setMode("power")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Zap className="w-4 h-4 md:w-5 md:h-5" />
                    Power
                  </motion.button>
                </div>
                
                <LatencyVisualizer mode={mode} />
              </div>

              {/* Mode Content */}
              <AnimatePresence mode="wait">
                {mode === "private" && (
                  <motion.div
                    key="private"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-neon-green/10 flex items-center justify-center mx-auto mb-6 neon-border-green">
                      <WifiOff className="w-10 h-10 text-neon-green" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 text-neon-green">
                      Private Mode
                    </h3>
                    <p className="text-xl text-muted-foreground mb-4">
                      "Runs where you are."
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-mono">
                        Ollama Powered
                      </span>
                      <span className="px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-mono">
                        100% Offline
                      </span>
                      <span className="px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-mono">
                        Zero Data Leaks
                      </span>
                    </div>
                  </motion.div>
                )}

                {mode === "power" && (
                  <motion.div
                    key="power"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-neon-purple/10 flex items-center justify-center mx-auto mb-6 neon-border-purple">
                      <Wifi className="w-10 h-10 text-neon-purple" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 text-neon-purple">
                      Power Mode
                    </h3>
                    <p className="text-xl text-muted-foreground mb-4">
                      "Unleash cloud intelligence."
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-4 py-2 rounded-full bg-neon-purple/10 text-neon-purple text-sm font-mono">
                        Gemini / GPT
                      </span>
                      <span className="px-4 py-2 rounded-full bg-neon-purple/10 text-neon-purple text-sm font-mono">
                        Ultra-Low Latency
                      </span>
                      <span className="px-4 py-2 rounded-full bg-neon-purple/10 text-neon-purple text-sm font-mono">
                        Unlimited Context
                      </span>
                    </div>
                  </motion.div>
                )}

                {mode === "ultimate" && (
                  <motion.div
                    key="ultimate"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-green/10 via-neon-gold/20 to-neon-purple/10 flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                      style={{
                        boxShadow: "0 0 40px hsl(45 93% 58% / 0.3), inset 0 0 20px hsl(45 93% 58% / 0.1)",
                        border: "2px solid hsl(45 93% 58% / 0.5)",
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                        style={{
                          background: "conic-gradient(from 0deg, transparent, hsl(160 84% 39% / 0.3), transparent, hsl(263 70% 66% / 0.3), transparent)",
                        }}
                      />
                      <Crown className="w-12 h-12 text-neon-gold relative z-10" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-neon-green via-neon-gold to-neon-purple bg-clip-text text-transparent">
                      Ultimate Mode
                    </h3>
                    <p className="text-xl text-muted-foreground mb-4">
                      "The best of both worlds. No compromises."
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-mono border border-neon-green/30">
                        Local Fallback
                      </span>
                      <span className="px-4 py-2 rounded-full bg-neon-gold/10 text-neon-gold text-sm font-mono border border-neon-gold/30">
                        Smart Routing
                      </span>
                      <span className="px-4 py-2 rounded-full bg-neon-purple/10 text-neon-purple text-sm font-mono border border-neon-purple/30">
                        Cloud Power
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-green/10 to-neon-purple/10 text-foreground text-sm font-mono border border-neon-gold/30">
                        Auto Privacy Detection
                      </span>
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-purple/10 to-neon-green/10 text-foreground text-sm font-mono border border-neon-gold/30">
                        Seamless Switching
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HybridToggle;

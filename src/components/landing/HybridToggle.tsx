import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import LatencyVisualizer from "./LatencyVisualizer";

const HybridToggle = () => {
  const [isPowerMode, setIsPowerMode] = useState(false);

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
            Private when you want. Powerful when you need.
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
              boxShadow: isPowerMode
                ? "0 0 80px hsl(263 70% 66% / 0.2), inset 0 0 40px hsl(263 70% 66% / 0.05)"
                : "0 0 80px hsl(160 84% 39% / 0.2), inset 0 0 40px hsl(160 84% 39% / 0.05)",
              transition: "box-shadow 0.5s ease",
            }}
          >
            {/* Background glow transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isPowerMode ? "power" : "private"}
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: isPowerMode
                    ? "radial-gradient(circle at center, hsl(263 70% 66% / 0.1) 0%, transparent 70%)"
                    : "radial-gradient(circle at center, hsl(160 84% 39% / 0.1) 0%, transparent 70%)",
                }}
              />
            </AnimatePresence>

            <div className="relative z-10">
              {/* Toggle Switch */}
              <div className="flex flex-col items-center mb-12">
                <div className="flex items-center justify-center gap-6">
                <span
                  className={`font-semibold text-lg transition-colors duration-300 ${
                    !isPowerMode ? "text-neon-green" : "text-muted-foreground"
                  }`}
                >
                  Private
                </span>

                <motion.button
                  className="relative w-24 h-12 rounded-full p-1 cursor-pointer"
                  style={{
                    background: isPowerMode
                      ? "linear-gradient(135deg, hsl(263 70% 50%), hsl(263 70% 30%))"
                      : "linear-gradient(135deg, hsl(160 84% 35%), hsl(160 84% 25%))",
                    boxShadow: isPowerMode
                      ? "0 0 30px hsl(263 70% 66% / 0.5)"
                      : "0 0 30px hsl(160 84% 39% / 0.5)",
                  }}
                  onClick={() => setIsPowerMode(!isPowerMode)}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center"
                    animate={{
                      x: isPowerMode ? 48 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isPowerMode ? (
                        <motion.div
                          key="zap"
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 180, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Zap className="w-5 h-5 text-neon-purple" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="shield"
                          initial={{ rotate: 180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -180, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Shield className="w-5 h-5 text-neon-green" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>

                <span
                  className={`font-semibold text-lg transition-colors duration-300 ${
                    isPowerMode ? "text-neon-purple" : "text-muted-foreground"
                  }`}
                >
                  Power
                </span>
                </div>
                <LatencyVisualizer isPowerMode={isPowerMode} />
              </div>

              {/* Mode Content */}
              <AnimatePresence mode="wait">
                {!isPowerMode ? (
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
                ) : (
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
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HybridToggle;

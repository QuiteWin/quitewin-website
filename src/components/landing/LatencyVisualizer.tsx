import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap, Activity } from "lucide-react";

interface LatencyVisualizerProps {
  isPowerMode: boolean;
}

const LatencyVisualizer = ({ isPowerMode }: LatencyVisualizerProps) => {
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger animation on mode change
  useEffect(() => {
    setPulseKey(prev => prev + 1);
  }, [isPowerMode]);

  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="relative flex items-center gap-2">
        {/* Source indicator */}
        <motion.div
          className={`w-3 h-3 rounded-full ${
            isPowerMode ? "bg-neon-purple" : "bg-neon-green"
          }`}
          animate={{
            boxShadow: isPowerMode
              ? ["0 0 0px hsl(263 70% 66% / 0)", "0 0 15px hsl(263 70% 66% / 0.6)", "0 0 0px hsl(263 70% 66% / 0)"]
              : ["0 0 0px hsl(160 84% 39% / 0)", "0 0 15px hsl(160 84% 39% / 0.6)", "0 0 0px hsl(160 84% 39% / 0)"]
          }}
          transition={{ duration: isPowerMode ? 1.5 : 0.8, repeat: Infinity }}
        />

        {/* Connection line */}
        <div className="relative w-16 h-[2px] bg-border/30 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${isPowerMode}-${pulseKey}`}
              className={`absolute inset-y-0 left-0 ${
                isPowerMode ? "bg-neon-purple" : "bg-neon-green"
              }`}
              initial={{ width: "0%", left: "0%" }}
              animate={{ 
                width: ["0%", "30%", "0%"],
                left: ["0%", "35%", "100%"]
              }}
              transition={{ 
                duration: isPowerMode ? 0.8 : 0.3,
                ease: isPowerMode ? "easeInOut" : "easeOut",
              }}
            />
          </AnimatePresence>
        </div>

        {/* Response indicator */}
        <motion.div
          className={`w-3 h-3 rounded-full border-2 ${
            isPowerMode ? "border-neon-purple" : "border-neon-green"
          }`}
          animate={{
            backgroundColor: isPowerMode
              ? ["transparent", "hsl(263 70% 66%)", "transparent"]
              : ["transparent", "hsl(160 84% 39%)", "transparent"]
          }}
          transition={{ 
            duration: isPowerMode ? 1.5 : 0.8, 
            repeat: Infinity,
            delay: isPowerMode ? 0.4 : 0.15
          }}
        />
      </div>

      {/* Label */}
      <motion.span
        className="text-xs font-mono text-muted-foreground"
        key={isPowerMode ? "cloud" : "local"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isPowerMode ? (
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-neon-purple" />
            ~200ms
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-neon-green" />
            Instant
          </span>
        )}
      </motion.span>
    </div>
  );
};

export default LatencyVisualizer;

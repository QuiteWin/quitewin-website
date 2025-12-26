import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap, Activity, Crown, Sparkles } from "lucide-react";

type Mode = "private" | "power" | "ultimate";

interface LatencyVisualizerProps {
  mode: Mode;
}

const LatencyVisualizer = ({ mode }: LatencyVisualizerProps) => {
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger animation on mode change
  useEffect(() => {
    setPulseKey(prev => prev + 1);
  }, [mode]);

  const getColor = () => {
    switch (mode) {
      case "private":
        return "bg-neon-green";
      case "power":
        return "bg-neon-purple";
      case "ultimate":
        return "bg-neon-gold";
    }
  };

  const getBorderColor = () => {
    switch (mode) {
      case "private":
        return "border-neon-green";
      case "power":
        return "border-neon-purple";
      case "ultimate":
        return "border-neon-gold";
    }
  };

  const getGlowAnimation = () => {
    switch (mode) {
      case "private":
        return ["0 0 0px hsl(160 84% 39% / 0)", "0 0 15px hsl(160 84% 39% / 0.6)", "0 0 0px hsl(160 84% 39% / 0)"];
      case "power":
        return ["0 0 0px hsl(263 70% 66% / 0)", "0 0 15px hsl(263 70% 66% / 0.6)", "0 0 0px hsl(263 70% 66% / 0)"];
      case "ultimate":
        return ["0 0 0px hsl(45 93% 58% / 0)", "0 0 20px hsl(45 93% 58% / 0.8)", "0 0 0px hsl(45 93% 58% / 0)"];
    }
  };

  const getFillAnimation = () => {
    switch (mode) {
      case "private":
        return ["transparent", "hsl(160 84% 39%)", "transparent"];
      case "power":
        return ["transparent", "hsl(263 70% 66%)", "transparent"];
      case "ultimate":
        return ["transparent", "hsl(45 93% 58%)", "transparent"];
    }
  };

  const getDuration = () => {
    switch (mode) {
      case "private":
        return 0.8;
      case "power":
        return 1.5;
      case "ultimate":
        return 0.5;
    }
  };

  const getLineDuration = () => {
    switch (mode) {
      case "private":
        return 0.3;
      case "power":
        return 0.8;
      case "ultimate":
        return 0.2;
    }
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="relative flex items-center gap-2">
        {/* Source indicator */}
        <motion.div
          className={`w-3 h-3 rounded-full ${getColor()}`}
          animate={{
            boxShadow: getGlowAnimation(),
          }}
          transition={{ duration: getDuration(), repeat: Infinity }}
        />

        {/* Connection line */}
        <div className="relative w-16 h-[2px] bg-border/30 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${pulseKey}`}
              className={`absolute inset-y-0 left-0 ${getColor()}`}
              initial={{ width: "0%", left: "0%" }}
              animate={{ 
                width: ["0%", "30%", "0%"],
                left: ["0%", "35%", "100%"]
              }}
              transition={{ 
                duration: getLineDuration(),
                ease: mode === "ultimate" ? "easeOut" : mode === "power" ? "easeInOut" : "easeOut",
              }}
            />
          </AnimatePresence>
          
          {/* Ultimate mode extra particles */}
          {mode === "ultimate" && (
            <>
              <motion.div
                className="absolute w-1 h-1 bg-neon-green rounded-full"
                animate={{
                  left: ["0%", "100%"],
                  opacity: [1, 0],
                }}
                transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                style={{ top: "-1px" }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-neon-purple rounded-full"
                animate={{
                  left: ["0%", "100%"],
                  opacity: [1, 0],
                }}
                transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                style={{ top: "1px" }}
              />
            </>
          )}
        </div>

        {/* Response indicator */}
        <motion.div
          className={`w-3 h-3 rounded-full border-2 ${getBorderColor()}`}
          animate={{
            backgroundColor: getFillAnimation(),
          }}
          transition={{ 
            duration: getDuration(), 
            repeat: Infinity,
            delay: mode === "ultimate" ? 0.1 : mode === "power" ? 0.4 : 0.15
          }}
        />
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          className="text-xs font-mono text-muted-foreground"
          key={mode}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "private" && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-neon-green" />
              Instant
            </span>
          )}
          {mode === "power" && (
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-neon-purple" />
              ~200ms
            </span>
          )}
          {mode === "ultimate" && (
            <span className="flex items-center gap-1 text-neon-gold">
              <Crown className="w-3 h-3" />
              Adaptive
              <Sparkles className="w-3 h-3" />
            </span>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default LatencyVisualizer;

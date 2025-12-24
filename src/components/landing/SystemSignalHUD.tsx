import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Mic, Monitor, Cpu, Wifi, Lock, Eye } from "lucide-react";

interface SystemSignal {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "green" | "purple" | "amber" | "cyan";
}

const signals: SystemSignal[] = [
  { icon: Mic, label: "Microphone", value: "Active", color: "green" },
  { icon: Monitor, label: "Screen Capture", value: "Blocked", color: "purple" },
  { icon: Cpu, label: "Model Loaded", value: "Local", color: "cyan" },
  { icon: Wifi, label: "Network", value: "Isolated", color: "amber" },
  { icon: Lock, label: "Encryption", value: "AES-256", color: "green" },
  { icon: Eye, label: "Visibility", value: "Private", color: "purple" },
];

const colorClasses: Record<string, { text: string; bg: string }> = {
  green: { text: "text-neon-green", bg: "bg-neon-green/10" },
  purple: { text: "text-neon-purple", bg: "bg-neon-purple/10" },
  amber: { text: "text-neon-amber", bg: "bg-neon-amber/10" },
  cyan: { text: "text-neon-cyan", bg: "bg-neon-cyan/10" },
};

const SystemSignalHUD = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % signals.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(cycleInterval);
  }, []);

  const current = signals[currentIndex];
  const Icon = current.icon;
  const colors = colorClasses[current.color];

  return (
    <motion.div
      className="fixed bottom-24 left-6 z-40 hidden md:block"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
    >
      <div className="glass-card rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-3 py-1.5 border-b border-border/30 flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-neon-green"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            System Status
          </span>
        </div>

        {/* Signal display */}
        <div className="px-3 py-2 min-w-[160px]">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentIndex}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`w-7 h-7 rounded-md ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {current.label}
                  </div>
                  <div className={`text-xs font-mono font-medium ${colors.text}`}>
                    {current.value}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress indicators */}
        <div className="px-3 pb-2 flex gap-1">
          {signals.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-0.5 flex-1 rounded-full ${
                idx === currentIndex ? "bg-neon-purple" : "bg-border/50"
              }`}
              animate={{
                scaleX: idx === currentIndex ? 1 : 0.8,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SystemSignalHUD;

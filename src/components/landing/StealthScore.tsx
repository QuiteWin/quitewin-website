import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Shield, Activity } from "lucide-react";

interface StealthMetrics {
  timeOnPage: number;
  interactions: number;
  isNightMode: boolean;
  reducedMotion: boolean;
  panicKeyUsed: boolean;
}

const StealthScore = () => {
  const [score, setScore] = useState(50);
  const [metrics, setMetrics] = useState<StealthMetrics>({
    timeOnPage: 0,
    interactions: 0,
    isNightMode: true,
    reducedMotion: false,
    panicKeyUsed: false,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate score based on metrics
  const calculateScore = useCallback((m: StealthMetrics) => {
    let s = 50;
    
    // Time on page (max +15)
    s += Math.min(m.timeOnPage / 10, 15);
    
    // Interactions (max +20)
    s += Math.min(m.interactions * 2, 20);
    
    // Night mode (+10)
    if (m.isNightMode) s += 10;
    
    // Reduced motion preference (+5)
    if (m.reducedMotion) s += 5;
    
    // Panic key used (+10)
    if (m.panicKeyUsed) s += 10;

    return Math.min(Math.round(s), 100);
  }, []);

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const updated = { ...prev, timeOnPage: prev.timeOnPage + 1 };
        setScore(calculateScore(updated));
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateScore]);

  // Track interactions
  useEffect(() => {
    const handleInteraction = () => {
      setMetrics(prev => {
        const updated = { ...prev, interactions: prev.interactions + 1 };
        setScore(calculateScore(updated));
        return updated;
      });
    };

    const events = ["click", "mousemove", "drag"];
    let throttleTimer: NodeJS.Timeout | null = null;
    
    const throttledHandler = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleInteraction();
        throttleTimer = null;
      }, 500);
    };

    events.forEach(event => window.addEventListener(event, throttledHandler));
    return () => events.forEach(event => window.removeEventListener(event, throttledHandler));
  }, [calculateScore]);

  // Track theme
  useEffect(() => {
    const checkTheme = () => {
      const isNight = !document.documentElement.classList.contains("light-mode");
      setMetrics(prev => {
        const updated = { ...prev, isNightMode: isNight };
        setScore(calculateScore(updated));
        return updated;
      });
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [calculateScore]);

  // Track reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMetrics(prev => ({ ...prev, reducedMotion: mq.matches }));
    
    const handler = (e: MediaQueryListEvent) => {
      setMetrics(prev => {
        const updated = { ...prev, reducedMotion: e.matches };
        setScore(calculateScore(updated));
        return updated;
      });
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [calculateScore]);

  // Listen for panic key events
  useEffect(() => {
    const handlePanic = () => {
      setMetrics(prev => {
        const updated = { ...prev, panicKeyUsed: true };
        setScore(calculateScore(updated));
        return updated;
      });
    };

    window.addEventListener("panicKeyUsed", handlePanic);
    return () => window.removeEventListener("panicKeyUsed", handlePanic);
  }, [calculateScore]);

  const getScoreLabel = () => {
    if (score >= 90) return "Ghost Protocol";
    if (score >= 80) return "Undetectable";
    if (score >= 60) return "Low Profile";
    if (score >= 40) return "Visible";
    return "Exposed";
  };

  const getScoreColor = () => {
    if (score >= 80) return "neon-green";
    if (score >= 60) return "neon-amber";
    return "neon-pink";
  };

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-40 hidden md:block"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <motion.div
        className={`glass-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
          score >= 80 ? "neon-glow-green" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        layout
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <motion.div
            className={`w-8 h-8 rounded-lg bg-${getScoreColor()}/10 flex items-center justify-center`}
            animate={{ 
              boxShadow: score >= 80 
                ? ["0 0 0px hsl(160 84% 39% / 0)", "0 0 20px hsl(160 84% 39% / 0.5)", "0 0 0px hsl(160 84% 39% / 0)"]
                : "none"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className={`w-4 h-4 text-${getScoreColor()}`} />
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">STEALTH SCORE</span>
              <motion.div
                className={`w-2 h-2 rounded-full bg-${getScoreColor()}`}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <motion.span
                className={`text-xl font-bold font-mono text-${getScoreColor()}`}
                key={score}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-muted-foreground">— {getScoreLabel()}</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border/50 px-4 py-3"
            >
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{metrics.timeOnPage}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interactions</span>
                  <span className="text-foreground">{metrics.interactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme</span>
                  <span className={metrics.isNightMode ? "text-neon-green" : "text-neon-amber"}>
                    {metrics.isNightMode ? "Night" : "Day"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Panic Ready</span>
                  <span className={metrics.panicKeyUsed ? "text-neon-green" : "text-muted-foreground"}>
                    {metrics.panicKeyUsed ? "Tested" : "Press ESC"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default StealthScore;

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Sparkles, Zap, Crown, Timer } from "lucide-react";
import quitewinLogo from "@/assets/quitewin-logo.png";

type CritType = "normal" | "sr" | "ssr" | "ur";

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  crit: CritType;
}

const CRIT_CONFIG = {
  normal: { multiplier: 1, chance: 70, color: "text-muted-foreground", label: "" },
  sr: { multiplier: 5, chance: 20, color: "text-neon-cyan", label: "SR CRIT!" },
  ssr: { multiplier: 100, chance: 8, color: "text-neon-pink", label: "SSR CRIT!" },
  ur: { multiplier: 1000, chance: 2, color: "text-neon-amber", label: "UR CRIT!" },
};

const SPIN_COST = 500;

const QuiteWinCoin = () => {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("quitewin-coins");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalPulls, setTotalPulls] = useState(() => {
    const saved = localStorage.getItem("quitewin-pulls");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<CritType | null>(null);
  const [lastSpinAmount, setLastSpinAmount] = useState(0);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("quitewin-coins", coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("quitewin-pulls", totalPulls.toString());
  }, [totalPulls]);

  // Global click listener - every click on page adds 1 coin
  useEffect(() => {
    const handleGlobalClick = () => {
      setCoins((prev) => prev + 1);
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  // Passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getCritType = useCallback((): CritType => {
    const roll = Math.random() * 100;
    if (roll < CRIT_CONFIG.ur.chance) return "ur";
    if (roll < CRIT_CONFIG.ur.chance + CRIT_CONFIG.ssr.chance) return "ssr";
    if (roll < CRIT_CONFIG.ur.chance + CRIT_CONFIG.ssr.chance + CRIT_CONFIG.sr.chance) return "sr";
    return "normal";
  }, []);

  const handleCoinClick = useCallback((e: React.MouseEvent) => {
    const crit = getCritType();
    const multiplier = CRIT_CONFIG[crit].multiplier;
    const earned = multiplier;

    setCoins((prev) => prev + earned);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newFloating: FloatingNumber = {
      id: Date.now() + Math.random(),
      value: earned,
      x,
      y,
      crit,
    };

    setFloatingNumbers((prev) => [...prev, newFloating]);

    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((n) => n.id !== newFloating.id));
    }, 1000);
  }, [getCritType]);

  const handleSpin = useCallback(() => {
    if (coins < SPIN_COST || isSpinning) return;

    setCoins((prev) => prev - SPIN_COST);
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate spinning
    setTimeout(() => {
      const result = getCritType();
      const earned = CRIT_CONFIG[result].multiplier * 10; // Base spin reward is 10
      setSpinResult(result);
      setLastSpinAmount(earned);
      setCoins((prev) => prev + earned);
      setTotalPulls((prev) => prev + 1);

      setTimeout(() => {
        setIsSpinning(false);
        setSpinResult(null);
      }, 2000);
    }, 1500);
  }, [coins, isSpinning, getCritType]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Coin Display */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-4 cursor-pointer select-none"
              onClick={handleCoinClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(var(--neon-amber) / 0.4) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon-amber/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <img
                src={quitewinLogo}
                alt="QuiteWin Coin"
                className="relative w-full h-full rounded-full object-contain bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-neon-amber/30 p-2"
              />

              {/* Floating numbers */}
              <AnimatePresence>
                {floatingNumbers.map((num) => (
                  <motion.div
                    key={num.id}
                    className={`absolute font-bold text-lg pointer-events-none ${CRIT_CONFIG[num.crit].color}`}
                    style={{ left: num.x, top: num.y }}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -50, scale: num.crit !== "normal" ? 1.5 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    +{num.value}
                    {CRIT_CONFIG[num.crit].label && (
                      <span className="ml-1 text-xs">{CRIT_CONFIG[num.crit].label}</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-neon-amber">QuiteWin</span> Coin
            </h2>
            <motion.p
              className="text-4xl font-mono font-bold text-foreground"
              key={coins}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {coins.toLocaleString()}
            </motion.p>
          </motion.div>

          {/* How It Works */}
          <motion.div
            className="glass-card rounded-2xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-center mb-4">How It Works</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
                <span>
                  <strong>Every Click:</strong> +1 Coin for any interaction on the page!
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neon-cyan" />
                <span>
                  <strong className="text-neon-cyan">SR Crit (20%):</strong> 5x Multiplier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neon-pink" />
                <span>
                  <strong className="text-neon-pink">SSR Crit (8%):</strong> 100x Multiplier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neon-amber" />
                <span>
                  <strong className="text-neon-amber">UR Crit (2%):</strong> 1000x Multiplier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span>
                  <strong>Passive Income:</strong> +1 Coin every 5 seconds.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Spin Section */}
          <motion.div
            className="glass-card rounded-2xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-2">Try Your Luck</h3>
            <p className="text-muted-foreground text-sm mb-1">
              Total pulls: <span className="text-foreground font-mono">{totalPulls}</span>
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Cost: <span className="text-neon-amber font-bold">{SPIN_COST}</span> QuiteWin Coins per spin
            </p>

            {/* Spin Result Display */}
            <AnimatePresence mode="wait">
              {isSpinning && !spinResult && (
                <motion.div
                  key="spinning"
                  className="h-20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="text-2xl font-bold"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-10 h-10 text-neon-purple" />
                  </motion.div>
                </motion.div>
              )}
              {spinResult && (
                <motion.div
                  key="result"
                  className="h-20 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <span className={`text-3xl font-bold ${CRIT_CONFIG[spinResult].color}`}>
                    {spinResult === "normal" ? "Normal" : CRIT_CONFIG[spinResult].label.replace("!", "")}
                  </span>
                  <span className="text-xl font-mono mt-1">+{lastSpinAmount.toLocaleString()}</span>
                </motion.div>
              )}
              {!isSpinning && !spinResult && (
                <motion.p
                  key="ready"
                  className="h-20 flex items-center justify-center text-lg text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Ready to Spin?
                </motion.p>
              )}
            </AnimatePresence>

            {/* Spin Button */}
            <motion.button
              onClick={handleSpin}
              disabled={coins < SPIN_COST || isSpinning}
              className={`
                relative px-8 py-4 rounded-xl font-bold text-lg
                flex items-center justify-center gap-3 mx-auto
                transition-all duration-300
                ${coins >= SPIN_COST && !isSpinning
                  ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-lg hover:shadow-neon-purple/30"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
              whileHover={coins >= SPIN_COST && !isSpinning ? { scale: 1.05 } : {}}
              whileTap={coins >= SPIN_COST && !isSpinning ? { scale: 0.95 } : {}}
            >
              {isSpinning ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
              ) : (
                <>
                  <span>SPIN</span>
                  <span className="text-sm opacity-80">(-{SPIN_COST}</span>
                  <img src={quitewinLogo} alt="" className="w-5 h-5 rounded-full" />
                  <span className="text-sm opacity-80">)</span>
                </>
              )}
            </motion.button>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground/60 mt-8 max-w-md mx-auto">
              QuiteWin Coin is a fun virtual currency with no real-world or economic value. 
              It's just for entertainment while exploring the page!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuiteWinCoin;

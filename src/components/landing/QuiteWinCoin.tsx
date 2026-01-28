import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Timer, TrendingDown } from "lucide-react";
import quitewinLogo from "@/assets/quitewin-logo.png";

type CritType = "normal" | "sr" | "ssr" | "ur";
type LossType = "none" | "quarter" | "half" | "all";

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  crit: CritType;
  isLoss?: boolean;
}

interface GlobalFloatingCoin {
  id: number;
  x: number;
  y: number;
}

// Beginner's luck: first 20 clicks have MASSIVELY boosted rates
const BEGINNER_CRIT_CONFIG = {
  normal: { multiplier: 1, chance: 15, color: "text-muted-foreground", label: "" },
  sr: { multiplier: 5, chance: 30, color: "text-neon-cyan", label: "5x CRIT!" },
  ssr: { multiplier: 100, chance: 35, color: "text-neon-pink", label: "100x MEGA!" },
  ur: { multiplier: 1000, chance: 20, color: "text-neon-amber", label: "1000x JACKPOT!" },
};

// Beginner SPIN rates - even more generous!
const BEGINNER_SPIN_CONFIG = {
  normal: { multiplier: 10, chance: 10, color: "text-muted-foreground", label: "10x" },
  sr: { multiplier: 50, chance: 35, color: "text-neon-cyan", label: "50x NICE!" },
  ssr: { multiplier: 500, chance: 35, color: "text-neon-pink", label: "500x AMAZING!" },
  ur: { multiplier: 5000, chance: 20, color: "text-neon-amber", label: "5000x LEGENDARY!" },
};

// Normal rates after beginner phase
const NORMAL_CRIT_CONFIG = {
  normal: { multiplier: 1, chance: 70, color: "text-muted-foreground", label: "" },
  sr: { multiplier: 5, chance: 20, color: "text-neon-cyan", label: "5x CRIT!" },
  ssr: { multiplier: 100, chance: 8, color: "text-neon-pink", label: "100x MEGA!" },
  ur: { multiplier: 1000, chance: 2, color: "text-neon-amber", label: "1000x JACKPOT!" },
};

// Loss chances (starts after 30 clicks) - More dramatic!
const LOSS_CONFIG = {
  none: { chance: 60, percent: 0, label: "", emoji: "" },
  quarter: { chance: 20, percent: 0.25, label: "TAX AUDIT!", emoji: "💸" },
  half: { chance: 12, percent: 0.5, label: "MARKET CRASH!", emoji: "📉" },
  all: { chance: 8, percent: 1, label: "WIPEOUT!", emoji: "💀" },
};

// Loss messages for drama
const LOSS_MESSAGES = [
  "The crypto gods are angry!",
  "Your wallet was hacked!",
  "Rug pull detected!",
  "The IRS has entered the chat...",
  "Diamond hands? More like paper hands!",
  "Should've HODLed differently...",
];

const SPIN_COST = 500;
const BEGINNER_CLICKS = 20;
const LOSS_START_CLICKS = 30;

const QuiteWinCoin = () => {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("quitewin-coins");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalPulls, setTotalPulls] = useState(() => {
    const saved = localStorage.getItem("quitewin-pulls");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalClicks, setTotalClicks] = useState(() => {
    const saved = localStorage.getItem("quitewin-clicks");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [globalFloatingCoins, setGlobalFloatingCoins] = useState<GlobalFloatingCoin[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<CritType | null>(null);
  const [lastSpinAmount, setLastSpinAmount] = useState(0);
  const [lossEvent, setLossEvent] = useState<{ type: LossType; amount: number; message: string } | null>(null);
  const [isBeginnerPhase, setIsBeginnerPhase] = useState(true);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("quitewin-coins", coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("quitewin-pulls", totalPulls.toString());
  }, [totalPulls]);

  useEffect(() => {
    localStorage.setItem("quitewin-clicks", totalClicks.toString());
    setIsBeginnerPhase(totalClicks < BEGINNER_CLICKS);
  }, [totalClicks]);

  // Global click listener - every click on page adds 1 coin with animation
  // Using CAPTURE phase to ensure we catch ALL clicks before any element can stop propagation
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore clicks on interactive elements that shouldn't trigger coins
      const target = e.target as HTMLElement;
      if (target.closest('[data-no-coin]')) return;
      
      setCoins((prev) => prev + 1);
      setTotalClicks((prev) => prev + 1);
      
      // Create floating +1 at click position
      const newFloating: GlobalFloatingCoin = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setGlobalFloatingCoins((prev) => [...prev, newFloating]);
      
      setTimeout(() => {
        setGlobalFloatingCoins((prev) => prev.filter((n) => n.id !== newFloating.id));
      }, 1000);
    };

    // Use CAPTURE phase to catch clicks before any stopPropagation
    document.addEventListener("click", handleGlobalClick, true);
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, []);

  // REMOVED: Random loss events on clicks - losses now ONLY happen during spins

  // Passive income
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getCritType = useCallback((): CritType => {
    const config = isBeginnerPhase ? BEGINNER_CRIT_CONFIG : NORMAL_CRIT_CONFIG;
    const roll = Math.random() * 100;
    if (roll < config.ur.chance) return "ur";
    if (roll < config.ur.chance + config.ssr.chance) return "ssr";
    if (roll < config.ur.chance + config.ssr.chance + config.sr.chance) return "sr";
    return "normal";
  }, [isBeginnerPhase]);

  const handleCoinClick = useCallback((e: React.MouseEvent) => {
    const crit = getCritType();
    const config = isBeginnerPhase ? BEGINNER_CRIT_CONFIG : NORMAL_CRIT_CONFIG;
    const multiplier = config[crit].multiplier;
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
  }, [getCritType, isBeginnerPhase]);

  const handleSpin = useCallback(() => {
    if (coins < SPIN_COST || isSpinning) return;

    setCoins((prev) => prev - SPIN_COST);
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate spinning - can also lose on spin!
    setTimeout(() => {
      // 30% chance to lose on spin after beginner phase (more dramatic!)
      const shouldLose = !isBeginnerPhase && Math.random() < 0.3;
      
      if (shouldLose) {
        const lossRoll = Math.random();
        let lossType: LossType = "quarter";
        if (lossRoll < 0.15) lossType = "all";
        else if (lossRoll < 0.4) lossType = "half";
        
        const lossAmount = Math.floor(coins * LOSS_CONFIG[lossType].percent);
        const message = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        setLossEvent({ type: lossType, amount: lossAmount, message });
        setCoins((prev) => Math.max(0, prev - lossAmount));
        setLastSpinAmount(-lossAmount);
        setSpinResult("normal");
      } else {
        const result = getCritType();
        // Use special spin config for beginners!
        const config = isBeginnerPhase ? BEGINNER_SPIN_CONFIG : NORMAL_CRIT_CONFIG;
        const earned = isBeginnerPhase ? config[result].multiplier : config[result].multiplier * 10;
        setSpinResult(result);
        setLastSpinAmount(earned);
        setCoins((prev) => prev + earned);
      }
      
      setTotalPulls((prev) => prev + 1);

      setTimeout(() => {
        setIsSpinning(false);
        setSpinResult(null);
        setLossEvent(null);
      }, 2000);
    }, 1500);
  }, [coins, isSpinning, getCritType, isBeginnerPhase]);

  const currentConfig = isBeginnerPhase ? BEGINNER_CRIT_CONFIG : NORMAL_CRIT_CONFIG;

  return (
    <>
      {/* Global Floating +1 Coins - Rendered via Portal to bypass overflow:hidden */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {globalFloatingCoins.map((coin) => (
            <motion.div
              key={coin.id}
              className="fixed pointer-events-none font-bold text-lg text-neon-amber drop-shadow-[0_0_8px_hsl(var(--neon-amber))]"
              style={{ left: coin.x, top: coin.y, zIndex: 99999 }}
              initial={{ opacity: 1, y: 0, scale: 1, x: -10 }}
              animate={{ opacity: 0, y: -60, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              +1 🪙
            </motion.div>
          ))}
        </AnimatePresence>,
        document.body
      )}
      
      <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Loss Event Overlay - More Dramatic! */}
          <AnimatePresence>
            {lossEvent && (
              <motion.div
                className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Screen shake effect */}
                <motion.div
                  className="absolute inset-0 bg-destructive/10"
                  animate={{ 
                    x: [0, -10, 10, -10, 10, 0],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="bg-destructive/30 backdrop-blur-md rounded-2xl p-8 border-2 border-destructive/70 text-center shadow-2xl shadow-destructive/30"
                  initial={{ scale: 0.3, rotate: -20, y: 100 }}
                  animate={{ 
                    scale: [0.3, 1.2, 1], 
                    rotate: [-20, 10, 0],
                    y: [100, -20, 0]
                  }}
                  exit={{ scale: 0, rotate: 20, opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.3, repeat: 2 }}
                  >
                    <span className="text-6xl">{LOSS_CONFIG[lossEvent.type].emoji}</span>
                  </motion.div>
                  <motion.p 
                    className="text-4xl font-bold text-destructive mt-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {LOSS_CONFIG[lossEvent.type].label}
                  </motion.p>
                  <p className="text-lg text-muted-foreground mt-2 italic">
                    {lossEvent.message}
                  </p>
                  <motion.p 
                    className="text-3xl font-mono text-destructive mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    -{lossEvent.amount.toLocaleString()} 💸
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Beginner Phase Indicator */}
            {isBeginnerPhase && (
              <motion.div
                className="mb-4 px-4 py-2 rounded-full bg-neon-green/20 border border-neon-green/50 inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-neon-green text-sm font-bold">
                  🔥 BEGINNER'S LUCK! {BEGINNER_CLICKS - totalClicks} clicks left
                </span>
              </motion.div>
            )}
            
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
                className="relative w-full h-full rounded-full object-contain bg-gradient-to-br from-neon-amber/20 to-neon-amber/10 border border-neon-amber/30 p-2"
              />

              {/* Floating numbers */}
              <AnimatePresence>
                {floatingNumbers.map((num) => (
                  <motion.div
                    key={num.id}
                    className={`absolute font-bold text-lg pointer-events-none ${currentConfig[num.crit].color}`}
                    style={{ left: num.x, top: num.y }}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -50, scale: num.crit !== "normal" ? 1.5 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    +{num.value}
                    {currentConfig[num.crit].label && (
                      <span className="ml-1 text-xs">{currentConfig[num.crit].label}</span>
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
                  <strong className="text-neon-cyan">SR Crit ({isBeginnerPhase ? "35" : "20"}%):</strong> 5x Multiplier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neon-pink" />
                <span>
                  <strong className="text-neon-pink">SSR Crit ({isBeginnerPhase ? "20" : "8"}%):</strong> 100x Multiplier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neon-amber" />
                <span>
                  <strong className="text-neon-amber">UR Crit ({isBeginnerPhase ? "5" : "2"}%):</strong> 1000x Multiplier
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span>
                  <strong>Passive Income:</strong> +1 Coin every 5 seconds.
                </span>
              </div>
              {!isBeginnerPhase && (
                <div className="flex items-center gap-3 text-red-400">
                  <TrendingDown className="w-4 h-4" />
                  <span>
                    <strong>⚠️ Risk:</strong> Random crashes can take 25%, 50%, or ALL coins!
                  </span>
                </div>
              )}
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
                  {lastSpinAmount >= 0 ? (
                    <>
                      <span className={`text-3xl font-bold ${currentConfig[spinResult].color}`}>
                        {spinResult === "normal" ? "Normal" : currentConfig[spinResult].label.replace("!", "")}
                      </span>
                      <span className="text-xl font-mono mt-1">+{lastSpinAmount.toLocaleString()}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-red-500">
                        {lossEvent ? LOSS_CONFIG[lossEvent.type].label : "LOSS!"}
                      </span>
                      <span className="text-xl font-mono mt-1 text-red-400">{lastSpinAmount.toLocaleString()}</span>
                    </>
                  )}
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
    </>
  );
};

export default QuiteWinCoin;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA"
];

const EasterEggs = () => {
  const [ghostMode, setGhostMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [showDevMessage, setShowDevMessage] = useState(false);
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [typedKeys, setTypedKeys] = useState("");

  // Ghost mode - typing "ghost"
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const newTyped = (typedKeys + e.key).slice(-5).toLowerCase();
      setTypedKeys(newTyped);
      
      if (newTyped === "ghost") {
        setGhostMode(true);
        setTimeout(() => setGhostMode(false), 10000);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [typedKeys]);

  // Debug mode - holding Shift
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setDebugMode(true);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setDebugMode(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KONAMI_CODE[konamiProgress]) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);
        
        if (newProgress === KONAMI_CODE.length) {
          setShowDevMessage(true);
          setKonamiProgress(0);
          setTimeout(() => setShowDevMessage(false), 5000);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiProgress]);

  return (
    <>
      {/* Ghost Mode - Enhanced glow effect */}
      <AnimatePresence>
        {ghostMode && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Purple glow overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, hsl(263 70% 66% / 0.15), transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Edge glow */}
            <div 
              className="absolute inset-0"
              style={{
                boxShadow: "inset 0 0 100px 50px hsl(263 70% 66% / 0.1)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Mode - System labels */}
      <AnimatePresence>
        {debugMode && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[140]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Debug overlay */}
            <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-2">
              {[
                "renderer: React 18.3",
                "animation: Framer Motion",
                "theme: Neon Stealth",
                "mode: Production",
                "build: v2.0.0-beta",
              ].map((label, i) => (
                <motion.span
                  key={label}
                  className="px-2 py-1 text-[10px] font-mono bg-background/80 border border-neon-green/30 text-neon-green rounded"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {label}
                </motion.span>
              ))}
            </div>
            
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(160 84% 39% / 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(160 84% 39% / 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami Code - Dev message */}
      <AnimatePresence>
        {showDevMessage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[160] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-8 rounded-2xl text-center neon-glow-purple max-w-md"
              initial={{ scale: 0.8, rotateX: -20 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-4xl mb-4">👻</div>
              <h3 className="text-xl font-bold text-neon-purple mb-2">You found me!</h3>
              <p className="text-muted-foreground text-sm">
                Built with love by a solo dev who believes privacy is a right, not a feature.
              </p>
              <p className="text-xs font-mono text-muted-foreground/60 mt-4">
                Stay invisible. Stay free.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEggs;

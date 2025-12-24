import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, createContext, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ObserverModeContextType {
  isObserverMode: boolean;
  toggleObserverMode: () => void;
}

export const ObserverModeContext = createContext<ObserverModeContextType>({
  isObserverMode: false,
  toggleObserverMode: () => {},
});

export const useObserverMode = () => useContext(ObserverModeContext);

export const ObserverModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isObserverMode, setIsObserverMode] = useState(false);
  const [cursorTrail, setCursorTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  const toggleObserverMode = () => setIsObserverMode((prev) => !prev);

  // Cursor trail effect
  useEffect(() => {
    if (!isObserverMode) {
      setCursorTrail([]);
      return;
    }

    let trailId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setCursorTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailId++ }];
        return newTrail.slice(-12);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isObserverMode]);

  // Clean up old trail points
  useEffect(() => {
    if (!isObserverMode || cursorTrail.length === 0) return;

    const interval = setInterval(() => {
      setCursorTrail((prev) => prev.slice(1));
    }, 80);

    return () => clearInterval(interval);
  }, [isObserverMode, cursorTrail.length]);

  return (
    <ObserverModeContext.Provider value={{ isObserverMode, toggleObserverMode }}>
      <div className={isObserverMode ? "observer-mode" : ""}>
        {children}
      </div>

      {/* Cursor trails */}
      <AnimatePresence>
        {isObserverMode &&
          cursorTrail.map((point, index) => (
            <motion.div
              key={point.id}
              className="fixed pointer-events-none z-[95]"
              initial={{ opacity: 0.6, scale: 0.8 }}
              animate={{ opacity: 0, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                left: point.x,
                top: point.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: `hsl(263 70% 66% / ${0.3 + index * 0.02})`,
                  boxShadow: "0 0 8px hsl(263 70% 66% / 0.4)",
                }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Observer mode indicator labels */}
      <AnimatePresence>
        {isObserverMode && (
          <motion.div
            className="fixed top-20 right-6 z-50 space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {["Input intercepted", "Overlay protected", "Capture denied"].map((text, i) => (
              <motion.div
                key={text}
                className="px-3 py-1.5 rounded-lg glass-card text-xs font-mono text-neon-purple border border-neon-purple/30"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {text}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </ObserverModeContext.Provider>
  );
};

// Observer Mode Toggle Button
export const ObserverModeToggle = () => {
  const { isObserverMode, toggleObserverMode } = useObserverMode();

  return (
    <motion.button
      className="fixed top-6 left-[calc(50%+8rem)] z-50 flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-xs font-mono transition-colors whitespace-nowrap"
      onClick={toggleObserverMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.9 }}
    >
      <AnimatePresence mode="wait">
        {isObserverMode ? (
          <motion.div
            key="observer"
            className="flex items-center gap-2 text-neon-purple"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Eye className="w-4 h-4" />
            <span>OBSERVING</span>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EyeOff className="w-4 h-4" />
            <span>Observer</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ObserverModeProvider;

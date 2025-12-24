import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext } from "react";
import { Code, Sparkles } from "lucide-react";

interface TrustModeContextType {
  isTrustMode: boolean;
  toggleTrustMode: () => void;
}

export const TrustModeContext = createContext<TrustModeContextType>({
  isTrustMode: false,
  toggleTrustMode: () => {},
});

export const useTrustMode = () => useContext(TrustModeContext);

export const TrustModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTrustMode, setIsTrustMode] = useState(false);

  const toggleTrustMode = () => setIsTrustMode(prev => !prev);

  return (
    <TrustModeContext.Provider value={{ isTrustMode, toggleTrustMode }}>
      <div className={isTrustMode ? "trust-mode" : ""}>
        {children}
      </div>
    </TrustModeContext.Provider>
  );
};

// Trust Mode Toggle Button
export const TrustModeToggle = () => {
  const { isTrustMode, toggleTrustMode } = useTrustMode();

  return (
    <motion.button
      className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-xs font-mono transition-colors"
      onClick={toggleTrustMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
    >
      <AnimatePresence mode="wait">
        {isTrustMode ? (
          <motion.div
            key="trust"
            className="flex items-center gap-2 text-neon-green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Code className="w-4 h-4" />
            <span>TRUST MODE</span>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Trust Mode</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Component to show different content based on trust mode
export const TrustModeContent = ({
  marketing,
  technical,
}: {
  marketing: React.ReactNode;
  technical: React.ReactNode;
}) => {
  const { isTrustMode } = useTrustMode();

  return (
    <AnimatePresence mode="wait">
      {isTrustMode ? (
        <motion.div
          key="technical"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {technical}
        </motion.div>
      ) : (
        <motion.div
          key="marketing"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {marketing}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrustModeProvider;

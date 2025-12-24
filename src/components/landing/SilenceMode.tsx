import { motion, AnimatePresence } from "framer-motion";
import { useState, createContext, useContext } from "react";
import { VolumeX, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SilenceModeContextType {
  isSilenceMode: boolean;
  toggleSilenceMode: () => void;
}

export const SilenceModeContext = createContext<SilenceModeContextType>({
  isSilenceMode: false,
  toggleSilenceMode: () => {},
});

export const useSilenceMode = () => useContext(SilenceModeContext);

export const SilenceModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSilenceMode, setIsSilenceMode] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const toggleSilenceMode = () => {
    const newState = !isSilenceMode;
    setIsSilenceMode(newState);
    
    if (newState) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <SilenceModeContext.Provider value={{ isSilenceMode, toggleSilenceMode }}>
      <div className={isSilenceMode ? "silence-mode" : ""}>
        {children}
      </div>

      {/* Silence mode message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[180] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <p className="text-2xl font-mono text-muted-foreground">
                No explanation needed.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SilenceModeContext.Provider>
  );
};

// Silence Mode Toggle Button
export const SilenceModeToggle = ({ className }: { className?: string }) => {
  const { isSilenceMode, toggleSilenceMode } = useSilenceMode();

  return (
    <motion.button
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-xs font-mono transition-colors",
        className
      )}
      onClick={toggleSilenceMode}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.7 }}
    >
      <AnimatePresence mode="wait">
        {isSilenceMode ? (
          <motion.div
            key="silence"
            className="flex items-center gap-2 text-neon-pink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VolumeX className="w-4 h-4" />
            <span>SILENCE</span>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Volume2 className="w-4 h-4" />
            <span>Silence</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Wrapper for content that should be hidden in silence mode
export const SilenceableText = ({ children }: { children: React.ReactNode }) => {
  const { isSilenceMode } = useSilenceMode();

  return (
    <motion.span
      animate={{
        opacity: isSilenceMode ? 0 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
};

export default SilenceModeProvider;

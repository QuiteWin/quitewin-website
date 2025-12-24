import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, createContext, useContext } from "react";
import { AlertTriangle, Play } from "lucide-react";

interface PanicContextType {
  isPanicMode: boolean;
  triggerPanic: () => void;
  resumeNormal: () => void;
}

export const PanicContext = createContext<PanicContextType>({
  isPanicMode: false,
  triggerPanic: () => {},
  resumeNormal: () => {},
});

export const usePanicMode = () => useContext(PanicContext);

export const PanicProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const triggerPanic = () => {
    setIsPanicMode(true);
    setShowOverlay(true);
    
    // Dispatch event for stealth score
    window.dispatchEvent(new CustomEvent("panicKeyUsed"));
    
    // Auto-hide overlay after brief display
    setTimeout(() => setShowOverlay(false), 1500);
  };

  const resumeNormal = () => {
    setIsPanicMode(false);
    setShowOverlay(false);
  };

  // Listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPanicMode) {
        triggerPanic();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanicMode]);

  return (
    <PanicContext.Provider value={{ isPanicMode, triggerPanic, resumeNormal }}>
      {/* Panic Mode Overlay */}
      <AnimatePresence>
        {isPanicMode && (
          <motion.div
            className="fixed inset-0 z-[200] bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Neutral content */}
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
              {/* Panic message - brief */}
              <AnimatePresence>
                {showOverlay && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-background/95"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="flex items-center gap-3 text-destructive"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <AlertTriangle className="w-6 h-6" />
                      <span className="font-mono text-lg">Panic mode engaged.</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Neutral placeholder content */}
              <div className="max-w-2xl w-full space-y-8 text-center">
                <div className="space-y-4">
                  <div className="h-4 bg-muted/30 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted/30 rounded w-1/2 mx-auto" />
                  <div className="h-4 bg-muted/30 rounded w-2/3 mx-auto" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-muted/20 rounded-lg" />
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-muted/20 rounded w-full" />
                  <div className="h-3 bg-muted/20 rounded w-5/6 mx-auto" />
                </div>
              </div>

              {/* Resume button */}
              <motion.button
                className="fixed bottom-8 right-8 flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={resumeNormal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                Resume
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal content */}
      <motion.div
        animate={{
          opacity: isPanicMode ? 0 : 1,
          pointerEvents: isPanicMode ? "none" : "auto",
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>
    </PanicContext.Provider>
  );
};

export default PanicProvider;

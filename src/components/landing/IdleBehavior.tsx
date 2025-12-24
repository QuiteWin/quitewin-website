import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, createContext, useContext } from "react";

interface IdleContextType {
  isIdle: boolean;
}

export const IdleContext = createContext<IdleContextType>({ isIdle: false });
export const useIdleState = () => useContext(IdleContext);

const IDLE_TIMEOUT = 20000; // 20 seconds

export const IdleProvider = ({ children }: { children: React.ReactNode }) => {
  const [isIdle, setIsIdle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      setIsIdle(false);
      setShowMessage(false);
      clearTimeout(idleTimer);
      
      idleTimer = setTimeout(() => {
        setIsIdle(true);
        setShowMessage(true);
      }, IDLE_TIMEOUT);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initial timer
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <IdleContext.Provider value={{ isIdle }}>
      <motion.div
        animate={{
          opacity: isIdle ? 0.7 : 1,
          filter: isIdle ? "brightness(0.9)" : "brightness(1)",
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>

      {/* Idle message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 py-3 rounded-full glass-card">
              <span className="text-sm font-mono text-muted-foreground">
                Standing by.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </IdleContext.Provider>
  );
};

export default IdleProvider;

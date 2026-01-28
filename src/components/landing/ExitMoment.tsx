import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ExitMoment = () => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsExiting(true);
      } else if (document.visibilityState === "visible") {
        // Immediately reset when returning to the page
        setIsExiting(false);
      }
    };

    const handleBeforeUnload = () => {
      setIsExiting(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <AnimatePresence>
      {isExiting && (
        <motion.div
          className="fixed inset-0 z-[300] bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.p
            className="text-lg font-mono text-muted-foreground text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Session ended. No trace left behind.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitMoment;

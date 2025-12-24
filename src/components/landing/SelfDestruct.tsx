import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const SelfDestruct = () => {
  const [stage, setStage] = useState<"idle" | "countdown" | "destroying" | "destroyed">("idle");
  const [count, setCount] = useState(3);

  const startSelfDestruct = () => {
    setStage("countdown");
    setCount(3);

    const countdown = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(countdown);
          setStage("destroying");
          
          setTimeout(() => {
            setStage("destroyed");
          }, 1500);
          
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const reset = () => {
    setStage("idle");
    setCount(3);
  };

  return (
    <>
      {/* Trigger button - discreet */}
      {stage === "idle" && (
        <motion.button
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-xs font-mono text-muted-foreground/50 hover:text-destructive/70 transition-colors"
          onClick={startSelfDestruct}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <Trash2 className="w-3 h-3" />
          <span>Self-Destruct</span>
        </motion.button>
      )}

      {/* Countdown overlay */}
      <AnimatePresence>
        {stage === "countdown" && (
          <motion.div
            className="fixed inset-0 z-[400] bg-background/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={count}
              className="text-8xl font-mono font-bold text-destructive"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {count}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destroying animation */}
      <AnimatePresence>
        {stage === "destroying" && (
          <motion.div
            className="fixed inset-0 z-[400] bg-background overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            {/* Fragmenting elements */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-muted/30 rounded"
                style={{
                  width: `${Math.random() * 150 + 50}px`,
                  height: `${Math.random() * 100 + 30}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 1, y: 0, rotate: 0 }}
                animate={{
                  opacity: 0,
                  y: 500 + Math.random() * 300,
                  x: (Math.random() - 0.5) * 200,
                  rotate: Math.random() * 90 - 45,
                }}
                transition={{ duration: 1.2 + Math.random() * 0.5, ease: "easeIn" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destroyed state */}
      <AnimatePresence>
        {stage === "destroyed" && (
          <motion.div
            className="fixed inset-0 z-[400] bg-background flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.p
              className="text-xl font-mono text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Data wiped. Session destroyed.
            </motion.p>
            
            <motion.button
              className="px-6 py-3 rounded-lg glass-card text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
              onClick={reset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              Reload
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SelfDestruct;

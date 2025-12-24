import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

const ScreenShareScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Run scan periodically
    const runScan = () => {
      setIsScanning(true);
      
      // Scan duration
      setTimeout(() => {
        setIsScanning(false);
        setShowResult(true);
        
        // Hide result after delay
        setTimeout(() => setShowResult(false), 3000);
      }, 2000);
    };

    // Initial scan after page load
    const initialTimeout = setTimeout(runScan, 5000);
    
    // Periodic scans
    const interval = setInterval(runScan, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Scan Line */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-full pointer-events-none z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Horizontal scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(160 84% 39% / 0.8), transparent)",
                boxShadow: "0 0 30px 10px hsl(160 84% 39% / 0.3)",
              }}
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 2, ease: "linear" }}
            />
            
            {/* Scan field overlay */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.05, 0] }}
              transition={{ duration: 2 }}
              style={{
                background: "linear-gradient(to bottom, hsl(160 84% 39% / 0.1), transparent)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] pointer-events-none"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="glass-card px-6 py-3 rounded-full flex items-center gap-3 neon-glow-green">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
              <span className="text-sm font-mono text-neon-green">
                Screen share scan complete — no overlays detected
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page flicker effect during scan */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[99]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.02, 0, 0.01, 0] }}
            transition={{ duration: 0.5, repeat: 4 }}
            style={{ background: "hsl(var(--foreground))" }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ScreenShareScanner;

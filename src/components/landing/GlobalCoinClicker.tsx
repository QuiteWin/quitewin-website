import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalFloatingCoin {
  id: number;
  x: number;
  y: number;
}

// Shared state keys for localStorage
const COINS_KEY = "quitewin-coins";
const CLICKS_KEY = "quitewin-clicks";

// Custom event for coin updates
export const COIN_UPDATE_EVENT = "quitewin-coin-update";

export const dispatchCoinUpdate = () => {
  window.dispatchEvent(new CustomEvent(COIN_UPDATE_EVENT));
};

const GlobalCoinClicker = () => {
  const [globalFloatingCoins, setGlobalFloatingCoins] = useState<GlobalFloatingCoin[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global click listener - every click on page adds 1 coin with animation
  // Using CAPTURE phase to ensure we catch ALL clicks before any element can stop propagation
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore clicks on elements that shouldn't trigger coins
      const target = e.target as HTMLElement;
      if (target.closest('[data-no-coin]')) return;
      
      // Update coins in localStorage
      const currentCoins = parseInt(localStorage.getItem(COINS_KEY) || "0", 10);
      const currentClicks = parseInt(localStorage.getItem(CLICKS_KEY) || "0", 10);
      localStorage.setItem(COINS_KEY, (currentCoins + 1).toString());
      localStorage.setItem(CLICKS_KEY, (currentClicks + 1).toString());
      
      // Dispatch event for QuiteWinCoin to sync
      dispatchCoinUpdate();
      
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

  if (!mounted) return null;

  // Render floating coins via portal directly to body
  return createPortal(
    <AnimatePresence>
      {globalFloatingCoins.map((coin) => (
        <motion.div
          key={coin.id}
          className="fixed pointer-events-none font-bold text-xl text-neon-amber"
          style={{ 
            left: coin.x, 
            top: coin.y, 
            zIndex: 999999,
            textShadow: "0 0 10px hsl(var(--neon-amber)), 0 0 20px hsl(var(--neon-amber) / 0.5)"
          }}
          initial={{ opacity: 1, y: 0, scale: 1, x: -15 }}
          animate={{ opacity: 0, y: -80, scale: 1.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          +1 🪙
        </motion.div>
      ))}
    </AnimatePresence>,
    document.body
  );
};

export default GlobalCoinClicker;
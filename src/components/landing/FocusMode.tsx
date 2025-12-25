import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

// Focus mode overlay that dims background when user is focused
export const FocusModeOverlay = memo(() => {
  const { isFocusMode, prefersReducedMotion, scrollDepth } = useAmbientIntelligence();
  const [shouldShow, setShouldShow] = useState(false);
  
  useEffect(() => {
    // Only show after user has scrolled a bit
    if (isFocusMode && scrollDepth > 0.15) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [isFocusMode, scrollDepth]);
  
  if (prefersReducedMotion) return null;
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Subtle vignette effect */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.3) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

FocusModeOverlay.displayName = 'FocusModeOverlay';

// Focus indicator (subtle pulse in corner)
export const FocusIndicator = memo(() => {
  const { isFocusMode, prefersReducedMotion } = useAmbientIntelligence();
  
  if (prefersReducedMotion) return null;
  
  return (
    <AnimatePresence>
      {isFocusMode && (
        <motion.div
          className="fixed bottom-4 left-4 flex items-center gap-2 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-neon-green/60"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider">
            Focus
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

FocusIndicator.displayName = 'FocusIndicator';

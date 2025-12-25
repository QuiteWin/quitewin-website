import { memo } from 'react';
import { motion } from 'framer-motion';

interface GhostOverlayProps {
  onComplete?: () => void;
}

export const GhostOverlay = memo(({ onComplete }: GhostOverlayProps) => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 2500);
      }}
    >
      {/* Glitch background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, hsl(var(--neon-purple) / 0.15) 0%, transparent 50%, hsl(var(--neon-green) / 0.15) 100%)',
        }}
        animate={{
          opacity: [0, 0.6, 0.2, 0.8, 0.4, 0],
          x: [0, 5, -3, 2, -1, 0],
        }}
        transition={{ duration: 0.8, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
      />
      
      {/* Scanlines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--neon-purple) / 0.03) 2px, hsl(var(--neon-purple) / 0.03) 4px)',
        }}
        animate={{ 
          y: [0, 10, 0],
          opacity: [0, 0.5, 0] 
        }}
        transition={{ duration: 1 }}
      />
      
      {/* Ghost message */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <motion.div
            className="font-mono text-5xl md:text-6xl text-neon-purple/90 mb-3"
            animate={{ 
              textShadow: [
                '0 0 10px hsl(var(--neon-purple))',
                '0 0 30px hsl(var(--neon-purple))',
                '0 0 10px hsl(var(--neon-purple))',
              ],
              x: [0, -2, 2, -1, 0],
            }}
            transition={{ duration: 0.5, repeat: 4 }}
          >
            👻 GHOST MODE
          </motion.div>
          <motion.p 
            className="font-mono text-sm text-muted-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You found the hidden layer.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
});

GhostOverlay.displayName = 'GhostOverlay';

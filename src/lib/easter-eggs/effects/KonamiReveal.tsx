import { memo } from 'react';
import { motion } from 'framer-motion';

interface KonamiRevealProps {
  onComplete?: () => void;
}

export const KonamiReveal = memo(({ onComplete }: KonamiRevealProps) => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 3000);
      }}
    >
      {/* Retro scanline effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, hsl(var(--neon-green) / 0.05) 2px, hsl(var(--neon-green) / 0.05) 4px)',
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3 }}
      />
      
      {/* CRT flicker */}
      <motion.div
        className="absolute inset-0 bg-neon-green/5"
        animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
        transition={{ duration: 0.3, repeat: 10 }}
      />
      
      {/* Message */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            className="font-mono text-3xl md:text-4xl text-neon-green mb-4"
            animate={{
              textShadow: [
                '0 0 5px hsl(var(--neon-green)), 0 0 10px hsl(var(--neon-green))',
                '0 0 20px hsl(var(--neon-green)), 0 0 40px hsl(var(--neon-green))',
                '0 0 5px hsl(var(--neon-green)), 0 0 10px hsl(var(--neon-green))',
              ],
            }}
            transition={{ duration: 1, repeat: 2 }}
          >
            ↑↑↓↓←→←→BA
          </motion.div>
          <motion.div
            className="font-mono text-xl text-neon-amber"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            +30 LIVES
          </motion.div>
          <motion.p
            className="font-mono text-xs text-muted-foreground/50 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Classic never dies.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
});

KonamiReveal.displayName = 'KonamiReveal';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface ConicBurstProps {
  x?: number;
  y?: number;
  onComplete?: () => void;
}

export const ConicBurst = memo(({ x, y, onComplete }: ConicBurstProps) => {
  const centerX = x ?? window.innerWidth / 2;
  const centerY = y ?? window.innerHeight / 2;
  
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 1500);
      }}
    >
      {/* Central burst */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          left: centerX - 128,
          top: centerY - 128,
          background: 'conic-gradient(from 0deg, hsl(var(--neon-purple)), hsl(var(--neon-green)), hsl(var(--neon-pink)), hsl(var(--neon-amber)), hsl(var(--neon-purple)))',
          filter: 'blur(30px)',
        }}
        animate={{
          rotate: [0, 360],
          scale: [0, 2.5, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Inner glow */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          left: centerX - 64,
          top: centerY - 64,
          background: 'radial-gradient(circle, hsl(var(--neon-green) / 0.8) 0%, transparent 70%)',
        }}
        animate={{
          scale: [0, 3, 0],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      
      {/* Particle ring */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-neon-purple"
          style={{
            left: centerX,
            top: centerY,
          }}
          animate={{
            x: [0, Math.cos((i / 8) * Math.PI * 2) * 150],
            y: [0, Math.sin((i / 8) * Math.PI * 2) * 150],
            scale: [1, 0],
            opacity: [1, 0],
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      ))}
    </motion.div>
  );
});

ConicBurst.displayName = 'ConicBurst';

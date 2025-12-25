import { memo, useRef, useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

interface CursorAwareProps {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}

// Wrapper that makes elements subtly lean toward cursor
export const CursorAware = memo(({ 
  children, 
  radius = 200, 
  strength = 0.02,
  className = '' 
}: CursorAwareProps) => {
  const { mouseX, mouseY, prefersReducedMotion, animationIntensity } = useAmbientIntelligence();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const springConfig = { stiffness: 150, damping: 25 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  useEffect(() => {
    if (prefersReducedMotion || !ref.current) {
      x.set(0);
      y.set(0);
      return;
    }
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < radius) {
      const factor = (1 - dist / radius) * strength * animationIntensity;
      x.set(dx * factor);
      y.set(dy * factor);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [mouseX, mouseY, radius, strength, prefersReducedMotion, animationIntensity, x, y]);
  
  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
});

CursorAware.displayName = 'CursorAware';

// Global cursor awareness indicator (subtle glow that follows cursor)
export const CursorGlow = memo(() => {
  const { mouseX, mouseY, prefersReducedMotion, isIdle, isFocusMode, animationIntensity } = useAmbientIntelligence();
  
  const springConfig = { stiffness: 100, damping: 30 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY);
  }, [mouseX, mouseY, x, y]);
  
  if (prefersReducedMotion) return null;
  
  const opacity = isIdle ? 0.05 : isFocusMode ? 0.1 : 0.15;
  const scale = isIdle ? 0.8 : 1;
  
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        className="w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-purple) / 0.08) 0%, transparent 70%)',
        }}
        animate={{
          opacity: opacity * animationIntensity,
          scale,
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
});

CursorGlow.displayName = 'CursorGlow';

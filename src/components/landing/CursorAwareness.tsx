import { memo, useRef, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';
import { useInView } from '@/hooks/usePerformance';

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
  const { mouseX, mouseY, prefersReducedMotion, animationIntensity, performanceTier } = useAmbientIntelligence();
  const ref = useRef<HTMLDivElement>(null);
  const [containerRef, isInView] = useInView({ rootMargin: '50px' });
  
  const springConfig = { stiffness: 100, damping: 20 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  const shouldAnimate = isInView && !prefersReducedMotion && performanceTier !== 'low';
  
  useEffect(() => {
    if (!shouldAnimate || !ref.current) {
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
  }, [mouseX, mouseY, radius, strength, animationIntensity, x, y, shouldAnimate]);
  
  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>}>
      <motion.div 
        ref={ref} 
        style={{ 
          x, 
          y,
          willChange: shouldAnimate ? 'transform' : 'auto',
        }} 
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
});

CursorAware.displayName = 'CursorAware';

// Global cursor awareness indicator - SIMPLIFIED
export const CursorGlow = memo(() => {
  const { mouseX, mouseY, prefersReducedMotion, isIdle, isFocusMode, animationIntensity, performanceTier } = useAmbientIntelligence();
  
  const springConfig = { stiffness: 80, damping: 25 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY);
  }, [mouseX, mouseY, x, y]);
  
  // Skip on reduced motion or low-end devices
  if (prefersReducedMotion || performanceTier === 'low') return null;
  
  const opacity = isIdle ? 0.03 : isFocusMode ? 0.06 : 0.1;
  
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        willChange: 'transform',
      }}
    >
      <div
        className="w-[250px] h-[250px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-purple) / 0.06) 0%, transparent 70%)',
          opacity: opacity * animationIntensity,
          transition: 'opacity 0.3s ease-out',
        }}
      />
    </motion.div>
  );
});

CursorGlow.displayName = 'CursorGlow';

import { memo, useRef, useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';
import { useInView } from '@/hooks/usePerformance';

interface ParallaxLayerProps {
  depth: 'background' | 'content' | 'foreground';
  children?: React.ReactNode;
  className?: string;
}

const depthMultipliers = {
  background: 0.02,
  content: 0.05,
  foreground: 0.1,
};

const scrollMultipliers = {
  background: 0.03,
  content: 0,
  foreground: -0.02,
};

export const ParallaxLayer = memo(({ depth, children, className = '' }: ParallaxLayerProps) => {
  const { mouseX, mouseY, scrollY, prefersReducedMotion, animationIntensity, performanceTier } = useAmbientIntelligence();
  const [ref, isInView] = useInView({ rootMargin: '200px' });
  
  // Lighter spring config
  const springConfig = { stiffness: 30, damping: 25 };
  
  const mouseMultiplier = depthMultipliers[depth];
  const scrollMultiplier = scrollMultipliers[depth];
  
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  
  // Only calculate when in view and not reduced motion
  const shouldAnimate = isInView && !prefersReducedMotion && performanceTier !== 'low';
  
  const targetX = shouldAnimate ? (mouseX - centerX) * mouseMultiplier * animationIntensity : 0;
  const targetY = shouldAnimate ? (mouseY - centerY) * mouseMultiplier * animationIntensity + scrollY * scrollMultiplier : 0;
  
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  useEffect(() => {
    if (shouldAnimate) {
      x.set(targetX);
      y.set(targetY);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [targetX, targetY, x, y, shouldAnimate]);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`pointer-events-none ${className}`}
      style={{ 
        x, 
        y,
        willChange: shouldAnimate ? 'transform' : 'auto',
      }}
    >
      {children}
    </motion.div>
  );
});

ParallaxLayer.displayName = 'ParallaxLayer';

// Floating glow accents - SIMPLIFIED for performance
export const FloatingAccents = memo(() => {
  const { prefersReducedMotion, isFocusMode, performanceTier } = useAmbientIntelligence();
  const [ref, isInView] = useInView({ rootMargin: '100px' });
  
  // Don't render on low-end devices or reduced motion
  if (prefersReducedMotion || performanceTier === 'low') return null;
  
  const opacity = isFocusMode ? 0.2 : 0.4;
  const shouldAnimate = isInView;
  
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Top-left accent - CSS animation instead of framer-motion for better perf */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-purple) / 0.1) 0%, transparent 70%)',
          opacity: shouldAnimate ? opacity * 0.5 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
      />
      
      {/* Bottom-right accent */}
      <div
        className="absolute bottom-[30%] -right-10 w-56 h-56 rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-green) / 0.08) 0%, transparent 70%)',
          opacity: shouldAnimate ? opacity * 0.4 : 0,
          transition: 'opacity 0.5s ease-out',
          animationDelay: '2s',
        }}
      />
    </div>
  );
});

FloatingAccents.displayName = 'FloatingAccents';

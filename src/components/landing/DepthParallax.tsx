import { memo, useRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

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
  const { mouseX, mouseY, scrollY, prefersReducedMotion, animationIntensity } = useAmbientIntelligence();
  
  const springConfig = { stiffness: 50, damping: 30 };
  
  const mouseMultiplier = depthMultipliers[depth];
  const scrollMultiplier = scrollMultipliers[depth];
  
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  
  const targetX = prefersReducedMotion ? 0 : (mouseX - centerX) * mouseMultiplier * animationIntensity;
  const targetY = prefersReducedMotion ? 0 : (mouseY - centerY) * mouseMultiplier * animationIntensity + scrollY * scrollMultiplier;
  
  const x = useSpring(targetX, springConfig);
  const y = useSpring(targetY, springConfig);
  
  useEffect(() => {
    x.set(targetX);
    y.set(targetY);
  }, [targetX, targetY, x, y]);

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
});

ParallaxLayer.displayName = 'ParallaxLayer';

// Floating glow accents for foreground layer
export const FloatingAccents = memo(() => {
  const { prefersReducedMotion, animationIntensity, isFocusMode } = useAmbientIntelligence();
  
  if (prefersReducedMotion) return null;
  
  const opacity = isFocusMode ? 0.3 : 0.6;
  const duration = 10 / animationIntensity;
  
  return (
    <ParallaxLayer depth="foreground" className="fixed inset-0 overflow-hidden">
      {/* Top-left accent */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-purple) / 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
          opacity: [opacity * 0.5, opacity, opacity * 0.5],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Top-right accent */}
      <motion.div
        className="absolute -top-10 right-[20%] w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-cyan) / 0.1) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          opacity: [opacity * 0.3, opacity * 0.7, opacity * 0.3],
        }}
        transition={{
          duration: duration * 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      {/* Bottom-right accent */}
      <motion.div
        className="absolute bottom-[30%] -right-10 w-56 h-56 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--neon-green) / 0.12) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, -15, 0],
          opacity: [opacity * 0.4, opacity * 0.8, opacity * 0.4],
        }}
        transition={{
          duration: duration * 0.9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </ParallaxLayer>
  );
});

FloatingAccents.displayName = 'FloatingAccents';

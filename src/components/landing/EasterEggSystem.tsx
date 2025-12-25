import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useEasterEggs } from '@/lib/easter-eggs/useEasterEggs';
import { GhostOverlay } from '@/lib/easter-eggs/effects/GhostOverlay';
import { ConicBurst } from '@/lib/easter-eggs/effects/ConicBurst';
import { KonamiReveal } from '@/lib/easter-eggs/effects/KonamiReveal';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

export const EasterEggSystem = memo(() => {
  const { activeEffect, burstPosition, clearEffect } = useEasterEggs();
  const { prefersReducedMotion } = useAmbientIntelligence();
  
  if (prefersReducedMotion) return null;
  
  return (
    <AnimatePresence mode="wait">
      {activeEffect === 'ghost' && (
        <GhostOverlay key="ghost" onComplete={clearEffect} />
      )}
      
      {activeEffect === 'konami' && (
        <KonamiReveal key="konami" onComplete={clearEffect} />
      )}
      
      {activeEffect === 'conic-burst' && (
        <ConicBurst 
          key="conic-burst" 
          x={burstPosition?.x} 
          y={burstPosition?.y}
          onComplete={clearEffect} 
        />
      )}
    </AnimatePresence>
  );
});

EasterEggSystem.displayName = 'EasterEggSystem';

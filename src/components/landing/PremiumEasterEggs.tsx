import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences } from '@/hooks/usePreferences';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

// Konami-style key sequence trigger
const SECRET_SEQUENCE = ['g', 'h', 'o', 's', 't'];

export const SecretKeyCombo = memo(() => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [triggered, setTriggered] = useState(false);
  const { markEasterEggSeen } = usePreferences();
  const { prefersReducedMotion } = useAmbientIntelligence();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      setSequence(prev => {
        const newSeq = [...prev, key].slice(-SECRET_SEQUENCE.length);
        
        // Check if sequence matches
        if (newSeq.join('') === SECRET_SEQUENCE.join('')) {
          setTriggered(true);
          markEasterEggSeen();
          setTimeout(() => setTriggered(false), 3000);
          return [];
        }
        
        return newSeq;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markEasterEggSeen]);
  
  if (prefersReducedMotion) return null;
  
  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Glitch reveal effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, hsl(var(--neon-purple) / 0.1) 0%, transparent 50%, hsl(var(--neon-green) / 0.1) 100%)',
            }}
            animate={{
              opacity: [0, 0.5, 0.2, 0.8, 0],
              x: [0, 5, -3, 2, 0],
            }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
          />
          
          {/* Secret message */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <motion.div
                className="font-mono text-4xl text-neon-purple/80 mb-2"
                animate={{ 
                  textShadow: [
                    '0 0 10px hsl(var(--neon-purple))',
                    '0 0 20px hsl(var(--neon-purple))',
                    '0 0 10px hsl(var(--neon-purple))',
                  ]
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                👻 GHOST ACTIVATED
              </motion.div>
              <p className="font-mono text-sm text-muted-foreground/60">
                You found the secret.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SecretKeyCombo.displayName = 'SecretKeyCombo';

// Triple-click logo reveals glitch
export const TripleClickReveal = memo(({ children }: { children: React.ReactNode }) => {
  const [revealed, setRevealed] = useState(false);
  const { prefersReducedMotion } = useAmbientIntelligence();
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Clear existing reset timer
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current >= 3) {
      setRevealed(true);
      clickCountRef.current = 0;
      setTimeout(() => setRevealed(false), 1500);
    } else {
      // Reset count after 600ms of no clicks
      resetTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 600);
    }
  }, []);
  
  return (
    <div onClick={handleClick} className="relative cursor-pointer">
      {children}
      
      <AnimatePresence>
        {revealed && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, hsl(var(--neon-purple)), hsl(var(--neon-green)), hsl(var(--neon-pink)), hsl(var(--neon-purple)))',
                filter: 'blur(20px)',
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 2, 1],
                opacity: [0.8, 1, 0],
              }}
              transition={{ duration: 1.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TripleClickReveal.displayName = 'TripleClickReveal';

// Long hover reveal
export const LongHoverReveal = memo(({ children, revealText = '...' }: { children: React.ReactNode; revealText?: string }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const { prefersReducedMotion } = useAmbientIntelligence();
  
  useEffect(() => {
    if (isHovering) {
      const timer = setTimeout(() => setShowReveal(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowReveal(false);
    }
  }, [isHovering]);
  
  return (
    <div 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative"
    >
      {children}
      
      <AnimatePresence>
        {showReveal && !prefersReducedMotion && (
          <motion.div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground/40 whitespace-nowrap"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {revealText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

LongHoverReveal.displayName = 'LongHoverReveal';

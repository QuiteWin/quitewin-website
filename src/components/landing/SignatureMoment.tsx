import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

// Signature breathing effect when page fully loads
export const PageBreath = memo(() => {
  const [hasBreathed, setHasBreathed] = useState(false);
  const [showBreath, setShowBreath] = useState(false);
  const { prefersReducedMotion } = useAmbientIntelligence();
  
  useEffect(() => {
    if (hasBreathed || prefersReducedMotion) return;
    
    // Trigger breath after page load
    const timer = setTimeout(() => {
      setShowBreath(true);
      setTimeout(() => {
        setShowBreath(false);
        setHasBreathed(true);
      }, 2000);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [hasBreathed, prefersReducedMotion]);
  
  if (prefersReducedMotion) return null;
  
  return (
    <AnimatePresence>
      {showBreath && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[2]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Central breath pulse */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(var(--neon-purple) / 0.08) 0%, transparent 50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

PageBreath.displayName = 'PageBreath';

// Section transition glitch pulse
export const SectionPulse = memo(() => {
  const { scrollVelocity, prefersReducedMotion, animationIntensity } = useAmbientIntelligence();
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Trigger subtle pulse on fast scroll
    if (scrollVelocity > 2 && !pulse) {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }
  }, [scrollVelocity, pulse, prefersReducedMotion]);
  
  if (prefersReducedMotion) return null;
  
  return (
    <AnimatePresence>
      {pulse && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 * animationIntensity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            background: 'linear-gradient(180deg, hsl(var(--neon-purple) / 0.1) 0%, transparent 20%, transparent 80%, hsl(var(--neon-green) / 0.1) 100%)',
          }}
        />
      )}
    </AnimatePresence>
  );
});

SectionPulse.displayName = 'SectionPulse';

// Logo scroll velocity reaction
export const LogoVelocityReact = memo(() => {
  const { scrollVelocity, prefersReducedMotion } = useAmbientIntelligence();
  
  // This component doesn't render anything - it's meant to be used as a hook
  // The actual logo component should use useAmbientIntelligence to react to scrollVelocity
  return null;
});

LogoVelocityReact.displayName = 'LogoVelocityReact';

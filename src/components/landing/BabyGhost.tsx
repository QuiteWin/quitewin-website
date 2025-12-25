import { memo, useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

type GhostMood = 'neutral' | 'happy' | 'sleepy' | 'excited' | 'surprised';

export const BabyGhost = memo(() => {
  const { mouseX, mouseY, mouseVelocity, prefersReducedMotion, isIdle } = useAmbientIntelligence();
  const [isVisible, setIsVisible] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [mood, setMood] = useState<GhostMood>('neutral');
  
  // Delayed, springy follow
  const springConfig = { stiffness: 50, damping: 20, mass: 1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  // Show ghost after a delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);
  
  // Blinking animation
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };
    
    // Random blinks
    const interval = setInterval(() => {
      if (Math.random() > 0.7) blink();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update mood based on state
  useEffect(() => {
    if (isIdle) {
      setMood('sleepy');
    } else if (mouseVelocity > 1.5) {
      setMood('excited');
    } else if (mouseVelocity > 0.8) {
      setMood('happy');
    } else {
      setMood('neutral');
    }
  }, [isIdle, mouseVelocity]);
  
  // Follow cursor with offset
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const targetX = mouseX + 80;
    const targetY = mouseY + 60;
    
    x.set(targetX);
    y.set(targetY);
    
    // Eyes look toward cursor
    const ghostCenterX = targetX + 20;
    const ghostCenterY = targetY + 15;
    const dx = mouseX - ghostCenterX;
    const dy = mouseY - ghostCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      setEyeOffset({
        x: (dx / dist) * 3,
        y: (dy / dist) * 2,
      });
    }
  }, [mouseX, mouseY, prefersReducedMotion, x, y]);
  
  if (prefersReducedMotion || !isVisible) return null;
  
  // Eye size based on mood
  const eyeScaleY = isBlinking ? 0.1 : mood === 'sleepy' ? 0.5 : mood === 'excited' ? 1.2 : 1;
  const eyeScaleX = mood === 'excited' ? 1.1 : 1;
  
  return (
    <motion.div
      className="fixed pointer-events-none z-[60]"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isIdle ? 0.5 : 0.9, 
        scale: 1,
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Ghost body */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -4, 0],
          rotate: mood === 'excited' ? [-4, 4, -4] : [-2, 2, -2],
        }}
        transition={{
          duration: mood === 'excited' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Main ghost shape */}
        <svg 
          width="40" 
          height="48" 
          viewBox="0 0 40 48" 
          className="drop-shadow-lg"
        >
          {/* Ghost body */}
          <motion.path
            d="M20 2 C8 2 2 12 2 22 L2 40 C2 42 4 44 6 42 C8 40 10 42 12 44 C14 46 16 44 18 42 C20 40 22 42 24 44 C26 46 28 44 30 42 C32 40 34 42 36 44 C38 46 40 42 38 40 L38 22 C38 12 32 2 20 2 Z"
            className="fill-white/90"
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--neon-purple) / 0.3))',
            }}
            animate={{
              scale: mood === 'excited' ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 0.3, repeat: mood === 'excited' ? Infinity : 0 }}
          />
          
          {/* Blush - more visible when happy/excited */}
          <motion.ellipse 
            cx="10" cy="26" rx="4" ry="2" 
            animate={{
              opacity: mood === 'happy' || mood === 'excited' ? 0.6 : 0.3,
              fill: mood === 'excited' ? '#ff9999' : '#ffc0cb',
            }}
          />
          <motion.ellipse 
            cx="30" cy="26" rx="4" ry="2" 
            animate={{
              opacity: mood === 'happy' || mood === 'excited' ? 0.6 : 0.3,
              fill: mood === 'excited' ? '#ff9999' : '#ffc0cb',
            }}
          />
          
          {/* Eyes container */}
          <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
            {/* Left eye */}
            <motion.ellipse 
              cx="13" cy="20" rx="4" ry="5" 
              className="fill-gray-800"
              animate={{
                scaleY: eyeScaleY,
                scaleX: eyeScaleX,
              }}
              style={{ transformOrigin: '13px 20px' }}
              transition={{ duration: 0.1 }}
            />
            {/* Left eye shine */}
            <AnimatePresence>
              {!isBlinking && (
                <motion.ellipse 
                  cx="14" cy="19" rx="1.5" ry="2" 
                  className="fill-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            
            {/* Right eye */}
            <motion.ellipse 
              cx="27" cy="20" rx="4" ry="5" 
              className="fill-gray-800"
              animate={{
                scaleY: eyeScaleY,
                scaleX: eyeScaleX,
              }}
              style={{ transformOrigin: '27px 20px' }}
              transition={{ duration: 0.1 }}
            />
            {/* Right eye shine */}
            <AnimatePresence>
              {!isBlinking && (
                <motion.ellipse 
                  cx="28" cy="19" rx="1.5" ry="2" 
                  className="fill-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </g>
          
          {/* Mouth - changes based on mood */}
          <AnimatePresence mode="wait">
            {mood === 'sleepy' && (
              <motion.path
                key="sleepy"
                d="M17 29 L23 29"
                fill="none"
                stroke="#888"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
            {mood === 'neutral' && (
              <motion.path
                key="neutral"
                d="M17 28 Q20 30 23 28"
                fill="none"
                stroke="#666"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
            {mood === 'happy' && (
              <motion.path
                key="happy"
                d="M15 27 Q20 33 25 27"
                fill="none"
                stroke="#555"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
            {mood === 'excited' && (
              <motion.g key="excited" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ellipse cx="20" cy="30" rx="4" ry="3" className="fill-gray-700" />
                <ellipse cx="20" cy="29" rx="2.5" ry="1.5" className="fill-pink-400/60" />
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Sweat drop when excited */}
          <AnimatePresence>
            {mood === 'excited' && (
              <motion.ellipse
                cx="34" cy="14"
                rx="2" ry="3"
                className="fill-blue-300/60"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
          
          {/* Zzz when sleepy */}
          <AnimatePresence>
            {mood === 'sleepy' && (
              <motion.text
                x="32" y="10"
                className="fill-gray-400 text-[8px] font-mono"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                z
              </motion.text>
            )}
          </AnimatePresence>
        </svg>
        
        {/* Sparkle effect when happy */}
        <AnimatePresence>
          {(mood === 'happy' || mood === 'excited') && (
            <motion.div
              className="absolute -top-1 -right-1"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              exit={{ scale: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <span className="text-xs">✨</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Shadow */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-black/10 blur-sm"
        animate={{
          scaleX: mood === 'excited' ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: mood === 'excited' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
});

BabyGhost.displayName = 'BabyGhost';

export default BabyGhost;

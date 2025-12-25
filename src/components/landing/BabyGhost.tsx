import { memo, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

export const BabyGhost = memo(() => {
  const { mouseX, mouseY, prefersReducedMotion, isIdle } = useAmbientIntelligence();
  const [isVisible, setIsVisible] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  
  // Delayed, springy follow
  const springConfig = { stiffness: 50, damping: 20, mass: 1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  // Show ghost after a delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);
  
  // Follow cursor with offset (ghost stays to the side)
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Ghost follows at a distance, slightly below and to the right
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
  
  return (
    <motion.div
      className="fixed pointer-events-none z-[60]"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isIdle ? 0.4 : 0.8, 
        scale: 1,
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Ghost body */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -4, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 2,
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
          <path
            d="M20 2 C8 2 2 12 2 22 L2 40 C2 42 4 44 6 42 C8 40 10 42 12 44 C14 46 16 44 18 42 C20 40 22 42 24 44 C26 46 28 44 30 42 C32 40 34 42 36 44 C38 46 40 42 38 40 L38 22 C38 12 32 2 20 2 Z"
            className="fill-white/90"
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--neon-purple) / 0.3))',
            }}
          />
          
          {/* Blush */}
          <ellipse cx="10" cy="26" rx="4" ry="2" className="fill-pink-300/40" />
          <ellipse cx="30" cy="26" rx="4" ry="2" className="fill-pink-300/40" />
          
          {/* Eyes */}
          <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
            {/* Left eye */}
            <ellipse cx="13" cy="20" rx="4" ry="5" className="fill-gray-800" />
            <ellipse cx="14" cy="19" rx="1.5" ry="2" className="fill-white" />
            
            {/* Right eye */}
            <ellipse cx="27" cy="20" rx="4" ry="5" className="fill-gray-800" />
            <ellipse cx="28" cy="19" rx="1.5" ry="2" className="fill-white" />
          </g>
          
          {/* Cute mouth */}
          <path
            d="M17 28 Q20 31 23 28"
            fill="none"
            stroke="#666"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Sparkle effect when idle */}
        {isIdle && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <span className="text-xs">✨</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Shadow */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-black/10 blur-sm"
        animate={{
          scaleX: [1, 1.1, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
});

BabyGhost.displayName = 'BabyGhost';

export default BabyGhost;

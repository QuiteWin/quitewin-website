import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

type GhostState = 'hidden' | 'appearing' | 'roaming' | 'sitting' | 'peeking' | 'following' | 'waving' | 'sleeping' | 'celebrating';
type GhostMood = 'neutral' | 'happy' | 'sleepy' | 'excited' | 'surprised' | 'shy' | 'curious' | 'celebrating';

const ROAM_POSITIONS = [
  { x: 0.1, y: 0.2 },
  { x: 0.85, y: 0.15 },
  { x: 0.7, y: 0.5 },
  { x: 0.15, y: 0.7 },
  { x: 0.5, y: 0.3 },
  { x: 0.9, y: 0.8 },
  { x: 0.3, y: 0.85 },
];

const PEEK_POSITIONS = [
  { x: -20, y: 100, rotate: 15 },   // Left edge
  { x: -20, y: 300, rotate: 20 },   // Left edge lower
  { x: window.innerWidth - 20, y: 150, rotate: -15 }, // Right edge
  { x: window.innerWidth - 20, y: 400, rotate: -20 }, // Right edge lower
  { x: 100, y: -15, rotate: 180 },  // Top edge
];

export const BabyGhost = memo(() => {
  const { mouseX, mouseY, prefersReducedMotion, isIdle } = useAmbientIntelligence();
  
  const [ghostState, setGhostState] = useState<GhostState>('hidden');
  const [mood, setMood] = useState<GhostMood>('neutral');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  const stateTimerRef = useRef<number | null>(null);
  const followTimerRef = useRef<number | null>(null);
  const celebrateTimerRef = useRef<number | null>(null);
  const lastClickTime = useRef(0);
  
  const springConfig = { stiffness: 30, damping: 15, mass: 1.5 };
  const x = useSpring(position.x, springConfig);
  const y = useSpring(position.y, springConfig);
  
  // Initial appearance delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setGhostState('appearing');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  // Random blinking
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && ghostState !== 'sleeping') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [ghostState]);
  
  // Get random roam position
  const getRandomRoamPosition = useCallback(() => {
    const pos = ROAM_POSITIONS[Math.floor(Math.random() * ROAM_POSITIONS.length)];
    return {
      x: pos.x * (window.innerWidth - 60),
      y: pos.y * (window.innerHeight - 60),
    };
  }, []);
  
  // Get random peek position
  const getRandomPeekPosition = useCallback(() => {
    const pos = PEEK_POSITIONS[Math.floor(Math.random() * PEEK_POSITIONS.length)];
    return { x: pos.x, y: pos.y, rotate: pos.rotate };
  }, []);
  
  // Find a button to sit on
  const findButtonToSit = useCallback(() => {
    const buttons = document.querySelectorAll('button, .glass-card, [data-easter-egg]');
    if (buttons.length === 0) return null;
    
    const btn = buttons[Math.floor(Math.random() * Math.min(buttons.length, 10))];
    const rect = btn.getBoundingClientRect();
    
    return {
      x: rect.left + rect.width / 2 - 20,
      y: rect.top - 35,
    };
  }, []);
  
  // State machine
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;
    
    const transitionToNextState = () => {
      const random = Math.random();
      
      switch (ghostState) {
        case 'appearing':
          setMood('happy');
          const appearPos = getRandomRoamPosition();
          setPosition(appearPos);
          x.set(appearPos.x);
          y.set(appearPos.y);
          
          stateTimerRef.current = window.setTimeout(() => {
            setGhostState('roaming');
          }, 1500);
          break;
          
        case 'roaming':
          setMood('curious');
          setRotation(0);
          const roamPos = getRandomRoamPosition();
          setPosition(roamPos);
          x.set(roamPos.x);
          y.set(roamPos.y);
          
          stateTimerRef.current = window.setTimeout(() => {
            if (random < 0.2) {
              setGhostState('hidden');
            } else if (random < 0.4) {
              setGhostState('peeking');
            } else if (random < 0.6) {
              setGhostState('sitting');
            } else if (random < 0.7) {
              setGhostState('waving');
            } else if (random < 0.8 && isIdle) {
              setGhostState('sleeping');
            } else {
              setGhostState('roaming');
            }
          }, 3000 + Math.random() * 4000);
          break;
          
        case 'hidden':
          setMood('shy');
          stateTimerRef.current = window.setTimeout(() => {
            setGhostState(Math.random() > 0.5 ? 'peeking' : 'appearing');
          }, 2000 + Math.random() * 3000);
          break;
          
        case 'peeking':
          setMood('curious');
          const peekPos = getRandomPeekPosition();
          setPosition({ x: peekPos.x, y: peekPos.y });
          setRotation(peekPos.rotate);
          x.set(peekPos.x);
          y.set(peekPos.y);
          
          stateTimerRef.current = window.setTimeout(() => {
            setGhostState(Math.random() > 0.3 ? 'roaming' : 'hidden');
          }, 2000 + Math.random() * 2000);
          break;
          
        case 'sitting':
          setMood('happy');
          setRotation(0);
          const sittingPos = findButtonToSit();
          if (sittingPos) {
            setPosition(sittingPos);
            x.set(sittingPos.x);
            y.set(sittingPos.y);
          }
          
          stateTimerRef.current = window.setTimeout(() => {
            setGhostState('roaming');
          }, 4000 + Math.random() * 3000);
          break;
          
        case 'waving':
          setMood('happy');
          stateTimerRef.current = window.setTimeout(() => {
            setGhostState('roaming');
          }, 2000);
          break;
          
        case 'sleeping':
          setMood('sleepy');
          stateTimerRef.current = window.setTimeout(() => {
            if (!isIdle) {
              setGhostState('roaming');
            }
          }, 5000);
          break;
          
        case 'following':
          setMood('excited');
          setRotation(0);
          // Will be handled by mouse tracking effect
          followTimerRef.current = window.setTimeout(() => {
            setGhostState('roaming');
          }, 3000 + Math.random() * 2000);
          break;
      }
    };
    
    transitionToNextState();
    
    return () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
      if (followTimerRef.current) clearTimeout(followTimerRef.current);
    };
  }, [ghostState, isVisible, prefersReducedMotion, getRandomRoamPosition, getRandomPeekPosition, findButtonToSit, isIdle, x, y]);
  
  // Follow cursor when in following state
  useEffect(() => {
    if (ghostState !== 'following' || prefersReducedMotion) return;
    
    const targetX = mouseX + 60;
    const targetY = mouseY + 40;
    setPosition({ x: targetX, y: targetY });
    x.set(targetX);
    y.set(targetY);
  }, [mouseX, mouseY, ghostState, prefersReducedMotion, x, y]);
  
  // Eyes always track cursor
  useEffect(() => {
    const ghostCenterX = position.x + 20;
    const ghostCenterY = position.y + 20;
    const dx = mouseX - ghostCenterX;
    const dy = mouseY - ghostCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      setEyeOffset({
        x: Math.min(Math.max((dx / dist) * 3, -3), 3),
        y: Math.min(Math.max((dy / dist) * 2, -2), 2),
      });
    }
    
    // Check if cursor is close - trigger following
    if (dist < 100 && ghostState === 'roaming' && Math.random() > 0.85) {
      setMood('surprised');
      setTimeout(() => setGhostState('following'), 300);
    }
  }, [mouseX, mouseY, position, ghostState]);
  
  // Click to trigger following
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      if (now - lastClickTime.current < 1000) return;
      lastClickTime.current = now;
      
      // Only trigger if ghost is visible and roaming/sitting
      if (['roaming', 'sitting', 'peeking'].includes(ghostState)) {
        if (Math.random() > 0.5) {
          setMood('surprised');
          setTimeout(() => setGhostState('following'), 200);
        }
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [ghostState]);
  
  // Celebrate when special buttons are clicked
  useEffect(() => {
    const handleSpecialClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (!button) return;
      
      const buttonText = button.textContent?.toLowerCase() || '';
      const isCelebrationButton = 
        buttonText.includes('download') ||
        buttonText.includes('fuel') ||
        buttonText.includes('support') ||
        buttonText.includes('donate') ||
        buttonText.includes('beta');
      
      if (isCelebrationButton) {
        // Clear any existing timers
        if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
        if (celebrateTimerRef.current) clearTimeout(celebrateTimerRef.current);
        
        // Move ghost near the clicked button
        const rect = button.getBoundingClientRect();
        const celebratePos = {
          x: rect.left + rect.width / 2 - 20,
          y: rect.top - 50,
        };
        setPosition(celebratePos);
        x.set(celebratePos.x);
        y.set(celebratePos.y);
        
        setGhostState('celebrating');
        setMood('celebrating');
        setIsCelebrating(true);
        
        celebrateTimerRef.current = window.setTimeout(() => {
          setIsCelebrating(false);
          setGhostState('roaming');
          setMood('happy');
        }, 3000);
      }
    };
    
    window.addEventListener('click', handleSpecialClick);
    return () => window.removeEventListener('click', handleSpecialClick);
  }, [x, y]);
  
  if (prefersReducedMotion || !isVisible) return null;
  
  const isHidden = ghostState === 'hidden';
  const isCelebratingState = ghostState === 'celebrating';
  const eyeScaleY = isBlinking ? 0.1 : mood === 'sleepy' ? 0.4 : mood === 'surprised' || mood === 'celebrating' ? 1.3 : 1;
  const eyeScaleX = mood === 'surprised' || mood === 'celebrating' ? 1.2 : 1;

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          className="fixed pointer-events-none z-[60]"
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: ghostState === 'peeking' ? 0.7 : 0.9,
            scale: ghostState === 'sleeping' ? 0.9 : 1,
            rotate: rotation,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="relative"
            animate={{
              y: isCelebratingState ? [0, -15, 0, -10, 0] : ghostState === 'sleeping' ? [0, -2, 0] : [0, -6, 0],
              rotate: isCelebratingState ? [-10, 10, -10, 10, 0] : ghostState === 'waving' ? [-5, 5, -5] : mood === 'excited' ? [-3, 3, -3] : 0,
              scale: isCelebratingState ? [1, 1.2, 1, 1.15, 1] : 1,
            }}
            transition={{
              duration: isCelebratingState ? 0.5 : ghostState === 'sleeping' ? 3 : ghostState === 'waving' ? 0.3 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="40" height="48" viewBox="0 0 40 48" className="drop-shadow-lg">
              {/* Ghost body */}
              <motion.path
                d="M20 2 C8 2 2 12 2 22 L2 40 C2 42 4 44 6 42 C8 40 10 42 12 44 C14 46 16 44 18 42 C20 40 22 42 24 44 C26 46 28 44 30 42 C32 40 34 42 36 44 C38 46 40 42 38 40 L38 22 C38 12 32 2 20 2 Z"
                className="fill-white/90"
                style={{ filter: 'drop-shadow(0 0 10px hsl(var(--neon-purple) / 0.4))' }}
              />
              
              {/* Blush */}
              <motion.ellipse 
                cx="10" cy="26" rx="4" ry="2"
                animate={{ 
                  opacity: ['happy', 'excited', 'shy'].includes(mood) ? 0.6 : 0.25,
                  fill: mood === 'shy' ? '#ff6666' : '#ffc0cb',
                }}
              />
              <motion.ellipse 
                cx="30" cy="26" rx="4" ry="2"
                animate={{ 
                  opacity: ['happy', 'excited', 'shy'].includes(mood) ? 0.6 : 0.25,
                  fill: mood === 'shy' ? '#ff6666' : '#ffc0cb',
                }}
              />
              
              {/* Eyes */}
              <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                <motion.ellipse 
                  cx="13" cy="20" rx="4" ry="5" 
                  className="fill-gray-800"
                  animate={{ scaleY: eyeScaleY, scaleX: eyeScaleX }}
                  style={{ transformOrigin: '13px 20px' }}
                />
                <AnimatePresence>
                  {!isBlinking && mood !== 'sleepy' && (
                    <motion.ellipse 
                      cx="14" cy="19" rx="1.5" ry="2" 
                      className="fill-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                
                <motion.ellipse 
                  cx="27" cy="20" rx="4" ry="5" 
                  className="fill-gray-800"
                  animate={{ scaleY: eyeScaleY, scaleX: eyeScaleX }}
                  style={{ transformOrigin: '27px 20px' }}
                />
                <AnimatePresence>
                  {!isBlinking && mood !== 'sleepy' && (
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
              
              {/* Mouth variations */}
              <AnimatePresence mode="wait">
                {mood === 'sleepy' && (
                  <motion.path key="sleepy-mouth" d="M17 29 L23 29" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                )}
                {mood === 'neutral' && (
                  <motion.path key="neutral-mouth" d="M17 28 Q20 30 23 28" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                )}
                {mood === 'happy' && (
                  <motion.path key="happy-mouth" d="M15 27 Q20 33 25 27" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                )}
                {mood === 'curious' && (
                  <motion.ellipse key="curious-mouth" cx="20" cy="29" rx="2" ry="2.5" className="fill-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                )}
                {mood === 'surprised' && (
                  <motion.ellipse key="surprised-mouth" cx="20" cy="30" rx="3" ry="4" className="fill-gray-700" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} />
                )}
                {mood === 'excited' && (
                  <motion.g key="excited-mouth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ellipse cx="20" cy="30" rx="4" ry="3" className="fill-gray-700" />
                    <ellipse cx="20" cy="29" rx="2.5" ry="1.5" className="fill-pink-400/60" />
                  </motion.g>
                )}
                {mood === 'shy' && (
                  <motion.path key="shy-mouth" d="M18 29 Q20 27 22 29" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                )}
                {mood === 'celebrating' && (
                  <motion.g key="celebrating-mouth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ellipse cx="20" cy="30" rx="5" ry="4" className="fill-gray-700" />
                    <ellipse cx="20" cy="29" rx="3" ry="2" className="fill-pink-400/70" />
                    <motion.path d="M16 28 L18 26 L20 28 L22 26 L24 28" fill="none" stroke="#fff" strokeWidth="0.5" strokeLinecap="round" />
                  </motion.g>
                )}
              </AnimatePresence>
              
              {/* Sleeping Zzz */}
              {ghostState === 'sleeping' && (
                <motion.g>
                  <motion.text x="30" y="8" className="fill-gray-400 text-[6px] font-mono" animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>z</motion.text>
                  <motion.text x="34" y="4" className="fill-gray-400 text-[8px] font-mono" animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>z</motion.text>
                  <motion.text x="38" y="-1" className="fill-gray-400 text-[10px] font-mono" animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>Z</motion.text>
                </motion.g>
              )}
              
              {/* Question mark when curious */}
              {mood === 'curious' && ghostState !== 'sleeping' && (
                <motion.text 
                  x="32" y="5" 
                  className="fill-gray-500 text-[10px] font-bold"
                  animate={{ y: [0, -2, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ?
                </motion.text>
              )}
              
              {/* Exclamation when surprised */}
              {mood === 'surprised' && (
                <motion.text 
                  x="32" y="5" 
                  className="fill-amber-500 text-[12px] font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  !
                </motion.text>
              )}
            </svg>
            
            {/* Waving hand */}
            {ghostState === 'waving' && (
              <motion.div
                className="absolute -right-2 top-4 text-lg"
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                👋
              </motion.div>
            )}
            
            {/* Hearts when happy */}
            {mood === 'happy' && ghostState !== 'sleeping' && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [0, 1, 0], y: [0, -10, -20] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <span className="text-xs">💜</span>
              </motion.div>
            )}
            
            {/* Sparkles when excited */}
            {mood === 'excited' && (
              <>
                <motion.div className="absolute -top-1 -left-1" animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}>
                  <span className="text-xs">✨</span>
                </motion.div>
                <motion.div className="absolute -top-2 right-0" animate={{ scale: [0, 1, 0], rotate: [0, -180, -360] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}>
                  <span className="text-xs">✨</span>
                </motion.div>
              </>
            )}
            
            {/* Celebration effects */}
            {isCelebratingState && (
              <>
                {/* Confetti burst */}
                <motion.div className="absolute -top-4 left-1/2" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 0], y: [0, -30], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}>
                  <span className="text-lg">🎉</span>
                </motion.div>
                <motion.div className="absolute -top-2 -left-4" initial={{ scale: 0 }} animate={{ scale: [0, 1, 0], x: [-10, -25], y: [0, -20], rotate: [0, -30] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}>
                  <span className="text-sm">⭐</span>
                </motion.div>
                <motion.div className="absolute -top-2 -right-4" initial={{ scale: 0 }} animate={{ scale: [0, 1, 0], x: [10, 25], y: [0, -20], rotate: [0, 30] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}>
                  <span className="text-sm">🌟</span>
                </motion.div>
                <motion.div className="absolute top-0 -left-6" initial={{ scale: 0 }} animate={{ scale: [0, 1, 0], x: [-5, -20], y: [0, 10] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }}>
                  <span className="text-xs">💜</span>
                </motion.div>
                <motion.div className="absolute top-0 -right-6" initial={{ scale: 0 }} animate={{ scale: [0, 1, 0], x: [5, 20], y: [0, 10] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}>
                  <span className="text-xs">💚</span>
                </motion.div>
                <motion.div className="absolute -top-6 left-0" initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 0], y: [0, -25], rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
                  <span className="text-sm">✨</span>
                </motion.div>
                <motion.div className="absolute -top-6 right-0" initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 0], y: [0, -25], rotate: [0, -360] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}>
                  <span className="text-sm">✨</span>
                </motion.div>
                {/* Thank you text */}
                <motion.div 
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs font-mono text-neon-purple font-bold bg-background/80 px-2 py-1 rounded-full">Thank you!</span>
                </motion.div>
              </>
            )}
          </motion.div>
          
          {/* Shadow */}
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-black/10 blur-sm"
            animate={{ scaleX: [1, 1.1, 1], opacity: [0.25, 0.15, 0.25] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

BabyGhost.displayName = 'BabyGhost';

export default BabyGhost;
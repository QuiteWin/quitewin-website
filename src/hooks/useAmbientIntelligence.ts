import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface AmbientState {
  // Mouse tracking
  mouseX: number;
  mouseY: number;
  mouseVelocity: number;
  
  // Scroll tracking
  scrollY: number;
  scrollVelocity: number;
  scrollDepth: number; // 0-1 percentage
  
  // Idle detection
  isIdle: boolean;
  idleDuration: number;
  
  // Focus mode
  isFocusMode: boolean;
  
  // Animation intensity multiplier (0.2 = slow, 1 = normal, 1.5 = fast)
  animationIntensity: number;
  
  // Time of day
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // Reduced motion preference
  prefersReducedMotion: boolean;
}

const defaultState: AmbientState = {
  mouseX: 0,
  mouseY: 0,
  mouseVelocity: 0,
  scrollY: 0,
  scrollVelocity: 0,
  scrollDepth: 0,
  isIdle: false,
  idleDuration: 0,
  isFocusMode: false,
  animationIntensity: 1,
  timeOfDay: 'afternoon',
  prefersReducedMotion: false,
};

export const AmbientContext = createContext<AmbientState>(defaultState);

export const useAmbientIntelligence = () => useContext(AmbientContext);

export const useAmbientProvider = () => {
  const [state, setState] = useState<AmbientState>(defaultState);
  
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const lastScrollPos = useRef({ y: 0, time: Date.now() });
  const idleTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);
  const idleStartRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  // Get time of day
  const getTimeOfDay = useCallback((): AmbientState['timeOfDay'] => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setState(prev => ({ ...prev, prefersReducedMotion: mediaQuery.matches }));
    
    const handler = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, prefersReducedMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update time of day
  useEffect(() => {
    setState(prev => ({ ...prev, timeOfDay: getTimeOfDay() }));
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, timeOfDay: getTimeOfDay() }));
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [getTimeOfDay]);

  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dt = Math.max(now - lastMousePos.current.time, 1);
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      
      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
      
      setState(prev => ({
        ...prev,
        mouseX: e.clientX,
        mouseY: e.clientY,
        mouseVelocity: velocity,
        isIdle: false,
        isFocusMode: false,
      }));
      
      // Reset idle timer
      idleStartRef.current = null;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      
      idleTimerRef.current = window.setTimeout(() => {
        idleStartRef.current = Date.now();
        setState(prev => ({ ...prev, isIdle: true }));
      }, 5000);
      
      focusTimerRef.current = window.setTimeout(() => {
        setState(prev => ({ ...prev, isFocusMode: true }));
      }, 7000);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const scrollY = window.scrollY;
      const dy = scrollY - lastScrollPos.current.y;
      const dt = Math.max(now - lastScrollPos.current.time, 1);
      const velocity = Math.abs(dy) / dt;
      
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = docHeight > 0 ? scrollY / docHeight : 0;
      
      lastScrollPos.current = { y: scrollY, time: now };
      
      setState(prev => ({
        ...prev,
        scrollY,
        scrollVelocity: velocity,
        scrollDepth: Math.min(scrollDepth, 1),
        isIdle: false,
        isFocusMode: false,
      }));
      
      // Reset idle/focus timers on scroll
      idleStartRef.current = null;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      
      idleTimerRef.current = window.setTimeout(() => {
        idleStartRef.current = Date.now();
        setState(prev => ({ ...prev, isIdle: true }));
        
        // Trigger focus mode after deep scroll + idle
        if (scrollDepth > 0.3) {
          focusTimerRef.current = window.setTimeout(() => {
            setState(prev => ({ ...prev, isFocusMode: true }));
          }, 2000);
        }
      }, 5000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update idle duration and animation intensity
  useEffect(() => {
    const updateLoop = () => {
      setState(prev => {
        const idleDuration = idleStartRef.current 
          ? (Date.now() - idleStartRef.current) / 1000 
          : 0;
        
        // Calculate animation intensity
        // Slower when idle, faster when scrolling/moving fast
        let intensity = 1;
        if (prev.isIdle) {
          intensity = Math.max(0.2, 1 - (idleDuration / 30)); // Slow down over 30s
        } else if (prev.scrollVelocity > 1) {
          intensity = Math.min(1.5, 1 + prev.scrollVelocity * 0.2);
        } else if (prev.mouseVelocity > 0.5) {
          intensity = Math.min(1.3, 1 + prev.mouseVelocity * 0.1);
        }
        
        // Respect reduced motion
        if (prev.prefersReducedMotion) {
          intensity = 0.1;
        }
        
        return {
          ...prev,
          idleDuration,
          animationIntensity: prev.animationIntensity + (intensity - prev.animationIntensity) * 0.05,
        };
      });
      
      frameRef.current = requestAnimationFrame(updateLoop);
    };
    
    frameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, []);

  return state;
};

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { throttle } from './usePerformance';

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
  
  // Performance tier
  performanceTier: 'high' | 'medium' | 'low';
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
  performanceTier: 'medium',
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
  const updateIntervalRef = useRef<number | null>(null);

  // Detect performance tier once
  const performanceTier = useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return 'low' as const;
    
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory || 8;
    
    if (cores >= 8 && memory >= 8) return 'high' as const;
    if (cores >= 4 && memory >= 4) return 'medium' as const;
    return 'low' as const;
  }, []);

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
    setState(prev => ({ 
      ...prev, 
      prefersReducedMotion: mediaQuery.matches,
      performanceTier,
    }));
    
    const handler = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, prefersReducedMotion: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [performanceTier]);

  // Update time of day
  useEffect(() => {
    setState(prev => ({ ...prev, timeOfDay: getTimeOfDay() }));
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, timeOfDay: getTimeOfDay() }));
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [getTimeOfDay]);

  // THROTTLED Mouse movement tracking - 60ms throttle (~16fps for mouse)
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
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
      }, 60000); // 60 seconds idle timeout
      
      focusTimerRef.current = window.setTimeout(() => {
        setState(prev => ({ ...prev, isFocusMode: true }));
      }, 90000); // 90 seconds focus mode timeout
    }, 60); // Throttle to ~16fps

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // THROTTLED Scroll tracking - 100ms throttle (~10fps for scroll)
  useEffect(() => {
    const handleScroll = throttle(() => {
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
          }, 30000); // 30 seconds after deep scroll
        }
      }, 60000); // 60 seconds idle timeout
    }, 100); // Throttle to ~10fps

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update idle duration and animation intensity - use setInterval instead of RAF
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
    };
    
    // Use setInterval at 200ms (5fps) instead of RAF for intensity updates
    updateIntervalRef.current = window.setInterval(updateLoop, 200);
    
    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
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

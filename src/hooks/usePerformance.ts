import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Throttle function for event handlers
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastCall);
    
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  };
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Hook for intersection observer with performance in mind
export function useInView(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);
  
  return [ref, isInView];
}

// Hook for reduced motion preference
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReduced;
}

// Hook for frame-throttled callbacks (for scroll/mouse handlers)
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 16 // ~60fps default
): T {
  const throttledFn = useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  );
  
  return throttledFn as T;
}

// Hook for RAF-based animation loop with auto-pause when not in view
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  isActive: boolean = true
): void {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  
  callbackRef.current = callback;
  
  useEffect(() => {
    if (!isActive) return;
    
    const animate = (time: number) => {
      if (previousTimeRef.current) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive]);
}

// GPU-optimized style properties
export const gpuStyles = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
};

// Check if device is low-end
export function useIsLowEndDevice(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    const isLowCores = navigator.hardwareConcurrency <= 4;
    const isLowMemory = (navigator as { deviceMemory?: number }).deviceMemory !== undefined 
      && (navigator as { deviceMemory?: number }).deviceMemory! <= 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    return isLowCores || isLowMemory || isMobile;
  }, []);
}

// Performance tier detection
export type PerformanceTier = 'high' | 'medium' | 'low';

export function usePerformanceTier(): PerformanceTier {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return 'low';
    
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory || 8;
    
    if (cores >= 8 && memory >= 8) return 'high';
    if (cores >= 4 && memory >= 4) return 'medium';
    return 'low';
  }, []);
}

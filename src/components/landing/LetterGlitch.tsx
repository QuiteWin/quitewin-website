import { useEffect, useRef, useState, useCallback } from "react";

interface LetterGlitchProps {
  opacity?: number;
  glitchSpeed?: number;
}

const LetterGlitch = ({ opacity = 0.08, glitchSpeed = 80 }: LetterGlitchProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLowPerf, setIsLowPerf] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [cursorStill, setCursorStill] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>[]{}";
  const gridRef = useRef<{ char: string; targetChar: string; progress: number; speed: number }[][]>([]);
  
  // Detect low-performance devices
  useEffect(() => {
    const checkPerformance = () => {
      const isLow = 
        navigator.hardwareConcurrency <= 2 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsLowPerf(isLow);
    };
    checkPerformance();
  }, []);

  // Tab visibility
  useEffect(() => {
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(!document.documentElement.classList.contains('light-mode'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Idle detection
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 8000);
    };
    
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('scroll', resetIdle);
    resetIdle();
    
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('scroll', resetIdle);
    };
  }, []);

  // Scroll speed detection
  useEffect(() => {
    let lastScroll = 0;
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const speed = Math.abs(currentScroll - lastScroll);
      setScrollSpeed(Math.min(speed / 50, 1));
      lastScroll = currentScroll;
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setScrollSpeed(0), 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Cursor still detection
  useEffect(() => {
    let stillTimer: NodeJS.Timeout;
    
    const handleMove = () => {
      setCursorStill(false);
      clearTimeout(stillTimer);
      stillTimer = setTimeout(() => setCursorStill(true), 3000);
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(stillTimer);
    };
  }, []);

  // Initialize grid
  const initGrid = useCallback((canvas: HTMLCanvasElement) => {
    const cellSize = isLowPerf ? 24 : 16;
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    
    gridRef.current = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        char: chars[Math.floor(Math.random() * chars.length)],
        targetChar: chars[Math.floor(Math.random() * chars.length)],
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.008
      }))
    );
  }, [isLowPerf, chars]);

  // Main animation
  useEffect(() => {
    if (isLowPerf && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Completely disable on reduced motion preference
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid(canvas);
    };
    
    resize();
    window.addEventListener('resize', resize);

    const cellSize = isLowPerf ? 28 : 20;
    const targetFPS = isLowPerf ? 12 : 24;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      // Skip animation entirely when not visible
      if (!isVisible) {
        return;
      }

      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate dynamic speed multiplier
      let speedMultiplier = 1;
      if (isIdle) speedMultiplier = 0.3;
      if (cursorStill) speedMultiplier *= 0.5;
      if (scrollSpeed > 0) speedMultiplier = 1 + scrollSpeed * 0.5;
      
      // Calculate dynamic opacity
      let dynamicOpacity = opacity;
      if (cursorStill) dynamicOpacity *= 0.6;
      if (isIdle) dynamicOpacity *= 0.7;

      // Theme-based colors
      const baseColor = isDarkMode 
        ? `hsla(260, 30%, 60%, ${dynamicOpacity})`
        : `hsla(260, 20%, 40%, ${dynamicOpacity * 0.6})`;
      
      ctx.font = `${cellSize * 0.7}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      gridRef.current.forEach((row, y) => {
        row.forEach((cell, x) => {
          // Update progress
          cell.progress += cell.speed * speedMultiplier * (glitchSpeed / 80);
          
          if (cell.progress >= 1) {
            cell.progress = 0;
            cell.char = cell.targetChar;
            cell.targetChar = chars[Math.floor(Math.random() * chars.length)];
            cell.speed = 0.002 + Math.random() * 0.008;
          }
          
          // Subtle variation in opacity per character
          const charOpacity = 0.3 + Math.sin(cell.progress * Math.PI) * 0.7;
          
          ctx.fillStyle = isDarkMode
            ? `hsla(260, 30%, 60%, ${dynamicOpacity * charOpacity})`
            : `hsla(260, 20%, 40%, ${dynamicOpacity * charOpacity * 0.6})`;
          
          ctx.fillText(
            cell.char,
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2
          );
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, isLowPerf, isIdle, scrollSpeed, cursorStill, isDarkMode, opacity, glitchSpeed, initGrid, chars]);

  if (isLowPerf && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none will-change-transform"
      style={{
        zIndex: 0,
        mixBlendMode: isDarkMode ? 'screen' : 'multiply',
        opacity: isDarkMode ? 1 : 0.8,
        contain: 'strict',
      }}
      aria-hidden="true"
    />
  );
};

export default LetterGlitch;

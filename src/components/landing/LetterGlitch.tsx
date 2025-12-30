import { useEffect, useRef, useState, useMemo, memo } from "react";
import { useInView, usePerformanceTier } from "@/hooks/usePerformance";

interface LetterGlitchProps {
  opacity?: number;
  glitchSpeed?: number;
}

const LetterGlitch = memo(({ opacity = 0.06, glitchSpeed = 40 }: LetterGlitchProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const gridRef = useRef<{ char: string; progress: number; speed: number }[][]>([]);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewRef, isInView] = useInView({ rootMargin: '200px' });
  const performanceTier = usePerformanceTier();
  
  // Memoize chars to prevent recreation
  const chars = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%", []);
  
  // Detect if we should disable for performance
  const shouldDisable = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      performanceTier === 'low'
    );
  }, [performanceTier]);

  // Tab visibility - minimal listener
  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden);
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

  // Main animation - heavily optimized
  useEffect(() => {
    // Only animate if visible AND in view
    const shouldAnimate = !shouldDisable && isTabVisible && isInView;
    if (!shouldAnimate) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Larger cell size and lower FPS for better performance
    const cellSize = 40;
    const targetFPS = performanceTier === 'high' ? 12 : 8;
    const frameInterval = 1000 / targetFPS;

    const resize = () => {
      // Cap DPR at 1 for performance
      const dpr = 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Initialize very sparse grid - only 20% density
      const cols = Math.ceil(window.innerWidth / cellSize);
      const rows = Math.ceil(window.innerHeight / cellSize);
      
      gridRef.current = [];
      for (let y = 0; y < rows; y++) {
        const row: { char: string; progress: number; speed: number }[] = [];
        for (let x = 0; x < cols; x++) {
          // Only populate ~20% of cells for sparse effect
          if (Math.random() > 0.8) {
            row.push({
              char: chars[Math.floor(Math.random() * chars.length)],
              progress: Math.random(),
              speed: 0.003 + Math.random() * 0.007
            });
          } else {
            row.push({ char: '', progress: 0, speed: 0 });
          }
        }
        gridRef.current.push(row);
      }
    };
    
    resize();
    
    // Debounced resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 300);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const baseOpacity = opacity;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${cellSize * 0.5}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const grid = gridRef.current;
      const charArray = chars;
      const dark = isDarkMode;

      for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x];
          if (!cell.char) continue;
          
          cell.progress += cell.speed * (glitchSpeed / 60);
          
          if (cell.progress >= 1) {
            cell.progress = 0;
            cell.char = charArray[Math.floor(Math.random() * charArray.length)];
          }
          
          const charOpacity = 0.3 + Math.sin(cell.progress * Math.PI) * 0.7;
          
          ctx.fillStyle = dark
            ? `hsla(260, 30%, 60%, ${baseOpacity * charOpacity})`
            : `hsla(260, 20%, 40%, ${baseOpacity * charOpacity * 0.4})`;
          
          ctx.fillText(
            cell.char,
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2
          );
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isTabVisible, shouldDisable, isDarkMode, opacity, glitchSpeed, chars, isInView, performanceTier]);

  if (shouldDisable) return null;

  return (
    <div ref={viewRef as React.RefObject<HTMLDivElement>} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          mixBlendMode: isDarkMode ? 'screen' : 'multiply',
          opacity: isDarkMode ? 1 : 0.6,
          contain: 'strict',
        }}
        aria-hidden="true"
      />
    </div>
  );
});

LetterGlitch.displayName = 'LetterGlitch';

export default LetterGlitch;

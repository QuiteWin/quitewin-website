import { useEffect, useRef, useState, useMemo } from "react";

interface LetterGlitchProps {
  opacity?: number;
  glitchSpeed?: number;
}

const LetterGlitch = ({ opacity = 0.08, glitchSpeed = 60 }: LetterGlitchProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const gridRef = useRef<{ char: string; progress: number; speed: number }[][]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Memoize chars to prevent recreation
  const chars = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*", []);
  
  // Detect if we should disable for performance
  const shouldDisable = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      navigator.hardwareConcurrency <= 2
    );
  }, []);

  // Tab visibility - minimal listener
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

  // Main animation - heavily optimized
  useEffect(() => {
    if (shouldDisable || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Use smaller cell size and lower density
    const cellSize = 32;
    const targetFPS = 15;
    const frameInterval = 1000 / targetFPS;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1); // Cap DPR at 1 for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      // Initialize sparse grid
      const cols = Math.ceil(window.innerWidth / cellSize);
      const rows = Math.ceil(window.innerHeight / cellSize);
      
      gridRef.current = [];
      for (let y = 0; y < rows; y++) {
        const row: { char: string; progress: number; speed: number }[] = [];
        for (let x = 0; x < cols; x++) {
          // Only populate ~30% of cells for sparse effect
          if (Math.random() > 0.7) {
            row.push({
              char: chars[Math.floor(Math.random() * chars.length)],
              progress: Math.random(),
              speed: 0.005 + Math.random() * 0.01
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
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 250);
    };
    window.addEventListener('resize', handleResize);

    // Pre-calculate color
    const baseOpacity = opacity;

    const animate = (timestamp: number) => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - lastFrameTime.current;
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${cellSize * 0.6}px "JetBrains Mono", monospace`;
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
            : `hsla(260, 20%, 40%, ${baseOpacity * charOpacity * 0.5})`;
          
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
  }, [isVisible, shouldDisable, isDarkMode, opacity, glitchSpeed, chars]);

  if (shouldDisable) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        mixBlendMode: isDarkMode ? 'screen' : 'multiply',
        opacity: isDarkMode ? 1 : 0.7,
        contain: 'strict',
        willChange: 'auto',
      }}
      aria-hidden="true"
    />
  );
};

export default LetterGlitch;

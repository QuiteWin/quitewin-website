import { useEffect, useRef, useCallback } from 'react';

interface ScrambledTextProps {
  children: string;
  radius?: number;
  duration?: number;
  scrambleChars?: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
}

const ScrambledText = ({
  children,
  radius = 100,
  duration = 800,
  scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
  className = '',
  as: Component = 'p'
}: ScrambledTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const animationsRef = useRef<Map<HTMLSpanElement, number>>(new Map());
  const originalCharsRef = useRef<string[]>([]);

  const scrambleChar = useCallback((char: HTMLSpanElement, original: string, progress: number) => {
    if (progress >= 1) {
      char.textContent = original;
      return;
    }
    
    // More scrambling at the start, resolve toward the end
    if (Math.random() > progress) {
      const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      char.textContent = randomChar;
    } else {
      char.textContent = original;
    }
  }, [scrambleChars]);

  const animateChar = useCallback((char: HTMLSpanElement, original: string, startTime: number) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      scrambleChar(char, original, progress);
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        animationsRef.current.set(char, frameId);
      } else {
        animationsRef.current.delete(char);
      }
    };
    
    animate();
  }, [duration, scrambleChar]);

  useEffect(() => {
    if (!containerRef.current) return;

    const textElement = containerRef.current.querySelector('[data-scramble-text]');
    if (!textElement) return;

    // Clear and rebuild
    textElement.innerHTML = '';
    charsRef.current = [];
    originalCharsRef.current = [];

    // Split text into characters
    const text = children;
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.whiteSpace = char === ' ' ? 'pre' : 'normal';
      span.style.willChange = 'contents';
      textElement.appendChild(span);
      charsRef.current.push(span);
      originalCharsRef.current.push(char);
    });

    const handleMove = (e: PointerEvent) => {
      charsRef.current.forEach((char, index) => {
        const rect = char.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius && !animationsRef.current.has(char)) {
          // Cancel any existing animation
          const existingAnimation = animationsRef.current.get(char);
          if (existingAnimation) {
            cancelAnimationFrame(existingAnimation);
          }
          
          // Start new scramble animation
          const original = originalCharsRef.current[index];
          if (original && original !== ' ') {
            animateChar(char, original, Date.now());
          }
        }
      });
    };

    const el = containerRef.current;
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      // Cancel all animations
      animationsRef.current.forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
      animationsRef.current.clear();
    };
  }, [children, radius, animateChar]);

  return (
    <div ref={containerRef} className={`inline ${className}`}>
      <Component data-scramble-text className="inline">
        {children}
      </Component>
    </div>
  );
};

export default ScrambledText;

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, memo, useCallback } from "react";
import { throttle, usePrefersReducedMotion, useIsLowEndDevice } from "@/hooks/usePerformance";

const GhostCursor = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowEnd = useIsLowEndDevice();
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Lighter spring for lower CPU usage
  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const checkTheme = () => {
      setIsNightMode(!document.documentElement.classList.contains("light-mode"));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let idleTimer: ReturnType<typeof setTimeout>;
    
    // Throttled mouse handler - 30ms (~33fps)
    const handleMouseMove = throttle((e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsVisible(false), 3000);
    }, 30);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      clearTimeout(idleTimer);
    };
  }, [cursorX, cursorY]);

  // Don't render on mobile, light mode, reduced motion, or low-end devices
  if (isMobile || !isNightMode || prefersReducedMotion || isLowEnd) return null;

  return (
    <>
      {/* Outer glow ring - simplified animation */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          willChange: 'transform',
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full mix-blend-screen"
          animate={{
            opacity: isVisible ? 0.4 : 0,
            scale: isVisible ? 1.1 : 0.5,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          style={{
            background: "radial-gradient(circle, hsl(263 70% 66% / 0.4) 0%, transparent 70%)",
          }}
        />
      </motion.div>
      
      {/* Inner core */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          willChange: 'transform',
        }}
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          animate={{
            opacity: isVisible ? 0.8 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: "hsl(var(--neon-purple))",
            boxShadow: "0 0 8px hsl(263 70% 66% / 0.5)",
          }}
        />
      </motion.div>
    </>
  );
});

GhostCursor.displayName = 'GhostCursor';

export default GhostCursor;

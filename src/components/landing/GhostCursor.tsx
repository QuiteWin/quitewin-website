import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const GhostCursor = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200 };
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

    let idleTimer: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      clearTimeout(idleTimer);
    };
  }, [cursorX, cursorY]);

  if (isMobile || !isNightMode) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full"
          animate={{
            opacity: isVisible ? [0.3, 0.6, 0.3] : 0,
            scale: isVisible ? [1, 1.2, 1] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
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
        }}
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          animate={{
            opacity: isVisible ? 0.8 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: "hsl(var(--neon-purple))",
            boxShadow: "0 0 10px hsl(263 70% 66% / 0.6), 0 0 20px hsl(263 70% 66% / 0.4)",
          }}
        />
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="w-24 h-24 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(263 70% 66% / 0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </>
  );
};

export default GhostCursor;

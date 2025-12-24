import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface TextScrambleProps {
  children: string;
  className?: string;
  delay?: number;
  speed?: number;
  scrambleOnHover?: boolean;
  continuous?: boolean;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

const TextScramble = ({
  children,
  className = "",
  delay = 0,
  speed = 50,
  scrambleOnHover = false,
  continuous = false,
}: TextScrambleProps) => {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: !continuous, margin: "-50px" });
  const hasAnimated = useRef(false);

  const scramble = (targetText: string) => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    const originalText = targetText;
    const length = originalText.length;
    let iteration = 0;
    const maxIterations = length * 3;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iteration++;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(originalText);
        setIsScrambling(false);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      const timer = setTimeout(() => {
        scramble(children);
        if (!continuous) hasAnimated.current = true;
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, children, delay, continuous]);

  useEffect(() => {
    if (continuous && isInView) {
      const interval = setInterval(() => {
        scramble(children);
      }, 5000 + Math.random() * 3000);
      return () => clearInterval(interval);
    }
  }, [continuous, isInView, children]);

  const handleMouseEnter = () => {
    if (scrambleOnHover) {
      scramble(children);
    }
  };

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {displayText}
    </span>
  );
};

export default TextScramble;

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface FallingTextProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  trigger?: "inView" | "hover" | "immediate";
  delay?: number;
  onComplete?: () => void;
  fall?: boolean;
}

const FallingText = ({
  text,
  highlightWords = [],
  className = "",
  trigger = "inView",
  delay = 0,
  onComplete,
  fall = false,
}: FallingTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldFall, setShouldFall] = useState(false);

  const words = text.split(" ");

  useEffect(() => {
    if (fall) {
      setShouldFall(true);
    }
  }, [fall]);

  useEffect(() => {
    if (shouldFall) {
      controls.start("fall");
      return;
    }
    
    if (trigger === "immediate" && !hasAnimated) {
      setTimeout(() => {
        controls.start("visible");
        setHasAnimated(true);
      }, delay * 1000);
    } else if (trigger === "inView" && isInView && !hasAnimated) {
      setTimeout(() => {
        controls.start("visible");
        setHasAnimated(true);
      }, delay * 1000);
    }
  }, [isInView, controls, trigger, hasAnimated, delay, shouldFall]);

  const handleHover = () => {
    if (trigger === "hover" && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
    fall: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    fall: (i: number) => ({
      opacity: 0,
      y: 200,
      rotateX: 45,
      rotateZ: (i % 2 === 0 ? 1 : -1) * (10 + i * 3),
      x: (i % 2 === 0 ? 1 : -1) * (20 + i * 10),
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    }),
  };

  const isHighlighted = (word: string) => {
    const cleanWord = word.replace(/[.,!?]/g, "").toLowerCase();
    return highlightWords.some((hw) => hw.toLowerCase() === cleanWord);
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-wrap gap-x-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      onHoverStart={handleHover}
      onAnimationComplete={() => {
        if (onComplete && shouldFall) {
          onComplete();
        }
      }}
      style={{ perspective: "1000px" }}
    >
    {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          custom={index}
          className={`inline-block ${
            isHighlighted(word)
              ? "text-neon-purple font-bold"
              : ""
          }`}
          style={{ 
            transformStyle: "preserve-3d",
            display: "inline-block",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default FallingText;

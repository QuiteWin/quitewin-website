import { useMemo } from "react";

export type AnimationVariant = 
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "rotate-in"
  | "blur-in"
  | "glitch"
  | "typewriter"
  | "wave";

interface AnimationConfig {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Record<string, number | string | boolean>;
}

const animationConfigs: Record<AnimationVariant, AnimationConfig> = {
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  "fade-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  "slide-left": {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  "slide-right": {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  "scale-up": {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "backOut" },
  },
  "rotate-in": {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.7, ease: "easeOut" },
  },
  "blur-in": {
    initial: { opacity: 0, filter: "blur(20px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.9, ease: "easeOut" },
  },
  "glitch": {
    initial: { opacity: 0, x: -20, skewX: 10 },
    animate: { opacity: 1, x: 0, skewX: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  "typewriter": {
    initial: { opacity: 0, width: "0%" },
    animate: { opacity: 1, width: "100%" },
    transition: { duration: 1.2, ease: "linear" },
  },
  "wave": {
    initial: { opacity: 0, y: 30, rotate: 3 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const variants: AnimationVariant[] = [
  "fade-up",
  "fade-down",
  "slide-left",
  "slide-right",
  "scale-up",
  "rotate-in",
  "blur-in",
  "glitch",
  "wave",
];

// Get a random animation that persists for the session
const getSessionAnimation = (): AnimationVariant => {
  const stored = sessionStorage.getItem("page-animation-variant");
  if (stored && variants.includes(stored as AnimationVariant)) {
    return stored as AnimationVariant;
  }
  const randomIndex = Math.floor(Math.random() * variants.length);
  const selected = variants[randomIndex];
  sessionStorage.setItem("page-animation-variant", selected);
  return selected;
};

export const useRandomAnimation = (customDelay?: number) => {
  const variant = useMemo(() => getSessionAnimation(), []);
  const config = animationConfigs[variant];

  return {
    variant,
    initial: config.initial,
    animate: config.animate,
    transition: customDelay 
      ? { ...config.transition, delay: customDelay }
      : config.transition,
  };
};

// Force a new random animation on next load
export const refreshAnimation = () => {
  sessionStorage.removeItem("page-animation-variant");
};

export default useRandomAnimation;

import { memo, ReactNode, useRef, useState, useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface LazyAnimationProps extends MotionProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * LazyAnimation - Wraps children in a motion component that only animates when in view.
 * Uses IntersectionObserver for efficient viewport detection.
 */
export const LazyAnimation = memo(({
  children,
  className = '',
  rootMargin = '50px',
  threshold = 0.1,
  once = true,
  as = 'div',
  initial,
  animate,
  transition,
  ...motionProps
}: LazyAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Skip if already animated and once mode
    if (once && hasAnimated) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasAnimated(true);
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once, hasAnimated]);
  
  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;
  
  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={transition}
      style={{
        willChange: isInView ? 'transform, opacity' : 'auto',
      }}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  );
});

LazyAnimation.displayName = 'LazyAnimation';

/**
 * AnimatedSection - A section wrapper that pauses animations when out of view
 */
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export const AnimatedSection = memo(({
  children,
  className = '',
  onVisibilityChange,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        onVisibilityChange?.(visible);
      },
      { rootMargin: '100px', threshold: 0 }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [onVisibilityChange]);
  
  return (
    <section 
      ref={ref} 
      className={className}
      data-visible={isVisible}
    >
      {children}
    </section>
  );
});

AnimatedSection.displayName = 'AnimatedSection';

export default LazyAnimation;

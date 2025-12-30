import { motion } from "framer-motion";
import { useState, memo, useCallback } from "react";
import { useInView } from "@/hooks/usePerformance";

interface Logo {
  name: string;
  icon: string;
}

interface LogoGroup {
  category: string;
  logos: Logo[];
}

const logoGroups: LogoGroup[] = [
  {
    category: "Operating Systems",
    logos: [
      { name: "Windows", icon: "🪟" },
      { name: "macOS", icon: "🍎" },
      { name: "Linux", icon: "🐧" },
    ],
  },
  {
    category: "Meeting Apps",
    logos: [
      { name: "Google Meet", icon: "📞" },
      { name: "Zoom", icon: "📹" },
      { name: "Teams", icon: "💬" },
    ],
  },
  {
    category: "AI Models",
    logos: [
      { name: "Ollama", icon: "🦙" },
      { name: "Gemini", icon: "✨" },
      { name: "OpenAI", icon: "🤖" },
      { name: "Grok", icon: "🧠" },
    ],
  },
];

// Flatten groups into a single array with category labels
const createLoopItems = () => {
  const items: { type: "label" | "logo"; name: string; icon?: string }[] = [];
  logoGroups.forEach((group) => {
    items.push({ type: "label", name: group.category });
    group.logos.forEach((logo) => {
      items.push({ type: "logo", name: logo.name, icon: logo.icon });
    });
  });
  return items;
};

const loopItems = createLoopItems();

// Memoized logo item to prevent unnecessary re-renders
const LogoItem = memo(({ 
  item, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  item: { type: "label" | "logo"; name: string; icon?: string };
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  if (item.type === "label") {
    return (
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-purple/30 bg-neon-purple/5">
        <span className="text-xs font-mono font-semibold text-neon-purple uppercase tracking-wider whitespace-nowrap">
          {item.name}
        </span>
      </div>
    );
  }
  
  return (
    <div
      className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        transform: isHovered ? 'scale(1.2) translateY(-6px)' : 'scale(1) translateY(0)',
      }}
    >
      <div
        className="w-16 h-16 rounded-xl glass-card flex items-center justify-center text-3xl transition-shadow duration-200"
        style={{
          boxShadow: isHovered 
            ? "0 0 20px hsl(var(--neon-purple) / 0.3)"
            : "none",
        }}
      >
        {item.icon}
      </div>
      <span
        className={`text-xs font-mono transition-colors duration-200 ${
          isHovered ? "text-neon-purple" : "text-muted-foreground"
        }`}
      >
        {item.name}
      </span>
    </div>
  );
});

LogoItem.displayName = 'LogoItem';

const LogoLoop = memo(() => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
  const [ref, isInView] = useInView({ rootMargin: '100px' });

  const duplicatedItems = [...loopItems, ...loopItems];

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    setHoveredLogo(null);
  }, []);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-6 mb-6">
        <p className="text-center text-sm font-mono text-muted-foreground">
          WORKS WITH YOUR STACK
        </p>
      </div>

      <motion.div
        className="flex items-center gap-8 py-4"
        animate={{
          x: isPaused || !isInView ? 0 : [0, -50 * loopItems.length * 4],
        }}
        transition={{
          x: {
            duration: 50, // Slower animation = less CPU
            repeat: Infinity,
            ease: "linear",
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ willChange: isInView ? 'transform' : 'auto' }}
      >
        {duplicatedItems.map((item, index) => (
          <LogoItem
            key={`${item.name}-${index}`}
            item={item}
            isHovered={hoveredLogo === item.name}
            onHover={() => setHoveredLogo(item.name)}
            onLeave={() => setHoveredLogo(null)}
          />
        ))}
      </motion.div>
    </section>
  );
});

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;

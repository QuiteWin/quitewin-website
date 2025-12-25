import { motion } from "framer-motion";
import { useState } from "react";

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

const LogoLoop = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  const duplicatedItems = [...loopItems, ...loopItems];

  return (
    <section className="py-12 relative overflow-hidden">
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
          x: isPaused ? 0 : [0, -50 * loopItems.length * 4],
        }}
        transition={{
          x: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredLogo(null);
        }}
      >
        {duplicatedItems.map((item, index) =>
          item.type === "label" ? (
            <motion.div
              key={`label-${item.name}-${index}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-purple/30 bg-neon-purple/5"
            >
              <span className="text-xs font-mono font-semibold text-neon-purple uppercase tracking-wider whitespace-nowrap">
                {item.name}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={`${item.name}-${index}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
              onMouseEnter={() => setHoveredLogo(item.name)}
              onMouseLeave={() => setHoveredLogo(null)}
              animate={{
                scale: hoveredLogo === item.name ? 1.3 : 1,
                y: hoveredLogo === item.name ? -8 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="w-16 h-16 rounded-xl glass-card flex items-center justify-center text-3xl"
                animate={{
                  boxShadow:
                    hoveredLogo === item.name
                      ? "0 0 30px hsl(var(--neon-purple) / 0.4)"
                      : "0 0 0px transparent",
                }}
              >
                {item.icon}
              </motion.div>
              <span
                className={`text-xs font-mono transition-colors duration-200 ${
                  hoveredLogo === item.name ? "text-neon-purple" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </span>
            </motion.div>
          )
        )}
      </motion.div>
    </section>
  );
};

export default LogoLoop;

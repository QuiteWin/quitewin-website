import { motion } from "framer-motion";
import { useState } from "react";

interface Logo {
  name: string;
  icon: string;
}

const logos: Logo[] = [
  { name: "Ollama", icon: "🦙" },
  { name: "Gemini", icon: "✨" },
  { name: "OpenAI", icon: "🤖" },
  { name: "Zoom", icon: "📹" },
  { name: "Teams", icon: "💬" },
  { name: "Windows", icon: "🪟" },
  { name: "macOS", icon: "🍎" },
  { name: "Linux", icon: "🐧" },
];

const LogoLoop = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  const duplicatedLogos = [...logos, ...logos];

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
        className="flex gap-12 py-4"
        animate={{
          x: isPaused ? 0 : [0, -50 * logos.length * 8],
        }}
        transition={{
          x: {
            duration: 30,
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
        {duplicatedLogos.map((logo, index) => (
          <motion.div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
            onMouseEnter={() => setHoveredLogo(logo.name)}
            onMouseLeave={() => setHoveredLogo(null)}
            animate={{
              scale: hoveredLogo === logo.name ? 1.3 : 1,
              y: hoveredLogo === logo.name ? -8 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="w-16 h-16 rounded-xl glass-card flex items-center justify-center text-3xl"
              animate={{
                boxShadow:
                  hoveredLogo === logo.name
                    ? "0 0 30px hsl(263 70% 66% / 0.4)"
                    : "0 0 0px transparent",
              }}
            >
              {logo.icon}
            </motion.div>
            <motion.span
              className="text-xs font-mono text-muted-foreground"
              animate={{
                color:
                  hoveredLogo === logo.name
                    ? "hsl(263 70% 66%)"
                    : "hsl(var(--muted-foreground))",
              }}
            >
              {logo.name}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default LogoLoop;

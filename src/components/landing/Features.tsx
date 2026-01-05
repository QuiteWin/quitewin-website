import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Ghost, Brain, EyeOff, Zap, Lock, Eye } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Ghost,
    title: "Auto-Ghost AI",
    tagline: "Autonomous Typing",
    description: "Our 'Ghost Mode' types AI responses directly into your editor with human-like rhythms. No more Alt-Tabbing. It mimics your speed, includes natural pauses, and even simulates minor typos for absolute realism.",
    color: "neon-purple",
  },
  {
    icon: Brain,
    title: "Smart RAG",
    tagline: "Personalized Expert",
    description: "QuiteWin learns you. Upload your resume, GitHub bio, and portfolios. Our RAG engine injects your personal context into every answer, ensuring responses match your real-world experience perfectly.",
    color: "neon-pink",
  },
  {
    icon: EyeOff,
    title: "Ultimate Stealth Mode",
    tagline: "Invisible to Everyone",
    description: "Invisible to screen sharing. Cloaked from task managers. With 'Paranoid Stealth' and hardware-level invisibility, QuiteWin exists only for your eyes.",
    color: "neon-green",
  },
  {
    icon: Zap,
    title: "Parallel AI Race",
    tagline: "Multi-Model Intelligence",
    description: "Don't settle for one opinion. QuiteWin queries multiple models (LLaVA, Llama 3, Gemini, GPT-4o) simultaneously and delivers the highest-quality refined answer in milliseconds.",
    color: "neon-cyan",
  },
  {
    icon: Lock,
    title: "Local-First Privacy",
    tagline: "Your Data, Your Rules",
    description: "Switch to Local Mode with Ollama support. Your data, transcriptions, and secrets never leave your machine. Maximum privacy for high-stakes sessions.",
    color: "neon-amber",
  },
  {
    icon: Eye,
    title: "Multi-Modal Vision & Audio",
    tagline: "Sees & Hears Everything",
    description: "Real-time screen OCR and high-accuracy Whisper transcription. It sees what you see and hears what you hear—context without compromise.",
    color: "neon-purple",
  },
];

const getColorStyles = (color: string) => {
  const colorMap: Record<string, { text: string; bg: string; border: string; glow: string; hsl: string }> = {
    "neon-purple": {
      text: "text-neon-purple",
      bg: "bg-neon-purple/10",
      border: "border-neon-purple/30",
      glow: "hsl(263 70% 66% / 0.4)",
      hsl: "263 70% 66%",
    },
    "neon-pink": {
      text: "text-neon-pink",
      bg: "bg-neon-pink/10",
      border: "border-neon-pink/30",
      glow: "hsl(330 90% 66% / 0.4)",
      hsl: "330 90% 66%",
    },
    "neon-green": {
      text: "text-neon-green",
      bg: "bg-neon-green/10",
      border: "border-neon-green/30",
      glow: "hsl(160 84% 39% / 0.4)",
      hsl: "160 84% 39%",
    },
    "neon-cyan": {
      text: "text-neon-cyan",
      bg: "bg-neon-cyan/10",
      border: "border-neon-cyan/30",
      glow: "hsl(190 95% 50% / 0.4)",
      hsl: "190 95% 50%",
    },
    "neon-amber": {
      text: "text-neon-amber",
      bg: "bg-neon-amber/10",
      border: "border-neon-amber/30",
      glow: "hsl(38 92% 50% / 0.4)",
      hsl: "38 92% 50%",
    },
  };
  return colorMap[color] || colorMap["neon-purple"];
};

interface TiltCardProps {
  children: React.ReactNode;
  color: string;
  className?: string;
}

const TiltCard = ({ children, color, className = "" }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = getColorStyles(color);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Glow that follows cursor */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${colors.glow}, transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Built Different</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Not another chatbot. A stealth HUD designed for developers.
          </p>
          <p className="text-sm font-mono text-muted-foreground/60">
            Private by default. Powerful on demand.
          </p>
        </motion.div>

        {/* Bento Grid with Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
          {features.map((feature, index) => {
            const colors = getColorStyles(feature.color);
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TiltCard color={feature.color}>
                  <motion.div
                    className={`h-full glass-card p-8 rounded-2xl relative overflow-hidden ${colors.border} border transition-all duration-300`}
                    whileHover={{
                      boxShadow: `0 0 40px ${colors.glow}`,
                    }}
                  >
                    {/* Gradient background that follows hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, hsl(${colors.hsl} / 0.15) 0%, transparent 60%)`,
                      }}
                    />

                    <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
                      {/* Icon */}
                      <motion.div
                        className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6 relative`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                        <motion.div
                          className={`absolute inset-0 rounded-xl ${colors.bg}`}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>

                      {/* Tagline */}
                      <p className={`text-sm font-mono ${colors.text} mb-3`}>
                        "{feature.tagline}"
                      </p>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

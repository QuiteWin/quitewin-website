import { motion } from "framer-motion";
import { EyeOff, Image, Mic, Sparkles, Shield, Cpu } from "lucide-react";

const features = [
  {
    icon: EyeOff,
    title: "Ghost Overlay",
    tagline: "Invisible to Zoom. Invisible to Teams.",
    description: "OS-native screen protection using setContentProtection. Your AI stays hidden during any screen share.",
    color: "neon-purple",
    gradient: "from-neon-purple/20 to-transparent",
  },
  {
    icon: Image,
    title: "Vision Intelligence",
    tagline: "See what you see.",
    description: "Drag & drop screenshots for instant multimodal analysis. Powered by LLaVA & Moondream models.",
    color: "neon-pink",
    gradient: "from-neon-pink/20 to-transparent",
  },
  {
    icon: Mic,
    title: "Adaptive Audio",
    tagline: "Only your voice matters.",
    description: "Smart voice detection that ignores fans, keyboard noise, and background hum. Crystal clear transcription.",
    color: "neon-green",
    gradient: "from-neon-green/20 to-transparent",
  },
  {
    icon: Shield,
    title: "Privacy Shield",
    tagline: "Your data never leaves.",
    description: "100% local processing option. No cloud required. Your conversations, your hardware, your rules.",
    color: "neon-cyan",
    gradient: "from-neon-cyan/20 to-transparent",
  },
  {
    icon: Cpu,
    title: "Hybrid Engine",
    tagline: "Best of both worlds.",
    description: "Switch between local Ollama models and cloud APIs like Gemini/GPT with a single toggle.",
    color: "neon-amber",
    gradient: "from-neon-amber/20 to-transparent",
  },
  {
    icon: Sparkles,
    title: "Smart Context",
    tagline: "It just understands.",
    description: "Remembers your workflow, adapts to your style, and provides contextually relevant assistance.",
    color: "neon-purple",
    gradient: "from-neon-purple/20 to-transparent",
  },
];

const getColorClass = (color: string) => {
  const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    "neon-purple": {
      text: "text-neon-purple",
      bg: "bg-neon-purple/10",
      border: "border-neon-purple/30",
      glow: "0 0 30px hsl(263 70% 66% / 0.3)",
    },
    "neon-pink": {
      text: "text-neon-pink",
      bg: "bg-neon-pink/10",
      border: "border-neon-pink/30",
      glow: "0 0 30px hsl(330 90% 66% / 0.3)",
    },
    "neon-green": {
      text: "text-neon-green",
      bg: "bg-neon-green/10",
      border: "border-neon-green/30",
      glow: "0 0 30px hsl(160 84% 39% / 0.3)",
    },
    "neon-cyan": {
      text: "text-neon-cyan",
      bg: "bg-neon-cyan/10",
      border: "border-neon-cyan/30",
      glow: "0 0 30px hsl(190 95% 50% / 0.3)",
    },
    "neon-amber": {
      text: "text-neon-amber",
      bg: "bg-neon-amber/10",
      border: "border-neon-amber/30",
      glow: "0 0 30px hsl(38 92% 50% / 0.3)",
    },
  };
  return colorMap[color] || colorMap["neon-purple"];
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Not another chatbot. A stealth HUD designed for developers.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = getColorClass(feature.color);
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
                <motion.div
                  className={`h-full glass-card-hover p-8 rounded-2xl relative overflow-hidden ${colors.border} border`}
                  whileHover={{
                    boxShadow: colors.glow,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={`w-7 h-7 ${colors.text}`} />
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

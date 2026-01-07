import { motion } from "framer-motion";
import { Ghost, Shield, Brain, Lock, Eye, EyeOff, Keyboard, FileText, Zap } from "lucide-react";
import { useState } from "react";

const usps = [
  {
    icon: Shield,
    title: "Absolute Stealth Architecture",
    tagline: "Engineered for Cyber-Stealth",
    copy: "Unlike generic browser extensions or visible overlay apps, QuiteWin is engineered for Cyber-Stealth.",
    points: [
      { icon: EyeOff, label: "Invisibility", desc: "Our UI uses hardware-level cloaking, making it undetectable to Zoom, Teams, and Google Meet." },
      { icon: Lock, label: "Zero Trace", desc: "It doesn't hook into browser processes, making it safe for high-security environments." }
    ],
    color: "purple"
  },
  {
    icon: Ghost,
    title: "Auto-Ghost AI",
    tagline: "Autonomous Typing",
    copy: "The \"Holy Grail\" of AI assistance. No Alt-Tab. No Copy-Paste.",
    points: [
      { icon: Keyboard, label: "No Alt-Tab Required", desc: "QuiteWin types AI-generated code and text directly into your editor or browser." },
      { icon: Eye, label: "Humanized Rhythm", desc: "It mimics your natural typing speed, pauses to simulate thought, and even includes realistic, self-corrected typos. It looks 100% human to anyone watching." }
    ],
    color: "green"
  },
  {
    icon: Brain,
    title: "Smart RAG",
    tagline: "Personalized Expert",
    copy: "QuiteWin doesn't just give answers; it gives your answers.",
    points: [
      { icon: FileText, label: "Context-Aware", desc: "Upload your resume, GitHub, and portfolios." },
      { icon: Brain, label: "Your Real-World Experience", desc: "The AI uses your actual background to answer questions, ensuring everything it says aligns perfectly with your resume and personal brand." }
    ],
    color: "pink"
  },
  {
    icon: Zap,
    title: "Parallel AI Race",
    tagline: "Deep Reasoning",
    copy: "Don't settle for one model. Get the best answer, fast.",
    points: [
      { icon: Zap, label: "Multi-Model Queries", desc: "We query Llama 3, Gemini, and GPT-4o simultaneously to deliver the world's fastest, most refined response." },
      { icon: Lock, label: "Local-First Privacy", desc: "Toggle 100% Offline Mode. Your audio, transcripts, and code stay on your GPU. Zero data leaks, zero cloud logs." }
    ],
    color: "amber"
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
    purple: { text: "text-neon-purple", border: "border-neon-purple/30", bg: "bg-neon-purple/10", glow: "shadow-neon-purple/20" },
    green: { text: "text-neon-green", border: "border-neon-green/30", bg: "bg-neon-green/10", glow: "shadow-neon-green/20" },
    pink: { text: "text-neon-pink", border: "border-neon-pink/30", bg: "bg-neon-pink/10", glow: "shadow-neon-pink/20" },
    amber: { text: "text-neon-amber", border: "border-neon-amber/30", bg: "bg-neon-amber/10", glow: "shadow-neon-amber/20" }
  };
  return colors[color] || colors.purple;
};

const USPs = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-neon-amber uppercase tracking-widest mb-4 block">
            Holographic Mastery
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The{" "}
            <span className="text-gradient-hero">"Big Four"</span>{" "}
            USPs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What makes QuiteWin the career-defining advantage
          </p>
        </motion.div>

        {/* USP Cards Grid - 3D Tilt Glassmorphism */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {usps.map((usp, index) => {
            const colors = getColorClasses(usp.color);
            const Icon = usp.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <motion.div
                key={usp.title}
                className={`glass-card rounded-2xl p-6 lg:p-8 border ${colors.border} hover:shadow-xl ${colors.glow} transition-all duration-500 relative overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: isHovered ? "perspective(1000px) rotateX(2deg) rotateY(-2deg)" : "perspective(1000px) rotateX(0) rotateY(0)",
                  transformStyle: "preserve-3d"
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Holographic gradient overlay */}
                <motion.div
                  className="absolute inset-0 opacity-0 pointer-events-none"
                  animate={{ opacity: isHovered ? 0.1 : 0 }}
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--neon-purple) / 0.3) 0%, hsl(var(--neon-green) / 0.2) 50%, hsl(var(--neon-pink) / 0.3) 100%)`
                  }}
                />
                
                {/* Header */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <motion.div 
                    className={`p-3 rounded-xl ${colors.bg} ${colors.border} border`}
                    animate={{ rotateY: isHovered ? 360 : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{usp.title}</h3>
                    <p className={`text-sm font-mono ${colors.text}`}>{usp.tagline}</p>
                  </div>
                </div>

                {/* Copy */}
                <p className="text-muted-foreground mb-6 relative z-10">{usp.copy}</p>

                {/* Points */}
                <div className="space-y-4 relative z-10">
                  {usp.points.map((point, pIndex) => {
                    const PointIcon = point.icon;
                    return (
                      <motion.div
                        key={point.label}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + pIndex * 0.1 }}
                      >
                        <PointIcon className={`w-4 h-4 ${colors.text} mt-1 flex-shrink-0`} />
                        <div>
                          <span className="font-semibold text-foreground">{point.label}:</span>{" "}
                          <span className="text-muted-foreground text-sm">{point.desc}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default USPs;

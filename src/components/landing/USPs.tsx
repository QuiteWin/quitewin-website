import { motion } from "framer-motion";
import { Ghost, Shield, Brain, Lock, Eye, EyeOff, Keyboard, FileText } from "lucide-react";

const usps = [
  {
    icon: Shield,
    title: "Absolute Stealth Architecture",
    tagline: "Engineered for Cyber-Stealth",
    points: [
      { icon: EyeOff, label: "Invisibility", desc: "Hardware-level cloaking, undetectable to Zoom, Teams & Google Meet" },
      { icon: Lock, label: "Zero Trace", desc: "No browser hooks—safe for high-security environments" }
    ],
    color: "purple"
  },
  {
    icon: Ghost,
    title: "Auto-Ghost AI",
    tagline: "The Holy Grail of AI Assistance",
    points: [
      { icon: Keyboard, label: "No Alt-Tab Required", desc: "Types AI-generated code directly into your editor" },
      { icon: Eye, label: "Humanized Rhythm", desc: "Mimics your typing speed with realistic pauses and self-corrections" }
    ],
    color: "green"
  },
  {
    icon: Brain,
    title: "Smart RAG",
    tagline: "Personalized Memory That Knows You",
    points: [
      { icon: FileText, label: "Context-Aware", desc: "Upload resume, GitHub, and portfolios" },
      { icon: Brain, label: "Your Experience", desc: "AI answers align with your actual background and personal brand" }
    ],
    color: "pink"
  },
  {
    icon: Lock,
    title: "Local-First Privacy",
    tagline: "Absolute Data Sovereignty",
    points: [
      { icon: Shield, label: "Offline Processing", desc: "Run Llama 3 or DeepSeek on your local GPU" },
      { icon: Lock, label: "Secured Data", desc: "Transcripts and secrets never leave your machine" }
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
            The Big Four
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Unique Selling{" "}
            <span className="text-gradient-hero">Propositions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What makes QuiteWin the career-defining advantage
          </p>
        </motion.div>

        {/* USP Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {usps.map((usp, index) => {
            const colors = getColorClasses(usp.color);
            const Icon = usp.icon;
            
            return (
              <motion.div
                key={usp.title}
                className={`glass-card rounded-2xl p-6 lg:p-8 border ${colors.border} hover:shadow-lg ${colors.glow} transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{usp.title}</h3>
                    <p className={`text-sm font-mono ${colors.text}`}>{usp.tagline}</p>
                  </div>
                </div>

                {/* Points */}
                <div className="space-y-4">
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
                          <span className="text-muted-foreground">{point.desc}</span>
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

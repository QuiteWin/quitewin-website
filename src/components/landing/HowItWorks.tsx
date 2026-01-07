import { motion } from "framer-motion";
import { RefreshCw, FileText, Headphones, Rocket } from "lucide-react";

const steps = [
  {
    icon: RefreshCw,
    title: "Sync",
    description: "Connect local or cloud AI providers.",
    color: "neon-purple",
  },
  {
    icon: FileText,
    title: "Context",
    description: "Upload your resume to create your 'Personalized Expert.'",
    color: "neon-green",
  },
  {
    icon: Headphones,
    title: "Engage",
    description: "Start your interview. QuiteWin listens, capturing screen context and scoring your STAR responses in real-time.",
    color: "neon-pink",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "Watch as Auto-Ghost types the solution or refine your answer based on AI-suggested STAR improvements.",
    color: "neon-amber",
  },
];

const getColorClass = (color: string) => {
  const colors: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    "neon-purple": { text: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/30", glow: "hsl(263 70% 66% / 0.4)" },
    "neon-green": { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30", glow: "hsl(160 84% 39% / 0.4)" },
    "neon-pink": { text: "text-neon-pink", bg: "bg-neon-pink/10", border: "border-neon-pink/30", glow: "hsl(330 90% 66% / 0.4)" },
    "neon-amber": { text: "text-neon-amber", bg: "bg-neon-amber/10", border: "border-neon-amber/30", glow: "hsl(38 92% 50% / 0.4)" },
  };
  return colors[color] || colors["neon-purple"];
};

const HowItWorks = () => {
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
            <span className="text-gradient-hero">How It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four steps to your silent advantage.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const colors = getColorClass(step.color);
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.title}
                className="relative flex gap-6 pb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Timeline connector */}
                {!isLast && (
                  <div className="absolute left-7 top-16 bottom-0 w-px bg-gradient-to-b from-border to-transparent" />
                )}

                {/* Step number and icon */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center relative`}
                    whileHover={{ scale: 1.1, boxShadow: `0 0 30px ${colors.glow}` }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center"
                    >
                      <span className={`text-xs font-bold ${colors.text}`}>{index + 1}</span>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <motion.div
                    className="glass-card p-6 rounded-xl border border-border/50 hover:border-border transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
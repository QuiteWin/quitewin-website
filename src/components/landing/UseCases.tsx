import { motion } from "framer-motion";
import { Code2, Headphones, Focus, ShieldCheck } from "lucide-react";

const useCases = [
  {
    icon: Code2,
    title: "Technical Interviews",
    scenario: "Ace your coding interviews with a silent copilot that's invisible to screen shares.",
    why: "Ghost overlay + real-time hints = confidence without detection.",
    color: "neon-purple",
  },
  {
    icon: Headphones,
    title: "Accessibility & Captions",
    scenario: "Real-time transcription and summaries for meetings and lectures.",
    why: "Adaptive audio catches every word while filtering noise.",
    color: "neon-pink",
  },
  {
    icon: Focus,
    title: "Deep Focus Work",
    scenario: "Get instant answers without breaking flow or switching apps.",
    why: "Overlay stays on top, responds instantly, disappears when not needed.",
    color: "neon-green",
  },
  {
    icon: ShieldCheck,
    title: "Security Audits",
    scenario: "Analyze code, logs, and documents with complete privacy.",
    why: "100% local processing means sensitive data never leaves your machine.",
    color: "neon-amber",
  },
];

const getColorClasses = (color: string) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "neon-purple": {
      bg: "bg-neon-purple/10",
      text: "text-neon-purple",
      border: "border-neon-purple/30",
    },
    "neon-pink": {
      bg: "bg-neon-pink/10",
      text: "text-neon-pink",
      border: "border-neon-pink/30",
    },
    "neon-green": {
      bg: "bg-neon-green/10",
      text: "text-neon-green",
      border: "border-neon-green/30",
    },
    "neon-amber": {
      bg: "bg-neon-amber/10",
      text: "text-neon-amber",
      border: "border-neon-amber/30",
    },
  };
  return map[color] || map["neon-purple"];
};

const UseCases = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Use Cases</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            AI that stays invisible. Here's when it matters.
          </p>
        </motion.div>

        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const colors = getColorClasses(useCase.color);
            const Icon = useCase.icon;

            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="h-full glass-card p-6 md:p-8 rounded-2xl border border-border/50 hover:border-border"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4 md:mb-6`}>
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 ${colors.text}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">
                    {useCase.title}
                  </h3>

                  {/* Scenario */}
                  <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                    {useCase.scenario}
                  </p>

                  {/* Why QuiteWin */}
                  <div className={`p-3 md:p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
                    <p className={`text-xs md:text-sm font-mono ${colors.text}`}>
                      ✦ {useCase.why}
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

export default UseCases;


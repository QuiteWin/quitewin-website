import { motion } from "framer-motion";
import { Mic, FileText, Brain, BookOpen, Sparkles, Volume2, Eye, GraduationCap } from "lucide-react";

const benefits = [
  {
    category: "Elite Meeting Management",
    icon: Mic,
    color: "purple",
    items: [
      { icon: FileText, title: "Live Transcription", desc: "Transform 60-minute meetings into searchable text" },
      { icon: Sparkles, title: "One-Click Summarization", desc: "Generate action items and key takeaways instantly" }
    ]
  },
  {
    category: "Communication Mastery",
    icon: Volume2,
    color: "green",
    items: [
      { icon: Mic, title: "Pronunciation Coach", desc: "Naturally train professional enunciation and confidence" },
      { icon: Eye, title: "Visual Feedback", desc: "See exactly how you are being heard in real-time" }
    ]
  },
  {
    category: "Infinite Learning",
    icon: GraduationCap,
    color: "pink",
    items: [
      { icon: BookOpen, title: "Lecture Companion", desc: "Transcribe and chat with any technical video or lecture" },
      { icon: Brain, title: "Skill Refinement", desc: "Compare your explanations with AI-refined answers to upgrade vocabulary" }
    ]
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { text: string; border: string; bg: string }> = {
    purple: { text: "text-neon-purple", border: "border-neon-purple/30", bg: "bg-neon-purple/10" },
    green: { text: "text-neon-green", border: "border-neon-green/30", bg: "bg-neon-green/10" },
    pink: { text: "text-neon-pink", border: "border-neon-pink/30", bg: "bg-neon-pink/10" }
  };
  return colors[color] || colors.purple;
};

const DailyDriver = () => {
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
          <span className="text-xs font-mono text-neon-green uppercase tracking-widest mb-4 block">
            Beyond the Interview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your{" "}
            <span className="text-gradient-hero">Daily Driver</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            QuiteWin is your everyday professional growth engine
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const colors = getColorClasses(benefit.color);
            const CategoryIcon = benefit.icon;
            
            return (
              <motion.div
                key={benefit.category}
                className={`glass-card rounded-2xl p-6 border ${colors.border} hover:border-opacity-60 transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                    <CategoryIcon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-bold text-lg">{benefit.category}</h3>
                </div>

                {/* Items */}
                <div className="space-y-5">
                  {benefit.items.map((item, iIndex) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + iIndex * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <ItemIcon className={`w-4 h-4 ${colors.text} mt-1 flex-shrink-0`} />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
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

export default DailyDriver;

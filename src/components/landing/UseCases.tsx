import { motion } from "framer-motion";
import { useRef } from "react";
import { Code2, Headphones, Focus, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import TextScramble from "./TextScramble";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-hero">
                <TextScramble delay={100} scrambleOnHover>Use Cases</TextScramble>
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              <TextScramble delay={200}>AI that stays invisible. Here's when it matters.</TextScramble>
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:neon-glow-purple transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:neon-glow-purple transition-all"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pt-2 pb-4 snap-x snap-mandatory scrollbar-hide -mt-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {useCases.map((useCase, index) => {
            const colors = getColorClasses(useCase.color);
            const Icon = useCase.icon;

            return (
              <motion.div
                key={useCase.title}
                className="flex-shrink-0 w-[350px] snap-start"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className={`h-full glass-card-hover p-8 rounded-2xl ${colors.border} border`}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    <TextScramble delay={index * 100} scrambleOnHover>{useCase.title}</TextScramble>
                  </h3>

                  {/* Scenario */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {useCase.scenario}
                  </p>

                  {/* Why QuiteWin */}
                  <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
                    <p className={`text-sm font-mono ${colors.text}`}>
                      ✦ {useCase.why}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {useCases.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;

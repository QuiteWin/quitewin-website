import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eye, ShieldOff, Cpu, Database, Share2 } from "lucide-react";

const timelineSteps = [
  {
    icon: Eye,
    title: "Seen only by you",
    description: "QuiteWin renders exclusively to your display buffer. The OS never registers it as a capturable window.",
    color: "neon-purple",
  },
  {
    icon: ShieldOff,
    title: "Blocked from capture",
    description: "setContentProtection prevents all screen recording, screenshots, and video capture at the OS level.",
    color: "neon-green",
  },
  {
    icon: Cpu,
    title: "Processed locally",
    description: "In Private Mode, all AI inference runs on your hardware. Your prompts never leave your device.",
    color: "neon-cyan",
  },
  {
    icon: Database,
    title: "Nothing stored",
    description: "No conversation logs. No query history. No analytics. Memory exists only in RAM.",
    color: "neon-pink",
  },
  {
    icon: Share2,
    title: "Nothing shared",
    description: "Zero telemetry. Zero tracking. Zero third-party data collection. Ever.",
    color: "neon-amber",
  },
];

const getColorClass = (color: string) => {
  const colors: Record<string, { text: string; bg: string; glow: string }> = {
    "neon-purple": { text: "text-neon-purple", bg: "bg-neon-purple/10", glow: "hsl(263 70% 66% / 0.4)" },
    "neon-green": { text: "text-neon-green", bg: "bg-neon-green/10", glow: "hsl(160 84% 39% / 0.4)" },
    "neon-cyan": { text: "text-neon-cyan", bg: "bg-neon-cyan/10", glow: "hsl(190 95% 50% / 0.4)" },
    "neon-pink": { text: "text-neon-pink", bg: "bg-neon-pink/10", glow: "hsl(330 90% 66% / 0.4)" },
    "neon-amber": { text: "text-neon-amber", bg: "bg-neon-amber/10", glow: "hsl(38 92% 50% / 0.4)" },
  };
  return colors[color] || colors["neon-purple"];
};

const TimelineStep = ({ 
  step, 
  index, 
  progress 
}: { 
  step: typeof timelineSteps[0]; 
  index: number;
  progress: number;
}) => {
  const colors = getColorClass(step.color);
  const Icon = step.icon;
  const stepProgress = Math.max(0, Math.min(1, (progress - index * 0.18) / 0.2));
  const isActive = stepProgress > 0.5;
  const isPast = stepProgress >= 1;

  return (
    <motion.div
      className="relative flex gap-6 pb-12 last:pb-0"
      style={{
        opacity: 0.3 + stepProgress * 0.7,
      }}
    >
      {/* Timeline line */}
      {index < timelineSteps.length - 1 && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-border/30">
          <motion.div
            className="w-full bg-gradient-to-b from-current to-transparent"
            style={{
              height: `${stepProgress * 100}%`,
              color: `hsl(var(--${step.color}))`,
            }}
          />
        </div>
      )}

      {/* Icon */}
      <motion.div
        className={`relative z-10 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 transition-all duration-300`}
        style={{
          boxShadow: isActive ? `0 0 30px ${colors.glow}` : "none",
        }}
      >
        <Icon className={`w-6 h-6 ${colors.text} transition-all duration-300`} />
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: colors.glow }}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <motion.h3
          className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            isActive ? colors.text : "text-foreground"
          }`}
        >
          {step.title}
        </motion.h3>
        <motion.p
          className={`text-muted-foreground transition-opacity duration-300 ${
            isPast ? "opacity-60" : ""
          }`}
        >
          {step.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const StealthTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="py-24 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">How QuiteWin Stays Invisible</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Five layers of protection. Zero compromises.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }}>
            {timelineSteps.map((step, index) => (
              <TimelineStep
                key={step.title}
                step={step}
                index={index}
                progress={scrollYProgress.get()}
              />
            ))}
          </motion.div>
          
          {/* Use scroll progress to update steps */}
          <motion.div className="sr-only">
            {scrollYProgress}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StealthTimeline;

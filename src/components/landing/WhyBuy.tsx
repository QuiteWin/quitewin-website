import { motion } from "framer-motion";
import { Trophy, Clock, Rocket, FileCheck, Heart, Download } from "lucide-react";
import MagnetButton from "./MagnetButton";

const benefits = [
  {
    icon: Trophy,
    title: "Confidence",
    desc: "Remove the 'Fear of the Unknown.' Focus on rapport and soft skills while the AI handles the technical heavy lifting.",
    color: "purple"
  },
  {
    icon: Clock,
    title: "Time Savings",
    desc: "Stop spending months on LeetCode. Bridge the gap between your potential and the technical bar.",
    color: "green"
  },
  {
    icon: Rocket,
    title: "Career Trajectory",
    desc: "Land higher-tier roles with the confidence of someone who has a panel of experts in their ear.",
    color: "pink"
  },
  {
    icon: FileCheck,
    title: "Professionalism",
    desc: "Turn disorganized meetings into structured, actionable documentation automatically.",
    color: "amber"
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    purple: { text: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/30" },
    green: { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30" },
    pink: { text: "text-neon-pink", bg: "bg-neon-pink/10", border: "border-neon-pink/30" },
    amber: { text: "text-neon-amber", bg: "bg-neon-amber/10", border: "border-neon-amber/30" }
  };
  return colors[color] || colors.purple;
};

const WhyBuy = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section header with Number Counter Animation */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-neon-amber uppercase tracking-widest mb-4 block">
            The ROI of Excellence
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            1 Successful Interview ={" "}
            <motion.span 
              className="text-gradient-hero"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              $50,000+
            </motion.span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stop Grinding LeetCode in Fear. Start Winning with Confidence.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const colors = getColorClasses(benefit.color);
            const Icon = benefit.icon;
            
            return (
              <motion.div
                key={benefit.title}
                className={`glass-card rounded-2xl p-6 border ${colors.border} hover:shadow-lg transition-all duration-300 text-center`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className={`p-3 rounded-xl ${colors.bg} inline-block mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Final Note */}
        <motion.div
          className="glass-card rounded-2xl p-8 md:p-12 border border-neon-purple/20 text-center max-w-4xl mx-auto relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5 pointer-events-none" />
          
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Your Silent Partner in{" "}
              <span className="text-gradient-hero">Professional Excellence</span>
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              QuiteWin isn't about taking shortcuts—it's about removing the barriers between you and your best professional self. It handles the manual, the stressful, and the organizational, so you can focus on what matters: <span className="text-foreground font-medium">the conversation</span>.
            </p>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyBuy;

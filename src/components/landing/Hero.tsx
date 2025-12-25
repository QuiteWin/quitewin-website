import { motion, AnimatePresence } from "framer-motion";
import { Download, Heart, Shield } from "lucide-react";
import LiveUsers from "./LiveUsers";
import MagnetButton from "./MagnetButton";
import FallingText from "./FallingText";

import { useSilenceMode } from "./SilenceMode";
import { useSessionCodename } from "@/hooks/useSessionCodename";
import { useRandomAnimation } from "@/hooks/useRandomAnimation";
import quitewinLogo from "@/assets/quitewin-logo.png";

// Session Codename component inline
const SessionCodename = () => {
  const codename = useSessionCodename();

  return (
    <motion.div
      className="hidden md:block"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <div className="glass-card rounded-lg px-3 py-2">
        <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-0.5">
          Session
        </div>
        <div className="text-xs font-mono text-neon-purple font-medium">
          {codename}
        </div>
      </div>
    </motion.div>
  );
};

// Silence message component
const SilenceMessage = () => {
  const { isSilenceMode } = useSilenceMode();

  return (
    <AnimatePresence>
      {isSilenceMode && (
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass-card rounded-lg px-4 py-3">
            <p className="text-sm font-mono text-muted-foreground">
              No explanation needed.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Hero = () => {
  const heroAnim = useRandomAnimation();
  const badgeAnim = useRandomAnimation(0.2);
  const subheadAnim = useRandomAnimation(0.8);
  const taglineAnim = useRandomAnimation(0.9);
  const ctaAnim = useRandomAnimation(1.1);
  const rightPanelAnim = useRandomAnimation(0.5);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.15) 0%, transparent 70%)"
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--neon-green) / 0.1) 0%, transparent 70%)"
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -40, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--neon-pink) / 0.08) 0%, transparent 70%)"
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Fixed Logo at Top Left - Outside animated container */}
      <div className="fixed top-6 left-6 z-50">
        <div className="relative group cursor-pointer">
          {/* Revolving brand name */}
          <motion.svg
            className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)]"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
            </defs>
            <text className="fill-amber-400/80 text-[8px] font-mono uppercase tracking-[0.3em]">
              <textPath href="#circlePath" startOffset="0%">
                QuiteWin • Stealth AI • Hybrid AI • 
              </textPath>
            </text>
          </motion.svg>
          
          {/* Animated glow rings */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, hsl(var(--neon-purple)), hsl(var(--neon-green)), hsl(var(--neon-pink)), hsl(var(--neon-amber)), hsl(var(--neon-purple)))",
              filter: "blur(8px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute -inset-1 rounded-full opacity-60"
            style={{
              background: "conic-gradient(from 180deg, hsl(var(--neon-green)), hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-green)))",
              filter: "blur(12px)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          {/* Pulsing outer glow */}
          <motion.div 
            className="absolute -inset-2 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.4) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Logo container */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-amber-500/40 bg-background/50 backdrop-blur-sm shadow-lg shadow-amber-500/20">
            <img 
              src={quitewinLogo} 
              alt="QuiteWin - Stealth AI" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={heroAnim.initial}
            animate={heroAnim.animate}
            transition={heroAnim.transition}
          >
            {/* Main headline with FallingText */}
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <FallingText
                text="Visible to You."
                highlightWords={["Visible"]}
                className="text-gradient-hero justify-center lg:justify-start"
                trigger="inView"
                delay={0.3}
              />
              
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full glass-card neon-border-purple my-2"
                initial={badgeAnim.initial}
                animate={badgeAnim.animate}
                transition={badgeAnim.transition}
              >
                <Shield className="w-2.5 h-2.5 text-neon-green" />
                <span className="text-[10px] font-mono text-muted-foreground">v1.0 Beta • Privacy-First AI</span>
              </motion.div>
              
              <FallingText
                text="Invisible to Everyone Else."
                highlightWords={["Invisible"]}
                className="text-foreground justify-center lg:justify-start mt-2"
                trigger="inView"
                delay={0.5}
              />
            </div>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4"
              initial={subheadAnim.initial}
              animate={subheadAnim.animate}
              transition={subheadAnim.transition}
            >
              The world's first{" "}
              <span className="text-neon-purple font-semibold">Hybrid AI</span>{" "}
              — stealth by design.
            </motion.p>

            <motion.p
              className="text-lg text-muted-foreground/80 max-w-xl mb-6"
              initial={taglineAnim.initial}
              animate={taglineAnim.animate}
              transition={taglineAnim.transition}
            >
              Your silent superpower. AI that stays invisible.
            </motion.p>

            {/* Taglines */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
              initial={taglineAnim.initial}
              animate={taglineAnim.animate}
              transition={{ ...taglineAnim.transition, delay: 1 }}
            >
              {["Private by default", "Powerful on demand", "A stealth HUD"].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-muted/50 text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTAs with MagnetButton */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={ctaAnim.initial}
              animate={ctaAnim.animate}
              transition={ctaAnim.transition}
            >
              <MagnetButton strength={0.2}>
                <motion.button
                  className="btn-cyber-green flex items-center justify-center gap-3 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  Download Beta
                </motion.button>
              </MagnetButton>
              <MagnetButton strength={0.2}>
                <motion.button
                  className="btn-cyber-amber flex items-center justify-center gap-3 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart className="w-5 h-5" />
                  Fuel the Dev
                </motion.button>
              </MagnetButton>
            </motion.div>
          </motion.div>

          {/* Right - Live Users Panel with Session above */}
          <motion.div
            className="flex-shrink-0 flex flex-col items-end gap-3"
            initial={rightPanelAnim.initial}
            animate={rightPanelAnim.animate}
            transition={rightPanelAnim.transition}
          >
            {/* Session Codename above Live HUD */}
            <SessionCodename />
            
            <MagnetButton strength={0.1}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <LiveUsers />
              </motion.div>
            </MagnetButton>
            
            {/* Silence message placeholder - actual message comes from SilenceMode context */}
            <SilenceMessage />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

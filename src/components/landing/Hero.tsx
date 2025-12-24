import { motion } from "framer-motion";
import { Download, Heart, Users, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";

const CountUpNumber = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(263 70% 66% / 0.15) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(160 84% 39% / 0.1) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(330 90% 66% / 0.08) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card neon-border-purple mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Shield className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-mono text-muted-foreground">
                v2.0 Beta • Privacy-First AI
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-gradient-hero">Your Silent</span>
              <br />
              <span className="text-foreground">Superpower.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The world's first <span className="text-neon-purple font-semibold">Hybrid AI HUD</span> — run 100% private or unlock cloud-level power.
            </motion.p>

            <motion.p
              className="text-lg text-muted-foreground/80 max-w-xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Any hardware. Anywhere. AI that stays invisible.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.button
                className="btn-cyber-green flex items-center justify-center gap-3 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                Download Beta
              </motion.button>
              <motion.button
                className="btn-cyber-amber flex items-center justify-center gap-3 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-5 h-5" />
                Fuel the Dev
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Live Stats Panel */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="glass-card p-8 rounded-2xl min-w-[320px] animate-float"
              style={{
                boxShadow: "0 0 60px hsl(263 70% 66% / 0.15), inset 0 0 60px hsl(263 70% 66% / 0.05)",
              }}
            >
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: "linear-gradient(to bottom, transparent 0%, hsl(263 70% 66% / 0.3) 50%, transparent 100%)",
                    animation: "scan-line 3s linear infinite",
                  }}
                />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-neon-green pulse-green" />
                  <span className="font-mono text-sm text-neon-green">LIVE STATUS</span>
                </div>

                <div className="space-y-6">
                  {/* Live Visitors */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-neon-green" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Live Visitors</p>
                      <p className="text-2xl font-bold font-mono text-foreground">
                        <CountUpNumber end={1204} />
                      </p>
                    </div>
                  </div>

                  {/* Queries Served */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Queries Served</p>
                      <p className="text-2xl font-bold font-mono text-foreground">
                        <CountUpNumber end={1200000} suffix="+" duration={2500} />
                      </p>
                    </div>
                  </div>

                  {/* Privacy Mode */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-pink/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-neon-pink" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Privacy Mode</p>
                      <p className="text-lg font-bold font-mono text-neon-green flex items-center gap-2">
                        ACTIVE
                        <span className="w-2 h-2 rounded-full bg-neon-green blink" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5 },
          y: { duration: 2, repeat: Infinity },
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-neon-purple" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

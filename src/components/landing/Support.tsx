import { motion } from "framer-motion";
import { Coffee, Heart, Sparkles } from "lucide-react";
import MagnetButton from "./MagnetButton";


const Support = () => {
  return (
    <section id="support" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, hsl(38 92% 50% / 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Keep the Ghost Alive</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Indie-built. No VC. No trackers. Just passion and code.
          </p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="glass-card p-8 rounded-2xl neon-border-amber relative overflow-hidden"
            whileHover={{
              boxShadow: "0 0 60px hsl(38 92% 50% / 0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(38 92% 50% / 0.3), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />

            <div className="relative z-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-neon-amber/10 flex items-center justify-center"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Coffee className="w-10 h-10 text-neon-amber" />
                </motion.div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-2 text-foreground">
                Buy Me a Coffee
              </h3>

              {/* Subtitle */}
              <p className="text-muted-foreground text-center mb-6">
                Every coffee fuels another feature. Support independent development.
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-neon-amber">
                    <Heart className="w-4 h-4" />
                    <span className="font-mono font-bold">247</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Supporters</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center text-neon-amber">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-mono font-bold">12</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Features Funded</span>
                </div>
              </div>

              {/* CTA Button */}
              <MagnetButton strength={0.15} className="w-full">
                <motion.button
                  className="w-full btn-cyber-amber flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Coffee className="w-5 h-5" />
                  Support Development
                </motion.button>
              </MagnetButton>

              {/* Trust badge */}
              <p className="text-center text-xs text-muted-foreground/60 mt-4">
                🔒 Secure payment via Buy Me a Coffee
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Support;

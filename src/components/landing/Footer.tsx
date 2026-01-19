import { motion } from "framer-motion";
import { useMemo } from "react";
import quitewinLogo from "@/assets/quitewin-logo.png";

const colorPairs = [
  { accent: "text-red-500", base: "text-amber-400" },
  { accent: "text-neon-purple", base: "text-neon-green" },
  { accent: "text-neon-pink", base: "text-neon-cyan" },
  { accent: "text-neon-amber", base: "text-neon-purple" },
  { accent: "text-emerald-400", base: "text-rose-400" },
  { accent: "text-cyan-400", base: "text-orange-400" },
  { accent: "text-violet-400", base: "text-lime-400" },
];

const techSpecs = [
  { category: "AI Providers", items: ["Ollama", "Groq", "Gemini 2.x", "OpenAI", "Anthropic"] },
  { category: "Languages", items: ["50+ Supported", "English", "Spanish", "Mandarin", "Japanese", "German", "French"] },
  { category: "Audio", items: ["Local Whisper", "System Audio"] },
  { category: "OS Support", items: ["Windows", "macOS (Apple Silicon)", "Linux"] },
];

const Footer = () => {
  const colors = useMemo(() => {
    return colorPairs[Math.floor(Math.random() * colorPairs.length)];
  }, []);

  return (
    <footer className="py-16 border-t border-border/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Technical Specifications */}
        <motion.div
          className="mb-12 pb-12 border-b border-border/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-center mb-8 text-muted-foreground">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {techSpecs.map((spec) => (
              <div key={spec.category} className="glass-card p-3 md:p-4 rounded-xl text-center">
                <h4 className="text-xs md:text-sm font-mono text-neon-purple mb-2 md:mb-3">{spec.category}</h4>
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                  {spec.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-mono bg-muted/50 text-muted-foreground border border-border/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Links */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo with glow effect */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Animated glow ring */}
                <motion.div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "conic-gradient(from 0deg, hsl(var(--neon-purple)), hsl(var(--neon-green)), hsl(var(--neon-pink)), hsl(var(--neon-amber)), hsl(var(--neon-purple)))",
                    filter: "blur(4px)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                {/* Pulsing outer glow */}
                <motion.div 
                  className="absolute -inset-1 rounded-lg"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.3) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Logo */}
                <img 
                  src={quitewinLogo} 
                  alt="QuiteWin Logo" 
                  className="relative w-10 h-10 rounded-lg object-contain border border-amber-500/30 bg-background/50 backdrop-blur-sm" 
                />
              </div>
              <span className="font-bold text-xl"><span className={colors.accent}>Q</span><span className={colors.base}>uite</span><span className={colors.accent}>W</span><span className={colors.base}>in</span></span>
            </div>

          </motion.div>

          {/* Platform Badges */}
          <motion.div
            className="flex items-center gap-2 md:gap-4 flex-wrap justify-center md:justify-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {["Windows", "macOS", "Linux"].map((platform) => (
              <div
                key={platform}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg glass-card text-xs md:text-sm font-mono text-muted-foreground"
              >
                {platform}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Disclaimer */}
        {/* Trust Signals & Disclaimer */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-mono bg-muted/30 text-muted-foreground border border-border/30">
              Indie Built
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-mono bg-muted/30 text-muted-foreground border border-border/30">
              Privacy First
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-mono bg-muted/30 text-muted-foreground border border-border/30">
              No VCs
            </span>
            <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-mono bg-muted/30 text-muted-foreground border border-border/30">
              Just Code
            </span>
          </div>
          
          <p className="text-center text-sm text-muted-foreground/60 max-w-2xl mx-auto">
            Built for Windows 11 & macOS. Support for Ollama, Groq, NVIDIA CUDA, and Apple Neural Engine.
          </p>
          
          {/* Invisible Analytics Statement */}
          <p className="text-center text-xs text-muted-foreground/40 mt-6 font-mono">
            This page does not track you.
          </p>
          
          <p className="text-center text-xs text-muted-foreground/40 mt-4">
            © 2026 QuiteWin.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

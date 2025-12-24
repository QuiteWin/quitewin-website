import { motion } from "framer-motion";
import { Github, MessageCircle } from "lucide-react";
import quitewinLogo from "@/assets/quitewin-logo.png";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
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
              <span className="font-bold text-xl text-foreground">QuiteWin</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:neon-glow-purple transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </motion.a>
              <motion.a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:neon-glow-purple transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </motion.a>
            </div>
          </motion.div>

          {/* Platform Badges */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {["Windows", "macOS", "Linux"].map((platform) => (
              <div
                key={platform}
                className="px-4 py-2 rounded-lg glass-card text-sm font-mono text-muted-foreground"
              >
                {platform}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-center text-sm text-muted-foreground/60 max-w-2xl mx-auto">
            QuiteWin is a thinking assistant designed to enhance productivity and accessibility.
            Users are responsible for ethical usage in accordance with applicable laws and platform terms.
          </p>
          
          {/* Invisible Analytics Statement */}
          <p className="text-center text-xs text-muted-foreground/40 mt-6 font-mono">
            This page does not track you.
          </p>
          
          <p className="text-center text-xs text-muted-foreground/40 mt-4">
            © 2026 QuiteWin. Open source. Privacy-first.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

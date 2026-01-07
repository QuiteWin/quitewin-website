import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Monitor, Users, MessageSquare } from "lucide-react";
import { useState } from "react";

const VisibilityDemo = () => {
  const [viewMode, setViewMode] = useState<"my-view" | "screen-share">("my-view");

  return (
    <section id="visibility-demo" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono text-neon-purple uppercase tracking-widest mb-4 block">
            The Reveal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">What You See</span>
            <span className="text-foreground"> vs </span>
            <span className="text-gradient-green">What They See</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            <span className="text-neon-green font-semibold">OS-Level Invisibility.</span>{" "}
            Engineered to be strictly invisible to Zoom, Teams, and Google Meet.
          </p>
          <p className="text-sm font-mono text-muted-foreground/60">
            If they can't see it, they can't detect it.
          </p>
        </motion.div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="glass-card p-1.5 rounded-full flex gap-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setViewMode("my-view")}
              className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                viewMode === "my-view"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {viewMode === "my-view" && (
                <motion.div
                  layoutId="visibility-toggle-bg"
                  className="absolute inset-0 bg-neon-green/20 rounded-full neon-border-green"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Eye className="w-4 h-4 relative z-10" />
              <span className="relative z-10">My View</span>
            </button>
            <button
              onClick={() => setViewMode("screen-share")}
              className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                viewMode === "screen-share"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {viewMode === "screen-share" && (
                <motion.div
                  layoutId="visibility-toggle-bg"
                  className="absolute inset-0 bg-neon-purple/20 rounded-full neon-border-purple"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Users className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Screen Share View</span>
            </button>
          </motion.div>
        </div>

        {/* Demo Area */}
        <motion.div
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden glass-card p-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Monitor Frame */}
          <div className="relative bg-muted/30 rounded-2xl overflow-hidden aspect-video">
            {/* Fake Desktop Content */}
            <div className="absolute inset-0 p-6">
              {/* Window Header Bar */}
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
                <div className="w-3 h-3 rounded-full bg-neon-green/60" />
              </div>

              {/* Fake Browser/App */}
              <div className="grid grid-cols-4 gap-4 h-full">
                <div className="col-span-3 rounded-xl bg-muted/40 p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted/60 rounded w-3/4" />
                    <div className="h-4 bg-muted/60 rounded w-1/2" />
                    <div className="h-32 bg-muted/50 rounded-lg mt-4" />
                    <div className="h-4 bg-muted/60 rounded w-2/3" />
                    <div className="h-4 bg-muted/60 rounded w-1/3" />
                  </div>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <div className="space-y-3">
                    <div className="h-8 bg-muted/60 rounded" />
                    <div className="h-8 bg-muted/60 rounded" />
                    <div className="h-8 bg-muted/60 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* QuiteWin HUD Overlay */}
            <AnimatePresence>
              {viewMode === "my-view" && (
                <motion.div
                  className="absolute top-8 right-8 w-72"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.95, 
                    filter: "blur(20px)",
                    transition: { duration: 0.5 }
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="ghost-window rounded-2xl overflow-hidden">
                    {/* HUD Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neon-purple/20">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-neon-purple" />
                        <span className="font-mono text-sm text-neon-purple font-semibold">
                          QuiteWin
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-neon-green pulse-green" />
                        <span className="text-xs font-mono text-neon-green">STEALTH</span>
                      </div>
                    </div>

                    {/* HUD Content */}
                    <div className="p-4 space-y-3">
                      <div className="p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-neon-purple mt-0.5" />
                          <p className="text-sm text-foreground">
                            How should I approach this coding challenge?
                          </p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                          Start with the base case, then build iteratively...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-4 rounded-3xl opacity-30 -z-10"
                    style={{
                      background: "radial-gradient(circle, hsl(263 70% 66% / 0.4) 0%, transparent 70%)",
                    }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Screen Share Indicator */}
            <AnimatePresence>
              {viewMode === "screen-share" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/40"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-xs font-mono text-destructive">SCREEN SHARING</span>
                  </motion.div>

                  {/* Ghost outline where HUD would be */}
                  <motion.div
                    className="absolute top-8 right-8 w-72 h-48 rounded-2xl border-2 border-dashed border-muted-foreground/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <EyeOff className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground/30 font-mono">PROTECTED</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Monitor Stand */}
          <div className="flex justify-center mt-2">
            <div className="w-24 h-4 bg-muted/30 rounded-b-lg" />
          </div>
        </motion.div>

        {/* Label */}
        <motion.p
          className="text-center mt-8 text-sm text-muted-foreground font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {viewMode === "my-view" 
            ? "✨ You see your AI assistant — always accessible"
            : "🔒 Others see nothing — setContentProtection active"
          }
        </motion.p>
      </div>
    </section>
  );
};

export default VisibilityDemo;

import { motion, useDragControls } from "framer-motion";
import { Eye, EyeOff, GripVertical, Minus, X } from "lucide-react";
import { useState } from "react";

const GhostDemo = () => {
  const dragControls = useDragControls();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <section id="ghost-demo" className="py-24 relative overflow-hidden min-h-[800px]">
      {/* Background demo content */}
      <div className="container mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Ghost Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Try dragging the floating window. This is how QuiteWin feels on your desktop.
          </p>
          <p className="text-sm text-muted-foreground/60 font-mono">
            Not another chatbot. A stealth HUD.
          </p>
        </motion.div>

        {/* Demo background area */}
        <div className="relative h-[500px] rounded-3xl glass-card overflow-hidden">
          {/* Simulated desktop content */}
          <div className="absolute inset-0 p-8">
            <div className="grid grid-cols-3 gap-4 h-full opacity-40">
              {/* Fake browser window */}
              <div className="col-span-2 rounded-xl bg-muted/30 p-4">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-neon-amber/50" />
                  <div className="w-3 h-3 rounded-full bg-neon-green/50" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted/50 rounded w-3/4" />
                  <div className="h-4 bg-muted/50 rounded w-1/2" />
                  <div className="h-32 bg-muted/30 rounded mt-4" />
                  <div className="h-4 bg-muted/50 rounded w-2/3" />
                  <div className="h-4 bg-muted/50 rounded w-1/3" />
                </div>
              </div>
              {/* Fake sidebar */}
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="space-y-3">
                  <div className="h-10 bg-muted/50 rounded" />
                  <div className="h-10 bg-muted/50 rounded" />
                  <div className="h-10 bg-muted/50 rounded" />
                  <div className="h-20 bg-muted/30 rounded mt-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Draggable Ghost Window */}
          <motion.div
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0.1}
            initial={{ x: 100, y: 100 }}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ zIndex: 50 }}
          >
            <motion.div
              className={`ghost-window rounded-2xl overflow-hidden transition-all duration-300 ${
                isMinimized ? "w-64" : "w-80"
              }`}
              animate={{
                height: isMinimized ? 48 : "auto",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Window header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-neon-purple/20"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                  <EyeOff className="w-4 h-4 text-neon-purple" />
                  <span className="font-mono text-sm text-neon-purple font-semibold">
                    QuiteWin
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-5 h-5 rounded flex items-center justify-center hover:bg-muted/50 transition-colors"
                  >
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button className="w-5 h-5 rounded flex items-center justify-center hover:bg-destructive/20 transition-colors">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Window content */}
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-4"
                >
                  {/* Status indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-neon-green pulse-green" />
                    <span className="text-xs font-mono text-neon-green">
                      STEALTH ACTIVE
                    </span>
                  </div>

                  {/* Message */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        <Eye className="w-4 h-4 inline mr-2 text-neon-pink" />
                        This window is invisible to screen sharing.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                      <p className="text-sm text-foreground">
                        Drag me around! I stay on top and blend in.
                      </p>
                    </div>
                  </div>

                  {/* Input simulation */}
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 h-9 rounded-lg bg-muted/50 border border-border/50" />
                    <button className="px-4 h-9 rounded-lg bg-neon-purple/20 text-neon-purple text-sm font-medium hover:bg-neon-purple/30 transition-colors">
                      Ask
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <motion.div
              className="px-4 py-2 rounded-full glass-card text-sm text-muted-foreground"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👆 Drag the ghost window around
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GhostDemo;

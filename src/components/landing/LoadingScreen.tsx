import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[500] bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated background pulses */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.15) 0%, transparent 70%)"
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Glowing logo placeholder */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outer glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, hsl(var(--neon-purple)), hsl(var(--neon-green)), hsl(var(--neon-pink)), hsl(var(--neon-purple)))",
              filter: "blur(15px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center circle */}
          <div className="relative w-20 h-20 rounded-full bg-background border-2 border-neon-purple/50 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-green"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Loading text with typewriter effect */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm font-mono text-muted-foreground">Initializing stealth mode</span>
          <motion.span
            className="text-neon-purple"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            _
          </motion.span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple via-neon-green to-neon-purple rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;

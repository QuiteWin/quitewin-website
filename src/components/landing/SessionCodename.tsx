import { motion } from "framer-motion";
import { useSessionCodename } from "@/hooks/useSessionCodename";

const SessionCodename = () => {
  const codename = useSessionCodename();

  return (
    <motion.div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40 hidden md:block"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
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

export default SessionCodename;

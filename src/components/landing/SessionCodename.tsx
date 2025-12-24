import { motion } from "framer-motion";
import { useSessionCodename } from "@/hooks/useSessionCodename";

const SessionCodename = () => {
  const codename = useSessionCodename();

  return (
    <motion.div
      className="fixed top-20 left-6 z-40 hidden md:block"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
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

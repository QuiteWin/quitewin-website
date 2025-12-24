import { motion } from "framer-motion";
import TextScramble from "./TextScramble";

const TrustProof = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            <TextScramble delay={100}>Used in situations where visibility matters.</TextScramble>
          </p>
          <div className="mt-6 space-y-1">
            <p className="text-sm text-muted-foreground/50 font-mono">
              <TextScramble delay={300}>No logos.</TextScramble>
            </p>
            <p className="text-sm text-muted-foreground/50 font-mono">
              <TextScramble delay={400}>No testimonials.</TextScramble>
            </p>
            <p className="text-sm text-muted-foreground/50 font-mono">
              <TextScramble delay={500}>No names.</TextScramble>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustProof;

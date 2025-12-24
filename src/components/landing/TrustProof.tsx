import { motion } from "framer-motion";

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
            Used in situations where visibility matters.
          </p>
          <div className="mt-6 space-y-1">
            <p className="text-sm text-muted-foreground/50 font-mono">No logos.</p>
            <p className="text-sm text-muted-foreground/50 font-mono">No testimonials.</p>
            <p className="text-sm text-muted-foreground/50 font-mono">No names.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustProof;

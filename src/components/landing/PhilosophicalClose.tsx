import { motion } from "framer-motion";
import TextScramble from "./TextScramble";

const PhilosophicalClose = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed font-light">
            <TextScramble delay={200} speed={60}>Privacy isn't a feature.</TextScramble>
          </p>
          <p className="text-2xl md:text-3xl text-foreground leading-relaxed font-light mt-2">
            <TextScramble delay={600} speed={60}>It's a stance.</TextScramble>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophicalClose;

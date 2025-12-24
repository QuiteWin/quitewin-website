import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Zap, Ghost, Eye, Gamepad2 } from "lucide-react";
import { useRef, useState } from "react";

interface DockItem {
  icon: React.ElementType;
  label: string;
  color: string;
  sectionId: string;
}

const dockItems: DockItem[] = [
  { icon: Shield, label: "Private Mode", color: "neon-green", sectionId: "hybrid-toggle" },
  { icon: Zap, label: "Power Mode", color: "neon-purple", sectionId: "hybrid-toggle" },
  { icon: Ghost, label: "Ghost HUD", color: "neon-pink", sectionId: "ghost-demo" },
  { icon: Eye, label: "Visibility Demo", color: "neon-cyan", sectionId: "visibility-demo" },
  { icon: Gamepad2, label: "Mini-Game", color: "neon-amber", sectionId: "mini-game" },
];

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    "neon-green": "text-neon-green",
    "neon-purple": "text-neon-purple",
    "neon-pink": "text-neon-pink",
    "neon-cyan": "text-neon-cyan",
    "neon-amber": "text-neon-amber",
  };
  return colors[color] || "text-foreground";
};

const DockIcon = ({
  item,
  mouseX,
  index,
}: {
  item: DockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    if (!ref.current) return 150;
    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    return Math.abs(val - center);
  });

  const size = useTransform(distance, [0, 150], [72, 48]);
  const iconSize = useTransform(distance, [0, 150], [32, 20]);

  const springSize = useSpring(size, { stiffness: 300, damping: 20 });
  const springIconSize = useSpring(iconSize, { stiffness: 300, damping: 20 });

  const handleClick = () => {
    const element = document.getElementById(item.sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Tooltip */}
      <motion.div
        className="absolute -top-10 px-3 py-1.5 rounded-lg glass-card text-xs font-medium whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.15 }}
      >
        <span className={getColorClass(item.color)}>{item.label}</span>
      </motion.div>

      {/* Icon */}
      <motion.div
        className="rounded-xl glass-card flex items-center justify-center cursor-pointer transition-colors"
        style={{
          width: springSize,
          height: springSize,
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div style={{ width: springIconSize, height: springIconSize }}>
          <Icon className={`w-full h-full ${getColorClass(item.color)}`} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Dock = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-50 hidden md:block"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
    >
      <motion.div
        className="flex items-end gap-4 px-4 pb-3 pt-2 rounded-2xl glass-card"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{
          boxShadow: "0 0 40px hsl(263 70% 66% / 0.15)",
        }}
      >
        {dockItems.map((item, index) => (
          <DockIcon key={item.label} item={item} mouseX={mouseX} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dock;

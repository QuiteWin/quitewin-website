import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2, Trophy, X, RefreshCw } from "lucide-react";
import MagnetButton from "./MagnetButton";
type GameState = "idle" | "playing" | "won" | "lost";
interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
}
const MiniGame = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scanPosition, setScanPosition] = useState({
    x: 0,
    direction: 1
  });
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [isCaught, setIsCaught] = useState(false);
  const [hudKey, setHudKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const hudX = useMotionValue(150);
  const hudY = useMotionValue(100);
  const springX = useSpring(hudX, {
    damping: 20,
    stiffness: 200
  });
  const springY = useSpring(hudY, {
    damping: 20,
    stiffness: 200
  });

  // Generate random safe zones
  const generateSafeZones = useCallback(() => {
    const zones: SafeZone[] = [];
    for (let i = 0; i < 3; i++) {
      zones.push({
        x: Math.random() * 250 + 25,
        y: Math.random() * 150 + 25,
        width: 80,
        height: 60
      });
    }
    setSafeZones(zones);
  }, []);

  // Check if HUD is in safe zone (using center point for better detection)
  const isInSafeZone = useCallback(() => {
    const currentX = hudX.get();
    const currentY = hudY.get();
    const hudWidth = 64;
    const hudHeight = 48;

    // Use center of HUD for detection (more forgiving)
    const hudCenterX = currentX + hudWidth / 2;
    const hudCenterY = currentY + hudHeight / 2;
    return safeZones.some(zone => hudCenterX >= zone.x && hudCenterX <= zone.x + zone.width && hudCenterY >= zone.y && hudCenterY <= zone.y + zone.height);
  }, [hudX, hudY, safeZones]);

  // Start game
  const startGame = useCallback(() => {
    setHudKey(k => k + 1);
    setGameState("playing");
    setScore(0);
    setTimeLeft(15);
    setIsCaught(false);

    // Randomize HUD spawn (inside drag area; never behind score/time)
    const minX = 12;
    const maxX = 350 - 16 - 64; // container width - padding - hud width
    const minY = 56;
    const maxY = 288 - 16 - 48; // container height - padding - hud height
    const spawnX = Math.floor(minX + Math.random() * (maxX - minX));
    hudX.set(spawnX);
    hudY.set(Math.floor(minY + Math.random() * (maxY - minY)));

    // Start scan from opposite side of HUD spawn
    const midPoint = (maxX + minX) / 2;
    if (spawnX > midPoint) {
      // HUD is on right, scan starts from left
      setScanPosition({
        x: 0,
        direction: 1
      });
    } else {
      // HUD is on left, scan starts from right
      setScanPosition({
        x: 340,
        direction: -1
      });
    }
    generateSafeZones();
  }, [generateSafeZones, hudX, hudY]);

  // Scan line movement (slower speed)
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setScanPosition(prev => {
        const newX = prev.x + prev.direction * 4; // Slower: 4 instead of 8
        const newDirection = newX >= 340 || newX <= 0 ? -prev.direction : prev.direction;
        return {
          x: Math.max(0, Math.min(340, newX)),
          direction: newDirection
        };
      });
    }, 50);
    return () => clearInterval(interval);
  }, [gameState]);

  // Check collision with scan line
  useEffect(() => {
    if (gameState !== "playing") return;
    const checkCollision = () => {
      const currentX = hudX.get();
      const scanX = scanPosition.x;
      const hudWidth = 60;

      // Check if scan line hits HUD
      if (scanX >= currentX && scanX <= currentX + hudWidth) {
        if (!isInSafeZone()) {
          setIsCaught(true);
          setGameState("lost");
        }
      }
    };
    checkCollision();
  }, [scanPosition, gameState, hudX, isInSafeZone]);

  // Timer and scoring
  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("won");
          return 0;
        }
        return prev - 1;
      });

      // Add score for surviving
      if (isInSafeZone()) {
        setScore(prev => prev + 10);
      } else {
        setScore(prev => prev + 5);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, isInSafeZone]);

  // Regenerate safe zones periodically
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      generateSafeZones();
    }, 5000);
    return () => clearInterval(interval);
  }, [gameState, generateSafeZones]);
  return <section id="mini-game" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-neon-amber font-mono text-sm mb-6">
            <Gamepad2 className="w-4 h-4" />
            INTERACTIVE WITH ME   
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-hero">Stay Invisible</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Drag the HUD into safe zones to avoid the screen share scan. 
            Experience the stealth in action.
          </p>
        </motion.div>

        {/* Game Container */}
        <div className="max-w-lg mx-auto">
          <motion.div ref={containerRef} className="relative h-72 rounded-2xl glass-card overflow-hidden" style={{
          boxShadow: gameState === "playing" ? "0 0 40px hsl(330 90% 66% / 0.2)" : "none"
        }}>
            {/* Drag area (excludes the score/time HUD row) */}
            <div ref={dragAreaRef} className="absolute inset-0 top-14 left-3 right-3 bottom-3" />
            {/* Safe Zones */}
            <AnimatePresence>
              {gameState === "playing" && safeZones.map((zone, index) => <motion.div key={index} className="absolute rounded-lg border-2 border-dashed border-neon-green/40" initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.8
            }} style={{
              left: zone.x,
              top: zone.y,
              width: zone.width,
              height: zone.height,
              background: "hsl(160 84% 39% / 0.1)"
            }}>
                    <span className="absolute -top-5 left-1 text-[10px] font-mono text-neon-green/60">
                      SAFE
                    </span>
                  </motion.div>)}
            </AnimatePresence>

            {/* Scan Line */}
            {gameState === "playing" && <motion.div className="absolute top-0 bottom-0 w-1 pointer-events-none" style={{
            left: scanPosition.x,
            background: "linear-gradient(to bottom, transparent, hsl(0 84% 60% / 0.8), transparent)",
            boxShadow: "0 0 20px hsl(0 84% 60% / 0.6)"
          }} />}

            {/* Draggable HUD - only show during gameplay */}
            {gameState === "playing" && <motion.div key={hudKey} className="absolute w-16 h-12 rounded-lg cursor-grab active:cursor-grabbing z-30" style={{
            x: springX,
            y: springY,
            background: "hsl(var(--glass-bg) / 0.8)",
            border: "1px solid hsl(var(--neon-purple) / 0.5)",
            boxShadow: "0 0 20px hsl(263 70% 66% / 0.3)"
          }} drag={gameState === "playing"} dragConstraints={dragAreaRef} dragElastic={0.1} dragMomentum={true} dragTransition={{
            power: 0.2,
            timeConstant: 120
          }} whileDrag={{
            scale: 1.1,
            zIndex: 40
          }}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[8px] font-mono text-neon-purple">QuiteWin</span>
                </div>
              </motion.div>}

            {/* Game States */}
            <AnimatePresence>
              {gameState === "idle" && <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }}>
                  <MagnetButton>
                    <button onClick={startGame} className="px-8 py-4 rounded-xl font-semibold text-lg btn-cyber-green">
                      Start Game
                    </button>
                  </MagnetButton>
                  <p className="text-sm text-muted-foreground">Avoid the scan for 15 seconds</p>
                </motion.div>}

              {gameState === "won" && <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 z-20" initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }}>
                  <Trophy className="w-16 h-16 text-neon-green" />
                  <h3 className="text-2xl font-bold text-neon-green">Still Invisible!</h3>
                  <p className="text-muted-foreground">Score: {score}</p>
                  <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 rounded-lg glass-card text-foreground hover:text-neon-purple transition-colors cursor-pointer relative z-30">
                    <RefreshCw className="w-4 h-4" />
                    Play Again
                  </button>
                </motion.div>}

              {gameState === "lost" && <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 z-20" initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }}>
                  <X className="w-16 h-16 text-destructive" />
                  <motion.h3 className="text-2xl font-bold text-destructive" initial={{
                opacity: 1
              }} animate={{
                opacity: [1, 0],
                y: [0, 50],
                rotateX: [0, 45]
              }} transition={{
                delay: 0.5,
                duration: 0.8
              }}>
                    Caught!
                  </motion.h3>
                  <p className="text-muted-foreground">Score: {score}</p>
                  <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 rounded-lg glass-card text-foreground hover:text-neon-purple transition-colors cursor-pointer relative z-30">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                </motion.div>}
            </AnimatePresence>

            {/* HUD - Score & Time */}
            {gameState === "playing" && <div className="absolute top-3 left-3 right-3 flex justify-between">
                <div className="px-3 py-1 rounded-lg glass-card text-sm font-mono">
                  <span className="text-muted-foreground">Score: </span>
                  <span className="text-neon-green">{score}</span>
                </div>
                <div className="px-3 py-1 rounded-lg glass-card text-sm font-mono">
                  <span className="text-muted-foreground">Time: </span>
                  <span className={timeLeft <= 5 ? "text-destructive" : "text-neon-amber"}>
                    {timeLeft}s
                  </span>
                </div>
              </div>}
          </motion.div>

          {/* Instructions */}
          <motion.div className="mt-6 text-center text-sm text-muted-foreground" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }}>
            <p>
              <span className="text-neon-purple">TIP:</span> Hide in the safe zones when the scan approaches.
              This is how QuiteWin stays invisible during screen shares.
            </p>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default MiniGame;
import { useEffect, useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type RobotState = 'idle' | 'chasing' | 'waving' | 'talking' | 'helping' | 'encouraging' | 'sleeping' | 'dancing' | 'thinking';
type RobotMood = 'neutral' | 'happy' | 'curious' | 'excited' | 'sleepy' | 'loving' | 'proud';

interface AIRobotProps {
  ghostPosition: { x: number; y: number };
  ghostState: string;
  ghostMood: string;
}

const CHAT_BUBBLES = {
  greeting: ['Hey friend!', 'Hi ghost!', '👋 Hello!', 'Boo!'],
  encouraging: ['You got this!', 'Amazing!', 'Keep going!', '⭐ Great!', 'Woohoo!'],
  helping: ['Need help?', 'I\'m here!', 'Let\'s go!', 'Follow me!'],
  loving: ['Best friend!', '💙', 'Love ya!', 'BFFs!'],
  curious: ['Hmm...', 'What\'s that?', '🤔', 'Interesting!'],
  sleepy: ['Zzz...', '*yawn*', 'So tired...', '😴'],
};

export const AIRobot = memo(({ ghostPosition, ghostState, ghostMood }: AIRobotProps) => {
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [mood, setMood] = useState<RobotMood>('neutral');
  const [position, setPosition] = useState({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 });
  const [chatBubble, setChatBubble] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [antennaGlow, setAntennaGlow] = useState(false);
  const stateTimerRef = useRef<number | null>(null);
  const chatTimerRef = useRef<number | null>(null);

  // Appear after ghost appears
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setEyeBlink(true);
        setTimeout(() => setEyeBlink(false), 150);
      }
    }, 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Antenna glow when thinking/talking
  useEffect(() => {
    if (robotState === 'thinking' || robotState === 'talking') {
      const glowInterval = setInterval(() => {
        setAntennaGlow(prev => !prev);
      }, 300);
      return () => clearInterval(glowInterval);
    } else {
      setAntennaGlow(false);
    }
  }, [robotState]);

  // React to ghost state changes
  useEffect(() => {
    if (!isVisible) return;

    if (ghostState === 'celebrating') {
      setRobotState('dancing');
      setMood('excited');
      showChat('encouraging');
    } else if (ghostState === 'sleeping') {
      setRobotState('sleeping');
      setMood('sleepy');
    } else if (ghostState === 'hidden') {
      setRobotState('thinking');
      setMood('curious');
    } else if (ghostMood === 'shy') {
      setRobotState('encouraging');
      setMood('loving');
      showChat('encouraging');
    }
  }, [ghostState, ghostMood, isVisible]);

  // State machine for robot behaviors
  useEffect(() => {
    if (!isVisible) return;

    const runStateMachine = () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);

      const behaviors: RobotState[] = ['idle', 'chasing', 'waving', 'talking', 'helping', 'thinking'];
      const randomBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
      
      // Don't interrupt special states
      if (robotState === 'dancing' || robotState === 'sleeping') {
        stateTimerRef.current = window.setTimeout(runStateMachine, 3000);
        return;
      }

      setRobotState(randomBehavior);
      
      // Set mood based on state
      switch (randomBehavior) {
        case 'chasing':
          setMood('excited');
          break;
        case 'waving':
          setMood('happy');
          showChat('greeting');
          break;
        case 'talking':
          setMood('happy');
          showChat(Math.random() > 0.5 ? 'loving' : 'greeting');
          break;
        case 'helping':
          setMood('proud');
          showChat('helping');
          break;
        case 'thinking':
          setMood('curious');
          showChat('curious');
          break;
        default:
          setMood('neutral');
      }

      stateTimerRef.current = window.setTimeout(runStateMachine, 4000 + Math.random() * 4000);
    };

    runStateMachine();

    return () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    };
  }, [isVisible]);

  // Movement based on state
  useEffect(() => {
    if (!isVisible) return;

    if (robotState === 'chasing') {
      // Follow behind ghost with offset
      const offsetX = ghostPosition.x > window.innerWidth / 2 ? -80 : 80;
      const offsetY = ghostPosition.y > window.innerHeight / 2 ? -60 : 60;
      setPosition({
        x: Math.max(50, Math.min(window.innerWidth - 80, ghostPosition.x + offsetX)),
        y: Math.max(50, Math.min(window.innerHeight - 80, ghostPosition.y + offsetY)),
      });
    } else if (robotState === 'helping') {
      // Move close to ghost
      setPosition({
        x: Math.max(50, Math.min(window.innerWidth - 80, ghostPosition.x + 60)),
        y: Math.max(50, Math.min(window.innerHeight - 80, ghostPosition.y + 20)),
      });
    } else if (robotState === 'idle' || robotState === 'thinking') {
      // Random position
      setPosition({
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight - 100) + 50,
      });
    }
  }, [robotState, ghostPosition, isVisible]);

  const showChat = (type: keyof typeof CHAT_BUBBLES) => {
    if (chatTimerRef.current) clearTimeout(chatTimerRef.current);
    const messages = CHAT_BUBBLES[type];
    setChatBubble(messages[Math.floor(Math.random() * messages.length)]);
    chatTimerRef.current = window.setTimeout(() => setChatBubble(null), 2500);
  };

  if (!isVisible) return null;

  // Eye positions based on ghost location
  const eyeOffsetX = Math.max(-2, Math.min(2, (ghostPosition.x - position.x) / 100));
  const eyeOffsetY = Math.max(-2, Math.min(2, (ghostPosition.y - position.y) / 100));

  return (
    <motion.div
      className="fixed pointer-events-none z-40"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: position.x,
        y: position.y,
        rotate: robotState === 'dancing' ? [0, -10, 10, -10, 0] : 0,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        rotate: { repeat: robotState === 'dancing' ? Infinity : 0, duration: 0.5 }
      }}
    >
      {/* Chat bubble */}
      <AnimatePresence>
        {chatBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-cyan-500/90 text-white text-xs px-2 py-1 rounded-lg font-medium shadow-lg">
              {chatBubble}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-500/90 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot SVG */}
      <motion.svg
        width="50"
        height="60"
        viewBox="0 0 50 60"
        className="drop-shadow-lg"
        animate={{
          y: robotState === 'sleeping' ? [0, 2, 0] : robotState === 'dancing' ? [0, -5, 0] : [0, -3, 0],
        }}
        transition={{
          duration: robotState === 'dancing' ? 0.3 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Antenna */}
        <motion.line
          x1="25"
          y1="8"
          x2="25"
          y2="0"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.circle
          cx="25"
          cy="0"
          r="3"
          animate={{
            fill: antennaGlow ? '#22d3ee' : '#94a3b8',
            filter: antennaGlow ? 'drop-shadow(0 0 4px #22d3ee)' : 'none',
          }}
        />

        {/* Head */}
        <motion.rect
          x="8"
          y="8"
          width="34"
          height="28"
          rx="6"
          className="fill-slate-600"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Face screen */}
        <rect
          x="12"
          y="12"
          width="26"
          height="20"
          rx="3"
          className="fill-slate-800"
        />

        {/* Eyes */}
        <AnimatePresence mode="wait">
          {eyeBlink ? (
            <motion.g key="blink">
              <line x1="17" y1="20" x2="23" y2="20" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
              <line x1="27" y1="20" x2="33" y2="20" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          ) : (
            <motion.g key="eyes">
              {mood === 'sleepy' ? (
                <>
                  <line x1="17" y1="20" x2="23" y2="20" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                  <line x1="27" y1="20" x2="33" y2="20" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : mood === 'excited' ? (
                <>
                  <motion.text x="17" y="23" className="fill-cyan-400 text-[8px]" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>★</motion.text>
                  <motion.text x="30" y="23" className="fill-cyan-400 text-[8px]" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>★</motion.text>
                </>
              ) : mood === 'loving' ? (
                <>
                  <motion.text x="17" y="23" className="fill-pink-400 text-[8px]">♥</motion.text>
                  <motion.text x="30" y="23" className="fill-pink-400 text-[8px]">♥</motion.text>
                </>
              ) : (
                <>
                  <motion.circle
                    cx={20 + eyeOffsetX}
                    cy={20 + eyeOffsetY}
                    r="4"
                    className="fill-cyan-400"
                    animate={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }}
                  />
                  <motion.circle
                    cx={30 + eyeOffsetX}
                    cy={20 + eyeOffsetY}
                    r="4"
                    className="fill-cyan-400"
                    animate={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }}
                  />
                  <circle cx={20 + eyeOffsetX} cy={19 + eyeOffsetY} r="1.5" className="fill-white/80" />
                  <circle cx={30 + eyeOffsetX} cy={19 + eyeOffsetY} r="1.5" className="fill-white/80" />
                </>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Mouth */}
        <AnimatePresence mode="wait">
          {mood === 'happy' || mood === 'excited' ? (
            <motion.path
              key="happy-mouth"
              d="M18 27 Q25 32 32 27"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          ) : mood === 'curious' ? (
            <motion.circle
              key="curious-mouth"
              cx="25"
              cy="28"
              r="2"
              className="fill-cyan-400"
            />
          ) : mood === 'loving' ? (
            <motion.path
              key="loving-mouth"
              d="M20 27 Q25 31 30 27"
              fill="none"
              stroke="#f472b6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <motion.line
              key="neutral-mouth"
              x1="20"
              y1="28"
              x2="30"
              y2="28"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </AnimatePresence>

        {/* Body */}
        <rect
          x="13"
          y="38"
          width="24"
          height="16"
          rx="4"
          className="fill-slate-600"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Body lights */}
        <motion.circle
          cx="20"
          cy="45"
          r="2"
          animate={{
            fill: robotState === 'talking' ? ['#22d3ee', '#a855f7', '#22d3ee'] : '#22d3ee',
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
        <motion.circle
          cx="30"
          cy="45"
          r="2"
          animate={{
            fill: robotState === 'talking' ? ['#a855f7', '#22d3ee', '#a855f7'] : '#a855f7',
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />

        {/* Arms */}
        <motion.g
          animate={{
            rotate: robotState === 'waving' ? [0, 20, 0, 20, 0] : 0,
          }}
          transition={{ repeat: robotState === 'waving' ? Infinity : 0, duration: 0.6 }}
          style={{ transformOrigin: '10px 42px' }}
        >
          <rect x="3" y="40" width="8" height="4" rx="2" className="fill-slate-500" />
        </motion.g>
        <motion.g
          animate={{
            rotate: robotState === 'waving' ? [0, -20, 0, -20, 0] : 0,
          }}
          transition={{ repeat: robotState === 'waving' ? Infinity : 0, duration: 0.6, delay: 0.1 }}
          style={{ transformOrigin: '40px 42px' }}
        >
          <rect x="39" y="40" width="8" height="4" rx="2" className="fill-slate-500" />
        </motion.g>

        {/* Legs/wheels */}
        <circle cx="18" cy="56" r="4" className="fill-slate-500" />
        <circle cx="32" cy="56" r="4" className="fill-slate-500" />
        <circle cx="18" cy="56" r="2" className="fill-slate-700" />
        <circle cx="32" cy="56" r="2" className="fill-slate-700" />
      </motion.svg>

      {/* State indicators */}
      <AnimatePresence>
        {robotState === 'sleeping' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-4 -right-2"
          >
            <motion.span
              className="text-cyan-400 text-sm font-bold"
              animate={{ y: [0, -5, 0], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Z
            </motion.span>
          </motion.div>
        )}
        {robotState === 'thinking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2"
          >
            <motion.span
              className="text-cyan-400 text-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💭
            </motion.span>
          </motion.div>
        )}
        {robotState === 'helping' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-4 -right-4"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              ⚙️
            </motion.span>
          </motion.div>
        )}
        {mood === 'proud' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0], y: [-10, -20] }}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
          >
            <span className="text-yellow-400">✨</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

AIRobot.displayName = 'AIRobot';

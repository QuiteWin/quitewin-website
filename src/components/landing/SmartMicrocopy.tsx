import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

interface SmartMicrocopyProps {
  className?: string;
}

const timeGreetings = {
  morning: ['Rise and build.', 'Fresh start.', 'Morning clarity.'],
  afternoon: ['Deep work mode.', 'Focused.', 'In the zone.'],
  evening: ['Winding down.', 'Evening coding.', 'Late inspiration.'],
  night: ['Night owl mode.', 'Quiet hours.', 'The best ideas come at night.'],
};

const scrollMessages = [
  { threshold: 0.1, messages: ['Exploring...', 'Keep going.'] },
  { threshold: 0.3, messages: ['Getting deeper.', 'You\'re curious.'] },
  { threshold: 0.5, messages: ['Halfway there.', 'The good stuff awaits.'] },
  { threshold: 0.7, messages: ['Almost there.', 'Nearly at the core.'] },
  { threshold: 0.9, messages: ['You made it.', 'Deep dive complete.'] },
];

const idleMessages = [
  'Still here.',
  'Take your time.',
  'Thinking...',
  'No rush.',
  'Quiet is good.',
];

export const SmartMicrocopy = memo(({ className = '' }: SmartMicrocopyProps) => {
  const { timeOfDay, scrollDepth, isIdle, idleDuration, prefersReducedMotion } = useAmbientIntelligence();
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    let newMessage = '';
    
    // Priority: Idle > Scroll depth > Time of day
    if (isIdle && idleDuration > 8) {
      const idx = Math.floor(Math.random() * idleMessages.length);
      newMessage = idleMessages[idx];
    } else if (scrollDepth > 0.1) {
      // Find appropriate scroll message
      const scrollMsg = scrollMessages
        .slice()
        .reverse()
        .find(s => scrollDepth >= s.threshold);
      if (scrollMsg) {
        const idx = Math.floor(Math.random() * scrollMsg.messages.length);
        newMessage = scrollMsg.messages[idx];
      }
    } else {
      const greetings = timeGreetings[timeOfDay];
      const idx = Math.floor(Math.random() * greetings.length);
      newMessage = greetings[idx];
    }
    
    if (newMessage !== message) {
      setMessage(newMessage);
      setKey(prev => prev + 1);
    }
  }, [timeOfDay, scrollDepth, isIdle, idleDuration, message]);
  
  if (prefersReducedMotion) {
    return (
      <div className={`font-mono text-xs text-muted-foreground/40 ${className}`}>
        {message}
      </div>
    );
  }
  
  return (
    <div className={`h-4 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          className="font-mono text-xs text-muted-foreground/40"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

SmartMicrocopy.displayName = 'SmartMicrocopy';

// Whisper text that appears near scroll position
export const ScrollWhisper = memo(() => {
  const { scrollDepth, isIdle, prefersReducedMotion } = useAmbientIntelligence();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show whisper occasionally when scrolling deep and pausing
    if (isIdle && scrollDepth > 0.3 && scrollDepth < 0.95) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [scrollDepth, isIdle]);
  
  if (prefersReducedMotion || !visible) return null;
  
  const whispers = [
    'You\'re in the right place.',
    'Keep exploring.',
    'Almost at the core.',
  ];
  const whisper = whispers[Math.floor(scrollDepth * whispers.length)];
  
  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground/20 writing-mode-vertical pointer-events-none z-50"
      style={{ writingMode: 'vertical-rl' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 1 }}
    >
      {whisper}
    </motion.div>
  );
});

ScrollWhisper.displayName = 'ScrollWhisper';

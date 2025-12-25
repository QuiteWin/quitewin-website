import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useAmbientIntelligence } from '@/hooks/useAmbientIntelligence';

// Subtle ambient sound toggle
export const AmbientSound = memo(() => {
  const { preferences, setSoundEnabled } = usePreferences();
  const { prefersReducedMotion, isFocusMode } = useAmbientIntelligence();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  
  // Create very subtle ambient drone
  const startAmbient = useCallback(() => {
    if (audioContextRef.current) return;
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      
      // Create very low frequency oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime); // Very low frequency
      
      // Very quiet
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      
      oscillatorRef.current = osc;
      gainRef.current = gain;
      
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }, []);
  
  const stopAmbient = useCallback(() => {
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      setTimeout(() => {
        oscillatorRef.current?.stop();
        audioContextRef.current?.close();
        audioContextRef.current = null;
        oscillatorRef.current = null;
        gainRef.current = null;
      }, 500);
    }
    setIsPlaying(false);
  }, []);
  
  const toggleSound = () => {
    setHasInteracted(true);
    if (isPlaying) {
      stopAmbient();
      setSoundEnabled(false);
    } else {
      startAmbient();
      setSoundEnabled(true);
    }
  };
  
  // Adjust volume based on focus mode
  useEffect(() => {
    if (gainRef.current && audioContextRef.current && isPlaying) {
      const targetVolume = isFocusMode ? 0.02 : 0.015;
      gainRef.current.gain.linearRampToValueAtTime(targetVolume, audioContextRef.current.currentTime + 1);
    }
  }, [isFocusMode, isPlaying]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);
  
  return (
    <motion.button
      className="fixed bottom-4 right-4 w-8 h-8 rounded-full glass-card flex items-center justify-center z-50 cursor-pointer"
      onClick={toggleSound}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      title={isPlaying ? 'Mute ambient sound' : 'Enable ambient sound'}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="on"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Volume2 className="w-4 h-4 text-neon-green/60" />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <VolumeX className="w-4 h-4 text-muted-foreground/40" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

AmbientSound.displayName = 'AmbientSound';

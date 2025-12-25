import { useState, useEffect, useCallback } from 'react';
import { initEasterEggs, clearRegistry } from './index';
import { konamiTrigger } from './triggers/konami';
import { ghostTrigger } from './triggers/ghost';
import { tripleClickTrigger } from './triggers/tripleClick';
import { timeOfDayTrigger } from './triggers/timeOfDay';

export type ActiveEffect = 'ghost' | 'konami' | 'conic-burst' | 'time-special' | null;

interface EasterEggState {
  activeEffect: ActiveEffect;
  burstPosition: { x: number; y: number } | null;
  timeSlot: string | null;
}

export function useEasterEggs() {
  const [state, setState] = useState<EasterEggState>({
    activeEffect: null,
    burstPosition: null,
    timeSlot: null,
  });
  
  const clearEffect = useCallback(() => {
    setState(prev => ({ ...prev, activeEffect: null, burstPosition: null }));
  }, []);
  
  const triggerGhost = useCallback(() => {
    setState(prev => ({ ...prev, activeEffect: 'ghost' }));
  }, []);
  
  const triggerKonami = useCallback(() => {
    setState(prev => ({ ...prev, activeEffect: 'konami' }));
  }, []);
  
  const triggerConicBurst = useCallback((x?: number, y?: number) => {
    setState(prev => ({ 
      ...prev, 
      activeEffect: 'conic-burst',
      burstPosition: x !== undefined && y !== undefined ? { x, y } : null
    }));
  }, []);
  
  useEffect(() => {
    // Clear any previous registrations
    clearRegistry();
    
    // Register all triggers
    konamiTrigger(triggerKonami);
    ghostTrigger(triggerGhost);
    tripleClickTrigger('[data-easter-egg="logo"]', () => triggerConicBurst());
    timeOfDayTrigger((slot) => {
      setState(prev => ({ ...prev, activeEffect: 'time-special', timeSlot: slot }));
    });
    
    // Initialize all easter eggs
    const cleanup = initEasterEggs();
    
    return cleanup;
  }, [triggerGhost, triggerKonami, triggerConicBurst]);
  
  return {
    activeEffect: state.activeEffect,
    burstPosition: state.burstPosition,
    timeSlot: state.timeSlot,
    clearEffect,
  };
}

import { useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'dark' | 'light' | 'glass';
export type AnimationIntensity = 'low' | 'normal' | 'high';

interface Preferences {
  theme: ThemePreference;
  animationIntensity: AnimationIntensity;
  lastSection: string;
  soundEnabled: boolean;
  hasSeenEasterEgg: boolean;
}

const STORAGE_KEY = 'quitewin_preferences';

const defaultPreferences: Preferences = {
  theme: 'dark',
  animationIntensity: 'normal',
  lastSection: '',
  soundEnabled: false,
  hasSeenEasterEgg: false,
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Preferences>;
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn('Failed to load preferences:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((updates: Partial<Preferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (e) {
        console.warn('Failed to save preferences:', e);
      }
      return newPrefs;
    });
  }, []);

  const setTheme = useCallback((theme: ThemePreference) => {
    savePreferences({ theme });
  }, [savePreferences]);

  const setAnimationIntensity = useCallback((animationIntensity: AnimationIntensity) => {
    savePreferences({ animationIntensity });
  }, [savePreferences]);

  const setLastSection = useCallback((lastSection: string) => {
    savePreferences({ lastSection });
  }, [savePreferences]);

  const setSoundEnabled = useCallback((soundEnabled: boolean) => {
    savePreferences({ soundEnabled });
  }, [savePreferences]);

  const markEasterEggSeen = useCallback(() => {
    savePreferences({ hasSeenEasterEgg: true });
  }, [savePreferences]);

  return {
    preferences,
    isLoaded,
    setTheme,
    setAnimationIntensity,
    setLastSection,
    setSoundEnabled,
    markEasterEggSeen,
  };
};

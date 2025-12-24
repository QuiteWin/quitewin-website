import { useEffect, useMemo } from "react";

// Define color theme palettes
const colorThemes = [
  {
    name: "cyber",
    purple: "263 70% 66%",
    green: "142 70% 55%",
    pink: "330 70% 60%",
    amber: "38 90% 55%",
    cyan: "190 80% 55%",
  },
  {
    name: "neon-sunset",
    purple: "280 80% 60%",
    green: "160 70% 50%",
    pink: "350 80% 65%",
    amber: "25 95% 55%",
    cyan: "200 75% 50%",
  },
  {
    name: "ocean-glow",
    purple: "240 70% 60%",
    green: "170 80% 50%",
    pink: "320 65% 55%",
    amber: "45 85% 60%",
    cyan: "180 90% 45%",
  },
  {
    name: "electric-dream",
    purple: "290 75% 55%",
    green: "130 75% 50%",
    pink: "340 75% 60%",
    amber: "30 90% 50%",
    cyan: "195 85% 50%",
  },
  {
    name: "aurora",
    purple: "270 65% 55%",
    green: "155 85% 45%",
    pink: "310 70% 55%",
    amber: "50 80% 55%",
    cyan: "185 80% 50%",
  },
  {
    name: "synthwave",
    purple: "285 80% 65%",
    green: "145 65% 55%",
    pink: "335 85% 60%",
    amber: "35 85% 60%",
    cyan: "175 75% 55%",
  },
  {
    name: "cosmic",
    purple: "255 75% 60%",
    green: "165 75% 45%",
    pink: "345 70% 55%",
    amber: "40 90% 55%",
    cyan: "205 80% 55%",
  },
];

export const useRandomTheme = () => {
  const theme = useMemo(() => {
    return colorThemes[Math.floor(Math.random() * colorThemes.length)];
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme colors to CSS variables
    root.style.setProperty("--neon-purple", theme.purple);
    root.style.setProperty("--neon-green", theme.green);
    root.style.setProperty("--neon-pink", theme.pink);
    root.style.setProperty("--neon-amber", theme.amber);
    root.style.setProperty("--neon-cyan", theme.cyan);

    // Log theme for debugging
    console.log(`🎨 Theme: ${theme.name}`);

    return () => {
      // Reset to defaults on unmount if needed
    };
  }, [theme]);

  return theme;
};

export default useRandomTheme;

type EasterEgg = {
  id: string;
  trigger: () => () => void; // Returns cleanup function
};

const registry: EasterEgg[] = [];

export const registerEgg = (egg: EasterEgg) => {
  registry.push(egg);
};

export const initEasterEggs = (): (() => void) => {
  const cleanups = registry.map(egg => egg.trigger());
  
  return () => {
    cleanups.forEach(cleanup => cleanup?.());
    registry.length = 0;
  };
};

export const clearRegistry = () => {
  registry.length = 0;
};

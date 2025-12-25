import { registerEgg } from "../index";

export function tripleClickTrigger(targetSelector: string, onActivate: () => void) {
  let clicks: number[] = [];

  registerEgg({
    id: `triple-click-${targetSelector}`,
    trigger: () => {
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check if click is on target or its children
        if (!target.closest(targetSelector)) return;
        
        const now = Date.now();
        clicks = clicks.filter(t => now - t < 600);
        clicks.push(now);

        if (clicks.length >= 3) {
          onActivate();
          clicks = [];
        }
      };
      
      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
    }
  });
}

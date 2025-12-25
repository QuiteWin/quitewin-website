import { registerEgg } from "../index";

export function ghostTrigger(onActivate: () => void) {
  let buffer = "";

  registerEgg({
    id: "ghost",
    trigger: () => {
      const handler = (e: KeyboardEvent) => {
        // Ignore if typing in input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        
        // Only track letters
        if (!/^[a-z]$/i.test(e.key)) return;
        
        buffer = (buffer + e.key.toLowerCase()).slice(-5);

        if (buffer === "ghost") {
          onActivate();
          buffer = "";
        }
      };
      
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  });
}

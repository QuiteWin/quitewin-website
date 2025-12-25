import { registerEgg } from "../index";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"
];

export function konamiTrigger(onActivate: () => void) {
  let buffer: string[] = [];

  registerEgg({
    id: "konami",
    trigger: () => {
      const handler = (e: KeyboardEvent) => {
        // Ignore if typing in input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        
        buffer.push(e.key);
        buffer = buffer.slice(-KONAMI.length);
        
        if (JSON.stringify(buffer) === JSON.stringify(KONAMI)) {
          onActivate();
          buffer = [];
        }
      };
      
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  });
}

import { registerEgg } from "../index";

type TimeSlot = 'midnight' | 'witching-hour' | 'dawn';

export function timeOfDayTrigger(onActivate: (slot: TimeSlot) => void) {
  registerEgg({
    id: "time-of-day",
    trigger: () => {
      const checkTime = () => {
        const hour = new Date().getHours();
        
        // Midnight (00:00 - 00:05)
        if (hour === 0) {
          onActivate('midnight');
        }
        // Witching hour (3:00 - 3:15)
        else if (hour === 3) {
          onActivate('witching-hour');
        }
        // Dawn (5:00 - 5:30)
        else if (hour === 5) {
          onActivate('dawn');
        }
      };
      
      // Check immediately and then every minute
      checkTime();
      const interval = setInterval(checkTime, 60000);
      
      return () => clearInterval(interval);
    }
  });
}

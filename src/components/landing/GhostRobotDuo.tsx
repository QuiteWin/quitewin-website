import { memo, useState, useCallback } from 'react';
import { BabyGhost, GhostState, GhostMood } from './BabyGhost';
import { AIRobot } from './AIRobot';

export const GhostRobotDuo = memo(() => {
  const [ghostPosition, setGhostPosition] = useState({ x: 100, y: 100 });
  const [ghostState, setGhostState] = useState<GhostState>('hidden');
  const [ghostMood, setGhostMood] = useState<GhostMood>('neutral');

  const handleGhostStateChange = useCallback((
    state: GhostState,
    mood: GhostMood,
    position: { x: number; y: number }
  ) => {
    setGhostState(state);
    setGhostMood(mood);
    setGhostPosition(position);
  }, []);

  return (
    <>
      <BabyGhost onStateChange={handleGhostStateChange} />
      <AIRobot 
        ghostPosition={ghostPosition} 
        ghostState={ghostState} 
        ghostMood={ghostMood} 
      />
    </>
  );
});

GhostRobotDuo.displayName = 'GhostRobotDuo';

export default GhostRobotDuo;

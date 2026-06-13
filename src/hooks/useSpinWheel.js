import { useState, useCallback, useRef } from 'react';

export function useSpinWheel(playerCount) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const resolveRef = useRef(null);

  const spin = useCallback(() => {
    if (isSpinning || playerCount === 0) return Promise.resolve(null);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setIsSpinning(true);
      setSelectedIndex(null);

      // Random spins (5-8 full rotations) + random segment
      const targetIndex = Math.floor(Math.random() * playerCount);
      const segmentAngle = 360 / playerCount;
      const targetAngle = 360 - (targetIndex * segmentAngle + segmentAngle / 2);
      const totalRotation = rotation + 1800 + Math.random() * 1080 + targetAngle;

      setRotation(totalRotation);

      // Resolve after spin animation
      setTimeout(() => {
        setIsSpinning(false);
        setSelectedIndex(targetIndex);
        resolve(targetIndex);
      }, 4000);
    });
  }, [isSpinning, playerCount, rotation]);

  const reset = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  return { isSpinning, rotation, selectedIndex, spin, reset };
}

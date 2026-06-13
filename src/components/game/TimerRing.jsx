import { useEffect } from 'react';

export default function TimerRing({ timeLeft, duration, isRunning, playerColor }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = duration > 0 ? timeLeft / duration : 0;
  const offset = circumference * (1 - progress);
  const isWarning = timeLeft <= 10 && isRunning;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="88" height="88" className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="#1A1A2E"
          strokeWidth="5"
        />
        {/* Progress ring */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={isWarning ? '#FF2D78' : playerColor || '#00F5FF'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
            filter: isWarning
              ? 'drop-shadow(0 0 8px #FF2D78)'
              : `drop-shadow(0 0 6px ${playerColor || '#00F5FF'}40)`,
          }}
          className={isWarning ? 'animate-pulse' : ''}
        />
      </svg>
      {/* Time text */}
      <span
        className={`absolute font-mono font-bold text-lg ${isWarning ? 'text-neonPink' : 'text-textPrimary'}`}
        style={{
          textShadow: isWarning ? '0 0 10px #FF2D78' : 'none',
        }}
      >
        {timeLeft}s
      </span>
    </div>
  );
}

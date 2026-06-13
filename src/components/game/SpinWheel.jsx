import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function SpinWheel({ players, rotation, isSpinning, onSpin }) {
  const canvasRef = useRef(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || players.length === 0) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;
    const segAngle = (2 * Math.PI) / players.length;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    players.forEach((player, i) => {
      const startAngle = i * segAngle - Math.PI / 2;
      const endAngle = startAngle + segAngle;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, player.color + '40');
      gradient.addColorStop(0.7, player.color + '80');
      gradient.addColorStop(1, player.color + 'CC');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = '#08080F';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Player label
      ctx.save();
      ctx.translate(center, center);
      const midAngle = startAngle + segAngle / 2;
      ctx.rotate(midAngle);

      // Check if text would be upside down (angle in bottom half)
      const normalizedAngle = ((midAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const isFlipped = normalizedAngle > Math.PI / 2 && normalizedAngle < (3 * Math.PI / 2);

      if (isFlipped) {
        // Position at the label point, then flip
        ctx.translate(radius * 0.5, 0);
        ctx.rotate(Math.PI);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `${Math.min(28, 120 / players.length)}px sans-serif`;
        ctx.fillText(player.emoji, 12, 0);

        if (players.length <= 6) {
          ctx.font = `bold ${Math.min(14, 80 / players.length)}px Poppins, sans-serif`;
          ctx.fillStyle = '#F0F0FF';
          ctx.shadowColor = '#000';
          ctx.shadowBlur = 4;
          ctx.fillText(player.name, -16, 0);
          ctx.shadowBlur = 0;
        }
      } else {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `${Math.min(28, 120 / players.length)}px sans-serif`;
        ctx.fillText(player.emoji, radius * 0.62, 0);

        if (players.length <= 6) {
          ctx.font = `bold ${Math.min(14, 80 / players.length)}px Poppins, sans-serif`;
          ctx.fillStyle = '#F0F0FF';
          ctx.shadowColor = '#000';
          ctx.shadowBlur = 4;
          ctx.fillText(player.name, radius * 0.38, 0);
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(center, center, 0, center, center, 24);
    centerGrad.addColorStop(0, '#1A1A2E');
    centerGrad.addColorStop(1, '#12121E');
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = '#9D00FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glow ring
    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = isSpinning ? '#FF2D7860' : '#9D00FF30';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [players, isSpinning]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawWheel();
  }, [players.length, drawWheel]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer triangle */}
      <div
        className="absolute -top-2 z-10 w-0 h-0"
        style={{
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '24px solid #FFD700',
          filter: 'drop-shadow(0 0 8px #FFD700)',
        }}
      />

      {/* Wheel */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: isSpinning ? 4 : 0,
          ease: [0.15, 0.85, 0.35, 1],
        }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80"
          style={{ width: 288, height: 288 }}
        />
      </motion.div>

      {/* Particle trail effect when spinning */}
      {isSpinning && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: players[i % players.length]?.color || '#FF2D78',
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 160],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 160],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

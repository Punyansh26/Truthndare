import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

const WHEEL_SIZE = 300; // CSS pixels

export default function SpinWheel({ players, rotation, isSpinning }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Set up canvas once with proper DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = WHEEL_SIZE * dpr;
    canvas.height = WHEEL_SIZE * dpr;
    canvas.style.width = `${WHEEL_SIZE}px`;
    canvas.style.height = `${WHEEL_SIZE}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    setReady(true);
  }, []);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || players.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = WHEEL_SIZE; // draw in CSS pixels
    const center = size / 2;
    const radius = center - 10;
    const segAngle = (2 * Math.PI) / players.length;

    // Reset transform and clear
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const gradient = ctx.createRadialGradient(center, center, radius * 0.15, center, center, radius);
      gradient.addColorStop(0, player.color + '50');
      gradient.addColorStop(0.6, player.color + '90');
      gradient.addColorStop(1, player.color + 'DD');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = '#08080F';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Player label
      ctx.save();
      ctx.translate(center, center);
      const midAngle = startAngle + segAngle / 2;

      // Calculate label position along the midpoint of the segment
      const labelRadius = radius * 0.58;
      const labelX = Math.cos(midAngle) * labelRadius;
      const labelY = Math.sin(midAngle) * labelRadius;

      ctx.translate(labelX, labelY);

      // Rotate text to align with segment, flipping if upside-down
      let textAngle = midAngle;
      const normalizedAngle = ((midAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      if (normalizedAngle > Math.PI / 2 && normalizedAngle < (3 * Math.PI / 2)) {
        textAngle += Math.PI;
      }
      ctx.rotate(textAngle);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Emoji
      const emojiSize = Math.min(24, 100 / players.length);
      ctx.font = `${emojiSize}px sans-serif`;
      ctx.fillText(player.emoji, 0, players.length <= 6 ? -10 : 0);

      // Name (only if enough space)
      if (players.length <= 6) {
        const nameSize = Math.min(13, 70 / players.length);
        ctx.font = `bold ${nameSize}px Poppins, sans-serif`;
        ctx.fillStyle = '#F0F0FF';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 3;
        ctx.fillText(player.name, 0, 8);
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    });

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(center, center, radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = isSpinning ? '#FF2D7860' : '#9D00FF30';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 22, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(center, center, 0, center, center, 22);
    centerGrad.addColorStop(0, '#2A2A3E');
    centerGrad.addColorStop(1, '#12121E');
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = '#9D00FF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#9D00FF';
    ctx.fill();
  }, [players, isSpinning]);

  // Redraw on player/spinning changes
  useEffect(() => {
    if (ready) drawWheel();
  }, [drawWheel, ready]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer triangle */}
      <div
        className="absolute -top-3 z-10 w-0 h-0"
        style={{
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '26px solid #FFD700',
          filter: 'drop-shadow(0 0 10px #FFD700)',
        }}
      />

      {/* Wheel container */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: isSpinning ? 4 : 0,
          ease: [0.15, 0.85, 0.35, 1],
        }}
      >
        <canvas ref={canvasRef} />
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

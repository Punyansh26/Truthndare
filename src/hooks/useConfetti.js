import { useCallback, useRef } from 'react';

export function useConfetti() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const fire = useCallback((colors = ['#FF2D78', '#9D00FF', '#00F5FF', '#FFD700', '#00FF88']) => {
    // Use the existing canvas or create particles in the DOM
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const isCircle = Math.random() > 0.5;

      Object.assign(el.style, {
        position: 'fixed',
        width: `${size}px`,
        height: `${isCircle ? size : size * 0.4}px`,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : '2px',
        left: `${40 + Math.random() * 20}%`,
        top: '-10px',
        zIndex: '9999',
        pointerEvents: 'none',
        opacity: '1',
      });

      document.body.appendChild(el);
      particles.push({
        el,
        x: 40 + Math.random() * 20,
        y: -2,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.1 + Math.random() * 0.05,
        opacity: 1,
        decay: 0.005 + Math.random() * 0.008,
      });
    }

    function animate() {
      let alive = false;
      particles.forEach(p => {
        if (p.opacity <= 0) return;
        alive = true;
        p.vy += p.gravity;
        p.x += p.vx * 0.15;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;
        p.vx *= 0.99;

        Object.assign(p.el.style, {
          left: `${p.x}%`,
          top: `${p.y}vh`,
          transform: `rotate(${p.rotation}deg)`,
          opacity: Math.max(0, p.opacity),
        });
      });

      if (alive) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Cleanup
        particles.forEach(p => {
          if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
        });
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    // Auto cleanup after 4 seconds
    setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particles.forEach(p => {
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
      });
    }, 4000);
  }, []);

  return { fire };
}

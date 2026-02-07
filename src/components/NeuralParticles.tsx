import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  pulsePhase: number;
}

const NeuralParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles - neural network style
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
    const colors = ['#2E6EFF', '#00F0FF', '#B829DD', '#FF2E8C'];

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const fps = 30;
    const interval = 1000 / fps;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);

      // Visibility check
      if (document.hidden) return;

      // Throttle to 30fps
      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      ctx.fillStyle = 'rgba(2, 2, 4, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, i) => {
        // Update pulse phase
        particle.pulsePhase += 0.05;
        const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.2;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction - neural attraction
        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < 40000) { // 200 * 200
            const distance = Math.sqrt(distanceSq);
            const force = (200 - distance) / 200;
            particle.vx += (dx / distance) * force * 0.015;
            particle.vy += (dy / distance) * force * 0.015;
          }
        }

        // Boundary check with wrap
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Damping
        particle.vx *= 0.995;
        particle.vy *= 0.995;

        // Draw particle with glow
        const radius = particle.radius * pulseScale;

        // Only draw connections for every 2nd particle to save CPU
        if (i % 2 === 0) {
          particles.slice(i + 1, i + 15).forEach((other) => { // Limited neighbor check
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 22500) { // 150 * 150
              const dist = Math.sqrt(distSq);
              const opacity = (1 - dist / 150) * 0.3;

              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(46, 110, 255, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }

        // Draw Core (Skip radial gradient for better performance)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Mouse connections
        if (mouse.active) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 62500) { // 250 * 250
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / 250) * 0.4;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
    />
  );
};

export default NeuralParticles;

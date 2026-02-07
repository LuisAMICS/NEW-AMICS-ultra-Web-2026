import { useEffect, useRef } from 'react';

interface StreamParticle {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
}

const DataStreams = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<StreamParticle[]>([]);
  const animationRef = useRef<number | null>(null);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

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

    // Initialize stream particles
    const streamCount = Math.floor(window.innerWidth / 100);
    particlesRef.current = Array.from({ length: streamCount }, (_, i) => ({
      x: (i * 100) + Math.random() * 50,
      y: Math.random() * canvas.height,
      speed: 2 + Math.random() * 3,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: Math.random() * 0.3 + 0.1,
    }));

    let frameCount = 0;

    const animate = () => {
      frameCount++;
      
      // Only update every 3rd frame for performance
      if (frameCount % 3 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.y += particle.speed;

        // Reset if off screen
        if (particle.y > canvas.height) {
          particle.y = -20;
          particle.x = (Math.floor(particle.x / 100) * 100) + Math.random() * 50;
          particle.char = chars[Math.floor(Math.random() * chars.length)];
        }

        // Occasionally change character
        if (Math.random() < 0.05) {
          particle.char = chars[Math.floor(Math.random() * chars.length)];
        }

        // Draw character
        ctx.font = '14px monospace';
        ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
        ctx.fillText(particle.char, particle.x, particle.y);

        // Draw trail
        for (let i = 1; i <= 5; i++) {
          const trailY = particle.y - i * 15;
          if (trailY > 0) {
            ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity * (1 - i * 0.15)})`;
            ctx.fillText(
              chars[Math.floor(Math.random() * chars.length)],
              particle.x,
              trailY
            );
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.4 }}
    />
  );
};

export default DataStreams;

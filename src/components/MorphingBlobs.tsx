import { useEffect, useRef } from 'react';

const MorphingBlobs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animate blobs with GSAP-like smooth motion
    const blobs = container.querySelectorAll('.blob');
    
    blobs.forEach((blob, i) => {
      const element = blob as HTMLElement;
      let angle = (i * Math.PI * 2) / blobs.length;
      let radius = 150 + i * 50;
      let speed = 0.002 + i * 0.001;
      
      const animate = () => {
        angle += speed;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle * 1.5) * radius * 0.6;
        
        element.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animate);
      };
      
      animate();
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Blob 1 - Blue */}
      <div 
        className="blob morphing-blob absolute w-[600px] h-[600px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #2E6EFF 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '10%',
          left: '10%',
        }}
      />
      
      {/* Blob 2 - Cyan */}
      <div 
        className="blob morphing-blob absolute w-[500px] h-[500px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #00F0FF 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '50%',
          right: '5%',
          animationDelay: '-2s',
        }}
      />
      
      {/* Blob 3 - Purple */}
      <div 
        className="blob morphing-blob absolute w-[400px] h-[400px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #B829DD 0%, transparent 70%)',
          filter: 'blur(70px)',
          bottom: '10%',
          left: '30%',
          animationDelay: '-4s',
        }}
      />
      
      {/* Blob 4 - Pink accent */}
      <div 
        className="blob morphing-blob absolute w-[300px] h-[300px] opacity-10"
        style={{
          background: 'radial-gradient(circle, #FF2E8C 0%, transparent 70%)',
          filter: 'blur(50px)',
          top: '30%',
          right: '20%',
          animationDelay: '-6s',
        }}
      />
    </div>
  );
};

export default MorphingBlobs;

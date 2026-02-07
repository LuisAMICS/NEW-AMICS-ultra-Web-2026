import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const KineticText = ({ children, className = '', as: Component = 'span' }: KineticTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = charsRef.current;
    
    // Scroll-based animation
    gsap.fromTo(chars,
      { 
        opacity: 0.3,
        y: 20,
        rotateX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.02,
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 0.5,
        }
      }
    );
  }, []);

  const characters = children.split('');

  return (
    <div ref={containerRef} className="inline-block" style={{ perspective: '1000px' }}>
      <Component className={className}>
        {characters.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) charsRef.current[i] = el;
            }}
            className="inline-block"
            style={{ 
              transformStyle: 'preserve-3d',
              whiteSpace: char === ' ' ? 'pre' : 'normal'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </Component>
    </div>
  );
};

export default KineticText;

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Sparkles, Radio, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemDiagram = () => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGSVGElement>(null);

  const pillars = [
    {
      icon: MessageSquare,
      title: 'AI Concierge',
      subtitle: 'Sensors',
      desc: 'Gathers first-party data 24/7',
      color: '#2E6EFF',
      position: 'top'
    },
    {
      icon: Compass,
      title: 'Consulting',
      subtitle: 'Brain',
      desc: 'Analyzes data to architect strategy',
      color: '#B829DD',
      position: 'right'
    },
    {
      icon: Sparkles,
      title: 'AI Creative',
      subtitle: 'Fabricator',
      desc: 'Generates targeted assets instantly',
      color: '#FF2E8C',
      position: 'bottom'
    },
    {
      icon: Radio,
      title: 'Programmatic',
      subtitle: 'Distributor',
      desc: 'Delivers with precision',
      color: '#00F0FF',
      position: 'left'
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the circle path
      const circlePath = circleRef.current?.querySelector('.circle-path');
      if (circlePath) {
        const length = (circlePath as SVGPathElement).getTotalLength?.() || 1000;
        gsap.set(circlePath, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(circlePath, {
          strokeDashoffset: 0,
          duration: 3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: diagramRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 0.5
          }
        });
      }

      // Animate pillars
      const pillarCards = diagramRef.current?.querySelectorAll('.pillar-card');
      if (pillarCards) {
        gsap.fromTo(pillarCards,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1,
            stagger: 0.2,
            scrollTrigger: {
              trigger: diagramRef.current,
              start: 'top 60%',
              end: 'top 20%',
              scrub: 0.5
            }
          }
        );
      }

      // Animate center
      const center = diagramRef.current?.querySelector('.center-logo');
      if (center) {
        gsap.fromTo(center,
          { opacity: 0, scale: 0 },
          {
            opacity: 1, scale: 1,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: diagramRef.current,
              start: 'top 50%',
            }
          }
        );
      }
    }, diagramRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={diagramRef} className="relative w-full max-w-3xl mx-auto aspect-square">
      {/* SVG Circle */}
      <svg
        ref={circleRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
      >
        <defs>
          <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E6EFF" />
            <stop offset="33%" stopColor="#B829DD" />
            <stop offset="66%" stopColor="#FF2E8C" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
        </defs>
        <circle
          className="circle-path"
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="url(#circleGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Animated dots on circle */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + 150 * Math.cos(rad);
          const y = 200 + 150 * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r="6" fill={pillars[i].color}>
              <animate
                attributeName="r"
                values="6;8;6"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.5}s`}
              />
            </circle>
          );
        })}
      </svg>

      {/* Center Logo */}
      <div className="center-logo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#2E6EFF] to-[#00F0FF] flex items-center justify-center z-10">
        <span className="font-display font-bold text-white text-xl">AMICS</span>
      </div>

      {/* Pillar Cards */}
      {pillars.map((pillar, i) => {
        const Icon = pillar.icon;
        const positions: Record<string, string> = {
          top: 'top-0 left-1/2 -translate-x-1/2',
          right: 'top-1/2 right-0 translate-y-[-50%]',
          bottom: 'bottom-0 left-1/2 -translate-x-1/2',
          left: 'top-1/2 left-0 translate-y-[-50%]',
        };

        return (
          <div
            key={i}
            className={`pillar-card absolute ${positions[pillar.position]} w-48 glass-strong rounded-2xl p-4 text-center hoverable`}
          >
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${pillar.color}20` }}
            >
              <Icon size={24} style={{ color: pillar.color }} />
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-wider mb-1"
              style={{ color: pillar.color }}
            >
              {pillar.subtitle}
            </div>
            <div className="font-display font-semibold text-[#F0F4FF] text-sm mb-1">
              {pillar.title}
            </div>
            <div className="text-[#A7B0C8] text-xs">
              {pillar.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EcosystemDiagram;

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Sparkles, Radio, Compass, ArrowRight, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EcosystemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      icon: MessageSquare,
      title: 'AI Concierge',
      subtitle: 'Sensors',
      desc: 'Gathers first-party data from customer interactions 24/7.',
      color: '#2E6EFF',
      position: 'top-0 left-1/2 -translate-x-1/2'
    },
    {
      icon: Compass,
      title: 'Consulting',
      subtitle: 'Brain',
      desc: 'Analyzes data to find market gaps and architect strategy.',
      color: '#B829DD',
      position: 'top-1/2 right-0 translate-y-[-50%]'
    },
    {
      icon: Sparkles,
      title: 'AI Creative',
      subtitle: 'Fabricator',
      desc: 'Generates targeted assets instantly based on the data.',
      color: '#FF2E8C',
      position: 'bottom-0 left-1/2 -translate-x-1/2'
    },
    {
      icon: Radio,
      title: 'Programmatic',
      subtitle: 'Distributor',
      desc: 'Delivers those assets efficiently to the right audience.',
      color: '#00F0FF',
      position: 'top-1/2 left-0 translate-y-[-50%]'
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the circle
      const circlePath = diagramRef.current?.querySelector('.circle-path');
      if (circlePath) {
        const length = (circlePath as SVGPathElement).getTotalLength?.() || 1000;
        gsap.set(circlePath, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(circlePath, {
          strokeDashoffset: 0,
          duration: 3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top 20%',
            scrub: 0.5
          }
        });
      }

      // Animate pillar cards
      const pillarCards = diagramRef.current?.querySelectorAll('.pillar-card');
      if (pillarCards) {
        gsap.fromTo(pillarCards,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1,
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              end: 'top 10%',
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
              trigger: sectionRef.current,
              start: 'top 40%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="systems"
      className="relative py-24 px-6 lg:px-[6vw] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-gradient-radial from-[#2E6EFF]/10 via-transparent to-transparent blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#2E6EFF]/50" />
            <span className="font-mono text-xs text-[#2E6EFF] uppercase tracking-[0.2em]">The System</span>
            <div className="w-12 h-[1px] bg-[#2E6EFF]/50" />
          </div>
          <h2 className="font-display font-black text-[clamp(36px,6vw,80px)] leading-[0.95] text-[#F0F4FF] mb-6">
            The Intelligent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] via-[#00F0FF] to-[#B829DD]">Growth Loop</span>
          </h2>
          <p className="text-[#A7B0C8] text-lg max-w-2xl mx-auto">
            A self-reinforcing cybernetic loop where each component amplifies the others.
          </p>
        </div>

        {/* Diagram */}
        <div ref={diagramRef} className="relative w-full max-w-2xl mx-auto aspect-square mb-16">
          {/* SVG Circle */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
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
            {/* Animated dots */}
            {[0, 90, 180, 270].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 200 + 150 * Math.cos(rad);
              const y = 200 + 150 * Math.sin(rad);
              return (
                <circle key={i} cx={x} cy={y} r="8" fill={pillars[i].color}>
                  <animate
                    attributeName="r"
                    values="8;10;8"
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                  />
                </circle>
              );
            })}
          </svg>

          {/* Center Logo */}
          <div className="center-logo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-auto flex items-center justify-center z-10 drop-shadow-[0_0_30px_rgba(46,110,255,0.6)]">
            <img src="/amics-logo.png" alt="AMICS" className="w-full h-auto object-contain" />
          </div>

          {/* Flow arrows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 text-[#2E6EFF] text-xs font-mono">↓</div>
            <div className="absolute top-1/2 right-[15%] -translate-y-1/2 text-[#B829DD] text-xs font-mono">→</div>
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-[#FF2E8C] text-xs font-mono">↑</div>
            <div className="absolute top-1/2 left-[15%] -translate-y-1/2 text-[#00F0FF] text-xs font-mono">←</div>
          </div>

          {/* Pillar cards */}
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`pillar-card absolute ${pillar.position} w-48 lg:w-56 glass-strong rounded-2xl p-4 lg:p-6 text-center hoverable z-20`}
              >
                <div
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <Icon size={20} className="lg:size-6" style={{ color: pillar.color }} />
                </div>
                <div
                  className="font-mono text-[8px] lg:text-[10px] uppercase tracking-wider mb-1 lg:mb-2"
                  style={{ color: pillar.color }}
                >
                  {pillar.subtitle}
                </div>
                <h3 className="font-display font-bold text-xs lg:text-base text-[#F0F4FF] mb-1 lg:mb-2">{pillar.title}</h3>
                <p className="text-[#A7B0C8] text-[10px] lg:text-xs leading-tight lg:leading-normal">{pillar.desc}</p>
              </div>
            );
          })}
        </div>



        {/* Flow description */}
        <div className="glass rounded-xl p-8 border border-[#2E6EFF]/20 mb-12">
          <p className="text-center text-[#A7B0C8] text-lg leading-relaxed">
            <span className="text-[#2E6EFF] font-medium">Data</span> feeds{' '}
            <span className="text-[#B829DD] font-medium">strategy</span>.{' '}
            <span className="text-[#B829DD] font-medium">Strategy</span> feeds{' '}
            <span className="text-[#FF2E8C] font-medium">creative</span>.{' '}
            <span className="text-[#FF2E8C] font-medium">Creative</span> feeds{' '}
            <span className="text-[#00F0FF] font-medium">media</span>.{' '}
            <span className="text-[#00F0FF] font-medium">Media</span> feeds{' '}
            <span className="text-[#2E6EFF] font-medium">data</span>.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToContact}
            className="bg-[#2E6EFF] hover:bg-[#1a5aee] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(46,110,255,0.5)] flex items-center gap-2 hoverable"
          >
            See How It Works
            <ArrowRight size={18} />
          </button>
          <button className="flex items-center gap-2 text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors py-3 px-6 hoverable">
            <Download size={18} />
            Download the Playbook
          </button>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;

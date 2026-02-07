import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Radio, TrendingUp, Target, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProgrammaticSectionProps {
  className?: string;
}

const ProgrammaticSection = ({ className = '' }: ProgrammaticSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.7,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(bgRef.current,
        { x: '20vw', scale: 1.1, opacity: 0.2 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      const contentElements = contentRef.current?.querySelectorAll('.animate-item');
      if (contentElements) {
        scrollTl.fromTo(contentElements,
          { x: '-50vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.03, ease: 'none' },
          0.05
        );
      }

      const metrics = metricsRef.current?.querySelectorAll('.metric-item');
      if (metrics) {
        scrollTl.fromTo(metrics,
          { y: '10vh', opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.02, ease: 'none' },
          0.12
        );
      }

      // EXIT (70% - 100%)
      if (contentElements) {
        scrollTl.fromTo(contentElements,
          { x: 0, opacity: 1 },
          { x: '-20vw', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      if (metrics) {
        scrollTl.fromTo(metrics,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.08, opacity: 0.7 },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const channels = [
    { icon: Globe, name: 'Open Web', desc: 'Premium publishers' },
    { icon: Radio, name: 'CTV/OTT', desc: 'Streaming platforms' },
    { icon: Target, name: 'Audio', desc: 'Podcasts & music' },
    { icon: TrendingUp, name: 'DOOH', desc: 'Digital billboards' },
  ];

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.2 }}
      >
        <img
          src="/programmatic_data_wall.jpg"
          alt="Programmatic Data Wall"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-left" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        {/* Eyebrow */}
        <div className="animate-item flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-gradient-to-r from-[#00F0FF] to-[#2E6EFF]" />
          <span className="font-mono text-xs tracking-[0.2em] text-[#00F0FF] uppercase">
            Media Buying
          </span>
        </div>

        {/* Headline */}
        <h2 className="animate-item font-display font-black uppercase tracking-tighter text-[#F0F4FF] text-[clamp(32px,5vw,80px)] leading-[0.95] mb-8 max-w-[55vw]">
          Algorithmic<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#2E6EFF]">Media Buying</span>
        </h2>

        {/* Subheadline */}
        <p className="animate-item text-[#A7B0C8] text-[clamp(14px,1.1vw,18px)] leading-relaxed max-w-[36vw] mb-10">
          Reach high-intent audiences across CTV, audio, and the open web—optimized
          in real time. Beyond the walled gardens.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToContact}
          className="animate-item btn-primary w-fit hoverable"
        >
          Explore Programmatic
        </button>
      </div>

      {/* Channel cards */}
      <div
        ref={metricsRef}
        className="absolute right-[5vw] bottom-[15vh] grid grid-cols-2 gap-4"
      >
        {channels.map((channel, i) => {
          const Icon = channel.icon;
          return (
            <div
              key={i}
              className="metric-item glass p-5 rounded-2xl hoverable"
            >
              <Icon size={24} className="text-[#00F0FF] mb-3" />
              <div className="font-display font-semibold text-[#F0F4FF] mb-1">{channel.name}</div>
              <div className="font-mono text-[10px] text-[#A7B0C8] uppercase">{channel.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Decorative grid */}
      <div className="absolute top-[15%] right-[15%] w-24 h-24 grid-bg opacity-30" />
    </section>
  );
};

export default ProgrammaticSection;

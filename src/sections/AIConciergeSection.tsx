import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Bot, Cpu, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AIConciergeSectionProps {
  className?: string;
}

const AIConciergeSection = ({ className = '' }: AIConciergeSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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

      const stats = statsRef.current?.querySelectorAll('.stat-item');
      if (stats) {
        scrollTl.fromTo(stats,
          { y: '8vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.15
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

      if (stats) {
        scrollTl.fromTo(stats,
          { y: 0, opacity: 1 },
          { y: '10vh', opacity: 0, ease: 'power2.in' },
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



  const stats = [
    { icon: Bot, value: '24/7', label: 'Availability' },
    { icon: Cpu, value: '<1s', label: 'Response Time' },
    { icon: Zap, value: '∞', label: 'Scalability' },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.2 }}
      >
        <img
          src="/ai_concierge_interface.jpg"
          alt="AI Concierge Interface"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-left" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        {/* Eyebrow */}
        <div className="animate-item flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]" />
          <span className="font-mono text-xs tracking-[0.2em] text-[#00F0FF] uppercase">
            AI Services
          </span>
        </div>

        {/* Headline */}
        <h2 className="animate-item font-display font-black uppercase tracking-tighter text-[#F0F4FF] text-[clamp(36px,5.5vw,88px)] leading-[0.9] mb-8 max-w-[55vw]">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">24/7</span><br />
          <span className="text-[#00F0FF] glow-text-cyan">Workforce</span>
        </h2>

        {/* Subheadline */}
        <p className="animate-item text-[#A7B0C8] text-[clamp(14px,1.1vw,18px)] leading-relaxed max-w-[36vw] mb-10">
          Deploy AI Concierges that qualify leads, book meetings, and support
          customers—without drift. Autonomous agents that learn and improve with every interaction.
        </p>

        {/* Feature list */}
        <div className="animate-item flex flex-wrap gap-4 mb-10">
          {['Natural Language', 'CRM Integration', 'Multi-channel', 'Analytics'].map((feature, i) => (
            <span
              key={i}
              className="px-4 py-2 glass rounded-full text-sm text-[#A7B0C8] border border-[#2E6EFF]/20"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="https://calendly.com/danny-amicsconsultinggroup/30min?month=2026-02"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-item btn-primary w-fit hoverable text-center"
        >
          Explore AI Concierge
        </a>

        {/* Stats */}
        <div
          ref={statsRef}
          className="absolute bottom-[8vh] left-6 lg:left-[6vw] flex gap-8"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-item flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E6EFF]/10 flex items-center justify-center">
                  <Icon size={18} className="text-[#2E6EFF]" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-[#F0F4FF]">{stat.value}</div>
                  <div className="font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Chip */}
      <div className="absolute bottom-[8vh] right-6 lg:right-[6vw] flex items-center gap-3 glass-strong px-5 py-3 rounded-full hoverable">
        <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
        <MessageSquare size={16} className="text-[#2E6EFF]" />
        <span className="font-mono text-sm text-[#A7B0C8]">danny@amicsconsultinggroup.com</span>
      </div>
    </section>
  );
};

export default AIConciergeSection;

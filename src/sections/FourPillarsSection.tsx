import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, MessageSquare, Radio, Compass, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FourPillarsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      icon: Sparkles,
      title: 'AI Creative Studio',
      subtitle: 'Infinite Assets. Zero Studio Costs.',
      description: 'High-fidelity AI photo shoots and video generation. Turn one product image into global campaigns tailored to every season, market, and demographic instantly.',
      tags: ['Contextual Relevance', 'Hyper-Localization', 'Speed to Market'],
      color: '#B829DD',
      href: '#ai-creative'
    },
    {
      icon: MessageSquare,
      title: 'AI Concierge & Agents',
      subtitle: 'The 24/7 Workforce',
      description: 'Deploy intelligent AI agents that act as concierges, sales development reps (SDRs), and support staff. They never sleep, never miss a lead, and learn from every interaction.',
      tags: ['Hospitality & Retail', 'B2B Sales (SDRs)', 'Internal Ops'],
      color: '#2E6EFF',
      href: '#ai-concierge'
    },
    {
      icon: Radio,
      title: 'Programmatic Media',
      subtitle: 'Precision at Scale',
      description: 'Algorithmic media buying that targets your ideal customer with surgical precision across the open web, CTV, and audio. No wasted impressions.',
      tags: ['Connected TV (CTV)', 'Audio Programmatic', 'Dynamic Display'],
      color: '#00F0FF',
      href: '#programmatic'
    },
    {
      icon: Compass,
      title: 'Strategic Consulting',
      subtitle: 'Data-First Architecture',
      description: "We don't guess. We audit, architect, and optimize your entire digital stack to ensure your AI and human teams are working in perfect sync.",
      tags: ['Growth Audit', 'Tech Stack Mapping', 'Brand Safety'],
      color: '#FF2E8C',
      href: '#consulting'
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.pillar-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 80, opacity: 0, rotateY: -15 },
          {
            y: 0, opacity: 1, rotateY: 0,
            stagger: 0.12,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 0.5
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#00F0FF]/50" />
            <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-[0.2em]">Our Solutions</span>
            <div className="w-12 h-[1px] bg-[#00F0FF]/50" />
          </div>
          <h2 className="font-display font-black text-[clamp(36px,6vw,72px)] leading-[1] text-[#F0F4FF] mb-4">
            Four Pillars of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] via-[#00F0FF] to-[#B829DD]">Growth</span>
          </h2>
          <p className="text-[#A7B0C8] text-lg max-w-xl mx-auto">
            An integrated ecosystem where each component amplifies the others.
          </p>
        </div>

        {/* Pillar cards */}
        <div 
          ref={cardsRef} 
          className="grid md:grid-cols-2 gap-6"
          style={{ perspective: '1000px' }}
        >
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={i}
                className="pillar-card glass rounded-2xl p-8 hoverable group cursor-pointer hover:border-[#2E6EFF]/30 transition-all duration-300"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => scrollToSection(pillar.href)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  >
                    <Icon size={28} style={{ color: pillar.color }} />
                  </div>
                  <ArrowUpRight 
                    size={24} 
                    className="text-[#A7B0C8] group-hover:text-[#00F0FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" 
                  />
                </div>

                <h3 className="font-display font-bold text-2xl text-[#F0F4FF] mb-2">
                  {pillar.title}
                </h3>
                <p 
                  className="font-medium text-sm mb-4"
                  style={{ color: pillar.color }}
                >
                  {pillar.subtitle}
                </p>

                <p className="text-[#A7B0C8] text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {pillar.tags.map((tag, j) => (
                    <span 
                      key={j}
                      className="px-3 py-1 rounded-full text-xs text-[#A7B0C8] bg-[#0A0A0F] border border-[#2E6EFF]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FourPillarsSection;

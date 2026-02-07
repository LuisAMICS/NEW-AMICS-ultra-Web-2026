import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Bot, Shield } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

const MacroEnvironmentSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const trends = [
    {
      icon: Layers,
      stat: '50%',
      title: 'The Dissolution of "Media"',
      description: 'Media.Monks dropped "Media" from their name, signaling that content, data, and digital transformation are inseparable. Their AI-powered "Monks.Flow" reduces translation costs by 50% and increases speed to market by 60%.',
      tag: 'Asset-Based Pricing Model',
      color: '#2E6EFF'
    },
    {
      icon: Bot,
      stat: '24/7',
      title: 'The Agentic Revolution',
      description: 'Agencies are deploying AI Agents—autonomous entities that plan and execute multi-step workflows. Competitors like 11x.ai and Artisan create "Digital Workers" that ARE the sales team.',
      tag: 'Intelligent Digital Labor',
      color: '#B829DD'
    },
    {
      icon: Shield,
      stat: '98%',
      title: 'Privacy-First Programmatic',
      description: 'With third-party cookies deprecated, the new winners leverage Contextual Targeting and First-Party Data Activation. Programmatic now reaches 98% of the internet that "Walled Gardens" miss.',
      tag: 'Beyond Walled Gardens',
      color: '#00F0FF'
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.trend-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.15,
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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#2E6EFF]/50" />
            <span className="font-mono text-xs text-[#2E6EFF] uppercase tracking-[0.2em]">Macro-Strategic Environment</span>
            <div className="w-12 h-[1px] bg-[#2E6EFF]/50" />
          </div>
          <h2 className="font-display font-black text-[clamp(32px,5vw,56px)] leading-[1.1] text-[#F0F4FF] mb-4">
            The Era of Digital<br />
            Marketing is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">Over.</span>
          </h2>
          <p className="text-[#A7B0C8] text-lg">
            We've Entered the Era of <span className="text-[#00F0FF] font-medium">Algorithmic Reality.</span>
          </p>
        </div>

        {/* Trend cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {trends.map((trend, i) => {
            const Icon = trend.icon;
            return (
              <div
                key={i}
                className="trend-card glass rounded-3xl p-8 hoverable group hover:border-[#2E6EFF]/30 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${trend.color}15` }}
                >
                  <Icon size={28} style={{ color: trend.color }} />
                </div>

                <div
                  className="font-display font-black text-5xl mb-4"
                  style={{ color: trend.color }}
                >
                  <AnimatedCounter value={trend.stat} />
                </div>

                <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-4">
                  {trend.title}
                </h3>

                <p className="text-[#A7B0C8] text-sm leading-relaxed mb-6">
                  {trend.description}
                </p>

                <div
                  className="inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider"
                  style={{ backgroundColor: `${trend.color}15`, color: trend.color }}
                >
                  {trend.tag}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <p className="text-center text-[#A7B0C8] text-sm mt-12 max-w-2xl mx-auto">
          To effectively position Amics Consulting Group, one must first understand the tectonic shifts
          altering the bedrock of the industry.
        </p>
      </div>
    </section>
  );
};

export default MacroEnvironmentSection;

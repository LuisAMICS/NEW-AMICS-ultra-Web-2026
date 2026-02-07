import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PartnersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const partners = [
    { name: 'Google', category: 'Ads & Analytics', color: '#2E6EFF' },
    { name: 'Meta', category: 'Social Advertising', color: '#00F0FF' },
    { name: 'OpenAI', category: 'AI Infrastructure', color: '#B829DD' },
    { name: 'The Trade Desk', category: 'Programmatic', color: '#FF2E8C' },
    { name: 'Salesforce', category: 'CRM', color: '#2E6EFF' },
    { name: 'HubSpot', category: 'Marketing Automation', color: '#00F0FF' },
    { name: 'Shopify', category: 'E-commerce', color: '#B829DD' },
    { name: 'AWS', category: 'Cloud Infrastructure', color: '#FF2E8C' },
    { name: 'Snowflake', category: 'Data Warehouse', color: '#2E6EFF' },
    { name: 'Segment', category: 'Customer Data', color: '#00F0FF' },
    { name: 'Figma', category: 'Design', color: '#B829DD' },
    { name: 'Stripe', category: 'Payments', color: '#FF2E8C' },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.partner-item');
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1, scale: 1,
            stagger: 0.04,
            scrollTrigger: {
              trigger: gridRef.current,
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#B829DD]/50" />
            <span className="font-mono text-xs text-[#B829DD] uppercase tracking-[0.2em]">Partners</span>
            <div className="w-12 h-[1px] bg-[#B829DD]/50" />
          </div>
          <h2 className="font-display font-black text-[clamp(32px,5vw,64px)] leading-[0.95] text-[#F0F4FF] mb-4">
            Built on the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B829DD] to-[#FF2E8C]">Infrastructure</span>
          </h2>
          <p className="text-[#A7B0C8] text-lg max-w-xl mx-auto">
            Certified partnerships and deep integrations across the modern marketing stack.
          </p>
        </div>

        {/* Partner Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12"
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              className="partner-item glass rounded-2xl p-6 flex flex-col items-center justify-center text-center hoverable group cursor-pointer relative overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${partner.color}20 0%, transparent 70%)`
                }}
              />

              <span className="font-display font-bold text-xl text-[#F0F4FF] mb-1 group-hover:text-white transition-colors relative z-10">
                {partner.name}
              </span>
              <span className="font-mono text-[10px] text-[#A7B0C8] tracking-wider uppercase relative z-10">
                {partner.category}
              </span>

              {/* Border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: `inset 0 0 0 1px ${partner.color}40`
                }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 text-[#F0F4FF] hover:text-[#B829DD] transition-colors font-medium group hoverable">
            See our tech stack
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

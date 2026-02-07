import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Globe, Clock, Layers, Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AIPhotoDetailSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const deliverablesRef = useRef<HTMLDivElement>(null);

  const deliverables = [
    {
      icon: Globe,
      title: 'Contextual Relevance',
      desc: 'Place your product on a beach in Bali, a penthouse in New York, or a snow-capped mountain—all in the same afternoon.',
      color: '#B829DD'
    },
    {
      icon: Layers,
      title: 'Hyper-Localization',
      desc: 'Adapt visuals for specific markets (change background scenery or model demographics) to increase resonance and conversion.',
      color: '#FF2E8C'
    },
    {
      icon: Clock,
      title: 'Speed to Market',
      desc: 'Launch campaigns in days, not months. Test 50 creative variations to see what performs best, then scale the winner.',
      color: '#00F0FF'
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const contentElements = contentRef.current?.querySelectorAll('.animate-item');
      if (contentElements) {
        gsap.fromTo(contentElements,
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.5
            }
          }
        );
      }

      const deliverableCards = deliverablesRef.current?.querySelectorAll('.deliverable-card');
      if (deliverableCards) {
        gsap.fromTo(deliverableCards,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.12,
            scrollTrigger: {
              trigger: deliverablesRef.current,
              start: 'top 75%',
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
      id="ai-creative"
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div ref={contentRef}>
            <div className="animate-item flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#B829DD]" />
              <span className="font-mono text-xs text-[#B829DD] uppercase tracking-wider">Creative Studio</span>
            </div>

            <h2 className="animate-item font-display font-black text-[clamp(36px,5vw,64px)] leading-[1] text-[#F0F4FF] mb-6">
              The End of the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B829DD] to-[#FF2E8C]">Traditional Photo Shoot.</span>
            </h2>

            <p className="animate-item text-[#A7B0C8] text-lg leading-relaxed mb-8">
              Logistics. Location scouting. Model booking. Equipment rentals. The traditional photo shoot is a{' '}
              <span className="text-[#F0F4FF] font-medium">drain on your budget and timeline.</span>
            </p>

            <div className="animate-item glass rounded-2xl p-6 border border-[#B829DD]/20 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B829DD]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={24} className="text-[#B829DD]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F0F4FF] mb-2">Amics AI Photo Shoots</h3>
                  <p className="text-[#A7B0C8] text-sm leading-relaxed">
                    Liberate your brand from physical constraints. We train custom AI models on your product SKUs to generate{' '}
                    <span className="text-[#B829DD] font-medium">photorealistic lifestyle imagery</span> in any setting imaginable.
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Liquidity concept */}
            <div className="animate-item glass rounded-2xl p-6 border border-[#FF2E8C]/20 mb-8">
              <h3 className="font-display font-bold text-lg text-[#F0F4FF] mb-3">Asset Liquidity</h3>
              <p className="text-[#A7B0C8] text-sm leading-relaxed mb-4">
                A static photo is an <span className="text-[#FF2E8C]">"illiquid asset"</span> (hard to change). An Amics AI Model is a{' '}
                <span className="text-[#00F0FF]">"liquid asset"</span> (can be transformed instantly into any format or context).
              </p>
              <div className="flex items-center gap-2 text-[#FF2E8C] text-sm">
                <span>Static Photo</span>
                <ArrowRight size={16} />
                <span className="text-[#00F0FF]">AI Model</span>
              </div>
            </div>

            {/* CTA */}
            <button className="animate-item bg-[#B829DD] hover:bg-[#9a1fb8] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(184,41,221,0.5)] hoverable">
              Generate Your First Asset
            </button>
          </div>

          {/* Right - Deliverables */}
          <div ref={deliverablesRef} className="space-y-4">
            <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-6">What We Deliver</h3>
            {deliverables.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="deliverable-card glass rounded-2xl p-6 hoverable group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-[#F0F4FF] mb-2">{item.title}</h4>
                      <p className="text-[#A7B0C8] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Before/After visual */}
            <div className="deliverable-card glass rounded-2xl p-6 border border-[#B829DD]/30">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#A7B0C8] uppercase tracking-wider">Visual Proof</span>
                <span className="font-mono text-xs text-[#00F0FF]">Before → After</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-[#0A0A0F] rounded-xl flex items-center justify-center border border-[#2E6EFF]/20">
                  <div className="text-center">
                    <Camera size={32} className="text-[#A7B0C8] mx-auto mb-2" />
                    <span className="text-[#A7B0C8] text-xs">Raw Product Shot</span>
                  </div>
                </div>
                <div className="aspect-video bg-[#0A0A0F] rounded-xl flex items-center justify-center border border-[#B829DD]/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B829DD]/20 to-transparent" />
                  <div className="text-center relative z-10">
                    <Sparkles size={32} className="text-[#B829DD] mx-auto mb-2" />
                    <span className="text-[#B829DD] text-xs">AI-Generated Campaign</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPhotoDetailSection;

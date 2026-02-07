import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Calendar, Headphones, TicketCheck, Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AIConciergeDetailSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const capabilities = [
    { icon: Calendar, title: 'Hospitality & Retail', desc: 'Manage bookings, upsell amenities, handle itinerary changes' },
    { icon: Bot, title: 'B2B Sales (AI SDRs)', desc: 'Autonomously prospect, qualify, and book meetings' },
    { icon: Headphones, title: 'Customer Support', desc: '24/7 instant responses with perfect recall' },
    { icon: TicketCheck, title: 'Internal Ops', desc: 'Route tickets and manage knowledge bases' },
  ];

  const comparisonData = [
    { feature: 'Availability', human: '9-5 / Shift-based', ai: '24/7/365', highlight: true },
    { feature: 'Response Time', human: 'Minutes to Hours', ai: 'Milliseconds', highlight: true },
    { feature: 'Scalability', human: 'Expensive (Linear Hiring)', ai: 'Infinite (Instant Scale)', highlight: true },
    { feature: 'Memory', human: 'Fragmented', ai: 'Perfect Customer Recall', highlight: false },
    { feature: 'Cost', human: 'High Overhead', ai: 'Fraction of the Cost', highlight: true },
    { feature: 'Consistency', human: 'Variable', ai: '100% Brand-Aligned', highlight: false },
    { feature: 'Multilingual', human: 'Limited', ai: '50+ Languages', highlight: false },
    { feature: 'Learning', human: 'Manual Training', ai: 'Continuous Improvement', highlight: false },
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

      const tableRows = tableRef.current?.querySelectorAll('.table-row');
      if (tableRows) {
        gsap.fromTo(tableRows,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: tableRef.current,
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
      id="ai-concierge"
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div ref={contentRef}>
            <div className="animate-item flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#2E6EFF]" />
              <span className="font-mono text-xs text-[#2E6EFF] uppercase tracking-wider">AI Services</span>
            </div>

            <h2 className="animate-item font-display font-black text-[clamp(36px,5vw,64px)] leading-[1] text-[#F0F4FF] mb-6">
              Your Best Employee<br />
              is Now <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">Code.</span>
            </h2>

            <p className="animate-item text-[#A7B0C8] text-lg leading-relaxed mb-8">
              Customer expectations have changed. They demand <span className="text-[#F0F4FF] font-medium">instant answers, 24/7 availability,
                and hyper-personalization.</span> Traditional support teams can't scale linearly with demand—but Amics AI Concierges can.
            </p>

            {/* The Agentic Advantage */}
            <div className="animate-item glass rounded-2xl p-6 border border-[#2E6EFF]/20 mb-8">
              <h3 className="font-display font-bold text-lg text-[#F0F4FF] mb-4">The "Agentic" Advantage</h3>
              <p className="text-[#A7B0C8] text-sm leading-relaxed mb-4">
                Unlike basic chatbots that get stuck in loops, our AI Concierges use advanced NLP and agentic workflows to perform complex tasks:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((cap, i) => {
                  const Icon = cap.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#2E6EFF]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[#2E6EFF]" />
                      </div>
                      <div>
                        <div className="text-[#F0F4FF] text-sm font-medium">{cap.title}</div>
                        <div className="text-[#A7B0C8] text-xs">{cap.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button className="animate-item bg-[#2E6EFF] hover:bg-[#1a5aee] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(46,110,255,0.5)] hoverable">
              Deploy Your AI Concierge
            </button>
          </div>

          {/* Right - Comparison table */}
          <div ref={tableRef} className="glass rounded-3xl p-6 border border-[#2E6EFF]/20">
            <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-6 text-center">
              Human vs. Amics AI Concierge
            </h3>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2E6EFF]/20">
                    <th className="text-left py-3 px-2 font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">Feature</th>
                    <th className="text-left py-3 px-2 font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">Traditional</th>
                    <th className="text-left py-3 px-2 font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider">Amics AI</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr
                      key={i}
                      className={`table-row border-b border-[#2E6EFF]/10 ${row.highlight ? 'bg-[#2E6EFF]/5' : ''}`}
                    >
                      <td className="py-3 px-2 text-[#F0F4FF] text-sm">{row.feature}</td>
                      <td className="py-3 px-2 text-[#A7B0C8] text-sm flex items-center gap-2">
                        <X size={14} className="text-[#FF2E8C]" />
                        {row.human}
                      </td>
                      <td className="py-3 px-2 text-[#00F0FF] text-sm font-medium flex items-center gap-2">
                        <Check size={14} className="text-[#00F0FF]" />
                        {row.ai}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConciergeDetailSection;

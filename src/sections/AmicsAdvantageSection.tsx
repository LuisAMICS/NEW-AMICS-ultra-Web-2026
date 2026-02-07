import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AmicsAdvantageSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const comparisonData = [
    { feature: 'Pricing Model', traditional: 'Hourly / Project Fees (High)', tech: 'SaaS Subscription (Low)', caas: 'Subscription / Retainer (Mid-High)', amics: 'Hybrid Retainer (Asset-Based + Consulting)', highlight: true },
    { feature: 'Speed', traditional: 'Weeks/Months', tech: 'Seconds (Self-Serve)', caas: '12-24 Hours', amics: 'Real-Time Strategy + Execution', highlight: true },
    { feature: 'Quality Control', traditional: 'High (Human)', tech: 'Variable (User Dependent)', caas: 'High (Human + AI)', amics: 'Strategic Brand Safety (Consultant-Led)', highlight: false },
    { feature: 'Scalability', traditional: 'Low (Linear Labor)', tech: 'Infinite (Compute Limited)', caas: 'High (Pool of Creatives)', amics: 'Targeted Scale (Programmatic Integrated)', highlight: true },
    { feature: 'Primary Value Prop', traditional: '"Craft & Awards"', tech: '"Cheap & Fast"', caas: '"Capacity & Reliability"', amics: '"Intelligent Growth Loop" (Creative feeds Media)', highlight: true },
    { feature: 'Data Integration', traditional: 'Fragmented', tech: 'Platform-Specific', caas: 'Limited', amics: 'Unified Ecosystem', highlight: false },
    { feature: 'Strategic Guidance', traditional: 'Consultant-Led', tech: 'Self-Serve', caas: 'Project Manager', amics: 'AI + Human Hybrid', highlight: true },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const rows = tableRef.current?.querySelectorAll('.table-row');
      if (rows) {
        gsap.fromTo(rows,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            stagger: 0.05,
            scrollTrigger: {
              trigger: tableRef.current,
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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#2E6EFF]/50" />
            <span className="font-mono text-xs text-[#2E6EFF] uppercase tracking-[0.2em]">Competitive Analysis</span>
            <div className="w-12 h-[1px] bg-[#2E6EFF]/50" />
          </div>
          <h2 className="font-display font-black text-[clamp(36px,5vw,64px)] leading-[1] text-[#F0F4FF] mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">Amics Advantage</span>
          </h2>
          <p className="text-[#A7B0C8] text-lg max-w-2xl mx-auto">
            While competitors specialize in just AI agents or just creative, Amics offers the entire ecosystem.
          </p>
        </div>

        {/* Comparison Table */}
        <div ref={tableRef} className="glass rounded-3xl p-6 border border-[#2E6EFF]/20 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2E6EFF]/20">
                <th className="text-left py-4 px-4 font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">Feature</th>
                <th className="text-left py-4 px-4 font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">Traditional Agency</th>
                <th className="text-left py-4 px-4 font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">Tech Platform</th>
                <th className="text-left py-4 px-4 font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">CaaS (Superside)</th>
                <th className="text-left py-4 px-4 font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider">Amics</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr
                  key={i}
                  className={`table-row border-b border-[#2E6EFF]/10 ${row.highlight ? 'bg-[#2E6EFF]/5' : ''}`}
                >
                  <td className="py-4 px-4 text-[#F0F4FF] font-medium text-sm">{row.feature}</td>
                  <td className="py-4 px-4 text-[#A7B0C8] text-sm">{row.traditional}</td>
                  <td className="py-4 px-4 text-[#A7B0C8] text-sm">{row.tech}</td>
                  <td className="py-4 px-4 text-[#A7B0C8] text-sm">{row.caas}</td>
                  <td className="py-4 px-4 text-[#00F0FF] text-sm font-medium flex items-center gap-2">
                    <Check size={14} className="text-[#00F0FF]" />
                    {row.amics}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key takeaway */}
        <div className="mt-8 glass rounded-3xl p-6 border border-[#00F0FF]/20 bg-gradient-to-r from-[#00F0FF]/10 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={24} className="text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#F0F4FF] mb-2">The Market Position</h3>
              <p className="text-[#A7B0C8] text-sm leading-relaxed">
                While the market is crowded with "Agencies" and "Tools," there is a scarcity of "Integrators"—partners who can
                weave these disparate technologies into a coherent business strategy. Amics fills that void.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmicsAdvantageSection;

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingDown, Clock, Users, Zap, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const problems = [
    { icon: TrendingDown, label: 'Weeks', sublabel: 'For creative', color: '#FF2E8C' },
    { icon: Clock, label: 'Months', sublabel: 'For data', color: '#FF6B35' },
    { icon: Users, label: 'Linear', sublabel: 'Scaling only', color: '#FFB800' },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.fromTo(headlineRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.5
          }
        }
      );

      // Cards
      const cards = cardsRef.current?.querySelectorAll('.problem-card');
      if (cards) {
        gsap.fromTo(cards,
          { x: 100, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              end: 'top 45%',
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
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#FF2E8C]" />
              <span className="font-mono text-xs text-[#FF2E8C] uppercase tracking-wider">The Problem</span>
            </div>
            
            <h2 
              ref={headlineRef}
              className="font-display font-black text-[clamp(36px,5vw,64px)] leading-[1] text-[#F0F4FF] mb-8"
            >
              The Old Agency<br />
              Model is <span className="text-[#FF2E8C]">Broken.</span>
            </h2>

            <p className="text-[#A7B0C8] text-lg leading-relaxed mb-8">
              Traditional marketing is <span className="text-[#F0F4FF] font-medium">slow, manual, and reactive.</span> You wait weeks for creative, 
              months for data, and pay for hours that don't drive revenue.
            </p>

            {/* Warning box */}
            <div className="glass rounded-3xl p-6 border border-[#FF2E8C]/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF2E8C]/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-[#FF2E8C]" />
                </div>
                <div>
                  <p className="text-[#A7B0C8] text-sm leading-relaxed">
                    The "Service Bureau" model—characterized by hourly billing, manual execution, and linear scaling—is 
                    rapidly disintegrating. In an algorithmic world, <span className="text-[#FF2E8C] font-medium">latency is the enemy of growth.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Solution box */}
            <div className="mt-8 glass rounded-3xl p-6 border border-[#2E6EFF]/20 bg-gradient-to-br from-[#2E6EFF]/10 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2E6EFF]/20 flex items-center justify-center flex-shrink-0">
                  <Zap size={20} className="text-[#2E6EFF]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#2E6EFF] uppercase tracking-wider">The Amics Difference</span>
                  <p className="text-[#F0F4FF] font-display font-bold text-xl mt-1">
                    We don't sell hours.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">
                      We sell velocity.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Problem cards */}
          <div ref={cardsRef} className="space-y-4">
            {problems.map((problem, i) => {
              const Icon = problem.icon;
              return (
                <div 
                  key={i}
                  className="problem-card glass rounded-3xl p-6 flex items-center gap-6 hoverable"
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${problem.color}15` }}
                  >
                    <Icon size={28} style={{ color: problem.color }} />
                  </div>
                  <div>
                    <div 
                      className="font-display font-bold text-3xl"
                      style={{ color: problem.color }}
                    >
                      {problem.label}
                    </div>
                    <div className="text-[#A7B0C8] text-sm">{problem.sublabel}</div>
                  </div>
                </div>
              );
            })}

            {/* Solution card */}
            <div className="problem-card glass rounded-3xl p-6 border border-[#00F0FF]/30 bg-gradient-to-r from-[#00F0FF]/10 to-transparent">
              <p className="text-[#A7B0C8] text-sm leading-relaxed">
                By integrating cutting-edge AI agents and programmatic infrastructure, we{' '}
                <span className="text-[#00F0FF] font-medium">compress months of work into days</span>—delivering 
                hyper-personalized customer experiences at a scale previously impossible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

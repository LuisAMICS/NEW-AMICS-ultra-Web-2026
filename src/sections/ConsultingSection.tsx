import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Lightbulb, BarChart3, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ConsultingSectionProps {
  className?: string;
}

const ConsultingSection = ({ className = '' }: ConsultingSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

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

      const processItems = processRef.current?.querySelectorAll('.process-item');
      if (processItems) {
        scrollTl.fromTo(processItems,
          { x: '10vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.1
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

      if (processItems) {
        scrollTl.fromTo(processItems,
          { x: 0, opacity: 1 },
          { x: '10vw', opacity: 0, ease: 'power2.in' },
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

  const process = [
    { icon: Compass, step: '01', title: 'Audit', desc: 'Analyze your stack' },
    { icon: Lightbulb, step: '02', title: 'Strategy', desc: 'Map the journey' },
    { icon: BarChart3, step: '03', title: 'Execute', desc: 'Deploy & optimize' },
    { icon: Users, step: '04', title: 'Scale', desc: 'Grow revenue' },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.2 }}
      >
        <img
          src="/consulting_analyst_desk.jpg"
          alt="Strategy Consultant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-left" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        {/* Eyebrow */}
        <div className="animate-item flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-gradient-to-r from-[#2E6EFF] to-[#B829DD]" />
          <span className="font-mono text-xs tracking-[0.2em] text-[#B829DD] uppercase">
            Consulting
          </span>
        </div>

        {/* Headline */}
        <h2 className="animate-item font-display font-black uppercase tracking-tighter text-[#F0F4FF] text-[clamp(36px,5.5vw,88px)] leading-[0.9] mb-8 max-w-[55vw]">
          Strategy,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#B829DD]">Architected</span>
        </h2>

        {/* Subheadline */}
        <p className="animate-item text-[#A7B0C8] text-[clamp(14px,1.1vw,18px)] leading-relaxed max-w-[36vw] mb-10">
          We audit your stack, map the customer journey, and build a plan that
          aligns AI, creative, and media to revenue.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToContact}
          className="animate-item btn-primary w-fit hoverable"
        >
          Request a Growth Audit
        </button>
      </div>

      {/* Process steps */}
      <div
        ref={processRef}
        className="absolute right-[5vw] top-1/2 -translate-y-1/2 flex flex-col gap-3"
      >
        {process.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="process-item glass p-4 rounded-2xl flex items-center gap-4 min-w-[240px] hoverable"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E6EFF]/20 to-[#B829DD]/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[#B829DD]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#2E6EFF]">{item.step}</span>
                  <span className="font-display font-semibold text-[#F0F4FF] text-sm">{item.title}</span>
                </div>
                <span className="font-mono text-[10px] text-[#A7B0C8]">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-[15vh] left-[25vw] w-20 h-20 border border-[#B829DD]/20 rounded-xl rotate-12 opacity-40" />
    </section>
  );
};

export default ConsultingSection;

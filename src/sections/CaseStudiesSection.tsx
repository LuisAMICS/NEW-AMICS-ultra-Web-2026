import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, TrendingUp, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CaseStudiesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const caseStudies = [
    {
      image: '/case_study_saas.jpg',
      category: 'SaaS',
      metric: '42%',
      metricLabel: 'lift in pipeline',
      description: 'AI-powered lead qualification and nurture sequences drove qualified pipeline growth for a B2B platform.',
      gradient: 'from-[#2E6EFF] to-[#00F0FF]',
    },
    {
      image: '/case_study_ecommerce.jpg',
      category: 'E-commerce',
      metric: '3.2×',
      metricLabel: 'ROAS',
      description: 'Programmatic media buying combined with AI-generated creative variants maximized return on ad spend.',
      gradient: 'from-[#B829DD] to-[#FF2E8C]',
    },
    {
      image: '/case_study_hospitality.jpg',
      category: 'Hospitality',
      metric: '28%',
      metricLabel: 'more direct bookings',
      description: 'AI Concierge deployment increased direct bookings while reducing OTA dependency.',
      gradient: 'from-[#00F0FF] to-[#2E6EFF]',
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Headline + subheadline
      gsap.fromTo([headlineRef.current, subheadRef.current],
        { x: '-8vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 0.5
          }
        }
      );

      // Cards
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.case-card');
        gsap.fromTo(cards,
          { y: '10vh', opacity: 0, rotateX: 15 },
          {
            y: 0, opacity: 1, rotateX: 0,
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              end: 'top 45%',
              scrub: 0.5
            }
          }
        );
      }

      // CTA
      gsap.fromTo(ctaRef.current,
        { y: '5vh', opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 95%',
            end: 'top 75%',
            scrub: 0.5
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-[#020204] py-[15vh] px-6 lg:px-[6vw]"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-black uppercase tracking-tighter text-[#F0F4FF] text-[clamp(32px,5vw,80px)] leading-[0.95] mb-4"
        >
          Proof in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">Performance</span>
        </h2>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="text-[#A7B0C8] text-[clamp(14px,1.1vw,18px)] leading-relaxed max-w-xl mb-16"
        >
          A sample of outcomes across SaaS, e-commerce, and hospitality.
        </p>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          style={{ perspective: '1000px' }}
        >
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="case-card group cursor-pointer hoverable"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-3xl mb-6 aspect-video">
                <img
                  src={study.image}
                  alt={study.category}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/50 to-transparent" />

                {/* Category badge */}
                <span className={`absolute top-4 left-4 font-mono text-[10px] tracking-wider text-white uppercase px-3 py-1.5 rounded-full bg-gradient-to-r ${study.gradient}`}>
                  {study.category}
                </span>

                {/* Metric overlay */}
                <div className="absolute bottom-4 left-4">
                  <span className="font-display font-black text-5xl text-white drop-shadow-lg">
                    {study.metric}
                  </span>
                  <span className="block text-[#A7B0C8] text-sm mt-1">
                    {study.metricLabel}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2E6EFF]/20 to-[#00F0FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${study.gradient} p-[1px] flex-shrink-0`}>
                  <div className="w-full h-full rounded-xl bg-[#0A0A0F] flex items-center justify-center">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                </div>
                <p className="text-[#A7B0C8] text-sm leading-relaxed group-hover:text-[#F0F4FF] transition-colors">
                  {study.description}
                </p>
              </div>

              {/* External link indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={14} className="text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          ref={ctaRef}
          className="flex items-center gap-2 text-[#F0F4FF] hover:text-[#00F0FF] transition-colors font-medium group hoverable"
        >
          Read the full stories
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
};

export default CaseStudiesSection;

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, ArrowRight, Quote } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

const ProofSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const results = [
    {
      category: 'SaaS',
      metric: '42',
      suffix: '%',
      label: 'lift in pipeline',
      description: 'AI-powered lead qualification and nurture sequences drove qualified pipeline growth for a B2B platform.',
      color: '#2E6EFF'
    },
    {
      category: 'E-commerce',
      metric: '3.2',
      suffix: '×',
      label: 'ROAS',
      description: 'Programmatic media buying combined with AI-generated creative variants maximized return on ad spend.',
      color: '#B829DD'
    },
    {
      category: 'Hospitality',
      metric: '28',
      suffix: '%',
      label: 'more direct bookings',
      description: 'AI Concierge deployment increased direct bookings while reducing OTA dependency.',
      color: '#00F0FF'
    },
  ];

  const testimonials = [
    {
      quote: "Amics transformed our entire marketing operation. What used to take months now happens in days.",
      author: "Sarah Chen",
      role: "CMO, TechVenture Inc.",
      color: '#2E6EFF'
    },
    {
      quote: "The AI Concierge alone paid for itself in the first month. Our team can finally focus on strategy.",
      author: "Michael Torres",
      role: "VP Marketing, StayWell Hotels",
      color: '#00F0FF'
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const resultCards = resultsRef.current?.querySelectorAll('.result-card');
      if (resultCards) {
        gsap.fromTo(resultCards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.15,
            scrollTrigger: {
              trigger: resultsRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 0.5
            }
          }
        );
      }

      const testimonialCards = testimonialsRef.current?.querySelectorAll('.testimonial-card');
      if (testimonialCards) {
        gsap.fromTo(testimonialCards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.2,
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: 'top 85%',
              end: 'top 50%',
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
      id="about"
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#00F0FF]/50" />
            <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-[0.2em]">Proof</span>
            <div className="w-12 h-[1px] bg-[#00F0FF]/50" />
          </div>
          <h2 className="font-display font-black text-[clamp(36px,6vw,80px)] leading-[0.95] text-[#F0F4FF] mb-4">
            Proof in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF]">Performance</span>
          </h2>
          <p className="text-[#A7B0C8] text-lg max-w-xl mx-auto">
            A sample of outcomes across SaaS, e-commerce, and hospitality.
          </p>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="grid md:grid-cols-3 gap-6 mb-16">
          {results.map((result, i) => (
            <div
              key={i}
              className="result-card glass rounded-3xl p-8 hoverable group"
            >
              <div
                className="inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-6"
                style={{ backgroundColor: `${result.color}15`, color: result.color }}
              >
                {result.category}
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="font-display font-black text-6xl"
                  style={{ color: result.color }}
                >
                  <AnimatedCounter value={result.metric} suffix={result.suffix} />
                </span>
              </div>

              <div className="text-[#A7B0C8] text-sm mb-4">{result.label}</div>

              <p className="text-[#A7B0C8] text-sm leading-relaxed">
                {result.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: result.color }}>
                <TrendingUp size={16} />
                <span>Read case study</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div ref={testimonialsRef}>
          <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-8 text-center">What Our Partners Say</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="testimonial-card glass rounded-3xl p-8 border-l-4 hoverable"
                style={{ borderLeftColor: testimonial.color }}
              >
                <Quote size={32} className="text-[#2E6EFF]/30 mb-4" />
                <p className="text-[#F0F4FF] text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${testimonial.color}15` }}
                  >
                    <span className="font-bold" style={{ color: testimonial.color }}>
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-[#F0F4FF] font-medium">{testimonial.author}</div>
                    <div className="text-[#A7B0C8] text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-[#F0F4FF] hover:text-[#00F0FF] transition-colors font-medium group hoverable">
            Read all case studies
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states via GSAP instead of CSS to avoid permanent invisibility
      gsap.set([badgeRef.current, subheadRef.current, ctaRef.current], { opacity: 0, y: 20 });

      const headline = headlineRef.current;
      if (headline) {
        const chars = headline.querySelectorAll('.char');
        gsap.set(chars, { opacity: 0, y: 40, rotateX: -90 });
      }

      const tl = gsap.timeline({ delay: 0.1 });

      // Badge animation
      tl.to(badgeRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      // Headline animation
      if (headline) {
        const chars = headline.querySelectorAll('.char');
        tl.to(chars,
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.015,
            ease: 'power4.out',
            clearProps: 'all'
          },
          "-=0.4"
        );
      }

      // Subheadline
      tl.to(subheadRef.current,
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.6"
      );

      // CTAs
      tl.to(ctaRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2E6EFF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          style={{ opacity: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider">
            Accepting New Partners for Q4
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-black text-[clamp(48px,10vw,120px)] leading-[0.9] text-[#F0F4FF] mb-8"
          style={{ perspective: '1000px' }}
        >
          <span className="block">{splitText('GROW AT THE')}</span>
          <span className="block text-[#00F0FF] glow-text-cyan">
            {splitText('SPEED OF AI')}
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="text-[#A7B0C8] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ opacity: 0 }}
        >
          Amics Consulting Group is the AI-native growth agency. We fuse generative creative,
          autonomous concierges, and programmatic media to build{' '}
          <span className="text-[#F0F4FF] font-medium">self-optimizing marketing ecosystems</span>{' '}
          for ambitious brands.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href="https://calendly.com/danny-amicsconsultinggroup/30min?month=2026-02"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#2E6EFF] hover:bg-[#1a5aee] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(46,110,255,0.5)] flex items-center gap-2 hoverable"
          >
            Book a Strategy Call
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => scrollToSection('#solutions')}
            className="group px-8 py-4 rounded-full font-medium text-[#F0F4FF] border border-[#2E6EFF]/30 hover:border-[#00F0FF]/50 transition-all duration-300 hoverable"
          >
            Explore Solutions
          </button>
        </div>
      </div>

      {/* Trusted by */}
      <div className="absolute bottom-24 left-0 right-0 text-center">
        <p className="font-mono text-xs text-[#A7B0C8] uppercase tracking-[0.2em] mb-6">
          Trusted by Technology Leaders
        </p>
        <div className="flex items-center justify-center gap-8 opacity-40">
          {['Google', 'Meta', 'OpenAI', 'Salesforce'].map((partner, i) => (
            <span key={i} className="font-display font-semibold text-[#A7B0C8]">{partner}</span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] text-[#A7B0C8] uppercase tracking-wider">Scroll</span>
        <ChevronDown size={20} className="text-[#A7B0C8] animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;

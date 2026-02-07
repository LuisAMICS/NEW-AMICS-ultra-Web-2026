import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Image, Layers, Wand2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AIPhotoSectionProps {
  className?: string;
}

const AIPhotoSection = ({ className = '' }: AIPhotoSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

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

      // Floating elements
      const floats = floatingRef.current?.querySelectorAll('.float-item');
      if (floats) {
        scrollTl.fromTo(floats,
          { y: '15vh', opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.02, ease: 'none' },
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

      if (floats) {
        scrollTl.fromTo(floats,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0, ease: 'power2.in' },
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

  const features = [
    { icon: Camera, label: 'Photorealistic' },
    { icon: Layers, label: 'Infinite Variations' },
    { icon: Wand2, label: 'Instant Generation' },
    { icon: Image, label: 'Any Context' },
  ];

  return (
    <section
      ref={sectionRef}
      className={`section-pinned ${className}`}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.2 }}
      >
        <img
          src="/ai_photo_camera_hologram.jpg"
          alt="AI Photo Studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-left" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        {/* Eyebrow */}
        <div className="animate-item flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-gradient-to-r from-[#B829DD] to-[#FF2E8C]" />
          <span className="font-mono text-xs tracking-[0.2em] text-[#FF2E8C] uppercase">
            Creative Studio
          </span>
        </div>

        {/* Headline */}
        <h2 className="animate-item font-display font-black uppercase tracking-tighter text-[#F0F4FF] text-[clamp(32px,5vw,80px)] leading-[0.95] mb-8 max-w-[58vw]">
          Infinite Assets.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B829DD] to-[#FF2E8C]">Zero Studio Costs.</span>
        </h2>

        {/* Subheadline */}
        <p className="animate-item text-[#A7B0C8] text-[clamp(14px,1.1vw,18px)] leading-relaxed max-w-[36vw] mb-10">
          Generate campaign-ready imagery and video in any context, season, or
          market—then iterate in hours, not weeks. No booking. No shipping. No limits.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToContact}
          className="animate-item btn-primary w-fit hoverable"
        >
          See AI Creative Studio
        </button>
      </div>

      {/* Floating feature cards */}
      <div
        ref={floatingRef}
        className="absolute right-[5vw] top-1/2 -translate-y-1/2 flex flex-col gap-4"
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="float-item glass p-4 rounded-2xl flex items-center gap-4 hoverable"
              style={{
                transform: `translateX(${i * 10}px)`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B829DD]/20 to-[#FF2E8C]/20 flex items-center justify-center">
                <Icon size={22} className="text-[#FF2E8C]" />
              </div>
              <span className="font-medium text-[#F0F4FF] text-sm">{feature.label}</span>
            </div>
          );
        })}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-[10vh] left-[30vw] w-32 h-32 border border-[#B829DD]/20 rounded-full opacity-30" />
      <div className="absolute top-[20vh] right-[20vw] w-16 h-16 border border-[#FF2E8C]/20 rotate-45 opacity-30" />
    </section>
  );
};

export default AIPhotoSection;

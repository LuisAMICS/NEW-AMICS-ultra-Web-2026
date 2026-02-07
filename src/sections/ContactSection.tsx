import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Calendar, Linkedin, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll('.animate-up');
      if (elements) {
        gsap.fromTo(elements,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'top 30%',
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
      id="contact"
      className="relative py-24 px-6 lg:px-[6vw] overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-[#2E6EFF]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center" ref={containerRef}>
        <h2 className="animate-up font-display font-black text-[clamp(40px,5vw,80px)] leading-[1.1] text-[#F0F4FF] mb-6">
          Talk Directly with<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E6EFF] via-[#00F0FF] to-[#B829DD]">Daneury Silverio</span>
        </h2>

        <p className="animate-up text-[#A7B0C8] text-lg max-w-2xl mx-auto mb-12">
          Schedule a strategic conversation to assess your growth challenges, identify opportunities, and determine whether AMICS is the right partner for your business.
        </p>

        {/* Profile Image with Glow */}
        <div className="animate-up relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2E6EFF] to-[#00F0FF] rounded-full blur-[20px] opacity-40 animate-pulse" />
          <div className="relative w-full h-full rounded-full border-4 border-[#2E6EFF]/20 overflow-hidden">
            <img
              src="danny.jpg"
              alt="Daneury Silverio"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        <div className="animate-up mb-8">
          <h3 className="font-display font-bold text-2xl text-[#F0F4FF] mb-1">Daneury Silverio</h3>
          <p className="font-mono text-sm uppercase tracking-widest text-[#2E6EFF] font-bold">
            CEO & FOUNDER — AMICS CONSULTING GROUP
          </p>
        </div>

        {/* Social & Email Links */}
        <div className="animate-up flex items-center justify-center gap-4 mb-6">
          <a
            href="https://www.linkedin.com/in/dannysilverio/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-[#0A0A0F] border border-[#2E6EFF]/20 flex items-center justify-center text-[#A7B0C8] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://www.instagram.com/formerlyknownashashtag/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-[#0A0A0F] border border-[#2E6EFF]/20 flex items-center justify-center text-[#A7B0C8] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
          >
            <Instagram size={18} />
          </a>
        </div>

        <div className="animate-up flex items-center justify-center gap-2 text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors mb-12">
          <Mail size={16} className="text-[#2E6EFF]" />
          <a href="mailto:danny@amicsconsultinggroup.com" className="text-sm font-medium">danny@amicsconsultinggroup.com</a>
        </div>

        {/* Description Text */}
        <p className="animate-up text-[#A7B0C8] text-lg leading-relaxed max-w-2xl mx-auto mb-12 italic">
          "Daneury leads strategy and execution across all AMICS client engagements.
          This call is designed to evaluate fit, define priorities, and outline potential system
          and growth opportunities — not to pitch generic services."
        </p>

        {/* CTA Button */}
        <div className="animate-up">
          <a
            href="https://calendly.com/danny-amicsconsultinggroup/30min?month=2026-02"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-[#2E6EFF] hover:bg-[#1a5aee] text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(46,110,255,0.6)] flex items-center justify-center gap-3 mx-auto mb-4 hoverable w-fit"
          >
            <Calendar size={22} />
            <span>Schedule a Strategy Call</span>
            <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
          </a>

          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="font-mono text-[10px] text-[#A7B0C8] uppercase tracking-[0.2em]">
              30-MINUTE STRATEGIC CONVERSATION • NO OBLIGATION
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;


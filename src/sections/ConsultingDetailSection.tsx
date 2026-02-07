import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Search, Map, Users, Lightbulb, Palette, FileText, Layout } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ConsultingDetailSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const auditAreas = [
    { icon: Search, title: 'Tech Stack', desc: 'Are your CRM, website, and ad platforms talking to each other?' },
    { icon: Map, title: 'Customer Journey', desc: 'Where is the friction? Where are the drop-offs?' },
    { icon: Users, title: 'Competitive Landscape', desc: 'What are your rivals doing, and how can we outmaneuver them?' },
  ];

  const creativeServices = [
    { icon: Palette, title: 'Brand Identity & Voice', desc: 'Define who you are in a noisy market.' },
    { icon: FileText, title: 'High-Converting Copywriting', desc: 'Words that sell.' },
    { icon: Layout, title: 'UX/UI Design', desc: 'Building websites that convert traffic into revenue.' },
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

      const serviceCards = servicesRef.current?.querySelectorAll('.service-card');
      if (serviceCards) {
        gsap.fromTo(serviceCards,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: servicesRef.current,
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
      id="consulting"
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div ref={contentRef}>
            <div className="animate-item flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#FF2E8C]" />
              <span className="font-mono text-xs text-[#FF2E8C] uppercase tracking-wider">Consulting</span>
            </div>

            <h2 className="animate-item font-display font-black text-[clamp(36px,5vw,64px)] leading-[1] text-[#F0F4FF] mb-6">
              Strategy,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E8C] to-[#B829DD]">Architected.</span>
            </h2>

            <p className="animate-item text-[#A7B0C8] text-lg leading-relaxed mb-8">
              Technology is useless without direction. We provide the strategic blueprint for your digital transformation.
            </p>

            {/* Growth Audit */}
            <div className="animate-item glass rounded-2xl p-6 border border-[#FF2E8C]/20 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FF2E8C]/10 flex items-center justify-center flex-shrink-0">
                  <Compass size={24} className="text-[#FF2E8C]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-2">The Growth Audit</h3>
                  <p className="text-[#A7B0C8] text-sm">
                    Before we write a line of code or buy a single ad, we diagnose.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {auditAreas.map((area, i) => {
                  const Icon = area.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FF2E8C]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[#FF2E8C]" />
                      </div>
                      <div>
                        <div className="text-[#F0F4FF] text-sm font-medium">{area.title}</div>
                        <div className="text-[#A7B0C8] text-xs">{area.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Human Creativity */}
            <div className="animate-item glass rounded-2xl p-6 border border-[#B829DD]/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B829DD]/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb size={24} className="text-[#B829DD]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F0F4FF] mb-1">Human Creativity, Supercharged</h3>
                  <p className="text-[#A7B0C8] text-sm">
                    While we lead with AI, we are grounded in human design principles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Services */}
          <div ref={servicesRef}>
            <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-6">Creative Services</h3>
            <div className="space-y-4">
              {creativeServices.map((service, i) => {
                const Icon = service.icon;
                return (
                  <div
                    key={i}
                    className="service-card glass rounded-2xl p-6 hoverable"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#B829DD]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-[#B829DD]" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-[#F0F4FF] mb-1">{service.title}</h4>
                        <p className="text-[#A7B0C8] text-sm">{service.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quote */}
            <div className="service-card glass rounded-2xl p-6 mt-6 border border-[#FF2E8C]/20 bg-gradient-to-br from-[#FF2E8C]/5 to-transparent">
              <blockquote className="text-[#F0F4FF] text-lg font-display italic leading-relaxed">
                "We don't guess. We audit, architect, and optimize your entire digital stack."
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF2E8C]/20 flex items-center justify-center">
                  <span className="text-[#FF2E8C] font-bold text-sm">A</span>
                </div>
                <div>
                  <div className="text-[#F0F4FF] text-sm font-medium">Amics Methodology</div>
                  <div className="text-[#A7B0C8] text-xs">Data-First Architecture</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="service-card w-full bg-[#FF2E8C] hover:bg-[#e0207a] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,46,140,0.5)] hoverable mt-6">
              Request a Growth Audit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingDetailSection;

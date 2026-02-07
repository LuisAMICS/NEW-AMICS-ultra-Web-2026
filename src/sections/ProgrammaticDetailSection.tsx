import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Tv, Headphones, Monitor, TrendingUp, Target, BarChart3 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProgrammaticDetailSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const channelsRef = useRef<HTMLDivElement>(null);

  const channels = [
    { icon: Tv, title: 'Connected TV (CTV)', desc: 'Commercial-grade ads on Hulu, Disney+, and Roku, targeted with digital precision.', color: '#00F0FF' },
    { icon: Headphones, title: 'Audio Programmatic', desc: 'Non-skippable audio ads on top podcasts and streaming playlists.', color: '#2E6EFF' },
    { icon: Monitor, title: 'Dynamic Display', desc: 'Banners that automatically update creative based on weather, location, or behavior.', color: '#B829DD' },
  ];

  const methodology = [
    { icon: Target, title: 'Audience Science', desc: 'Identify users based on intent, not just demographics. Know who is "in-market" before they search.' },
    { icon: TrendingUp, title: 'Real-Time Bidding (RTB)', desc: 'Bid on ad inventory in milliseconds. Pay the true market price—never an inflated flat rate.' },
    { icon: BarChart3, title: 'Cross-Device Identity', desc: 'Track the user journey from mobile click to desktop conversion. Attribute ROI where credit is truly due.' },
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

      const channelCards = channelsRef.current?.querySelectorAll('.channel-card');
      if (channelCards) {
        gsap.fromTo(channelCards,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            stagger: 0.12,
            scrollTrigger: {
              trigger: channelsRef.current,
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
      id="programmatic"
      className="relative py-24 px-6 lg:px-[6vw]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left content */}
          <div ref={contentRef}>
            <div className="animate-item flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#00F0FF]" />
              <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider">Media Buying</span>
            </div>
            
            <h2 className="animate-item font-display font-black text-[clamp(36px,5vw,64px)] leading-[1] text-[#F0F4FF] mb-6">
              Beyond the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#2E6EFF]">Walled Gardens.</span>
            </h2>

            <p className="animate-item text-[#A7B0C8] text-lg leading-relaxed mb-8">
              Google and Meta are powerful, but they only represent a fraction of your customer's digital life.{' '}
              <span className="text-[#F0F4FF] font-medium">Programmatic Advertising gives you access to the rest:</span>{' '}
              Premium News Sites, Connected TV (CTV), Digital Audio, and Digital Out-of-Home (DOOH).
            </p>

            {/* Key stat */}
            <div className="animate-item glass rounded-xl p-6 border border-[#00F0FF]/20 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center flex-shrink-0">
                  <Globe size={28} className="text-[#00F0FF]" />
                </div>
                <div>
                  <div className="font-display font-black text-4xl text-[#00F0FF]">60%</div>
                  <p className="text-[#A7B0C8] text-sm">
                    of customer time is spent on the Open Web. Are you ignoring half their digital life?
                  </p>
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div className="animate-item mb-8">
              <h3 className="font-display font-bold text-lg text-[#F0F4FF] mb-4">Our Methodology</h3>
              <div className="space-y-3">
                {methodology.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2E6EFF]/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[#2E6EFF]" />
                      </div>
                      <div>
                        <div className="text-[#F0F4FF] text-sm font-medium">{item.title}</div>
                        <div className="text-[#A7B0C8] text-xs">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button className="animate-item bg-[#00F0FF] hover:bg-[#00c8cc] text-[#020204] px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hoverable">
              Explore Programmatic
            </button>
          </div>

          {/* Right - Channels */}
          <div ref={channelsRef}>
            <h3 className="font-display font-bold text-xl text-[#F0F4FF] mb-6">Channels We Activate</h3>
            <div className="space-y-4">
              {channels.map((channel, i) => {
                const Icon = channel.icon;
                return (
                  <div 
                    key={i}
                    className="channel-card glass rounded-xl p-6 hoverable group"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${channel.color}15` }}
                      >
                        <Icon size={24} style={{ color: channel.color }} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-[#F0F4FF] mb-1">{channel.title}</h4>
                        <p className="text-[#A7B0C8] text-sm leading-relaxed">{channel.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech Stack */}
            <div className="channel-card glass rounded-xl p-6 mt-4 border border-[#00F0FF]/20">
              <h4 className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider mb-3">Certified Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {['The Trade Desk', 'Google DV360', 'Amazon DSP', 'Xandr'].map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs text-[#A7B0C8] bg-[#0A0A0F] border border-[#2E6EFF]/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgrammaticDetailSection;

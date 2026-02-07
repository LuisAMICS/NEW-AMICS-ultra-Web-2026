import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Systems', href: '#systems' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update progress bar
      if (progressRef.current) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressRef.current.style.width = `${scrollPercent}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  // Logo glitch effect
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        gsap.to(logo, {
          x: (Math.random() - 0.5) * 6,
          duration: 0.05,
          yoyo: true,
          repeat: 5,
          onComplete: () => {
            gsap.set(logo, { x: 0 });
          }
        });
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'glass-strong py-3' : 'py-5 bg-transparent'
          }`}
        style={{ opacity: 0 }}
      >
        <div className="w-full px-6 lg:px-[4vw] flex items-center justify-between">
          {/* Logo with glitch effect */}
          <div ref={logoRef} className="relative">
            <a
              href="#"
              className="flex items-center hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src="/amics-logo.png" alt="AMICS" className="h-8 md:h-10 w-auto object-contain" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="relative text-sm text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors font-medium group hoverable"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-[#2E6EFF] to-[#00F0FF] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden md:block">
            <a
              href="https://calendly.com/danny-amicsconsultinggroup/30min?month=2026-02"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2E6EFF] hover:bg-[#1a5aee] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(46,110,255,0.4)] hoverable"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#F0F4FF] p-2 hoverable"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Progress bar */}
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#2E6EFF] via-[#00F0FF] to-[#B829DD] transition-all duration-100"
          style={{ width: '0%' }}
        />

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-strong py-8 px-6 border-t border-[rgba(46,110,255,0.2)]">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left text-[#A7B0C8] hover:text-[#F0F4FF] transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://calendly.com/danny-amicsconsultinggroup/30min?month=2026-02"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2E6EFF] text-white py-4 rounded-full font-medium mt-4 text-center"
              >
                Book a Call
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;

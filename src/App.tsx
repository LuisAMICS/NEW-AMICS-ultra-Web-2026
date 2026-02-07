import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import NeuralParticles from './components/NeuralParticles';
import CustomCursor from './components/CustomCursor';
import MorphingBlobs from './components/MorphingBlobs';
import DataStreams from './components/DataStreams';

import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import MacroEnvironmentSection from './sections/MacroEnvironmentSection';
import FourPillarsSection from './sections/FourPillarsSection';
import AIConciergeDetailSection from './sections/AIConciergeDetailSection';
import AIPhotoDetailSection from './sections/AIPhotoDetailSection';
import ProgrammaticDetailSection from './sections/ProgrammaticDetailSection';
import ConsultingDetailSection from './sections/ConsultingDetailSection';
import AmicsAdvantageSection from './sections/AmicsAdvantageSection';
import EcosystemSection from './sections/EcosystemSection';
import ProofSection from './sections/ProofSection';
import PartnersSection from './sections/PartnersSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global snap configuration for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.4 },
          delay: 0,
          ease: "power2.out"
        }
      });
    };

    const timer = setTimeout(setupGlobalSnap, 1000);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-[#020204] min-h-screen overflow-x-hidden">
      {/* Background effects */}
      <MorphingBlobs />
      <NeuralParticles />
      <DataStreams />
      
      {/* Overlays */}
      <div className="grain-overlay" />
      <div className="scan-lines" />
      
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Sections */}
      <main className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <MacroEnvironmentSection />
        <FourPillarsSection />
        <AIConciergeDetailSection />
        <AIPhotoDetailSection />
        <ProgrammaticDetailSection />
        <ConsultingDetailSection />
        <AmicsAdvantageSection />
        <EcosystemSection />
        <ProofSection />
        <PartnersSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;

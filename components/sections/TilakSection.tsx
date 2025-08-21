'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function TilakSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const title = titleRef.current;

    gsap.set(title, { opacity: 0, y: 100 });

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      onEnter: () => {
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power2.out'
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      id="tilak"
      ref={sectionRef}
      className="section h-screen relative overflow-hidden"
      style={{ background: 'var(--tilak-gradient)' }}
    >
      <div className="section-content h-full flex items-center justify-center">
        <div className="text-center z-10 max-w-4xl mx-auto px-8">
          <div ref={titleRef} className="wedding-title text-6xl md:text-8xl text-white mb-6 drop-shadow-lg">
            Sacred Blessings
          </div>
          
          <div className="wedding-subtitle text-white/90 text-xl md:text-2xl mb-8 tracking-wider">
            Tilak Ceremony - Divine Grace
          </div>
          
          <div className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            <p className="mb-6">
              In the sacred ritual of Tilak, the couple receives blessings from elders 
              and the divine, marking the beginning of their spiritual journey together.
            </p>
            <p>
              Traditional mantras fill the air as golden turmeric adorns their foreheads, 
              symbolizing prosperity, purity, and divine protection.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div 
              className="aspect-square bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              data-photo-type="tilak-ceremony-main"
              data-alt="Tilak ceremony with couple receiving blessings from elders"
            >
              <div className="text-center text-white/70">
                <div className="text-3xl mb-2">🙏</div>
                <div className="text-sm">Sacred Tilak</div>
                <div className="text-xs">Divine Blessings</div>
              </div>
            </div>
            
            <div 
              className="aspect-square bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              data-photo-type="tilak-family-blessings"
              data-alt="Family members performing traditional tilak rituals"
            >
              <div className="text-center text-white/70">
                <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                <div className="text-sm">Family Rituals</div>
                <div className="text-xs">Traditional Ceremony</div>
              </div>
            </div>
            
            <div 
              className="aspect-square bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              data-photo-type="tilak-traditional-setup"
              data-alt="Traditional tilak ceremony setup with decorations and offerings"
            >
              <div className="text-center text-white/70">
                <div className="text-3xl mb-2">🕉️</div>
                <div className="text-sm">Sacred Setup</div>
                <div className="text-xs">Divine Ambiance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
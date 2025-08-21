'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SacredFireParticles from '../3d/SacredFireParticles';
import ConfettiParticles from '../3d/ConfettiParticles';

export default function WeddingReceptionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const weddingSideRef = useRef<HTMLDivElement>(null);
  const receptionSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const title = titleRef.current;
    const weddingSide = weddingSideRef.current;
    const receptionSide = receptionSideRef.current;

    gsap.set([title, weddingSide, receptionSide], { opacity: 0, y: 100 });

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
        
        gsap.to([weddingSide, receptionSide], {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.3,
          delay: 0.5,
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
      id="wedding-reception"
      ref={sectionRef}
      className="section h-screen relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, var(--wedding-gradient) 0%, var(--wedding-gradient) 50%, var(--reception-gradient) 50%, var(--reception-gradient) 100%)' 
      }}
    >
      {/* Sacred fire and confetti particle systems */}
      <div className="particle-canvas">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 5, 0]} intensity={1.5} color="#ff4400" />
          
          {/* Sacred fire particles for wedding side */}
          <group position={[-4, 0, 0]}>
            <SacredFireParticles count={2000} />
          </group>
          
          {/* Confetti particles for reception side */}
          <group position={[4, 0, 0]}>
            <ConfettiParticles count={3000} />
          </group>
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      <div className="section-content h-full flex items-center justify-center">
        <div className="text-center z-10 max-w-6xl mx-auto px-8">
          <div ref={titleRef} className="wedding-title text-6xl md:text-8xl text-white mb-6 drop-shadow-lg">
            Forever United
          </div>
          
          <div className="wedding-subtitle text-white/90 text-xl md:text-2xl mb-12 tracking-wider">
            Wedding & Reception - The Grand Finale
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Wedding Side */}
            <div ref={weddingSideRef} className="text-center">
              <div className="wedding-title text-4xl text-red-100 mb-6">
                💒 Wedding Ceremony
              </div>
              <div className="text-red-100/80 text-lg leading-relaxed mb-6">
                Sacred vows are exchanged around the holy fire. Seven steps, 
                seven promises, one eternal bond. In the presence of family 
                and the divine, two souls become one.
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="aspect-square bg-red-100/20 backdrop-blur-sm rounded-lg border border-red-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="wedding-ceremony-main"
                  data-alt="Main wedding ceremony with bride and groom taking vows"
                >
                  <div className="text-center text-red-100/70">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-sm">Sacred Vows</div>
                  </div>
                </div>
                
                <div 
                  className="aspect-square bg-red-100/20 backdrop-blur-sm rounded-lg border border-red-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="wedding-saat-phere"
                  data-alt="Saat phere (seven circles) around sacred fire during wedding"
                >
                  <div className="text-center text-red-100/70">
                    <div className="text-2xl mb-1">👫</div>
                    <div className="text-sm">Saat Phere</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reception Side */}
            <div ref={receptionSideRef} className="text-center">
              <div className="wedding-title text-4xl text-orange-100 mb-6">
                🎊 Grand Reception
              </div>
              <div className="text-orange-100/80 text-lg leading-relaxed mb-6">
                The celebration continues with elegance and joy. 
                Friends and family gather to toast the new couple, 
                creating an evening of unforgettable memories.
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="aspect-square bg-orange-100/20 backdrop-blur-sm rounded-lg border border-orange-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="reception-couple-main"
                  data-alt="Bride and groom at reception in elegant attire"
                >
                  <div className="text-center text-orange-100/70">
                    <div className="text-2xl mb-1">👑</div>
                    <div className="text-sm">Royal Couple</div>
                  </div>
                </div>
                
                <div 
                  className="aspect-square bg-orange-100/20 backdrop-blur-sm rounded-lg border border-orange-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="reception-celebration"
                  data-alt="Reception celebration with guests and family"
                >
                  <div className="text-center text-orange-100/70">
                    <div className="text-2xl mb-1">🎉</div>
                    <div className="text-sm">Celebration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final message */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="text-white/90 text-xl leading-relaxed">
              And so begins the most beautiful chapter of 
              <span className="font-bold text-white"> Krati</span> and 
              <span className="font-bold text-white"> Abhishek's</span> love story...
            </div>
            
            <div className="mt-8 text-white/70 text-lg">
              Forever grateful for all who shared in our joy ✨
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
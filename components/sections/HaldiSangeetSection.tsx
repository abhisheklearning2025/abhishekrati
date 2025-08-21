'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TurmericParticles from '../3d/TurmericParticles';
import MusicalNoteParticles from '../3d/MusicalNoteParticles';

export default function HaldiSangeetSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const haldiSideRef = useRef<HTMLDivElement>(null);
  const sangeetSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const title = titleRef.current;
    const haldiSide = haldiSideRef.current;
    const sangeetSide = sangeetSideRef.current;

    gsap.set([title, haldiSide, sangeetSide], { opacity: 0, y: 100 });

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
        
        gsap.to([haldiSide, sangeetSide], {
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
      id="haldi-sangeet"
      ref={sectionRef}
      className="section h-screen relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, var(--haldi-gradient) 0%, var(--haldi-gradient) 50%, var(--sangeet-gradient) 50%, var(--sangeet-gradient) 100%)' 
      }}
    >
      {/* Dual particle systems for haldi and sangeet */}
      <div className="particle-canvas">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ff6600" />
          
          {/* Turmeric particles for haldi side */}
          <group position={[-5, 0, 0]}>
            <TurmericParticles count={3000} />
          </group>
          
          {/* Musical note particles for sangeet side */}
          <group position={[5, 0, 0]}>
            <MusicalNoteParticles count={2500} />
          </group>
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>

      <div className="section-content h-full flex items-center justify-center">
        <div className="text-center z-10 max-w-6xl mx-auto px-8">
          <div ref={titleRef} className="wedding-title text-6xl md:text-8xl text-white mb-6 drop-shadow-lg">
            Colors & Melodies
          </div>
          
          <div className="wedding-subtitle text-white/90 text-xl md:text-2xl mb-12 tracking-wider">
            Haldi & Sangeet - Joy & Celebration
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Haldi Side */}
            <div ref={haldiSideRef} className="text-center">
              <div className="wedding-title text-4xl text-yellow-100 mb-6">
                🌺 Haldi Ceremony
              </div>
              <div className="text-yellow-100/80 text-lg leading-relaxed mb-6">
                The golden turmeric paste brings luck, beauty, and prosperity. 
                Family and friends anoint the couple with love and laughter, 
                creating memories painted in gold.
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="aspect-square bg-yellow-100/20 backdrop-blur-sm rounded-lg border border-yellow-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="haldi-couple-ceremony"
                  data-alt="Krati and Abhishek during haldi ceremony with turmeric application"
                >
                  <div className="text-center text-yellow-100/70">
                    <div className="text-2xl mb-1">🌸</div>
                    <div className="text-sm">Haldi Ritual</div>
                  </div>
                </div>
                
                <div 
                  className="aspect-square bg-yellow-100/20 backdrop-blur-sm rounded-lg border border-yellow-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="haldi-family-fun"
                  data-alt="Family members enjoying haldi ceremony with bride and groom"
                >
                  <div className="text-center text-yellow-100/70">
                    <div className="text-2xl mb-1">🎊</div>
                    <div className="text-sm">Golden Joy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sangeet Side */}
            <div ref={sangeetSideRef} className="text-center">
              <div className="wedding-title text-4xl text-purple-100 mb-6">
                🎵 Sangeet Night
              </div>
              <div className="text-purple-100/80 text-lg leading-relaxed mb-6">
                The night comes alive with music, dance, and celebration. 
                Traditional songs blend with modern beats as families 
                unite in joyous performance.
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="aspect-square bg-purple-100/20 backdrop-blur-sm rounded-lg border border-purple-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="sangeet-dance-performance"
                  data-alt="Dance performances during sangeet ceremony"
                >
                  <div className="text-center text-purple-100/70">
                    <div className="text-2xl mb-1">💃</div>
                    <div className="text-sm">Dance Night</div>
                  </div>
                </div>
                
                <div 
                  className="aspect-square bg-purple-100/20 backdrop-blur-sm rounded-lg border border-purple-100/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  data-photo-type="sangeet-musical-celebration"
                  data-alt="Musical performances and celebrations during sangeet"
                >
                  <div className="text-center text-purple-100/70">
                    <div className="text-2xl mb-1">🎤</div>
                    <div className="text-sm">Musical Magic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GoldenDustParticles from '../3d/GoldenDustParticles';
import SacredMandala from '../3d/SacredMandala';
import LotusBloom from '../3d/LotusBloom';
import SacredGeometry from '../3d/SacredGeometry';
import GlowShader from '../3d/shaders/GlowShader';
import CinematicText from '../animations/CinematicText';
import ScrollMagic from '../animations/ScrollMagic';
import ParallaxElements from '../animations/ParallaxElements';

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
      {/* Sacred particle systems and mandala */}
      <div className="particle-canvas">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffdd88" castShadow />
          
          {/* Sacred mandala formation in background */}
          <group position={[0, 0, -3]}>
            <SacredMandala radius={8} segments={12} />
          </group>
          
          {/* Golden dust particles forming sacred patterns */}
          <GoldenDustParticles count={4000} />
          
          {/* Additional smaller mandala */}
          <group position={[6, 3, 2]} scale={0.5}>
            <SacredMandala radius={4} segments={8} />
          </group>
          <group position={[-6, -2, 1]} scale={0.3}>
            <SacredMandala radius={3} segments={6} />
          </group>
          
          {/* Sacred Lotus Blooms */}
          <group position={[4, -3, 3]}>
            <LotusBloom 
              position={[0, 0, 0]}
              autoBloom={true}
              bloomDuration={4}
            />
          </group>
          
          <group position={[-4, 2, -2]} scale={0.7}>
            <LotusBloom 
              position={[0, 0, 0]}
              autoBloom={true}
              bloomDuration={5}
            />
          </group>
          
          {/* Sacred Geometry Elements */}
          <group position={[0, 4, -4]} scale={0.8}>
            <SacredGeometry 
              type="om-symbol"
              color="#ffdd00"
              animated={true}
            />
          </group>
          
          <group position={[8, 0, -1]} scale={0.6}>
            <SacredGeometry 
              type="sri-yantra"
              color="#ff8800"
              animated={true}
            />
          </group>
          
          <group position={[-8, 1, 2]} scale={0.5}>
            <SacredGeometry 
              type="flower-of-life"
              color="#ffaa44"
              animated={true}
            />
          </group>
          
          {/* Glow Shader Effects */}
          <GlowShader 
            position={[0, 6, -6]}
            color="#ffdd88"
            intensity={1.5}
            scale={2}
          />
          
          <GlowShader 
            position={[6, -1, 4]}
            color="#ff9944"
            intensity={1.2}
            scale={1.5}
          />
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.08} />
        </Canvas>
      </div>

      <div className="section-content h-full flex items-center justify-center">
        <div className="text-center z-10 max-w-4xl mx-auto px-8">
          {/* Parallax sacred symbols */}
          <ParallaxElements speed={0.2} direction="up">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="text-9xl text-yellow-300">🕉️</div>
            </div>
          </ParallaxElements>

          {/* Sacred title with divine glow */}
          <CinematicText 
            text="Sacred Blessings"
            className="wedding-title text-6xl md:text-8xl text-white mb-6 drop-shadow-lg"
            animationType="glow"
            triggerElement="#tilak"
          />
          
          {/* Divine subtitle */}
          <CinematicText 
            text="Tilak Ceremony - Divine Grace"
            className="wedding-subtitle text-white/90 text-xl md:text-2xl mb-8 tracking-wider"
            animationType="morphing"
            delay={1}
            triggerElement="#tilak"
          />
          
          {/* Sacred content with scroll magic */}
          <ScrollMagic 
            animationType="slide" 
            direction="up" 
            distance={60}
            stagger={0.4}
            triggerStart="top 70%"
          >
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
          </ScrollMagic>

          {/* Sacred photo gallery with divine animations */}
          <ScrollMagic 
            animationType="scale" 
            stagger={0.3}
            delay={2}
            triggerStart="top 60%"
          >
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
          </ScrollMagic>
        </div>
      </div>
    </section>
  );
}
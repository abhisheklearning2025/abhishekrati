'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RosePetalParticles from '../3d/RosePetalParticles';
import FloatingRing from '../3d/FloatingRing';
import CinematicText from '../animations/CinematicText';
import ScrollMagic from '../animations/ScrollMagic';
import ParallaxElements from '../animations/ParallaxElements';

export default function EngagementSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const content = contentRef.current;

    // Register GSAP plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initial setup
    gsap.set([title, subtitle, content], { 
      opacity: 0, 
      y: 100 
    });

    // Entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'center center',
        scrub: 1,
        onEnter: () => {
          gsap.to([title, subtitle, content], {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: 'power2.out'
          });
        }
      }
    });

    // Parallax effect on scroll
    gsap.to(section, {
      y: '-20%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Hide loading overlay when section is in view
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      onEnter: () => {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
          gsap.to(loadingOverlay, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
              loadingOverlay.style.display = 'none';
            }
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      id="engagement"
      ref={sectionRef}
      className="section h-screen relative overflow-hidden"
      style={{ background: 'var(--engagement-gradient)' }}
    >
      {/* 3D Canvas for particles and ring */}
      <div className="particle-canvas">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          {/* 3D floating ring */}
          <FloatingRing />
          
          {/* Rose petal particle system */}
          <RosePetalParticles count={5000} />
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="section-content h-full flex items-center justify-center">
        <div className="text-center z-10 max-w-4xl mx-auto px-8">
          {/* Parallax background elements */}
          <ParallaxElements speed={0.3} direction="up">
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-3xl opacity-30"></div>
          </ParallaxElements>

          {/* Main title with cinematic animation */}
          <CinematicText 
            text="The Beginning"
            className="wedding-title text-6xl md:text-8xl text-white mb-6 drop-shadow-lg"
            animationType="glow"
            triggerElement="#engagement"
          />
          
          {/* Subtitle with typewriter effect */}
          <CinematicText 
            text="Where Two Hearts Became One"
            className="wedding-subtitle text-white/90 text-xl md:text-2xl mb-8 tracking-wider"
            animationType="typewriter"
            delay={1}
            triggerElement="#engagement"
          />
          
          {/* Story content with scroll magic */}
          <ScrollMagic 
            animationType="slide" 
            direction="up" 
            distance={80}
            stagger={0.3}
            triggerStart="top 70%"
          >
            <div className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              <p className="mb-6">
                In a moment that sparkled brighter than the stars above, 
                <span className="font-semibold text-white"> Abhishek</span> asked 
                <span className="font-semibold text-white"> Krati</span> to be his forever.
              </p>
              <p>
                This magical evening marked the beginning of their journey together, 
                surrounded by love, laughter, and the promise of a beautiful future.
              </p>
            </div>
          </ScrollMagic>

          {/* Photo gallery with 3D hover effects */}
          <ScrollMagic 
            animationType="scale" 
            stagger={0.2}
            delay={2}
            triggerStart="top 60%"
          >
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div 
              className="aspect-square bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              data-photo-type="engagement-couple-main"
              data-alt="Krati and Abhishek during engagement ceremony - main photo"
            >
              <div className="text-center text-white/70">
                <div className="text-3xl mb-2">📸</div>
                <div className="text-sm">Engagement Photo</div>
                <div className="text-xs">Couple Main Shot</div>
              </div>
            </div>
            
            <div 
              className="aspect-square bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              data-photo-type="engagement-ring-ceremony"
              data-alt="Ring exchange ceremony during engagement"
            >
              <div className="text-center text-white/70">
                <div className="text-3xl mb-2">💍</div>
                <div className="text-sm">Ring Exchange</div>
                <div className="text-xs">Ceremony Moment</div>
              </div>
            </div>
            
            <div 
              className="aspect-square bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              data-photo-type="engagement-family-blessing"
              data-alt="Family members blessing the couple during engagement"
            >
              <div className="text-center text-white/70">
                <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                <div className="text-sm">Family Blessings</div>
                <div className="text-xs">Together Forever</div>
              </div>
            </div>
            </div>
          </ScrollMagic>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
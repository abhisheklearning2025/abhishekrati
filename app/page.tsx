'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from '../components/ui/CustomCursor';
import EngagementSection from '../components/sections/EngagementSection';
import TilakSection from '../components/sections/TilakSection';
import HaldiSangeetSection from '../components/sections/HaldiSangeetSection';
import WeddingReceptionSection from '../components/sections/WeddingReceptionSection';
import Navigation from '../components/ui/Navigation';
import AudioController from '../components/media/AudioController';

export default function Home() {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize smooth scrolling and performance optimizations
    const initializeAnimations = () => {
      // Refresh ScrollTrigger on window resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);

      // Performance optimization for mobile
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        document.body.classList.add('mobile-device');
      }

      // Preload critical animations
      gsap.set('.section', { 
        opacity: 1,
        y: 0
      });
    };

    initializeAnimations();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="relative">
      <CustomCursor />
      <Navigation />
      <AudioController />
      
      {/* Section 1: Engagement */}
      <EngagementSection />
      
      {/* Section 2: Tilak Ceremony */}
      <TilakSection />
      
      {/* Section 3: Haldi + Sangeet Combined */}
      <HaldiSangeetSection />
      
      {/* Section 4: Wedding + Reception Combined */}
      <WeddingReceptionSection />
      
      {/* Loading overlay for initial experience */}
      <div id="loading-overlay" className="fixed inset-0 bg-gradient-to-br from-rose-100 to-amber-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="wedding-title text-4xl md:text-6xl text-amber-800 mb-4 animate-glow">
            Krati & Abhishek
          </div>
          <div className="wedding-subtitle text-amber-600 text-lg tracking-widest">
            A Love Story in Motion
          </div>
          <div className="mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
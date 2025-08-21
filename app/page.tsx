'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from '../components/ui/CustomCursor';
import EngagementSection from '../components/sections/EngagementSection';
import TilakSection from '../components/sections/TilakSection';
import HaldiSangeetSection from '../components/sections/HaldiSangeetSection';
import WeddingReceptionSection from '../components/sections/WeddingReceptionSection';
import Navigation from '../components/ui/Navigation';
import AudioController from '../components/media/AudioController';
import PerformanceMonitor from '../components/ui/PerformanceMonitor';
import LoadingSystem from '../components/ui/LoadingSystem';
import AccessibilityEnhancements from '../components/ui/AccessibilityEnhancements';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

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

      // Safely set initial states for sections that exist
      const sections = document.querySelectorAll('.section');
      if (sections.length > 0) {
        gsap.set(sections, { 
          opacity: 1,
          y: 0
        });
      }

      return handleResize;
    };

    const cleanup = initializeAnimations();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (cleanup) {
        window.removeEventListener('resize', cleanup);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* Loading System */}
      {isLoading && (
        <LoadingSystem onComplete={() => setIsLoading(false)} />
      )}

      <main id="main-content" className="relative">
        <CustomCursor />
        <Navigation />
        <AudioController />
        <PerformanceMonitor />
        <AccessibilityEnhancements />
        
        {/* Section 1: Engagement */}
        <EngagementSection />
        
        {/* Section 2: Tilak Ceremony */}
        <TilakSection />
        
        {/* Section 3: Haldi + Sangeet Combined */}
        <HaldiSangeetSection />
        
        {/* Section 4: Wedding + Reception Combined */}
        <WeddingReceptionSection />
      </main>
    </ErrorBoundary>
  );
}
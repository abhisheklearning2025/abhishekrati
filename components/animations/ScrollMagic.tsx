'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollMagicProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'morph';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  triggerStart?: string;
  triggerEnd?: string;
  scrub?: boolean;
}

export default function ScrollMagic({
  children,
  animationType = 'fade',
  direction = 'up',
  distance = 100,
  duration = 1,
  stagger = 0,
  delay = 0,
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  scrub = false
}: ScrollMagicProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const elements = container.children;

    // Set initial states based on animation type
    let fromState: any = {};
    let toState: any = {};

    switch (animationType) {
      case 'fade':
        fromState = { opacity: 0 };
        toState = { opacity: 1 };
        break;

      case 'slide':
        const transform = direction === 'up' ? `translateY(${distance}px)` :
                         direction === 'down' ? `translateY(-${distance}px)` :
                         direction === 'left' ? `translateX(${distance}px)` :
                         `translateX(-${distance}px)`;
        fromState = { opacity: 0, transform };
        toState = { opacity: 1, transform: 'translate(0, 0)' };
        break;

      case 'scale':
        fromState = { opacity: 0, transform: 'scale(0.5)' };
        toState = { opacity: 1, transform: 'scale(1)' };
        break;

      case 'rotate':
        fromState = { opacity: 0, transform: 'rotate(180deg) scale(0.5)' };
        toState = { opacity: 1, transform: 'rotate(0deg) scale(1)' };
        break;

      case 'morph':
        fromState = { 
          opacity: 0, 
          transform: 'scale(0) rotate(180deg)',
          filter: 'blur(10px)'
        };
        toState = { 
          opacity: 1, 
          transform: 'scale(1) rotate(0deg)',
          filter: 'blur(0px)'
        };
        break;
    }

    // Set initial state
    gsap.set(elements, fromState);

    // Create animation
    const animation = gsap.to(elements, {
      ...toState,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: triggerStart,
        end: triggerEnd,
        toggleActions: 'play none none reverse',
        scrub: scrub ? 1 : false,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animationType, direction, distance, duration, stagger, delay, triggerStart, triggerEnd, scrub]);

  return (
    <div 
      ref={containerRef}
      className="scroll-magic-container"
      style={{ 
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      {children}
    </div>
  );
}
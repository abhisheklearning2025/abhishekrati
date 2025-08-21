'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

interface CinematicTextProps {
  text: string;
  className?: string;
  animationType?: 'typewriter' | 'morphing' | 'glow' | 'reveal';
  delay?: number;
  triggerElement?: string;
}

export default function CinematicText({ 
  text, 
  className = '', 
  animationType = 'reveal',
  delay = 0,
  triggerElement = '.section'
}: CinematicTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const element = textRef.current;

    // Split text into individual characters
    const chars = text.split('').map((char, index) => 
      `<span class="char" style="display: inline-block; opacity: 0; transform: translateY(100px)">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    element.innerHTML = chars;

    const charElements = element.querySelectorAll('.char');

    let animation;

    switch (animationType) {
      case 'typewriter':
        animation = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top center',
            toggleActions: 'play none none none'
          }
        });
        
        animation.to(charElements, {
          opacity: 1,
          transform: 'translateY(0)',
          duration: 0.05,
          stagger: 0.05,
          delay,
          ease: 'power2.out'
        });
        break;

      case 'morphing':
        // Set initial state
        gsap.set(charElements, { 
          opacity: 0, 
          scale: 0,
          rotation: 180 
        });

        animation = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top center',
            toggleActions: 'play none none none'
          }
        });

        animation.to(charElements, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.02,
          delay,
          ease: 'back.out(1.7)'
        });
        break;

      case 'glow':
        gsap.set(charElements, { 
          opacity: 0,
          textShadow: '0 0 0px currentColor'
        });

        animation = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top center',
            toggleActions: 'play none none none'
          }
        });

        animation.to(charElements, {
          opacity: 1,
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
          duration: 1,
          stagger: 0.03,
          delay,
          ease: 'power2.out'
        });
        break;

      case 'reveal':
      default:
        animation = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top center',
            toggleActions: 'play none none none'
          }
        });

        animation.to(charElements, {
          opacity: 1,
          transform: 'translateY(0)',
          duration: 0.6,
          stagger: 0.02,
          delay,
          ease: 'power3.out'
        });
        break;
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [text, animationType, delay, triggerElement]);

  return (
    <div 
      ref={textRef}
      className={`${className} will-change-transform`}
      style={{ perspective: '1000px' }}
    >
      {text}
    </div>
  );
}
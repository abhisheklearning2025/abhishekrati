'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxElementsProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  triggerElement?: string;
}

export default function ParallaxElements({ 
  children, 
  speed = 0.5, 
  direction = 'up',
  triggerElement = '.section'
}: ParallaxElementsProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;
    let transform = '';

    switch (direction) {
      case 'up':
        transform = `translateY(-${speed * 100}%)`;
        break;
      case 'down':
        transform = `translateY(${speed * 100}%)`;
        break;
      case 'left':
        transform = `translateX(-${speed * 100}%)`;
        break;
      case 'right':
        transform = `translateX(${speed * 100}%)`;
        break;
    }

    gsap.to(element, {
      transform,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed, direction, triggerElement]);

  return (
    <div 
      ref={elementRef}
      className="will-change-transform"
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      {children}
    </div>
  );
}
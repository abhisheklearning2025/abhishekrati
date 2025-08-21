'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Hover effect for images/cards
export function HoverCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
      
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}

// Floating action button with ripple effect
export function FloatingButton({ 
  children, 
  onClick, 
  className = '',
  icon 
}: { 
  children?: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  icon?: string;
}) {
  const controls = useAnimation();

  const handleClick = () => {
    controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: { duration: 0.6 }
    });
    onClick?.();
  };

  return (
    <motion.button
      animate={controls}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
      
      {/* Ripple effect */}
      <motion.span
        className="absolute inset-0 bg-white/30 rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
}

// Parallax scroll indicator
export function ScrollIndicator() {
  return (
    <motion.div
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="flex flex-col space-y-3">
        {['💍', '🙏', '🌺', '💒'].map((emoji, index) => (
          <motion.div
            key={index}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg border border-white/30"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Magnetic button effect
export function MagneticButton({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      whileHover="hover"
      variants={{
        hover: {
          scale: 1.05,
          transition: { type: "spring", stiffness: 300 }
        }
      }}
    >
      <motion.div
        variants={{
          hover: {
            x: [0, -2, 2, -2, 0],
            y: [0, -1, 1, -1, 0],
            transition: { duration: 0.3 }
          }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Staggered text animation
export function StaggeredText({ 
  text, 
  className = '',
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');

  return (
    <motion.div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * 0.1 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Particle trail cursor
export function ParticleTrail() {
  useEffect(() => {
    const particles: HTMLElement[] = [];
    const particleCount = 8;

    // Create particle elements
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-trail';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #ffd700, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: ${1 - i * 0.1};
        transform: scale(${1 - i * 0.1});
      `;
      document.body.appendChild(particle);
      particles.push(particle);
    }

    let mouseX = 0;
    let mouseY = 0;
    const positions = Array(particleCount).fill({ x: 0, y: 0 });

    const updateParticles = () => {
      positions[0] = { x: mouseX, y: mouseY };
      
      for (let i = 1; i < particleCount; i++) {
        positions[i] = {
          x: positions[i].x + (positions[i - 1].x - positions[i].x) * 0.3,
          y: positions[i].y + (positions[i - 1].y - positions[i].y) * 0.3
        };
        
        particles[i].style.left = positions[i].x + 'px';
        particles[i].style.top = positions[i].y + 'px';
      }
      
      requestAnimationFrame(updateParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      particles[0].style.left = mouseX + 'px';
      particles[0].style.top = mouseY + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);
    updateParticles();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return null;
}

// Success toast notification
export function SuccessToast({ 
  message, 
  isVisible, 
  onClose 
}: { 
  message: string; 
  isVisible: boolean; 
  onClose: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50,
        scale: isVisible ? 1 : 0.8
      }}
      className="fixed top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3"
    >
      <span className="text-xl">✅</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">
        ✕
      </button>
    </motion.div>
  );
}
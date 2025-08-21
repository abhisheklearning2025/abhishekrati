'use client';

import { useState, useEffect } from 'react';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const sections = [
    { id: 'engagement', name: 'Engagement', icon: '💍' },
    { id: 'tilak', name: 'Tilak', icon: '🙏' },
    { id: 'haldi-sangeet', name: 'Haldi & Sangeet', icon: '🌺' },
    { id: 'wedding-reception', name: 'Wedding & Reception', icon: '💒' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(scrollPosition / windowHeight);
      
      setActiveSection(currentSection);
      setIsVisible(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const target = document.getElementById(sections[index].id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col space-y-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`group relative w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
              activeSection === index
                ? 'border-amber-400 bg-amber-100 shadow-lg'
                : 'border-amber-200 bg-white/80 backdrop-blur-sm hover:border-amber-300'
            }`}
            title={section.name}
          >
            <span className="text-lg">{section.icon}</span>
            
            {/* Tooltip */}
            <div className="absolute right-14 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                {section.name}
              </div>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
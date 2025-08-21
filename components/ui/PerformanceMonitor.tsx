'use client';

import { useEffect, useState } from 'react';

interface PerformanceStats {
  fps: number;
  memory: number;
  particleCount: number;
  deviceTier: 'high' | 'medium' | 'low';
}

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    memory: 0,
    particleCount: 14500, // Total particles across all sections
    deviceTier: 'high'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      frameCount++;
      
      if (frameCount >= 60) { // Update every 60 frames
        const fps = Math.round(1000 / (deltaTime / 60));
        
        // Device memory estimation
        const memory = (performance as any).memory?.usedJSHeapSize || 0;
        const memoryMB = Math.round(memory / 1024 / 1024);
        
        // Device tier detection
        let deviceTier: 'high' | 'medium' | 'low' = 'high';
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const deviceMemory = (navigator as any).deviceMemory || 4;
        
        if (isMobile || deviceMemory < 4 || fps < 30) {
          deviceTier = 'low';
        } else if (deviceMemory < 8 || fps < 50) {
          deviceTier = 'medium';
        }
        
        // Adjust particle count based on performance
        let particleCount = 14500; // Default total
        if (deviceTier === 'medium') {
          particleCount = 8000;
        } else if (deviceTier === 'low') {
          particleCount = 4000;
        }
        
        setStats({
          fps,
          memory: memoryMB,
          particleCount,
          deviceTier
        });
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    // Show/hide monitor with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' && e.ctrlKey) {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-black/50 text-white px-2 py-1 rounded text-xs opacity-30 hover:opacity-100 transition-opacity"
          title="Show Performance Monitor (Ctrl+P)"
        >
          📊
        </button>
      </div>
    );
  }

  const getFpsColor = () => {
    if (stats.fps >= 55) return 'text-green-400';
    if (stats.fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDeviceTierColor = () => {
    switch (stats.deviceTier) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs font-mono min-w-[200px]">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Performance</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getFpsColor()}>{stats.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className="text-blue-400">{stats.memory}MB</span>
        </div>
        
        <div className="flex justify-between">
          <span>Particles:</span>
          <span className="text-purple-400">{stats.particleCount.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Device:</span>
          <span className={getDeviceTierColor()}>{stats.deviceTier.toUpperCase()}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-white/20 text-[10px] text-gray-400">
        Ctrl+P to toggle • Wedding Site v2.0
      </div>
    </div>
  );
}
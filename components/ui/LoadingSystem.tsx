'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSystemProps {
  onComplete?: () => void;
}

export default function LoadingSystem({ onComplete }: LoadingSystemProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'ready' | 'complete'>('loading');
  const [currentTask, setCurrentTask] = useState('');
  const [isClient, setIsClient] = useState(false);

  const loadingTasks = [
    { name: 'Initializing Sacred Geometry...', duration: 800 },
    { name: 'Loading Rose Petal Physics...', duration: 600 },
    { name: 'Preparing Golden Dust Particles...', duration: 700 },
    { name: 'Setting Up Audio Reactivity...', duration: 500 },
    { name: 'Activating Lotus Blooms...', duration: 600 },
    { name: 'Calibrating 3D Galleries...', duration: 400 },
    { name: 'Blessing the Digital Mandala...', duration: 800 },
    { name: 'Ready for Your Journey...', duration: 500 }
  ];

  // Generate static particle positions to avoid hydration mismatch
  const particleData = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: (i * 7.3423) % 100, // Deterministic positions based on index
      top: (i * 11.2567 + 13) % 100,
      xMovement: ((i * 3.1415) % 100) - 50,
      yMovement: ((i * 2.7182) % 100) - 50,
      duration: 3 + (i % 3),
      delay: i * 0.3,
    }));
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let currentProgress = 0;
    let taskIndex = 0;

    const simulateLoading = () => {
      if (taskIndex < loadingTasks.length) {
        const task = loadingTasks[taskIndex];
        setCurrentTask(task.name);
        
        const increment = 100 / loadingTasks.length;
        const targetProgress = (taskIndex + 1) * increment;
        
        const interval = setInterval(() => {
          currentProgress += 2;
          setProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(interval);
            taskIndex++;
            
            if (taskIndex >= loadingTasks.length) {
              setStage('ready');
              setTimeout(() => {
                setStage('complete');
                onComplete?.();
              }, 1000);
            } else {
              setTimeout(simulateLoading, 200);
            }
          }
        }, task.duration / (increment / 2));
      }
    };

    const timer = setTimeout(simulateLoading, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (stage === 'complete') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-[100] bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center"
      >
        {/* Sacred Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 text-9xl text-amber-600 animate-pulse">🕉️</div>
          <div className="absolute top-3/4 right-1/4 text-8xl text-rose-400 animate-bounce">🌸</div>
          <div className="absolute bottom-1/4 left-1/3 text-7xl text-orange-500 animate-pulse">💍</div>
        </div>

        <div className="text-center max-w-lg mx-auto px-8">
          {/* Main Title */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="wedding-title text-4xl md:text-6xl text-amber-800 mb-4">
              Krati & Abhishek
            </h1>
            <div className="wedding-subtitle text-amber-600 text-lg tracking-widest">
              A Love Story in Motion
            </div>
          </motion.div>

          {/* Progress Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-amber-200"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-amber-600"
                style={{
                  pathLength: progress / 100,
                  strokeDasharray: "283", // 2 * π * 45
                  strokeDashoffset: 283 - (283 * progress) / 100,
                }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
            
            {/* Progress Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={progress}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-amber-700"
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </motion.div>

          {/* Current Task */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 h-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTask}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-amber-700 text-lg"
              >
                {currentTask}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex justify-center space-x-4 text-2xl opacity-60"
          >
            <span>🌹</span>
            <span>💫</span>
            <span>🌸</span>
            <span>✨</span>
            <span>💕</span>
          </motion.div>

          {/* Sacred Blessing */}
          {stage === 'ready' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-amber-600 text-sm italic"
            >
              &quot;सर्वे भवन्तु सुखिनः&quot; - May all beings be happy
            </motion.div>
          )}
        </div>

        {/* Floating Particles - Only render on client to avoid hydration mismatch */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particleData.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
                animate={{
                  x: [0, particle.xMovement],
                  y: [0, particle.yMovement],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
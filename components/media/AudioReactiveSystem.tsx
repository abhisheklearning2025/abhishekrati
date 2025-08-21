'use client';

import { useRef, useEffect, useState } from 'react';

interface AudioData {
  frequency: Uint8Array;
  timeDomain: Uint8Array;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

interface AudioReactiveSystemProps {
  onAudioData?: (data: AudioData) => void;
  enabled?: boolean;
}

export default function AudioReactiveSystem({ onAudioData, enabled = true }: AudioReactiveSystemProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const timeDomainArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const initializeAudio = async () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // Higher resolution for better frequency analysis
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Create data arrays
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      timeDomainArrayRef.current = new Uint8Array(bufferLength);

      // Try to get microphone access for live audio reactivity
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        setHasPermission(true);
      } catch (micError) {
        // Fallback: Create oscillator for demo purposes
        console.log('Microphone access denied, using demo audio');
        createDemoAudio(audioContext, analyser);
        setHasPermission(false);
      }

      setIsInitialized(true);
      startAnalysis();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const createDemoAudio = (audioContext: AudioContext, analyser: AnalyserNode) => {
    // Create multiple oscillators for rich demo audio
    const oscillators = [
      { freq: 60, type: 'sine' as OscillatorType }, // Bass
      { freq: 200, type: 'triangle' as OscillatorType }, // Mid
      { freq: 800, type: 'sawtooth' as OscillatorType }, // Treble
    ];

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1; // Low volume
    gainNode.connect(analyser);

    oscillators.forEach(({ freq, type }, index) => {
      const oscillator = audioContext.createOscillator();
      const oscGain = audioContext.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      
      // Modulate frequency for musical effect
      oscillator.frequency.exponentialRampToValueAtTime(
        freq * (1.2 + Math.sin(Date.now() * 0.001 + index) * 0.1),
        audioContext.currentTime + 2
      );

      oscGain.gain.value = 0.3 / oscillators.length;
      
      oscillator.connect(oscGain);
      oscGain.connect(gainNode);
      oscillator.start();

      // Create rhythm by modulating gain
      setInterval(() => {
        const now = audioContext.currentTime;
        oscGain.gain.cancelScheduledValues(now);
        oscGain.gain.setValueAtTime(0.1, now);
        oscGain.gain.exponentialRampToValueAtTime(0.3, now + 0.1);
        oscGain.gain.exponentialRampToValueAtTime(0.1, now + 0.5);
      }, 1000 + index * 200);
    });
  };

  const startAnalysis = () => {
    if (!analyserRef.current || !dataArrayRef.current || !timeDomainArrayRef.current) return;

    const analyse = () => {
      if (!enabled || !analyserRef.current || !dataArrayRef.current || !timeDomainArrayRef.current) {
        animationFrameRef.current = requestAnimationFrame(analyse);
        return;
      }

      const analyser = analyserRef.current;
      const frequencyData = dataArrayRef.current;
      const timeDomainData = timeDomainArrayRef.current;

      // Get frequency and time domain data
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(timeDomainData);

      // Calculate overall volume
      const volume = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length / 255;

      // Calculate frequency bands
      const bassEnd = Math.floor(frequencyData.length * 0.1);
      const midEnd = Math.floor(frequencyData.length * 0.5);
      
      const bass = frequencyData.slice(0, bassEnd).reduce((sum, value) => sum + value, 0) / bassEnd / 255;
      const mid = frequencyData.slice(bassEnd, midEnd).reduce((sum, value) => sum + value, 0) / (midEnd - bassEnd) / 255;
      const treble = frequencyData.slice(midEnd).reduce((sum, value) => sum + value, 0) / (frequencyData.length - midEnd) / 255;

      // Send data to parent component
      if (onAudioData) {
        onAudioData({
          frequency: new Uint8Array(frequencyData),
          timeDomain: new Uint8Array(timeDomainData),
          volume,
          bass,
          mid,
          treble
        });
      }

      animationFrameRef.current = requestAnimationFrame(analyse);
    };

    analyse();
  };

  useEffect(() => {
    // Initialize on first user interaction
    const handleUserInteraction = () => {
      if (!isInitialized) {
        initializeAudio();
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isInitialized]);

  return (
    <div className="fixed top-4 left-4 z-40 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span>Audio Reactive</span>
      </div>
      
      {isInitialized && (
        <div className="space-y-1">
          <div className="text-[10px] text-gray-400">
            {hasPermission ? 'Microphone Active' : 'Demo Mode'}
          </div>
          <div className="text-[10px] text-gray-400">
            {enabled ? 'Particles Responding' : 'Disabled'}
          </div>
        </div>
      )}
      
      {!isInitialized && (
        <div className="text-[10px] text-gray-400">
          Click anywhere to enable
        </div>
      )}
    </div>
  );
}
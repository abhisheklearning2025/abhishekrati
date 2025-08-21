'use client';

import { useState, useEffect, useRef } from 'react';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        // Auto-play ambient music (placeholder - would be traditional Indian wedding music)
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          setIsPlaying(false);
        });
        setIsPlaying(true);
        setIsMuted(false);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          title="Volume"
        />

        {/* Audio Element - placeholder source */}
        <audio
          ref={audioRef}
          loop
          preload="metadata"
          data-audio-type="traditional-indian-wedding-ambient"
        >
          {/* Placeholder for traditional Indian wedding music */}
          {/* Would normally contain: */}
          {/* <source src="/audio/wedding-ambient.mp3" type="audio/mpeg" /> */}
          {/* <source src="/audio/wedding-ambient.ogg" type="audio/ogg" /> */}
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Music Info */}
      <div className="text-xs text-gray-600 mt-2 text-center">
        Traditional Wedding Music
      </div>
    </div>
  );
}
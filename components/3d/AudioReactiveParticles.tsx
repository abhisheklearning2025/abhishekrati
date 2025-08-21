'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AudioData {
  frequency: Uint8Array;
  timeDomain: Uint8Array;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

interface AudioReactiveParticlesProps {
  count: number;
  audioData?: AudioData;
  baseColor?: string;
  reactivityStrength?: number;
}

export default function AudioReactiveParticles({ 
  count, 
  audioData,
  baseColor = '#ffd700',
  reactivityStrength = 2
}: AudioReactiveParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [isActive, setIsActive] = useState(false);

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const frequencies = new Float32Array(count); // Which frequency band each particle responds to

    for (let i = 0; i < count; i++) {
      // Arrange particles in a spiral for better visual distribution
      const angle = (i / count) * Math.PI * 4;
      const radius = 2 + (i / count) * 6;
      const height = Math.sin(angle) * 2;

      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;

      scales[i] = 0.2 + Math.random() * 0.3;

      // Assign frequency ranges for different particles
      frequencies[i] = Math.random(); // 0-1 maps to frequency spectrum

      // Color variations
      const colorObj = new THREE.Color(baseColor);
      const hue = colorObj.getHSL({ h: 0, s: 0, l: 0 }).h;
      const newColor = new THREE.Color().setHSL(
        hue + (Math.random() - 0.5) * 0.2, 
        0.8, 
        0.5 + Math.random() * 0.3
      );

      colors[i * 3] = newColor.r;
      colors[i * 3 + 1] = newColor.g;
      colors[i * 3 + 2] = newColor.b;
    }

    return { positions, originalPositions, velocities, scales, colors, frequencies };
  }, [count, baseColor]);

  useEffect(() => {
    setIsActive(!!audioData);
  }, [audioData]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      let reactivity = 0;
      let colorIntensity = 1;

      if (audioData && isActive) {
        // Map particle frequency to audio spectrum
        const frequencyIndex = Math.floor(particleData.frequencies[i] * audioData.frequency.length);
        const frequencyValue = audioData.frequency[frequencyIndex] / 255;

        // Different particles respond to different frequency bands
        const bassReactivity = audioData.bass * (particleData.frequencies[i] < 0.3 ? 1 : 0);
        const midReactivity = audioData.mid * (particleData.frequencies[i] >= 0.3 && particleData.frequencies[i] < 0.7 ? 1 : 0);
        const trebleReactivity = audioData.treble * (particleData.frequencies[i] >= 0.7 ? 1 : 0);

        reactivity = (bassReactivity + midReactivity + trebleReactivity + frequencyValue) * reactivityStrength;
        colorIntensity = 1 + reactivity;
      }

      // Base floating animation
      const floatY = Math.sin(time * 0.5 + i * 0.1) * 0.3;
      
      // Audio-reactive movement
      const audioY = reactivity * Math.sin(time * 10 + i) * 2;
      const audioScale = reactivity * 3;

      // Update positions
      particleData.positions[i * 3] = particleData.originalPositions[i * 3] + Math.sin(time + i) * 0.1;
      particleData.positions[i * 3 + 1] = particleData.originalPositions[i * 3 + 1] + floatY + audioY;
      particleData.positions[i * 3 + 2] = particleData.originalPositions[i * 3 + 2] + Math.cos(time + i) * 0.1;

      // Audio-reactive scaling
      const finalScale = particleData.scales[i] * (1 + audioScale);

      // Set matrix for each instance
      dummy.position.set(
        particleData.positions[i * 3],
        particleData.positions[i * 3 + 1],
        particleData.positions[i * 3 + 2]
      );
      
      dummy.scale.setScalar(finalScale);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Audio-reactive colors
      meshRef.current.setColorAt(i, new THREE.Color(
        particleData.colors[i * 3] * colorIntensity,
        particleData.colors[i * 3 + 1] * colorIntensity,
        particleData.colors[i * 3 + 2] * colorIntensity
      ));
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, count]}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshPhongMaterial 
          transparent 
          opacity={0.8}
          emissive={baseColor}
          emissiveIntensity={isActive ? 0.3 : 0.1}
          shininess={100}
        />
      </instancedMesh>

      {/* Audio-reactive lighting */}
      {audioData && isActive && (
        <>
          <pointLight
            position={[0, 5, 0]}
            intensity={1 + audioData.volume * 3}
            color={baseColor}
            distance={15}
            decay={2}
          />
          
          {/* Bass light */}
          <pointLight
            position={[-8, 0, 0]}
            intensity={audioData.bass * 4}
            color="#ff4400"
            distance={10}
            decay={2}
          />
          
          {/* Treble light */}
          <pointLight
            position={[8, 0, 0]}
            intensity={audioData.treble * 4}
            color="#44ff44"
            distance={10}
            decay={2}
          />
        </>
      )}
    </>
  );
}
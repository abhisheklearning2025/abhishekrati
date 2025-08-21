'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MusicalNoteParticlesProps {
  count: number;
}

export default function MusicalNoteParticles({ count }: MusicalNoteParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const frequencies = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position - musical wave pattern
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // Velocity - floating upward with rhythm
      velocities[i * 3] = (Math.random() - 0.5) * 0.03;
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Rotation for dancing effect
      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      // Scale - musical note sizes
      scales[i] = Math.random() * 0.4 + 0.2;

      // Colors - vibrant musical colors
      const noteType = Math.random();
      if (noteType < 0.25) {
        // Purple notes
        colors[i * 3] = 0.6 + Math.random() * 0.4;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (noteType < 0.5) {
        // Blue notes
        colors[i * 3] = 0.1 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (noteType < 0.75) {
        // Pink notes
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
      } else {
        // Golden notes
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.2;
      }

      // Frequency for audio-reactive behavior
      frequencies[i] = Math.random() * 5 + 1;
    }

    return { positions, velocities, rotations, scales, colors, frequencies };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Audio-reactive movement (simulated)
      const audioReactivity = Math.sin(time * particleData.frequencies[i]) * 0.5 + 0.5;
      
      // Update positions with musical wave motion
      particleData.positions[i * 3] += particleData.velocities[i * 3] + Math.sin(time * 3 + i * 0.1) * 0.003;
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1] * (1 + audioReactivity);
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] + Math.cos(time * 2 + i * 0.1) * 0.002;

      // Reset particles that float too high
      if (particleData.positions[i * 3 + 1] > 15) {
        particleData.positions[i * 3] = (Math.random() - 0.5) * 20;
        particleData.positions[i * 3 + 1] = -2;
        particleData.positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      }

      // Dancing rotation
      particleData.rotations[i * 3] += 0.02 * (1 + audioReactivity);
      particleData.rotations[i * 3 + 1] += 0.03 * (1 + audioReactivity);
      particleData.rotations[i * 3 + 2] += 0.025 * (1 + audioReactivity);

      // Audio-reactive scaling
      const scale = particleData.scales[i] * (1 + audioReactivity * 0.5);

      // Set matrix for each instance
      dummy.position.set(
        particleData.positions[i * 3],
        particleData.positions[i * 3 + 1],
        particleData.positions[i * 3 + 2]
      );
      
      dummy.rotation.set(
        particleData.rotations[i * 3],
        particleData.rotations[i * 3 + 1],
        particleData.rotations[i * 3 + 2]
      );
      
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set color with brightness based on audio reactivity
      meshRef.current.setColorAt(i, new THREE.Color(
        particleData.colors[i * 3] * (0.7 + audioReactivity * 0.3),
        particleData.colors[i * 3 + 1] * (0.7 + audioReactivity * 0.3),
        particleData.colors[i * 3 + 2] * (0.7 + audioReactivity * 0.3)
      ));
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, count]}
    >
      {/* Musical note shape - could be more complex */}
      <sphereGeometry args={[1, 12, 12]} />
      <meshPhongMaterial 
        transparent 
        opacity={0.8}
        shininess={100}
        emissive="#110033"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}
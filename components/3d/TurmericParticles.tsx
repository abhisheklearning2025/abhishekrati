'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TurmericParticlesProps {
  count: number;
}

export default function TurmericParticles({ count }: TurmericParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const life = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position - start from center and spread out
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 10 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Velocity - explosion-like movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;

      // Rotation
      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      // Scale - turmeric powder particles
      scales[i] = Math.random() * 0.3 + 0.1;

      // Colors - turmeric/haldi shades
      const intensity = 0.7 + Math.random() * 0.3;
      colors[i * 3] = intensity; // Red
      colors[i * 3 + 1] = intensity * 0.8; // Green
      colors[i * 3 + 2] = 0.1 + Math.random() * 0.2; // Blue

      // Life for fading effect
      life[i] = Math.random();
    }

    return { positions, velocities, rotations, scales, colors, life };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Update life
      particleData.life[i] += delta * 0.5;

      // Update positions with swirling motion
      particleData.positions[i * 3] += particleData.velocities[i * 3] + Math.sin(time * 2 + i) * 0.002;
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1] * Math.sin(particleData.life[i]);
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] + Math.cos(time * 2 + i) * 0.002;

      // Reset particles with fade cycle
      if (particleData.life[i] > 10) {
        particleData.positions[i * 3] = (Math.random() - 0.5) * 2;
        particleData.positions[i * 3 + 1] = -2;
        particleData.positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        particleData.life[i] = 0;
      }

      // Update rotations
      particleData.rotations[i * 3] += 0.03;
      particleData.rotations[i * 3 + 1] += 0.02;
      particleData.rotations[i * 3 + 2] += 0.025;

      // Calculate opacity based on life
      const opacity = Math.sin(particleData.life[i] * 0.5) * 0.8;

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
      
      dummy.scale.setScalar(particleData.scales[i] * (1 + Math.sin(particleData.life[i]) * 0.3));
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set color with opacity
      meshRef.current.setColorAt(i, new THREE.Color(
        particleData.colors[i * 3],
        particleData.colors[i * 3 + 1],
        particleData.colors[i * 3 + 2]
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
      <sphereGeometry args={[1, 8, 8]} />
      <meshLambertMaterial 
        transparent 
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
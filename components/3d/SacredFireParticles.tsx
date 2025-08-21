'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredFireParticlesProps {
  count: number;
}

export default function SacredFireParticles({ count }: SacredFireParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position - start from fire base
      const radius = Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Velocity - fire rises with turbulence
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.05 + 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Life cycle
      life[i] = Math.random() * 10;

      // Scale
      scales[i] = Math.random() * 0.3 + 0.1;

      // Fire colors - red to orange to yellow
      const fireIntensity = Math.random();
      if (fireIntensity < 0.3) {
        // Deep red base
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.1 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.0;
      } else if (fireIntensity < 0.7) {
        // Orange flames
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.0;
      } else {
        // Yellow tips
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.3;
      }
    }

    return { positions, velocities, life, scales, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Update life
      particleData.life[i] += delta * 2;

      // Fire turbulence
      const turbulence = Math.sin(time * 5 + i) * 0.001;
      
      // Update positions
      particleData.positions[i * 3] += particleData.velocities[i * 3] + turbulence;
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1];
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] + turbulence;

      // Add wind effect
      particleData.positions[i * 3] += Math.sin(time + particleData.life[i]) * 0.002;

      // Reset particles when they die or go too high
      if (particleData.life[i] > 8 || particleData.positions[i * 3 + 1] > 6) {
        const radius = Math.random() * 1.5;
        const angle = Math.random() * Math.PI * 2;
        particleData.positions[i * 3] = Math.cos(angle) * radius;
        particleData.positions[i * 3 + 1] = 0;
        particleData.positions[i * 3 + 2] = Math.sin(angle) * radius;
        particleData.life[i] = 0;
      }

      // Scale based on life (bigger at middle life)
      const lifeProgress = particleData.life[i] / 8;
      const lifeCurve = Math.sin(lifeProgress * Math.PI);
      const scale = particleData.scales[i] * lifeCurve;

      // Opacity based on life
      const opacity = lifeCurve * 0.8;

      // Set matrix for each instance
      dummy.position.set(
        particleData.positions[i * 3],
        particleData.positions[i * 3 + 1],
        particleData.positions[i * 3 + 2]
      );
      
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set color with life-based intensity
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
    <>
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, count]}
        position={[0, -2, 0]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      
      {/* Sacred fire base glow */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[2, 2, 0.2, 12]} />
        <meshBasicMaterial 
          color="#ff4400" 
          transparent 
          opacity={0.3}
          emissive="#ff2200"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Fire light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#ff6600"
        distance={8}
        decay={2}
      />
    </>
  );
}
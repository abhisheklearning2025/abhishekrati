'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RosePetalParticlesProps {
  count: number;
}

export default function RosePetalParticles({ count }: RosePetalParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create particle positions and properties
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position - spread across the scene
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Velocity - gentle falling motion with some horizontal drift
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -Math.random() * 0.01 - 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      // Rotation
      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      // Scale variation
      scales[i] = Math.random() * 0.5 + 0.3;

      // Colors - rose petal variations (pink, red, white)
      const colorVariation = Math.random();
      if (colorVariation < 0.4) {
        // Pink
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorVariation < 0.7) {
        // Red
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
      } else {
        // White
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }
    }

    return { positions, velocities, rotations, scales, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Update positions with gravity and wind effect
      particleData.positions[i * 3] += particleData.velocities[i * 3] + Math.sin(time + i) * 0.001;
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1];
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] + Math.cos(time + i) * 0.001;

      // Reset particles that fall too far
      if (particleData.positions[i * 3 + 1] < -5) {
        particleData.positions[i * 3] = (Math.random() - 0.5) * 20;
        particleData.positions[i * 3 + 1] = 15;
        particleData.positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }

      // Update rotations
      particleData.rotations[i * 3] += 0.02;
      particleData.rotations[i * 3 + 1] += 0.01;
      particleData.rotations[i * 3 + 2] += 0.015;

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
      
      dummy.scale.setScalar(particleData.scales[i]);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set color for each instance
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
      castShadow
      receiveShadow
    >
      {/* Petal geometry - simple plane for now, could be more complex petal shape */}
      <planeGeometry args={[0.1, 0.15]} />
      
      {/* Petal material with transparency and subtle glow */}
      <meshLambertMaterial 
        transparent 
        opacity={0.8}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
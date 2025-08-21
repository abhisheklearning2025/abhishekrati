'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConfettiParticlesProps {
  count: number;
}

export default function ConfettiParticles({ count }: ConfettiParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const rotationVelocities = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position - explosion from center
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 8 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      // Velocity - celebration explosion
      const explosionForce = Math.random() * 0.08 + 0.02;
      const angle = Math.random() * Math.PI * 2;
      velocities[i * 3] = Math.cos(angle) * explosionForce;
      velocities[i * 3 + 1] = Math.random() * 0.05 - 0.025; // Some go up, some fall
      velocities[i * 3 + 2] = Math.sin(angle) * explosionForce;

      // Rotation
      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      // Rotation velocities for tumbling effect
      rotationVelocities[i * 3] = (Math.random() - 0.5) * 0.2;
      rotationVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      rotationVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Scale - confetti pieces
      scales[i] = Math.random() * 0.3 + 0.1;

      // Colors - vibrant celebration colors
      const colorType = Math.random();
      if (colorType < 0.2) {
        // Gold
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.0;
      } else if (colorType < 0.4) {
        // Pink
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorType < 0.6) {
        // Blue
        colors[i * 3] = 0.1 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
        colors[i * 3 + 2] = 1.0;
      } else if (colorType < 0.8) {
        // Green
        colors[i * 3] = 0.1 + Math.random() * 0.4;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
      } else {
        // Purple
        colors[i * 3] = 0.6 + Math.random() * 0.4;
        colors[i * 3 + 1] = 0.1 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }
    }

    return { positions, velocities, rotations, rotationVelocities, scales, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Apply gravity
      particleData.velocities[i * 3 + 1] -= 0.002; // Gravity

      // Update positions
      particleData.positions[i * 3] += particleData.velocities[i * 3];
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1];
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2];

      // Air resistance
      particleData.velocities[i * 3] *= 0.998;
      particleData.velocities[i * 3 + 2] *= 0.998;

      // Reset particles that fall too far
      if (particleData.positions[i * 3 + 1] < -5) {
        particleData.positions[i * 3] = (Math.random() - 0.5) * 4;
        particleData.positions[i * 3 + 1] = 8 + Math.random() * 2;
        particleData.positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        
        // Reset velocity
        const explosionForce = Math.random() * 0.08 + 0.02;
        const angle = Math.random() * Math.PI * 2;
        particleData.velocities[i * 3] = Math.cos(angle) * explosionForce;
        particleData.velocities[i * 3 + 1] = Math.random() * 0.05 - 0.01;
        particleData.velocities[i * 3 + 2] = Math.sin(angle) * explosionForce;
      }

      // Update rotations
      particleData.rotations[i * 3] += particleData.rotationVelocities[i * 3];
      particleData.rotations[i * 3 + 1] += particleData.rotationVelocities[i * 3 + 1];
      particleData.rotations[i * 3 + 2] += particleData.rotationVelocities[i * 3 + 2];

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

      // Set color
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
      {/* Confetti shape - rectangular pieces */}
      <boxGeometry args={[2, 0.1, 1]} />
      <meshLambertMaterial 
        transparent 
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
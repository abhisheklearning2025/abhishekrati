'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldenDustParticlesProps {
  count: number;
}

export default function GoldenDustParticles({ count }: GoldenDustParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Position - sacred circle formation
      const radius = Math.random() * 12 + 3;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 10 + 2;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Velocity - sacred spiral motion
      velocities[i * 3] = Math.cos(angle + Math.PI / 2) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = Math.sin(angle + Math.PI / 2) * 0.01;

      // Rotation for sacred geometry
      rotations[i * 3] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

      // Scale - divine dust particles
      scales[i] = Math.random() * 0.2 + 0.05;

      // Golden sacred colors
      const goldIntensity = 0.8 + Math.random() * 0.2;
      colors[i * 3] = goldIntensity; // Red
      colors[i * 3 + 1] = goldIntensity * 0.8; // Green  
      colors[i * 3 + 2] = goldIntensity * 0.2; // Blue

      // Phase for synchronized sacred movements
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, velocities, rotations, scales, colors, phases };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      // Sacred spiral movement
      const phase = particleData.phases[i];
      const spiralSpeed = 0.5;
      
      // Update positions with sacred geometry patterns
      particleData.positions[i * 3] += particleData.velocities[i * 3] + Math.sin(time * spiralSpeed + phase) * 0.002;
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1] + Math.sin(time * 2 + phase) * 0.001;
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] + Math.cos(time * spiralSpeed + phase) * 0.002;

      // Sacred mandala formation - particles form geometric patterns
      const mandalaRadius = 8 + Math.sin(time + phase) * 2;
      const currentRadius = Math.sqrt(
        particleData.positions[i * 3] * particleData.positions[i * 3] + 
        particleData.positions[i * 3 + 2] * particleData.positions[i * 3 + 2]
      );

      // Gently pull particles toward mandala formation
      if (currentRadius > 0) {
        const targetRadius = mandalaRadius;
        const force = (targetRadius - currentRadius) * 0.001;
        const angle = Math.atan2(particleData.positions[i * 3 + 2], particleData.positions[i * 3]);
        
        particleData.positions[i * 3] += Math.cos(angle) * force;
        particleData.positions[i * 3 + 2] += Math.sin(angle) * force;
      }

      // Reset particles that drift too far
      if (currentRadius > 20) {
        const newRadius = Math.random() * 8 + 3;
        const newAngle = Math.random() * Math.PI * 2;
        particleData.positions[i * 3] = Math.cos(newAngle) * newRadius;
        particleData.positions[i * 3 + 1] = Math.random() * 10 + 2;
        particleData.positions[i * 3 + 2] = Math.sin(newAngle) * newRadius;
      }

      // Sacred rotation - particles spin in divine patterns
      particleData.rotations[i * 3] += 0.02 + Math.sin(time + phase) * 0.01;
      particleData.rotations[i * 3 + 1] += 0.015 + Math.cos(time + phase) * 0.01;
      particleData.rotations[i * 3 + 2] += 0.025 + Math.sin(time * 2 + phase) * 0.005;

      // Divine pulsing scale
      const pulseScale = particleData.scales[i] * (1 + Math.sin(time * 3 + phase) * 0.3);

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
      
      dummy.scale.setScalar(pulseScale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set divine golden color with sacred glow
      const glowIntensity = 0.8 + Math.sin(time * 2 + phase) * 0.2;
      meshRef.current.setColorAt(i, new THREE.Color(
        particleData.colors[i * 3] * glowIntensity,
        particleData.colors[i * 3 + 1] * glowIntensity,
        particleData.colors[i * 3 + 2] * glowIntensity
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
        castShadow
        receiveShadow
      >
        {/* Sacred geometry particle shape */}
        <octahedronGeometry args={[1, 0]} />
        <meshPhongMaterial 
          transparent 
          opacity={0.8}
          emissive="#664400"
          emissiveIntensity={0.3}
          shininess={100}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Sacred ambient light */}
      <ambientLight intensity={0.3} color="#ffdd88" />
      
      {/* Divine point lights for sacred glow */}
      <pointLight
        position={[0, 5, 0]}
        intensity={1}
        color="#ffdd00"
        distance={12}
        decay={2}
      />
      <pointLight
        position={[5, 3, 5]}
        intensity={0.8}
        color="#ffaa00"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#ffaa00"
        distance={10}
        decay={2}
      />
    </>
  );
}
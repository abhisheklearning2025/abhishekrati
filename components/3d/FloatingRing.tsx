'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.3;
      groupRef.current.rotation.y = time * 0.3;
    }

    if (ringRef.current) {
      // Ring-specific rotation
      ringRef.current.rotation.z = time * 0.5;
    }

    if (gemRef.current) {
      // Gem sparkle effect
      gemRef.current.rotation.x = time * 2;
      gemRef.current.rotation.z = time * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main ring */}
      <mesh ref={ringRef} castShadow receiveShadow>
        <torusGeometry args={[1.2, 0.15, 8, 24]} />
        <meshPhysicalMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* Center gemstone */}
      <mesh ref={gemRef} position={[0, 0, 0.1]} castShadow>
        <octahedronGeometry args={[0.3, 0]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.9}
          metalness={0}
          roughness={0}
          transmission={0.95}
          ior={2.4}
          thickness={0.5}
          envMapIntensity={1}
        />
      </mesh>

      {/* Sparkle particles around the ring */}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = 1.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh
            key={index}
            position={[x, 0, z]}
            scale={[0.05, 0.05, 0.05]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.7} />
          </mesh>
        );
      })}

      {/* Romantic text */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/playfair-display.woff"
        fontWeight="bold"
      >
        Forever Begins Today
      </Text>

      {/* Subtle glow effect */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        color="#FFD700"
        distance={3}
        decay={2}
      />
    </group>
  );
}
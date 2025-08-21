'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LotusPetalProps {
  index: number;
  totalPetals: number;
  bloomProgress: number;
}

function LotusPetal({ index, totalPetals, bloomProgress }: LotusPetalProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { position, rotation, scale } = useMemo(() => {
    const angle = (index / totalPetals) * Math.PI * 2;
    const layer = Math.floor(index / 8); // 8 petals per layer
    const layerRadius = 0.5 + layer * 0.3;
    
    return {
      position: [
        Math.cos(angle) * layerRadius,
        layer * 0.1,
        Math.sin(angle) * layerRadius
      ] as [number, number, number],
      rotation: [0, angle, Math.PI * 0.1 + layer * 0.2] as [number, number, number],
      scale: 1 - layer * 0.15
    };
  }, [index, totalPetals]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Blooming animation
    const targetScale = scale * bloomProgress;
    meshRef.current.scale.setScalar(targetScale);
    
    // Gentle swaying
    meshRef.current.rotation.z = rotation[2] + Math.sin(time + index) * 0.05;
    
    // Color transition during bloom
    const material = meshRef.current.material as THREE.MeshPhongMaterial;
    const bloomColor = new THREE.Color().lerpColors(
      new THREE.Color('#ffb3d1'), // Light pink
      new THREE.Color('#ff69b4'), // Hot pink
      bloomProgress
    );
    material.color = bloomColor;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
    >
      {/* Petal geometry - elongated and curved */}
      <cylinderGeometry args={[0.02, 0.1, 0.8, 8]} />
      <meshPhongMaterial
        color="#ffb3d1"
        transparent
        opacity={0.9}
        shininess={100}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface LotusCenter {
  bloomProgress: number;
}

function LotusCenter({ bloomProgress }: LotusCenter) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Pulsing center
    const pulse = 1 + Math.sin(time * 3) * 0.1;
    meshRef.current.scale.setScalar(pulse * bloomProgress);
    
    // Glowing effect
    const material = meshRef.current.material as THREE.MeshPhongMaterial;
    material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.2, 0]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshPhongMaterial
        color="#ffff99"
        emissive="#ffaa00"
        emissiveIntensity={0.3}
        shininess={200}
      />
    </mesh>
  );
}

interface LotusBloomProps {
  position?: [number, number, number];
  autoBloom?: boolean;
  bloomDuration?: number;
  onBloomComplete?: () => void;
}

export default function LotusBloom({ 
  position = [0, 0, 0], 
  autoBloom = true,
  bloomDuration = 3,
  onBloomComplete
}: LotusBloomProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [bloomProgress, setBloomProgress] = useState(0);
  const [isBloomStarted, setIsBloomStarted] = useState(false);

  const petals = useMemo(() => {
    // Create multiple layers of petals
    const totalPetals = 24; // 3 layers of 8 petals each
    return Array.from({ length: totalPetals }, (_, i) => i);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Auto-bloom trigger
    if (autoBloom && !isBloomStarted && time > 1) {
      setIsBloomStarted(true);
    }

    // Bloom animation
    if (isBloomStarted && bloomProgress < 1) {
      const newProgress = Math.min(bloomProgress + (1 / (bloomDuration * 60)), 1);
      setBloomProgress(newProgress);
      
      if (newProgress >= 1 && onBloomComplete) {
        onBloomComplete();
      }
    }

    // Gentle rotation
    groupRef.current.rotation.y = time * 0.1;
    
    // Floating motion
    groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.1;
  });

  const triggerBloom = () => {
    if (!isBloomStarted) {
      setIsBloomStarted(true);
    }
  };

  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={triggerBloom}
    >
      {/* Lotus stem */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 1, 8]} />
        <meshPhongMaterial color="#228B22" />
      </mesh>

      {/* Lotus leaves */}
      <mesh position={[0.3, -0.8, 0.2]} rotation={[0, 0, -Math.PI * 0.1]}>
        <circleGeometry args={[0.4, 16]} />
        <meshPhongMaterial 
          color="#32CD32" 
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh position={[-0.4, -0.9, -0.1]} rotation={[0, 0, Math.PI * 0.15]}>
        <circleGeometry args={[0.35, 16]} />
        <meshPhongMaterial 
          color="#228B22" 
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Lotus petals */}
      {petals.map((index) => (
        <LotusPetal
          key={index}
          index={index}
          totalPetals={petals.length}
          bloomProgress={bloomProgress}
        />
      ))}

      {/* Lotus center */}
      <LotusCenter bloomProgress={bloomProgress} />

      {/* Sacred light emanating from lotus */}
      {bloomProgress > 0.5 && (
        <pointLight
          position={[0, 0.5, 0]}
          intensity={bloomProgress * 2}
          color="#ffddaa"
          distance={5}
          decay={2}
        />
      )}

      {/* Mystical particles around bloomed lotus */}
      {bloomProgress > 0.8 && (
        <group>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 1.5;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  0.5 + Math.sin(angle * 3) * 0.2,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
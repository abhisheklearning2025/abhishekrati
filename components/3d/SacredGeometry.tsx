'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredGeometryProps {
  type: 'sri-yantra' | 'flower-of-life' | 'metatron-cube' | 'om-symbol';
  position?: [number, number, number];
  scale?: number;
  color?: string;
  animated?: boolean;
}

function SriYantra({ position, scale, color, animated }: Omit<SacredGeometryProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null);

  const triangles = useMemo(() => {
    // Sri Yantra consists of 9 interlocking triangles
    const triangleData = [];
    
    // 4 upward triangles (Shiva - masculine)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 1 + i * 0.3;
      triangleData.push({
        position: [Math.cos(angle) * radius * 0.3, Math.sin(angle) * radius * 0.3, 0],
        rotation: [0, 0, angle],
        type: 'upward'
      });
    }
    
    // 5 downward triangles (Shakti - feminine)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + Math.PI / 5;
      const radius = 0.8 + i * 0.25;
      triangleData.push({
        position: [Math.cos(angle) * radius * 0.4, Math.sin(angle) * radius * 0.4, 0],
        rotation: [0, 0, angle + Math.PI],
        type: 'downward'
      });
    }
    
    return triangleData;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !animated) return;

    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.z = time * 0.1;
    
    // Pulsing effect
    const pulse = 1 + Math.sin(time * 2) * 0.1;
    groupRef.current.scale.setScalar(scale! * pulse);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Outer circles */}
      {[1.8, 1.5, 1.2].map((radius, index) => (
        <mesh key={`circle-${index}`} position={[0, 0, -0.01 * index]}>
          <ringGeometry args={[radius - 0.05, radius, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      ))}
      
      {/* Sacred triangles */}
      {triangles.map((triangle, index) => (
        <mesh
          key={index}
          position={triangle.position as [number, number, number]}
          rotation={triangle.rotation as [number, number, number]}
        >
          <coneGeometry args={[0.3, 0.6, 3]} />
          <meshPhongMaterial
            color={triangle.type === 'upward' ? '#ff6b6b' : '#4ecdc4'}
            transparent
            opacity={0.7}
            wireframe
          />
        </mesh>
      ))}
      
      {/* Central bindu (point)  */}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function FlowerOfLife({ position, scale, color, animated }: Omit<SacredGeometryProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null);

  const circles = useMemo(() => {
    const circleData = [];
    const radius = 0.5;
    
    // Central circle
    circleData.push({ position: [0, 0, 0] });
    
    // First ring - 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      circleData.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0]
      });
    }
    
    // Second ring - 12 circles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = radius * Math.sqrt(3);
      circleData.push({
        position: [Math.cos(angle) * r, Math.sin(angle) * r, 0]
      });
    }
    
    return circleData;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !animated) return;

    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.z = time * 0.05;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {circles.map((circle, index) => (
        <mesh key={index} position={circle.position as [number, number, number]}>
          <ringGeometry args={[0.45, 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function OmSymbol({ position, scale, color, animated }: Omit<SacredGeometryProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !animated) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle floating
    groupRef.current.position.y = position![1] + Math.sin(time) * 0.1;
    
    // Subtle glow pulsing
    const pulse = 1 + Math.sin(time * 2) * 0.2;
    groupRef.current.scale.setScalar(scale! * pulse);
  });

  // Create a simplified 3D representation of Om
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main curve of Om */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.15, 8, 16, Math.PI * 1.5]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Upper curve */}
      <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, Math.PI * 0.3]}>
        <torusGeometry args={[0.3, 0.1, 8, 16, Math.PI]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      
      {/* Dot (bindu) */}
      <mesh position={[0.2, 0.8, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      
      {/* Crescent (chandrabindu) */}
      <mesh position={[0.1, 0.9, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <torusGeometry args={[0.15, 0.05, 8, 16, Math.PI]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function SacredGeometry({ 
  type, 
  position = [0, 0, 0], 
  scale = 1, 
  color = '#ffd700',
  animated = true 
}: SacredGeometryProps) {
  const commonProps = { position, scale, color, animated };

  switch (type) {
    case 'sri-yantra':
      return <SriYantra {...commonProps} />;
    case 'flower-of-life':
      return <FlowerOfLife {...commonProps} />;
    case 'om-symbol':
      return <OmSymbol {...commonProps} />;
    default:
      return <OmSymbol {...commonProps} />;
  }
}
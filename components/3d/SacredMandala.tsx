'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredMandalaProps {
  radius?: number;
  segments?: number;
}

export default function SacredMandala({ radius = 6, segments = 8 }: SacredMandalaProps) {
  const mandalaRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group[]>([]);

  // Create mandala geometry with sacred patterns
  const mandalaElements = useMemo(() => {
    const elements = [];
    const rings = 4; // Number of concentric rings
    
    for (let ring = 0; ring < rings; ring++) {
      const ringRadius = (radius / rings) * (ring + 1);
      const ringSegments = segments * (ring + 1);
      const ringElements = [];
      
      for (let i = 0; i < ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        const y = Math.sin(angle * (ring + 1)) * 0.5; // Sacred wave pattern
        
        ringElements.push({
          position: [x, y, z],
          rotation: [0, angle, 0],
          scale: 1 - (ring * 0.15), // Smaller toward center
          delay: i * 0.1 + ring * 0.5
        });
      }
      
      elements.push(ringElements);
    }
    
    return elements;
  }, [radius, segments]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (mandalaRef.current) {
      // Sacred rotation of entire mandala
      mandalaRef.current.rotation.y = time * 0.1;
      
      // Breathing effect
      const breathScale = 1 + Math.sin(time * 0.8) * 0.1;
      mandalaRef.current.scale.setScalar(breathScale);
    }

    // Animate individual rings
    ringsRef.current.forEach((ring, ringIndex) => {
      if (ring) {
        // Counter-rotation for inner rings
        ring.rotation.y = -time * 0.15 * (ringIndex + 1);
        
        // Pulsing effect
        const pulsePhase = time * 2 + ringIndex * Math.PI / 2;
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.05;
        ring.scale.setScalar(pulseScale);
      }
    });
  });

  return (
    <group ref={mandalaRef} position={[0, 0, 0]}>
      {mandalaElements.map((ring, ringIndex) => (
        <group 
          key={ringIndex}
          ref={(el) => {
            if (el) ringsRef.current[ringIndex] = el;
          }}
        >
          {ring.map((element, elementIndex) => (
            <mesh
              key={elementIndex}
              position={element.position as [number, number, number]}
              rotation={element.rotation as [number, number, number]}
              scale={element.scale}
            >
              {/* Sacred geometry shapes */}
              {ringIndex % 2 === 0 ? (
                <octahedronGeometry args={[0.2, 0]} />
              ) : (
                <tetrahedronGeometry args={[0.15, 0]} />
              )}
              
              <meshPhongMaterial
                color="#ffdd00"
                emissive="#ff8800"
                emissiveIntensity={0.2}
                transparent
                opacity={0.8}
                shininess={100}
              />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Central sacred symbol */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshPhongMaterial
          color="#ffff00"
          emissive="#ffaa00"
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
          shininess={200}
        />
      </mesh>
      
      {/* Sacred light beams */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 0.8;
        const z = Math.sin(angle) * radius * 0.8;
        
        return (
          <mesh
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
          >
            <cylinderGeometry args={[0.05, 0.05, radius * 1.5, 6]} />
            <meshBasicMaterial
              color="#ffdd00"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
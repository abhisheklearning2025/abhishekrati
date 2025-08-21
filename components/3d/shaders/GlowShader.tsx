'use client';

import { useRef, useMemo } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader material
class GlowMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.0 },
        glowColor: { value: new THREE.Color(0xffd700) },
        rimPower: { value: 2.0 },
        innerPower: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 glowColor;
        uniform float rimPower;
        uniform float innerPower;
        
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          
          // Rim lighting effect
          float rim = 1.0 - max(dot(viewDir, normal), 0.0);
          rim = pow(rim, rimPower);
          
          // Inner glow
          float inner = max(dot(viewDir, normal), 0.0);
          inner = pow(inner, innerPower);
          
          // Pulsing effect
          float pulse = sin(time * 3.0) * 0.5 + 0.5;
          
          // Combine effects
          float glow = rim * intensity + inner * 0.3 + pulse * 0.2;
          
          gl_FragColor = vec4(glowColor * glow, glow * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }
}

extend({ GlowMaterial });

interface GlowShaderProps {
  geometry?: THREE.BufferGeometry;
  color?: string;
  intensity?: number;
  rimPower?: number;
  position?: [number, number, number];
  scale?: number;
}

export default function GlowShader({ 
  geometry,
  color = '#ffd700',
  intensity = 1.0,
  rimPower = 2.0,
  position = [0, 0, 0],
  scale = 1
}: GlowShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const defaultGeometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry || defaultGeometry}
      position={position}
      scale={scale}
    >
      <glowMaterial 
        ref={materialRef}
        glowColor={new THREE.Color(color)}
        intensity={intensity}
        rimPower={rimPower}
      />
    </mesh>
  );
}
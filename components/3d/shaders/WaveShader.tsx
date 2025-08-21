'use client';

import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

class WaveMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        amplitude: { value: 0.5 },
        frequency: { value: 2.0 },
        speed: { value: 1.0 },
        color1: { value: new THREE.Color(0xff6b6b) },
        color2: { value: new THREE.Color(0x4ecdc4) },
        color3: { value: new THREE.Color(0xffd93d) }
      },
      vertexShader: `
        uniform float time;
        uniform float amplitude;
        uniform float frequency;
        uniform float speed;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          vUv = uv;
          
          // Create wave displacement
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          float elevation = sin(modelPosition.x * frequency + time * speed) * amplitude;
          elevation += sin(modelPosition.z * frequency * 0.7 + time * speed * 0.8) * amplitude * 0.5;
          
          modelPosition.y += elevation;
          vElevation = elevation;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          // Color mixing based on elevation and UV
          float mixStrength = (vElevation + 1.0) * 0.5;
          
          vec3 color = mix(color1, color2, mixStrength);
          color = mix(color, color3, sin(time + vUv.x * 10.0) * 0.5 + 0.5);
          
          // Add some sparkle
          float sparkle = sin(vUv.x * 50.0 + time * 3.0) * sin(vUv.y * 50.0 + time * 2.0);
          sparkle = step(0.95, sparkle);
          
          color += sparkle * 0.3;
          
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }
}

extend({ WaveMaterial });

interface WaveShaderProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  colors?: [string, string, string];
}

export default function WaveShader({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  amplitude = 0.5,
  frequency = 2.0,
  speed = 1.0,
  colors = ['#ff6b6b', '#4ecdc4', '#ffd93d']
}: WaveShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 10, 50, 50), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.amplitude.value = amplitude;
      materialRef.current.uniforms.frequency.value = frequency;
      materialRef.current.uniforms.speed.value = speed;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <waveMaterial 
        ref={materialRef}
        color1={new THREE.Color(colors[0])}
        color2={new THREE.Color(colors[1])}
        color3={new THREE.Color(colors[2])}
      />
    </mesh>
  );
}
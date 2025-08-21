'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveParticlesProps {
  count: number;
  color?: string;
  size?: number;
  interactionRadius?: number;
  mouseInfluence?: number;
}

export default function InteractiveParticles({ 
  count, 
  color = '#ffd700',
  size = 0.1,
  interactionRadius = 3,
  mouseInfluence = 2
}: InteractiveParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse = useRef(new THREE.Vector3());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { camera, size: canvasSize } = useThree();

  // Create particle data
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Store original positions for spring-back effect
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Scales
      scales[i] = Math.random() * 0.5 + 0.5;

      // Colors - golden variations
      const colorObj = new THREE.Color(color);
      const intensity = 0.8 + Math.random() * 0.2;
      colors[i * 3] = colorObj.r * intensity;
      colors[i * 3 + 1] = colorObj.g * intensity;
      colors[i * 3 + 2] = colorObj.b * intensity;
    }

    return { positions, originalPositions, velocities, scales, colors };
  }, [count, color]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / canvasSize.width) * 2 - 1;
      const y = -(event.clientY / canvasSize.height) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canvasSize]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Convert mouse position to 3D world coordinates
    const vector = new THREE.Vector3(mousePosition.x, mousePosition.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const worldMouse = camera.position.clone().add(dir.multiplyScalar(distance));
    
    mouse.current.copy(worldMouse);

    for (let i = 0; i < count; i++) {
      // Current particle position
      const px = particleData.positions[i * 3];
      const py = particleData.positions[i * 3 + 1];
      const pz = particleData.positions[i * 3 + 2];

      // Distance to mouse
      const dx = mouse.current.x - px;
      const dy = mouse.current.y - py;
      const dz = mouse.current.z - pz;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Mouse interaction force
      if (distance < interactionRadius) {
        const force = (interactionRadius - distance) / interactionRadius;
        const pushX = (dx / distance) * force * mouseInfluence * 0.1;
        const pushY = (dy / distance) * force * mouseInfluence * 0.1;
        const pushZ = (dz / distance) * force * mouseInfluence * 0.1;

        particleData.velocities[i * 3] += pushX;
        particleData.velocities[i * 3 + 1] += pushY;
        particleData.velocities[i * 3 + 2] += pushZ;
      }

      // Spring-back force to original position
      const originalX = particleData.originalPositions[i * 3];
      const originalY = particleData.originalPositions[i * 3 + 1];
      const originalZ = particleData.originalPositions[i * 3 + 2];

      const springForce = 0.02;
      particleData.velocities[i * 3] += (originalX - px) * springForce;
      particleData.velocities[i * 3 + 1] += (originalY - py) * springForce;
      particleData.velocities[i * 3 + 2] += (originalZ - pz) * springForce;

      // Apply velocity damping
      particleData.velocities[i * 3] *= 0.95;
      particleData.velocities[i * 3 + 1] *= 0.95;
      particleData.velocities[i * 3 + 2] *= 0.95;

      // Update positions
      particleData.positions[i * 3] += particleData.velocities[i * 3];
      particleData.positions[i * 3 + 1] += particleData.velocities[i * 3 + 1];
      particleData.positions[i * 3 + 2] += particleData.velocities[i * 3 + 2];

      // Gentle floating animation
      particleData.positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.002;

      // Interactive scaling
      const interactiveScale = distance < interactionRadius 
        ? particleData.scales[i] * (1 + (interactionRadius - distance) / interactionRadius * 0.5)
        : particleData.scales[i];

      // Set matrix for each instance
      dummy.position.set(
        particleData.positions[i * 3],
        particleData.positions[i * 3 + 1],
        particleData.positions[i * 3 + 2]
      );
      
      dummy.scale.setScalar(interactiveScale);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Set color with interaction brightness
      const brightness = distance < interactionRadius 
        ? 1 + (interactionRadius - distance) / interactionRadius * 0.5
        : 1;

      meshRef.current.setColorAt(i, new THREE.Color(
        particleData.colors[i * 3] * brightness,
        particleData.colors[i * 3 + 1] * brightness,
        particleData.colors[i * 3 + 2] * brightness
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
      <sphereGeometry args={[size, 12, 12]} />
      <meshPhongMaterial 
        transparent 
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.2}
        shininess={100}
      />
    </instancedMesh>
  );
}
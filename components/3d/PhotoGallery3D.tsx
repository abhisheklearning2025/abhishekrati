'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Photo3DProps {
  position: [number, number, number];
  photoType: string;
  title: string;
  description: string;
  onClick?: () => void;
}

function Photo3D({ position, photoType, title, description, onClick }: Photo3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(time * 0.8 + position[0]) * 0.2;
    
    // Hover effects
    if (hovered) {
      meshRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(1.1);
    } else {
      meshRef.current.rotation.y = 0;
      meshRef.current.scale.setScalar(1);
    }

    // Clicked expansion effect
    if (clicked) {
      meshRef.current.scale.setScalar(1.5);
    }
  });

  return (
    <group position={position}>
      {/* Photo frame */}
      <RoundedBox
        ref={meshRef}
        args={[2, 2.5, 0.1]}
        radius={0.1}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          setClicked(!clicked);
          onClick?.();
        }}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={1}
        />
      </RoundedBox>

      {/* Photo placeholder with elegant border */}
      <Box
        args={[1.8, 2.2, 0.05]}
        position={[0, 0, 0.06]}
      >
        <meshPhysicalMaterial
          color="#f8f8f8"
          metalness={0}
          roughness={0.3}
          envMapIntensity={0.5}
        />
      </Box>

      {/* Photo type indicator */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.15}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        📸
      </Text>

      {/* Title text */}
      <Text
        position={[0, -1.5, 0.1]}
        fontSize={0.12}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        font="/fonts/playfair-display.woff"
        maxWidth={2}
      >
        {title}
      </Text>

      {/* Hover glow effect */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          intensity={0.8}
          color="#ffd700"
          distance={3}
          decay={2}
        />
      )}

      {/* Click particles */}
      {clicked && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 2;
            return (
              <Box
                key={i}
                args={[0.1, 0.1, 0.1]}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius,
                  0
                ]}
              >
                <meshBasicMaterial
                  color="#ffd700"
                  transparent
                  opacity={0.7}
                />
              </Box>
            );
          })}
        </group>
      )}
    </group>
  );
}

interface PhotoGallery3DProps {
  photos: Array<{
    photoType: string;
    title: string;
    description: string;
    position?: [number, number, number];
  }>;
  layout?: 'grid' | 'spiral' | 'wave';
}

export default function PhotoGallery3D({ photos, layout = 'grid' }: PhotoGallery3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Calculate positions based on layout
  const photoPositions = useMemo(() => {
    return photos.map((photo, index) => {
      if (photo.position) return photo.position;

      let x = 0, y = 0, z = 0;

      switch (layout) {
        case 'grid':
          const cols = Math.ceil(Math.sqrt(photos.length));
          const row = Math.floor(index / cols);
          const col = index % cols;
          x = (col - (cols - 1) / 2) * 3;
          y = (row - Math.floor(photos.length / cols) / 2) * 3;
          z = 0;
          break;

        case 'spiral':
          const angle = (index / photos.length) * Math.PI * 4;
          const radius = 2 + index * 0.5;
          x = Math.cos(angle) * radius;
          y = Math.sin(angle) * radius;
          z = index * 0.3;
          break;

        case 'wave':
          x = (index - photos.length / 2) * 2.5;
          y = Math.sin(index * 0.5) * 2;
          z = Math.cos(index * 0.3) * 1;
          break;
      }

      return [x, y, z] as [number, number, number];
    });
  }, [photos, layout]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle rotation of entire gallery
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    
    // Camera orbiting effect
    if (layout === 'spiral') {
      camera.position.x = Math.cos(time * 0.2) * 15;
      camera.position.z = Math.sin(time * 0.2) * 15;
      camera.lookAt(0, 0, 0);
    }
  });

  const handlePhotoClick = (photoType: string) => {
    console.log(`Photo clicked: ${photoType}`);
    // Here you would implement modal/lightbox functionality
  };

  return (
    <group ref={groupRef}>
      {photos.map((photo, index) => (
        <Photo3D
          key={index}
          position={photoPositions[index]}
          photoType={photo.photoType}
          title={photo.title}
          description={photo.description}
          onClick={() => handlePhotoClick(photo.photoType)}
        />
      ))}

      {/* Gallery ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Key lighting for photos */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill lighting */}
      <pointLight
        position={[-5, 5, 5]}
        intensity={0.5}
        color="#ffeaa7"
      />
    </group>
  );
}
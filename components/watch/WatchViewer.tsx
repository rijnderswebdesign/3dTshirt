'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import Watch3DModel from './Watch3DModel';
import { usePoloStore } from '@/app/store';



// Simple 3D loading placeholder inside canvas
function Loader() {
  return null; // We'll use the WatchLoader component outside Canvas instead
}

// Camera controller component
function CameraController() {
  const { autoRotate, config} = usePoloStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={2}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2}
      autoRotate={autoRotate}
      autoRotateSpeed={2.0}
    />
  );
}

export default function WatchViewer() {
  // Detect if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="h-[50vh] lg:h-[100vh] relative  rounded-2xl overflow-hidden ">
      <Canvas 
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={isMobile ? [0, 2, 5] : [0, 3, 8]} 
          fov={isMobile ? 60 : 50} 
        />
        {/* Lighting setup */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 8, 8]} 
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[0, 0.5, 0.7]} 
          intensity={1.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[-5, 5, 5]} 
          intensity={0.8}
        />
        {/* Direct front light for watch face */}
        <spotLight 
          position={[0, 3, 6]} 
          angle={0.4} 
          penumbra={0.5} 
          intensity={2.0}
          target-position={[0, 0, 0]}
        />
        {/* Fill light from below to eliminate shadows on display */}
        <pointLight position={[0, -2, 3]} intensity={1.2} color="#ffffff" />
        
        {/* 3D Watch Model */}
        {/* <Suspense fallback={<Loader />}>
          <Watch3DModel
            onLoaded={() => {
              setTimeout(() => setIsLoading(false), 500);
            }}
          />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense> */}

        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Camera controls with auto-rotate support */}
        <CameraController />
      </Canvas>
    </div>
  );
}

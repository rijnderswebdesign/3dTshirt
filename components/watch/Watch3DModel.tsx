'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useWatchStore } from '@/app/store';
import { STEPS } from '@/app/config';

interface Watch3DModelProps {
  onLoaded?: () => void;
}

export default function Watch3DModel({
  onLoaded
}: Watch3DModelProps) {
  const { config, typeOption } = useWatchStore();
  const {
    activeSection,
    colorOption,
    materialOption,
    selectedMeshPart,
    internalDisplayTexture,
    strapTexture,
    watchBaseTexture,
  } = useWatchStore();
  const watchGroupRef = useRef<any>();
  const animationDataRef = useRef({ 
    startTime: 0, 
    isAnimating: false,
    hasStarted: false, // Track if animation already started
    duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 1200 // Faster on mobile
  });
  
  // Refs for all watch parts
  const meshRefs = useRef<{ [key: string]: THREE.Mesh }>({});
  const internalDisplayRef = useRef<THREE.Mesh | null>(null);
  const strapRef = useRef<THREE.Mesh | null>(null);
  const watchBaseRef = useRef<THREE.Mesh | null>(null);
  const glassRef = useRef<THREE.Mesh | null>(null);
  const numeralsRef = useRef<THREE.Mesh | null>(null);
  const hourHandRef = useRef<THREE.Mesh | null>(null);
  const minuteHandRef = useRef<THREE.Mesh | null>(null);
  const secondHandRef = useRef<THREE.Mesh | null>(null);
  const dateNumberRef = useRef<THREE.Mesh | null>(null);
  // Load the 3D model
  const { scene, nodes, materials } = useGLTF('/model/watch.glb');
  
  // Get color configuration for each mesh part (memoized to prevent unnecessary re-renders)
  const colorStep = useMemo(() => STEPS.find(step => step.title === 'Color'), []);
  const strapColors = useMemo(() => 
    (colorStep?.children?.find((child: any) => child.meshName === 'Strap') as any)?.color || [], 
    [colorStep]
  );
  const internalDisplayColors = useMemo(() => 
    (colorStep?.children?.find((child: any) => child.meshName === 'Internal_Display') as any)?.color || [], 
    [colorStep]
  );
  const watchBaseColors = useMemo(() => 
    (colorStep?.children?.find((child: any) => child.meshName === 'Watch_Base') as any)?.color || [], 
    [colorStep]
  );
  const materialData = useMemo(() => {
    const materialsStep = STEPS.find(step => step.title === 'Materials');
    return (materialsStep?.children?.find((child: any) => child.id === materialOption) as any) || {};
  }, [materialOption]);
  
  const metalness = useMemo(() => materialData?.metalness || 0.9, [materialData]);
  const roughness = useMemo(() => materialData?.roughness || 0.1, [materialData]);
  
  // Get texture paths (memoized separately to prevent re-renders)
  const internalDisplayTexturePath = useMemo(() => 
    internalDisplayColors[internalDisplayTexture]?.texture || 'blackinternal.jpg',
    [internalDisplayTexture, internalDisplayColors]
  );
  
  const strapTexturePath = useMemo(() => 
    strapColors[strapTexture]?.texture || 'greymetal.jpg',
    [strapTexture, strapColors]
  );
  
  const watchBaseTexturePath = useMemo(() => 
    watchBaseColors[watchBaseTexture]?.texture || 'iron.jpg',
    [watchBaseTexture, watchBaseColors]
  );
  
  const materialTexturePath = useMemo(() => 
    materialData?.texture || 'silver.jpg',
    [materialData]
  );

  const [internalDisplayTextureMap, strapTextureMap, watchBaseTextureMap, materialTextureMap] = useTexture([
    `/textures/${internalDisplayTexturePath}`,
    `/textures/${strapTexturePath}`,
    `/textures/${watchBaseTexturePath}`,
    `/textures/${materialTexturePath}`
  ]);
  
  // Configure texture properties after loading
  useEffect(() => {
    if (internalDisplayTextureMap) {
      internalDisplayTextureMap.wrapS = internalDisplayTextureMap.wrapT = THREE.RepeatWrapping;
      internalDisplayTextureMap.colorSpace = THREE.SRGBColorSpace;
      internalDisplayTextureMap.flipY = false;
      internalDisplayTextureMap.needsUpdate = true;
    }
    if (strapTextureMap) {
      strapTextureMap.wrapS = strapTextureMap.wrapT = THREE.RepeatWrapping;
      strapTextureMap.colorSpace = THREE.SRGBColorSpace;
      strapTextureMap.flipY = false;
      strapTextureMap.needsUpdate = true;
    }
    if (watchBaseTextureMap) {
      watchBaseTextureMap.wrapS = watchBaseTextureMap.wrapT = THREE.RepeatWrapping;
      watchBaseTextureMap.colorSpace = THREE.SRGBColorSpace;
      watchBaseTextureMap.flipY = false;
      watchBaseTextureMap.needsUpdate = true;
    }
    if (materialTextureMap) {
      materialTextureMap.wrapS = materialTextureMap.wrapT = THREE.RepeatWrapping;
      materialTextureMap.colorSpace = THREE.SRGBColorSpace;
      materialTextureMap.flipY = false;
      materialTextureMap.needsUpdate = true;
    }
  }, [internalDisplayTextureMap, strapTextureMap, watchBaseTextureMap, materialTextureMap]);
  
  // Notify parent when model is loaded and start animation (only once)
  useEffect(() => {
    if (scene && !animationDataRef.current.hasStarted) {
      // Mark as started immediately to prevent double trigger
      animationDataRef.current.hasStarted = true;
      animationDataRef.current.startTime = Date.now();
      animationDataRef.current.isAnimating = true;
      
      // Notify parent if callback exists
      if (onLoaded) {
        onLoaded();
      }
    }
  }, [scene, onLoaded]);
  
  // Clone the scene to avoid modifying the cached version (memoized)
  const watchModel = useMemo(() => scene.clone(true), [scene]);
  
  // Helper function to check if a part should be visible based on watch type
  const isPartVisible = (meshName: string) => {
    // Sub_Dial_3 is ALWAYS visible regardless of watch type
    if (meshName.includes('Sub_Dial_3')) {
      console.log(`✅ Sub_Dial_3 part (always visible): "${meshName}"`);
      return true;
    }
    
    // Log other sub-dial parts for debugging
    if (meshName.includes('Sub_Dial')) {
      console.log(`Sub-dial part detected: "${meshName}", typeOption: ${typeOption}`);
    }
    
    switch (typeOption) {
      case 0: // Normal - hide pushers and Sub_Dial_1, Sub_Dial_2 (NOT Sub_Dial_3)
        if (meshName === 'Pusher_1' || meshName === 'Pusher_2') return false;
        // Hide only Sub_Dial_1 and Sub_Dial_2
        if (meshName.includes('Sub_Dial_1') || meshName.includes('Sub_Dial_2')) return false;
        return true;
      
      case 1: // Auto - hide crown and Sub_Dial_1, Sub_Dial_2 (NOT Sub_Dial_3)
        if (meshName === 'Crown') return false;
        // Hide only Sub_Dial_1 and Sub_Dial_2
        if (meshName.includes('Sub_Dial_1') || meshName.includes('Sub_Dial_2')) return false;
        return true;
      
      case 2: // Second Watch (Chronograph) - show ALL parts including all sub-dials
        return true;
      
      default:
        return true;
    }
  };

  // Update materials when textures or selections change
  useEffect(() => {
    if (!watchModel || !internalDisplayTextureMap || !strapTextureMap || !watchBaseTextureMap || !materialTextureMap) {
      console.warn('⚠️ Waiting for all textures to load...', {
        hasWatchModel: !!watchModel,
        hasInternalDisplayTexture: !!internalDisplayTextureMap,
        hasStrapTexture: !!strapTextureMap,
        hasWatchBaseTexture: !!watchBaseTextureMap,
        hasMaterialTexture: !!materialTextureMap
      });
      return;
    }
    
    // First pass: log all mesh names for debugging
    const allMeshNames: string[] = [];
    watchModel.traverse((child: any) => {
      if (child.isMesh) {
        allMeshNames.push(child.name);
      }
    });
    
    watchModel.traverse((child: any) => {
      if (child.isMesh) {
        const meshName = child.name;
        
        // Store reference to all mesh parts
        meshRefs.current[meshName] = child;
        
        // Control visibility based on watch type
        child.visible = isPartVisible(meshName);
        
        // Clone material to avoid affecting other instances (only once)
        if (!child.userData.materialCloned) {
          child.material = child.material.clone();
          child.userData.materialCloned = true;
        }
        
        // Ensure we're working with MeshStandardMaterial
        if (child.material.isMeshStandardMaterial) {
          
          // Apply materials based on EXACT mesh names from the model
          switch (meshName) {
            // Internal Display - try multiple possible names (check console log for actual name!)
            case 'Watch_Internal_Base':
            case 'Internal_Display':
            case 'Sub_Dial_1':
            case 'Sub_Dial_2_Base':
              internalDisplayRef.current = child;
              child.castShadow = true;
              child.receiveShadow = true;
              // Apply texture - use THREE.Texture object, not string path
              if (child.material.map && child.material.map !== internalDisplayTextureMap) {
                child.material.map.dispose();
              }
              if (child.material.emissiveMap && child.material.emissiveMap !== internalDisplayTextureMap) {
                child.material.emissiveMap.dispose();
              }
              
              // Apply new texture
              child.material.map = internalDisplayTextureMap;
              child.material.metalness = 0.0; // No metalness for display
              child.material.roughness = 1.0; // Full diffuse for clear texture visibility
              child.material.envMapIntensity = 0.1; // Minimal reflections
              // Remove emissive to prevent washing out the texture
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveMap = null;
              child.material.emissiveIntensity = 0.0;
              child.material.side = THREE.DoubleSide;
              child.material.color = new THREE.Color(0xffffff); // Ensure base color is white
              child.material.opacity = 1.0; // Ensure fully opaque
              child.material.transparent = false; // Not transparent
              child.material.needsUpdate = true;
              break;
            
            // Strap - multiple possible names
            case 'Strap':
              strapRef.current = child;
              child.castShadow = true;
              child.receiveShadow = true;
              // Dispose old texture if exists
              if (child.material.map && child.material.map !== strapTextureMap) {
                child.material.map.dispose();
              }
              // Apply new texture
              child.material.map = strapTextureMap;
              child.material.metalness = metalness;
              child.material.roughness = roughness;
              child.material.envMapIntensity = 3.0; // Enhanced reflections for strap
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
              break;
            
            // Watch Base
            case 'Watch__Base':
            case 'Pusher_1':
            case 'Pusher_2':
            case 'Crown':
              watchBaseRef.current = child;
              child.castShadow = true;
              child.receiveShadow = true;
              // Dispose old texture if exists
              if (child.material.map && child.material.map !== watchBaseTextureMap) {
                child.material.map.dispose();
              }
              // Apply new texture
              child.material.map = watchBaseTextureMap;
              child.material.metalness = metalness;
              child.material.roughness = roughness;
              child.material.envMapIntensity = 4.2; // Boost reflections for watch base
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
              break;
            
            // Glass - multiple possible names
            case 'Glass':
              glassRef.current = child;
              // child.color = new THREE.Color(0xffffff);
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.transparent = true;
              child.material.opacity = 0.25;
              child.material.metalness = 0.1;
              child.material.roughness = 0.4  ;
              child.material.envMapIntensity = 0.5; // High reflections for glass
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
              break;
            
            // Crown, Pushers, Hands - apply material texture
            case 'Date_Numbering':
              console.log('Date_Numbering', child);
              dateNumberRef.current = child;
              child.castShadow = true;
              child.receiveShadow = true;
              child.material.color = new THREE.Color(0xff0000); // Red color
              child.material.transparent = false;
              child.material.opacity = 1;
              child.material.metalness = 0.5;
              child.material.roughness = 0.4;
              child.material.envMapIntensity = 0.5;
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
              break;
            
            // Default - apply material texture to all remaining parts
            default:
              // Apply material texture to all remaining parts
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Dispose old texture if exists
              if (child.material.map && child.material.map !== materialTextureMap) {
                child.material.map.dispose();
              }
              
              // Apply material texture
              child.material.map = materialTextureMap;
              child.material.metalness = metalness;
              child.material.roughness = roughness;
              child.material.envMapIntensity = 2.5; // Enhanced reflections for metal parts
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
              
              // Log for debugging (only once per mesh)
              if (!child.userData.textureLogged) {
                child.userData.textureLogged = true;
              }
              break;
          }
        }
      }
    });
    
  }, [
    watchModel,
    internalDisplayTextureMap, 
    strapTextureMap, 
    watchBaseTextureMap,
    materialTextureMap,
    internalDisplayTexturePath,
    strapTexturePath,
    watchBaseTexturePath,
    materialTexturePath,
    metalness,
    roughness,
    typeOption
  ]);
  
  // Smooth entrance animation using useFrame (optimized for mobile)
  useFrame(() => {
    if (!watchGroupRef.current || !animationDataRef.current.isAnimating) return;
    
    const elapsed = Date.now() - animationDataRef.current.startTime;
    const duration = animationDataRef.current.duration;
    const rawProgress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function (easeOutCubic) - faster on mobile
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const progress = easeOut(rawProgress);
    
    // Scale animation (0.5 -> 1 for better mobile performance)
    const scale = 0.5 + (progress * 0.5);
    watchGroupRef.current.scale.set(scale, scale, scale);
    
    // Slight rotation during entrance (reduced for mobile)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const rotationAmount = isMobile ? 0.15 : 0.3; // Less rotation on mobile
    const rotationOffset = (1 - progress) * Math.PI * rotationAmount;
    watchGroupRef.current.rotation.y = rotationOffset;
    
    // Fade in effect using opacity (skip Glass which needs to stay transparent)
    watchGroupRef.current.traverse((child: any) => {
      if (child.isMesh && child.material && child.name !== 'Glass') {
        child.material.opacity = progress;
        child.material.transparent = rawProgress < 1;
      }
    });
    
    // Stop animation when complete
    if (rawProgress >= 1) {
      animationDataRef.current.isAnimating = false;
      watchGroupRef.current.scale.set(1, 1, 1);
      watchGroupRef.current.rotation.y = 0;
      
      // Ensure full opacity (skip Glass which should stay transparent)
      watchGroupRef.current.traverse((child: any) => {
        if (child.isMesh && child.material && child.name !== 'Glass') {
          child.material.opacity = 1;
          child.material.transparent = false;
          child.material.needsUpdate = true;
        }
      });
      
    }
  });

  // Example: Expose refs for external use (optional)
  // You can now access any part via meshRefs.current['MeshName']
  // Or use specific refs like internalDisplayRef.current
  
  return (
    <group ref={watchGroupRef}>
      <primitive object={watchModel} rotation-x={Math.PI / 8}/>
    </group>
  );
}

// Export a hook to access mesh refs if needed
export function useWatchMeshRefs() {
  return {
    getAllMeshes: () => {
      // This would need to be implemented with context if you need external access
      return {};
    }
  };
}

// Preload the model and textures for better performance
useGLTF.preload('/model/watch.glb');
useTexture.preload('/textures/silver.jpg');
useTexture.preload('/textures/titanium.jpg');
useTexture.preload('/textures/greymetal.jpg');
useTexture.preload('/textures/blackinternal.jpg');
useTexture.preload('/textures/black.jpg');
useTexture.preload('/textures/grey.png');
useTexture.preload('/textures/gold.png');
useTexture.preload('/textures/iron.jpg');



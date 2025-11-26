'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePoloStore } from '@/app/store';
import { STEPS,clothColors, buttonColors, buttonMaterials, clothMaterials } from '@/app/config';

interface Shirt3DModelProps {
  onLoaded?: () => void;
}

export default function   Shirt3DModel({
  onLoaded
}: Shirt3DModelProps) {
  const { config } = usePoloStore();
  const shirtGroupRef = useRef<any>();
  const animationDataRef = useRef({ 
    startTime: 0, 
    isAnimating: false,
    hasStarted: false, // Track if animation already started
    duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 800 : 1200 // Faster on mobile
  });
  
  // Refs for all watch parts
  const meshRefs = useRef<{ [key: string]: THREE.Mesh }>({});

  // Load the 3D model
  const { scene, nodes, materials } = useGLTF('/model/shirt.glb');
  
  // Get color configuration for each mesh part (memoized to prevent unnecessary re-renders)
  // const colorStep = useMemo(() => STEPS.find(step => step.title === 'Kleur'), []);
  const [bodyTexture, bodycolor] = useMemo(() =>{
    let texture =""
    let color = ""
    if(config.bodycolor === -1){
      texture =  clothMaterials.find((child : any, index : number) => index === config.bodymaterial)?.texture || 'default_1.jpg'
      color = config.bodycolorHex
    }else{
      texture =  clothColors.find((child : any, index : number) => index === config.bodycolor)?.texture || 'default_1.jpg'
    }
    return [texture, color]
  }, [config.bodycolor, config.bodymaterial, config.bodycolorHex])

  const [collarTexture, collarColor] = useMemo(() =>{
    let texture =""
    let color = ""
    if(config.collarcolor === -1){
      texture =  clothMaterials.find((child : any, index : number) => index === config.collarmaterial)?.texture || 'default_1.jpg'
      color = config.collarcolorHex
    }else{
      texture =  clothColors.find((child : any, index : number) => index === config.collarcolor)?.texture || 'default_1.jpg'
    }
    return [texture, color]
  }, [config.collarcolor, config.collarmaterial, config.collarcolorHex])

  const [buttonTexture, buttonColor] = useMemo(() =>{
    let texture =""
    let color =""
    // if(config.buttoncolor !== -1){
      // Filter by material first, then get the item at buttoncolor index
      const filteredByMaterial = buttonColors.filter((child : any) => child.material === config.buttonmaterial);
      console.log(config.buttoncolor, config.buttonmaterial, filteredByMaterial);
      if(config.buttoncolor === -1){
        // texture = filteredByMaterial[config.buttoncolor]?.texture || 'default_1.jpg';
        texture = 'default_1.jpg'
        color = config.buttoncolorHex;
      }else{
        texture = filteredByMaterial[config.buttoncolor]?.texture || 'default_1.jpg';
      }
    return [texture, color]
  }, [config.buttoncolor, config.buttonmaterial, config.buttoncolorHex])

  const [sleeveTexture, sleeveColor] = useMemo(() =>{
    let texture =""
    let color =""
    if(config.sleevecolor === -1){
      texture =  clothMaterials.find((child : any, index : number) => index === config.slevematerial)?.texture || 'default_1.jpg'
      color = config.sleevecolorHex
    }else{
      texture =  clothColors.find((child : any, index : number) => index === config.sleevecolor)?.texture || 'default_1.jpg'
    }
    return [texture, color]
  }, [config.sleevecolor, config.slevematerial, config.sleevecolorHex])


  const [bodyTextureMap, collarTextureMap, buttonTextureMap, sleeveTextureMap] = useTexture([
    `/textures/${bodyTexture}`,
    `/textures/${collarTexture}`,
    `/textures/${buttonTexture}`,
    `/textures/${sleeveTexture}`
  ]);
  
  // State for uploaded logo texture
  const [uploadedLogoTexture, setUploadedLogoTexture] = useState<THREE.Texture | null>(null);
  const [logoAspectRatio, setLogoAspectRatio] = useState<number>(1);
  
  // State for text logo texture
  const [textLogoTexture, setTextLogoTexture] = useState<THREE.Texture | null>(null);
  
  // Load uploaded logo texture when it changes
  useEffect(() => {
    if (config.uploadedLogo) {
      console.log('Loading uploaded logo:', config.uploadedLogo);
      const logoUrl = config.uploadedLogo;
      const textureLoader = new THREE.TextureLoader();
      
      textureLoader.load(
        logoUrl,
        (texture) => {
          console.log('Texture loaded successfully');
          
          // Get aspect ratio from the loaded texture's image
          const img = texture.image;
          if (img && img.width && img.height) {
            const aspectRatio = img.width / img.height;
            console.log('Aspect ratio:', aspectRatio, 'Width:', img.width, 'Height:', img.height);
            
            // Store aspect ratio for mesh scaling
            setLogoAspectRatio(aspectRatio);
          }
          
          // Configure texture - simple settings, we'll handle aspect ratio via mesh scaling
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.flipY = true; // Try with flipY true for proper UV mapping
          texture.needsUpdate = true;
          
          console.log('Texture configured:', {
            wrapS: texture.wrapS,
            wrapT: texture.wrapT,
            flipY: texture.flipY,
            format: texture.format,
            type: texture.type
          });
          
          setUploadedLogoTexture(texture);
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
        },
        (error) => {
          console.error('Error loading uploaded logo:', error);
        }
      );
    } else {
      // Clean up texture when logo is removed
      if (uploadedLogoTexture) {
        uploadedLogoTexture.dispose();
        setUploadedLogoTexture(null);
      }
      setLogoAspectRatio(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.uploadedLogo]);
  
  // Load text logo texture when it changes
  useEffect(() => {
    if (config.textLogo && config.textLogo.textureUrl) {
      console.log('📝 Loading text logo texture:', {
        text: config.textLogo.text,
        color: config.textLogo.color,
        fontSize: config.textLogo.fontSize,
        textureUrlLength: config.textLogo.textureUrl.length
      });
      
      const textureLoader = new THREE.TextureLoader();
      
      textureLoader.load(
        config.textLogo.textureUrl,
        (texture) => {
          console.log('✅ Text logo texture loaded successfully', {
            width: texture.image.width,
            height: texture.image.height
          });
          
          // Configure texture
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.flipY = false; // Changed to false to prevent inversion
          texture.needsUpdate = true;
          
          setTextLogoTexture(texture);
        },
        undefined,
        (error) => {
          console.error('❌ Error loading text logo:', error);
        }
      );
    } else {
      console.log('🗑️ Removing text logo texture');
      // Clean up texture when text logo is removed
      if (textLogoTexture) {
        textLogoTexture.dispose();
        setTextLogoTexture(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.textLogo]);
  
  // Configure texture properties after loading
  useEffect(() => {
    if (bodyTextureMap) {
      bodyTextureMap.wrapS = bodyTextureMap.wrapT = THREE.RepeatWrapping;
      bodyTextureMap.colorSpace = THREE.SRGBColorSpace;
      bodyTextureMap.flipY = false;
      bodyTextureMap.needsUpdate = true;
    }
    if (collarTextureMap) {
      collarTextureMap.wrapS = collarTextureMap.wrapT = THREE.RepeatWrapping;
      collarTextureMap.colorSpace = THREE.SRGBColorSpace;
      collarTextureMap.flipY = false;
      collarTextureMap.needsUpdate = true;
    }
    if (buttonTextureMap) {
      buttonTextureMap.wrapS = buttonTextureMap.wrapT = THREE.RepeatWrapping;
      buttonTextureMap.colorSpace = THREE.SRGBColorSpace;
      buttonTextureMap.flipY = false;
      buttonTextureMap.needsUpdate = true;
    }
    if (sleeveTextureMap) {
      sleeveTextureMap.wrapS = sleeveTextureMap.wrapT = THREE.RepeatWrapping;
      sleeveTextureMap.colorSpace = THREE.SRGBColorSpace;
      sleeveTextureMap.flipY = false;
      sleeveTextureMap.needsUpdate = true;
    }
  }, [bodyTextureMap, collarTextureMap, buttonTextureMap, sleeveTextureMap]);
  
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
  const shirtModel = useMemo(() => scene.clone(true), [scene]);
  
  // Helper function to check if a part should be visible based on shirt configuration
  const isPartVisible = (meshName: string): boolean => {
    // ==================== BODY TYPE ====================
    // Check if this is a body mesh
    if (meshName === 'Shirt_Split' || meshName === 'Closed_Split') {
      if (config.bodytype === 0 && meshName === 'Shirt_Split') return true;
      if (config.bodytype === 1 && meshName === 'Closed_Split') return true;
      return false; // Hide if it's a body mesh but doesn't match the selected type
    }
    
    // ==================== COLLAR TYPE ====================
    // Check if this is a collar mesh
    const isRegularCollar = meshName === 'RHS_Reg_Collar' || meshName === 'LHS_Reg_Collar';
    const isHighCollar = meshName === 'RHS_High_COllar' || meshName === 'LHS_High_Collar';
    const isHighRoundNeck = meshName === 'High_Round_N_Front' || meshName === 'High_Round_N_Rear';
    const isLowRoundNeck = meshName === 'Round_Neck_Front' || meshName === 'Round_Neck_Rear';
    
    // Log collar meshes for debugging
    if (isRegularCollar || isHighCollar || isHighRoundNeck || isLowRoundNeck) {
      if (config.collartype === 0 && isRegularCollar) {
        return true;
      }
      if (config.collartype === 1 && isHighCollar) {
        return true;
      }
      if (config.collartype === 2 && isHighRoundNeck && config.buttonstype !== 2) {
        return true;
      }
      if (config.collartype === 3 && isLowRoundNeck && config.buttonstype !== 2) {
        return true;
      }
      if(config.collartype === 2 &&  meshName === 'High_Round_N_Rear' && config.buttonstype === 2){
        return true;
      }
      
      return false; // Hide if it's a collar mesh but doesn't match the selected type
    }
    
    // Body front/rear parts - always visible with collar selection
    if (meshName === 'SHirt_Rear') {
      // These are visible for collar types 0 and 1, but hidden for type 2 (round neck)
      if (config.collartype === 0 || config.collartype === 1 || config.collartype ===3 || config.collartype ===2) return true;
    }
    if(meshName === 'Button_SHirt_Front' ){
      if ((config.collartype === 0 || config.collartype === 1) && config.buttonstype !== 2) return true;
    }
    if(meshName === 'Zipper_SHirt_Front' ){
      if ((config.collartype === 0 || config.collartype === 1 || config.collartype === 2 || config.collartype === 3) && config.buttonstype == 2) return true;
    }

    // ==================== BUTTONS TYPE ====================
    // Check if this is a button-related mesh
    const isLcFlatButton = meshName === 'LC_Flat_Top_Button';
    const isHcFlatButton = meshName === 'HC_Flat_Top_Button';
    const isLcHoleButton = meshName === "Low_Collar_Buttons'";
    const isHcHoleButton = meshName === 'Buttons_HC';
    const isLowCollarButtonStrap = meshName === 'Low_Collar_Button_strap';
    const isHighCollarButtonStrap = meshName === 'High_Collar_Button_STrap';
    const isZipper = meshName === 'Zipper';
    
    if (isLcFlatButton || isHcFlatButton || isLowCollarButtonStrap || isHighCollarButtonStrap || isHcHoleButton || isZipper || isLcHoleButton) {
      // Button type 0 - Regular buttons
      if (config.buttonstype === 0) {
        if (config.collartype === 0 || config.collartype === 3) {
          return isLcFlatButton || isLowCollarButtonStrap;
        } else if (config.collartype === 1 ) {
          return isHcFlatButton || isHighCollarButtonStrap;
        }else if(config.collartype === 2){
          return isLcFlatButton;
        }

      }
      // Button type 1 - LC buttons
      else if (config.buttonstype === 1) {
        if (config.collartype === 0 || config.collartype === 3) {
          return isLcHoleButton || isLowCollarButtonStrap;
        } else if (config.collartype === 1) {
          return isHcHoleButton || isHighCollarButtonStrap;
        }else if(config.collartype === 2){
          return isLcHoleButton;
        }
      }
      // Button type 2 - Zipper
      else if (config.buttonstype === 2) {
        return isZipper;
      }
      return false; // Hide if it's a button mesh but doesn't match
    }

    // ==================== SLEEVE TYPE ====================
    // Check if this is a sleeve mesh
    const isShortSleeve = meshName === 'SHort_Sleeves' || meshName === 'Short_Sleeve_BAnd';
    const isLongSleeve = meshName === 'LOng_SLeeve' || meshName === 'LOng_sleeve_band';
    
    if (isShortSleeve || isLongSleeve) {
      if (config.sleevetype === 0 && isShortSleeve) return true;
      if (config.sleevetype === 1 && isLongSleeve) return true;
      return false; // Hide if it's a sleeve mesh but doesn't match the selected type
    }
    
    // ==================== ALWAYS VISIBLE PARTS ====================
    if (meshName === 'SidePocket_SL' || meshName === 'Side_TAg') {
      return true;
    }
    
    // ==================== UPLOADED LOGO ====================
    if (meshName === 'Belly_Logo') {
      return config.uploadedLogo !== null;
    }
    
    // ==================== TEXT LOGO ====================
    if (meshName === 'Front_Pocket') {
      const isVisible = config.textLogo !== null;
      console.log('👁️ Front_Pocket visibility check:', { isVisible, hasTextLogo: !!config.textLogo });
      return isVisible;
    }
    
    // Hide all other parts by default
    return false;
  };

  // Update materials when textures or selections change
  useEffect(() => {
    if (!shirtModel || !bodyTextureMap || !collarTextureMap || !buttonTextureMap || !sleeveTextureMap) {
   
      return;
    }
    
    // First pass: log all mesh names for debugging
    const allMeshNames: string[] = [];
    shirtModel.traverse((child: any) => {
      if (child.isMesh) {
        allMeshNames.push(child.name);
      }
    });
    console.log('🔍 All mesh names in model:', allMeshNames);
    console.log('🔍 Looking for Front_Pokcet:', allMeshNames.includes('Front_Pocket'));
    
    shirtModel.traverse((child: any) => {
      if (child.isMesh) {
        const meshName = child.name;
        
        // Debug Front_Pokcet specifically
        if (meshName === 'Front_Pocket') {
          console.log('🎯 Found Front_Pocket mesh in traverse!');
        }
        
        // Store reference to all mesh parts
        meshRefs.current[meshName] = child;
        
        // Control visibility based on shirt configuration
        const shouldBeVisible = isPartVisible(meshName);
        child.visible = shouldBeVisible;
        
        if (meshName === 'Front_Pocket') {
          console.log('🔧 Setting Front_Pocket visibility:', shouldBeVisible);
        }
        
        
        // Clone material to avoid affecting other instances (only once)
        if (!child.userData.materialCloned) {
          child.material = child.material.clone();
          child.userData.materialCloned = true;
        }
        
        // Ensure we're working with MeshStandardMaterial
        if (child.material.isMeshStandardMaterial) {
          // Set default shadow properties
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.DoubleSide;
          
          // Apply materials based on shirt part names
          // Body parts (main body fabric)
          if (meshName.includes('Button_SHirt_Front') || 
              meshName.includes('SHirt_Rear') || 
              meshName === 'Shirt_Split' || 
              meshName === 'Closed_Split' ||
              meshName === 'SHirt_Front' ||
              meshName === 'Zipper_SHirt_Front' ||
              meshName === 'High_Round_N_Rear' ||
              meshName === 'High_Round_N_Front' ||
              meshName === 'Round_Neck_Rear' ||
              meshName === 'Round_Neck_Front' 
            ) {
            
            // Dispose old texture if exists
            if (child.material.map && child.material.map !== bodyTextureMap) {
              child.material.map.dispose();
            }
            
            // Apply body texture
            child.material.map = bodyTextureMap;
            
            // Configure texture repeating
            if (bodyTextureMap) {
              bodyTextureMap.repeat.set(1, 1); // Repeat 2x horizontally and vertically
              bodyTextureMap.wrapS = THREE.RepeatWrapping;
              bodyTextureMap.wrapT = THREE.RepeatWrapping;
            }
            
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
            child.material.envMapIntensity = 0.5;
            child.material.transparent = false;
            child.material.castShadow = true;
            child.material.side = THREE.DoubleSide;
            
            // Apply hex color if specified
            if (bodycolor) {
              child.material.color = new THREE.Color(bodycolor);
            } else {
              child.material.color = new THREE.Color(0xffffff);
            }
            
            child.material.needsUpdate = true;
          }
          // Collar parts
          else if ( meshName === 'RHS_Reg_Collar' || meshName === 'LHS_Reg_Collar' ||
            meshName === 'RHS_High_COllar' || meshName === 'LHS_High_Collar'||  meshName === 'Low_Collar_Button_strap'|| 
            meshName === 'High_Collar_Button_STrap' ||
            meshName === 'Side_TAg' ) {
            
            // Dispose old texture if exists
            if (child.material.map && child.material.map !== collarTextureMap) {
              child.material.map.dispose();
            }
            
            // Apply collar texture
            child.material.map = collarTextureMap;
            
            // Configure texture repeating
            if (collarTextureMap) {
              collarTextureMap.repeat.set(1, 1);
              collarTextureMap.wrapS = THREE.RepeatWrapping;
              collarTextureMap.wrapT = THREE.RepeatWrapping;
            }
            
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
            child.material.envMapIntensity = 0.5;
            child.material.transparent = false;
            child.material.castShadow = true;
            child.material.side = THREE.DoubleSide;
            // Apply hex color if specified
            if (collarColor) {
              child.material.color = new THREE.Color(collarColor);
            } else {
              child.material.color = new THREE.Color(0xffffff);
            }
            
            child.material.needsUpdate = true;
          }
          // Button and button strap parts
          else if (meshName === 'LC_Flat_Top_Button'|| 
            meshName === 'HC_Flat_Top_Button'|| 
            meshName === 'Low_Collar_Buttons'|| 
            meshName === 'Buttons_HC'|| meshName === 'Zipper') {
            
            // Dispose old texture if exists
            if (child.material.map && child.material.map !== buttonTextureMap && buttonTexture !== "") {
              child.material.map.dispose();
            }
            
            // Apply button texture
            child.material.map = buttonTextureMap;
            
            // Configure texture repeating
            if (buttonTextureMap) {
              buttonTextureMap.repeat.set(1, 1);
              buttonTextureMap.wrapS = THREE.RepeatWrapping;
              buttonTextureMap.wrapT = THREE.RepeatWrapping;
            }
            
            // Apply realistic material properties based on button material type
            switch(config.buttonmaterial) {
              case 0: // Plastic - smooth, slightly reflective
                child.material.metalness = 0.1;
                child.material.roughness = 0.4;
                child.material.envMapIntensity = 0.8;
                child.material.clearcoat = 0.3; // Plastic coating effect
                child.material.clearcoatRoughness = 0.2;
                break;
                
              case 1: // Metal - highly reflective, smooth
                child.material.metalness = 0.9;
                child.material.roughness = 0.2;
                child.material.envMapIntensity = 2.5;
                child.material.clearcoat = 0;
                child.material.clearcoatRoughness = 0;
                break;
                
              case 2: // Wooden - no metal, rough texture
                child.material.metalness = 0.0;
                child.material.roughness = 0.85;
                child.material.envMapIntensity = 0.3;
                child.material.clearcoat = 0.1; // Slight varnish effect
                child.material.clearcoatRoughness = 0.5;
                break;
                
              case 3: // Cloth - very rough, no reflections
                child.material.metalness = 0.0;
                child.material.roughness = 0.95;
                child.material.envMapIntensity = 0.1;
                child.material.clearcoat = 0;
                child.material.clearcoatRoughness = 0;
                break;
                
              default: // Default to plastic
                child.material.metalness = 0.1;
                child.material.roughness = 0.4;
                child.material.envMapIntensity = 0.8;
                child.material.clearcoat = 0.3;
                child.material.clearcoatRoughness = 0.2;
            }
            
            child.material.transparent = false;
            child.material.castShadow = true;
            child.material.side = THREE.DoubleSide;
            
            // Apply hex color if specified (buttons might have custom colors)
            if (buttonColor) {
              child.material.color = new THREE.Color(buttonColor);
            } else {
              child.material.color = new THREE.Color(0xffffff);
            }
            
            child.material.needsUpdate = true;
          }
          // Sleeve parts
          else if (meshName.includes('SHort_Sleeves') || 
                   meshName.includes('LOng_SLeeve') || 
                   meshName.includes('Short_Sleeve_BAnd') ||
                   meshName.includes('LOng_SLeeve') ||
                   meshName === 'SidePocket_SL'||
                   meshName === 'LOng_sleeve_band') {
            
            // Dispose old texture if exists
            if (child.material.map && child.material.map !== sleeveTextureMap) {
              child.material.map.dispose();
            }
            
            // Apply sleeve texture
            child.material.map = sleeveTextureMap;
            
            // Configure texture repeating
            if (sleeveTextureMap) {
              sleeveTextureMap.repeat.set(1, 1);
              sleeveTextureMap.wrapS = THREE.RepeatWrapping;
              sleeveTextureMap.wrapT = THREE.RepeatWrapping;
            }
            
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
            child.material.envMapIntensity = 0.5;
            child.material.transparent = false;
            child.material.castShadow = true;
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            if (sleeveColor) {
              child.material.color = new THREE.Color(sleeveColor);
            } else {
              child.material.color = new THREE.Color(0xffffff);
            }
          }
          // Uploaded Logo
          else if (meshName === 'Belly_Logo') {
            
            if(uploadedLogoTexture){
              uploadedLogoTexture.wrapS = THREE.RepeatWrapping
              uploadedLogoTexture.wrapT = THREE.RepeatWrapping
              uploadedLogoTexture.repeat.set(-0.5, 0.6)
              uploadedLogoTexture.offset.set(0.35, -0.2)
            }
     
            
            // Apply sleeve texture
            child.material.map = uploadedLogoTexture;
           
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
            child.material.envMapIntensity = 0.5;
            child.material.transparent = true;
            child.material.castShadow = true;
            child.material.side = THREE.FrontSide;
            child.material.needsUpdate = true;
            
          }
          // Text Logo on Front Pocket
          else if (meshName === 'Front_Pocket') {
           
            // Dispose old texture if exists
            if (child.material.map && child.material.map !== textLogoTexture) {
              child.material.map.dispose();
            }
            
            // Apply text logo texture
            child.material.map = textLogoTexture;
            
            // Configure texture
            if (textLogoTexture) {
              // Get UV coordinates to understand the mesh scale
              const geometry = child.geometry;
              const uvAttribute = geometry.attributes.uv;
              
              if (uvAttribute) {
                // Calculate UV bounds
                let minU = Infinity, maxU = -Infinity;
                let minV = Infinity, maxV = -Infinity;
                
                for (let i = 0; i < uvAttribute.count; i++) {
                  const u = uvAttribute.getX(i);
                  const v = uvAttribute.getY(i);
                  minU = Math.min(minU, u);
                  maxU = Math.max(maxU, u);
                  minV = Math.min(minV, v);
                  maxV = Math.max(maxV, v);
                }
                
                const uvWidth = maxU - minU;
                const uvHeight = maxV - minV;
                
                console.log('📐 Front_Pocket UV coordinates:', { 
                  minU, maxU, minV, maxV, uvWidth, uvHeight
                });
                
                // Calculate center of UV space
                const centerU = (minU + maxU) / 2;
                const centerV = (minV + maxV) / 2;
                
                // Scale factor - smaller values = bigger text (zoomed in)
                // Adjust this value to control text size
                const scaleFactor = 0.02; // 0.3 = text fills about 30% of mesh (appears 3x bigger)
                
                const repeatX = uvWidth * scaleFactor;
                const repeatY = uvHeight * scaleFactor;
                
                // Center the scaled texture
                const offsetX = centerU - (repeatX / 2);
                const offsetY = centerV - (repeatY / 2);
                
                textLogoTexture.wrapS = THREE.ClampToEdgeWrapping;
                textLogoTexture.wrapT = THREE.ClampToEdgeWrapping;
                textLogoTexture.repeat.set(repeatX, repeatY);
                textLogoTexture.offset.set(offsetX, offsetY);
                textLogoTexture.needsUpdate = true;
                
                console.log('✅ Text texture applied with scale:', {
                  repeat: { x: repeatX, y: repeatY },
                  offset: { x: offsetX, y: offsetY },
                  scaleFactor
                });
              } else {
                // Fallback if no UV attribute
                textLogoTexture.wrapS = THREE.ClampToEdgeWrapping;
                textLogoTexture.wrapT = THREE.ClampToEdgeWrapping;
                textLogoTexture.repeat.set(1, 1);
                textLogoTexture.offset.set(0, 0);
                textLogoTexture.needsUpdate = true;
                console.log('✅ Text texture applied (default scale)');
              }
            } else {
              console.warn('⚠️ No text texture available');
            }
            
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
            child.material.envMapIntensity = 0.5;
            child.material.transparent = true;
            child.material.alphaTest = 0.1; // Important for text transparency
            child.material.castShadow = true;
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            // Keep material color white to not tint the texture (color is in the texture itself)
            child.material.color = new THREE.Color(0xffffff);
          }
          // Other parts (tags, etc.) - use default body texture
          else {
            // Dispose old texture if exists
            if (child.material.map && child.material.map !== bodyTextureMap) {
              child.material.map.dispose();
            }
            
            // Apply body texture as default
            child.material.map = bodyTextureMap;
            
            // Configure texture repeating
            if (bodyTextureMap) {
              bodyTextureMap.repeat.set(1, 1);
              bodyTextureMap.wrapS = THREE.RepeatWrapping;
              bodyTextureMap.wrapT = THREE.RepeatWrapping;
            }
            
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
            child.material.envMapIntensity = 0.5;
            child.material.transparent = false;
            child.material.castShadow = true;
            child.material.side = THREE.DoubleSide;
            child.material.color = new THREE.Color(0xffffff);
            child.material.needsUpdate = true;
          }
          
          // Log mesh name for debugging (only once)
          if (!child.userData.logged) {
            child.userData.logged = true;
          }
        }
      }
    });
    
  }, [
    shirtModel,
    bodyTextureMap, 
    collarTextureMap, 
    buttonTextureMap,
    sleeveTextureMap,
    bodycolor,
    collarColor,
    buttonColor,
    config.bodytype,
    config.collartype,
    config.buttonstype,
    config.sleevetype,
    config.buttonmaterial,
    config.uploadedLogo,
    uploadedLogoTexture,
    logoAspectRatio,
    config.textLogo,
    textLogoTexture
  ]);
  
  // Smooth entrance animation using useFrame (optimized for mobile)
  useFrame(() => {
    if (!shirtGroupRef.current || !animationDataRef.current.isAnimating) return;
    
    const elapsed = Date.now() - animationDataRef.current.startTime;
    const duration = animationDataRef.current.duration;
    const rawProgress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function (easeOutCubic) - faster on mobile
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const progress = easeOut(rawProgress);
    
    // Scale animation (0.5 -> 1 for better mobile performance)
    const scale = 0.5 + (progress * 0.5);
    shirtGroupRef.current.scale.set(scale, scale, scale);
    
    // Slight rotation during entrance (reduced for mobile)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const rotationAmount = isMobile ? 0.15 : 0.3; // Less rotation on mobile
    const rotationOffset = (1 - progress) * Math.PI * rotationAmount;
    shirtGroupRef.current.rotation.y = rotationOffset;
    
    // Fade in effect using opacity
    shirtGroupRef.current.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.opacity = progress;
        child.material.transparent = rawProgress < 1;
      }
    });
    
    // Stop animation when complete
    if (rawProgress >= 1) {
      animationDataRef.current.isAnimating = false;
      shirtGroupRef.current.scale.set(1, 1, 1);
      shirtGroupRef.current.rotation.y = 0;
      
      // Ensure full opacity
      shirtGroupRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.opacity = 1;
          child.material.transparent = false;
          child.material.needsUpdate = true;
        }
      });
      
    }
  });

  // Example: Expose refs for external use (optional)
  // You can now access any part via meshRefs.current['MeshName']
  
  return (
    <group ref={shirtGroupRef} position={[0, -0.2, 0]}>
      <primitive object={shirtModel} />
    </group>
  );
}

// Export a hook to access mesh refs if needed
export function useShirtMeshRefs() {
  return {
    getAllMeshes: () => {
      // This would need to be implemented with context if you need external access
      return {};
    }
  };
}

// Preload the model and textures for better performance
useGLTF.preload('/model/shirt.glb');
useTexture.preload('/textures/button_1.jpg');
useTexture.preload('/textures/button_2.jpg');
useTexture.preload('/textures/button_3.jpg');
useTexture.preload('/textures/button_4.jpg');
useTexture.preload('/textures/default_1.jpg');
useTexture.preload('/textures/default_2.jpg');
useTexture.preload('/textures/default_3.jpg');
useTexture.preload('/textures/default_4.jpg');
useTexture.preload('/textures/default_5.jpg');
useTexture.preload('/textures/default_6.jpg');
useTexture.preload('/textures/default_7.jpg');
useTexture.preload('/textures/default_8.jpg');
useTexture.preload('/textures/default_9.jpg');
useTexture.preload('/textures/default_10.jpg');
useTexture.preload('/textures/default_11.jpg');
useTexture.preload('/textures/default_12.jpg');
useTexture.preload('/textures/default_13.jpg');
useTexture.preload('/textures/default_14.jpg');
useTexture.preload('/textures/default_15.jpg');
useTexture.preload('/textures/default_16.jpg');
useTexture.preload('/textures/default_17.jpg');
useTexture.preload('/textures/default_18.jpg');
useTexture.preload('/textures/default_19.jpg');
useTexture.preload('/textures/default_20.jpg');
useTexture.preload('/textures/material_1.jpg');
useTexture.preload('/textures/material_2.jpg');
useTexture.preload('/textures/material_3.jpg');
useTexture.preload('/textures/material_4.jpg');
useTexture.preload('/textures/material_5.jpg');
useTexture.preload('/textures/material_6.jpg');
useTexture.preload('/textures/material_7.jpg');




# 3D Watch Viewer Documentation

## Overview
The watch configurator uses React Three Fiber (R3F) to render an interactive 3D watch model that users can customize in real-time.

## Current Setup

### Components
1. **WatchViewer.tsx** - Main canvas component with camera, lights, and controls
2. **Watch3DModel.tsx** - The 3D watch geometry and materials

### Features
- ✅ Real-time color changes for watch face, hands, and materials
- ✅ Interactive orbit controls (drag to rotate, scroll to zoom)
- ✅ Professional lighting setup with shadows
- ✅ Metallic materials with reflections
- ✅ Auto-loading state with suspense

## How Colors Update

The color flow works like this:

1. User clicks radio option → Updates state in `page.tsx`
2. `useEffect` maps selection to color palettes
3. Colors passed to `WatchViewer` → `Watch3DModel`
4. Three.js materials update in real-time

### Color Palettes (in page.tsx)
```typescript
watchFaceColors = ['Blue', 'Purple', 'Red', 'Green', 'Dark'];
hourHandColors = ['Light Blue', 'Light Purple', 'Light Red', 'Light Green', 'Gray'];
materialColors = ['Silver', 'Gold', 'Bronze', 'Light', 'Dark'];
```

## Loading Custom 3D Models

If you have a custom watch GLTF/GLB model:

### 1. Add the model file
Place your `.glb` or `.gltf` file in `/public/models/watch.glb`

### 2. Update Watch3DModel.tsx
Replace the geometric shapes with a model loader:

```tsx
import { useGLTF } from '@react-three/drei';

export default function Watch3DModel({ watchFaceColor, hourHandColor, materialColor }: Props) {
  const { scene, nodes, materials } = useGLTF('/models/watch.glb');
  
  // Clone the scene to avoid modifying the cached version
  const watchModel = scene.clone();
  
  // Update materials by name (inspect your model to find part names)
  watchModel.traverse((child: any) => {
    if (child.isMesh) {
      if (child.name === 'WatchFace') {
        child.material.color.set(watchFaceColor);
      }
      if (child.name === 'HourHand') {
        child.material.color.set(hourHandColor);
      }
      if (child.name === 'Case' || child.name === 'Band') {
        child.material.color.set(materialColor);
        child.material.metalness = 0.9;
        child.material.roughness = 0.1;
      }
    }
  });
  
  return <primitive object={watchModel} />;
}

// Preload the model
useGLTF.preload('/models/watch.glb');
```

### 3. Model Requirements
- **Format**: GLTF 2.0 or GLB
- **Size**: Keep under 10MB for web performance
- **Naming**: Name parts in your 3D software (Blender/Maya):
  - `WatchFace` - The dial
  - `HourHand` - Hour hand
  - `MinuteHand` - Minute hand
  - `Case` - Watch case
  - `Band` - Watch band/strap
  - `Crown` - Side button

### 4. Tools for Creating/Editing 3D Models
- **Blender** (Free) - Export as GLTF 2.0
- **Sketchfab** - Download free watch models
- **gltf.report** - Optimize your model size

## Customization Options

### Camera Settings (WatchViewer.tsx)
```tsx
<PerspectiveCamera 
  position={[0, 3, 8]}  // Move camera position
  fov={50}              // Field of view
/>

<OrbitControls 
  minDistance={5}       // Closest zoom
  maxDistance={15}      // Farthest zoom
  autoRotate={true}     // Auto-rotation
/>
```

### Lighting
Adjust in WatchViewer.tsx:
- `ambientLight` - Overall brightness
- `directionalLight` - Main shadow-casting light
- `spotLight` - Accent highlights
- `pointLight` - Fill light

### Materials
In Watch3DModel.tsx:
- `metalness: 0-1` - How metallic (0=plastic, 1=metal)
- `roughness: 0-1` - How shiny (0=mirror, 1=matte)
- `color` - Base color

## Performance Tips
1. Keep polygon count under 50k triangles
2. Use compressed textures (JPG for colors, PNG for alpha)
3. Enable draco compression for GLTF files
4. Use `useGLTF.preload()` to load models early

## Troubleshooting

### Model not loading
- Check console for errors
- Verify file path is correct
- Ensure model is in `/public` folder

### Colors not changing
- Inspect model in Blender
- Check material names match your code
- Try logging `nodes` to see available meshes

### Performance issues
- Reduce polygon count
- Disable shadows temporarily
- Lower shadow map size
- Use simpler materials

## Next Steps
- Add texture support
- Implement band style variations
- Add watch size options
- Create material presets (leather, rubber, metal)
- Add animation for hands


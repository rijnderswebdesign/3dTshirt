import { create } from 'zustand';
import { items, STEPS } from './config';

interface PoloState {
  // UI State
  isAppLoading: boolean;
  loadingProgress: number;
  activeSection: number;
  activeItem: number;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  
  // Camera Control State
  autoRotate: boolean;
  resetCamera: boolean;
  
  // Computed Config
  config: {
    activeItem: number;
    activeSection: number;
    bodytype : number;
    collartype : number;
    buttonstype : number;
    sleevetype : number;
    bodymaterial : number;
    collarmaterial : number;
    buttonmaterial : number;
    slevematerial : number;
    bodycolor : number;
    collarcolor : number;
    buttoncolor : number;
    sleevecolor : number;
  };
  
  // Actions
  setIsAppLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setActiveSection: (section: number) => void;
  setActiveItem: (item: number) => void;
  setToastMessage: (message: string | null) => void;
  setToastType: (type: 'success' | 'error' | 'info') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  setAutoRotate: (rotate: boolean) => void;
  setResetCamera: (reset: boolean) => void;
  nextSection: () => void;
  nextItem: () => void;
  previousItem: () => void;
  previousSection: () => void;
  updateConfig: () => void;
  setBodyType: (type: number) => void;
  setCollarType: (type: number) => void;
  setButtonsType: (type: number) => void;
  setSleeveType: (type: number) => void;
  setBodyMaterial: (material: number) => void;
  setCollarMaterial: (material: number) => void;
  setButtonsMaterial: (material: number) => void;
  setSleeveMaterial: (material: number) => void;
  setBodyColor: (color: number) => void;
  setCollarColor: (color: number) => void;
  setButtonsColor: (color: number) => void;
  setSleeveColor: (color: number) => void;
}

export const usePoloStore = create<PoloState>((set, get) => ({
  // Initial State
  isAppLoading: true,
  loadingProgress: 0,
  activeSection: 0,
  activeItem: 0,
  toastMessage: null,
  toastType: 'success',
  
  autoRotate: false,
  resetCamera: false,
  
  config: {
    activeItem: 0,
    activeSection: 0,
    bodytype: 0,
    collartype: 0,
    buttonstype: 0,
    sleevetype: 0,
    bodymaterial: 0,
    collarmaterial: 0,
    buttonmaterial: 0,
    slevematerial: 0,
    bodycolor: 0,
    collarcolor: 0,
    buttoncolor: 0,
    sleevecolor: 0,
  },
  
  // Actions
  setIsAppLoading: (loading) => set({ isAppLoading: loading }),
  
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  setActiveSection: (section) => set({ activeSection: section }),
  setActiveItem: (item) => set({ activeItem: item }),
  
  setToastMessage: (message) => set({ toastMessage: message }),
  
  setToastType: (type) => set({ toastType: type }),
  
  showToast: (message, type = 'success') => {
    set({ toastMessage: message, toastType: type });
  },
  
  setAutoRotate: (rotate) => set({ autoRotate: rotate }),
  
  setResetCamera: (reset) => set({ resetCamera: reset }),
  setBodyType: (type) => set({ config: { ...get().config, bodytype: type }   }),
  setCollarType: (type) => set({ config: { ...get().config, collartype: type } }),
  setButtonsType: (type) => set({ config: { ...get().config, buttonstype: type } }),
  setSleeveType: (type) => set({ config: { ...get().config, sleevetype: type } }),
  setBodyMaterial: (material) => set({ config: { ...get().config, bodymaterial: material } }),
  setCollarMaterial: (material) => set({ config: { ...get().config, collarmaterial: material } }),
  setButtonsMaterial: (material) => set({ config: { ...get().config, buttonmaterial: material } }),
  setSleeveMaterial: (material) => set({ config: { ...get().config, slevematerial: material } }),
  setBodyColor: (color) => set({ config: { ...get().config, bodycolor: color } }),
  setCollarColor: (color) => set({ config: { ...get().config, collarcolor: color } }),
  setButtonsColor: (color) => set({ config: { ...get().config, buttoncolor: color } }),
  setSleeveColor: (color) => set({ config: { ...get().config, sleevecolor: color } }),
  // Navigation Actions
  nextSection: () => {
    const state = get();
    const maxSection = STEPS.length - 1;
    if (state.activeSection < maxSection) {
      set({ activeSection: state.activeSection + 1 });
    }
  },
  nextItem: () => {
    const state = get();
    const maxItem = items.length - 1;
    if (state.activeItem < maxItem) {
      set({ activeItem: state.activeItem + 1 });
    }
  },
  previousItem: () => {
    const state = get();
    if (state.activeItem > 0) {
      set({ activeItem: state.activeItem - 1 });
    }
  },
  previousSection: () => {
    const state = get();
    if (state.activeSection > 0) {
      set({ activeSection: state.activeSection - 1 });
    }
  },
  
  // Reset all configurations to default
  resetConfiguration: () => {
    set({
      activeSection: 0,
      activeItem: 0,
    });
    get().updateConfig();
  },
  
  // Save configuration as Image
  saveConfiguration: async () => {
    try {
      // Get the canvas element
      const canvasElement = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvasElement) {
        throw new Error('Canvas not found');
      }
      
      // Wait a bit to ensure canvas is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the canvas as high-quality PNG
      const imgData = canvasElement.toDataURL('image/png', 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `tshirt-design-${Date.now()}.png`;
      link.href = imgData;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success toast
      get().showToast('T-shirt design saved as image successfully!', 'success');
    } catch (error) {
      console.error('Image download error:', error);
      // Show error toast
      get().showToast('Failed to save T-shirt design image', 'error');
    }
  },
  
  // Update config based on current selections
  updateConfig: () => {
    const state = get();
    const colorStep = STEPS.find(step => step.title === 'Color');
    const colorChildren = colorStep?.children || [];
    
    // Get textures for each mesh part by finding the correct child by meshName
    set({
      config: {
        activeItem: state.activeItem,
        activeSection: state.activeSection,
        bodytype: state.config.bodytype,
        collartype: state.config.collartype,
        buttonstype: state.config.buttonstype,
        sleevetype: state.config.sleevetype,
        bodymaterial: state.config.bodymaterial,
        collarmaterial: state.config.collarmaterial,
        buttonmaterial: state.config.buttonmaterial,
        slevematerial: state.config.slevematerial,
        bodycolor: state.config.bodycolor,
        collarcolor: state.config.collarcolor,
        buttoncolor: state.config.buttoncolor,
        sleevecolor: state.config.sleevecolor,
      }
    });
  },
}));


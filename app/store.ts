import { create } from 'zustand';
import { STEPS } from './config';

interface WatchState {
  // UI State
  isAppLoading: boolean;
  loadingProgress: number;
  activeSection: number;
  showGuide: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  
  // Selection State
  colorOption: number;
  materialOption: number;
  typeOption: number;
  selectedMeshPart: number;
  
  // Texture State for each mesh part
  internalDisplayTexture: number;
  strapTexture: number;
  watchBaseTexture: number;
  
  // Camera Control State
  autoRotate: boolean;
  resetCamera: boolean;
  
  // Computed Config
  config: {
    internalDisplayTexture: string;
    internalDisplayMetalness: number;
    internalDisplayRoughness: number;
    strapTexture: string;
    strapMetalness: number;
    strapRoughness: number;
    watchBaseTexture: string;
    watchBaseMetalness: number;
    watchBaseRoughness: number;
    materialOption: number;
  };
  
  // Actions
  setIsAppLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setActiveSection: (section: number) => void;
  setShowGuide: (show: boolean) => void;
  setToastMessage: (message: string | null) => void;
  setToastType: (type: 'success' | 'error' | 'info') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  setColorOption: (option: number) => void;
  setMaterialOption: (option: number) => void;
  setTypeOption: (option: number) => void;
  setSelectedMeshPart: (part: number) => void;
  setInternalDisplayTexture: (texture: number) => void;
  setStrapTexture: (texture: number) => void;
  setWatchBaseTexture: (texture: number) => void;
  setAutoRotate: (rotate: boolean) => void;
  setResetCamera: (reset: boolean) => void;
  nextSection: () => void;
  previousSection: () => void;
  resetConfiguration: () => void;
  saveConfiguration: () => void;
  updateConfig: () => void;
}

export const useWatchStore = create<WatchState>((set, get) => ({
  // Initial State
  isAppLoading: true,
  loadingProgress: 0,
  activeSection: 0,
  showGuide: false,
  toastMessage: null,
  toastType: 'success',
  
  colorOption: 0,
  materialOption: 0,
  typeOption: 0,
  selectedMeshPart: 0,
  
  internalDisplayTexture: 0,
  strapTexture: 0,
  watchBaseTexture: 0,
  
  autoRotate: false,
  resetCamera: false,
  
  config: {
    internalDisplayTexture: 'blackinternal.jpg', // Default internal display texture
    internalDisplayMetalness: 0.0,
    internalDisplayRoughness: 1.0,
    strapTexture: 'greymetal.jpg',
    strapMetalness: 0.2,
    strapRoughness: 0.7,
    watchBaseTexture: 'iron.jpg', // Default watch base texture (black)
    watchBaseMetalness: 0.2,
    watchBaseRoughness: 0.7,
    materialOption: 0,
  },
  
  // Actions
  setIsAppLoading: (loading) => set({ isAppLoading: loading }),
  
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  setActiveSection: (section) => set({ activeSection: section }),
  
  setShowGuide: (show) => set({ showGuide: show }),
  
  setToastMessage: (message) => set({ toastMessage: message }),
  
  setToastType: (type) => set({ toastType: type }),
  
  showToast: (message, type = 'success') => {
    set({ toastMessage: message, toastType: type });
  },
  
  setColorOption: (option) => {
    set({ colorOption: option });
    get().updateConfig();
  },
  
  setMaterialOption: (option) => {
    set({ materialOption: option });
    get().updateConfig();
  },
  
  setTypeOption: (option) => set({ typeOption: option }),
  
  setSelectedMeshPart: (part) => set({ selectedMeshPart: part }),
  
  setInternalDisplayTexture: (texture) => {
    set({ internalDisplayTexture: texture });
    get().updateConfig();
  },
  
  setStrapTexture: (texture) => {
    set({ strapTexture: texture });
    get().updateConfig();
  },
  
  setWatchBaseTexture: (texture) => {
    set({ watchBaseTexture: texture });
    get().updateConfig();
  },
  
  setAutoRotate: (rotate) => set({ autoRotate: rotate }),
  
  setResetCamera: (reset) => set({ resetCamera: reset }),
  
  // Navigation Actions
  nextSection: () => {
    const state = get();
    const maxSection = STEPS.length - 1;
    if (state.activeSection < maxSection) {
      set({ activeSection: state.activeSection + 1 });
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
      colorOption: 0,
      materialOption: 0,
      typeOption: 0,
      selectedMeshPart: 0,
      internalDisplayTexture: 0,
      strapTexture: 0,
      watchBaseTexture: 0,
      activeSection: 0,
    });
    get().updateConfig();
  },
  
  // Save configuration as PDF with watch image
  saveConfiguration: async () => {
    try {
      const state = get();
      
      // Dynamically import libraries
      const jsPDF = (await import('jspdf')).default;
      
      // Get the canvas element
      const canvasElement = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvasElement) {
        throw new Error('Canvas not found');
      }
      
      // Wait a bit to ensure canvas is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the canvas directly (no need for html2canvas for WebGL canvas)
      const imgData = canvasElement.toDataURL('image/png', 1.0);
      
      // Get configuration details
      const TYPE_OPTIONS = STEPS.find(step => step.title === 'Type')?.children || [];
      const MATERIAL_OPTIONS = STEPS.find(step => step.title === 'Materials')?.children || [];
      const COLOR_OPTIONS = STEPS.find(step => step.title === 'Color')?.children || [];
      const STRAP_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Strap') as any || {};
      const INTERNAL_DISPLAY_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Internal_Display') as any || {};
      const WATCH_BASE_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Watch_Base') as any || {};
      
      // Calculate prices
      const BASE_PRICE = 1999.00;
      const typePrice = (TYPE_OPTIONS[state.typeOption] as any)?.price || 0;
      const materialPrice = (MATERIAL_OPTIONS[state.materialOption] as any)?.price || 0;
      const strapPrice = STRAP_OPTIONS.color?.[state.strapTexture]?.price || 0;
      const internalDisplayPrice = INTERNAL_DISPLAY_OPTIONS.color?.[state.internalDisplayTexture]?.price || 0;
      const watchBasePrice = WATCH_BASE_OPTIONS.color?.[state.watchBaseTexture]?.price || 0;
      const subtotal = BASE_PRICE + typePrice + materialPrice + strapPrice + internalDisplayPrice + watchBasePrice;
      const total = subtotal * 1.21;
      
      // Format price with Dutch locale
      const formatPriceNL = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      };
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add header background
      pdf.setFillColor(5, 31, 62);
      pdf.rect(0, 0, 210, 40, 'F');
      
      // Add title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Watch Configuration', 105, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${new Date().toLocaleDateString('nl-NL')}`, 105, 30, { align: 'center' });
      
      // Add watch image (captured earlier)
      if (imgData && imgData !== 'data:,') {
        pdf.addImage(imgData, 'PNG', 35, 50, 140, 100);
      }
      
      // Add configuration details
      let yPos = 160;
      
      // Configuration Section
      pdf.setFillColor(240, 240, 240);
      pdf.rect(15, yPos, 180, 10, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Configuration Details', 20, yPos + 7);
      
      yPos += 15;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Type
      pdf.setFont('helvetica', 'bold');
      pdf.text('Type:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text((TYPE_OPTIONS[state.typeOption] as any)?.title || 'N/A', 80, yPos);
      
      // Material
      yPos += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Material:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text((MATERIAL_OPTIONS[state.materialOption] as any)?.title || 'N/A', 80, yPos);
      
      // Strap Color
      yPos += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Strap Color:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(STRAP_OPTIONS.color?.[state.strapTexture]?.title || 'N/A', 80, yPos);
      
      // Internal Display Color
      yPos += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Display Color:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(INTERNAL_DISPLAY_OPTIONS.color?.[state.internalDisplayTexture]?.title || 'N/A', 80, yPos);
      
      // Watch Base Color
      yPos += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Base Color:', 20, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text(WATCH_BASE_OPTIONS.color?.[state.watchBaseTexture]?.title || 'N/A', 80, yPos);
      
      // Price Section
      yPos += 15;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(15, yPos, 180, 10, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Price Breakdown', 20, yPos + 7);
      
      yPos += 15;
      pdf.setFontSize(11);
      
      // Base Price
      pdf.setFont('helvetica', 'normal');
      pdf.text('Base Price:', 20, yPos);
      pdf.text(formatPriceNL(BASE_PRICE), 170, yPos, { align: 'right' });
      
      // Type Price
      if (typePrice > 0) {
        yPos += 6;
        pdf.text(`Type (${(TYPE_OPTIONS[state.typeOption] as any)?.title}):`, 20, yPos);
        pdf.text(formatPriceNL(typePrice), 170, yPos, { align: 'right' });
      }
      
      // Material Price
      if (materialPrice > 0) {
        yPos += 6;
        pdf.text(`Material (${(MATERIAL_OPTIONS[state.materialOption] as any)?.title}):`, 20, yPos);
        pdf.text(formatPriceNL(materialPrice), 170, yPos, { align: 'right' });
      }
      
      // Color Prices
      if (strapPrice > 0 || internalDisplayPrice > 0 || watchBasePrice > 0) {
        yPos += 6;
        pdf.text('Colors:', 20, yPos);
        if (strapPrice > 0) {
          yPos += 6;
          pdf.text(`  - Strap: ${STRAP_OPTIONS.color?.[state.strapTexture]?.title}`, 25, yPos);
          pdf.text(formatPriceNL(strapPrice), 170, yPos, { align: 'right' });
        }
        if (internalDisplayPrice > 0) {
          yPos += 6;
          pdf.text(`  - Display: ${INTERNAL_DISPLAY_OPTIONS.color?.[state.internalDisplayTexture]?.title}`, 25, yPos);
          pdf.text(formatPriceNL(internalDisplayPrice), 170, yPos, { align: 'right' });
        }
        if (watchBasePrice > 0) {
          yPos += 6;
          pdf.text(`  - Base: ${WATCH_BASE_OPTIONS.color?.[state.watchBaseTexture]?.title}`, 25, yPos);
          pdf.text(formatPriceNL(watchBasePrice), 170, yPos, { align: 'right' });
        }
      }
      
      // Subtotal
      yPos += 8;
      pdf.setLineWidth(0.5);
      pdf.line(20, yPos, 190, yPos);
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Subtotal (excl. BTW):', 20, yPos);
      pdf.text(formatPriceNL(subtotal), 170, yPos, { align: 'right' });
      
      // VAT
      yPos += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text('BTW (21%):', 20, yPos);
      pdf.text(formatPriceNL(subtotal * 0.21), 170, yPos, { align: 'right' });
      
      // Total
      yPos += 8;
      pdf.setLineWidth(1);
      pdf.line(20, yPos, 190, yPos);
      yPos += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 136, 204); // Cyan color
      pdf.text('Total (incl. BTW):', 20, yPos);
      pdf.text(formatPriceNL(total), 170, yPos, { align: 'right' });
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Generated by ARTIQ 3D Watch Configurator', 105, 285, { align: 'center' });
      
      // Save PDF
      pdf.save(`watch-configuration-${Date.now()}.pdf`);
      
      // Show success toast
      get().showToast('Configuration saved as PDF successfully!', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      // Show error toast
      get().showToast('Failed to save configuration as PDF', 'error');
    }
  },
  
  // Update config based on current selections
  updateConfig: () => {
    const state = get();
    const colorStep = STEPS.find(step => step.title === 'Color');
    const colorChildren = colorStep?.children || [];
    
    // Get textures for each mesh part by finding the correct child by meshName
    const strapChild = colorChildren.find((child: any) => child.meshName === 'Strap') as any;
    const internalDisplayChild = colorChildren.find((child: any) => child.meshName === 'Internal_Display') as any;
    const watchBaseChild = colorChildren.find((child: any) => child.meshName === 'Watch_Base') as any;
    
    const strapData = strapChild?.color?.[state.strapTexture];
    const internalDisplayData = internalDisplayChild?.color?.[state.internalDisplayTexture];
    const watchBaseData = watchBaseChild?.color?.[state.watchBaseTexture];
    
    set({
      config: {
        internalDisplayTexture: internalDisplayData?.texture || 'blackinternal.jpg',
        internalDisplayMetalness: internalDisplayData?.metalness || 0.0,
        internalDisplayRoughness: internalDisplayData?.roughness || 1.0,
        strapTexture: strapData?.texture || 'greymetal.jpg',
        strapMetalness: strapData?.metalness || 0.2,
        strapRoughness: strapData?.roughness || 0.7,
        watchBaseTexture: watchBaseData?.texture || 'iron.jpg',
        watchBaseMetalness: watchBaseData?.metalness || 0.2,
        watchBaseRoughness: watchBaseData?.roughness || 0.7,
        materialOption: state.materialOption,
      }
    });
  },
}));


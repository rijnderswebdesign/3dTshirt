'use client';

import { ChevronRight } from 'lucide-react';
import { items, STEPS, buttonColors } from '@/app/config';
import Image from 'next/image';
import { useMemo, useState, useRef, useEffect } from 'react';
import { usePoloStore } from '@/app/store';
import PricePanel from './PricePanel';
import ColorSlider from './ColorSlider';

export default function ConfigPanel() {
  // Get all state from Zustand store
  const {
    activeSection,
    config,
    previousSection,
    nextSection,
    activeItem,
    setBodyColor,
    setBodyMaterial,
    setBodyType,
    setCollarColor,
    setCollarMaterial,
    setCollarType,
    setSleeveColor,
    setSleeveMaterial,
    setSleeveType,
    setButtonsColor,
    setButtonsMaterial,
    setButtonsType,
    setbodycolorHex,
    setcollarcolorHex,
    setbuttoncolorHex,
    setsleevecolorHex,
  } = usePoloStore();
  
  const currentStep = activeSection;
  const totalSteps = STEPS.length;
  
  // Helper function to get the current selected value
  const getSelectedValue = () => {
    console.log('Active section:', activeSection, activeItem);
    if(activeSection === 0){
      if(activeItem === 0) return config.bodytype;
      if(activeItem === 1) return config.collartype;
      if(activeItem === 2) return config.buttonstype;
      if(activeItem === 3) return config.sleevetype;
    }else if(activeSection === 1){
      if(activeItem === 0) return config.bodymaterial;
      if(activeItem === 1) return config.collarmaterial;
      if(activeItem === 2) return config.buttonmaterial;
      if(activeItem === 3) return config.slevematerial;
    }else if(activeSection === 2){
      if(activeItem === 0) return config.bodycolor;
      if(activeItem === 1) return config.collarcolor;
      if(activeItem === 2) return config.buttoncolor;
      if(activeItem === 3) return config.sleevecolor;
    }
    return 0;
  };
  
  const handleChange = (index: number) => {
    if(activeSection === 0){
      if(activeItem === 0){ 
        setBodyType(index);
      }else if(activeItem === 1){
        setCollarType(index);
      }else if(activeItem === 2){
        setButtonsType(index);
      }else if(activeItem === 3){
        setSleeveType(index);
      }
    }else if(activeSection === 1){
      if(activeItem === 0){
        setBodyMaterial(index);
      }else if(activeItem === 1){
        setCollarMaterial(index);
      }else if(activeItem === 2){
        setButtonsMaterial(index);
      }else if(activeItem === 3){
        setSleeveMaterial(index);
      }
    }else if(activeSection === 2){
      if(activeItem === 0){
        setBodyColor(index);
      }else if(activeItem === 1){
        setCollarColor(index);
      }else if(activeItem === 2){
        setButtonsColor(index); 
      }else if(activeItem === 3){
        setSleeveColor(index);
      }
    }
  };

  const filteredButtonColors = useMemo(() => {
    return buttonColors.filter((color: any) => color.material === config.buttonmaterial);
  }, [config.buttonmaterial]);
  
  // Handle color slider change
  const handleColorChange = (hex: string) => {
    // Update button color hex in the store (since color slider is shown in section 2 - buttons)
    if(activeItem === 0){
      setbodycolorHex(hex);
      setBodyColor(-1);
    }else if(activeItem === 1){
      setcollarcolorHex(hex);
      setCollarColor(-1);
    }else if(activeItem === 2){
      setbuttoncolorHex(hex); 
      setButtonsColor(-1);
    }else if(activeItem === 3){
      setsleevecolorHex(hex);
      setSleeveColor(-1);
    }
  };
  
  // Calculate total price (simplified for demo)
  const basePrice = 699.00;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto custom-scrollbar">
      {/* Main Content Area */}
      <div className="flex-1  p-6 mx-2 lg:mx-0 lg:py-8 px-0 ">
        {/* Header */}
        <div className='text-center'>
          <h1 className="text-2xl lg:text-3xl lg:text-5xl font-bold text-gray-900 mb-3">Polo T-shirt</h1>
        </div>

        {/* Select Fabric Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div> 
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-1">{STEPS[activeSection].subtitle}</h2>
          </div>
          {/* Color Slider */}
          {activeSection == 2 && (<div style={{marginBottom:'30px'}}>
            <ColorSlider onColorChange={handleColorChange} defaultValue={0} />
          </div>)}
          
          <div className="grid grid-cols-3 justify-items-center gap-y-2">
            {activeItem == 2 && activeSection == 2? filteredButtonColors.map((body: any, index: number) => (
                <div key={index} 
                onClick={() => handleChange(index)}
                className={`flex items-center justify-center border rounded-xl p-1 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ${getSelectedValue() === index ? 'border-red-500 border-2' : 'border-gray-200'}`}>
                  <Image src={`/textures/${body.texture}`} alt={body.title} width={100} height={100} className="lg:w-[100px] lg:h-[100px] w-[80px] h-[80px] object-cover rounded-lg" />
                </div>    
              )):(STEPS[activeSection]?.children?.[activeItem] as any[] || []).map((body: any, index: number) => (
                <div key={index} onClick={() => handleChange(index)} className={`flex items-center justify-center border rounded-xl p-1 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ${getSelectedValue() === index ? 'border-red-500 border-2' : 'border-gray-200'}`}>
                  <Image src={`/textures/${body.texture}`} alt={body.title} width={100} height={100} className="lg:w-[100px] lg:h-[100px] w-[80px] h-[80px] object-cover rounded-lg" />
                </div>    
              ))}  
          </div>  
        </div>
      </div> 
      {/* Uploaded Logo Preview */}
      {activeSection === 0 && activeItem === 0 && config.uploadedLogo && (
        <div className="p-6 mx-2 lg:mx-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl lg:text-xl font-semibold text-gray-900 mb-4">Geüpload Logo</h2>
            <div className="space-y-4 flex flex-col items-center justify-center">
              <div className="relative lg:w-[150px] lg:h-[150px] w-[100px] h-[100px] items-center justify-center bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={config.uploadedLogo} 
                  alt="Uploaded logo" 
                  width={100}
                  height={100}
                  className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px] object-contain"
                />
              </div>
              <button
                onClick={() => usePoloStore.getState().setUploadedLogo(null)}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Verwijder Logo
              </button>
            </div>
          </div>
        </div>
      )}
      <PricePanel />

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-[70px] w-[100vw] lg:w-[100%] lg:bottom-0 lg:relative bg-red-600 text-white p-4 flex items-center justify-between">
        <button 
          onClick={previousSection}
          disabled={currentStep === 0}
          className="uppercase font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          TERUG
        </button>
        
        <div className="text-sm font-medium">
          {currentStep + 1} VAN {totalSteps} STAPPEN
        </div>
        
        <button 
          onClick={nextSection}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center gap-2 uppercase font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {STEPS[currentStep].title}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444,rgb(190, 84, 84));
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg,rgb(214, 105, 105),rgb(161, 63, 63));
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color:rgba(241, 159, 159, 0.83) #f1f1f1;
        }
      `}</style>
    </div>
  );
}

       
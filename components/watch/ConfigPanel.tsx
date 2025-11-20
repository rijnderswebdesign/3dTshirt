'use client';

import { ChevronRight } from 'lucide-react';
import { items, STEPS, buttonColors } from '@/app/config';
import Image from 'next/image';
import { useMemo } from 'react';
import { usePoloStore } from '@/app/store';
import PricePanel from './PricePanel';

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
  } = usePoloStore();
  
  const currentStep = activeSection;
  const totalSteps = STEPS.length;
  
  // Helper function to get the current selected value
  const getSelectedValue = () => {
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
      if(activeItem === 0) return config.buttonstype;
      if(activeItem === 1) return config.buttonmaterial;
      if(activeItem === 2) return config.buttoncolor;
    }else if(activeSection === 3){
      if(activeItem === 0) return config.sleevetype;
      if(activeItem === 1) return config.slevematerial;
      if(activeItem === 2) return config.sleevecolor;
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
        setButtonsType(index);
      }else if(activeItem === 1){
        setButtonsMaterial(index);
      }else if(activeItem === 2){
        setButtonsColor(index);
      } 
    }else if(activeSection === 3){
      if(activeItem === 0){
        setSleeveType(index);
      }else if(activeItem === 1){
        setSleeveMaterial(index);
      }else if(activeItem === 2){
        setSleeveColor(index);
      }
    }
  };

  const filteredButtonColors = useMemo(() => {
    return buttonColors.filter((color: any) => color.material === config.buttonmaterial);
  }, [config.buttonmaterial]);
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
      <PricePanel />

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-[70px] w-[100vw] lg:w-[100%] lg:bottom-0 lg:relative bg-red-600 text-white p-4 flex items-center justify-between">
        <button 
          onClick={previousSection}
          disabled={currentStep === 0}
          className="uppercase font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          BACK
        </button>
        
        <div className="text-sm font-medium">
          {currentStep + 1} OF {totalSteps} STEPS
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

       
'use client';

import { ChevronRight } from 'lucide-react';
import { STEPS } from '@/app/config';
import Image from 'next/image';
import { useWatchStore } from '@/app/store';

export default function ConfigPanel() {
  // Get all state from Zustand store
  const {
    activeSection,
    colorOption,
    internalDisplayTexture,
    strapTexture,
    watchBaseTexture,
    setActiveSection,
    setInternalDisplayTexture,
    setStrapTexture,
    setWatchBaseTexture,
    previousSection,
    nextSection,
  } = useWatchStore();
  
  const currentStep = activeSection;
  const totalSteps = STEPS.length;
  
  const handleChangeColor = (index: number) => {
    // Update the appropriate texture based on current color option (mesh part)
    if(colorOption === 1){
      setInternalDisplayTexture(index);
    }else if(colorOption === 0){
      setStrapTexture(index);
    }else if(colorOption === 2){
      setWatchBaseTexture(index);
    }
  };

  // Calculate total price (simplified for demo)
  const basePrice = 699.00;

  return (
    <div className="h-full flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:py-8 px-0 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-3">Polo T-shirt</h1>
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-md">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          </p>
        </div>

        {/* Select Fabric Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-1">Select fabric</h2>
            <p className="text-gray-500 text-sm">Lorem Ipsum is simply dummy text.</p>
          </div>

          {/* Color Grid */}
          {currentStep === 2 && (STEPS[2]?.children?.[colorOption] as any)?.color && (
            <div className="grid grid-cols-3 gap-4">
              {((STEPS[currentStep].children[colorOption] as any)?.color || []).slice(0, 6).map((colorOpt: any, index: number) => {
                const isSelected = (colorOption === 1 && internalDisplayTexture === index) || 
                                  (colorOption === 0 && strapTexture === index) || 
                                  (colorOption === 2 && watchBaseTexture === index);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleChangeColor(index)}
                    className={`relative aspect-square rounded-xl border-2 transition-all duration-200 overflow-hidden group
                      ${isSelected 
                        ? 'border-gray-900 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-400 hover:scale-102'
                      }`}
                  >
                    <Image 
                      src={`/textures/${colorOpt.texture}`} 
                      alt={colorOpt.title} 
                      width={150} 
                      height={150} 
                      className='w-full h-full object-cover'
                    />
                    {/* Show hex color on first item as in the design */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                        F7E7F7
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total price</span>
            <span className="text-3xl font-bold text-gray-900">${basePrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-red-600 text-white p-4 flex items-center justify-between">
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
          COLOR
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

       
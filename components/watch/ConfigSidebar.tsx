'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { items } from '@/app/config';
import Image from 'next/image';
import { usePoloStore } from '@/app/store';

export default function ConfigSidebar() {
  // Get state from Zustand store
  const { activeItem, setActiveItem } = usePoloStore();
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const handleStepChange = (stepId: number) => {
    if (activeItem === stepId) {
      // Toggle panel if clicking the same section
      setShowMobileOptions(!showMobileOptions);
    } else {
      // Switch section and show panel
      setActiveItem(stepId);
      setShowMobileOptions(true);
    }
  };

  const handleClosePanel = () => {
    setShowMobileOptions(false);
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 lg:top-[24vh] lg:right-0 lg:left-auto lg:translate-x-0 flex justify-center gap-4 z-50">
      <div className="flex lg:flex-col ">
        {items.map((step, index) => (
          <div 
            key={index}  
            onClick={() => setActiveItem(index)} 
            className={`relative flex flex-col items-center py-2 rounded-xl cursor-pointer transition-all select-none`}
          >
              <div className={`w-12 h-12  flex items-center justify-center transition-all ${activeItem === index ? 'bg-[#D8162E]' : 'bg-white/10'}`}>
                <Image 
                  src={`/images/${step.icon}`} 
                  alt={step.title} 
                  width={32} 
                  height={32}
                  style={{
                    filter: activeItem === index 
                      ? 'brightness(0) saturate(100%) invert(100%)'
                      : 'brightness(0) saturate(100%) invert(0%)'
                  }}
                  className="transition-all duration-300 pointer-events-none"
                />
              </div>
          </div>
        ))}
      </div>
    </div>

    
  );
}

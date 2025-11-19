'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { STEPS } from '@/app/config';
import Image from 'next/image';
import RadioOptions from './RadioOptions';
import { useWatchStore } from '@/app/store';

export default function ConfigSidebar() {
  // Get state from Zustand store
  const { activeSection, setActiveSection } = useWatchStore();
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const handleStepChange = (stepId: number) => {
    if (activeSection === stepId) {
      // Toggle panel if clicking the same section
      setShowMobileOptions(!showMobileOptions);
    } else {
      // Switch section and show panel
      setActiveSection(stepId);
      setShowMobileOptions(true);
    }
  };

  const handleClosePanel = () => {
    setShowMobileOptions(false);
  };

  return (
    <div className="absolute top-[24vh] right-0 flex flex-col gap-4 z-50">
      <div className="flex flex-col">
        {STEPS.map((step, index) => (
          <div 
            key={index}  
            onClick={() => handleStepChange(index)} 
            className={`relative flex flex-col items-center py-2 rounded-xl cursor-pointer transition-all select-none`}
          >
              <div className={`w-12 h-12  flex items-center justify-center transition-all ${activeSection === index ? 'bg-[#D8162E]' : 'bg-white/10'}`}>
                <Image 
                  src={`/images/${step.icon}`} 
                  alt={step.title} 
                  width={32} 
                  height={32}
                  style={{
                    filter: activeSection === index 
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

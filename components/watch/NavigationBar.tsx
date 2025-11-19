'use client';

import { NavTools, STEPS } from '@/app/config';
import { useWatchStore } from '@/app/store';
import Image from 'next/image';

export default function NavigationBar() {
  const {
    activeSection,
    previousSection,
    nextSection,
    autoRotate,
    setAutoRotate,
    resetConfiguration,
    saveConfiguration,
    setShowGuide,
    setResetCamera,
  } = useWatchStore();

  const totalSteps = STEPS.length;
  const isFirstStep = activeSection === 0;
  const isLastStep = activeSection === totalSteps - 1;

  // const handleButtonClick = (toolId: number) => {
  //   switch (toolId) {
  //     case 1: // Previous
  //       previousSection();
  //       break;
  //     case 2: // Next
  //       nextSection();
  //       break;
  //     case 4: // Rotate
  //       setAutoRotate(!autoRotate);
  //       break;
  //     case 3: // Reset
  //       const confirmReset = window.confirm('Are you sure you want to reset all configurations to default?');
  //       if (confirmReset) {
  //         resetConfiguration();
  //         setResetCamera(true);
  //         // Reset the camera flag after a brief moment
  //         setTimeout(() => setResetCamera(false), 100);
  //       }
  //       break;
  //     case 5: // Save
  //       saveConfiguration();
  //       break;
  //     case 6: // Entry Guide
  //       setShowGuide(true);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  return (
    <div className=" fixed lg:absolute w-full lg:w-fit bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center border-t border-black/10 backdrop-blur-md p-2 gap-2 lg:p-6 lg:gap-10 pl-9">
      <div className="flex justify-center items-center border bg-[#F4E4E4] border-white/10 rounded-full">
        {NavTools.map((tool, index) => {
          if (index >= 2) return null;
          
          // Check if button should be disabled
          const isDisabled = (tool.id === 1 && isFirstStep) || (tool.id === 2 && isLastStep);
          
          return (
            <button
              key={tool.id}
              onClick={() => {
                if (!isDisabled) {
                  if (tool.id === 1) previousSection();
                  else if (tool.id === 2) nextSection();
                }
              }}
              disabled={isDisabled}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 group px-2 ${
                isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              }`}
              title={tool.title}
            >
              <Image 
                src={`/images/${tool.icon}`} 
                alt={tool.title} 
                width={32} 
                height={32}
                style={{
                  filter: isDisabled 
                    ? 'brightness(0) saturate(0%) invert(60%)' 
                    : 'brightness(0) saturate(20%) invert(20%)'
                }}
                className={`transition-all duration-300 ${!isDisabled && 'group-hover:scale-105'}`}
              />
            </button>
          );
        })}
      </div>
      {NavTools.map((tool, index) => (
        index >= 2 && (
          <button
            key={tool.id}
            // onClick={() => handleButtonClick(tool.id)}
            className={`flex items-center justify-center transition-all duration-300 group `}
            title={tool.title}
          >
            <Image 
              src={`/images/${tool.icon}`} 
              alt={tool.title} 
              width={36} 
              height={36}
              style={{
                filter: 'brightness(0) saturate(10%) invert(10%)'
              }}
              className={`w-20 h-8 transition-all duration-300  hover:scale-105`}
            />
          </button>
        )
      ))}
    </div>  
  );
}

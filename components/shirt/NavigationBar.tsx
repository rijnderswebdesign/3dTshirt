'use client';

import { NavTools, STEPS } from '@/app/config';
import { usePoloStore } from '@/app/store';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function NavigationBar() {
  const {
    activeSection,
    previousSection,
    nextSection,
    autoRotate,
    setAutoRotate,
    setUploadedLogo,
    setIsTextModalOpen,
    saveModelAsImage,
  } = usePoloStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = STEPS.length;
  const isFirstStep = activeSection === 0;
  const isLastStep = activeSection === totalSteps - 1;

  const handleToolClick = (toolId: number) => {
    switch (toolId) {
      case 3: // Upload
        fileInputRef.current?.click();
        break;
      case 4: // Text
        setIsTextModalOpen(true);
        break;
      case 5: // Save as Image
        saveModelAsImage();
        break;
      case 6: // Rotate
        setAutoRotate(!autoRotate);
        break;
      default:
        break;
    }
  };

  const resizeImageToFit = (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Target size in pixels (using higher resolution for quality)
        // 0.212 units at ~2400 dpi = ~512 pixels for good quality
        const MAX_SIZE = 512;
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let targetWidth: number;
        let targetHeight: number;
        
        // Fit image within square while maintaining aspect ratio
        if (aspectRatio > 1) {
          // Landscape
          targetWidth = MAX_SIZE;
          targetHeight = MAX_SIZE / aspectRatio;
        } else {
          // Portrait or square
          targetHeight = MAX_SIZE;
          targetWidth = MAX_SIZE * aspectRatio;
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw resized image with high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Convert to data URL
        const resizedDataUrl = canvas.toDataURL('image/png', 0.95);
        resolve(resizedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageDataUrl;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        try {
          // Resize image to fit 0.212 x 0.212 units mesh while maintaining aspect ratio
          const resizedImageUrl = await resizeImageToFit(imageUrl);
          setUploadedLogo(resizedImageUrl);
        } catch (error) {
          console.error('Error resizing image:', error);
          // Fallback to original if resize fails
          setUploadedLogo(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className=" fixed  lg:absolute w-full lg:w-fit bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center border-t border-black/10 backdrop-blur-md p-2 gap-2 lg:p-6 lg:gap-10 pl-9">
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
            onClick={() => handleToolClick(tool.id)}
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
      
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      
    
    </div>  
  );
}

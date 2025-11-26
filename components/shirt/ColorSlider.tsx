'use client';

import { useState, useCallback } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface ColorSliderProps {
  onColorChange?: (hex: string) => void;
  defaultValue?: number;
}

export default function ColorSlider({ onColorChange, defaultValue = 0 }: ColorSliderProps) {
  const [hue, setHue] = useState(defaultValue);

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const getCurrentColor = useCallback((hueValue: number) => {
    return hslToHex(hueValue, 100, 50);
  }, []);

  const handleValueChange = (value: number[]) => {
    const newHue = value[0];
    setHue(newHue);
    const hexColor = getCurrentColor(newHue);
    onColorChange?.(hexColor);
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        {/* Color Gradient Track */}
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-8"
          value={[hue]}
          onValueChange={handleValueChange}
          max={360}
          step={1}
          aria-label="Kleur selecteren"
        >
          <Slider.Track className="relative grow rounded-full h-8 shadow-md overflow-hidden">
            {/* Rainbow Gradient Background */}
            <div 
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
              }}
            />
            <Slider.Range className="absolute h-full" />
          </Slider.Track>
          
          {/* Slider Thumb */}
          <Slider.Thumb 
            className="block w-8 h-10 bg-white border-4 border-gray-800 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 cursor-grab active:cursor-grabbing transition-all"
            style={{
              backgroundColor: getCurrentColor(hue),
              borderColor: '#fff',
              boxShadow: '0 0 0 3px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2)'
            }}
          />
        </Slider.Root>
      </div>
      
      {/* Color Display */}
      {/* <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: getCurrentColor(hue) }}
          />
          <div>
            <p className="text-xs text-gray-500 font-medium">Geselecteerde kleur</p>
            <p className="text-sm font-bold text-gray-900">{getCurrentColor(hue)}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}


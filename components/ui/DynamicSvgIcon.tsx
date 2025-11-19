'use client';

import { useEffect, useState } from 'react';

interface DynamicSvgIconProps {
  src: string;
  className?: string;
  color?: string;
  size?: number;
}

export const DynamicSvgIcon: React.FC<DynamicSvgIconProps> = ({
  src,
  className = '',
  color = 'currentColor',
  size = 50,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load SVG: ${res.status}`);
        }
        return res.text();
      })
      .then((svg) => {
        // More comprehensive color replacement
        let coloredSvg = svg
          // Replace fill attributes
          .replace(/fill="(?!none)[^"]*"/gi, `fill="${color}"`)
          .replace(/fill:(?!none)[^;"]*/gi, `fill:${color}`)
          // Replace stroke attributes
          .replace(/stroke="(?!none)[^"]*"/gi, `stroke="${color}"`)
          .replace(/stroke:(?!none)[^;"]*/gi, `stroke:${color}`)
          // Add size attributes
          .replace(/<svg([^>]*)>/, `<svg$1 width="${size}" height="${size}">`);
        
        // If no fill or stroke found, add fill to the svg tag
        if (!coloredSvg.includes('fill=') && !coloredSvg.includes('fill:')) {
          coloredSvg = coloredSvg.replace(/<svg/, `<svg fill="${color}"`);
        }
        
        setSvgContent(coloredSvg);
        setError('');
      })
      .catch((err) => {
        console.error('Error loading SVG:', err);
        setError(err.message);
      });
  }, [src, color, size]);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="text-red-500 text-xs">⚠</div>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="animate-pulse bg-gray-600 rounded" style={{ width: size * 0.8, height: size * 0.8 }} />
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

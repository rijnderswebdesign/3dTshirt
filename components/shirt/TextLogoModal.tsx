'use client';

import { useState, useEffect } from 'react';
import { usePoloStore } from '@/app/store';

interface TextLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TextLogoModal({ isOpen, onClose }: TextLogoModalProps) {
  const { config, setTextLogo } = usePoloStore();
  const [text, setText] = useState(config.textLogo?.text || '');
  const [color, setColor] = useState(config.textLogo?.color || '#000000');
  const [fontSize, setFontSize] = useState(config.textLogo?.fontSize || 48);
  const [error, setError] = useState<string>('');
  
  const MAX_CHARS_PER_LINE = 7;
  const MAX_LINES = 3;

  // Validate text input
  const validateText = (inputText: string): { isValid: boolean; error: string } => {
    const lines = inputText.split('\n');
    
    // Check max lines
    if (lines.length > MAX_LINES) {
      return { isValid: false, error: `Maximum ${MAX_LINES} lines allowed` };
    }
    
    // Check each line length
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > MAX_CHARS_PER_LINE) {
        return { isValid: false, error: `Line ${i + 1}: Maximum ${MAX_CHARS_PER_LINE} characters per line` };
      }
    }
    
    return { isValid: true, error: '' };
  };

  // Handle text change with validation
  const handleTextChange = (newText: string) => {
    const validation = validateText(newText);
    
    if (validation.isValid) {
      setText(newText);
      setError('');
    } else {
      // Don't update text if invalid, just show error
      setError(validation.error);
    }
  };

  // Generate canvas texture from text
  const generateTextTexture = (text: string, color: string, fontSize: number): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Could not get canvas context');
      return '';
    }

    // Set canvas size
    canvas.width = 512;
    canvas.height = 512;

    // Fill background with transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    console.log('🎨 Generating text texture:', { text, color, fontSize, canvasSize: `${canvas.width}x${canvas.height}` });

    // Split by actual line breaks first (preserve user's Enter key presses)
    const userLines = text.split('\n');
    const lines: string[] = [];
    const maxWidth = canvas.width - 40;

    // Process each user line for word wrapping if needed
    userLines.forEach(userLine => {
      if (!userLine.trim()) {
        // Empty line - keep it for spacing
        lines.push('');
        return;
      }

      const words = userLine.split(' ');
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
    });

    console.log('📝 Text lines (with line breaks):', lines);

    // Draw text centered
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      // Draw line even if empty (for spacing)
      if (line.trim()) {
        ctx.fillText(line, canvas.width / 2, y);
      }
      console.log(`Drawing line ${index}: "${line}" at y=${y}`);
    });

    const dataUrl = canvas.toDataURL('image/png');
    console.log('✅ Canvas generated, data URL length:', dataUrl.length);
    
    // Optional: Add canvas to page temporarily for debugging
    // document.body.appendChild(canvas);
    // canvas.style.position = 'fixed';
    // canvas.style.top = '10px';
    // canvas.style.right = '10px';
    // canvas.style.zIndex = '9999';
    // canvas.style.border = '2px solid red';

    return dataUrl;
  };

  const handleSave = () => {
    if (!text.trim()) {
      setTextLogo(null);
      onClose();
      return;
    }

    // Final validation before saving
    const validation = validateText(text);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const textureUrl = generateTextTexture(text, color, fontSize);
    console.log('Text logo saved:', { text, color, fontSize, hasTexture: !!textureUrl });
    setTextLogo({
      text,
      color,
      fontSize,
      textureUrl
    });
    onClose();
  };

  const handleRemove = () => {
    setTextLogo(null);
    setText('');
    setError('');
    onClose();
  };

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Add Text Logo</h2>
        
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your text... (max 7 chars per line, 3 lines)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={MAX_CHARS_PER_LINE * MAX_LINES + (MAX_LINES - 1)} // Account for line breaks
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {text.split('\n').map((line, idx) => (
                <div key={idx} className={line.length > MAX_CHARS_PER_LINE ? 'text-red-500' : ''}>
                  Line {idx + 1}: {line.length}/{MAX_CHARS_PER_LINE} characters
                </div>
              ))}
              <div className={text.split('\n').length > MAX_LINES ? 'text-red-500' : 'text-blue-600'}>
                Total: {text.split('\n').length}/{MAX_LINES} lines
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Font Size Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="24"
              max="48"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Preview */}
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div 
              className="text-center font-bold whitespace-pre-wrap"
              style={{ color, fontSize: `${fontSize / 2}px` }}
            >
              {text || 'Your text here'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleRemove}
            className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


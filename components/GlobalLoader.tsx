'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GlobalLoaderProps {
  onComplete?: () => void;
  actualProgress?: number;
}

export default function GlobalLoader({ onComplete, actualProgress }: GlobalLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Use actual progress if provided, otherwise simulate
    if (actualProgress !== undefined) {
      setProgress(actualProgress);
      
      // Complete when we reach 100%
      if (actualProgress >= 100 && onComplete) {
        setTimeout(() => {
          onComplete();
        }, 500); // Small delay to show 100%
      }
    } else {
      // Fallback: simulate loading progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (onComplete) {
              setTimeout(onComplete, 500);
            }
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [actualProgress, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-300/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="relative w-48 h-12 animate-fade-in">
          <Image 
            src="/images/logo.png" 
            alt="ARTIQ 3D" 
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* T-Shirt Animation */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 animate-ping-slow">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-red-300 via-pink-300 to-red-200 opacity-40 blur-xl"></div>
          </div>

          {/* T-Shirt Icon */}
          <div className="relative w-32 h-32 animate-bounce-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl shadow-red-500/30 transform rotate-3 animate-wiggle"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Simplified T-Shirt SVG */}
              <svg className="w-20 h-20 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 2L21 7V10L19 12L17 10V7H16L16 22H8V7H7V10L5 12L3 10V7L8 2H10V4H14V2H16Z" />
              </svg>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(3deg); }
          25% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 15px) scale(1.05); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2.5s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


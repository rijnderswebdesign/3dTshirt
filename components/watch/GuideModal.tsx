'use client';

import { useWatchStore } from '@/app/store';
import { STEPS } from '@/app/config';

export default function GuideModal() {
  const { showGuide, setShowGuide } = useWatchStore();

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-pink-50 to-white border-b border-gray-200 p-6 flex items-center justify-between backdrop-blur-md rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">T-Shirt Configurator Guide</h2>
          </div>
          <button
            onClick={() => setShowGuide(false)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-red-600 mb-3">Welcome to the 3D T-Shirt Configurator!</h3>
            <p className="text-gray-700 leading-relaxed">
              Customize your polo T-shirt in real-time with our interactive 3D configurator. 
              Choose fabrics, colors, and view your design from every angle.
            </p>
          </div>

          {/* View Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">1</span>
              View Options
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Front View</h4>
                    <p className="text-gray-600 text-sm">View the front design of your T-shirt</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Back View</h4>
                    <p className="text-gray-600 text-sm">View the back side of your T-shirt</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Zoom</h4>
                    <p className="text-gray-600 text-sm">Zoom in for detailed inspection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">2</span>
              Navigation Controls
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">BACK</span>
                </div>
                <p className="text-gray-600 text-xs">Go to previous step</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">NEXT</span>
                </div>
                <p className="text-gray-600 text-xs">Proceed to next step</p>
              </div>
            </div>
          </div>

          {/* 3D Controls */}
          <div className="bg-gradient-to-br from-pink-50 to-red-50 border border-red-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">3</span>
              3D Viewer Controls
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-red-600 font-semibold min-w-[100px]">Rotate:</span>
                <span>Click and drag on the T-shirt model</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 font-semibold min-w-[100px]">Zoom:</span>
                <span>Scroll wheel or pinch gesture</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 font-semibold min-w-[100px]">Reset:</span>
                <span>Use navigation buttons to reset view</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              💡 Pro Tips
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Select from multiple fabric options to find your perfect style</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Price updates automatically as you customize</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Use front and back view to see all design details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Navigate through steps to complete your customization</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 backdrop-blur-md rounded-b-3xl">
          <button
            onClick={() => setShowGuide(false)}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02]"
          >
            Got it! Let's Start Customizing
          </button>
        </div>
      </div>
    </div>
  );
}


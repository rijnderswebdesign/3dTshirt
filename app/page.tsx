'use client';

import { useEffect } from 'react';
import WatchViewer from '@/components/watch/WatchViewer';
import ConfigSidebar from '@/components/watch/ConfigSidebar';
import ConfigPanel from '@/components/watch/ConfigPanel';
import PricePanel from '@/components/watch/PricePanel';
import NavigationBar from '@/components/watch/NavigationBar';
import ToastNotification from '@/components/ToastNotification';
import GlobalLoader from '@/components/GlobalLoader';
import Image from 'next/image';
import { useGLTF } from '@react-three/drei';
import { usePoloStore } from './store';

export default function Home() {
  // Use Zustand store
  const {
    isAppLoading,
    loadingProgress,
    config,
    toastMessage,
    toastType,
    setIsAppLoading,
    setLoadingProgress,
    setActiveSection,
    setToastMessage,
    updateConfig,
  } = usePoloStore();

  // Initialize config on mount
  useEffect(() => {
    updateConfig();
  }, [updateConfig]);

  // Preload the 3D model and track progress
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    
    // Start preloading the model
    const startTime = Date.now();
    const loadTime = 2000; // 2 seconds estimated load time
    
    // Simulate smooth progress over time
    const startProgress = () => {
      const updateInterval = 50; // Update every 50ms
      const totalSteps = loadTime / updateInterval;
      let step = 0;
      
      progressInterval = setInterval(() => {
        step++;
        const progress = Math.min((step / totalSteps) * 100, 99); // Cap at 99%
        setLoadingProgress(progress);
        
        if (progress >= 99) {
          clearInterval(progressInterval);
        }
      }, updateInterval);
    };
    
    // Preload the model
    useGLTF.preload('/model/watch.glb');
    startProgress();
    
    // Complete loading after estimated time
    timeoutId = setTimeout(() => {
      setLoadingProgress(100);
    }, loadTime);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
    };
  }, [setLoadingProgress]);


  // Show global loader while app is initializing
  if (isAppLoading) {
    return (
      <GlobalLoader 
        actualProgress={loadingProgress}
        onComplete={() => setIsAppLoading(false)}
      />
    );
  }

  return (
    <div className="h-[100vh] overflow-hidden bg-[#FFF2F2] text-black">
     
          <div className="flex flex-col lg:flex-row ">
            <div className="w-[45vw] h-[8vh] lg:h-full  flex lg:justify-end py-3 lg:w-[23vw] flex  items-start gap-[200px] lg:pt-16 lg:pb-8 px-4 lg:px-2 lg:mr-4">
                <Image src="/images/logo.png" alt="logo" width={256} height={40} />
            </div>
            <div className="lg:w-[77vw] lg:h-[100vh] relative ">
              <WatchViewer />
              <NavigationBar />
              <ConfigSidebar/>
            </div>

            <div className="w-[100vw] h-[32vh] lg:w-[35vw] lg:h-[100vh] space-y-6 lg:pt-16 pb-8 lg:px-4 lg:px-0 overflow-y-auto">
              <ConfigPanel/>
            </div>
        </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

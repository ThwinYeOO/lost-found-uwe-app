import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkIsMobileDevice, shouldUseMobileAppView } from '../utils/mobileDetection';

interface MobileAppContextType {
  isMobileApp: boolean;
  isMobileDevice: boolean;
  showMobileApp: boolean;
  setShowMobileApp: (show: boolean) => void;
  toggleMobileApp: () => void;
}

const MobileAppContext = createContext<MobileAppContextType | undefined>(undefined);

export const useMobileApp = () => {
  const context = useContext(MobileAppContext);
  if (context === undefined) {
    throw new Error('useMobileApp must be used within a MobileAppProvider');
  }
  return context;
};

interface MobileAppProviderProps {
  children: ReactNode;
}

export const MobileAppProvider: React.FC<MobileAppProviderProps> = ({ children }) => {
  const [isMobileApp, setIsMobileApp] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showMobileApp, setShowMobileApp] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = checkIsMobileDevice();
      const shouldUseMobile = shouldUseMobileAppView();
      
      setIsMobileDevice(isMobile);
      setIsMobileApp(shouldUseMobile);
      setShowMobileApp(shouldUseMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileApp = () => {
    setShowMobileApp(!showMobileApp);
  };

  const value = {
    isMobileApp,
    isMobileDevice,
    showMobileApp,
    setShowMobileApp,
    toggleMobileApp,
  };

  return (
    <MobileAppContext.Provider value={value}>
      {children}
    </MobileAppContext.Provider>
  );
};

// Mobile detection utility
export const checkIsMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for mobile user agent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(navigator.userAgent);
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check screen size (mobile if width <= 768px)
  const isMobileScreen = window.innerWidth <= 768;
  
  // Check if it's Chrome mobile
  const isChromeMobile = /Chrome/i.test(navigator.userAgent) && isMobileUserAgent;
  
  return isMobileUserAgent && isTouchDevice && (isMobileScreen || isChromeMobile);
};

export const isChromeMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/i.test(userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isMobileScreen = window.innerWidth <= 768;
  
  return isChrome && isMobile && isMobileScreen;
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const isMobile = checkIsMobileDevice();
  
  if (isMobile && width <= 480) return 'mobile';
  if (isMobile && width <= 768) return 'tablet';
  return 'desktop';
};

export const shouldUseMobileAppView = (): boolean => {
  return checkIsMobileDevice() && window.innerWidth <= 768;
};

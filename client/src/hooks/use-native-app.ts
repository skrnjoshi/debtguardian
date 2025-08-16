import { useState, useEffect } from "react";

/**
 * Hook to detect if the app is running inside the DebtGuardian native mobile app
 */
export function useIsNativeApp() {
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Check if the native app flag is set
    const checkNativeApp = () => {
      const isNative = (window as any).isDebtGuardianNativeApp === true;
      setIsNativeApp(isNative);
      
      if (isNative) {
        console.log('Detected DebtGuardian native app environment');
      }
    };

    // Check immediately
    checkNativeApp();
    
    // Also check after a short delay in case the flag is set after initial load
    const timer = setTimeout(checkNativeApp, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return isNativeApp;
}

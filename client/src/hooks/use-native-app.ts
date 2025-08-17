import { useState, useEffect } from "react";

/**
 * Hook to detect if the app is running inside the DebtGuardian native mobile app
 */
export function useIsNativeApp() {
  const [isNativeApp, setIsNativeApp] = useState(() => {
    // Initial check - only detect if we have explicit native app flags
    if (typeof window === "undefined") return false;
    
    const windowObj = window as any;
    return (
      windowObj.isDebtGuardianNativeApp === true ||
      localStorage.getItem("isDebtGuardianNativeApp") === "true"
    );
  });

  useEffect(() => {
    // Check if the native app flag is set
    const checkNativeApp = () => {
      const windowObj = window as any;
      const isNative = windowObj.isDebtGuardianNativeApp === true;

      // Also check localStorage as fallback
      let isNativeFromStorage = false;
      try {
        isNativeFromStorage =
          localStorage.getItem("isDebtGuardianNativeApp") === "true";
      } catch (e) {}

      // Only consider it a native app if we have explicit flags set by our native app
      const finalIsNative = isNative || isNativeFromStorage;

      setIsNativeApp(finalIsNative);
    };

    // Check immediately
    checkNativeApp();

    // Also listen for the native app ready event
    const handleNativeAppReady = (event: CustomEvent) => {
      console.log("� Native app ready event received:", event.detail);
      setIsNativeApp(true);
    };

    window.addEventListener("nativeAppReady", handleNativeAppReady as EventListener);

    // Check periodically in case the native app injects the flag later
    const interval = setInterval(checkNativeApp, 1000);

    return () => {
      window.removeEventListener("nativeAppReady", handleNativeAppReady as EventListener);
      clearInterval(interval);
    };
  }, []);

  return isNativeApp;
}

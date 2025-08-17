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

      if (isNative !== isNativeApp) {
        setIsNativeApp(isNative);
        console.log(
          "Native app detection:",
          isNative ? "NATIVE APP" : "WEB BROWSER"
        );
      }

      return isNative;
    };

    // Check immediately
    checkNativeApp();

    // Check multiple times to catch the injection
    const timer1 = setTimeout(checkNativeApp, 100);
    const timer2 = setTimeout(checkNativeApp, 500);
    const timer3 = setTimeout(checkNativeApp, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isNativeApp]);

  return isNativeApp;
}

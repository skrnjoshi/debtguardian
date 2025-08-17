import { useState, useEffect } from "react";

/**
 * Hook to detect if the app is running inside the DebtGuardian native mobile app
 */
export function useIsNativeApp() {
  const [isNativeApp, setIsNativeApp] = useState(() => {
    // Initial check - be more aggressive in detecting WebView
    const userAgent = navigator.userAgent;
    return (
      /wv|WebView|Version\/.*Chrome|Android.*Chrome|ReactNative/i.test(
        userAgent
      ) && !/Edg\/|Chrome\/.*Safari/i.test(userAgent)
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

      // Check UserAgent for WebView indicators - improved patterns
      const userAgent = navigator.userAgent;
      const isWebView = /wv|WebView/i.test(userAgent);
      const isAndroidWebView = /Android.*wv/i.test(userAgent);
      const isChromeWebView = /Version\/.*Chrome/i.test(userAgent);
      const isReactNativeWebView = /ReactNative/i.test(userAgent);

      // Check if we're running in any kind of WebView environment
      const isAnyWebView =
        isWebView ||
        isAndroidWebView ||
        isChromeWebView ||
        isReactNativeWebView;

      // Also check if we're not in a regular browser (no window.chrome, etc.)
      const isNotRegularBrowser =
        !windowObj.chrome || !navigator.plugins?.length;

      const finalIsNative =
        isNative ||
        isNativeFromStorage ||
        isAnyWebView ||
        (isNotRegularBrowser && /Android/i.test(userAgent));

      console.log("🔍 Native app detection check:", {
        isDebtGuardianNativeApp: windowObj.isDebtGuardianNativeApp,
        DebtGuardianAppVersion: windowObj.DebtGuardianAppVersion,
        isNativeFromStorage,
        isWebView,
        isAndroidWebView,
        isChromeWebView,
        isReactNativeWebView,
        isAnyWebView,
        isNotRegularBrowser,
        isNative,
        finalIsNative,
        currentState: isNativeApp,
        userAgent: navigator.userAgent,
        href: window.location.href,
        timestamp: new Date().toISOString(),
      });

      if (finalIsNative !== isNativeApp) {
        setIsNativeApp(finalIsNative);
        console.log(
          "🚀 Native app detection changed:",
          finalIsNative ? "✅ NATIVE APP DETECTED" : "🌐 WEB BROWSER"
        );
      }

      return finalIsNative;
    };

    // Check immediately
    checkNativeApp();

    // Check multiple times to catch the injection
    const timer1 = setTimeout(checkNativeApp, 100);
    const timer2 = setTimeout(checkNativeApp, 500);
    const timer3 = setTimeout(checkNativeApp, 1000);
    const timer4 = setTimeout(checkNativeApp, 2000);
    const timer5 = setTimeout(checkNativeApp, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isNativeApp]);

  return isNativeApp;
}

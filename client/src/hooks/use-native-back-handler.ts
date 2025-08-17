import { useEffect } from "react";
import { useLocation } from "wouter";

// Extend Window interface for native app detection
declare global {
  interface Window {
    isDebtGuardianNativeApp?: boolean;
  }
}

export function useNativeBackHandler() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only set up listener in native app environment
    const isNativeApp =
      window.isDebtGuardianNativeApp ||
      localStorage.getItem("isDebtGuardianNativeApp") === "true";

    if (!isNativeApp) return;

    const handleNativeBack = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.type === "NATIVE_BACK_PRESSED") {
          // Use browser history first
          if (window.history && window.history.length > 1) {
            window.history.back();
            return;
          }

          // Fallback to navigating to home
          setLocation("/");
        }
      } catch (e) {
        // Fallback: just go back in history
        if (window.history && window.history.length > 1) {
          window.history.back();
        } else {
          setLocation("/");
        }
      }
    };

    // Listen for messages from React Native
    window.addEventListener("message", handleNativeBack);

    // Also listen for the direct message event (for Android WebView)
    document.addEventListener("message", handleNativeBack as any);

    return () => {
      window.removeEventListener("message", handleNativeBack);
      document.removeEventListener("message", handleNativeBack as any);
    };
  }, [setLocation]);
}

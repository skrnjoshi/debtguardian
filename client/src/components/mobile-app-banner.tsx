import { useState, useEffect } from "react";
import { Smartphone, Download, X, Plus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsNativeApp } from "@/hooks/use-native-app";
import { MobileDownloadDialog } from "@/components/mobile-download-dialog";

export function MobileAppBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const isMobile = useIsMobile();
  const isNativeApp = useIsNativeApp();

  useEffect(() => {
    // Don't show banner if running in native app
    if (isNativeApp) {
      console.log("Running in native app - hiding mobile banner");
      return;
    }

    // Check if user is on mobile and hasn't dismissed the banner
    const isDismissed =
      localStorage.getItem("debtguardian-app-banner-dismissed") === "true";

    // Check if already installed as PWA
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    if (isMobile && !isDismissed && !isStandalone && !isIOSStandalone) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000); // 3 second delay
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [isMobile, isNativeApp]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("debtguardian-app-banner-dismissed", "true");
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setCanInstallPWA(false);
        handleDismiss();
      }
    }
  };

  const handleDownloadApp = () => {
    setShowDownloadDialog(true);
  };

  if (!showBanner || dismissed) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  📱 Get the DebtGuardian App
                </h3>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {canInstallPWA
                    ? "Install for better performance, offline access, and app-like experience"
                    : "Add to home screen for quick access and offline capabilities"}
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadApp}
                    size="sm"
                    className="text-xs h-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
                  >
                    {canInstallPWA ? (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        Install App
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-3 h-3 mr-1" />
                        App Info
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = "/DebtGuardian-v1.0.0-release-updated.apk";
                      link.download = "DebtGuardian-v1.0.0-release-updated.apk";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    APK
                  </Button>
                  <Button
                    onClick={() => setShowDownloadDialog(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add to Home
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileDownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        canInstallPWA={canInstallPWA}
        onInstallPWA={handleInstallPWA}
      />
    </>
  );
}

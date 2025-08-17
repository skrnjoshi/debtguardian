import { Download, Smartphone, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MobileDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canInstallPWA: boolean;
  onInstallPWA: () => void;
}

export function MobileDownloadDialog({
  open,
  onOpenChange,
  canInstallPWA,
  onInstallPWA,
}: MobileDownloadDialogProps) {
  const handleDownloadAPK = () => {
    const link = document.createElement("a");
    link.href = "/DebtGuardian-v1.0.0-release-updated.apk";
    link.download = "DebtGuardian-v1.0.0-release-updated.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onOpenChange(false);
  };

  const handleAddToHomeScreen = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let instructions = "";

    if (isIOS) {
      instructions =
        "Tap the Share button (⬆️) in Safari, then 'Add to Home Screen'";
    } else if (isAndroid) {
      instructions =
        "Tap the menu (⋮) in your browser, then 'Add to Home Screen'";
    } else {
      instructions = "Look for 'Add to Home Screen' in your browser menu";
    }

    // You could show these instructions in a tooltip or another dialog
    alert(`📱 Add to Home Screen\n\n${instructions}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-4 rounded-xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-3">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Get DebtGuardian App
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose your preferred installation method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* PWA Install Option */}
          {canInstallPWA && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Install Web App
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Recommended
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3">
                  Install directly to your device with full offline capabilities
                </p>
                <Button
                  onClick={onInstallPWA}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              </CardContent>
            </Card>
          )}

          {/* APK Download Option */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-4 h-4 text-green-600" />
                Android APK
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">
                Download the native Android app (46MB)
              </p>
              <Button
                onClick={handleDownloadAPK}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download APK
              </Button>
            </CardContent>
          </Card>

          {/* Add to Home Screen Option */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" />
                Add to Home Screen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">
                Quick access from your home screen
              </p>
              <Button
                onClick={handleAddToHomeScreen}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Home
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            <X className="w-4 h-4 mr-1" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { ArrowLeft, Download, Smartphone, Monitor, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsNativeApp } from "@/hooks/use-native-app";

export default function Downloads() {
  const isNativeApp = useIsNativeApp();

  const handleDownload = (filename: string) => {
    const link = document.createElement("a");
    link.href = `/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="ghost"
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Download DebtGuardian
          </h1>
        </div>

        {/* Download Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Android APK Release v1.0.2 (Latest Enhanced) - Hidden in native app */}
          {!isNativeApp ? (
            <Card className="hover:shadow-lg transition-shadow border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-emerald-700">
                  Android App v1.0.2 🔥
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  🚀 Enhanced build with advanced debugging and error handling
                </p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-500">
                    📱 DebtGuardian-v1.0.2-release.apk
                  </div>
                  <div className="text-sm text-emerald-600 font-semibold">
                    ✅ Enhanced Popup • Advanced Logging • Back Button • Native
                    Detection • Error Handling
                  </div>
                </div>
                <Button
                  onClick={() =>
                    handleDownload("DebtGuardian-v1.0.2-release.apk")
                  }
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download v1.0.2 APK (Recommended)
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {/* Android APK Release v1.0.1 (Latest) - Hidden in native app */}
          {!isNativeApp ? (
            <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Android App v1.0.1</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  🚀 Previous build with visual version indicators and all fixes
                </p>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-500">
                    📱 DebtGuardian-v1.0.1-release.apk
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    ✅ Version Popup • Back Button • Native Detection • Enhanced
                    UI
                  </div>
                </div>
                <Button
                  onClick={() =>
                    handleDownload("DebtGuardian-v1.0.1-release.apk")
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download v1.0.1 APK
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {/* Android APK Release (Original) - Hidden in native app */}
          {!isNativeApp ? (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">
                  Android App (Original)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Original stable build for Android devices
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-500">Version: v1.0.0</p>
                  <p className="text-sm text-gray-500">Size: 46 MB</p>
                  <p className="text-sm text-gray-500">Build: Production</p>
                </div>
                <Button
                  onClick={() =>
                    handleDownload("DebtGuardian-v1.0.0-release.apk")
                  }
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download APK
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-green-700" />
                </div>
                <CardTitle className="text-xl text-green-800">
                  Android App (Release)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-700 mb-4">
                  ✅ You're currently using this version!
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-green-600">Version: v1.0.0</p>
                  <p className="text-sm text-green-600">Size: 46 MB</p>
                  <p className="text-sm text-green-600">Status: Active</p>
                </div>
                <div className="w-full py-3 px-4 bg-green-200 text-green-800 rounded font-medium">
                  Already Installed
                </div>
              </CardContent>
            </Card>
          )}

          {/* Android APK Debug - Hidden in native app */}
          {!isNativeApp && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Android App (Debug)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Debug build with additional logging for development
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-500">Version: v1.0.0</p>
                  <p className="text-sm text-gray-500">Size: 100 MB</p>
                  <p className="text-sm text-gray-500">Build: Debug</p>
                </div>
                <Button
                  onClick={() =>
                    handleDownload("DebtGuardian-v1.0.0-debug.apk")
                  }
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Debug APK
                </Button>
              </CardContent>
            </Card>
          )}

          {/* PWA */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Progressive Web App</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Works on all devices - Android, iOS, Desktop
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-500">Platform: Universal</p>
                <p className="text-sm text-gray-500">Size: ~2 MB</p>
                <p className="text-sm text-gray-500">Installation: Browser</p>
              </div>
              <Button
                onClick={() => {
                  if ("serviceWorker" in navigator) {
                    alert(
                      "💡 Add to Home Screen:\n\nAndroid: Menu → Add to Home Screen\niOS: Share → Add to Home Screen\n\nEnjoy app-like experience!"
                    );
                  } else {
                    window.open("https://debtguardian.onrender.com", "_blank");
                  }
                }}
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Open Web App
              </Button>
            </CardContent>
          </Card>

          {/* iOS Coming Soon */}
          <Card className="hover:shadow-lg transition-shadow opacity-75">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Apple className="w-8 h-8 text-gray-600" />
              </div>
              <CardTitle className="text-xl">iOS App</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Native iOS app coming to the App Store soon
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-500">Platform: iOS</p>
                <p className="text-sm text-gray-500">Status: In Development</p>
                <p className="text-sm text-gray-500">Release: TBA</p>
              </div>
              <Button disabled variant="outline" className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Installation Instructions */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                📋 Installation Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  🤖 Android APK Installation
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Download the APK file to your Android device</li>
                  <li>
                    Go to Settings → Security → Enable "Unknown Sources" or
                    "Install from Unknown Sources"
                  </li>
                  <li>Open the downloaded APK file using your file manager</li>
                  <li>
                    Tap "Install" and wait for the installation to complete
                  </li>
                  <li>Launch DebtGuardian from your app drawer</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  🌐 Progressive Web App
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    <strong>Android:</strong> Open in Chrome → Menu (⋮) → Add to
                    Home Screen
                  </li>
                  <li>
                    <strong>iOS:</strong> Open in Safari → Share (⬆️) → Add to
                    Home Screen
                  </li>
                  <li>
                    <strong>Desktop:</strong> Look for install icon in address
                    bar or browser menu
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Tip:</strong> The Progressive Web App provides the
                  same functionality as the native apps and works on all devices
                  without requiring installation from an app store.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

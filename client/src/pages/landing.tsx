import {
  ChartLine,
  CreditCard,
  TrendingUp,
  Shield,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileAppBanner } from "@/components/mobile-app-banner";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ChartLine className="text-primary text-xl sm:text-2xl" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                DebtGuardian
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Download App Button */}
              <Button
                onClick={() => (window.location.href = "/downloads")}
                variant="outline"
                className="hidden md:flex items-center space-x-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Downloads</span>
              </Button>
              {/* Mobile APK Download Button */}
              <Button
                onClick={() => {
                  window.open("/api/download/apk/v1.0.0-release", "_blank");
                }}
                variant="outline"
                className="md:hidden flex items-center space-x-1 text-xs px-2 py-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Download className="w-3 h-3" />
                <span>APK</span>
              </Button>
              <Button
                onClick={() => (window.location.href = "/login")}
                className="bg-primary hover:bg-blue-800 text-sm sm:text-base px-3 sm:px-4"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Take Control of Your Debt with DebtGuardian
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Comprehensive loan management with payment tracking, automated
            calculations, and financial analytics. Achieve financial freedom
            with professional-grade debt management tools.
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-primary hover:bg-blue-800 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loan Portfolio Management
              </h3>
              <p className="text-gray-600">
                Track all your loans in one place with outstanding balances,
                EMIs, and interest rates sorted by priority.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Tracking
              </h3>
              <p className="text-gray-600">
                Log payments with automatic balance updates and comprehensive
                payment history with notes and categorization.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Financial Analytics
              </h3>
              <p className="text-gray-600">
                Visual charts, debt payoff projections, and financial health
                scoring to optimize your repayment strategy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile App Download Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white mb-16">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              📱 Download Our Mobile App
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Get the full DebtGuardian experience on your mobile device
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Android APK */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-semibold text-lg mb-3">Android APK</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Native Android app with full functionality
                </p>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-white/20 hover:bg-white/30 border border-white/30"
                    onClick={() => {
                      window.open("/api/download/apk/v1.0.0-release", "_blank");
                    }}
                  >
                    Download APK (46MB)
                  </Button>
                  <p className="text-xs text-blue-200">Production Release</p>
                </div>
              </div>

              {/* PWA */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🌐</div>
                <h4 className="font-semibold text-lg mb-3">Web App (PWA)</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Works on all devices - iOS, Android, Desktop
                </p>
                <Button
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/30"
                  onClick={() => {
                    if ("serviceWorker" in navigator) {
                      alert(
                        "💡 Add to Home Screen:\n\n" +
                          "Android: Menu → Add to Home Screen\n" +
                          "iOS: Share → Add to Home Screen\n\n" +
                          "Enjoy app-like experience!"
                      );
                    } else {
                      window.open(
                        "https://debtguardian.onrender.com",
                        "_blank"
                      );
                    }
                  }}
                >
                  Add to Home Screen
                </Button>
                <p className="text-xs text-blue-200">
                  No installation required
                </p>
              </div>

              {/* Coming Soon - iOS */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🍎</div>
                <h4 className="font-semibold text-lg mb-3">iOS App</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Native iOS app coming to App Store soon
                </p>
                <Button
                  className="w-full bg-white/20 hover:bg-white/30 border border-white/30"
                  disabled
                >
                  Coming Soon
                </Button>
                <p className="text-xs text-blue-200">In development</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <p className="text-sm text-blue-100">
                <strong>📋 APK Installation:</strong> Enable "Unknown Sources"
                in Android Settings → Security, then download and open the APK
                file to install.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Master Your Finances?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of users who have taken control of their debt with
            our comprehensive loan management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/signup")}
              className="bg-primary hover:bg-blue-800 text-lg px-8 py-3"
            >
              Create Account
            </Button>
            <Button
              onClick={() => (window.location.href = "/downloads")}
              variant="outline"
              className="text-lg px-8 py-3 border-green-300 text-green-700 hover:bg-green-50"
            >
              📱 Download App
            </Button>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="outline"
              className="text-lg px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile App Download Banner */}
      <MobileAppBanner />
    </div>
  );
}

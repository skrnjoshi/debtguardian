import {
  ChartLine,
  CreditCard,
  TrendingUp,
  Shield,
  Download,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleDownload = () => {
    // Create download link for APK
    const link = document.createElement("a");
    link.href = "/DebtGuardian-v1.0.2-release.apk";
    link.download = "DebtGuardian-v1.0.2-release.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToHomeScreen = () => {
    if ("serviceWorker" in navigator) {
      alert(
        "💡 Add to Home Screen:\n\nAndroid: Menu → Add to Home Screen\niOS: Share → Add to Home Screen\n\nEnjoy app-like experience!"
      );
    } else {
      window.open("https://debtguardian.onrender.com", "_blank");
    }
  };

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

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-16">
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
              onClick={() => (window.location.href = "/login")}
              variant="outline"
              className="text-lg px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>
      </main>

      {/* Download Footer */}
      <footer className="bg-white shadow-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center py-6 gap-4">
            <Button
              onClick={handleDownload}
              className="bg-primary hover:bg-blue-800 text-sm px-4 py-2 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download APK
            </Button>

            <Button
              onClick={handleAddToHomeScreen}
              variant="outline"
              className="text-sm px-4 py-2 flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Add to Home Screen
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

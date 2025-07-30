import { ChartLine, CreditCard, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ChartLine className="text-primary text-2xl" />
              <h1 className="text-xl font-bold text-gray-900">Loan Manager Pro</h1>
            </div>
            <Button onClick={() => window.location.href = '/api/login'} className="bg-primary hover:bg-blue-800">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Take Control of Your Loans
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive loan management with payment tracking, automated calculations, 
            and financial analytics. Optimize your debt strategy with Indian rupee formatting 
            and personalized insights.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-blue-800 text-lg px-8 py-3"
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
                Track all your loans in one place with outstanding balances, EMIs, 
                and interest rates sorted by priority.
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
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Master Your Finances?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of users who have taken control of their debt with our 
            comprehensive loan management platform.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-blue-800 text-lg px-8 py-3"
          >
            Start Managing Your Loans
          </Button>
        </div>
      </main>
    </div>
  );
}

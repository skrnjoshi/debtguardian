import { useEffect, useMemo, memo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, apiClient, authStorage } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { ChartLine, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { LoanCard } from "@/components/dashboard/loan-card";
import { LoanForm } from "@/components/dashboard/loan-form";
import { PaymentForm } from "@/components/dashboard/payment-form";
import { FinancialHealth } from "@/components/dashboard/financial-health";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { UserProfileSettings } from "@/components/dashboard/user-profile-settings";

interface Loan {
  id: string;
  name: string;
  loanType: string;
  originalAmount: string;
  outstandingAmount: string;
  emiAmount: string;
  interestRate: string;
  remainingMonths: number;
  nextDueDate: string;
}

interface Payment {
  id: string;
  amount: string;
  paymentDate: string;
  paymentType: string;
}

interface Analytics {
  totalDebt: number;
  totalEMI: number;
  salary: number;
  emiRatio: number;
  availableIncome: number;
  basicExpenses: {
    housing: number;
    food: number;
    transportation: number;
    healthcare: number;
    utilities: number;
    total: number;
  };
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Initialize user mutation with optimized retry logic
  const initializeUserMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/api/initialize-user", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      console.error("Failed to initialize user:", error);
    },
    retry: false, // Don't retry initialization
  });

  // Fetch loans with optimized caching
  const { data: loans = [], isLoading: loansLoading } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
    queryFn: () => apiClient.get("/api/loans"),
    enabled: !!authStorage.getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes cache
  });

  // Fetch analytics overview with caching
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics/overview"],
    queryFn: () => apiClient.get("/api/analytics/overview"),
    enabled: !!authStorage.getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache for analytics
  });

  // Fetch recent payments with caching
  const { data: recentPayments = [], isLoading: paymentsLoading } = useQuery<
    Payment[]
  >({
    queryKey: ["/api/payments/recent"],
    queryFn: () => apiClient.get("/api/payments/recent"),
    enabled: !!authStorage.getToken(),
    staleTime: 3 * 60 * 1000, // 3 minutes cache
  });

  // No longer auto-initialize users with default loans
  // Users will start with an empty portfolio and add loans manually

  // Function to refresh analytics data after profile updates
  const handleProfileUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ChartLine className="text-primary text-2xl" />
              <h1 className="text-xl font-bold text-gray-900">DebtGuardian</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user?.firstName || "User"}
              </span>
              <Button
                onClick={() => setShowProfileSettings(true)}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Financial Overview
          </h2>
          <OverviewCards analytics={analytics} isLoading={analyticsLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loans List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Loan Portfolio
                  </h3>
                  <LoanForm />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Sorted by interest rate (highest first)
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {loansLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading loans...</p>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600">
                      No loans found. Initializing your portfolio...
                    </p>
                  </div>
                ) : (
                  loans.map((loan: any) => (
                    <LoanCard key={loan.id} loan={loan} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PaymentForm loans={loans} />
            <FinancialHealth analytics={analytics} />
          </div>
        </div>

        {/* Analytics Section */}
        <AnalyticsCharts
          loans={loans}
          recentPayments={recentPayments}
          isLoading={loansLoading || paymentsLoading}
        />
      </div>

      {/* User Profile Settings Modal */}
      <UserProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}

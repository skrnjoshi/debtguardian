import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { ChartLine, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { LoanCard } from "@/components/dashboard/loan-card";
import { PaymentForm } from "@/components/dashboard/payment-form";
import { FinancialHealth } from "@/components/dashboard/financial-health";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Initialize user mutation
  const initializeUserMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/initialize-user");
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
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error("Failed to initialize user:", error);
    },
  });

  // Fetch loans
  const { data: loans = [], isLoading: loansLoading } = useQuery({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
  });

  // Fetch analytics overview
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/overview"],
    enabled: isAuthenticated,
  });

  // Fetch recent payments
  const { data: recentPayments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments/recent"],
    enabled: isAuthenticated,
  });

  // Initialize user if no loans exist
  useEffect(() => {
    if (isAuthenticated && loans.length === 0 && !loansLoading) {
      initializeUserMutation.mutate();
    }
  }, [isAuthenticated, loans.length, loansLoading]);

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
              <h1 className="text-xl font-bold text-gray-900">Loan Manager Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user?.firstName || "User"}
              </span>
              <Button
                onClick={() => window.location.href = "/api/logout"}
                variant="outline"
                size="sm"
              >
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
          <OverviewCards 
            analytics={analytics} 
            isLoading={analyticsLoading} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loans List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Loan Portfolio</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Sorted by interest rate (highest first)</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loansLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading loans...</p>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600">No loans found. Initializing your portfolio...</p>
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
    </div>
  );
}

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, authStorage } from "@/hooks/useAuth";
import { lazy, Suspense, useEffect } from "react";

// Lazy load components for better performance
const Landing = lazy(() => import("@/pages/landing"));
const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));
const PaymentHistory = lazy(() => import("@/pages/payment-history"));
const PayoffCalculator = lazy(() => import("@/pages/payoff-calculator"));
const LoanDetails = lazy(() => import("@/pages/loan-details"));
const Downloads = lazy(() => import("@/pages/downloads"));

// Loading component for suspense
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const hasToken = authStorage.getToken();

  useEffect(() => {
    // Redirect logic
    if (
      !hasToken &&
      location !== "/login" &&
      location !== "/signup" &&
      location !== "/"
    ) {
      setLocation("/login");
    } else if (hasToken && (location === "/login" || location === "/signup")) {
      setLocation("/dashboard");
    }
  }, [hasToken, location, setLocation]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/downloads" component={Downloads} />
        <Route path="/" component={hasToken ? Dashboard : Landing} />
        <Route path="/dashboard" component={hasToken ? Dashboard : NotFound} />
        <Route
          path="/payment-history"
          component={hasToken ? PaymentHistory : NotFound}
        />
        <Route
          path="/payoff-calculator"
          component={hasToken ? PayoffCalculator : NotFound}
        />
        <Route
          path="/loan-details/:loanId"
          component={hasToken ? LoanDetails : NotFound}
        />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

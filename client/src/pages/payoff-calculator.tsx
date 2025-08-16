import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, apiClient } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ChartLine, ArrowLeft, Calculator, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/currency";
import { Link } from "wouter";

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

interface PayoffResults {
  loan: Loan;
  current: {
    months: number;
    totalInterest: number;
    totalPayment: number;
    monthlyPayment: number;
  };
  optimized: {
    months: number;
    totalInterest: number;
    totalPayment: number;
    monthlyPayment: number;
  };
  savings: {
    interestSaved: number;
    timeSaved: number;
  };
}

export default function PayoffCalculator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  const [extraPayment, setExtraPayment] = useState<string>("");
  const [payoffResults, setPayoffResults] = useState<PayoffResults | null>(
    null
  );

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

  // Fetch loans
  const { data: loans = [] } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
    queryFn: () => apiClient.get("/api/loans"),
    enabled: isAuthenticated,
  });

  const calculatePayoff = () => {
    if (!selectedLoanId) {
      toast({
        title: "Select a Loan",
        description: "Please select a loan to calculate payoff scenarios.",
        variant: "destructive",
      });
      return;
    }

    const loan = loans.find((l: Loan) => l.id === selectedLoanId);
    if (!loan) return;

    const principal = parseFloat(loan.outstandingAmount);
    const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;
    const emi = parseFloat(loan.emiAmount);
    const extraAmount = parseFloat(extraPayment) || 0;

    // Current scenario (without extra payment)
    const currentMonths = loan.remainingMonths;
    const currentTotalPayment = emi * currentMonths;
    const currentInterest = currentTotalPayment - principal;

    // Validate current scenario - if interest is negative, recalculate
    let validatedCurrentInterest = currentInterest;
    if (currentInterest < 0) {
      // Recalculate using proper amortization formula
      let tempBalance = principal;
      let tempTotalPaid = 0;
      let tempMonths = 0;

      while (tempBalance > 0.01 && tempMonths < 1000) {
        const interestPayment = tempBalance * monthlyRate;
        const principalPayment = emi - interestPayment;

        if (principalPayment <= 0) break;

        tempBalance = Math.max(0, tempBalance - principalPayment);
        tempTotalPaid += emi;
        tempMonths++;
      }

      validatedCurrentInterest = tempTotalPaid - principal;
    }

    // With extra payment scenario
    let balance = principal;
    let months = 0;
    let totalPaid = 0;
    const newEmi = emi + extraAmount;

    while (balance > 0 && months < 1000) {
      // Safety limit
      const interestPayment = balance * monthlyRate;
      const principalPayment = newEmi - interestPayment;

      if (principalPayment <= 0) break; // Invalid scenario

      balance = Math.max(0, balance - principalPayment);
      totalPaid += newEmi;
      months++;
    }

    const newInterest = totalPaid - principal;
    const interestSaved = validatedCurrentInterest - newInterest;
    const timeSaved = currentMonths - months;

    setPayoffResults({
      loan: loan,
      current: {
        months: currentMonths,
        totalPayment: currentTotalPayment,
        totalInterest: validatedCurrentInterest,
        monthlyPayment: emi,
      },
      optimized: {
        months: months,
        totalPayment: totalPaid,
        totalInterest: newInterest,
        monthlyPayment: newEmi,
      },
      savings: {
        interestSaved: interestSaved,
        timeSaved: timeSaved,
      },
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calculator...</p>
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
              <h1 className="text-xl font-bold text-gray-900">
                Payoff Calculator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Loan Payoff Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loan-select">Select Loan</Label>
                <Select
                  value={selectedLoanId}
                  onValueChange={setSelectedLoanId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a loan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loans.map((loan: Loan) => (
                      <SelectItem key={loan.id} value={loan.id}>
                        {loan.name} -{" "}
                        {formatCurrency(parseFloat(loan.outstandingAmount))} @{" "}
                        {loan.interestRate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="extra-payment">Extra Monthly Payment</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <Input
                    id="extra-payment"
                    type="number"
                    placeholder="0"
                    className="pl-8"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={calculatePayoff} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Payoff Scenarios
              </Button>

              {selectedLoanId &&
                loans.find((l: Loan) => l.id === selectedLoanId) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Loan Details
                    </h4>
                    {(() => {
                      const loan = loans.find(
                        (l: Loan) => l.id === selectedLoanId
                      );
                      if (!loan) return null;
                      return (
                        <div className="space-y-1 text-sm text-blue-800">
                          <p>
                            Outstanding:{" "}
                            {formatCurrency(parseFloat(loan.outstandingAmount))}
                          </p>
                          <p>
                            Current EMI:{" "}
                            {formatCurrency(parseFloat(loan.emiAmount))}
                          </p>
                          <p>Interest Rate: {loan.interestRate}%</p>
                          <p>Remaining Months: {loan.remainingMonths}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payoff Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payoffResults ? (
                <div className="space-y-6">
                  {/* Current Scenario */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Current Payment Plan
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-medium">
                          {formatCurrency(payoffResults.current.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time to Payoff:</span>
                        <span className="font-medium">
                          {payoffResults.current.months} months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest:</span>
                        <span className="font-medium">
                          {formatCurrency(payoffResults.current.totalInterest)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Total Payment:</span>
                        <span className="font-semibold">
                          {formatCurrency(payoffResults.current.totalPayment)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optimized Scenario */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      With Extra Payment
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            payoffResults.optimized.monthlyPayment
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time to Payoff:</span>
                        <span className="font-medium">
                          {payoffResults.optimized.months} months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            payoffResults.optimized.totalInterest
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Total Payment:</span>
                        <span className="font-semibold">
                          {formatCurrency(payoffResults.optimized.totalPayment)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">
                      Your Savings
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-800">Interest Saved:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(payoffResults.savings.interestSaved)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Time Saved:</span>
                        <span className="font-bold text-green-600">
                          {payoffResults.savings.timeSaved} months
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Select a loan and enter extra payment amount to see payoff
                    scenarios.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

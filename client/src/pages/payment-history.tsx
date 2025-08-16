import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, apiClient } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ChartLine, ArrowLeft, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
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

interface Payment {
  id: string;
  loanId: string;
  amount: string;
  paymentDate: string;
  paymentType: string;
  notes?: string;
}

export default function PaymentHistory() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  // Fetch payments with larger limit
  const { data: payments = [], isLoading: paymentsLoading } = useQuery<
    Payment[]
  >({
    queryKey: ["/api/payments/history"],
    queryFn: () => apiClient.get("/api/payments/history"),
    enabled: isAuthenticated,
  });

  // Fetch loans for reference
  const { data: loans = [] } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
    queryFn: () => apiClient.get("/api/loans"),
    enabled: isAuthenticated,
  });

  const getLoanName = (loanId: string) => {
    const loan = loans.find((l: Loan) => l.id === loanId);
    return loan ? loan.name : "Unknown Loan";
  };

  const getTotalPayments = () => {
    return payments.reduce(
      (sum: number, payment: Payment) => sum + parseFloat(payment.amount),
      0
    );
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case "emi":
        return "bg-blue-100 text-blue-800";
      case "extra":
        return "bg-green-100 text-green-800";
      case "prepayment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportPayments = () => {
    const csvContent = [
      "Date,Loan,Amount,Type,Notes",
      ...payments.map(
        (payment: Payment) =>
          `${format(new Date(payment.paymentDate), "yyyy-MM-dd")},${getLoanName(
            payment.loanId
          )},${payment.amount},${payment.paymentType},"${payment.notes || ""}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payment-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Payment history has been exported to CSV file.",
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment history...</p>
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
                Payment History
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalPayments())}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Payment Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {payments.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {payments.length > 0
                  ? formatCurrency(getTotalPayments() / payments.length)
                  : formatCurrency(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Payment Records
          </h2>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportPayments}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Payment List */}
        <Card>
          <CardContent className="p-0">
            {paymentsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No payments recorded yet.</p>
                <Link href="/">
                  <Button className="mt-4">Make Your First Payment</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {payments.map((payment: Payment) => (
                  <div
                    key={payment.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {getLoanName(payment.loanId)}
                          </h3>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(parseFloat(payment.amount))}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(
                                new Date(payment.paymentDate),
                                "MMM dd, yyyy"
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentTypeColor(
                                payment.paymentType
                              )}`}
                            >
                              {payment.paymentType.toUpperCase()}
                            </span>
                            {payment.notes && (
                              <span className="text-sm text-gray-600">
                                {payment.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

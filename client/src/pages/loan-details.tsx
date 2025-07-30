import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChartLine, ArrowLeft, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formatCurrency } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link, useLocation } from "wouter";

const editLoanSchema = z.object({
  name: z.string().min(1, "Loan name is required"),
  loanType: z.string().min(1, "Loan type is required"),
  emiAmount: z.string().min(1, "EMI amount is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  remainingMonths: z.string().min(1, "Remaining months is required"),
});

export default function LoanDetails() {
  const [location] = useLocation();
  const loanId = location.split('/')[2]; // Extract loan ID from URL
  
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

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

  // Fetch loans
  const { data: loans = [] } = useQuery({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
  });

  // Fetch loan payments
  const { data: loanPayments = [] } = useQuery({
    queryKey: ["/api/payments/loan", loanId],
    enabled: isAuthenticated && !!loanId,
  });

  const loan = loans.find((l: any) => l.id === loanId);

  const form = useForm<z.infer<typeof editLoanSchema>>({
    resolver: zodResolver(editLoanSchema),
    defaultValues: {
      name: loan?.name || "",
      loanType: loan?.loanType || "",
      emiAmount: loan?.emiAmount || "",
      interestRate: loan?.interestRate || "",
      remainingMonths: loan?.remainingMonths?.toString() || "",
    },
  });

  // Update form when loan data is available
  useEffect(() => {
    if (loan) {
      form.reset({
        name: loan.name,
        loanType: loan.loanType,
        emiAmount: loan.emiAmount,
        interestRate: loan.interestRate,
        remainingMonths: loan.remainingMonths.toString(),
      });
    }
  }, [loan, form]);

  const updateLoanMutation = useMutation({
    mutationFn: async (data: z.infer<typeof editLoanSchema>) => {
      await apiRequest("PUT", `/api/loans/${loanId}`, {
        ...data,
        emiAmount: parseFloat(data.emiAmount),
        interestRate: parseFloat(data.interestRate),
        remainingMonths: parseInt(data.remainingMonths),
      });
    },
    onSuccess: () => {
      toast({
        title: "Loan Updated",
        description: "Loan details have been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
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
      toast({
        title: "Error",
        description: "Failed to update loan details. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof editLoanSchema>) => {
    updateLoanMutation.mutate(data);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <ChartLine className="text-primary text-2xl" />
                <h1 className="text-xl font-bold text-gray-900">Loan Details</h1>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loan not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = ((parseFloat(loan.originalAmount) - parseFloat(loan.outstandingAmount)) / parseFloat(loan.originalAmount)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ChartLine className="text-primary text-2xl" />
              <h1 className="text-xl font-bold text-gray-900">Loan Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "destructive" : "outline"}
                size="sm"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Loan
                  </>
                )}
              </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loan Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{loan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="loanType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="personal">Personal Loan</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                                <SelectItem value="home">Home Loan</SelectItem>
                                <SelectItem value="business">Business Loan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="emiAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>EMI Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                  <Input type="number" className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="interestRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interest Rate</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input type="number" step="0.01" {...field} />
                                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="remainingMonths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remaining Months</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={updateLoanMutation.isPending}
                      >
                        {updateLoanMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Outstanding Amount</Label>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(parseFloat(loan.outstandingAmount))}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Original Amount</Label>
                        <p className="text-lg font-semibold text-gray-700">
                          {formatCurrency(parseFloat(loan.originalAmount))}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Monthly EMI</Label>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(parseFloat(loan.emiAmount))}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Interest Rate</Label>
                        <p className="text-lg font-semibold text-gray-900">{loan.interestRate}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Remaining Months</Label>
                        <p className="text-lg font-semibold text-gray-900">{loan.remainingMonths}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Loan Type</Label>
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                          {loan.loanType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Repayment Progress</span>
                        <span>{progressPercent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Interest</span>
                  <span className="font-semibold">
                    {formatCurrency((parseFloat(loan.outstandingAmount) * parseFloat(loan.interestRate)) / (12 * 100))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal Paid</span>
                  <span className="font-semibold">
                    {formatCurrency(parseFloat(loan.originalAmount) - parseFloat(loan.outstandingAmount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Remaining</span>
                  <span className="font-semibold">
                    {formatCurrency(parseFloat(loan.emiAmount) * loan.remainingMonths)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/payment-history">
                  <Button className="w-full" variant="outline">
                    View Payment History
                  </Button>
                </Link>
                <Link href="/payoff-calculator">
                  <Button className="w-full" variant="outline">
                    Calculate Payoff
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full">
                    Make Payment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
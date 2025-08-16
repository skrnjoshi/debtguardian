import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Check, DollarSign, Download, Calculator, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";

const paymentSchema = z.object({
  loanId: z.string().min(1, "Please select a loan"),
  amount: z.string().min(1, "Payment amount is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentType: z.enum(["emi", "extra", "prepayment"]),
  notes: z.string().optional(),
});

interface PaymentFormProps {
  loans: Array<{
    id: string;
    name: string;
    interestRate: string;
  }>;
}

export function PaymentForm({ loans }: PaymentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Export functionality
  const exportRecords = async () => {
    try {
      // Get all payment history
      const payments = await apiClient.get("/api/payments/history");
      const analytics = await apiClient.get("/api/analytics/overview");

      // Create CSV content
      const csvContent = [
        ["Date", "Loan Name", "Payment Type", "Amount", "Notes"].join(","),
        ...payments.map((payment: any) =>
          [
            new Date(payment.paymentDate).toLocaleDateString(),
            payment.loanName || "Unknown Loan",
            payment.paymentType || "EMI",
            payment.amount,
            payment.notes || "",
          ]
            .map((field) => `"${field}"`)
            .join(",")
        ),
      ].join("\n");

      // Download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `loan_payments_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Your payment records have been exported to CSV.",
        variant: "default",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export records. Please try again.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      loanId: "",
      amount: "",
      paymentDate: format(new Date(), "yyyy-MM-dd"),
      paymentType: "emi",
      notes: "",
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof paymentSchema>) => {
      await apiClient.post("/api/payments", {
        ...data,
        amount: parseFloat(data.amount),
        paymentDate: new Date(data.paymentDate),
      });
    },
    onSuccess: () => {
      toast({
        title: "Payment Logged",
        description: "Your payment has been successfully recorded.",
      });
      form.reset({
        loanId: "",
        amount: "",
        paymentDate: format(new Date(), "yyyy-MM-dd"),
        paymentType: "emi",
        notes: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments/recent"] });
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
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to log payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof paymentSchema>) => {
    paymentMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Button
            className="w-full bg-primary text-white hover:bg-blue-800"
            onClick={() =>
              document
                .getElementById("payment-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
          <Button variant="outline" className="w-full" onClick={exportRecords}>
            <Download className="w-4 h-4 mr-2" />
            Export Records
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/payoff-calculator")}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Payoff Calculator
          </Button>
        </div>
      </div>

      {/* Payment Form */}
      <div
        id="payment-form"
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Log Payment
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="loanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Loan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a loan..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loans.map((loan) => (
                        <SelectItem key={loan.id} value={loan.id}>
                          {loan.name} ({loan.interestRate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="0"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="emi">EMI Payment</SelectItem>
                      <SelectItem value="extra">Extra Payment</SelectItem>
                      <SelectItem value="prepayment">Prepayment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-75"
              disabled={paymentMutation.isPending || loans.length === 0}
            >
              {paymentMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : loans.length === 0 ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  No Loans Available
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Log Payment
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

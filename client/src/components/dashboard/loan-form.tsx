import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/hooks/useAuth";
import { Plus } from "lucide-react";

interface LoanFormData {
  name: string;
  loanType: string;
  originalAmount: string;
  outstandingAmount: string;
  emiAmount: string;
  interestRate: string;
  remainingMonths: string;
  nextDueDate: string;
}

export function LoanForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<LoanFormData>({
    name: "",
    loanType: "personal",
    originalAmount: "",
    outstandingAmount: "",
    emiAmount: "",
    interestRate: "",
    remainingMonths: "",
    nextDueDate: "",
  });

  const createLoanMutation = useMutation({
    mutationFn: async (data: LoanFormData) => {
      return await apiClient.post("/api/loans", {
        ...data,
        originalAmount: parseFloat(data.originalAmount),
        outstandingAmount: parseFloat(data.outstandingAmount),
        emiAmount: parseFloat(data.emiAmount),
        interestRate: parseFloat(data.interestRate),
        remainingMonths: parseInt(data.remainingMonths),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Loan created successfully",
      });
      // Invalidate multiple related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      // Force refetch to ensure immediate UI update
      queryClient.refetchQueries({ queryKey: ["/api/loans"] });
      queryClient.refetchQueries({ queryKey: ["/api/analytics/overview"] });

      setOpen(false);
      setFormData({
        name: "",
        loanType: "personal",
        originalAmount: "",
        outstandingAmount: "",
        emiAmount: "",
        interestRate: "",
        remainingMonths: "",
        nextDueDate: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create loan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.originalAmount ||
      !formData.outstandingAmount ||
      !formData.emiAmount ||
      !formData.interestRate ||
      !formData.remainingMonths
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createLoanMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LoanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Set default next due date to next month
  const getDefaultDueDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Loan</DialogTitle>
          <DialogDescription>
            Add a new loan to track your debt and payments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Home Loan, Car Loan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Select
              value={formData.loanType}
              onValueChange={(value) => handleInputChange("loanType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="home">Home Loan</SelectItem>
                <SelectItem value="car">Car Loan</SelectItem>
                <SelectItem value="education">Education Loan</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalAmount">Original Amount *</Label>
              <Input
                id="originalAmount"
                type="number"
                step="0.01"
                value={formData.originalAmount}
                onChange={(e) =>
                  handleInputChange("originalAmount", e.target.value)
                }
                placeholder="100000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outstandingAmount">Outstanding Amount *</Label>
              <Input
                id="outstandingAmount"
                type="number"
                step="0.01"
                value={formData.outstandingAmount}
                onChange={(e) =>
                  handleInputChange("outstandingAmount", e.target.value)
                }
                placeholder="75000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emiAmount">EMI Amount *</Label>
              <Input
                id="emiAmount"
                type="number"
                step="0.01"
                value={formData.emiAmount}
                onChange={(e) => handleInputChange("emiAmount", e.target.value)}
                placeholder="5000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%) *</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) =>
                  handleInputChange("interestRate", e.target.value)
                }
                placeholder="12.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remainingMonths">Remaining Months *</Label>
              <Input
                id="remainingMonths"
                type="number"
                value={formData.remainingMonths}
                onChange={(e) =>
                  handleInputChange("remainingMonths", e.target.value)
                }
                placeholder="24"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextDueDate">Next Due Date</Label>
              <Input
                id="nextDueDate"
                type="date"
                value={formData.nextDueDate || getDefaultDueDate()}
                onChange={(e) =>
                  handleInputChange("nextDueDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createLoanMutation.isPending}>
              {createLoanMutation.isPending ? "Creating..." : "Create Loan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

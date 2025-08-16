import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  History,
  Calculator,
  Edit3,
  XCircle,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiClient } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoanCardProps {
  loan: {
    id: string;
    name: string;
    outstandingAmount: string;
    originalAmount: string;
    emiAmount: string;
    interestRate: string;
    remainingMonths: number;
    nextDueDate: string;
    loanType: string;
  };
}

export function LoanCard({ loan }: LoanCardProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Extra flag for delete operation
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const interestRate = parseFloat(loan.interestRate) || 0;
  const outstanding = parseFloat(loan.outstandingAmount) || 0;
  const original = parseFloat(loan.originalAmount) || 0;
  const emiAmount = parseFloat(loan.emiAmount) || 0;
  const progressPercent =
    original > 0 ? ((original - outstanding) / original) * 100 : 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuAction = async (action: string) => {
    console.log(
      "🎯 [MENU-ACTION] Action clicked:",
      action,
      "for loan:",
      loan.id
    );

    // Check authentication status
    const token = localStorage.getItem("auth_token");
    console.log("🔐 [MENU-ACTION] Auth token present:", !!token);

    setIsMenuOpen(false); // Close menu when action is clicked

    switch (action) {
      case "history":
        console.log("📊 [MENU-ACTION] Navigating to payment history");
        setLocation("/payment-history");
        break;
      case "payoff":
        console.log("🧮 [MENU-ACTION] Navigating to payoff calculator");
        setLocation("/payoff-calculator");
        break;
      case "edit":
        console.log("✏️ [MENU-ACTION] Navigating to edit loan:", loan.id);
        setLocation(`/loan-details/${loan.id}`);
        break;
      case "close":
        console.log("🔒 [MENU-ACTION] Showing close dialog for loan:", loan.id);
        setShowCloseDialog(true);
        break;
      case "delete":
        console.log(
          "🗑️ [MENU-ACTION] Showing delete dialog for loan:",
          loan.id
        );
        setShowDeleteDialog(true);
        break;
      default:
        console.log("❓ [MENU-ACTION] Unknown action:", action);
    }
  };

  const handleCloseLoan = async () => {
    if (isLoading || isDeleted) {
      console.log(
        "🚫 [CLOSE] Operation blocked - loading:",
        isLoading,
        "deleted:",
        isDeleted
      );
      return;
    }

    try {
      setIsLoading(true);
      console.log(
        "🔐 [CLOSE] Starting close process for loan:",
        loan.id,
        loan.name
      );

      // Check if we have auth token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await apiClient.patch(`/api/loans/${loan.id}/close`);
      console.log(
        "✅ [CLOSE] API call successful for loan:",
        loan.id,
        "Response:",
        response
      );

      // Immediately update local cache
      queryClient.setQueryData(["/api/loans"], (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map((l: any) =>
            l.id === loan.id
              ? { ...l, outstandingAmount: "0.00", remainingMonths: 0 }
              : l
          );
        }
        return oldData;
      });

      // Invalidate queries to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      await queryClient.invalidateQueries({
        queryKey: ["/api/analytics/overview"],
      });

      toast({
        title: "Loan Closed",
        description: `${loan.name} has been marked as fully paid.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("❌ [CLOSE] Error closing loan:", error);
      let errorMessage = "Failed to close loan. Please try again.";

      if (error.message?.includes("404")) {
        errorMessage = "Loan not found. It may have already been closed.";
      } else if (error.message?.includes("403")) {
        errorMessage = "You are not authorized to close this loan.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowCloseDialog(false);
    }
  };

  const handleDeleteLoan = async () => {
    if (isLoading || isDeleted || isDeleting) {
      console.log(
        "🚫 [DELETE] Operation blocked - loading:",
        isLoading,
        "deleted:",
        isDeleted,
        "deleting:",
        isDeleting
      );
      return; // Prevent any duplicate calls
    }

    try {
      setIsLoading(true);
      setIsDeleting(true); // Mark as currently deleting

      console.log(
        "🗑️ [DELETE] Starting delete process for loan:",
        loan.id,
        loan.name
      );

      // Check if we have auth token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Make the API call first to ensure it exists
      const result = await apiClient.delete(`/api/loans/${loan.id}`);
      console.log("✅ [DELETE] API call successful for loan:", loan.id, result);

      // Only mark as deleted after successful API call
      setIsDeleted(true);

      // Optimistically remove from cache after successful deletion
      queryClient.setQueryData(["/api/loans"], (oldData: any) => {
        if (Array.isArray(oldData)) {
          console.log("📦 [DELETE] Removing loan from cache:", loan.id);
          return oldData.filter((l: any) => l.id !== loan.id);
        }
        return oldData;
      });

      // Invalidate queries to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      await queryClient.invalidateQueries({
        queryKey: ["/api/analytics/overview"],
      });

      toast({
        title: "Loan Deleted",
        description: `${loan.name} has been permanently deleted.`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("❌ [DELETE] Error deleting loan", loan.id, ":", error);

      // Only reset states if the error is not a 404 (already deleted)
      if (!error.message?.includes("404")) {
        setIsDeleted(false);
        setIsDeleting(false);

        // Restore the loan in cache if delete failed
        queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      } else {
        console.log("Loan already deleted (404), keeping deleted state");
      }

      let errorMessage = "Failed to delete loan. Please try again.";

      if (error.message?.includes("404")) {
        errorMessage = "Loan not found. It may have already been deleted.";
        // Keep as deleted if it's already gone
      } else if (error.message?.includes("403")) {
        errorMessage = "You are not authorized to delete this loan.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      // Don't reset isDeleting here - it should stay true once deletion starts
    }
  };

  const getInterestRateColor = (rate: number) => {
    if (rate >= 25) return "danger";
    if (rate >= 15) return "warning";
    return "success";
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case "danger":
        return {
          dot: "bg-red-600",
          badge: "bg-red-100 text-red-600",
          progress: "bg-red-600",
        };
      case "warning":
        return {
          dot: "bg-orange-500",
          badge: "bg-orange-100 text-orange-600",
          progress: "bg-orange-500",
        };
      case "success":
        return {
          dot: "bg-green-600",
          badge: "bg-green-100 text-green-600",
          progress: "bg-green-600",
        };
      default:
        return {
          dot: "bg-gray-600",
          badge: "bg-gray-100 text-gray-600",
          progress: "bg-gray-600",
        };
    }
  };

  const colorType = getInterestRateColor(interestRate);
  const colors = getColorClasses(colorType);

  // Don't render the card if it's been deleted
  if (isDeleted) {
    return null;
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${colors.dot} rounded-full`}></div>
          <h4 className="font-semibold text-gray-900">{loan.name}</h4>
          <span
            className={`${colors.badge} text-xs font-medium px-2 py-1 rounded-full`}
          >
            {interestRate}%
          </span>
          {outstanding === 0 && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              CLOSED
            </span>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              console.log(
                "🎛️ [MENU] Toggle clicked, current state:",
                isMenuOpen
              );
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={isLoading || isDeleting || isDeleted}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-20 animate-in fade-in-0 zoom-in-95">
              <div className="py-2">
                <button
                  onClick={() => handleMenuAction("history")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  View Payment History
                </button>
                <button
                  onClick={() => handleMenuAction("payoff")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate Payoff
                </button>
                <button
                  onClick={() => handleMenuAction("edit")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Loan Details
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleMenuAction("close")}
                  className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
                  disabled={
                    isLoading || isDeleting || isDeleted || outstanding === 0
                  }
                >
                  <XCircle className="w-4 h-4" />
                  {outstanding === 0 ? "Already Closed" : "Mark as Closed"}
                </button>
                <button
                  onClick={() => handleMenuAction("delete")}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  disabled={isLoading || isDeleting || isDeleted}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Loan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Outstanding</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(outstanding)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">EMI</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(emiAmount)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Tenure Left</p>
          <p className="font-semibold text-gray-900">
            {loan.remainingMonths} months
          </p>
        </div>
        <div>
          <p className="text-gray-600">Next Due</p>
          <p className="font-semibold text-gray-900">
            {(() => {
              try {
                const dueDate = loan.nextDueDate
                  ? new Date(loan.nextDueDate)
                  : new Date();
                return isNaN(dueDate.getTime())
                  ? "Not set"
                  : format(dueDate, "dd MMM yyyy");
              } catch (error) {
                return "Not set";
              }
            })()}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${colors.progress} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
        {/* Show completion status for fully paid loans */}
        {outstanding === 0 && (
          <div className="text-xs text-green-600 font-medium mt-1">
            ✅ Loan Fully Paid
          </div>
        )}
      </div>

      {/* Close Loan Confirmation Dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark "{loan.name}" as closed? This will
              set the outstanding amount to ₹0 and remaining months to 0. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseLoan}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "Closing..." : "Close Loan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Loan Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{loan.name}"? This
              will remove all loan data and payment history. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLoan}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Loan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

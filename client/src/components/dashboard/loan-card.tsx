import { MoreHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";

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
  const interestRate = parseFloat(loan.interestRate);
  const outstanding = parseFloat(loan.outstandingAmount);
  const original = parseFloat(loan.originalAmount);
  const progressPercent = ((original - outstanding) / original) * 100;

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

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${colors.dot} rounded-full`}></div>
          <h4 className="font-semibold text-gray-900">{loan.name}</h4>
          <span className={`${colors.badge} text-xs font-medium px-2 py-1 rounded-full`}>
            {interestRate}%
          </span>
        </div>
        <div className="relative group">
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                View Payment History
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Calculate Payoff
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Edit Loan Details
              </button>
              <hr className="my-1" />
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                Mark as Closed
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Outstanding</p>
          <p className="font-semibold text-gray-900">{formatCurrency(outstanding)}</p>
        </div>
        <div>
          <p className="text-gray-600">EMI</p>
          <p className="font-semibold text-gray-900">{formatCurrency(parseFloat(loan.emiAmount))}</p>
        </div>
        <div>
          <p className="text-gray-600">Tenure Left</p>
          <p className="font-semibold text-gray-900">{loan.remainingMonths} months</p>
        </div>
        <div>
          <p className="text-gray-600">Next Due</p>
          <p className="font-semibold text-gray-900">
            {format(new Date(loan.nextDueDate), "dd MMM yyyy")}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${colors.progress} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

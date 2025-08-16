import { CreditCard, Calendar, Percent, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface OverviewCardsProps {
  analytics?: {
    totalDebt: number;
    totalEMI: number;
    salary: number;
    emiRatio: number;
    availableIncome: number;
    basicExpenses?: {
      housing: number;
      food: number;
      transportation: number;
      healthcare: number;
      utilities: number;
      total: number;
    };
  };
  isLoading: boolean;
}

export function OverviewCards({ analytics, isLoading }: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const cards: Array<{
    title: string;
    value: string;
    subtitle?: string;
    icon: any;
    color: string;
  }> = [
    {
      title: "Total Outstanding",
      value: formatCurrency(analytics.totalDebt),
      icon: CreditCard,
      color: "red",
    },
    {
      title: "Monthly EMI",
      value: formatCurrency(analytics.totalEMI),
      icon: Calendar,
      color: "blue",
    },
    {
      title: "EMI/Salary Ratio",
      value: `${(analytics.emiRatio || 0).toFixed(1)}%`,
      icon: Percent,
      color:
        (analytics.emiRatio || 0) > 50
          ? "red"
          : (analytics.emiRatio || 0) > 30
          ? "orange"
          : "green",
    },
    {
      title: "Available Income",
      value: formatCurrency(analytics.availableIncome || 0),
      subtitle: analytics.basicExpenses
        ? `(After EMI + ₹${(
            analytics.basicExpenses.total || 0
          ).toLocaleString()} basic needs)`
        : "(After EMI & basic expenses)",
      icon: Wallet,
      color:
        analytics.availableIncome < 0
          ? "red"
          : analytics.availableIncome < 5000
          ? "orange"
          : "green",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
          value: "text-red-600",
        };
      case "blue":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          value: "text-gray-900",
        };
      case "orange":
        return {
          bg: "bg-orange-50",
          text: "text-orange-600",
          value: "text-orange-600",
        };
      case "green":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          value: "text-green-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          value: "text-gray-900",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 mb-1">{card.subtitle}</p>
                )}
                <p className={`text-2xl font-bold ${colors.value}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 ${colors.bg} rounded-lg`}>
                <Icon className={`${colors.text} text-xl w-6 h-6`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

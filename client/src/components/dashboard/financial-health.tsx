interface FinancialHealthProps {
  analytics?: {
    totalDebt: number;
    totalEMI: number;
    salary: number;
    emiRatio: number;
    availableIncome: number;
  };
}

export function FinancialHealth({ analytics }: FinancialHealthProps) {
  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-full w-24 mx-auto mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate health score based on debt-to-income ratio and other factors
  const calculateHealthScore = () => {
    let score = 100;
    
    // Penalize high debt-to-income ratio
    if (analytics.emiRatio > 100) score -= 50;
    else if (analytics.emiRatio > 60) score -= 30;
    else if (analytics.emiRatio > 40) score -= 15;
    
    // Penalize negative available income
    if (analytics.availableIncome < 0) score -= 25;
    
    return Math.max(score, 0);
  };

  const healthScore = calculateHealthScore();
  const strokeDasharray = `${healthScore}, 100`;

  const getHealthStatus = () => {
    if (healthScore >= 80) return { status: "Excellent", color: "text-green-600" };
    if (healthScore >= 60) return { status: "Good", color: "text-blue-600" };
    if (healthScore >= 40) return { status: "Fair", color: "text-orange-600" };
    return { status: "Poor", color: "text-red-600" };
  };

  const { status, color } = getHealthStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke="#E5E7EB" 
              strokeWidth="2"
            />
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              fill="none" 
              stroke={healthScore >= 60 ? "#059669" : healthScore >= 40 ? "#D97706" : "#DC2626"} 
              strokeWidth="2" 
              strokeDasharray={strokeDasharray}
            />
          </svg>
          <span className={`absolute text-xl font-bold ${color}`}>{healthScore}</span>
        </div>
        <p className={`text-sm ${color} mb-2`}>{status}</p>
        <p className="text-xs text-gray-500">
          {analytics.emiRatio > 100 ? "High debt-to-income ratio" : "Debt management"}
        </p>
      </div>
      
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Debt-to-Income</span>
          <span className={`font-medium ${analytics.emiRatio > 100 ? "text-red-600" : analytics.emiRatio > 60 ? "text-orange-600" : "text-green-600"}`}>
            {analytics.emiRatio.toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available Income</span>
          <span className={`font-medium ${analytics.availableIncome < 0 ? "text-red-600" : "text-green-600"}`}>
            {analytics.availableIncome < 0 ? "Deficit" : "Positive"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Status</span>
          <span className="font-medium text-green-600">On-time</span>
        </div>
      </div>
    </div>
  );
}

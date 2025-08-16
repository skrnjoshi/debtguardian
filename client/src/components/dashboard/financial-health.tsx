interface FinancialHealthProps {
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
}

export function FinancialHealth({ analytics }: FinancialHealthProps) {
  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Financial Health
        </h3>
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

  // Calculate health score based on comprehensive financial metrics
  const calculateHealthScore = () => {
    let score = 0;

    // 1. Debt-to-Income Ratio (40% of total score)
    let debtRatingScore = 0;
    if (analytics.emiRatio <= 10) debtRatingScore = 40; // Excellent: ≤10%
    else if (analytics.emiRatio <= 20)
      debtRatingScore = 35; // Very Good: 10-20%
    else if (analytics.emiRatio <= 28) debtRatingScore = 30; // Good: 20-28%
    else if (analytics.emiRatio <= 36) debtRatingScore = 25; // Fair: 28-36%
    else if (analytics.emiRatio <= 50) debtRatingScore = 15; // Poor: 36-50%
    else debtRatingScore = 0; // Very Poor: >50%

    // 2. Available Income After Essential Expenses (30% of total score)
    let liquidityScore = 0;
    const monthlyIncome = analytics.salary;
    const emergencyFundTarget = monthlyIncome * 0.5; // 50% of monthly income as target

    if (analytics.availableIncome >= emergencyFundTarget)
      liquidityScore = 30; // Excellent
    else if (analytics.availableIncome >= monthlyIncome * 0.3)
      liquidityScore = 25; // Very Good: 30%+
    else if (analytics.availableIncome >= monthlyIncome * 0.15)
      liquidityScore = 20; // Good: 15-30%
    else if (analytics.availableIncome >= monthlyIncome * 0.05)
      liquidityScore = 15; // Fair: 5-15%
    else if (analytics.availableIncome >= 0)
      liquidityScore = 10; // Poor: Breaking even
    else liquidityScore = 0; // Very Poor: Deficit

    // 3. Total Debt Burden Relative to Annual Income (20% of total score)
    let debtBurdenScore = 0;
    const annualIncome = analytics.salary * 12;
    const debtToAnnualIncome =
      annualIncome > 0 ? (analytics.totalDebt / annualIncome) * 100 : 0;

    if (debtToAnnualIncome <= 50)
      debtBurdenScore = 20; // Excellent: ≤50% of annual income
    else if (debtToAnnualIncome <= 100)
      debtBurdenScore = 17; // Very Good: 50-100%
    else if (debtToAnnualIncome <= 200) debtBurdenScore = 14; // Good: 100-200%
    else if (debtToAnnualIncome <= 300) debtBurdenScore = 10; // Fair: 200-300%
    else if (debtToAnnualIncome <= 400) debtBurdenScore = 5; // Poor: 300-400%
    else debtBurdenScore = 0; // Very Poor: >400%

    // 4. Financial Stability Indicator (10% of total score)
    let stabilityScore = 0;
    const basicExpenses =
      analytics.basicExpenses?.total || analytics.salary * 0.25;
    const essentialRatio =
      (analytics.totalEMI + basicExpenses) / analytics.salary;

    if (essentialRatio <= 0.6)
      stabilityScore = 10; // Excellent: ≤60% for essentials
    else if (essentialRatio <= 0.75) stabilityScore = 8; // Good: 60-75%
    else if (essentialRatio <= 0.9) stabilityScore = 5; // Fair: 75-90%
    else if (essentialRatio <= 1.0) stabilityScore = 2; // Poor: 90-100%
    else stabilityScore = 0; // Very Poor: >100%

    // Calculate final score
    score = debtRatingScore + liquidityScore + debtBurdenScore + stabilityScore;

    // Apply bonus for exceptional financial discipline
    if (
      analytics.emiRatio <= 15 &&
      analytics.availableIncome > monthlyIncome * 0.4 &&
      debtToAnnualIncome <= 25
    ) {
      score = Math.min(score + 5, 100); // Bonus capped to ensure max 100
    }

    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const healthScore = calculateHealthScore();
  const strokeDasharray = `${healthScore}, 100`;

  const getHealthStatus = () => {
    if (healthScore >= 90)
      return { status: "Exceptional", color: "text-green-700" };
    if (healthScore >= 80)
      return { status: "Excellent", color: "text-green-600" };
    if (healthScore >= 70)
      return { status: "Very Good", color: "text-green-500" };
    if (healthScore >= 60) return { status: "Good", color: "text-blue-600" };
    if (healthScore >= 50) return { status: "Fair", color: "text-yellow-600" };
    if (healthScore >= 30) return { status: "Poor", color: "text-orange-600" };
    return { status: "Critical", color: "text-red-600" };
  };

  const { status, color } = getHealthStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Financial Health
      </h3>
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
              stroke={
                healthScore >= 80
                  ? "#047857" // Green-700 for Excellent/Exceptional
                  : healthScore >= 70
                  ? "#059669" // Green-600 for Very Good
                  : healthScore >= 60
                  ? "#2563EB" // Blue-600 for Good
                  : healthScore >= 50
                  ? "#D97706" // Amber-600 for Fair
                  : healthScore >= 30
                  ? "#EA580C" // Orange-600 for Poor
                  : "#DC2626" // Red-600 for Critical
              }
              strokeWidth="2"
              strokeDasharray={strokeDasharray}
            />
          </svg>
          <span className={`absolute text-xl font-bold ${color}`}>
            {healthScore}
          </span>
        </div>
        <p className={`text-sm ${color} mb-2`}>{status}</p>
        <p className="text-xs text-gray-500">
          {healthScore >= 90
            ? "Outstanding financial discipline"
            : healthScore >= 80
            ? "Excellent financial management"
            : healthScore >= 70
            ? "Very good debt control"
            : healthScore >= 60
            ? "Healthy debt management"
            : healthScore >= 50
            ? "Manageable debt levels"
            : healthScore >= 30
            ? "Consider debt reduction"
            : "Urgent financial attention needed"}
        </p>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Debt-to-Income</span>
          <span
            className={`font-medium ${
              analytics.emiRatio > 50
                ? "text-red-600"
                : analytics.emiRatio > 30
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {analytics.emiRatio.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Available Income</span>
          <span
            className={`font-medium ${
              analytics.availableIncome < 0
                ? "text-red-600"
                : analytics.availableIncome < 5000
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
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

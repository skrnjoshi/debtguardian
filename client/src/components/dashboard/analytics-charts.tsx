import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/currency";

interface AnalyticsChartsProps {
  loans: Array<{
    id: string;
    name: string;
    outstandingAmount: string;
    interestRate: string;
    emiAmount: string;
  }>;
  recentPayments: Array<{
    id: string;
    amount: string;
    paymentDate: string;
    paymentType: string;
  }>;
  isLoading: boolean;
}

export function AnalyticsCharts({ loans, recentPayments, isLoading }: AnalyticsChartsProps) {
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const pieData = loans.map((loan) => ({
    name: loan.name,
    value: parseFloat(loan.outstandingAmount),
    color: getColorByInterestRate(parseFloat(loan.interestRate)),
  }));

  const interestData = loans.map((loan) => {
    const outstanding = parseFloat(loan.outstandingAmount);
    const rate = parseFloat(loan.interestRate);
    const monthlyInterest = (outstanding * rate) / (12 * 100);
    
    return {
      name: loan.name.length > 10 ? loan.name.substring(0, 10) + '...' : loan.name,
      interest: Math.round(monthlyInterest),
      color: getColorByInterestRate(rate),
    };
  });

  function getColorByInterestRate(rate: number) {
    if (rate >= 25) return "#DC2626"; // red-600
    if (rate >= 15) return "#D97706"; // orange-600
    return "#059669"; // green-600
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            {payload[0].dataKey === 'value' ? 'Outstanding: ' : 'Monthly Interest: '}
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Loan Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Distribution by Outstanding Amount</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interest Cost Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Interest Cost Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={interestData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="interest" 
                radius={[4, 4, 0, 0]}
                fill={(entry: any) => entry.color}
              >
                {interestData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

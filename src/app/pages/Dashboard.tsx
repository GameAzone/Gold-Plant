import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useApp } from "../context/AppContext";
import { TrendingUp, TrendingDown, Wallet, Scale, Award } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const { balance, holdings, goldPrice, silverPrice, transactions, accumulationPoints } = useApp();

  const totalGoldValue = holdings.gold * goldPrice;
  const totalSilverValue = holdings.silver * silverPrice;
  const totalPortfolioValue = totalGoldValue + totalSilverValue;
  const totalAssets = balance + totalPortfolioValue;

  // Mock price history data
  const priceHistory = [
    { date: "Feb 18", gold: 2038, silver: 23.8 },
    { date: "Feb 19", gold: 2042, silver: 24.0 },
    { date: "Feb 20", gold: 2040, silver: 24.1 },
    { date: "Feb 21", gold: 2043, silver: 24.2 },
    { date: "Feb 22", gold: 2044, silver: 24.3 },
    { date: "Feb 23", gold: 2046, silver: 24.4 },
    { date: "Feb 24", gold: 2045.5, silver: 24.35 },
  ];

  // Portfolio allocation data
  const allocationData = [
    { name: "Cash", value: balance },
    { name: "Gold", value: totalGoldValue },
    { name: "Silver", value: totalSilverValue },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#94a3b8"];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Portfolio Dashboard</h2>
        <p className="text-sm md:text-base text-slate-600">Track your precious metals investments and performance</p>
      </div>

      {/* Portfolio Summary */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                RM{totalAssets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" />
                +2.4% this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Cash Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                RM{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                <Wallet className="w-3 h-3" />
                Available for trading
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Gold Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {holdings.gold} g
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Value: RM{totalGoldValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Silver Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-600">
                {holdings.silver} g
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Value: RM{totalSilverValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Price Trends (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis yAxisId="gold" orientation="left" stroke="#f59e0b" />
                <YAxis yAxisId="silver" orientation="right" stroke="#94a3b8" />
                <Tooltip />
                <Line
                  yAxisId="gold"
                  type="monotone"
                  dataKey="gold"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Gold (RM/g)"
                />
                <Line
                  yAxisId="silver"
                  type="monotone"
                  dataKey="silver"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  name="Silver (RM/g)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `RM${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Current Prices */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600">Gold</div>
                <div className="text-2xl font-bold text-slate-900">
                  RM{goldPrice.toFixed(2)}
                </div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.25% today
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600">Silver</div>
                <div className="text-2xl font-bold text-slate-900">
                  RM{silverPrice.toFixed(2)}
                </div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.62% today
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "buy"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "buy" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.amount} g{" "}
                      {transaction.metal.charAt(0).toUpperCase() + transaction.metal.slice(1)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {transaction.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">
                    RM{transaction.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">
                    @RM{transaction.pricePerUnit.toFixed(2)}/g
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accumulation Points */}
      <Card>
        <CardHeader>
          <CardTitle>Accumulation Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600">Gold Points</div>
                <div className="text-2xl font-bold text-slate-900">
                  {accumulationPoints.gold}
                </div>
                <div className="text-xs text-slate-500">1 pt per RM10 spent</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-600">Silver Points</div>
                <div className="text-2xl font-bold text-slate-900">
                  {accumulationPoints.silver}
                </div>
                <div className="text-xs text-slate-500">1 pt per RM10 spent</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
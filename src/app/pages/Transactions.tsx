import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useApp } from "../context/AppContext";
import { TrendingUp, TrendingDown, Search, Filter } from "lucide-react";
import { Input } from "../components/ui/input";

export default function Transactions() {
  const { transactions } = useApp();
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all");
  const [filterMetal, setFilterMetal] = useState<"all" | "gold" | "silver">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const totalBuy = transactions
    .filter((t) => t.type === "buy")
    .reduce((sum, t) => sum + t.total, 0);

  const totalSell = transactions
    .filter((t) => t.type === "sell")
    .reduce((sum, t) => sum + t.total, 0);

  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = filterType === "all" || transaction.type === filterType;
    const metalMatch = filterMetal === "all" || transaction.metal === filterMetal;
    const searchMatch = searchTerm === "" || 
      transaction.metal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && metalMatch && searchMatch;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Transaction History</h2>
        <p className="text-sm md:text-base text-slate-600">View all your trading activities and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {transactions.length}
            </div>
            <p className="text-xs text-slate-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              RM{totalBuy.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {transactions.filter((t) => t.type === "buy").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              RM{totalSell.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {transactions.filter((t) => t.type === "sell").length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="h-10 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy Only</option>
              <option value="sell">Sell Only</option>
            </select>

            <select
              value={filterMetal}
              onChange={(e) => setFilterMetal(e.target.value as any)}
              className="h-10 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
            >
              <option value="all">All Metals</option>
              <option value="gold">Gold Only</option>
              <option value="silver">Silver Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    transaction.type === "buy"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "buy"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {transaction.type === "buy" ? (
                        <TrendingUp className="w-6 h-6 text-white" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {transaction.type === "buy" ? "Bought" : "Sold"}{" "}
                        {transaction.metal.charAt(0).toUpperCase() +
                          transaction.metal.slice(1)}
                      </div>
                      <div className="text-sm text-slate-600">
                        {transaction.amount} g @ RM
                        {transaction.pricePerUnit.toFixed(2)}/oz
                      </div>
                      <div className="text-xs text-slate-500">
                        {transaction.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        transaction.type === "buy"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {transaction.type === "buy" ? "-" : "+"}RM
                      {transaction.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Transaction ID: {transaction.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
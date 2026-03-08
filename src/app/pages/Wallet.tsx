import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";
import { Wallet as WalletIcon, Plus, Minus, CreditCard, DollarSign, Award } from "lucide-react";
import { toast } from "sonner";

export default function Wallet() {
  const { balance, holdings, goldPrice, silverPrice, updateBalance, accumulationPoints } = useApp();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const totalGoldValue = holdings.gold * goldPrice;
  const totalSilverValue = holdings.silver * silverPrice;
  const totalPortfolioValue = totalGoldValue + totalSilverValue;

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    updateBalance(amount);
    setDepositAmount("");
    toast.success(`Successfully deposited $${amount.toFixed(2)}`);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    updateBalance(-amount);
    setWithdrawAmount("");
    toast.success(`Successfully withdrew $${amount.toFixed(2)}`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Digital Wallet</h2>
        <p className="text-sm md:text-base text-slate-600">Manage your funds and precious metals holdings</p>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <WalletIcon className="w-4 h-4" />
              Cash Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              RM{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600 mt-1">Available for trading</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              RM{totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600 mt-1">Gold & Silver holdings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              RM{(balance + totalPortfolioValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600 mt-1">Combined value</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {(accumulationPoints.gold + accumulationPoints.silver).toLocaleString("en-US")}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Gold: {accumulationPoints.gold} | Silver: {accumulationPoints.silver}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deposit & Withdraw */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Deposit Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (RM)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="Enter amount to deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <select
                id="payment-method"
                className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
              >
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Wire Transfer</option>
              </select>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleDeposit}
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit Funds
            </Button>
            <p className="text-xs text-slate-500">
              * Deposits typically take 1-3 business days to process
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-600" />
              Withdraw Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (RM)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Enter amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                max={balance}
                step="0.01"
              />
              <p className="text-xs text-slate-500">
                Available: RM{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdrawal-method">Withdrawal Method</Label>
              <select
                id="withdrawal-method"
                className="w-full h-10 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
              >
                <option>Bank Transfer</option>
                <option>Wire Transfer</option>
                <option>Check</option>
              </select>
            </div>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handleWithdraw}
            >
              <Minus className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
            <p className="text-xs text-slate-500">
              * Withdrawals typically take 3-5 business days to process
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Gold */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">Au</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Gold</div>
                  <div className="text-sm text-slate-600">{holdings.gold} g</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">
                  RM{totalGoldValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-slate-600">
                  @ RM{goldPrice.toFixed(2)}/g
                </div>
              </div>
            </div>

            {/* Silver */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">Ag</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Silver</div>
                  <div className="text-sm text-slate-600">{holdings.silver} g</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">
                  RM{totalSilverValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-slate-600">
                  @ RM{silverPrice.toFixed(2)}/g
                </div>
              </div>
            </div>

            {/* Cash */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Cash</div>
                  <div className="text-sm text-slate-600">MYR</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">
                  RM{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-slate-600">Available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
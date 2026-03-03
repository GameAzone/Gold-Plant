import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useApp, RedemptionProduct } from "../context/AppContext";
import { Scale, TrendingUp, Award, Gift, Package } from "lucide-react";
import { toast } from "sonner";

// Redemption products
const redemptionProducts: RedemptionProduct[] = [
  {
    id: "r1",
    name: "100g Gold Bullion Bar",
    weightGrams: 100,
    metal: "gold",
    pointsRequired: 100,
    image: "https://images.unsplash.com/photo-1762463176312-1757d5125c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFyJTIwYnVsbGlvbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzE3OTEzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium 100g gold bar with 99.99% purity. Certified and individually serialized.",
  },
  {
    id: "r2",
    name: "250g Gold Bullion Bar",
    weightGrams: 250,
    metal: "gold",
    pointsRequired: 250,
    image: "https://images.unsplash.com/photo-1762463176319-8416bf1e6a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwaW5nb3R8ZW58MXx8fHwxNzcxODMxMDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium 250g gold bar with 99.99% purity. Perfect for serious investors.",
  },
  {
    id: "r3",
    name: "500g Gold Bullion Bar",
    weightGrams: 500,
    metal: "gold",
    pointsRequired: 500,
    image: "https://images.unsplash.com/photo-1762463176312-1757d5125c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFyJTIwYnVsbGlvbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzE3OTEzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium 500g gold bar with 99.99% purity. Large format for substantial holdings.",
  },
  {
    id: "r4",
    name: "100g Silver Bullion Bar",
    weightGrams: 100,
    metal: "silver",
    pointsRequired: 100,
    image: "https://images.unsplash.com/photo-1641324113963-073b4b8dc86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBiYXIlMjBidWxsaW9ufGVufDF8fHx8MTc3MTgzMTAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium 100g silver bar with 99.9% purity. Certified and sealed.",
  },
  {
    id: "r5",
    name: "250g Silver Bullion Bar",
    weightGrams: 250,
    metal: "silver",
    pointsRequired: 250,
    image: "https://images.unsplash.com/photo-1641324113963-073b4b8dc86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBiYXIlMjBidWxsaW9ufGVufDF8fHx8MTc3MTgzMTAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium 250g silver bar with 99.9% purity. Ideal for portfolio diversification.",
  },
];

export default function Trade() {
  const { balance, holdings, accumulationPoints, goldPrice, silverPrice, addTransaction, addPhysicalOrder } = useApp();
  const [goldAmount, setGoldAmount] = useState("");
  const [silverAmount, setSilverAmount] = useState("");

  const gramsPerOz = 31.1035;

  const handleTrade = (type: "buy" | "sell", metal: "gold" | "silver") => {
    const amount = parseFloat(metal === "gold" ? goldAmount : silverAmount);
    const price = metal === "gold" ? goldPrice : silverPrice;

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (type === "sell" && amount > holdings[metal]) {
      toast.error(`Insufficient ${metal} holdings`);
      return;
    }

    const total = amount * price;

    if (type === "buy" && total > balance) {
      toast.error("Insufficient balance");
      return;
    }

    addTransaction({
      type,
      metal,
      amount,
      pricePerUnit: price,
      total,
    });

    if (metal === "gold") {
      setGoldAmount("");
    } else {
      setSilverAmount("");
    }

    const pointsEarned = type === "buy" ? Math.floor(amount * gramsPerOz) : 0;
    
    toast.success(
      `Successfully ${type === "buy" ? "bought" : "sold"} ${amount} g of ${metal}!${
        pointsEarned > 0 ? ` Earned ${pointsEarned} GSAP!` : ""
      }`
    );
  };

  const handleRedemption = (product: RedemptionProduct) => {
    const metal = product.metal;
    const pointsRequired = product.pointsRequired;

    if (accumulationPoints[metal] < pointsRequired) {
      toast.error(`Insufficient ${metal} GSAP. You need ${pointsRequired} points but have ${accumulationPoints[metal]}.`);
      return;
    }

    // Create a physical order with GSAP payment
    addPhysicalOrder({
      product: {
        id: product.id,
        name: product.name,
        category: "latest",
        price: 0, // Free with GSAP
        image: product.image,
        weight: `${product.weightGrams}g`,
        purity: metal === "gold" ? "99.99%" : "99.9%",
        description: product.description,
      },
      quantity: 1,
      total: 0,
      paymentType: "gsap",
      gsapUsed: pointsRequired,
      status: "pending",
    });

    toast.success(`Successfully redeemed ${pointsRequired} ${metal} GSAP for ${product.name}!`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Trade Precious Metals</h2>
        <p className="text-sm md:text-base text-slate-600">Buy and sell gold and silver at current market prices</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-slate-600 mb-1">Available Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900">
                RM{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex gap-4 md:gap-6">
              <div>
                <p className="text-[10px] md:text-xs text-slate-600">Gold Holdings</p>
                <p className="text-lg md:text-xl font-bold text-amber-600">{holdings.gold} g</p>
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-600">Silver Holdings</p>
                <p className="text-lg md:text-xl font-bold text-slate-600">{holdings.silver} g</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accumulation Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Award className="w-4 md:w-5 h-4 md:h-5" />
                  <p className="text-xs md:text-sm font-medium opacity-90">Gold GSAP</p>
                </div>
                <p className="text-3xl md:text-4xl font-bold">{accumulationPoints.gold}</p>
                <p className="text-[10px] md:text-xs opacity-75 mt-1">1 point = 1g of gold purchased</p>
              </div>
              <Award className="w-12 md:w-16 h-12 md:h-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-500 to-slate-600 text-white border-0">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <Award className="w-4 md:w-5 h-4 md:h-5" />
                  <p className="text-xs md:text-sm font-medium opacity-90">Silver GSAP</p>
                </div>
                <p className="text-3xl md:text-4xl font-bold">{accumulationPoints.silver}</p>
                <p className="text-[10px] md:text-xs opacity-75 mt-1">1 point = 1g of silver purchased</p>
              </div>
              <Award className="w-12 md:w-16 h-12 md:h-16 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Gold Trading */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                Gold Trading
              </CardTitle>
              <div className="text-right">
                <div className="text-sm text-slate-600">Current Price</div>
                <div className="text-xl font-bold text-slate-900">RM{goldPrice.toFixed(2)}/g</div>
                <div className="text-xs text-green-600 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3" />
                  +0.25%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gold-buy-amount">Amount (g)</Label>
                  <Input
                    id="gold-buy-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={goldAmount}
                    onChange={(e) => setGoldAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                {goldAmount && parseFloat(goldAmount) > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Cost:</span>
                      <span className="font-bold text-slate-900">
                        RM{(parseFloat(goldAmount) * goldPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-amber-600 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        GSAP to Earn:
                      </span>
                      <span className="font-bold text-amber-600">
                        {Math.floor(parseFloat(goldAmount) * gramsPerOz)} pts
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleTrade("buy", "gold")}
                >
                  Buy Gold
                </Button>
              </TabsContent>
              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gold-sell-amount">Amount (g)</Label>
                  <Input
                    id="gold-sell-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={goldAmount}
                    onChange={(e) => setGoldAmount(e.target.value)}
                    min="0"
                    max={holdings.gold}
                    step="0.01"
                  />
                  <p className="text-xs text-slate-500">
                    Available: {holdings.gold} g
                  </p>
                </div>
                {goldAmount && parseFloat(goldAmount) > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">You'll Receive:</span>
                      <span className="font-bold text-slate-900">
                        RM{(parseFloat(goldAmount) * goldPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => handleTrade("sell", "gold")}
                >
                  Sell Gold
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Silver Trading */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                Silver Trading
              </CardTitle>
              <div className="text-right">
                <div className="text-sm text-slate-600">Current Price</div>
                <div className="text-xl font-bold text-slate-900">RM{silverPrice.toFixed(2)}/g</div>
                <div className="text-xs text-green-600 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3" />
                  +0.62%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="silver-buy-amount">Amount (g)</Label>
                  <Input
                    id="silver-buy-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={silverAmount}
                    onChange={(e) => setSilverAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                {silverAmount && parseFloat(silverAmount) > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Cost:</span>
                      <span className="font-bold text-slate-900">
                        RM{(parseFloat(silverAmount) * silverPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        GSAP to Earn:
                      </span>
                      <span className="font-bold text-slate-600">
                        {Math.floor(parseFloat(silverAmount) * gramsPerOz)} pts
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleTrade("buy", "silver")}
                >
                  Buy Silver
                </Button>
              </TabsContent>
              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="silver-sell-amount">Amount (g)</Label>
                  <Input
                    id="silver-sell-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={silverAmount}
                    onChange={(e) => setSilverAmount(e.target.value)}
                    min="0"
                    max={holdings.silver}
                    step="0.01"
                  />
                  <p className="text-xs text-slate-500">
                    Available: {holdings.silver} g
                  </p>
                </div>
                {silverAmount && parseFloat(silverAmount) > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">You'll Receive:</span>
                      <span className="font-bold text-slate-900">
                        RM{(parseFloat(silverAmount) * silverPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => handleTrade("sell", "silver")}
                >
                  Sell Silver
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Redemption Products */}
      <div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Redeem GSAP for Physical Bullion</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {redemptionProducts.map(product => (
            <Card key={product.id} className={`${
              product.metal === "gold" 
                ? "bg-gradient-to-br from-amber-500 to-amber-600" 
                : "bg-gradient-to-br from-slate-500 to-slate-600"
            } text-white border-0`}>
              <CardContent className="pt-4 md:pt-6 pb-3 md:pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4" />
                      <p className="text-xs md:text-sm font-medium opacity-90">{product.name}</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold mb-1">{product.pointsRequired} GSAP</p>
                    <p className="text-[10px] md:text-xs opacity-75 line-clamp-2">{product.description}</p>
                  </div>
                  <Award className="w-12 md:w-14 h-12 md:h-14 opacity-20 flex-shrink-0" />
                </div>
                <Button
                  className={`w-full ${
                    product.metal === "gold"
                      ? "bg-amber-700 hover:bg-amber-800"
                      : "bg-slate-700 hover:bg-slate-800"
                  } text-white text-sm`}
                  onClick={() => handleRedemption(product)}
                  disabled={accumulationPoints[product.metal] < product.pointsRequired}
                >
                  {accumulationPoints[product.metal] < product.pointsRequired 
                    ? `Need ${product.pointsRequired - accumulationPoints[product.metal]} more` 
                    : "Redeem Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Gift className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-purple-900 mb-1">GSAP Rewards Program</p>
              <p className="text-sm text-purple-800 mb-2">
                Earn Gold & Silver Accumulation Points (GSAP) with every purchase! 
                <strong> 1 GSAP = 1 gram of metal purchased.</strong>
              </p>
              <p className="text-sm text-purple-800">
                Redeem your GSAP for physical gold and silver bullion bars. Choose from 100g, 250g, or 500g bars 
                and receive certified, premium quality products delivered to your door.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}